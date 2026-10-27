import GalleryClient from "./GalleryClient";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

export const dynamic = "force-dynamic";

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

async function getCenter(slug) {
  const res = await fetch(
    `${getBaseUrl()}/cms-experience-center/by-slug/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Center lookup failed: ${res.status}`);
  return res.json();
}


export async function generateMetadata({ params, searchParams }) {
  const { "experience-center": center } = await params;
  const { id } = await searchParams;

  if (!center?.startsWith("experience-center-") || !id || !(await getCenter(center))) {
    return { title: "Page not found", robots: { index: false, follow: false } };
  }

  return buildGalleryMetadata({
    basePath: `/${center}/gallery`,
    id,
    itemApi: `/experience-center-assets/by-id/${id}`,
  });
}


export default async function ExperienceCenterGalleryPage({ params, searchParams }) {
  const { "experience-center": center } = await params;
  const { id } = await searchParams;

  const seo = await getGallerySeo({ basePath: `/${center}/gallery`, id });


  if (!id) return notFound();
  if (!center?.startsWith("experience-center-")) return notFound();
  if (!(await getCenter(center))) return notFound();   // deleted page -> real 404

  let galleryData = null;
  try {
    const baseURL = getBaseUrl();
    
    // 1. Fetch the parent card (e.g., "Master Bedroom")
    const parentRes = await fetch(`${baseURL}/experience-center-assets/by-id/${id}`, { cache: "no-store" });
    if (!parentRes.ok) return notFound();
    const parentData = await parentRes.json();
    if (parentData.parent_slug !== center) return notFound();

    // 2. Fetch the child images associated with this parent
    const childrenRes = await fetch(`${baseURL}/experience-center-assets/gallery/${id}`, { cache: "no-store" });
    const childImages = childrenRes.ok ? await childrenRes.json() : [];

    // Combine them so GalleryClient receives the structure it expects
    galleryData = {
      ...parentData,
      child_images: childImages,
    };
    
  } catch (err) {
    console.error("Gallery Fetch Error:", err);
    return notFound();
  }

  return (
    <>
      <JsonLd data={seo?.custom_schema} />
      <GalleryClient galleryData={galleryData} />
    </>
  );
}