import { getGallerySlugMap, pageGalleryHref } from "@/utils/slugEdit";
import MainLayout from "../layouts/MainLayout";
import PortfolioCard from "../components/PortfolioCard";
import BackgroundImageRow from "../components/BackgroundImageRow";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../components/JsonLd";

// Regenerate this page and its fetched content every 60 seconds.
export const revalidate = 60;

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

async function getDesignIdeas() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-parent-child/gallery_design`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch design ideas: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Design Idea Fetch Error:", err);
    return [];
  }
}

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/design-idea")}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

async function getBannerData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/cms-gallery-design/manage-banner?key=design_idea`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Banner Fetch Error:", err);
    return null;
  }
}

export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title ||
    "High Creation Interior - Interior Design gallery for your home";
  const description =
    seo?.meta_description ||
    "Explore Interior Design gallery for your home , designed by Top interior designers at High Creation Interior.";
  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/design-idea",
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

export default async function DesignIdea() {
  // Fetch independent data in parallel so the page does not wait on a waterfall.
  const [seo, slugMap, designIdea, bannerRecord] = await Promise.all([
    getSeoData(),
    getGallerySlugMap("design-idea"),
    getDesignIdeas(),
    getBannerData(),
  ]);

  const bgHeading = bannerRecord?.banner_heading || "Design Gallery";
  const bgDescription =
    bannerRecord?.banner_description ||
    "Designs That Speak Before Words Do—Explore Our Most Inspiring Creations, spaces that blend beauty, functionality, and timeless design.";

  // Preserve the existing ordering and special layout of the first eight records.
  const sortedDesignIdea = [...designIdea].sort((a, b) => b.id - a.id);
  const staticRecords = sortedDesignIdea.slice(-8);
  const latestRecords = sortedDesignIdea.slice(0, -8);
  const hasBannerImage = Boolean(bannerRecord?.banner_image);

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <main>
        <BackgroundImageRow
          sectionBgImages="contact_wrapper design_gallery_banner"
          sectionBgHeading={bgHeading}
          secBgHeadingClass="sec_bgheading_lass"
          sectionBgDescription={bgDescription}
          secBgDesClass="secbgbesclass"
          bgImageUrl={bannerRecord?.banner_image}
          bgImageAlt={bannerRecord?.banner_alt}
          headingTag={bannerRecord?.banner_heading_tag || "h1"}
          descriptionFontSize={bannerRecord?.banner_description_font_size || 16}
          sectionBgHeadingStyle={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          }}
          sectionBgDescriptionStyle={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
          }}
        />

        <section className="container my-5">
          {/* Static records grid (the eight oldest records, as before). */}
          {staticRecords.length > 0 && (
            <div className="row mx-0">
              <div className="col-lg-7">
                {staticRecords[0] && (
                  <PortfolioCard
                    cardDetailLink={pageGalleryHref(
                      "design-idea",
                      slugMap,
                      staticRecords[0]?.id
                    )}
                    portCard="card_portfolio portfolio_1"
                    portfolioImgBg="portfolioimgall desig_gal_bg1"
                    portfolioImg={staticRecords[0]?.child_content?.image}
                    portfolioTitle={staticRecords[0]?.child_content?.title}
                    portfolioImgAlt={staticRecords[0]?.child_content?.image_alt}
                    portfolioImgSizes="(min-width: 1200px) 665px, (min-width: 992px) 58.333vw, 100vw"
                    portfolioImgPriority={!hasBannerImage}
                  />
                )}
                {staticRecords[1] && (
                  <PortfolioCard
                    cardDetailLink={pageGalleryHref(
                      "design-idea",
                      slugMap,
                      staticRecords[1]?.id
                    )}
                    portCard="card_portfolio portfolio_1"
                    portfolioImgBg="portfolioimgall desig_gal_bg2"
                    portfolioImg={staticRecords[1]?.child_content?.image}
                    portfolioTitle={staticRecords[1]?.child_content?.title}
                    portfolioImgAlt={staticRecords[1]?.child_content?.image_alt}
                    portfolioImgSizes="(min-width: 1200px) 665px, (min-width: 992px) 58.333vw, 100vw"
                  />
                )}
              </div>

              <div className="col-lg-5">
                {staticRecords[2] && (
                  <PortfolioCard
                    cardDetailLink={pageGalleryHref(
                      "design-idea",
                      slugMap,
                      staticRecords[2]?.id
                    )}
                    portCard="card_portfolio portfolio_1"
                    portfolioImgBg="portfolioimgall desig_gal_bg3"
                    portfolioImg={staticRecords[2]?.child_content?.image}
                    portfolioTitle={staticRecords[2]?.child_content?.title}
                    portfolioImgAlt={staticRecords[2]?.child_content?.image_alt}
                    portfolioImgSizes="(min-width: 1200px) 475px, (min-width: 992px) 41.667vw, 100vw"
                  />
                )}
              </div>

              <div className="col-lg-12">
                {staticRecords[3] && (
                  <PortfolioCard
                    cardDetailLink={pageGalleryHref(
                      "design-idea",
                      slugMap,
                      staticRecords[3]?.id
                    )}
                    portCard="card_portfolio portfolio_1"
                    portfolioImgBg="portfolioimgall desig_gal_bg4"
                    portfolioImg={staticRecords[3]?.child_content?.image}
                    portfolioTitle={staticRecords[3]?.child_content?.title}
                    portfolioImgAlt={staticRecords[3]?.child_content?.image_alt}
                    portfolioImgSizes="(min-width: 1200px) 1140px, 100vw"
                  />
                )}
              </div>

              <div className="col-lg-9">
                {staticRecords[4] && (
                  <PortfolioCard
                    cardDetailLink={pageGalleryHref(
                      "design-idea",
                      slugMap,
                      staticRecords[4]?.id
                    )}
                    portCard="card_portfolio portfolio_1"
                    portfolioImgBg="portfolioimgall desig_gal_bg5"
                    portfolioImg={staticRecords[4]?.child_content?.image}
                    portfolioTitle={staticRecords[4]?.child_content?.title}
                    portfolioImgAlt={staticRecords[4]?.child_content?.image_alt}
                    portfolioImgSizes="(min-width: 1200px) 855px, (min-width: 992px) 75vw, 100vw"
                  />
                )}
              </div>

              <div className="col-lg-3">
                {staticRecords[5] && (
                  <PortfolioCard
                    cardDetailLink={pageGalleryHref(
                      "design-idea",
                      slugMap,
                      staticRecords[5]?.id
                    )}
                    portCard="card_portfolio portfolio_1"
                    portfolioImgBg="portfolioimgall desig_gal_bg6"
                    portfolioImg={staticRecords[5]?.child_content?.image}
                    portfolioTitle={staticRecords[5]?.child_content?.title}
                    portfolioImgAlt={staticRecords[5]?.child_content?.image_alt}
                    portfolioImgSizes="(min-width: 1200px) 285px, (min-width: 992px) 25vw, 100vw"
                  />
                )}
              </div>

              <div className="col-lg-6">
                {staticRecords[6] && (
                  <PortfolioCard
                    cardDetailLink={pageGalleryHref(
                      "design-idea",
                      slugMap,
                      staticRecords[6]?.id
                    )}
                    portCard="card_portfolio portfolio_1"
                    portfolioImgBg="portfolioimgall desig_gal_bg7"
                    portfolioImg={staticRecords[6]?.child_content?.image}
                    portfolioTitle={staticRecords[6]?.child_content?.title}
                    portfolioImgAlt={staticRecords[6]?.child_content?.image_alt}
                    portfolioImgSizes="(min-width: 1200px) 570px, (min-width: 992px) 50vw, 100vw"
                  />
                )}
              </div>

              <div className="col-lg-6">
                {staticRecords[7] && (
                  <PortfolioCard
                    cardDetailLink={pageGalleryHref(
                      "design-idea",
                      slugMap,
                      staticRecords[7]?.id
                    )}
                    portCard="card_portfolio portfolio_1"
                    portfolioImgBg="portfolioimgall desig_gal_bg8"
                    portfolioImg={staticRecords[7]?.child_content?.image}
                    portfolioTitle={staticRecords[7]?.child_content?.title}
                    portfolioImgAlt={staticRecords[7]?.child_content?.image_alt}
                    portfolioImgSizes="(min-width: 1200px) 570px, (min-width: 992px) 50vw, 100vw"
                  />
                )}
              </div>
            </div>
          )}

          {/* Latest records retain the existing two-column desktop grid. */}
          <div className="row mx-0">
            {latestRecords.map((item) => (
              <div key={item.id} className="col-lg-6">
                <PortfolioCard
                  cardDetailLink={pageGalleryHref("design-idea", slugMap, item.id)}
                  portCard="card_portfolio portfolio_1"
                  portfolioImgBg="portfolioimgall desig_gal_bg8"
                  portfolioImg={item.child_content?.image}
                  portfolioTitle={item.child_content?.title}
                  portfolioImgAlt={item.child_content?.image_alt}
                  portfolioImgSizes="(min-width: 1200px) 570px, (min-width: 992px) 50vw, 100vw"
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