import MainLayout from "../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

// --- CONFIGURATION ---
export const revalidate = 60; // Regenerate page every 60 seconds

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- HELPER: Fetch Ready To Go Design Data ---
async function getReadyToGoDesignData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-parent-child/ready_to_go_design`, {
      // cache handled by page revalidate
    });

    if (!res.ok) {
      console.error(`Failed to fetch ready-to-go design data: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Ready To Go Design Data Fetch Error:", err);
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

    // Match the specific page URL for Ready To Go Design
    if (Array.isArray(allTags)) {
      return allTags.find(
        (tag) =>
          tag.page_name === "https://hcinterior.in/ready-togo-design" ||
          tag.page_name?.endsWith("/ready-togo-design")
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
    return data?.json_content?.sections?.ready_to_go_design || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}
// --- DYNAMIC METADATA GENERATION ---
export async function generateMetadata() {
  const seoData = await getSeoData();

  const defaultTitle = "Ready To Go Interior Design : High Creation Interior";
  const defaultDesc =
    "Explore our Ready-To-Go Interior Design solutions, offering stylish, pre-designed spaces that blend functionality and aesthetics for a hassle-free transformation.";
  const defaultCanonical = "https://hcinterior.in/ready-togo-design";

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
export default async function ReadyToGoDesign() {
  const exclusiveDesignData = await getReadyToGoDesignData();

  const headingData = await getHeadingDescriptionData();

  const HeadingTag = headingData?.headingTag || "h1";
const headingText = headingData?.headingText || "Ready To Go Design";
const headingStyle = {
  textShadow: "none",
  fontFamily: "inherit",
  ...(headingData?.headingColor && { color: headingData.headingColor }),
};

const descriptionText =
  headingData?.descriptionText ||
  "Why wait to create your dream space? Our ready-to-go interior design solutions deliver thoughtfully crafted interiors that combine stunning aesthetics with smart functionality. Designed for effortless living, every space is ready to elevate your home with style and comfort."
const descriptionStyle = {
  ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
};

  return (
    <MainLayout>
      <style dangerouslySetInnerHTML={{__html: `
        /* Premium Card Layout */
        .premium-rtd-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .premium-rtd-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border-color: #ff914d;
        }

        /* Image Zoom Effect */
        .rtd-img-wrapper {
          width: 100%;
          height: 280px;
          overflow: hidden;
          position: relative;
        }

        .rtd-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .premium-rtd-card:hover .rtd-img {
          transform: scale(1.08);
        }

        /* Content Area */
        .rtd-content {
          padding: 24px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        /* Call to Action Button */
        .rtd-btn {
          margin-top: auto;
          color: #ff914d;
          display: inline-flex;
          align-items: center;
          transition: color 0.3s ease;
        }

        .rtd-arrow {
          transition: transform 0.3s ease;
        }

        .premium-rtd-card:hover .rtd-arrow {
          transform: translateX(6px);
        }

        /* Header Restructuring */
        .rtd-header-text {
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.8;
          color: #475569;
        }
      `}} />

      <main className="bg-light pb-5">
        
        {/* --- PREMIUM HEADER SECTION --- */}
        <section className="py-5 bg-white border-bottom shadow-sm mb-5">
          <div className="container text-center">
            <HeadingTag id="ready-to-go-design-heading" className="wallpaperHeading" style={headingStyle}>
  {headingText}
</HeadingTag>
<p id="ready-to-go-design-description" className="rtd-header-text fs-6 text-muted mx-auto" style={descriptionStyle}>
  {descriptionText}
</p>
<style>{`
  ${headingData?.headingColor ? `#ready-to-go-design-heading { color: ${headingData.headingColor} !important; }` : ""}
  ${headingData?.descriptionColor ? `#ready-to-go-design-description { color: ${headingData.descriptionColor} !important; }` : ""}
  ${headingData?.descriptionFontSize ? `#ready-to-go-design-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
`}</style>
          </div>
        </section>

        {/* --- PREMIUM GRID SECTION --- */}
        <section className="container">
          <div className="row g-4 mx-0">
            {exclusiveDesignData && exclusiveDesignData.length > 0 ? (
              exclusiveDesignData.map((design, index) => (
                <div key={index} className="col-lg-6 col-md-6 col-12">
                  <Link 
                    href={`/ready-togo-design/gallery?id=${design?.id}`} 
                    className="premium-rtd-card text-decoration-none h-100"
                  >
                    
                    <div className="rtd-img-wrapper">
                      <img 
                        src={design?.child_content?.image ?? "/images/Bhk/1bhk.png"} 
                        alt={design?.child_content?.title ?? defaultAltText} 
                        className="rtd-img"
                        decoding="async"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="rtd-content">
                      <h3 className="font-outfit fw-bold text-dark h4 mb-2">
                        {design?.child_content?.title}
                      </h3>
                      
                      <p className="font-poppins text-muted small mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {design?.child_content?.description}
                      </p>
                      
                      <div className="rtd-btn font-poppins fw-bold text-uppercase" style={{ fontSize: '13px', letterSpacing: '1px' }}>
                        View Designs <FaArrowRight className="rtd-arrow ms-2" />
                      </div>
                    </div>

                  </Link>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <p className="font-poppins text-muted">Loading exclusive designs...</p>
              </div>
            )}
          </div>
        </section>

      </main>
    </MainLayout>
  );
}