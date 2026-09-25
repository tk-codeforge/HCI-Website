// import MainLayout from "../../layouts/MainLayout";
// import PortfolioCard from "../../components/PortfolioCard";
// import ExperienceForm from "../../components/ExperienceForm";
// import { notFound } from "next/navigation";

// // Force dynamic because we are rendering based on dynamic params
// export const dynamic = "force-dynamic";

// // --- HELPER: Base URL Logic ---
// const getBaseUrl = () => {
//   return process.env.NODE_ENV === "development"
//     ? process.env.NEXT_PUBLIC_API_DEV_URL
//     : process.env.NEXT_PUBLIC_API_BASE_URL;
// };

// // --- DYNAMIC METADATA GENERATION ---
// export async function generateMetadata({ params }) {
//   // CORRECTED: Next.js maps the param to the exact folder name 
//   const slug = params?.['experience-center'];

//   if (!slug) return { title: "Custom Experience Center" };

//   try {
//     const baseURL = getBaseUrl();
//     const res = await fetch(`${baseURL}/seo-tag?slug=${slug}`);
    
//     if (!res.ok) throw new Error("SEO fetch failed");
    
//     const allTags = await res.json();
//     const seoData = Array.isArray(allTags) 
//       ? allTags.find(tag => tag.page_name?.includes(slug)) 
//       : allTags;

//     const defaultTitle = `High Creation Interior - ${slug.replace(/-/g, ' ')}`;
//     const defaultDesc = `Explore our bespoke ${slug.replace(/-/g, ' ')} interior experience center.`;
//     // CHANGED: route now lives at experience-center/[experience-center]/page.jsx,
//     // so the public URL is /experience-center/<slug>, not a flat /<slug>.
//     const canonicalUrl = `/experience-center/${slug}`;

//     return {
//       title: seoData?.title || defaultTitle,
//       description: seoData?.meta_description || defaultDesc,
//       alternates: {
//         canonical: seoData?.page_name || canonicalUrl,
//       },
//       openGraph: {
//         title: seoData?.title || defaultTitle,
//         description: seoData?.meta_description || defaultDesc,
//         url: seoData?.page_name || canonicalUrl,
//         type: "website",
//       },
//       keywords: seoData?.metaKeywords || "design idea, interior design, experience center",
//     };
//   } catch (error) {
//     return {
//       title: "Custom Experience Center",
//       robots: "noindex",
//     };
//   }
// }

// // --- MAIN SERVER COMPONENT ---
// export default async function CustomExperienceCenterPage({ params }) {
//   // CORRECTED: Next.js maps the param to the exact folder name 
//   const slug = params?.['experience-center'];

//   if (!slug) {
//     return notFound();
//   }

//   // SAFETY CHECK: extra guard so this route only renders slugs that were
//   // actually generated as experience centers.
//   if (!slug.startsWith("experience-center-")) {
//      return notFound();
//   }

//   let experienceData = [];
//   let experienceDataVideo = [];

//   try {
//     const baseURL = getBaseUrl();

//     // CHANGED: was /cms-parent-child/... (the shared table with no slug
//     // support). Now points at the isolated experience-center-assets module.
//     const [dataRes, videoRes] = await Promise.all([
//       fetch(`${baseURL}/experience-center-assets/experience_center/${slug}`, { next: { revalidate: 60 } }),
//       fetch(`${baseURL}/experience-center-assets/experience_center_video/${slug}`, { next: { revalidate: 60 } })
//     ]);

//     if (dataRes.ok) experienceData = await dataRes.json();
//     if (videoRes.ok) experienceDataVideo = await videoRes.json();
    
//   } catch (err) {
//     console.error(`Experience Center Fetch Error for ${slug}:`, err);
//     return notFound(); 
//   }

//   return (
//     <MainLayout>
//       <main>
//         {/* Video Section */}
//         <section className="video_wrapper conatiner-fluid">
//           {experienceDataVideo[0]?.child_content?.image && (
//             <video
//               width="100%"
//               height="590"
//               className="object-fit-cover"
//               autoPlay
//               loop
//               muted
//               id="myVideo"
//             >
//               <source 
//                 src={experienceDataVideo[0]?.child_content?.image} 
//               />
//             </video>
//           )}
//         </section>

