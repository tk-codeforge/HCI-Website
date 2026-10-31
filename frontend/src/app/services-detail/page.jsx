// import { notFound } from "next/navigation";
// import MainLayout from "../layouts/MainLayout";
// import { defaultAltText } from "@/utils/helper";
// import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
// import Image from "next/image"; 
// import Link from "next/link";
// import DOMPurify from "isomorphic-dompurify";

// import { 
//   FaMapMarkerAlt, FaArrowRight, FaPhoneAlt, FaEnvelope, FaUser, 
//   FaShieldAlt, FaGem, FaClock, FaTrophy, FaStar, FaAward, 
//   FaCheckCircle, FaWallet, FaTools, FaDraftingCompass, FaHardHat, FaHome,
//   FaWhatsapp, FaPlus, FaChevronDown, 
//   FaSmile, FaUsers, FaCalendarAlt 
// } from "react-icons/fa";

// // Add wildcard import for dynamic icon rendering
// import * as FaIcons from "react-icons/fa";

// import { getBackendImageUrl } from "@/utils/helper";
// import { SidebarForm, BottomContactForm } from "./CityForms";
// import { getPageSEO } from "@/utils/getSEO";
// import { cityUrlMap } from "@/utils/cityRoutes";
// const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
// const safeTag = (t, fallback) => (HEADING_TAGS.includes(t) ? t : fallback);

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";

// // City Banner Map for dynamic nearby cities images
// const cityBannerMap = {
//   "delhi": "/images/nearby cities/Delhi.png",
//   "faridabad": "/images/nearby cities/Faridabad.png",
//   "gurugram": "/images/nearby cities/Gurugram.png",
//   "noida": "/images/nearby cities/Noida.png",
//   "greater_noida": "/images/nearby cities/Greater Noida.png",
// };

// // Sub-City Logic for the new sidebar widget
// const subCitiesMap = {
//   "noida": [
//     { name: "Sector 150", link: "/interior-designers-in-noida-sector-150" },
//     { name: "Sector 137", link: "/interior-designers-in-noida-sector-137" },
//     { name: "Sector 74", link: "/interior-designers-in-noida-sector-74" },
//     { name: "Sector 75", link: "/interior-designers-in-noida-sector-75" },
//     { name: "Sector 143", link: "/interior-designers-in-noida-sector-143" },
//     { name: "Sector 104", link: "/interior-designers-in-noida-sector-104" },
//     { name: "Sector 50", link: "/interior-designers-in-noida-sector-50" },
//     { name: "Sector 93A", link: "/interior-designers-in-noida-sector-93a" },
//     { name: "Sector 128", link: "/interior-designers-in-noida-sector-128" },
//     { name: "Sector 44", link: "/interior-designers-in-noida-sector-44" },
//   ],
//   "gurugram": [
//     { name: "Golf Course Road", link: "/interior-designers-in-gurgaon-golf-course-road" },
//     { name: "DLF Phase 1", link: "/interior-designers-in-gurgaon-dlf-phase-1" },
//     { name: "DLF Phase 5", link: "/interior-designers-in-gurgaon-dlf-phase-5" },
//     { name: "Sector 56", link: "/interior-designers-in-gurgaon-sector-56" },
//     { name: "Sector 65", link: "/interior-designers-in-gurgaon-sector-65" },
//     { name: "Sohna Road", link: "/interior-designers-in-gurgaon-sohna-road" },
//     { name: "Sector 54", link: "/interior-designers-in-gurgaon-sector-54" },
//     { name: "Sector 57", link: "/interior-designers-in-gurgaon-sector-57" },
//   ],
//   "delhi": [
//     { name: "Vasant Vihar", link: "/interior-designers-in-delhi-vasant-vihar" },
//     { name: "Dwarka", link: "/interior-designers-in-dwarka" },
//     { name: "South Extension", link: "/interior-designers-in-delhi-south-extension" },
//     { name: "Greater Kailash", link: "/interior-designers-in-delhi-greater-kailash" },
//     { name: "Defence Colony", link: "/interior-designers-in-delhi-defence-colony" },
//     { name: "Hauz Khas", link: "/interior-designers-in-delhi-hauz-khas" },
//     { name: "Punjabi Bagh", link: "/interior-designers-in-delhi-punjabi-bagh" },
//     { name: "Rohini", link: "/interior-designers-in-delhi-rohini" },
//     { name: "Janakpuri", link: "/interior-designers-in-delhi-janakpuri" },
//   ]
// };

// // --- DATA FETCHERS ---
// async function getCityData(city) {
//   try {
//     const res = await fetch(`${API_BASE_URL}/cms-city/${city}`, { next: { revalidate: 60 } });
//     if (!res.ok) return null;
//     return await res.json();
//   } catch (error) { return null; }
// }

// async function getRecentBlogs() {
//   try {
//     const res = await fetch(`${API_BASE_URL}/cms-blog`, { next: { revalidate: 60 } });
//     if (!res.ok) return [];
//     const data = await res.json();
//     return Array.isArray(data) ? data.slice(0, 4) : [];
//   } catch (error) { return []; }
// }

// // Replaced previous homeContent fetcher with the dynamic Excellence Stats fetcher
// async function getExcellenceStats() {
//   try {
//     const timestamp = new Date().getTime();
//     const res = await fetch(`${API_BASE_URL}/cms-content/excellence_stats?t=${timestamp}`, { 
//       cache: "no-store",
//       headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
//     });
//     if (!res.ok) return null;
//     const data = await res.json();
//     const record = Array.isArray(data) ? data[0] : data;
//     if (record && record.json_content) {
//       const jsonContent = typeof record.json_content === "string" 
//         ? JSON.parse(record.json_content) 
//         : record.json_content;
//       return jsonContent?.items || null;
//     }
//     return null;
//   } catch (error) { 
//     return null; 
//   }
// }

// const parseJsonSafe = (data) => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   try { return JSON.parse(data); } catch (e) { return []; }
// };

// // --- SEO METADATA ---
// export async function generateMetadata({ searchParams }) {
//   const city = searchParams?.city && searchParams.city !== "undefined" ? searchParams.city : "delhi";
//   // const fallbackPath = cityUrlMap[city] || `/services-detail/${city}`;
//   const fallbackPath = cityUrlMap[city] || `/interior-designers-in-${city}`;
  
//   const [pageData, seoData] = await Promise.all([
//     getCityData(city),
//     getPageSEO(fallbackPath).catch(() => null)
//   ]);

//   const canonicalUrl = getCanonicalUrl({ 
//     canonicalUrl: seoData?.alternates?.canonical || pageData?.seo_content?.canonical_url, 
//     fallbackPath 
//   });

//   if (!pageData) return { title: "Services", robots: { index: false, follow: true } };


//     const title =
//     seoData?.title || pageData?.seo_content?.meta_title || `${pageData.main_title} - Services`;
//   const description =
//     seoData?.description || pageData?.seo_content?.meta_description || "Best Interior Design Services";

//   // share image: SEO Manager OG image > this city's hero banner > logo
//   const og = seoData?.openGraph;
//   const ogImages = og?.images?.length
//     ? og.images
//     : [{ url: pageData?.banner_image ? getBackendImageUrl(pageData.banner_image) : "/images/new_hc_logo.png" }];

//   return {
//     title,
//     description,
//     keywords: seoData?.keywords || pageData?.seo_content?.meta_keywords || "",
//     alternates: { canonical: canonicalUrl },
//     robots: seoData?.robots || getRobotsDirectives(pageData?.seo_content),
//     openGraph: {
//       title: og?.title || title,
//       description: og?.description || description,
//       url: canonicalUrl,
//       siteName: "High Creation Interior",
//       locale: "en_IN",
//       type: "website",
//       images: ogImages,
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: seoData?.twitter?.title || og?.title || title,
//       description: seoData?.twitter?.description || og?.description || description,
//       images: seoData?.twitter?.images?.length
//         ? seoData.twitter.images
//         : ogImages.map((i) => i.url),
//     },
//   };
// }

// const ServicesDetailPage = async ({ searchParams }) => {
//   const city = searchParams?.city && searchParams.city !== "undefined" ? searchParams.city : "delhi";
//   // const fallbackPath = cityUrlMap[city] || `/services-detail/${city}`;
//   const fallbackPath = cityUrlMap[city] || `/interior-designers-in-${city}`;

//   // Fetch Data + Global SEO schemas + Dynamic Excellence Stats concurrently
//   const [pageData, recentBlogs, seoData, excellenceStats] = await Promise.all([
//     getCityData(city),
//     getRecentBlogs(),
//     getPageSEO(fallbackPath).catch(() => null),
//     getExcellenceStats()
//   ]);
  
//   if (!pageData) notFound(); 

//   const customSchema = seoData?.customSchema;
//   const safeDescription = pageData?.main_description ? DOMPurify.sanitize(pageData.main_description) : "";
//   const safeSideDescription = pageData?.side_description ? DOMPurify.sanitize(pageData.side_description) : "";
//   const HeroTag = safeTag(pageData?.banner_title ? pageData?.banner_title_tag : pageData?.main_title_tag, "h1");
// const SideTag = safeTag(pageData?.side_title_tag, "h3");
  
//   const displayCity = city.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   const faqs = parseJsonSafe(pageData.faqs);

//   const otherCities = Object.keys(cityUrlMap).filter(c => c !== city).slice(0, 3);
  
//   // Localities Logic for Sidebar Widget
//   const currentSubCities = subCitiesMap[city] || [];
//   const initialSubCities = currentSubCities.slice(0, 6);
//   const hiddenSubCities = currentSubCities.slice(6);

//   return (
//     <MainLayout>
//       {/* Inject the Custom Schema from the Global SEO Tag Manager */}
//       {customSchema && (
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ 
//             __html: typeof customSchema === 'string' 
//               ? customSchema.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '') 
//               : JSON.stringify(customSchema)
//           }}
//         />
//       )}

//       {/* Legacy Fallback (Inner Custom Code) */}
//       {pageData?.seo_content?.custom_code && (
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ 
//             __html: pageData.seo_content.custom_code.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '') 
//           }}
//         />
//       )}
//       <style dangerouslySetInnerHTML={{__html: `
//         :root { --hc-primary: #ff914d; --hc-dark: #0f172a; }
//         .font-outfit { font-family: var(--font-outfit), sans-serif; }
//         .font-poppins { font-family: var(--font-poppins), sans-serif; }
//         .text-gradient { background: linear-gradient(135deg, #ff914d 0%, #ff5722 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
//         .lazy-render { content-visibility: auto; contain-intrinsic-size: 1px 800px; }

//         .faq-main-title { font-family: var(--font-outfit), sans-serif; font-size: clamp(1.75rem, 6vw, 2.5rem); font-weight: 800; color: var(--hc-dark); line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 2rem; position: relative; padding-bottom: 12px; }
//         .faq-main-title::after { content: ""; position: absolute; left: 0; bottom: 0; width: 60px; height: 4px; background: linear-gradient(135deg, var(--hc-primary) 0%, #ff5722 100%); border-radius: 2px; }

//         .faq-premium-item { border: none !important; margin-bottom: 16px; border-radius: 16px !important; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); background: #ffffff; border: 1px solid #f1f5f9 !important; }
//         .faq-premium-btn { width: 100%; text-align: left; background: white; border: none; padding: clamp(16px, 4vw, 24px); font-weight: 700; font-size: clamp(1.05rem, 3.5vw, 1.2rem); color: var(--hc-dark); display: flex; justify-content: space-between; align-items: center; box-shadow: none !important; line-height: 1.4; gap: 15px; }
//         .faq-premium-btn:not(.collapsed) { color: var(--hc-primary); background: #fffcf9; }
//         .faq-icon-toggle { transition: transform 0.3s ease; color: var(--hc-primary); flex-shrink: 0; }
//         .faq-premium-btn:not(.collapsed) .faq-icon-toggle { transform: rotate(45deg); color: #ff5722; }
//         .faq-premium-body { padding: 0 clamp(16px, 4vw, 24px) 20px; color: #475569; font-size: clamp(0.95rem, 3vw, 1.05rem); line-height: 1.7; background: #fffcf9; }
        
//         .rich-text-content figure, 
//         .rich-text-content figure.image { margin: 2rem auto !important; max-width: 100% !important; height: auto !important; display: flex; justify-content: center; }
//         .rich-text-content img { max-width: 100% !important; height: auto !important; border-radius: 12px; display: block !important; margin: 0 auto !important; object-fit: contain !important; }
//         .rich-text-content iframe, .rich-text-content video, .rich-text-content table { max-width: 100% !important; overflow-x: auto; display: block !important; margin: 2rem auto !important; }

//         .rich-text-content h2, .rich-text-content h3 { font-family: var(--font-outfit), sans-serif; font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 700; color: #0f172a; margin-top: 2rem; margin-bottom: 1rem; }
//         .rich-text-content p { font-family: var(--font-poppins), sans-serif; font-size: 1rem; line-height: 1.8; color: #475569; margin-bottom: 1.2rem; }
        
//         .rich-text-content ul { display: flex; flex-direction: column; gap: 1rem; padding: 0; list-style: none; margin: 2rem 0; }
//         .rich-text-content ul li { background: #fdfdfd; border: 1px solid #f1f5f9; padding: 1.2rem 1.5rem 1.2rem 3rem; border-radius: 12px; display: block; position: relative; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: 0.3s; }
//         .rich-text-content ul li:hover { border-color: var(--hc-primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,145,77,0.1); }
//         .rich-text-content ul li::before { content: '✦'; color: var(--hc-primary); position: absolute; left: 1.2rem; top: 1.2rem; font-size: 1.2rem; font-weight: bold; line-height: 1.5; }

//         .rich-text-content ol { display: flex; flex-direction: column; gap: 1rem; padding: 0; margin: 2rem 0; list-style: none; counter-reset: custom-ol-counter;}
// .rich-text-content ol li { background: #fdfdfd; border: 1px solid #f1f5f9; padding: 1.2rem 1.5rem 1.2rem 3rem; border-radius: 12px; display: block; position: relative; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: 0.3s; list-style-type: decimal; counter-increment: custom-ol-counter; }
// .rich-text-content ol li:hover { border-color: var(--hc-primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,145,77,0.1); }
// .rich-text-content ol li::before { 
//   content: counter(custom-ol-counter) "."; 
//   color: var(--hc-primary); 
//   position: absolute; 
//   left: 1.2rem; 
//   top: 1.2rem; 
//   font-size: 1.1rem; 
//   font-weight: bold; 
//   line-height: 1.5; 
// }

//         .micro-trust-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; }
//         .micro-trust-item:last-child { border-bottom: none; padding-bottom: 0; }
//         .micro-trust-icon { color: #22c55e; font-size: 18px; margin-right: 12px; }

//         .floating-contact-widget { position: fixed; right: 20px; top: 55%; transform: translateY(-50%); z-index: 999; display: flex; flex-direction: column; gap: 12px; }
//         .widget-btn { width: 55px; height: 55px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.2); transition: 0.3s; text-decoration: none; }
//         .widget-btn:hover { transform: scale(1.1); color: white; }
//         .widget-btn.call { background: var(--hc-primary); }

//         @media (max-width: 768px) {
//         main.bg-light {
//     overflow-x: hidden;
//   }
//           .mobile-slider-wrapper { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; scroll-snap-type: x mandatory; gap: 15px; padding: 10px 0 30px; -webkit-overflow-scrolling: touch; scrollbar-width: none;
//           margin-left: 0 !important; 
//           margin-right: 0 !important; }
//           .mobile-slider-wrapper::-webkit-scrollbar { display: none; }
//           .mobile-slider-wrapper > div { flex: 0 0 88% !important; scroll-snap-align: center; }
//           .rich-text-content ul, .rich-text-content ol{ display: flex; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 1rem; }
//           .rich-text-content li, .rich-text-content ol li { flex: 0 0 85%; }
//           .rich-text-content ol { padding-left: 0; list-style-position: inside; }

//           .process-slider > div { 
//     flex: 0 0 100% !important; /* Shows exactly one card at a time */
//     padding: 0 10px; /* Optional: adds a little breathing room */
//   }
//   .process-slider .process-step { 
//     flex-direction: column; 
//     align-items: center; 
//     text-align: center; 
//   }
//   .process-slider .process-icon { 
//     margin-right: 0; 
//     margin-bottom: 15px; 
//   }
//   .process-slider .process-step::after { 
//     display: none !important; /* Removes the vertical connecting line */
//   }
//     .modern-card-slider > div { 
//     flex: 0 0 100% !important; /* 👈 Shows exactly 1 card at a time on mobile */
//   }
//         }

//         .city-hero { height: 55vh; min-height: 450px; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: #1e293b; }
//         .hero-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.95) 100%); z-index: 1; }
//         .hero-content { position: relative; z-index: 2; text-align: center; color: white; padding-top: 40px; }
//         .hero-badge { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); padding: 8px 24px; border-radius: 30px; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; display: inline-flex; align-items: center; color: #fff; font-weight: 600; }
//         .city-main-container { margin-top: -80px; position: relative; z-index: 10; }
//         .premium-card { background: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.04); padding: 40px; margin-bottom: 40px; border: 1px solid rgba(0,0,0,0.02); }
        
//         .hero-main-title { font-size: clamp(2.4rem, 5vw, 3.8rem); line-height: 1.1; letter-spacing: -0.02em; }
//         .process-step { display: flex; align-items: flex-start; margin-bottom: 30px; position: relative; }
//         .process-step:last-child { margin-bottom: 0; }
//         .process-icon { width: 50px; height: 50px; min-width: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-right: 20px; z-index: 2; }
//         .process-step:not(:last-child)::after { content: ''; position: absolute; left: 24px; top: 50px; bottom: -30px; width: 2px; background: #ffe4d6; z-index: 1; }

//         .trust-box { padding: 30px 20px; border-radius: 16px; background: #fafafa; border: 1px solid #f0f0f0; transition: all 0.3s ease; height: 100%; text-align: center; }
//         .trust-box:hover { background: #ffffff; transform: translateY(-5px); box-shadow: 0 15px 30px rgba(255,145,77,0.08); border-color: #ff914d; }
//         .trust-icon { width: 60px; height: 60px; background: #fff4ed; color: #ff914d; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px; }

//         .excellence-stat { text-align: center; padding: 20px; position: relative; }
//         @media (min-width: 768px) { .excellence-stat::after { content: ""; position: absolute; right: 0; top: 20%; height: 60%; width: 1px; background: #e2e8f0; } .excellence-stat:last-child::after { display: none; } }
        
//         .right-sidebar-sticky { position: sticky; top: 100px; height: max-content; }
//         .sidebar-widget { background: #ffffff; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.05); padding: 30px; margin-bottom: 30px; border: 1px solid rgba(0,0,0,0.03); }
//         .widget-title { font-family: var(--font-outfit), sans-serif; font-weight: 700; font-size: 20px; margin-bottom: 25px; position: relative; padding-bottom: 10px; }
//         .widget-title::after { content: ""; position: absolute; left: 0; bottom: 0; width: 40px; height: 3px; background: #ff914d; border-radius: 2px; }

//         .sidebar-cta { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 20px; padding: 30px 20px; text-align: center; color: white; margin-bottom: 30px; position: relative; overflow: hidden; }
//         .nav-city-link { display: flex; align-items: center; justify-content: space-between; padding: 12px 15px; border-radius: 10px; color: #475569; text-decoration: none; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: all 0.2s ease; background: #f8fafc; margin-bottom: 10px; }
//         .nav-city-link:hover, .nav-city-link.active { background: #ff914d; color: white; transform: translateX(5px); }
//         .nav-city-link.active { pointer-events: none; }
//         .sidebar-cta h4 { color: #ffffff !important; }

//         .related-card { overflow: hidden; border-radius: 16px; transition: transform 0.3s ease; border: 1px solid #f0f0f0; }
//         .related-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
        
//         .modern-card { background: #ffffff; padding: 30px 25px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: all 0.3s ease; height: 100%; position: relative; overflow: hidden;text-align: center;}
//         .modern-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border-color: #ff914d;}
//         .modern-card-icon { width: 50px; height: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin: 0 auto 20px; transition: transform 0.3s ease;}
//         .modern-card:hover .modern-card-icon { transform: scale(1.1); background: #ff914d; color: white; }
        
//         .approach-number { width: 60px; height: 60px; background: #fff4ed; color: #ff914d; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin: 0 auto 15px; }

//         .subcity-pill { display: inline-flex; align-items: center; padding: 8px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 30px; font-size: 13px; color: #475569; text-decoration: none; font-family: var(--font-poppins), sans-serif; font-weight: 500; transition: all 0.3s ease; margin-bottom: 8px; margin-right: 8px; }
//         .subcity-pill:hover { background: #ff914d; color: white; border-color: #ff914d; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(255,145,77,0.2); }
//         .view-all-btn[aria-expanded="true"] .fa-chevron-down { transform: rotate(180deg); transition: 0.3s ease; }
//         .view-all-btn[aria-expanded="false"] .fa-chevron-down { transition: 0.3s ease; }
//       `}} />

//       <main className="bg-light pb-5">
        
//         {/* --- HERO SECTION --- */}
//         <div className="city-hero w-100">
//           <Image 
//             src={pageData?.banner_image ? getBackendImageUrl(pageData.banner_image) : getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg')}

//             alt={
//   pageData?.banner_image && pageData?.banner_image_alt?.trim()
//     ? pageData.banner_image_alt.trim()
//     : pageData?.banner_title || pageData?.main_title || `${displayCity} Interior Design`
// }
//             // fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
//                         width={1920}
//             height={800}
//             priority
//             sizes="100vw"
//             style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
//           />
//           <div className="container hero-content font-poppins">
//             <div className="hero-badge"><FaMapMarkerAlt className="me-2" /> {pageData?.banner_subtitle || `High Creation Interior in ${displayCity}`}</div>

