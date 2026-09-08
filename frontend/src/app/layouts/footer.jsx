"use client";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaPinterest,
  FaWhatsapp
} from "react-icons/fa";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { Fragment } from "react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const [footerlink, setData] = useState([]);
  const [settings, setSettings] = useState({});
  const currentYear = new Date().getFullYear();
  
  const [allProfilesData, setAllProfilesData] = useState({});
const [visibilityRules, setVisibilityRules] = useState([]);
const pathname = usePathname();

useEffect(() => {

  const fetchFooterProfiles = async () => {
  try {
    const res = await api.get("/cms-content/footer_profiles");
    const record = Array.isArray(res.data) ? res.data[0] : res.data;
    let parsed = record?.json_content;
    if (parsed && typeof parsed === "object" && typeof parsed.json_content === "string") {
      parsed = JSON.parse(parsed.json_content);
    } else if (typeof parsed === "string") {
      try { parsed = JSON.parse(parsed); } catch { parsed = {}; }
    }
    setAllProfilesData(parsed || {});
  } catch (err) { console.error("Error fetching footer profiles:", err); }
};

const fetchVisibilityRules = async () => {
  try {
    const res = await api.get("/cms-content/footer_page_rules");
    const record = Array.isArray(res.data) ? res.data[0] : res.data;
    let parsed = record?.json_content;
    if (parsed && typeof parsed === "object" && typeof parsed.json_content === "string") {
      parsed = JSON.parse(parsed.json_content);
    } else if (typeof parsed === "string") {
      try { parsed = JSON.parse(parsed); } catch { parsed = []; }
    }
    setVisibilityRules(Array.isArray(parsed) ? parsed : []);
  } catch (err) { console.error("Error fetching visibility rules:", err); }
};

  fetchFooterProfiles();
  fetchVisibilityRules();
}, []);
const matchesPattern = (pattern, path) =>
  pattern === "/" ? path === "/" :
  pattern.endsWith("/*") ? path.startsWith(pattern.slice(0, -2)) :
  path === pattern;

const matchedRule = visibilityRules.find(r => matchesPattern(r.pattern, pathname));
const shouldHide = matchedRule?.type === "hidden";
const resolvedProfileKey = matchedRule?.profileKey || "default";
const cmsFooter = allProfilesData[resolvedProfileKey] || allProfilesData["default"] || null;

  useEffect(() => {
    // 1. Fetch Footer Links
    const fetchfooterlink = async () => {
      try {
        const response = await api.get("/footer-link");
        
        const priorityOrder = [
          "Noida", 
          "Ghaziabad", 
          "Greater Noida", 
          "Delhi", 
          "Dwarka", 
          "Faridabad", 
          "Gurugram", 
          "Manesar"
        ];

        const sortedLinks = response.data.sort((a, b) => {
          const indexA = priorityOrder.findIndex(city => 
            a.title.toLowerCase().includes(city.toLowerCase())
          );
          const indexB = priorityOrder.findIndex(city => 
            b.title.toLowerCase().includes(city.toLowerCase())
          );
          
          const safeIndexA = indexA === -1 ? 999 : indexA;
          const safeIndexB = indexB === -1 ? 999 : indexB;
          
          return safeIndexA - safeIndexB;
        });

        setData(sortedLinks);
      } catch (err) {
        console.error("Error fetching SEO data:", err);
      }
    };

    // 2. Fetch Site Settings
    const fetchSiteSettings = async () => {
      try {
        const response = await api.get("/site-settings");
        let rawData = response.data?.data || response.data;
        const settingsData = Array.isArray(rawData) ? rawData[0] : rawData;
        
        if(settingsData) {
          setSettings(settingsData);
        }
      } catch (err) {
        console.error("Error fetching Site Settings:", err);
      }
    };

    fetchfooterlink();
    fetchSiteSettings();
    // fetchCmsFooter();
  }, [resolvedProfileKey]);

    const verticalColumns = cmsFooter?.verticalColumns || [];
  const horizontalSections = cmsFooter?.horizontalSections || [];
  const bottomBar = cmsFooter?.bottomBar || {};
  const footerSettings = cmsFooter?.footerSettings || { backgroundColor: "#ffffff" };

  if (shouldHide) return null;

  const hasVerticalColumns = verticalColumns.length > 0;
