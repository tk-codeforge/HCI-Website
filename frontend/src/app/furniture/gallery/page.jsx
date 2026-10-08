import GalleryDetail from "../../components/GalleryDetail";
import MainLayout from "../../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";
import { notFound } from "next/navigation";
import JsonLd from "../../components/JsonLd";
import { buildGalleryMetadata, getGallerySeo } from "@/utils/gallerySeo";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";
const BASE_URL = "https://hcinterior.in";

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

// export async function generateMetadata({ searchParams }) {
//   const id = searchParams?.id;
//   const canonicalUrl = id 
//     ? `${BASE_URL}/furniture/gallery?id=${id}` 
//     : `${BASE_URL}/furniture/gallery`;

//   return {
//     alternates: {
//       canonical: canonicalUrl,
//     },
//   };
// }

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  return buildGalleryMetadata({
    basePath: "/furniture/gallery",
    id,
    itemApi: `/cms-parent-child/by-id/${id}`,
  });
}

const ResidentialProjectsGallery = async ({ searchParams }) => {
  const id = searchParams?.id;
  
  if (!id) return notFound();

  const galleryData = await getGalleryData(id);

  if (!galleryData) return notFound();
  
   const seo = await getGallerySeo({ basePath: "/furniture/gallery", id });

  const images = galleryData?.child_images ?? [];
  const title = galleryData?.child_content?.title ?? "Furniture Gallery";
  const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
const savedTag = galleryData?.child_content?.title_tag;
const TitleTag = HEADING_TAGS.includes(savedTag) ? savedTag : "h4";
const description = galleryData?.child_content?.description;

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <main>
        <section className="container my-5">
          <div className="row g-4 mx-0">
            {/* <h4 className="ps-3 mt-3">{title}</h4> */}
            <div className="col-12 text-center mt-3">
  <TitleTag className="mb-3">{title}</TitleTag>
  {description && (
    <div
      className="gallery-description mx-auto"
      style={{ maxWidth: "900px" }}
      dangerouslySetInnerHTML={{ __html: description }}
    />
  )}
</div>
            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={images[0]?.image ?? "/images/detail-img/1.webp"}
                imgGalAlt={defaultAltText}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
              />
            </div>
            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={images[1]?.image ?? "/images/detail-img/6.webp"}
                imgGalAlt={defaultAltText}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
              />
            </div>
            <div className="col-lg-12">
              <GalleryDetail
                imgGalUrl={images[2]?.image ?? "/images/detail-img/3.webp"}
                imgGalAlt={defaultAltText}
                imgGalImgClass="w-100 detail_gal_img2"
                images={images}
              />
            </div>
            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={images[3]?.image ?? "/images/detail-img/4.webp"}
                imgGalAlt={defaultAltText}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
              />
            </div>
            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={images[4]?.image ?? "/images/detail-img/5.webp"}
                imgGalAlt={defaultAltText}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
              />
            </div>
            <div className="col-lg-12">
              <GalleryDetail
                imgGalUrl={images[5]?.image ?? "/images/detail-img/6.webp"}
                imgGalAlt={defaultAltText}
                imgGalImgClass="w-100 detail_gal_img2"
                images={images}
              />
            </div>
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
};

export default ResidentialProjectsGallery;