//             <HeroTag className="hero-main-title fw-bold mb-3 font-outfit text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
//   {pageData?.banner_title || pageData?.main_title || `Interior Designers in ${displayCity}`}
// </HeroTag>
//           </div>
//         </div>

//         <div className="container city-main-container">
//           <div className="row g-5">
            
//             {/* --- LEFT COLUMN: CONTENT HUB --- */}
//             <div className="col-lg-8">
//               {/* <div className="dual-sticky-wrapper"> */}
//                <div>
                
//                  {/* --- LENGTHY CONTENT --- */}
//                  <div className="premium-card mb-4">
//                   {/* <h2 className="font-outfit fw-bold h3 mb-4 text-dark">
//                      Interior Designer In {displayCity}
//                   </h2> */}
//                   <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeDescription }} />
//                 </div>

//                 {/* --- DESIGN PROCESS GRID --- */}
//                 <div className="lazy-render">
//                   <div className="premium-card bg-white border-0">
//                     <h2 className="font-outfit fw-bold h3 mb-4 text-dark text-center text-md-start">Our Proven Design Process</h2>
//                     <div className="mobile-slider-wrapper process-slider">
//                       {[
//                         { icon: <FaUser />, title: "Consultation & Ideation", desc: `We meet at your ${displayCity} property to understand your vision.` },
//                         { icon: <FaDraftingCompass />, title: "3D Concept & Planning", desc: "Walking through your home with detailed 3D renders before we build." },
//                         { icon: <FaHardHat />, title: "Precision Execution", desc: "Expert execution with 150+ quality checks and zero compromises." },
//                         { icon: <FaHome />, title: "The Grand Handover", desc: "A flawless move-in within 45 Days Delivery*. Welcome home." }
//                       ].map((step, i) => (
//                         <div className="process-step" key={i}>
//                           <div className="process-icon">{step.icon}</div>
//                           <div>
//                             <h4 className="font-outfit h5 fw-bold mb-1">{i + 1}. {step.title}</h4>
//                             <p className="text-muted font-poppins small mb-0">{step.desc}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {recentBlogs.length > 0 && (
//                   <div className="lazy-render">
//                     <div className="premium-card border-0 px-0 pt-0">
//                       <h2 className="font-outfit fw-bold h3 mb-4">Design Inspiration</h2>
//                       <div className="row g-4 font-poppins mobile-slider-wrapper">
//                         {recentBlogs.map((blog, idx) => (
//                           <div className="col-md-6" key={idx}>
//                             <Link href={`/${blog.seo_content?.slug || `blog-detail?id=${blog.id}`}`} className="text-decoration-none">
//                               <div className="d-flex align-items-center border p-3 rounded-4 bg-white shadow-sm h-100 transition-all hover:shadow-md">
//                                 <img src={blog.image || "/images/default.jpg"} alt={blog.title} 
//                                 width={80} height={80}
//                                 className="rounded" style={{ width: "80px", height: "80px",objectFit: "contain", flexShrink: 0 }} loading="lazy" />
//                                 <div className="ms-3">
//                                   <h6 className="text-dark fw-bold mb-1" style={{ fontSize: '14px' }}>{blog.title.length > 45 ? `${blog.title.substring(0, 45)}...` : blog.title}</h6>
//                                   <small className="text-gradient fw-bold">READ ARTICLE <FaArrowRight size={10} /></small>
//                                 </div>
//                               </div>
//                             </Link>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* --- EXCELLENCE STATS (Dynamic CMS Icons) --- */}
//                 <div className="lazy-render">
//                   <div className="premium-card shadow-sm" style={{ background: 'linear-gradient(to right, #ffffff, #fff9f5)' }}>
//                     <div className="row align-items-center justify-content-center mobile-slider-wrapper">
                      
//                       {excellenceStats && excellenceStats.length > 0 ? (
//                         excellenceStats.map((stat, idx) => {
//                           const IconComponent = (stat.iconName && FaIcons[stat.iconName]) 
//                             ? FaIcons[stat.iconName] 
//                             : FaIcons.FaStar;
                            
//                           const colWidth = excellenceStats.length <= 3 ? 4 : Math.max(3, Math.floor(12 / excellenceStats.length));

//                           return (
//                             <div className={`col-md-${colWidth} excellence-stat d-flex flex-column align-items-center justify-content-center text-center`} key={idx}>
//                               {stat.iconType === "image" && stat.image ? (
//                                 <img 
//                                   src={getBackendImageUrl(stat.image)} 
//                                   alt={stat.label || "Stat Icon"} 
//                                   width={stat.size || 40}
//                                   height={stat.size || 40}
//                                   style={{ width: `${stat.size || 40}px`, height: `${stat.size || 40}px`, objectFit: "contain" }} 
//                                   className="mb-3"
//                                 />
//                               ) : (
//                                 <IconComponent 
//                                   size={stat.size || 40} 
//                                   color={stat.color || "#f5a623"} 
//                                   className="mb-3" 
//                                 />
//                               )}
//                               <h3 className="font-outfit fw-bold h2 mb-1">{stat.value}</h3>
//                               <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">{stat.label}</p>
//                             </div>
//                           );
//                         })
//                       ) : (
//                         /* Safe Fallback Default Stats */
//                         <>
//                           <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
//                             <FaIcons.FaHome size={40} color="#ff914d" className="mb-3" />
//                             <h3 className="font-outfit fw-bold h2 mb-1">2680+</h3>
//                             <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">HOME RENOVATIONS</p>
//                           </div>
//                           <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
//                             <FaIcons.FaSmile size={40} color="#ff914d" className="mb-3" />
//                             <h3 className="font-outfit fw-bold h2 mb-1">2660+</h3>
//                             <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">HAPPY CUSTOMERS</p>
//                           </div>
//                           <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
//                             <FaIcons.FaStar size={40} color="#ff914d" className="mb-3" />
//                             <h3 className="font-outfit fw-bold h2 mb-1">4.8/5</h3>
//                             <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">CLIENT RATINGS</p>
//                           </div>
//                         </>
//                       )}

//                     </div>
//                   </div>
//                 </div>

//                 {/* --- WHY CHOOSE US (Modern Cards) --- */}
//                 <div className="lazy-render">
//                   <div className="premium-card bg-transparent border-0 shadow-none px-0 py-0 mb-4">
//                     <div className="text-center mb-4">
//                         <h2 className="font-outfit fw-bold h3 text-dark">What makes us the best choice for your project.</h2>
//                     </div>
//                     <div className="row g-4 mobile-slider-wrapper modern-card-slider">
//                       <div className="col-md-6 col-lg-3">
//                         <div className="modern-card">
//                           <div className="modern-card-icon"><FaShieldAlt /></div>
//                           <h4 className="font-outfit fw-bold h6">10-Year Warranty*</h4>
//                           <p className="text-muted font-poppins small mb-0">India&apos;s only full-home coverage guarantee.</p>
//                         </div>
//                       </div>
//                       <div className="col-md-6 col-lg-3">
//                         <div className="modern-card">
//                           <div className="modern-card-icon"><FaGem /></div>
//                           <h4 className="font-outfit fw-bold h6">Elite Finishes</h4>
//                           <p className="text-muted font-poppins small mb-0">Sourcing luxury materials that stand the test of time.</p>
//                         </div>
//                       </div>
//                       <div className="col-md-6 col-lg-3">
//                         <div className="modern-card">
//                           <div className="modern-card-icon"><FaClock /></div>
//                           <h4 className="font-outfit fw-bold h6">45-Day Delivery*</h4>
//                           <p className="text-muted font-poppins small mb-0">Swift, on-time installation of storage & kitchens.</p>
//                         </div>
//                       </div>
//                       <div className="col-md-6 col-lg-3">
//                         <div className="modern-card">
//                           <div className="modern-card-icon"><FaTools /></div>
//                           <h4 className="font-outfit fw-bold h6">Expert Team</h4>
//                           <p className="text-muted font-poppins small mb-0">Highly skilled professionals handling your project end-to-end.</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* --- MORE LENGTHY CONTENT --- */}
//                 {(pageData?.side_title || safeSideDescription) && (
//                   <div className="lazy-render">
//                     <div className="premium-card mb-4" style={{ background: '#fffcf9' }}>
//                       {/* <h3 className="font-outfit fw-bold h4 mb-3 text-dark">{pageData.side_title}</h3> */}

//                       <SideTag className="font-outfit fw-bold h4 mb-3 text-dark">{pageData.side_title}</SideTag>
//                       <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeSideDescription }} />
//                     </div>
//                   </div>
//                 )}

//                 {/* --- INTERACTIVE PREMIUM FAQs --- */}
//                 {faqs.length > 0 && (
//                   <div className="lazy-render">
//                     <div className="premium-card border-0 px-4">
//                       <h2 className="font-outfit fw-bold h3 mb-4">Insights for {displayCity}</h2>
//                       <div className="accordion font-poppins" id={`accordion-faq-${pageData?.id}`}>
//                         {faqs.map((faq, index) => (
//                           <div className="accordion-item faq-premium-item" key={index}>
//                             <h2 className="accordion-header">
//                               <button className={`accordion-button faq-premium-btn ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
//                                 <span className="pe-3">{faq.question}</span>
//                                 <FaPlus className="faq-icon-toggle flex-shrink-0" />
//                               </button>
//                             </h2>
//                             <div id={`collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent={`#accordion-faq-${pageData?.id}`}>
//                               <div className="accordion-body faq-premium-body" style={{ whiteSpace: 'pre-line' }}>{faq.answer}</div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//               </div>
//             </div>

//             {/* --- RIGHT COLUMN: SIDEBAR --- */}
//             <div className="col-lg-4">
//               {/* <div className="dual-sticky-wrapper"> */}
//               <div className="right-sidebar-sticky">
                
//                 {/* 1. TOP RIGHT: BOOK SITE VISIT CTA */}
//                 <div className="sidebar-cta shadow-lg mb-4">
//                   <h4 className="font-outfit fw-bold mb-2">Book a Site Visit</h4>
//                   <p className="font-poppins small text-white-50 mb-4">Expert designers will visit your {displayCity} property.</p>
//                   <Link href="/contact" className="btn btn-light w-100 fw-bold py-2 rounded-pill">Schedule Now</Link>
//                 </div>

//                 {/* 3. SIDEBAR FORM */}
//                 <SidebarForm city={city} />

//                 {/* 4. THE PROMISE */}
//                 <div className="sidebar-widget py-4 font-poppins lazy-render">
//                   <h4 className="widget-title mb-4">The Promise</h4>
//                   <div className="micro-trust-item">
//                     <FaCheckCircle className="micro-trust-icon" />
//                     <div>
//                       <span className="d-block fw-bold text-dark" style={{ fontSize: '14px' }}>Transparent Pricing</span>
//                       <span className="text-muted" style={{ fontSize: '12px' }}>No hidden costs, ever.</span>
//                     </div>
//                   </div>
//                   <div className="micro-trust-item">
//                     <FaTools className="micro-trust-icon text-warning" />
//                     <div>
//                       <span className="d-block fw-bold text-dark" style={{ fontSize: '14px' }}>In-House Execution</span>
//                       <span className="text-muted" style={{ fontSize: '12px' }}>No third-party contractors involved.</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 5. MAJOR CITIES */}
//                 <div className="sidebar-widget">
//                   <h4 className="widget-title">Service Areas</h4>
//                   <div className="d-flex flex-column">
//                     {Object.keys(cityUrlMap).map((c, idx) => (
//                       <Link key={idx} href={cityUrlMap[c]} className={`nav-city-link ${c === city ? 'active' : ''}`}>
//                         <span><FaMapMarkerAlt className="me-2" size={14} /> <span className="text-capitalize">{c.replace('_', ' ')}</span></span>
//                         <FaArrowRight size={12} />
//                       </Link>
//                     ))}
//                   </div>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>

//         {/* NEARBY MAJOR CITIES AT THE BOTTOM WITH DYNAMIC BANNERS */}
//         {otherCities.length > 0 && (
//           <div className="container mt-5 pt-5 border-top">
//             <div className="d-flex justify-content-between align-items-end mb-4">
//               <h2 className="font-outfit fw-bold text-dark h3">Nearby Cities</h2>
//               <Link href="/services" className="text-decoration-none fw-bold small text-gradient">VIEW ALL CITIES <FaArrowRight /></Link>
//             </div>
//             <div className="row g-4 mobile-slider-wrapper">
//               {otherCities.map((cityName, idx) => {
//                 const cityImg = cityBannerMap[cityName] || getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg');

//                 return (
//                   <div className="col-lg-4" key={idx}>
//                     <Link href={cityUrlMap[cityName]} className="text-decoration-none">
//                       <div className="related-card bg-white position-relative shadow-sm h-100 rounded-4 overflow-hidden">
//                         <div style={{ height: "200px", position: "relative" }}>

//                                                     <Image 
//                             src={cityImg} 
//                             alt={cityName} 
//                             width={800}
//                             height={400}
//                             style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} 
//                             loading="lazy" 
//                           />
//                           <div className="position-absolute bottom-0 start-0 p-4 w-100 text-white fw-bold" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
//                             <FaMapMarkerAlt className="me-2 text-warning" /> {cityName.replace('_', ' ').toUpperCase()}
//                           </div>
//                         </div>
//                       </div>
//                     </Link>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </main>
//     </MainLayout>
//   );
// };

// export default ServicesDetailPage;


// import { notFound } from "next/navigation";
// import MainLayout from "../layouts/MainLayout";
// import { defaultAltText } from "@/utils/helper";
// import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
// import Image from "next/image"; 
// import Link from "next/link";
// import DOMPurify from "isomorphic-dompurify";

// import { 
//   FaMapMarkerAlt, FaArrowRight, FaPhoneAlt, FaEnvelope, FaUser, 
//   FaShieldAlt, FaGem, FaClock, FaTrophy, FaStar, FaAward, 
//   FaCheckCircle, FaWallet, FaTools, FaDraftingCompass, FaHardHat, FaHome,
//   FaWhatsapp, FaPlus, FaChevronDown, 
//   FaSmile, FaUsers, FaCalendarAlt 
// } from "react-icons/fa";

// // Add wildcard import for dynamic icon rendering
// import * as FaIcons from "react-icons/fa";

// import { getBackendImageUrl } from "@/utils/helper";
// import { SidebarForm, BottomContactForm } from "./CityForms";
// import { getPageSEO } from "@/utils/getSEO";
// import { cityUrlMap } from "@/utils/cityRoutes";
// import { getSectionOrder } from "@/utils/citySections";
// const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
// const safeTag = (t, fallback) => (HEADING_TAGS.includes(t) ? t : fallback);

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";

// // City Banner Map for dynamic nearby cities images
// const cityBannerMap = {
//   "delhi": "/images/nearby cities/Delhi.png",
//   "faridabad": "/images/nearby cities/Faridabad.png",
//   "gurugram": "/images/nearby cities/Gurugram.png",
//   "noida": "/images/nearby cities/Noida.png",
//   "greater_noida": "/images/nearby cities/Greater Noida.png",
// };

// // Sub-City Logic for the new sidebar widget
// const subCitiesMap = {
//   "noida": [
//     { name: "Sector 150", link: "/interior-designers-in-noida-sector-150" },
//     { name: "Sector 137", link: "/interior-designers-in-noida-sector-137" },
//     { name: "Sector 74", link: "/interior-designers-in-noida-sector-74" },
//     { name: "Sector 75", link: "/interior-designers-in-noida-sector-75" },
//     { name: "Sector 143", link: "/interior-designers-in-noida-sector-143" },
//     { name: "Sector 104", link: "/interior-designers-in-noida-sector-104" },
//     { name: "Sector 50", link: "/interior-designers-in-noida-sector-50" },
//     { name: "Sector 93A", link: "/interior-designers-in-noida-sector-93a" },
//     { name: "Sector 128", link: "/interior-designers-in-noida-sector-128" },
//     { name: "Sector 44", link: "/interior-designers-in-noida-sector-44" },
//   ],
//   "gurugram": [
//     { name: "Golf Course Road", link: "/interior-designers-in-gurgaon-golf-course-road" },
//     { name: "DLF Phase 1", link: "/interior-designers-in-gurgaon-dlf-phase-1" },
//     { name: "DLF Phase 5", link: "/interior-designers-in-gurgaon-dlf-phase-5" },
//     { name: "Sector 56", link: "/interior-designers-in-gurgaon-sector-56" },
//     { name: "Sector 65", link: "/interior-designers-in-gurgaon-sector-65" },
//     { name: "Sohna Road", link: "/interior-designers-in-gurgaon-sohna-road" },
//     { name: "Sector 54", link: "/interior-designers-in-gurgaon-sector-54" },
//     { name: "Sector 57", link: "/interior-designers-in-gurgaon-sector-57" },
//   ],
//   "delhi": [
//     { name: "Vasant Vihar", link: "/interior-designers-in-delhi-vasant-vihar" },
//     { name: "Dwarka", link: "/interior-designers-in-dwarka" },
//     { name: "South Extension", link: "/interior-designers-in-delhi-south-extension" },
//     { name: "Greater Kailash", link: "/interior-designers-in-delhi-greater-kailash" },
//     { name: "Defence Colony", link: "/interior-designers-in-delhi-defence-colony" },
//     { name: "Hauz Khas", link: "/interior-designers-in-delhi-hauz-khas" },
//     { name: "Punjabi Bagh", link: "/interior-designers-in-delhi-punjabi-bagh" },
//     { name: "Rohini", link: "/interior-designers-in-delhi-rohini" },
//     { name: "Janakpuri", link: "/interior-designers-in-delhi-janakpuri" },
//   ]
// };

// // --- DATA FETCHERS ---
// async function getCityData(city) {
//   try {
//     const res = await fetch(`${API_BASE_URL}/cms-city/${city}`, { next: { revalidate: 60 } });
//     if (!res.ok) return null;
//     return await res.json();
//   } catch (error) { return null; }
// }

// async function getRecentBlogs() {
//   try {
//     const res = await fetch(`${API_BASE_URL}/cms-blog`, { next: { revalidate: 60 } });
//     if (!res.ok) return [];
//     const data = await res.json();
//     return Array.isArray(data) ? data.slice(0, 100) : [];
//   } catch (error) { return []; }
// }

// const getCityMediaMeta = (record) => parseSettings(record?.json_content ?? record?.jsonContent);
// const getCityMediaImage = (record) => record?.image || record?.image_url || getCityMediaMeta(record).image || "";

// // Replaced previous homeContent fetcher with the dynamic Excellence Stats fetcher
// async function getExcellenceStats() {
//   try {
//     const timestamp = new Date().getTime();
//     const res = await fetch(`${API_BASE_URL}/cms-content/excellence_stats?t=${timestamp}`, { 
//       cache: "no-store",
//       headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
//     });
//     if (!res.ok) return null;
//     const data = await res.json();
//     const record = Array.isArray(data) ? data[0] : data;
//     if (record && record.json_content) {
//       const jsonContent = typeof record.json_content === "string" 
//         ? JSON.parse(record.json_content) 
//         : record.json_content;
//       return jsonContent?.items || null;
//     }
//     return null;
//   } catch (error) { 
//     return null; 
//   }
// }

// const parseJsonSafe = (data) => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   try { return JSON.parse(data); } catch (e) { return []; }
// };

// const parseSettings = (value) => {
//   if (!value) return {};
//   if (typeof value === "object" && !Array.isArray(value)) return value;
//   try {
//     const parsed = JSON.parse(value);
//     return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
//   } catch {
//     return {};
//   }
// };

// const normalizeCmsRecords = (value) => {
//   if (Array.isArray(value)) return value;
//   if (!value) return [];
//   if (Array.isArray(value.records)) return value.records;
//   if (Array.isArray(value.data)) return value.data;
//   return [value];
// };

// const humanizeCity = (value) => String(value || "").replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
// const safeInternalHref = (value, fallback = "/contact") => {
//   const href = String(value || "").trim();
//   return href.startsWith("/") && !href.startsWith("//") ? href : fallback;
// };

// const DEFAULT_PROMISE_ITEMS = [
//   { title: "Transparent Pricing", description: "No hidden costs, ever." },
//   { title: "In-House Execution", description: "No third-party contractors involved." },
// ];

// const normalizeList = (value) => {
//   if (Array.isArray(value)) return value;
//   if (typeof value === "string" && value.trim()) {
//     try {
//       const parsed = JSON.parse(value);
//       return Array.isArray(parsed) ? parsed : [];
//     } catch { return []; }
//   }
//   return [];
// };

// // --- SEO METADATA ---
// export async function generateMetadata({ searchParams }) {
//   const city = searchParams?.city && searchParams.city !== "undefined" ? searchParams.city : "delhi";
//   // const fallbackPath = cityUrlMap[city] || `/services-detail/${city}`;
//   const fallbackPath = cityUrlMap[city] || `/interior-designers-in-${city}`;
  
//   const [pageData, seoData] = await Promise.all([
//     getCityData(city),
//     getPageSEO(fallbackPath).catch(() => null)
//   ]);

//   const canonicalUrl = getCanonicalUrl({ 
//     canonicalUrl: seoData?.alternates?.canonical || pageData?.seo_content?.canonical_url, 
//     fallbackPath 
//   });

//   if (!pageData) return { title: "Services", robots: { index: false, follow: true } };


//     const title =
//     seoData?.title || pageData?.seo_content?.meta_title || `${pageData.main_title} - Services`;
//   const description =
//     seoData?.description || pageData?.seo_content?.meta_description || "Best Interior Design Services";

//   // share image: SEO Manager OG image > this city's hero banner > logo
//   const og = seoData?.openGraph;
//   const ogImages = og?.images?.length
//     ? og.images
//     : [{ url: pageData?.banner_image ? getBackendImageUrl(pageData.banner_image) : "/images/new_hc_logo.png" }];

