"use client";
import { getGalleryId } from "@/utils/getGalleryId";
import GalleryDetail from "../../components/GalleryDetail";
import MainLayout from "../../layouts/MainLayout";
import { useHasMounted } from "@/utils/useHasMounted";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/utils/api";
import { defaultAltText } from "@/utils/helper";
const ResidentialProjectsGallery = () => {
  const [galleryData, setGalleryData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
  const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
const savedTag = galleryData?.child_content?.title_tag;
const TitleTag = HEADING_TAGS.includes(savedTag) ? savedTag : "h4";
const galleryTitle = galleryData?.child_content?.title ?? "Space saving furniture";
const galleryDescription = galleryData?.child_content?.description;

  return (
    <div>
          {loading ? (
        <div className="loader-container">
          <div className="spinner">
            <img src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif"  alt="" decoding="async"  loading="lazy" /> 
          </div>
        </div>
      ) : (
      <MainLayout>
        <main>
          <section className="container my-5">
            <div className="row g-4 mx-0">
              {/* <h4 className="ps-3 mt-3">
                {galleryData?.child_content?.title ?? "Space saving furniture"}
              </h4> */}

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
                  imgGalUrl={
                    galleryData?.child_images?.[0]?.image ??
                    "/images/detail-img/1.webp"
                  }
                  imgGalAlt={defaultAltText}
                  imgGalImgClass="w-100 detail_gal_img"
                  images={images}
                />
              </div>
              <div className="col-lg-6">
                <GalleryDetail
                  imgGalUrl={
                    galleryData?.child_images?.[1]?.image ??
                    "/images/detail-img/6.webp"
                  }
                  imgGalAlt={defaultAltText}
                  imgGalImgClass="w-100 detail_gal_img"
                  images={images}
                />
              </div>
              <div className="col-lg-12">
                <GalleryDetail
                  imgGalUrl={
                    galleryData?.child_images?.[2]?.image ??
                    "/images/detail-img/3.webp"
                  }
                  imgGalAlt={defaultAltText}
                  imgGalImgClass="w-100 detail_gal_img2"
                  images={images}
                />
              </div>
              <div className="col-lg-6">
                <GalleryDetail
                  imgGalUrl={
                    galleryData?.child_images?.[3]?.image ??
                    "/images/detail-img/4.webp"
                  }
                  imgGalAlt={defaultAltText}
                  imgGalImgClass="w-100 detail_gal_img"
                  images={images}
                />
              </div>
              <div className="col-lg-6">
                <GalleryDetail
                  imgGalUrl={
                    galleryData?.child_images?.[4]?.image ??
                    "/images/detail-img/5.webp"
                  }
                  imgGalAlt={defaultAltText}
                  imgGalImgClass="w-100 detail_gal_img"
                  images={images}
                />
              </div>
              <div className="col-lg-12">
                <GalleryDetail
                  imgGalUrl={
                    galleryData?.child_images?.[5]?.image ??
                    "/images/detail-img/6.webp"
                  }
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
      )}
    </div>
  );
};

export default ResidentialProjectsGallery;
