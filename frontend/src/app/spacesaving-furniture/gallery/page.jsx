// import GalleryClient from "./GalleryClient";
// import JsonLd from "../../components/JsonLd";
// import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

// export async function generateMetadata({ searchParams }) {
//   const id = searchParams?.id;
//   return buildGalleryMetadata({
//     basePath: "/spacesaving-furniture/gallery",
//     id,
//     itemApi: `/cms-parent-child/by-id/${id}`,
//   });
// }

// export default async function GalleryPage({ searchParams }) {
//   const id = searchParams?.id;
//   const seo = await getGallerySeo({
//     basePath: "/spacesaving-furniture/gallery",
//     id,
//   });
//   return (
//     <>
//       <JsonLd data={seo?.custom_schema} />
//       <GalleryClient />
//     </>
//   );
// }


import GalleryClient from "./GalleryClient";
import JsonLd from "../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";
import { getGalleryItem } from "@/utils/galleryItem";

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  return buildGalleryMetadata({
    basePath: "/spacesaving-furniture/gallery",
    id,
    itemApi: `/cms-parent-child/by-id/${id}`,
  });
}

export default async function GalleryPage({ searchParams }) {
  const id = searchParams?.id;
  const [seo, galleryItem] = await Promise.all([
    getGallerySeo({
      basePath: "/spacesaving-furniture/gallery",
      id,
    }),
    getGalleryItem(id),
  ]);
  return (
    <>
      <JsonLd data={seo?.custom_schema} />
      {/* key => fresh state if the id ever changes via client navigation */}
      <GalleryClient key={id} initialData={galleryItem} />
    </>
  );
}