//   return {
//     title,
//     description,
//     keywords: seoData?.keywords || pageData?.seo_content?.meta_keywords || "",
//     alternates: { canonical: canonicalUrl },
//     robots: seoData?.robots || getRobotsDirectives(pageData?.seo_content),
//     openGraph: {
//       title: og?.title || title,
//       description: og?.description || description,
//       url: canonicalUrl,
//       siteName: "High Creation Interior",
//       locale: "en_IN",
//       type: "website",
//       images: ogImages,
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: seoData?.twitter?.title || og?.title || title,
//       description: seoData?.twitter?.description || og?.description || description,
//       images: seoData?.twitter?.images?.length
//         ? seoData.twitter.images
//         : ogImages.map((i) => i.url),
//     },
//   };
// }

// const ServicesDetailPage = async ({ searchParams }) => {
//   const city = searchParams?.city && searchParams.city !== "undefined" ? searchParams.city : "delhi";
//   // const fallbackPath = cityUrlMap[city] || `/services-detail/${city}`;
//   const fallbackPath = cityUrlMap[city] || `/interior-designers-in-${city}`;

//   // Fetch Data + Global SEO schemas + Dynamic Excellence Stats concurrently
//   const [pageData, recentBlogs, seoData, excellenceStats] = await Promise.all([
//     getCityData(city),
//     getRecentBlogs(),
//     getPageSEO(fallbackPath).catch(() => null),
//     getExcellenceStats(),
//   ]);
  
//   if (!pageData) notFound();

//   // City-specific settings and uploaded images are stored on cms_city.
//   // Avoid the legacy /cms-content/city_page_settings and city_page_media endpoints.
//   const cityExtras = { settings: {}, media: [] };

//   const customSchema = seoData?.customSchema;
//   const safeDescription = pageData?.main_description ? DOMPurify.sanitize(pageData.main_description) : "";
//   const safeSideDescription = pageData?.side_description ? DOMPurify.sanitize(pageData.side_description) : "";
//   const HeroTag = safeTag(pageData?.banner_title ? pageData?.banner_title_tag : pageData?.main_title_tag, "h1");
// const SideTag = safeTag(pageData?.side_title_tag, "h3");
  
//   const displayCity = city.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   const faqs = parseJsonSafe(pageData.faqs);
//   const legacyCitySettings = parseSettings(pageData?.city_settings ?? pageData?.city_settings_json);
//   const citySettings = { ...legacyCitySettings, ...(cityExtras?.settings || {}) };
//   // Admin-defined section order (desktop / mobile). Falls back to the current layout.
//   const sectionOrder = getSectionOrder(citySettings.sectionOrder);
//   const Block = ({ id, className = "", children }) => (
//     <div
//       className={`city-block ${className}`.trim()}
//       style={{ "--d": sectionOrder.desktop.indexOf(id), "--m": sectionOrder.mobile.indexOf(id) }}
//     >
//       {children}
//     </div>
//   );
//   const siteVisitSettings = citySettings.siteVisit || {};
//   const mobileBannerMedia = (cityExtras?.media || []).find((record) => getCityMediaMeta(record).slot === "mobile_banner");
//   const mobileHeroBanner = getCityMediaImage(mobileBannerMedia) || pageData?.mobile_banner_image || "";
//   const promiseItems = normalizeList(citySettings.promiseItems).filter((item) => item && (item.title || item.description));
//   const activePromiseItems = promiseItems.length ? promiseItems : DEFAULT_PROMISE_ITEMS;

//   const savedBlogIds = normalizeList(citySettings.designInspirationBlogIds ?? citySettings.design_inspiration_blog_ids)
//     .map((id) => String(id));
//   const matchingSelectedBlogs = savedBlogIds.length
//     ? savedBlogIds.map((id) => recentBlogs.find((blog) => String(blog.id) === id)).filter(Boolean)
//     : [];
//   const designInspirationBlogs = matchingSelectedBlogs.length ? matchingSelectedBlogs : recentBlogs.slice(0, 4);

//   const projectList = normalizeList(citySettings.projectImages ?? citySettings.project_images);
//   const projectPhotos = Array.from({ length: 6 }, (_, index) => {
//     const slot = `project_${index + 1}`;
//     const mediaRecord = (cityExtras?.media || []).find((record) => getCityMediaMeta(record).slot === slot);
//     const mediaMeta = getCityMediaMeta(mediaRecord);
//     const project = projectList[index] || {};
//     const directImage = pageData?.[`project_image_${index + 1}`];
//     const image = getCityMediaImage(mediaRecord)
//       || (typeof project === "string" ? project : (project.image || project.src || project.url))
//       || directImage;
//     const alt = mediaMeta.alt || (typeof project === "object" ? project.alt : "") || pageData?.[`project_image_${index + 1}_alt`] || `${displayCity} interior design project ${index + 1}`;
//     const title = mediaMeta.title || (typeof project === "object" ? project.title : "") || `${displayCity} Interior Project ${index + 1}`;
//     return image ? { image, alt, title } : null;
//   }).filter(Boolean);

//   const customServiceAreas = normalizeList(citySettings.serviceAreas ?? citySettings.service_areas)
//     .filter((area) => area && (area.name || area.title) && (area.url || area.href));
//   const serviceAreas = customServiceAreas.length ? customServiceAreas.map((area) => ({
//     name: area.name || area.title,
//     url: safeInternalHref(area.url || area.href, cityUrlMap[city] || "/services"),
//     slug: area.slug || "",
//   })) : Object.entries(cityUrlMap).map(([slug, url]) => ({ name: humanizeCity(slug), url, slug }));

//   const customNearbyCities = normalizeList(citySettings.nearbyCities ?? citySettings.nearby_cities)
//     .filter((entry) => entry && (entry.name || entry.title) && (entry.url || entry.href));
//   const nearbyCityCards = (customNearbyCities.length ? customNearbyCities.map((entry) => ({
//     name: entry.name || entry.title,
//     slug: entry.slug || Object.keys(cityUrlMap).find((slug) => cityUrlMap[slug] === (entry.url || entry.href)) || "",
//     url: safeInternalHref(entry.url || entry.href, "/services"),
//     image: entry.image || entry.imageUrl || "",
//   })) : Object.keys(cityUrlMap).filter((slug) => slug !== city).slice(0, 3).map((slug) => ({
//     name: humanizeCity(slug), slug, url: cityUrlMap[slug], image: cityBannerMap[slug] || "",
//   }))).filter((entry) => entry.slug !== city && entry.url !== cityUrlMap[city]);

//   const visitTitle = siteVisitSettings.title || citySettings.siteVisitTitle || "Book a Site Visit";
//   const visitDescription = (siteVisitSettings.description || citySettings.siteVisitDescription || "Expert designers will visit your {city} property.").replace(/\{city\}/gi, displayCity);
//   const visitButtonText = siteVisitSettings.buttonText || citySettings.siteVisitButtonText || "Schedule Now";
//   const visitButtonUrl = safeInternalHref(siteVisitSettings.buttonUrl || citySettings.siteVisitButtonUrl || "/contact");
  
//   // Localities Logic for Sidebar Widget
//   const currentSubCities = subCitiesMap[city] || [];
//   const initialSubCities = currentSubCities.slice(0, 6);
//   const hiddenSubCities = currentSubCities.slice(6);

//   return (
//     <MainLayout>
//       {/* Inject the Custom Schema from the Global SEO Tag Manager */}
//       {customSchema && (
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ 
//             __html: typeof customSchema === 'string' 
//               ? customSchema.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '') 
//               : JSON.stringify(customSchema)
//           }}
//         />
//       )}

//       {/* Legacy Fallback (Inner Custom Code) */}
//       {pageData?.seo_content?.custom_code && (
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ 
//             __html: pageData.seo_content.custom_code.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '') 
//           }}
//         />
//       )}
//       <style dangerouslySetInnerHTML={{__html: `
//         :root { --hc-primary: #ff914d; --hc-dark: #0f172a; }
//         .font-outfit { font-family: var(--font-outfit), sans-serif; }
//         .font-poppins { font-family: var(--font-poppins), sans-serif; }
//         .text-gradient { background: linear-gradient(135deg, #ff914d 0%, #ff5722 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
//         .lazy-render { content-visibility: auto; contain-intrinsic-size: 1px 800px; }

//         .faq-main-title { font-family: var(--font-outfit), sans-serif; font-size: clamp(1.75rem, 6vw, 2.5rem); font-weight: 800; color: var(--hc-dark); line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 2rem; position: relative; padding-bottom: 12px; }
//         .faq-main-title::after { content: ""; position: absolute; left: 0; bottom: 0; width: 60px; height: 4px; background: linear-gradient(135deg, var(--hc-primary) 0%, #ff5722 100%); border-radius: 2px; }

//         .faq-premium-item { border: none !important; margin-bottom: 16px; border-radius: 16px !important; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); background: #ffffff; border: 1px solid #f1f5f9 !important; }
//         .faq-premium-btn { width: 100%; text-align: left; background: white; border: none; padding: clamp(16px, 4vw, 24px); font-weight: 700; font-size: clamp(1.05rem, 3.5vw, 1.2rem); color: var(--hc-dark); display: flex; justify-content: space-between; align-items: center; box-shadow: none !important; line-height: 1.4; gap: 15px; }
//         .faq-premium-btn:not(.collapsed) { color: var(--hc-primary); background: #fffcf9; }
//         .faq-icon-toggle { transition: transform 0.3s ease; color: var(--hc-primary); flex-shrink: 0; }
//         .faq-premium-btn:not(.collapsed) .faq-icon-toggle { transform: rotate(45deg); color: #ff5722; }
//         .faq-premium-body { padding: 0 clamp(16px, 4vw, 24px) 20px; color: #475569; font-size: clamp(0.95rem, 3vw, 1.05rem); line-height: 1.7; background: #fffcf9; }
        
//         .rich-text-content figure, 
//         .rich-text-content figure.image { margin: 2rem auto !important; max-width: 100% !important; height: auto !important; display: flex; justify-content: center; }
//         .rich-text-content img { max-width: 100% !important; height: auto !important; border-radius: 12px; display: block !important; margin: 0 auto !important; object-fit: contain !important; }
//         .rich-text-content iframe, .rich-text-content video, .rich-text-content table { max-width: 100% !important; overflow-x: auto; display: block !important; margin: 2rem auto !important; }

//         .rich-text-content h2, .rich-text-content h3 { font-family: var(--font-outfit), sans-serif; font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 700; color: #0f172a; margin-top: 2rem; margin-bottom: 1rem; }
//         .rich-text-content p { font-family: var(--font-poppins), sans-serif; font-size: 1rem; line-height: 1.8; color: #475569; margin-bottom: 1.2rem; }
        
//         .rich-text-content ul { display: flex; flex-direction: column; gap: 1rem; padding: 0; list-style: none; margin: 2rem 0; }
//         .rich-text-content ul li { background: #fdfdfd; border: 1px solid #f1f5f9; padding: 1.2rem 1.5rem 1.2rem 3rem; border-radius: 12px; display: block; position: relative; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: 0.3s; }
//         .rich-text-content ul li:hover { border-color: var(--hc-primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,145,77,0.1); }
//         .rich-text-content ul li::before { content: '✦'; color: var(--hc-primary); position: absolute; left: 1.2rem; top: 1.2rem; font-size: 1.2rem; font-weight: bold; line-height: 1.5; }

//         .rich-text-content ol { display: flex; flex-direction: column; gap: 1rem; padding: 0; margin: 2rem 0; list-style: none; counter-reset: custom-ol-counter;}
// .rich-text-content ol li { background: #fdfdfd; border: 1px solid #f1f5f9; padding: 1.2rem 1.5rem 1.2rem 3rem; border-radius: 12px; display: block; position: relative; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: 0.3s; list-style-type: decimal; counter-increment: custom-ol-counter; }
// .rich-text-content ol li:hover { border-color: var(--hc-primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,145,77,0.1); }
// .rich-text-content ol li::before { 
//   content: counter(custom-ol-counter) "."; 
//   color: var(--hc-primary); 
//   position: absolute; 
//   left: 1.2rem; 
//   top: 1.2rem; 
//   font-size: 1.1rem; 
//   font-weight: bold; 
//   line-height: 1.5; 
// }

//         .micro-trust-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; }
//         .micro-trust-item:last-child { border-bottom: none; padding-bottom: 0; }
//         .micro-trust-icon { color: #22c55e; font-size: 18px; margin-right: 12px; }

//         .floating-contact-widget { position: fixed; right: 20px; top: 55%; transform: translateY(-50%); z-index: 999; display: flex; flex-direction: column; gap: 12px; }
//         .widget-btn { width: 55px; height: 55px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.2); transition: 0.3s; text-decoration: none; }
//         .widget-btn:hover { transform: scale(1.1); color: white; }
//         .widget-btn.call { background: var(--hc-primary); }

//         @media (max-width: 768px) {
//         main.bg-light {
//     overflow-x: hidden;
//   }
//           .mobile-slider-wrapper { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; scroll-snap-type: x mandatory; gap: 15px; padding: 10px 0 30px; -webkit-overflow-scrolling: touch; scrollbar-width: none;
//           margin-left: 0 !important; 
//           margin-right: 0 !important; }
//           .mobile-slider-wrapper::-webkit-scrollbar { display: none; }
//           .mobile-slider-wrapper > div { flex: 0 0 88% !important; scroll-snap-align: center; }
//           .rich-text-content ul, .rich-text-content ol{ display: flex; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 1rem; }
//           .rich-text-content li, .rich-text-content ol li { flex: 0 0 85%; }
//           .rich-text-content ol { padding-left: 0; list-style-position: inside; }

//           .process-slider > div { 
//     flex: 0 0 100% !important; /* Shows exactly one card at a time */
//     padding: 0 10px; /* Optional: adds a little breathing room */
//   }
//   .process-slider .process-step { 
//     flex-direction: column; 
//     align-items: center; 
//     text-align: center; 
//   }
//   .process-slider .process-icon { 
//     margin-right: 0; 
//     margin-bottom: 15px; 
//   }
//   .process-slider .process-step::after { 
//     display: none !important; /* Removes the vertical connecting line */
//   }
//     .modern-card-slider > div { 
//     flex: 0 0 100% !important; /* 👈 Shows exactly 1 card at a time on mobile */
//   }
//         }

//         .city-hero { height: 55vh; min-height: 450px; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: #1e293b; }
//         .city-hero-picture { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
//         .city-hero-picture img { display: block; }
//         .city-project-card { position: relative; overflow: hidden; border-radius: 16px; background: #f1f5f9; aspect-ratio: 4 / 3; }
//         .city-project-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
//         .city-project-card figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 36px 16px 14px; color: #fff; font-weight: 600; background: linear-gradient(transparent, rgba(15,23,42,.78)); }

//         .hero-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.95) 100%); z-index: 1; }
//         .hero-content { position: relative; z-index: 2; text-align: center; color: white; padding-top: 40px; }
//         .hero-badge { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); padding: 8px 24px; border-radius: 30px; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; display: inline-flex; align-items: center; color: #fff; font-weight: 600; }
//         .city-main-container { margin-top: -80px; position: relative; z-index: 10; }
//         .premium-card { background: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.04); padding: 40px; margin-bottom: 40px; border: 1px solid rgba(0,0,0,0.02); }
        
//         .hero-main-title { font-size: clamp(2.4rem, 5vw, 3.8rem); line-height: 1.1; letter-spacing: -0.02em; }
//         .process-step { display: flex; align-items: flex-start; margin-bottom: 30px; position: relative; }
//         .process-step:last-child { margin-bottom: 0; }
//         .process-icon { width: 50px; height: 50px; min-width: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-right: 20px; z-index: 2; }
//         .process-step:not(:last-child)::after { content: ''; position: absolute; left: 24px; top: 50px; bottom: -30px; width: 2px; background: #ffe4d6; z-index: 1; }

//         .trust-box { padding: 30px 20px; border-radius: 16px; background: #fafafa; border: 1px solid #f0f0f0; transition: all 0.3s ease; height: 100%; text-align: center; }
//         .trust-box:hover { background: #ffffff; transform: translateY(-5px); box-shadow: 0 15px 30px rgba(255,145,77,0.08); border-color: #ff914d; }
//         .trust-icon { width: 60px; height: 60px; background: #fff4ed; color: #ff914d; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px; }

//         .excellence-stat { text-align: center; padding: 20px; position: relative; }
//         @media (min-width: 768px) { .excellence-stat::after { content: ""; position: absolute; right: 0; top: 20%; height: 60%; width: 1px; background: #e2e8f0; } .excellence-stat:last-child::after { display: none; } }
        
//         .right-sidebar-sticky { position: sticky; top: 100px; height: max-content; }
//         .sidebar-widget { background: #ffffff; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.05); padding: 30px; margin-bottom: 30px; border: 1px solid rgba(0,0,0,0.03); }
//         .widget-title { font-family: var(--font-outfit), sans-serif; font-weight: 700; font-size: 20px; margin-bottom: 25px; position: relative; padding-bottom: 10px; }
//         .widget-title::after { content: ""; position: absolute; left: 0; bottom: 0; width: 40px; height: 3px; background: #ff914d; border-radius: 2px; }

//         .sidebar-cta { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 20px; padding: 30px 20px; text-align: center; color: white; margin-bottom: 30px; position: relative; overflow: hidden; }
//         .nav-city-link { display: flex; align-items: center; justify-content: space-between; padding: 12px 15px; border-radius: 10px; color: #475569; text-decoration: none; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: all 0.2s ease; background: #f8fafc; margin-bottom: 10px; }
//         .nav-city-link:hover, .nav-city-link.active { background: #ff914d; color: white; transform: translateX(5px); }
//         .nav-city-link.active { pointer-events: none; }
//         .sidebar-cta h4 { color: #ffffff !important; }

//         .related-card { overflow: hidden; border-radius: 16px; transition: transform 0.3s ease; border: 1px solid #f0f0f0; }
//         .related-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
        
//         .modern-card { background: #ffffff; padding: 30px 25px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: all 0.3s ease; height: 100%; position: relative; overflow: hidden;text-align: center;}
//         .modern-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border-color: #ff914d;}
//         .modern-card-icon { width: 50px; height: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin: 0 auto 20px; transition: transform 0.3s ease;}
//         .modern-card:hover .modern-card-icon { transform: scale(1.1); background: #ff914d; color: white; }
        
//         .approach-number { width: 60px; height: 60px; background: #fff4ed; color: #ff914d; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin: 0 auto 15px; }

//         .subcity-pill { display: inline-flex; align-items: center; padding: 8px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 30px; font-size: 13px; color: #475569; text-decoration: none; font-family: var(--font-poppins), sans-serif; font-weight: 500; transition: all 0.3s ease; margin-bottom: 8px; margin-right: 8px; }
//         .subcity-pill:hover { background: #ff914d; color: white; border-color: #ff914d; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(255,145,77,0.2); }
//         .view-all-btn[aria-expanded="true"] .fa-chevron-down { transform: rotate(180deg); transition: 0.3s ease; }
//         .view-all-btn[aria-expanded="false"] .fa-chevron-down { transition: 0.3s ease; }

//         /* --- Admin-controlled section order (CMS > City > Section Order) --- */
//         .city-col-stack { display: flex; flex-direction: column; }
//         .city-block { order: var(--d); }
//         .city-cols > .city-block-bottom { order: 1; }
//         @media (max-width: 991.98px) {
//           /* columns stack on tablet/mobile: dissolve the wrappers so blocks from the
//              main column, sidebar and bottom strip can be interleaved with CSS order */
//           .city-cols { flex-direction: column; flex-wrap: nowrap; }
//           .city-cols > .col-lg-8,
//           .city-cols > .col-lg-4,
//           .city-cols .city-col-stack { display: contents; }
//           .city-cols .city-block { order: var(--m); width: 100%; padding-inline: calc(var(--bs-gutter-x) * .5); }
//         }
//       `}} />

//       <main className="bg-light pb-5">
        
//         {/* --- HERO SECTION --- */}
//         <div className="city-hero w-100">
//           <picture className="city-hero-picture">
//             {mobileHeroBanner && (
//               <source
//                 media="(max-width: 767px)"
//                 srcSet={getBackendImageUrl(mobileHeroBanner)}
//               />
//             )}
//             <Image
//               src={pageData?.banner_image ? getBackendImageUrl(pageData.banner_image) : getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg')}
//               alt={
//                 getCityMediaMeta(mobileBannerMedia).alt?.trim()
//                   || pageData?.banner_image_alt?.trim()
//                   || pageData?.banner_title || pageData?.main_title || `${displayCity} Interior Design`
//               }
//               width={1920}
//               height={800}
//               priority
//               sizes="100vw"
//               style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
//             />
//           </picture>
//           <div className="container hero-content font-poppins">
//             <div className="hero-badge"><FaMapMarkerAlt className="me-2" /> {pageData?.banner_subtitle || `High Creation Interior in ${displayCity}`}</div>

//             <HeroTag className="hero-main-title fw-bold mb-3 font-outfit text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
//   {pageData?.banner_title || pageData?.main_title || `Interior Designers in ${displayCity}`}
// </HeroTag>
//           </div>
//         </div>

//         <div className="container city-main-container">
//           <div className="row g-5 city-cols">
            
//             {/* --- LEFT COLUMN: CONTENT HUB --- */}
//             <div className="col-lg-8">
//               {/* <div className="dual-sticky-wrapper"> */}
//                <div className="city-col-stack">
                
//                  {/* --- LENGTHY CONTENT --- */}
//                 <Block id="main">
//                  <div className="premium-card mb-4">
//                   {/* <h2 className="font-outfit fw-bold h3 mb-4 text-dark">
//                      Interior Designer In {displayCity}
//                   </h2> */}
//                   <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeDescription }} />
//                 </div>

