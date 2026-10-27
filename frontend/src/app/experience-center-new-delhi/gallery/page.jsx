import api from "@/utils/api";
import GalleryClient from "./GalleryClient";
import MainLayout from "../../layouts/MainLayout";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

const BASE_PATH = "/experience-center-new-delhi/gallery";

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
    return { data: null, notFound: err.response?.status === 404 };
  }
}

// --- SERVER COMPONENT ---
export default async function NewDelhiGalleryPage({ searchParams }) {
  const id = searchParams?.id;
  if (!id) return notFound();

  // Independent requests -> run in parallel (was sequential, adding to TTFB).
  const [galleryResult, seo] = await Promise.all([
    fetchGallery(id),
    getGallerySeo({ basePath: BASE_PATH, id }),
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
