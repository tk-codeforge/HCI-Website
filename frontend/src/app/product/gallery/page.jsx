import GalleryClient from "./GalleryClient";
import GalleryFallbackClient from "./GalleryFallbackClient";
import MainLayout from "../../layouts/MainLayout";
import JsonLd from "../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

// Fetch the gallery data on the server so the title and first image are present
// in the initial HTML instead of waiting for client-side hydration.
async function getGalleryItem(id) {
  if (!id) return null;

  const baseURL = getBaseUrl();
  if (!baseURL) {
    console.error("Gallery item fetch skipped: API base URL is not configured.");
    return null;
  }

  try {
    const res = await fetch(
      `${baseURL}/cms-parent-child/by-id/${encodeURIComponent(id)}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      console.error(`Gallery item fetch ${id} failed with status ${res.status}.`);
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
    itemApi: id
      ? `/cms-parent-child/by-id/${encodeURIComponent(id)}`
      : undefined,
  });
}

export default async function GalleryPage({ searchParams }) {
  const id = searchParams?.id;
  const [seo, galleryItem] = await Promise.all([
    getGallerySeo({ basePath: "/product/gallery", id }),
    getGalleryItem(id),
  ]);

  const galleryImages = Array.isArray(galleryItem?.child_images)
    ? galleryItem.child_images
    : [];
  const galleryTitle = galleryItem?.child_content?.title || "Ready to go Gallery";
  const galleryDescription = galleryItem?.child_content?.description;
  const savedTag = galleryItem?.child_content?.title_tag;
  const TitleTag = HEADING_TAGS.includes(savedTag) ? savedTag : "h4";

  return (
    <>
      <JsonLd data={seo?.custom_schema} />
      <MainLayout>
        {galleryItem ? (
          <main>
            <section className="container my-5">
              <div className="row g-4 mx-0">
                <div className="col-12 text-center mt-3">
                  <TitleTag className="mb-3">{galleryTitle}</TitleTag>
                  {galleryDescription ? (
                    <div
                      className="gallery-description mx-auto"
                      style={{ maxWidth: "900px" }}
                      dangerouslySetInnerHTML={{ __html: galleryDescription }}
                    />
                  ) : null}
                </div>

                {/* The interactive client component now contains only the gallery cards. */}
                <GalleryClient
                  images={galleryImages}
                  galleryTitle={galleryTitle}
                />
              </div>
            </section>
            <hr />
          </main>
        ) : (
          // Keep the existing client-fetch fallback for temporary API failures.
          <GalleryFallbackClient key={id || "gallery-fallback"} />
        )}
      </MainLayout>
    </>
  );
}
