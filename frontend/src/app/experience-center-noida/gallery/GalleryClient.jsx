import GalleryDetail from "../../components/GalleryDetail";
import { defaultAltText } from "@/utils/helper";

// NOTE: no "use client" and no <MainLayout> here any more.
// This file has no hooks/state, so it can render on the server. MainLayout is
// now applied in page.jsx (server), so the layout/header/footer tree is no
// longer pulled into the client bundle and re-hydrated.
export default function GalleryClient({ galleryData }) {
  // Only send the fields the gallery actually uses (this array is serialized
  // into the page once per <GalleryDetail>).
  const images = (galleryData?.child_images ?? []).map((img) => ({
    image: img?.image,
    image_alt: img?.image_alt,
    title: img?.title,
  }));

  return (
    <main>
      <section className="container my-5">
        <div className="row g-4 mx-0">
          <h4 className="ps-3 mt-3">{galleryData?.child_content?.title ?? "Gallery"}</h4>

          <div className="col-lg-6">
            <GalleryDetail
              imgGalUrl={images[0]?.image ?? "/images/detail-img/1.webp"}
              imgGalAlt={galleryData?.child_content?.title || defaultAltText}
              imgGalCmsAlt={images[0]?.image_alt}
              imgGalImgClass="w-100 detail_gal_img"
              images={images}
              imgPriority={true}
            />
          </div>
          <div className="col-lg-6">
            <GalleryDetail
              imgGalUrl={images[1]?.image ?? "/images/detail-img/6.webp"}
              imgGalAlt={galleryData?.child_content?.title || defaultAltText}
              imgGalCmsAlt={images[1]?.image_alt}
              imgGalImgClass="w-100 detail_gal_img"
              images={images}
            />
          </div>
          <div className="col-lg-12">
            <GalleryDetail
              imgGalUrl={images[2]?.image ?? "/images/detail-img/3.webp"}
              imgGalAlt={galleryData?.child_content?.title || defaultAltText}
              imgGalCmsAlt={images[2]?.image_alt}
              imgGalImgClass="w-100 detail_gal_img2"
              images={images}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
