// SERVER-ONLY. Reads the real pixel size of remote images so the <img> can get width/height
// attributes (the browser then reserves the exact box before the file arrives => no layout shift).
//
// It downloads only the first ~128 KB of each image (HTTP Range) and lets sharp read the header.
// Anything that goes wrong (timeout, host down, odd format) just returns null and the page renders
// exactly as it did before.
//
// It uses node:http / node:https directly (NOT fetch) on purpose: Next patches fetch with its data
// cache, and a `no-store` fetch would turn a statically generated (ISR) page into a dynamic one.
// Plain Node requests are invisible to Next, so this is safe in static AND dynamic routes.
// (Server components only: importing it from a client component fails the build, by design.)
import http from "node:http";
import https from "node:https";
import sharp from "sharp";

const PROBE_BYTES = 128 * 1024;
const TIMEOUT_MS = 2000;
const TTL_MS = 60 * 60 * 1000;
const MAX_ENTRIES = 500;
const cache = new Map(); // url -> { at, size }

// libwebp refuses truncated files (it validates the RIFF length), but WebP keeps its size in the first
// 30 bytes, so read it directly: VP8 (lossy), VP8L (lossless) and VP8X (extended: alpha/EXIF/animation).
function webpSize(b) {
  if (b.length < 30 || b.toString("latin1", 0, 4) !== "RIFF" || b.toString("latin1", 8, 12) !== "WEBP") return null;
  const type = b.toString("latin1", 12, 16);
  if (type === "VP8X") return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
  if (type === "VP8L") {
    if (b[20] !== 0x2f) return null;
    const bits = b.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  if (type === "VP8 ") {
    if (b[23] !== 0x9d || b[24] !== 0x01 || b[25] !== 0x2a) return null;
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  return null;
}

// First `maxBytes` of the file (or less if it is smaller), or null on any problem.
function fetchHead(url, maxBytes, timeoutMs) {
  return new Promise((resolve) => {
    let done = false;
    let req = null;
    let timer = null;
    const finish = (value) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { req && req.destroy(); } catch {}   // stops the download if the server ignored Range
      resolve(value);
    };
    timer = setTimeout(() => finish(null), timeoutMs);
    try {
      const lib = url.startsWith("https:") ? https : http;
      req = lib.get(url, { headers: { Range: `bytes=0-${maxBytes - 1}`, "User-Agent": "hc-image-probe" } }, (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {   // incl. redirects: just skip
          res.resume();
          return finish(null);
        }
        const chunks = [];
        let total = 0;
        res.on("data", (c) => {
          chunks.push(c);
          total += c.length;
          if (total >= maxBytes) finish(Buffer.concat(chunks));
        });
        res.on("end", () => finish(Buffer.concat(chunks)));
        res.on("error", () => finish(null));
      });
      req.on("error", () => finish(null));
    } catch {
      finish(null);
    }
  });
}

async function probe(url) {
  try {
    const head = await fetchHead(url, PROBE_BYTES, TIMEOUT_MS);
    if (!head || !head.length) return null;

    const webp = webpSize(head);
    if (webp && webp.width > 0 && webp.height > 0) return webp;

    const meta = await sharp(head, { failOn: "none" }).metadata();
    if (!meta.width || !meta.height) return null;
    // Browsers honour EXIF rotation, so a "portrait" JPEG stored sideways must swap.
    const rotated = meta.orientation >= 5 && meta.orientation <= 8;
    return rotated ? { width: meta.height, height: meta.width } : { width: meta.width, height: meta.height };
  } catch {
    return null;
  }
}

export async function getImageSize(url) {
  if (typeof url !== "string" || !/^https?:\/\//i.test(url)) return null;
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.size;
  const size = await probe(url);
  if (size) {
    if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value);
    cache.set(url, { at: Date.now(), size });
  }
  return size;
}

// -> { [url]: { width, height } } for the URLs that could be measured
export async function getImageSizes(urls = []) {
  const unique = [...new Set(urls.filter(Boolean))];
  const sizes = await Promise.all(unique.map(getImageSize));
  const out = {};
  unique.forEach((u, i) => {
    if (sizes[i]) out[u] = sizes[i];
  });
  return out;
}