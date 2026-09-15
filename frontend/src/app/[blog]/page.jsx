// import MainLayout from "../layouts/MainLayout";
// import { defaultAltText } from "@/utils/helper";
// import { notFound } from "next/navigation";
// import Image from "next/image"; 
// import Link from "next/link";
// import { headers } from "next/headers"; 
// import DOMPurify from "isomorphic-dompurify";

// import { 
//   FaMapMarkerAlt, FaArrowRight, FaPhoneAlt, FaEnvelope, FaUser, 
//   FaShieldAlt, FaGem, FaClock, FaTrophy, FaStar, FaAward, 
//   FaCheckCircle, FaWallet, FaTools, FaDraftingCompass, FaHardHat, FaHome,
//   FaWhatsapp, FaPlus, FaChevronDown,
//   // 👇 ADD THESE FOR CELEBRATING EXCELLENCE:
//   FaSmile, FaUsers, FaCalendarAlt,FaUserCircle,FaFacebookF,FaInstagram,FaTwitter,FaLinkedin,FaPinterest,FaYoutube
// } from "react-icons/fa";

// import { SidebarForm } from "../services-detail/CityForms";

// import { 
//   generateOrganizationSchema, 
//   generateLocalBusinessSchema, 
//   generateBreadcrumbSchema, 
//   generateFAQSchema 
// } from "@/utils/schemaGenerator";
// import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";

// import { getPageSEO } from "@/utils/getSEO"; 
// import ExpandableRichText from "../components/ModernPara";
// // import { getBackendImageUrl} from "@utils/helper";
// import { getBackendImageUrl } from "@/utils/helper";

// export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";
// export const revalidate = 0;

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

// const isValidSlug = (slug) => {
//   if (!slug) return false;
//   if (slug === "undefined" || slug === "null") return false;
//   if (slug.includes(".")) return false; 
//   return true;
// };

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";

// const isDraftStatus = (data) => {
//   if (!data) return true;
//   if (data.status === undefined || data.status === null) return false; 
//   const status = String(data.status).toLowerCase().trim();
//   return status === "draft" || status === "inactive" || status === "0";
// };

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
//     // const timestamp = new Date().getTime();
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

// async function getBlogData(slug) {
//   try {
//     const timestamp = new Date().getTime();
//     const res = await fetch(`${API_BASE_URL}/cms-blog/blog-slug/${slug}?t=${timestamp}`, {
//       cache: "no-store", 
//       headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
//     });
//     if (!res.ok) return null;
//     let data = await res.json();
//     if (!data || data.success === false) return null;
//     if (Array.isArray(data)) {
//         if (data.length === 0) return null;
//         data = data[0]; 
//     }
//     return data;
//   } catch (error) {
//     return null;
//   }
// }

// async function getCmsPageData(slug) {
//   try {
//     const timestamp = new Date().getTime();
//     const res = await fetch(`${API_BASE_URL}/cms-pages/slug/${slug}?t=${timestamp}`, {
//       cache: "no-store", 
//       headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
//     });
//     if (!res.ok) return null;
//     let data = await res.json();
//     if (!data || data.success === false) return null;
//     if (Array.isArray(data)) {
//         if (data.length === 0) return null;
//         data = data[0]; 
//     }
//     return data;
//   } catch (error) {
//     return null;
//   }
// }

// export async function generateMetadata({ params }) {
//   headers();
//   const slug = params.blog;

//   if (!isValidSlug(slug)) {
//     return { title: "Not Found", robots: { index: false, follow: true } };
//   }

//   const [blogData, cmsData, seoData] = await Promise.all([
//     getBlogData(slug).catch(() => null),
//     getCmsPageData(slug).catch(() => null),
//     getPageSEO(`/${slug}`).catch(() => null)
//   ]);

//   let data = blogData || cmsData;

//   if (!data || isDraftStatus(data)) {
//     return { title: "Not Found", robots: { index: false, follow: true } };
//   }

//   const robots = seoData?.robots || getRobotsDirectives(data?.seo_content);
//   const canonicalUrl = getCanonicalUrl({
//     canonicalUrl: seoData?.alternates?.canonical || data?.seo_content?.canonical_url,
//     fallbackPath: `/${slug}`,
//   });

//   return {
//     title: seoData?.title || data?.seo_content?.meta_title || data?.title || "HC Interior",
//     description: seoData?.description || data?.seo_content?.meta_description || "",
//     keywords: seoData?.keywords || data?.seo_content?.meta_keywords || "",
//     alternates: { canonical: canonicalUrl },
//     robots,
//     openGraph: seoData?.openGraph || null,
//     twitter: seoData?.twitter || null,
//   };
// }

// const parseJsonSafe = (data) => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   try { return JSON.parse(data); } catch (e) { return []; }
// };

// const DynamicRootPage = async ({ params }) => {
//   headers();
//   const slug = params.blog;

//   if (!isValidSlug(slug)) {
//     notFound();
//   }

//   let pageData = await getBlogData(slug);
//   let pageType = "blog";

//   if (!pageData) {
//     pageData = await getCmsPageData(slug);
//     pageType = "cms-page";
//   }

//   if (!pageData || isDraftStatus(pageData)) {
//     notFound();
//   }

//   const seoData = await getPageSEO(`/${slug}`);
//   const customSchema = seoData?.customSchema;
//   const recentBlogs = await getRecentBlogs();
//   // const excellenceData = await getExcellenceData();

//   const homeContent = await getExcellenceData();
//   const excellenceStats = homeContent ? [
//     {
//       icon: <FaHome size={40} color="#ff914d" className="mb-3" />,
//       value: homeContent[12]?.json_content?.title,
//       label: homeContent[12]?.json_content?.description
//     },
//     {
//       icon: <FaSmile size={40} color="#ff914d" className="mb-3" />,
//       value: homeContent[11]?.json_content?.title,
//       label: homeContent[11]?.json_content?.description
//     },
//     {
//       icon: <FaStar size={40} color="#ff914d" className="mb-3" />,
//       value: "4.8/5",
//       label: "Client Ratings"
//     }
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
//   ] : null;
  
//   let faqs = [];
//   let accordions = [];
//   let contentBlocks = [];

//   if (pageType === "cms-page") {
//     faqs = parseJsonSafe(pageData.faqs);
//     accordions = parseJsonSafe(pageData.accordions);
//     contentBlocks = parseJsonSafe(pageData.content_blocks);
//   }

//   let siteSettings = null;
//   try {
//     const timestamp = new Date().getTime();
//     const setRes = await fetch(`${API_BASE_URL}/site-settings`, { 
//         cache: "no-store",
//         headers: { 'Cache-Control': 'no-cache' }
//     });
//     if (setRes.ok) {
//         const rawSettings = await setRes.json();
//         siteSettings = Array.isArray(rawSettings) ? rawSettings[0] : rawSettings;
//     }
//   } catch (e) { 
//       console.error("Settings fetch failed", e); 
//   }

//   const orgSchema = generateOrganizationSchema(siteSettings);
//   const localBizSchema = generateLocalBusinessSchema(siteSettings);
//   const breadcrumbSchema = generateBreadcrumbSchema(slug, pageData.title);
  
//   const hasInnerCustomFaqSchema =
//     typeof pageData?.seo_content?.custom_code === "string" &&
//     /FAQPage/i.test(pageData.seo_content.custom_code);
    
//   const faqSchema = faqs.length > 0 && !hasInnerCustomFaqSchema ? generateFAQSchema(faqs) : null;

//   // const displayCity = slug.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   const displayCity = slug.split(/-|_/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   const safeContent = pageData?.content ? DOMPurify.sanitize(pageData.content) : "";
// // const dynamicBgUrl = getBackendImageUrl(content?.bg_image || '/parent-child/wework_bgImage.jpg'); 

// let heroImageSrc = getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg'); // Default fallback

//   const normalizedSlug = slug.toLowerCase();

//   // If a backend image exists, use it first (this allows you to easily update from backend later)
//   if (pageData?.image) {
//     heroImageSrc = getBackendImageUrl(pageData.image);
//   } 
//   // Temporary overrides for specific cities using images from the local /public folder
//   else if (normalizedSlug.includes('sohna')) {
//     // Escaping spaces in Next.js public directory paths using encodeURI (or safely rely on Next.js handling spaces)
//     heroImageSrc = '/images/Serving Area/Interior Designers in Sohna.jpg';
//   } 
//   else if (normalizedSlug.includes('noida-extension') || normalizedSlug.includes('noida_extension')) {
//     heroImageSrc = '/images/Serving Area/Interior Designer in Noida Extension.jpg';
//   }
//   // 👆 END OF BANNER DISPLAY LOGIC

//   return (
//     <MainLayout>
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizSchema) }} />
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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

//       {pageData?.seo_content?.custom_code && (
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: pageData.seo_content.custom_code.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '') }}
//         />
//       )}

//       <style dangerouslySetInnerHTML={{__html: `
//         :root { --hc-primary: #ff914d; --hc-dark: #0f172a; }
//         .font-outfit { font-family: var(--font-outfit), sans-serif; }
//         .font-poppins { font-family: var(--font-poppins), sans-serif; }
//         .text-gradient { background: linear-gradient(135deg, #ff914d 0%, #ff5722 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
//         .lazy-render { content-visibility: auto; contain-intrinsic-size: 1px 800px; }

//         /* Social Buttons */
//         .social-btn { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; background-color: #f1f5f9; color: #475569; text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
//         .social-btn:hover { transform: translateY(-4px); }
//         .social-btn.fb:hover { background-color: #1877F2; color: white; box-shadow: 0 6px 12px rgba(24, 119, 242, 0.3); }
//         .social-btn.ig:hover { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); color: white; box-shadow: 0 6px 12px rgba(214, 36, 159, 0.3); }
//         .social-btn.tw:hover { background-color: #000000; color: white; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); }
//         .social-btn.in:hover { background-color: #0A66C2; color: white; box-shadow: 0 6px 12px rgba(10, 102, 194, 0.3); }
//         .social-btn.pi:hover { background-color: #E60023; color: white; box-shadow: 0 6px 12px rgba(230, 0, 35, 0.3); }
//         .social-btn.yt:hover { background-color:hsl(0, 100.00%, 50.00%); color: white; box-shadow: 0 6px 12px rgba(255, 0, 0, 0.3); }

//         /* Modern City Layout Styles */
//         .city-hero { height: 55vh; min-height: 450px; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: #1e293b; }
//         .hero-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.95) 100%); z-index: 1; }
//         .hero-content { position: relative; z-index: 2; text-align: center; padding-top: 40px; }
//         .hero-badge { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); padding: 8px 24px; border-radius: 30px; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; display: inline-flex; align-items: center; color: #fff; font-weight: 600; }
//         .hero-main-title { font-size: clamp(2.4rem, 5vw, 3.8rem); line-height: 1.1; letter-spacing: -0.02em; }
        
//         .city-main-container { margin-top: -80px; position: relative; z-index: 10; }
//         .premium-card { background: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.04); padding: 40px; margin-bottom: 40px; border: 1px solid rgba(0,0,0,0.02); overflow: hidden; }
        
//         /* CMS CONTENT PROTECTION & STRICT IMAGE POSITIONING */
//         .rich-text-content { width: 100%; word-break: break-word; overflow-wrap: anywhere; }
        
//         .rich-text-content figure, 
//         .rich-text-content figure.image { margin: 2rem auto !important; max-width: 100% !important; height: auto !important; display: flex; justify-content: center; }
//         .rich-text-content img { max-width: 100% !important; height: auto !important; border-radius: 12px; display: block !important; margin: 0 auto !important; object-fit: contain !important; }
//         .rich-text-content iframe, .rich-text-content video, .rich-text-content table { max-width: 100% !important; overflow-x: auto; display: block !important; margin: 2rem auto !important; }

//         .rich-text-content h2, .rich-text-content h3 { font-family: var(--font-outfit), sans-serif; font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 700; color: #0f172a; margin-top: 2rem; margin-bottom: 1rem; }
//         .rich-text-content p { font-family: var(--font-poppins), sans-serif; font-size: 1rem; line-height: 1.8; color: #475569; margin-bottom: 1.2rem; }
        
