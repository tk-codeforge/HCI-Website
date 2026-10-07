// import MainLayout from "../layouts/MainLayout";
// import WallpaperCard from "../components/WallpaperCard";
// const SustainableFurniture = () => {
//   return (
//     <div>
//       <head>
//         <title>
//         Sustainable furniture for your home - High Creation Interior	
//         </title>
//         <meta
//           name="description"
//           content="Elevate your home with High Creation Interior's sustainable furniture, combining eco-friendly materials and timeless designs for a greener, stylish living space.	"
//         />

// <link rel="canonical" href="https://hcinterior.in/sustainable-furniture" />	
//       </head>
//       <MainLayout>
//         <main>
//           <section className="container my-5 rattan_wrapper">
//             <div className="text-center mb-5">
//               <h1 className="wallpaperHeading">Sustainable Furniture</h1>
//               <p className="px-lg-5 team_description">
//                 Elevate your home with High Creation Interior&apos;s sustainable
//                 furniture, crafted from eco-friendly materials and designed for
//                 lasting beauty. Our pieces blend timeless style with
//                 environmental responsibility, making it easy to create a
//                 greener, more stylish living space. From elegant tables to
//                 functional storage solutions, each item is thoughtfully designed
//                 to reduce waste while enhancing your home. Whether you’re
//                 refreshing a room or furnishing your entire home, our furniture
//                 offers the perfect balance of sustainability and sophistication.
//                 Make a positive impact on the planet without compromising on
//                 style, and enjoy a space that’s as kind to the earth as it is to
//                 you.
//               </p>
//             </div>
//             <div className="row g-4 mx-0">
//               <div className="col-lg-6 col-md-6 col-12">
//                 <WallpaperCard
//                   linkTagWallpaper="/rattan"
//                   wallpaperCard="wallpapercard"
//                   imgWallpaper="/images/sustainable-furniture/rattan.jpg"
//                   wallpaperImgClass="wallpaperclass"
//                   altWallpaper="bed"
//                   portfolioTitle="Rattan"
//                   wallpaperDescriptiion="Rattan offers a blend of timeless style and natural warmth, perfect for enhancing any space with its unique, sustainable charm"
//                   descriptionClass="team_description mb-0"
//                   textBtnWallpaper="View More"
//                   btnHrefWallpaper="/rattan"
//                 />
//               </div>
//               <div className="col-lg-6 col-md-6 col-12">
//                 <WallpaperCard
//                   linkTagWallpaper="reclaimed-wood"
//                   wallpaperCard="wallpapercard"
//                   imgWallpaper="/images/sustainable-furniture/reclaimed-wood.jpg"
//                   wallpaperImgClass="wallpaperclass"
//                   altWallpaper="Kidsbed"
//                   portfolioTitle="Reclaimed Wood"
//                   wallpaperDescriptiion="Bring warmth and character to your space with reclaimed wood, offering a unique, sustainable touch to any design."
//                   descriptionClass="team_description mb-0"
//                   textBtnWallpaper="View More"
//                   btnHrefWallpaper="reclaimed-wood"
//                 />
//               </div>
//             </div>
//           </section>
//           <hr />
//         </main>
//       </MainLayout>
//     </div>
//   );
// };

// export default SustainableFurniture;
import MainLayout from "../layouts/MainLayout";
import WallpaperCard from "../components/WallpaperCard";
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

// --- HELPER: Fetch SEO Data ---
// async function getSeoData() {
//   try {
//     const baseURL = getBaseUrl();
//     const res = await fetch(`${baseURL}/seo-tag`, {
//       next: { revalidate: 60 },
//     });

//     if (!res.ok) return null;

//     const allTags = await res.json();

//     // Match the specific page URL for Sustainable Furniture
//     if (Array.isArray(allTags)) {
//       return allTags.find(
//         (tag) =>
//           tag.page_name === "https://hcinterior.in/sustainable-furniture" ||
//           tag.page_name?.endsWith("/sustainable-furniture")
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
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/sustainable-furniture")}`,
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
    return data?.json_content?.sections?.sustainable_furniture || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}

