import MainLayout from "../layouts/MainLayout";
import WhatWeOfferClient from "./WhatWeOfferClient";
import ScrollToHash from "../components/ScrollToHash";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../components/JsonLd";

export const revalidate = 60;

const interiorDesignPlanningImg = "/images/what_we_offer/interior-design-planning.avif";
const customInteriorDesignImg = "/images/what_we_offer/custom-interior-design.avif";
const furnitureDecorImg = "/images/what_we_offer/furniture-decor.avif";
const kitchenInteriorDesignImg = "/images/what_we_offer/kitchen-interior-design.avif";

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL || "http://localhost:3000/api"
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
};

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/what-we-offer")}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

async function getWhatWeOfferContent() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/redirect_what_we_offer`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const record = Array.isArray(data) ? data[0] : data;
    return record?.json_content || null;
  } catch (err) {
    console.error("What We Offer Content Fetch Error:", err);
    return null;
  }
}

export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title || "What We Offer - High Creation Interior";
  const description =
    seo?.meta_description ||
   "Explore the comprehensive interior design services offered by High Creation Interior.";

   const ogTitle = seo?.og_title || title;
const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/what-we-offer",
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

const FALLBACK_IMAGES = [
  interiorDesignPlanningImg,
  customInteriorDesignImg,
  furnitureDecorImg,
  kitchenInteriorDesignImg,
];

const FALLBACK_OFFERINGS = [
  {
    title: "Interior Design & Planning",
    points: [
      "We listen to your ideas and understand how you want your home to feel.",
      "We create a clear design plan before work begins, so everything stays organized.",
      "Our team helps you choose the right layouts, materials, and finishes with confidence.",
      "The result is a home that looks beautiful and works perfectly for your everyday life.",
    ],
  },
  {
    title: "Custom Interior Design",
    points: [
      "Your home is designed around your personality, not a fixed template.",
      "Every colour, texture, and detail is selected to match your preferences.",
      "We make sure every room reflects the way you live and use the space.",
      "Our designers balance creativity with practical solutions for daily living.",
      "Every design is made exclusively for you, giving your home a unique identity.",
    ],
  },
  {
    title: "Furniture & Decor",
    points: [
      "We help you select furniture that fits your home without making it feel crowded.",
      "Every decor element is chosen to complement your home's overall design.",
      "We focus on creating a space that feels warm, welcoming, and complete.",
      "From lighting to accessories, every detail is carefully coordinated.",
      "Our selections add personality to your home while keeping it functional and elegant.",
    ],
  },
  {
    title: "Kitchen Interior Design",
    points: [
      "We design kitchens that make cooking and daily tasks easier.",
      "Smart storage solutions help keep your kitchen neat and organized.",
      "Every layout is planned for smooth movement and maximum convenience.",
      "We use durable materials that are easy to maintain and built to last.",
      "Your kitchen is designed to bring together style, comfort, and everyday practicality.",
    ],
  },
];

export default async function WhatWeOffer() {
  // SEO and CMS content are independent: fetch them together.
  const [seo, rawCmsContent] = await Promise.all([
    getSeoData(),
    getWhatWeOfferContent(),
  ]);

  let cmsContent = {};
  if (typeof rawCmsContent === "string") {
    try {
      cmsContent = JSON.parse(rawCmsContent);
    } catch (e) {
      cmsContent = {};
    }
  } else if (rawCmsContent) {
    cmsContent = rawCmsContent;
  }

  const bannerData = {
    heading: cmsContent?.bannerHeading || "What We Offer",
    headingColor: cmsContent?.bannerHeadingColor || "#ffffff",
    description: cmsContent?.bannerDescription || "We provide bespoke interior design solutions tailored to your vision.",
    descriptionColor: cmsContent?.bannerDescriptionColor || "#ffffff",
    headingTag: cmsContent?.bannerHeadingTag || undefined,
descriptionSize: Number(cmsContent?.bannerDescriptionSize) || 20,
    bgImage: cmsContent?.bg_image || "",
    bgImageAlt: cmsContent?.bg_image_alt || "",
  };

  const cmsSections = Array.isArray(cmsContent?.sections) ? cmsContent.sections : [];

  const OFFERINGS = cmsSections.length > 0
      ? cmsSections.map((section, index) => {
          const fallback = FALLBACK_OFFERINGS[index];
          const points = Array.isArray(section.points)
            ? section.points.filter(Boolean)
            : [];

          return {
            id: `section-${index + 1}`,
            title: section.heading || fallback?.title || `Offering ${index + 1}`,
            img: section.image || FALLBACK_IMAGES[index] || interiorDesignPlanningImg,
            imgAlt: section.image_alt || "",
            imageSize: section.imageSize || 100,
            headingTag: section.headingTag || "h2",
description: section.description || "",
            points: points.length ? points : fallback?.points || [],
          };
        })
      : FALLBACK_OFFERINGS.map((offer, index) => ({
          id: `section-${index + 1}`,
          title: offer.title,
          img: FALLBACK_IMAGES[index],
          imgAlt: "",
          imageSize: 100,
          headingTag: "h2",
description: "",
          points: offer.points,
        }));

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <ScrollToHash />
      <WhatWeOfferClient OFFERINGS={OFFERINGS} bannerData={bannerData} />
    </MainLayout>
  );
}
