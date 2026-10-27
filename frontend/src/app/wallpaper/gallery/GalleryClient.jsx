"use client";
import GalleryDetail from "../../components/GalleryDetail";
import { defaultAltText } from "@/utils/helper";

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

const WallpapersGallery = ({ initialGalleryData = {} }) => {
  const galleryData = initialGalleryData;
  const images = galleryData?.child_images ?? [];
  const savedTag = galleryData?.child_content?.title_tag;
  const TitleTag = HEADING_TAGS.includes(savedTag) ? savedTag : "h4";
  const galleryTitle = galleryData?.child_content?.title ?? "Wallpapers";
  const galleryDescription = galleryData?.child_content?.description;

  return (
    <div>
      <main>
        <section className="container my-5">
          <div className="row g-4 mx-0">
            <div className="col-12 text-center mt-3">
              <TitleTag className="mb-3">{galleryTitle}</TitleTag>
              {galleryDescription && (
                <div
                  className="gallery-description mx-auto"
                  style={{ maxWidth: "900px" }}
                  dangerouslySetInnerHTML={{ __html: galleryDescription }}
                />
              )}
            </div>
            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={images[0]?.image ?? "/images/detail-img/1.webp"}
                imgGalAlt={galleryTitle || defaultAltText}
                imgGalCmsAlt={images[0]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
                imgPriority
              />
            </div>
            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={images[1]?.image ?? "/images/detail-img/6.webp"}
                imgGalAlt={galleryTitle || defaultAltText}
                imgGalCmsAlt={images[1]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
              />
            </div>
            <div className="col-lg-12">
              <GalleryDetail
                imgGalUrl={images[2]?.image ?? "/images/detail-img/3.webp"}
                imgGalAlt={galleryTitle || defaultAltText}
                imgGalCmsAlt={images[2]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img2"
                images={images}
              />
            </div>
            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={images[3]?.image ?? "/images/detail-img/4.webp"}
                imgGalAlt={galleryTitle || defaultAltText}
                imgGalCmsAlt={images[3]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
              />
            </div>
            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={images[4]?.image ?? "/images/detail-img/5.webp"}
                imgGalAlt={galleryTitle || defaultAltText}
                imgGalCmsAlt={images[4]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
              />
            </div>
            <div className="col-lg-12">
              <GalleryDetail
                imgGalUrl={images[5]?.image ?? "/images/detail-img/6.webp"}
                imgGalAlt={galleryTitle || defaultAltText}
                imgGalCmsAlt={images[5]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img2"
                images={images}
              />
            </div>
          </div>
        </section>
        <hr />
      </main>
    </div>
  );
};

export default WallpapersGallery;