//         /* Bullet point lists for correct CMS rendering */
//         .rich-text-content ul { display: flex; flex-direction: column; gap: 1rem; padding: 0; list-style: none; margin: 2rem 0; }
//         .rich-text-content li { background: #fdfdfd; border: 1px solid #f1f5f9; padding: 1.2rem 1.5rem 1.2rem 3rem; border-radius: 12px; display: block; position: relative; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: 0.3s; }
//         .rich-text-content li:hover { border-color: var(--hc-primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,145,77,0.1); }
//         .rich-text-content li::before { content: '✦'; color: var(--hc-primary); position: absolute; left: 1.2rem; top: 1.2rem; font-size: 1.2rem; font-weight: bold; line-height: 1.5; }
        
//         .rich-text-content li img { max-width: 100% !important; height: auto !important; margin: 1rem auto; border-radius: 8px; display: block; }

//         .micro-trust-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; }
//         .micro-trust-item:last-child { border-bottom: none; padding-bottom: 0; }
//         .micro-trust-icon { color: #22c55e; font-size: 18px; margin-right: 12px; }

//         /* Premium FAQs */
//         .faq-premium-item { border: none !important; margin-bottom: 16px; border-radius: 16px !important; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); background: #ffffff; border: 1px solid #f1f5f9 !important; }
//         .faq-premium-btn { width: 100%; text-align: left; background: white; border: none; padding: clamp(16px, 4vw, 24px); font-weight: 700; font-size: clamp(1.05rem, 3.5vw, 1.2rem); color: var(--hc-dark); display: flex; justify-content: space-between; align-items: center; box-shadow: none !important; line-height: 1.4; gap: 15px; }
//         .faq-premium-btn::after { display: none !important; }
//         .faq-premium-btn:not(.collapsed) { color: var(--hc-primary); background: #fffcf9; }
//         .faq-icon-toggle { transition: transform 0.3s ease; color: var(--hc-primary); flex-shrink: 0; }
//         .faq-premium-btn:not(.collapsed) .faq-icon-toggle { transform: rotate(45deg); color: #ff5722; }
//         .faq-premium-body { padding: 0 clamp(16px, 4vw, 24px) 20px; color: #475569; font-size: clamp(0.95rem, 3vw, 1.05rem); line-height: 1.7; background: #fffcf9; }
        
//         .sidebar-blog-card { padding: 12px; border-radius: 12px; transition: all 0.3s ease; border: 1px solid transparent; }
//         .sidebar-blog-card:hover { background-color: #f8fafc; border-color: #e2e8f0; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.03); }

//         .process-step { display: flex; align-items: flex-start; margin-bottom: 30px; position: relative; }
//         .process-step:last-child { margin-bottom: 0; }
//         .process-icon { width: 50px; height: 50px; min-width: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-right: 20px; z-index: 2; }
//         .process-step:not(:last-child)::after { content: ''; position: absolute; left: 24px; top: 50px; bottom: -30px; width: 2px; background: #ffe4d6; z-index: 1; }

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

//         .modern-card { background: #ffffff; padding: 30px 25px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: all 0.3s ease; height: 100%; position: relative; overflow: hidden;}
//         .modern-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border-color: #ff914d;}
//         .modern-card-icon { width: 50px; height: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 20px; transition: transform 0.3s ease;}
//         .modern-card:hover .modern-card-icon { transform: scale(1.1); background: #ff914d; color: white; }

//         @media (max-width: 768px) {
//           .premium-card { padding: 20px !important; margin-bottom: 25px; }
//           .author-date-social-block { flex-direction: column !important; align-items: flex-start !important; gap: 15px; }
//           .social-links { width: 100%; justify-content: flex-start; flex-wrap: wrap; gap: 8px; }
//           .hero-main-title { font-size: 2.2rem !important; }
          
//           .mobile-slider-wrapper { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; scroll-snap-type: x mandatory; gap: 15px; padding: 10px 0 30px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
//           .mobile-slider-wrapper::-webkit-scrollbar { display: none; }
//           .mobile-slider-wrapper > div { flex: 0 0 88% !important; scroll-snap-align: center; }
//           .rich-text-content ul { display: flex; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 1rem; }
//           .rich-text-content li { flex: 0 0 85%; }
//         }
//       `}} />

//       <main className="bg-light pb-5">
        
//         {pageType === "blog" && (
//           <div className="container py-4 py-lg-5 mt-lg-4">
//             <div className="row g-4 g-lg-5">

//               <div className="col-lg-8 order-1">
//                 <div className="premium-card bg-white">

//                   <h1 className="font-outfit fw-bold text-dark mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', lineHeight: '1.3' }}>
//                     {pageData.title}
//                   </h1>

//                   <div className="author-date-social-block d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4">
//                     <div className="text-muted fst-italic fs-6 mb-3 mb-md-0 d-flex align-items-center font-poppins flex-wrap gap-2">
//                       <span><FaUserCircle className="me-2 text-secondary" size={20} />
//                       {pageData.writer_name ? `By ${pageData.writer_name}` : "By HC Team"}</span>
//                       <span className="mx-2 d-none d-md-inline">•</span>
//                       <span><FaCalendarAlt className="me-2 text-secondary" size={18} />
//                       {new Date(pageData.created_at || Date.now()).toLocaleDateString('en-US', {
//                         year: 'numeric', month: 'long', day: 'numeric'
//                       })}</span>
//                     </div>

//                     <div className="social-links d-flex gap-2">
//                         {siteSettings?.facebook_url && <a href={siteSettings.facebook_url} target="_blank" rel="noopener noreferrer" className="social-btn fb" aria-label="Facebook"><FaFacebookF size={18} /></a>}
//                         {siteSettings?.instagram_url && <a href={siteSettings.instagram_url} target="_blank" rel="noopener noreferrer" className="social-btn ig" aria-label="Instagram"><FaInstagram size={18} /></a>}
//                         {siteSettings?.twitter_url && <a href={siteSettings.twitter_url} target="_blank" rel="noopener noreferrer" className="social-btn tw" aria-label="X (Twitter)"><FaTwitter size={18} /></a>}
//                         {siteSettings?.linkedin_url && <a href={siteSettings.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-btn in" aria-label="LinkedIn"><FaLinkedin size={18} /></a>}
//                         {siteSettings?.pinterest_url && <a href={siteSettings.pinterest_url} target="_blank" rel="noopener noreferrer" className="social-btn pi" aria-label="Pinterest"><FaPinterest size={18} /></a>}
//                         {siteSettings?.youtube_url && <a href={siteSettings.youtube_url} target="_blank" rel="noopener noreferrer" className="social-btn yt" aria-label="YouTube"><FaYoutube size={18} /></a>}
//                     </div>
//                   </div>

//                   {pageData.image && (
//                     <div className="w-100 mb-4 mb-lg-5 d-flex justify-content-center">
//                       <Image
//                         src={pageData.image}
//                         alt={pageData.image_alt || pageData.title || defaultAltText}
//                         width={1200}
//                         height={675}
//                         priority={true}
//                         style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover', borderRadius: '1rem', display: 'block', margin: '0 auto' }}
//                         className="shadow-sm"
//                       />
//                     </div>
//                   )}

//                  <div className="details font-poppins rich-text-content ck-content">
//                     <div dangerouslySetInnerHTML={{ __html: pageData.description }} />
//                   </div>
//                 </div>
//               </div>

//               <div className="col-lg-4 order-2">
//                 <div className="dual-sticky-wrapper">

//                   <SidebarForm city={slug} />

//                   {recentBlogs && recentBlogs.length > 0 && (
//                     <div className="sidebar-widget mt-4 lazy-render">
//                       <h4 className="widget-title">Related Articles</h4>
//                       <div className="d-flex flex-column gap-2">
//                         {recentBlogs.map((blog, idx) => (
//                           <Link key={idx} href={`/${blog.seo_content?.slug || `blog-detail?id=${blog.id}`}`} className="text-decoration-none">
//                             <div className="sidebar-blog-card d-flex align-items-center gap-3">
//                               <img 
//                                 src={blog.image || "/images/default.jpg"} 
//                                 alt={blog.title} 
//                                 className="rounded object-fit-cover shadow-sm flex-shrink-0" 
//                                 style={{ width: "70px", height: "70px" }} 
//                               />
//                               <div>
//                                 <h6 className="text-dark fw-bold mb-1" style={{ fontSize: '14px', lineHeight: '1.4' }}>
//                                   {blog.title.length > 45 ? `${blog.title.substring(0, 45)}...` : blog.title}
//                                 </h6>
//                                 <small className="text-gradient fw-bold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
//                                   READ ARTICLE <FaArrowRight size={10} />
//                                 </small>
//                               </div>
//                             </div>
//                           </Link>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   <div className="sidebar-widget mt-4">
//                     <h4 className="widget-title">Service Areas</h4>
//                     <div className="d-flex flex-column">
//                       {Object.keys(cityUrlMap).map((c, idx) => (
//                         <Link key={idx} href={cityUrlMap[c]} className="nav-city-link">
//                           <span><FaMapMarkerAlt className="me-2" size={14} /> <span className="text-capitalize">{c.replace('_', ' ')}</span></span>
//                           <FaArrowRight size={12} />
//                         </Link>
//                       ))}
//                     </div>
//                   </div>

//                 </div>
//               </div>

//             </div>
//           </div>
//         )}

// {pageType === "cms-page" && (
//           <>
//             <div className="city-hero w-100">
//             <Image 
//                 /* 👇 UPDATED TO USE THE NEW DYNAMIC IMAGE LOGIC */
//                 src={heroImageSrc}
//                 alt={`${displayCity} Interior Design`}
//                 fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
//               />
              
//               {/* Pro-tip: If the text is still hard to read on very bright images, uncomment the hero-overlay below */}
//               {/* <div className="hero-overlay"></div> */}
              
//               <div className="container hero-content font-poppins">
//                 <div className="hero-badge" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
//                   <FaMapMarkerAlt className="me-2" /> High Creation Interior {displayCity}
//                 </div>
                
//                 {/* Added a strong double text-shadow for maximum readability */}
//                 <h1 
//                   className="hero-main-title fw-bold mb-3 font-outfit text-white" 
//                   style={{ textShadow: '2px 4px 15px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)' }}
//                 >
//                   {pageData?.heading || `${displayCity}`}
//                 </h1>
//               </div>
//             </div>

//             <div className="container city-main-container">
//               <div className="row g-5">
//                 <div className="col-lg-8">
//                   <div className="dual-sticky-wrapper">
                    
//                     <div className="premium-card mb-4">
//                       <h2 className="font-outfit fw-bold h3 mb-4 text-dark">
//                          {/* <span className="text-gradient">{displayCity}</span> */}
//                          {displayCity}
//                       </h2>
//                       <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeContent }} />
//                     </div>

//                     <div className="lazy-render">
//                       <div className="premium-card bg-white border-0">
//                         <h2 className="font-outfit fw-bold h3 mb-4 text-dark">Our Proven Design Process</h2>
//                         <div className="mobile-slider-wrapper">
//                           {[
//                             { icon: <FaUser />, title: "Consultation & Ideation", desc: `We meet at your ${displayCity} property to understand your vision.` },
//                             { icon: <FaDraftingCompass />, title: "3D Concept & Planning", desc: "Walking through your home with detailed 3D renders before we build." },
//                             { icon: <FaHardHat />, title: "Precision Execution", desc: "Expert execution with 150+ quality checks and zero compromises." },
//                             { icon: <FaHome />, title: "The Grand Handover", desc: "A flawless move-in within 45 Days Delivery*. Welcome home." }
//                   //           { 
//                   //             icon: <FaHome />, 
//                   //             title: (
//                   //  <>
//                   //                 150+ quality checks | 45 days delivery
//                   //                 <span 
//                   //                   title="Subject to change" 
//                   //                   style={{ cursor: 'help', color: 'var(--hc-primary)', marginLeft: '4px' }}
//                   //                 >
//                   //                   *
//                   //                 </span>
//                   //               </>
//                   //             ), 
//                   //             desc: "A flawless move-in experience guaranteed. Welcome home." 
//                   //           }
//                           ].map((step, i) => (
//                             <div className="process-step" key={i}>
//                               <div className="process-icon">{step.icon}</div>
//                               <div>
//                                 <h4 className="font-outfit h5 fw-bold mb-1">{i + 1}. {step.title}</h4>
//                                 <p className="text-muted font-poppins small mb-0">{step.desc}</p>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>

