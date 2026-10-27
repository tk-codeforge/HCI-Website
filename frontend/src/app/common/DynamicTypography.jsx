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

export default async function DynamicTypography() {
  const settings = await getSiteSettings();

  const headingFont = settings.heading_font || "Poppins";
  const paragraphFont = settings.paragraph_font || "Poppins";

  // Poppins is already self-hosted by next/font in layout.js (--font-poppins),
  // so do not download it a second time from Google Fonts.
  const LOCAL_FONT_VARS = { Poppins: "var(--font-poppins)" };
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
          <link href={googleFontsUrl} rel="stylesheet" />
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
