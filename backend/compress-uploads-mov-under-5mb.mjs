#!/usr/bin/env node
/**
 * HCI MOV optimizer.
 *
 * Scans .mov files under uploads and writes browser-friendly H.264/AAC MP4
 * derivatives as <original-file>.hci-optimized.mp4, e.g. room.mov.hci-optimized.mp4.
 * The original .mov files are never modified or deleted. Existing website URLs
 * can keep ending in .mov when video-to-MP4 middleware is registered before
 * the NestJS static-file handler.
 *
 * Requires ffmpeg and ffprobe on PATH (or FFMPEG_PATH / FFPROBE_PATH).
 * Default is a dry run; use --apply to write derivatives.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';

const argv = process.argv.slice(2);
function option(name, fallback) {
  const index = argv.indexOf(name);
  return index >= 0 && argv[index + 1] !== undefined ? argv[index + 1] : fallback;
}
function hasFlag(name) { return argv.includes(name); }

if (hasFlag('--help') || hasFlag('-h')) {
  console.log(`Usage:
  node compress-uploads-mov-under-5mb.mjs --root uploads --max-mb 5 --dry-run
  node compress-uploads-mov-under-5mb.mjs --root uploads --max-mb 5 --apply

Options:
  --root <directory>       Uploads root (default: uploads)
  --max-mb <number>        Strict decimal MB ceiling (default: 5; output must be < limit)
  --only <relative.mov>    Process only one MOV under root
  --dry-run                Encode candidates but do not write/replace MP4 derivatives (default)
  --apply                  Write MP4 derivatives next to originals; originals are never changed
  --overwrite-output       Rebuild even if an acceptable derivative already exists
  --concurrency <1|2>      Concurrent videos (default: 1)

Output derivative for a.mov: a.mov.hci-optimized.mp4
Reports are written to the current working directory.
Requires ffmpeg and ffprobe on PATH. Set FFMPEG_PATH / FFPROBE_PATH if needed.`);
  process.exit(0);
}

const root = path.resolve(option('--root', 'uploads'));
const maxMb = Number(option('--max-mb', '5'));
const concurrency = Math.max(1, Math.min(2, Number(option('--concurrency', '1')) || 1));
const only = option('--only', null);
const apply = hasFlag('--apply');
const dryRun = hasFlag('--dry-run') || !apply;
const overwriteOutput = hasFlag('--overwrite-output');
const ffmpegBin = process.env.FFMPEG_PATH || 'ffmpeg';
const ffprobeBin = process.env.FFPROBE_PATH || 'ffprobe';

if (hasFlag('--apply') && hasFlag('--dry-run')) {
  console.error('Use either --apply or --dry-run, not both.');
  process.exit(1);
}
if (!Number.isFinite(maxMb) || maxMb <= 0) {
  console.error('--max-mb must be a positive number.');
  process.exit(1);
}
const maxBytesExclusive = Math.floor(maxMb * 1_000_000);

// Lower CRF = better visual quality. Resolution is kept at original size first;
// only scaled candidates are considered if no acceptable-size encode fits.
const CRF_BEST = 18;
const CRF_MAX_COMPRESSION = 32;
const audioBitrates = [128, 96, 64, 48];
const scaleBounds = [1920, 1600, 1280, 1080, 960, 854, 720, 640, 540, 480, 360, 320];
const reportCsv = path.resolve('mov-optimization-report.csv');
const reportJson = path.resolve('mov-optimization-manifest.json');
const timeTag = new Date().toISOString().replace(/[:.]/g, '-');
const backupRoot = path.join(path.dirname(root), `uploads-mov-derivative-backup-${timeTag}`);

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', (error) => reject(new Error(`Could not launch ${command}. ${error.message}`)));
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${path.basename(command)} exited with code ${code}: ${(stderr || stdout).slice(-1800)}`));
    });
  });
}

async function assertTools() {
  const ffmpeg = await run(ffmpegBin, ['-version']);
  const ffprobe = await run(ffprobeBin, ['-version']);
  console.log(ffmpeg.stdout.split(/\r?\n/)[0] || 'ffmpeg available');
  console.log(ffprobe.stdout.split(/\r?\n/)[0] || 'ffprobe available');
}

async function collectMovs(directory) {
  const out = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) out.push(...await collectMovs(full));
    else if (entry.isFile() && /\.mov$/i.test(entry.name)) out.push(full);
  }
  return out;
}

async function probe(file) {
  const { stdout } = await run(ffprobeBin, [
    '-v', 'error', '-show_format', '-show_streams', '-of', 'json', file,
  ]);
  const data = JSON.parse(stdout);
  const streams = data.streams || [];
  const video = streams.find((stream) => stream.codec_type === 'video');
  const audio = streams.find((stream) => stream.codec_type === 'audio');
  if (!video) throw new Error('No video stream found.');
  const stat = await fs.stat(file);
  return {
    bytes: stat.size,
    duration: Number(data.format?.duration || video.duration || 0),
    videoCodec: video.codec_name || 'unknown',
    videoProfile: video.profile || '',
    pixelFormat: video.pix_fmt || 'unknown',
    width: Number(video.width || 0),
    height: Number(video.height || 0),
    frameRate: video.avg_frame_rate || video.r_frame_rate || '',
    audioCodec: audio?.codec_name || 'none',
    hasAudio: Boolean(audio),
    hasAlpha: /a/.test(video.pix_fmt || '') && /yuva|rgba|bgra|argb|gbrap/i.test(video.pix_fmt || ''),
  };
}

function isBrowserFriendly(info) {
  return info.videoCodec === 'h264'
    && info.pixelFormat === 'yuv420p'
    && (!info.hasAudio || info.audioCodec === 'aac');
}
function formatMb(bytes) { return bytes == null || bytes === '' ? '' : (Number(bytes) / 1_000_000).toFixed(3); }
function rel(file) { return path.relative(root, file).split(path.sep).join('/'); }
function derivativeFor(source) { return `${source}.hci-optimized.mp4`; }
function isWithinRoot(candidate) {
  const relative = path.relative(root, candidate);
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}
function scaleOptions(info) {
  const sourceMax = Math.max(info.width, info.height);
  const values = [null, ...scaleBounds.filter((bound) => bound < sourceMax)];
  return [...new Set(values)];
}

async function encodeCandidate(inputPath, outputPath, info, maxDimension, crf, audioKbps) {
  const args = [
    '-hide_banner', '-loglevel', 'error', '-nostdin', '-y',
    '-i', inputPath,
    '-map', '0:v:0', '-map', '0:a:0?',
    '-sn', '-dn',
  ];
  if (maxDimension !== null) {
    args.push('-vf', `scale=w='min(iw,${maxDimension})':h='min(ih,${maxDimension})':force_original_aspect_ratio=decrease:force_divisible_by=2`);
  }
  args.push(
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-profile:v', 'main',
    '-pix_fmt', 'yuv420p',
    '-crf', String(crf),
    '-tag:v', 'avc1',
    '-map_metadata', '-1',
    '-movflags', '+faststart',
    '-f', 'mp4', outputPath,
  );
  if (info.hasAudio) {
    const codecIndex = args.indexOf('-f');
    args.splice(codecIndex, 0, '-c:a', 'aac', '-b:a', `${audioKbps}k`, '-ac', '2');
  } else {
    const codecIndex = args.indexOf('-f');
    args.splice(codecIndex, 0, '-an');
  }
  await run(ffmpegBin, args);
  const candidateInfo = await probe(outputPath);
  if (!isBrowserFriendly(candidateInfo)) {
    throw new Error(`Encoder output is not compatible H.264/AAC: ${candidateInfo.videoCodec}/${candidateInfo.pixelFormat}/${candidateInfo.audioCodec}`);
  }
  return candidateInfo;
}

async function writeReports(records) {
  const columns = [
    'path', 'derivativePath', 'status', 'originalBytes', 'outputBytes', 'originalMB', 'outputMB',
    'durationSeconds', 'originalVideoCodec', 'originalAudioCodec', 'outputVideoCodec',
    'outputAudioCodec', 'outputWidth', 'outputHeight', 'crf', 'audioKbps', 'scaleMaxDimension', 'note',
  ];
  const esc = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const lines = [columns.map(esc).join(','), ...records.map((record) => columns.map((col) => esc(record[col])).join(','))];
  await fs.writeFile(reportCsv, lines.join('\r\n'), 'utf8');
  await fs.writeFile(reportJson, JSON.stringify({
    generatedAt: new Date().toISOString(), root, maxMBExclusive: maxMb, dryRun,
    backupDirectory: apply ? backupRoot : null,
    summary: records.reduce((acc, rec) => { acc[rec.status] = (acc[rec.status] || 0) + 1; return acc; }, {}),
    records,
  }, null, 2), 'utf8');
}

async function storeDerivative(sourcePath, candidatePath, destinationPath) {
  if (!isWithinRoot(destinationPath)) throw new Error('Derivative path escapes uploads root.');
  const relSource = path.relative(root, sourcePath);
  const backupPath = path.join(backupRoot, `${relSource}.hci-optimized.mp4`);
  const tempPath = `${destinationPath}.hci-new-${randomUUID()}.tmp.mp4`;
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  await fs.copyFile(candidatePath, tempPath);
  const staged = await fs.stat(tempPath);
  if (staged.size >= maxBytesExclusive) {
    await fs.rm(tempPath, { force: true });
    throw new Error('Staged MP4 exceeds the configured size limit.');
  }
  let backedUp = false;
  try {
    try {
      await fs.access(destinationPath);
      await fs.mkdir(path.dirname(backupPath), { recursive: true });
      await fs.copyFile(destinationPath, backupPath);
      backedUp = true;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    await fs.rename(tempPath, destinationPath).catch(async (error) => {
      // Windows rename cannot replace an existing destination. Remove it only
      // after a backup exists, then retry the atomic rename.
      if (error.code === 'EEXIST' || error.code === 'EPERM' || error.code === 'ENOTEMPTY') {
        if (!backedUp) throw error;
        await fs.rm(destinationPath, { force: true });
        await fs.rename(tempPath, destinationPath);
      } else {
        throw error;
      }
    });
    return backedUp ? backupPath : null;
  } finally {
    await fs.rm(tempPath, { force: true }).catch(() => {});
  }
}

async function quarantineExistingDerivative(sourcePath, derivativePath) {
  try {
    await fs.access(derivativePath);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  const backupPath = path.join(backupRoot, `${path.relative(root, sourcePath)}.hci-optimized.mp4`);
  await fs.mkdir(path.dirname(backupPath), { recursive: true });
  await fs.copyFile(derivativePath, backupPath);
  await fs.rm(derivativePath, { force: true });
  return backupPath;
}

async function processOne(file) {
  const relative = rel(file);
  const dest = derivativeFor(file);
  const derivativeRelative = rel(dest);
  const originalBytes = (await fs.stat(file)).size;
  const base = {
    path: relative, derivativePath: derivativeRelative, status: '', originalBytes, outputBytes: '',
    originalMB: formatMb(originalBytes), outputMB: '', durationSeconds: '', originalVideoCodec: '',
    originalAudioCodec: '', outputVideoCodec: '', outputAudioCodec: '', outputWidth: '', outputHeight: '',
    crf: '', audioKbps: '', scaleMaxDimension: 'original', note: '',
  };
  const tempFiles = new Set();
  const newTemp = (label) => {
    const filename = path.join(os.tmpdir(), `hci-mov-${label}-${randomUUID()}.mp4`);
    tempFiles.add(filename);
    return filename;
  };
  const candidatePath = newTemp('candidate');

  try {
    const info = await probe(file);
    Object.assign(base, {
      durationSeconds: Number(info.duration.toFixed(3)),
      originalVideoCodec: info.videoCodec,
      originalAudioCodec: info.audioCodec,
    });

    // H.264/yuv420p cannot preserve a video's alpha channel. Do not silently
    // discard transparency; report it and leave the source untouched.
    if (info.hasAlpha) {
      base.status = 'ALPHA_VIDEO_SOURCE_PRESERVED';
      base.note = 'Source appears to contain an alpha channel. H.264/yuv420p would discard transparency, so no derivative was generated.';
      console.warn(`[SKIP ALPHA] ${relative}`);
      return base;
    }

    if (!overwriteOutput) {
      try {
        await fs.access(dest);
        const existingInfo = await probe(dest);
        if (existingInfo.bytes < maxBytesExclusive && isBrowserFriendly(existingInfo)) {
          base.status = 'SKIPPED_DERIVATIVE_ALREADY_VALID';
          base.outputBytes = existingInfo.bytes;
          base.outputMB = formatMb(existingInfo.bytes);
          base.outputVideoCodec = existingInfo.videoCodec;
          base.outputAudioCodec = existingInfo.audioCodec;
          base.outputWidth = existingInfo.width;
          base.outputHeight = existingInfo.height;
          base.note = 'An H.264/AAC MP4 derivative already exists and is below the size target; it was preserved.';
          console.log(`[SKIP] ${relative} (existing derivative ${formatMb(existingInfo.bytes)} MB)`);
          return base;
        }
      } catch (error) {
        if (error.code !== 'ENOENT') {
          // A present but invalid derivative is re-encoded below.
        }
      }
    }

    let best = null;
    let attempts = 0;
    let hadEncodingFailure = null;

    search:
    for (const maxDimension of scaleOptions(info)) {
      const audioRates = info.hasAudio ? audioBitrates : [0];
      const candidatesAtThisScale = [];

      for (const audioKbps of audioRates) {
        // Candidate path is reused for the current attempt. When a trial fits,
        // save it to its own file so later trials cannot overwrite it.
        await fs.rm(candidatePath, { force: true }).catch(() => {});
        let highQualityInfo;
        attempts++;
        try {
          highQualityInfo = await encodeCandidate(file, candidatePath, info, maxDimension, CRF_BEST, audioKbps);
        } catch (error) {
          hadEncodingFailure = error.message || String(error);
          continue;
        }

        if (highQualityInfo.bytes < maxBytesExclusive) {
          const savedPath = newTemp('saved');
          await fs.copyFile(candidatePath, savedPath);
          candidatesAtThisScale.push({ info: highQualityInfo, crf: CRF_BEST, audioKbps, maxDimension, savedPath });
          continue;
        }

        await fs.rm(candidatePath, { force: true }).catch(() => {});
        let maxCompressionInfo;
        attempts++;
        try {
          maxCompressionInfo = await encodeCandidate(file, candidatePath, info, maxDimension, CRF_MAX_COMPRESSION, audioKbps);
        } catch (error) {
          hadEncodingFailure = error.message || String(error);
          continue;
        }
        if (maxCompressionInfo.bytes >= maxBytesExclusive) continue;

        let lowCrf = CRF_BEST; // does not fit
        let highCrf = CRF_MAX_COMPRESSION; // fits
        let chosenInfo = maxCompressionInfo;
        const savedPath = newTemp('saved');
        await fs.copyFile(candidatePath, savedPath);

        while (highCrf - lowCrf > 1) {
          const mid = Math.floor((lowCrf + highCrf) / 2);
          await fs.rm(candidatePath, { force: true }).catch(() => {});
          attempts++;
          const trial = await encodeCandidate(file, candidatePath, info, maxDimension, mid, audioKbps);
          if (trial.bytes < maxBytesExclusive) {
            highCrf = mid;
            chosenInfo = trial;
            await fs.copyFile(candidatePath, savedPath);
          } else {
            lowCrf = mid;
          }
        }
        candidatesAtThisScale.push({ info: chosenInfo, crf: highCrf, audioKbps, maxDimension, savedPath });
      }

      if (candidatesAtThisScale.length) {
        // At the first resolution that fits, choose the lowest CRF (best video
        // quality); if tied, prefer the higher audio bitrate.
        candidatesAtThisScale.sort((a, b) => a.crf - b.crf || b.audioKbps - a.audioKbps);
        best = { ...candidatesAtThisScale[0], attempts };
        // Remove trial files belonging to candidates that were not selected.
        for (const candidate of candidatesAtThisScale) {
          if (candidate.savedPath !== best.savedPath) {
            await fs.rm(candidate.savedPath, { force: true }).catch(() => {});
            tempFiles.delete(candidate.savedPath);
          }
        }
        break search;
      }
    }

    if (!best) {
      base.status = 'OVER_LIMIT_SOURCE_PRESERVED';
      base.note = `No candidate fit strictly below ${maxBytesExclusive.toLocaleString()} bytes at the tried quality/resolution levels. Original MOV was left unchanged.${hadEncodingFailure ? ` Last encoder note: ${hadEncodingFailure}` : ''}`;
      console.warn(`[OVER LIMIT] ${relative}; original preserved`);
      if (apply) {
        const backedUp = await quarantineExistingDerivative(file, dest).catch(() => null);
        if (backedUp) base.note += ' An older derivative was moved to backup so it will not be served.';
      }
      return base;
    }

    base.outputBytes = best.info.bytes;
    base.outputMB = formatMb(best.info.bytes);
    base.outputVideoCodec = best.info.videoCodec;
    base.outputAudioCodec = best.info.audioCodec;
    base.outputWidth = best.info.width;
    base.outputHeight = best.info.height;
    base.crf = best.crf;
    base.audioKbps = info.hasAudio ? best.audioKbps : '';
    base.scaleMaxDimension = best.maxDimension ?? 'original';
    base.note = `MP4 derivative: CRF ${best.crf}; scale ceiling ${best.maxDimension ?? 'original'}; attempts ${best.attempts}. Original MOV is unchanged.`;

    if (dryRun) {
      base.status = 'DRY_RUN_WOULD_CREATE_DERIVATIVE';
      console.log(`[DRY RUN] ${relative}: ${formatMb(info.bytes)} MB -> ${formatMb(best.info.bytes)} MB, CRF ${best.crf}, scale ${best.maxDimension ?? 'original'}`);
      return base;
    }

    const backup = await storeDerivative(file, best.savedPath, dest);
    base.status = 'DERIVATIVE_CREATED';
    if (backup) base.note += ` Previous derivative backed up to ${path.relative(path.dirname(root), backup).split(path.sep).join('/')}.`;
    console.log(`[CREATED] ${relative}: ${formatMb(info.bytes)} MB -> ${formatMb(best.info.bytes)} MB`);
    return base;
  } catch (error) {
    base.status = 'ERROR';
    base.note = error?.message || String(error);
    console.error(`[ERROR] ${relative}: ${base.note}`);
    return base;
  } finally {
    for (const temp of tempFiles) await fs.rm(temp, { force: true }).catch(() => {});
  }
}

async function main() {
  try {
    await fs.access(root);
    if (!(await fs.stat(root)).isDirectory()) throw new Error(`Root is not a directory: ${root}`);
    await assertTools();
    const all = await collectMovs(root);
    let files = all;
    if (only) {
      const wanted = only.replaceAll('\\', '/').replace(/^\/+/, '');
      files = all.filter((file) => rel(file).toLowerCase() === wanted.toLowerCase());
      if (!files.length) throw new Error(`--only did not match a .mov file under root: ${wanted}`);
    }
    console.log(`Mode: ${dryRun ? 'DRY RUN (source files unchanged)' : 'APPLY (MP4 derivatives will be written; source MOV files remain unchanged)'}`);
    console.log(`Root: ${root}`);
    console.log(`MOV files found: ${files.length}`);
    console.log(`Required MP4 derivative size: strictly less than ${maxBytesExclusive.toLocaleString()} bytes (${maxMb} decimal MB).`);
    console.log(`Worker concurrency: ${concurrency}`);
    if (apply) console.log(`Backup directory for previous derivatives: ${backupRoot}`);

    const records = [];
    let nextIndex = 0;
    let writeQueue = Promise.resolve();
    const saveReports = () => { writeQueue = writeQueue.then(() => writeReports(records)); return writeQueue; };
    async function worker() {
      while (nextIndex < files.length) {
        const index = nextIndex++;
        records.push(await processOne(files[index]));
        await saveReports();
      }
    }
    await Promise.all(Array.from({ length: concurrency }, () => worker()));
    await writeReports(records);
    console.log('\nFinished. Summary:');
    console.log(`Total scanned: ${files.length}`);
    const counts = records.reduce((acc, record) => { acc[record.status] = (acc[record.status] || 0) + 1; return acc; }, {});
    for (const [status, count] of Object.entries(counts)) console.log(`${status}: ${count}`);
    console.log(`CSV report: ${reportCsv}`);
    console.log(`JSON manifest: ${reportJson}`);
    if (dryRun) console.log('\nDry run only. Review the CSV, then rerun with --apply.');
  } catch (error) {
    console.error('\nMOV optimization stopped:', error.message || error);
    process.exitCode = 1;
  }
}

main();
