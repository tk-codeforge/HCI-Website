import { getGallerySlugMap, pageGalleryHref } from "@/utils/slugEdit";
import ResidentialCard from "../components/ResidentialCard";
import MainLayout from "../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";
import { buildTextShadow } from "@/utils/textShadow";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import { MediaBg } from "../components/MediaImage";
import JsonLd from "../components/JsonLd";

// --- CONFIGURATION ---
export const revalidate = 60; // Regenerate page every 60 seconds

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- HELPER: Fetch Luxury Projects Data ---
async function getLuxuryProjects(page = 1) {
  try {
    const baseURL = getBaseUrl();
    const limit = 20;
    const res = await fetch(
      `${baseURL}/portfolio-project/active/luxury_projects/page/${page}/limit/${limit}`,
      {
        // cache handled by page revalidate
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch luxury projects: ${res.status}`);
      return { data: [], meta: { totalPages: 1 } };
    }

    const responseJson = await res.json();
    
    // FIX: Return a structured object so { data, meta } can be destructured in the component
    return {
      data: responseJson.data || [],
      meta: responseJson.meta || { totalPages: 1 },
    };
  } catch (err) {
    console.error("Luxury Projects Fetch Error:", err);
    return { data: [], meta: { totalPages: 1 } };
  }
}

// --- HELPER: Fetch SEO Data ---
// async function getSeoData() {
//   try {
//     const baseURL = getBaseUrl();
//     const res = await fetch(`${baseURL}/seo-tag`, {
//       next: { revalidate: 60 },
//     });

//     if (!res.ok) return null;

//     const allTags = await res.json();

//     // Match the specific page URL for Luxury Projects
//     if (Array.isArray(allTags)) {
//       return allTags.find(
//         (tag) =>
//           tag.page_name === "https://hcinterior.in/luxury-projects" ||
//           tag.page_name?.endsWith("/luxury-projects")
//       );
//     }
//     return null;
//   } catch (err) {
//     console.error("SEO Fetch Error:", err);
//     return null;
//   }
// }

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/luxury-projects")}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
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
    return data?.json_content?.sections?.luxury_projects || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}

// --- DYNAMIC METADATA GENERATION ---
// export async function generateMetadata() {
//   const seoData = await getSeoData();

//   const defaultTitle =
//     "Luxury Interior Project Interior Portfolio : High creation Interior";
//   const defaultDesc =
//     "Discover High Creation Interior's luxury interior project portfolio, featuring exquisite designs and elegant solutions crafted to transform spaces into timeless masterpieces.";
//   const defaultCanonical = "https://hcinterior.in/luxury-projects";

//   return {
//     title: seoData?.title || defaultTitle,
//     description: seoData?.meta_description || defaultDesc,
//     alternates: {
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
  const seo = await getSeoData();

  const title =
    seo?.meta_title || "Luxury Interior Project Interior Portfolio : High creation Interior";
  const description =
    seo?.meta_description ||
   "Discover High Creation Interior's luxury interior project portfolio, featuring exquisite designs and elegant solutions crafted to transform spaces into timeless masterpieces.";

   const ogTitle = seo?.og_title || title;
const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/luxury-projects",
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
    // openGraph: {
    //   title,
    //   description,
    //   url: canonical,
    //   type: "website",
    //   ...(seo?.og_image && {
    //     images: [{ url: seo.og_image, width: 1200, height: 630 }],
    //   }),
    // },

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


// --- MAIN SERVER COMPONENT ---
export default async function LuxuryProjects({ searchParams }) {
  const seo = await getSeoData(); 
  const slugMap = await getGallerySlugMap("luxury-projects", "project-gallery");
  // Get current page from URL query params (default to 1)
  // Await searchParams as per Next.js 15+ (if you are on older versions, await is not needed but safe)
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;

  // Fetch data for the current page
  const { data: projects, meta } = await getLuxuryProjects(currentPage);
  const totalPages = meta?.totalPages || 1;

  const headingData = await getHeadingDescriptionData();

  const HeadingTag = headingData?.headingTag || "h1";
const headingText = headingData?.headingText || "Luxury Projects";
const headingStyle = {
 textShadow: buildTextShadow(
    headingData?.headingShadowEnabled,
    headingData?.headingShadowIntensity
  ),
  fontFamily: "inherit",
  ...(headingData?.headingColor && { color: headingData.headingColor }),
};

const descriptionText =
  headingData?.descriptionText ||
  "Luxury is not just seen, it is felt and experienced—explore our collection of luxury interiors, thoughtfully designed with premium materials, bespoke details, and timeless sophistication to create homes that are truly extraordinary."
const descriptionStyle = {
  ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
  textShadow: buildTextShadow(
    headingData?.descriptionShadowEnabled,
    headingData?.descriptionShadowIntensity
  ),
};

const bannerImage = headingData?.bannerImage || "";
const bannerStyle = bannerImage
  ? {
      backgroundImage: `url("${bannerImage}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
     aspectRatio: "1900 / 441",
    }
  : {};

  const headingBlock = (
    <>
  <HeadingTag id="luxury-projects-heading" className="wallpaperHeading" style={headingStyle}>
  {headingText}
</HeadingTag>
<p id="luxury-projects-description" className="px-lg-5 fs-6 text-muted" style={descriptionStyle}>
  {descriptionText}
</p>
<style>{`
  ${headingData?.headingColor ? `#luxury-projects-heading { color: ${headingData.headingColor} !important; }` : ""}
  ${headingData?.descriptionColor ? `#luxury-projects-description { color: ${headingData.descriptionColor} !important; }` : ""}
  ${headingData?.descriptionFontSize ? `#luxury-projects-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
  #luxury-projects-heading { text-shadow: ${buildTextShadow(headingData?.headingShadowEnabled, headingData?.headingShadowIntensity)} !important; }
  #luxury-projects-description { text-shadow: ${buildTextShadow(headingData?.descriptionShadowEnabled, headingData?.descriptionShadowIntensity)} !important; }
`}</style>
      </>
  );

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <main>
        {/* <section className="container my-5">
          <div className="text-center mb-5"> */}
          {/* <div
  className={bannerImage ? "w-100 d-flex align-items-center justify-content-center mb-5" : "container mt-5"}
  style={bannerStyle}
>
  <div className={bannerImage ? "container text-center py-5" : "text-center mb-5 row mx-0"}>
            <HeadingTag id="luxury-projects-heading" className="wallpaperHeading" style={headingStyle}>
  {headingText}
</HeadingTag>
<p id="luxury-projects-description" className="px-lg-5 fs-6 text-muted" style={descriptionStyle}>
  {descriptionText}
</p>
<style>{`
  ${headingData?.headingColor ? `#luxury-projects-heading { color: ${headingData.headingColor} !important; }` : ""}
  ${headingData?.descriptionColor ? `#luxury-projects-description { color: ${headingData.descriptionColor} !important; }` : ""}
  ${headingData?.descriptionFontSize ? `#luxury-projects-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
  #luxury-projects-heading { text-shadow: ${buildTextShadow(headingData?.headingShadowEnabled, headingData?.headingShadowIntensity)} !important; }
  #luxury-projects-description { text-shadow: ${buildTextShadow(headingData?.descriptionShadowEnabled, headingData?.descriptionShadowIntensity)} !important; }
`}</style>
          </div>
         </div> */}

                 {bannerImage ? (
          <MediaBg
            src={bannerImage}
            fallbackAlt={headingText}
            className="w-100 d-flex align-items-center justify-content-center mb-5"
            style={{ aspectRatio: "1900 / 441" }}
          >
            <div className="container text-center py-5">{headingBlock}</div>
          </MediaBg>
        ) : (
          <div className="container mt-5">
            <div className="text-center mb-5 row mx-0">{headingBlock}</div>
          </div>
        )}

        <section className="resi_card">
          <div className="container">
            <div className="row mx-0 g-4">
              {projects && projects.length > 0 ? (
                projects.map((project, index) => (
                  <div key={index} className="col-lg-4 col-md-6 col-12">
                    <ResidentialCard
                      projectCardLink={pageGalleryHref("luxury-projects", slugMap, project.id, "project-gallery")}
                      cardNameResid="card_product"
                      resiImgUrl={project.image}
                      resiImgALt={project.title ?? defaultAltText}
                      resiImgClass={"resi_img"}
                      residentialTitle={project.title}
                      residentialTitleClass="product_heading"
                      // residentialDescriptiion={project.description}
                      residentialClassCss="team_designation mb-0"
                      residentialButton="View More"
                      residentialButtonUrl={pageGalleryHref("luxury-projects", slugMap, project.id, "project-gallery")}
                    />
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p>No projects found.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav aria-label="Page navigation example mt-5 pt-5">
                <ul className="pagination justify-content-center mt-5">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <a
                      className="page-link"
                      href={
                        currentPage > 1
                          ? `/luxury-projects?page=${currentPage - 1}`
                          : "#"
                      }
                      aria-disabled={currentPage === 1}
                    >
                      Previous
                    </a>
                  </li>

                  {/* Render Page Numbers */}
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <li
                        key={index}
                        className={`page-item ${
                          currentPage === pageNum ? "active" : ""
                        }`}
                      >
                        <a
                          className="page-link"
                          href={`/luxury-projects?page=${pageNum}`}
                        >
                          {pageNum}
                        </a>
                      </li>
                    );
                  })}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <a
                      className="page-link"
                      href={
                        currentPage < totalPages
                          ? `/luxury-projects?page=${currentPage + 1}`
                          : "#"
                      }
                      aria-disabled={currentPage === totalPages}
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </section>
        <hr className="mt-5" />
      </main>
    </MainLayout>
  );
}