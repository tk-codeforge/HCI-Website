#!/usr/bin/env node
/**
 * Sharpness-first JPEG/PNG -> WebP migration for a NestJS uploads directory.
 *
 * What changed compared with the old "quality 95 -> 90" script
 * ------------------------------------------------------------
 * 1. Images are classified as PHOTO or GRAPHIC (logos, screenshots, text, icons).
 *    - PHOTO   -> lossy WebP, quality 92 down to 85 (binary search, so the
 *                 highest quality that fits the size limit is chosen).
 *    - GRAPHIC -> lossless WebP first, then near-lossless (no chroma-subsampling
 *                 blur on text/edges), and lossy only as a last resort.
 *    JPEG sources are always treated as photos unless --type says otherwise.
 * 2. When nothing fits the size limit at full size, the image is resized down in
 *    small steps (100% -> 85% -> 70%) instead of being compressed harder.
 *    A slightly smaller, sharp image looks better than a full-size blurry one.
 *    Use --no-resize to keep the old "never resize" behaviour.
 * 3. `exact: true` was removed from lossy encoding (it only makes files bigger).
 *
 * Guarantees (unchanged):
 * - Originals are never modified or deleted.
 * - A derivative is accepted only if it is <= --max-kb (decimal KB: 200 =
 *   200,000 bytes) AND smaller than the original file.
 * - If no attempt satisfies both, no derivative is kept for that source. With
 *   --overwrite-webp an older derivative is moved to a backup folder outside
 *   uploads so existing middleware falls back to the original.
 * - A dry run performs the conversions for a report but writes nothing.
 * - EXIF orientation is normalised by Sharp's rotate().
 *
 * Suggested local test:
 *   node convert-uploads-to-webp-smart.mjs --root uploads --only about/example.png --dry-run
 *
 * Actual run:
 *   node convert-uploads-to-webp-smart.mjs --root uploads --max-kb 200 --concurrency 2 --overwrite-webp
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';

sharp.cache(false);

// An image is a "graphic" when unique 5-bit colours / pixels (on a 256px thumbnail)
// is below this ratio. Photos are typically > 0.1, flat graphics < 0.02.
const GRAPHIC_COLOR_RATIO = 0.04;
const NEAR_LOSSLESS_MAX = 95;

/* ----------------------------------------------------------------------------
 * CLI
 * ------------------------------------------------------------------------- */

const HELP = `Usage: node convert-uploads-to-webp-smart.mjs [options]

Options:
  --root <dir>              Source uploads folder (default: uploads)
  --only <relative>         Process one relative JPEG/PNG path for a focused test
  --max-kb <number>         Maximum output size in decimal KB; 200 = 200,000 bytes
  --quality <1-100>         Highest lossy quality to try (default: 92)
  --min-quality <1-100>     Lowest lossy quality allowed (default: 85)
  --near-lossless-min <n>   Lowest near-lossless level for graphics (default: 60)
  --type <auto|photo|graphic>
                            Force the image class (default: auto-detect)
  --scales <list>           Width scales tried in order when the size limit is not
                            met, e.g. "1,0.85,0.7" (default)
  --no-resize               Never resize (same as --scales 1)
  --max-width <px>          Optional cap on output width before scaling (default: off)
  --no-graphic-lossy        Never use lossy WebP for graphics; fall back to original
  --effort <0-6>            WebP encoder effort (default: 6, slowest/smallest)
  --concurrency <n>         Parallel conversions, 1-8 (default: 2)
  --overwrite-webp          Replace previous WebP derivatives; back up old ones
  --dry-run                 Report outcomes without changing image files
  --help                    Show this help

A WebP is retained only if it meets the size limit and is smaller than its
original. Original JPEG/PNG files and database paths are never modified.
For production, back up uploads first and run during a low-traffic period.`;

