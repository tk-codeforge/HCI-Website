// import { getGallerySlugMap, pageGalleryHref } from "@/utils/slugEdit";
// import ResidentialCard from "../components/ResidentialCard";
// import MainLayout from "../layouts/MainLayout";
// import { defaultAltText } from "@/utils/helper";
// import { buildTextShadow } from "@/utils/textShadow";
// import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
// import { MediaBg } from "../components/MediaImage";
// import JsonLd from "../components/JsonLd";

// // --- CONFIGURATION ---
// export const revalidate = 60; // Regenerate page every 60 seconds

// // --- HELPER: Base URL Logic ---
// const getBaseUrl = () => {
//   return process.env.NODE_ENV === "development"
//     ? process.env.NEXT_PUBLIC_API_DEV_URL
//     : process.env.NEXT_PUBLIC_API_BASE_URL;
// };

// // --- HELPER: Fetch Residential Projects Data ---
// async function getResidentialProjects(page = 1) {
//   try {
//     const baseURL = getBaseUrl();
//     const limit = 20;
//     const res = await fetch(
//       `${baseURL}/portfolio-project/active/residential_projects/page/${page}/limit/${limit}`,
//       {
//         next: { revalidate: 60 },
//       }
//     );

//     if (!res.ok) {
//       console.error(`Failed to fetch residential projects: ${res.status}`);
//       return { data: [], meta: { totalPages: 1 } };
//     }

//     const responseJson = await res.json();
    
//     return {
//       data: responseJson.data || [],
//       meta: responseJson.meta || { totalPages: 1 },
//     };
//   } catch (err) {
//     console.error("Residential Projects Fetch Error:", err);
//     return { data: [], meta: { totalPages: 1 } };
//   }
// }

// // --- HELPER: Fetch SEO Data ---
// // async function getSeoData() {
// //   try {
// //     const baseURL = getBaseUrl();
// //     const res = await fetch(`${baseURL}/seo-tag`, {
// //       next: { revalidate: 60 },
// //     });

// //     if (!res.ok) return null;

// //     const allTags = await res.json();

// //     if (Array.isArray(allTags)) {
// //       return allTags.find(
// //         (tag) =>
// //           tag.page_name === "https://hcinterior.in/residential-projects" ||
// //           tag.page_name?.endsWith("/residential-projects")
// //       );
// //     }
// //     return null;
// //   } catch (err) {
// //     console.error("SEO Fetch Error:", err);
// //     return null;
// //   }
// // }

// async function getSeoData() {
//   try {
//     const baseURL = getBaseUrl();
//     const res = await fetch(
//       `${baseURL}/seo-tag/route?path=${encodeURIComponent("/residential-project")}`,
//       { next: { revalidate: 60 } }
//     );
//     if (!res.ok) return null;
//     return await res.json();
//   } catch (err) {
//     console.error("SEO Fetch Error:", err);
//     return null;
//   }
// }

// async function getHeadingDescriptionData() {
//   try {
//     const baseURL = getBaseUrl();
//     const res = await fetch(`${baseURL}/cms-content/manage_heading_description`, {
//       next: { revalidate: 60 },
//     });

//     if (!res.ok) return null;

//     const record = await res.json();
//     const data = Array.isArray(record) ? record[0] : record;
//     return data?.json_content?.sections?.residential_projects || null;
//   } catch (err) {
//     console.error("Heading/Description Fetch Error:", err);
//     return null;
//   }
// }

// // --- DYNAMIC METADATA GENERATION ---
// // export async function generateMetadata() {
// //   const seoData = await getSeoData();

// //   const defaultTitle =
// //     "Residential Project Interior Portfolio : High creation Interior";
// //   const defaultDesc =
// //     "Every home has a story, and we are proud to help bring it to life. Explore our portfolio of beautifully designed residential interiors, where stunning design, modern functionality, and meticulous attention to detail come together seamlessly. ";
// //   const defaultCanonical = "https://hcinterior.in/residential-projects";

// //   return {
// //     title: seoData?.title || defaultTitle,
// //     description: seoData?.meta_description || defaultDesc,
// //     alternates: {
// //       canonical: seoData?.page_name || defaultCanonical,
// //     },
// //     openGraph: {
// //       title: seoData?.title || defaultTitle,
// //       description: seoData?.meta_description || defaultDesc,
// //       url: seoData?.page_name || defaultCanonical,
// //       type: "website",
// //     },
// //   };
// // }

