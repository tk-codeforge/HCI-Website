import api from "@/utils/api";
import GalleryClient from "./GalleryClient";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";


export const dynamic = "force-dynamic";

// --- SEO FIX ---
// export async function generateMetadata({ searchParams }) {
//   const id = searchParams?.id;
//   if (!id) return { title: "Luxury Projects Gallery" };

//   try {
//     const response = await api.get(`/portfolio-project/${id}`);
//     const data = response.data;
//     return {
//       title: data?.title || "Luxury Projects Gallery",
//       description: `Luxury interior design project: ${data?.title}`,
//       alternates: {
//         canonical: `/luxury-projects/project-gallery?id=${id}`,
//       },
//     };
//   } catch (error) {
//     return { title: "Luxury Projects Gallery", robots: "noindex" };
//   }
// }

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  return buildGalleryMetadata({
    basePath: "/luxury-projects/project-gallery",
    id,
    itemApi: `/portfolio-project/${id}`,
  });
}

// --- SERVER COMPONENT ---
export default async function LuxuryProjectsPage({ searchParams }) {
  const id = searchParams?.id;
  if (!id) return notFound();
  const seo = await getGallerySeo({ basePath: "/luxury-projects/project-gallery", id });

  let portfolioData = null;
  try {
    const response = await api.get(`/portfolio-project/${id}`);
    portfolioData = response.data;
  } catch (err) {
    if (err.response?.status === 404) return notFound();
  }

  if (!portfolioData) return notFound();

 return (
    <>
      <JsonLd data={seo?.custom_schema} /> 
      <GalleryClient portfolioData={portfolioData} />
      </>
  );
}