//         {/* Content Section */}
//         <section className="container my-5">
//           <div className="row mx-0 g-4">
//             {/* Left Column (Items 0 & 1) */}
//             <div className="col-lg-7">
//               {experienceData[0] && (
//                 <PortfolioCard
//                   cardDetailLink={`/experience-center/gallery?id=${experienceData[0]?.id}`}
//                   portCard={"card_portfolio portfolio_1"}
//                   portfolioImgBg={"portfolioimgall desig_gal_bg1 design_exper"}
//                   portfolioImg={experienceData[0]?.child_content?.image}
//                   portfolioTitle={experienceData[0]?.child_content?.title}
//                 />
//               )}
//               {experienceData[1] && (
//                 <PortfolioCard
//                   cardDetailLink={`/experience-center/gallery?id=${experienceData[1]?.id}`}
//                   portCard={"card_portfolio portfolio_1"}
//                   portfolioImgBg={"portfolioimgall desig_gal_bg2"}
//                   portfolioImg={experienceData[1]?.child_content?.image}
//                   portfolioTitle={experienceData[1]?.child_content?.title}
//                 />
//               )}
//             </div>

//             {/* Right Column (Form) */}
//             <div className="col-lg-5">
//               <ExperienceForm />
//             </div>

//             {/* Bottom Section (Remaining Items) */}
//             {experienceData[2] && (
//               <div className="col-lg-12">
//                 <PortfolioCard
//                   cardDetailLink={`/experience-center/gallery?id=${experienceData[2]?.id}`}
//                   portCard={"card_portfolio portfolio_1"}
//                   portfolioImgBg={"portfolioimgall desig_gal_bg4"}
//                   portfolioImg={experienceData[2]?.child_content?.image}
//                   portfolioTitle={experienceData[2]?.child_content?.title}
//                 />
//               </div>
//             )}

//             {experienceData[3] && (
//               <div className="col-lg-9">
//                 <PortfolioCard
//                   cardDetailLink={`/experience-center/gallery?id=${experienceData[3]?.id}`}
//                   portCard={"card_portfolio portfolio_1"}
//                   portfolioImgBg={"portfolioimgall desig_gal_bg5"}
//                   portfolioImg={experienceData[3]?.child_content?.image}
//                   portfolioTitle={experienceData[3]?.child_content?.title}
//                 />
//               </div>
//             )}

//             {experienceData[4] && (
//               <div className="col-lg-3">
//                 <PortfolioCard
//                   cardDetailLink={`/experience-center/gallery?id=${experienceData[4]?.id}`}
//                   portCard={"card_portfolio portfolio_1"}
//                   portfolioImgBg={"portfolioimgall desig_gal_bg6"}
//                   portfolioImg={experienceData[4]?.child_content?.image}
//                   portfolioTitle={experienceData[4]?.child_content?.title}
//                 />
//               </div>
//             )}

//             {experienceData[5] && (
//               <div className="col-lg-6">
//                 <PortfolioCard
//                   cardDetailLink={`/experience-center/gallery?id=${experienceData[5]?.id}`}
//                   portCard={"card_portfolio portfolio_1"}
//                   portfolioImgBg={"portfolioimgall desig_gal_bg7"}
//                   portfolioImg={experienceData[5]?.child_content?.image}
//                   portfolioTitle={experienceData[5]?.child_content?.title}
//                   portfolioClassCss="text-white w-75 mb-0 my-2 team_designation"
//                 />
//               </div>
//             )}

//             {experienceData[6] && (
//               <div className="col-lg-6">
//                 <PortfolioCard
//                   cardDetailLink={`/experience-center/gallery?id=${experienceData[6]?.id}`}
//                   portCard={"card_portfolio portfolio_1"}
//                   portfolioImgBg={"portfolioimgall desig_gal_bg8"}
//                   portfolioImg={experienceData[6]?.child_content?.image}
//                   portfolioTitle={experienceData[6]?.child_content?.title}
//                   portfolioClassCss="text-white w-75 mb-0 my-2 team_designation"
//                 />
//               </div>
//             )}
//           </div>
//         </section>
//         <hr />
//       </main>
//     </MainLayout>
//   );
// }