//                     {recentBlogs.length > 0 && (
//                       <div className="lazy-render">
//                         <div className="premium-card border-0 px-0 pt-0">
//                           <h2 className="font-outfit fw-bold h3 mb-4">Design Inspiration</h2>
//                           <div className="row g-4 font-poppins mobile-slider-wrapper">
//                             {recentBlogs.map((blog, idx) => (
//                               <div className="col-md-6" key={idx}>
//                                 <Link href={`/${blog.seo_content?.slug || `blog-detail?id=${blog.id}`}`} className="text-decoration-none">
//                                   <div className="d-flex align-items-center border p-3 rounded-4 bg-white shadow-sm h-100 transition-all hover:shadow-md">
//                                     <img src={blog.image || "/images/default.jpg"} alt={blog.title} className="rounded" style={{ width: "80px", height: "80px", objectFit: "cover" }} loading="lazy" />
//                                     <div className="ms-3">
//                                       <h6 className="text-dark fw-bold mb-1" style={{ fontSize: '14px' }}>{blog.title.length > 45 ? `${blog.title.substring(0, 45)}...` : blog.title}</h6>
//                                       <small className="text-gradient fw-bold">READ ARTICLE <FaArrowRight size={10} /></small>
//                                     </div>
//                                   </div>
//                                 </Link>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* --- 3. EXCELLENCE STATS (Celebrating Excellence) --- */}
// {/* --- EXCELLENCE STATS (Dynamic) --- */}
// <div className="lazy-render">
//   <div className="premium-card shadow-sm" style={{ background: 'linear-gradient(to right, #ffffff, #fff9f5)' }}>
//     <div className="row align-items-center mobile-slider-wrapper">
      
//       {excellenceStats ? (
//         /* Render 4 columns from CMS Data */
//         excellenceStats.map((stat, idx) => (
//           <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center" key={idx}>
//             {stat.icon}
//             <h3 className="font-outfit fw-bold h2 mb-1">{stat.value}</h3>
//             <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">{stat.label}</p>
//           </div>
//         ))
//       ) : (
//         /* Safe Fallback */
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

//                     <div className="lazy-render">
//                       <div className="premium-card bg-transparent border-0 shadow-none px-0 py-0 mb-4">
//                         <div className="text-center mb-4">
//                             <h2 className="font-outfit fw-bold h3 text-dark">What makes us the best choice for your project.</h2>
//                         </div>
//                         <div className="row g-4 mobile-slider-wrapper">
//                           <div className="col-md-6 col-lg-3">
//                             <div className="modern-card">
//                               <div className="modern-card-icon"><FaShieldAlt /></div>
//                               <h4 className="font-outfit fw-bold h6">10-Year Warranty</h4>
//                               <p className="text-muted font-poppins small mb-0">India&apos;s only full-home coverage guarantee.</p>
//                             </div>
//                           </div>
//                           <div className="col-md-6 col-lg-3">
//                             <div className="modern-card">
//                               <div className="modern-card-icon"><FaGem /></div>
//                               <h4 className="font-outfit fw-bold h6">Elite Finishes</h4>
//                               <p className="text-muted font-poppins small mb-0">Sourcing luxury materials that stand the test of time.</p>
//                             </div>
//                           </div>
//                           <div className="col-md-6 col-lg-3">
//                             <div className="modern-card">
//                               <div className="modern-card-icon"><FaClock /></div>
//                               <h4 className="font-outfit fw-bold h6">45-Day Delivery*</h4>
//                               <p className="text-muted font-poppins small mb-0">Swift, on-time installation of storage & kitchens.</p>
//                             </div>
//                           </div>
//                           <div className="col-md-6 col-lg-3">
//                             <div className="modern-card">
//                               <div className="modern-card-icon"><FaTools /></div>
//                               <h4 className="font-outfit fw-bold h6">Expert Team</h4>
//                               <p className="text-muted font-poppins small mb-0">Highly skilled professionals handling your project end-to-end.</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {contentBlocks.length > 0 && (
//                       <div className="content-blocks-section lazy-render mb-4">
//                         {contentBlocks.map((block, idx) => (
//                           <div key={idx} className="premium-card mb-4" style={{ padding: '30px' }}>
//                             {block.type === 'testimonial' && (
//                               <blockquote className="blockquote text-center mb-0">
//                                 <p className="mb-3 fs-5 font-italic">&quot;{block.data.review}&quot;</p>
//                                 <footer className="blockquote-footer mt-0 fs-6">
//                                   {block.data.client_name} <cite title="Source Title">{block.data.designation}</cite>
//                                 </footer>
//                               </blockquote>
//                             )}
//                             {block.type === 'service_row' && (
//                               <div className="row align-items-center">
//                                 <div className={block.data.reverse_layout ? 'col-md-6 order-md-2' : 'col-md-6'}>
//                                   <h3 className="font-outfit fw-bold h4 mb-3">{block.data.heading}</h3>
//                                   <p className="text-muted font-poppins" style={{ whiteSpace: 'pre-line' }}>{block.data.description}</p>
//                                 </div>
//                                 <div className={block.data.reverse_layout ? 'col-md-6 order-md-1 text-center' : 'col-md-6 text-center'}>
//                                   {block.data.image_url && (
//                                     <img 
//                                       src={block.data.image_url} 
//                                       alt={block.data.image_alt || block.data.heading || defaultAltText} 
//                                       className="img-fluid rounded-4 shadow-sm" 
//                                       style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }} 
//                                       loading="lazy" 
//                                     />
//                                   )}
//                                 </div>
//                               </div>
//                             )}
//                             {block.type === 'counter' && (
//                               <div className="text-center p-3">
//                                 <h2 className="font-outfit fw-bold display-4 mb-2 text-gradient">{block.data.number}</h2>
//                                 <p className="font-poppins fw-bold text-uppercase text-muted mb-0 tracking-wider">{block.data.label}</p>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     {accordions.length > 0 && (
//                       <div className="lazy-render mb-4">
//                         <div className="premium-card border-0 px-0">
//                           <h2 className="font-outfit fw-bold h3 mb-4">Additional Information</h2>
//                           <div className="accordion font-poppins" id={`accordion-info-${pageData.id}`}>
//                             {accordions.map((acc, index) => (
//                               <div className="accordion-item faq-premium-item" key={`acc-${index}`}>
//                                 <h2 className="accordion-header">
//                                   <button className={`accordion-button faq-premium-btn ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#acc-collapse${index}`}>
//                                     <span className="pe-3">{acc.title}</span>
//                                     <FaPlus className="faq-icon-toggle flex-shrink-0" />
//                                   </button>
//                                 </h2>
//                                 <div id={`acc-collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent={`#accordion-info-${pageData.id}`}>
//                                   <div className="accordion-body faq-premium-body" style={{ whiteSpace: 'pre-line' }}>{acc.content}</div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )}

// {faqs.length > 0 && (
//   <div className="lazy-render">
//     <div className="premium-card border-0">
//       <h2 className="font-outfit fw-bold h3 mb-4">Insights for {displayCity}</h2>
//       <div className="accordion font-poppins" id={`accordion-faq-${pageData?.id}`}>
//         {faqs.map((faq, index) => (
//           <div className="accordion-item faq-premium-item mb-4 shadow-sm" style={{ borderRadius: '16px', border: '1px solid #f1f5f9' }} key={index}>
//             <h2 className="accordion-header">
//               {/* ADDED px-4 HERE: This pushes the question text away from the left and right edges */}
//               <button className={`accordion-button faq-premium-btn py-4 px-4 ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
//                 <span className="pe-3" style={{ lineHeight: '1.6' }}>{faq.question}</span>
//                 <FaPlus className="faq-icon-toggle flex-shrink-0" />
//               </button>
//             </h2>
//             <div id={`collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent={`#accordion-faq-${pageData?.id}`}>
//               {/* ADDED px-4 HERE: This ensures the answer text aligns perfectly with the question text above it */}
//               <div className="accordion-body faq-premium-body px-4 pb-4" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
//                 {faq.answer}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// )}

//                   </div>
//                 </div>

//                 <div className="col-lg-4">
//                   <div className="dual-sticky-wrapper">
                    
//                     <div className="sidebar-cta shadow-lg mb-4">
//                       <h4 className="font-outfit fw-bold mb-2">Book a Site Visit</h4>
//                       <p className="font-poppins small text-white-50 mb-4">Expert designers will visit your {displayCity} property.</p>
//                       <Link href="/contact" className="btn btn-light w-100 fw-bold py-2 rounded-pill">Schedule Now</Link>
//                     </div>

//                     <SidebarForm city={slug} />

//                     <div className="sidebar-widget py-4 font-poppins lazy-render">
//                       <h4 className="widget-title mb-4">The Promise</h4>
//                       <div className="micro-trust-item">
//                         <FaCheckCircle className="micro-trust-icon" />
//                         <div>
//                           <span className="d-block fw-bold text-dark" style={{ fontSize: '14px' }}>Transparent Pricing</span>
//                           <span className="text-muted" style={{ fontSize: '12px' }}>No hidden costs, ever.</span>
//                         </div>
//                       </div>
//                       <div className="micro-trust-item">
//                         <FaTools className="micro-trust-icon text-warning" />
//                         <div>
//                           <span className="d-block fw-bold text-dark" style={{ fontSize: '14px' }}>In-House Execution</span>
//                           <span className="text-muted" style={{ fontSize: '12px' }}>No third-party contractors involved.</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="sidebar-widget">
//                       <h4 className="widget-title">Service Areas</h4>
//                       <div className="d-flex flex-column">
//                         {Object.keys(cityUrlMap).map((c, idx) => (
//                           <Link key={idx} href={cityUrlMap[c]} className={`nav-city-link ${c === slug ? 'active' : ''}`}>
//                             <span><FaMapMarkerAlt className="me-2" size={14} /> <span className="text-capitalize">{c.replace('_', ' ')}</span></span>
//                             <FaArrowRight size={12} />
//                           </Link>
//                         ))}
//                       </div>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </main>
//     </MainLayout>
//   );
// };

// export default DynamicRootPage;

// new dynamic file

// import MainLayout from "../layouts/MainLayout";
// import { defaultAltText } from "@/utils/helper";
// import { notFound } from "next/navigation";
// import Image from "next/image"; 
// import Link from "next/link";
// import { headers } from "next/headers"; 
// import DOMPurify from "isomorphic-dompurify";

// import { 
//   FaMapMarkerAlt, FaArrowRight, FaPhoneAlt, FaEnvelope, FaUser, 
//   FaShieldAlt, FaGem, FaClock, FaTrophy, FaStar, FaAward, 
//   FaCheckCircle, FaWallet, FaTools, FaDraftingCompass, FaHardHat, FaHome,
//   FaWhatsapp, FaPlus, FaChevronDown, FaSmile, FaUsers, FaCalendarAlt,
//   FaUserCircle, FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaPinterest, FaYoutube
// } from "react-icons/fa";

// import * as FaIcons from "react-icons/fa";

// import { SidebarForm } from "../services-detail/CityForms";

// import { 
//   generateOrganizationSchema, 
//   generateLocalBusinessSchema, 
//   generateBreadcrumbSchema, 
//   generateFAQSchema 
// } from "@/utils/schemaGenerator";
// import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";

// import { getPageSEO } from "@/utils/getSEO"; 
// import ExpandableRichText from "../components/ModernPara";
// import { getBackendImageUrl } from "@/utils/helper";

// export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";
// export const revalidate = 0;

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

// const isValidSlug = (slug) => {
//   if (!slug) return false;
//   if (slug === "undefined" || slug === "null") return false;
//   if (slug.includes(".")) return false; 
//   return true;
// };

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";

// const isDraftStatus = (data) => {
//   if (!data) return true;
//   if (data.status === undefined || data.status === null) return false; 
//   const status = String(data.status).toLowerCase().trim();
//   return status === "draft" || status === "inactive" || status === "0";
// };

// async function getRecentBlogs() {
//   try {
//     const res = await fetch(`${API_BASE_URL}/cms-blog`, { next: { revalidate: 3600 } });
//     if (!res.ok) return [];
//     const data = await res.json();
//     return Array.isArray(data) ? data.slice(0, 4) : [];
//   } catch (error) { return []; }
// }

// async function getExcellenceStats() {
//   try {
//     const timestamp = new Date().getTime();
//     const res = await fetch(`${API_BASE_URL}/cms-content/excellence_stats`, { 
//       cache: "no-store",
//       headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
//     });
//     if (!res.ok) return null;
//     const data = await res.json();
//     const record = Array.isArray(data) ? data[0] : data;
//     if (record) {
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

