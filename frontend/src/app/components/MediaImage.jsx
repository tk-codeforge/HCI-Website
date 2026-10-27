"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { canOptimize, optimizedSrcSet } from "@/utils/optimizedImage";

let cache = null;
let pending = null;

const loadAltMap = () =>
  cache
    ? Promise.resolve(cache)
    : (pending ||= api
        .get("/cms-parent-child/media-library/alt-map")
        .then((response) => (cache = response.data || {}))
        .catch(() => (cache = {})));

/** Load Media Library alt text once and reuse it across images on the page. */
export const useMediaAltMap = (enabled = true) => {
  const [map, setMap] = useState(cache || {});

  useEffect(() => {
    if (!enabled) return;
    let mounted = true;
    loadAltMap().then((loadedMap) => {
      if (mounted) setMap(loadedMap);
    });
    return () => {
      mounted = false;
    };
  }, [enabled]);

  return map;
};

// `enabled` is false when the caller already has an alt text, so no request is made
// and the component does not re-render when the map arrives.
export const useMediaAlt = (src, fallback = "", enabled = true) => {
  const map = useMediaAltMap(enabled);
  const filename = src ? String(src).split("?")[0].split("/").pop() : "";
  let decodedFilename = filename;

  try {
    decodedFilename = decodeURIComponent(filename);
  } catch {
    // Keep the original filename if the URL has malformed percent encoding.
  }

  return map[decodedFilename] || fallback;
};

export const MediaImg = ({
  src,
  alt: altOverride,
  fallbackAlt = "",
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  ...props
}) => {
  const mapAlt = useMediaAlt(src, fallbackAlt, !altOverride);

  return (
    <img
      src={src}
      {...props}
      alt={altOverride || mapAlt}
      decoding={decoding}
      loading={loading}
      fetchPriority={fetchPriority}
    />
  );
};

export const MediaBg = ({
  src,
  alt: altOverride,
  fallbackAlt = "",
  style,
  className,
  children,
  priority = false,
  loading = "lazy",
  fetchPriority,
  optimizeImage = false,
  sizes = "100vw",
}) => {
  const mapAlt = useMediaAlt(src, fallbackAlt, !altOverride);
  const alt = altOverride || mapAlt;
  const imageOptimizationProps =
    optimizeImage && canOptimize(src)
      ? { srcSet: optimizedSrcSet(src), sizes }
      : {};

  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <img
        src={src}
        alt={alt}
        width={1900}
        height={441}
        decoding="async"
        loading={priority ? "eager" : loading}
        fetchPriority={priority ? "high" : fetchPriority}
        {...imageOptimizationProps}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div style={{ position: "relative", width: "100%" }}>{children}</div>
    </div>
  );
};
