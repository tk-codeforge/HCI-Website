import HCLandingClient from "./HCLandingClient";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";

const ROUTE = "/creating-the-home-of-your-dreams"; // ← the real path of this page

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

async function getSeoData() {
  try {
    const res = await fetch(
      `${getBaseUrl()}/seo-tag/route?path=${encodeURIComponent(ROUTE)}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title || "Creating the home of your dreams. - High Creation Interior";
  const description = seo?.meta_description || "High Creation Interior offers the best interior design services in Delhi NCR. Transform your space with our expert designers."

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: ROUTE,
  });
  const { index, follow } = seo
    ? getRobotsDirectives(seo)
    : { index: true, follow: true };

  return {
    title,
    ...(description && { description }),
    ...(seo?.keywords && { keywords: seo.keywords }),
    alternates: { canonical },
    robots: { index, follow },
    openGraph: {
      title,
      ...(description && { description }),
      url: canonical,
      type: "website",
      ...(seo?.og_image && {
        images: [{ url: seo.og_image, width: 1200, height: 630 }],
      }),
    },
  };
}

export default function Page() {
  return <HCLandingClient />;
}