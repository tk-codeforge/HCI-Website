import GalleryDetail from "../../components/GalleryDetail";
import MainLayout from "../../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";

async function getGalleryData(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/cms-parent-child/by-id/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Gallery Fetch Error:", error);
    return null;
  }
}

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;

  return buildGalleryMetadata({
    basePath: "/ready-togo-design/gallery",
    id,
    itemApi: `/cms-parent-child/by-id/${id}`,
  });
}

const ResidentialProjectsGallery = async ({ searchParams }) => {
  const id = searchParams?.id;
  if (!id) return notFound();

  const galleryData = await getGalleryData(id);
  if (!galleryData) return notFound();

  const seo = await getGallerySeo({
    basePath: "/ready-togo-design/gallery",
    id,
  });
  const images = galleryData?.child_images ?? [];
  const title = galleryData?.child_content?.title ?? "Ready to go Gallery";
  const description = galleryData?.child_content?.description;
  const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"];
  const savedTag = galleryData?.child_content?.title_tag;
  const TitleTag = headingTags.includes(savedTag) ? savedTag : "h1";

  if (images.length === 0) {
    return (
      <MainLayout>
        <main className="container my-5 py-5 text-center">
          <h2 className="font-outfit text-muted">
            No images found for this gallery.
          </h2>
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <main className="bg-light pb-5 ready-gallery-page">
        <section className="py-5 bg-white border-bottom shadow-sm mb-5 ready-gallery-heading">
          <div className="container text-center">
            <TitleTag className="font-outfit fw-bold text-dark mb-2">
              {title}
            </TitleTag>
            {description ? (
              <div
                className="gallery-description font-poppins text-muted mx-auto"
                style={{ maxWidth: "900px" }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="font-poppins text-muted mb-0">
                Explore our exclusive, ready-to-execute designs.
              </p>
            )}
          </div>
        </section>

        <section className="container ready-gallery-container">
          <div className="row g-4 ready-gallery-grid">
            {images.map((img, index) => {
              // Preserve the existing desktop pattern: every third card is wide.
              const isLarge = (index + 1) % 3 === 0;
              const columnClass = isLarge
                ? "col-lg-12 col-12"
                : "col-lg-6 col-md-6 col-12";
              const frameClass = isLarge
                ? "ready-gallery-card-frame ready-gallery-card-frame--large"
                : "ready-gallery-card-frame";

              return (
                <div key={img?.id ?? img?.image ?? index} className={columnClass}>
                  <div className={frameClass}>
                    <GalleryDetail
                      imgGalUrl={img?.image ?? "/images/default.jpg"}
                      imgGalAlt={img?.title || defaultAltText}
                      imgGalCmsAlt={img?.image_alt}
                      imgGalImgClass=""
                      images={images}
                      imgPriority={index === 0}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

export default ResidentialProjectsGallery;
