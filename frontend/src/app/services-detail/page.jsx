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
//   FaSmile, FaUsers, FaCalendarAlt // <--- ADD THESE
// } from "react-icons/fa";
// import { getBackendImageUrl } from "@/utils/helper";
// import { SidebarForm, BottomContactForm } from "./CityForms";
// import { getPageSEO } from "@/utils/getSEO";
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";

// const cityUrlMap = {
//   "noida": "/interior-designers-in-noida",
//   "greater_noida": "/interior-designers-in-greater-noida",
//   "delhi": "/interior-designers-in-delhi",
//   "gurugram": "/interior-designers-in-gurgaon",
//   "faridabad": "/best-interior-designers-in-faridabad",
//   "ghaziabad": "/interior-designers-in-ghaziabad",
//   "manesar": "/interior-designers-in-manesar",
//   "dwarka": "/interior-designers-in-dwarka",
// };

// // 👇 ADDED: City Banner Map for dynamic nearby cities images
// const cityBannerMap = {
//   "delhi": "/images/nearby cities/Delhi.png",
//   "faridabad": "/images/nearby cities/Faridabad.png",
//   "gurugram": "/images/nearby cities/Gurugram.png",
//   "noida": "/images/nearby cities/Noida.png",
//   "greater_noida": "/images/nearby cities/Greater Noida.png",
// };

// // 🌟 EXPANDED SUB-CITY LOGIC: Clean, robust list for the new sidebar widget
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
//     const res = await fetch(`${API_BASE_URL}/cms-blog`, { next: { revalidate: 3600 } });
//     if (!res.ok) return [];
//     const data = await res.json();
//     return Array.isArray(data) ? data.slice(0, 4) : [];
//   } catch (error) { return []; }
// }

// async function getExcellenceData() {
//   try {
//     // Calling the exact endpoint the Home page uses
//     const res = await fetch(`${API_BASE_URL}/cms-content/home_page_content_what_we_are`, { 
//       next: { revalidate: 3600 } 
//     });
//     if (!res.ok) return null;
//     const data = await res.json();
//     return Array.isArray(data) ? data : null;
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
//   const fallbackPath = cityUrlMap[city] || `/services-detail/${city}`;
  
//   // 👈 2. Fetch both Page Data and SEO Data concurrently
//   const [pageData, seoData] = await Promise.all([
//     getCityData(city),
//     getPageSEO(fallbackPath).catch(() => null)
//   ]);

//   const canonicalUrl = getCanonicalUrl({ 
//     canonicalUrl: seoData?.alternates?.canonical || pageData?.seo_content?.canonical_url, 
//     fallbackPath 
//   });

//   if (!pageData) return { title: "Services", robots: { index: false, follow: true } };

//   return {
//     title: seoData?.title || pageData?.seo_content?.meta_title || `${pageData.main_title} - Services`,
//     description: seoData?.description || pageData?.seo_content?.meta_description || "Best Interior Design Services",
//     keywords: seoData?.keywords || pageData?.seo_content?.meta_keywords || "",
//     alternates: { canonical: canonicalUrl },
//     robots: seoData?.robots || getRobotsDirectives(pageData?.seo_content),
//     openGraph: seoData?.openGraph || null,
//     twitter: seoData?.twitter || null,
//   };
// }

// const ServicesDetailPage = async ({ searchParams }) => {
//   const city = searchParams?.city && searchParams.city !== "undefined" ? searchParams.city : "delhi";
//   const fallbackPath = cityUrlMap[city] || `/services-detail/${city}`;

//   // 👈 3. Fetch Data + Global SEO schemas concurrently for the component
//   const [pageData, recentBlogs, seoData, homeContent] = await Promise.all([
//     getCityData(city),
//     getRecentBlogs(),
//     getPageSEO(fallbackPath).catch(() => null),
//     getExcellenceData()
//   ]);
  
//   if (!pageData) notFound(); 

//   // 👈 4. Extract the custom schemas
//   const customSchema = seoData?.customSchema;
//   const safeDescription = pageData?.main_description ? DOMPurify.sanitize(pageData.main_description) : "";
//   const safeSideDescription = pageData?.side_description ? DOMPurify.sanitize(pageData.side_description) : "";
  
