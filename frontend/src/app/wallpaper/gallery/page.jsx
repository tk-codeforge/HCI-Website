import GalleryClient from "./GalleryClient";
import MainLayout from "../../layouts/MainLayout";
import JsonLd from "../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

export const revalidate = 60;

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// The gallery used to be fetched in the browser after hydration (spinner first, then
// images), which pushed LCP out to 15 s on mobile. It is now fetched on the server and
// cached, so the images are in the first HTML.
async function getGalleryData(id) {
  if (!id) return {};
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-parent-child/by-id/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return {};
    return await res.json();
  } catch (err) {
    console.error("Gallery Data Fetch Error:", err);
    return {};
  }
}

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  return buildGalleryMetadata({
    basePath: "/wallpaper/gallery",
    id,
    itemApi: `/cms-parent-child/by-id/${id}`,
  });
}

export default async function GalleryPage({ searchParams }) {
  const id = searchParams?.id;
  const [seo, galleryData] = await Promise.all([
    getGallerySeo({ basePath: "/wallpaper/gallery", id }),
    getGalleryData(id),
  ]);

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <GalleryClient initialGalleryData={galleryData} />
    </MainLayout>
  );
}
