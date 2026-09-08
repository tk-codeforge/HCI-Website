import TeamGallery from "../components/TeamGallery";
import MainLayout from "../layouts/MainLayout";
import BackgroundImageRow from "../components/BackgroundImageRow";

// --- CONFIGURATION ---
export const revalidate = 60; // Regenerate page every 60 seconds

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- HELPER: Fetch SEO Data ---
async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/seo-tag`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const allTags = await res.json();

    // Match the specific page URL for the Team page
    if (Array.isArray(allTags)) {
      return allTags.find(
        (tag) =>
          tag.page_name === "https://hcinterior.in/team" ||
          tag.page_name?.endsWith("/team")
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
    console.log("BANNER FETCH URL:", `${baseURL}/cms-gallery-design/manage-banner`);
    const res = await fetch(`${baseURL}/cms-gallery-design/manage-banner?key=team`, {
      cache: "no-store",
      headers: { Connection: "close" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    console.log("BANNER DATA RECEIVED:", data);
    return data;
  } catch (err) {
    console.error("Banner Fetch Error:", err);
    return null;
  }
}

// --- DYNAMIC METADATA GENERATION ---
export async function generateMetadata() {
  const seoData = await getSeoData();

  const defaultTitle = "Step Into The Team's Gallery Of High Creation Interior";
  const defaultDesc =
    "Team of expert interior designers in Noida & Delhi NCR · High Creation Interior Team · Noida & Delhi NCR";
  const defaultCanonical = "https://hcinterior.in/team";

  return {
    title: seoData?.title || defaultTitle,
    description: seoData?.meta_description || defaultDesc,
    alternates: {
      canonical: seoData?.page_name || defaultCanonical,
    },
    openGraph: {
      title: seoData?.title || defaultTitle,
      description: seoData?.meta_description || defaultDesc,
      url: seoData?.page_name || defaultCanonical,
      type: "website",
    },
  };
}

// --- MAIN SERVER COMPONENT ---
export default async function TeamGallerys() {

  const bannerRecord = await getBannerData();
const bgHeading = bannerRecord?.banner_heading || "Teams";
const bgDescription = bannerRecord?.banner_description || "Great design starts with great people—meet our passionate designers, planners, and innovators who turn ideas into beautiful interiors and dreams into reality.";
  return (
    <MainLayout>
      <main>
        {/* 1. RESTORED ORIGINAL IMAGE BANNER */}
        {/* <BackgroundImageRow
          sectionBgImages={"sectionbg teamsImage"}
          sectionBgHeading="Teams"
          secBgHeadingClass="sec_bgheading_lass"
          sectionBgDescription="Great design starts with great people—meet our passionate designers, planners, and innovators who turn ideas into beautiful interiors and dreams into reality. "
          secBgDesClass="secbgbesclass"
        /> */}

        <BackgroundImageRow
          sectionBgImages={"contact_wrapper design_gallery_banner"}
          sectionBgHeading={bgHeading}
          secBgHeadingClass="sec_bgheading_lass"
          sectionBgDescription={bgDescription}
          secBgDesClass="secbgbesclass"
          bgImageUrl={bannerRecord?.banner_image}
headingTag={bannerRecord?.banner_heading_tag || "h1"}
descriptionFontSize={bannerRecord?.banner_description_font_size || 16}
sectionBgHeadingStyle={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
  sectionBgDescriptionStyle={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
        />

        {/* 2. CLEAR VIDEO SECTION (No dark overlays, no blurry stretching) */}
        <section className="container my-5">
          <div 
            className="video-container shadow-lg" 
            style={{ borderRadius: "15px", overflow: "hidden", backgroundColor: "#000" }}
          >
            <video
              width="100%"
              autoPlay
              loop
              muted
              playsInline
              controls // Adds play/pause buttons for the user
              style={{ display: "block", maxHeight: "70vh", objectFit: "contain" }}
            >
              <source src="/team.MP4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        {/* 3. TEAM GALLERY */}
        <TeamGallery />
      </main>
    </MainLayout>
  );
}