// export async function generateMetadata() {
//   const seo = await getSeoData();

//   const title =
//     seo?.meta_title || "Residential Project Interior Portfolio : High creation Interior";
//   const description =
//     seo?.meta_description ||
//    "Every home has a story, and we are proud to help bring it to life. Explore our portfolio of beautifully designed residential interiors, where stunning design, modern functionality, and meticulous attention to detail come together seamlessly. ";

//    const ogTitle = seo?.og_title || title;
// const ogDescription = seo?.og_description || description;

//   const canonical = getCanonicalUrl({
//     canonicalUrl: seo?.canonical_url,
//     fallbackPath: "/residential-projects",
//   });
//   const { index, follow } = seo
//     ? getRobotsDirectives(seo)
//     : { index: true, follow: true };

//   return {
//     title,
//     description,
//     ...(seo?.keywords && { keywords: seo.keywords }),
//     alternates: { canonical },
//     robots: { index, follow },
//     // 
    
//         openGraph: {
//       title: ogTitle,
//       description: ogDescription,
//       url: canonical,
//       type: "website",
//       images: seo?.og_image
//         ? [{ url: seo.og_image, width: 1200, height: 630 }]
//         : [{ url: "/images/new_hc_logo.png" }],
//     },
//   };
// }

// // --- MAIN SERVER COMPONENT ---
// export default async function ResidentialProjects({ searchParams }) {
//   const seo = await getSeoData();
//   const slugMap = await getGallerySlugMap("residential-projects", "project-gallery");
//   const params = await searchParams;
//   const currentPage = Number(params?.page) || 1;

//   const { data: projects, meta } = await getResidentialProjects(currentPage);
//   const totalPages = meta?.totalPages || 1;

//   const headingData = await getHeadingDescriptionData();

//   const HeadingTag = headingData?.headingTag || "h1";
// const headingText = headingData?.headingText || "Residential Projects";
// const headingStyle = {
//   textShadow: buildTextShadow(
//     headingData?.headingShadowEnabled,
//     headingData?.headingShadowIntensity
//   ),
//   fontFamily: "inherit",
//   ...(headingData?.headingColor && { color: headingData.headingColor }),
// };

// const descriptionText =
//   headingData?.descriptionText ||
//   "Explore a curated selection of premium living room interior designs and décor ideas at High Creation. We offer customizable, functional, and stylish solutions to elevate your living space. From modular TV units to wall art and innovative wall designs, find all the inspiration you need to transform your living room. Start browsing today to discover designs that perfectly reflect your personal style."
// const descriptionStyle = {
//   ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
//   textShadow: buildTextShadow(
//     headingData?.descriptionShadowEnabled,
//     headingData?.descriptionShadowIntensity
//   ),
// };

// const bannerImage = headingData?.bannerImage || "";
// const bannerStyle = bannerImage
//   ? {
//       backgroundImage: `url("${bannerImage}")`,
//       backgroundSize: "cover",
//       backgroundPosition: "center",
//      aspectRatio: "1900 / 441",
//     }
//   : {};
  
//   const headingBlock = (
//     <>
//      <HeadingTag id="residential-projects-heading" className="wallpaperHeading" style={headingStyle}>
//   {headingText}
// </HeadingTag>
// <p id="residential-projects-description" className="px-lg-5 fs-6 text-muted" style={descriptionStyle}>
//   {descriptionText}
// </p>
// <style>{`
//   ${headingData?.headingColor ? `#residential-projects-heading { color: ${headingData.headingColor} !important; }` : ""}
//   ${headingData?.descriptionColor ? `#residential-projects-description { color: ${headingData.descriptionColor} !important; }` : ""}
//   ${headingData?.descriptionFontSize ? `#residential-projects-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
//   #residential-projects-heading { text-shadow: ${buildTextShadow(headingData?.headingShadowEnabled, headingData?.headingShadowIntensity)} !important; }
//   #residential-projects-description { text-shadow: ${buildTextShadow(headingData?.descriptionShadowEnabled, headingData?.descriptionShadowIntensity)} !important; }
// `}</style>
//     </>
//      );


