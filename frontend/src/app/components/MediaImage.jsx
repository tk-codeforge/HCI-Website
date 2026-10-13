// "use client";
// import { useEffect, useState } from "react";
// import api from "@/utils/api";

// let cache = null;
// let pending = null;
// const loadAltMap = () =>
//   cache
//     ? Promise.resolve(cache)
//     : (pending ||= api
//         .get("/cms-parent-child/media-library/alt-map")
//         .then((r) => (cache = r.data || {}))
//         .catch(() => (cache = {})));

// // const useMediaAlt = (src, fallback = "") => {
//   export const useMediaAlt = (src, fallback = "") => {
//   const [map, setMap] = useState(cache || {});
//   useEffect(() => { loadAltMap().then(setMap); }, []);
//   const name = src ? decodeURIComponent(src.split("?")[0].split("/").pop()) : "";
//   return map[name] || fallback;
// };

// // Replaces <img>
// // export const MediaImg = ({ src, fallbackAlt = "", ...props }) => {
// //   const alt = useMediaAlt(src, fallbackAlt);
// //   return <img src={src} alt={alt} decoding="async" loading="lazy" {...props} />;
// // };

// export const MediaImg = ({ src, alt: altOverride, fallbackAlt = "", ...props }) => {
//   const mapAlt = useMediaAlt(src, fallbackAlt);
//   return <img src={src} {...props} alt={altOverride || mapAlt} decoding="async" loading="lazy" />;
// };

// // Replaces <div style={{ backgroundImage }}> banners
// // export const MediaBg = ({ src, fallbackAlt = "", style, className, children }) => {
// //   const alt = useMediaAlt(src, fallbackAlt);

// export const MediaBg = ({ src, alt: altOverride, fallbackAlt = "", style, className, children }) => {
//   const mapAlt = useMediaAlt(src, fallbackAlt);
//   const alt = altOverride || mapAlt;
//   return (
//     <div className={className} style={{ position: "relative", ...style }}>
//       <img
//         src={src}
//         alt={alt}
//         decoding="async"
//         style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
//       />
//       <div style={{ position: "relative", width: "100%" }}>{children}</div>
//     </div>
//   );
// };


// "use client";

// import { useEffect, useState } from "react";
// import api from "@/utils/api";

// let cache = null;
// let pending = null;

// const loadAltMap = () => {
//   if (cache !== null) return Promise.resolve(cache);

//   if (!pending) {
//     pending = api
//       .get("/cms-parent-child/media-library/alt-map")
//       .then((response) => {
//         cache = response?.data && typeof response.data === "object" ? response.data : {};
//         return cache;
//       })
//       .catch(() => {
//         cache = {};
//         return cache;
//       })
//       .finally(() => {
//         pending = null;
//       });
//   }

//   return pending;
// };

// export const useMediaAlt = (src, fallback = "", enabled = true) => {
//   const [map, setMap] = useState(() => cache || {});

//   useEffect(() => {
//     if (!enabled || cache !== null) return undefined;

//     let active = true;
//     loadAltMap().then((nextMap) => {
//       if (active) setMap((previous) => (previous === nextMap ? previous : nextMap));
//     });

//     return () => {
//       active = false;
//     };
//   }, [enabled]);

//   let fileName = "";
//   if (typeof src === "string" && src) {
//     const cleanSrc = src.split("?")[0].split("#")[0];
//     const encodedName = cleanSrc.split("/").pop() || "";
//     try {
//       fileName = decodeURIComponent(encodedName);
//     } catch {
//       fileName = encodedName;
//     }
//   }

//   if (!enabled) return fallback;
//   return map[fileName] || fallback;
// };

// // Respects explicit loading/fetch-priority props (the previous implementation
// // always overwrote loading="eager" with loading="lazy").
// export const MediaImg = ({
//   src,
//   alt: altOverride,
//   fallbackAlt = "",
//   loading = "lazy",
//   decoding = "async",
//   fetchPriority,
//   ...props
// }) => {
//   const mapAlt = useMediaAlt(src, fallbackAlt, !altOverride);

//   return (
//     <img
//       src={src}
//       {...props}
//       alt={altOverride || mapAlt}
//       decoding={decoding}
//       loading={loading}
//       fetchPriority={fetchPriority}
//     />
//   );
// };

// // Replaces a background-image banner while preserving meaningful alt text.
// export const MediaBg = ({
//   src,
//   alt: altOverride,
//   fallbackAlt = "",
//   style,
//   className,
//   children,
//   width,
//   height,
//   loading = "lazy",
//   decoding = "async",
//   fetchPriority,
// }) => {
//   const mapAlt = useMediaAlt(src, fallbackAlt, !altOverride);
//   const alt = altOverride || mapAlt;

//   return (
//     <div className={className} style={{ position: "relative", ...style }}>
//       <img
//         src={src}
//         alt={alt}
//         width={width}
//         height={height}
//         loading={loading}
//         decoding={decoding}
//         fetchPriority={fetchPriority}
//         style={{
//           position: "absolute",
//           inset: 0,
//           width: "100%",
//           height: "100%",
//           objectFit: "cover",
//         }}
//       />
//       <div style={{ position: "relative", width: "100%" }}>{children}</div>
//     </div>
//   );
// };



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
        .then((response) => (cache = response.data || {}))
        .catch(() => (cache = {})));

/** Load the Media Library alt-text map once per mounted component. */
export const useMediaAltMap = () => {
  const [map, setMap] = useState(cache || {});

  useEffect(() => {
    let mounted = true;
    loadAltMap().then((loadedMap) => {
      if (mounted) setMap(loadedMap);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return map;
};

export const useMediaAlt = (src, fallback = "") => {
  const map = useMediaAltMap();
  const filename = src ? String(src).split("?")[0].split("/").pop() : "";
  let decodedFilename = filename;
  try {
    decodedFilename = decodeURIComponent(filename);
  } catch {
    // Keep the original filename if a URL contains malformed percent encoding.
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
  const mapAlt = useMediaAlt(src, fallbackAlt);
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
}) => {
  const mapAlt = useMediaAlt(src, fallbackAlt);
  const alt = altOverride || mapAlt;

  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <img
        src={src}
        alt={alt}
        width={1900}
        height={441}
        decoding="async"
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