//                 </Block>
//                 {/* --- DESIGN PROCESS GRID --- */}
//                 <Block id="process">
//                 <div className="lazy-render">
//                   <div className="premium-card bg-white border-0">
//                     <h2 className="font-outfit fw-bold h3 mb-4 text-dark text-center text-md-start">Our Proven Design Process</h2>
//                     <div className="mobile-slider-wrapper process-slider">
//                       {[
//                         { icon: <FaUser />, title: "Consultation & Ideation", desc: `We meet at your ${displayCity} property to understand your vision.` },
//                         { icon: <FaDraftingCompass />, title: "3D Concept & Planning", desc: "Walking through your home with detailed 3D renders before we build." },
//                         { icon: <FaHardHat />, title: "Precision Execution", desc: "Expert execution with 150+ quality checks and zero compromises." },
//                         { icon: <FaHome />, title: "The Grand Handover", desc: "A flawless move-in within 45 Days Delivery*. Welcome home." }
//                       ].map((step, i) => (
//                         <div className="process-step" key={i}>
//                           <div className="process-icon">{step.icon}</div>
//                           <div>
//                             <h4 className="font-outfit h5 fw-bold mb-1">{i + 1}. {step.title}</h4>
//                             <p className="text-muted font-poppins small mb-0">{step.desc}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 </Block>
//                 {projectPhotos.length > 0 && (
//                   <Block id="projects">
//                   <section className="lazy-render mb-4" aria-label={`Interior design projects in ${displayCity}`}>
//                     <div className="premium-card bg-white border-0">
//                       <h2 className="font-outfit fw-bold h3 mb-4 text-dark">Interior Projects in {displayCity}</h2>
//                       <div className="row g-3">
//                         {projectPhotos.map((project, index) => (
//                           <div className="col-12 col-sm-6" key={`${project.image}-${index}`}>
//                             <figure className="city-project-card m-0">
//                               <Image
//                                 src={getBackendImageUrl(project.image)}
//                                 alt={project.alt}
//                                 title={project.title}
//                                 width={900}
//                                 height={675}
//                                 sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 420px"
//                                 loading="lazy"
//                                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                               />
//                               <figcaption>{project.title}</figcaption>
//                             </figure>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </section>
//                   </Block>
//                 )}

//                 {designInspirationBlogs.length > 0 && (
//                   <Block id="blogs">
//                   <div className="lazy-render">
//                     <div className="premium-card border-0 px-0 pt-0">
//                       <h2 className="font-outfit fw-bold h3 mb-4">Design Inspiration</h2>
//                       <div className="row g-4 font-poppins mobile-slider-wrapper">
//                         {designInspirationBlogs.map((blog, idx) => (
//                           <div className="col-md-6" key={idx}>
//                             <Link href={`/${blog.seo_content?.slug || `blog-detail?id=${blog.id}`}`} className="text-decoration-none">
//                               <div className="d-flex align-items-center border p-3 rounded-4 bg-white shadow-sm h-100 transition-all hover:shadow-md">
//                                 <img src={blog.image || "/images/default.jpg"} alt={blog.title} 
//                                 width={80} height={80}
//                                 className="rounded" style={{ width: "80px", height: "80px",objectFit: "contain", flexShrink: 0 }} loading="lazy" />
//                                 <div className="ms-3">
//                                   <h6 className="text-dark fw-bold mb-1" style={{ fontSize: '14px' }}>{blog.title.length > 45 ? `${blog.title.substring(0, 45)}...` : blog.title}</h6>
//                                   <small className="text-gradient fw-bold">READ ARTICLE <FaArrowRight size={10} /></small>
//                                 </div>
//                               </div>
//                             </Link>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   </Block>
//                 )}
                
//                 {/* --- EXCELLENCE STATS (Dynamic CMS Icons) --- */}
//                 <Block id="stats">
//                 <div className="lazy-render">
//                   <div className="premium-card shadow-sm" style={{ background: 'linear-gradient(to right, #ffffff, #fff9f5)' }}>
//                     <div className="row align-items-center justify-content-center mobile-slider-wrapper">
                      
//                       {excellenceStats && excellenceStats.length > 0 ? (
//                         excellenceStats.map((stat, idx) => {
//                           const IconComponent = (stat.iconName && FaIcons[stat.iconName]) 
//                             ? FaIcons[stat.iconName] 
//                             : FaIcons.FaStar;
                            
//                           const colWidth = excellenceStats.length <= 3 ? 4 : Math.max(3, Math.floor(12 / excellenceStats.length));

//                           return (
//                             <div className={`col-md-${colWidth} excellence-stat d-flex flex-column align-items-center justify-content-center text-center`} key={idx}>
//                               {stat.iconType === "image" && stat.image ? (
//                                 <img 
//                                   src={getBackendImageUrl(stat.image)} 
//                                   alt={stat.label || "Stat Icon"} 
//                                   width={stat.size || 40}
//                                   height={stat.size || 40}
//                                   style={{ width: `${stat.size || 40}px`, height: `${stat.size || 40}px`, objectFit: "contain" }} 
//                                   className="mb-3"
//                                 />
//                               ) : (
//                                 <IconComponent 
//                                   size={stat.size || 40} 
//                                   color={stat.color || "#f5a623"} 
//                                   className="mb-3" 
//                                 />
//                               )}
//                               <h3 className="font-outfit fw-bold h2 mb-1">{stat.value}</h3>
//                               <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">{stat.label}</p>
//                             </div>
//                           );
//                         })
//                       ) : (
//                         /* Safe Fallback Default Stats */
//                         <>
//                           <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
//                             <FaIcons.FaHome size={40} color="#ff914d" className="mb-3" />
//                             <h3 className="font-outfit fw-bold h2 mb-1">2680+</h3>
//                             <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">HOME RENOVATIONS</p>
//                           </div>
//                           <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
//                             <FaIcons.FaSmile size={40} color="#ff914d" className="mb-3" />
//                             <h3 className="font-outfit fw-bold h2 mb-1">2660+</h3>
//                             <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">HAPPY CUSTOMERS</p>
//                           </div>
//                           <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
//                             <FaIcons.FaStar size={40} color="#ff914d" className="mb-3" />
//                             <h3 className="font-outfit fw-bold h2 mb-1">4.8/5</h3>
//                             <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">CLIENT RATINGS</p>
//                           </div>
//                         </>
//                       )}

//                     </div>
//                   </div>
//                 </div>

//                 </Block>
//                 {/* --- WHY CHOOSE US (Modern Cards) --- */}
//                 <Block id="whyChoose">
//                 <div className="lazy-render">
//                   <div className="premium-card bg-transparent border-0 shadow-none px-0 py-0 mb-4">
//                     <div className="text-center mb-4">
//                         <h2 className="font-outfit fw-bold h3 text-dark">What makes us the best choice for your project.</h2>
//                     </div>
//                     <div className="row g-4 mobile-slider-wrapper modern-card-slider">
//                       <div className="col-md-6 col-lg-3">
//                         <div className="modern-card">
//                           <div className="modern-card-icon"><FaShieldAlt /></div>
//                           <h4 className="font-outfit fw-bold h6">10-Year Warranty*</h4>
//                           <p className="text-muted font-poppins small mb-0">India&apos;s only full-home coverage guarantee.</p>
//                         </div>
//                       </div>
//                       <div className="col-md-6 col-lg-3">
//                         <div className="modern-card">
//                           <div className="modern-card-icon"><FaGem /></div>
//                           <h4 className="font-outfit fw-bold h6">Elite Finishes</h4>
//                           <p className="text-muted font-poppins small mb-0">Sourcing luxury materials that stand the test of time.</p>
//                         </div>
//                       </div>
//                       <div className="col-md-6 col-lg-3">
//                         <div className="modern-card">
//                           <div className="modern-card-icon"><FaClock /></div>
//                           <h4 className="font-outfit fw-bold h6">45-Day Delivery*</h4>
//                           <p className="text-muted font-poppins small mb-0">Swift, on-time installation of storage & kitchens.</p>
//                         </div>
//                       </div>
//                       <div className="col-md-6 col-lg-3">
//                         <div className="modern-card">
//                           <div className="modern-card-icon"><FaTools /></div>
//                           <h4 className="font-outfit fw-bold h6">Expert Team</h4>
//                           <p className="text-muted font-poppins small mb-0">Highly skilled professionals handling your project end-to-end.</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 </Block>
//                 {/* --- MORE LENGTHY CONTENT --- */}
//                 {(pageData?.side_title || safeSideDescription) && (
//                   <Block id="side">
//                   <div className="lazy-render">
//                     <div className="premium-card mb-4" style={{ background: '#fffcf9' }}>
//                       {/* <h3 className="font-outfit fw-bold h4 mb-3 text-dark">{pageData.side_title}</h3> */}

//                       <SideTag className="font-outfit fw-bold h4 mb-3 text-dark">{pageData.side_title}</SideTag>
//                       <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeSideDescription }} />
//                     </div>
//                   </div>
//                   </Block>
//                 )}

//                 {/* --- INTERACTIVE PREMIUM FAQs --- */}
//                 {faqs.length > 0 && (
//                   <Block id="faqs">
//                   <div className="lazy-render">
//                     <div className="premium-card border-0 px-4">
//                       <h2 className="font-outfit fw-bold h3 mb-4">Insights for {displayCity}</h2>
//                       <div className="accordion font-poppins" id={`accordion-faq-${pageData?.id}`}>
//                         {faqs.map((faq, index) => (
//                           <div className="accordion-item faq-premium-item" key={index}>
//                             <h2 className="accordion-header">
//                               <button className={`accordion-button faq-premium-btn ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
//                                 <span className="pe-3">{faq.question}</span>
//                                 <FaPlus className="faq-icon-toggle flex-shrink-0" />
//                               </button>
//                             </h2>
//                             <div id={`collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent={`#accordion-faq-${pageData?.id}`}>
//                               <div className="accordion-body faq-premium-body" style={{ whiteSpace: 'pre-line' }}>{faq.answer}</div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   </Block>
//                 )}
                
//               </div>
//             </div>

//             {/* --- RIGHT COLUMN: SIDEBAR --- */}
//             <div className="col-lg-4">
//               {/* <div className="dual-sticky-wrapper"> */}
//               <div className="right-sidebar-sticky city-col-stack">
                
//                 {/* 1. TOP RIGHT: BOOK SITE VISIT CTA */}
//                 <Block id="siteVisit">
//                 <div className="sidebar-cta shadow-lg mb-4">
//                   <h4 className="font-outfit fw-bold mb-2">{visitTitle}</h4>
//                   <p className="font-poppins small text-white-50 mb-4">{visitDescription}</p>
//                   <Link href={visitButtonUrl} className="btn btn-light w-100 fw-bold py-2 rounded-pill">{visitButtonText}</Link>
//                 </div>

//                 </Block>
//                 {/* 3. SIDEBAR FORM */}
//                 <Block id="sidebarForm">
//                 <SidebarForm city={city} />

//                 </Block>
//                 {/* 4. THE PROMISE */}
//                 <Block id="promise">
//                 <div className="sidebar-widget py-4 font-poppins lazy-render">
//                   <h4 className="widget-title mb-4">{citySettings.promiseTitle || "The Promise"}</h4>
//                   {activePromiseItems.map((item, index) => (
//                     <div className="micro-trust-item" key={`${item.title}-${index}`}>
//                       {index === 0 ? <FaCheckCircle className="micro-trust-icon" /> : <FaTools className="micro-trust-icon text-warning" />}
//                       <div>
//                         <span className="d-block fw-bold text-dark" style={{ fontSize: '14px' }}>{item.title}</span>
//                         <span className="text-muted" style={{ fontSize: '12px' }}>{item.description}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 </Block>
//                 {/* 5. MAJOR CITIES */}
//                 <Block id="serviceAreas">
//                 <div className="sidebar-widget">
//                   <h4 className="widget-title">{citySettings.serviceAreasTitle || "Service Areas"}</h4>
//                   <div className="d-flex flex-column">
//                     {serviceAreas.map((area, idx) => (
//                       <Link key={`${area.url}-${idx}`} href={area.url} className={`nav-city-link ${area.slug === city || area.url === cityUrlMap[city] ? 'active' : ''}`}>
//                         <span><FaMapMarkerAlt className="me-2" size={14} /> <span className="text-capitalize">{area.name}</span></span>
//                         <FaArrowRight size={12} />
//                       </Link>
//                     ))}
//                   </div>
//                 </div>

//                 </Block>
//               </div>
//             </div>
//         {/* NEARBY MAJOR CITIES AT THE BOTTOM WITH DYNAMIC BANNERS */}
//         {nearbyCityCards.length > 0 && (
//           <Block id="nearbyCities" className="col-12 city-block-bottom">
//           <div className="pt-5 border-top">
//             <div className="d-flex justify-content-between align-items-end mb-4">
//               <h2 className="font-outfit fw-bold text-dark h3">{citySettings.nearbyCitiesTitle || "Nearby Cities"}</h2>
//               <Link href="/services" className="text-decoration-none fw-bold small text-gradient">VIEW ALL CITIES <FaArrowRight /></Link>
//             </div>
//             <div className="row g-4 mobile-slider-wrapper">
//               {nearbyCityCards.map((entry, idx) => {
//                 const cityImg = entry.image
//                   ? getBackendImageUrl(entry.image)
//                   : cityBannerMap[entry.slug || ""] || getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg');
//                 return (
//                   <div className="col-lg-4" key={`${entry.url}-${idx}`}>
//                     <Link href={entry.url} className="text-decoration-none">
//                       <div className="related-card bg-white position-relative shadow-sm h-100 rounded-4 overflow-hidden">
//                         <div style={{ height: "200px", position: "relative" }}>
//                           <Image
//                             src={cityImg}
//                             alt={entry.name}
//                             width={800}
//                             height={400}
//                             sizes="(max-width: 991px) 88vw, 33vw"
//                             style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
//                             loading="lazy"
//                           />
//                           <div className="position-absolute bottom-0 start-0 p-4 w-100 text-white fw-bold" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
//                             <FaMapMarkerAlt className="me-2 text-warning" /> {entry.name.toUpperCase()}
//                           </div>
//                         </div>
//                       </div>
//                     </Link>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//           </Block>
//         )}
//           </div>
//         </div>

//       </main>
//     </MainLayout>
//   );
// };

// export default ServicesDetailPage;




// import { notFound } from "next/navigation";
// import MainLayout from "../layouts/MainLayout";
// import { defaultAltText } from "@/utils/helper";
// import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
// import Image from "next/image"; 
// import Link from "next/link";
// import DOMPurify from "isomorphic-dompurify";

// import { 
//   FaMapMarkerAlt, FaArrowRight, FaPhoneAlt, FaEnvelope, FaUser, 
//   FaShieldAlt, FaGem, FaClock, FaTrophy, FaStar, FaAward, 
//   FaCheckCircle, FaWallet, FaTools, FaDraftingCompass, FaHardHat, FaHome,
//   FaWhatsapp, FaPlus, FaChevronDown, 
//   FaSmile, FaUsers, FaCalendarAlt 
// } from "react-icons/fa";

// // Add wildcard import for dynamic icon rendering
// import * as FaIcons from "react-icons/fa";

// import { getBackendImageUrl } from "@/utils/helper";
// import { SidebarForm, BottomContactForm } from "./CityForms";
// import ProjectGallery from "./ProjectGallery";
// import { getPageSEO } from "@/utils/getSEO";
// import { cityUrlMap } from "@/utils/cityRoutes";
// import { getSectionOrder } from "@/utils/citySections";
// import { getCityContent, fillCity, parseVideoUrl, DEFAULT_CITY_CONTENT } from "@/utils/cityContent";
// const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
// const safeTag = (t, fallback) => (HEADING_TAGS.includes(t) ? t : fallback);

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";

// // City Banner Map for dynamic nearby cities images
// const cityBannerMap = {
//   "delhi": "/images/nearby cities/Delhi.png",
//   "faridabad": "/images/nearby cities/Faridabad.png",
//   "gurugram": "/images/nearby cities/Gurugram.png",
//   "noida": "/images/nearby cities/Noida.png",
//   "greater_noida": "/images/nearby cities/Greater Noida.png",
// };

// // Sub-City Logic for the new sidebar widget
// const subCitiesMap = {
//   "noida": [
//     { name: "Sector 150", link: "/interior-designers-in-noida-sector-150" },
//     { name: "Sector 137", link: "/interior-designers-in-noida-sector-137" },
//     { name: "Sector 74", link: "/interior-designers-in-noida-sector-74" },
//     { name: "Sector 75", link: "/interior-designers-in-noida-sector-75" },
//     { name: "Sector 143", link: "/interior-designers-in-noida-sector-143" },
//     { name: "Sector 104", link: "/interior-designers-in-noida-sector-104" },
//     { name: "Sector 50", link: "/interior-designers-in-noida-sector-50" },
//     { name: "Sector 93A", link: "/interior-designers-in-noida-sector-93a" },
//     { name: "Sector 128", link: "/interior-designers-in-noida-sector-128" },
//     { name: "Sector 44", link: "/interior-designers-in-noida-sector-44" },
//   ],
//   "gurugram": [
//     { name: "Golf Course Road", link: "/interior-designers-in-gurgaon-golf-course-road" },
//     { name: "DLF Phase 1", link: "/interior-designers-in-gurgaon-dlf-phase-1" },
//     { name: "DLF Phase 5", link: "/interior-designers-in-gurgaon-dlf-phase-5" },
//     { name: "Sector 56", link: "/interior-designers-in-gurgaon-sector-56" },
//     { name: "Sector 65", link: "/interior-designers-in-gurgaon-sector-65" },
//     { name: "Sohna Road", link: "/interior-designers-in-gurgaon-sohna-road" },
//     { name: "Sector 54", link: "/interior-designers-in-gurgaon-sector-54" },
//     { name: "Sector 57", link: "/interior-designers-in-gurgaon-sector-57" },
//   ],
//   "delhi": [
//     { name: "Vasant Vihar", link: "/interior-designers-in-delhi-vasant-vihar" },
//     { name: "Dwarka", link: "/interior-designers-in-dwarka" },
//     { name: "South Extension", link: "/interior-designers-in-delhi-south-extension" },
//     { name: "Greater Kailash", link: "/interior-designers-in-delhi-greater-kailash" },
//     { name: "Defence Colony", link: "/interior-designers-in-delhi-defence-colony" },
//     { name: "Hauz Khas", link: "/interior-designers-in-delhi-hauz-khas" },
//     { name: "Punjabi Bagh", link: "/interior-designers-in-delhi-punjabi-bagh" },
//     { name: "Rohini", link: "/interior-designers-in-delhi-rohini" },
//     { name: "Janakpuri", link: "/interior-designers-in-delhi-janakpuri" },
//   ]
// };

// // --- DATA FETCHERS ---
// async function getCityData(city) {
//   try {
//     const res = await fetch(`${API_BASE_URL}/cms-city/${city}`, { next: { revalidate: 60 } });
//     if (!res.ok) return null;
//     return await res.json();
//   } catch (error) { return null; }
// }

// async function getRecentBlogs() {
//   try {
//     const res = await fetch(`${API_BASE_URL}/cms-blog`, { next: { revalidate: 60 } });
//     if (!res.ok) return [];
//     const data = await res.json();
//     return Array.isArray(data) ? data.slice(0, 100) : [];
//   } catch (error) { return []; }
// }

// const getCityMediaMeta = (record) => parseSettings(record?.json_content ?? record?.jsonContent);
// const getCityMediaImage = (record) => record?.image || record?.image_url || getCityMediaMeta(record).image || "";

// // Replaced previous homeContent fetcher with the dynamic Excellence Stats fetcher
// async function getExcellenceStats() {
//   try {
//     const timestamp = new Date().getTime();
//     const res = await fetch(`${API_BASE_URL}/cms-content/excellence_stats?t=${timestamp}`, { 
//       cache: "no-store",
//       headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
//     });
//     if (!res.ok) return null;
//     const data = await res.json();
//     const record = Array.isArray(data) ? data[0] : data;
//     if (record && record.json_content) {
//       const jsonContent = typeof record.json_content === "string" 
//         ? JSON.parse(record.json_content) 
//         : record.json_content;
//       return jsonContent?.items || null;
//     }
//     return null;
//   } catch (error) { 
//     return null; 
//   }
// }

// const parseJsonSafe = (data) => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   try { return JSON.parse(data); } catch (e) { return []; }
// };

// const parseSettings = (value) => {
//   if (!value) return {};
//   if (typeof value === "object" && !Array.isArray(value)) return value;
//   try {
//     const parsed = JSON.parse(value);
//     return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
//   } catch {
//     return {};
//   }
// };

// const normalizeCmsRecords = (value) => {
//   if (Array.isArray(value)) return value;
//   if (!value) return [];
//   if (Array.isArray(value.records)) return value.records;
//   if (Array.isArray(value.data)) return value.data;
//   return [value];
// };

// const humanizeCity = (value) => String(value || "").replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
// const safeInternalHref = (value, fallback = "/contact") => {
//   const href = String(value || "").trim();
//   return href.startsWith("/") && !href.startsWith("//") ? href : fallback;
// };

// const DEFAULT_PROMISE_ITEMS = [
//   { title: "Transparent Pricing", description: "No hidden costs, ever." },
//   { title: "In-House Execution", description: "No third-party contractors involved." },
// ];

// const normalizeList = (value) => {
//   if (Array.isArray(value)) return value;
//   if (typeof value === "string" && value.trim()) {
//     try {
//       const parsed = JSON.parse(value);
//       return Array.isArray(parsed) ? parsed : [];
//     } catch { return []; }
//   }
//   return [];
// };

// // --- SEO METADATA ---
// export async function generateMetadata({ searchParams }) {
//   const city = searchParams?.city && searchParams.city !== "undefined" ? searchParams.city : "delhi";
//   // const fallbackPath = cityUrlMap[city] || `/services-detail/${city}`;
//   const fallbackPath = cityUrlMap[city] || `/interior-designers-in-${city}`;
  
//   const [pageData, seoData] = await Promise.all([
//     getCityData(city),
//     getPageSEO(fallbackPath).catch(() => null)
//   ]);

//   const canonicalUrl = getCanonicalUrl({ 
//     canonicalUrl: seoData?.alternates?.canonical || pageData?.seo_content?.canonical_url, 
//     fallbackPath 
//   });

