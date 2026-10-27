"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpandArrowsAlt,
} from "react-icons/fa";
import { useMediaAlt } from "./MediaImage";
import {
  canOptimize,
  optimizedUrl,
  optimizedSrcSet,
} from "@/utils/optimizedImage";

const GalleryDetail = ({
  imgGalUrl,
  imgGalAlt,
  imgGalCmsAlt,
  imgGalImgClass,
  images = [],
  imgPriority = false,
  imgAspect = 1.72,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const previousBodyOverflow = useRef(null);

  const hasImages = Array.isArray(images) && images.length > 0;
  const currentImage = hasImages
    ? images[currentIndex]?.image ?? imgGalUrl
    : imgGalUrl;

  // The Media Library alt lookup is only requested when no alt text was supplied.
  const mapThumbAlt = useMediaAlt(imgGalUrl, imgGalAlt, !imgGalCmsAlt);
  const thumbAlt =
    imgGalCmsAlt || mapThumbAlt || imgGalAlt || "Gallery image";

  const cmsLightboxAlt = hasImages
    ? images[currentIndex]?.image_alt
    : imgGalCmsAlt;
  const mapLightboxAlt = useMediaAlt(
    currentImage,
    images[currentIndex]?.title || imgGalAlt || "Fullscreen view",
    isFullScreen && !cmsLightboxAlt
  );
  const lightboxAlt =
    cmsLightboxAlt ||
    mapLightboxAlt ||
    imgGalAlt ||
    "Fullscreen view";

  // Only supported uploads use the existing image optimizer. The lightbox keeps
  // the original source so users can still view the full-quality image.
  const imageCanOptimize = Boolean(imgGalUrl) && canOptimize(imgGalUrl);
  const thumbSrc = imageCanOptimize
    ? optimizedUrl(imgGalUrl, 1080)
    : imgGalUrl;
  const thumbSrcSet = imageCanOptimize
    ? optimizedSrcSet(imgGalUrl)
    : undefined;
  const isWide = (imgGalImgClass || "").includes("detail_gal_img2");
  const thumbSizes = isWide
    ? "(min-width: 1400px) 1320px, 100vw"
    : "(min-width: 1400px) 650px, (min-width: 992px) 50vw, 100vw";

  const attrWidth = 1200;
  const attrHeight = Math.round(attrWidth / (Number(imgAspect) || 1.72));

  const handleNext = useCallback(
    (event) => {
      if (event) event.stopPropagation();
      if (hasImages) {
        setCurrentIndex((previousIndex) => (previousIndex + 1) % images.length);
      }
    },
    [hasImages, images.length]
  );

  const handlePrev = useCallback(
    (event) => {
      if (event) event.stopPropagation();
      if (hasImages) {
        setCurrentIndex((previousIndex) =>
          (previousIndex - 1 + images.length) % images.length
        );
      }
    },
    [hasImages, images.length]
  );

  const handleClick = useCallback(() => {
    const index = images.findIndex((image) => image?.image === imgGalUrl);
    if (index !== -1) setCurrentIndex(index);

    if (typeof document !== "undefined") {
      previousBodyOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    setIsFullScreen(true);
  }, [images, imgGalUrl]);

  const handleClose = useCallback(() => {
    setIsFullScreen(false);
    if (
      typeof document !== "undefined" &&
      previousBodyOverflow.current !== null
    ) {
      document.body.style.overflow = previousBodyOverflow.current;
      previousBodyOverflow.current = null;
    }
  }, []);

  // Register keyboard handlers only while the lightbox is open.
  useEffect(() => {
    if (!isFullScreen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
      if (event.key === "ArrowRight") handleNext();
      if (event.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen, handleClose, handleNext, handlePrev]);

  // Restore body scrolling if the component is removed while the lightbox is open.
  useEffect(
    () => () => {
      if (
        typeof document !== "undefined" &&
        previousBodyOverflow.current !== null
      ) {
        document.body.style.overflow = previousBodyOverflow.current;
        previousBodyOverflow.current = null;
      }
    },
    []
  );

  return (
    <div
      className="gallery-item-wrapper h-100 position-relative rounded-4 overflow-hidden shadow-sm"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="thumbnail-frame position-relative h-100 w-100 cursor-pointer overflow-hidden group"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`View full-size image: ${thumbAlt}`}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleClick();
          }
        }}
        style={{ cursor: "pointer" }}
      >
        <img
          src={thumbSrc}
          srcSet={thumbSrcSet}
          sizes={thumbSrcSet ? thumbSizes : undefined}
          alt={thumbAlt}
          className={`${imgGalImgClass || ""} premium-thumbnail`}
          width={attrWidth}
          height={attrHeight}
          decoding="async"
          loading={imgPriority ? "eager" : "lazy"}
          fetchPriority={imgPriority ? "high" : undefined}
        />
        <div className="thumbnail-overlay" aria-hidden="true">
          <span className="view-btn">
            <FaExpandArrowsAlt className="me-2" /> View Full Size
          </span>
        </div>
      </div>

      {isFullScreen ? (
        <div className="lightbox-backdrop" onClick={handleClose}>
          <button
            type="button"
            className="glass-btn close-btn shadow-sm"
            onClick={handleClose}
            aria-label="Close full-size image"
          >
            <FaTimes />
          </button>

          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={currentImage}
              alt={lightboxAlt}
              className="lightbox-img"
              decoding="async"
            />

            {hasImages && images.length > 1 ? (
              <>
                <button
                  type="button"
                  className="glass-btn nav-btn left shadow-sm"
                  onClick={handlePrev}
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
                <button
                  type="button"
                  className="glass-btn nav-btn right shadow-sm"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
                <div className="image-counter font-poppins" aria-live="polite">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      {/*
        CRITICAL thumbnail CSS (layout, overlay, mobile aspect-ratio box).
        Rendered as a plain <style> so it is part of the server HTML and is
        applied before first paint. When this lived in styled-jsx it could be
        injected only after hydration, so the overlay text and image box
        appeared/resized late -> CLS. Selectors keep the same specificity as
        the old scoped rules.
      */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .gallery-item-wrapper { width: 100%; min-width: 0; }
        .gallery-item-wrapper .thumbnail-frame { min-width: 0; }
        .gallery-item-wrapper .premium-thumbnail {
          display: block;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .gallery-item-wrapper:hover .premium-thumbnail { transform: scale(1.05); }
        .gallery-item-wrapper .thumbnail-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .gallery-item-wrapper:hover .thumbnail-overlay,
        .gallery-item-wrapper .thumbnail-frame:focus-visible .thumbnail-overlay { opacity: 1; }
        .gallery-item-wrapper .view-btn {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          color: white;
          padding: 10px 20px;
          border-radius: 30px;
          font-family: var(--font-poppins), sans-serif;
          font-weight: 500;
          font-size: 14px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          transform: translateY(20px);
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .gallery-item-wrapper:hover .view-btn,
        .gallery-item-wrapper .thumbnail-frame:focus-visible .view-btn { transform: translateY(0); }

        @media (max-width: 991.98px) {
          .gallery-item-wrapper.h-100 { height: auto !important; }
          .gallery-item-wrapper .thumbnail-frame {
            height: auto !important;
            aspect-ratio: ${attrWidth} / ${attrHeight};
          }
          .gallery-item-wrapper .premium-thumbnail {
            position: absolute;
            inset: 0;
            display: block;
            width: 100% !important;
            height: 100% !important;
            aspect-ratio: auto !important;
            object-fit: cover;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-item-wrapper .premium-thumbnail,
          .gallery-item-wrapper .thumbnail-overlay,
          .gallery-item-wrapper .view-btn {
            animation: none !important;
            transition: none !important;
          }
        }
      `,
        }}
      />

      {/* Lightbox-only styles: needed only after a click, so styled-jsx is fine. */}
      <style jsx>{`
        .lightbox-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999999;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: scaleUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 85vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .glass-btn {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .glass-btn:hover {
          background: rgba(255, 145, 77, 0.9);
          border-color: #ff914d;
          transform: scale(1.1);
        }

        .close-btn {
          position: absolute;
          top: 25px;
          right: 25px;
          width: 50px;
          height: 50px;
          font-size: 20px;
          z-index: 100;
        }

        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          font-size: 18px;
        }

        .nav-btn.left { left: -70px; }
        .nav-btn.right { right: -70px; }
        .nav-btn:hover { transform: translateY(-50%) scale(1.1); }

        .image-counter {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          letter-spacing: 2px;
        }

        @media (max-width: 768px) {
          .nav-btn { width: 40px; height: 40px; }
          .nav-btn.left { left: 10px; background: rgba(0, 0, 0, 0.5); border: none; }
          .nav-btn.right { right: 10px; background: rgba(0, 0, 0, 0.5); border: none; }
          .close-btn { top: 15px; right: 15px; width: 40px; height: 40px; }
          .lightbox-img { max-width: 100vw; max-height: 75vh; border-radius: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .lightbox-backdrop,
          .lightbox-content,
          .glass-btn {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GalleryDetail;
