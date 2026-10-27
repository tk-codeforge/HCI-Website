"use client";

import { useEffect } from "react";

export default function ScrollToHash() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.location.hash.replace("#", "");
    if (!id) return;

    // Content is already in the DOM on first paint (SSR), so we don't need
    // to key this off any data-loaded state — just wait a frame so layout
    // has settled, then scroll.
    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    });
  }, []);

  return null;
}
