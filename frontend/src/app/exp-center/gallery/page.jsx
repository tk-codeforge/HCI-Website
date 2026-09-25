import GalleryClient from "./GalleryClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- DYNAMIC METADATA GENERATION ---
export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  if (!id) return { title: "Experience Center Gallery" };

  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/experience-center-assets/by-id/${id}`);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    
    const title = data?.child_content?.title || "Gallery";
    
    return {
      title: `${title} | High Creation Interior`,
      description: `Explore our ${title} at the High Creation Interior Experience Center.`,
      alternates: {
        canonical: `/exp-center/gallery?id=${id}`,
      },
    };
  } catch (error) {
    return { title: "Experience Center Gallery", robots: "noindex" };
  }
}

// --- MAIN SERVER COMPONENT ---
export default async function ExperienceCenterGalleryPage({ searchParams }) {
  const id = searchParams?.id;
  if (!id) return notFound();

  let galleryData = null;
  try {
    const baseURL = getBaseUrl();
    console.log(`Kya ye call ho rha hai ${baseURL}`);
    
    // 1. Fetch the parent card (e.g., "Master Bedroom")
    const parentRes = await fetch(`${baseURL}/experience-center-assets/by-id/${id}`, { cache: "no-store" });
    if (!parentRes.ok) return notFound();
    const parentData = await parentRes.json();

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

  return <GalleryClient galleryData={galleryData} />;
}