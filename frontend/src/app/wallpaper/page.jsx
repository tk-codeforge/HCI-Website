import { getGallerySlugMap, pageGalleryHref } from "@/utils/slugEdit";
import MainLayout from "../layouts/MainLayout";
import WallpaperCard from "../components/WallpaperCard";
import { defaultAltText } from "@/utils/helper";
import { buildTextShadow } from "@/utils/textShadow";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import { MediaBg } from "../components/MediaImage";
import JsonLd from "../components/JsonLd";
// --- CONFIGURATION ---
export const revalidate = 60; // Regenerate page every 60 seconds

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// CMS descriptions are saved as HTML (CKEditor). Cards expect plain text.
const stripHtml = (html = "") =>
  String(html ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|div|li|h[1-6])>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

// --- HELPER: Fetch Wallpaper Data ---
async function getWallpaperData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-parent-child/wallpaper`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch wallpaper data: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Wallpaper Data Fetch Error:", err);
    return [];
  }
}

// --- HELPER: Fetch SEO Data ---
async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/wallpaper")}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

async function getHeadingDescriptionData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/manage_heading_description`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const record = await res.json();
    const data = Array.isArray(record) ? record[0] : record;
    return data?.json_content?.sections?.wallpaper || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}

// --- DYNAMIC METADATA GENERATION ---
export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title || "Customized wallpapers for your home - High Creation Interior";
  const description =
    seo?.meta_description ||
    "Transform your walls with stunning wallpapers that add style, texture, and personality to any space. Explore our collection of wall papers for every taste and design.";

  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/wallpaper",
  });
  const { index, follow } = seo
    ? getRobotsDirectives(seo)
    : { index: true, follow: true };

  return {
    title,
    description,
    ...(seo?.keywords && { keywords: seo.keywords }),
    alternates: { canonical },
    robots: { index, follow },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      type: "website",
      images: seo?.og_image
        ? [{ url: seo.og_image, width: 1200, height: 630 }]
        : [{ url: "/images/new_hc_logo.png" }],
    },
  };
}

// --- MAIN SERVER COMPONENT ---
export default async function Wallpaper() {
  // Four independent fetches: run them together instead of one after another.
  const [seo, slugMap, exclusiveDesignData, headingData] = await Promise.all([
    getSeoData(),
    getGallerySlugMap("wallpaper"),
    getWallpaperData(),
    getHeadingDescriptionData(),
  ]);

  const HeadingTag = headingData?.headingTag || "h1";
  const headingText = headingData?.headingText || "Wallpaper";
  const headingStyle = {
    textShadow: buildTextShadow(
      headingData?.headingShadowEnabled,
      headingData?.headingShadowIntensity
    ),
    fontFamily: "inherit",
    ...(headingData?.headingColor && { color: headingData.headingColor }),
  };

  const descriptionText =
    headingData?.descriptionText ||
    "Your walls deserve more than just paint—they deserve a statement. Discover our premium wallpaper collection, where striking designs meet timeless elegance. From bold textures to refined patterns, every wallpaper is crafted to transform ordinary spaces into unforgettable interiors.";
  const descriptionStyle = {
    ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
    textShadow: buildTextShadow(
      headingData?.descriptionShadowEnabled,
      headingData?.descriptionShadowIntensity
    ),
  };

  const bannerImage = headingData?.bannerImage || "";

  const headingBlock = (
    <>
      <HeadingTag id="wallpaper-heading" className="wallpaperHeading" style={headingStyle}>
        {headingText}
      </HeadingTag>
      <p id="wallpaper-description" className="px-lg-5 fs-6 text-muted" style={descriptionStyle}>
        {descriptionText}
      </p>
      <style>{`
        ${headingData?.headingColor ? `#wallpaper-heading { color: ${headingData.headingColor} !important; }` : ""}
        ${headingData?.descriptionColor ? `#wallpaper-description { color: ${headingData.descriptionColor} !important; }` : ""}
        ${headingData?.descriptionFontSize ? `#wallpaper-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
        #wallpaper-heading { text-shadow: ${buildTextShadow(headingData?.headingShadowEnabled, headingData?.headingShadowIntensity)} !important; }
        #wallpaper-description { text-shadow: ${buildTextShadow(headingData?.descriptionShadowEnabled, headingData?.descriptionShadowIntensity)} !important; }
      `}</style>
    </>
  );

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <main>
        {bannerImage ? (
          <MediaBg
            src={bannerImage}
            alt={headingData?.bannerAlt}
            fallbackAlt={headingText}
            className="w-100 d-flex align-items-center justify-content-center"
            style={{ aspectRatio: "1900 / 441" }}
            priority
            optimizeImage
          >
            <div className="container text-center py-5">{headingBlock}</div>
          </MediaBg>
        ) : (
          <div className="container">
            <div className="text-center mt-3 mx-0 row">{headingBlock}</div>
          </div>
        )}

        <section className={bannerImage ? "container my-5" : "container mb-5"}>
          <div className="row g-4 mx-0">
            {exclusiveDesignData && exclusiveDesignData.length > 0 ? (
              exclusiveDesignData.map((design, index) => (
                <div key={index} className="col-lg-6 col-md-6 col-12">
                  <WallpaperCard
                    linkTagWallpaper={pageGalleryHref("wallpaper", slugMap, design?.id)}
                    wallpaperCard="wallpapercard"
                    imgWallpaper={
                      design?.child_content?.image ?? "/images/Bhk/1bhk.png"
                    }
                    wallpaperImgClass="wallpaperclass"
                    imgAspectRatio="1.75"
                    optimizeImage
                    // the first card is the LCP image, unless a banner sits above it
                    imgPriority={!bannerImage && index === 0}
                    altWallpaper={
                      design?.child_content?.title ?? defaultAltText
                    }
                    cmsAltWallpaper={design?.child_content?.image_alt}
                    portfolioTitle={design?.child_content?.title}
                    wallpaperDescriptiion={stripHtml(design?.child_content?.description)}
                    descriptionClass="team_description mb-0"
                    textBtnWallpaper="View Design"
                    btnHrefWallpaper={pageGalleryHref("wallpaper", slugMap, design?.id)}
                  />
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Loading wallpapers...</p>
              </div>
            )}
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
}
