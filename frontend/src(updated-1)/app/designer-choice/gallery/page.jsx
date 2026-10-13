import GalleryClient from "./GalleryClient";
import JsonLd from "../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  return buildGalleryMetadata({
    basePath: "/designer-choice/gallery",
    id,
    itemApi: `/cms-parent-child/by-id/${id}`,
  });
}

export default async function GalleryPage({ searchParams }) {
   const id = searchParams?.id;
  const seo = await getGallerySeo({ basePath: "/designer-choice/gallery", id });
  return (
  <>
   <JsonLd data={seo?.custom_schema} />
  <GalleryClient />
  </>
  );
}