// async function getBlogData(slug) {
//   try {
//     const timestamp = new Date().getTime();
//     const res = await fetch(`${API_BASE_URL}/cms-blog/blog-slug/${slug}?t=${timestamp}`, {
//       cache: "no-store", 
//       headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
//     });
//     if (!res.ok) return null;
//     let data = await res.json();
//     if (!data || data.success === false) return null;
//     if (Array.isArray(data)) {
//         if (data.length === 0) return null;
//         data = data[0]; 
//     }
//     return data;
//   } catch (error) {
//     return null;
//   }
// }

// async function getCmsPageData(slug) {
//   try {
//     const timestamp = new Date().getTime();
//     const res = await fetch(`${API_BASE_URL}/cms-pages/slug/${slug}?t=${timestamp}`, {
//       cache: "no-store", 
//       headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
//     });
//     if (!res.ok) return null;
//     let data = await res.json();
//     if (!data || data.success === false) return null;
//     if (Array.isArray(data)) {
//         if (data.length === 0) return null;
//         data = data[0]; 
//     }
//     return data;
//   } catch (error) {
//     return null;
//   }
// }

// export async function generateMetadata({ params }) {
//   headers();
//   const slug = params.blog;

//   if (!isValidSlug(slug)) {
//     return { title: "Not Found", robots: { index: false, follow: true } };
//   }

//   const [blogData, cmsData, seoData] = await Promise.all([
//     getBlogData(slug).catch(() => null),
//     getCmsPageData(slug).catch(() => null),
//     getPageSEO(`/${slug}`).catch(() => null)
//   ]);

//   let data = blogData || cmsData;

//   if (!data || isDraftStatus(data)) {
//     return { title: "Not Found", robots: { index: false, follow: true } };
//   }

//   const robots = seoData?.robots || getRobotsDirectives(data?.seo_content);
//   const canonicalUrl = getCanonicalUrl({
//     canonicalUrl: seoData?.alternates?.canonical || data?.seo_content?.canonical_url,
//     fallbackPath: `/${slug}`,
//   });

//   return {
//     title: seoData?.title || data?.seo_content?.meta_title || data?.title || "HC Interior",
//     description: seoData?.description || data?.seo_content?.meta_description || "",
//     keywords: seoData?.keywords || data?.seo_content?.meta_keywords || "",
//     alternates: { canonical: canonicalUrl },
//     robots,
//     openGraph: seoData?.openGraph || null,
//     twitter: seoData?.twitter || null,
//   };
// }

// const parseJsonSafe = (data) => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   try { return JSON.parse(data); } catch (e) { return []; }
// };

// const DynamicRootPage = async ({ params }) => {
//   headers();
//   const slug = params.blog;

//   if (!isValidSlug(slug)) {
//     notFound();
//   }

//   let pageData = await getBlogData(slug);
//   let pageType = "blog";

//   if (!pageData) {
//     pageData = await getCmsPageData(slug);
//     pageType = "cms-page";
//   }

//   if (!pageData || isDraftStatus(pageData)) {
//     notFound();
//   }

//   const seoData = await getPageSEO(`/${slug}`);
//   const customSchema = seoData?.customSchema;
//   const recentBlogs = await getRecentBlogs();
//   const excellenceStats = await getExcellenceStats();

//   let faqs = [];
//   let accordions = [];
//   let contentBlocks = [];

//   if (pageType === "cms-page") {
//     faqs = parseJsonSafe(pageData.faqs);
//     accordions = parseJsonSafe(pageData.accordions);
//     contentBlocks = parseJsonSafe(pageData.content_blocks);
//   }

//   let siteSettings = null;
//   try {
//     const timestamp = new Date().getTime();
//     const setRes = await fetch(`${API_BASE_URL}/site-settings`, { 
//         cache: "no-store",
//         headers: { 'Cache-Control': 'no-cache' }
//     });
//     if (setRes.ok) {
//         const rawSettings = await setRes.json();
//         siteSettings = Array.isArray(rawSettings) ? rawSettings[0] : rawSettings;
//     }
//   } catch (e) { 
//       console.error("Settings fetch failed", e); 
//   }

//   const orgSchema = generateOrganizationSchema(siteSettings);
//   const localBizSchema = generateLocalBusinessSchema(siteSettings);
//   const breadcrumbSchema = generateBreadcrumbSchema(slug, pageData.title);
  
//   const hasInnerCustomFaqSchema =
//     typeof pageData?.seo_content?.custom_code === "string" &&
//     /FAQPage/i.test(pageData.seo_content.custom_code);
    
//   const faqSchema = faqs.length > 0 && !hasInnerCustomFaqSchema ? generateFAQSchema(faqs) : null;

//   const displayCity = slug.split(/-|_/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
//   const safeContent = pageData?.content ? DOMPurify.sanitize(pageData.content) : "";

//   let heroImageSrc = getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg');

//   const normalizedSlug = slug.toLowerCase();

//   if (pageData?.image) {
//     heroImageSrc = getBackendImageUrl(pageData.image);
//   } 
//   else if (normalizedSlug.includes('sohna')) {
//     heroImageSrc = '/images/Serving Area/Interior Designers in Sohna.jpg';
//   } 
//   else if (normalizedSlug.includes('noida-extension') || normalizedSlug.includes('noida_extension')) {
//     heroImageSrc = '/images/Serving Area/Interior Designer in Noida Extension.jpg';
//   }

//   return (
//     <MainLayout>
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizSchema) }} />
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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

//       {pageData?.seo_content?.custom_code && (
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: pageData.seo_content.custom_code.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '') }}
//         />
//       )}

//       <style dangerouslySetInnerHTML={{__html: `
//         :root { --hc-primary: #ff914d; --hc-dark: #0f172a; }
//         .font-outfit { font-family: var(--font-outfit), sans-serif; }
//         .font-poppins { font-family: var(--font-poppins), sans-serif; }
//         .text-gradient { background: linear-gradient(135deg, #ff914d 0%, #ff5722 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
//         .lazy-render { content-visibility: auto; contain-intrinsic-size: 1px 800px; }

//         /* Social Buttons */
//         .social-btn { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; background-color: #f1f5f9; color: #475569; text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
//         .social-btn:hover { transform: translateY(-4px); }
//         .social-btn.fb:hover { background-color: #1877F2; color: white; box-shadow: 0 6px 12px rgba(24, 119, 242, 0.3); }
//         .social-btn.ig:hover { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); color: white; box-shadow: 0 6px 12px rgba(214, 36, 159, 0.3); }
//         .social-btn.tw:hover { background-color: #000000; color: white; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); }
//         .social-btn.in:hover { background-color: #0A66C2; color: white; box-shadow: 0 6px 12px rgba(10, 102, 194, 0.3); }
//         .social-btn.pi:hover { background-color: #E60023; color: white; box-shadow: 0 6px 12px rgba(230, 0, 35, 0.3); }
//         .social-btn.yt:hover { background-color:hsl(0, 100.00%, 50.00%); color: white; box-shadow: 0 6px 12px rgba(255, 0, 0, 0.3); }

//         /* Modern City Layout Styles */
//         .city-hero { height: 55vh; min-height: 450px; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: #1e293b; }
//         .hero-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.95) 100%); z-index: 1; }
//         .hero-content { position: relative; z-index: 2; text-align: center; padding-top: 40px; }
//         .hero-badge { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); padding: 8px 24px; border-radius: 30px; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; display: inline-flex; align-items: center; color: #fff; font-weight: 600; }
//         .hero-main-title { font-size: clamp(2.4rem, 5vw, 3.8rem); line-height: 1.1; letter-spacing: -0.02em; }
        
//         .city-main-container { margin-top: -80px; position: relative; z-index: 10; }
//         .premium-card { background: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.04); padding: 40px; margin-bottom: 40px; border: 1px solid rgba(0,0,0,0.02); overflow: hidden; }
        
//         /* CMS CONTENT PROTECTION & STRICT IMAGE POSITIONING */
//         .rich-text-content { width: 100%; word-break: break-word; overflow-wrap: anywhere; }
        
//         .rich-text-content figure, 
//         .rich-text-content figure.image { margin: 2rem auto !important; max-width: 100% !important; height: auto !important; display: flex; justify-content: center; }
//         .rich-text-content img { max-width: 100% !important; height: auto !important; border-radius: 12px; display: block !important; margin: 0 auto !important; object-fit: contain !important; }
//         .rich-text-content iframe, .rich-text-content video, .rich-text-content table { max-width: 100% !important; overflow-x: auto; display: block !important; margin: 2rem auto !important; }

//         .rich-text-content h2, .rich-text-content h3 { font-family: var(--font-outfit), sans-serif; font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 700; color: #0f172a; margin-top: 2rem; margin-bottom: 1rem; }
//         .rich-text-content p { font-family: var(--font-poppins), sans-serif; font-size: 1rem; line-height: 1.8; color: #475569; margin-bottom: 1.2rem; }
        
//         /* Bullet point lists for correct CMS rendering */
//         .rich-text-content ul { display: flex; flex-direction: column; gap: 1rem; padding: 0; list-style: none; margin: 2rem 0; }
//         .rich-text-content li { background: #fdfdfd; border: 1px solid #f1f5f9; padding: 1.2rem 1.5rem 1.2rem 3rem; border-radius: 12px; display: block; position: relative; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: 0.3s; }
//         .rich-text-content li:hover { border-color: var(--hc-primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,145,77,0.1); }
//         .rich-text-content li::before { content: '✦'; color: var(--hc-primary); position: absolute; left: 1.2rem; top: 1.2rem; font-size: 1.2rem; font-weight: bold; line-height: 1.5; }
        
//         .rich-text-content li img { max-width: 100% !important; height: auto !important; margin: 1rem auto; border-radius: 8px; display: block; }

//         .micro-trust-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; }
//         .micro-trust-item:last-child { border-bottom: none; padding-bottom: 0; }
//         .micro-trust-icon { color: #22c55e; font-size: 18px; margin-right: 12px; }

//         /* Premium FAQs */
//         .faq-premium-item { border: none !important; margin-bottom: 16px; border-radius: 16px !important; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); background: #ffffff; border: 1px solid #f1f5f9 !important; }
//         .faq-premium-btn { width: 100%; text-align: left; background: white; border: none; padding: clamp(16px, 4vw, 24px); font-weight: 700; font-size: clamp(1.05rem, 3.5vw, 1.2rem); color: var(--hc-dark); display: flex; justify-content: space-between; align-items: center; box-shadow: none !important; line-height: 1.4; gap: 15px; }
//         .faq-premium-btn::after { display: none !important; }
//         .faq-premium-btn:not(.collapsed) { color: var(--hc-primary); background: #fffcf9; }
//         .faq-icon-toggle { transition: transform 0.3s ease; color: var(--hc-primary); flex-shrink: 0; }
//         .faq-premium-btn:not(.collapsed) .faq-icon-toggle { transform: rotate(45deg); color: #ff5722; }
//         .faq-premium-body { padding: 0 clamp(16px, 4vw, 24px) 20px; color: #475569; font-size: clamp(0.95rem, 3vw, 1.05rem); line-height: 1.7; background: #fffcf9; }
        
//         .sidebar-blog-card { padding: 12px; border-radius: 12px; transition: all 0.3s ease; border: 1px solid transparent; }
//         .sidebar-blog-card:hover { background-color: #f8fafc; border-color: #e2e8f0; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.03); }

//         .process-step { display: flex; align-items: flex-start; margin-bottom: 30px; position: relative; }
//         .process-step:last-child { margin-bottom: 0; }
//         .process-icon { width: 50px; height: 50px; min-width: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-right: 20px; z-index: 2; }
//         .process-step:not(:last-child)::after { content: ''; position: absolute; left: 24px; top: 50px; bottom: -30px; width: 2px; background: #ffe4d6; z-index: 1; }

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

//         .modern-card { background: #ffffff; padding: 30px 25px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: all 0.3s ease; height: 100%; position: relative; overflow: hidden;}
//         .modern-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border-color: #ff914d;}
//         .modern-card-icon { width: 50px; height: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 20px; transition: transform 0.3s ease;}
//         .modern-card:hover .modern-card-icon { transform: scale(1.1); background: #ff914d; color: white; }