function readArgs(argv) {
  const config = {
    root: 'uploads',
    maxKb: 200,
    quality: 92,
    minQuality: 85,
    nearLosslessMin: 60,
    type: 'auto',
    scales: [1, 0.85, 0.7],
    maxWidth: 0,
    effort: 6,
    concurrency: 2,
    overwriteWebp: false,
    dryRun: false,
    graphicLossyFallback: true,
    only: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const value = () => {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) throw new Error(`${arg} needs a value.`);
      i += 1;
      return next;
    };

    switch (arg) {
      case '--root': config.root = value(); break;
      case '--only': config.only = value(); break;
      case '--max-kb': config.maxKb = Number(value()); break;
      case '--quality': config.quality = Number(value()); break;
      case '--min-quality': config.minQuality = Number(value()); break;
      case '--near-lossless-min': config.nearLosslessMin = Number(value()); break;
      case '--type': config.type = value(); break;
      case '--scales': config.scales = value().split(',').map((s) => Number(s.trim())); break;
      case '--no-resize': config.scales = [1]; break;
      case '--max-width': config.maxWidth = Number(value()); break;
      case '--no-graphic-lossy': config.graphicLossyFallback = false; break;
      case '--effort': config.effort = Number(value()); break;
      case '--concurrency': config.concurrency = Number(value()); break;
      case '--overwrite-webp': config.overwriteWebp = true; break;
      case '--dry-run': config.dryRun = true; break;
      case '--help':
      case '-h':
        console.log(HELP);
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  const isInt = Number.isInteger;
  if (!config.root) throw new Error('--root must have a directory value.');
  if (!Number.isFinite(config.maxKb) || config.maxKb <= 0) throw new Error('--max-kb must be greater than 0.');
  if (!isInt(config.quality) || config.quality < 1 || config.quality > 100) throw new Error('--quality must be an integer from 1 to 100.');
  if (!isInt(config.minQuality) || config.minQuality < 1 || config.minQuality > config.quality) throw new Error('--min-quality must be an integer from 1 to --quality.');
  if (!isInt(config.nearLosslessMin) || config.nearLosslessMin < 1 || config.nearLosslessMin > NEAR_LOSSLESS_MAX) throw new Error(`--near-lossless-min must be an integer from 1 to ${NEAR_LOSSLESS_MAX}.`);
  if (!['auto', 'photo', 'graphic'].includes(config.type)) throw new Error('--type must be auto, photo or graphic.');
  if (!isInt(config.effort) || config.effort < 0 || config.effort > 6) throw new Error('--effort must be an integer from 0 to 6.');
  if (!isInt(config.concurrency) || config.concurrency < 1 || config.concurrency > 8) throw new Error('--concurrency must be an integer from 1 to 8.');
  if (!Number.isFinite(config.maxWidth) || config.maxWidth < 0) throw new Error('--max-width must be 0 or a positive number.');
  if (config.scales.length === 0 || config.scales.some((s) => !Number.isFinite(s) || s <= 0 || s > 1)) {
    throw new Error('--scales must be a comma-separated list of numbers greater than 0 and at most 1.');
  }
  config.scales = [...new Set(config.scales)].sort((a, b) => b - a);
  if (config.only && path.isAbsolute(config.only)) throw new Error('--only must be a path relative to --root, not an absolute path.');

  return config;
}

/* ----------------------------------------------------------------------------
 * File helpers
 * ------------------------------------------------------------------------- */

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

const kb = (bytes) => `${(bytes / 1000).toFixed(1)} KB`;
const rel = (p) => p.split(path.sep).join('/');

/* ----------------------------------------------------------------------------
 * Classification: photo vs graphic
 * ------------------------------------------------------------------------- */

async function classifyImage(sourcePath) {
  const { data, info } = await sharp(sourcePath)
    .rotate()
    .resize({ width: 256, height: 256, fit: 'inside', kernel: 'nearest', withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .toColourspace('srgb')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = info.width * info.height;
  if (pixels === 0) return 'photo';
  const channels = info.channels;
  const bytesPerSample = Math.max(1, Math.round(data.length / (pixels * channels)));
  const step = channels * bytesPerSample;
  // For 16-bit data (little endian) the most significant byte is the second one.
  const hi = bytesPerSample === 2 ? 1 : 0;

  const seen = new Set();
  for (let i = 0; i + step <= data.length; i += step) {
    const r = data[i + hi] >> 3;
    const g = data[i + bytesPerSample + hi] >> 3;
    const b = data[i + 2 * bytesPerSample + hi] >> 3;
    seen.add((r << 10) | (g << 5) | b);
  }
  return seen.size / pixels < GRAPHIC_COLOR_RATIO ? 'graphic' : 'photo';
}

/* ----------------------------------------------------------------------------
 * Encoding plan
 * ------------------------------------------------------------------------- */

function buildPlan(kind, options) {
  const plan = [];
  const lossy = (scale) => ({ scale, method: 'lossy', lo: options.minQuality, hi: options.quality });

  if (kind === 'photo') {
    for (const scale of options.scales) plan.push(lossy(scale));
    return plan;
  }

  for (const scale of options.scales) {
    plan.push({ scale, method: 'lossless' });
    plan.push({ scale, method: 'near-lossless', lo: options.nearLosslessMin, hi: NEAR_LOSSLESS_MAX });
  }
  if (options.graphicLossyFallback) {
    for (const scale of options.scales) plan.push(lossy(scale));
  }
  return plan;
}

function webpOptionsFor(method, quality, options) {
  const common = { effort: options.effort, alphaQuality: 100 };
  if (method === 'lossless') return { ...common, lossless: true };
  if (method === 'near-lossless') return { ...common, nearLossless: true, quality };
  return { ...common, quality, smartSubsample: true };
}

/** Tracks the smallest attempt so failures can be reported meaningfully. */
function createTracker(maxBytes) {
  return {
    smallestBytes: null,
    smallestInfo: null,
    anyWithinMax: false,
    record(result) {
      const bytes = result.data.length;
      if (bytes <= maxBytes) this.anyWithinMax = true;
      if (this.smallestBytes === null || bytes < this.smallestBytes) {
        this.smallestBytes = bytes;
        this.smallestInfo = result.info;
      }
    },
  };
}

/** Highest integer quality in [lo, hi] whose output fits `limit`, or null. */
async function searchHighestFitting(lo, hi, limit, encodeAt, tracker) {
  const attempt = async (quality) => {
    const result = await encodeAt(quality);
    tracker.record(result);
    return result.data.length <= limit ? { quality, result } : null;
  };

  let best = await attempt(hi);
  if (best) return best;
  if (lo >= hi) return null;

  const atLowest = await attempt(lo);
  if (!atLowest) return null;
  best = atLowest;

  let low = lo + 1;
  let high = hi - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const hit = await attempt(mid);
    if (hit) {
      best = hit;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return best;
}

async function runStep(step, ctx) {
  const { image, options, limit, tracker, orientedWidth } = ctx;

  let targetWidth = null;
  if (orientedWidth) {
    const base = options.maxWidth > 0 ? Math.min(orientedWidth, options.maxWidth) : orientedWidth;
    const scaled = Math.max(1, Math.round(base * step.scale));
    if (scaled < orientedWidth) targetWidth = scaled;
  }

  const encode = (webpOptions) => {
    let pipeline = sharp(image.sourcePath).rotate();
    if (targetWidth) pipeline = pipeline.resize({ width: targetWidth, withoutEnlargement: true });
    return pipeline.webp(webpOptions).toBuffer({ resolveWithObject: true });
  };

  if (step.method === 'lossless') {
    const result = await encode(webpOptionsFor('lossless', null, options));
    tracker.record(result);
    return result.data.length <= limit
      ? { result, method: 'lossless', quality: 'lossless', scale: step.scale }
      : null;
  }

  const found = await searchHighestFitting(
    step.lo,
    step.hi,
    limit,
    (quality) => encode(webpOptionsFor(step.method, quality, options)),
    tracker,
  );
  return found
    ? { result: found.result, method: step.method, quality: found.quality, scale: step.scale }
    : null;
}

/* ----------------------------------------------------------------------------
 * Per-image conversion
 * ------------------------------------------------------------------------- */

async function convertOne(image, options) {
  const record = {
    status: null,
    source: rel(image.sourceRelativePath),
    webp: rel(path.relative(options.root, image.webpPath)),
    kind: null,
    method: null,
    scale: null,
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

    const isJpeg = /\.jpe?g$/i.test(image.sourcePath);
    const kind = options.type !== 'auto'
      ? options.type
      : (isJpeg ? 'photo' : await classifyImage(image.sourcePath));
    record.kind = kind;

    const maxBytes = Math.floor(options.maxKb * 1000); // decimal KB
    const limit = Math.min(maxBytes, sourceStat.size - 1); // must also be smaller than the source
    const orientedWidth = (metadata.orientation ?? 1) >= 5 ? metadata.height : metadata.width;
    const tracker = createTracker(maxBytes);
    const ctx = { image, options, limit, tracker, orientedWidth };

    let chosen = null;
    for (const step of buildPlan(kind, options)) {
      chosen = await runStep(step, ctx);
      if (chosen) break;
    }

    if (!chosen) {
      if (options.overwriteWebp && webpExists && !options.dryRun) {
        record.backupWebp = await backupExistingWebp(image, options);
      }
      record.attemptedWebpBytes = tracker.smallestBytes;
      record.width = tracker.smallestInfo?.width ?? null;
      record.height = tracker.smallestInfo?.height ?? null;
      const prefix = options.dryRun ? 'DRY_RUN_' : '';
      record.status = tracker.anyWithinMax
        ? `${prefix}ORIGINAL_KEPT_NO_SAVINGS`
        : `${prefix}OVER_LIMIT_ORIGINAL_KEPT`;
      const backupNote = record.backupWebp ? ' Previous WebP backed up.' : '';
      record.error = tracker.anyWithinMax
        ? `No permitted output was both <= ${maxBytes} bytes and smaller than the source (${sourceStat.size} bytes). Original is retained.${backupNote}`
        : `Output exceeded ${maxBytes} bytes even at the lowest allowed quality/scale. Original is retained.${backupNote}`;
      if (options.dryRun) record.error += ' Dry run: no files changed.';
      console.warn(`[${record.status}] ${record.source} (${kind})`);
      return record;
    }

    const { result } = chosen;
    record.method = chosen.method;
    record.scale = chosen.scale;
    record.quality = chosen.quality;
    record.attemptedWebpBytes = result.data.length;
    record.webpBytes = result.data.length;
    record.width = result.info.width;
    record.height = result.info.height;
    record.reductionPercent = sourceStat.size > 0
      ? Number(((1 - result.data.length / sourceStat.size) * 100).toFixed(2))
      : 0;

    const summary = `${kb(record.webpBytes)} (${kind}, ${chosen.method}${chosen.method === 'lossless' ? '' : ` ${chosen.quality}`}, scale ${Math.round(chosen.scale * 100)}%, ${record.width}x${record.height})`;

    if (options.dryRun) {
      record.status = 'DRY_RUN_SUCCESS';
      record.error = 'Would write this WebP; dry run did not change any image files.';
      console.log(`[DRY RUN SUCCESS] ${record.source} -> ${summary}`);
      return record;
    }

    // Write candidate to a temporary path before moving any existing derivative.
    const tempPath = await writeTempFile(image.webpPath, result.data);
    let backupAbsolutePath = null;
    try {
      if (options.overwriteWebp && webpExists) {
        backupAbsolutePath = path.join(options.backupRoot, path.relative(options.root, image.webpPath));
        await fs.mkdir(path.dirname(backupAbsolutePath), { recursive: true });
        await fs.rename(image.webpPath, backupAbsolutePath);
        record.backupWebp = rel(path.relative(process.cwd(), backupAbsolutePath));
      }
      await fs.rename(tempPath, image.webpPath);
    } catch (error) {
      await fs.rm(tempPath, { force: true }).catch(() => {});
      await restoreBackupIfNeeded(backupAbsolutePath, image.webpPath);
      throw error;
    }

    record.status = 'SUCCESS';
    record.error = null;
    console.log(`[SUCCESS] ${record.source} -> ${summary}`);
    return record;
  } catch (error) {
    record.status = 'ERROR';
    record.error = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] ${record.source}: ${record.error}`);
    return record;
  }
}

/* ----------------------------------------------------------------------------
 * Reports
 * ------------------------------------------------------------------------- */

function csvCell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

async function writeReports(records, rootDirectory, options) {
  const reportDirectory = process.cwd();
  const label = `webp-smart-q${options.quality}-to-${options.minQuality}`;
  const jsonPath = path.join(reportDirectory, `${label}-manifest.json`);
  const csvPath = path.join(reportDirectory, `${label}-report.csv`);
  const headers = [
    'status', 'source', 'webp', 'kind', 'method', 'quality', 'scale', 'sourceBytes', 'webpBytes',
    'attemptedWebpBytes', 'width', 'height', 'reductionPercent', 'backupWebp', 'error',
  ];
  const manifest = {
    generatedAt: new Date().toISOString(),
    uploadsRoot: rootDirectory,
    targetMaxBytes: Math.floor(options.maxKb * 1000),
    maxKbDefinition: 'Decimal KB: 1 KB = 1000 bytes',
    originalsModified: false,
    databaseUpdated: false,
    dryRun: options.dryRun,
    policy: {
      photos: `lossy WebP, quality ${options.quality} down to ${options.minQuality}`,
      graphics: `lossless, then near-lossless ${NEAR_LOSSLESS_MAX} down to ${options.nearLosslessMin}${options.graphicLossyFallback ? ', then lossy as last resort' : ''}`,
      scales: options.scales,
      maxWidth: options.maxWidth || null,
      acceptance: 'Output kept only if within the size limit and smaller than the source.',
    },
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

/* ----------------------------------------------------------------------------
 * Main
 * ------------------------------------------------------------------------- */

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
    images = images.filter((image) => rel(image.sourceRelativePath).toLowerCase() === requested.toLowerCase());
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
  console.log(`Policy: ${config.dryRun ? 'DRY RUN; no image files will be changed. ' : ''}photos lossy q${config.quality}-${config.minQuality}; graphics lossless/near-lossless${config.graphicLossyFallback ? ' (lossy last resort)' : ''}; scales ${config.scales.join(', ')}; output <= ${Math.floor(config.maxKb * 1000)} bytes and smaller than original.`);
  if (config.overwriteWebp) console.log('Existing WebP derivatives will be replaced/backed up if needed.');
  else if (config.dryRun) console.log('Dry run previews re-generation, including paths that already have WebP derivatives.');
  else console.log('Existing WebP derivatives will be skipped unless --overwrite-webp is provided.');

  const collisions = uniqueOutputCollisions(images);
  const collided = new Set(collisions.flat().map((image) => path.resolve(image.sourcePath)));
  for (const group of collisions) {
    console.warn(`[COLLISION] Multiple sources map to one WebP output: ${group.map((image) => image.sourceRelativePath).join(', ')}`);
  }
  const work = images.map((image) => (collided.has(path.resolve(image.sourcePath)) ? {
    collisionRecord: {
      status: 'OUTPUT_COLLISION',
      source: rel(image.sourceRelativePath),
      webp: rel(path.relative(rootDirectory, image.webpPath)),
      kind: null, method: null, quality: null, scale: null,
      sourceBytes: null, webpBytes: null, attemptedWebpBytes: null,
      width: null, height: null, reductionPercent: null, backupWebp: null,
      error: 'Multiple JPEG/PNG files map to the same .webp output. No file changed; review these names manually.',
    },
  } : { image }));

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
