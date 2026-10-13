// import GalleryClient from "./GalleryClient";
// import JsonLd from "../../components/JsonLd";
// import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

// export async function generateMetadata({ searchParams }) {
//   const id = searchParams?.id;
//   return buildGalleryMetadata({
//     basePath: "/product/gallery",
//     id,
//     itemApi: `/cms-parent-child/by-id/${id}`,
//   });
// }

// export default async function GalleryPage({ searchParams }) {
//   const id = searchParams?.id;
//   const seo = await getGallerySeo({ basePath: "/product/gallery", id });
//    return (
//     <>
//       <JsonLd data={seo?.custom_schema} />
//        <GalleryClient />
//     </>
//   );
// }



import GalleryClient from "./GalleryClient";
import JsonLd from "../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

// Same endpoint GalleryClient used to call in the browser after hydration.
// Fetching it here puts the title + images in the server HTML (no spinner, no
// layout jump, and the first image can be discovered early).
async function getGalleryItem(id) {
  if (!id) return null;
  try {
    const res = await fetch(
      `${getBaseUrl()}/cms-parent-child/by-id/${encodeURIComponent(id)}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) {
      console.error(`Gallery item fetch ${id} -> ${res.status} (base: ${getBaseUrl()})`);
      return null;
    }
    const data = await res.json();
    return data && typeof data === "object" ? data : null;
  } catch (err) {
    console.error("Gallery item fetch error:", err);
    return null;
  }
}

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  return buildGalleryMetadata({
    basePath: "/product/gallery",
    id,
    itemApi: `/cms-parent-child/by-id/${id}`,
  });
}

export default async function GalleryPage({ searchParams }) {
  const id = searchParams?.id;
  const [seo, galleryItem] = await Promise.all([
    getGallerySeo({ basePath: "/product/gallery", id }),
    getGalleryItem(id),
  ]);
  return (
    <>
      <JsonLd data={seo?.custom_schema} />
      {/* key => remount (fresh state) if the id ever changes via client navigation */}
      <GalleryClient key={id} initialData={galleryItem} />
    </>
  );
}
