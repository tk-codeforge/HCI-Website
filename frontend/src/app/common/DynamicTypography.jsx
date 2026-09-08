// src/app/common/DynamicTypography.jsx
"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

export default function DynamicTypography() {
  const [fonts, setFonts] = useState({ heading_font: "Poppins", paragraph_font: "Poppins" });

  useEffect(() => {
    api.get("/site-settings")
      .then((res) => {
        if (res.data && (res.data.heading_font || res.data.paragraph_font)) {
          setFonts({
            heading_font: res.data.heading_font || "Poppins",
            paragraph_font: res.data.paragraph_font || "Poppins",
          });
        }
      })
      .catch((err) => console.error("Failed to load typography settings", err));
  }, []);

  const headingFamily = fonts.heading_font.replace(/ /g, "+");
  const paragraphFamily = fonts.paragraph_font.replace(/ /g, "+");
  const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${headingFamily}:wght@400;500;600;700;800&family=${paragraphFamily}:wght@400;500;600;700&display=swap`;

  return (
    <>
      {/* Preconnect to Font APIs to speed up execution hooks */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={googleFontsUrl} rel="stylesheet" />
      
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --dynamic-heading-font: '${fonts.heading_font}', sans-serif !important;
            --dynamic-paragraph-font: '${fonts.paragraph_font}', sans-serif !important;
          }
        `
      }} />
    </>
  );
}