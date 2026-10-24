#!/usr/bin/env node
/**
 * Quality-first JPEG/PNG -> WebP migration for a NestJS uploads directory.
 *
 * Guarantees/policy:
 * - Originals are never modified or deleted.
 * - Does not resize images; encoded dimensions are preserved (EXIF orientation
 *   is normalized by Sharp's rotate()).
 * - Lossy mode tries WebP quality from --quality down to --min-quality.
 * - A derivative is accepted only if it is <= --max-kb (decimal KB: 200 =
 *   200,000 bytes by default) AND smaller than the original file.
 * - If no attempt satisfies both requirements, no derivative is kept for that
 *   source. With --overwrite-webp, an older derivative is moved to a backup
 *   folder outside uploads so the existing middleware falls back to original.
 * - A dry run performs conversions for a report but does not write images,
 *   move backups, or replace files. It evaluates existing derivatives as if
 *   --overwrite-webp were enabled, so it previews a complete migration.
 * - Backup directories are created beside the supplied root directory. When
 *   --root uploads is used from backend/, the backup is outside public uploads.
 *
 * Suggested local test:
 *   node convert-uploads-to-webp-quality-95-to-90.mjs --root uploads --only about/example.png --dry-run
 *
 * Actual run:
 *   node convert-uploads-to-webp-quality-95-to-90.mjs --root uploads --max-kb 200 --quality 95 --min-quality 90 --concurrency 2 --overwrite-webp
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
    minQuality: 90,
    concurrency: 2,
    overwriteWebp: false,
    lossless: false,
    dryRun: false,
    only: null,
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
    else if (arg === '--dry-run') config.dryRun = true;
    else if (arg === '--only') config.only = argv[++i];
    else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node convert-uploads-to-webp-quality-95-to-90.mjs [options]

Options:
  --root <dir>          Source uploads folder (default: uploads)
  --only <relative>     Process one relative JPEG/PNG path for a focused test
  --max-kb <number>     Maximum output size in decimal KB; 200 = 200,000 bytes
  --quality <1-100>     First lossy quality to try (default: 95)
  --min-quality <1-100> Lowest lossy quality allowed (default: 90)
  --concurrency <n>     Parallel conversions, 1-8 (default: 2)
  --overwrite-webp      Replace previous WebP derivatives; back up old ones
  --dry-run             Report outcomes without changing image files
  --lossless            Use lossless WebP instead of lossy quality trials
  --help                Show this help

A WebP is retained only if it meets the size limit and is smaller than its
original. Images that cannot meet both conditions fall back to the original.
Original JPEG/PNG files and database paths are never modified.

For production, back up uploads first and run during a low-traffic period.`);
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
  if (config.lossless && config.quality !== 95) {
    // Quality flags do not affect lossless encoding; this is only informational.
  }
  if (config.only && path.isAbsolute(config.only)) throw new Error('--only must be a path relative to --root, not an absolute path.');

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
    const group = outputs.get(key) ?? [];
    group.push(image);
    outputs.set(key, group);
  }
  return [...outputs.values()].filter((group) => group.length > 1);
}

async function existsAsFile(filePath) {
  try {
    return (await fs.stat(filePath)).isFile();
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

async function writeTempFile(outputPath, buffer) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  const tempPath = `${outputPath}.tmp-${process.pid}-${randomUUID()}`;
  await fs.writeFile(tempPath, buffer, { flag: 'wx' });
  return tempPath;
}

async function restoreBackupIfNeeded(backupPath, outputPath) {
  if (!backupPath) return;
  try {
    if (!(await existsAsFile(outputPath)) && await existsAsFile(backupPath)) {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.rename(backupPath, outputPath);
    }
  } catch {
    // Keep the backup untouched if restore fails; the original JPEG/PNG remains.
  }
}

async function convertOne(image, options) {
  const record = {
    status: null,
    source: image.sourceRelativePath.split(path.sep).join('/'),
    webp: path.relative(options.root, image.webpPath).split(path.sep).join('/'),
    sourceBytes: null,
    webpBytes: null,
    attemptedWebpBytes: null,
    width: null,
    height: null,
    quality: null,
    reductionPercent: null,
    backupWebp: null,
    error: null,
  };

  try {
    const sourceStat = await fs.stat(image.sourcePath);
    record.sourceBytes = sourceStat.size;
    const webpExists = await existsAsFile(image.webpPath);

    if (webpExists && !options.overwriteWebp && !options.dryRun) {
      const existing = await fs.stat(image.webpPath);
      record.webpBytes = existing.size;
      record.status = 'SKIPPED_WEBP_EXISTS';
      record.error = 'Existing WebP left untouched. Use --overwrite-webp to re-evaluate it.';
      return record;
    }

    const metadata = await sharp(image.sourcePath).metadata();
    if ((metadata.pages ?? 1) > 1) {
      record.status = 'SKIPPED_ANIMATED';
      record.error = 'Animated/multi-page PNG skipped to avoid losing animation.';
      return record;
    }

    const maxBytes = Math.floor(options.maxKb * 1000); // decimal KB
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
          .rotate()
          .webp({
            quality,
            effort: 6,
            smartSubsample: true,
            alphaQuality: 100,
            exact: true,
          })
          .toBuffer({ resolveWithObject: true });

        attempts.push({ quality, result });
        if (result.data.length <= maxBytes && result.data.length < sourceStat.size) break;
      }
    }

    const chosen = attempts.find(({ result }) =>
      result.data.length <= maxBytes && result.data.length < sourceStat.size
    );
    const last = attempts[attempts.length - 1];

    if (!chosen) {
      if (options.overwriteWebp && webpExists && !options.dryRun) {
        record.backupWebp = await backupExistingWebp(image, options);
      }
      record.attemptedWebpBytes = last?.result.data.length ?? null;
      record.width = last?.result.info.width ?? null;
      record.height = last?.result.info.height ?? null;
      record.quality = options.lossless ? 'lossless' : options.minQuality;
      const anyWithinLimit = attempts.some(({ result }) => result.data.length <= maxBytes);
      record.status = options.dryRun
        ? (anyWithinLimit ? 'DRY_RUN_ORIGINAL_KEPT_NO_SAVINGS' : 'DRY_RUN_OVER_LIMIT_ORIGINAL_KEPT')
        : (anyWithinLimit ? 'ORIGINAL_KEPT_NO_SAVINGS' : 'OVER_LIMIT_ORIGINAL_KEPT');
      record.error = anyWithinLimit
        ? `No permitted output was both <= ${maxBytes} bytes and smaller than the source (${sourceStat.size} bytes). Original is retained.${record.backupWebp ? ' Previous WebP backed up.' : ''}`
        : `Output exceeded ${maxBytes} bytes at the allowed quality floor. Original is retained.${record.backupWebp ? ' Previous WebP backed up.' : ''}`;
      if (options.dryRun) record.error += ' Dry run: no files changed.';
      console.warn(`[${record.status}] ${record.source}`);
      return record;
    }

    record.attemptedWebpBytes = chosen.result.data.length;
    record.webpBytes = chosen.result.data.length;
    record.width = chosen.result.info.width;
    record.height = chosen.result.info.height;
    record.quality = chosen.quality;
    record.reductionPercent = sourceStat.size > 0
      ? Number(((1 - chosen.result.data.length / sourceStat.size) * 100).toFixed(2))
      : 0;

    if (options.dryRun) {
      record.status = 'DRY_RUN_SUCCESS';
      record.error = 'Would write this WebP; dry run did not change any image files.';
      console.log(`[DRY RUN SUCCESS] ${record.source} -> ${Math.ceil(record.webpBytes / 1024)} KiB (quality ${record.quality})`);
      return record;
    }

    // Write candidate to a temporary path before moving any existing derivative.
    const tempPath = await writeTempFile(image.webpPath, chosen.result.data);
    let backupAbsolutePath = null;
    try {
      if (options.overwriteWebp && webpExists) {
        const backupRelative = path.relative(options.root, image.webpPath);
        backupAbsolutePath = path.join(options.backupRoot, backupRelative);
        await fs.mkdir(path.dirname(backupAbsolutePath), { recursive: true });
        await fs.rename(image.webpPath, backupAbsolutePath);
        record.backupWebp = path.relative(process.cwd(), backupAbsolutePath).split(path.sep).join('/');
      }
      await fs.rename(tempPath, image.webpPath);
    } catch (error) {
      await fs.rm(tempPath, { force: true }).catch(() => {});
      await restoreBackupIfNeeded(backupAbsolutePath, image.webpPath);
      throw error;
    }

    record.status = 'SUCCESS';
    record.error = null;
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
  const label = `webp-quality-${options.quality}-to-${options.minQuality}`;
  const jsonPath = path.join(reportDirectory, `${label}-manifest.json`);
  const csvPath = path.join(reportDirectory, `${label}-report.csv`);
  const headers = [
    'status', 'source', 'webp', 'sourceBytes', 'webpBytes', 'attemptedWebpBytes',
    'width', 'height', 'quality', 'reductionPercent', 'backupWebp', 'error',
  ];
  const manifest = {
    generatedAt: new Date().toISOString(),
    uploadsRoot: rootDirectory,
    targetMaxBytes: Math.floor(options.maxKb * 1000),
    maxKbDefinition: 'Decimal KB: 1 KB = 1000 bytes',
    originalsModified: false,
    databaseUpdated: false,
    dryRun: options.dryRun,
    policy: options.lossless
      ? 'Lossless WebP; no resizing; output only accepted if within limit and smaller than source.'
      : `Quality-first lossy WebP; no resizing; try quality ${options.quality} down to ${options.minQuality}; output only accepted if within limit and smaller than source.`,
    backupRoot: options.dryRun ? null : options.backupRoot,
    note: 'Original JPEG/PNG files and database paths are never modified. If overwrite is enabled and a source cannot produce an acceptable derivative, an older .webp derivative is backed up so the middleware falls back to the original.',
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
    throw new Error(`Uploads directory does not exist: ${rootDirectory}\nRun from backend or pass --root with the correct directory.`);
  }

  let images = await collectImages(rootDirectory, rootDirectory);
  if (config.only) {
    const requested = config.only.replaceAll('\\', '/').replace(/^\.\//, '');
    images = images.filter((image) => image.sourceRelativePath.split(path.sep).join('/').toLowerCase() === requested.toLowerCase());
    if (images.length === 0) {
      throw new Error(`No JPEG/PNG matched --only "${config.only}" under ${rootDirectory}. Use a path relative to --root, e.g. about/image.png.`);
    }
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const options = {
    ...config,
    root: rootDirectory,
    backupRoot: path.join(path.dirname(rootDirectory), `${path.basename(rootDirectory)}-webp-backup-${timestamp}`),
  };

  console.log(`Uploads directory: ${rootDirectory}`);
  console.log(`Found ${images.length} JPEG/PNG file(s)${config.only ? ` matching --only ${config.only}` : ''}.`);
  console.log(`Policy: ${config.dryRun ? 'DRY RUN; no image files will be changed. ' : ''}${config.lossless ? 'lossless WebP' : `quality ${config.quality} down to ${config.minQuality}`}; no resizing; output <= ${Math.floor(config.maxKb * 1000)} bytes and smaller than original.`);
  if (config.overwriteWebp) console.log('Existing WebP derivatives will be replaced/backed up if needed.');
  else if (config.dryRun) console.log('Dry run previews re-generation, including paths that already have WebP derivatives.');
  else console.log('Existing WebP derivatives will be skipped unless --overwrite-webp is provided.');

  const collisions = uniqueOutputCollisions(images);
  const collided = new Set(collisions.flat().map((image) => path.resolve(image.sourcePath)));
  for (const group of collisions) {
    console.warn(`[COLLISION] Multiple sources map to one WebP output: ${group.map((image) => image.sourceRelativePath).join(', ')}`);
  }
  const work = images.map((image) => collided.has(path.resolve(image.sourcePath)) ? {
    collisionRecord: {
      status: 'OUTPUT_COLLISION', source: image.sourceRelativePath.split(path.sep).join('/'),
      webp: path.relative(rootDirectory, image.webpPath).split(path.sep).join('/'), sourceBytes: null,
      webpBytes: null, attemptedWebpBytes: null, width: null, height: null, quality: null,
      reductionPercent: null, backupWebp: null,
      error: 'Multiple JPEG/PNG files map to the same .webp output. No file changed; review these names manually.',
    },
  } : { image });

  const records = new Array(work.length);
  let cursor = 0;
  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= work.length) return;
      const item = work[index];
      records[index] = item.collisionRecord ?? await convertOne(item.image, options);
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