//   if (!pageData) return { title: "Services", robots: { index: false, follow: true } };


//     const title =
//     seoData?.title || pageData?.seo_content?.meta_title || `${pageData.main_title} - Services`;
//   const description =
//     seoData?.description || pageData?.seo_content?.meta_description || "Best Interior Design Services";

//   // share image: SEO Manager OG image > this city's hero banner > logo
//   const og = seoData?.openGraph;
//   const ogImages = og?.images?.length
//     ? og.images
//     : [{ url: pageData?.banner_image ? getBackendImageUrl(pageData.banner_image) : "/images/new_hc_logo.png" }];

//   return {
//     title,
//     description,
//     keywords: seoData?.keywords || pageData?.seo_content?.meta_keywords || "",
//     alternates: { canonical: canonicalUrl },
//     robots: seoData?.robots || getRobotsDirectives(pageData?.seo_content),
//     openGraph: {
//       title: og?.title || title,
//       description: og?.description || description,
//       url: canonicalUrl,
//       siteName: "High Creation Interior",
//       locale: "en_IN",
//       type: "website",
//       images: ogImages,
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: seoData?.twitter?.title || og?.title || title,
//       description: seoData?.twitter?.description || og?.description || description,
//       images: seoData?.twitter?.images?.length
//         ? seoData.twitter.images
//         : ogImages.map((i) => i.url),
//     },
//   };
// }

// const ServicesDetailPage = async ({ searchParams }) => {
//   const city = searchParams?.city && searchParams.city !== "undefined" ? searchParams.city : "delhi";
//   // const fallbackPath = cityUrlMap[city] || `/services-detail/${city}`;
//   const fallbackPath = cityUrlMap[city] || `/interior-designers-in-${city}`;

//   // Fetch Data + Global SEO schemas + Dynamic Excellence Stats concurrently
//   const [pageData, recentBlogs, seoData, excellenceStats] = await Promise.all([
//     getCityData(city),
//     getRecentBlogs(),
//     getPageSEO(fallbackPath).catch(() => null),
//     getExcellenceStats(),
//   ]);
  
//   if (!pageData) notFound();

//   // City-specific settings and uploaded images are stored on cms_city.
//   // Avoid the legacy /cms-content/city_page_settings and city_page_media endpoints.
//   const cityExtras = { settings: {}, media: [] };

//   const customSchema = seoData?.customSchema;
//   const safeDescription = pageData?.main_description ? DOMPurify.sanitize(pageData.main_description) : "";
//   const safeSideDescription = pageData?.side_description ? DOMPurify.sanitize(pageData.side_description) : "";
//   const HeroTag = safeTag(pageData?.banner_title ? pageData?.banner_title_tag : pageData?.main_title_tag, "h1");
// const SideTag = safeTag(pageData?.side_title_tag, "h3");
  
//   const displayCity = city.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   const faqs = parseJsonSafe(pageData.faqs);
//   const legacyCitySettings = parseSettings(pageData?.city_settings ?? pageData?.city_settings_json);
//   const citySettings = { ...legacyCitySettings, ...(cityExtras?.settings || {}) };
//   // Admin-defined section order (desktop / mobile). Falls back to the current layout.
//   const sectionOrder = getSectionOrder(citySettings.sectionOrder);
//   const Block = ({ id, className = "", children }) => (
//     <div
//       className={`city-block ${className}`.trim()}
//       style={{ "--d": sectionOrder.desktop.indexOf(id), "--m": sectionOrder.mobile.indexOf(id) }}
//     >
//       {children}
//     </div>
//   );

//   // CMS-editable section content (falls back to the previous hard-coded text)
//   const content = getCityContent(citySettings.content);
//   const t = (value) => fillCity(value, displayCity);
//   const pickTag = (value, fallback) => safeTag(value, fallback);
//   const iconOf = (name, Fallback) => FaIcons[name] || Fallback;
//   const ProcessTitleTag = pickTag(content.process.titleTag, "h2");
//   const ProjectsTitleTag = pickTag(content.projects.titleTag, "h2");
//   const BlogsTitleTag = pickTag(content.blogs.titleTag, "h2");
//   const WhyTitleTag = pickTag(content.whyChoose.titleTag, "h2");
//   const FaqTitleTag = pickTag(content.faqs.titleTag, "h2");

//   // Stats: city-level custom stats > global Excellence Stats (CMS Content) > built-in defaults
//   const customStatItems = content.stats.useCustom
//     ? content.stats.items.filter((stat) => stat.value || stat.label)
//     : [];
//   const statItems = customStatItems.length
//     ? customStatItems.map((stat) => ({ ...stat, color: "#ff914d", size: 40 }))
//     : (excellenceStats && excellenceStats.length > 0)
//       ? excellenceStats.map((stat) => ({ ...stat, valueTag: "h3", color: stat.color || "#f5a623" }))
//       : DEFAULT_CITY_CONTENT.stats.items.map((stat) => ({ ...stat, color: "#ff914d", size: 40 }));

//   // FAQs: CMS FAQ items > legacy pageData.faqs
//   const customFaqItems = content.faqs.items.filter((faq) => faq.question.trim() && faq.answer.trim());
//   const faqItems = customFaqItems.length
//     ? customFaqItems
//     : faqs.filter((faq) => faq && faq.question).map((faq) => ({ question: faq.question, answer: faq.answer || "" }));
//   const siteVisitSettings = citySettings.siteVisit || {};
//   const mobileBannerMedia = (cityExtras?.media || []).find((record) => getCityMediaMeta(record).slot === "mobile_banner");
//   const mobileHeroBanner = getCityMediaImage(mobileBannerMedia) || pageData?.mobile_banner_image || "";
//   const promiseItems = normalizeList(citySettings.promiseItems).filter((item) => item && (item.title || item.description));
//   const activePromiseItems = promiseItems.length ? promiseItems : DEFAULT_PROMISE_ITEMS;

//   const savedBlogIds = normalizeList(citySettings.designInspirationBlogIds ?? citySettings.design_inspiration_blog_ids)
//     .map((id) => String(id));
//   const matchingSelectedBlogs = savedBlogIds.length
//     ? savedBlogIds.map((id) => recentBlogs.find((blog) => String(blog.id) === id)).filter(Boolean)
//     : [];
//   const designInspirationBlogs = matchingSelectedBlogs.length ? matchingSelectedBlogs : recentBlogs.slice(0, 4);

//   const projectList = normalizeList(citySettings.projectImages ?? citySettings.project_images);
//   const projectPhotos = Array.from({ length: 6 }, (_, index) => {
//     const slot = `project_${index + 1}`;
//     const mediaRecord = (cityExtras?.media || []).find((record) => getCityMediaMeta(record).slot === slot);
//     const mediaMeta = getCityMediaMeta(mediaRecord);
//     const project = projectList[index] || {};
//     const directImage = pageData?.[`project_image_${index + 1}`];
//     const image = getCityMediaImage(mediaRecord)
//       || (typeof project === "string" ? project : (project.image || project.src || project.url))
//       || directImage;
//     const alt = mediaMeta.alt || (typeof project === "object" ? project.alt : "") || pageData?.[`project_image_${index + 1}_alt`] || `${displayCity} interior design project ${index + 1}`;
//     const title = mediaMeta.title || (typeof project === "object" ? project.title : "") || `${displayCity} Interior Project ${index + 1}`;
//     return image ? { image, alt, title } : null;
//   }).filter(Boolean);

//   // Photos: the six fixed uploads first, then any extra photos / testimonial videos added in the CMS
//   const galleryItems = [
//     ...projectPhotos.map((photo) => ({
//       type: "image",
//       image: getBackendImageUrl(photo.image),
//       alt: photo.alt,
//       title: photo.title,
//       optimized: true,
//     })),
//     ...content.projects.gallery.flatMap((item, index) => {
//       if (item.type === "video") {
//         if (!item.videoUrl || !parseVideoUrl(item.videoUrl)) return [];
//         return [{
//           type: "video",
//           image: item.poster ? getBackendImageUrl(item.poster) : "",
//           alt: item.alt || `${displayCity} client testimonial video`,
//           title: item.title,
//           videoUrl: item.videoUrl,
//         }];
//       }
//       if (!item.src) return [];
//       return [{
//         type: "image",
//         image: getBackendImageUrl(item.src),
//         alt: item.alt || `${displayCity} interior design project ${projectPhotos.length + index + 1}`,
//         title: item.title,
//         optimized: false,
//       }];
//     }),
//   ];

//   const customServiceAreas = normalizeList(citySettings.serviceAreas ?? citySettings.service_areas)
//     .filter((area) => area && (area.name || area.title) && (area.url || area.href));
//   const serviceAreas = customServiceAreas.length ? customServiceAreas.map((area) => ({
//     name: area.name || area.title,
//     url: safeInternalHref(area.url || area.href, cityUrlMap[city] || "/services"),
//     slug: area.slug || "",
//   })) : Object.entries(cityUrlMap).map(([slug, url]) => ({ name: humanizeCity(slug), url, slug }));

//   const customNearbyCities = normalizeList(citySettings.nearbyCities ?? citySettings.nearby_cities)
//     .filter((entry) => entry && (entry.name || entry.title) && (entry.url || entry.href));
//   const nearbyCityCards = (customNearbyCities.length ? customNearbyCities.map((entry) => ({
//     name: entry.name || entry.title,
//     slug: entry.slug || Object.keys(cityUrlMap).find((slug) => cityUrlMap[slug] === (entry.url || entry.href)) || "",
//     url: safeInternalHref(entry.url || entry.href, "/services"),
//     image: entry.image || entry.imageUrl || "",
//   })) : Object.keys(cityUrlMap).filter((slug) => slug !== city).slice(0, 3).map((slug) => ({
//     name: humanizeCity(slug), slug, url: cityUrlMap[slug], image: cityBannerMap[slug] || "",
//   }))).filter((entry) => entry.slug !== city && entry.url !== cityUrlMap[city]);

//   const visitTitle = siteVisitSettings.title || citySettings.siteVisitTitle || "Book a Site Visit";
//   const visitDescription = (siteVisitSettings.description || citySettings.siteVisitDescription || "Expert designers will visit your {city} property.").replace(/\{city\}/gi, displayCity);
//   const visitButtonText = siteVisitSettings.buttonText || citySettings.siteVisitButtonText || "Schedule Now";
//   const visitButtonUrl = safeInternalHref(siteVisitSettings.buttonUrl || citySettings.siteVisitButtonUrl || "/contact");
//   const VisitTitleTag = pickTag(siteVisitSettings.titleTag || citySettings.siteVisitTitleTag, "h4");
//   const PromiseTitleTag = pickTag(citySettings.promiseTitleTag, "h4");
  
//   // Localities Logic for Sidebar Widget
//   const currentSubCities = subCitiesMap[city] || [];
//   const initialSubCities = currentSubCities.slice(0, 6);
//   const hiddenSubCities = currentSubCities.slice(6);

//   return (
//     <MainLayout>
//       {/* Inject the Custom Schema from the Global SEO Tag Manager */}
//       {customSchema && (
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ 
//             __html: typeof customSchema === 'string' 
//               ? customSchema.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '') 
//               : JSON.stringify(customSchema)
//           }}
//         />
//       )}

//       {/* Legacy Fallback (Inner Custom Code) */}
//       {pageData?.seo_content?.custom_code && (
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ 
//             __html: pageData.seo_content.custom_code.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '') 
//           }}
//         />
//       )}
//       <style dangerouslySetInnerHTML={{__html: `
//         :root { --hc-primary: #ff914d; --hc-dark: #0f172a; }
//         .font-outfit { font-family: var(--font-outfit), sans-serif; }
//         .font-poppins { font-family: var(--font-poppins), sans-serif; }
//         .text-gradient { background: linear-gradient(135deg, #ff914d 0%, #ff5722 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
//         .lazy-render { content-visibility: auto; contain-intrinsic-size: 1px 800px; }

//         .faq-main-title { font-family: var(--font-outfit), sans-serif; font-size: clamp(1.75rem, 6vw, 2.5rem); font-weight: 800; color: var(--hc-dark); line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 2rem; position: relative; padding-bottom: 12px; }
//         .faq-main-title::after { content: ""; position: absolute; left: 0; bottom: 0; width: 60px; height: 4px; background: linear-gradient(135deg, var(--hc-primary) 0%, #ff5722 100%); border-radius: 2px; }

//         .faq-premium-item { border: none !important; margin-bottom: 16px; border-radius: 16px !important; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); background: #ffffff; border: 1px solid #f1f5f9 !important; }
//         .faq-premium-btn { width: 100%; text-align: left; background: white; border: none; padding: clamp(16px, 4vw, 24px); font-weight: 700; font-size: clamp(1.05rem, 3.5vw, 1.2rem); color: var(--hc-dark); display: flex; justify-content: space-between; align-items: center; box-shadow: none !important; line-height: 1.4; gap: 15px; }
//         .faq-premium-btn:not(.collapsed) { color: var(--hc-primary); background: #fffcf9; }
//         .faq-icon-toggle { transition: transform 0.3s ease; color: var(--hc-primary); flex-shrink: 0; }
//         .faq-premium-btn:not(.collapsed) .faq-icon-toggle { transform: rotate(45deg); color: #ff5722; }
//         .faq-premium-body { padding: 0 clamp(16px, 4vw, 24px) 20px; color: #475569; font-size: clamp(0.95rem, 3vw, 1.05rem); line-height: 1.7; background: #fffcf9; }
        
//         .rich-text-content figure, 
//         .rich-text-content figure.image { margin: 2rem auto !important; max-width: 100% !important; height: auto !important; display: flex; justify-content: center; }
//         .rich-text-content img { max-width: 100% !important; height: auto !important; border-radius: 12px; display: block !important; margin: 0 auto !important; object-fit: contain !important; }
//         .rich-text-content iframe, .rich-text-content video, .rich-text-content table { max-width: 100% !important; overflow-x: auto; display: block !important; margin: 2rem auto !important; }

//         .rich-text-content h2, .rich-text-content h3 { font-family: var(--font-outfit), sans-serif; font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 700; color: #0f172a; margin-top: 2rem; margin-bottom: 1rem; }
//         .rich-text-content p { font-family: var(--font-poppins), sans-serif; font-size: 1rem; line-height: 1.8; color: #475569; margin-bottom: 1.2rem; }
        
//         .rich-text-content ul { display: flex; flex-direction: column; gap: 1rem; padding: 0; list-style: none; margin: 2rem 0; }
//         .rich-text-content ul li { background: #fdfdfd; border: 1px solid #f1f5f9; padding: 1.2rem 1.5rem 1.2rem 3rem; border-radius: 12px; display: block; position: relative; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: 0.3s; }
//         .rich-text-content ul li:hover { border-color: var(--hc-primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,145,77,0.1); }
//         .rich-text-content ul li::before { content: '✦'; color: var(--hc-primary); position: absolute; left: 1.2rem; top: 1.2rem; font-size: 1.2rem; font-weight: bold; line-height: 1.5; }

//         .rich-text-content ol { display: flex; flex-direction: column; gap: 1rem; padding: 0; margin: 2rem 0; list-style: none; counter-reset: custom-ol-counter;}
// .rich-text-content ol li { background: #fdfdfd; border: 1px solid #f1f5f9; padding: 1.2rem 1.5rem 1.2rem 3rem; border-radius: 12px; display: block; position: relative; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: 0.3s; list-style-type: decimal; counter-increment: custom-ol-counter; }
// .rich-text-content ol li:hover { border-color: var(--hc-primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,145,77,0.1); }
// .rich-text-content ol li::before { 
//   content: counter(custom-ol-counter) "."; 
//   color: var(--hc-primary); 
//   position: absolute; 
//   left: 1.2rem; 
//   top: 1.2rem; 
//   font-size: 1.1rem; 
//   font-weight: bold; 
//   line-height: 1.5; 
// }

//         .micro-trust-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; }
//         .micro-trust-item:last-child { border-bottom: none; padding-bottom: 0; }
//         .micro-trust-icon { color: #22c55e; font-size: 18px; margin-right: 12px; }

//         .floating-contact-widget { position: fixed; right: 20px; top: 55%; transform: translateY(-50%); z-index: 999; display: flex; flex-direction: column; gap: 12px; }
//         .widget-btn { width: 55px; height: 55px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.2); transition: 0.3s; text-decoration: none; }
//         .widget-btn:hover { transform: scale(1.1); color: white; }
//         .widget-btn.call { background: var(--hc-primary); }

//         @media (max-width: 768px) {
//         main.bg-light {
//     overflow-x: hidden;
//   }
//           .mobile-slider-wrapper { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; scroll-snap-type: x mandatory; gap: 15px; padding: 10px 0 30px; -webkit-overflow-scrolling: touch; scrollbar-width: none;
//           margin-left: 0 !important; 
//           margin-right: 0 !important; }
//           .mobile-slider-wrapper::-webkit-scrollbar { display: none; }
//           .mobile-slider-wrapper > div { flex: 0 0 88% !important; scroll-snap-align: center; }
//           .rich-text-content ul, .rich-text-content ol{ display: flex; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 1rem; }
//           .rich-text-content li, .rich-text-content ol li { flex: 0 0 85%; }
//           .rich-text-content ol { padding-left: 0; list-style-position: inside; }

//           .process-slider > div { 
//     flex: 0 0 100% !important; /* Shows exactly one card at a time */
//     padding: 0 10px; /* Optional: adds a little breathing room */
//   }
//   .process-slider .process-step { 
//     flex-direction: column; 
//     align-items: center; 
//     text-align: center; 
//   }
//   .process-slider .process-icon { 
//     margin-right: 0; 
//     margin-bottom: 15px; 
//   }
//   .process-slider .process-step::after { 
//     display: none !important; /* Removes the vertical connecting line */
//   }
//     .modern-card-slider > div { 
//     flex: 0 0 100% !important; /* 👈 Shows exactly 1 card at a time on mobile */
//   }
//         }

//         .city-hero { height: 55vh; min-height: 450px; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: #1e293b; }
//         .city-hero-picture { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
//         .city-hero-picture img { display: block; }
//         .city-project-card { position: relative; overflow: hidden; border-radius: 16px; background: #f1f5f9; aspect-ratio: 4 / 3; }
//         .city-project-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
//         .city-project-card figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 36px 16px 14px; color: #fff; font-weight: 600; background: linear-gradient(transparent, rgba(15,23,42,.78)); }

//         .hero-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.95) 100%); z-index: 1; }
//         .hero-content { position: relative; z-index: 2; text-align: center; color: white; padding-top: 40px; }
//         .hero-badge { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); padding: 8px 24px; border-radius: 30px; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; display: inline-flex; align-items: center; color: #fff; font-weight: 600; }
//         .city-main-container { margin-top: -80px; position: relative; z-index: 10; }
//         .premium-card { background: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.04); padding: 40px; margin-bottom: 40px; border: 1px solid rgba(0,0,0,0.02); }
        
//         .hero-main-title { font-size: clamp(2.4rem, 5vw, 3.8rem); line-height: 1.1; letter-spacing: -0.02em; }
//         .process-step { display: flex; align-items: flex-start; margin-bottom: 30px; position: relative; }
//         .process-step:last-child { margin-bottom: 0; }
//         .process-icon { width: 50px; height: 50px; min-width: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-right: 20px; z-index: 2; }
//         .process-step:not(:last-child)::after { content: ''; position: absolute; left: 24px; top: 50px; bottom: -30px; width: 2px; background: #ffe4d6; z-index: 1; }

//         .trust-box { padding: 30px 20px; border-radius: 16px; background: #fafafa; border: 1px solid #f0f0f0; transition: all 0.3s ease; height: 100%; text-align: center; }
//         .trust-box:hover { background: #ffffff; transform: translateY(-5px); box-shadow: 0 15px 30px rgba(255,145,77,0.08); border-color: #ff914d; }
//         .trust-icon { width: 60px; height: 60px; background: #fff4ed; color: #ff914d; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px; }

//         .excellence-stat { text-align: center; padding: 20px; position: relative; }
//         @media (min-width: 768px) { .excellence-stat::after { content: ""; position: absolute; right: 0; top: 20%; height: 60%; width: 1px; background: #e2e8f0; } .excellence-stat:last-child::after { display: none; } }
        
//         .right-sidebar-sticky { position: sticky; top: 100px; height: max-content; }
//         .sidebar-widget { background: #ffffff; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.05); padding: 30px; margin-bottom: 30px; border: 1px solid rgba(0,0,0,0.03); }
//         .widget-title { font-family: var(--font-outfit), sans-serif; font-weight: 700; font-size: 20px; margin-bottom: 25px; position: relative; padding-bottom: 10px; }
//         .widget-title::after { content: ""; position: absolute; left: 0; bottom: 0; width: 40px; height: 3px; background: #ff914d; border-radius: 2px; }

//         .sidebar-cta { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 20px; padding: 30px 20px; text-align: center; color: white; margin-bottom: 30px; position: relative; overflow: hidden; }
//         .nav-city-link { display: flex; align-items: center; justify-content: space-between; padding: 12px 15px; border-radius: 10px; color: #475569; text-decoration: none; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: all 0.2s ease; background: #f8fafc; margin-bottom: 10px; }
//         .nav-city-link:hover, .nav-city-link.active { background: #ff914d; color: white; transform: translateX(5px); }
//         .nav-city-link.active { pointer-events: none; }
//         .sidebar-cta h4 { color: #ffffff !important; }

//         .related-card { overflow: hidden; border-radius: 16px; transition: transform 0.3s ease; border: 1px solid #f0f0f0; }
//         .related-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
        
//         .modern-card { background: #ffffff; padding: 30px 25px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: all 0.3s ease; height: 100%; position: relative; overflow: hidden;text-align: center;}
//         .modern-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border-color: #ff914d;}
//         .modern-card-icon { width: 50px; height: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin: 0 auto 20px; transition: transform 0.3s ease;}
//         .modern-card:hover .modern-card-icon { transform: scale(1.1); background: #ff914d; color: white; }
        
