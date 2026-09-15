import MainLayout from "@/app/layouts/MainLayout";
import BackgroundImageWithHeading from "../components/BackgroundImageWithHeading";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

const getSiteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "https://hcinterior.in";

const isPublished = (page) => {
  if (!page) return false;
  const status = String(page.status ?? "").trim().toLowerCase();
  return status === "published";
};

async function getWarrantyPage() {
  try {
    const baseUrl = getBaseUrl();
    if (!baseUrl) return null;

    const response = await fetch(`${baseUrl}/cms-basic-pages/slug/warranty`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Warranty page fetch error:", error);
    return null;
  }
}

async function getWarrantyBanner() {
  try {
    const baseUrl = getBaseUrl();
    if (!baseUrl) return null;

    const response = await fetch(
      `${baseUrl}/cms-gallery-design/manage-banner?key=warranty`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Warranty banner fetch error:", error);
    return null;
  }
}

export async function generateMetadata() {
  const page = await getWarrantyPage();

  if (!page || !isPublished(page)) {
    return {
      title: "Warranty | High Creation Interior",
      description: "Warranty information and coverage from High Creation Interior.",
      robots: { index: false, follow: true },
    };
  }

  const seo = page.seo_content || {};

  return {
    title: seo.meta_title || page.title || "Warranty | High Creation Interior",
    description:
      seo.meta_description ||
      "Warranty information and coverage from High Creation Interior.",
    keywords: seo.meta_keywords || undefined,
    alternates: {
      canonical: seo.canonical_url || `${getSiteUrl()}/warranty`,
    },
  };
}

export default async function WarrantyPage() {
  const [page, banner] = await Promise.all([
    getWarrantyPage(),
    getWarrantyBanner(),
  ]);

  if (!isPublished(page)) notFound();

  const heading = banner?.banner_heading || page.title || "Warranty";
  const description =
    banner?.banner_description ||
    "Our warranty coverage and commitment to quality";

  return (
    <MainLayout>
      <BackgroundImageWithHeading
        sectionBgImages="contact_wrapper warranty_banner"
        sectionBgHeading={heading}
        secBgHeadingClass="sec_bgheading_lass force-white-heading"
        sectionBgDescription={description}
        secBgDesClass="text-center bg-transparent text-white"
        bgImageUrl={banner?.banner_image || undefined}
        headingTag={banner?.banner_heading_tag || "h1"}
        descriptionFontSize={banner?.banner_description_font_size || 16}
        sectionBgHeadingStyle={{
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
        }}
        sectionBgDescriptionStyle={{
          textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
        }}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .warranty-page-wrapper {
          width: 100%;
          background: #ffffff;
        }
        .warranty-page-wrapper .ck-content {
          width: 100%;
          word-break: break-word;
        }
        .warranty-page-wrapper .ck-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }
        .warranty-page-wrapper .ck-content figure {
          margin: 2rem auto;
          text-align: center;
          display: flex;
          justify-content: center;
        }
        .warranty-page-wrapper .ck-content h1,
        .warranty-page-wrapper .ck-content h2,
        .warranty-page-wrapper .ck-content h3,
        .warranty-page-wrapper .ck-content h4,
        .warranty-page-wrapper .ck-content h5,
        .warranty-page-wrapper .ck-content h6 {
          font-family: var(--font-outfit), sans-serif;
          color: #0f172a;
        }
        .warranty-page-wrapper .ck-content p {
          line-height: 1.8;
          color: #475569;
        }
        .warranty-page-wrapper .ck-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        .warranty-page-wrapper .ck-content th,
        .warranty-page-wrapper .ck-content td {
          border: 1px solid #e2e8f0;
          padding: 0.75rem;
          vertical-align: top;
        }
        @media (max-width: 767px) {
          .warranty-page-wrapper .container {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      ` }} />

      <main className="warranty-page-wrapper pb-5">
        <section className="container py-5">
          <div
            className="ck-content"
            dangerouslySetInnerHTML={{ __html: page.content || "" }}
          />
        </section>
      </main>
    </MainLayout>
  );
}
