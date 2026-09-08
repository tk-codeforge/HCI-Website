import { getPageSEO } from "@/utils/getSEO";
import BackgroundImageRow from "../components/BackgroundImageRow";
import MainLayout from "../layouts/MainLayout";

// --- CONFIGURATION ---
export const revalidate = 60; 

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- HELPER: Fetch About Us Page Content ---
async function getAboutUsContent() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/about_us`, {
       // cache is handled by the page-level 'revalidate'
    });

    if (!res.ok) return {};
    const data = await res.json();
    return data?.json_content || {};
  } catch (err) {
    console.error("About Us Content Fetch Error:", err);
    return {};
  }
}

// --- HELPER: Fetch SEO Data ---
// async function getSeoData() {
//   try {
//     const baseURL = getBaseUrl();
//     const res = await fetch(`${baseURL}/seo-tag`, {
//       next: { revalidate: 60 } 
//     });

//     if (!res.ok) return null;

//     const allTags = await res.json();
    
//     // --- FIX IS HERE ---
//     // The API returns 'page_name' as a full URL (e.g., https://hcinterior.in/about-us)
//     // We strictly check if the URL ends with "/about-us" to be safe.
//     if (Array.isArray(allTags)) {
//         return allTags.find(tag => 
//             tag.page_name === "https://hcinterior.in/about-us" || 
//             tag.page_name?.endsWith("/about-us")
//         );
//     }
//     return null;
//   } catch (err) {
//     console.error("SEO Fetch Error:", err);
//     return null;
//   }
// }

// // --- DYNAMIC METADATA GENERATION ---
// export async function generateMetadata() {
//   const seoData = await getSeoData();
  
//   const defaultTitle = "About Us | End To End Interior Design - High Creation Interior";
//   const defaultDesc = "High Creation Interior delivering top notch interior design services in Noida & Delhi NCR | 8+ Years of experience | 1000+ Projects Done";
//   const defaultCanonical = "https://hcinterior.in/about-us";

//   return {
//     title: seoData?.title || defaultTitle,
//     description: seoData?.meta_description || defaultDesc,
//     alternates: {
//       // We use page_name because it contains the clean URL "https://hcinterior.in/about-us"
//       // The 'meta_can_tag' field in your API has HTML tags (<link...>) which we cannot use directly here.
//       canonical: seoData?.page_name || defaultCanonical, 
//     },
//     openGraph: {
//       title: seoData?.title || defaultTitle,
//       description: seoData?.meta_description || defaultDesc,
//       url: seoData?.page_name || defaultCanonical,
//       type: "website",
//     },
//   };
// }

export async function generateMetadata() {
  return await getPageSEO("https://hcinterior.in/about-us"); 
}

// --- MAIN SERVER COMPONENT ---
export default async function AboutUs() {
  const formData = await getAboutUsContent();

        const TopTitleTag = formData?.top_title_tag || "h2";
        const SubTitleTag = formData?.mid_sub_title_tag || "h3";
        const SubSpanTitleTag = formData?.mid_sub_span_title_tag || "h4";

  return (
    <MainLayout>
      <main>
        {/* Background Section */}
        {/* <BackgroundImageRow
          sectionBgImages="contact_wrapper about_us_banner"
          sectionBgHeading="About Us"
          secBgHeadingClass="sec_bgheading_lass about_mob"
          sectionBgDescription="Get A Place Designed Exactly How You Wished"
          secBgDesClass="text-center bg-transparent text-white"
        /> */}
        <BackgroundImageRow
          sectionBgImages="contact_wrapper about_us_banner"
          sectionBgHeading={formData?.banner_heading || "About Us"}
          secBgHeadingClass="sec_bgheading_lass about_mob"
          sectionBgDescription={formData?.banner_description || "Get A Place Designed Exactly How You Wished"}
          secBgDesClass="text-center bg-transparent text-white"
          headingTag={formData?.banner_heading_tag || "h1"}
          descriptionFontSize={formData?.banner_description_font_size ? `${formData.banner_description_font_size}px` : undefined}
          bgImageUrl={formData?.banner_image}
          sectionBgHeadingStyle={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
  sectionBgDescriptionStyle={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
        />
        {/* About High Creation Section */}
        <section className="my-5 container">
          <div className="row mx-0">
            <center>
              <TopTitleTag className="pb-4 wallpaperHeading" style={{ textShadow: "none" }}>
                {formData?.top_title || "About High Creation"}
              </TopTitleTag>
              <div className="row justify-content-center">
                <div className="col-6 d-flex justify-content-center">
                  {formData?.mid_image && (
                    <img
                      src={formData.mid_image}
                      className="d-block"
                      style={{ 
    width: formData?.mid_image_size ? `${formData.mid_image_size}%` : '100%', 
    maxWidth: 'none', 
    height: 'auto' 
  }}
                      alt={formData?.top_title || "About Us"}
                    decoding="async"  loading="lazy" />
                  )}
                </div>
              </div>
              <p className="px-lg-5 pt-4 team_description"
              style={{ fontSize: formData?.top_description_font_size ? `${formData.top_description_font_size}px` : undefined }}>
                {formData?.top_description}
              </p>
            </center>
          </div>
        </section>

        {/* What Makes Us Best Section */}
        <section className="whatmakes_wrapper">
          <div className="container">
            <div className="row mx-0">
              <div className="col-lg-7 d-flex align-items-center">
                <div>
                  <SubTitleTag className="text-white">{formData?.mid_sub_title}</SubTitleTag>
                  <div className="team_description text-white pe-lg-5">
                    <div>
                      <SubSpanTitleTag className="text-white">
                        {formData?.mid_sub_span_title || "Interior designing Company?"}
                      </SubSpanTitleTag>
                    </div>
                    <p style={{color:"#FFF", fontSize: formData?.mid_sub_description_font_size ? `${formData.mid_sub_description_font_size}px` : undefined}}>{formData?.mid_sub_description}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <img
                  src="/images/about/Whatmakes.png"
                  className="w-100"
                  alt="What makes us best"
                decoding="async"  loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <hr />
      </main>
    </MainLayout>
  );
}