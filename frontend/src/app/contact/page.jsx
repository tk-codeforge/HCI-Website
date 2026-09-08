import React from "react";
import MainLayout from "../layouts/MainLayout";
import ContactForm from "./ContactForm";
import MapSection from "../components/MapSection";
import { FaPhoneAlt, FaEnvelope, FaBuilding, FaStore, FaTools, FaMapMarkerAlt, FaWhatsapp, FaClock, FaFax, FaGlobe, FaUser, FaHome, FaWarehouse, FaIndustry } from "react-icons/fa";

const ICON_MAP = { FaPhoneAlt, FaEnvelope, FaBuilding, FaStore, FaTools, FaMapMarkerAlt, FaWhatsapp, FaClock, FaFax, FaGlobe, FaUser, FaHome, FaWarehouse, FaIndustry };
const RenderIcon = ({ name }) => { const Cmp = ICON_MAP[name] || FaPhoneAlt; return <Cmp />; };

const DEFAULT_CONTACT_CONTENT = {
  banner: {
    headingTag: "h1", heading: "Let's Design Your Dream Space", headingColor: "#ffffff",
    eyebrow: "Get in Touch",
    description: "For inquiries regarding any interior design service or expert advice, our team is ready to help you bring your vision to life.",
    descriptionColor: "#ffffff", descriptionFontSize: 18,
    bgColorStart: "#0f172a", bgColorEnd: "#1e293b",
  },
  cards: [
    { id: "1", icon: "FaPhoneAlt", title: "Call Us", rows: [
      { label: "General Inquiry", value: "+91 7070701373", link: "tel:7070701373" },
      { label: "Toll Free", value: "1800-1200-532", link: "tel:18001200532" } ] },
    { id: "2", icon: "FaEnvelope", title: "Email Us", rows: [
      { label: "General Info", value: "info@hcinterior.in", link: "mailto:info@hcinterior.in" },
      { label: "Customer Care", value: "care@hcinterior.in", link: "mailto:care@hcinterior.in" } ] },
    { id: "3", icon: "FaBuilding", title: "Corporate Office", rows: [
      { label: "", value: "H-56, 1st Floor, Sector-63, Noida, Uttar Pradesh - 201301", link: "" } ] },
    { id: "4", icon: "FaTools", title: "Workshop", rows: [
      { label: "", value: "Gata No - 336, Village - Upeda, Hapur, Uttar Pradesh 245201", link: "" } ] },
  ],
  experienceCenters: {
    heading: "Experience Centers", icon: "FaStore",
    centers: [
      { id: "1", heading: "Noida", address: "H101, LGF, Sector-63, Noida, Uttar Pradesh - 201301" },
      { id: "2", heading: "Gurugram (DDC Arcade)", address: "1st Floor, Plot No 1 Main, Sector 48 Road, Badshahpur Sohna Rd, Haryana - 122018" },
      { id: "3", heading: "Faridabad", address: "1st Floor, Plot No 24, near old Faridabad Metro Station, Sector 20A, Haryana - 121002" },
    ],
  },
    mapSection: {
    heading: "Find Us Here",
    locations: [],
  },
};

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
          tag.page_name === "https://hcinterior.in/contact" ||
          tag.page_name?.endsWith("/contact")
      );
    }
    return null;
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