//         .approach-number { width: 60px; height: 60px; background: #fff4ed; color: #ff914d; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin: 0 auto 15px; }

//         .subcity-pill { display: inline-flex; align-items: center; padding: 8px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 30px; font-size: 13px; color: #475569; text-decoration: none; font-family: var(--font-poppins), sans-serif; font-weight: 500; transition: all 0.3s ease; margin-bottom: 8px; margin-right: 8px; }
//         .subcity-pill:hover { background: #ff914d; color: white; border-color: #ff914d; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(255,145,77,0.2); }
//         .view-all-btn[aria-expanded="true"] .fa-chevron-down { transform: rotate(180deg); transition: 0.3s ease; }
//         .view-all-btn[aria-expanded="false"] .fa-chevron-down { transition: 0.3s ease; }

//         /* --- Admin-controlled section order (CMS > City > Section Order) --- */
//         .city-col-stack { display: flex; flex-direction: column; }
//         .city-block { order: var(--d); }
//         .city-cols > .city-block-bottom { order: 1; }
//         @media (max-width: 991.98px) {
//           /* columns stack on tablet/mobile: dissolve the wrappers so blocks from the
//              main column, sidebar and bottom strip can be interleaved with CSS order */
//           .row.city-cols { flex-direction: column; flex-wrap: nowrap; margin-top: 0; }
//           .city-cols > .col-lg-8,
//           .city-cols > .col-lg-4,
//           .city-cols .city-col-stack { display: contents; }
//           .city-cols .city-block { order: var(--m); width: 100%; padding-inline: calc(var(--bs-gutter-x) * .5); }
//         }

//         /* stats strip: show ALL icons on mobile (grid instead of a swipe slider) */
//         @media (max-width: 768px) {
//           .city-stats-grid { display: grid !important; grid-template-columns: repeat(var(--stat-cols, 3), minmax(0, 1fr)); gap: 6px; margin: 0 !important; }
//           .city-stats-grid > .excellence-stat { width: auto !important; max-width: 100% !important; padding: 8px 2px !important; margin: 0 !important; }
//           .city-stats-grid .excellence-stat svg, .city-stats-grid .excellence-stat img { width: 28px !important; height: 28px !important; margin-bottom: .5rem !important; }
//           .city-stats-grid .excellence-stat .h2 { font-size: 1.15rem; }
//           .city-stats-grid .excellence-stat p { font-size: .62rem; letter-spacing: .02em; }
//           .premium-card.stats-card { padding: 18px 8px; }
//         }

//         /* FAQ accordion (split layout) */
//         .faq-eyebrow { color: var(--hc-primary); font-weight: 700; font-size: .75rem; letter-spacing: .22em; text-transform: uppercase; margin-bottom: .75rem; }
//         .faq-split-title { font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--hc-dark); font-size: clamp(1.6rem, 3.2vw, 2.2rem); margin-bottom: 1rem; }
//         .faq-split-intro { color: #64748b; font-size: .9rem; line-height: 1.7; margin-bottom: 0; }
//         .faq-split-list { border-top: 1px solid #f0dccd; }
//         .faq-split-item { border-bottom: 1px solid #f0dccd; }
//         .faq-split-q { margin: 0; font-size: inherit; font-weight: inherit; }
//         .faq-split-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; text-align: left; background: none; border: 0; padding: 22px 4px; font-weight: 600; font-size: 1rem; line-height: 1.45; color: var(--hc-dark); }
//         .faq-split-btn:not(.collapsed) { color: var(--hc-primary); }
//         .faq-split-toggle { width: 28px; height: 28px; border-radius: 50%; background: #fff1e8; color: var(--hc-primary); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 11px; }
//         .faq-split-btn .faq-minus { display: none; }
//         .faq-split-btn:not(.collapsed) .faq-minus { display: block; }
//         .faq-split-btn:not(.collapsed) .faq-plus { display: none; }
//         .faq-split-body { padding: 0 4px 22px; color: #64748b; font-size: .92rem; line-height: 1.8; white-space: pre-line; }
//       `}} />

//       <main className="bg-light pb-5">
        
//         {/* --- HERO SECTION --- */}
//         <div className="city-hero w-100">
//           <picture className="city-hero-picture">
//             {mobileHeroBanner && (
//               <source
//                 media="(max-width: 767px)"
//                 srcSet={getBackendImageUrl(mobileHeroBanner)}
//               />
//             )}
//             <Image
//               src={pageData?.banner_image ? getBackendImageUrl(pageData.banner_image) : getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg')}
//               alt={
//                 getCityMediaMeta(mobileBannerMedia).alt?.trim()
//                   || pageData?.banner_image_alt?.trim()
//                   || pageData?.banner_title || pageData?.main_title || `${displayCity} Interior Design`
//               }
//               width={1920}
//               height={800}
//               priority
//               sizes="100vw"
//               style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
//             />
//           </picture>
//           <div className="container hero-content font-poppins">
//             <div className="hero-badge"><FaMapMarkerAlt className="me-2" /> {pageData?.banner_subtitle || `High Creation Interior in ${displayCity}`}</div>

//             <HeroTag className="hero-main-title fw-bold mb-3 font-outfit text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
//   {pageData?.banner_title || pageData?.main_title || `Interior Designers in ${displayCity}`}
// </HeroTag>
//           </div>
//         </div>

//         <div className="container city-main-container">
//           <div className="row g-5 city-cols">
            
//             {/* --- LEFT COLUMN: CONTENT HUB --- */}
//             <div className="col-lg-8">
//               {/* <div className="dual-sticky-wrapper"> */}
//                <div className="city-col-stack">
                
//                  {/* --- LENGTHY CONTENT --- */}
//                 <Block id="main">
//                  <div className="premium-card mb-4">
//                   {/* <h2 className="font-outfit fw-bold h3 mb-4 text-dark">
//                      Interior Designer In {displayCity}
//                   </h2> */}
//                   <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeDescription }} />
//                 </div>

//                 </Block>
//                 {/* --- DESIGN PROCESS GRID --- */}
//                 <Block id="process">
//                 <div className="lazy-render">
//                   <div className="premium-card bg-white border-0">
//                     <ProcessTitleTag className="font-outfit fw-bold h3 mb-4 text-dark text-center text-md-start">{t(content.process.title)}</ProcessTitleTag>
//                     <div className="mobile-slider-wrapper process-slider">
//                       {content.process.items.map((step, i) => {
//                         const StepIcon = iconOf(step.iconName, FaIcons.FaCheckCircle);
//                         const StepTag = pickTag(step.titleTag, "h4");
//                         return (
//                           <div className="process-step" key={i}>
//                             <div className="process-icon"><StepIcon /></div>
//                             <div>
//                               <StepTag className="font-outfit h5 fw-bold mb-1">{i + 1}. {t(step.title)}</StepTag>
//                               <p className="text-muted font-poppins small mb-0">{t(step.description)}</p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//                 </Block>
//                 {galleryItems.length > 0 && (
//                   <Block id="projects">
//                   <section className="lazy-render mb-4" aria-label={`Interior design projects in ${displayCity}`}>
//                     <div className="premium-card bg-white border-0">
//                       <ProjectsTitleTag className="font-outfit fw-bold h3 mb-4 text-dark">{t(content.projects.title)}</ProjectsTitleTag>
//                       <ProjectGallery items={galleryItems} />
//                     </div>
//                   </section>
//                   </Block>
//                 )}

//                 {designInspirationBlogs.length > 0 && (
//                   <Block id="blogs">
//                   <div className="lazy-render">
//                     <div className="premium-card border-0 px-0 pt-0">
//                       <BlogsTitleTag className="font-outfit fw-bold h3 mb-4">{t(content.blogs.title)}</BlogsTitleTag>
//                       <div className="row g-4 font-poppins mobile-slider-wrapper">
//                         {designInspirationBlogs.map((blog, idx) => (
//                           <div className="col-md-6" key={idx}>
//                             <Link href={`/${blog.seo_content?.slug || `blog-detail?id=${blog.id}`}`} className="text-decoration-none">
//                               <div className="d-flex align-items-center border p-3 rounded-4 bg-white shadow-sm h-100 transition-all hover:shadow-md">
//                                 <img src={blog.image || "/images/default.jpg"} alt={blog.title} 
//                                 width={80} height={80}
//                                 className="rounded" style={{ width: "80px", height: "80px",objectFit: "contain", flexShrink: 0 }} loading="lazy" />
//                                 <div className="ms-3">
//                                   <h6 className="text-dark fw-bold mb-1" style={{ fontSize: '14px' }}>{blog.title.length > 45 ? `${blog.title.substring(0, 45)}...` : blog.title}</h6>
//                                   <small className="text-gradient fw-bold">READ ARTICLE <FaArrowRight size={10} /></small>
//                                 </div>
//                               </div>
//                             </Link>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   </Block>
//                 )}
                
//                 {/* --- EXCELLENCE STATS (Dynamic CMS Icons) --- */}
//                 <Block id="stats">
//                 <div className="lazy-render">
//                   <div className="premium-card shadow-sm stats-card" style={{ background: 'linear-gradient(to right, #ffffff, #fff9f5)' }}>
//                     <div
//                       className="row align-items-center justify-content-center city-stats-grid"
//                       style={{ "--stat-cols": statItems.length <= 3 ? statItems.length : 2 }}
//                     >
//                       {statItems.map((stat, idx) => {
//                         const IconComponent = (stat.iconName && FaIcons[stat.iconName])
//                           ? FaIcons[stat.iconName]
//                           : FaIcons.FaStar;
//                         const StatTag = pickTag(stat.valueTag, "h3");
//                         const colWidth = statItems.length <= 3 ? 4 : Math.max(3, Math.floor(12 / statItems.length));

//                         return (
//                           <div className={`col-md-${colWidth} excellence-stat d-flex flex-column align-items-center justify-content-center text-center`} key={idx}>
//                             {stat.iconType === "image" && stat.image ? (
//                               <img
//                                 src={getBackendImageUrl(stat.image)}
//                                 alt={stat.label || "Stat Icon"}
//                                 width={stat.size || 40}
//                                 height={stat.size || 40}
//                                 style={{ width: `${stat.size || 40}px`, height: `${stat.size || 40}px`, objectFit: "contain" }}
//                                 className="mb-3"
//                               />
//                             ) : (
//                               <IconComponent
//                                 size={stat.size || 40}
//                                 color={stat.color || "#f5a623"}
//                                 className="mb-3"
//                               />
//                             )}
//                             <StatTag className="font-outfit fw-bold h2 mb-1">{stat.value}</StatTag>
//                             <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">{stat.label}</p>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//                 </Block>
//                 {/* --- WHY CHOOSE US (Modern Cards) --- */}
//                 <Block id="whyChoose">
//                 <div className="lazy-render">
//                   <div className="premium-card bg-transparent border-0 shadow-none px-0 py-0 mb-4">
//                     <div className="text-center mb-4">
//                         <WhyTitleTag className="font-outfit fw-bold h3 text-dark">{t(content.whyChoose.title)}</WhyTitleTag>
//                     </div>
//                     <div className="row g-4 mobile-slider-wrapper modern-card-slider">
//                       {content.whyChoose.items.map((item, idx) => {
//                         const CardIcon = iconOf(item.iconName, FaIcons.FaCheckCircle);
//                         const CardTag = pickTag(item.titleTag, "h4");
//                         const cardCols = content.whyChoose.items.length >= 4 ? 3 : content.whyChoose.items.length === 3 ? 4 : 6;
//                         return (
//                           <div className={`col-md-6 col-lg-${cardCols}`} key={idx}>
//                             <div className="modern-card">
//                               <div className="modern-card-icon"><CardIcon /></div>
//                               <CardTag className="font-outfit fw-bold h6">{t(item.title)}</CardTag>
//                               <p className="text-muted font-poppins small mb-0">{t(item.description)}</p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </div>
//                 </Block>
//                 {/* --- MORE LENGTHY CONTENT --- */}
//                 {(pageData?.side_title || safeSideDescription) && (
//                   <Block id="side">
//                   <div className="lazy-render">
//                     <div className="premium-card mb-4" style={{ background: '#fffcf9' }}>
//                       {/* <h3 className="font-outfit fw-bold h4 mb-3 text-dark">{pageData.side_title}</h3> */}

//                       <SideTag className="font-outfit fw-bold h4 mb-3 text-dark">{pageData.side_title}</SideTag>
//                       <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeSideDescription }} />
//                     </div>
//                   </div>
//                   </Block>
//                 )}

//                 {/* --- INTERACTIVE PREMIUM FAQs --- */}
//                 {faqItems.length > 0 && (
//                   <Block id="faqs">
//                   <div className="lazy-render">
//                     <div className="premium-card border-0 faq-split">
//                       <div className="row g-4 g-xl-5">
//                         <div className="col-xl-4">
//                           {content.faqs.eyebrow && <p className="faq-eyebrow font-poppins">{t(content.faqs.eyebrow)}</p>}
//                           <FaqTitleTag className="faq-split-title font-outfit">{t(content.faqs.title)}</FaqTitleTag>
//                           {content.faqs.intro && <p className="faq-split-intro font-poppins">{t(content.faqs.intro)}</p>}
//                         </div>
//                         <div className="col-xl-8">
//                           <div className="faq-split-list accordion font-poppins" id={`accordion-faq-${pageData?.id}`}>
//                             {faqItems.map((faq, index) => (
//                               <div className="faq-split-item" key={index}>
//                                 <h3 className="faq-split-q">
//                                   <button
//                                     className={`faq-split-btn ${index !== 0 ? "collapsed" : ""}`}
//                                     type="button"
//                                     data-bs-toggle="collapse"
//                                     data-bs-target={`#city-faq-${pageData?.id}-${index}`}
//                                     aria-expanded={index === 0 ? "true" : "false"}
//                                     aria-controls={`city-faq-${pageData?.id}-${index}`}
//                                   >
//                                     <span>{faq.question}</span>
//                                     <span className="faq-split-toggle" aria-hidden="true">
//                                       <FaPlus className="faq-plus" />
//                                       <FaIcons.FaMinus className="faq-minus" />
//                                     </span>
//                                   </button>
//                                 </h3>
//                                 <div
//                                   id={`city-faq-${pageData?.id}-${index}`}
//                                   className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
//                                   data-bs-parent={`#accordion-faq-${pageData?.id}`}
//                                 >
//                                   <div className="faq-split-body">{faq.answer}</div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   </Block>
//                 )}
                
//               </div>
//             </div>

//             {/* --- RIGHT COLUMN: SIDEBAR --- */}
//             <div className="col-lg-4">
//               {/* <div className="dual-sticky-wrapper"> */}
//               <div className="right-sidebar-sticky city-col-stack">
                
//                 {/* 1. TOP RIGHT: BOOK SITE VISIT CTA */}
//                 <Block id="siteVisit">
//                 <div className="sidebar-cta shadow-lg mb-4">
//                   <VisitTitleTag className="font-outfit fw-bold mb-2">{visitTitle}</VisitTitleTag>
//                   <p className="font-poppins small text-white-50 mb-4">{visitDescription}</p>
//                   <Link href={visitButtonUrl} className="btn btn-light w-100 fw-bold py-2 rounded-pill">{visitButtonText}</Link>
//                 </div>

//                 </Block>
//                 {/* 3. SIDEBAR FORM */}
//                 <Block id="sidebarForm">
//                 <SidebarForm city={city} />

//                 </Block>
//                 {/* 4. THE PROMISE */}
//                 <Block id="promise">
//                 <div className="sidebar-widget py-4 font-poppins lazy-render">
//                   <PromiseTitleTag className="widget-title mb-4">{citySettings.promiseTitle || "The Promise"}</PromiseTitleTag>
//                   {activePromiseItems.map((item, index) => {
//                     const PromiseIcon = (item.iconName && FaIcons[item.iconName]) || (index === 0 ? FaCheckCircle : FaTools);
//                     const isCheckIcon = item.iconName ? /^FaCheck/.test(item.iconName) : index === 0;
//                     return (
//                       <div className="micro-trust-item" key={`${item.title}-${index}`}>
//                         <PromiseIcon className={`micro-trust-icon${isCheckIcon ? "" : " text-warning"}`} />
//                         <div>
//                           <span className="d-block fw-bold text-dark" style={{ fontSize: '14px' }}>{item.title}</span>
//                           <span className="text-muted" style={{ fontSize: '12px' }}>{item.description}</span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 </Block>
//                 {/* 5. MAJOR CITIES */}
//                 <Block id="serviceAreas">
//                 <div className="sidebar-widget">
//                   <h4 className="widget-title">{citySettings.serviceAreasTitle || "Service Areas"}</h4>
//                   <div className="d-flex flex-column">
//                     {serviceAreas.map((area, idx) => (
//                       <Link key={`${area.url}-${idx}`} href={area.url} className={`nav-city-link ${area.slug === city || area.url === cityUrlMap[city] ? 'active' : ''}`}>
//                         <span><FaMapMarkerAlt className="me-2" size={14} /> <span className="text-capitalize">{area.name}</span></span>
//                         <FaArrowRight size={12} />
//                       </Link>
//                     ))}
//                   </div>
//                 </div>

//                 </Block>
//               </div>
//             </div>
//         {/* NEARBY MAJOR CITIES AT THE BOTTOM WITH DYNAMIC BANNERS */}
//         {nearbyCityCards.length > 0 && (
//           <Block id="nearbyCities" className="col-12 city-block-bottom">
//           <div className="pt-5 border-top">
//             <div className="d-flex justify-content-between align-items-end mb-4">
//               <h2 className="font-outfit fw-bold text-dark h3">{citySettings.nearbyCitiesTitle || "Nearby Cities"}</h2>
//               <Link href="/services" className="text-decoration-none fw-bold small text-gradient">VIEW ALL CITIES <FaArrowRight /></Link>
//             </div>
//             <div className="row g-4 mobile-slider-wrapper">
//               {nearbyCityCards.map((entry, idx) => {
//                 const cityImg = entry.image
//                   ? getBackendImageUrl(entry.image)
//                   : cityBannerMap[entry.slug || ""] || getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg');
//                 return (
//                   <div className="col-lg-4" key={`${entry.url}-${idx}`}>
//                     <Link href={entry.url} className="text-decoration-none">
//                       <div className="related-card bg-white position-relative shadow-sm h-100 rounded-4 overflow-hidden">
//                         <div style={{ height: "200px", position: "relative" }}>
//                           <Image
//                             src={cityImg}
//                             alt={entry.name}
//                             width={800}
//                             height={400}
//                             sizes="(max-width: 991px) 88vw, 33vw"
//                             style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
//                             loading="lazy"
//                           />
//                           <div className="position-absolute bottom-0 start-0 p-4 w-100 text-white fw-bold" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
//                             <FaMapMarkerAlt className="me-2 text-warning" /> {entry.name.toUpperCase()}
//                           </div>
//                         </div>
//                       </div>
//                     </Link>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//           </Block>
//         )}
//           </div>
//         </div>

//       </main>
//     </MainLayout>
//   );
// };

// export default ServicesDetailPage;



import { notFound } from "next/navigation";
import MainLayout from "../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import Image from "next/image"; 
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

import { 
  FaMapMarkerAlt, FaArrowRight, FaPhoneAlt, FaEnvelope, FaUser, 
  FaShieldAlt, FaGem, FaClock, FaTrophy, FaStar, FaAward, 
  FaCheckCircle, FaWallet, FaTools, FaDraftingCompass, FaHardHat, FaHome,
  FaWhatsapp, FaPlus, FaChevronDown, 
  FaSmile, FaUsers, FaCalendarAlt 
} from "react-icons/fa";

// Add wildcard import for dynamic icon rendering
import * as FaIcons from "react-icons/fa";

import { getBackendImageUrl } from "@/utils/helper";
import { SidebarForm, BottomContactForm } from "./CityForms";
import ProjectGallery from "./ProjectGallery";
import MobileSlider from "./MobileSlider";
import { getPageSEO } from "@/utils/getSEO";
import { cityUrlMap } from "@/utils/cityRoutes";
import { getSectionOrder } from "@/utils/citySections";
import { getCityContent, fillCity, parseVideoUrl, DEFAULT_CITY_CONTENT } from "@/utils/cityContent";
const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
const safeTag = (t, fallback) => (HEADING_TAGS.includes(t) ? t : fallback);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";

// City Banner Map for dynamic nearby cities images
const cityBannerMap = {
  "delhi": "/images/nearby cities/Delhi.png",
  "faridabad": "/images/nearby cities/Faridabad.png",
  "gurugram": "/images/nearby cities/Gurugram.png",
  "noida": "/images/nearby cities/Noida.png",
  "greater_noida": "/images/nearby cities/Greater Noida.png",
};

