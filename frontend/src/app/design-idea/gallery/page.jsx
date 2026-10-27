import GalleryDetail from "../../components/GalleryDetail";
import MainLayout from "../../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";
import DOMPurify from "isomorphic-dompurify";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";
const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
const FALLBACK_IMAGES = [
  "/images/detail-img/1.webp",
  "/images/detail-img/6.webp",
  "/images/detail-img/3.webp",
  "/images/detail-img/4.webp",
  "/images/detail-img/5.webp",
  "/images/detail-img/6.webp",
];

async function getGalleryData(id) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/cms-parent-child/by-id/${encodeURIComponent(id)}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Gallery Fetch Error:", error);
    return null;
  }
}

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;

  return buildGalleryMetadata({
    basePath: "/design-idea/gallery",
    id,
    itemApi: `/cms-parent-child/by-id/${id}`,
  });
}

export default async function ResidentialProjectsGallery({ searchParams }) {
  const id = searchParams?.id;
  if (!id) return notFound();

  // Gallery content and SEO are independent; fetch them concurrently.
  const [galleryData, seo] = await Promise.all([
    getGalleryData(id),
    getGallerySeo({ basePath: "/design-idea/gallery", id }),
  ]);

  if (!galleryData) return notFound();

  const images = Array.isArray(galleryData?.child_images)
    ? galleryData.child_images
    : [];
  const staticImages = images.slice(0, 6);
  const extraImages = images.slice(6);
  const title = galleryData?.child_content?.title || "Design Idea Gallery";
  const rawTag = galleryData?.child_content?.title_tag;
  const TitleTag = HEADING_TAGS.includes(rawTag) ? rawTag : "h4";
  const description = galleryData?.child_content?.description || "";

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <main>
        <style>{`.gallery-desc p:last-child { margin-bottom: 0; }`}</style>
        <section className="container my-5">
          <div className="row g-4 mx-0">
            <div className="col-12 text-center mt-3">
              <TitleTag
                className="h4"
                style={{
                  fontFamily: "var(--font-poppins), sans-serif",
                  fontWeight: 600,
                }}
              >
                {title}
              </TitleTag>
              {description ? (
                <div
                  className="gallery-desc mx-auto"
                  style={{ maxWidth: "820px" }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(description),
                  }}
                />
              ) : null}
            </div>

            {/* Keep the original six-card order and Bootstrap column layout. */}
            <div className="col-lg-6">
              <GalleryDetail
                imgPriority
                imgGalUrl={staticImages[0]?.image ?? FALLBACK_IMAGES[0]}
                imgGalAlt={title || defaultAltText}
                imgGalCmsAlt={staticImages[0]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
              />
            </div>
            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={staticImages[1]?.image ?? FALLBACK_IMAGES[1]}
                imgGalAlt={title || defaultAltText}
                imgGalCmsAlt={staticImages[1]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
              />
            </div>
            <div className="col-lg-12">
              <GalleryDetail
                imgGalUrl={staticImages[2]?.image ?? FALLBACK_IMAGES[2]}
                imgGalAlt={title || defaultAltText}
                imgGalCmsAlt={staticImages[2]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img2"
                images={images}
              />
            </div>
            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={staticImages[3]?.image ?? FALLBACK_IMAGES[3]}
                imgGalAlt={title || defaultAltText}
                imgGalCmsAlt={staticImages[3]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
              />
            </div>
            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={staticImages[4]?.image ?? FALLBACK_IMAGES[4]}
                imgGalAlt={title || defaultAltText}
                imgGalCmsAlt={staticImages[4]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
              />
            </div>
            <div className="col-lg-12">
              <GalleryDetail
                imgGalUrl={staticImages[5]?.image ?? FALLBACK_IMAGES[5]}
                imgGalAlt={title || defaultAltText}
                imgGalCmsAlt={staticImages[5]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img2"
                images={images}
              />
            </div>

            {/* Keep rendering any CMS images beyond the first six. */}
            {extraImages.map((image, index) => (
              <div
                key={image?.id ?? image?.image ?? `extra-gallery-image-${index}`}
                className="col-lg-6"
              >
                <GalleryDetail
                  imgGalUrl={image?.image}
                  imgGalAlt={title || defaultAltText}
                  imgGalCmsAlt={image?.image_alt}
                  imgGalImgClass="w-100 detail_gal_img"
                  images={extraImages}
                />
              </div>
            ))}
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
}
