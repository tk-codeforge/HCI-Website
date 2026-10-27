import { Suspense } from "react";
import MainLayout from "../layouts/MainLayout";
import EstimatorClient from "./EstimatorClient";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../components/JsonLd";


export const revalidate = 60; 

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};


async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/estimator-for-home")}`,
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
    seo?.meta_title || "Easy-to-Use Interior Designing Cost Calculator | Home Estimator";;
  const description =
    seo?.meta_description ||
    "Calculate your interior design costs in minutes! Our easy-to-use interior designing cost calculator helps you estimate and plan your project effectively.";

    const ogTitle = seo?.og_title || title;
const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/estimator-for-home",
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


export default async function Estimater() {
  const seo = await getSeoData();
  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      {/* 🌟 Wrapped in Suspense to safely use search parameters */}
      <Suspense fallback={<div className="text-center p-5 mt-5">Loading Calculator...</div>}>
        <EstimatorClient />
      </Suspense>
    </MainLayout>
  );
}