//   const displayCity = city.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   const faqs = parseJsonSafe(pageData.faqs);

//   const otherCities = Object.keys(cityUrlMap).filter(c => c !== city).slice(0, 3);
  
//   // Localities Logic for Sidebar Widget
//   const currentSubCities = subCitiesMap[city] || [];
//   const initialSubCities = currentSubCities.slice(0, 6);
//   const hiddenSubCities = currentSubCities.slice(6);


//   const excellenceStats = homeContent ? [
//     {
//       icon: <FaHome size={40} className="text-warning mb-3" />,
//       value: homeContent[12]?.json_content?.title,
//       label: homeContent[12]?.json_content?.description
//     },
//     {
//       icon: <FaSmile size={40} color="#ff914d" className="mb-3" />,
//       value: homeContent[11]?.json_content?.title,
//       label: homeContent[11]?.json_content?.description
//     },
//     // {
//     //   icon: <FaUsers size={40} color="#ff914d" className="mb-3" />,
//     //   value: homeContent[10]?.json_content?.title,
//     //   label: homeContent[10]?.json_content?.description
//     // },
//     // {
//     //   icon: <FaAward size={40} color="#2b2b2b" className="mb-3" />,
//     //   value: homeContent[9]?.json_content?.title,
//     //   label: homeContent[9]?.json_content?.description
//     // }
//     {
//       icon: <FaStar size={40} color="#2b2b2b" className="mb-3" />,
//       value: "4.8/5",
//       label: "Client Ratings"
//     }
//   ] : null;

//   return (
//     <MainLayout>
//       {/* 👈 5. Inject the Custom Schema from the Global SEO Tag Manager */}
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

//       {/* 👈 6. Legacy Fallback (Inner Custom Code) */}
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
        
//         /* FIX: Addresses CKEditor Figure wrappers and Image Cropping */
//         .rich-text-content figure, 
//         .rich-text-content figure.image { margin: 2rem auto !important; max-width: 100% !important; height: auto !important; display: flex; justify-content: center; }
//         .rich-text-content img { max-width: 100% !important; height: auto !important; border-radius: 12px; display: block !important; margin: 0 auto !important; object-fit: contain !important; }
//         .rich-text-content iframe, .rich-text-content video, .rich-text-content table { max-width: 100% !important; overflow-x: auto; display: block !important; margin: 2rem auto !important; }

//         .rich-text-content h2, .rich-text-content h3 { font-family: var(--font-outfit), sans-serif; font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 700; color: #0f172a; margin-top: 2rem; margin-bottom: 1rem; }
//         .rich-text-content p { font-family: var(--font-poppins), sans-serif; font-size: 1rem; line-height: 1.8; color: #475569; margin-bottom: 1.2rem; }
        
//         /* FIX: Bullet points flexbox correction */
//         .rich-text-content ul { display: flex; flex-direction: column; gap: 1rem; padding: 0; list-style: none; margin: 2rem 0; }
//         .rich-text-content li { background: #fdfdfd; border: 1px solid #f1f5f9; padding: 1.2rem 1.5rem 1.2rem 3rem; border-radius: 12px; display: block; position: relative; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: 0.3s; }
//         .rich-text-content li:hover { border-color: var(--hc-primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,145,77,0.1); }
//         .rich-text-content li::before { content: '✦'; color: var(--hc-primary); position: absolute; left: 1.2rem; top: 1.2rem; font-size: 1.2rem; font-weight: bold; line-height: 1.5; }

//         .micro-trust-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; }
//         .micro-trust-item:last-child { border-bottom: none; padding-bottom: 0; }
//         .micro-trust-icon { color: #22c55e; font-size: 18px; margin-right: 12px; }

//         .floating-contact-widget { position: fixed; right: 20px; top: 55%; transform: translateY(-50%); z-index: 999; display: flex; flex-direction: column; gap: 12px; }
//         .widget-btn { width: 55px; height: 55px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.2); transition: 0.3s; text-decoration: none; }
//         .widget-btn:hover { transform: scale(1.1); color: white; }
//         .widget-btn.call { background: var(--hc-primary); }

