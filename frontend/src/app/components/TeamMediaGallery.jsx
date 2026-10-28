"use client";
import { useState } from "react";
import LazyVideo from "./LazyVideo";
import {
  canOptimize,
  optimizedSrcSet,
  optimizedUrl,
} from "@/utils/optimizedImage";

// Grid thumbnail: a resized rendition instead of the original upload. If the
// optimizer request fails, it falls back to the original file. The lightbox
// still opens the original full-quality file.
function GridImage({ item }) {
  const [optimizerFailed, setOptimizerFailed] = useState(false);
  const optimized = !optimizerFailed && canOptimize(item.url);

  return (
    <img
      src={optimized ? optimizedUrl(item.url, 828) : item.url}
      srcSet={optimized ? optimizedSrcSet(item.url, [640, 750, 828, 1080]) : undefined}
      sizes={
        optimized
          ? "(min-width: 1200px) 570px, (min-width: 768px) 50vw, 100vw"
          : undefined
      }
      alt={item.image_alt?.trim() || "Team media"}
      className="team-media-image"
      width={1280}
      height={720}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (optimized) setOptimizerFailed(true);
      }}
    />
  );
}

export default function TeamMediaGallery({ items }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const openLightbox = (idx) => setActiveIndex(idx);
  const closeLightbox = () => setActiveIndex(null);
  const showPrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };
  const showNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  return (
    <>
      <div className="team-media-grid">
        {items.map((item, idx) => (
          <div key={idx} className="team-media-cell">
            <div className="team-media-box" onClick={() => openLightbox(idx)}>
              {item.type === "video" ? (
                // Autoplaying video that only downloads once it is near the viewport.
                <LazyVideo className="team-media-video" src={item.url} />
              ) : (
                <GridImage item={item} />
              )}

              <div className="team-media-overlay" onClick={() => openLightbox(idx)}>
                <span className="team-media-viewfull">⤢ View Full Size</span>
              </div>
            </div>

            {item.description && (
              <p className="team-media-description">{item.description}</p>
            )}
          </div>
        ))}
      </div>

      {activeItem && (
        <div className="team-media-lightbox" onClick={closeLightbox}>
          <button className="team-media-lightbox-close" onClick={closeLightbox}>
            &times;
          </button>
          <button className="team-media-lightbox-arrow left" onClick={showPrev}>
            &#10094;
          </button>

          <div className="team-media-lightbox-content" onClick={(e) => e.stopPropagation()}>
            {activeItem.type === "video" ? (
              <video
                src={activeItem.url}
                controls
                autoPlay
                className="team-media-lightbox-media"
              />
            ) : (
              <img
                src={activeItem.url}
                alt={activeItem.image_alt?.trim() || "Team media"}
                className="team-media-lightbox-media"
              />
            )}
          </div>

          <button className="team-media-lightbox-arrow right" onClick={showNext}>
            &#10095;
          </button>

          <div className="team-media-lightbox-counter">
            {activeIndex + 1} / {items.length}
          </div>
        </div>
      )}
    </>
  );
}
