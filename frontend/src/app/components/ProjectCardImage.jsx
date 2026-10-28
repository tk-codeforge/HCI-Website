"use client";

import { useState } from "react";
import {
  canOptimize,
  optimizedSrcSet,
  optimizedUrl,
} from "@/utils/optimizedImage";

const FALLBACK_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// Cards never render wider than ~440 CSS px, so even at 2x DPR nothing above
// 1080w is needed. (Smaller list = fewer srcset candidates, no 1920w downloads.)
const CARD_WIDTHS = [640, 750, 828, 1080];

export default function ProjectCardImage({
  src,
  alt = "",
  width = 800,
  height = 600,
  sizes,
  className = "",
  style,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  // If the optimizer request fails we retry once with the original file
  // before falling back to the blank placeholder (same end result as before).
  const [optimizerFailedFor, setOptimizerFailedFor] = useState(null);

  const hasSrc = typeof src === "string" && src.trim().length > 0;
  const useOptimized =
    hasSrc && canOptimize(src) && optimizerFailedFor !== src;

  const displaySrc = !hasSrc || failedSrc === src
    ? FALLBACK_IMAGE
    : useOptimized
      ? optimizedUrl(src, 750)
      : src;

  const srcSet =
    useOptimized && failedSrc !== src
      ? optimizedSrcSet(src, CARD_WIDTHS)
      : undefined;

  return (
    <img
      src={displaySrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      onError={() => {
        if (!hasSrc) return;
        if (useOptimized) {
          setOptimizerFailedFor(src);
        } else if (failedSrc !== src) {
          setFailedSrc(src);
        }
      }}
    />
  );
}
