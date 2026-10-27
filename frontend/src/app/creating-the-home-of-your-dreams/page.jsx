import HCLandingClient from "./HCLandingClient";
import Footer from "../layouts/footer";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../components/JsonLd";

const ROUTE = "/creating-the-home-of-your-dreams"; // ← the real path of this page


export const revalidate = 60;

const CMS_FETCH_OPTIONS = {
  next: { revalidate: 60, tags: ["creating-home-of-your-dreams"] },
};

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

/* -------------------------------------------------------------------------- */
/*  CMS content for the page body (previously fetched in the browser)         */
/* -------------------------------------------------------------------------- */

async function fetchJson(path) {
  try {
    const res = await fetch(`${getBaseUrl()}${path}`, CMS_FETCH_OPTIONS);
    if (!res.ok) {
      console.error(`CMS fetch ${path} -> ${res.status} (base: ${getBaseUrl()})`);
      return null;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error(`CMS fetch failed for ${path}:`, err);
    return null;
  }
}

// Same shape the client used: response.data.json_content
const toContent = (raw) => {
  const record = Array.isArray(raw) ? raw[0] : raw;
  let content = record?.json_content;
  if (typeof content === "string") {
    try {
      content = JSON.parse(content);
    } catch {
      content = null;
    }
  }
  return content && typeof content === "object" ? content : null;
};

// The page only ever shows the 5 oldest "designer choice" records
// (sorted newest-first, then slice(-5)). Do that here and send only the
// fields the cards use, so we don't ship the whole list in the HTML.
const toDesignCards = (list) =>
  Array.isArray(list)
    ? [...list]
        .sort((a, b) => b.id - a.id)
        .slice(-5)
        .map((r) => ({
          id: r.id,
          child_content: {
            image: r?.child_content?.image,
            title: r?.child_content?.title,
            image_alt: r?.child_content?.image_alt,
            description: r?.child_content?.description,
          },
        }))
    : null;

async function getLandingData() {
  const [c1, c2, c3, c4, c6, faqs, designIdea] = await Promise.all([
    fetchJson("/cms-content/creating_the_home_of_your_dreams"),
    fetchJson("/cms-content/creating_the_home_of_your_dreams_2"),
    fetchJson("/cms-content/creating_the_home_of_your_dreams_3"),
    fetchJson("/cms-content/creating_the_home_of_your_dreams_4"),
    fetchJson("/cms-content/creating_the_home_of_your_dreams_6"),
    fetchJson("/cms-content/faqs"),
    fetchJson("/cms-parent-child/designer_choice"),
  ]);

  // Anything that comes back null makes the client fall back to its own
  // fetch, so a temporary API hiccup never leaves a section empty.
  return {
    data1: toContent(c1),
    data2: toContent(c2),
    data3: toContent(c3),
    data4: toContent(c4),
    data6: toContent(c6),
    faqs: Array.isArray(faqs) ? faqs : null,
    designIdea: toDesignCards(designIdea),
  };
}

export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title || "Creating the home of your dreams. - High Creation Interior";
  const description = seo?.meta_description || "High Creation Interior offers the best interior design services in Delhi NCR. Transform your space with our expert designers."

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
  const [seo, landingData] = await Promise.all([getSeoData(), getLandingData()]);
  return (
    <>
      <JsonLd data={seo?.custom_schema} />
      <HCLandingClient initialData={landingData} />
      <Footer />
    </>
  );
}
