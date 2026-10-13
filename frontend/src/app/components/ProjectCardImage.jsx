"use client";

import { useState } from "react";

const FALLBACK_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default function ProjectCardImage({
  src,
  alt = "",
  width = 800,
  height = 600,
  className = "",
  style,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  const hasSrc = typeof src === "string" && src.trim().length > 0;
  const displaySrc = !hasSrc || failedSrc === src ? FALLBACK_IMAGE : src;

  return (
    <img
      src={displaySrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      onError={() => {
        if (hasSrc && failedSrc !== src) setFailedSrc(src);
      }}
    />
  );
}
