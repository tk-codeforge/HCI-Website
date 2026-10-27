"use client";
import { useEffect } from "react";

// The only browser-side logic the How It Works page needs: scroll to #step-N on load.
// Kept as its own tiny client component so the rest of the page can be server-rendered
// and doesn't have to be hydrated.
export default function HashScroll() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }, []);

  return null;
}
