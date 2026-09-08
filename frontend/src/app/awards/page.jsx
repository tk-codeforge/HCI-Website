import BackgroundImageWithHeading from "../components/BackgroundImageWithHeading";
import MainLayout from "../layouts/MainLayout";
import PortfolioCard from "../components/PortfolioCard";
// export const metadata = {
//   title: "Design Excellence Award - High Creation Interior",
//   description:
//     "Explore our Awards Gallery showcasing innovative interior designs by High Creation. Discover our award-winning projects that blend creativity, style, and functionality for stunning space",
// };

export const revalidate = 60;

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/seo-tag`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const allTags = await res.json();
    if (Array.isArray(allTags)) {
      return allTags.find(
        (tag) =>
          tag.page_name === "https://hcinterior.in/awards" ||
          tag.page_name?.endsWith("/awards")
      );
    }
    return null;
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

async function getBannerData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-gallery-design/manage-banner?key=award_gallery`, {
      cache: "no-store",
      headers: { Connection: "close" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Banner Fetch Error:", err);
    return null;
  }
}

export async function generateMetadata() {
  const seoData = await getSeoData();
  const defaultTitle = "Design Excellence Award - High Creation Interior";
  const defaultDesc =
    "Explore our Awards Gallery showcasing innovative interior designs by High Creation. Discover our award-winning projects that blend creativity, style, and functionality for stunning space.";
  const defaultCanonical = "https://hcinterior.in/awards";

  return {
    title: seoData?.title || defaultTitle,
    description: seoData?.meta_description || defaultDesc,
    alternates: { canonical: seoData?.page_name || defaultCanonical },
    openGraph: {
      title: seoData?.title || defaultTitle,
      description: seoData?.meta_description || defaultDesc,
      url: seoData?.page_name || defaultCanonical,
      type: "website",
    },
  };
}

// const Awards = () => {
  export default async function Awards() {
    const bannerRecord = await getBannerData();
const bgHeading = bannerRecord?.banner_heading || "Awards Gallery";
const bgDescription = bannerRecord?.banner_description || "";
  return (
    <div>
        {/* <head>
        <title>Design Excellence Award - High Creation Interior		</title>
        <meta
          name="description"
          content="Explore our Awards Gallery showcasing innovative interior designs by High Creation. Discover our award-winning projects that blend creativity, style, and functionality for stunning space.	"
        />
          <link rel="canonical" href="https://hcinterior.in/awards" />	
      </head> */}
      <MainLayout>
        <main>
        <style dangerouslySetInnerHTML={{ __html: `
            .force-white-heading {
              color: #ffffff !important;
              text-shadow: 0 2px 8px rgba(0,0,0,0.6);
            }
          `}} />
          {/* <BackgroundImageWithHeading
            sectionBgImages={"contact_wrapper services"}
            sectionBgHeading="Awards Gallery"
            // secBgHeadingClass="sec_bgheading_lass"
            secBgHeadingClass="sec_bgheading_lass force-white-heading"
            sectionBgDescription=""
            secBgDesClass={"text-center bg-transparent"}
          /> */}
          <BackgroundImageWithHeading
  sectionBgImages={"contact_wrapper services"}
  sectionBgHeading={bgHeading}
  secBgHeadingClass="sec_bgheading_lass force-white-heading"
  sectionBgDescription={bgDescription}
  secBgDesClass={"text-center bg-transparent text-white"}
  bgImageUrl={bannerRecord?.banner_image}
  headingTag={bannerRecord?.banner_heading_tag || "h1"}
  descriptionFontSize={bannerRecord?.banner_description_font_size || 16}
  sectionBgHeadingStyle={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
  sectionBgDescriptionStyle={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
/>
          <section className="container my-5">
            <div className="row mx-0">
              <div className="col-lg-7">
                <PortfolioCard
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall award1"}
                />
                <PortfolioCard
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall award2"}
                />
              </div>
              <div className="col-lg-5">
                <PortfolioCard
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall portfoliobg3"}
                />
              </div>
              <div className="col-lg-12">
                <PortfolioCard
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall award4"}
                />
              </div>
              <div className="col-lg-9">
                <PortfolioCard
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall award5"}
                />
              </div>
              <div className="col-lg-3">
                <PortfolioCard
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall portfoliobg6"}
                />
              </div>
            </div>
          </section>
          <hr className="mt-5" />
        </main>
      </MainLayout>
    </div>
  );
};

