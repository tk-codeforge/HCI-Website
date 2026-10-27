import GalleryClient from "./GalleryClient";
import MainLayout from "../../layouts/MainLayout";
import JsonLd from "../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";
import { getGalleryItem } from "@/utils/galleryItem";

const BASE_PATH = "/spacesaving-furniture/gallery";

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  return buildGalleryMetadata({
    basePath: BASE_PATH,
    id,
    itemApi: `/cms-parent-child/by-id/${id}`,
  });
}

// Pass only the fields the client component actually reads, so less data is
// serialized into the page. A missing item stays null/undefined so the
// client-side fallback fetch still runs exactly as before.
const slimGalleryItem = (item) => {
  if (!item) return item;
  return {
    child_content: {
      title: item.child_content?.title,
      title_tag: item.child_content?.title_tag,
      description: item.child_content?.description,
    },
    child_images: (item.child_images ?? []).map((img) => ({
      image: img?.image,
      image_alt: img?.image_alt,
      title: img?.title,
    })),
  };
};

export default async function GalleryPage({ searchParams }) {
  const id = searchParams?.id;
  const [seo, galleryItem] = await Promise.all([
    getGallerySeo({ basePath: BASE_PATH, id }),
    getGalleryItem(id),
  ]);

  return (
    <>
      <JsonLd data={seo?.custom_schema} />
      <div>
        <MainLayout>
          {/* key => fresh state if the id ever changes via client navigation */}
          <GalleryClient key={id} initialData={slimGalleryItem(galleryItem)} />
        </MainLayout>
      </div>
    </>
  );
}
