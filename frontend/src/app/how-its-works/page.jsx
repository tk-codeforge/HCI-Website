import React from "react";
import MainLayout from "../layouts/MainLayout";
import HowItsWorksClient from "./HowItsWorksClient";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";

export const revalidate = 60;

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

const stepsData = [
  {
    id: "step-1",
    stepNumber: "01",
    title: "Consultation & Requirement Gathering",
    img: "/images/how-it-work/1.png",
    points: [
      "Your comfort is our priority. We offer online consultations, offline discussions, or in-person meetings.",
      "Choose the mode that suits your comfort and schedule.",
      "Our team ensures a smooth and personalized experience at every step.",
      "We understand your needs and bring your vision to life.",
      "Get the first design cut of your dream interior to visualize your space better.",
    ],
    align: "left",
  },
  {
    id: "step-2",
    stepNumber: "02",
    title: "Site Visit & Measurement",
    img: "/images/how-it-work/2.png",
    points: [
      "Our team conducts a site visit to understand the space and layout.",
      "Accurate measurements are taken to ensure a perfect fit for your design.",
      "This step helps us plan every detail with precision and efficiency.",
      "It also allows us to identify any on-site challenges in advance.",
      "A well-measured space is the foundation of flawless interior execution.",
    ],
    align: "right",
  },
  {
    id: "step-3",
    stepNumber: "03",
    title: "Design Presentation & Finalization",
    img: "/images/how-it-work/3.png",
    points: [
      "We begin by presenting carefully curated design concepts tailored to your preferences.",
      "Detailed layouts, 3D visuals, and material selections are shared for better clarity.",
      "Your feedback is taken into consideration to refine and finalize the design.",
      "Every element is discussed thoroughly to ensure it aligns with your vision.",
      "Final approval is taken before moving ahead with execution.",
    ],
    align: "left",
  },
  {
    id: "step-4",
    stepNumber: "04",
    title: "Quotation & Agreement",
    img: "/images/how-it-work/10.png",
    points: [
      "A detailed quotation will be provided outlining all costs and services.",
      "It ensures complete transparency in pricing with no hidden charges.",
      "Once the quotation is approved, an agreement will be shared for mutual clarity.",
      "The agreement will cover scope of work, timelines, payment terms, and warranties.",
      "This helps ensure smooth execution and builds trust throughout the project.",
    ],
    align: "right",
  },
  {
    id: "step-5",
    stepNumber: "05",
    title: "Execution & Handover",
    img: "/images/how-it-work/5.png",
    points: [
      "Our expert team ensures smooth and timely project execution as per the approved design.",
      "Quality checks are conducted at every stage to maintain high standards.",
      "Regular updates are shared to keep you informed throughout the process.",
      "Final inspection is done to ensure everything is perfect before handover.",
      "Your dream space is handed over, ready for you to move in and enjoy.",
    ],
    align: "left",
  },
];

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/how-its-works")}`,
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
    seo?.meta_title || "High Creation Interior | Best Interior Designers in Delhi NCR";
  const description =
    seo?.meta_description ||
    "High Creation Interior offers the best interior design services in Delhi NCR. Transform your space with our expert designers.";

  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/how-its-works",
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

const hasHtml = (s) => /<[a-z][\s\S]*>/i.test(s || "");

// isomorphic-dompurify pulls in jsdom on the server, which is slow to load. It is only
// needed when a step has rich-text (HTML) content, so it is imported on first use
// instead of at module load. Sanitising itself is unchanged.
let purifyPromise;
const getPurify = () =>
  (purifyPromise ??= import("isomorphic-dompurify").then((m) => m.default));

// Same sanitising as before. Images without an alt attribute get alt="" so they are
// never "missing alt".
async function prepareStep(step) {
  if (!step || !hasHtml(step.description)) return step;
  const DOMPurify = await getPurify();
  const cleaned = DOMPurify.sanitize(
    step.description.replace(/(<img[^>]*alt="Tick icon"[^>]*>)(\s|&nbsp;)+/gi, "$1")
  ).replace(/<img\b(?![^>]*\balt=)/gi, '<img alt=""');
  return { ...step, descriptionHtml: cleaned };
}

function parseSchema(raw) {
  if (!raw) return null;
  try {
    const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
    return JSON.stringify(obj).replace(/</g, "\\u003c");
  } catch (e) {
    console.error("Invalid schema JSON:", e);
    return null;
  }
}

async function getCmsData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cms-content/how_it_works`, {
      // CMS edits show within 60s. For instant updates use cache: 'no-store' here.
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to load CMS data on server:", error);
    return null;
  }
}

export default async function HowItsWorkPage() {
  // CMS content and SEO data are independent, so fetch them together.
  const [cmsResponse, seo] = await Promise.all([getCmsData(), getSeoData()]);
  const content = cmsResponse?.json_content || {};
  const schemaJson = parseSchema(seo?.custom_schema);

  const displaySteps = await Promise.all(
    (Array.isArray(content.steps) && content.steps.length > 0
      ? content.steps
      : stepsData
    ).map(prepareStep)
  );

  const bannerData = {
    heading: content.bannerHeading || "We make home interiors a breeze!",
    headingColor: content.bannerHeadingColor || "#ffffff",
    description: content.bannerDescription || "",
    descriptionColor: content.bannerDescriptionColor || "#ffffff",
    headingTag: content.bannerHeadingTag || "h1",
    descriptionSize: Number(content.bannerDescriptionSize) || 20,
    image: content.bg_image || "contact_wrapper services",
    imageAlt: content.bg_image_alt || "",
  };

  return (
    <MainLayout>
      {schemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaJson }}
        />
      )}
      <HowItsWorksClient displaySteps={displaySteps} bannerData={bannerData} />
    </MainLayout>
  );
}
