import MainLayout from "@/app/layouts/MainLayout";
import BackgroundImageWithHeading from "../components/BackgroundImageWithHeading";
import WarrantySupportForm from "../components/WarrantySupportForm";
import { notFound } from "next/navigation";
import { FaShieldAlt, FaClock, FaCheckCircle, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

const getSiteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "https://hcinterior.in";

const getWarrantyRecord = async () => {
  const baseUrl = getBaseUrl();

  if (!baseUrl) return null;

  try {
    const response = await fetch(
      `${baseUrl}/cms-content/warranty`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();

    return {
      source: "cms-content",
      record: data,
      json: data?.json_content || {},
    };
  } catch (error) {
    console.error("Warranty cms-content fetch error:", error);
    return null;
  }
};

const getLegacyWarrantyRecord = async () => {
  const baseUrl = getBaseUrl();

  if (!baseUrl) return null;

  try {
    const response = await fetch(
      `${baseUrl}/cms-basic-pages/slug/warranty`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );

    if (!response.ok) return null;

    const page = await response.json();

    return {
      source: "cms-basic-pages",
      record: page,
      json: {
        html: page?.content || "",
      },
    };
  } catch (error) {
    console.error("Warranty legacy fetch error:", error);
    return null;
  }
};

const getWarrantyBanner = async () => {
  const baseUrl = getBaseUrl();

  if (!baseUrl) return null;

  try {
    const response = await fetch(
      `${baseUrl}/cms-gallery-design/manage-banner?key=warranty`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error("Warranty banner fetch error:", error);
    return null;
  }
};

const isPublished = (record, source) => {
  if (source === "cms-content") return true;

  const status = String(record?.status || "")
    .trim()
    .toLowerCase();

  return status === "published";
};

const normalizeJson = (value) => {
  if (!value) return {};

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }

  return value;
};

export async function generateMetadata() {
  const primary = await getWarrantyRecord();
  const fallback = primary ? null : await getLegacyWarrantyRecord();

  const selected = primary || fallback;

  if (!selected || !isPublished(selected.record, selected.source)) {
    return {
      title: "Warranty | High Creation Interior",
      description:
        "Warranty assurance and support information from High Creation Interior.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const seo =
    selected.record?.seo_content ||
    selected.json?.seo ||
    {};

  return {
    title:
      seo.meta_title ||
      "Warranty | High Creation Interior",
    description:
      seo.meta_description ||
      "Warranty assurance and support information from High Creation Interior.",
    keywords: seo.meta_keywords || undefined,
    alternates: {
      canonical:
        seo.canonical_url ||
        `${getSiteUrl()}/warranty`,
    },
  };
}

export default async function WarrantyPage() {
  const [primary, banner] = await Promise.all([
    getWarrantyRecord(),
    getWarrantyBanner(),
  ]);

  const selected =
    primary || (await getLegacyWarrantyRecord());

  if (
    !selected ||
    !isPublished(selected.record, selected.source)
  ) {
    notFound();
  }

  const content = normalizeJson(selected.json);

  const hero = {
    enabled: true,
    ...(content.hero || {}),
  };

  const summary = {
    enabled: true,
    ...(content.summary || {}),
  };

  const process = {
    enabled: true,
    ...(content.process || {}),
  };

  // const supportForm = {
  //   enabled: true,
  //   ...(content.supportForm || {}),
  // };

  const supportForm = {
  enabled: true,
  contactItems: [],
  ...(content.supportForm || {}),
};

  const cta = {
    enabled: true,
    ...(content.cta || {}),
  };

  const categories = Array.isArray(content.categories)
    ? content.categories.filter(
        (category) => category?.enabled !== false
      )
    : [];

  const heading =
    banner?.banner_heading ??
    "Warranty";

  const description =
    banner?.banner_description ??
    "Our commitment to quality and reliable interior solutions";

  const policyHtml = content.html || "";

  const featuredCategories =
    categories.length > 6
      ? categories.slice(0, 6)
      : categories;

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
        descriptionFontSize={
          banner?.banner_description_font_size || 16
        }
        sectionBgHeadingStyle={{
          textShadow: "0 2px 14px rgba(0,0,0,0.45)",
        }}
        sectionBgDescriptionStyle={{
          textShadow: "0 2px 10px rgba(0,0,0,0.45)",
        }}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .hci-warranty {
          --hci-orange: #ff914d;
          --hci-text: #4f5867;
          --hci-heading: #202020;
          --hci-border: #e9e9e9;
          --hci-soft: #faf9f7;
          background: #fff;
        }

        .hci-warranty .warranty-container {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .hci-warranty .warranty-intro {
          padding: 72px 0 42px;
          text-align: center;
        }

        .hci-warranty .warranty-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          color: var(--hci-orange);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .hci-warranty .warranty-intro h2 {
          margin: 0 auto;
          max-width: 820px;
          color: var(--hci-heading);
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.12;
          font-weight: 500;
          letter-spacing: -.025em;
        }

        .hci-warranty .warranty-intro p {
          max-width: 820px;
          margin: 18px auto 0;
          color: var(--hci-text);
          font-size: 16px;
          line-height: 1.8;
        }

        .hci-warranty .warranty-summary {
          padding: 18px 0 62px;
        }

        .hci-warranty .warranty-summary-head {
          max-width: 720px;
          margin-bottom: 28px;
        }

        .hci-warranty .warranty-summary-head h3 {
          margin: 0 0 9px;
          color: var(--hci-heading);
          font-size: clamp(26px, 3vw, 34px);
          font-weight: 500;
        }

        .hci-warranty .warranty-summary-head p {
          margin: 0;
          color: var(--hci-text);
          line-height: 1.7;
        }

        .hci-warranty .warranty-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .hci-warranty .warranty-card {
          border: 1px solid var(--hci-border);
          border-radius: 10px;
          padding: 24px;
          background: #fff;
        }

        .hci-warranty .warranty-card-icon {
          width: 44px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          border-radius: 50%;
          background: #fff4ec;
          color: var(--hci-orange);
        }

        .hci-warranty .warranty-card h4 {
          margin: 0 0 8px;
          color: var(--hci-heading);
          font-size: 18px;
          line-height: 1.35;
          font-weight: 600;
        }

        .hci-warranty .warranty-duration {
          color: var(--hci-orange);
          font-size: 14px;
          font-weight: 700;
        }
           .hci-warranty .warranty-summary {
    padding: 18px 0 28px;      /* was 18px 0 62px */
  }

        .hci-warranty .warranty-policy {
          padding: 24px 0 32 px;
        }

        .hci-warranty .warranty-process {
    padding: 32px 0 32px;      /* was 55px 0 32px from the last fix — reduce the top */
  }

        .hci-warranty .warranty-policy-inner {
          border-top: 1px solid var(--hci-border);
          padding-top: 54px;
        }

        .hci-warranty .warranty-policy-content {
          max-width: 950px;
          margin: 0 auto;
        }

        .hci-warranty .warranty-policy-content.ck-content {
          color: var(--hci-text);
          font-size: 15px;
          line-height: 1.85;
        }

        .hci-warranty .warranty-policy-content h1,
        .hci-warranty .warranty-policy-content h2,
        .hci-warranty .warranty-policy-content h3,
        .hci-warranty .warranty-policy-content h4,
        .hci-warranty .warranty-policy-content h5 {
          color: var(--hci-heading);
          font-weight: 500;
          line-height: 1.25;
        }

        .hci-warranty .warranty-policy-content h2 {
          margin-top: 48px;
          margin-bottom: 14px;
          padding-top: 22px;
          border-top: 1px solid var(--hci-border);
          font-size: clamp(23px, 3vw, 30px);
        }

        .hci-warranty .warranty-policy-content h3 {
          margin-top: 30px;
          margin-bottom: 10px;
          font-size: 20px;
        }

        .hci-warranty .warranty-policy-content p {
          margin-bottom: 15px;
        }

        .hci-warranty .warranty-policy-content ul,
        .hci-warranty .warranty-policy-content ol {
          margin: 16px 0 22px;
          padding-left: 24px;
        }

        .hci-warranty .warranty-policy-content li {
          margin-bottom: 8px;
        }

        .hci-warranty .warranty-policy-content a {
          color: var(--hci-orange);
          text-decoration: none;
        }

        .hci-warranty .warranty-policy-content blockquote {
          margin: 26px 0;
          padding: 18px 20px;
          border-left: 3px solid var(--hci-orange);
          background: var(--hci-soft);
        }

        .hci-warranty .warranty-policy-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }

        .hci-warranty .warranty-policy-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 22px 0;
        }

        .hci-warranty .warranty-policy-content th,
        .hci-warranty .warranty-policy-content td {
          padding: 11px 13px;
          border: 1px solid var(--hci-border);
          text-align: left;
          vertical-align: top;
        }

        .hci-warranty .warranty-policy-content th {
          background: var(--hci-soft);
          color: var(--hci-heading);
          font-weight: 600;
        }

        .hci-warranty .warranty-process {
          padding: 72px 0;
          background: var(--hci-soft);
        }

        .hci-warranty .warranty-process-heading {
          max-width: 720px;
          margin-bottom: 30px;
        }

        .hci-warranty .warranty-process-heading span,
        .hci-warranty .warranty-support-copy span {
          display: block;
          margin-bottom: 11px;
          color: var(--hci-orange);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .hci-warranty .warranty-process-heading h3,
        .hci-warranty .warranty-support-copy h3 {
          margin: 0 0 10px;
          color: var(--hci-heading);
          font-size: clamp(27px, 3vw, 38px);
          font-weight: 500;
          line-height: 1.18;
        }

        .hci-warranty .warranty-process-heading p,
        .hci-warranty .warranty-support-copy p {
          margin: 0;
          color: var(--hci-text);
          line-height: 1.75;
        }

        .hci-warranty .warranty-process-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }

        .hci-warranty .warranty-process-card {
          padding: 24px;
          border: 1px solid var(--hci-border);
          border-radius: 10px;
          background: #fff;
        }

        .hci-warranty .warranty-step-number {
          margin-bottom: 22px;
          color: var(--hci-orange);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .1em;
        }

        .hci-warranty .warranty-process-card h4 {
          margin: 0 0 8px;
          color: var(--hci-heading);
          font-size: 18px;
          font-weight: 600;
        }

        .hci-warranty .warranty-process-card p {
          margin: 0;
          color: var(--hci-text);
          font-size: 14px;
          line-height: 1.7;
        }

        .hci-warranty .warranty-support {
          padding: 76px 0 90px;
        }

        .hci-warranty .warranty-support-layout {
          display: grid;
          grid-template-columns: .85fr 1.15fr;
          gap: 42px;
          align-items: start;
        }

        .hci-warranty .warranty-support-copy {
          padding-top: 12px;
        }

        .hci-warranty .warranty-support-form-box {
          border: 1px solid var(--hci-border);
          border-radius: 10px;
          padding: 28px;
          background: #fff;
          box-shadow: 0 10px 34px rgba(0,0,0,.04);
        }

        .hci-warranty .warranty-cta {
          padding: 0 0 80px;
        }

        .hci-warranty .warranty-cta-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 34px 38px;
          border-radius: 10px;
          background: #222;
          color: #fff;
        }

        .hci-warranty .warranty-cta-box h3 {
          margin: 0 0 8px;
          font-size: clamp(24px, 3vw, 32px);
          font-weight: 500;
           color: #fff !important;
        }

        .hci-warranty .warranty-cta-box p {
          margin: 0;
          color: rgba(255,255,255,.72);
          line-height: 1.7;
          max-width: 720px;
        }

        .hci-warranty .warranty-cta-box a {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 12px 18px;
          border-radius: 6px;
          background: var(--hci-orange);
          color: #fff;
          text-decoration: none;
          font-weight: 700;
        }

        @media (max-width: 991px) {
          .hci-warranty .warranty-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .hci-warranty .warranty-process-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .hci-warranty .warranty-support-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 767px) {

       .warranty_banner {
 min-height: 0 !important;
    padding: 26px 16px !important;
    background-position: 26% center !important;
}
  .warranty_banner {
  min-height: 220px !important;
}

.warranty_banner .secBgDesClass,
  .warranty_banner p {
    font-size: 14px !important;
    line-height: 1.30 !important;
    max-width: 260px !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
  .hci-warranty .warranty-intro {
    padding: 32px 0 34px !important;
}

.hci-warranty .warranty-policy {
  padding: 24px 0 32 px;   /* ← "32 px" has a stray space */
}
  .hci-warranty .warranty-policy {
  padding: 24px 0 32px;
}

.hci-warranty .warranty-policy {
    padding-bottom: 24px !important;
  }
  .hci-warranty .warranty-process {
    padding: 24px 0 16px !important;
  }
  .hci-warranty .warranty-support {
    padding: 16px 0 55px !important;
  }

.hci-warranty .warranty-policy-content * {
  height: auto !important;
  max-height: none !important;
}

        .warranty_banner .sec_bgheading_lass {
  font-size: clamp(22px, 7vw, 34px) !important;
}
          .hci-warranty .warranty-container {
            width: min(100% - 24px, 1180px);
          }

          .hci-warranty .warranty-intro {
            padding: 48px 0 34px;
          }

          // .hci-warranty .warranty-grid,
          // .hci-warranty .warranty-process-grid {
          //   grid-template-columns: 1fr;
          // }

          .hci-warranty .warranty-grid,
.hci-warranty .warranty-process-grid {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 16px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;          
  -ms-overflow-style: none;
}

.hci-warranty .warranty-grid::-webkit-scrollbar,
.hci-warranty .warranty-process-grid::-webkit-scrollbar {
  display: none;                  
}

.hci-warranty .warranty-card,
.hci-warranty .warranty-process-card {
  flex: 0 0 100%;
  scroll-snap-align: center;
  text-align: center;
}

.hci-warranty .warranty-card-icon,
.hci-warranty .warranty-step-number {
  margin-left: auto;
  margin-right: auto;
}

          .hci-warranty .warranty-policy {
            padding-bottom: 55px;
          }

          // .hci-warranty .warranty-process,
          // .hci-warranty .warranty-support {
          //   padding: 55px 0;
          // }

          .hci-warranty .warranty-process {
  padding: 55px 0 32px;
}

.hci-warranty .warranty-support {
  padding: 32px 0 55px;
}
          .hci-warranty .warranty-cta {
            padding-bottom: 55px;
          }

          .hci-warranty .warranty-cta-box {
            flex-direction: column;
            align-items: flex-start;
            padding: 28px 24px;
          }
        }
          @media (min-width: 768px) {
  .warranty_banner {
    min-height: 360px !important;
    background-position: center 20% !important;
    background-size: cover !important;
  }
}

        .warranty_banner .sec_bgheading_lass {
  font-size: clamp(26px, 6vw, 64px) !important;
  line-height: 1.2 !important;
  white-space: normal !important;
  overflow-wrap: break-word !important;
  word-break: break-word !important;
  max-width: 100%;
}

.warranty_banner {
  overflow: hidden;
}

.warranty_banner .container {
  max-width: 100%;
  padding-left: 16px;
  padding-right: 16px;
  box-sizing: border-box;
}

.hci-warranty .warranty-contact-items { margin-top: 24px; }
.hci-warranty .warranty-contact-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 14px 0; border-top: 1px solid var(--hci-border);
}
.hci-warranty .warranty-contact-icon {
  position: relative;
  width: 36px; height: 36px; border-radius: 50%;
  background: #fff3e9; color: var(--hci-orange);
  flex-shrink: 0;
  overflow: hidden;
}

.hci-warranty .warranty-contact-icon svg {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  width: 16px !important;
  height: 16px !important;
  margin: 0 !important;
  transform: translate(-50%, -50%) !important;
}
      ` }} />

      <main className="hci-warranty">
        {hero.enabled !== false && (
          <section className="warranty-intro">
            <div className="warranty-container">
              <div className="warranty-eyebrow">
                <FaShieldAlt />
                {hero.eyebrow}
              </div>

              <h2>{hero.heading}</h2>

              <p>{hero.description}</p>
            </div>
          </section>
        )}

        {summary.enabled !== false && featuredCategories.length > 0 && (
          <section className="warranty-summary">
            <div className="warranty-container">
              <div className="warranty-summary-head">
                <h3>{summary.heading}</h3>
                <p>{summary.subheading}</p>
              </div>

              <div className="warranty-grid">
                {featuredCategories.map((category, index) => (
                  <div
                    className="warranty-card"
                    key={`${category.title}-${index}`}
                  >
                    <div className="warranty-card-icon">
                      {index % 2 === 0 ? (
                        <FaShieldAlt />
                      ) : (
                        <FaClock />
                      )}
                    </div>

                    <h4>{category.title}</h4>
                    <div className="warranty-duration">
                      {category.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="warranty-policy">
          <div className="warranty-container">
            <div className="warranty-policy-inner">
              <article
                className="warranty-policy-content ck-content"
                dangerouslySetInnerHTML={{
                  __html: policyHtml,
                }}
              />
            </div>
          </div>
        </section>

        {process.enabled !== false &&
          Array.isArray(process.steps) &&
          process.steps.length > 0 && (
            <section className="warranty-process">
              <div className="warranty-container">
                <div className="warranty-process-heading">
                  <span>{process.eyebrow}</span>
                  <h3>{process.heading}</h3>
                  <p>{process.description}</p>
                </div>

                <div className="warranty-process-grid">
                  {process.steps.map((step, index) => (
                    <div
                      className="warranty-process-card"
                      key={`${step.number}-${index}`}
                    >
                      <div className="warranty-step-number">
                        {step.number}
                      </div>

                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        {supportForm.enabled !== false && (
          <section className="warranty-support">
            <div className="warranty-container">
              <div className="warranty-support-layout">
                <div className="warranty-support-copy">
                  <span>{supportForm.eyebrow}</span>
                  <h3>{supportForm.heading}</h3>
                  <p>{supportForm.description}</p>
                  {Array.isArray(supportForm.contactItems) && supportForm.contactItems.length > 0 && (
  <div className="warranty-contact-items">
    {supportForm.contactItems.map((item, index) => {
      const Icon = item.icon === "mail" ? FaEnvelope : item.icon === "location" ? FaMapMarkerAlt : FaPhoneAlt;
      return (
        <div className="warranty-contact-item" key={index}>
          <span className="warranty-contact-icon"><Icon /></span>
          <div>
            <strong>{item.label}</strong>
            <div>{item.value}</div>
          </div>
        </div>
      );
    })}
  </div>
)}
                </div>

                <div className="warranty-support-form-box">
                  <WarrantySupportForm
                    heading={supportForm.heading}
                    description={supportForm.description}
                    submitLabel={
                      supportForm.submitLabel ||
                      "SUBMIT REQUEST"
                    }
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {cta.enabled !== false && (
          <section className="warranty-cta">
            <div className="warranty-container">
              <div className="warranty-cta-box">
                <div>
                  <h3>{cta.heading}</h3>
                  <p>{cta.description}</p>
                </div>

                <a href={cta.buttonUrl || "/contact"}>
                  {cta.buttonText || "Contact HCI"}
                  <FaCheckCircle size={14} />
                </a>
              </div>
            </div>
          </section>
        )}
      </main>
    </MainLayout>
  );
}