//         @media (max-width: 768px) {
//           .premium-card { padding: 20px !important; margin-bottom: 25px; }
//           .author-date-social-block { flex-direction: column !important; align-items: flex-start !important; gap: 15px; }
//           .social-links { width: 100%; justify-content: flex-start; flex-wrap: wrap; gap: 8px; }
//           .hero-main-title { font-size: 2.2rem !important; }
          
//           .mobile-slider-wrapper { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; scroll-snap-type: x mandatory; gap: 15px; padding: 10px 0 30px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
//           .mobile-slider-wrapper::-webkit-scrollbar { display: none; }
//           .mobile-slider-wrapper > div { flex: 0 0 88% !important; scroll-snap-align: center; }
//           .rich-text-content ul { display: flex; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 1rem; }
//           .rich-text-content li { flex: 0 0 85%; }
//         }
//       `}} />

//       <main className="bg-light pb-5">
        
//         {pageType === "blog" && (
//           <div className="container py-4 py-lg-5 mt-lg-4">
//             <div className="row g-4 g-lg-5">

//               <div className="col-lg-8 order-1">
//                 <div className="premium-card bg-white">

//                   <h1 className="font-outfit fw-bold text-dark mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', lineHeight: '1.3' }}>
//                     {pageData.title}
//                   </h1>

//                   <div className="author-date-social-block d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4">
//                     <div className="text-muted fst-italic fs-6 mb-3 mb-md-0 d-flex align-items-center font-poppins flex-wrap gap-2">
//                       <span><FaUserCircle className="me-2 text-secondary" size={20} />
//                       {pageData.writer_name ? `By ${pageData.writer_name}` : "By HC Team"}</span>
//                       <span className="mx-2 d-none d-md-inline">•</span>
//                       <span><FaCalendarAlt className="me-2 text-secondary" size={18} />
//                       {new Date(pageData.created_at || Date.now()).toLocaleDateString('en-US', {
//                         year: 'numeric', month: 'long', day: 'numeric'
//                       })}</span>
//                     </div>

//                     <div className="social-links d-flex gap-2">
//                         {siteSettings?.facebook_url && <a href={siteSettings.facebook_url} target="_blank" rel="noopener noreferrer" className="social-btn fb" aria-label="Facebook"><FaFacebookF size={18} /></a>}
//                         {siteSettings?.instagram_url && <a href={siteSettings.instagram_url} target="_blank" rel="noopener noreferrer" className="social-btn ig" aria-label="Instagram"><FaInstagram size={18} /></a>}
//                         {siteSettings?.twitter_url && <a href={siteSettings.twitter_url} target="_blank" rel="noopener noreferrer" className="social-btn tw" aria-label="X (Twitter)"><FaTwitter size={18} /></a>}
//                         {siteSettings?.linkedin_url && <a href={siteSettings.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-btn in" aria-label="LinkedIn"><FaLinkedin size={18} /></a>}
//                         {siteSettings?.pinterest_url && <a href={siteSettings.pinterest_url} target="_blank" rel="noopener noreferrer" className="social-btn pi" aria-label="Pinterest"><FaPinterest size={18} /></a>}
//                         {siteSettings?.youtube_url && <a href={siteSettings.youtube_url} target="_blank" rel="noopener noreferrer" className="social-btn yt" aria-label="YouTube"><FaYoutube size={18} /></a>}
//                     </div>
//                   </div>

//                   {pageData.image && (
//                     <div className="w-100 mb-4 mb-lg-5 d-flex justify-content-center">
//                       <Image
//                         src={pageData.image}
//                         alt={pageData.image_alt || pageData.title || defaultAltText}
//                         width={1200}
//                         height={675}
//                         priority={true}
//                         style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover', borderRadius: '1rem', display: 'block', margin: '0 auto' }}
//                         className="shadow-sm"
//                       />
//                     </div>
//                   )}

//                  <div className="details font-poppins rich-text-content ck-content">
//                     <div dangerouslySetInnerHTML={{ __html: pageData.description }} />
//                   </div>
//                 </div>
//               </div>

//               <div className="col-lg-4 order-2">
//                 <div className="dual-sticky-wrapper">

//                   <SidebarForm city={slug} />

//                   {recentBlogs && recentBlogs.length > 0 && (
//                     <div className="sidebar-widget mt-4 lazy-render">
//                       <h4 className="widget-title">Related Articles</h4>
//                       <div className="d-flex flex-column gap-2">
//                         {recentBlogs.map((blog, idx) => (
//                           <Link key={idx} href={`/${blog.seo_content?.slug || `blog-detail?id=${blog.id}`}`} className="text-decoration-none">
//                             <div className="sidebar-blog-card d-flex align-items-center gap-3">
//                               <img 
//                                 src={blog.image || "/images/default.jpg"} 
//                                 alt={blog.title} 
//                                 className="rounded object-fit-cover shadow-sm flex-shrink-0" 
//                                 style={{ width: "70px", height: "70px" }} 
//                               />
//                               <div>
//                                 <h6 className="text-dark fw-bold mb-1" style={{ fontSize: '14px', lineHeight: '1.4' }}>
//                                   {blog.title.length > 45 ? `${blog.title.substring(0, 45)}...` : blog.title}
//                                 </h6>
//                                 <small className="text-gradient fw-bold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
//                                   READ ARTICLE <FaArrowRight size={10} />
//                                 </small>
//                               </div>
//                             </div>
//                           </Link>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   <div className="sidebar-widget mt-4">
//                     <h4 className="widget-title">Service Areas</h4>
//                     <div className="d-flex flex-column">
//                       {Object.keys(cityUrlMap).map((c, idx) => (
//                         <Link key={idx} href={cityUrlMap[c]} className="nav-city-link">
//                           <span><FaMapMarkerAlt className="me-2" size={14} /> <span className="text-capitalize">{c.replace('_', ' ')}</span></span>
//                           <FaArrowRight size={12} />
//                         </Link>
//                       ))}
//                     </div>
//                   </div>

//                 </div>
//               </div>

//             </div>
//           </div>
//         )}

//         {pageType === "cms-page" && (
//           <>
//             <div className="city-hero w-100">
//               <Image 
//                 src={heroImageSrc}
//                 alt={`${displayCity} Interior Design`}
//                 fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
//               />
              
//               <div className="container hero-content font-poppins">
//                 <div className="hero-badge" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
//                   <FaMapMarkerAlt className="me-2" /> High Creation Interior {displayCity}
//                 </div>
                
//                 <h1 
//                   className="hero-main-title fw-bold mb-3 font-outfit text-white" 
//                   style={{ textShadow: '2px 4px 15px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)' }}
//                 >
//                   {pageData?.heading || `${displayCity}`}
//                 </h1>
//               </div>
//             </div>

//             <div className="container city-main-container">
//               <div className="row g-5">
//                 <div className="col-lg-8">
//                   <div className="dual-sticky-wrapper">
                    
//                     <div className="premium-card mb-4">
//                       <h2 className="font-outfit fw-bold h3 mb-4 text-dark">
//                          {displayCity}
//                       </h2>
//                       <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeContent }} />
//                     </div>

//                     <div className="lazy-render">
//                       <div className="premium-card bg-white border-0">
//                         <h2 className="font-outfit fw-bold h3 mb-4 text-dark">Our Proven Design Process</h2>
//                         <div className="mobile-slider-wrapper">
//                           {[
//                             { icon: <FaUser />, title: "Consultation & Ideation", desc: `We meet at your ${displayCity} property to understand your vision.` },
//                             { icon: <FaDraftingCompass />, title: "3D Concept & Planning", desc: "Walking through your home with detailed 3D renders before we build." },
//                             { icon: <FaHardHat />, title: "Precision Execution", desc: "Expert execution with 150+ quality checks and zero compromises." },
//                             { icon: <FaHome />, title: "The Grand Handover", desc: "A flawless move-in within 45 Days Delivery*. Welcome home." }
//                           ].map((step, i) => (
//                             <div className="process-step" key={i}>
//                               <div className="process-icon">{step.icon}</div>
//                               <div>
//                                 <h4 className="font-outfit h5 fw-bold mb-1">{i + 1}. {step.title}</h4>
//                                 <p className="text-muted font-poppins small mb-0">{step.desc}</p>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>

//                     {recentBlogs.length > 0 && (
//                       <div className="lazy-render">
//                         <div className="premium-card border-0 px-0 pt-0">
//                           <h2 className="font-outfit fw-bold h3 mb-4">Design Inspiration</h2>
//                           <div className="row g-4 font-poppins mobile-slider-wrapper">
//                             {recentBlogs.map((blog, idx) => (
//                               <div className="col-md-6" key={idx}>
//                                 <Link href={`/${blog.seo_content?.slug || `blog-detail?id=${blog.id}`}`} className="text-decoration-none">
//                                   <div className="d-flex align-items-center border p-3 rounded-4 bg-white shadow-sm h-100 transition-all hover:shadow-md">
//                                     <img src={blog.image || "/images/default.jpg"} alt={blog.title} className="rounded" style={{ width: "80px", height: "80px", objectFit: "cover" }} loading="lazy" />
//                                     <div className="ms-3">
//                                       <h6 className="text-dark fw-bold mb-1" style={{ fontSize: '14px' }}>{blog.title.length > 45 ? `${blog.title.substring(0, 45)}...` : blog.title}</h6>
//                                       <small className="text-gradient fw-bold">READ ARTICLE <FaArrowRight size={10} /></small>
//                                     </div>
//                                   </div>
//                                 </Link>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* --- EXCELLENCE STATS (Dynamic CMS Icons) --- */}
//                     <div className="lazy-render">
//                       <div className="premium-card shadow-sm" style={{ background: 'linear-gradient(to right, #ffffff, #fff9f5)' }}>
//                         <div className="row align-items-center justify-content-center mobile-slider-wrapper">
                          
//                           {excellenceStats && excellenceStats.length > 0 ? (
//                             excellenceStats.map((stat, idx) => {
//                               const IconComponent = stat.iconName && FaIcons[stat.iconName] ? FaIcons[stat.iconName] : FaIcons.FaStar;
//                               const colWidth = excellenceStats.length <= 3 ? 4 : Math.max(3, Math.floor(12 / excellenceStats.length));

//                               return (
//                                 <div className={`col-md-${colWidth} excellence-stat d-flex flex-column align-items-center justify-content-center text-center`} key={idx}>
//                                   {stat.iconType === "image" && stat.image ? (
//                                     <img 
//                                       src={getBackendImageUrl(stat.image)} 
//                                       alt={stat.label || "Stat Icon"} 
//                                       style={{ width: `${stat.size || 40}px`, height: `${stat.size || 40}px`, objectFit: "contain" }} 
//                                       className="mb-3"
//                                     />
//                                   ) : (
//                                     <IconComponent 
//                                       size={stat.size || 40} 
//                                       color={stat.color || "#f5a623"} 
//                                       className="mb-3" 
//                                     />
//                                   )}
//                                   <h3 className="font-outfit fw-bold h2 mb-1">{stat.value}</h3>
//                                   <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">{stat.label}</p>
//                                 </div>
//                               );
//                             })
//                           ) : (
//                             /* Fallback Default Stats */
//                             <>
//                               <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
//                                 <FaHome size={40} color="#ff914d" className="mb-3" />
//                                 <h3 className="font-outfit fw-bold h2 mb-1">2680+</h3>
//                                 <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">HOME RENOVATIONS</p>
//                               </div>
//                               <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
//                                 <FaSmile size={40} color="#ff914d" className="mb-3" />
//                                 <h3 className="font-outfit fw-bold h2 mb-1">2660+</h3>
//                                 <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">HAPPY CUSTOMERS</p>
//                               </div>
//                               <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
//                                 <FaStar size={40} color="#ff914d" className="mb-3" />
//                                 <h3 className="font-outfit fw-bold h2 mb-1">4.8/5</h3>
//                                 <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">CLIENT RATINGS</p>
//                               </div>
//                             </>
//                           )}

//                         </div>
//                       </div>
//                     </div>

