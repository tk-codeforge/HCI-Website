"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpandArrowsAlt,
} from "react-icons/fa";
import { useMediaAltMap } from "./MediaImage";
import { canOptimize, optimizedSrcSet } from "@/utils/optimizedImage";

const FALLBACK_IMAGES = [
  "/images/detail-img/1.webp",
  "/images/detail-img/6.webp",
  "/images/detail-img/3.webp",
  "/images/detail-img/4.webp",
  "/images/detail-img/5.webp",
  "/images/detail-img/6.webp",
];

const TILE_COLUMNS = [
  "col-lg-6",
  "col-lg-6",
  "col-lg-12",
  "col-lg-6",
  "col-lg-6",
  "col-lg-12",
];

// These column classes stack below Bootstrap's lg breakpoint. Keep sizes in
// sync with the actual rendered width so mobile does not download an oversized
// desktop variant or select a too-small tablet variant.
const HALF_TILE_SIZES =
  "(max-width: 575px) calc(100vw - 48px), (max-width: 767px) 516px, (max-width: 991px) 696px, (max-width: 1199px) 456px, (max-width: 1399px) 546px, 636px";
const FULL_TILE_SIZES =
  "(max-width: 575px) calc(100vw - 48px), (max-width: 767px) 516px, (max-width: 991px) 696px, (max-width: 1199px) 936px, (max-width: 1399px) 1116px, 1296px";

function getMediaFilename(src) {
  if (!src) return "";
  const filename = String(src).split("?")[0].split("#")[0].split("/").pop() || "";
  try {
    return decodeURIComponent(filename);
  } catch {
    return filename;
  }
}

function getResponsiveImageProps(src, sizes) {
  if (!src || !canOptimize(src)) return {};
  return {
    srcSet: optimizedSrcSet(src),
    sizes,
  };
}

