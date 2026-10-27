"use client";

import React, { useRef, useState, useEffect } from "react";
import { canOptimize, optimizedUrl, optimizedSrcSet } from "@/utils/optimizedImage";

const imgProps = (src, sizes) =>
  canOptimize(src)
    ? { src: optimizedUrl(src, 1080), srcSet: optimizedSrcSet(src), sizes }
    : { src };



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

          .ffs-wrapper { width: 100%; }
@media (min-width: 992px) {
  .ffs-wrapper { height: 100%; }
}
        .ffs-box {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
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
          @media (min-width: 992px) {
  .ffs-desktop .ffs-box img {
    position: absolute;
    inset: 0;
  }
}


        .ffs-desktop {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  min-height: 420px;   /* safety floor if the right side is short */
}
.ffs-top.ffs-box {
  flex: 1.15 1 0;      /* top image slightly taller than the bottom row */
  min-height: 0;
}
.ffs-bottom {
  display: grid;
  grid-template-rows: 1fr;
  gap: 12px;
  flex: 1 1 0;
  min-height: 0;
}
.ffs-bottom .ffs-box { height: 100%; }

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
        .ffs-slide .ffs-box {
  height: auto;
  aspect-ratio: 16 / 9;
}
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
            <img
              {...imgProps(topImage.src, "(min-width: 992px) 58vw, 100vw")}
              alt={topImage.alt || topImage.caption || "Furniture factory banner"}
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
            />
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
                <img
                  {...imgProps(img.src, "(min-width: 992px) 29vw, 100vw")}
                  alt={img.alt || img.caption || "Furniture factory image"}
                  width={1280}
                  height={720}
                  loading="lazy"
                  decoding="async"
                />
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
               <img
                  {...imgProps(img.src, "100vw")}
                  alt={img.alt || img.caption || "Furniture factory image"}
                  loading="lazy"
                  decoding="async"
                />
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
