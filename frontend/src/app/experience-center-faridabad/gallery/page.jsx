import api from "@/utils/api";
import GalleryClient from "./GalleryClient";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  return buildGalleryMetadata({
    basePath: "/experience-center-faridabad/gallery",
    id,
    itemApi: `/cms-parent-child/by-id/${id}`,
  });
}

// --- SERVER COMPONENT ---
export default async function FaridabadGalleryPage({ searchParams }) {
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
  const seo = await getGallerySeo({ basePath: "/experience-center-faridabad/gallery", id });

  return (
    <>
    <JsonLd data={seo?.custom_schema} />
  <GalleryClient galleryData={galleryData} />
  </>
  );
}