//         @media (max-width: 768px) {
//           .mobile-slider-wrapper { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; scroll-snap-type: x mandatory; gap: 15px; padding: 10px 0 30px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
//           .mobile-slider-wrapper::-webkit-scrollbar { display: none; }
//           .mobile-slider-wrapper > div { flex: 0 0 88% !important; scroll-snap-align: center; }
//           .rich-text-content ul { display: flex; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 1rem; }
//           .rich-text-content li { flex: 0 0 85%; }
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
        
//         .dual-sticky-wrapper { position: sticky; top: 100px; height: max-content; }
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
        
//         .modern-card { background: #ffffff; padding: 30px 25px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: all 0.3s ease; height: 100%; position: relative; overflow: hidden;}
//         .modern-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border-color: #ff914d;}
//         .modern-card-icon { width: 50px; height: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 20px; transition: transform 0.3s ease;}
//         .modern-card:hover .modern-card-icon { transform: scale(1.1); background: #ff914d; color: white; }
        
//         .approach-number { width: 60px; height: 60px; background: #fff4ed; color: #ff914d; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin: 0 auto 15px; }

//         /* 🌟 NEW: STYLING FOR LOCALITY PILLS IN SIDEBAR */
//         .subcity-pill {
//           display: inline-flex;
//           align-items: center;
//           padding: 8px 16px;
//           background: #f8fafc;
//           border: 1px solid #e2e8f0;
//           border-radius: 30px;
//           font-size: 13px;
//           color: #475569;
//           text-decoration: none;
//           font-family: var(--font-poppins), sans-serif;
//           font-weight: 500;
//           transition: all 0.3s ease;
//           margin-bottom: 8px;
//           margin-right: 8px;
//         }
//         .subcity-pill:hover {
//           background: #ff914d;
//           color: white;
//           border-color: #ff914d;
//           transform: translateY(-2px);
//           box-shadow: 0 4px 10px rgba(255,145,77,0.2);
//         }
//         /* Collapsible Button specific styles */
//         .view-all-btn[aria-expanded="true"] .fa-chevron-down { transform: rotate(180deg); transition: 0.3s ease; }
//         .view-all-btn[aria-expanded="false"] .fa-chevron-down { transition: 0.3s ease; }

//       `}} />

//       <main className="bg-light pb-5">
        
//         {/* --- HERO SECTION --- */}
//         <div className="city-hero w-100">
//           <Image 
//             // src={pageData?.location_image || '/images/wework_bgImage.jpg'} 
//             src={pageData?.banner_image ? getBackendImageUrl(pageData.banner_image) : getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg')}
//             alt={
//               pageData?.banner_title ||
//               pageData?.main_title ||
//               `${displayCity} Interior Design`
//             }
//             fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
//           />
//           {/* <div className="hero-overlay"></div> */}
//           <div className="container hero-content font-poppins">
//             <div className="hero-badge"><FaMapMarkerAlt className="me-2" /> High Creation Interior in {displayCity}</div>
//             <h1 className="hero-main-title fw-bold mb-3 font-outfit text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
//               {pageData?.main_title || `Interior Designers in ${displayCity}`}
//             </h1>
//             {/* <p className="fs-5 text-white mx-auto" style={{ maxWidth: '700px', opacity: 0.9 }}>
//               Elevating lifestyles with bespoke, luxury interiors tailored for homes in {displayCity}.
//             </p> */}
//           </div>
//         </div>

//         <div className="container city-main-container">
//           <div className="row g-5">
            
//             {/* --- LEFT COLUMN: CONTENT HUB --- */}
//             <div className="col-lg-8">
//               <div className="dual-sticky-wrapper">
                
//                  {/* --- 5. LENGTHY CONTENT --- */}
//                  <div className="premium-card mb-4">
//                   <h2 className="font-outfit fw-bold h3 mb-4 text-dark">
//                      {/* <span className="text-gradient">{displayCity}</span> */}
//                      Interior Designer In {displayCity}
//                   </h2>
//                   {/* FIX: Included ck-content class here to inherit image containment logic */}
//                   <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeDescription }} />
//                 </div>
//                 {/* --- 1. NEW SECTION: APPROACH & OFFERINGS --- */}
                

