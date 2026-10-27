import { getGallerySlugMap, pageGalleryHref } from "@/utils/slugEdit";
import MainLayout from "../layouts/MainLayout";
import BgImageCard from "../components/BgImageCard";
import { buildTextShadow } from "@/utils/textShadow";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import { MediaBg } from "../components/MediaImage";
import JsonLd from "../components/JsonLd";

export const revalidate = 60;

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

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

async function getDesignerChoices() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-parent-child/designer_choice`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Designer Choice Fetch Error:", err);
    return [];
  }
}

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/designer-choice")}`,
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
    return data?.json_content?.sections?.designer_choice || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}

export async function generateMetadata() {
  const seo = await getSeoData();
  const title = seo?.meta_title || "High Creation Interior - Interior Design Gallery";
  const description = seo?.meta_description || "Explore Interior Design gallery designed by Top interior designers at High Creation Interior.";
  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/designer-choice",
  });
  const { index, follow } = seo ? getRobotsDirectives(seo) : { index: true, follow: true };

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

export default async function DesignerChoice() {
  // Independent requests run together instead of one after another.
  const [seo, slugMap, designIdea, headingData] = await Promise.all([
    getSeoData(),
    getGallerySlugMap("designer-choice"),
    getDesignerChoices(),
    getHeadingDescriptionData(),
  ]);

  const sortedDesignIdea = [...designIdea].sort((a, b) => b.id - a.id);
  const staticRecords = sortedDesignIdea.slice(-5);
  const latestRecords = sortedDesignIdea.slice(0, -5);

  const HeadingTag = headingData?.headingTag || "h1";
  const headingText = headingData?.headingText || "Designer Choice";
  const headingStyle = {
    textShadow: buildTextShadow(headingData?.headingShadowEnabled, headingData?.headingShadowIntensity),
    fontFamily: "inherit",
    ...(headingData?.headingColor && { color: headingData.headingColor }),
  };

  const descriptionText =
    headingData?.descriptionText ||
    "Explore our curated selection of stunning interior designs, blending luxury, functionality, and innovation. From modern minimalism to timeless elegance, each space is crafted to inspire. Discover bespoke designs, premium materials, and expert craftsmanship that transform homes into masterpieces. Elevate your interiors with our exclusive designer choices.";
  const descriptionStyle = {
    ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
    textShadow: buildTextShadow(headingData?.descriptionShadowEnabled, headingData?.descriptionShadowIntensity),
  };

  const bannerImage = headingData?.bannerImage || "";

  const headingBlock = (
    <>
      <HeadingTag id="designer-choice-heading" className="wallpaperHeading" style={headingStyle}>
        {headingText}
      </HeadingTag>
      <p id="designer-choice-description" className="px-lg-5 fs-6 text-muted" style={descriptionStyle}>
        {descriptionText}
      </p>
      <style>{`
        ${headingData?.headingColor ? `#designer-choice-heading { color: ${headingData.headingColor} !important; }` : ""}
        ${headingData?.descriptionColor ? `#designer-choice-description { color: ${headingData.descriptionColor} !important; }` : ""}
        ${headingData?.descriptionFontSize ? `#designer-choice-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
        #designer-choice-heading { text-shadow: ${buildTextShadow(headingData?.headingShadowEnabled, headingData?.headingShadowIntensity)} !important; }
        #designer-choice-description { text-shadow: ${buildTextShadow(headingData?.descriptionShadowEnabled, headingData?.descriptionShadowIntensity)} !important; }
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
            alt={headingData?.bannerAlt || headingText} 
            fallbackAlt={headingText}
            className="w-100 d-flex align-items-center justify-content-center"
            style={{ aspectRatio: "1900 / 441" }}
            priority={true}
            optimizeImage
          >
            <div className="container text-center py-5">{headingBlock}</div>
          </MediaBg>
        ) : (
          <div className="container">
            <div className="text-center mt-3 mx-0 row">{headingBlock}</div>
          </div>
        )}

        <section className="container my-0">
          {staticRecords.length > 0 && (
            <div className="mt-0 row g-4 mx-0">
              {staticRecords.map((record, index) => {
                const colClass = index === 0 || index === 3 ? "col-lg-5 col-md-6 col-12" : index === 4 ? "col-lg-12" : "col-lg-7 col-md-6 col-12";
                return (
                  <div className={colClass} key={record.id}>
                    <BgImageCard
                      style={{
                        backgroundImage: `url(${record?.child_content?.image})`,
                      }}
                      cardLinkTag={pageGalleryHref("designer-choice", slugMap, record?.id)}
                      designerCardBgDiv={"designercard designercardimg1"}
                      titleBgImage={record?.child_content?.title}
                      imageAlt={record?.child_content?.image_alt || record?.child_content?.title || "Designer Choice Project"}
                      descriptionBg={stripHtml(record?.child_content?.description)}
                      priority={!bannerImage && index === 0} // first card is the LCP image unless a banner sits above it
                    />
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4 row g-4 mx-0">
            {latestRecords.map((item) => (
              <div key={item.id} className="col-lg-6">
                <BgImageCard
                  style={{
                    backgroundImage: `url(${item.child_content?.image})`,
                  }}
                  cardLinkTag={pageGalleryHref("designer-choice", slugMap, item.id)}
                  designerCardBgDiv={"designercard designercardimg1"}
                  titleBgImage={item.child_content?.title}
                  imageAlt={item.child_content?.image_alt || item.child_content?.title || "Designer Choice Project"}
                  descriptionBg={stripHtml(item.child_content?.description)}
                />
              </div>
            ))}
          </div>
        </section>

        <hr className="mt-5" />
      </main>
    </MainLayout>
  );
}