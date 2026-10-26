import GalleryClient from "./GalleryClient";
import JsonLd from "../../components/JsonLd";
import MainLayout from "../../layouts/MainLayout";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  return buildGalleryMetadata({
    basePath: "/rattan/gallery",
    id,
    itemApi: `/cms-parent-child/by-id/${id}`,
  });
}

export default async function GalleryPage({ searchParams }) {
   const id = searchParams?.id;
  const seo = await getGallerySeo({ basePath: "/rattan/gallery", id });
   return (
     <MainLayout>
      <JsonLd data={seo?.custom_schema} /> 
      <GalleryClient />
       </MainLayout>
  );
}