//                 {/* --- 2. DESIGN PROCESS GRID --- */}
//                 <div className="lazy-render">
//                   <div className="premium-card bg-white border-0">
//                     <h2 className="font-outfit fw-bold h3 mb-4 text-dark">Our Proven Design Process</h2>
//                     <div className="mobile-slider-wrapper">
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
//                                 <img src={blog.image || "/images/default.jpg"} alt={blog.title} className="rounded" style={{ width: "80px", height: "80px", objectFit: "cover" }} loading="lazy" />
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
                

//                 {/* --- 3. EXCELLENCE STATS (Dynamic Celebrating Excellence) --- */}
//                 {/* --- 3. EXCELLENCE STATS (Mapped from Home Page) --- */}
// <div className="lazy-render">
//   <div className="premium-card shadow-sm" style={{ background: 'linear-gradient(to right, #ffffff, #fff9f5)' }}>
//     <div className="row align-items-center mobile-slider-wrapper">
      
//       {excellenceStats ? (
//         /* Render the 4 columns matching the Home Page */
//         excellenceStats.map((stat, idx) => (
//           <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center" key={idx}>
//             {stat.icon}
//             <h3 className="font-outfit fw-bold h2 mb-1">{stat.value}</h3>
//             <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">{stat.label}</p>
//           </div>
//         ))
//       ) : (
//         /* Safe Fallback just in case the API goes down */
//         <>
//           <div className="col-md-4 excellence-stat">
//             <FaTrophy size={40} className="text-warning mb-3" />
//             <h3 className="font-outfit fw-bold h2 mb-1">500+</h3>
//             <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">Projects Delivered</p>
//           </div>
//           <div className="col-md-4 excellence-stat">
//             <FaStar size={40} color="#ff914d" className="mb-3" />
//             <h3 className="font-outfit fw-bold h2 mb-1">4.9/5</h3>
//             <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">Client Ratings</p>
//           </div>
//           <div className="col-md-4 excellence-stat">
//             <FaAward size={40} color="#2b2b2b" className="mb-3" />
//             <h3 className="font-outfit fw-bold h2 mb-1">15+</h3>
//             <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">Design Awards</p>
//           </div>
//         </>
//       )}

//     </div>
//   </div>
// </div>


//                 {/* --- 4. WHY CHOOSE US (Modern Cards) --- */}
//                 <div className="lazy-render">
//                   <div className="premium-card bg-transparent border-0 shadow-none px-0 py-0 mb-4">
//                     <div className="text-center mb-4">
//                         <h2 className="font-outfit fw-bold h3 text-dark">What makes us the best choice for your project.</h2>
//                         {/* <p className="text-muted font-poppins small"></p> */}
//                     </div>
//                     <div className="row g-4 mobile-slider-wrapper">
//                       <div className="col-md-6 col-lg-3">
//                         <div className="modern-card">
//                           <div className="modern-card-icon"><FaShieldAlt /></div>
//                           <h4 className="font-outfit fw-bold h6">10-Year Warranty</h4>
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

               

//                 {/* --- 6. MORE LENGTHY CONTENT --- */}
//                 {(pageData?.side_title || safeSideDescription) && (
//                   <div className="lazy-render">
//                     <div className="premium-card mb-4" style={{ background: '#fffcf9' }}>
//                       <h3 className="font-outfit fw-bold h4 mb-3 text-dark">{pageData.side_title}</h3>
//                       {/* FIX: Included ck-content class here to inherit image containment logic */}
//                       <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeSideDescription }} />
//                     </div>
//                   </div>
//                 )}

//                 {/* --- 7. INTERACTIVE PREMIUM FAQs --- */}
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

//                 {/* --- 8. BLOG INSPIRATION --- */}
                
//               </div>
//             </div>

//             {/* --- RIGHT COLUMN: SIDEBAR --- */}
//             <div className="col-lg-4">
//               <div className="dual-sticky-wrapper">
                
//                 {/* 1. TOP RIGHT: BOOK SITE VISIT CTA */}
//                 <div className="sidebar-cta shadow-lg mb-4">
//                   <h4 className="font-outfit fw-bold mb-2">Book a Site Visit</h4>
//                   <p className="font-poppins small text-white-50 mb-4">Expert designers will visit your {displayCity} property.</p>
//                   <Link href="/contact" className="btn btn-light w-100 fw-bold py-2 rounded-pill">Schedule Now</Link>
//                 </div>

