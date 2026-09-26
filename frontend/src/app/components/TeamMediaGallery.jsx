"use client";
import { useState } from "react";

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
              <video className="team-media-video" autoPlay loop muted playsInline>
                <source src={item.url} type="video/mp4" />
              </video>
            ) : (
              <img
                src={item.url}
                alt="Team media"
                className="team-media-image"
                loading="lazy"
                decoding="async"
              />
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
                alt="Team media"
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