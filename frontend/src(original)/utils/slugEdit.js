// src/utils/slugEdit.js  (server-side helpers for slug URLs)
export const PRODUCT_GALLERY_TYPE = "product-gallery";
export const PRODUCT_GALLERY_BASE = "/product/gallery";

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

const getJson = async (path, options = {}) => {
  try {
    const res = await fetch(`${getBaseUrl()}${path}`, options);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

// { "103": "modern-living-room", ... } for one slug type, e.g. "product-gallery"
export const getSlugMap = async (type) =>
  (await getJson(`/slug-edit/map?entityType=${encodeURIComponent(type)}`, {
    next: { revalidate: 60 },
  })) || {};

// page   = folder name under src/app, e.g. "wallpaper"
// folder = "gallery" (default) or "project-gallery"
export const getGallerySlugMap = (page, folder = "gallery") =>
  getSlugMap(`${page}-${folder}`);

// slug URL if one exists, otherwise the old ?id= URL
export const pageGalleryHref = (page, slugMap, id, folder = "gallery") =>
  slugMap?.[id]
    ? `/${page}/${folder}/${slugMap[id]}`
    : `/${page}/${folder}?id=${id}`;

// kept so product/page.jsx works unchanged
export const galleryHref = (slugMap, id) => pageGalleryHref("product", slugMap, id);

// per-center slug type for generated centers (URL: /experience-center/<center>/gallery)
export const centerType = (center) => `${center}-gallery`;

export const getCanonicalByType = async (type, id) => {
  const data = await getJson(
    `/slug-edit/by-entity?entityType=${encodeURIComponent(type)}&entityId=${encodeURIComponent(id)}`,
    { cache: "no-store" }
  );
  return data?.canonical ?? null;
};

export const getCenterSlugMap = (center) => getSlugMap(centerType(center));

export const centerGalleryHref = (center, slugMap, id) =>
  slugMap?.[id]
    ? `/${center}/gallery/${slugMap[id]}`
    : `/${center}/gallery?id=${id}`;
