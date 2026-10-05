// src/utils/gallerySeo.js
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import { getCanonicalByType } from "@/utils/slugEdit";

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

export async function buildGalleryMetadata({
  basePath,            // "/product/gallery", "/experience-center-ghaziabad/gallery", "/luxury-projects/project-gallery"
  id,                  // the ?id= value
  itemApi,             // optional, e.g. `/cms-parent-child/by-id/${id}`, used to read the item title
  fallbackTitle,       // optional
  fallbackDescription, // optional
}) {
  if (!id) return { title: fallbackTitle || "Gallery | High Creation Interior" };

  // same type name the slug system uses: "/product/gallery" -> "product-gallery"
  const type = basePath.slice(1).replace(/\//g, "-");

  // 1) the item itself (for default title). Missing item => do not index.
  let itemTitle = fallbackTitle || "Gallery";
  if (itemApi) {
    const item = await getJson(itemApi, { next: { revalidate: 60 } });
    if (!item) {
      return { title: "Gallery", robots: { index: false, follow: false } };
    }
    itemTitle = item?.child_content?.title || item?.title || item?.name || itemTitle;
  }

  // 2) slug URL of this item, or null if no slug has been set yet
  const slugPath = await getCanonicalByType(type, id); // "/product/gallery/modern-living-room"

  // 3) SEO record from CMS > SEO Manager, keyed by the slug URL path
//   const seo = slugPath
//     ? await getJson(`/seo-tag/route?path=${encodeURIComponent(slugPath)}`, { next: { revalidate: 60 } })
//     : null;
const candidates = [slugPath, `${basePath}?id=${id}`].filter(Boolean);
  let seo = null;
  for (const p of candidates) {
    const found = await getJson(`/seo-tag/route?path=${encodeURIComponent(p)}`, { next: { revalidate: 60 } });
    if (found && typeof found === "object" && Object.keys(found).length > 0) {
      seo = found;
      break;
    }
  }

  const title = seo?.meta_title || `${itemTitle} | High Creation Interior`;
  const description =
    seo?.meta_description ||
    fallbackDescription ||
    `Explore our ${itemTitle} designs by High Creation Interior.`;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: slugPath || `${basePath}?id=${id}`,
  });
  const { index, follow } = seo ? getRobotsDirectives(seo) : { index: true, follow: true };

  return {
    title,
    description,
    ...(seo?.keywords && { keywords: seo.keywords }),
    alternates: { canonical },
    robots: { index, follow },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      ...(seo?.og_image && { images: [{ url: seo.og_image, width: 1200, height: 630 }] }),
    },
  };
}