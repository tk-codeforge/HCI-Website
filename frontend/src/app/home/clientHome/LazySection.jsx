"use client";
import { useState, useEffect, useRef } from "react";

/**
 * Renders children in the initial HTML for SEO, accessibility and no-JS visits.
 * Browser-native content-visibility defers off-screen layout/paint without
 * requiring IntersectionObserver to make the content appear.
 */
export default function LazySection({ children, placeholderHeight = "500px", className = "" }) {
  const [isNearViewport, setIsNearViewport] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // In browsers without IntersectionObserver, content remains visible and
    // the native content-visibility fallback is harmless.
    if (!("IntersectionObserver" in window)) {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const reservedSize = String(placeholderHeight || "500px").trim();

  return (
    <div
      ref={containerRef}
      className={className ? `home-lazy-section ${className}` : "home-lazy-section"}
      style={{
        contentVisibility: isNearViewport ? "visible" : "auto",
        containIntrinsicSize: isNearViewport ? "auto 0px" : `auto ${reservedSize}`,
      }}
    >
      {children}
    </div>
  );
}
