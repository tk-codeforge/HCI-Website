"use client";
import GalleryDetail from "../../components/GalleryDetail";
import MainLayout from "../../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

const ResidentialProjectsGallery = ({ initialGalleryData = {} }) => {
  const galleryData = initialGalleryData;
  const images = galleryData?.child_images ?? [];
  const staticImages = images.slice(0, 6);
  const extraImages = images.slice(6);

  const savedTag = galleryData?.child_content?.title_tag;
  const TitleTag = HEADING_TAGS.includes(savedTag) ? savedTag : "h4";
  const galleryTitle = galleryData?.child_content?.title ?? "Ready to go Gallery";

  const firstImgSrc = staticImages[0]?.image ?? "/images/detail-img/1.webp";

  return (
    <MainLayout>
      <main>
        <section className="container my-4">
          <div className="row g-4 mx-0">
            <div className="col-12 text-center mt-4">
              <TitleTag className="mb-3">{galleryTitle}</TitleTag>
            </div>

            {/* Above-the-fold hero image: eager + high priority (GalleryDetail's imgPriority) for LCP */}
            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={firstImgSrc}
                imgGalAlt={galleryTitle || defaultAltText}
                imgGalCmsAlt={staticImages[0]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
                imgPriority
              />
            </div>

            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={staticImages[1]?.image ?? "/images/detail-img/6.webp"}
                imgGalAlt={galleryTitle || defaultAltText}
                imgGalCmsAlt={staticImages[1]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
              />
            </div>

            <div className="col-lg-12">
              <GalleryDetail
                imgGalUrl={staticImages[2]?.image ?? "/images/detail-img/3.webp"}
                imgGalAlt={galleryTitle || defaultAltText}
                imgGalCmsAlt={staticImages[2]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img2"
                images={images}
              />
            </div>

            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={staticImages[3]?.image ?? "/images/detail-img/4.webp"}
                imgGalAlt={galleryTitle || defaultAltText}
                imgGalCmsAlt={staticImages[3]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
              />
            </div>

            <div className="col-lg-6">
              <GalleryDetail
                imgGalUrl={staticImages[4]?.image ?? "/images/detail-img/5.webp"}
                imgGalAlt={galleryTitle || defaultAltText}
                imgGalCmsAlt={staticImages[4]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img"
                images={images}
              />
            </div>

            <div className="col-lg-12">
              <GalleryDetail
                imgGalUrl={staticImages[5]?.image ?? "/images/detail-img/6.webp"}
                imgGalAlt={galleryTitle || defaultAltText}
                imgGalCmsAlt={staticImages[5]?.image_alt}
                imgGalImgClass="w-100 detail_gal_img2"
                images={images}
              />
            </div>

            {/* Dynamic Extra Images */}
            {extraImages.length > 0 &&
              extraImages.map((image, index) => (
                <div key={index} className="col-lg-6">
                  <GalleryDetail
                    imgGalUrl={image.image}
                    imgGalAlt={galleryTitle || defaultAltText}
                    imgGalCmsAlt={image.image_alt}
                    imgGalImgClass="w-100 detail_gal_img"
                    images={images}
                  />
                </div>
              ))}
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
};

export default ResidentialProjectsGallery;