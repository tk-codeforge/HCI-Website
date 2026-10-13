import api from "@/utils/api";
import GalleryClient from "./GalleryClient";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

export const dynamic = "force-dynamic";

// --- SEO FIX ---
// export async function generateMetadata({ searchParams }) {
//   const id = searchParams?.id;
//   if (!id) return { title: "Fairdabad Experience Center" };

//   try {
//     const response = await api.get(`/cms-parent-child/by-id/${id}`);
//     const data = response.data;
//     const title = data?.child_content?.title || "Faridabad Gallery";
    
//     return {
//       title: title,
//       description: `Explore our ${title} at High Creation Interior Faridabad.`,
//       alternates: {
//         canonical: `/experience-center-faridabad/gallery?id=${id}`,
//       },
//     };
//   } catch (error) {
//     return { title: "Faridabad Experience Center", robots: "noindex" };
//   }
// }

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