// import MainLayout from "../../layouts/MainLayout";
// import PortfolioCard from "../../components/PortfolioCard";
// import ExperienceForm from "../../components/ExperienceForm";
// import { notFound } from "next/navigation";

// // Force dynamic because we are rendering based on dynamic params
// export const dynamic = "force-dynamic";

// // --- HELPER: Base URL Logic ---
// const getBaseUrl = () => {
//   return process.env.NODE_ENV === "development"
//     ? process.env.NEXT_PUBLIC_API_DEV_URL
//     : process.env.NEXT_PUBLIC_API_BASE_URL;
// };

// // Background classes for cards after the first 7 (which keep their own
// // named desig_gal_bg1..8 classes below). Cycled so extra cards still get
// // some visual variety instead of all sharing one flat background.
// const EXTRA_BG_CLASSES = [
//   "desig_gal_bg1",
//   "desig_gal_bg2",
//   "desig_gal_bg4",
//   "desig_gal_bg5",
//   "desig_gal_bg6",
//   "desig_gal_bg7",
//   "desig_gal_bg8",
// ];

// // --- DYNAMIC METADATA GENERATION ---
// export async function generateMetadata({ params }) {
//   // CORRECTED: Next.js maps the param to the exact folder name
//   const slug = params?.["experience-center"];

//   if (!slug) return { title: "Custom Experience Center" };

//   try {
//     const baseURL = getBaseUrl();
//     const res = await fetch(`${baseURL}/seo-tag?slug=${slug}`);

//     if (!res.ok) throw new Error("SEO fetch failed");

//     const allTags = await res.json();
//     const seoData = Array.isArray(allTags)
//       ? allTags.find((tag) => tag.page_name?.includes(slug))
//       : allTags;

//     const defaultTitle = `High Creation Interior - ${slug.replace(/-/g, " ")}`;
//     const defaultDesc = `Explore our bespoke ${slug.replace(/-/g, " ")} interior experience center.`;
//     // Route lives at experience-center/[experience-center]/page.jsx,
//     // so the public URL is /experience-center/<slug>, not a flat /<slug>.
//     const canonicalUrl = `/experience-center/${slug}`;

//     return {
//       title: seoData?.title || defaultTitle,
//       description: seoData?.meta_description || defaultDesc,
//       alternates: {
//         canonical: seoData?.page_name || canonicalUrl,
//       },
//       openGraph: {
//         title: seoData?.title || defaultTitle,
//         description: seoData?.meta_description || defaultDesc,
//         url: seoData?.page_name || canonicalUrl,
//         type: "website",
//       },
//       keywords: seoData?.metaKeywords || "design idea, interior design, experience center",
//     };
//   } catch (error) {
//     return {
//       title: "Custom Experience Center",
//       robots: "noindex",
//     };
//   }
// }

// // --- MAIN SERVER COMPONENT ---
// export default async function CustomExperienceCenterPage({ params }) {
//   // CORRECTED: Next.js maps the param to the exact folder name
//   const slug = params?.["experience-center"];

//   if (!slug) {
//     return notFound();
//   }

//   // SAFETY CHECK: extra guard so this route only renders slugs that were
//   // actually generated as experience centers.
//   if (!slug.startsWith("experience-center-")) {
//     return notFound();
//   }

//   let experienceData = [];
//   let experienceDataVideo = [];

//   try {
//     const baseURL = getBaseUrl();

//     const [dataRes, videoRes] = await Promise.all([
//       fetch(`${baseURL}/experience-center-assets/experience_center/${slug}`, { next: { revalidate: 60 } }),
//       fetch(`${baseURL}/experience-center-assets/experience_center_video/${slug}`, { next: { revalidate: 60 } }),
//     ]);

//     if (dataRes.ok) experienceData = await dataRes.json();
//     if (videoRes.ok) experienceDataVideo = await videoRes.json();
//   } catch (err) {
//     console.error(`Experience Center Fetch Error for ${slug}:`, err);
//     return notFound();
//   }