//                 {/* 🌟 2. NEW TOP RIGHT: LOCALITY WIDGET WITH "VIEW ALL" TOGGLE */}
                

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

//         {/* 👇 UPDATED: NEARBY MAJOR CITIES AT THE BOTTOM WITH DYNAMIC BANNERS */}
//         {otherCities.length > 0 && (
//           <div className="container mt-5 pt-5 border-top">
//             <div className="d-flex justify-content-between align-items-end mb-4">
//               <h2 className="font-outfit fw-bold text-dark h3">Nearby Cities</h2>
//               <Link href="/services" className="text-decoration-none fw-bold small text-gradient">VIEW ALL CITIES <FaArrowRight /></Link>
//             </div>
//             <div className="row g-4 mobile-slider-wrapper">
//               {otherCities.map((cityName, idx) => {
//                 // 👇 Use the mapped local image or a backend fallback if not found in the mapping
//                 const cityImg = cityBannerMap[cityName] || getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg');

//                 return (
//                   <div className="col-lg-4" key={idx}>
//                     <Link href={cityUrlMap[cityName]} className="text-decoration-none">
//                       <div className="related-card bg-white position-relative shadow-sm h-100 rounded-4 overflow-hidden">
//                         <div style={{ height: "200px", position: "relative" }}>
//                           <Image 
//                             src={cityImg} 
//                             alt={cityName} 
//                             fill 
//                             style={{ objectFit: "cover" }} 
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
import { getPageSEO } from "@/utils/getSEO";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";

const cityUrlMap = {
  "noida": "/interior-designers-in-noida",
  "greater_noida": "/interior-designers-in-greater-noida",
  "delhi": "/interior-designers-in-delhi",
  "gurugram": "/interior-designers-in-gurgaon",
  "faridabad": "/best-interior-designers-in-faridabad",
  "ghaziabad": "/interior-designers-in-ghaziabad",
  "manesar": "/interior-designers-in-manesar",
  "dwarka": "/interior-designers-in-dwarka",
};

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
    const res = await fetch(`${API_BASE_URL}/cms-blog`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 4) : [];
  } catch (error) { return []; }
}

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

// --- SEO METADATA ---
export async function generateMetadata({ searchParams }) {
  const city = searchParams?.city && searchParams.city !== "undefined" ? searchParams.city : "delhi";
  const fallbackPath = cityUrlMap[city] || `/services-detail/${city}`;
  
  const [pageData, seoData] = await Promise.all([
    getCityData(city),
    getPageSEO(fallbackPath).catch(() => null)
  ]);

  const canonicalUrl = getCanonicalUrl({ 
    canonicalUrl: seoData?.alternates?.canonical || pageData?.seo_content?.canonical_url, 
    fallbackPath 
  });

  if (!pageData) return { title: "Services", robots: { index: false, follow: true } };

  return {
    title: seoData?.title || pageData?.seo_content?.meta_title || `${pageData.main_title} - Services`,
    description: seoData?.description || pageData?.seo_content?.meta_description || "Best Interior Design Services",
    keywords: seoData?.keywords || pageData?.seo_content?.meta_keywords || "",
    alternates: { canonical: canonicalUrl },
    robots: seoData?.robots || getRobotsDirectives(pageData?.seo_content),
    openGraph: seoData?.openGraph || null,
    twitter: seoData?.twitter || null,
  };
}