//   return (
//     <MainLayout>
//       <JsonLd data={seo?.custom_schema} />
//       <main>
//         {/* EXACT ORIGINAL HERO SECTION RESTORED */}
//         {/* <section className="container my-5">
//           <div className="text-center mb-5"> */}

//           {/* <div
//   className={bannerImage ? "w-100 d-flex align-items-center justify-content-center mb-5" : "container mt-5"}
//   style={bannerStyle}
// >
//   <div className={bannerImage ? "container text-center py-5" : "text-center mb-5 row mx-0"}>
//             <HeadingTag id="residential-projects-heading" className="wallpaperHeading" style={headingStyle}>
//   {headingText}
// </HeadingTag>
// <p id="residential-projects-description" className="px-lg-5 fs-6 text-muted" style={descriptionStyle}>
//   {descriptionText}
// </p>
// <style>{`
//   ${headingData?.headingColor ? `#residential-projects-heading { color: ${headingData.headingColor} !important; }` : ""}
//   ${headingData?.descriptionColor ? `#residential-projects-description { color: ${headingData.descriptionColor} !important; }` : ""}
//   ${headingData?.descriptionFontSize ? `#residential-projects-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
//   #residential-projects-heading { text-shadow: ${buildTextShadow(headingData?.headingShadowEnabled, headingData?.headingShadowIntensity)} !important; }
//   #residential-projects-description { text-shadow: ${buildTextShadow(headingData?.descriptionShadowEnabled, headingData?.descriptionShadowIntensity)} !important; }
// `}</style>
//           </div>
//         </div> */}
//         {bannerImage ? (
//                     <MediaBg src={bannerImage} alt={headingData?.bannerAlt} fallbackAlt={headingText}
//             className="w-100 d-flex align-items-center justify-content-center mb-5"
//             style={{ aspectRatio: "1900 / 441" }}
//           >
//             <div className="container text-center py-5">{headingBlock}</div>
//           </MediaBg>
//         ) : (
//           <div className="container mt-5">
//             <div className="text-center mb-5 row mx-0">{headingBlock}</div>
//           </div>
//         )}

//         {/* Modernized Projects Grid */}
//         <section className="resi_card">
//           <div className="container">
//             <div className="row mx-0 g-4">
//               {projects && projects.length > 0 ? (
//                 projects.map((project, index) => (
//                   <div key={index} className="col-lg-4 col-md-6 col-sm-12">
//                     <ResidentialCard
//                       projectCardLink={pageGalleryHref("residential-projects", slugMap, project.id, "project-gallery")}
//                       cardNameResid="card_product"
//                       resiImgUrl={project.image}
//                       resiImgALt={project.title ?? defaultAltText}
//                                             cmsAltResi={project.image_alt}
//                       resiImgClass={"resi_img"}
//                       residentialTitle={project.title}
//                       residentialTitleClass="product_heading h4"
//                       // residentialDescriptiion={project.description}
//                       residentialClassCss="team_designation"
//                       residentialButton="Explore Design"
//                       residentialButtonUrl={pageGalleryHref("residential-projects", slugMap, project.id, "project-gallery")}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <div className="col-12 text-center py-5">
//                   <div className="p-5 bg-white rounded-4 shadow-sm">
//                     <h3 className="text-muted">New designs coming soon.</h3>
//                     <p>We are currently updating our portfolio.</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Modern Pagination Controls */}
//             {totalPages > 1 && (
//               <nav aria-label="Project pagination" className="mt-5 pt-4">
//                 <style>{`
//                   @media (max-width: 768px) {
//                     .mobile-wrap-pagination {
//                       flex-wrap: wrap !important;
//                     }
//                     .mobile-full-width {
//                       flex: 0 0 100%;
//                       display: flex;
//                       justify-content: center;
//                       margin-bottom: 15px;
//                     }
//                     .mobile-full-width:last-child {
//                       margin-bottom: 0;
//                       margin-top: 15px;
//                     }
//                   }
//                 `}</style>
//                 <ul className="pagination pagination-lg justify-content-center gap-2 mobile-wrap-pagination">
//                   <li className={`page-item mobile-full-width ${currentPage === 1 ? "disabled" : ""}`}>
//                     <a
//                       className="page-link rounded-pill px-4 border-0 shadow-sm"
//                       href={currentPage > 1 ? `/residential-projects?page=${currentPage - 1}` : "#"}
//                       aria-disabled={currentPage === 1}
//                     >
//                       Previous
//                     </a>
//                   </li>

