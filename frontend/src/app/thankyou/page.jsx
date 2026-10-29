import ThankYouClient from "../thank-you/ThankYouClient";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";

export const revalidate = 60;

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    if (!baseURL) return null;
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/thankyou")}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const seo = await getSeoData();
  const title = seo?.meta_title || "Thank You - High Creation Interior";
  const description = seo?.meta_description || "Thank you for contacting High Creation Interior.";
  const canonical = getCanonicalUrl({ canonicalUrl: seo?.canonical_url, fallbackPath: "/thankyou" });
  const { index, follow } = seo
    ? getRobotsDirectives(seo)
    : { index: true, follow: true };

  return {
    title,
    description,
    alternates: { canonical },
    robots: { index, follow },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: canonical,
      type: "website",
      images: seo?.og_image ? [{ url: seo.og_image, width: 1200, height: 630 }] : [{ url: "/images/new_hc_logo.png" }],
    },
  };
}

async function getThankYouCms() {
  try {
    const baseURL = getBaseUrl();
    if (!baseURL) return null;
    const res = await fetch(`${baseURL}/cms-content/redirect_thank_you`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const raw = await res.json();
    const record = Array.isArray(raw) ? raw[0] : raw;
    let data = record?.json_content || null;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch { data = null; }
    }
    return { cms: data && typeof data === "object" ? data : null };
  } catch {
    return null;
  }
}

export default async function ThankyouPage() {
  const initialData = await getThankYouCms();
  return <ThankYouClient initialData={initialData} />;
}