export default function GalleryGrid({
  images = [],
  galleryTitle,
  defaultAltText = "Interior design gallery",
}) {
  const imageList = Array.isArray(images) ? images : [];
  const altMap = useMediaAltMap();
  const [activeIndex, setActiveIndex] = useState(0);
  const [fallbackActiveImage, setFallbackActiveImage] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const previousBodyOverflow = useRef("");

  // Keep the existing six-tile layout and fallback sources.
  const tiles = useMemo(
    () =>
      FALLBACK_IMAGES.map((fallbackSrc, index) => {
        const src = imageList[index]?.image || fallbackSrc;
        const sizes = index === 2 || index === 5 ? FULL_TILE_SIZES : HALF_TILE_SIZES;
        return {
          src,
          cmsAlt: imageList[index]?.image_alt || "",
          index,
          responsiveImageProps: getResponsiveImageProps(src, sizes),
        };
      }),
    [imageList]
  );

  const resolveAlt = useCallback(
    (src, cmsAlt, fallback = galleryTitle || defaultAltText) => {
      const filename = getMediaFilename(src);
      return cmsAlt || altMap?.[filename] || fallback;
    },
    [altMap, galleryTitle, defaultAltText]
  );

  const activeImage =
    fallbackActiveImage || imageList[activeIndex]?.image || tiles[0]?.src || "";
  const activeCmsAlt = fallbackActiveImage
    ? tiles.find((tile) => tile.src === fallbackActiveImage)?.cmsAlt
    : imageList[activeIndex]?.image_alt;
  const activeAlt = resolveAlt(
    activeImage,
    activeCmsAlt,
    imageList[activeIndex]?.title ||
      `${galleryTitle || defaultAltText} - image ${activeIndex + 1}`
  );

  const openLightbox = useCallback(
    (src) => {
      const matchingIndex = imageList.findIndex((image) => image?.image === src);
      previousBodyOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      if (matchingIndex >= 0) {
        setActiveIndex(matchingIndex);
        setFallbackActiveImage(null);
      } else {
        setActiveIndex(0);
        setFallbackActiveImage(src);
      }
      setIsFullScreen(true);
    },
    [imageList]
  );

  const handleClose = useCallback(() => {
    setIsFullScreen(false);
    document.body.style.overflow = previousBodyOverflow.current;
  }, []);

  const handleNext = useCallback(
    (event) => {
      event?.stopPropagation();
      if (imageList.length < 2) return;
      setFallbackActiveImage(null);
      setActiveIndex((index) => (index + 1) % imageList.length);
    },
    [imageList.length]
  );

  const handlePrev = useCallback(
    (event) => {
      event?.stopPropagation();
      if (imageList.length < 2) return;
      setFallbackActiveImage(null);
      setActiveIndex((index) => (index - 1 + imageList.length) % imageList.length);
    },
    [imageList.length]
  );

  useEffect(() => {
    if (!isFullScreen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen, handleClose, handleNext, handlePrev]);

  useEffect(
    () => () => {
      document.body.style.overflow = previousBodyOverflow.current;
    },
    []
  );

  return (
    <>
      {tiles.map((tile, index) => (
        <div className={TILE_COLUMNS[index]} key={`${tile.src}-${index}`}>
          <div
            className="gallery-item-wrapper position-relative rounded-4 overflow-hidden shadow-sm"
            style={{ backgroundColor: "#f8f9fa", aspectRatio: "16 / 9" }}
          >
            <button
              type="button"
              className="gallery-thumbnail-button position-relative w-100 h-100 overflow-hidden"
              onClick={() => openLightbox(tile.src)}
              aria-label={`View full-size image ${index + 1}: ${resolveAlt(tile.src, tile.cmsAlt)}`}
            >
              <img
                src={tile.src}
                {...tile.responsiveImageProps}
                alt={resolveAlt(tile.src, tile.cmsAlt)}
                width={1200}
                height={675}
                className="premium-thumbnail"
                decoding="async"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
              />
              <span className="thumbnail-overlay" aria-hidden="true">
                <span className="view-btn">
                  <FaExpandArrowsAlt className="me-2" aria-hidden="true" /> View Full Size
                </span>
              </span>
            </button>
          </div>
        </div>
      ))}

      {isFullScreen && (
        <div className="lightbox-backdrop" onClick={handleClose} role="presentation">
          <button
            type="button"
            className="glass-btn close-btn shadow-sm"
            onClick={handleClose}
            aria-label="Close full-size image"
          >
            <FaTimes aria-hidden="true" />
          </button>

          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${galleryTitle || defaultAltText} image viewer`}
          >
            {activeImage && (
              <img
                src={activeImage}
                alt={activeAlt}
                width={1600}
                height={1100}
                className="lightbox-img"
                decoding="async"
                loading="eager"
              />
            )}

            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  className="glass-btn nav-btn left shadow-sm"
                  onClick={handlePrev}
                  aria-label="Previous image"
                >
                  <FaChevronLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="glass-btn nav-btn right shadow-sm"
                  onClick={handleNext}
                  aria-label="Next image"
                >
                  <FaChevronRight aria-hidden="true" />
                </button>
                <div className="image-counter font-poppins" aria-live="polite">
                  {activeIndex + 1} / {imageList.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .gallery-thumbnail-button {
          display: block;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          aspect-ratio: 16 / 9;
          touch-action: manipulation;
        }

        .premium-thumbnail {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.25s ease;
        }

        .thumbnail-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.48), transparent);
          opacity: 0;
          transition: opacity 0.15s ease;
          pointer-events: none;
        }

        .view-btn {
          padding: 10px 20px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          font-family: var(--font-poppins), sans-serif;
          font-size: 14px;
          font-weight: 500;
        }

        .lightbox-backdrop {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 23, 42, 0.96);
        }

        .lightbox-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 90vw;
          max-height: 90vh;
        }

        .lightbox-img {
          display: block;
          max-width: 90vw;
          max-height: 85vh;
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .glass-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          cursor: pointer;
          touch-action: manipulation;
        }

        .close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          z-index: 2;
          width: 48px;
          height: 48px;
          font-size: 20px;
        }

        .nav-btn {
          position: absolute;
          top: 50%;
          width: 48px;
          height: 48px;
          font-size: 18px;
          transform: translateY(-50%);
        }

        .nav-btn.left { left: -64px; }
        .nav-btn.right { right: -64px; }

        .image-counter {
          position: absolute;
          bottom: -36px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          letter-spacing: 2px;
        }

        @media (hover: hover) and (pointer: fine) {
          .gallery-item-wrapper:hover .premium-thumbnail,
          .gallery-thumbnail-button:focus-visible .premium-thumbnail {
            transform: scale(1.025);
          }

          .gallery-item-wrapper:hover .thumbnail-overlay,
          .gallery-thumbnail-button:focus-visible .thumbnail-overlay {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .premium-thumbnail,
          .thumbnail-overlay {
            transition: none;
          }
        }

        @media (max-width: 768px) {
          .close-btn { top: 14px; right: 14px; width: 40px; height: 40px; }
          .nav-btn { width: 40px; height: 40px; }
          .nav-btn.left { left: 8px; }
          .nav-btn.right { right: 8px; }
          .lightbox-img { max-width: 100vw; max-height: 75vh; border-radius: 0; }
        }
      `}</style>
    </>
  );
}
