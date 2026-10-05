"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

let cache = null;
let pending = null;
const loadAltMap = () =>
  cache
    ? Promise.resolve(cache)
    : (pending ||= api
        .get("/cms-parent-child/media-library/alt-map")
        .then((r) => (cache = r.data || {}))
        .catch(() => (cache = {})));

// const useMediaAlt = (src, fallback = "") => {
  export const useMediaAlt = (src, fallback = "") => {
  const [map, setMap] = useState(cache || {});
  useEffect(() => { loadAltMap().then(setMap); }, []);
  const name = src ? decodeURIComponent(src.split("?")[0].split("/").pop()) : "";
  return map[name] || fallback;
};

// Replaces <img>
export const MediaImg = ({ src, fallbackAlt = "", ...props }) => {
  const alt = useMediaAlt(src, fallbackAlt);
  return <img src={src} alt={alt} decoding="async" loading="lazy" {...props} />;
};

// Replaces <div style={{ backgroundImage }}> banners
export const MediaBg = ({ src, fallbackAlt = "", style, className, children }) => {
  const alt = useMediaAlt(src, fallbackAlt);
  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <img
        src={src}
        alt={alt}
        decoding="async"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{ position: "relative", width: "100%" }}>{children}</div>
    </div>
  );
};