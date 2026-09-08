import { Suspense } from "react";
import HeroCarousel from "./clientHome/HeroCarousel";
import HomeContent from "./HomeContent"; 
import { getPageSEO } from "@/utils/getSEO";

// --- OPTIMIZATION: ISR Configuration ---
export const revalidate = 60; // Regenerate page every 60 seconds

export async function generateMetadata() {
  return await getPageSEO("/home"); 
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