async function getContactPageContent() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/contact_page`, { next: { revalidate: 60 } });
    if (!res.ok) return DEFAULT_CONTACT_CONTENT;
    const data = await res.json();
    const row = Array.isArray(data) ? data[0] : data;
    let parsed = row?.json_content;
    if (typeof parsed === "string") parsed = JSON.parse(parsed);
    return parsed && typeof parsed === "object"
  ? { ...DEFAULT_CONTACT_CONTENT, ...parsed }
  : DEFAULT_CONTACT_CONTENT;
  } catch (err) {
    console.error("Contact CMS Fetch Error:", err);
    return DEFAULT_CONTACT_CONTENT;
  }
}


// --- DYNAMIC METADATA GENERATION ---
export async function generateMetadata() {
  const seoData = await getSeoData();

  const defaultTitle = "Book Free Consultation With High Creation Interior Noida";
  const defaultDesc =
    "Make a call on +91 7070701373 for top notch interior designing services in Noida. Address : H-56, 1st Floor, Sector-63, Noida, Uttar Pradesh- 201301";
  const defaultCanonical = "https://hcinterior.in/contact";

  return {
    title: seoData?.title || defaultTitle,
    description: seoData?.meta_description || defaultDesc,
    alternates: {
      canonical: seoData?.page_name || defaultCanonical,
    },
    openGraph: {
      title: seoData?.title || defaultTitle,
      description: seoData?.meta_description || defaultDesc,
      url: seoData?.page_name || defaultCanonical,
      type: "website",
    },
  };
}

// --- MAIN SERVER COMPONENT ---
// export default function Contact() {
export default async function Contact() {
  const {
  banner = DEFAULT_CONTACT_CONTENT.banner,
  cards = DEFAULT_CONTACT_CONTENT.cards,
  experienceCenters = DEFAULT_CONTACT_CONTENT.experienceCenters,
  mapSection = DEFAULT_CONTACT_CONTENT.mapSection,
} = await getContactPageContent();
  return (
    <MainLayout>
      <style dangerouslySetInnerHTML={{__html: `
        .contact-hero {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 100px 0 160px; 
          position: relative;
        }
        .contact-hero::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(to top, #f8f9fa, transparent);
        }
        
        .contact-overlap-container {
          margin-top: -100px;
          position: relative;
          z-index: 10;
        }

        .contact-info-card {
          background: #ffffff;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.03);
          height: 100%;
          transition: all 0.3s ease;
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }
        .contact-info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(255,145,77,0.1);
          border-color: #ff914d;
        }

        .contact-icon-wrapper {
          width: 55px;
          height: 55px;
          min-width: 55px;
          background: #fff4ed;
          color: #ff914d;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .contact-card-title {
          font-family: var(--font-outfit), sans-serif;
          font-weight: 700;
          font-size: 1.1rem;
          color: #0f172a;
          margin-bottom: 8px;
        }

        .contact-card-text {
          font-family: var(--font-poppins), sans-serif;
          font-size: 0.95rem;
          color: #475569;
          margin-bottom: 0;
          line-height: 1.6;
        }

        .contact-card-link {
          color: #475569;
          text-decoration: none;
          transition: 0.3s;
        }
        .contact-card-link:hover {
          color: #ff914d;
        }

        .form-wrapper-card {
          background: #ffffff;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.02);
        }

        .hero-dynamic-text {
  color: var(--hero-text-color) !important;
}
  main {
  overflow-x: hidden;
  max-width: 100vw;
}
      `}} />

      <main className="bg-light pb-0 overflow-hidden">
        
        {/* --- PREMIUM HERO SECTION --- */}
        <section className="contact-hero text-center text-lg-start"
        style={{ background: `linear-gradient(135deg, ${banner?.bgColorStart || "#0f172a"} 0%, ${banner?.bgColorEnd || "#1e293b"} 100%)` }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8 mx-auto text-center">
                {/* <span className="font_stylish text-white" style={{ opacity: 0.9 }}>Get in Touch</span>
                <h1 className="font-outfit fw-bold text-white mb-3" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                  {`Let's Design Your Dream Space`}
                </h1>
                <p className="font-poppins text-white-50 mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
                  For inquiries regarding any interior design service or expert advice, our team is ready to help you bring your vision to life.
                </p> */}
                <span className="font_stylish hero-dynamic-text" style={{ opacity: 0.9, "--hero-text-color": banner.headingColor || "#ffffff" }}>{banner.eyebrow}</span>
{React.createElement(
  banner.headingTag || "h1",
  { className: "font-outfit fw-bold mb-3 hero-dynamic-text", style: { fontSize: 'clamp(2.5rem, 5vw, 4rem)', "--hero-text-color": banner.headingColor || "#ffffff" } },
  banner.heading
)}
<p className="font-poppins mx-auto" style={{ maxWidth: '600px', fontSize: `${banner.descriptionFontSize || 18}px`, color: banner.descriptionColor || "#ffffff" }}>
  {banner.description}
