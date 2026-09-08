import MainLayout from "../layouts/MainLayout";
import WallpaperCard from "../components/WallpaperCard";
import { defaultAltText } from "@/utils/helper";

// --- CONFIGURATION ---
export const revalidate = 60; // Regenerate page every 60 seconds

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- HELPER: Strip HTML to prevent Hydration Mismatches ---
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
};

// --- HELPER: Fetch Furniture Data ---
async function getFurnitureData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-parent-child/furniture`, {
      // cache handled by page revalidate
    });
    if (!res.ok) {
      console.error(`Failed to fetch furniture data: ${res.status}`);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error("Furniture Data Fetch Error:", err);
    return [];
  }
}

// --- HELPER: Fetch SEO Data ---
async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/seo-tag`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const allTags = await res.json();
    // Match the specific page URL for Furniture
    if (Array.isArray(allTags)) {
      return allTags.find(
        (tag) =>
          tag.page_name === "https://hcinterior.in/furniture" ||
          tag.page_name?.endsWith("/furniture")
      );
    }
    return null;
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
    return data?.json_content?.sections?.furniture || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}

// --- DYNAMIC METADATA GENERATION ---
export async function generateMetadata() {
  const seoData = await getSeoData();
  const defaultTitle = "Explore customized furniture design for your dream home";
  const defaultDesc =
    "Discover customized furniture designs tailored for your dream home, blending style, functionality, and personalization to create spaces you'll love.";
  const defaultCanonical = "https://hcinterior.in/furniture";

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
export default async function Furniture() {
  const rawData = await getFurnitureData();
  
  // Strictly ensure it's an array so .map() never triggers a TypeError
  const exclusiveDesignData = Array.isArray(rawData) ? rawData : (rawData?.data || []);

  const headingData = await getHeadingDescriptionData();

  const HeadingTag = headingData?.headingTag || "h1";
const headingText = headingData?.headingText || "Furniture";
const headingStyle = {
  textShadow: "none",
  fontFamily: "inherit",
  ...(headingData?.headingColor && { color: headingData.headingColor }),
};

const descriptionText =
  headingData?.descriptionText ||
  "Why settle for ordinary when your home can be one of a kind? Our customized furniture is designed around your space, your style, and your story. Thoughtfully crafted for a flawless fit, every piece transforms everyday living into a personalized experience of comfort, elegance, and functionality."
const descriptionStyle = {
  ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
};

  return (
    <MainLayout>
      <main>
        <section className="container my-5">
          <div className="text-center mb-5 row mx-0">
            <HeadingTag id="furniture-heading" className="wallpaperHeading" style={headingStyle}>
  {headingText}
</HeadingTag>
<p id="furniture-description" className="px-lg-5 fs-6 text-muted" style={descriptionStyle}>
  {descriptionText}
</p>
<style>{`
  ${headingData?.headingColor ? `#furniture-heading { color: ${headingData.headingColor} !important; }` : ""}
  ${headingData?.descriptionColor ? `#furniture-description { color: ${headingData.descriptionColor} !important; }` : ""}
  ${headingData?.descriptionFontSize ? `#furniture-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
`}</style>
          </div>
          <div className="row g-4 mx-0">
            {exclusiveDesignData.length > 0 ? (
              exclusiveDesignData.map((design, index) => {
                
                // Safe fallbacks using || to strictly prevent empty string crashes
                const safeImage = design?.child_content?.image || "/images/Bhk/1bhk.png";
                const safeTitle = design?.child_content?.title || defaultAltText;
                const safeDescription = stripHtml(design?.child_content?.description);
                const safeId = design?.id || index;

                return (
                  <div key={index} className="col-lg-6 col-md-6 col-12">
                    <WallpaperCard
                      linkTagWallpaper={`/furniture/gallery?id=${safeId}`}
                      wallpaperCard="wallpapercard"
                      imgWallpaper={safeImage}
                      wallpaperImgClass="wallpaperclass"
                      altWallpaper={safeTitle}
                      portfolioTitle={safeTitle !== defaultAltText ? safeTitle : "Furniture Design"}
                      wallpaperDescriptiion={safeDescription}
                      descriptionClass="team_description mb-0"
                      textBtnWallpaper="View Design"
                      btnHrefWallpaper={`/furniture/gallery?id=${safeId}`}
                    />
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center">
                <p className="text-muted">Loading furniture items...</p>
              </div>
            )}
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
}