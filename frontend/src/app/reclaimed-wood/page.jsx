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

// --- HELPER: Fetch Reclaimed Wood Data ---
async function getReclaimedWoodData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/cms-parent-child/sustainable_furniture_reclaimed_wood`,
      {
        // cache handled by page revalidate
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch reclaimed wood data: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Reclaimed Wood Data Fetch Error:", err);
    return [];
  }
}


async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/reclaimed-wood")}`,
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
    return data?.json_content?.sections?.reclaimed_wood || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}


export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title || "Custom Reclaimed wood furniture for your home - High Creation Interior";
  const description =
    seo?.meta_description ||
   "Bring character to your home with High Creation Interior's custom reclaimed wood furniture, blending sustainability with timeless craftsmanship and unique designs.";

   const ogTitle = seo?.og_title || title;
const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/reclaimed-wood",
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
export default async function ReclaimedWood() {
  const seo = await getSeoData();
  const slugMap = await getGallerySlugMap("reclaimed-wood");
  const exclusiveDesignData = await getReclaimedWoodData();

  const headingData = await getHeadingDescriptionData();

  const HeadingTag = headingData?.headingTag || "h1";
const headingText = headingData?.headingText || "Reclaimed Wood";
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
  "High Creation Interior's custom reclaimed wood furniture. Each piece is crafted with care, using sustainable wood to create unique designs that stand out. By choosing reclaimed materials, you’re not only helping the environment but also bringing history and charm into your living space. Our furniture combines timeless craftsmanship with modern style, ensuring that every item is both durable and beautiful. From rustic tables to custom storage pieces, our reclaimed wood furniture brings a touch of nature and individuality to your home, making it a truly special place to live."
const descriptionStyle = {
  ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
  textShadow: buildTextShadow(
      headingData?.descriptionShadowEnabled,
      headingData?.descriptionShadowIntensity
    ),
};

const bannerImage = headingData?.bannerImage || "";
const bannerStyle = bannerImage
  ? {
      backgroundImage: `url("${bannerImage}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      aspectRatio: "1900 / 441",
    }
  : {};

  const headingBlock = (
    <>
    <HeadingTag id="reclaimed-wood-heading" className="wallpaperHeading" style={headingStyle}>
  {headingText}
</HeadingTag>
<p id="reclaimed-wood-description" className="px-lg-5 fs-6 text-muted" style={descriptionStyle}>
  {descriptionText}
</p>
<style>{`
  ${headingData?.headingColor ? `#reclaimed-wood-heading { color: ${headingData.headingColor} !important; }` : ""}
  ${headingData?.descriptionColor ? `#reclaimed-wood-description { color: ${headingData.descriptionColor} !important; }` : ""}
  ${headingData?.descriptionFontSize ? `#reclaimed-wood-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
  #reclaimed-wood-heading { text-shadow: ${buildTextShadow(headingData?.headingShadowEnabled, headingData?.headingShadowIntensity)} !important; }
    #reclaimed-wood-description { text-shadow: ${buildTextShadow(headingData?.descriptionShadowEnabled, headingData?.descriptionShadowIntensity)} !important; }
`}</style>
</>
  );

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <main>

                  {bannerImage ? (
                    <MediaBg src={bannerImage} alt={headingData?.bannerAlt} fallbackAlt={headingText}
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

          <section className={bannerImage ? "container my-5 rattan_wrapper" : "container mb-5 rattan_wrapper"}>
          <div className="row g-4 mx-0">
            {exclusiveDesignData && exclusiveDesignData.length > 0 ? (
              exclusiveDesignData.map((design, index) => (
                <div key={index} className="col-lg-4 col-md-6 col-12">
                  <WallpaperCard
                    linkTagWallpaper={pageGalleryHref("reclaimed-wood", slugMap, design?.id)}
                    wallpaperCard="wallpapercard"
                    imgWallpaper={
                      design?.child_content?.image ?? "/images/Bhk/1bhk.png"
                    }
                    wallpaperImgClass="wallpaperclass"
                    altWallpaper={
                      design?.child_content?.title ?? defaultAltText
                    }
                                        cmsAltWallpaper={design?.child_content?.image_alt}
                    portfolioTitle={design?.child_content?.title}
                    // wallpaperDescriptiion={design?.child_content?.description}
                    wallpaperDescriptiion={stripHtml(design?.child_content?.description)}
                    descriptionClass="team_description mb-0"
                    textBtnWallpaper="View Design"
                    btnHrefWallpaper={pageGalleryHref("reclaimed-wood", slugMap, design?.id)}
                  />
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Loading reclaimed wood furniture...</p>
              </div>
            )}
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
}