// Helpers for the extra experience-center fields (Noida, Gurugram, Faridabad, Noida Extension, New Delhi).
//
// STORAGE (no backend change): the backend's update() merges ANY posted field into the record's
// `child_content` JSON, so the new fields live on records that already exist:
//
//  Video record (page_type experience_center_video) -> first-screen block:
//    poster, hero_h1, hero_address, hero_hours, hero_phone, hero_map_embed_url,
//    hero_h1_tag, hero_directions_url, hero_call_label, hero_directions_label, hero_book_label, hero_book_url
//  Each parent card record (page_type experience_center):
//    title_tag, child_heading, child_heading_tag, child_html
//
// Plain module: safe to import from server components AND from the CMS page.

export const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
// Tags used today - applied when nothing is chosen in the CMS (no visual change).
export const DEFAULT_CARD_TAG = "h4";
export const DEFAULT_CHILD_TAG = "h4";
export const DEFAULT_H1 = "HCI Experience Center, Sector 63 Noida";

const str = (v, fallback = "") => (typeof v === "string" ? v : fallback);
export const safeTag = (tag, fallback) => (HEADING_TAGS.includes(tag) ? tag : fallback);

/** "HCI Experience Center, New Delhi" -> "New Delhi" (default address = the city; editable in CMS) */
export const defaultAddressFromH1 = (h1) =>
  str(h1).replace(/^\s*HCI Experience Center,?\s*/i, "").trim();

/**
 * video record child_content -> hero settings (defaults filled in).
 * defaultH1 is per center (e.g. "HCI Experience Center, Gurugram"); the default address is its city part.
 */
export function heroFromContent(cc, defaultH1 = DEFAULT_H1) {
  const c = cc && typeof cc === "object" ? cc : {};
  const savedH1 = str(c.hero_h1).trim();
  // Noida's default H1 saved on another center's record is always accidental -> use that center's default.
  const h1 =
    !savedH1 || (defaultH1 !== DEFAULT_H1 && savedH1 === DEFAULT_H1) ? defaultH1 : savedH1;
  return {
    h1,
    h1Tag: safeTag(c.hero_h1_tag, "h1"), // h1 - h6
    address: str(c.hero_address).trim() ? str(c.hero_address) : defaultAddressFromH1(defaultH1),
    hours: str(c.hero_hours), // one line per row
    phone: str(c.hero_phone),
    mapEmbedUrl: str(c.hero_map_embed_url),
    directionsUrl: str(c.hero_directions_url), // empty = built from the address
    callLabel: str(c.hero_call_label).trim() || "Call Now",
    directionsLabel: str(c.hero_directions_label).trim() || "Get Directions",
    bookVisitLabel: str(c.hero_book_label).trim() || "Book a Visit",
    bookVisitUrl: str(c.hero_book_url).trim() || "/contact",
    poster: str(c.poster),
  };
}

/** parent record child_content -> child page heading/text settings */
export function childFromContent(cc) {
  const c = cc && typeof cc === "object" ? cc : {};
  return {
    heading: str(c.child_heading),
    headingTag: safeTag(c.child_heading_tag, ""),
    html: str(c.child_html),
  };
}

/* ---------- small safe helpers ---------- */

const digitsOnly = (v) => String(v ?? "").replace(/\D/g, "");

/** "70707 01373" -> "tel:+917070701373"; 10 digits get the India country code */
export function toTelHref(phone) {
  const digits = digitsOnly(phone);
  if (!digits) return "";
  return `tel:+${digits.length === 10 ? `91${digits}` : digits}`;
}

/** Accept a pasted <iframe ...> snippet or a plain URL; return a safe Google Maps embed URL or "" */
export function normalizeMapEmbedUrl(input) {
  let value = str(input).trim();
  if (!value) return "";
  const match = value.match(/src\s*=\s*["']([^"']+)["']/i);
  if (match) value = match[1];
  value = value.replace(/&amp;/g, "&");
  try {
    const url = new URL(value);
    const okHost = url.hostname === "www.google.com" || url.hostname === "maps.google.com";
    const okPath = url.pathname.startsWith("/maps/embed") || url.searchParams.get("output") === "embed";
    return url.protocol === "https:" && okHost && okPath ? url.toString() : "";
  } catch {
    return "";
  }
}

const isInternalOrHttps = (v) => /^\/(?!\/)/.test(v) || /^https:\/\//i.test(v);

export const safeLink = (value, fallback = "") => {
  const v = str(value).trim();
  return v && isInternalOrHttps(v) ? v : fallback;
};

/** the backend builds image URLs from BASE_URL (may be http) - upgrade to https except on localhost */
export const forceHttps = (url) =>
  str(url).replace(/^http:\/\/(?!localhost|127\.)/i, "https://");

export function buildDirectionsHref(hero) {
  const custom = safeLink(hero?.directionsUrl);
  if (custom) return custom;
  const q = str(hero?.address).replace(/\s+/g, " ").trim() || str(hero?.h1) || DEFAULT_H1;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
}

export const hoursLines = (hours) =>
  str(hours)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

/* ---------- poster upload rule: WebP only, max 200 KB ---------- */

export const POSTER_MAX_KB = 200;

/** returns an error message string, or "" when the file is a valid poster */
export function validatePosterFile(file) {
  if (!file) return "";
  const isWebp = file.type === "image/webp" || /\.webp$/i.test(file.name || "");
  if (!isWebp) return "Poster must be a WebP image (.webp).";
  if (file.size > POSTER_MAX_KB * 1024) {
    return `Poster must be under ${POSTER_MAX_KB} KB (this file is ${Math.round(file.size / 1024)} KB).`;
  }
  return "";
}