//                   {[...Array(totalPages)].map((_, index) => {
//                     const pageNum = index + 1;
//                     return (
//                       <li key={index} className={`page-item ${currentPage === pageNum ? "active" : ""}`}>
//                         <a
//                           className={`page-link rounded-circle border-0 shadow-sm ${currentPage === pageNum ? 'bg-dark text-white' : ''}`}
//                           style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//                           href={`/residential-projects?page=${pageNum}`}
//                         >
//                           {pageNum}
//                         </a>
//                       </li>
//                     );
//                   })}

//                   <li className={`page-item mobile-full-width ${currentPage === totalPages ? "disabled" : ""}`}>
//                     <a
//                       className="page-link rounded-pill px-4 border-0 shadow-sm"
//                       href={currentPage < totalPages ? `/residential-projects?page=${currentPage + 1}` : "#"}
//                       aria-disabled={currentPage === totalPages}
//                     >
//                       Next
//                     </a>
//                   </li>
//                 </ul>
//               </nav>
//             )}
//           </div>
//         </section>
//         <hr className="mt-5" />
//       </main>
//     </MainLayout>
//   );
// }



import { getGallerySlugMap, pageGalleryHref } from "@/utils/slugEdit";
import ResidentialCard from "../components/ResidentialCard";
import MainLayout from "../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";
import { buildTextShadow } from "@/utils/textShadow";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../components/JsonLd";

export const revalidate = 60;

const PAGE_PATH = "/residential-projects";
const REVALIDATE_SECONDS = 60;
const MEDIA_ALT_MAP_REVALIDATE_SECONDS = 60;
const ALLOWED_HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

const getApiUrl = (path) => {
  const baseUrl = getBaseUrl();
  return baseUrl ? `${baseUrl.replace(/\/+$/, "")}${path}` : null;
};

async function getResidentialProjects(page = 1) {
  const url = getApiUrl(
    `/portfolio-project/active/residential_projects/page/${page}/limit/20`
  );

  if (!url) {
    console.error("Residential Projects API base URL is not configured.");
    return { data: [], meta: { totalPages: 1 } };
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      console.error(`Failed to fetch residential projects: ${res.status}`);
      return { data: [], meta: { totalPages: 1 } };
    }

    const responseJson = await res.json();
    return {
      data: Array.isArray(responseJson?.data) ? responseJson.data : [],
      meta: responseJson?.meta || { totalPages: 1 },
    };
  } catch (err) {
    console.error("Residential Projects Fetch Error:", err);
    return { data: [], meta: { totalPages: 1 } };
  }
}

