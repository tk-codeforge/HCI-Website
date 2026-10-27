import MainLayout from "../../layouts/MainLayout";
import PortfolioCard from "../../components/PortfolioCard";
import ExperienceForm from "../../components/ExperienceForm";
import { notFound } from "next/navigation";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import { getCenterSlugMap, centerGalleryHref } from "@/utils/slugEdit";
import JsonLd from "../../components/JsonLd";

// Force dynamic because we are rendering based on dynamic params
export const dynamic = "force-dynamic";

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};


const EXTRA_PAIR_BG_CLASSES = ["desig_gal_bg7", "desig_gal_bg8"];
const EXTRA_SINGLE_BG_CLASS = "desig_gal_bg4";


async function getSeoData(slug) {
  try {
    const res = await fetch(
      `${getBaseUrl()}/seo-tag/route?path=${encodeURIComponent(`/${slug}`)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

async function getCenter(slug) {
  const res = await fetch(
    `${getBaseUrl()}/cms-experience-center/by-slug/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Center lookup failed: ${res.status}`);
  return res.json();
}

export async function generateMetadata({ params }) {
  const { "experience-center": slug } = await params;

  // Same guard the page itself uses: invalid slugs are not indexed
  if (!slug?.startsWith("experience-center-") || !(await getCenter(slug))) {
    return { title: "Page not found", robots: { index: false, follow: false } };
  }

  const seo = await getSeoData(slug);
  const readable = slug.replace(/-/g, " ");

  const title = seo?.meta_title || `High Creation Interior - ${readable}`;
  const description =
    seo?.meta_description ||
    `Explore our bespoke ${readable} interior experience center.`;

    const ogTitle = seo?.og_title || title;
const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: `/${slug}`,   // real public URL
  });
  const { index, follow } = seo
    ? getRobotsDirectives(seo)
    : { index: true, follow: true };

  return {
    title,
    description,
    keywords: seo?.keywords || "design idea, interior design, experience center",
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


export default async function CustomExperienceCenterPage({ params }) {
  const { "experience-center": slug } = await params;
  if (!slug?.startsWith("experience-center-")) return notFound();

  if (!(await getCenter(slug))) return notFound();   // <-- the actual fix
  const seo = await getSeoData(slug);


    const baseURL = getBaseUrl();
  const [dataRes, videoRes, slugMap] = await Promise.all([
    fetch(`${baseURL}/experience-center-assets/experience_center/${slug}`, { cache: "no-store" }),
    fetch(`${baseURL}/experience-center-assets/experience_center_video/${slug}`, { cache: "no-store" }),
    getCenterSlugMap(slug),
  ]);
  if (!dataRes.ok || !videoRes.ok) throw new Error("Asset fetch failed");

  const experienceData = await dataRes.json();
  const experienceDataVideo = await videoRes.json();

  
  const extraImages = experienceData.slice(7);
    // const galleryLink = (item) => `/${slug}/gallery?id=${item?.id}`;
      const galleryLink = (item) => centerGalleryHref(slug, slugMap, item?.id);

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <main>
        {/* Video Section */}
        <section className="video_wrapper conatiner-fluid">
          {experienceDataVideo[0]?.child_content?.image && (
            <video
              width="100%"
              height="590"
              className="object-fit-cover"
              autoPlay
              loop
              muted
              id="myVideo"
            >
              <source src={experienceDataVideo[0]?.child_content?.image} />
            </video>
          )}
        </section>

        {/* Content Section */}
        <section className="container my-5">
          <div className="row mx-0 g-4">
            {/* Left Column (Items 0 & 1) */}
            <div className="col-lg-7">
              {experienceData[0] && (
                <PortfolioCard
                  // cardDetailLink={`experience-center/gallery?id=${experienceData[0]?.id}`}
                  cardDetailLink={galleryLink(experienceData[0])}
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall desig_gal_bg1 design_exper"}
                  portfolioImg={experienceData[0]?.child_content?.image}
                  portfolioTitle={experienceData[0]?.child_content?.title}
                  portfolioImgAlt={experienceData[0]?.child_content?.image_alt}
                  portfolioTitleTag={experienceData[0]?.child_content?.title_tag}
                />
              )}
              {experienceData[1] && (
                <PortfolioCard
                  cardDetailLink={galleryLink(experienceData[1])}
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall desig_gal_bg2"}
                  portfolioImg={experienceData[1]?.child_content?.image}
                  portfolioTitle={experienceData[1]?.child_content?.title}
                                    portfolioImgAlt={experienceData[1]?.child_content?.image_alt}
                  portfolioTitleTag={experienceData[1]?.child_content?.title_tag}
                />
              )}
            </div>

            {/* Right Column (Form) */}
            <div className="col-lg-5">
              <ExperienceForm />
            </div>

            {/* Bottom Section (Remaining Items) */}
            {experienceData[2] && (
              <div className="col-lg-12">
                <PortfolioCard
                  cardDetailLink={galleryLink(experienceData[2])}
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall desig_gal_bg4"}
                  portfolioImg={experienceData[2]?.child_content?.image}
                  portfolioTitle={experienceData[2]?.child_content?.title}
                                    portfolioImgAlt={experienceData[2]?.child_content?.image_alt}
                  portfolioTitleTag={experienceData[2]?.child_content?.title_tag}
                />
              </div>
            )}

            {experienceData[3] && (
              <div className="col-lg-9">
                <PortfolioCard
                  cardDetailLink={galleryLink(experienceData[3])}
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall desig_gal_bg5"}
                  portfolioImg={experienceData[3]?.child_content?.image}
                  portfolioTitle={experienceData[3]?.child_content?.title}
                                    portfolioImgAlt={experienceData[3]?.child_content?.image_alt}
                  portfolioTitleTag={experienceData[3]?.child_content?.title_tag}
                />
              </div>
            )}

            {experienceData[4] && (
              <div className="col-lg-3">
                <PortfolioCard
                  cardDetailLink={galleryLink(experienceData[4])}
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall desig_gal_bg6"}
                  portfolioImg={experienceData[4]?.child_content?.image}
                  portfolioTitle={experienceData[4]?.child_content?.title}
                                    portfolioImgAlt={experienceData[4]?.child_content?.image_alt}
                  portfolioTitleTag={experienceData[4]?.child_content?.title_tag}
                />
              </div>
            )}

            {experienceData[5] && (
              <div className="col-lg-6">
                <PortfolioCard
                  cardDetailLink={galleryLink(experienceData[5])}
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall desig_gal_bg7"}
                  portfolioImg={experienceData[5]?.child_content?.image}
                  portfolioTitle={experienceData[5]?.child_content?.title}
                                    portfolioImgAlt={experienceData[5]?.child_content?.image_alt}
                  portfolioTitleTag={experienceData[5]?.child_content?.title_tag}
                  portfolioClassCss="text-white w-75 mb-0 my-2 team_designation"
                />
              </div>
            )}

            {experienceData[6] && (
              <div className="col-lg-6">
                <PortfolioCard
                  cardDetailLink={galleryLink(experienceData[6])}
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall desig_gal_bg8"}
                  portfolioImg={experienceData[6]?.child_content?.image}
                  portfolioTitle={experienceData[6]?.child_content?.title}
                                    portfolioImgAlt={experienceData[6]?.child_content?.image_alt}
                  portfolioTitleTag={experienceData[6]?.child_content?.title_tag}
                  portfolioClassCss="text-white w-75 mb-0 my-2 team_designation"
                />
              </div>
            )}

            {extraImages.map((item, i) => {
              const isLastOdd = i === extraImages.length - 1 && extraImages.length % 2 === 1;
              const colClass = isLastOdd ? "col-lg-12" : "col-lg-6";
              const bgClass = isLastOdd ? EXTRA_SINGLE_BG_CLASS : EXTRA_PAIR_BG_CLASSES[i % 2];
              return (
                <div className={colClass} key={item.id}>
                  <PortfolioCard
                    cardDetailLink={galleryLink(item)}
                    portCard={"card_portfolio portfolio_1"}
                    portfolioImgBg={`portfolioimgall ${bgClass}`}
                    portfolioImg={item?.child_content?.image}
                    portfolioTitle={item?.child_content?.title}
                                        portfolioImgAlt={item?.child_content?.image_alt}
                    portfolioTitleTag={item?.child_content?.title_tag}
                    portfolioClassCss="text-white w-75 mb-0 my-2 team_designation"
                  />
                </div>
              );
            })}
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
}
