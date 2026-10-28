import BackgroundImageWithHeading from "../components/BackgroundImageWithHeading";
import MainLayout from "../layouts/MainLayout";
import BoxIcon from "../components/BoxIcon";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../components/JsonLd";
import ReferFormClient from "./ReferFormClient";

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

async function getBannerData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-gallery-design/manage-banner?key=refer_and_earn`, {
      next: { revalidate: 60 },
      headers: { Connection: "close" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Banner Fetch Error:", err);
    return null;
  }
}

async function getPageContent() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/refer_and_earn`, {
      next: { revalidate: 60 },
      headers: { Connection: "close" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Page Content Fetch Error:", err);
    return null;
  }
}

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/refer-and-earn")}`,
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
    seo?.meta_title || "Refer & Earn - High Creation Interior";
  const description =
    seo?.meta_description ||
   "Refer & Earn - High Creation Interior";

   const ogTitle = seo?.og_title || title;
const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/refer-and-earn",
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
export default async function ReferEarn() {
  // Independent requests: run together instead of one after another.
  const [seo, bannerRecord, pageRecord] = await Promise.all([
    getSeoData(),
    getBannerData(),
    getPageContent(),
  ]);
  const bgHeading = bannerRecord?.banner_heading || "Refer & Earn";
const bgDescription = bannerRecord?.banner_description || "Get all the information you need";

const contentData = pageRecord?.json_content || {};

  const HeadingTag = contentData.main_heading_tag || "h2";
  const mainHeading = contentData.main_heading || "High Creation Interior";
  const mainDescription = contentData.main_description || "";
  const mainDescriptionFontSize = contentData.main_description_font_size || 16;

  // Handle both the legacy root array and the new wrapped object layout
  const iconItems = Array.isArray(contentData.cards) && contentData.cards.length > 0 
    ? contentData.cards 
    : Array.isArray(contentData) && contentData.length > 0 
        ? contentData
        : [
            { image: "/images/referral.svg", title: "Refer Your Friends", description: "Refer your friend and unlock amazing rewards!", description_font_size: 16 },
            { image: "/images/book.svg", title: "They Book With Us", description: "When your friend books with us, both of you enjoy exclusive benefits.", description_font_size: 16 },
            { image: "/images/reward.svg", title: "And Get Exciting Rewards", description: "Earn exciting rewards together and make unforgettable memories!", description_font_size: 16 },
          ];
const formHeading = contentData.form_heading || "Refer and Earn";
  const formBgColor = contentData.form_bg_color || "#ff914d";
  const formHeadingColor = contentData.form_heading_color || "#000000";
  const formImage = contentData.form_image || "/images/refer-and-earn.jpg";
  const formImageAlt = contentData.form_image_alt?.trim() || "Refer and earn";

  const submitButtonText = contentData.submit_button_text || "Submit Now";
  const submitButtonBgColor = contentData.submit_button_bg_color || "#ff914d";
  const submitButtonColor = contentData.submit_button_color || "#ffffff";

  const defaultFields = {
    friend_name: { label: "Your Friend's Name", placeholder: "Your Friend's Name", shown: true, required: true },
    friend_number: { label: "Your Friend's Number", placeholder: "Your Friend's Number", shown: true, required: true },
    friend_email: { label: "Your Friend's Email", placeholder: "Your Friend's Email", shown: true, required: true },
    place: { label: "Place", placeholder: "Place", shown: true, required: true },
    other_place: { label: "Other Place", placeholder: "Other Place", shown: true, required: false },
    phone_no: { label: "Phone No.", placeholder: "your Phone No.", shown: true, required: true },
  };
  
  let formFields = defaultFields;
  if (contentData.form_fields) {
    const parsed = typeof contentData.form_fields === "string"
      ? JSON.parse(contentData.form_fields)
      : contentData.form_fields;
    formFields = { ...defaultFields, ...parsed };
  }

  return (
    <div>
      
        <MainLayout>
          <JsonLd data={seo?.custom_schema} />
        <BackgroundImageWithHeading
  sectionBgImages={"contact_wrapper refer_and_earn_banner"}
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
            <div className="text-center">
              <HeadingTag>{mainHeading}</HeadingTag>
{mainDescription && (
  <p style={{ fontSize: `${mainDescriptionFontSize}px` }}>{mainDescription}</p>
)}
<h3>
</h3>

              <div className="row g-4 py-4 mx-0">
  {iconItems.map((item, idx) => (
    <div className="col-12 col-lg-4 col-md-4" key={idx}>
      <BoxIcon
        iconImage={item.image}
        iconAlt={item.image_alt?.trim() || item.title || ""}
        iconWidth=""
        IconBoxHeading={item.title}
        IconBoxDescription={item.description}
        descriptionFontSize={item.description_font_size || 16}
      />
    </div>
  ))}
</div>

              <div className="pt-4 table">
             <div className="row justify-content-center mx-0">
                <div className="col-lg-10">
                <div className="row justify-content-center">
                  <div className="col-lg-5 pe-lg-0">

<div className="bg-image" style={{ position: "relative", width: "100%", height: "100%" }}>
  <img
    src={formImage}
    alt={formImageAlt}
    loading="lazy"
    decoding="async"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
  />
</div>
                  </div>
                  <div className="col-lg-7 ps-lg-0">
                      <div
  className="refer_form"
  style={{
    backgroundColor: formBgColor,
    "--form-heading-color": formHeadingColor,
    "--submit-btn-bg-color": submitButtonBgColor,
    "--submit-btn-text-color": submitButtonColor,
  }}
>
  <h4 className="form_heading mb-3">
    {formHeading}
  </h4>

  <ReferFormClient
  formFields={formFields}
  submitButtonText={submitButtonText}
  submitButtonBgColor={submitButtonBgColor}
  submitButtonColor={submitButtonColor}
/>
                    </div>
                  </div>
                </div>
                </div>
             </div>
              </div>
            </div>
          </div>
        </section>
        <hr />
      </MainLayout>
    </div>
  );
};

