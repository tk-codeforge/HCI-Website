import React from "react";
import MainLayout from "../../layouts/MainLayout";
import CareerFormClient from "./CareerFormClient";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../../components/JsonLd";

// Regenerate the page data every 60 seconds
export const revalidate = 60;

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/career/career-form")}`,
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
    seo?.meta_title || "Career - High Creation Interior";
  const description =
    seo?.meta_description ||
    "Know about careers in High Creation Interior Noida. High Creation Interior opens doors for professional growth and development in Interior Designing.";

    const ogTitle = seo?.og_title || title;
const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/career/career-form",
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

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL || "http://localhost:3000/api"
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
};

// --- HELPER: Fetch CMS Settings ---
async function getCmsSettings() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-parent-child/career_form`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const record = Array.isArray(data) ? data[0] : null;
    const content = record?.child_content;

    if (content) {
      let parsedLinks = [];
      if (content.checkbox_links) {
        try {
          parsedLinks =
            typeof content.checkbox_links === "string"
              ? JSON.parse(content.checkbox_links)
              : content.checkbox_links;
        } catch (e) {
          console.error("Error parsing checkbox_links JSON", e);
        }
      } else if (content.checkbox_text) {
        parsedLinks = [
          { text: content.checkbox_text, url: content.checkbox_link || "" },
        ];
      }

      let parsedJobTexts = {};
      if (content.job_texts) {
        try {
          parsedJobTexts =
            typeof content.job_texts === "string"
              ? JSON.parse(content.job_texts)
              : content.job_texts;
        } catch (e) {
          console.error("Error parsing job_texts JSON", e);
        }
      }

      return {
        ...content,
        checkbox_text: content.checkbox_text || "",
        checkbox_links: parsedLinks,
        job_texts: parsedJobTexts,
      };
    }
  } catch (err) {
    console.error("Failed to fetch career form settings:", err);
  }
  return null;
}

// --- HELPER: Fetch Active Jobs ---
async function getActiveJobs() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/manage-job/active`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Job Fetch Error:", err);
    return [];
  }
}

// --- MAIN SERVER COMPONENT ---
export default async function CareerFormPage({ searchParams }) {
  const seo = await getSeoData();
  // In Next.js 14, searchParams is an object, not a promise.
  const jobId = searchParams?.jobId || null;

  const [cmsSettings, jobs] = await Promise.all([
    getCmsSettings(),
    getActiveJobs(),
  ]);

  const jobText = cmsSettings?.job_texts?.[jobId] || {};
  const job = (jobs || []).find((j) => String(j.id) === String(jobId));
  const jobTitle = job?.title || "";

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <CareerFormClient
        cmsSettings={cmsSettings}
        jobId={jobId}
        jobTitle={jobTitle}
        jobText={jobText}
      />
    </MainLayout>
  );
}