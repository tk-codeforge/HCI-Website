"use client";

import { useEffect, useState } from "react";
import { getGalleryId } from "@/utils/getGalleryId";
import { toast } from "react-toastify";
import api from "@/utils/api";
import GalleryClient from "./GalleryClient";

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

/** Client-side recovery path used only when the server-side gallery request fails. */
const GalleryFallbackClient = () => {
  const [galleryData, setGalleryData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const fetchGallery = async () => {
      try {
        const galleryId = await getGalleryId();
        if (!galleryId) {
          if (isActive) setLoading(false);
          return;
        }

        const response = await api.get(`/cms-parent-child/by-id/${galleryId}`);
        if (!isActive) return;

        if (response.data) setGalleryData(response.data);
        setLoading(false);
      } catch (err) {
        if (!isActive) return;
        toast.error(err?.message ?? "Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchGallery();
    return () => {
      isActive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="loader-container" role="status" aria-label="Loading gallery">
        <div className="spinner">
          <img
            src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif"
            alt=""
            decoding="async"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  const images = Array.isArray(galleryData?.child_images)
    ? galleryData.child_images
    : [];
  const galleryTitle = galleryData?.child_content?.title || "Ready to go Gallery";
  const galleryDescription = galleryData?.child_content?.description;
  const savedTag = galleryData?.child_content?.title_tag;
  const TitleTag = HEADING_TAGS.includes(savedTag) ? savedTag : "h4";

  return (
    <main>
      <section className="container my-5">
        <div className="row g-4 mx-0">
          <div className="col-12 text-center mt-3">
            <TitleTag className="mb-3">{galleryTitle}</TitleTag>
            {galleryDescription ? (
              <div
                className="gallery-description mx-auto"
                style={{ maxWidth: "900px" }}
                dangerouslySetInnerHTML={{ __html: galleryDescription }}
              />
            ) : null}
          </div>
          <GalleryClient images={images} galleryTitle={galleryTitle} />
        </div>
      </section>
      <hr />
    </main>
  );
};

export default GalleryFallbackClient;
