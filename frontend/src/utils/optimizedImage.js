// Hosts that next/image is allowed to optimize. Keep in sync with images.domains in
// next.config.mjs (same list HCLandingClient uses for the hero image).
const OPTIMIZED_HOSTS = [
  "hcinterior.in",
  "www.hcinterior.in",
  "apidev.hcinterior.in",
  "localhost",
];

// Widths the Next image optimizer accepts by default (images.deviceSizes).
const DEFAULT_WIDTHS = [640, 750, 828, 1080, 1200, 1920];

export const canOptimize = (src) => {
  if (!src || typeof src !== "string") return false;
  if (/\.(svg|gif)(\?|$)/i.test(src)) return false; // the optimizer refuses these
  if (src.startsWith("//")) return false;
  if (src.startsWith("/")) return true;
  try {
    return OPTIMIZED_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
};

export const optimizedUrl = (src, width, quality = 75) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;

// Responsive srcSet pointing at the built-in /_next/image optimizer, so a plain
// <img> (and all its CSS) stays exactly as it is but downloads a resized WebP/AVIF
// instead of the multi-megabyte original. Returns undefined for hosts we cannot
// optimize, in which case the caller just uses the original src.
export const optimizedSrcSet = (src, widths = DEFAULT_WIDTHS, quality = 75) =>
  canOptimize(src)
    ? widths.map((w) => `${optimizedUrl(src, w, quality)} ${w}w`).join(", ")
    : undefined;