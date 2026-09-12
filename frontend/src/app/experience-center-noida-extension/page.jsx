import MainLayout from "../layouts/MainLayout";
import ExperienceForm from "./ExperienceForm";
import WallpaperCard from "../components/WallpaperCard";
import { defaultAltText } from "@/utils/helper";
import PortfolioCard from "../components/PortfolioCard";

// --- CONFIGURATION ---
export const revalidate = 60; 

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- DATA FETCHING: NOIDA EXTENSION ---
async function getExperienceData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-parent-child/experience_center_noida_extension`, {
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

async function getExperienceDataVideo() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-parent-child/experience_center_noida_extension_video`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

// --- SEO FETCHING ---
async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/seo-tag`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const allTags = await res.json();
    if (Array.isArray(allTags)) {
      return allTags.find(tag => tag.page_name?.includes("/experience-center-noida-extension"));
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata() {
  const seoData = await getSeoData();
  const defaultTitle = "Noida Extension Experience Center | High Creation Interior";
  const defaultDesc = "Visit our new Experience Center in Noida Extension. Explore exclusive interior designs, touch premium materials, and consult with our experts.";
  const defaultCanonical = "https://hcinterior.in/experience-center-noida-extension";

  return {
    title: seoData?.title || defaultTitle,
    description: seoData?.meta_description || defaultDesc,
    alternates: { canonical: seoData?.page_name || defaultCanonical },
  };
}

// --- MAIN COMPONENT ---
export default async function Experience() {
  // const rawData = await getExperienceCenterData();
  // const exclusiveDesignData = Array.isArray(rawData) ? rawData : (rawData?.data || []);
  
  // const videoDataRaw = await getExperienceCenterVideo();
  // const videoData = Array.isArray(videoDataRaw) ? videoDataRaw : (videoDataRaw?.data || []);

  const experienceData = await getExperienceData();
  const experienceDataVideo = await getExperienceDataVideo();

  return (
    <MainLayout>
      <main>
        {/* Banner & Form Section */}
        {/* <section className="container mt-5 mb-5">
          <div className="row g-5 mx-0 align-items-center">
            <div className="col-lg-6">
              <h1 className="fw-bold mb-4 font-outfit" style={{ color: "#0f172a" }}>
                Noida Extension Experience Center
              </h1>
              <p className="text-muted font-poppins mb-4" style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                Step into our state-of-the-art Experience Center in Noida Extension. 
                Discover bespoke interior solutions, feel the quality of our premium materials, 
                and visualize your dream home with our expert designers.
              </p>
              
              {videoData.length > 0 && videoData[0]?.child_content?.video_url ? (
                <div className="rounded-4 overflow-hidden shadow-lg" style={{ height: "350px" }}>
                  <iframe
                    width="100%"
                    height="100%"
                    src={videoData[0].child_content.video_url}
                    title="Experience Center Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="rounded-4 overflow-hidden shadow-sm bg-light d-flex align-items-center justify-content-center border" style={{ height: "350px" }}>
                  <p className="text-muted font-poppins fw-medium">Video Coming Soon...</p>
                </div>
              )}
            </div> */}
            
            {/* Lead Form */}
            {/* <div className="col-lg-6">
              <div className="p-4 rounded-4 shadow-lg border" style={{ backgroundColor: "#ffffff" }}>
                <ExperienceForm />
              </div>
            </div>
          </div>
        </section> */}

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

        {/* <hr className="my-5" /> */}

        {/* Dynamic Gallery Section from CMS */}
        {/* <section className="container my-5">
          <div className="text-center mb-5">
             <h2 className="fw-bold font-outfit">Explore Our Gallery</h2>
          </div>
          
          <div className="row g-4 mx-0">
            {exclusiveDesignData.length > 0 ? (
              exclusiveDesignData.map((design, index) => (
                <div key={index} className="col-lg-4 col-md-6 col-12">
                  <WallpaperCard
                    linkTagWallpaper={`/experience-center-noida-extension/gallery?id=${design?.id}`}
                    wallpaperCard="wallpapercard shadow-sm border-0"
                    imgWallpaper={design?.child_content?.image || "/images/default.jpg"}
                    wallpaperImgClass="wallpaperclass rounded-top"
                    altWallpaper={design?.child_content?.title || defaultAltText}
                    portfolioTitle={design?.child_content?.title || "Gallery View"}
                    textBtnWallpaper="View Gallery"
                    btnHrefWallpaper={`/experience-center-noida-extension/gallery?id=${design?.id}`}
                  />
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p className="text-muted font-poppins">No gallery updates yet. Check back soon!</p>
              </div>
            )}
          </div>
        </section> */}

        <section className="container my-5">
  <div className="row mx-0 g-4">
    <div className="col-lg-7">
      {experienceData[0] && (
        <PortfolioCard
          // cardDetailLink={`/experience-center-noida-extension/gallery?id=${exclusiveDesignData[0]?.id}`}
          cardDetailLink={`/experience-center/gallery?id=${experienceData[0]?.id}`}
          portCard={"card_portfolio portfolio_1"}
          portfolioImgBg={"portfolioimgall desig_gal_bg1 design_exper"}
          portfolioImg={experienceData[0]?.child_content?.image}
          portfolioTitle={experienceData[0]?.child_content?.title}
        />
      )}
      {experienceData[1] && (
        <PortfolioCard
          // cardDetailLink={`/experience-center-noida-extension/gallery?id=${exclusiveDesignData[1]?.id}`}
          cardDetailLink={`/experience-center/gallery?id=${experienceData[1]?.id}`}
          portCard={"card_portfolio portfolio_1"}
          portfolioImgBg={"portfolioimgall desig_gal_bg2"}
          portfolioImg={experienceData[1]?.child_content?.image}
          portfolioTitle={experienceData[1]?.child_content?.title}
        />
      )}
    </div>

    <div className="col-lg-5">
      <ExperienceForm />
    </div>

    {experienceData[2] && (
      <div className="col-lg-12">
        <PortfolioCard
          // cardDetailLink={`/experience-center-noida-extension/gallery?id=${exclusiveDesignData[2]?.id}`}
          cardDetailLink={`/experience-center/gallery?id=${experienceData[2]?.id}`}
          portCard={"card_portfolio portfolio_1"}
          portfolioImgBg={"portfolioimgall desig_gal_bg4"}
          portfolioImg={experienceData[2]?.child_content?.image}
          portfolioTitle={experienceData[2]?.child_content?.title}
        />
      </div>
    )}

    {experienceData[3] && (
      <div className="col-lg-9">
        <PortfolioCard
          // cardDetailLink={`/experience-center-noida-extension/gallery?id=${exclusiveDesignData[3]?.id}`}
          cardDetailLink={`/experience-center/gallery?id=${experienceData[3]?.id}`}
          portCard={"card_portfolio portfolio_1"}
          portfolioImgBg={"portfolioimgall desig_gal_bg5"}
          portfolioImg={experienceData[3]?.child_content?.image}
          portfolioTitle={experienceData[3]?.child_content?.title}
        />
      </div>
    )}

    {experienceData[4] && (
      <div className="col-lg-3">
        <PortfolioCard
          // cardDetailLink={`/experience-center-noida-extension/gallery?id=${exclusiveDesignData[4]?.id}`}
          cardDetailLink={`/experience-center/gallery?id=${experienceData[4]?.id}`}
          portCard={"card_portfolio portfolio_1"}
          portfolioImgBg={"portfolioimgall desig_gal_bg6"}
          portfolioImg={experienceData[4]?.child_content?.image}
          portfolioTitle={experienceData[4]?.child_content?.title}
        />
      </div>
    )}

    {experienceData[5] && (
      <div className="col-lg-6">
        <PortfolioCard
          // cardDetailLink={`/experience-center-noida-extension/gallery?id=${exclusiveDesignData[5]?.id}`}
          cardDetailLink={`/experience-center/gallery?id=${experienceData[5]?.id}`}
          portCard={"card_portfolio portfolio_1"}
          portfolioImgBg={"portfolioimgall desig_gal_bg7"}
          portfolioImg={experienceData[5]?.child_content?.image}
          portfolioTitle={experienceData[5]?.child_content?.title}
          portfolioClassCss="text-white w-75 mb-0 my-2 team_designation"
        />
      </div>
    )}

    {experienceData[6] && (
      <div className="col-lg-6">
        <PortfolioCard
          // cardDetailLink={`/experience-center-noida-extension/gallery?id=${exclusiveDesignData[6]?.id}`}
          cardDetailLink={`/experience-center/gallery?id=${experienceData[6]?.id}`}
          portCard={"card_portfolio portfolio_1"}
          portfolioImgBg={"portfolioimgall desig_gal_bg8"}
          portfolioImg={experienceData[6]?.child_content?.image}
          portfolioTitle={experienceData[6]?.child_content?.title}
          portfolioClassCss="text-white w-75 mb-0 my-2 team_designation"
        />
      </div>
    )}
  </div>
</section>
<hr />
      </main>
    </MainLayout>
  );
}