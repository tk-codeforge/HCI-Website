// "use client";
// import { useEffect, useState } from "react";
// import api from "@/utils/api";

// export default function DynamicTypography() {
//   const [fonts, setFonts] = useState({ heading_font: "Poppins", paragraph_font: "Poppins" });

//   useEffect(() => {
//     api.get("/site-settings")
//       .then((res) => {
//         if (res.data && (res.data.heading_font || res.data.paragraph_font)) {
//           setFonts({
//             heading_font: res.data.heading_font || "Poppins",
//             paragraph_font: res.data.paragraph_font || "Poppins",
//           });
//         }
//       })
//       .catch((err) => console.error("Failed to load typography settings", err));
//   }, []);

//   const headingFamily = fonts.heading_font.replace(/ /g, "+");
//   const paragraphFamily = fonts.paragraph_font.replace(/ /g, "+");
//   const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${headingFamily}:wght@400;500;600;700;800&family=${paragraphFamily}:wght@400;500;600;700&display=swap`;

//   return (
//     <>
//       {/* Preconnect to Font APIs to speed up execution hooks */}
//       <link rel="preconnect" href="https://fonts.googleapis.com" />
//       <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//       <link href={googleFontsUrl} rel="stylesheet" />
      
//       <style dangerouslySetInnerHTML={{
//         __html: `
//           :root {
//             --dynamic-heading-font: '${fonts.heading_font}', sans-serif !important;
//             --dynamic-paragraph-font: '${fonts.paragraph_font}', sans-serif !important;
//           }
//         `
//       }} />
//     </>
//   );
// }


const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
const BUNDLED_FONT_VARIABLES = {
  poppins: "var(--font-poppins)",
  outfit: "var(--font-outfit)",
  "great vibes": "var(--font-great-vibes)",
};

const getBundledFontVariable = (font) =>
  BUNDLED_FONT_VARIABLES[String(font || "").trim().toLowerCase()];

const getCssFontFamily = (font) =>
  getBundledFontVariable(font) || `"${String(font || "Poppins").replace(/"/g, "\\\"")}", sans-serif`;

async function getSiteSettings() {
  if (!API_BASE_URL) return {};

  try {
    const res = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}/site-settings`, {
      // Avoid delaying each page request on a CMS settings call.
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`site-settings responded ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to load typography settings", err);
    return {};
  }
}

export default async function DynamicTypography() {
  const settings = await getSiteSettings();
  const headingFont = settings.heading_font || "Poppins";
  const paragraphFont = settings.paragraph_font || "Poppins";

  // Poppins, Outfit and Great Vibes are already bundled by next/font in layout.js.
  // Only keep the external Google Fonts stylesheet if CMS-selected fonts need it.
  const needsGoogleFonts =
    !getBundledFontVariable(headingFont) || !getBundledFontVariable(paragraphFont);

  const headingFamily = headingFont.replace(/ /g, "+");
  const paragraphFamily = paragraphFont.replace(/ /g, "+");
  const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${headingFamily}:wght@400;500;600;700;800&family=${paragraphFamily}:wght@400;500;600;700&display=swap`;

  return (
    <>
      {needsGoogleFonts && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href={googleFontsUrl} rel="stylesheet" />
        </>
      )}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --dynamic-heading-font: ${getCssFontFamily(headingFont)};
              --dynamic-paragraph-font: ${getCssFontFamily(paragraphFont)};
            }
          `,
        }}
      />
    </>
  );
}