// Sub-City Logic for the new sidebar widget
const subCitiesMap = {
  "noida": [
    { name: "Sector 150", link: "/interior-designers-in-noida-sector-150" },
    { name: "Sector 137", link: "/interior-designers-in-noida-sector-137" },
    { name: "Sector 74", link: "/interior-designers-in-noida-sector-74" },
    { name: "Sector 75", link: "/interior-designers-in-noida-sector-75" },
    { name: "Sector 143", link: "/interior-designers-in-noida-sector-143" },
    { name: "Sector 104", link: "/interior-designers-in-noida-sector-104" },
    { name: "Sector 50", link: "/interior-designers-in-noida-sector-50" },
    { name: "Sector 93A", link: "/interior-designers-in-noida-sector-93a" },
    { name: "Sector 128", link: "/interior-designers-in-noida-sector-128" },
    { name: "Sector 44", link: "/interior-designers-in-noida-sector-44" },
  ],
  "gurugram": [
    { name: "Golf Course Road", link: "/interior-designers-in-gurgaon-golf-course-road" },
    { name: "DLF Phase 1", link: "/interior-designers-in-gurgaon-dlf-phase-1" },
    { name: "DLF Phase 5", link: "/interior-designers-in-gurgaon-dlf-phase-5" },
    { name: "Sector 56", link: "/interior-designers-in-gurgaon-sector-56" },
    { name: "Sector 65", link: "/interior-designers-in-gurgaon-sector-65" },
    { name: "Sohna Road", link: "/interior-designers-in-gurgaon-sohna-road" },
    { name: "Sector 54", link: "/interior-designers-in-gurgaon-sector-54" },
    { name: "Sector 57", link: "/interior-designers-in-gurgaon-sector-57" },
  ],
  "delhi": [
    { name: "Vasant Vihar", link: "/interior-designers-in-delhi-vasant-vihar" },
    { name: "Dwarka", link: "/interior-designers-in-dwarka" },
    { name: "South Extension", link: "/interior-designers-in-delhi-south-extension" },
    { name: "Greater Kailash", link: "/interior-designers-in-delhi-greater-kailash" },
    { name: "Defence Colony", link: "/interior-designers-in-delhi-defence-colony" },
    { name: "Hauz Khas", link: "/interior-designers-in-delhi-hauz-khas" },
    { name: "Punjabi Bagh", link: "/interior-designers-in-delhi-punjabi-bagh" },
    { name: "Rohini", link: "/interior-designers-in-delhi-rohini" },
    { name: "Janakpuri", link: "/interior-designers-in-delhi-janakpuri" },
  ]
};

