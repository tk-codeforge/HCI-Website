import { Suspense } from "react";
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
    return data?.json_content || [];
  } catch (err) {
    console.error("Banner Fetch Error:", err);
    return [];
  }
}

export default async function Home() {
  const bannerData = await getBannerData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* 1. Hero Carousel */}
      <HeroCarousel bannerData={bannerData} />

      {/* 2. The Rest of the Page */}
      <Suspense fallback={<div className="py-5 text-center">Loading Content...</div>}>
        <HomeContent />
      </Suspense>
    </>
  );
}