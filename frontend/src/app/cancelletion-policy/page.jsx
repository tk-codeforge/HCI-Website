import BackgroundImageWithHeading from "../components/BackgroundImageWithHeading";
import MainLayout from "../layouts/MainLayout";
import DOMPurify from "isomorphic-dompurify";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../components/JsonLd";

// --- CONFIGURATION ---
export const revalidate = 60;

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/cancelletion-policy")}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

async function getBannerData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/cms-gallery-design/manage-banner?key=cancellation_policy`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Banner Fetch Error:", err);
    return null;
  }
}

async function getPolicyContent() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/cancellation_policy`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") return [data];
    return null;
  } catch (err) {
    console.error("Cancellation Policy CMS Fetch Error:", err);
    return null;
  }
}

function getCardBodyHtml(jsonContent) {
  if (typeof jsonContent?.bodyHtml === "string") return jsonContent.bodyHtml;

  if (Array.isArray(jsonContent?.blocks) && jsonContent.blocks.length > 0) {
    let html = "";
    let bulletBuffer = [];
    const flush = () => {
      if (bulletBuffer.length > 0) {
        html += `<ul>${bulletBuffer.map((t) => `<li>${t}</li>`).join("")}</ul>`;
        bulletBuffer = [];
      }
    };
    jsonContent.blocks.forEach((b) => {
      if (b.type === "bullet") {
        bulletBuffer.push(b.text || "");
      } else {
        flush();
        if (b.text) html += `<p>${b.text}</p>`;
      }
    });
    flush();
    return html;
  }

  let html = "";
  if (jsonContent?.body) html += `<p>${jsonContent.body}</p>`;
  if (Array.isArray(jsonContent?.bullets) && jsonContent.bullets.length > 0) {
    html += `<ul>${jsonContent.bullets.map((t) => `<li>${t}</li>`).join("")}</ul>`;
  }
  return html;
}

function getTableHtml(cmsList) {
  const tableRecord = cmsList?.find((i) => i.json_content?.section === "table");
  return tableRecord?.json_content?.tableHtml || "";
}

export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title || "Cancellation Policy - High Creation Interior";
  const description =
    seo?.meta_description ||
    "Understand our transparent cancellation and refund terms for your interior design projects.";

  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/cancelletion-policy",
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

