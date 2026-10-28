import api from "@/utils/api";
import GalleryClient from "./GalleryClient";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import MainLayout from "../../layouts/MainLayout";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

// Keep dynamic rendering so CMS/project edits are not hidden by a new cache policy.
export const dynamic = "force-dynamic";

const GALLERY_BASE_PATH = "/residential-projects/project-gallery";

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

  // The first gallery image is rendered as an eager, fetchPriority="high" <img>
  // (imgPriority in GalleryClient), so it is discovered straight from the HTML.
  // The old preload() fetched the ORIGINAL full-size file while the <img>
  // requested a resized /_next/image rendition, so the image downloaded twice.

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <GalleryClient portfolioData={portfolioData} />
    </MainLayout>
  );
}
