import HCILandingPage from "./HCILandingPage";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../components/JsonLd";

const ROUTE = "/creating-dream-space";
const REVALIDATE_SECONDS = 60;

// Use the development API while running locally and the production API after deployment.
const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

const apiUrl = (path) => {
  const baseUrl = (getBaseUrl() || "").replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

async function fetchApiJson(path) {
  if (!getBaseUrl()) {
    // The landing page can still render from its local fallback content when no API URL is configured.
    return null;
  }

  try {
    const response = await fetch(apiUrl(path), {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
  if (response.status !== 404) {
    console.error(`HC Interior API request failed (${response.status}): ${path}`);
  }
  return null;
}

    return await response.json();
  } catch (error) {
    console.error(`HC Interior API request failed: ${path}`, error);
    return null;
  }
}

async function getSeoData() {
  return fetchApiJson(`/seo-tag/route?path=${encodeURIComponent(ROUTE)}`);
}

export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title || "Creating Better Homes | HC Interior";
  const description =
    seo?.meta_description ||
    "Explore personalised interior design, custom interiors, furniture and décor, and kitchen design with HC Interior across Delhi NCR.";
  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: ROUTE,
  });

  // Keep local builds out of search results while the page is being tested.
  // In production, respect the SEO directives configured in the CMS.
  const { index, follow } =
    process.env.NODE_ENV === "development"
      ? { index: false, follow: false }
      : seo
        ? getRobotsDirectives(seo)
        : { index: true, follow: true };

  return {
    title,
    description,
    ...(seo?.keywords ? { keywords: seo.keywords } : {}),
    alternates: { canonical },
    robots: { index, follow },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      type: "website",
      images: seo?.og_image
        ? [{ url: seo.og_image, width: 1200, height: 630 }]
        : [{ url: "/images/new_hc_logo.png" }],
    },
  };
}

export default async function CreatingBestHomesPage() {
  const seo = await getSeoData();

  return (
    <>
      <JsonLd data={seo?.custom_schema} />
      <HCILandingPage />
    </>
  );
}