//   // Cards 8+ (index 7 onward) — no cap. Laid out two per row (col-lg-6
//   // each); if the trailing row would only have one image left, it spans
//   // the full width instead, so a lone extra image never sits half-empty.
//   const extraImages = experienceData.slice(7);

//   return (
//     <MainLayout>
//       <main>
//         {/* Video Section */}
//         <section className="video_wrapper conatiner-fluid">
//           {experienceDataVideo[0]?.child_content?.image && (
//             <video
//               width="100%"
//               height="590"
//               className="object-fit-cover"
//               autoPlay
//               loop
//               muted
//               id="myVideo"
//             >
//               <source src={experienceDataVideo[0]?.child_content?.image} />
//             </video>
//           )}
//         </section>

//         {/* Content Section */}
//         <section className="container my-5">
//           <div className="row mx-0 g-4">
//             {/* Left Column (Items 0 & 1) */}
//             <div className="col-lg-7">
//               {experienceData[0] && (
//                 <PortfolioCard
//                   cardDetailLink={`/experience-center/gallery?id=${experienceData[0]?.id}`}
//                   portCard={"card_portfolio portfolio_1"}
//                   portfolioImgBg={"portfolioimgall desig_gal_bg1 design_exper"}
//                   portfolioImg={experienceData[0]?.child_content?.image}
//                   portfolioTitle={experienceData[0]?.child_content?.title}
//                 />
//               )}
//               {experienceData[1] && (
//                 <PortfolioCard
//                   cardDetailLink={`/experience-center/gallery?id=${experienceData[1]?.id}`}
//                   portCard={"card_portfolio portfolio_1"}
//                   portfolioImgBg={"portfolioimgall desig_gal_bg2"}
//                   portfolioImg={experienceData[1]?.child_content?.image}
//                   portfolioTitle={experienceData[1]?.child_content?.title}
//                 />
//               )}
//             </div>

//             {/* Right Column (Form) */}
//             <div className="col-lg-5">
//               <ExperienceForm />
//             </div>

//             {/* Bottom Section (Remaining Items) */}
//             {experienceData[2] && (
//               <div className="col-lg-12">
//                 <PortfolioCard
//                   cardDetailLink={`/experience-center/gallery?id=${experienceData[2]?.id}`}
//                   portCard={"card_portfolio portfolio_1"}
//                   portfolioImgBg={"portfolioimgall desig_gal_bg4"}
//                   portfolioImg={experienceData[2]?.child_content?.image}
//                   portfolioTitle={experienceData[2]?.child_content?.title}
//                 />
//               </div>
//             )}

//             {experienceData[3] && (
//               <div className="col-lg-9">
//                 <PortfolioCard
//                   cardDetailLink={`/experience-center/gallery?id=${experienceData[3]?.id}`}
//                   portCard={"card_portfolio portfolio_1"}
//                   portfolioImgBg={"portfolioimgall desig_gal_bg5"}
//                   portfolioImg={experienceData[3]?.child_content?.image}
//                   portfolioTitle={experienceData[3]?.child_content?.title}
//                 />
//               </div>
//             )}

//             {experienceData[4] && (
//               <div className="col-lg-3">
//                 <PortfolioCard
//                   cardDetailLink={`/experience-center/gallery?id=${experienceData[4]?.id}`}
//                   portCard={"card_portfolio portfolio_1"}
//                   portfolioImgBg={"portfolioimgall desig_gal_bg6"}
//                   portfolioImg={experienceData[4]?.child_content?.image}
//                   portfolioTitle={experienceData[4]?.child_content?.title}
//                 />
//               </div>
//             )}

//             {experienceData[5] && (
//               <div className="col-lg-6">
//                 <PortfolioCard
//                   cardDetailLink={`/experience-center/gallery?id=${experienceData[5]?.id}`}
//                   portCard={"card_portfolio portfolio_1"}
//                   portfolioImgBg={"portfolioimgall desig_gal_bg7"}
//                   portfolioImg={experienceData[5]?.child_content?.image}
//                   portfolioTitle={experienceData[5]?.child_content?.title}
//                   portfolioClassCss="text-white w-75 mb-0 my-2 team_designation"
//                 />
//               </div>
//             )}

