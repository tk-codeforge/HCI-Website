import { preload } from "react-dom";
import api from "@/utils/api";
import GalleryClient from "./GalleryClient";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import MainLayout from "../../layouts/MainLayout";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

// Keep dynamic rendering so CMS/project edits are not hidden by a new cache policy.
export const dynamic = "force-dynamic";

const GALLERY_BASE_PATH = "/residential-projects/project-gallery";
const FALLBACK_FIRST_IMAGE = "/images/detail-img/1.webp";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const id = params?.id;

  if (!id) return { title: "Residential Projects Gallery" };

  return buildGalleryMetadata({
    basePath: GALLERY_BASE_PATH,
    id,
    itemApi: `/portfolio-project/${id}`,
  });
}

export default async function ResidentialProjectsPage({ searchParams }) {
  const params = await searchParams;
  const id = params?.id;
  if (!id) return notFound();

  // Fetch independent project and SEO data in parallel to reduce server wait time.
  const [seo, projectResponse] = await Promise.all([
    getGallerySeo({ basePath: GALLERY_BASE_PATH, id }),
    api.get(`/portfolio-project/${id}`).catch((error) => {
      if (error.response?.status !== 404) {
        console.error("Failed to fetch portfolio project:", error.message);
      }
      return null;
    }),
  ]);

  const portfolioData = projectResponse?.data;
  if (!portfolioData) return notFound();

  // Preload only the first visible gallery image; leave remaining images lazy.
  const firstImage = portfolioData?.child_images?.[0]?.image || FALLBACK_FIRST_IMAGE;
  if (firstImage) preload(firstImage, { as: "image", fetchPriority: "high" });

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <GalleryClient portfolioData={portfolioData} />
    </MainLayout>
  );
}
