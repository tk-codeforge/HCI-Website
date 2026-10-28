#!/usr/bin/env node
/**
 * Fast HCI video optimizer for a small set of .mp4/.mov files.
 * - Reads videos from HCI_Videos (or --root)
 * - Produces browser-friendly MP4 files in HCI_Videos_optimized (or --output)
 * - Preserves the originals and their paths; does not modify MySQL/CMS/middleware
 * - Copies compatible MP4s already under the size limit without re-encoding
 * - Remuxes compatible MOVs without re-encoding when possible
 * - Otherwise uses a fast single-pass H.264/AAC transcode, targeting < 5,000,000 bytes
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const args = process.argv.slice(2);
function getArg(name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fallback;
}
function hasFlag(name) { return args.includes(name); }

const ROOT_ARG = getArg('--root', 'HCI_Videos');
const OUTPUT_ARG = getArg('--output', 'HCI_Videos_optimized');
const MAX_MB = Number(getArg('--max-mb', '5'));
const TARGET_MB = Number(getArg('--target-mb', '4.65'));
const CONCURRENCY = Math.max(1, Math.min(3, Number(getArg('--concurrency', '1')) || 1));
const ONLY = getArg('--only', '');
const OVERWRITE = hasFlag('--overwrite');
const DRY_RUN = hasFlag('--dry-run');
const MAX_BYTES = Math.floor(MAX_MB * 1_000_000); // decimal MB
const TARGET_BYTES = Math.floor(TARGET_MB * 1_000_000);
const CWD = process.cwd();
const ROOT = path.resolve(CWD, ROOT_ARG);
const OUTPUT = path.resolve(CWD, OUTPUT_ARG);

if (!(Number.isFinite(MAX_MB) && Number.isFinite(TARGET_MB) && MAX_BYTES > 0 && TARGET_BYTES > 0 && TARGET_BYTES < MAX_BYTES)) {
  console.error('Invalid size settings. --target-mb must be positive and smaller than --max-mb.');
  process.exit(2);
}
if (ROOT === OUTPUT || isWithin(ROOT, OUTPUT)) {
  console.error('Output folder must be separate from, and not inside, the source folder.');
  process.exit(2);
}

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}
function normalizeRel(s) { return s.replaceAll('\\', '/').replace(/^\.\//, ''); }
function run(command, commandArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > 12000) stderr = stderr.slice(-12000);
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${command} exited with code ${code}: ${stderr.trim().slice(-2500)}`));
    });
  });
}
async function probe(file) {
  const { stdout } = await run('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration,size:stream=codec_type,codec_name,width,height,avg_frame_rate',
    '-of', 'json', file,
  ]);
  const data = JSON.parse(stdout);
  const streams = data.streams ?? [];
  const video = streams.find((s) => s.codec_type === 'video');
  const audio = streams.find((s) => s.codec_type === 'audio');
  if (!video) throw new Error('No video stream found');
  const duration = Number(data.format?.duration);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('Could not read a valid video duration');
  return {
    duration,
    videoCodec: video.codec_name ?? 'unknown',
    audioCodec: audio?.codec_name ?? 'none',
    hasAudio: Boolean(audio),
    width: Number(video.width ?? 0),
    height: Number(video.height ?? 0),
    frameRate: video.avg_frame_rate ?? '',
  };
}
async function walk(dir) {
  const out = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      // Don't recursively ingest nested output/backups if a user chooses an unusual structure.
      out.push(...await walk(full));
    } else if (item.isFile() && /\.(mp4|mov)$/i.test(item.name)) {
      out.push(full);
    }
  }
  return out;
}
async function maybeRemove(file) { await fs.rm(file, { force: true }).catch(() => {}); }
function targetVideoKbps(duration, hasAudio, multiplier = 1) {
  const audioKbps = hasAudio ? 96 : 0;
  // Reserve 6% for container overhead/bitrate variation and aim below TARGET_BYTES.
  const totalKbps = (TARGET_BYTES * 8 / duration / 1000) * 0.94 * multiplier;
  return Math.max(80, Math.floor(totalKbps - audioKbps));
}
function chooseMaxDimension(videoKbps) {
  // Sensible resolution for the available bitrate; prevents very low bitrates being spent on excessive pixels.
  if (videoKbps >= 1500) return 1920;
  if (videoKbps >= 850) return 1280;
  if (videoKbps >= 480) return 960;
  return 720;
}
async function encodeMp4(input, tempOutput, info, multiplier) {
  const videoKbps = targetVideoKbps(info.duration, info.hasAudio, multiplier);
  const maxDim = chooseMaxDimension(videoKbps);
  const vf = `scale=w='min(${maxDim},iw)':h='min(${maxDim},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2`;
  const ffArgs = [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', input,
    '-map', '0:v:0', '-map', '0:a:0?', '-sn', '-dn',
    '-vf', vf,
    '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p',
    '-b:v', `${videoKbps}k`, '-maxrate', `${Math.max(videoKbps, Math.ceil(videoKbps * 1.25))}k`,
    '-bufsize', `${Math.max(videoKbps * 2, 200)}k`,
  ];
  if (info.hasAudio) ffArgs.push('-c:a', 'aac', '-b:a', '96k', '-ac', '2');
  ffArgs.push('-movflags', '+faststart', '-f', 'mp4', tempOutput);
  await run('ffmpeg', ffArgs);
  return { videoKbps, maxDim };
}
function csv(v) { return `"${String(v ?? '').replaceAll('"', '""')}"`; }
async function writeReports(rows) {
  await fs.mkdir(OUTPUT, { recursive: true });
  const fields = ['source', 'output', 'sourceBytes', 'outputBytes', 'durationSeconds', 'sourceVideoCodec', 'sourceAudioCodec', 'outputWidth', 'outputHeight', 'attempts', 'status', 'notes'];
  const csvText = [fields.map(csv).join(','), ...rows.map((r) => fields.map((f) => csv(r[f])).join(','))].join('\r\n');
  await fs.writeFile(path.join(OUTPUT, 'video-optimization-report.csv'), csvText, 'utf8');
  await fs.writeFile(path.join(OUTPUT, 'video-optimization-manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), sourceRoot: ROOT, outputRoot: OUTPUT, maxBytes: MAX_BYTES, targetBytes: TARGET_BYTES, rows }, null, 2), 'utf8');
}

async function processOne(input) {
  const relative = path.relative(ROOT, input);
  const sourceStat = await fs.stat(input);
  const outputRelative = relative.replace(/\.(mp4|mov)$/i, '.mp4');
  const outPath = path.join(OUTPUT, outputRelative);
  const rec = {
    source: normalizeRel(relative), output: normalizeRel(path.relative(OUTPUT, outPath)),
    sourceBytes: sourceStat.size, outputBytes: '', durationSeconds: '', sourceVideoCodec: '', sourceAudioCodec: '',
    outputWidth: '', outputHeight: '', attempts: 0, status: '', notes: '',
  };
  try {
    const info = await probe(input);
    Object.assign(rec, {
      durationSeconds: Number(info.duration.toFixed(3)),
      sourceVideoCodec: info.videoCodec,
      sourceAudioCodec: info.audioCodec,
    });
    if (DRY_RUN) {
      rec.status = sourceStat.size < MAX_BYTES && path.extname(input).toLowerCase() === '.mp4' && info.videoCodec === 'h264' && (!info.hasAudio || info.audioCodec === 'aac')
        ? 'DRY_RUN_WOULD_COPY_COMPATIBLE_MP4'
        : 'DRY_RUN_WOULD_OPTIMIZE';
      rec.notes = 'Dry run only; no media encoded or copied.';
      console.log(`[DRY RUN] ${rec.source} (${(sourceStat.size / 1e6).toFixed(2)} MB, ${info.duration.toFixed(1)} sec)`);
      return rec;
    }

    await fs.mkdir(path.dirname(outPath), { recursive: true });
    if (await fs.stat(outPath).then(() => true).catch(() => false)) {
      if (!OVERWRITE) {
        rec.status = 'OUTPUT_EXISTS_SKIPPED';
        rec.notes = 'Output already exists. Use --overwrite to replace it.';
        return rec;
      }
      await fs.rm(outPath, { force: true });
    }

    const ext = path.extname(input).toLowerCase();
    const compatibleCodecs = info.videoCodec === 'h264' && (!info.hasAudio || info.audioCodec === 'aac');
    if (sourceStat.size < MAX_BYTES && compatibleCodecs && ext === '.mp4') {
      await fs.copyFile(input, outPath);
      rec.outputBytes = (await fs.stat(outPath)).size;
      rec.outputWidth = info.width;
      rec.outputHeight = info.height;
      rec.status = 'COPIED_COMPATIBLE_MP4';
      rec.notes = 'Already below 5 MB with broadly compatible H.264/AAC; copied without re-encoding to preserve quality.';
      console.log(`[COPY] ${rec.source} -> ${rec.output} (${(Number(rec.outputBytes) / 1e6).toFixed(2)} MB)`);
      return rec;
    }

    // MOV (or other compatible container) may be remuxed without quality loss if it already fits.
    if (sourceStat.size < MAX_BYTES && compatibleCodecs && ext === '.mov') {
      const remuxTemp = `${outPath}.remux-temp.mp4`;
      try {
        await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', input, '-map', '0:v:0', '-map', '0:a:0?', '-c', 'copy', '-movflags', '+faststart', '-f', 'mp4', remuxTemp]);
        const remuxStat = await fs.stat(remuxTemp);
        if (remuxStat.size < MAX_BYTES) {
          await fs.rename(remuxTemp, outPath);
          const outputInfo = await probe(outPath);
          rec.outputBytes = remuxStat.size;
          rec.outputWidth = outputInfo.width;
          rec.outputHeight = outputInfo.height;
          rec.status = 'REMUXED_MOV_WITHOUT_REENCODING';
          rec.notes = 'MOV container changed to MP4 using stream copy; video/audio quality preserved.';
          console.log(`[REMUX] ${rec.source} -> ${rec.output} (${(remuxStat.size / 1e6).toFixed(2)} MB)`);
          return rec;
        }
      } catch (e) {
        rec.notes = `Lossless remux unavailable; transcoding. ${e.message.slice(0, 160)}`;
      } finally {
        await maybeRemove(remuxTemp);
      }
    }

    // Fast single-pass bitrate-based encode. Retries only if the result exceeds the strict size cap.
    const multipliers = [1, 0.88, 0.76, 0.65];
    let finalResult = null;
    for (let i = 0; i < multipliers.length; i++) {
      const temp = `${outPath}.attempt-${i + 1}.tmp.mp4`;
      await maybeRemove(temp);
      const settings = await encodeMp4(input, temp, info, multipliers[i]);
      const st = await fs.stat(temp);
      rec.attempts = i + 1;
      console.log(`[ENCODE ${i + 1}/${multipliers.length}] ${rec.source}: ${(st.size / 1e6).toFixed(2)} MB, ${settings.videoKbps} kbps, max ${settings.maxDim}px`);
      if (st.size < MAX_BYTES) {
        finalResult = { temp, st, settings };
        break;
      }
      await maybeRemove(temp);
    }
    if (!finalResult) {
      rec.status = 'OVER_LIMIT_SOURCE_PRESERVED';
      rec.notes = 'Could not produce an MP4 below the strict size cap in the fast encoding attempts. Source file remains untouched; consider a lower resolution or a larger cap.';
      return rec;
    }
    await fs.rename(finalResult.temp, outPath);
    const outputInfo = await probe(outPath);
    rec.outputBytes = finalResult.st.size;
    rec.outputWidth = outputInfo.width;
    rec.outputHeight = outputInfo.height;
    rec.status = 'ENCODED_MP4';
    rec.notes = `H.264/AAC MP4; one-pass fast preset; chosen bitrate ${finalResult.settings.videoKbps} kbps; max dimension ${finalResult.settings.maxDim}px.`;
    console.log(`[OK] ${rec.source} -> ${rec.output} (${(finalResult.st.size / 1e6).toFixed(2)} MB)`);
    return rec;
  } catch (error) {
    rec.status = 'ERROR';
    rec.notes = error?.message ?? String(error);
    console.error(`[ERROR] ${rec.source}: ${rec.notes}`);
    return rec;
  }
}

async function main() {
  try {
    await fs.access(ROOT);
  } catch {
    console.error(`Source folder not found: ${ROOT}`);
    console.error('Run this from backend root, or pass --root with the correct folder.');
    process.exit(1);
  }
  // Confirm required tools before scanning videos.
  try {
    await run('ffmpeg', ['-version']);
    await run('ffprobe', ['-version']);
  } catch (err) {
    console.error('FFmpeg and FFprobe must be installed and available on PATH.');
    console.error(err.message);
    process.exit(1);
  }
  let files = await walk(ROOT);
  if (ONLY) {
    const desired = normalizeRel(ONLY).toLowerCase();
    files = files.filter((f) => normalizeRel(path.relative(ROOT, f)).toLowerCase() === desired);
    if (!files.length) {
      console.error(`No video matched --only "${ONLY}" inside ${ROOT}`);
      process.exit(1);
    }
  }
  if (!files.length) {
    console.log(`No .mp4 or .mov files found inside ${ROOT}`);
    process.exit(0);
  }
  console.log(`Source: ${ROOT}`);
  console.log(`Output: ${OUTPUT}`);
  console.log(`Found ${files.length} MP4/MOV file(s); maximum=${MAX_MB} MB, target=${TARGET_MB} MB, concurrency=${CONCURRENCY}${DRY_RUN ? ', DRY RUN' : ''}.`);
  await fs.mkdir(OUTPUT, { recursive: true });
  const results = [];
  let cursor = 0;
  async function worker() {
    while (cursor < files.length) {
      const index = cursor++;
      results[index] = await processOne(files[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, files.length) }, () => worker()));
  await writeReports(results);
  const tally = {};
  for (const row of results) tally[row.status] = (tally[row.status] ?? 0) + 1;
  console.log('\nFinished. Summary:');
  console.log(`Total scanned: ${files.length}`);
  for (const [status, count] of Object.entries(tally)) console.log(`${status}: ${count}`);
  console.log(`CSV report: ${path.join(OUTPUT, 'video-optimization-report.csv')}`);
  console.log(`JSON manifest: ${path.join(OUTPUT, 'video-optimization-manifest.json')}`);
  console.log('\nOriginal videos were not modified or deleted. Upload the MP4 outputs from the optimized folder through your CMS after reviewing them.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
