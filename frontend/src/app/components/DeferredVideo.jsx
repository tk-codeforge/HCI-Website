"use client";

import { useEffect, useRef } from "react";

/**
 * Same <video> element (same size/classes/id) as before, but the file is only
 * requested after the window `load` event + browser idle time. This stops the
 * large video from competing with the LCP image and the JS bundles on slow
 * networks. The element is rendered immediately with fixed height, so there is
 * no layout shift.
 */
export default function DeferredVideo({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !src) return undefined;

    let idleId;
    let timeoutId;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      el.src = src;
      el.load();
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    const schedule = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(start, { timeout: 3000 });
      } else {
        timeoutId = window.setTimeout(start, 1500);
      }
    };

    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idleId && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      width="100%"
      height="590"
      className="object-fit-cover"
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      id="myVideo"
    />
  );
}
