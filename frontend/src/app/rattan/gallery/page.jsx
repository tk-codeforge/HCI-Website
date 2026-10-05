import GalleryClient from "./GalleryClient";
import { buildGalleryMetadata } from "@/utils/gallerySeo";

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  return buildGalleryMetadata({
    basePath: "/rattan/gallery",
    id,
    itemApi: `/cms-parent-child/by-id/${id}`,
  });
}

export default function GalleryPage() {
  return <GalleryClient />;
}
