"use client";

import GalleryDetail from "../../components/GalleryDetail";
import { defaultAltText } from "@/utils/helper";

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

// Keep the six original gallery positions, Bootstrap columns, image classes,
// and fallback images. The parent does not need a client bundle; GalleryDetail
// retains its own client-side interactions.
const GALLERY_SLOTS = [
  {
    index: 0,
    columnClass: "col-lg-6",
    imageClass: "w-100 detail_gal_img",
    fallbackImage: "/images/detail-img/1.webp",
  },
  {
    index: 1,
    columnClass: "col-lg-6",
    imageClass: "w-100 detail_gal_img",
    fallbackImage: "/images/detail-img/6.webp",
  },
  {
    index: 2,
    columnClass: "col-lg-12",
    imageClass: "w-100 detail_gal_img2",
    fallbackImage: "/images/detail-img/3.webp",
  },
  {
    index: 3,
    columnClass: "col-lg-6",
    imageClass: "w-100 detail_gal_img",
    fallbackImage: "/images/detail-img/4.webp",
  },
  {
    index: 4,
    columnClass: "col-lg-6",
    imageClass: "w-100 detail_gal_img",
    fallbackImage: "/images/detail-img/5.webp",
  },
  {
    index: 5,
    columnClass: "col-lg-12",
    imageClass: "w-100 detail_gal_img2",
    fallbackImage: "/images/detail-img/6.webp",
  },
];

export default function GalleryClient({ portfolioData }) {
  const images = portfolioData?.child_images ?? [];
  const savedTag = portfolioData?.title_tag;
  const TitleTag = HEADING_TAGS.includes(savedTag) ? savedTag : "h4";
  const galleryTitle = portfolioData?.title ?? "Luxury Projects";

  return (
    <main>
      <section className="container my-5">
        <div className="row g-4 mx-0">
          <div className="col-12 text-center mt-3">
            <TitleTag className="mb-3">{galleryTitle}</TitleTag>
          </div>

          {GALLERY_SLOTS.map((slot) => {
            const image = images[slot.index];

            return (
              <div className={slot.columnClass} key={slot.index}>
                <GalleryDetail
                  imgGalUrl={image?.image ?? slot.fallbackImage}
                  imgGalAlt={galleryTitle || defaultAltText}
                  imgGalCmsAlt={image?.image_alt}
                  imgGalImgClass={slot.imageClass}
                  images={images}
                />
              </div>
            );
          })}
        </div>
      </section>
      <hr />
    </main>
  );
}