const ServicesDetailPage = async ({ searchParams }) => {
  const city = searchParams?.city && searchParams.city !== "undefined" ? searchParams.city : "delhi";
  const fallbackPath = cityUrlMap[city] || `/services-detail/${city}`;

  // Fetch Data + Global SEO schemas + Dynamic Excellence Stats concurrently
  const [pageData, recentBlogs, seoData, excellenceStats] = await Promise.all([
    getCityData(city),
    getRecentBlogs(),
    getPageSEO(fallbackPath).catch(() => null),
    getExcellenceStats()
  ]);
  
  if (!pageData) notFound(); 

  const customSchema = seoData?.customSchema;
  const safeDescription = pageData?.main_description ? DOMPurify.sanitize(pageData.main_description) : "";
  const safeSideDescription = pageData?.side_description ? DOMPurify.sanitize(pageData.side_description) : "";
  
  const displayCity = city.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const faqs = parseJsonSafe(pageData.faqs);

  const otherCities = Object.keys(cityUrlMap).filter(c => c !== city).slice(0, 3);
  
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
        .sidebar-cta h4 { color: #ffffff !important; }

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
      `}} />

      <main className="bg-light pb-5">
        
        {/* --- HERO SECTION --- */}
        <div className="city-hero w-100">
          <Image 
            src={pageData?.banner_image ? getBackendImageUrl(pageData.banner_image) : getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg')}
            alt={
              pageData?.banner_title ||
              pageData?.main_title ||
              `${displayCity} Interior Design`
            }
            fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
          />
          <div className="container hero-content font-poppins">
            <div className="hero-badge"><FaMapMarkerAlt className="me-2" /> High Creation Interior in {displayCity}</div>
            <h1 className="hero-main-title fw-bold mb-3 font-outfit text-white" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
              {pageData?.main_title || `Interior Designers in ${displayCity}`}
            </h1>
          </div>
        </div>

        <div className="container city-main-container">
          <div className="row g-5">
            
            {/* --- LEFT COLUMN: CONTENT HUB --- */}
            <div className="col-lg-8">
              {/* <div className="dual-sticky-wrapper"> */}
               <div>
                
                 {/* --- LENGTHY CONTENT --- */}
                 <div className="premium-card mb-4">
                  <h2 className="font-outfit fw-bold h3 mb-4 text-dark">
                     Interior Designer In {displayCity}
                  </h2>
                  <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeDescription }} />
                </div>

                {/* --- DESIGN PROCESS GRID --- */}
                <div className="lazy-render">
                  <div className="premium-card bg-white border-0">
                    <h2 className="font-outfit fw-bold h3 mb-4 text-dark text-center text-md-start">Our Proven Design Process</h2>
                    <div className="mobile-slider-wrapper process-slider">
                      {[
                        { icon: <FaUser />, title: "Consultation & Ideation", desc: `We meet at your ${displayCity} property to understand your vision.` },
                        { icon: <FaDraftingCompass />, title: "3D Concept & Planning", desc: "Walking through your home with detailed 3D renders before we build." },
                        { icon: <FaHardHat />, title: "Precision Execution", desc: "Expert execution with 150+ quality checks and zero compromises." },
                        { icon: <FaHome />, title: "The Grand Handover", desc: "A flawless move-in within 45 Days Delivery*. Welcome home." }
                      ].map((step, i) => (
                        <div className="process-step" key={i}>
                          <div className="process-icon">{step.icon}</div>
                          <div>
                            <h4 className="font-outfit h5 fw-bold mb-1">{i + 1}. {step.title}</h4>
                            <p className="text-muted font-poppins small mb-0">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {recentBlogs.length > 0 && (
                  <div className="lazy-render">
                    <div className="premium-card border-0 px-0 pt-0">
                      <h2 className="font-outfit fw-bold h3 mb-4">Design Inspiration</h2>
                      <div className="row g-4 font-poppins mobile-slider-wrapper">
                        {recentBlogs.map((blog, idx) => (
                          <div className="col-md-6" key={idx}>
                            <Link href={`/${blog.seo_content?.slug || `blog-detail?id=${blog.id}`}`} className="text-decoration-none">
                              <div className="d-flex align-items-center border p-3 rounded-4 bg-white shadow-sm h-100 transition-all hover:shadow-md">
                                <img src={blog.image || "/images/default.jpg"} alt={blog.title} className="rounded" style={{ width: "80px", height: "80px",objectFit: "inherit", flexShrink: 0 }} loading="lazy" />
                                <div className="ms-3">
                                  <h6 className="text-dark fw-bold mb-1" style={{ fontSize: '14px' }}>{blog.title.length > 45 ? `${blog.title.substring(0, 45)}...` : blog.title}</h6>
                                  <small className="text-gradient fw-bold">READ ARTICLE <FaArrowRight size={10} /></small>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* --- EXCELLENCE STATS (Dynamic CMS Icons) --- */}
                <div className="lazy-render">
                  <div className="premium-card shadow-sm" style={{ background: 'linear-gradient(to right, #ffffff, #fff9f5)' }}>
                    <div className="row align-items-center justify-content-center mobile-slider-wrapper">
                      
                      {excellenceStats && excellenceStats.length > 0 ? (
                        excellenceStats.map((stat, idx) => {
                          const IconComponent = (stat.iconName && FaIcons[stat.iconName]) 
                            ? FaIcons[stat.iconName] 
                            : FaIcons.FaStar;
                            
                          const colWidth = excellenceStats.length <= 3 ? 4 : Math.max(3, Math.floor(12 / excellenceStats.length));

                          return (
                            <div className={`col-md-${colWidth} excellence-stat d-flex flex-column align-items-center justify-content-center text-center`} key={idx}>
                              {stat.iconType === "image" && stat.image ? (
                                <img 
                                  src={getBackendImageUrl(stat.image)} 
                                  alt={stat.label || "Stat Icon"} 
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
                              <h3 className="font-outfit fw-bold h2 mb-1">{stat.value}</h3>
                              <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">{stat.label}</p>
                            </div>
                          );
                        })
                      ) : (
                        /* Safe Fallback Default Stats */
                        <>
                          <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
                            <FaIcons.FaHome size={40} color="#ff914d" className="mb-3" />
                            <h3 className="font-outfit fw-bold h2 mb-1">2680+</h3>
                            <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">HOME RENOVATIONS</p>
                          </div>
                          <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
                            <FaIcons.FaSmile size={40} color="#ff914d" className="mb-3" />
                            <h3 className="font-outfit fw-bold h2 mb-1">2660+</h3>
                            <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">HAPPY CUSTOMERS</p>
                          </div>
                          <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
                            <FaIcons.FaStar size={40} color="#ff914d" className="mb-3" />
                            <h3 className="font-outfit fw-bold h2 mb-1">4.8/5</h3>
                            <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">CLIENT RATINGS</p>
                          </div>
                        </>
                      )}

                    </div>
                  </div>
                </div>

                {/* --- WHY CHOOSE US (Modern Cards) --- */}
                <div className="lazy-render">
                  <div className="premium-card bg-transparent border-0 shadow-none px-0 py-0 mb-4">
                    <div className="text-center mb-4">
                        <h2 className="font-outfit fw-bold h3 text-dark">What makes us the best choice for your project.</h2>
                    </div>
                    <div className="row g-4 mobile-slider-wrapper modern-card-slider">
                      <div className="col-md-6 col-lg-3">
                        <div className="modern-card">
                          <div className="modern-card-icon"><FaShieldAlt /></div>
                          <h4 className="font-outfit fw-bold h6">10-Year Warranty</h4>
                          <p className="text-muted font-poppins small mb-0">India&apos;s only full-home coverage guarantee.</p>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="modern-card">
                          <div className="modern-card-icon"><FaGem /></div>
                          <h4 className="font-outfit fw-bold h6">Elite Finishes</h4>
                          <p className="text-muted font-poppins small mb-0">Sourcing luxury materials that stand the test of time.</p>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="modern-card">
                          <div className="modern-card-icon"><FaClock /></div>
                          <h4 className="font-outfit fw-bold h6">45-Day Delivery*</h4>
                          <p className="text-muted font-poppins small mb-0">Swift, on-time installation of storage & kitchens.</p>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="modern-card">
                          <div className="modern-card-icon"><FaTools /></div>
                          <h4 className="font-outfit fw-bold h6">Expert Team</h4>
                          <p className="text-muted font-poppins small mb-0">Highly skilled professionals handling your project end-to-end.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- MORE LENGTHY CONTENT --- */}
                {(pageData?.side_title || safeSideDescription) && (
                  <div className="lazy-render">
                    <div className="premium-card mb-4" style={{ background: '#fffcf9' }}>
                      <h3 className="font-outfit fw-bold h4 mb-3 text-dark">{pageData.side_title}</h3>
                      <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeSideDescription }} />
                    </div>
                  </div>
                )}

                {/* --- INTERACTIVE PREMIUM FAQs --- */}
                {faqs.length > 0 && (
                  <div className="lazy-render">
                    <div className="premium-card border-0 px-4">
                      <h2 className="font-outfit fw-bold h3 mb-4">Insights for {displayCity}</h2>
                      <div className="accordion font-poppins" id={`accordion-faq-${pageData?.id}`}>
                        {faqs.map((faq, index) => (
                          <div className="accordion-item faq-premium-item" key={index}>
                            <h2 className="accordion-header">
                              <button className={`accordion-button faq-premium-btn ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
                                <span className="pe-3">{faq.question}</span>
                                <FaPlus className="faq-icon-toggle flex-shrink-0" />
                              </button>
                            </h2>
                            <div id={`collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent={`#accordion-faq-${pageData?.id}`}>
                              <div className="accordion-body faq-premium-body" style={{ whiteSpace: 'pre-line' }}>{faq.answer}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
            </div>

            {/* --- RIGHT COLUMN: SIDEBAR --- */}
            <div className="col-lg-4">
              {/* <div className="dual-sticky-wrapper"> */}
              <div className="right-sidebar-sticky">
                
                {/* 1. TOP RIGHT: BOOK SITE VISIT CTA */}
                <div className="sidebar-cta shadow-lg mb-4">
                  <h4 className="font-outfit fw-bold mb-2">Book a Site Visit</h4>
                  <p className="font-poppins small text-white-50 mb-4">Expert designers will visit your {displayCity} property.</p>
                  <Link href="/contact" className="btn btn-light w-100 fw-bold py-2 rounded-pill">Schedule Now</Link>
                </div>

                {/* 3. SIDEBAR FORM */}
                <SidebarForm city={city} />

                {/* 4. THE PROMISE */}
                <div className="sidebar-widget py-4 font-poppins lazy-render">
                  <h4 className="widget-title mb-4">The Promise</h4>
                  <div className="micro-trust-item">
                    <FaCheckCircle className="micro-trust-icon" />
                    <div>
                      <span className="d-block fw-bold text-dark" style={{ fontSize: '14px' }}>Transparent Pricing</span>
                      <span className="text-muted" style={{ fontSize: '12px' }}>No hidden costs, ever.</span>
                    </div>
                  </div>
                  <div className="micro-trust-item">
                    <FaTools className="micro-trust-icon text-warning" />
                    <div>
                      <span className="d-block fw-bold text-dark" style={{ fontSize: '14px' }}>In-House Execution</span>
                      <span className="text-muted" style={{ fontSize: '12px' }}>No third-party contractors involved.</span>
                    </div>
                  </div>
                </div>

                {/* 5. MAJOR CITIES */}
                <div className="sidebar-widget">
                  <h4 className="widget-title">Service Areas</h4>
                  <div className="d-flex flex-column">
                    {Object.keys(cityUrlMap).map((c, idx) => (
                      <Link key={idx} href={cityUrlMap[c]} className={`nav-city-link ${c === city ? 'active' : ''}`}>
                        <span><FaMapMarkerAlt className="me-2" size={14} /> <span className="text-capitalize">{c.replace('_', ' ')}</span></span>
                        <FaArrowRight size={12} />
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* NEARBY MAJOR CITIES AT THE BOTTOM WITH DYNAMIC BANNERS */}
        {otherCities.length > 0 && (
          <div className="container mt-5 pt-5 border-top">
            <div className="d-flex justify-content-between align-items-end mb-4">
              <h2 className="font-outfit fw-bold text-dark h3">Nearby Cities</h2>
              <Link href="/services" className="text-decoration-none fw-bold small text-gradient">VIEW ALL CITIES <FaArrowRight /></Link>
            </div>
            <div className="row g-4 mobile-slider-wrapper">
              {otherCities.map((cityName, idx) => {
                const cityImg = cityBannerMap[cityName] || getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg');

                return (
                  <div className="col-lg-4" key={idx}>
                    <Link href={cityUrlMap[cityName]} className="text-decoration-none">
                      <div className="related-card bg-white position-relative shadow-sm h-100 rounded-4 overflow-hidden">
                        <div style={{ height: "200px", position: "relative" }}>
                          <Image 
                            src={cityImg} 
                            alt={cityName} 
                            fill 
                            style={{ objectFit: "cover" }} 
                            loading="lazy" 
                          />
                          <div className="position-absolute bottom-0 start-0 p-4 w-100 text-white fw-bold" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                            <FaMapMarkerAlt className="me-2 text-warning" /> {cityName.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </MainLayout>
  );
};

export default ServicesDetailPage;