</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- OVERLAPPING CONTENT SECTION --- */}
        <section className="contact-overlap-container pb-5">
          <div className="container">
            <div className="row g-5">
              
              {/* LEFT: Contact Information Grid */}
              <div className="col-lg-7">
                <div className="row g-4">
                  
                  {/* Call Us Card (Merged General & Toll Free to save space) */}
                  {/* <div className="col-md-6">
                    <div className="contact-info-card flex-column align-items-start gap-3">
                      <div className="contact-icon-wrapper">
                        <FaPhoneAlt />
                      </div>
                      <div className="w-100">
                        <h4 className="contact-card-title">Call Us</h4>
                        <div className="d-flex justify-content-between align-items-center w-100 border-bottom pb-2 mb-2">
                           <span className="contact-card-text small">General Inquiry</span>
                           <a href="tel:7070701373" className="contact-card-link fw-bold text-dark">+91 7070701373</a>
                        </div>
                        <div className="d-flex justify-content-between align-items-center w-100">
                           <span className="contact-card-text small">Toll Free</span>
                           <a href="tel:18001200532" className="contact-card-link fw-bold text-dark">1800-1200-532</a>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* Email Card */}
                  {/* <div className="col-md-6">
                    <div className="contact-info-card flex-column align-items-start gap-3">
                      <div className="contact-icon-wrapper">
                        <FaEnvelope />
                      </div>
                      <div className="w-100">
                        <h4 className="contact-card-title">Email Us</h4>
                        <div className="d-flex justify-content-between align-items-center w-100 border-bottom pb-2 mb-2">
                           <span className="contact-card-text small">General Info</span>
                           <a href="mailto:info@hcinterior.in" className="contact-card-link fw-bold text-dark">info@hcinterior.in</a>
                        </div>
                        <div className="d-flex justify-content-between align-items-center w-100">
                           <span className="contact-card-text small">Customer Care</span>
                           <a href="mailto:care@hcinterior.in" className="contact-card-link fw-bold text-dark">care@hcinterior.in</a>
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* Corporate Office Card */}
                  {/* <div className="col-md-6">
                    <div className="contact-info-card flex-column align-items-start gap-3">
                      <div className="contact-icon-wrapper">
                        <FaBuilding />
                      </div>
                      <div>
                        <h4 className="contact-card-title">Corporate Office</h4>
                        <p className="contact-card-text small fw-medium">
                          H-56, 1st Floor, Sector-63, <br/>
                          Noida, Uttar Pradesh - 201301
                        </p>
                      </div>
                    </div>
                  </div> */}

                  {/* Workshop Card */}
                  {/* <div className="col-md-6">
                    <div className="contact-info-card flex-column align-items-start gap-3">
                      <div className="contact-icon-wrapper">
                        <FaTools />
                      </div>
                      <div>
                        <h4 className="contact-card-title">Workshop</h4> */}
                        {/* <p className="contact-card-text small fw-medium">
                          Plot No-3, Sorkha Village, <br/>
                          Sector-115, Noida, UP - 201301
                        </p> */}
                        {/* <p className="contact-card-text small fw-medium">
                          Gata No - 336, Village - Upeda, Hapur, <br/>
                          Uttar Pradesh 245201

                        </p>
                      </div>
                    </div>
                  </div> */}

                  {(Array.isArray(cards) ? cards : []).map((card) => (
  <div className="col-md-6" key={card.id}>
    <div className="contact-info-card flex-column align-items-start gap-3">
      <div className="contact-icon-wrapper"><RenderIcon name={card.icon} /></div>
      <div className="w-100">
        <h4 className="contact-card-title">{card.title}</h4>
        {card.rows.map((row, i) => row.label ? (
          <div key={i} className={`d-flex justify-content-between align-items-center w-100 ${i < card.rows.length - 1 ? "border-bottom pb-2 mb-2" : ""}`}>
            <span className="contact-card-text small">{row.label}</span>
            {row.link ? <a href={row.link} className="contact-card-link fw-bold text-dark">{row.value}</a> : <span className="fw-bold text-dark">{row.value}</span>}
          </div>
        ) : (
          <p key={i} className="contact-card-text small fw-medium">{row.value}</p>
        ))}
      </div>
    </div>
  </div>
))}

                  {/* Experience Centers Card (Full Width) */}
                  {/* <div className="col-md-12">
                    <div className="contact-info-card flex-column align-items-start gap-3">
                      <div className="d-flex align-items-center gap-3 w-100 border-bottom pb-3"> */}
                         {/* <div className="contact-icon-wrapper">
                           <FaStore />
                         </div>
                         <h4 className="contact-card-title mb-0 fs-4">Experience Centers</h4>
                      </div>
                      
                      <div className="row g-4 w-100 pt-2">
                        <div className="col-md-6">
                          <h6 className="font-outfit fw-bold mb-1" style={{color: '#ff914d', fontSize: '15px'}}>Noida</h6>
                          <p className="contact-card-text small">
                            H101, LGF, Sector-63, Noida, Uttar Pradesh - 201301
                          </p>
                        </div> */}
                        
                        {/* Gurugram 1
                        <div className="col-md-6">
                          <h6 className="font-outfit fw-bold mb-1" style={{color: '#ff914d', fontSize: '15px'}}>Gurugram (JMD Galleria)</h6>
                          <p className="contact-card-text small">
                            4th Floor, Unit Nos. 402, Sector-47 & 48, Sohna - Gurgaon Rd, Haryana - 122001
                          </p>
                        </div> */}
                        
                        {/* Gurugram 2 */}
                        {/* <div className="col-md-6">
                          <h6 className="font-outfit fw-bold mb-1" style={{color: '#ff914d', fontSize: '15px'}}>Gurugram (DDC Arcade)</h6>
                          <p className="contact-card-text small">
                            1st Floor, Plot No 1 Main, Sector 48 Road, Badshahpur Sohna Rd, Haryana - 122018
                          </p>
                        </div>
                        
                        
                        <div className="col-md-6">
                          <h6 className="font-outfit fw-bold mb-1" style={{color: '#ff914d', fontSize: '15px'}}>Faridabad</h6>
                          <p className="contact-card-text small">
                            1st Floor, Plot No 24, near old Faridabad Metro Station, Sector 20A, Haryana - 121002
                          </p>
                        </div> */}

                        {/* Experience Centers Card (Full Width) */}
