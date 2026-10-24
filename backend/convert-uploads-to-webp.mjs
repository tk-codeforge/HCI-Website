#!/usr/bin/env node
/**
 * Safe JPEG/PNG -> WebP migration for a NestJS backend uploads directory.
 *
 * - Keeps original files and their paths unchanged.
 * - Writes a sibling .webp file next to each .jpg/.jpeg/.png file.
 * - Tries to keep each generated WebP at or below MAX_KB (default 200 KiB).
 * - Does not process videos, GIFs, SVGs, or animated PNGs.
 * - Writes JSON manifest and CSV report in the current working directory.
 *
 * Run from the backend directory:
 *   npm install sharp
 *   node convert-uploads-to-webp.mjs --root uploads --max-kb 200
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

function readArgs(argv) {
  const config = {
    root: 'uploads',
    maxKb: 200,
    maxDimension: 2400,
    minDimension: 320,
    concurrency: 3,
    quality: 80,
    overwriteWebp: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--root') config.root = argv[++i];
    else if (arg === '--max-kb') config.maxKb = Number(argv[++i]);
    else if (arg === '--max-dimension') config.maxDimension = Number(argv[++i]);
    else if (arg === '--min-dimension') config.minDimension = Number(argv[++i]);
    else if (arg === '--concurrency') config.concurrency = Number(argv[++i]);
    else if (arg === '--overwrite-webp') config.overwriteWebp = true;
    else if (arg === '--help' || arg === '-h') {
      console.log(`Usage: node convert-uploads-to-webp.mjs [options]\n\nOptions:\n  --root <dir>             Uploads folder, default: uploads\n  --max-kb <number>        Maximum output size in KiB, default: 200\n  --max-dimension <px>     Maximum width/height bound, default: 2400\n  --min-dimension <px>     Smallest width/height bound, default: 320\n  --concurrency <number>   Parallel conversions, default: 3\n  --overwrite-webp         Replace existing sibling .webp variants\n  --help                   Show this help\n\nOriginal images are never modified or deleted.`);
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (!config.root) throw new Error('--root must have a directory value.');
  if (!Number.isFinite(config.maxKb) || config.maxKb <= 0) throw new Error('--max-kb must be greater than 0.');
  if (!Number.isInteger(config.maxDimension) || config.maxDimension < 1) throw new Error('--max-dimension must be a positive integer.');
  if (!Number.isInteger(config.minDimension) || config.minDimension < 1) throw new Error('--min-dimension must be a positive integer.');
  if (config.minDimension > config.maxDimension) throw new Error('--min-dimension cannot exceed --max-dimension.');
  if (!Number.isInteger(config.concurrency) || config.concurrency < 1 || config.concurrency > 16) {
    throw new Error('--concurrency must be an integer from 1 to 16.');
  }

  return config;
}

async function collectImages(directory, rootDirectory) {
  const results = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    // Avoid following symlinks or scanning unrelated special filesystem entries.
    if (entry.isSymbolicLink()) continue;

    if (entry.isDirectory()) {
      results.push(...await collectImages(fullPath, rootDirectory));
      continue;
    }

    if (entry.isFile() && /\.(jpe?g|png)$/i.test(entry.name)) {
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

const QUALITIES = [84, 80, 76, 72, 68, 64, 60, 56, 52, 48, 44, 40, 36, 32];

async function convertOne(image, options) {
  const record = {
    source: image.sourceRelativePath.split(path.sep).join('/'),
    webp: path.relative(options.root, image.webpPath).split(path.sep).join('/'),
    sourceBytes: null,
    webpBytes: null,
    width: null,
    height: null,
    quality: null,
    reductionPercent: null,
    status: null,
    error: null,
  };

  try {
    const sourceStat = await fs.stat(image.sourcePath);
    record.sourceBytes = sourceStat.size;

    if (!options.overwriteWebp) {
      try {
        const existingStat = await fs.stat(image.webpPath);
        if (existingStat.isFile()) {
          record.webpBytes = existingStat.size;
          record.status = 'SKIPPED_WEBP_EXISTS';
          record.error = 'A .webp file already exists; use --overwrite-webp to regenerate it.';
          return record;
        }
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }

    const metadata = await sharp(image.sourcePath).metadata();
    if ((metadata.pages ?? 1) > 1) {
      record.status = 'SKIPPED_ANIMATED';
      record.error = 'Multi-page/animated PNG was skipped to avoid dropping animation.';
      return record;
    }

    const maxBytes = options.maxKb * 1024;
    let dimension = options.maxDimension;
    let lastAttemptBytes = null;

    while (true) {
      for (const quality of QUALITIES) {
        const result = await sharp(image.sourcePath)
          .rotate() // Apply EXIF orientation before writing the WebP.
          .resize({
            width: dimension,
            height: dimension,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({
            quality,
            effort: 5,
            smartSubsample: true,
            alphaQuality: 100,
          })
          .toBuffer({ resolveWithObject: true });

        lastAttemptBytes = result.data.length;

        if (result.data.length <= maxBytes) {
          await fs.mkdir(path.dirname(image.webpPath), { recursive: true });
          const tempPath = `${image.webpPath}.tmp-${process.pid}-${Date.now()}`;
          await fs.writeFile(tempPath, result.data);

          try {
            if (options.overwriteWebp) {
              await fs.rm(image.webpPath, { force: true });
            }
            await fs.rename(tempPath, image.webpPath);
          } catch (writeError) {
            await fs.rm(tempPath, { force: true }).catch(() => {});
            throw writeError;
          }

          record.webpBytes = result.data.length;
          record.width = result.info.width;
          record.height = result.info.height;
          record.quality = quality;
          record.reductionPercent = sourceStat.size > 0
            ? Number(((1 - result.data.length / sourceStat.size) * 100).toFixed(2))
            : 0;
          record.status = 'SUCCESS';
          console.log(`[SUCCESS] ${record.source} -> ${Math.ceil(result.data.length / 1024)} KiB`);
          return record;
        }
      }

      if (dimension <= options.minDimension) break;
      dimension = Math.max(options.minDimension, Math.floor(dimension * 0.85));
    }

    record.status = 'OVER_LIMIT';
    record.error = `Could not get below ${options.maxKb} KiB; last attempted size was ${lastAttemptBytes === null ? 'unknown' : `${Math.ceil(lastAttemptBytes / 1024)} KiB`}. Original kept unchanged.`;
    console.warn(`[OVER_LIMIT] ${record.source}: ${record.error}`);
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

async function writeReports(records, rootDirectory, maxKb) {
  const reportDirectory = process.cwd();
  const jsonPath = path.join(reportDirectory, 'webp-migration-manifest.json');
  const csvPath = path.join(reportDirectory, 'webp-migration-report.csv');
  const headers = [
    'status', 'source', 'webp', 'sourceBytes', 'webpBytes',
    'width', 'height', 'quality', 'reductionPercent', 'error',
  ];

  const manifest = {
    generatedAt: new Date().toISOString(),
    uploadsRoot: rootDirectory,
    targetMaxBytes: maxKb * 1024,
    originalsModified: false,
    databaseUpdated: false,
    note: 'Each successful record maps an existing relative image path to a sibling .webp derivative. Database paths remain unchanged; the application must select/serve the webp variant to use it.',
    mappings: records
      .filter((record) => record.status === 'SUCCESS')
      .map((record) => ({ source: record.source, webp: record.webp })),
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

  const images = await collectImages(rootDirectory, rootDirectory);
  console.log(`Uploads directory: ${rootDirectory}`);
  console.log(`Found ${images.length} JPEG/PNG files. Originals and DB paths will not be changed.`);

  const collisions = uniqueOutputCollisions(images);
  const collided = new Set(collisions.flat().map((image) => path.resolve(image.sourcePath)));
  for (const group of collisions) {
    console.warn(`[COLLISION] Multiple source files map to the same .webp output: ${group.map((image) => image.sourceRelativePath).join(', ')}`);
  }

  const work = images.map((image) => {
    if (collided.has(path.resolve(image.sourcePath))) {
      return Promise.resolve({
        source: image.sourceRelativePath.split(path.sep).join('/'),
        webp: path.relative(rootDirectory, image.webpPath).split(path.sep).join('/'),
        sourceBytes: null,
        webpBytes: null,
        width: null,
        height: null,
        quality: null,
        reductionPercent: null,
        status: 'OUTPUT_COLLISION',
        error: 'Another JPEG/PNG in this folder has the same base name and would overwrite the same .webp filename. Rename/review these files manually.',
      });
    }
    return image;
  });

  const records = new Array(images.length);
  let cursor = 0;
  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= work.length) return;
      const item = work[index];
      records[index] = item && typeof item.then === 'function'
        ? await item
        : await convertOne(item, { ...config, root: rootDirectory });
    }
  }

  await Promise.all(Array.from({ length: config.concurrency }, () => worker()));
  await writeReports(records, rootDirectory, config.maxKb);

  const counts = records.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] ?? 0) + 1;
    return acc;
  }, {});

  console.log('\nFinished. Summary:');
  console.log(`Total scanned: ${records.length}`);
  for (const [status, count] of Object.entries(counts)) console.log(`${status}: ${count}`);
  console.log('\nOriginal files were kept. No database records were changed.');
}

main().catch((error) => {
  console.error(`\nMigration stopped: ${error.message}`);
  process.exitCode = 1;
});
