import MainLayout from "../layouts/MainLayout";
import WallpaperCard from "../components/WallpaperCard";

// --- CONFIGURATION ---
export const revalidate = 60; // Regenerate page every 60 seconds

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- HELPER: Fetch Product Data ---
async function getProductList() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-parent-child/product`, {
      // cache handled by page revalidate
    });

    if (!res.ok) {
      console.error(`Failed to fetch product list: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Product Data Fetch Error:", err);
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

    // Match the specific page URL for Product
    if (Array.isArray(allTags)) {
      return allTags.find(
        (tag) =>
          tag.page_name === "https://hcinterior.in/product" ||
          tag.page_name?.endsWith("/product")
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
    return data?.json_content?.sections?.our_product || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}
// --- DYNAMIC METADATA GENERATION ---
export async function generateMetadata() {
  const seoData = await getSeoData();

  const defaultTitle =
    "High Creation Interior - Customized Products design for your Home";
  const defaultDesc =
    "Explore customized Interior products gallery for your home, designed by Top interior designers at High Creation Interior.";
  const defaultCanonical = "https://hcinterior.in/product";

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
    keywords: seoData?.metaKeywords || "",
  };
}

// --- MAIN SERVER COMPONENT ---
export default async function Product() {
  const [productList, headingData] = await Promise.all([
    getProductList(),
    getHeadingDescriptionData(),
  ]);

  const HeadingTag = headingData?.headingTag || "h1";
const headingText = headingData?.headingText || "Our Product";
const headingStyle = {
  textShadow: "none",
  fontFamily: "inherit",
  ...(headingData?.headingColor && { color: headingData.headingColor }),
};

const descriptionText =
  headingData?.descriptionText ||
  "Beautiful to look at. Effortless to live with. Designed to last — Explore our products that are as practical as they are beautiful, designed to add style, comfort, and character to every space. From modular TV units to wall art and innovative wall designs.";
const descriptionStyle = {
  ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
};

  return (
    <MainLayout>
      <main>
        <section className="container my-5">
          <div className="text-center mb-5 row mx-0">
            <HeadingTag id="our-product-heading" className="wallpaperHeading" style={headingStyle}>
  {headingText}
</HeadingTag>
<p id="our-product-description" className="px-lg-5 fs-6 text-muted" style={descriptionStyle}>
  {descriptionText}
</p>
<style>{`
  ${headingData?.headingColor ? `#our-product-heading { color: ${headingData.headingColor} !important; }` : ""}
  ${headingData?.descriptionColor ? `#our-product-description { color: ${headingData.descriptionColor} !important; }` : ""}
  ${headingData?.descriptionFontSize ? `#our-product-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
`}</style>
          </div>
          <div className="row g-4 mx-0">
            {productList && productList.length > 0 ? (
              productList.map((product) => (
                <div className="col-lg-6 col-md-6 col-12" key={product.id}>
                  <WallpaperCard
                    linkTagWallpaper={`/product/gallery?id=${product.id}`}
                    wallpaperCard="wallpapercard"
                    imgWallpaper={product?.child_content?.image}
                    wallpaperImgClass="wallpaperclass"
                    altWallpaper={
                      product?.child_content?.title || "Product Image"
                    }
                    portfolioTitle={product?.child_content?.title}
                    wallpaperDescriptiion={product?.child_content?.description}
                    descriptionClass="team_description mb-0 pb-2 pb-lg-0"
                    textBtnWallpaper="View Design"
                    btnHrefWallpaper={`/product/gallery?id=${product.id}`}
                  />
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Loading products...</p>
              </div>
            )}
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
}