import api from "@/utils/api";
import GalleryClient from "./GalleryClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// --- SEO FIX ---
export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  if (!id) return { title: "New Delhi Experience Center" };

  try {
    const response = await api.get(`/cms-parent-child/by-id/${id}`);
    const data = response.data;
    const title = data?.child_content?.title || "New Delhi Gallery";
    
    return {
      title: title,
      description: `Explore our ${title} at High Creation Interior New Delhi.`,
      alternates: {
        canonical: `/experience-center-new-delhi/gallery?id=${id}`,
      },
    };
  } catch (error) {
    return { title: "New Delhi Experience Center", robots: "noindex" };
  }
}

// --- SERVER COMPONENT ---
export default async function NewDelhiGalleryPage({ searchParams }) {
  const id = searchParams?.id;
  if (!id) return notFound();

  let galleryData = null;
  try {
    const response = await api.get(`/cms-parent-child/by-id/${id}`);
    galleryData = response.data;
  } catch (err) {
    if (err.response?.status === 404) return notFound();
  }

  if (!galleryData) return notFound();

  return <GalleryClient galleryData={galleryData} />;
}