<div className="col-md-12">
  <div className="contact-info-card flex-column align-items-start gap-3">
    <div className="d-flex align-items-center gap-3 w-100 border-bottom pb-3">
       <div className="contact-icon-wrapper">
         <RenderIcon name={experienceCenters.icon} />
       </div>
       <h4 className="contact-card-title mb-0 fs-4">{experienceCenters.heading}</h4>
    </div>

    <div className="row g-4 w-100 mx-0 pt-2">
      {experienceCenters.centers.map((center) => (
        <div className="col-md-6" key={center.id}>
          <h6 className="font-outfit fw-bold mb-1" style={{color: '#ff914d', fontSize: '15px'}}>
            {center.heading}
          </h6>
          <p className="contact-card-text small">
            {center.address}
          </p>
        </div>
      ))}
    </div>
  </div>
</div>
                      {/* </div>
                    </div>
                  </div> */}

                </div>
              </div>

              {/* RIGHT: Contact Form Component */}
              <div className="col-lg-5">
                <div className="form-wrapper-card h-100 sticky-lg-top" style={{top: '100px', zIndex: '5'}}>
                  <h3 className="font-outfit fw-bold text-dark mb-4 text-center">Send a Message</h3>
                  <ContactForm mapSrc="https://www.google.com/maps?q=H101,+LGF,+Sector-63,+Noida,+Uttar+Pradesh-+201301&output=embed" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- MAP SECTION --- */}
        <div className="mt-5">
          <MapSection locations={mapSection?.locations ?? []} heading={mapSection?.heading} />
        </div>
        
      </main>
    </MainLayout>
  );
}