// --- DATA FETCHERS ---
async function getCityData(city) {
  try {
    const res = await fetch(`${API_BASE_URL}/cms-city/${city}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) { return null; }
}

async function getRecentBlogs() {
  try {
    const res = await fetch(`${API_BASE_URL}/cms-blog`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 100) : [];
  } catch (error) { return []; }
}

const getCityMediaMeta = (record) => parseSettings(record?.json_content ?? record?.jsonContent);
const getCityMediaImage = (record) => record?.image || record?.image_url || getCityMediaMeta(record).image || "";

// Replaced previous homeContent fetcher with the dynamic Excellence Stats fetcher
async function getExcellenceStats() {
  try {
    const timestamp = new Date().getTime();
    const res = await fetch(`${API_BASE_URL}/cms-content/excellence_stats?t=${timestamp}`, { 
      cache: "no-store",
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const record = Array.isArray(data) ? data[0] : data;
    if (record && record.json_content) {
      const jsonContent = typeof record.json_content === "string" 
        ? JSON.parse(record.json_content) 
        : record.json_content;
      return jsonContent?.items || null;
    }
    return null;
  } catch (error) { 
    return null; 
  }
}

const parseJsonSafe = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  try { return JSON.parse(data); } catch (e) { return []; }
};

const parseSettings = (value) => {
  if (!value) return {};
  if (typeof value === "object" && !Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const normalizeCmsRecords = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (Array.isArray(value.records)) return value.records;
  if (Array.isArray(value.data)) return value.data;
  return [value];
};

const humanizeCity = (value) => String(value || "").replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
const safeInternalHref = (value, fallback = "/contact") => {
  const href = String(value || "").trim();
  return href.startsWith("/") && !href.startsWith("//") ? href : fallback;
};

const DEFAULT_PROMISE_ITEMS = [
  { title: "Transparent Pricing", description: "No hidden costs, ever." },
  { title: "In-House Execution", description: "No third-party contractors involved." },
];

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
  return [];
};

// --- SEO METADATA ---
export async function generateMetadata({ searchParams }) {
  const city = searchParams?.city && searchParams.city !== "undefined" ? searchParams.city : "delhi";
  // const fallbackPath = cityUrlMap[city] || `/services-detail/${city}`;
  const fallbackPath = cityUrlMap[city] || `/interior-designers-in-${city}`;
  
  const [pageData, seoData] = await Promise.all([
    getCityData(city),
    getPageSEO(fallbackPath).catch(() => null)
  ]);

  const canonicalUrl = getCanonicalUrl({ 
    canonicalUrl: seoData?.alternates?.canonical || pageData?.seo_content?.canonical_url, 
    fallbackPath 
  });

  if (!pageData) return { title: "Services", robots: { index: false, follow: true } };


    const title =
    seoData?.title || pageData?.seo_content?.meta_title || `${pageData.main_title} - Services`;
  const description =
    seoData?.description || pageData?.seo_content?.meta_description || "Best Interior Design Services";

  // share image: SEO Manager OG image > this city's hero banner > logo
  const og = seoData?.openGraph;
  const ogImages = og?.images?.length
    ? og.images
    : [{ url: pageData?.banner_image ? getBackendImageUrl(pageData.banner_image) : "/images/new_hc_logo.png" }];

  return {
    title,
    description,
    keywords: seoData?.keywords || pageData?.seo_content?.meta_keywords || "",
    alternates: { canonical: canonicalUrl },
    robots: seoData?.robots || getRobotsDirectives(pageData?.seo_content),
    openGraph: {
      title: og?.title || title,
      description: og?.description || description,
      url: canonicalUrl,
      siteName: "High Creation Interior",
      locale: "en_IN",
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: seoData?.twitter?.title || og?.title || title,
      description: seoData?.twitter?.description || og?.description || description,
      images: seoData?.twitter?.images?.length
        ? seoData.twitter.images
        : ogImages.map((i) => i.url),
    },
  };
}

const ServicesDetailPage = async ({ searchParams }) => {
  const city = searchParams?.city && searchParams.city !== "undefined" ? searchParams.city : "delhi";
  // const fallbackPath = cityUrlMap[city] || `/services-detail/${city}`;
  const fallbackPath = cityUrlMap[city] || `/interior-designers-in-${city}`;

  // Fetch Data + Global SEO schemas + Dynamic Excellence Stats concurrently
  const [pageData, recentBlogs, seoData, excellenceStats] = await Promise.all([
    getCityData(city),
    getRecentBlogs(),
    getPageSEO(fallbackPath).catch(() => null),
    getExcellenceStats(),
  ]);
  
  if (!pageData) notFound();

  // City-specific settings and uploaded images are stored on cms_city.
  // Avoid the legacy /cms-content/city_page_settings and city_page_media endpoints.
  const cityExtras = { settings: {}, media: [] };

  const customSchema = seoData?.customSchema;
  const safeDescription = pageData?.main_description ? DOMPurify.sanitize(pageData.main_description) : "";
  const safeSideDescription = pageData?.side_description ? DOMPurify.sanitize(pageData.side_description) : "";
  const HeroTag = safeTag(pageData?.banner_title ? pageData?.banner_title_tag : pageData?.main_title_tag, "h1");
const SideTag = safeTag(pageData?.side_title_tag, "h3");
  
  const displayCity = city.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const faqs = parseJsonSafe(pageData.faqs);
  const legacyCitySettings = parseSettings(pageData?.city_settings ?? pageData?.city_settings_json);
  const citySettings = { ...legacyCitySettings, ...(cityExtras?.settings || {}) };
  // Admin-defined section order (desktop / mobile). Falls back to the current layout.
  const sectionOrder = getSectionOrder(citySettings.sectionOrder);
  const Block = ({ id, className = "", children }) => (
    <div
      className={`city-block ${className}`.trim()}
      style={{ "--d": sectionOrder.desktop.indexOf(id), "--m": sectionOrder.mobile.indexOf(id) }}
    >
      {children}
    </div>
  );

  // CMS-editable section content (falls back to the previous hard-coded text)
  const content = getCityContent(citySettings.content);
  const t = (value) => fillCity(value, displayCity);
  const pickTag = (value, fallback) => safeTag(value, fallback);
  const iconOf = (name, Fallback) => FaIcons[name] || Fallback;
  const ProcessTitleTag = pickTag(content.process.titleTag, "h2");
  const ProjectsTitleTag = pickTag(content.projects.titleTag, "h2");
  const BlogsTitleTag = pickTag(content.blogs.titleTag, "h2");
  const WhyTitleTag = pickTag(content.whyChoose.titleTag, "h2");
  const FaqTitleTag = pickTag(content.faqs.titleTag, "h2");

  // Stats: city-level custom stats > global Excellence Stats (CMS Content) > built-in defaults
  const customStatItems = content.stats.useCustom
    ? content.stats.items.filter((stat) => stat.value || stat.label)
    : [];
  const statItems = customStatItems.length
    ? customStatItems.map((stat) => ({ ...stat, color: "#ff914d", size: 40 }))
    : (excellenceStats && excellenceStats.length > 0)
      ? excellenceStats.map((stat) => ({ ...stat, valueTag: "h3", color: stat.color || "#f5a623" }))
      : DEFAULT_CITY_CONTENT.stats.items.map((stat) => ({ ...stat, color: "#ff914d", size: 40 }));

  // FAQs: CMS FAQ items > legacy pageData.faqs
  const customFaqItems = content.faqs.items.filter((faq) => faq.question.trim() && faq.answer.trim());
  const faqItems = customFaqItems.length
    ? customFaqItems
    : faqs.filter((faq) => faq && faq.question).map((faq) => ({ question: faq.question, answer: faq.answer || "" }));
  const siteVisitSettings = citySettings.siteVisit || {};
  const mobileBannerMedia = (cityExtras?.media || []).find((record) => getCityMediaMeta(record).slot === "mobile_banner");
  const mobileHeroBanner = getCityMediaImage(mobileBannerMedia) || pageData?.mobile_banner_image || "";
  const promiseItems = normalizeList(citySettings.promiseItems).filter((item) => item && (item.title || item.description));
  const activePromiseItems = promiseItems.length ? promiseItems : DEFAULT_PROMISE_ITEMS;

  const savedBlogIds = normalizeList(citySettings.designInspirationBlogIds ?? citySettings.design_inspiration_blog_ids)
    .map((id) => String(id));
  const matchingSelectedBlogs = savedBlogIds.length
    ? savedBlogIds.map((id) => recentBlogs.find((blog) => String(blog.id) === id)).filter(Boolean)
    : [];
  const designInspirationBlogs = matchingSelectedBlogs.length ? matchingSelectedBlogs : recentBlogs.slice(0, 4);

  const projectList = normalizeList(citySettings.projectImages ?? citySettings.project_images);
  const projectPhotos = Array.from({ length: 6 }, (_, index) => {
    const slot = `project_${index + 1}`;
    const mediaRecord = (cityExtras?.media || []).find((record) => getCityMediaMeta(record).slot === slot);
    const mediaMeta = getCityMediaMeta(mediaRecord);
    const project = projectList[index] || {};
    const directImage = pageData?.[`project_image_${index + 1}`];
    const image = getCityMediaImage(mediaRecord)
      || (typeof project === "string" ? project : (project.image || project.src || project.url))
      || directImage;
    const alt = mediaMeta.alt || (typeof project === "object" ? project.alt : "") || pageData?.[`project_image_${index + 1}_alt`] || `${displayCity} interior design project ${index + 1}`;
    const title = mediaMeta.title || (typeof project === "object" ? project.title : "") || `${displayCity} Interior Project ${index + 1}`;
    return image ? { image, alt, title } : null;
  }).filter(Boolean);

  // Project media comes from the CMS list (photos + testimonial videos).
  // Only while that list is empty do the old fixed photos keep showing, so existing pages don't go blank.
  const mediaUrl = (value) => {
    const text = String(value || "").trim();
    return text.startsWith("/") ? getBackendImageUrl(text) : text;
  };
  const cmsGalleryItems = content.projects.gallery.flatMap((item, index) => {
    if (item.type === "video") {
      const videoUrl = mediaUrl(item.videoUrl);
      if (!videoUrl || !parseVideoUrl(videoUrl)) return [];
      return [{
        type: "video",
        image: item.poster ? mediaUrl(item.poster) : "",
        alt: item.alt || `${displayCity} client testimonial video`,
        title: item.title,
        videoUrl,
      }];
    }
    const image = mediaUrl(item.src);
    if (!image) return [];
    return [{
      type: "image",
      image,
      alt: item.alt || `${displayCity} interior design project ${index + 1}`,
      title: item.title,
      optimized: false,
    }];
  });
  const galleryItems = cmsGalleryItems.length
    ? cmsGalleryItems
    : projectPhotos.map((photo) => ({
        type: "image",
        image: getBackendImageUrl(photo.image),
        alt: photo.alt,
        title: photo.title,
        optimized: true,
      }));

  const customServiceAreas = normalizeList(citySettings.serviceAreas ?? citySettings.service_areas)
    .filter((area) => area && (area.name || area.title) && (area.url || area.href));
  const serviceAreas = customServiceAreas.length ? customServiceAreas.map((area) => ({
    name: area.name || area.title,
    url: safeInternalHref(area.url || area.href, cityUrlMap[city] || "/services"),
    slug: area.slug || "",
  })) : Object.entries(cityUrlMap).map(([slug, url]) => ({ name: humanizeCity(slug), url, slug }));

  const customNearbyCities = normalizeList(citySettings.nearbyCities ?? citySettings.nearby_cities)
    .filter((entry) => entry && (entry.name || entry.title) && (entry.url || entry.href));
  const nearbyCityCards = (customNearbyCities.length ? customNearbyCities.map((entry) => ({
    name: entry.name || entry.title,
    slug: entry.slug || Object.keys(cityUrlMap).find((slug) => cityUrlMap[slug] === (entry.url || entry.href)) || "",
    url: safeInternalHref(entry.url || entry.href, "/services"),
    image: entry.image || entry.imageUrl || "",
  })) : Object.keys(cityUrlMap).filter((slug) => slug !== city).slice(0, 3).map((slug) => ({
    name: humanizeCity(slug), slug, url: cityUrlMap[slug], image: cityBannerMap[slug] || "",
  }))).filter((entry) => entry.slug !== city && entry.url !== cityUrlMap[city]);

  const visitTitle = siteVisitSettings.title || citySettings.siteVisitTitle || "Book a Site Visit";
  const visitDescription = (siteVisitSettings.description || citySettings.siteVisitDescription || "Expert designers will visit your {city} property.").replace(/\{city\}/gi, displayCity);
  const visitButtonText = siteVisitSettings.buttonText || citySettings.siteVisitButtonText || "Schedule Now";
  const visitButtonUrl = safeInternalHref(siteVisitSettings.buttonUrl || citySettings.siteVisitButtonUrl || "/contact");
  const VisitTitleTag = pickTag(siteVisitSettings.titleTag || citySettings.siteVisitTitleTag, "h4");
  const PromiseTitleTag = pickTag(citySettings.promiseTitleTag, "h4");
  const ServiceAreasTitleTag = pickTag(citySettings.serviceAreasTitleTag, "h4");
  const NearbyTitleTag = pickTag(citySettings.nearbyCitiesTitleTag, "h2");
  
  // Localities Logic for Sidebar Widget
  const currentSubCities = subCitiesMap[city] || [];
  const initialSubCities = currentSubCities.slice(0, 6);
  const hiddenSubCities = currentSubCities.slice(6);

  return (
    <MainLayout>
      {/* Inject the Custom Schema from the Global SEO Tag Manager */}
      {customSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: typeof customSchema === 'string' 
              ? customSchema.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '') 
              : JSON.stringify(customSchema)
          }}
        />
      )}

      {/* Legacy Fallback (Inner Custom Code) */}
      {pageData?.seo_content?.custom_code && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: pageData.seo_content.custom_code.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '') 
          }}
        />
      )}
      <style dangerouslySetInnerHTML={{__html: `
        :root { --hc-primary: #ff914d; --hc-dark: #0f172a; }
        .font-outfit { font-family: var(--font-outfit), sans-serif; }
        .font-poppins { font-family: var(--font-poppins), sans-serif; }
        .text-gradient { background: linear-gradient(135deg, #ff914d 0%, #ff5722 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .lazy-render { content-visibility: auto; contain-intrinsic-size: 1px 800px; }

        .faq-main-title { font-family: var(--font-outfit), sans-serif; font-size: clamp(1.75rem, 6vw, 2.5rem); font-weight: 800; color: var(--hc-dark); line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 2rem; position: relative; padding-bottom: 12px; }
        .faq-main-title::after { content: ""; position: absolute; left: 0; bottom: 0; width: 60px; height: 4px; background: linear-gradient(135deg, var(--hc-primary) 0%, #ff5722 100%); border-radius: 2px; }

        .faq-premium-item { border: none !important; margin-bottom: 16px; border-radius: 16px !important; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); background: #ffffff; border: 1px solid #f1f5f9 !important; }
        .faq-premium-btn { width: 100%; text-align: left; background: white; border: none; padding: clamp(16px, 4vw, 24px); font-weight: 700; font-size: clamp(1.05rem, 3.5vw, 1.2rem); color: var(--hc-dark); display: flex; justify-content: space-between; align-items: center; box-shadow: none !important; line-height: 1.4; gap: 15px; }
        .faq-premium-btn:not(.collapsed) { color: var(--hc-primary); background: #fffcf9; }
        .faq-icon-toggle { transition: transform 0.3s ease; color: var(--hc-primary); flex-shrink: 0; }
        .faq-premium-btn:not(.collapsed) .faq-icon-toggle { transform: rotate(45deg); color: #ff5722; }
        .faq-premium-body { padding: 0 clamp(16px, 4vw, 24px) 20px; color: #475569; font-size: clamp(0.95rem, 3vw, 1.05rem); line-height: 1.7; background: #fffcf9; }
        
        .rich-text-content figure, 
        .rich-text-content figure.image { margin: 2rem auto !important; max-width: 100% !important; height: auto !important; display: flex; justify-content: center; }
        .rich-text-content img { max-width: 100% !important; height: auto !important; border-radius: 12px; display: block !important; margin: 0 auto !important; object-fit: contain !important; }
        .rich-text-content iframe, .rich-text-content video, .rich-text-content table { max-width: 100% !important; overflow-x: auto; display: block !important; margin: 2rem auto !important; }

        .rich-text-content h2, .rich-text-content h3 { font-family: var(--font-outfit), sans-serif; font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 700; color: #0f172a; margin-top: 2rem; margin-bottom: 1rem; }
        .rich-text-content p { font-family: var(--font-poppins), sans-serif; font-size: 1rem; line-height: 1.8; color: #475569; margin-bottom: 1.2rem; }
        
        .rich-text-content ul { display: flex; flex-direction: column; gap: 1rem; padding: 0; list-style: none; margin: 2rem 0; }
        .rich-text-content ul li { background: #fdfdfd; border: 1px solid #f1f5f9; padding: 1.2rem 1.5rem 1.2rem 3rem; border-radius: 12px; display: block; position: relative; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: 0.3s; }
        .rich-text-content ul li:hover { border-color: var(--hc-primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,145,77,0.1); }
        .rich-text-content ul li::before { content: '✦'; color: var(--hc-primary); position: absolute; left: 1.2rem; top: 1.2rem; font-size: 1.2rem; font-weight: bold; line-height: 1.5; }

        .rich-text-content ol { display: flex; flex-direction: column; gap: 1rem; padding: 0; margin: 2rem 0; list-style: none; counter-reset: custom-ol-counter;}
.rich-text-content ol li { background: #fdfdfd; border: 1px solid #f1f5f9; padding: 1.2rem 1.5rem 1.2rem 3rem; border-radius: 12px; display: block; position: relative; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: 0.3s; list-style-type: decimal; counter-increment: custom-ol-counter; }
.rich-text-content ol li:hover { border-color: var(--hc-primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,145,77,0.1); }
.rich-text-content ol li::before { 
  content: counter(custom-ol-counter) "."; 
  color: var(--hc-primary); 
  position: absolute; 
  left: 1.2rem; 
  top: 1.2rem; 
  font-size: 1.1rem; 
  font-weight: bold; 
  line-height: 1.5; 
}

        .micro-trust-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; }
        .micro-trust-item:last-child { border-bottom: none; padding-bottom: 0; }
        .micro-trust-icon { color: #22c55e; font-size: 18px; margin-right: 12px; }

        .floating-contact-widget { position: fixed; right: 20px; top: 55%; transform: translateY(-50%); z-index: 999; display: flex; flex-direction: column; gap: 12px; }
        .widget-btn { width: 55px; height: 55px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.2); transition: 0.3s; text-decoration: none; }
        .widget-btn:hover { transform: scale(1.1); color: white; }
        .widget-btn.call { background: var(--hc-primary); }

        @media (max-width: 768px) {
        main.bg-light {
    overflow-x: hidden;
  }
          .mobile-slider-wrapper { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; scroll-snap-type: x mandatory; gap: 15px; padding: 10px 0 30px; -webkit-overflow-scrolling: touch; scrollbar-width: none;
          margin-left: 0 !important; 
          margin-right: 0 !important; }
          .mobile-slider-wrapper::-webkit-scrollbar { display: none; }
          .mobile-slider-wrapper > div { flex: 0 0 88% !important; scroll-snap-align: center; }
          .rich-text-content ul, .rich-text-content ol{ display: flex; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 1rem; }
          .rich-text-content li, .rich-text-content ol li { flex: 0 0 85%; }
          .rich-text-content ol { padding-left: 0; list-style-position: inside; }

          .process-slider > div { 
    flex: 0 0 100% !important; /* Shows exactly one card at a time */
    padding: 0 10px; /* Optional: adds a little breathing room */
  }
  .process-slider .process-step { 
    flex-direction: column; 
    align-items: center; 
    text-align: center; 
  }
  .process-slider .process-icon { 
    margin-right: 0; 
    margin-bottom: 15px; 
  }
  .process-slider .process-step::after { 
    display: none !important; /* Removes the vertical connecting line */
  }
    .modern-card-slider > div { 
    flex: 0 0 100% !important; /* 👈 Shows exactly 1 card at a time on mobile */
  }
        }

        .city-hero { height: 55vh; min-height: 450px; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: #1e293b; }
        .city-hero-picture { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
        .city-hero-picture img { display: block; }
        .city-project-card { position: relative; overflow: hidden; border-radius: 16px; background: #f1f5f9; aspect-ratio: 4 / 3; }
        .city-project-card img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .city-project-card figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 36px 16px 14px; color: #fff; font-weight: 600; background: linear-gradient(transparent, rgba(15,23,42,.78)); }

        .hero-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.95) 100%); z-index: 1; }
        .hero-content { position: relative; z-index: 2; text-align: center; color: white; padding-top: 40px; }
        .hero-badge { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); padding: 8px 24px; border-radius: 30px; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; display: inline-flex; align-items: center; color: #fff; font-weight: 600; }
        .city-main-container { margin-top: -80px; position: relative; z-index: 10; }
        .premium-card { background: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.04); padding: 40px; margin-bottom: 40px; border: 1px solid rgba(0,0,0,0.02); }
        
        .hero-main-title { font-size: clamp(2.4rem, 5vw, 3.8rem); line-height: 1.1; letter-spacing: -0.02em; }
        .process-step { display: flex; align-items: flex-start; margin-bottom: 30px; position: relative; }
        .process-step:last-child { margin-bottom: 0; }
        .process-icon { width: 50px; height: 50px; min-width: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-right: 20px; z-index: 2; }
        .process-step:not(:last-child)::after { content: ''; position: absolute; left: 24px; top: 50px; bottom: -30px; width: 2px; background: #ffe4d6; z-index: 1; }

        .trust-box { padding: 30px 20px; border-radius: 16px; background: #fafafa; border: 1px solid #f0f0f0; transition: all 0.3s ease; height: 100%; text-align: center; }
        .trust-box:hover { background: #ffffff; transform: translateY(-5px); box-shadow: 0 15px 30px rgba(255,145,77,0.08); border-color: #ff914d; }
        .trust-icon { width: 60px; height: 60px; background: #fff4ed; color: #ff914d; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px; }

        .excellence-stat { text-align: center; padding: 20px; position: relative; }
        @media (min-width: 768px) { .excellence-stat::after { content: ""; position: absolute; right: 0; top: 20%; height: 60%; width: 1px; background: #e2e8f0; } .excellence-stat:last-child::after { display: none; } }
        
        .right-sidebar-sticky { position: sticky; top: 100px; height: max-content; }
        .sidebar-widget { background: #ffffff; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.05); padding: 30px; margin-bottom: 30px; border: 1px solid rgba(0,0,0,0.03); }
        .widget-title { font-family: var(--font-outfit), sans-serif; font-weight: 700; font-size: 20px; margin-bottom: 25px; position: relative; padding-bottom: 10px; }
        .widget-title::after { content: ""; position: absolute; left: 0; bottom: 0; width: 40px; height: 3px; background: #ff914d; border-radius: 2px; }

        .sidebar-cta { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 20px; padding: 30px 20px; text-align: center; color: white; margin-bottom: 30px; position: relative; overflow: hidden; }
        .nav-city-link { display: flex; align-items: center; justify-content: space-between; padding: 12px 15px; border-radius: 10px; color: #475569; text-decoration: none; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: all 0.2s ease; background: #f8fafc; margin-bottom: 10px; }
        .nav-city-link:hover, .nav-city-link.active { background: #ff914d; color: white; transform: translateX(5px); }
        .nav-city-link.active { pointer-events: none; }
        .sidebar-cta :is(h1, h2, h3, h4, h5, h6) { color: #ffffff !important; }

        .related-card { overflow: hidden; border-radius: 16px; transition: transform 0.3s ease; border: 1px solid #f0f0f0; }
        .related-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
        
        .modern-card { background: #ffffff; padding: 30px 25px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: all 0.3s ease; height: 100%; position: relative; overflow: hidden;text-align: center;}
        .modern-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border-color: #ff914d;}
        .modern-card-icon { width: 50px; height: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin: 0 auto 20px; transition: transform 0.3s ease;}
        .modern-card:hover .modern-card-icon { transform: scale(1.1); background: #ff914d; color: white; }
        
        .approach-number { width: 60px; height: 60px; background: #fff4ed; color: #ff914d; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin: 0 auto 15px; }

        .subcity-pill { display: inline-flex; align-items: center; padding: 8px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 30px; font-size: 13px; color: #475569; text-decoration: none; font-family: var(--font-poppins), sans-serif; font-weight: 500; transition: all 0.3s ease; margin-bottom: 8px; margin-right: 8px; }
        .subcity-pill:hover { background: #ff914d; color: white; border-color: #ff914d; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(255,145,77,0.2); }
        .view-all-btn[aria-expanded="true"] .fa-chevron-down { transform: rotate(180deg); transition: 0.3s ease; }
        .view-all-btn[aria-expanded="false"] .fa-chevron-down { transition: 0.3s ease; }

        /* --- Admin-controlled section order (CMS > City > Section Order) --- */
        .city-col-stack { display: flex; flex-direction: column; }
        .city-block { order: var(--d); }
        .city-cols > .city-block-bottom { order: 1; }
        @media (max-width: 991.98px) {
          /* columns stack on tablet/mobile: dissolve the wrappers so blocks from the
             main column, sidebar and bottom strip can be interleaved with CSS order */
          .row.city-cols { flex-direction: column; flex-wrap: nowrap; margin-top: 0; }
          .city-cols > .col-lg-8,
          .city-cols > .col-lg-4,
          .city-cols .city-col-stack { display: contents; }
          .city-cols .city-block { order: var(--m); width: 100%; padding-inline: calc(var(--bs-gutter-x) * .5); }
        }

        /* stats strip: swipe left/right on mobile (dots come from MobileSlider) */
        @media (max-width: 768px) {
          /* slides always start at the left edge (a centered, overflowing flex row hides its first slide) */
          .mobile-slider-wrapper { justify-content: flex-start !important; }
          .mobile-slider-wrapper.stats-slider > div { flex: 0 0 100% !important; max-width: 100% !important; }
          .premium-card.stats-card { padding: 22px 10px 12px; }
        }
        @media (min-width: 769px) {
          .stats-slider { justify-content: center; }
        }

        /* FAQ accordion (split layout) */
        .faq-eyebrow { color: var(--hc-primary); font-weight: 700; font-size: .75rem; letter-spacing: .22em; text-transform: uppercase; margin-bottom: .75rem; }
        .faq-split-title { font-weight: 700; line-height: 1.15; letter-spacing: -0.02em; color: var(--hc-dark); font-size: clamp(1.6rem, 3.2vw, 2.2rem); margin-bottom: 1rem; }
        .faq-split-intro { color: #64748b; font-size: .9rem; line-height: 1.7; margin-bottom: 0; }
        .faq-split-head { margin-bottom: 1.75rem; }
        @media (min-width: 992px) {
          .faq-split-head { margin-bottom: 2.25rem; }
          .faq-head-center { text-align: center; }
          .faq-head-center .faq-split-intro { max-width: 640px; margin-left: auto; margin-right: auto; }
        }
        .faq-split-list { border-top: 1px solid #f0dccd; }
        .faq-split-item { border-bottom: 1px solid #f0dccd; }
        .faq-split-q { margin: 0; font-size: inherit; font-weight: inherit; }
        .faq-split-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; text-align: left; background: none; border: 0; padding: 22px 4px; font-weight: 600; font-size: 1rem; line-height: 1.45; color: var(--hc-dark); }
        .faq-split-btn:not(.collapsed) { color: var(--hc-primary); }
        .faq-split-toggle { width: 28px; height: 28px; border-radius: 50%; background: #fff1e8; color: var(--hc-primary); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 11px; }
        .faq-split-btn .faq-minus { display: none; }
        .faq-split-btn:not(.collapsed) .faq-minus { display: block; }
        .faq-split-btn:not(.collapsed) .faq-plus { display: none; }
        .faq-split-body { padding: 0 4px 22px; color: #64748b; font-size: .92rem; line-height: 1.8; white-space: pre-line; }
      `}} />

      <main className="bg-light pb-5">
        
        {/* --- HERO SECTION --- */}
        <div className="city-hero w-100">
          <picture className="city-hero-picture">
            {mobileHeroBanner && (
              <source
                media="(max-width: 767px)"
                srcSet={getBackendImageUrl(mobileHeroBanner)}
              />
            )}
            <Image
              src={pageData?.banner_image ? getBackendImageUrl(pageData.banner_image) : getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg')}
              alt={
                getCityMediaMeta(mobileBannerMedia).alt?.trim()
                  || pageData?.banner_image_alt?.trim()
                  || pageData?.banner_title || pageData?.main_title || `${displayCity} Interior Design`
              }
              width={1920}
              height={800}
              priority
              sizes="100vw"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
            />
          </picture>
          <div className="container hero-content font-poppins">
            <div className="hero-badge"><FaMapMarkerAlt className="me-2" /> {pageData?.banner_subtitle || `High Creation Interior in ${displayCity}`}</div>

            <HeroTag className="hero-main-title fw-bold mb-3 font-outfit text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
  {pageData?.banner_title || pageData?.main_title || `Interior Designers in ${displayCity}`}
</HeroTag>
          </div>
        </div>

        <div className="container city-main-container">
          <div className="row g-5 city-cols">
            
            {/* --- LEFT COLUMN: CONTENT HUB --- */}
            <div className="col-lg-8">
              {/* <div className="dual-sticky-wrapper"> */}
               <div className="city-col-stack">
                
                 {/* --- LENGTHY CONTENT --- */}
                <Block id="main">
                 <div className="premium-card mb-4">
                  {/* <h2 className="font-outfit fw-bold h3 mb-4 text-dark">
                     Interior Designer In {displayCity}
                  </h2> */}
                  <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeDescription }} />
                </div>

                </Block>
                {/* --- DESIGN PROCESS GRID --- */}
                <Block id="process">
                <div className="lazy-render">
                  <div className="premium-card bg-white border-0">
                    <ProcessTitleTag className="font-outfit fw-bold h3 mb-4 text-dark text-center text-md-start">{t(content.process.title)}</ProcessTitleTag>
                    <MobileSlider label="Design process" className="mobile-slider-wrapper process-slider">
                      {content.process.items.map((step, i) => {
                        const StepIcon = iconOf(step.iconName, FaIcons.FaCheckCircle);
                        const StepTag = pickTag(step.titleTag, "h4");
                        return (
                          <div className="process-step" key={i}>
                            <div className="process-icon"><StepIcon /></div>
                            <div>
                              <StepTag className="font-outfit h5 fw-bold mb-1">{i + 1}. {t(step.title)}</StepTag>
                              <p className="text-muted font-poppins small mb-0">{t(step.description)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </MobileSlider>
                  </div>
                </div>
                </Block>
                {galleryItems.length > 0 && (
                  <Block id="projects">
                  <section className="lazy-render mb-4" aria-label={`Interior design projects in ${displayCity}`}>
                    <div className="premium-card bg-white border-0">
                      <ProjectsTitleTag className="font-outfit fw-bold h3 mb-4 text-dark">{t(content.projects.title)}</ProjectsTitleTag>
                      <ProjectGallery items={galleryItems} />
                    </div>
                  </section>
                  </Block>
                )}

                {designInspirationBlogs.length > 0 && (
                  <Block id="blogs">
                  <div className="lazy-render">
                    <div className="premium-card border-0 px-0 pt-0">
                      <BlogsTitleTag className="font-outfit fw-bold h3 mb-4">{t(content.blogs.title)}</BlogsTitleTag>
                      <MobileSlider label="Design inspiration" className="row g-4 font-poppins mobile-slider-wrapper">
                        {designInspirationBlogs.map((blog, idx) => (
                          <div className="col-md-6" key={idx}>
                            <Link href={`/${blog.seo_content?.slug || `blog-detail?id=${blog.id}`}`} className="text-decoration-none">
                              <div className="d-flex align-items-center border p-3 rounded-4 bg-white shadow-sm h-100 transition-all hover:shadow-md">
                                <img src={blog.image || "/images/default.jpg"} alt={blog.title} 
                                width={80} height={80}
                                className="rounded" style={{ width: "80px", height: "80px",objectFit: "contain", flexShrink: 0 }} loading="lazy" />
                                <div className="ms-3">
                                  <h6 className="text-dark fw-bold mb-1" style={{ fontSize: '14px' }}>{blog.title.length > 45 ? `${blog.title.substring(0, 45)}...` : blog.title}</h6>
                                  <small className="text-gradient fw-bold">READ ARTICLE <FaArrowRight size={10} /></small>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </MobileSlider>
                    </div>
                  </div>
                  </Block>
                )}
                
                {/* --- EXCELLENCE STATS (Dynamic CMS Icons) --- */}
                <Block id="stats">
                <div className="lazy-render">
                  <div className="premium-card shadow-sm stats-card" style={{ background: 'linear-gradient(to right, #ffffff, #fff9f5)' }}>
                    <MobileSlider label="Statistics" className="row align-items-center mobile-slider-wrapper stats-slider">
                      {statItems.map((stat, idx) => {
                        const IconComponent = (stat.iconName && FaIcons[stat.iconName])
                          ? FaIcons[stat.iconName]
                          : FaIcons.FaStar;
                        const StatTag = pickTag(stat.valueTag, "h3");
                        const colWidth = statItems.length <= 3 ? 4 : Math.max(3, Math.floor(12 / statItems.length));

                        return (
                          <div className={`col-md-${colWidth} excellence-stat d-flex flex-column align-items-center justify-content-center text-center`} key={idx}>
                            {stat.iconType === "image" && stat.image ? (
                              <img
                                src={getBackendImageUrl(stat.image)}
                                alt={stat.label || "Stat Icon"}
                                width={stat.size || 40}
                                height={stat.size || 40}
                                style={{ width: `${stat.size || 40}px`, height: `${stat.size || 40}px`, objectFit: "contain" }}
                                className="mb-3"
                              />
                            ) : (
                              <IconComponent
                                size={stat.size || 40}
                                color={stat.color || "#f5a623"}
                                className="mb-3"
                              />
                            )}
                            <StatTag className="font-outfit fw-bold h2 mb-1">{stat.value}</StatTag>
                            <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">{stat.label}</p>
                          </div>
                        );
                      })}
                    </MobileSlider>
                  </div>
                </div>
                </Block>
                {/* --- WHY CHOOSE US (Modern Cards) --- */}
                <Block id="whyChoose">
                <div className="lazy-render">
                  <div className="premium-card bg-transparent border-0 shadow-none px-0 py-0 mb-4">
                    <div className="text-center mb-4">
                        <WhyTitleTag className="font-outfit fw-bold h3 text-dark">{t(content.whyChoose.title)}</WhyTitleTag>
                    </div>
                    <MobileSlider label="Why choose us" className="row g-4 mobile-slider-wrapper modern-card-slider">
                      {content.whyChoose.items.map((item, idx) => {
                        const CardIcon = iconOf(item.iconName, FaIcons.FaCheckCircle);
                        const CardTag = pickTag(item.titleTag, "h4");
                        const cardCols = content.whyChoose.items.length >= 4 ? 3 : content.whyChoose.items.length === 3 ? 4 : 6;
                        return (
                          <div className={`col-md-6 col-lg-${cardCols}`} key={idx}>
                            <div className="modern-card">
                              <div className="modern-card-icon"><CardIcon /></div>
                              <CardTag className="font-outfit fw-bold h6">{t(item.title)}</CardTag>
                              <p className="text-muted font-poppins small mb-0">{t(item.description)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </MobileSlider>
                  </div>
                </div>
                </Block>
                {/* --- MORE LENGTHY CONTENT --- */}
                {(pageData?.side_title || safeSideDescription) && (
                  <Block id="side">
                  <div className="lazy-render">
                    <div className="premium-card mb-4" style={{ background: '#fffcf9' }}>
                      {/* <h3 className="font-outfit fw-bold h4 mb-3 text-dark">{pageData.side_title}</h3> */}

                      <SideTag className="font-outfit fw-bold h4 mb-3 text-dark">{pageData.side_title}</SideTag>
                      <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeSideDescription }} />
                    </div>
                  </div>
                  </Block>
                )}

                {/* --- INTERACTIVE PREMIUM FAQs --- */}
                {faqItems.length > 0 && (
                  <Block id="faqs">
                  <div className="lazy-render">
                    <div className="premium-card border-0 faq-split">
                      <div className="faq-split-head">
                        {content.faqs.eyebrow && <p className="faq-eyebrow font-poppins">{t(content.faqs.eyebrow)}</p>}
                        <FaqTitleTag className="faq-split-title font-outfit">{t(content.faqs.title)}</FaqTitleTag>
                        {content.faqs.intro && <p className="faq-split-intro font-poppins">{t(content.faqs.intro)}</p>}
                      </div>
                      <div className="faq-split-list accordion font-poppins" id={`accordion-faq-${pageData?.id}`}>
                        {faqItems.map((faq, index) => (
                          <div className="faq-split-item" key={index}>
                            <h3 className="faq-split-q">
                              <button
                                className={`faq-split-btn ${index !== 0 ? "collapsed" : ""}`}
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#city-faq-${pageData?.id}-${index}`}
                                aria-expanded={index === 0 ? "true" : "false"}
                                aria-controls={`city-faq-${pageData?.id}-${index}`}
                              >
                                <span>{faq.question}</span>
                                <span className="faq-split-toggle" aria-hidden="true">
                                  <FaPlus className="faq-plus" />
                                  <FaIcons.FaMinus className="faq-minus" />
                                </span>
                              </button>
                            </h3>
                            <div
                              id={`city-faq-${pageData?.id}-${index}`}
                              className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                              data-bs-parent={`#accordion-faq-${pageData?.id}`}
                            >
                              <div className="faq-split-body">{faq.answer}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  </Block>
                )}
                
              </div>
            </div>

            {/* --- RIGHT COLUMN: SIDEBAR --- */}
            <div className="col-lg-4">
              {/* <div className="dual-sticky-wrapper"> */}
              <div className="right-sidebar-sticky city-col-stack">
                
                {/* 1. TOP RIGHT: BOOK SITE VISIT CTA */}
                <Block id="siteVisit">
                <div className="sidebar-cta shadow-lg mb-4">
                  <VisitTitleTag className="font-outfit fw-bold mb-2">{visitTitle}</VisitTitleTag>
                  <p className="font-poppins small text-white-50 mb-4">{visitDescription}</p>
                  <Link href={visitButtonUrl} className="btn btn-light w-100 fw-bold py-2 rounded-pill">{visitButtonText}</Link>
                </div>

                </Block>
                {/* 3. SIDEBAR FORM */}
                <Block id="sidebarForm">
                <SidebarForm city={city} />

                </Block>
                {/* 4. THE PROMISE */}
                <Block id="promise">
                <div className="sidebar-widget py-4 font-poppins lazy-render">
                  <PromiseTitleTag className="widget-title mb-4">{citySettings.promiseTitle || "The Promise"}</PromiseTitleTag>
                  {activePromiseItems.map((item, index) => {
                    const PromiseIcon = (item.iconName && FaIcons[item.iconName]) || (index === 0 ? FaCheckCircle : FaTools);
                    const isCheckIcon = item.iconName ? /^FaCheck/.test(item.iconName) : index === 0;
                    return (
                      <div className="micro-trust-item" key={`${item.title}-${index}`}>
                        <PromiseIcon className={`micro-trust-icon${isCheckIcon ? "" : " text-warning"}`} />
                        <div>
                          <span className="d-block fw-bold text-dark" style={{ fontSize: '14px' }}>{item.title}</span>
                          <span className="text-muted" style={{ fontSize: '12px' }}>{item.description}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                </Block>
                {/* 5. MAJOR CITIES */}
                <Block id="serviceAreas">
                <div className="sidebar-widget">
                  <ServiceAreasTitleTag className="widget-title">{citySettings.serviceAreasTitle || "Service Areas"}</ServiceAreasTitleTag>
                  <div className="d-flex flex-column">
                    {serviceAreas.map((area, idx) => (
                      <Link key={`${area.url}-${idx}`} href={area.url} className={`nav-city-link ${area.slug === city || area.url === cityUrlMap[city] ? 'active' : ''}`}>
                        <span><FaMapMarkerAlt className="me-2" size={14} /> <span className="text-capitalize">{area.name}</span></span>
                        <FaArrowRight size={12} />
                      </Link>
                    ))}
                  </div>
                </div>

                </Block>
              </div>
            </div>
        {/* NEARBY MAJOR CITIES AT THE BOTTOM WITH DYNAMIC BANNERS */}
        {nearbyCityCards.length > 0 && (
          <Block id="nearbyCities" className="col-12 city-block-bottom">
          <div className="pt-5 border-top">
            <div className="d-flex justify-content-between align-items-end mb-4">
              <NearbyTitleTag className="font-outfit fw-bold text-dark h3">{citySettings.nearbyCitiesTitle || "Nearby Cities"}</NearbyTitleTag>
              <Link href="/services" className="text-decoration-none fw-bold small text-gradient">VIEW ALL CITIES <FaArrowRight /></Link>
            </div>
            <MobileSlider label="Nearby cities" className="row g-4 mobile-slider-wrapper">
              {nearbyCityCards.map((entry, idx) => {
                const cityImg = entry.image
                  ? getBackendImageUrl(entry.image)
                  : cityBannerMap[entry.slug || ""] || getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg');
                return (
                  <div className="col-lg-4" key={`${entry.url}-${idx}`}>
                    <Link href={entry.url} className="text-decoration-none">
                      <div className="related-card bg-white position-relative shadow-sm h-100 rounded-4 overflow-hidden">
                        <div style={{ height: "200px", position: "relative" }}>
                          <Image
                            src={cityImg}
                            alt={entry.name}
                            width={800}
                            height={400}
                            sizes="(max-width: 991px) 88vw, 33vw"
                            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                            loading="lazy"
                          />
                          <div className="position-absolute bottom-0 start-0 p-4 w-100 text-white fw-bold" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                            <FaMapMarkerAlt className="me-2 text-warning" /> {entry.name.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </MobileSlider>
          </div>
          </Block>
        )}
          </div>
        </div>

      </main>
    </MainLayout>
  );
};

export default ServicesDetailPage;
