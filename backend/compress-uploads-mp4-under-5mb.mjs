#!/usr/bin/env node
/**
 * HCI video optimizer: recursively transcode MP4s in-place to browser-friendly
 * H.264 (yuv420p) + AAC, targeting a file size strictly below the configured MB.
 * Original files are moved to a timestamped backup directory OUTSIDE uploads.
 * Without --apply, the tool performs a dry run (encodes candidates but changes no originals).
 * Requires ffmpeg and ffprobe available on PATH (or FFMPEG_PATH / FFPROBE_PATH env vars).
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
  node compress-uploads-mp4-under-5mb.mjs --root uploads --max-mb 5 --dry-run
  node compress-uploads-mp4-under-5mb.mjs --root uploads --max-mb 5 --apply

Options:
  --root <directory>       Uploads root (default: uploads)
  --max-mb <number>        Strict decimal MB ceiling (default: 5; result must be smaller)
  --only <relative.mp4>    Process only one MP4 under root
  --dry-run                Encode candidates, but never replace originals (default)
  --apply                  Back up originals and replace only when a suitable candidate fits
  --concurrency <1|2>      Concurrent videos (default: 1)

Requires ffmpeg and ffprobe on PATH. Set FFMPEG_PATH / FFPROBE_PATH if needed.`);
  process.exit(0);
}

const rootArg = option('--root', 'uploads');
const root = path.resolve(rootArg);
const maxMb = Number(option('--max-mb', '5'));
const concurrency = Math.max(1, Math.min(2, Number(option('--concurrency', '1')) || 1));
const only = option('--only', null);
const apply = hasFlag('--apply');
const dryRun = hasFlag('--dry-run') || !apply;
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
if (!dryRun && !apply) {
  console.error('Internal safety check failed: specify --apply to modify files.');
  process.exit(1);
}

// MB here means decimal megabytes. For --max-mb 5, accepted outputs must be
// smaller than 5,000,000 bytes (i.e. at most 4,999,999 bytes).
const maxBytesExclusive = Math.floor(maxMb * 1_000_000);
const CRF_HIGHEST_QUALITY = 18;
const CRF_MAX_COMPRESSION = 32;
const audioBitrates = [96, 64, 48]; // try to protect video quality before lowering video quality further
const scaleBounds = [1920, 1600, 1280, 960, 854, 720, 640, 480];
const reportCsv = path.resolve('video-optimization-report.csv');
const reportJson = path.resolve('video-optimization-manifest.json');
const timeTag = new Date().toISOString().replace(/[:.]/g, '-');
const backupRoot = path.join(path.dirname(root), `uploads-video-backup-${timeTag}`);

function run(command, args, { capture = true } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { if (capture) stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { if (capture) stderr += chunk.toString(); });
    child.on('error', (error) => reject(new Error(`Could not launch ${command}. ${error.message}`)));
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${path.basename(command)} exited with code ${code}: ${(stderr || stdout).slice(-1800)}`));
    });
  });
}

async function assertTools() {
  try {
    const ffmpeg = await run(ffmpegBin, ['-version']);
    const ffprobe = await run(ffprobeBin, ['-version']);
    console.log(ffmpeg.stdout.split(/\r?\n/)[0] || 'ffmpeg available');
    console.log(ffprobe.stdout.split(/\r?\n/)[0] || 'ffprobe available');
  } catch (error) {
    console.error('\nFFmpeg/FFprobe could not be launched. Install FFmpeg and ensure both commands are on PATH.');
    console.error('Official FFmpeg download page: https://www.ffmpeg.org/download.html');
    console.error('If they are installed outside PATH, set FFMPEG_PATH and FFPROBE_PATH to the executable paths.');
    throw error;
  }
}

async function collectMp4s(directory) {
  const out = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      out.push(...await collectMp4s(full));
    } else if (entry.isFile() && /\.mp4$/i.test(entry.name) && !/\.hci-(?:new|old)-/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

async function probe(file) {
  const { stdout } = await run(ffprobeBin, [
    '-v', 'error', '-show_format', '-show_streams', '-of', 'json', file,
  ]);
  const data = JSON.parse(stdout);
  const video = (data.streams || []).find((stream) => stream.codec_type === 'video');
  const audio = (data.streams || []).find((stream) => stream.codec_type === 'audio');
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
  };
}

function isBrowserFriendly(info) {
  return info.videoCodec === 'h264'
    && info.pixelFormat === 'yuv420p'
    && (!info.hasAudio || info.audioCodec === 'aac');
}

function formatMb(bytes) { return bytes == null || bytes === '' ? '' : (Number(bytes) / 1_000_000).toFixed(3); }
function rel(file) { return path.relative(root, file).split(path.sep).join('/'); }

function scaleOptions(info) {
  const sourceMax = Math.max(info.width, info.height);
  const bounds = [null, ...scaleBounds.filter((bound) => bound < sourceMax)];
  return [...new Set(bounds.map((bound) => bound === null ? 'original' : String(bound)))]
    .map((value) => value === 'original' ? null : Number(value));
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
  );
  if (info.hasAudio) {
    args.push('-c:a', 'aac', '-b:a', `${audioKbps}k`, '-ac', '2');
  } else {
    args.push('-an');
  }
  args.push('-f', 'mp4', outputPath);
  await run(ffmpegBin, args);
  const candidateInfo = await probe(outputPath);
  if (!isBrowserFriendly(candidateInfo)) {
    throw new Error(`Encoder output is not compatible H.264/AAC: ${candidateInfo.videoCodec}/${candidateInfo.pixelFormat}/${candidateInfo.audioCodec}`);
  }
  return candidateInfo;
}

async function writeReports(records) {
  const columns = [
    'path', 'status', 'originalBytes', 'outputBytes', 'originalMB', 'outputMB',
    'durationSeconds', 'originalVideoCodec', 'originalAudioCodec', 'outputVideoCodec',
    'outputAudioCodec', 'outputWidth', 'outputHeight', 'crf', 'audioKbps', 'scaleMaxDimension', 'note',
  ];
  const esc = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const lines = [columns.map(esc).join(','), ...records.map((record) => columns.map((col) => esc(record[col])).join(','))];
  await fs.writeFile(reportCsv, lines.join('\r\n'), 'utf8');
  await fs.writeFile(reportJson, JSON.stringify({
    generatedAt: new Date().toISOString(),
    root,
    maxMBExclusive: maxMb,
    dryRun,
    backupDirectory: apply ? backupRoot : null,
    summary: records.reduce((acc, rec) => { acc[rec.status] = (acc[rec.status] || 0) + 1; return acc; }, {}),
    records,
  }, null, 2), 'utf8');
}

async function backupAndReplace(sourcePath, candidatePath) {
  const relative = path.relative(root, sourcePath);
  const backupPath = path.join(backupRoot, relative);
  const siblingStage = `${sourcePath}.hci-new-${randomUUID()}.mp4`;
  await fs.mkdir(path.dirname(backupPath), { recursive: true });
  await fs.copyFile(candidatePath, siblingStage);
  const stagedStat = await fs.stat(siblingStage);
  if (stagedStat.size >= maxBytesExclusive) {
    await fs.rm(siblingStage, { force: true });
    throw new Error('Staged output exceeds the configured size limit. Original was not replaced.');
  }
  try {
    // Backup uses rename within the same filesystem, then the new file is renamed into place.
    // If the second rename fails, restore the original from its backup.
    await fs.rename(sourcePath, backupPath);
    try {
      await fs.rename(siblingStage, sourcePath);
    } catch (error) {
      await fs.rename(backupPath, sourcePath);
      throw error;
    }
    return backupPath;
  } catch (error) {
    await fs.rm(siblingStage, { force: true }).catch(() => {});
    // If the original was moved to backup but target is missing, attempt a rollback.
    try {
      await fs.access(sourcePath);
    } catch {
      try { await fs.rename(backupPath, sourcePath); } catch { /* keep backup intact for manual recovery */ }
    }
    throw error;
  }
}

