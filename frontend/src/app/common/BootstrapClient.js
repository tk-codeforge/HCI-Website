// "use client";

// import { useEffect } from "react";

// export default function BootstrapClient() {
//   useEffect(() => {
//     const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
//     tooltipTriggerList.forEach((tooltipTriggerEl) => {
//       new window.bootstrap.Tooltip(tooltipTriggerEl);
//     });
//   }, []);

//   return null;
// }



"use client";

import { useEffect } from "react";

// `window.bootstrap` does not exist when Bootstrap is imported as a module (only when it is
// added with a <script> tag), so the old version threw a TypeError. This version imports the
// same bundle AdBoostrap.js loads (shared module, no second copy) and disposes tooltips on
// unmount.
export default function BootstrapClient() {
  useEffect(() => {
    let cancelled = false;
    let tooltips = [];

    import("bootstrap/dist/js/bootstrap.bundle.js")
      .then((mod) => {
        if (cancelled) return;
        const bootstrap = mod.default ?? mod;
        tooltips = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(
          (element) => new bootstrap.Tooltip(element)
        );
      })
      .catch((error) => console.error("Bootstrap tooltips failed to load:", error));

    return () => {
      cancelled = true;
      tooltips.forEach((tooltip) => tooltip.dispose());
    };
  }, []);

  return null;
}