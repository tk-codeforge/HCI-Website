import MainLayout from "../layouts/MainLayout";
import WallpaperCard from "../components/WallpaperCard";
import { buildTextShadow } from "@/utils/textShadow";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import { getSlugMap, galleryHref, PRODUCT_GALLERY_TYPE } from "@/utils/slugEdit";
import { MediaBg } from "../components/MediaImage";
import JsonLd from "../components/JsonLd";

export const revalidate = 60;

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

// CMS descriptions are stored as HTML, but product cards display plain text.
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

async function getProductList() {
  try {
    const baseURL = getBaseUrl();
    if (!baseURL) {
      console.error("Product Data Fetch Error: API base URL is not configured.");
      return [];
    }

    const res = await fetch(`${baseURL}/cms-parent-child/product`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch product list: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Product Data Fetch Error:", err);
    return [];
  }
}

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    if (!baseURL) return null;

    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/product")}`,
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
    if (!baseURL) return null;

    const res = await fetch(`${baseURL}/cms-content/manage_heading_description`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;

    const record = await res.json();
    const data = Array.isArray(record) ? record[0] : record;
    return data?.json_content?.sections?.our_product || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}

export async function generateMetadata() {
  const seo = await getSeoData();
  const title =
    seo?.meta_title ||
    "High Creation Interior - Customized Products design for your Home";
  const description =
    seo?.meta_description ||
    "Explore customized Interior products gallery for your home, designed by Top interior designers at High Creation Interior.";
  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/product",
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

export default async function Product() {
  const [seo, productList, headingData, slugMap] = await Promise.all([
    getSeoData(),
    getProductList(),
    getHeadingDescriptionData(),
    getSlugMap(PRODUCT_GALLERY_TYPE),
  ]);

  const HeadingTag = headingData?.headingTag || "h1";
  const headingText = headingData?.headingText || "Our Product";
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
    "Beautiful to look at. Effortless to live with. Designed to last — Explore our products that are as practical as they are beautiful, designed to add style, comfort, and character to every space. From modular TV units to wall art and innovative wall designs.";
  const descriptionStyle = {
    ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
    ...(headingData?.descriptionFontSize && {
      fontSize: `${headingData.descriptionFontSize}px`,
    }),
    textShadow: buildTextShadow(
      headingData?.descriptionShadowEnabled,
      headingData?.descriptionShadowIntensity
    ),
  };

  const bannerImage = headingData?.bannerImage || "";
  const headingBlock = (
    <>
      <HeadingTag
        id="our-product-heading"
        className="wallpaperHeading"
        style={headingStyle}
      >
        {headingText}
      </HeadingTag>
      <p
        id="our-product-description"
        className="px-lg-5 fs-6 text-muted"
        style={descriptionStyle}
      >
        {descriptionText}
      </p>
      {/* Keep these CMS overrides so existing site styles cannot mask CMS colors. */}
      <style>{`
        ${headingData?.headingColor ? `#our-product-heading { color: ${headingData.headingColor} !important; }` : ""}
        ${headingData?.descriptionColor ? `#our-product-description { color: ${headingData.descriptionColor} !important; }` : ""}
        ${headingData?.descriptionFontSize ? `#our-product-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
        #our-product-heading { text-shadow: ${buildTextShadow(headingData?.headingShadowEnabled, headingData?.headingShadowIntensity)} !important; }
        #our-product-description { text-shadow: ${buildTextShadow(headingData?.descriptionShadowEnabled, headingData?.descriptionShadowIntensity)} !important; }
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
            sizes="100vw"
          >
            <div className="container text-center py-5">{headingBlock}</div>
          </MediaBg>
        ) : (
          <div className="container mt-5">
            <div className="text-center row mx-0 mb-3 mb-lg-5">{headingBlock}</div>
          </div>
        )}

        <section className={bannerImage ? "container my-5" : "container mb-5"}>
          <div className="row g-4 mx-0">
            {productList.length > 0 ? (
              productList.map((product, index) => {
                const productData = product?.child_content;
                const productHref = galleryHref(slugMap, product?.id);

                return (
                  <div className="col-lg-6 col-md-6 col-12" key={product.id}>
                    <WallpaperCard
                      linkTagWallpaper={productHref}
                      wallpaperCard="wallpapercard"
                      imgWallpaper={productData?.image}
                      wallpaperImgClass="wallpaperclass"
                      imgAspectRatio="1.72"
                      imgSizes="(min-width: 1400px) 650px, (min-width: 768px) 50vw, 100vw"
                      optimizeImage
                      imgPriority={!bannerImage && index === 0}
                      altWallpaper={productData?.title || "Product Image"}
                      cmsAltWallpaper={productData?.image_alt}
                      portfolioTitle={productData?.title}
                      wallpaperDescriptiion={stripHtml(productData?.description)}
                      descriptionClass="team_description mb-0 pb-2 pb-lg-0"
                      textBtnWallpaper="View Design"
                      btnHrefWallpaper={productHref}
                    />
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center">
                <p>Loading products...</p>
              </div>
            )}
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
}