//             {experienceData[6] && (
//               <div className="col-lg-6">
//                 <PortfolioCard
//                   cardDetailLink={`/experience-center/gallery?id=${experienceData[6]?.id}`}
//                   portCard={"card_portfolio portfolio_1"}
//                   portfolioImgBg={"portfolioimgall desig_gal_bg8"}
//                   portfolioImg={experienceData[6]?.child_content?.image}
//                   portfolioTitle={experienceData[6]?.child_content?.title}
//                   portfolioClassCss="text-white w-75 mb-0 my-2 team_designation"
//                 />
//               </div>
//             )}

//             {/* Cards 8+ — unlimited. Pairs of 2 (col-lg-6 each); a
//                 trailing single left over gets col-lg-12 instead. */}
//             {extraImages.map((item, i) => {
//               const isLastOdd = i === extraImages.length - 1 && extraImages.length % 2 === 1;
//               const colClass = isLastOdd ? "col-lg-12" : "col-lg-6";
//               const bgClass = EXTRA_BG_CLASSES[i % EXTRA_BG_CLASSES.length];
//               return (
//                 <div className={colClass} key={item.id}>
//                   <PortfolioCard
//                     cardDetailLink={`/experience-center/gallery?id=${item?.id}`}
//                     portCard={"card_portfolio portfolio_1"}
//                     portfolioImgBg={`portfolioimgall ${bgClass}`}
//                     portfolioImg={item?.child_content?.image}
//                     portfolioTitle={item?.child_content?.title}
//                     portfolioClassCss="text-white w-75 mb-0 my-2 team_designation"
//                   />
//                 </div>
//               );
//             })}
//           </div>
//         </section>
//         <hr />
//       </main>
//     </MainLayout>
//   );
// }


import MainLayout from "../../layouts/MainLayout";
import PortfolioCard from "../../components/PortfolioCard";
import ExperienceForm from "../../components/ExperienceForm";
import { notFound } from "next/navigation";

// Force dynamic because we are rendering based on dynamic params
export const dynamic = "force-dynamic";

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// Card 8+ reuses the two CSS classes actually built for this shape instead
// of cycling through all eight: desig_gal_bg7 / desig_gal_bg8 are the pair
// already used for the fixed col-lg-6 + col-lg-6 row (cards 6 & 7), so every
// extra pair gets the same equal-height treatment. desig_gal_bg4 is the
// class built for the single full-width col-lg-12 card (card 3), reused for
// a trailing odd one out so it doesn't inherit some other row's sizing.
const EXTRA_PAIR_BG_CLASSES = ["desig_gal_bg7", "desig_gal_bg8"];
const EXTRA_SINGLE_BG_CLASS = "desig_gal_bg4";

