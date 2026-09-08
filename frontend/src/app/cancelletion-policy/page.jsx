import BackgroundImageWithHeading from "../components/BackgroundImageWithHeading";
import MainLayout from "../layouts/MainLayout";

// --- CONFIGURATION ---
export const revalidate = 60;

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- HELPER: Fetch SEO Data ---
async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/seo-tag`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const allTags = await res.json();
    if (Array.isArray(allTags)) {
      return allTags.find(
        (tag) =>
          tag.page_name?.endsWith("/cancelletion-policy") ||
          tag.page_name?.endsWith("/cancellation-policy")
      );
    }
    return null;
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

async function getBannerData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-gallery-design/manage-banner?key=cancellation_policy`, {
      cache: "no-store",
      headers: { Connection: "close" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Banner Fetch Error:", err);
    return null;
  }
}

export async function generateMetadata() {
  const seoData = await getSeoData();
  const defaultTitle = "Cancellation Policy - High Creation Interior";
  const defaultDesc =
    "Understand our transparent cancellation and refund terms for your interior design projects.";
  const defaultCanonical = "https://hcinterior.in/cancelletion-policy";

  return {
    title: seoData?.title || defaultTitle,
    description: seoData?.meta_description || defaultDesc,
    alternates: { canonical: seoData?.page_name || defaultCanonical },
  };
}

export default async function CancelletionPolicy() {

  const bannerRecord = await getBannerData();
  const bgHeading = bannerRecord?.banner_heading || "Cancellation Policy";
const bgDescription = bannerRecord?.banner_description || "Transparent policies for a trusted partnership";
  return (
    <MainLayout>
      {/* <BackgroundImageWithHeading
        sectionBgImages={"contact_wrapper cancelation_policy_banner"}
        sectionBgHeading="Cancellation Policy"
        secBgHeadingClass="sec_bgheading_lass"
        sectionBgDescription="Transparent policies for a trusted partnership"
        secBgDesClass={"text-center text-white"}
      /> */}

      <BackgroundImageWithHeading
  sectionBgImages={"contact_wrapper cancelation_policy_banner"}
  sectionBgHeading={bgHeading}
  secBgHeadingClass="sec_bgheading_lass force-white-heading"
  sectionBgDescription={bgDescription}
  secBgDesClass={"text-center bg-transparent text-white"}
  bgImageUrl={bannerRecord?.banner_image}
  headingTag={bannerRecord?.banner_heading_tag || "h1"}
  descriptionFontSize={bannerRecord?.banner_description_font_size || 16}
  sectionBgHeadingStyle={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
  sectionBgDescriptionStyle={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
/>

      <section className="policy-content my-5 py-4">
        <div className="container">
          {/* Introduction & Trust Section */}
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">High Creation Interior</h2>
            <h3 className="mb-4">
              <span className="font_stylish" style={{ color: "#ff914d" }}>
                Our Cancellation & Refund Terms
              </span>
            </h3>
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <p className="text-muted lead">
                  All charges are applicable due to resource allocation, design
                  efforts, and operational planning already undertaken by the
                  company to ensure the highest quality for your project.
                </p>
              </div>
            </div>
          </div>

          {/* Part 1: Full Cancellation Phases (Modern UI) */}
          {/* <h4 className="border-bottom pb-2 mb-4 fw-bold">
            1. Full Cancellation Overview
          </h4> */}
          {/*  */}

          <hr className="my-5" />

          {/* Part 2: Exact PDF Details Section */}
          <div className="pdf-exact-details bg-white p-4 p-md-5 rounded border shadow-sm">
            <h4 className="fw-bold mb-4 text-dark border-bottom pb-3">
              Official Policy Details & Conditions
            </h4>

            <div className="table-responsive mb-5">
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
                  
                  {/* Sub-header for Partial Cancellation */}
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
            </div>

            {/* Exact Examples from PDF */}
            <h5 className="fw-bold mb-4">Examples:</h5>
            <div className="row g-4 mb-4">
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
            </div>

            {/* Final PDF Notes */}
            <div className="alert alert-warning border-warning" role="alert">
              <p className="mb-1">
                {"All charges are applicable due to resource allocation, design efforts, and operational planning already undertaken by the company."
}</p>
              <p className="mb-0 fw-bold text-danger">
 {               "Discount is not applicable in any type of either partial or full cancellation"
            }            </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}