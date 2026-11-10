// const API_BASE_URL =
//   process.env.NODE_ENV === "development"
//     ? process.env.NEXT_PUBLIC_API_DEV_URL
//     : process.env.NEXT_PUBLIC_API_BASE_URL;

// async function getSiteSettings() {
//   if (!API_BASE_URL) {
//     console.error(
//       "DynamicTypography: no API base URL configured (checked API_BASE_URL and NEXT_PUBLIC_API_URL) — using default fonts."
//     );
//     return {};
//   }

//   try {
//     const res = await fetch(`${API_BASE_URL}/site-settings`, {
//       next: { revalidate: 3600, tags: ["site-settings"] },
//     });

//     if (!res.ok) throw new Error(`site-settings responded ${res.status}`);
//     return await res.json();
//   } catch (err) {
//     console.error("Failed to load typography settings", err);
//     return {}; // fall back to defaults below
//   }
// }

// export default async function DynamicTypography() {
//   const settings = await getSiteSettings();

//   const headingFont = settings.heading_font || "Poppins";
//   const paragraphFont = settings.paragraph_font || "Poppins";

//   // Poppins is already self-hosted by next/font in layout.js (--font-poppins),
//   // so do not download it a second time from Google Fonts.
//   const LOCAL_FONT_VARS = { Poppins: "var(--font-poppins)" };
//   const stack = (f) => `${LOCAL_FONT_VARS[f] ?? `'${f}'`}, sans-serif`;

//   const families = [];
//   if (!LOCAL_FONT_VARS[headingFont])
//     families.push(`family=${headingFont.replace(/ /g, "+")}:wght@400;500;600;700;800`);
//   if (!LOCAL_FONT_VARS[paragraphFont] && paragraphFont !== headingFont)
//     families.push(`family=${paragraphFont.replace(/ /g, "+")}:wght@400;500;600;700`);

//   const needsGoogleFonts = families.length > 0;
//   const googleFontsUrl = `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;

//   return (
//     <>
//       {needsGoogleFonts && (
//         <>
//           <link rel="preconnect" href="https://fonts.googleapis.com" />
//           <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//           <link href={googleFontsUrl} rel="stylesheet" />
//         </>
//       )}

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//             :root {
//               --dynamic-heading-font: ${stack(headingFont)};
//               --dynamic-paragraph-font: ${stack(paragraphFont)};
//             }
//           `,
//         }}
//       />
//     </>
//   );
// }



const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

async function getSiteSettings() {
  if (!API_BASE_URL) {
    console.error(
      "DynamicTypography: no API base URL configured (checked API_BASE_URL and NEXT_PUBLIC_API_URL) — using default fonts."
    );
    return {};
  }

  try {
    const res = await fetch(`${API_BASE_URL}/site-settings`, {
      next: { revalidate: 3600, tags: ["site-settings"] },
    });

    if (!res.ok) throw new Error(`site-settings responded ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to load typography settings", err);
    return {}; // fall back to defaults below
  }
}

// Fonts that layout.js already self-hosts with next/font. Choosing one of these in the CMS
// must NEVER trigger a second download from Google Fonts (that request blocked rendering).
// Outfit is a variable font in layout.js, so every weight (400-800) is available locally.
const LOCAL_FONT_VARS = {
  Poppins: "var(--font-poppins)",
  Outfit: "var(--font-outfit)",
  "Great Vibes": "var(--font-great-vibes)",
};

// Any other CMS-selected family still comes from Google Fonts.
// false = original behaviour: the stylesheet is render-blocking, so the font is known at first
//         paint and headings/paragraphs do not visibly change font a moment later (no flicker).
// true  = faster first paint, but text re-flows into the Google font once it arrives (FOUT).
// Prefer choosing Poppins / Outfit / Great Vibes in the CMS (self-hosted, no request at all).
const NON_BLOCKING_GOOGLE_FONTS = false;

// The font names come from the CMS and end up inside CSS and a URL: accept plain family
// names only, otherwise use the default.
const SAFE_FONT_NAME = /^[A-Za-z0-9][A-Za-z0-9 -]{0,39}$/;
const pickFont = (value, fallback) =>
  typeof value === "string" && SAFE_FONT_NAME.test(value.trim()) ? value.trim() : fallback;

export default async function DynamicTypography() {
  const settings = await getSiteSettings();

  const headingFont = pickFont(settings.heading_font, "Poppins");
  const paragraphFont = pickFont(settings.paragraph_font, "Poppins");

  const stack = (f) => `${LOCAL_FONT_VARS[f] ?? `'${f}'`}, sans-serif`;

  const families = [];
  if (!LOCAL_FONT_VARS[headingFont])
    families.push(`family=${headingFont.replace(/ /g, "+")}:wght@400;500;600;700;800`);
  if (!LOCAL_FONT_VARS[paragraphFont] && paragraphFont !== headingFont)
    families.push(`family=${paragraphFont.replace(/ /g, "+")}:wght@400;500;600;700`);

  const needsGoogleFonts = families.length > 0;
  const googleFontsUrl = `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;

  return (
    <>
      {needsGoogleFonts && (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          {NON_BLOCKING_GOOGLE_FONTS ? (
            <>
              <link
                rel="stylesheet"
                href={googleFontsUrl}
                media="print"
                data-font-swap=""
                suppressHydrationWarning
              />
              <script
                dangerouslySetInnerHTML={{
                  __html:
                    "(function(){var l=document.querySelector('link[data-font-swap]');if(!l)return;" +
                    "var s=function(){l.media='all'};if(l.sheet)s();else l.addEventListener('load',s);})();",
                }}
              />
              <noscript>
                <link rel="stylesheet" href={googleFontsUrl} />
              </noscript>
            </>
          ) : (
            <link href={googleFontsUrl} rel="stylesheet" />
          )}
        </>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --dynamic-heading-font: ${stack(headingFont)};
              --dynamic-paragraph-font: ${stack(paragraphFont)};
            }
          `,
        }}
      />
    </>
  );
}