export default async function CancelletionPolicy() {
  // Fetch everything in parallel instead of sequentially
  const [seo, bannerRecord, cmsList] = await Promise.all([
    getSeoData(),
    getBannerData(),
    getPolicyContent(),
  ]);

  const bgHeading = bannerRecord?.banner_heading || "Cancellation Policy";
  const bgDescription =
    bannerRecord?.banner_description ||
    "Transparent policies for a trusted partnership";

  const headingRecord = cmsList?.find(
    (i) => i.json_content?.section === "heading"
  )?.json_content;
  const HeadingTag = headingRecord?.heading_tag || "h2";
  const SubheadingTag = headingRecord?.subheading_tag || "h3";
  const headingText = headingRecord?.heading_text || "High Creation Interior";
  const subheadingText =
    headingRecord?.subheading_text || "Our Cancellation & Refund Terms";
  const descriptionText =
    headingRecord?.description_text ||
    "All charges are applicable due to resource allocation, design efforts, and operational planning already undertaken by the company to ensure the highest quality for your project.";

  const cmsCards =
    cmsList
      ?.filter((i) => i.json_content?.section === "card")
      .sort(
        (a, b) => (a.json_content?.order ?? 0) - (b.json_content?.order ?? 0)
      )
      .map((i) => ({
        bodyHtml: DOMPurify.sanitize(getCardBodyHtml(i.json_content)),
      })) || [];

  const footerNoteRecord = cmsList?.find(
    (i) => i.json_content?.section === "footer_note"
  )?.json_content;
  const footerLine1 =
    footerNoteRecord?.line1 ||
    "All charges are applicable due to resource allocation, design efforts, and operational planning already undertaken by the company.";
  const footerLine2 =
    footerNoteRecord?.line2 ||
    "Discount is not applicable in any type of either partial or full cancellation";

  const footerNoteHtml = footerNoteRecord?.note_html
    ? DOMPurify.sanitize(footerNoteRecord.note_html)
    : null;

  const tableHtml = DOMPurify.sanitize(getTableHtml(cmsList));

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <BackgroundImageWithHeading
        sectionBgImages={"contact_wrapper cancelation_policy_banner"}
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
      <style>{`
  .card-cms-content p { margin-bottom: 0.5rem; }
  .card-cms-content p:last-child { margin-bottom: 0; }
  .footer-note-cms p { margin-bottom: 0.25rem; }
  .footer-note-cms p:last-child { margin-bottom: 0; }
  .cancel-desc p:last-child { margin-bottom: 0; }
  .cms-table-wrapper table { width: 100%; border-collapse: collapse; }
  .cms-table-wrapper th, .cms-table-wrapper td { border: 1px solid #dee2e6; padding: 0.75rem; vertical-align: middle; }
  .cms-table-wrapper thead th { background-color: #f8f9fa; font-weight: bold; }
  .pdf-exact-details .text-primary { color: #0a58ca !important; }
  .pdf-exact-details .text-danger { color: #b02a37 !important; }
`}</style>
      <section className="policy-content my-5 py-4">
        <div className="container">
          {/* Introduction & Trust Section */}
          <div className="text-center mb-5">
            <HeadingTag className="fw-bold mb-3">{headingText}</HeadingTag>
            <SubheadingTag className="mb-4">
              <span>{subheadingText}</span>
            </SubheadingTag>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div
                  className="text-muted lead cancel-desc"
                  style={{ fontSize: "16px" }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(descriptionText),
                  }}
                />
              </div>
            </div>
          </div>

          <hr className="my-5" />

          {/* Part 2: Exact PDF Details Section */}
          <div className="pdf-exact-details bg-white p-4 p-md-5 rounded border shadow-sm">
            <h4 className="fw-bold mb-4 text-dark border-bottom pb-3">
              Official Policy Details & Conditions
            </h4>

            <div className="table-responsive mb-5 cms-table-wrapper">
              {tableHtml ? (
                <div dangerouslySetInnerHTML={{ __html: tableHtml }} />
              ) : (
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" style={{ width: "30%" }}>Scenario</th>
                      <th scope="col" style={{ width: "40%" }}>Condition</th>
                      <th scope="col" style={{ width: "30%" }}>Applicable charges</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="fw-bold">Case 1: Cancellation requested within seven (7) days of booking amount receipt.</td>
                      <td>Cancellation request is received within 7 days of booking (Only Applicable if designer and operation team is not aligned for Project)</td>
                      <td>A full (100%) refund of the amount paid will be refund.</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Case 2: Cancellation Requested after 7 Days or Site Handover (whichever is earlier)</td>
                      <td>Project has been handed over to Design/Ops team or 7 days has been completed</td>
                      <td>10% of the total project value is non-refundable</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Case 3: Design Phase in Progress</td>
                      <td>Design work is in progress</td>
                      <td>Twenty percent (20%) of the total project value shall be non-refundable as design consultancy charges.</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Case 4: Cancellation during the execution phase</td>
                      <td>Site execution has commenced and client requests cancellation</td>
                      <td>No refund shall be applicable.</td>
                    </tr>

                    <tr className="table-secondary">
                      <td colSpan="3" className="fw-bold text-center">Partial cancellation - After Starting of design phase</td>
                    </tr>

                    <tr>
                      <td className="fw-bold">Removal of items from the initially finalized BOQ by the client</td>
                      <td>Applicable only where the final BOQ remains equal to or greater than the initially finalized BOQ</td>
                      <td>No charges shall be applicable</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Removal of items from the initially finalized BOQ by the client.</td>
                      <td>Applicable where the final BOQ value is less than the initially finalized BOQ.</td>
                      <td>A service charge of twenty percent (20%) of the value of the removed line items shall be applicable</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Removal of existing or additional items from the BOQ during the design discussion phase</td>
                      <td>Applicable only upon commencement of either 2D drawings or 3D design work.</td>
                      <td>A design consultancy fee of twenty percent (20%) on the value of removed items shall apply</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            {/* Exact Examples from PDF */}
            <h5 className="fw-bold mb-4">Examples:</h5>
            <div className="row g-4 mb-4">
              {cmsCards.length > 0 ? (
                cmsCards.map((card, idx) => (
                  <div className="col-md-4" key={idx}>
                    <div className="p-3 border rounded bg-light h-100">
                      <div
                        className="card-cms-content"
                        dangerouslySetInnerHTML={{ __html: card.bodyHtml }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="col-md-4">
                    <div className="p-3 border rounded bg-light h-100">
                      <h6 className="fw-bold text-primary">Ex case 1:-</h6>
                      <p className="mb-2">The Client books an order worth ₹15 lakh. Prior to commencement of any 2D/3D design work, the Client:</p>
                      <ul className="mb-2">
                        <li>Removes work or line items worth ₹5 lakh, and</li>
                        <li>Adds new work of ₹25 lakh or more.</li>
                      </ul>
                      <p className="fw-bold  text-danger mb-1">Result: No service charge shall be applicable.</p>
                      <p className="text-muted small mb-0">Note: This shall apply only if 2D drawings or 3D designs have not been initiated.</p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 border rounded bg-light h-100">
                      <h6 className="fw-bold text-primary">Ex case 2:</h6>
                      <p className="mb-2">The Client books an order worth ₹15 lakh. Upon commencement of the design phase (2D/3D), the Client:</p>
                      <p className="mb-2">Removes work worth ₹5 lakh.</p>
                      <p className="fw-bold text-danger mb-0">Result: A service charge of ₹1 lakh (20% of ₹5 lakh) shall be charged separately.</p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-3 border rounded bg-light h-100">
                      <h6 className="fw-bold text-primary">Ex Case 3:-</h6>
                      <p className="mb-2">The initial order value is ₹15 lakh. During the design phase (upon completion of 2D/3D), the BOQ increases to ₹20 lakh. If the Client removes any item thereafter:</p>
                      <p className="fw-bold text-danger mb-2">Service Charge: A service charge of twenty percent (20%) of the value of the removed items shall be charged separately.</p>
                      <p className="text-muted small mb-0">Note: In such cases, Example 1 and Example 2 shall not apply.</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {footerNoteHtml ? (
              <div
                className="alert alert-warning border-warning footer-note-cms"
                role="alert"
                dangerouslySetInnerHTML={{ __html: footerNoteHtml }}
              />
            ) : (
              <div className="alert alert-warning border-warning" role="alert">
                <p className="mb-1">{footerLine1}</p>
                <p className="mb-0 fw-bold text-danger">{footerLine2}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
