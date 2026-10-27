import BackgroundImageWithHeading from "../components/BackgroundImageWithHeading";
import MainLayout from "../layouts/MainLayout";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../components/JsonLd";

// --- CONFIGURATION ---
export const revalidate = 60; // Regenerate page every 60 seconds

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- HELPER: Fetch Terms Content ---
async function getTermsContent() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/term_and_condition`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch terms content: ${res.status}`);
      return "";
    }

    const data = await res.json();
    return data?.json_content?.html || "";
  } catch (err) {
    console.error("Terms Content Fetch Error:", err);
    return "";
  }
}

// --- HELPER: Fetch SEO Data ---
async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/term-and-condition")}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

// --- HELPER: Fetch Banner Data ---
async function getBannerData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/cms-gallery-design/manage-banner?key=terms_and_condition`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Banner Fetch Error:", err);
    return null;
  }
}

// --- DYNAMIC METADATA GENERATION ---
export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title || "Terms & Conditions - High Creation Interior";
  const description =
    seo?.meta_description ||
    "Read our terms & conditions (customer's do's & don't) including Terms of Use, Livspace Quality Promise, Cancellation Policy, Return, Exchange & Refunds Policy.";

  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/term-and-condition",
  });
  const { index, follow } = seo
    ? getRobotsDirectives(seo)
    : { index: true, follow: true };

  return {
    title,
    description,
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

// --- MAIN SERVER COMPONENT ---
export default async function Terms() {
  // Independent fetches run together instead of one after another.
  const [seo, pageData, bannerRecord] = await Promise.all([
    getSeoData(),
    getTermsContent(),
    getBannerData(),
  ]);

  const bgHeading = bannerRecord?.banner_heading || "Terms & Condition";
  const bgDescription =
    bannerRecord?.banner_description || "Get all the information you need";

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <main>
        <BackgroundImageWithHeading
          sectionBgImages={"contact_wrapper terms_and_condition"}
          sectionBgHeading={bgHeading}
          secBgHeadingClass="sec_bgheading_lass force-white-heading"
          sectionBgDescription={bgDescription}
          secBgDesClass={"text-center bg-transparent text-white"}
          bgImageUrl={bannerRecord?.banner_image}
          bgImageAlt={bannerRecord?.banner_alt}
          headingTag={bannerRecord?.banner_heading_tag || "h1"}
          descriptionFontSize={bannerRecord?.banner_description_font_size || 16}
          sectionBgHeadingStyle={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
          sectionBgDescriptionStyle={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
        />

        <section className="privacy my-5">
          <div className="container">
            <div className="row mx-0">
              {/* Render HTML content from CMS */}
              <div dangerouslySetInnerHTML={{ __html: pageData }} />
            </div>
          </div>
        </section>
        <hr />
      </main>
    </MainLayout>
  );
}
