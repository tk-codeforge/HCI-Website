"use client";

import { useEffect } from "react";

/**
 * Client island.
 *
 * The parent page (how-its-works/page.jsx) is now a Server Component, so the
 * step sections (id="step-1", "step-2", ...) already exist in the HTML that
 * comes back from the server — there is no CMS fetch happening in the
 * browser anymore, so there is nothing to "wait for" here.
 *
 * All this island does is: on mount, if the URL has a #hash, smooth-scroll
 * to that element. That's inherently a browser-only concern (window,
 * document), so it's the one piece that has to stay a client component.
 * Everything else in the page can be plain server-rendered HTML.
 */
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
