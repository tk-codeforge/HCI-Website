import MainLayout from "../layouts/MainLayout";
import WallpaperCard from "../components/WallpaperCard";
import { defaultAltText } from "@/utils/helper";
import { buildTextShadow } from "@/utils/textShadow";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import { MediaBg } from "../components/MediaImage";
import { getGallerySlugMap, pageGalleryHref } from "@/utils/slugEdit";
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

// --- HELPER: Fetch Space Saving Furniture Data ---
async function getSpaceSavingFurnitureData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/cms-parent-child/space_saving_furniture`,
      // Explicit cache window, same as the other two fetches on this page. Without it the
      // request can run on every visit and push the page's TTFB up.
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      console.error(`Failed to fetch space saving furniture: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Space Saving Furniture Data Fetch Error:", err);
    return [];
  }
}

// --- HELPER: Fetch SEO Data ---
async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/spacesaving-furniture")}`,
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
    return data?.json_content?.sections?.space_saving_furniture || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}

// --- DYNAMIC METADATA GENERATION ---
export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title || "Space saving furniture for your home - High Creation Interior";
  const description =
    seo?.meta_description ||
    "Maximize your home’s potential with High Creation Interior's space-saving furniture. Stylish, functional designs crafted to optimize every inch of your living space.";

  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/spacesaving-furniture",
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
export default async function SpaceSavingFurniture() {
  // Four independent fetches: run them together instead of one after another.
  const [seo, slugMap, exclusiveDesignData, headingData] = await Promise.all([
    getSeoData(),
    getGallerySlugMap("spacesaving-furniture"),
    getSpaceSavingFurnitureData(),
    getHeadingDescriptionData(),
  ]);

  const HeadingTag = headingData?.headingTag || "h1";
  const headingText = headingData?.headingText || "Space-Saving Furniture";
  const headingShadow = buildTextShadow(
    headingData?.headingShadowEnabled,
    headingData?.headingShadowIntensity
  );
  const descriptionShadow = buildTextShadow(
    headingData?.descriptionShadowEnabled,
    headingData?.descriptionShadowIntensity
  );

  const headingStyle = {
    textShadow: headingShadow,
    fontFamily: "inherit",
    ...(headingData?.headingColor && { color: headingData.headingColor }),
  };

  const descriptionText =
    headingData?.descriptionText ||
    "Every inch matters—make it count with smart space-saving furniture by High Creation Interior. Expertly designed to maximize functionality without compromising on style, our innovative pieces create spacious, organized, and elegant interiors. From hidden storage to multifunctional designs.";
  const descriptionStyle = {
    ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
    textShadow: descriptionShadow,
  };

  const bannerImage = headingData?.bannerImage || "";

  const headingBlock = (
    <>
      <HeadingTag id="space-saving-furniture-heading" className="wallpaperHeading" style={headingStyle}>
        {headingText}
      </HeadingTag>
      <p id="space-saving-furniture-description" className="px-lg-5 fs-6 text-muted" style={descriptionStyle}>
        {descriptionText}
      </p>
      <style>{`
  ${headingData?.headingColor ? `#space-saving-furniture-heading { color: ${headingData.headingColor} !important; }` : ""}
  ${headingData?.descriptionColor ? `#space-saving-furniture-description { color: ${headingData.descriptionColor} !important; }` : ""}
  ${headingData?.descriptionFontSize ? `#space-saving-furniture-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
  #space-saving-furniture-heading { text-shadow: ${headingShadow} !important; }
  #space-saving-furniture-description { text-shadow: ${descriptionShadow} !important; }
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
                    linkTagWallpaper={pageGalleryHref("spacesaving-furniture", slugMap, design?.id)}
                    wallpaperCard="wallpapercard"
                    imgWallpaper={
                      design?.child_content?.image ?? "/images/Bhk/1bhk.png"
                    }
                    wallpaperImgClass="wallpaperclass"
                    imgAspectRatio="1.72"
                    // Request a resized rendition instead of the original CMS file.
                    optimizeImage
                    imgSizes="(min-width: 1200px) 570px, (min-width: 992px) 480px, (min-width: 768px) 50vw, 100vw"
                    // First card is the LCP element only when there is no hero banner.
                    imgPriority={index === 0 && !bannerImage}
                    // Everything else loads lazily (the browser default is eager).
                    imgLazy={!(index === 0 && !bannerImage)}
                    altWallpaper={
                      design?.child_content?.title ?? defaultAltText
                    }
                    cmsAltWallpaper={design?.child_content?.image_alt}
                    portfolioTitle={design?.child_content?.title}
                    wallpaperDescriptiion={stripHtml(design?.child_content?.description)}
                    descriptionClass="team_description mb-0"
                    textBtnWallpaper="View Design"
                    btnHrefWallpaper={pageGalleryHref("spacesaving-furniture", slugMap, design?.id)}
                  />
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Loading furniture...</p>
              </div>
            )}
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
}