async function getSeoData() {
  const url = getApiUrl(`/seo-tag/route?path=${encodeURIComponent("/residential-project")}`);
  if (!url) return null;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

async function getHeadingDescriptionData() {
  const url = getApiUrl("/cms-content/manage_heading_description");
  if (!url) return null;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const record = await res.json();
    const data = Array.isArray(record) ? record[0] : record;
    return data?.json_content?.sections?.residential_projects || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}

// Resolve Media Library alt text on the server once instead of making every
// residential card hydrate and independently run the same lookup hook.
async function getMediaAltMap() {
  const url = getApiUrl("/cms-parent-child/media-library/alt-map");
  if (!url) return {};

  try {
    const res = await fetch(url, {
      next: { revalidate: MEDIA_ALT_MAP_REVALIDATE_SECONDS },
    });
    if (!res.ok) return {};

    const altMap = await res.json();
    return altMap && typeof altMap === "object" && !Array.isArray(altMap)
      ? altMap
      : {};
  } catch (err) {
    console.error("Media Library alt-map Fetch Error:", err);
    return {};
  }
}

function getMediaFileName(src) {
  if (!src || typeof src !== "string") return "";
  const withoutQueryOrHash = src.split("?")[0].split("#")[0];
  const encodedName = withoutQueryOrHash.split("/").pop() || "";
  try {
    return decodeURIComponent(encodedName);
  } catch {
    return encodedName;
  }
}

function getMediaLibraryAlt(src, altMap) {
  const fileName = getMediaFileName(src);
  return fileName ? altMap?.[fileName] || "" : "";
}

export async function generateMetadata() {
  const seo = await getSeoData();
  const title =
    seo?.meta_title ||
    "Residential Project Interior Portfolio : High creation Interior";
  const description =
    seo?.meta_description ||
    "Every home has a story, and we are proud to help bring it to life. Explore our portfolio of beautifully designed residential interiors, where stunning design, modern functionality, and meticulous attention to detail come together seamlessly.";
  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: PAGE_PATH,
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

export default async function ResidentialProjects({ searchParams }) {
  // Await works for both the plain searchParams object in Next.js 14 and the
  // promised searchParams shape used by newer Next.js versions.
  const params = await searchParams;
  const requestedPage = Number(params?.page);
  const currentPage =
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  // These requests do not depend on each other. Run them concurrently to reduce
  // server-side waiting time before the page can be sent to the browser.
  const [seo, slugMap, projectResult, headingData, mediaAltMap] = await Promise.all([
    getSeoData(),
    getGallerySlugMap("residential-projects", "project-gallery"),
    getResidentialProjects(currentPage),
    getHeadingDescriptionData(),
    getMediaAltMap(),
  ]);

  const projects = Array.isArray(projectResult?.data) ? projectResult.data : [];
  const rawTotalPages = Number(projectResult?.meta?.totalPages) || 1;
  const totalPages = Math.max(1, Math.floor(rawTotalPages));

  const requestedHeadingTag = String(headingData?.headingTag || "h1").toLowerCase();
  const HeadingTag = ALLOWED_HEADING_TAGS.has(requestedHeadingTag)
    ? requestedHeadingTag
    : "h1";
  const headingText = headingData?.headingText || "Residential Projects";
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
    "Explore a curated selection of premium living room interior designs and décor ideas at High Creation. We offer customizable, functional, and stylish solutions to elevate your living space. From modular TV units to wall art and innovative wall designs, find all the inspiration you need to transform your living room. Start browsing today to discover designs that perfectly reflect your personal style.";
  const descriptionStyle = {
    ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
    ...(headingData?.descriptionFontSize && {
      fontSize: `${Number(headingData.descriptionFontSize)}px`,
    }),
    textShadow: buildTextShadow(
      headingData?.descriptionShadowEnabled,
      headingData?.descriptionShadowIntensity
    ),
  };

  const bannerImage = headingData?.bannerImage || "";
  // Preserve alt precedence: page-specific CMS text, then Media Library value,
  // then the visible page heading as the final fallback.
  const bannerAlt =
    headingData?.bannerAlt || getMediaLibraryAlt(bannerImage, mediaAltMap) || headingText;

  const headingBlock = (
    <>
      <HeadingTag
        id="residential-projects-heading"
        className="wallpaperHeading"
        style={headingStyle}
      >
        {headingText}
      </HeadingTag>
      <p
        id="residential-projects-description"
        className="px-lg-5 fs-6 text-muted"
        style={descriptionStyle}
      >
        {descriptionText}
      </p>
      <style>{`
        ${headingData?.headingColor ? `#residential-projects-heading { color: ${headingData.headingColor} !important; }` : ""}
        ${headingData?.descriptionColor ? `#residential-projects-description { color: ${headingData.descriptionColor} !important; }` : ""}
        ${headingData?.descriptionFontSize ? `#residential-projects-description { font-size: ${Number(headingData.descriptionFontSize)}px !important; }` : ""}
        #residential-projects-heading { text-shadow: ${buildTextShadow(headingData?.headingShadowEnabled, headingData?.headingShadowIntensity)} !important; }
        #residential-projects-description { text-shadow: ${buildTextShadow(headingData?.descriptionShadowEnabled, headingData?.descriptionShadowIntensity)} !important; }

        .resi_card .residential-project-card {
          margin-bottom: 0;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .resi_card .residential-project-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        .resi_card .residential-project-card-image {
          transition: transform 0.5s ease;
        }
        .resi_card .residential-project-card:hover .residential-project-card-image {
          transform: scale(1.08);
        }
        @media (prefers-reduced-motion: reduce) {
          .resi_card .residential-project-card,
          .resi_card .residential-project-card-image {
            transition: none !important;
          }
          .resi_card .residential-project-card:hover,
          .resi_card .residential-project-card:hover .residential-project-card-image {
            transform: none !important;
          }
        }
      `}</style>
    </>
  );

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <main>
        {bannerImage ? (
          <section
            className="w-100 d-flex align-items-center justify-content-center mb-5"
            style={{ position: "relative", aspectRatio: "1900 / 441" }}
          >
            <img
              src={bannerImage}
              alt={bannerAlt}
              width={1900}
              height={441}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            <div className="container text-center py-5 position-relative w-100">
              {headingBlock}
            </div>
          </section>
        ) : (
          <div className="container mt-5">
            <div className="text-center mb-5 row mx-0">{headingBlock}</div>
          </div>
        )}

        <section className="resi_card">
          <div className="container">
            <div className="row mx-0 g-4">
              {projects.length > 0 ? (
                projects.map((project, index) => {
                  const projectHref = pageGalleryHref(
                    "residential-projects",
                    slugMap,
                    project.id,
                    "project-gallery"
                  );
                  // Keep the prior fallback order: CMS alt, Media Library alt,
                  // project title, then the site's default alt text.
                  const imageAlt =
                    project.image_alt ||
                    getMediaLibraryAlt(project.image, mediaAltMap) ||
                    project.title ||
                    defaultAltText;

                  return (
                    <div
                      key={project.id ?? `${project.title || "project"}-${index}`}
                      className="col-lg-4 col-md-6 col-sm-12"
                    >
                      <ResidentialCard
                        projectCardLink={projectHref}
                        cardNameResid="card_product"
                        resiImgUrl={project.image}
                        resiImgALt={imageAlt}
                        resolvedImageAlt={imageAlt}
                        resiImgClass="resi_img"
                        residentialTitle={project.title}
                        residentialTitleClass="product_heading h4"
                        residentialClassCss="team_designation"
                        residentialButton="Explore Design"
                        residentialButtonUrl={projectHref}
                        imageLoading={index === 0 ? "eager" : "lazy"}
                        imageFetchPriority={index === 0 ? "low" : undefined}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center py-5">
                  <div className="p-5 bg-white rounded-4 shadow-sm">
                    <h3 className="text-muted">New designs coming soon.</h3>
                    <p>We are currently updating our portfolio.</p>
                  </div>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <nav aria-label="Project pagination" className="mt-5 pt-4">
                <style>{`
                  @media (max-width: 768px) {
                    .mobile-wrap-pagination { flex-wrap: wrap !important; }
                    .mobile-full-width {
                      flex: 0 0 100%;
                      display: flex;
                      justify-content: center;
                      margin-bottom: 15px;
                    }
                    .mobile-full-width:last-child {
                      margin-bottom: 0;
                      margin-top: 15px;
                    }
                  }
                `}</style>
                <ul className="pagination pagination-lg justify-content-center gap-2 mobile-wrap-pagination">
                  <li
                    className={`page-item mobile-full-width ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <a
                      className="page-link rounded-pill px-4 border-0 shadow-sm"
                      href={currentPage > 1 ? `/residential-projects?page=${currentPage - 1}` : "#"}
                      aria-disabled={currentPage === 1}
                    >
                      Previous
                    </a>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNum = index + 1;
                    return (
                      <li
                        key={pageNum}
                        className={`page-item ${currentPage === pageNum ? "active" : ""}`}
                      >
                        <a
                          className={`page-link rounded-circle border-0 shadow-sm ${currentPage === pageNum ? "bg-dark text-white" : ""}`}
                          style={{
                            width: "48px",
                            height: "48px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          href={`/residential-projects?page=${pageNum}`}
                          aria-current={currentPage === pageNum ? "page" : undefined}
                        >
                          {pageNum}
                        </a>
                      </li>
                    );
                  })}

                  <li
                    className={`page-item mobile-full-width ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <a
                      className="page-link rounded-pill px-4 border-0 shadow-sm"
                      href={
                        currentPage < totalPages
                          ? `/residential-projects?page=${currentPage + 1}`
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
