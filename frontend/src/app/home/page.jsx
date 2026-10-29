import HeroCarousel from "./clientHome/HeroCarousel";
import HomeContent from "./HomeContent"; 
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";

// --- OPTIMIZATION: ISR Configuration ---
export const revalidate = 60; // Regenerate page every 60 seconds

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/home")}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title || "Top Interior Designers In Delhi NCR For Home";
  const description =
    seo?.meta_description ||
   "Home interior designers in Delhi NCR - Elevate your living space with best interior design company in Noida & Delhi NCR.";

   const ogTitle = seo?.og_title || title;
const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/home",
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


const jsonLd = {
  "@context": "https://schema.org",
  "@type": "InteriorDesigner",
  "name": "High Creation Interior",
  "url": "https://hcinterior.in",
  "sameAs": [
    "https://www.facebook.com/HighCreationInteriorProjectsPvtLtd",
    "https://www.instagram.com/highcreationinterior/"
  ]
};

// Used only when the CMS endpoint is unavailable or has no active banners.
// The local image is already used as the existing HeroCarousel image fallback.
const FALLBACK_BANNER = {
  id: "homepage-fallback-banner",
  banner_image: "/images/home-banner-1.png",
  title: "High Creation Interior",
  sub_title: "Design Your Dream Home",
  description: "Thoughtfully designed home interiors for your lifestyle and budget.",
  button_text: "Explore Residential Projects",
  button_link: "/residential-projects",
  is_active: true,
};

// --- HELPER: Native Fetch for Next.js Caching ---
async function getBannerData() {
  try {
    // Determine Base URL directly
    const baseURL = process.env.NODE_ENV === "development" 
      ? process.env.NEXT_PUBLIC_API_DEV_URL 
      : process.env.NEXT_PUBLIC_API_BASE_URL;

    // Use native fetch for better ISR support
    const res = await fetch(`${baseURL}/cms-content/homepage_banner`, {
      next: { revalidate: 60 } 
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch banner: ${res.status}`);
    }

    const data = await res.json();
    const activeBanners = (Array.isArray(data?.json_content) ? data.json_content : []).filter(
      (b) => b && b.is_active !== false && b.is_active !== "false"
    );

    // A temporary CMS/API failure should not produce a completely blank hero.
    return activeBanners.length > 0 ? activeBanners : [FALLBACK_BANNER];
  } catch (err) {
    console.error("Banner Fetch Error:", err);
    return [FALLBACK_BANNER];
  }
}

// The browser used to fetch this itself (/site-settings) after hydration, which also
// re-initialised the autoplay timer. Reading it here puts it in the first render.
async function getCarouselSpeed() {
  try {
    const res = await fetch(`${getBaseUrl()}/site-settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const seconds = Number(data?.carousel_speed);
    return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
  } catch (err) {
    console.error("Carousel speed fetch error:", err);
    return null;
  }
}

export default async function Home() {
  const [bannerData, carouselSpeed] = await Promise.all([
    getBannerData(),
    getCarouselSpeed(),
  ]);

  return (
    <>
      {/* 1. Hero Carousel */}
      <HeroCarousel bannerData={bannerData} carouselSpeed={carouselSpeed} />

      {/* Render the complete homepage content on the server. Avoid an empty
          Suspense fallback that can leave the page blank when scripts fail. */}
      <HomeContent />
    </>
  );
}