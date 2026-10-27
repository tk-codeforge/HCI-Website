import { getGallerySlugMap, pageGalleryHref } from "@/utils/slugEdit";
import MainLayout from "../layouts/MainLayout";
import ExperienceForm from "../components/ExperienceForm";
import DeferredVideo from "../components/DeferredVideo";
import PortfolioCard from "../components/PortfolioCard";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../components/JsonLd";

// --- CONFIGURATION ---
export const revalidate = 60;

const GALLERY_KEY = "experience-center-noida-extension";

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- DATA FETCHING: NOIDA EXTENSION ---
async function getExperienceData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/cms-parent-child/experience_center_noida_extension`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

async function getExperienceDataVideo() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/cms-parent-child/experience_center_noida_extension_video`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/experience-center-noida-extension")}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title || "Noida Extension Experience Center | High Creation Interior";
  const description =
    seo?.meta_description ||
    "Visit our new Experience Center in Noida Extension. Explore exclusive interior designs, touch premium materials, and consult with our experts.";

  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/experience-center-noida-extension",
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

// Responsive `sizes` per grid slot so the browser doesn't download a larger
// rendition than the card actually displays.
const SIZES = {
  col7: "(min-width: 1200px) 665px, (min-width: 992px) 560px, 100vw",
  col12: "(min-width: 1200px) 1140px, (min-width: 992px) 960px, 100vw",
  col9: "(min-width: 1200px) 855px, (min-width: 992px) 720px, 100vw",
  col3: "(min-width: 1200px) 285px, (min-width: 992px) 240px, 100vw",
  col6: "(min-width: 1200px) 570px, (min-width: 992px) 480px, 100vw",
};

// --- MAIN COMPONENT ---
export default async function Experience() {
  // Fetch everything in parallel (was sequential -> slow TTFB).
  const [seo, slugMap, experienceData, experienceDataVideo] = await Promise.all([
    getSeoData(),
    getGallerySlugMap(GALLERY_KEY),
    getExperienceData(),
    getExperienceDataVideo(),
  ]);

  const renderCard = (i, bgClass, sizes, extra = {}) => {
    const item = experienceData[i];
    if (!item) return null;
    return (
      <PortfolioCard
        cardDetailLink={pageGalleryHref(GALLERY_KEY, slugMap, item?.id)}
        portCard={"card_portfolio portfolio_1"}
        portfolioImgBg={bgClass}
        portfolioImg={item?.child_content?.image}
        portfolioImgAlt={item?.child_content?.image_alt}
        portfolioTitle={item?.child_content?.title}
        portfolioImgSizes={sizes}
        {...extra}
      />
    );
  };

  const whiteText = { portfolioClassCss: "text-white w-75 mb-0 my-2 team_designation" };

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <main>
        <section className="video_wrapper conatiner-fluid">
          {experienceDataVideo[0]?.child_content?.image && (
            <DeferredVideo src={experienceDataVideo[0].child_content.image} />
          )}
        </section>

        <section className="container my-5">
          <div className="row mx-0 g-4">
            <div className="col-lg-7">
              {/* First card = LCP image: eager + high fetch priority */}
              {renderCard(0, "portfolioimgall desig_gal_bg1 design_exper", SIZES.col7, {
                portfolioImgPriority: true,
              })}
              {renderCard(1, "portfolioimgall desig_gal_bg2", SIZES.col7)}
            </div>

            <div className="col-lg-5">
              <ExperienceForm />
            </div>

            {experienceData[2] && (
              <div className="col-lg-12">
                {renderCard(2, "portfolioimgall desig_gal_bg4", SIZES.col12)}
              </div>
            )}

            {experienceData[3] && (
              <div className="col-lg-9">
                {renderCard(3, "portfolioimgall desig_gal_bg5", SIZES.col9)}
              </div>
            )}

            {experienceData[4] && (
              <div className="col-lg-3">
                {renderCard(4, "portfolioimgall desig_gal_bg6", SIZES.col3)}
              </div>
            )}

            {experienceData[5] && (
              <div className="col-lg-6">
                {renderCard(5, "portfolioimgall desig_gal_bg7", SIZES.col6, whiteText)}
              </div>
            )}

            {experienceData[6] && (
              <div className="col-lg-6">
                {renderCard(6, "portfolioimgall desig_gal_bg8", SIZES.col6, whiteText)}
              </div>
            )}
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
}
