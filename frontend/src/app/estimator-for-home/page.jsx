import { Suspense } from "react";
import MainLayout from "../layouts/MainLayout";
import EstimatorClient from "./EstimatorClient";

export const revalidate = 60; 

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/seo-tag`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const allTags = await res.json();
    if (Array.isArray(allTags)) {
      return allTags.find(
        (tag) =>
          tag.page_name === "https://hcinterior.in/estimator-for-home" ||
          tag.page_name?.endsWith("/estimator-for-home")
      );
    }
    return null;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata() {
  const seoData = await getSeoData();
  const defaultTitle = "Easy-to-Use Interior Designing Cost Calculator | Home Estimator";
  const defaultDesc = "Calculate your interior design costs in minutes! Our easy-to-use interior designing cost calculator helps you estimate and plan your project effectively.";
  const defaultCanonical = "https://hcinterior.in/estimator-for-home";

  return {
    title: seoData?.title || defaultTitle,
    description: seoData?.meta_description || defaultDesc,
    alternates: { canonical: seoData?.page_name || defaultCanonical },
    openGraph: {
      title: seoData?.title || defaultTitle,
      description: seoData?.meta_description || defaultDesc,
      url: seoData?.page_name || defaultCanonical,
      type: "website",
    },
  };
}

export default function Estimater() {
  return (
    <MainLayout>
      {/* 🌟 Wrapped in Suspense to safely use search parameters */}
      <Suspense fallback={<div className="text-center p-5 mt-5">Loading Calculator...</div>}>
        <EstimatorClient />
      </Suspense>
    </MainLayout>
  );
}