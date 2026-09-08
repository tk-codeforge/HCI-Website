import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";

export async function getPageSEO(pageUrlIdentifier) {
    try {
      const baseURL = process.env.NODE_ENV === "development" 
        ? process.env.NEXT_PUBLIC_API_DEV_URL 
        : process.env.NEXT_PUBLIC_API_BASE_URL;
  
      const pathQuery = pageUrlIdentifier.startsWith('/') ? pageUrlIdentifier : `/${pageUrlIdentifier}`;

      const res = await fetch(`${baseURL}/seo-tag/route?path=${encodeURIComponent(pathQuery)}`, { 
        cache: "no-store" 
      });
  
      if (res.ok) {
        const pageSeo = await res.json();
        
        if (pageSeo && pageSeo.id) {
          const { index, follow } = getRobotsDirectives(pageSeo);
          
          const metaTitle = pageSeo.meta_title || pageSeo.title || "";
          const metaDescription = pageSeo.meta_description || "";
          const canonicalTag = pageSeo.canonical_url || pageSeo.meta_can_tag || "";
          const keywords = pageSeo.keywords || pageSeo.meta_keywords || "";
  
          let cleanCanonical = getCanonicalUrl({
            metaCanonicalTag: canonicalTag,
            fallbackPath: pageUrlIdentifier,
          });
  
          return {
            title: metaTitle,
            description: metaDescription,
            keywords: keywords,
            alternates: { canonical: cleanCanonical },
            robots: { 
                index, 
                follow,
                googleBot: { index, follow, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } 
            },
            openGraph: {
              title: metaTitle,
              description: metaDescription,
              url: cleanCanonical,
              siteName: "High Creation Interior",
              images: pageSeo.og_image ? [{ url: pageSeo.og_image, width: 1200, height: 630 }] : [],
              locale: "en_IN",
              type: "website",
            },
            // 🌟 ADDED FOR 90+ SCORE: Twitter Cards
            twitter: {
              card: "summary_large_image",
              title: metaTitle,
              description: metaDescription,
              images: pageSeo.og_image ? [pageSeo.og_image] : [],
            },
            customSchema: pageSeo.custom_schema || null,
          };
        }
      }
    } catch (err) {
      console.error(`SEO Fetch Error for ${pageUrlIdentifier}:`, err);
    }
  
    return null; 
}