const hasBottomBarContent = !!(
  bottomBar.copyright ||
  (bottomBar.legalLinks?.length > 0) ||
  bottomBar.socials?.facebook || settings?.facebook_url ||
  bottomBar.socials?.instagram || settings?.instagram_url ||
  bottomBar.socials?.twitter || settings?.twitter_url ||
  bottomBar.socials?.linkedin || settings?.linkedin_url ||
  bottomBar.socials?.whatsapp || settings?.whatsapp_url ||
  bottomBar.socials?.pinterest || settings?.pinterest_url ||
  bottomBar.socials?.youtube || settings?.youtube_url
);
const hasHorizontalSections = horizontalSections.length > 0;
const hasAnythingAboveHorizontal = hasVerticalColumns || hasBottomBarContent;
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `

      .footer-desc-content ul { list-style: disc; padding-left: 1.2rem; margin-bottom: 0; }
.footer-desc-content ol { list-style: decimal; padding-left: 1.2rem; margin-bottom: 0; }
.footer-desc-content p { margin-bottom: 0.5rem; }
.footer-desc-content a { color: inherit !important; text-decoration: none; }
.footer-desc-content a:hover { color: #ff914d !important; }

      .footer_wrapper h1, 
.footer_wrapper h2, 
.footer_wrapper h3, 
.footer_wrapper h4, 
.footer_wrapper h5, 
.footer_wrapper h6 {
  font-weight: 600; 
    margin-bottom: 0.15rem;
    color: var(--dynamic-footer-text);
}

.footer_wrapper h1 { font-size: 1.5rem; }
  .footer_wrapper h2 { font-size: 1.35rem; }
  .footer_wrapper h3 { font-size: 1.2rem; }
  .footer_wrapper h4 { font-size: 1.1rem; font-weight: 600; }
  .footer_wrapper h5 { font-size: 0.95rem; font-weight: 600; }
  .footer_wrapper h6 { font-size: 0.875rem; font-weight: 600; }

  .footer_wrapper p.footer_title_p {
    font-size: 13.5px !important;
    font-weight: 600 !important;
    margin-bottom: 0.25rem !important;
    color: var(--dynamic-footer-text);
  }

  .footer_li a, 
  .footer_wrapper .font-quicksand a, 
  .footer_wrapper .font-quicksand p, 
  .footer_wrapper .font-quicksand div {
    font-size: 13.5px !important;
    font-weight: 400 !important;
    line-height: 1.4;
  }

//   .footer_li a, 
// .footer_wrapper .font-quicksand a, 
// .footer_wrapper .font-quicksand p:not(.footer-desc-content p), 
// .footer_wrapper .font-quicksand div:not(.footer-desc-content *) {
//   font-size: 13.5px !important;
//   font-weight: 400 !important;
//   line-height: 1.4;
// }

  /* Prevent contact details from inheriting bold weights */
  .footer_contact_link {
    font-size: 13.5px !important;
    font-weight: 400 !important;
    color: var(--dynamic-footer-text) !important;
  }

  .footer-social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #f1f5f9;
    color: #475569;
    text-decoration: none !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .footer-social-btn:hover { transform: translateY(-3px); }
  
  /* 1. Added !important to colors so they override any global link hover colors */
  .footer-social-btn.fb:hover { background-color: #1877F2 !important; color: white !important; box-shadow: 0 6px 12px rgba(24, 119, 242, 0.3); }
  .footer-social-btn.ig:hover { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%) !important; color: white !important; box-shadow: 0 6px 12px rgba(214, 36, 159, 0.3); }
  .footer-social-btn.tw:hover { background-color: #000000 !important; color: white !important; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); }
  .footer-social-btn.in:hover { background-color: #0A66C2 !important; color: white !important; box-shadow: 0 6px 12px rgba(10, 102, 194, 0.3); }
  .footer-social-btn.pi:hover { background-color: #E60023 !important; color: white !important; box-shadow: 0 6px 12px rgba(230, 0, 35, 0.3); }
  .footer-social-btn.yt:hover { background-color: #FF0000 !important; color: white !important; box-shadow: 0 6px 12px rgba(255, 0, 0, 0.3); }
  .footer-social-btn.wa:hover { background-color: #25D366 !important; color: white !important; box-shadow: 0 6px 12px rgba(37, 211, 102, 0.3); }
  
  .footer_wrapper {
    background-color: var(--dynamic-footer-bg) !important;
    color: var(--dynamic-footer-text) !important;
  }

  /* 2. Global Hover effect - strictly excluding underlines and social/policy classes */
  .footer_wrapper a {
    text-decoration: none !important;
    color: var(--dynamic-footer-text);
  }
  .footer_wrapper a:not(.btn):not(.footer-social-btn):not(.footer-policy-link):not(.designed-by-link):hover {
    color: #ff914d !important;
    text-decoration: none !important;
  }

  /* 3. Updated Policy Links to turn black on hover with no underline */
  .footer-policy-link {
    color: #ff4d4d !important;
    text-decoration: none !important;
  }
  .footer-policy-link:hover {
    color: #000000 !important;
    text-decoration: none !important;
  }

  .footer_wrapper h1, 
  .footer_wrapper h2, 
  .footer_wrapper h3, 
  .footer_wrapper h4, 
  .footer_wrapper h5, 
  .footer_wrapper h6, 
  .footer_wrapper p, 
  .footer_wrapper span, 
  .footer_wrapper div {
    color: var(--dynamic-footer-text);
  }

  .footer_wrapper .footer_heading,
.footer_wrapper .footer_heading_link,
.footer_wrapper .footer_title_p,
.footer_wrapper .footer_title_p a,
.footer_wrapper .footer_title_p span,
.footer_wrapper .footer_heading a,
.footer_wrapper h1, .footer_wrapper h1 a,
.footer_wrapper h2, .footer_wrapper h2 a,
.footer_wrapper h3, .footer_wrapper h3 a,
.footer_wrapper h4, .footer_wrapper h4 a,
.footer_wrapper h5, .footer_wrapper h5 a,
.footer_wrapper h6, .footer_wrapper h6 a {
  color: var(--dynamic-footer-text) !important;
}
  .footer-bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
  }

  .hover-orange {
    color: inherit;
    transition: color 0.3s ease;
  }

  .hover-orange:hover {
    color: #f97316;
  }

  /* 4. Ensure horizontal section action words have no underline on hover */
  .action-word-link {
    font-weight: 400 !important;
    color: inherit !important;
    text-decoration: none !important;
  }
  .action-word-link:hover {
    color: #ff914d !important;
    text-decoration: none !important; 
  }
    .footer_li, 
  .footer_li a {
    font-size: 13.5px !important;
    font-weight: 400 !important; /* Overrides bold font weights */
    line-height: 1.4 !important;
  }

  .designed-by-link {
    color: var(--dynamic-footer-text) !important;
    transition: color 0.3s ease;
  }
  
 .footer_wrapper .designed-by-link:hover {
    color: #000000 !important;
  }

  .footer_wrapper .hz-section-heading {
  font-size: 15px !important;
  font-weight: 700 !important;
  line-height: 1.4 !important;
}

// .footer-linkcloud-para {
//   margin: 0;
//   line-height: 1.9;
// }
// .footer-linkcloud-para .cloud-link-item {
//   display: inline;
//   white-space: nowrap;
// }
// .footer-linkcloud-para .cloud-link-item:not(:first-child)::before {
//   content: "\\2022";
//   display: inline-block;
//   margin: 0 8px;
//   color: var(--dynamic-footer-text);
//   opacity: 0.7;
// }
// .footer-linkcloud-para a,
// .footer-linkcloud-para a:link,
// .footer-linkcloud-para a:visited {
//   color: var(--dynamic-footer-text) !important;
//   text-decoration: none !important;
// }
// .footer-linkcloud-para a:hover,
// .footer-linkcloud-para a:focus,
// .footer-linkcloud-para a:active {
//   color: #ff914d !important;
//   text-decoration: none !important;
// }
//   .footer-linkcloud-para a {
//   color: var(--dynamic-footer-text) !important;
//   text-decoration: none !important;
// }
// .footer-linkcloud-para a:hover {
//   color: #ff914d !important;
//   text-decoration: none !important;
// }

.footer-linkcloud-container {
  margin: 0;
  line-height: 2.0; /* Adjust this value for vertical spacing between lines */
}

.cloud-link-item {
  display: inline; /* Keeps them flowing together like a paragraph */
  word-break: break-word;
}

/* This adds the dot after every item exactly like your inspect screenshot */
// .cloud-link-item::after {
//   content: "\\2022"; /* Unicode for a bullet point */
//   display: inline-block;
//   font-size: 20px;
//   margin: 0 10px; /* Spacing around the dot */
//   color: inherit;
//   opacity: 0.6;
//   vertical-align: middle;
//   line-height: 1;
// }

.cloud-link-item::before {
  content: "\\2022";
  display: inline-block;
  font-size: 18px; /* Increases the bullet size */
  margin: 0 8px 0 0; /* Spacing around the bullet */
  color: inherit;
  opacity: 0.6;
  vertical-align: middle; /* Keeps the larger bullet aligned with the text */
  line-height: 1; /* Prevents the bullet from altering paragraph line height */
  position: relative;
  top: -1px;  
}

.cloud-link-item a {
  margin-right: 8px;   /* space after the link text, before the next bullet */
}
  .cloud-link-item:last-child a {
  margin-right: 0;     /* no trailing space after the last link */
}
// .cloud-link-item:first-child::before {
//   margin-left: 0;
// }

/* Removes the dot from the very last link in the cloud */
// .cloud-link-item:last-child::after {
//   content: "";
//   // margin: 0;
// }
  @media (max-width: 991px) {
  .footer_wrapper {
    padding-bottom: 80px !important; /* Adjust height based on your bottom nav bar */
  }
  //   .footer-linkcloud-container {
  //   padding-left: 16px !important;
  //   padding-right: 16px !important;
  // }
}

`}} />

      <div className="footer_wrapper pb-0 position-relative" style={{ "--dynamic-footer-bg": footerSettings?.backgroundColor || "#ffffff", "--dynamic-footer-text": footerSettings?.textColor || "#171717" }}>
        <div className="container">
          
          {/* ==================== 1. VERTICAL SECTION ==================== */}
          {hasVerticalColumns && (
          <div className="py-5 pb-0 mx-0 row justify-content-center">
            <div className="col-lg-10">
              <div className="row justify-content-lg-center g-4">
                
                {verticalColumns.length > 0 ? (
                  verticalColumns.map((col, index) => (
                    <div key={col.id || index} className="col-lg-3 col-md-4 col-6">
                      
                      {/* Column 1 Brand Logo */}
                      {index === 0 && col.logoUrl && (
                        <div style={{ marginBottom: "40px" }}>
                          <a href={col.homeUrl || "/"} aria-label="Home">
                            <Image
                              src={col.logoUrl}
                              alt="High Creation Interior Logo"
                              className="img-fluid"
                              width={150}
                              height={150}
                              priority
                              data-no-lazy="1"
                              style={{ maxWidth: "180px", mixBlendMode: "multiply" }}
                            />
                          </a>
                        </div>
                      )}

                        {(col.blocks || []).map((block, bIndex) => {
  const isTextTag =
    block.headingTag === "p" ||
    block.headingTag === "span" ||
    block.headingTag === "text";

  const HeadingTag = isTextTag
    ? "p"
    : (block.headingTag || "h4");
  const firstLinksIndex = (col.blocks || []).findIndex(
    (b) => b.type === "links"
  );

  const shouldShowTitle =
    index !== 1 &&
    index !== 2
      ? !!block.title
      : (
          !!block.title &&
          (block.type !== "links" || bIndex === firstLinksIndex)
        );

  return (
    <div key={block.id || bIndex} className={index === 3 ? "" : "mb-3"} style={index === 3 ? { marginBottom: "16px" } : {}}>
      {shouldShowTitle && (
        isTextTag ? (
          <p className="footer_title_p font-poppins" style={{ marginBottom: index === 3 ? "4px" : "2px", color: footerSettings?.textColor || "#171717" }}>
            {block.url ? (
              <a href={block.url} className="footer_heading_link" style={{ color: footerSettings?.textColor || "#171717" }}>
                {block.title}
              </a>
            ) : (
              <span className="footer_heading_link" style={{ color: footerSettings?.textColor || "#171717" }}>{block.title}</span>
            )}
          </p>
        ) : (
          <HeadingTag className="footer_heading font-outfit fw-bold" style={{ color: footerSettings?.textColor || "#171717", marginBottom: index === 3 ? "4px" : "" }}>
            {block.url ? (
              <a href={block.url} className="footer_heading_link" style={{ color: footerSettings?.textColor || "#171717" }}>
                {block.title}
              </a>
            ) : (
              block.title
            )}
          </HeadingTag>
        )
      )}

      {/* TYPE 1: Contact Details */}
      {block.type === "contact" && (
        <div className="pt-0 font-quicksand" style={{ marginTop: "-8px", paddingBottom: (block.emails || []).some(Boolean) ? "2px" : "0px"}}>
          {(block.emails || []).map((email, eIdx) => email && (
            <p key={eIdx} style={{ paddingTop: eIdx === 0 && (block.emails || []).some(Boolean) ? "20px" : "0px" }}>
              <a href={`mailto:${email}`} className="footer_contact_link d-inline-block">
                {email}
              </a>
            </p>
          ))}
          {(block.phones || []).map((phone, pIdx) => phone && (
            <p key={pIdx} style={{ paddingTop: pIdx === 0 && (block.phones || []).some(Boolean) ? "20px" : "0px" }}>
              <a href={`tel:${phone.trim()}`} className="text-black footer_contact_link d-inline-block">
                {phone.trim()}
              </a>
            </p>
          ))}
        </div>
      )}

      {/* TYPE 2: Navigation Links */}
      {block.type === "links" && (
        <ul className="list-unstyled ps-0 font-quicksand mt-0" style={{ marginBottom: 0 }}>
          {(block.links || []).map((link, lIdx) => (
            <li key={lIdx} className="footer_li" style={{ 
              marginBottom: index === 3 
                ? (lIdx === (block.links || []).length - 1 ? "0px" : "16px") 
                : ((index === 1 || index === 2) ? "14px" : "0px") 
            }}>
              {index === 3 && (!link.url || link.url.trim() === "") ? (
                <span className="fw-normal" style={{ color: "inherit", display: "inline-block" }}>
                  {link.label}
                </span>
              ) : (
                <a href={link.url || "#"} className="fw-normal">
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* TYPE 3: Text / Address Content */}
      {block.type === "text" && (
        <div className="font-quicksand pt-0" style={{ whiteSpace: "pre-line", fontSize: "13.5px", lineHeight: "1.4" }}>
          {block.content}
        </div>
      )}
    </div>
  );
                      })}
                    </div>
                  ))
                ) :  null}

              </div>
            </div>
          </div>
)}

          {/* LINE DIVIDER 1 */}
{hasVerticalColumns && hasBottomBarContent && (
  <div className="col-lg-10 mx-auto">
    <hr className="my-4" />
  </div>
)}

          {/* ==================== 2. BOTTOM BAR & SOCIAL LINKS ==================== */}
          {hasBottomBarContent && (
          <div className="col-lg-10 mx-auto px-3 px-lg-0">
            <div className="d-flex flex-column flex-lg-row justify-content-center justify-content-lg-between align-items-center gap-2 py-2 text-center">
              
              {/* Left: Legal Links */}
              <div>
                <ul className="list-unstyled d-flex flex-wrap justify-content-center mb-0 font-quicksand align-items-center">
                  {bottomBar.legalLinks?.length > 0 &&
  bottomBar.legalLinks.map((lLink, idx) => (
    <li key={idx} className={`footer_li  ${idx > 0 ? "border-start ps-2 ms-2 " : ""}`}>
      <a href={lLink.url} className="footer-policy-link">
        {lLink.label}
      </a>
    </li>
  ))
}
                </ul>
              </div>

              {/* Center: Copyright Text */}
              <div>
                {bottomBar.copyright && (
  <p className="mb-0 team_description font-quicksand text-center" style={{ fontSize: "12px" }}>
    {bottomBar.copyright}
  </p>
)}
              </div>

              {/* Right: Social Icons */}
              <div>
                <div className="social-links d-flex flex-wrap gap-2 my-0">
                    {(bottomBar.socials?.facebook || settings?.facebook_url) && (
                        <a href={bottomBar.socials?.facebook || settings?.facebook_url} target="_blank" rel="noopener noreferrer" className="footer-social-btn fb" aria-label="Facebook">
                            <FaFacebookF size={14} />
                        </a>
                    )}
                    {(bottomBar.socials?.instagram || settings?.instagram_url) && (
                        <a href={bottomBar.socials?.instagram || settings?.instagram_url} target="_blank" rel="noopener noreferrer" className="footer-social-btn ig" aria-label="Instagram">
                            <FaInstagram size={14} />
                        </a>
                    )}
                    {(bottomBar.socials?.twitter || settings?.twitter_url) && (
                        <a href={bottomBar.socials?.twitter || settings?.twitter_url} target="_blank" rel="noopener noreferrer" className="footer-social-btn tw" aria-label="X (Twitter)">
                            <FaTwitter size={14} />
                        </a>
                    )}
                    {(bottomBar.socials?.linkedin || settings?.linkedin_url) && (
                        <a href={bottomBar.socials?.linkedin || settings?.linkedin_url} target="_blank" rel="noopener noreferrer" className="footer-social-btn in" aria-label="LinkedIn">
                            <FaLinkedin size={14} />
                        </a>
                    )}
                    {bottomBar.socials?.pinterest && (
                        <a href={bottomBar.socials.pinterest} target="_blank" rel="noopener noreferrer" className="footer-social-btn pi" aria-label="Pinterest">
                            <FaPinterest size={14} />
                        </a>
                    )}
                    {bottomBar.socials?.youtube && (
                        <a href={bottomBar.socials.youtube} target="_blank" rel="noopener noreferrer" className="footer-social-btn yt" aria-label="YouTube">
                            <FaYoutube size={14} />
                        </a>
                    )}
                    {bottomBar.socials?.whatsapp && (
                        <a href={bottomBar.socials.whatsapp} target="_blank" rel="noopener noreferrer" className="footer-social-btn wa" aria-label="WhatsApp">
                            <FaWhatsapp size={14} />
                        </a>
                    )}
                </div>
              </div>

            </div>
          </div>
          )}

         {/* LINE DIVIDER 2 */}
{hasBottomBarContent && hasHorizontalSections && (
  <div className="col-lg-10 mx-auto">
    <hr className="my-3" />
  </div>
)}

          {/* ==================== 3. HORIZONTAL SECTION ==================== */}
          {horizontalSections.length > 0 && (
            <div className="col-lg-10 mx-auto mb-4 font-quicksand">
              {horizontalSections.map((sec, idx) => {
                const validTags = ["h1", "h2", "h3", "h4", "h5", "h6"];
                const rawTag = sec.headingTag ? String(sec.headingTag).toLowerCase() : "h6";
                const HorizontalHeading = validTags.includes(rawTag) ? rawTag : "h6";

                return (
                  <div key={sec.id || idx} className="mb-3">
                    {sec.type === "standard" && (
                      <div>
                        {sec.title && (
                          <HorizontalHeading className="hz-section-heading footer_heading fw-bold mb-0" style={{ color: footerSettings?.textColor || "#171717", fontSize: "15px", fontWeight: 700, lineHeight: 1.4 }}>
                            {sec.title}
                          </HorizontalHeading>
                        )}

{sec.description && (
  <div
    className="mb-1 footer-desc-content"
    dangerouslySetInnerHTML={{ __html: sec.description }}
  />
)}
                      </div>
                    )}

                    {sec.type === "linkCloud" && (
                      <div>
                        {sec.title && (
                          <HorizontalHeading className="hz-section-heading footer_heading fw-bold mb-0" style={{ color: footerSettings?.textColor || "#171717" }}>
                            {sec.title}
                          </HorizontalHeading>
                        )}
                        {/* <ul className="m-0 ps-3" style={{
  listStyleType: "disc",
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  columnGap: "10px",
  rowGap: "2px",
}}> */}

{/* <ul className="d-flex flex-wrap m-0 ps-3" style={{ listStyleType: "disc", columnGap: "10px", rowGap: "2px" }}>
                          {(sec.cloudLinks || []).map((cLink, cIdx) => (
                            <li key={cIdx} style={{ display: "list-item", listStylePosition: "inside" }} >
                              <a href={cLink.url} className="small">
                                {cLink.label}
                              </a>
                            </li>
                          ))}
                        </ul> */}

                        <div className="footer-linkcloud-container mb-0">
  {(sec.cloudLinks || []).map((cLink, cIdx) => (
    <span key={cIdx} className="cloud-link-item">
      <a href={cLink.url} className="small">
        {cLink.label}
      </a>
    </span>
  ))}
</div>
                        
                        {/* <p className="footer-linkcloud-para small mb-0">
  {(sec.cloudLinks || []).map((cLink, cIdx) => (
    <span key={cIdx} className="cloud-link-item">
      <a href={cLink.url} className="small">
        {cLink.label}
      </a>
    </span>
  ))}
</p> */}
                      </div>
                    )}
                    {idx < horizontalSections.length - 1 && <hr className="my-3 text-muted opacity-50" />}
                  </div>
                );
              })}
            </div>
          )}

          {bottomBar.designedBy && <hr className="section-divider" />} 

          {/* ==================== 4. DESIGNED BY CREDIT ==================== */}
          {bottomBar.designedBy && (
  <div className="col-lg-10 mx-auto pb-4">
    <p className="text-center text-lg-end team_description font-quicksand mb-0" style={{ fontSize: "13px" }}>
      {`Designed By `}
      <a href="#" className="fw-bold text-decoration-none designed-by-link">
        {bottomBar.designedBy}
      </a>
    </p>
  </div>
)}

        </div>
      </div>
    </>
  );
};

export default Footer;
