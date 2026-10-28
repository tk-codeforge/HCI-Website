"use client";

import { useEffect, useRef } from "react";

/**
 * Same autoplaying, looping, muted <video> as before, but the file is only
 * requested after the page has loaded AND the video is near the viewport.
 * Until then the element keeps its CSS size, so layout does not change.
 * This stops large videos from competing with the banner (LCP) and JS on
 * slow connections.
 */
export default function LazyVideo({ src, className, style, width, controls = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !src) return undefined;

    let cancelled = false;
    let observer;
    let timeoutId;

    const start = () => {
      if (cancelled) return;
      el.src = src;
      el.load();
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    const observe = () => {
      if (cancelled) return;
      if (!("IntersectionObserver" in window)) {
        start();
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            start();
          }
        },
        { rootMargin: "300px" }
      );
      observer.observe(el);
    };

    const afterLoad = () => {
      timeoutId = window.setTimeout(observe, 300);
    };

    if (document.readyState === "complete") {
      afterLoad();
    } else {
      window.addEventListener("load", afterLoad, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", afterLoad);
      if (timeoutId) window.clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      style={style}
      width={width}
      controls={controls}
      autoPlay
      loop
      muted
      playsInline
      preload="none"
    />
  );
}