// --- FALLBACK: used if the CMS has no cards yet, or the fetch fails ---
const FALLBACK_FURNITURE_CARDS = [
  {
    image: "/images/sustainable-furniture/rattan.jpg",
    title: "Rattan",
    description:
      "Rattan offers a blend of timeless style and natural warmth, perfect for enhancing any space with its unique, sustainable charm",
    buttonText: "View More",
    buttonLink: "/rattan",
  },
  {
    image: "/images/sustainable-furniture/reclaimed-wood.jpg",
    title: "Reclaimed Wood",
    description:
      "Bring warmth and character to your space with reclaimed wood, offering a unique, sustainable touch to any design.",
    buttonText: "View More",
    buttonLink: "/reclaimed-wood",
  },
];

// --- HELPER: Fetch Furniture Cards ---
async function getSustainableFurnitureCards() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/sustainable_furniture`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return FALLBACK_FURNITURE_CARDS;

    const record = await res.json();
    const data = Array.isArray(record) ? record[0] : record;
    const cards = data?.json_content?.cards;

    return Array.isArray(cards) && cards.length > 0 ? cards : FALLBACK_FURNITURE_CARDS;
  } catch (err) {
    console.error("Furniture Cards Fetch Error:", err);
    return FALLBACK_FURNITURE_CARDS;
  }
}
// --- DYNAMIC METADATA GENERATION ---
// export async function generateMetadata() {
//   const seoData = await getSeoData();

//   const defaultTitle =
//     "Sustainable furniture for your home - High Creation Interior";
//   const defaultDesc =
//     "Elevate your home with High Creation Interior's sustainable furniture, combining eco-friendly materials and timeless designs for a greener, stylish living space.";
//   const defaultCanonical = "https://hcinterior.in/sustainable-furniture";

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
    seo?.meta_title || "Sustainable furniture for your home - High Creation Interior";
  const description =
    seo?.meta_description ||
   "Elevate your home with High Creation Interior's sustainable furniture, combining eco-friendly materials and timeless designs for a greener, stylish living space.";

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/sustainable-furniture",
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
      title,
      description,
      url: canonical,
      type: "website",
      ...(seo?.og_image && {
        images: [{ url: seo.og_image, width: 1200, height: 630 }],
      }),
    },
  };
}

// --- MAIN SERVER COMPONENT ---
export default async function SustainableFurniture() {
  const seo = await getSeoData(); 
    // const headingData = await getHeadingDescriptionData();
    const [headingData, furnitureCards] = await Promise.all([
  getHeadingDescriptionData(),
  getSustainableFurnitureCards(),
]);

  const HeadingTag = headingData?.headingTag || "h1";
  const headingText = headingData?.headingText || "Sustainable Furniture";
  const headingStyle = {
    textShadow: buildTextShadow(
      headingData?.headingShadowEnabled,
      headingData?.headingShadowIntensity
    ),
    ...(headingData?.headingColor && { color: headingData.headingColor }),
  };

  const descriptionText =
    headingData?.descriptionText ||
    "Good for your home. Better for the planet. Our sustainable furniture combines elegant design, premium craftsmanship, and eco-friendly materials. Because the best homes don't just look exceptional—they leave a lasting impact for all the right reasons.";
  const descriptionStyle = {
    ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
    ...(headingData?.descriptionFontSize && { fontSize: `${headingData.descriptionFontSize}px` }),
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
    : {}

    const headingBlock = (
    <>
    <HeadingTag id="sustainable-furniture-heading" className="wallpaperHeading" style={headingStyle}>
  {headingText}
</HeadingTag>
<p id="sustainable-furniture-description" className="px-lg-5 team_description" style={descriptionStyle}>
  {descriptionText}
</p>
<style>{`
    #sustainable-furniture-heading { text-shadow: ${buildTextShadow(headingData?.headingShadowEnabled, headingData?.headingShadowIntensity)} !important; }
  #sustainable-furniture-description { text-shadow: ${buildTextShadow(headingData?.descriptionShadowEnabled, headingData?.descriptionShadowIntensity)} !important; }
  ${headingData?.headingColor ? `#sustainable-furniture-heading { color: ${headingData.headingColor} !important; }` : ""}
  ${headingData?.descriptionColor ? `#sustainable-furniture-description { color: ${headingData.descriptionColor} !important; }` : ""}
  ${headingData?.descriptionFontSize ? `#sustainable-furniture-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
`}</style>
    </>
);

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <main>
        {/* <div
  className={bannerImage ? "w-100 d-flex align-items-center justify-content-center" : "container mt-5"}
  style={bannerStyle}
>
  <div className={bannerImage ? "container text-center py-5" : "text-center mb-5"}>
            <HeadingTag id="sustainable-furniture-heading" className="wallpaperHeading" style={headingStyle}>
  {headingText}
</HeadingTag>
<p id="sustainable-furniture-description" className="px-lg-5 team_description" style={descriptionStyle}>
  {descriptionText}
</p>
<style>{`
    #sustainable-furniture-heading { text-shadow: ${buildTextShadow(headingData?.headingShadowEnabled, headingData?.headingShadowIntensity)} !important; }
  #sustainable-furniture-description { text-shadow: ${buildTextShadow(headingData?.descriptionShadowEnabled, headingData?.descriptionShadowIntensity)} !important; }
  ${headingData?.headingColor ? `#sustainable-furniture-heading { color: ${headingData.headingColor} !important; }` : ""}
  ${headingData?.descriptionColor ? `#sustainable-furniture-description { color: ${headingData.descriptionColor} !important; }` : ""}
  ${headingData?.descriptionFontSize ? `#sustainable-furniture-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
`}</style>
          </div>
          </div> */}
        {bannerImage ? (
          <MediaBg
            src={bannerImage}
            fallbackAlt={headingText}
            className="w-100 d-flex align-items-center justify-content-center"
            style={{ aspectRatio: "1900 / 441" }}
          >
            <div className="container text-center py-5">{headingBlock}</div>
          </MediaBg>
        ) : (
          <div className="container">
            <div className="text-center mt-3 mx-0 row">{headingBlock}</div>
          </div>
        )}

          {/* <div className="row g-4 mx-0">
            <div className="col-lg-6 col-md-6 col-12">
              <WallpaperCard
                linkTagWallpaper="/rattan"
                wallpaperCard="wallpapercard"
                imgWallpaper="/images/sustainable-furniture/rattan.jpg"
                wallpaperImgClass="wallpaperclass"
                altWallpaper="Rattan Furniture"
                portfolioTitle="Rattan"
                wallpaperDescriptiion="Rattan offers a blend of timeless style and natural warmth, perfect for enhancing any space with its unique, sustainable charm"
                descriptionClass="team_description mb-0"
                textBtnWallpaper="View More"
                btnHrefWallpaper="/rattan"
              />
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <WallpaperCard
                linkTagWallpaper="/reclaimed-wood"
                wallpaperCard="wallpapercard"
                imgWallpaper="/images/sustainable-furniture/reclaimed-wood.jpg"
                wallpaperImgClass="wallpaperclass"
                altWallpaper="Reclaimed Wood Furniture"
                portfolioTitle="Reclaimed Wood"
                wallpaperDescriptiion="Bring warmth and character to your space with reclaimed wood, offering a unique, sustainable touch to any design."
                descriptionClass="team_description mb-0"
                textBtnWallpaper="View More"
                btnHrefWallpaper="/reclaimed-wood"
              />
            </div>
          </div> */}
<section className={bannerImage ? "container my-5 rattan_wrapper" : "container mb-5 rattan_wrapper"}> 
          <div className="row g-4 mx-0">
  {furnitureCards.map((card, index) => (
    <div className="col-lg-6 col-md-6 col-12" key={card.buttonLink || index}>
      <WallpaperCard
        linkTagWallpaper={card.buttonLink}
        wallpaperCard="wallpapercard"
        imgWallpaper={card.image}
        wallpaperImgClass="wallpaperclass"
        altWallpaper={card.title}
        portfolioTitle={card.title}
        wallpaperDescriptiion={card.description}
        descriptionClass="team_description mb-0"
        textBtnWallpaper={card.buttonText}
        btnHrefWallpaper={card.buttonLink}
      />
    </div>
  ))}
</div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
}