async function processOne(file) {
  const relative = rel(file);
  const originalBytes = (await fs.stat(file)).size;
  const base = {
    path: relative,
    status: '',
    originalBytes,
    outputBytes: '',
    originalMB: formatMb(originalBytes),
    outputMB: '',
    durationSeconds: '',
    originalVideoCodec: '',
    originalAudioCodec: '',
    outputVideoCodec: '',
    outputAudioCodec: '',
    outputWidth: '',
    outputHeight: '',
    crf: '',
    audioKbps: '',
    scaleMaxDimension: 'original',
    note: '',
  };
  let candidatePath = path.join(os.tmpdir(), `hci-video-${randomUUID()}.mp4`);
  let selectedPathForCleanup = null;
  try {
    const info = await probe(file);
    Object.assign(base, {
      durationSeconds: Number(info.duration.toFixed(3)),
      originalVideoCodec: info.videoCodec,
      originalAudioCodec: info.audioCodec,
    });

    if (info.bytes < maxBytesExclusive && isBrowserFriendly(info)) {
      base.status = 'SKIPPED_ALREADY_OPTIMIZED';
      base.outputBytes = info.bytes;
      base.outputMB = formatMb(info.bytes);
      base.outputVideoCodec = info.videoCodec;
      base.outputAudioCodec = info.audioCodec;
      base.outputWidth = info.width;
      base.outputHeight = info.height;
      base.note = 'Already below target and encoded as broadly compatible H.264/AAC; original preserved.';
      console.log(`[SKIP] ${relative} (${formatMb(info.bytes)} MB, compatible)`);
      return base;
    }

    let best = null;
    const scales = scaleOptions(info);
    let attempts = 0;
    const selectedPath = path.join(os.tmpdir(), `hci-video-selected-${randomUUID()}.mp4`);
    selectedPathForCleanup = selectedPath;

    // At each resolution, test very high quality first. If it is too large, test
    // CRF 32; if that fits, binary-search the lowest CRF (best visual quality) that
    // fits. This avoids encoding every possible CRF value for every video.
    search:
    for (const maxDimension of scales) {
      const bitrates = info.hasAudio ? audioBitrates : [0];
      for (const audioKbps of bitrates) {
        await fs.rm(candidatePath, { force: true }).catch(() => {});
        attempts++;
        const highQuality = await encodeCandidate(file, candidatePath, info, maxDimension, CRF_HIGHEST_QUALITY, audioKbps);
        if (highQuality.bytes < maxBytesExclusive) {
          await fs.copyFile(candidatePath, selectedPath);
          best = { ...highQuality, crf: CRF_HIGHEST_QUALITY, audioKbps, maxDimension, attempts, selectedPath };
          break search;
        }

        await fs.rm(candidatePath, { force: true }).catch(() => {});
        attempts++;
        const maxCompression = await encodeCandidate(file, candidatePath, info, maxDimension, CRF_MAX_COMPRESSION, audioKbps);
        if (maxCompression.bytes >= maxBytesExclusive) {
          // If even CRF 32 is too large, a higher quality CRF at this same resolution
          // will not help. Try a smaller resolution or a lower audio bitrate instead.
          continue;
        }

        let low = CRF_HIGHEST_QUALITY; // known not to fit
        let high = CRF_MAX_COMPRESSION; // known to fit
        let selectedInfo = maxCompression;
        await fs.copyFile(candidatePath, selectedPath);
        while (high - low > 1) {
          const mid = Math.floor((low + high) / 2);
          await fs.rm(candidatePath, { force: true }).catch(() => {});
          attempts++;
          const trial = await encodeCandidate(file, candidatePath, info, maxDimension, mid, audioKbps);
          if (trial.bytes < maxBytesExclusive) {
            high = mid;
            selectedInfo = trial;
            await fs.copyFile(candidatePath, selectedPath);
          } else {
            low = mid;
          }
        }
        best = { ...selectedInfo, crf: high, audioKbps, maxDimension, attempts, selectedPath };
        break search;
      }
    }


    if (!best) {
      base.status = 'OVER_LIMIT_SOURCE_PRESERVED';
      base.note = `No H.264/AAC candidate fit below ${maxBytesExclusive.toLocaleString()} bytes after ${attempts} attempts. Original left unchanged to avoid unacceptable quality loss.`;
      console.warn(`[OVER LIMIT] ${relative}; original preserved`);
      return base;
    }

    base.outputBytes = best.bytes;
    base.outputMB = formatMb(best.bytes);
    base.outputVideoCodec = best.videoCodec;
    base.outputAudioCodec = best.audioCodec;
    base.outputWidth = best.width;
    base.outputHeight = best.height;
    base.crf = best.crf;
    base.audioKbps = info.hasAudio ? best.audioKbps : '';
    base.scaleMaxDimension = best.maxDimension ?? 'original';
    base.note = `Candidate uses CRF ${best.crf}; scale ceiling ${best.maxDimension ?? 'original'}; attempts ${best.attempts}.`;

    if (dryRun) {
      base.status = 'DRY_RUN_WOULD_OPTIMIZE';
      console.log(`[DRY RUN] ${relative}: ${formatMb(info.bytes)} MB -> ${formatMb(best.bytes)} MB, CRF ${best.crf}, scale ${best.maxDimension ?? 'original'}`);
      return base;
    }

    const backupPath = await backupAndReplace(file, best.selectedPath);
    base.status = 'OPTIMIZED_AND_REPLACED';
    base.note += ` Original backed up to ${path.relative(path.dirname(root), backupPath).split(path.sep).join('/')}.`;
    console.log(`[OPTIMIZED] ${relative}: ${formatMb(info.bytes)} MB -> ${formatMb(best.bytes)} MB`);
    return base;
  } catch (error) {
    base.status = 'ERROR';
    base.note = error?.message || String(error);
    console.error(`[ERROR] ${relative}: ${base.note}`);
    return base;
  } finally {
    await fs.rm(candidatePath, { force: true }).catch(() => {});
    if (selectedPathForCleanup) await fs.rm(selectedPathForCleanup, { force: true }).catch(() => {});
  }
}

