import React from "react";
import MainLayout from "../layouts/MainLayout";
import CareerClient from "./CareerClient";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../components/JsonLd";

// --- CONFIGURATION ---
export const revalidate = 60; // Regenerate page every 60 seconds

const fallbackData = {
  bannerHeading: "Where passion for design meets innovation.",
  bannerHeadingTag: "h1",
  bgHeadingTag: "h1",
  bannerDescription:
    "Where passion for design meets innovation, we create spaces that inspire and elevate. By blending creativity with the latest technology, we craft personalized interiors that are both beautiful and functional. Our team is dedicated to pushing boundaries, offering cutting-edge solutions that transform ideas into reality. With every project, we strive to deliver designs that not only captivate but also enhance the way you live and work.",
  bannerDescFontSize: 16,
  tableContent: "",
  sections: [],
};

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL || "http://localhost:3000/api"
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
};

// --- HELPER: Fetch Active Jobs ---
async function getJobPostList() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/manage-job/active`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch jobs: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Job Fetch Error:", err);
    return [];
  }
}

// --- HELPER: Fetch SEO Data ---
async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/career")}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

// --- HELPER: Fetch CMS Data ---
async function getCmsCareerData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/redirect_career`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const record = Array.isArray(data) ? data[0] : data;
    
    return {
      ...(record?.json_content || {}),
      main_image: record?.image || null,
    };
  } catch (err) {
    console.error("CMS Fetch Error:", err);
    return null;
  }
}

export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title || "Career - High Creation Interior";
  const description =
    seo?.meta_description ||
    "Know about careers in High Creation Interior Noida. High Creation Interior opens doors for professional growth and development in Interior Designing.";

    const ogTitle = seo?.og_title || title;
const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/career",
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


// --- MAIN SERVER COMPONENT ---
export default async function Career() {
  const seo = await getSeoData();
  const jobPostList = await getJobPostList();
  const cmsContent = await getCmsCareerData();

  // Safely parse sections
  let parsedSections = fallbackData.sections;
  if (cmsContent?.sections) {
    if (typeof cmsContent.sections === "string") {
      try {
        parsedSections = JSON.parse(cmsContent.sections);
      } catch (e) {
        console.error("Failed to parse cms sections JSON", e);
      }
    } else if (Array.isArray(cmsContent.sections) && cmsContent.sections.length > 0) {
      parsedSections = cmsContent.sections;
    }
  }

  // Merge CMS data with fallback data
  const pageData = {
    bannerHeading: cmsContent?.bannerHeading || fallbackData.bannerHeading,
    bannerHeadingTag: cmsContent?.bannerHeadingTag || fallbackData.bannerHeadingTag,
    bannerDescription: cmsContent?.bannerDescription || fallbackData.bannerDescription,
    bannerDescFontSize: cmsContent?.bannerDescFontSize || fallbackData.bannerDescFontSize,
    tableContent: cmsContent?.tableContent || fallbackData.tableContent,
    sections: parsedSections,
    bgHeading: cmsContent?.bgHeading || "Career",
    bgHeadingTag: cmsContent?.bgHeadingTag || fallbackData.bgHeadingTag || "h1",
    bgImage: cmsContent?.main_image || cmsContent?.bg_image || "/fallback-bg.jpg",
        bgImageAlt: cmsContent?.bgImageAlt || "",
  };

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <CareerClient pageData={pageData} jobPostList={jobPostList} />
    </MainLayout>
  );
}