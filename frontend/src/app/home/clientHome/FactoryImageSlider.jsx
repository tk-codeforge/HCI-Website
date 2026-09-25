"use client";

import React, { useRef, useState, useEffect } from "react";

/**
 * Desktop (>=992px): a static "1 wide image on top, 2 images below" layout.
 *   - If only the two bottom images are present (no topImage), they render
 *     as a single edge-to-edge row (no gap, no border-radius).
 *   - No border-radius anywhere; hover-zoom is kept via CSS transform.
 * Mobile (<992px): a swipeable, one-card-at-a-time slider through whichever
 *   of the (up to 3) images are present, in order: topImage, image1, image2.
 *   A thin scrub bar appears on touch/scroll and auto-hides after 2s.
 *
 * Props:
 *   topImage: { src, caption } | null
 *   images:   [{ src, caption } | null, { src, caption } | null]  (bottom row, left/right)
 */
export default function FactoryImageSlider({ topImage = null, images = [] }) {
  const trackRef = useRef(null);
  const hideTimerRef = useRef(null);
  const [showIndicator, setShowIndicator] = useState(false);
  const [thumb, setThumb] = useState({ width: 40, left: 0 });

  const updateThumb = () => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    if (scrollWidth <= clientWidth) return;
    const widthPct = Math.max((clientWidth / scrollWidth) * 100, 15);
    const maxLeftPct = 100 - widthPct;
    const leftPct = (scrollLeft / (scrollWidth - clientWidth)) * maxLeftPct;
    setThumb({ width: widthPct, left: leftPct });
  };

  const revealIndicator = () => {
    updateThumb();
    setShowIndicator(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowIndicator(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const bottomImages = images.filter(Boolean);
  const allSlides = [topImage, ...bottomImages].filter(Boolean);

  if (!allSlides.length) return null;

  return (
    <div className="ffs-wrapper">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ffs-box {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
        }
        .ffs-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .ffs-box:hover img { transform: scale(1.08); }
        .ffs-caption {
          position: absolute;
          bottom: 0;
          right: 0;
          margin: 1rem;
          color: #fff;
          font-weight: 600;
          font-size: 0.9rem;
        }

        /* ---------- Desktop / tablet static layout ---------- */
        .ffs-desktop {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ffs-top.ffs-box { height: 260px; }
        .ffs-bottom {
          display: grid;
          gap: 12px;
        }
        .ffs-bottom .ffs-box { height: 220px; }

        /* ---------- Mobile swipeable slider ---------- */
        .ffs-mobile { position: relative; }
        .ffs-track {
          display: flex;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          scroll-snap-type: x mandatory;
          gap: 12px;
        }
        .ffs-track::-webkit-scrollbar { display: none; }
        .ffs-slide {
          flex: 0 0 100%;
          max-width: 100%;
          box-sizing: border-box;
          scroll-snap-align: center;
        }
        .ffs-slide .ffs-box { height: 300px; }
        .ffs-scrollbar-track {
          position: relative;
          height: 4px;
          margin: 12px auto 0;
          width: 60px;
          background: rgba(0, 0, 0, 0.08);
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .ffs-scrollbar-track.visible { opacity: 1; }
        .ffs-scrollbar-thumb {
          position: absolute;
          top: 0;
          height: 100%;
          background: #ff914d;
          border-radius: 4px;
          transition: left 0.05s linear;
        }
      `,
        }}
      />

      {/* Desktop / tablet: 1 wide image on top, up to 2 edge-to-edge below */}
      <div className="ffs-desktop d-none d-lg-flex">
        {topImage && (
          <div className="ffs-top ffs-box">
            <img src={topImage.src} alt={topImage.caption || "Factory"} />
            {topImage.caption && <span className="ffs-caption">{topImage.caption}</span>}
          </div>
        )}

        {bottomImages.length > 0 && (
          <div
            className="ffs-bottom"
            style={{ gridTemplateColumns: `repeat(${bottomImages.length}, 1fr)` }}
          >
            {bottomImages.map((img, idx) => (
              <div className="ffs-box" key={idx}>
                <img src={img.src} alt={img.caption || "Factory"} />
                {img.caption && <span className="ffs-caption">{img.caption}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mobile: swipe through all present images, one at a time */}
      <div className="ffs-mobile d-lg-none">
        <div
          className="ffs-track"
          ref={trackRef}
          onScroll={revealIndicator}
          onTouchStart={revealIndicator}
          onTouchMove={revealIndicator}
        >
          {allSlides.map((img, idx) => (
            <div className="ffs-slide" key={idx}>
              <div className="ffs-box">
                <img src={img.src} alt={img.caption || "Factory"} />
                {img.caption && <span className="ffs-caption">{img.caption}</span>}
              </div>
            </div>
          ))}
        </div>

        {allSlides.length > 1 && (
          <div className={`ffs-scrollbar-track ${showIndicator ? "visible" : ""}`}>
            <div
              className="ffs-scrollbar-thumb"
              style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