// --- DYNAMIC METADATA GENERATION ---
export async function generateMetadata({ params }) {
  // CORRECTED: Next.js maps the param to the exact folder name
  const slug = params?.["experience-center"];

  if (!slug) return { title: "Custom Experience Center" };

  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/seo-tag?slug=${slug}`);

    if (!res.ok) throw new Error("SEO fetch failed");

    const allTags = await res.json();
    const seoData = Array.isArray(allTags)
      ? allTags.find((tag) => tag.page_name?.includes(slug))
      : allTags;

    const defaultTitle = `High Creation Interior - ${slug.replace(/-/g, " ")}`;
    const defaultDesc = `Explore our bespoke ${slug.replace(/-/g, " ")} interior experience center.`;
    // Route lives at experience-center/[experience-center]/page.jsx,
    // so the public URL is /experience-center/<slug>, not a flat /<slug>.
    const canonicalUrl = `/exp-center/${slug}`;

    return {
      title: seoData?.title || defaultTitle,
      description: seoData?.meta_description || defaultDesc,
      alternates: {
        canonical: seoData?.page_name || canonicalUrl,
      },
      openGraph: {
        title: seoData?.title || defaultTitle,
        description: seoData?.meta_description || defaultDesc,
        url: seoData?.page_name || canonicalUrl,
        type: "website",
      },
      keywords: seoData?.metaKeywords || "design idea, interior design, experience center",
    };
  } catch (error) {
    return {
      title: "Custom Experience Center",
      robots: "noindex",
    };
  }
}

// --- MAIN SERVER COMPONENT ---
export default async function CustomExperienceCenterPage({ params }) {
  // CORRECTED: Next.js maps the param to the exact folder name
  const slug = params?.["experience-center"];

  if (!slug) {
    return notFound();
  }

  // SAFETY CHECK: extra guard so this route only renders slugs that were
  // actually generated as experience centers.
  if (!slug.startsWith("experience-center-")) {
    return notFound();
  }

  let experienceData = [];
  let experienceDataVideo = [];

  try {
    const baseURL = getBaseUrl();

    const [dataRes, videoRes] = await Promise.all([
      fetch(`${baseURL}/experience-center-assets/experience_center/${slug}`, { next: { revalidate: 60 } }),
      fetch(`${baseURL}/experience-center-assets/experience_center_video/${slug}`, { next: { revalidate: 60 } }),
    ]);

    if (dataRes.ok) experienceData = await dataRes.json();
    if (videoRes.ok) experienceDataVideo = await videoRes.json();
  } catch (err) {
    console.error(`Experience Center Fetch Error for ${slug}:`, err);
    return notFound();
  }

  // Cards 8+ (index 7 onward) — no cap. Laid out two per row (col-lg-6
  // each); if the trailing row would only have one image left, it spans
  // the full width instead, so a lone extra image never sits half-empty.
  const extraImages = experienceData.slice(7);

  return (
    <MainLayout>
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
                  cardDetailLink={`/exp-center/gallery?id=${experienceData[0]?.id}`}
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall desig_gal_bg1 design_exper"}
                  portfolioImg={experienceData[0]?.child_content?.image}
                  portfolioTitle={experienceData[0]?.child_content?.title}
                />
              )}
              {experienceData[1] && (
                <PortfolioCard
                  cardDetailLink={`/exp-center/gallery?id=${experienceData[1]?.id}`}
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall desig_gal_bg2"}
                  portfolioImg={experienceData[1]?.child_content?.image}
                  portfolioTitle={experienceData[1]?.child_content?.title}
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
                  cardDetailLink={`/exp-center/gallery?id=${experienceData[2]?.id}`}
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
                  cardDetailLink={`/exp-center/gallery?id=${experienceData[3]?.id}`}
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
                  cardDetailLink={`/exp-center/gallery?id=${experienceData[4]?.id}`}
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
                  cardDetailLink={`/exp-center/gallery?id=${experienceData[5]?.id}`}
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
                  cardDetailLink={`/exp-center/gallery?id=${experienceData[6]?.id}`}
                  portCard={"card_portfolio portfolio_1"}
                  portfolioImgBg={"portfolioimgall desig_gal_bg8"}
                  portfolioImg={experienceData[6]?.child_content?.image}
                  portfolioTitle={experienceData[6]?.child_content?.title}
                  portfolioClassCss="text-white w-75 mb-0 my-2 team_designation"
                />
              </div>
            )}

            {/* Cards 8+ — unlimited. Pairs of 2 (col-lg-6 each); a
                trailing single left over gets col-lg-12 instead. Every
                pair reuses the exact bg7/bg8 classes from cards 6 & 7 so
                both cards in a row render at the same height regardless
                of the source image's own aspect ratio. */}
            {extraImages.map((item, i) => {
              const isLastOdd = i === extraImages.length - 1 && extraImages.length % 2 === 1;
              const colClass = isLastOdd ? "col-lg-12" : "col-lg-6";
              const bgClass = isLastOdd ? EXTRA_SINGLE_BG_CLASS : EXTRA_PAIR_BG_CLASSES[i % 2];
              return (
                <div className={colClass} key={item.id}>
                  <PortfolioCard
                    cardDetailLink={`/exp-center/gallery?id=${item?.id}`}
                    portCard={"card_portfolio portfolio_1"}
                    portfolioImgBg={`portfolioimgall ${bgClass}`}
                    portfolioImg={item?.child_content?.image}
                    portfolioTitle={item?.child_content?.title}
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
