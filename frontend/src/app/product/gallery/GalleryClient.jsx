"use client";

import GalleryDetail from "../../components/GalleryDetail";
import { defaultAltText } from "@/utils/helper";

const FALLBACK_IMAGE_URLS = [
  "/images/detail-img/1.webp",
  "/images/detail-img/6.webp",
  "/images/detail-img/3.webp",
  "/images/detail-img/4.webp",
  "/images/detail-img/5.webp",
  "/images/detail-img/6.webp",
];

/**
 * Interactive gallery grid only. The page title, CMS description, and layout are
 * rendered by the server page so this component adds as little client JS as possible.
 */
const GalleryClient = ({ images = [], galleryTitle = "Ready to go Gallery" }) => {
  const galleryImages = Array.isArray(images) ? images : [];
  const titleForAlt = galleryTitle || defaultAltText;

  return (
    <>
      <div className="col-lg-6">
        <GalleryDetail
          imgPriority
          imgGalUrl={galleryImages[0]?.image ?? FALLBACK_IMAGE_URLS[0]}
          imgGalAlt={titleForAlt}
          imgGalCmsAlt={galleryImages[0]?.image_alt}
          imgGalImgClass="w-100 detail_gal_img"
          images={galleryImages}
        />
      </div>
      <div className="col-lg-6">
        <GalleryDetail
          imgGalUrl={galleryImages[1]?.image ?? FALLBACK_IMAGE_URLS[1]}
          imgGalAlt={titleForAlt}
          imgGalCmsAlt={galleryImages[1]?.image_alt}
          imgGalImgClass="w-100 detail_gal_img"
          images={galleryImages}
        />
      </div>
      <div className="col-lg-12">
        <GalleryDetail
          imgGalUrl={galleryImages[2]?.image ?? FALLBACK_IMAGE_URLS[2]}
          imgGalAlt={titleForAlt}
          imgGalCmsAlt={galleryImages[2]?.image_alt}
          imgGalImgClass="w-100 detail_gal_img2"
          images={galleryImages}
        />
      </div>
      <div className="col-lg-6">
        <GalleryDetail
          imgGalUrl={galleryImages[3]?.image ?? FALLBACK_IMAGE_URLS[3]}
          imgGalAlt={titleForAlt}
          imgGalCmsAlt={galleryImages[3]?.image_alt}
          imgGalImgClass="w-100 detail_gal_img"
          images={galleryImages}
        />
      </div>
      <div className="col-lg-6">
        <GalleryDetail
          imgGalUrl={galleryImages[4]?.image ?? FALLBACK_IMAGE_URLS[4]}
          imgGalAlt={titleForAlt}
          imgGalCmsAlt={galleryImages[4]?.image_alt}
          imgGalImgClass="w-100 detail_gal_img"
          images={galleryImages}
        />
      </div>
      <div className="col-lg-12">
        <GalleryDetail
          imgGalUrl={galleryImages[5]?.image ?? FALLBACK_IMAGE_URLS[5]}
          imgGalAlt={titleForAlt}
          imgGalCmsAlt={galleryImages[5]?.image_alt}
          imgGalImgClass="w-100 detail_gal_img2"
          images={galleryImages}
        />
      </div>
    </>
  );
};

export default GalleryClient;
