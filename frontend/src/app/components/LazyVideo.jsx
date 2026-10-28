"use client";
import { useEffect, useRef } from "react";

/**
 * Autoplay-style <video> that costs no bandwidth until the visitor gets near it.
 *  - poster + src are only attached when the video is within `rootMargin` of the viewport
 *  - plays while visible, pauses when scrolled away
 *  - Data Saver / reduced-motion visitors get the poster only (when a poster exists)
 * If the file fails to load, the poster stays visible instead of an empty/black box.
 */
export default function LazyVideo({ src, poster, className, style, rootMargin = "200px", ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;

    const conn = navigator.connection;
    const posterOnly =
      Boolean(poster) &&
      (Boolean(conn?.saveData) || window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (poster && !el.getAttribute("poster")) el.setAttribute("poster", poster);
          if (posterOnly) return;
          if (el.getAttribute("src") !== src) el.src = src;
          el.play().catch(() => {});
        } else if (el.getAttribute("src")) {
          el.pause();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, poster, rootMargin]);

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      muted
      loop
      playsInline
      preload="none"
      {...rest}
    />
  );
}