//                     <div className="lazy-render">
//                       <div className="premium-card bg-transparent border-0 shadow-none px-0 py-0 mb-4">
//                         <div className="text-center mb-4">
//                             <h2 className="font-outfit fw-bold h3 text-dark">What makes us the best choice for your project.</h2>
//                         </div>
//                         <div className="row g-4 mobile-slider-wrapper">
//                           <div className="col-md-6 col-lg-3">
//                             <div className="modern-card">
//                               <div className="modern-card-icon"><FaShieldAlt /></div>
//                               <h4 className="font-outfit fw-bold h6">10-Year Warranty</h4>
//                               <p className="text-muted font-poppins small mb-0">India&apos;s only full-home coverage guarantee.</p>
//                             </div>
//                           </div>
//                           <div className="col-md-6 col-lg-3">
//                             <div className="modern-card">
//                               <div className="modern-card-icon"><FaGem /></div>
//                               <h4 className="font-outfit fw-bold h6">Elite Finishes</h4>
//                               <p className="text-muted font-poppins small mb-0">Sourcing luxury materials that stand the test of time.</p>
//                             </div>
//                           </div>
//                           <div className="col-md-6 col-lg-3">
//                             <div className="modern-card">
//                               <div className="modern-card-icon"><FaClock /></div>
//                               <h4 className="font-outfit fw-bold h6">45-Day Delivery*</h4>
//                               <p className="text-muted font-poppins small mb-0">Swift, on-time installation of storage & kitchens.</p>
//                             </div>
//                           </div>
//                           <div className="col-md-6 col-lg-3">
//                             <div className="modern-card">
//                               <div className="modern-card-icon"><FaTools /></div>
//                               <h4 className="font-outfit fw-bold h6">Expert Team</h4>
//                               <p className="text-muted font-poppins small mb-0">Highly skilled professionals handling your project end-to-end.</p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {contentBlocks.length > 0 && (
//                       <div className="content-blocks-section lazy-render mb-4">
//                         {contentBlocks.map((block, idx) => (
//                           <div key={idx} className="premium-card mb-4" style={{ padding: '30px' }}>
//                             {block.type === 'testimonial' && (
//                               <blockquote className="blockquote text-center mb-0">
//                                 <p className="mb-3 fs-5 font-italic">&quot;{block.data.review}&quot;</p>
//                                 <footer className="blockquote-footer mt-0 fs-6">
//                                   {block.data.client_name} <cite title="Source Title">{block.data.designation}</cite>
//                                 </footer>
//                               </blockquote>
//                             )}
//                             {block.type === 'service_row' && (
//                               <div className="row align-items-center">
//                                 <div className={block.data.reverse_layout ? 'col-md-6 order-md-2' : 'col-md-6'}>
//                                   <h3 className="font-outfit fw-bold h4 mb-3">{block.data.heading}</h3>
//                                   <p className="text-muted font-poppins" style={{ whiteSpace: 'pre-line' }}>{block.data.description}</p>
//                                 </div>
//                                 <div className={block.data.reverse_layout ? 'col-md-6 order-md-1 text-center' : 'col-md-6 text-center'}>
//                                   {block.data.image_url && (
//                                     <img 
//                                       src={block.data.image_url} 
//                                       alt={block.data.image_alt || block.data.heading || defaultAltText} 
//                                       className="img-fluid rounded-4 shadow-sm" 
//                                       style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }} 
//                                       loading="lazy" 
//                                     />
//                                   )}
//                                 </div>
//                               </div>
//                             )}
//                             {block.type === 'counter' && (
//                               <div className="text-center p-3">
//                                 <h2 className="font-outfit fw-bold display-4 mb-2 text-gradient">{block.data.number}</h2>
//                                 <p className="font-poppins fw-bold text-uppercase text-muted mb-0 tracking-wider">{block.data.label}</p>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     )}

//                     {accordions.length > 0 && (
//                       <div className="lazy-render mb-4">
//                         <div className="premium-card border-0 px-0">
//                           <h2 className="font-outfit fw-bold h3 mb-4">Additional Information</h2>
//                           <div className="accordion font-poppins" id={`accordion-info-${pageData.id}`}>
//                             {accordions.map((acc, index) => (
//                               <div className="accordion-item faq-premium-item" key={`acc-${index}`}>
//                                 <h2 className="accordion-header">
//                                   <button className={`accordion-button faq-premium-btn ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#acc-collapse${index}`}>
//                                     <span className="pe-3">{acc.title}</span>
//                                     <FaPlus className="faq-icon-toggle flex-shrink-0" />
//                                   </button>
//                                 </h2>
//                                 <div id={`acc-collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent={`#accordion-info-${pageData.id}`}>
//                                   <div className="accordion-body faq-premium-body" style={{ whiteSpace: 'pre-line' }}>{acc.content}</div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {faqs.length > 0 && (
//                       <div className="lazy-render">
//                         <div className="premium-card border-0">
//                           <h2 className="font-outfit fw-bold h3 mb-4">Insights for {displayCity}</h2>
//                           <div className="accordion font-poppins" id={`accordion-faq-${pageData?.id}`}>
//                             {faqs.map((faq, index) => (
//                               <div className="accordion-item faq-premium-item mb-4 shadow-sm" style={{ borderRadius: '16px', border: '1px solid #f1f5f9' }} key={index}>
//                                 <h2 className="accordion-header">
//                                   <button className={`accordion-button faq-premium-btn py-4 px-4 ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
//                                     <span className="pe-3" style={{ lineHeight: '1.6' }}>{faq.question}</span>
//                                     <FaPlus className="faq-icon-toggle flex-shrink-0" />
//                                   </button>
//                                 </h2>
//                                 <div id={`collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent={`#accordion-faq-${pageData?.id}`}>
//                                   <div className="accordion-body faq-premium-body px-4 pb-4" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
//                                     {faq.answer}
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                   </div>
//                 </div>

//                 <div className="col-lg-4">
//                   <div className="dual-sticky-wrapper">
                    
//                     <div className="sidebar-cta shadow-lg mb-4">
//                       <h4 className="font-outfit fw-bold mb-2">Book a Site Visit</h4>
//                       <p className="font-poppins small text-white-50 mb-4">Expert designers will visit your {displayCity} property.</p>
//                       <Link href="/contact" className="btn btn-light w-100 fw-bold py-2 rounded-pill">Schedule Now</Link>
//                     </div>

//                     <SidebarForm city={slug} />

//                     <div className="sidebar-widget py-4 font-poppins lazy-render">
//                       <h4 className="widget-title mb-4">The Promise</h4>
//                       <div className="micro-trust-item">
//                         <FaCheckCircle className="micro-trust-icon" />
//                         <div>
//                           <span className="d-block fw-bold text-dark" style={{ fontSize: '14px' }}>Transparent Pricing</span>
//                           <span className="text-muted" style={{ fontSize: '12px' }}>No hidden costs, ever.</span>
//                         </div>
//                       </div>
//                       <div className="micro-trust-item">
//                         <FaTools className="micro-trust-icon text-warning" />
//                         <div>
//                           <span className="d-block fw-bold text-dark" style={{ fontSize: '14px' }}>In-House Execution</span>
//                           <span className="text-muted" style={{ fontSize: '12px' }}>No third-party contractors involved.</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="sidebar-widget">
//                       <h4 className="widget-title">Service Areas</h4>
//                       <div className="d-flex flex-column">
//                         {Object.keys(cityUrlMap).map((c, idx) => (
//                           <Link key={idx} href={cityUrlMap[c]} className={`nav-city-link ${c === slug ? 'active' : ''}`}>
//                             <span><FaMapMarkerAlt className="me-2" size={14} /> <span className="text-capitalize">{c.replace('_', ' ')}</span></span>
//                             <FaArrowRight size={12} />
//                           </Link>
//                         ))}
//                       </div>
//                     </div>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </main>
//     </MainLayout>
//   );
// };

// export default DynamicRootPage;

import MainLayout from "../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";
import { notFound } from "next/navigation";
import Image from "next/image"; 
import Link from "next/link";
import { headers } from "next/headers"; 
import DOMPurify from "isomorphic-dompurify";

import { 
  FaMapMarkerAlt, FaArrowRight, FaPhoneAlt, FaEnvelope, FaUser, 
  FaShieldAlt, FaGem, FaClock, FaTrophy, FaStar, FaAward, 
  FaCheckCircle, FaWallet, FaTools, FaDraftingCompass, FaHardHat, FaHome,
  FaWhatsapp, FaPlus, FaChevronDown, FaSmile, FaUsers, FaCalendarAlt,
  FaUserCircle, FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaPinterest, FaYoutube
} from "react-icons/fa";

import * as FaIcons from "react-icons/fa";

import { SidebarForm } from "../services-detail/CityForms";

import { 
  generateOrganizationSchema, 
  generateLocalBusinessSchema, 
  generateBreadcrumbSchema, 
  generateFAQSchema 
} from "@/utils/schemaGenerator";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";

import { getPageSEO } from "@/utils/getSEO"; 
import ExpandableRichText from "../components/ModernPara";
import { getBackendImageUrl } from "@/utils/helper";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

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

