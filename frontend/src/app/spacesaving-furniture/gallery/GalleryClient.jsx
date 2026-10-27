"use client";
import { getGalleryId } from "@/utils/getGalleryId";
import GalleryDetail from "../../components/GalleryDetail";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/utils/api";
import { defaultAltText } from "@/utils/helper";

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

// <MainLayout> is no longer rendered here: it is applied in gallery/page.jsx
// (server component), so the header/footer/layout tree is not pulled into this
// client bundle and re-hydrated.
//
// initialData is fetched on the server (gallery/page.jsx). When present, the title and
// images are already in the HTML, so there is no spinner and no layout jump.
// If it is missing (API hiccup), the original client-side fetch below still runs.
const ResidentialProjectsGallery = ({ initialData }) => {
  const [galleryData, setGalleryData] = useState(initialData ?? {});
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    const fetchContentManagerPages = async () => {
      const galleryId = await getGalleryId();
      try {
        const response = await api.get(
          `/cms-parent-child/by-id/${galleryId}`,
          {}
        );

        if (response.data) {
          setGalleryData(response.data);
          setLoading(false);
        }
      } catch (err) {
        toast.error(err.message ?? "Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchContentManagerPages();
  }, []);

  const images = galleryData?.child_images ?? [];
  const savedTag = galleryData?.child_content?.title_tag;
  const TitleTag = HEADING_TAGS.includes(savedTag) ? savedTag : "h4";
  const galleryTitle = galleryData?.child_content?.title ?? "Space saving furniture";
  const galleryDescription = galleryData?.child_content?.description;

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner">
          <img src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif" alt="" decoding="async" loading="lazy" />
        </div>
      </div>
    );
  }

  return (
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
              imgPriority
              imgGalUrl={images[0]?.image ?? "/images/detail-img/1.webp"}
              imgGalAlt={galleryTitle || defaultAltText}
              imgGalCmsAlt={images[0]?.image_alt}
              imgGalImgClass="w-100 detail_gal_img"
              images={images}
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
  );
};

export default ResidentialProjectsGallery;