async function main() {
  try {
    await fs.access(root);
    const rootStat = await fs.stat(root);
    if (!rootStat.isDirectory()) throw new Error(`Root is not a directory: ${root}`);
    await assertTools();
    const all = await collectMp4s(root);
    let files = all;
    if (only) {
      const wanted = only.replaceAll('\\', '/').replace(/^\/+/, '');
      files = all.filter((file) => rel(file).toLowerCase() === wanted.toLowerCase());
      if (files.length === 0) throw new Error(`--only did not match an MP4 under uploads: ${wanted}`);
    }
    console.log(`Mode: ${dryRun ? 'DRY RUN (no original files will be changed)' : 'APPLY (original files will be backed up and replaced when a suitable candidate is found)'}`);
    console.log(`Root: ${root}`);
    console.log(`MP4 files found: ${files.length}`);
    console.log(`Required output size: strictly less than ${maxBytesExclusive.toLocaleString()} bytes (${maxMb} decimal MB).`);
    console.log(`Worker concurrency: ${concurrency}`);
    if (apply) console.log(`Backup directory (outside uploads): ${backupRoot}`);

    const records = [];
    let nextIndex = 0;
    let reportQueue = Promise.resolve();
    const saveReportsSafely = () => {
      reportQueue = reportQueue.then(() => writeReports(records));
      return reportQueue;
    };
    async function worker() {
      while (nextIndex < files.length) {
        const index = nextIndex++;
        const record = await processOne(files[index]);
        records.push(record);
        // Save incremental reports so progress is not lost if a later video fails.
        await saveReportsSafely();
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
    if (dryRun) console.log('\nDry run only. To apply after reviewing the CSV, rerun with --apply and without --dry-run.');
  } catch (error) {
    console.error('\nVideo optimization stopped:', error.message || error);
    process.exitCode = 1;
  }
}

main();
