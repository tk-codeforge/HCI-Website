#!/usr/bin/env node
/**
 * Quality-first JPEG/PNG -> WebP conversion for a NestJS uploads directory.
 *
 * Policy:
 * - Original JPEG/PNG files are never modified or deleted.
 * - Original pixel dimensions are preserved (EXIF orientation is normalized).
 * - In lossy mode, quality is tried from --quality down to --min-quality.
 * - A WebP derivative is written only if it is within --max-kb at the configured
 *   quality floor. It never reduces dimensions or drops quality below that floor
 *   just to meet the size limit.
 * - If the size target cannot be reached at the quality floor, no new WebP is
 *   served for that source; the original remains the fallback.
 * - With --overwrite-webp, existing sibling WebP derivatives are regenerated.
 *   If a high-quality output cannot meet the limit, the previous derivative is
 *   moved to a timestamped backup folder outside uploads so middleware falls
 *   back to the original instead of serving a previously over-compressed file.
 * - Optional --lossless uses lossless WebP encoding; this may exceed the size
 *   target, in which case the original is kept/served instead.
 *
 * Run from backend folder:
 *   npm install sharp
 *   node convert-uploads-to-webp-quality-first.mjs --root uploads --max-kb 200
 *
 * To regenerate the earlier low-quality WebP derivatives safely:
 *   node convert-uploads-to-webp-quality-first.mjs --root uploads --max-kb 200 --overwrite-webp
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';

function readArgs(argv) {
  const config = {
    root: 'uploads',
    maxKb: 200,
    quality: 95,
    minQuality: 92,
    concurrency: 3,
    overwriteWebp: false,
    lossless: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--root') config.root = argv[++i];
    else if (arg === '--max-kb') config.maxKb = Number(argv[++i]);
    else if (arg === '--quality') config.quality = Number(argv[++i]);
    else if (arg === '--min-quality') config.minQuality = Number(argv[++i]);
    else if (arg === '--concurrency') config.concurrency = Number(argv[++i]);
    else if (arg === '--overwrite-webp') config.overwriteWebp = true;
    else if (arg === '--lossless') config.lossless = true;
    else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node convert-uploads-to-webp-quality-first.mjs [options]\n\nOptions:\n  --root <dir>          Uploads folder, default: uploads\n  --max-kb <number>     Maximum output size in KiB, default: 200\n  --quality <1-100>     First lossy quality to try, default: 95\n  --min-quality <1-100> Lowest lossy quality allowed, default: 92\n  --concurrency <n>     Parallel conversions, default: 3\n  --overwrite-webp      Regenerate existing sibling .webp files\n  --lossless            Use lossless WebP (may not fit 200 KiB)\n  --help                Show this help\n\nQuality-first policy: no resizing; no output below the quality floor. If a file\ncannot fit the limit, the source remains unchanged and is used as fallback.\nOriginal files are never modified or deleted.`);
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (!config.root) throw new Error('--root must have a directory value.');
  if (!Number.isFinite(config.maxKb) || config.maxKb <= 0) throw new Error('--max-kb must be greater than 0.');
  if (!Number.isInteger(config.quality) || config.quality < 1 || config.quality > 100) throw new Error('--quality must be an integer from 1 to 100.');
  if (!Number.isInteger(config.minQuality) || config.minQuality < 1 || config.minQuality > config.quality) throw new Error('--min-quality must be an integer from 1 to --quality.');
  if (!Number.isInteger(config.concurrency) || config.concurrency < 1 || config.concurrency > 8) throw new Error('--concurrency must be an integer from 1 to 8.');

  return config;
}

async function collectImages(directory, rootDirectory) {
  const results = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) continue;

    if (entry.isDirectory()) {
      results.push(...await collectImages(fullPath, rootDirectory));
    } else if (entry.isFile() && /\.(jpe?g|png)$/i.test(entry.name)) {
      results.push({
        sourcePath: fullPath,
        sourceRelativePath: path.relative(rootDirectory, fullPath),
        webpPath: fullPath.replace(/\.(jpe?g|png)$/i, '.webp'),
      });
    }
  }
  return results;
}

function uniqueOutputCollisions(images) {
  const outputs = new Map();
  for (const image of images) {
    const key = process.platform === 'win32'
      ? path.resolve(image.webpPath).toLowerCase()
      : path.resolve(image.webpPath);
    const current = outputs.get(key) ?? [];
    current.push(image);
    outputs.set(key, current);
  }
  return [...outputs.values()].filter((group) => group.length > 1);
}

async function existsAsFile(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch (error) {
    if (error?.code === 'ENOENT' || error?.code === 'ENOTDIR') return false;
    throw error;
  }
}

async function backupExistingWebp(image, options) {
  if (!(await existsAsFile(image.webpPath))) return null;

  const relative = path.relative(options.root, image.webpPath);
  const backupPath = path.join(options.backupRoot, relative);
  await fs.mkdir(path.dirname(backupPath), { recursive: true });
  await fs.rename(image.webpPath, backupPath);
  return path.relative(process.cwd(), backupPath).split(path.sep).join('/');
}

async function writeOutputAtomically(outputPath, buffer) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  const tempPath = `${outputPath}.tmp-${process.pid}-${randomUUID()}`;
  try {
    await fs.writeFile(tempPath, buffer, { flag: 'wx' });
    await fs.rename(tempPath, outputPath);
  } catch (error) {
    await fs.rm(tempPath, { force: true }).catch(() => {});
    throw error;
  }
}

async function convertOne(image, options) {
  const record = {
    source: image.sourceRelativePath.split(path.sep).join('/'),
    webp: path.relative(options.root, image.webpPath).split(path.sep).join('/'),
    sourceBytes: null,
    webpBytes: null,
    attemptedWebpBytes: null,
    width: null,
    height: null,
    quality: null,
    reductionPercent: null,
    status: null,
    backupWebp: null,
    error: null,
  };

  try {
    const sourceStat = await fs.stat(image.sourcePath);
    record.sourceBytes = sourceStat.size;

    const webpExists = await existsAsFile(image.webpPath);
    if (webpExists && !options.overwriteWebp) {
      const existing = await fs.stat(image.webpPath);
      record.webpBytes = existing.size;
      record.status = 'SKIPPED_WEBP_EXISTS';
      record.error = 'Existing .webp left untouched. Use --overwrite-webp to regenerate it with the quality-first policy.';
      return record;
    }

    const metadata = await sharp(image.sourcePath).metadata();
    if ((metadata.pages ?? 1) > 1) {
      record.status = 'SKIPPED_ANIMATED';
      record.error = 'Animated/multi-page PNG skipped to avoid dropping animation.';
      return record;
    }

    const maxBytes = Math.floor(options.maxKb * 1024);
    const attempts = [];

    if (options.lossless) {
      const result = await sharp(image.sourcePath)
        .rotate()
        .webp({ lossless: true, effort: 6, exact: true, alphaQuality: 100 })
        .toBuffer({ resolveWithObject: true });
      attempts.push({ quality: 'lossless', result });
    } else {
      for (let quality = options.quality; quality >= options.minQuality; quality -= 1) {
        const result = await sharp(image.sourcePath)
          .rotate() // Normalize EXIF orientation, but do not resize pixels.
          .webp({
            quality,
            effort: 6,
            smartSubsample: true,
            alphaQuality: 100,
            exact: true,
          })
          .toBuffer({ resolveWithObject: true });

        attempts.push({ quality, result });
        if (result.data.length <= maxBytes) break;
      }
    }

    const chosen = attempts.find((attempt) => attempt.result.data.length <= maxBytes);

    if (!chosen) {
      // Do not emit a low-quality or downscaled derivative just to hit the limit.
      // On explicit overwrite, move the old derivative away so middleware falls
      // back to the original instead of continuing to serve an old low-quality file.
      if (options.overwriteWebp && webpExists) {
        record.backupWebp = await backupExistingWebp(image, options);
      }

      const last = attempts[attempts.length - 1]?.result;
      record.webpBytes = null;
      record.attemptedWebpBytes = last?.data.length ?? null;
      record.width = last?.info.width ?? null;
      record.height = last?.info.height ?? null;
      record.quality = options.lossless ? 'lossless' : options.minQuality;
      record.status = 'OVER_LIMIT_ORIGINAL_KEPT';
      record.error = `At the allowed quality${options.lossless ? ' (lossless)' : ` floor (${options.minQuality})`}, output exceeds ${options.maxKb} KiB. No new WebP was written; original will be served. ${record.backupWebp ? 'Previous WebP moved to backup.' : ''}`.trim();
      console.warn(`[OVER_LIMIT] ${record.source}: original kept${record.backupWebp ? '; old WebP backed up' : ''}`);
      return record;
    }

    if (options.overwriteWebp && webpExists) {
      record.backupWebp = await backupExistingWebp(image, options);
    }

    await writeOutputAtomically(image.webpPath, chosen.result.data);
    record.webpBytes = chosen.result.data.length;
    record.attemptedWebpBytes = chosen.result.data.length;
    record.width = chosen.result.info.width;
    record.height = chosen.result.info.height;
    record.quality = chosen.quality;
    record.reductionPercent = sourceStat.size > 0
      ? Number(((1 - chosen.result.data.length / sourceStat.size) * 100).toFixed(2))
      : 0;
    record.status = 'SUCCESS';
    console.log(`[SUCCESS] ${record.source} -> ${Math.ceil(record.webpBytes / 1024)} KiB (quality ${record.quality})`);
    return record;
  } catch (error) {
    record.status = 'ERROR';
    record.error = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] ${record.source}: ${record.error}`);
    return record;
  }
}

function csvCell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

async function writeReports(records, rootDirectory, options) {
  const reportDirectory = process.cwd();
  const jsonPath = path.join(reportDirectory, 'webp-quality-first-manifest.json');
  const csvPath = path.join(reportDirectory, 'webp-quality-first-report.csv');
  const headers = [
    'status', 'source', 'webp', 'sourceBytes', 'webpBytes', 'attemptedWebpBytes', 'width', 'height',
    'quality', 'reductionPercent', 'backupWebp', 'error',
  ];

  const manifest = {
    generatedAt: new Date().toISOString(),
    uploadsRoot: rootDirectory,
    targetMaxBytes: Math.floor(options.maxKb * 1024),
    originalsModified: false,
    databaseUpdated: false,
    policy: options.lossless
      ? 'Lossless WebP only; no resizing; output is written only when at or below the size limit.'
      : `Quality-first lossy WebP; no resizing; try quality ${options.quality} down to ${options.minQuality}; output is written only when at or below the size limit.`,
    backupRoot: options.backupRoot,
    note: 'When output cannot meet the limit without going below the configured quality floor, the original remains unchanged. If --overwrite-webp is used, an older sibling derivative is backed up so middleware falls back to the original.',
    records,
  };

  await fs.writeFile(jsonPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  const csv = [
    headers.map(csvCell).join(','),
    ...records.map((record) => headers.map((header) => csvCell(record[header])).join(',')),
  ].join('\n');
  await fs.writeFile(csvPath, `${csv}\n`, 'utf8');

  console.log(`\nManifest: ${jsonPath}`);
  console.log(`CSV report: ${csvPath}`);
}

async function main() {
  const config = readArgs(process.argv.slice(2));
  const rootDirectory = path.resolve(process.cwd(), config.root);
  const rootStat = await fs.stat(rootDirectory).catch(() => null);
  if (!rootStat?.isDirectory()) {
    throw new Error(`Uploads directory does not exist: ${rootDirectory}\nRun from your backend folder or pass the correct path using --root.`);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const options = {
    ...config,
    root: rootDirectory,
    backupRoot: path.join(path.dirname(rootDirectory), `${path.basename(rootDirectory)}-webp-backup-${timestamp}`),
  };

  const images = await collectImages(rootDirectory, rootDirectory);
  console.log(`Uploads directory: ${rootDirectory}`);
  console.log(`Found ${images.length} JPEG/PNG files. Original files and database paths will not be changed.`);
  console.log(config.lossless
    ? 'Mode: lossless WebP; files exceeding the limit will fall back to original.'
    : `Mode: quality-first; preserve dimensions, try quality ${config.quality} down to ${config.minQuality}; no downscaling.`);

  const collisions = uniqueOutputCollisions(images);
  const collided = new Set(collisions.flat().map((image) => path.resolve(image.sourcePath)));
  for (const group of collisions) {
    console.warn(`[COLLISION] Multiple source files map to the same .webp output: ${group.map((image) => image.sourceRelativePath).join(', ')}`);
  }

  const work = images.map((image) => {
    if (!collided.has(path.resolve(image.sourcePath))) return image;
    return {
      collisionRecord: {
        source: image.sourceRelativePath.split(path.sep).join('/'),
        webp: path.relative(rootDirectory, image.webpPath).split(path.sep).join('/'),
        sourceBytes: null,
        webpBytes: null,
        attemptedWebpBytes: null,
        width: null,
        height: null,
        quality: null,
        reductionPercent: null,
        status: 'OUTPUT_COLLISION',
        backupWebp: null,
        error: 'Another JPEG/PNG in this folder maps to the same WebP name. No file was changed; rename/review these files manually.',
      },
    };
  });

  const records = new Array(images.length);
  let cursor = 0;
  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= work.length) return;
      const item = work[index];
      records[index] = item.collisionRecord ?? await convertOne(item, options);
    }
  }

  await Promise.all(Array.from({ length: config.concurrency }, () => worker()));
  await writeReports(records, rootDirectory, options);

  const counts = records.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] ?? 0) + 1;
    return acc;
  }, {});

  console.log('\nFinished. Summary:');
  console.log(`Total scanned: ${records.length}`);
  for (const [status, count] of Object.entries(counts)) console.log(`${status}: ${count}`);
  console.log('\nOriginal images were never modified or deleted. No database paths were changed.');
}

main().catch((error) => {
  console.error(`\nMigration stopped: ${error.message}`);
  process.exitCode = 1;
});