const isValidSlug = (slug) => {
  if (!slug) return false;
  if (slug === "undefined" || slug === "null") return false;
  if (slug.includes(".")) return false; 
  return true;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";

const isDraftStatus = (data) => {
  if (!data) return true;
  if (data.status === undefined || data.status === null) return false; 
  const status = String(data.status).toLowerCase().trim();
  return status === "draft" || status === "inactive" || status === "0";
};

async function getRecentBlogs() {
  try {
    const res = await fetch(`${API_BASE_URL}/cms-blog`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 4) : [];
  } catch (error) { return []; }
}

async function getExcellenceStats() {
  try {
    // Cache-busting parameter
    const timestamp = new Date().getTime();
    const res = await fetch(`${API_BASE_URL}/cms-content/excellence_stats`, { 
      cache: "no-store",
      headers: { 
        'Cache-Control': 'no-cache, no-store, must-revalidate', 
        'Pragma': 'no-cache' 
      }
    });

    if (!res.ok) return null;
    
    const data = await res.json();
    const record = Array.isArray(data) ? data[0] : data;
    
    if (record && record.json_content) {
      // Safely handle if the API returns a stringified JSON or a direct object
      const jsonContent = typeof record.json_content === "string" 
        ? JSON.parse(record.json_content) 
        : record.json_content;
        
      return jsonContent?.items || null;
    }
    return null;
  } catch (error) { 
    console.error("Failed to fetch excellence stats:", error);
    return null; 
  }
}

async function getBlogData(slug) {
  try {
    const timestamp = new Date().getTime();
    const res = await fetch(`${API_BASE_URL}/cms-blog/blog-slug/${slug}?t=${timestamp}`, {
      cache: "no-store", 
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
    });
    if (!res.ok) return null;
    let data = await res.json();
    if (!data || data.success === false) return null;
    if (Array.isArray(data)) {
        if (data.length === 0) return null;
        data = data[0]; 
    }
    return data;
  } catch (error) {
    return null;
  }
}

async function getCmsPageData(slug) {
  try {
    const timestamp = new Date().getTime();
    const res = await fetch(`${API_BASE_URL}/cms-pages/slug/${slug}?t=${timestamp}`, {
      cache: "no-store", 
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
    });
    if (!res.ok) return null;
    let data = await res.json();
    if (!data || data.success === false) return null;
    if (Array.isArray(data)) {
        if (data.length === 0) return null;
        data = data[0]; 
    }
    return data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  headers();
  const slug = params.blog;

  if (!isValidSlug(slug)) {
    return { title: "Not Found", robots: { index: false, follow: true } };
  }

  const [blogData, cmsData, seoData] = await Promise.all([
    getBlogData(slug).catch(() => null),
    getCmsPageData(slug).catch(() => null),
    getPageSEO(`/${slug}`).catch(() => null)
  ]);

  let data = blogData || cmsData;

  if (!data || isDraftStatus(data)) {
    return { title: "Not Found", robots: { index: false, follow: true } };
  }

  const robots = seoData?.robots || getRobotsDirectives(data?.seo_content);
  const canonicalUrl = getCanonicalUrl({
    canonicalUrl: seoData?.alternates?.canonical || data?.seo_content?.canonical_url,
    fallbackPath: `/${slug}`,
  });

  return {
    title: seoData?.title || data?.seo_content?.meta_title || data?.title || "HC Interior",
    description: seoData?.description || data?.seo_content?.meta_description || "",
    keywords: seoData?.keywords || data?.seo_content?.meta_keywords || "",
    alternates: { canonical: canonicalUrl },
    robots,
    openGraph: seoData?.openGraph || null,
    twitter: seoData?.twitter || null,
  };
}

const parseJsonSafe = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  try { return JSON.parse(data); } catch (e) { return []; }
};

const DynamicRootPage = async ({ params }) => {
  headers();
  const slug = params.blog;

  if (!isValidSlug(slug)) {
    notFound();
  }

  let pageData = await getBlogData(slug);
  let pageType = "blog";

  if (!pageData) {
    pageData = await getCmsPageData(slug);
    pageType = "cms-page";
  }

  if (!pageData || isDraftStatus(pageData)) {
    notFound();
  }

  const seoData = await getPageSEO(`/${slug}`);
  const customSchema = seoData?.customSchema;
  const recentBlogs = await getRecentBlogs();
  const excellenceStats = await getExcellenceStats();

  let faqs = [];
  let accordions = [];
  let contentBlocks = [];

  if (pageType === "cms-page") {
    faqs = parseJsonSafe(pageData.faqs);
    accordions = parseJsonSafe(pageData.accordions);
    contentBlocks = parseJsonSafe(pageData.content_blocks);
  }

  let siteSettings = null;
  try {
    const timestamp = new Date().getTime();
    const setRes = await fetch(`${API_BASE_URL}/site-settings`, { 
        cache: "no-store",
        headers: { 'Cache-Control': 'no-cache' }
    });
    if (setRes.ok) {
        const rawSettings = await setRes.json();
        siteSettings = Array.isArray(rawSettings) ? rawSettings[0] : rawSettings;
    }
  } catch (e) { 
      console.error("Settings fetch failed", e); 
  }

  const orgSchema = generateOrganizationSchema(siteSettings);
  const localBizSchema = generateLocalBusinessSchema(siteSettings);
  const breadcrumbSchema = generateBreadcrumbSchema(slug, pageData.title);
  
  const hasInnerCustomFaqSchema =
    typeof pageData?.seo_content?.custom_code === "string" &&
    /FAQPage/i.test(pageData.seo_content.custom_code);
    
  const faqSchema = faqs.length > 0 && !hasInnerCustomFaqSchema ? generateFAQSchema(faqs) : null;

  const displayCity = slug.split(/-|_/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const safeContent = pageData?.content ? DOMPurify.sanitize(pageData.content) : "";

  let heroImageSrc = getBackendImageUrl('/parent-child/wework_bgImage.94f57400.jpg');

  const normalizedSlug = slug.toLowerCase();

  // if (pageData?.image) {
  //   heroImageSrc = getBackendImageUrl(pageData.image);
  // } 
  if (pageData?.banner_image) {
    heroImageSrc = getBackendImageUrl(pageData.banner_image);
}
  else if (normalizedSlug.includes('sohna')) {
    heroImageSrc = '/images/Serving Area/Interior Designers in Sohna.jpg';
  } 
  else if (normalizedSlug.includes('noida-extension') || normalizedSlug.includes('noida_extension')) {
    heroImageSrc = '/images/Serving Area/Interior Designer in Noida Extension.jpg';
  }

  return (
    <MainLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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

      {pageData?.seo_content?.custom_code && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: pageData.seo_content.custom_code.replace(/<script[^>]*>/gi, '').replace(/<\/script>/gi, '') }}
        />
      )}

      <style dangerouslySetInnerHTML={{__html: `
        :root { --hc-primary: #ff914d; --hc-dark: #0f172a; }
        .font-outfit { font-family: var(--font-outfit), sans-serif; }
        .font-poppins { font-family: var(--font-poppins), sans-serif; }
        .text-gradient { background: linear-gradient(135deg, #ff914d 0%, #ff5722 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .lazy-render { content-visibility: auto; contain-intrinsic-size: 1px 800px; }

        /* Social Buttons */
        .social-btn { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; background-color: #f1f5f9; color: #475569; text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .social-btn:hover { transform: translateY(-4px); }
        .social-btn.fb:hover { background-color: #1877F2; color: white; box-shadow: 0 6px 12px rgba(24, 119, 242, 0.3); }
        .social-btn.ig:hover { background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%); color: white; box-shadow: 0 6px 12px rgba(214, 36, 159, 0.3); }
        .social-btn.tw:hover { background-color: #000000; color: white; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); }
        .social-btn.in:hover { background-color: #0A66C2; color: white; box-shadow: 0 6px 12px rgba(10, 102, 194, 0.3); }
        .social-btn.pi:hover { background-color: #E60023; color: white; box-shadow: 0 6px 12px rgba(230, 0, 35, 0.3); }
        .social-btn.yt:hover { background-color:hsl(0, 100.00%, 50.00%); color: white; box-shadow: 0 6px 12px rgba(255, 0, 0, 0.3); }

        /* Modern City Layout Styles */
        .city-hero { height: 55vh; min-height: 450px; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; background-color: #1e293b; }
        .hero-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.95) 100%); z-index: 1; }
        .hero-content { position: relative; z-index: 2; text-align: center; padding-top: 40px; }
        .hero-badge { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); padding: 8px 24px; border-radius: 30px; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; display: inline-flex; align-items: center; color: #fff; font-weight: 600; }
        .hero-main-title { font-size: clamp(2.4rem, 5vw, 3.8rem); line-height: 1.1; letter-spacing: -0.02em; }
        
        .city-main-container { margin-top: -80px; position: relative; z-index: 10; }
        .premium-card { background: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.04); padding: 40px; margin-bottom: 40px; border: 1px solid rgba(0,0,0,0.02); overflow: hidden; }
        
        /* CMS CONTENT PROTECTION & STRICT IMAGE POSITIONING */
        .rich-text-content { width: 100%; word-break: break-word; overflow-wrap: anywhere; }
        
        .rich-text-content figure, 
        .rich-text-content figure.image { margin: 2rem auto !important; max-width: 100% !important; height: auto !important; display: flex; justify-content: center; }
        .rich-text-content img { max-width: 100% !important; height: auto !important; border-radius: 12px; display: block !important; margin: 0 auto !important; object-fit: contain !important; }
        .rich-text-content iframe, .rich-text-content video, .rich-text-content table { max-width: 100% !important; overflow-x: auto; display: block !important; margin: 2rem auto !important; }

        .rich-text-content h2, .rich-text-content h3 { font-family: var(--font-outfit), sans-serif; font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 700; color: #0f172a; margin-top: 2rem; margin-bottom: 1rem; }
        .rich-text-content p { font-family: var(--font-poppins), sans-serif; font-size: 1rem; line-height: 1.8; color: #475569; margin-bottom: 1.2rem; }
        
        /* Bullet point lists for correct CMS rendering */
        .rich-text-content ul, .rich-text-content ol { display: flex; flex-direction: column; gap: 1rem; padding: 0; list-style: none; margin: 2rem 0; counter-reset: rtc-counter; }
        .rich-text-content ul li, .rich-text-content ol li { background: #fdfdfd; border: 1px solid #f1f5f9; padding: 1.2rem 1.5rem 1.2rem 3rem; border-radius: 12px; display: block; position: relative; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: 0.3s; }
        .rich-text-content ul li:hover, .rich-text-content ol li:hover { border-color: var(--hc-primary); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,145,77,0.1); }
        .rich-text-content ul li::before { content: '✦'; color: var(--hc-primary); position: absolute; left: 1.2rem; top: 1.2rem; font-size: 1.2rem; font-weight: bold; line-height: 1.5; }
        .rich-text-content ol li { counter-increment: rtc-counter; }
        .rich-text-content ol li::before { content: counter(rtc-counter) '.'; color: var(--hc-primary); position: absolute; left: 1.2rem; top: 1.2rem; font-size: 1.1rem; font-weight: 700; line-height: 1.5; }
        
        .rich-text-content li img { max-width: 100% !important; height: auto !important; margin: 1rem auto; border-radius: 8px; display: block; }

        .micro-trust-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; }
        .micro-trust-item:last-child { border-bottom: none; padding-bottom: 0; }
        .micro-trust-icon { color: #22c55e; font-size: 18px; margin-right: 12px; }

        /* Premium FAQs */
        .faq-premium-item { border: none !important; margin-bottom: 16px; border-radius: 16px !important; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); background: #ffffff; border: 1px solid #f1f5f9 !important; }
        .faq-premium-btn { width: 100%; text-align: left; background: white; border: none; padding: clamp(16px, 4vw, 24px); font-weight: 700; font-size: clamp(1.05rem, 3.5vw, 1.2rem); color: var(--hc-dark); display: flex; justify-content: space-between; align-items: center; box-shadow: none !important; line-height: 1.4; gap: 15px; }
        .faq-premium-btn::after { display: none !important; }
        .faq-premium-btn:not(.collapsed) { color: var(--hc-primary); background: #fffcf9; }
        .faq-icon-toggle { transition: transform 0.3s ease; color: var(--hc-primary); flex-shrink: 0; }
        .faq-premium-btn:not(.collapsed) .faq-icon-toggle { transform: rotate(45deg); color: #ff5722; }
        .faq-premium-body { padding: 0 clamp(16px, 4vw, 24px) 20px; color: #475569; font-size: clamp(0.95rem, 3vw, 1.05rem); line-height: 1.7; background: #fffcf9; }
        
        .sidebar-blog-card { padding: 12px; border-radius: 12px; transition: all 0.3s ease; border: 1px solid transparent; }
        .sidebar-blog-card:hover { background-color: #f8fafc; border-color: #e2e8f0; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.03); }

        .process-step { display: flex; align-items: flex-start; margin-bottom: 30px; position: relative; }
        .process-step:last-child { margin-bottom: 0; }
        .process-icon { width: 50px; height: 50px; min-width: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-right: 20px; z-index: 2; }
        .process-step:not(:last-child)::after { content: ''; position: absolute; left: 24px; top: 50px; bottom: -30px; width: 2px; background: #ffe4d6; z-index: 1; }

        .excellence-stat { text-align: center; padding: 20px; position: relative; }
        @media (min-width: 768px) { .excellence-stat::after { content: ""; position: absolute; right: 0; top: 20%; height: 60%; width: 1px; background: #e2e8f0; } .excellence-stat:last-child::after { display: none; } }

        .dual-sticky-wrapper { position: sticky; top: 100px; height: max-content; }
        .sidebar-widget { background: #ffffff; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.05); padding: 30px; margin-bottom: 30px; border: 1px solid rgba(0,0,0,0.03); }
        .widget-title { font-family: var(--font-outfit), sans-serif; font-weight: 700; font-size: 20px; margin-bottom: 25px; position: relative; padding-bottom: 10px; }
        .widget-title::after { content: ""; position: absolute; left: 0; bottom: 0; width: 40px; height: 3px; background: #ff914d; border-radius: 2px; }

        .sidebar-cta { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 20px; padding: 30px 20px; text-align: center; color: white; margin-bottom: 30px; position: relative; overflow: hidden; }
        .nav-city-link { display: flex; align-items: center; justify-content: space-between; padding: 12px 15px; border-radius: 10px; color: #475569; text-decoration: none; font-weight: 500; font-family: var(--font-poppins), sans-serif; transition: all 0.2s ease; background: #f8fafc; margin-bottom: 10px; }
        .nav-city-link:hover, .nav-city-link.active { background: #ff914d; color: white; transform: translateX(5px); }
        .nav-city-link.active { pointer-events: none; }
        .sidebar-cta h4 { color: #ffffff !important; }

        .modern-card { background: #ffffff; padding: 30px 25px; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: all 0.3s ease; height: 100%; position: relative; overflow: hidden; text-align: center;}
        .modern-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08); border-color: #ff914d;}
        .modern-card-icon { width: 50px; height: 50px; background: #fff4ed; color: #ff914d; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin: 0 auto 20px; transition: transform 0.3s ease;}
        .modern-card:hover .modern-card-icon { transform: scale(1.1); background: #ff914d; color: white; }

        @media (max-width: 768px) {
        main.bg-light {
    overflow-x: hidden;
  }
          .premium-card { padding: 20px !important; margin-bottom: 25px; }
          .author-date-social-block { flex-direction: column !important; align-items: flex-start !important; gap: 15px; }
          .social-links { width: 100%; justify-content: flex-start; flex-wrap: wrap; gap: 8px; }
          .hero-main-title { font-size: 2.2rem !important; }
          
          .mobile-slider-wrapper { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; scroll-snap-type: x mandatory; gap: 15px; padding: 10px 0 30px; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
          .mobile-slider-wrapper::-webkit-scrollbar { display: none; }
          .mobile-slider-wrapper > div { flex: 0 0 88% !important; scroll-snap-align: center; }
          .rich-text-content ul { display: flex; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 1rem; }
          .rich-text-content li { flex: 0 0 85%; }

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
          
      `}} />

      <main className="bg-light pb-5">
        
        {pageType === "blog" && (
          <div className="container py-4 py-lg-5 mt-lg-4">
            <div className="row g-4 g-lg-5">

              <div className="col-lg-8 order-1">
                <div className="premium-card bg-white">

                  <h1 className="font-outfit fw-bold text-dark mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', lineHeight: '1.3' }}>
                    {pageData.title}
                  </h1>

                  <div className="author-date-social-block d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4">
                    <div className="text-muted fst-italic fs-6 mb-3 mb-md-0 d-flex align-items-center font-poppins flex-wrap gap-2">
                      <span><FaUserCircle className="me-2 text-secondary" size={20} />
                      {pageData.writer_name ? `By ${pageData.writer_name}` : "By HC Team"}</span>
                      <span className="mx-2 d-none d-md-inline">•</span>
                      <span><FaCalendarAlt className="me-2 text-secondary" size={18} />
                      {new Date(pageData.created_at || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}</span>
                    </div>

                    <div className="social-links d-flex gap-2">
                        {siteSettings?.facebook_url && <a href={siteSettings.facebook_url} target="_blank" rel="noopener noreferrer" className="social-btn fb" aria-label="Facebook"><FaFacebookF size={18} /></a>}
                        {siteSettings?.instagram_url && <a href={siteSettings.instagram_url} target="_blank" rel="noopener noreferrer" className="social-btn ig" aria-label="Instagram"><FaInstagram size={18} /></a>}
                        {siteSettings?.twitter_url && <a href={siteSettings.twitter_url} target="_blank" rel="noopener noreferrer" className="social-btn tw" aria-label="X (Twitter)"><FaTwitter size={18} /></a>}
                        {siteSettings?.linkedin_url && <a href={siteSettings.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-btn in" aria-label="LinkedIn"><FaLinkedin size={18} /></a>}
                        {siteSettings?.pinterest_url && <a href={siteSettings.pinterest_url} target="_blank" rel="noopener noreferrer" className="social-btn pi" aria-label="Pinterest"><FaPinterest size={18} /></a>}
                        {siteSettings?.youtube_url && <a href={siteSettings.youtube_url} target="_blank" rel="noopener noreferrer" className="social-btn yt" aria-label="YouTube"><FaYoutube size={18} /></a>}
                    </div>
                  </div>

                  {pageData.image && (
                    <div className="w-100 mb-4 mb-lg-5 d-flex justify-content-center">
                      <Image
                        src={pageData.image}
                        alt={pageData.image_alt || pageData.title || defaultAltText}
                        width={1200}
                        height={675}
                        priority={true}
                        style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover', borderRadius: '1rem', display: 'block', margin: '0 auto' }}
                        className="shadow-sm"
                      />
                    </div>
                  )}

                 <div className="details font-poppins rich-text-content ck-content">
                    <div dangerouslySetInnerHTML={{ __html: pageData.description }} />
                  </div>
                </div>
              </div>

              <div className="col-lg-4 order-2">
                <div className="dual-sticky-wrapper">

                  <SidebarForm city={slug} />

                  {recentBlogs && recentBlogs.length > 0 && (
                    <div className="sidebar-widget mt-4 lazy-render">
                      <h4 className="widget-title">Related Articles</h4>
                      <div className="d-flex flex-column gap-2">
                        {recentBlogs.map((blog, idx) => (
                          <Link key={idx} href={`/${blog.seo_content?.slug || `blog-detail?id=${blog.id}`}`} className="text-decoration-none">
                            <div className="sidebar-blog-card d-flex align-items-center gap-3">
                              <img 
                                src={blog.image || "/images/default.jpg"} 
                                alt={blog.title} 
                                className="rounded shadow-sm flex-shrink-0" 
                                style={{ width: "70px", height: "70px", objectFit: "contain" }} 
                              />
                              <div>
                                <h6 className="text-dark fw-bold mb-1" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                                  {blog.title.length > 45 ? `${blog.title.substring(0, 45)}...` : blog.title}
                                </h6>
                                <small className="text-gradient fw-bold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                  READ ARTICLE <FaArrowRight size={10} />
                                </small>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="sidebar-widget mt-4">
                    <h4 className="widget-title">Service Areas</h4>
                    <div className="d-flex flex-column">
                      {Object.keys(cityUrlMap).map((c, idx) => (
                        <Link key={idx} href={cityUrlMap[c]} className="nav-city-link">
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
        )}

        {pageType === "cms-page" && (
          <>
            <div className="city-hero w-100">
              <Image 
                src={heroImageSrc}
                alt={`${displayCity} Interior Design`}
                fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
              />
              
              <div className="container hero-content font-poppins">
                <div className="hero-badge" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
                  <FaMapMarkerAlt className="me-2" /> {pageData?.banner_subtitle || `High Creation Interior ${displayCity}`}
                </div>
                
                <h1 
                  className="hero-main-title fw-bold mb-3 font-outfit text-white" 
                  style={{ textShadow: '2px 4px 15px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)' }}
                >
                  {pageData?.banner_title || pageData?.title || `${displayCity}`}
                </h1>
              </div>
            </div>

            <div className="container city-main-container">
              <div className="row g-5">
                <div className="col-lg-8">
                  {/* <div className="dual-sticky-wrapper"> */}
                    
                    <div className="premium-card mb-4">
                      {/* <h2 className="font-outfit fw-bold h3 mb-4 text-dark">
                         {displayCity}
                      </h2> */}
                      <div className="rich-text-content ck-content" dangerouslySetInnerHTML={{ __html: safeContent }} />
                    </div>

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
                      {/* </div> */}
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
                                    <img src={blog.image || "/images/default.jpg"} alt={blog.title} className="rounded" style={{ width: "80px", height: "80px", objectFit: "contain" }} loading="lazy" />
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
                              const IconComponent = stat.iconName && FaIcons[stat.iconName] ? FaIcons[stat.iconName] : FaIcons.FaStar;
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
                            /* Fallback Default Stats */
                            <>
                              <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
                                <FaHome size={40} color="#ff914d" className="mb-3" />
                                <h3 className="font-outfit fw-bold h2 mb-1">2680+</h3>
                                <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">HOME RENOVATIONS</p>
                              </div>
                              <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
                                <FaSmile size={40} color="#ff914d" className="mb-3" />
                                <h3 className="font-outfit fw-bold h2 mb-1">2660+</h3>
                                <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">HAPPY CUSTOMERS</p>
                              </div>
                              <div className="col-md-4 excellence-stat d-flex flex-column align-items-center justify-content-center text-center">
                                <FaStar size={40} color="#ff914d" className="mb-3" />
                                <h3 className="font-outfit fw-bold h2 mb-1">4.8/5</h3>
                                <p className="font-poppins text-muted small fw-bold text-uppercase mb-0">CLIENT RATINGS</p>
                              </div>
                            </>
                          )}

                        </div>
                      </div>
                    </div>

                    <div className="lazy-render">
                      <div className="premium-card bg-transparent border-0 shadow-none px-0 py-0 mb-4">
                        <div className="text-center mb-4">
                            <h2 className="font-outfit fw-bold h3 text-dark">What makes us the best choice for your project.</h2>
                        </div>
                        <div className="row g-4 mobile-slider-wrapper modern-card-slider">
                          <div className="col-md-6 col-lg-3">
                            <div className="modern-card">
                              <div className="modern-card-icon"><FaShieldAlt /></div>
                              <h4 className="font-outfit fw-bold h6">10-Year Warranty*</h4>
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

                    {contentBlocks.length > 0 && (
                      <div className="content-blocks-section lazy-render mb-4">
                        {contentBlocks.map((block, idx) => (
                          <div key={idx} className="premium-card mb-4" style={{ padding: '30px' }}>
                            {block.type === 'testimonial' && (
                              <blockquote className="blockquote text-center mb-0">
                                <p className="mb-3 fs-5 font-italic">&quot;{block.data.review}&quot;</p>
                                <footer className="blockquote-footer mt-0 fs-6">
                                  {block.data.client_name} <cite title="Source Title">{block.data.designation}</cite>
                                </footer>
                              </blockquote>
                            )}
                            {block.type === 'service_row' && (
                              <div className="row align-items-center">
                                <div className={block.data.reverse_layout ? 'col-md-6 order-md-2' : 'col-md-6'}>
                                  <h3 className="font-outfit fw-bold h4 mb-3">{block.data.heading}</h3>
                                  <p className="text-muted font-poppins" style={{ whiteSpace: 'pre-line' }}>{block.data.description}</p>
                                </div>
                                <div className={block.data.reverse_layout ? 'col-md-6 order-md-1 text-center' : 'col-md-6 text-center'}>
                                  {block.data.image_url && (
                                    <img 
                                      src={block.data.image_url} 
                                      alt={block.data.image_alt || block.data.heading || defaultAltText} 
                                      className="img-fluid rounded-4 shadow-sm" 
                                      style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }} 
                                      loading="lazy" 
                                    />
                                  )}
                                </div>
                              </div>
                            )}
                            {block.type === 'counter' && (
                              <div className="text-center p-3">
                                <h2 className="font-outfit fw-bold display-4 mb-2 text-gradient">{block.data.number}</h2>
                                <p className="font-poppins fw-bold text-uppercase text-muted mb-0 tracking-wider">{block.data.label}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {accordions.length > 0 && (
                      <div className="lazy-render mb-4">
                        <div className="premium-card border-0 px-0">
                          <h2 className="font-outfit fw-bold h3 mb-4">Additional Information</h2>
                          <div className="accordion font-poppins" id={`accordion-info-${pageData.id}`}>
                            {accordions.map((acc, index) => (
                              <div className="accordion-item faq-premium-item" key={`acc-${index}`}>
                                <h2 className="accordion-header">
                                  <button className={`accordion-button faq-premium-btn ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#acc-collapse${index}`}>
                                    <span className="pe-3">{acc.title}</span>
                                    <FaPlus className="faq-icon-toggle flex-shrink-0" />
                                  </button>
                                </h2>
                                <div id={`acc-collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent={`#accordion-info-${pageData.id}`}>
                                  <div className="accordion-body faq-premium-body" style={{ whiteSpace: 'pre-line' }}>{acc.content}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {faqs.length > 0 && (
                      <div className="lazy-render">
                        <div className="premium-card border-0">
                          <h2 className="font-outfit fw-bold h3 mb-4">Insights for {displayCity}</h2>
                          <div className="accordion font-poppins" id={`accordion-faq-${pageData?.id}`}>
                            {faqs.map((faq, index) => (
                              <div className="accordion-item faq-premium-item mb-4 shadow-sm" style={{ borderRadius: '16px', border: '1px solid #f1f5f9' }} key={index}>
                                <h2 className="accordion-header">
                                  <button className={`accordion-button faq-premium-btn py-4 px-4 ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
                                    <span className="pe-3" style={{ lineHeight: '1.6' }}>{faq.question}</span>
                                    <FaPlus className="faq-icon-toggle flex-shrink-0" />
                                  </button>
                                </h2>
                                <div id={`collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent={`#accordion-faq-${pageData?.id}`}>
                                  <div className="accordion-body faq-premium-body px-4 pb-4" style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
                                    {faq.answer}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="dual-sticky-wrapper">
                    
                    <div className="sidebar-cta shadow-lg mb-4">
                      <h4 className="font-outfit fw-bold mb-2">Book a Site Visit</h4>
                      <p className="font-poppins small text-white-50 mb-4">Expert designers will visit your {displayCity} property.</p>
                      <Link href="/contact" className="btn btn-light w-100 fw-bold py-2 rounded-pill">Schedule Now</Link>
                    </div>

                    <SidebarForm city={slug} />

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

                    <div className="sidebar-widget">
                      <h4 className="widget-title">Service Areas</h4>
                      <div className="d-flex flex-column">
                        {Object.keys(cityUrlMap).map((c, idx) => (
                          <Link key={idx} href={cityUrlMap[c]} className={`nav-city-link ${c === slug ? 'active' : ''}`}>
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
          </>
        )}
      </main>
    </MainLayout>
  );
};

export default DynamicRootPage;