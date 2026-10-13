import HCLandingClient from "./HCLandingClient";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../components/JsonLd";

const ROUTE = "/creating-the-home-of-your-dreams";
const REVALIDATE_SECONDS = 60;

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

const apiUrl = (path) => `${(getBaseUrl() || "").replace(/\/+$/, "")}${path}`;

async function fetchApiJson(path) {
  if (!getBaseUrl()) return null;

  try {
    const res = await fetch(apiUrl(path), {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      console.error(`CMS request failed (${res.status}): ${path}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`CMS request failed: ${path}`, err);
    return null;
  }
}

async function getSeoData() {
  return fetchApiJson(`/seo-tag/route?path=${encodeURIComponent(ROUTE)}`);
}

async function getPageData() {
  // Fetch page sections in parallel and cache them. This puts the hero image/text
  // in the initial HTML instead of waiting for client-side hydration + API calls.
  const [section1, section2, section3, section4, section6, faqs, designerChoice] =
    await Promise.all([
      fetchApiJson("/cms-content/creating_the_home_of_your_dreams"),
      fetchApiJson("/cms-content/creating_the_home_of_your_dreams_2"),
      fetchApiJson("/cms-content/creating_the_home_of_your_dreams_3"),
      fetchApiJson("/cms-content/creating_the_home_of_your_dreams_4"),
      // Section 5 was fetched in the client but is never rendered by this page.
      fetchApiJson("/cms-content/creating_the_home_of_your_dreams_6"),
      fetchApiJson("/cms-content/faqs"),
      fetchApiJson("/cms-parent-child/designer_choice"),
    ]);

  return {
    data1: section1?.json_content ?? null,
    data2: section2?.json_content ?? null,
    data3: section3?.json_content ?? null,
    data4: section4?.json_content ?? null,
    data6: section6?.json_content ?? null,
    faqData: Array.isArray(faqs) ? faqs : [],
    faqError: faqs === null,
    designIdea: Array.isArray(designerChoice) ? designerChoice : [],
  };
}

export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title || "Creating the home of your dreams. - High Creation Interior";
  const description =
    seo?.meta_description ||
    "High Creation Interior offers the best interior design services in Delhi NCR. Transform your space with our expert designers.";
  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

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

export default async function Page() {
  const [seo, initialData] = await Promise.all([getSeoData(), getPageData()]);

  return (
    <>
      <JsonLd data={seo?.custom_schema} />
      <HCLandingClient initialData={initialData} />
    </>
  );
}
