import MainLayout from "../layouts/MainLayout";
import ExperienceForm from "./ExperienceForm";
import WallpaperCard from "../components/WallpaperCard";
import { defaultAltText } from "@/utils/helper";

// --- CONFIGURATION ---
export const revalidate = 60; 

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- DATA FETCHING: NOIDA EXTENSION ---
async function getExperienceCenterData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-parent-child/experience_center_noida_extension`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

async function getExperienceCenterVideo() {
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
export default async function ExperienceCenterNoidaExtension() {
  const rawData = await getExperienceCenterData();
  const exclusiveDesignData = Array.isArray(rawData) ? rawData : (rawData?.data || []);
  
  const videoDataRaw = await getExperienceCenterVideo();
  const videoData = Array.isArray(videoDataRaw) ? videoDataRaw : (videoDataRaw?.data || []);

  return (
    <MainLayout>
      <main>
        {/* Banner & Form Section */}
        <section className="container mt-5 mb-5">
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
            </div>
            
            {/* Lead Form */}
            <div className="col-lg-6">
              <div className="p-4 rounded-4 shadow-lg border" style={{ backgroundColor: "#ffffff" }}>
                <ExperienceForm />
              </div>
            </div>
          </div>
        </section>

        <hr className="my-5" />

        {/* Dynamic Gallery Section from CMS */}
        <section className="container my-5">
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
        </section>
      </main>
    </MainLayout>
  );
}