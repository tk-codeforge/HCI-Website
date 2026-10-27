import api from "@/utils/api";
import GalleryClient from "./GalleryClient";
import MainLayout from "../../layouts/MainLayout";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

const BASE_PATH = "/experience-center-noida/gallery";

// Force dynamic because we use searchParams (?id=...)
export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  return buildGalleryMetadata({
    basePath: BASE_PATH,
    id,
    itemApi: `/cms-parent-child/by-id/${id}`,
  });
}

async function fetchGallery(id) {
  try {
    const response = await api.get(`/cms-parent-child/by-id/${id}`);
    return { data: response.data, notFound: false };
  } catch (err) {
    console.error("Experience Gallery Fetch Error:", err);
    return { data: null, notFound: err.response?.status === 404 };
  }
}

// --- SERVER COMPONENT ---
export default async function ExperienceCenterGalleryPage({ searchParams }) {
  const galleryId = searchParams?.id;

  if (!galleryId) {
    return notFound();
  }

  // Gallery data and SEO data are independent -> fetch in parallel
  // (previously sequential, which added to TTFB).
  const [galleryResult, seo] = await Promise.all([
    fetchGallery(galleryId),
    getGallerySeo({ basePath: BASE_PATH, id: galleryId }),
  ]);

  if (galleryResult.notFound || !galleryResult.data) return notFound();

  return (
    <>
      <JsonLd data={seo?.custom_schema} />
      <MainLayout>
        <GalleryClient galleryData={galleryResult.data} />
      </MainLayout>
    </>
  );
}
