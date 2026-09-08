import MainLayout from "../layouts/MainLayout";
import BackgroundImageRow from "../components/BackgroundImageRow";
import { defaultAltText } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

// --- CONFIGURATION ---
export const revalidate = 60; // Regenerate page every 60 seconds

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- HELPER: Fetch Services Data ---
async function getServiceData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-city`, {
      // cache handled by page revalidate
    });

    if (!res.ok) {
      console.error(`Failed to fetch services: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Services Fetch Error:", err);
    return [];
  }
}

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
          tag.page_name === "https://hcinterior.in/services" ||
          tag.page_name?.endsWith("/services")
      );
    }
    return null;
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

// --- DYNAMIC METADATA GENERATION ---
export async function generateMetadata() {
  const seoData = await getSeoData();

  const defaultTitle = "Our Taganting Site Services Page";
  const defaultDesc = "Our Taganting Site Services Page";
  const defaultCanonical = "https://hcinterior.in/services";

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
export default async function Services() {
  const rawPageDataList = await getServiceData();

  // Fetch CMS page data (Banner & Custom Content)
  let cmsData = null;
  let recordImage = null;
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/services_page`, { cache: "no-store" });
    if (res.ok) {
      const jsonRes = await res.json();
      const record = Array.isArray(jsonRes) ? jsonRes.data?.[0] || jsonRes[0] : jsonRes;
      cmsData = record?.json_content || record;
      recordImage = record?.image || null;
    }
  } catch (err) {
    console.error("CMS Services Content Fetch Error:", err);
  }

  const customServices = cmsData?.blocks || cmsData?.services || [];
  const hasCustomContent = Array.isArray(customServices) && customServices.length > 0;

  // --- SORTING LOGIC FOR FALLBACK ---
  const normalizeCity = (value) =>
  (value || "").toLowerCase().trim().replace(/[\s_-]+/g, "");

// Handles known real-world naming differences between what's stored
// and the desired display order.
const cityAliases = { gurgaon: "gurugram" };

const resolveCityKey = (value) => {
  const normalized = normalizeCity(value);
  return cityAliases[normalized] || normalized;
};

const desiredOrder = [
  "noida",
  "ghaziabad",
  "greater noida",
  "delhi",
  "dwarka",
  "faridabad",
  "gurugram",
  "manesar"
].map(normalizeCity);

let pageDataList = [];
if (!hasCustomContent && rawPageDataList && Array.isArray(rawPageDataList)) {
  pageDataList = [...rawPageDataList].sort((a, b) => {
    const indexA = desiredOrder.indexOf(resolveCityKey(a.city_type));
    const indexB = desiredOrder.indexOf(resolveCityKey(b.city_type));

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    return 0;
  });
}

  // Strict Fallback Order matching your exact code requirements
  const fallbackImages = [
    "/images/services/1-min.png", // 0: Noida
    "/images/services/2-min.png", // 1: Ghaziabad
    "/images/services/3-min.png", // 2: Greater Noida
    "/images/services/4-min.png", // 3: Delhi
    "/images/services/5-min.png", // 4: Dwarka
    "/images/services/6-min.png", // 5: Faridabad
    "/images/services/8-min.png", // 6: Gurugram
    "/images/services/7-min.png", // 7: Manesar
  ];

  const activeItems = hasCustomContent ? customServices : pageDataList;

 const bannerHeading = cmsData?.banner?.heading || cmsData?.bannerHeading || "Services";
const bannerDesc = cmsData?.banner?.description || cmsData?.bannerDescription || "Every home has potential, and we at High Creation Interior bring it to life with exceptional design—discover our range of interior services crafted for living rooms, bedrooms, kitchens, dining areas, and more, where stylish design meets everyday functionality.";
const bannerHeadingColor = cmsData?.bannerHeadingColor || "#ffffff";
const bannerDescriptionColor = cmsData?.bannerDescriptionColor || "#ffffff";
  let rawBannerImg =
  cmsData?.banner?.image ||
  cmsData?.bg_image ||
  cmsData?.image ||    
  recordImage;

const hasCustomBanner =
  rawBannerImg && typeof rawBannerImg === "string" && rawBannerImg.trim() !== "";

  return (
    <MainLayout>
      <style dangerouslySetInnerHTML={{__html: `
        :root { --hc-primary: #ff914d; --hc-dark: #0f172a; }
        .font-outfit { font-family: var(--font-outfit), sans-serif; }
        .font-quicksand { font-family: var(--font-quicksand), sans-serif; }

        .services-custom-bg .sectionbg.services {
  background-image: var(--services-bg-image) !important;
  background-size: cover !important;
  background-position: center !important;
}
        
        .modern-service-row { padding: 4rem 0; border-bottom: 1px solid #f1f5f9; transition: background 0.3s ease; }
        .modern-service-row:hover { background: #fdfdfd; }
        .modern-service-row:last-child { border-bottom: none; }
        
        .service-img-wrapper { 
            position: relative; 
            width: 100%; 
            aspect-ratio: 4/3; 
            border-radius: 20px; 
            overflow: hidden; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.06); 
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
        }
        .modern-service-row:hover .service-img-wrapper {
            transform: translateY(-8px);
            box-shadow: 0 30px 50px rgba(0,0,0,0.12);
        }

        .service-img-wrapper img {
            transition: transform 0.7s ease;
        }
        .modern-service-row:hover .service-img-wrapper img {
            transform: scale(1.05);
        }

        .service-badge { 
            display: inline-block; 
            padding: 6px 16px; 
            background: #fff4ed; 
            color: var(--hc-primary); 
            border-radius: 30px; 
            font-size: 13px; 
            font-weight: 700; 
            letter-spacing: 1px; 
            text-transform: uppercase; 
            margin-bottom: 1rem; 
        }

        .btn-modern-primary {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 12px 28px;
            background: white;
            color: #ff914d !important;
            border: 2px solid #ff914d;
            font-weight: 600;
            border-radius: 30px;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15);
        }
        .btn-modern-primary:hover {
            background: linear-gradient(135deg, var(--hc-primary) 0%, #ff5722 100%);
            color: #ffffff !important;
            transform: translateY(-3px);
            box-shadow: 0 15px 25px rgba(255, 145, 77, 0.25);
        }

        .service-rich-text {
    max-height: 250px; /* Adjust this value slightly if you want more or less text to show */
    overflow: hidden;
    position: relative;
    /* This ensures that if your CMS sends raw text with 'Enters', they render as new lines */
    white-space: pre-line; 
}

.service-rich-text::after,
.service-description-wrapper::after {
    content: none !important;
    display: none !important;
}

.service-rich-text p {
    margin-bottom: 1.25rem;
    line-height: 1.6;
}
        .service-rich-text img { max-width: 100%; height: auto; border-radius: 12px; }

        .service-description-wrapper {
    position: relative;
    max-height: 215px;
    overflow: hidden;
}

/* NEW: Fade the bottom of collapsed service content */
.service-description-wrapper::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 70px;
    background: linear-gradient(
        to bottom,
        rgba(255,255,255,0),
        #fff
    );
    pointer-events: none;
}

.services-page-wrapper .sec_bgheading_lass {
  color: var(--services-heading-color, #ffffff) !important;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9), 0 3px 12px rgba(0, 0, 0, 0.75);
}

.services-page-wrapper .secbgbesclass {
  color: var(--services-description-color, #ffffff) !important;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9), 0 3px 12px rgba(0, 0, 0, 0.75);
  font-size: 1.25rem;
}

      `}} />

      <main
  className={hasCustomBanner ? "services-page-wrapper services-custom-bg" : "services-page-wrapper"}
  style={{
    "--services-heading-color": bannerHeadingColor,
    "--services-description-color": bannerDescriptionColor,
    ...(hasCustomBanner ? { "--services-bg-image": `url(${rawBannerImg})` } : {}),
  }}
>
        <BackgroundImageRow
  sectionBgImages={"sectionbg services"}
  sectionBgHeading={bannerHeading}
  secBgHeadingClass="sec_bgheading_lass"
  sectionBgDescription={bannerDesc}
  secBgDesClass="secbgbesclass"
/>

        <div className="container py-5">
          {activeItems && activeItems.length > 0 ? (
            activeItems.map((item, index) => {
              // Strictly enforce fallback images matching index order (0 -> 1-min.png for Noida, etc.)
              const fallbackImg = fallbackImages[index] || fallbackImages[index % fallbackImages.length];
              const isEven = index % 2 === 0;

              let targetLink = item?.button_url || item?.buttonLink;
              if (!targetLink) {
                const cityValue = item?.city_type?.toLowerCase().trim() || "";
                let citySlug = cityValue.replace(/[\s_]+/g, '-');
                if (citySlug === "gurugram") citySlug = "gurgaon";
                targetLink = cityValue ? `/interior-designers-in-${citySlug}` : "#";
              }

              const titleText = hasCustomContent 
                ? (item?.title || "") 
                : (item?.main_title ?? `Interior Designers in ${(item?.city_type || "").toUpperCase()}`);
              
              const safeDescription = hasCustomContent 
                ? (item?.description || "") 
                : (item?.main_description || "");

              const itemImage = hasCustomContent 
                ? (item?.image || fallbackImg) 
                : (fallbackImg); // Enforces strict array fallback order for cities

              const btnText = item?.button_text || item?.buttonText || "Read More";

              return (
                <div className="modern-service-row" key={item.id || index}>
                  <div className="row g-5 align-items-center">
                    
                    {/* IMAGE COLUMN */}
                    <div className={`col-lg-6 ${isEven ? 'order-lg-1' : 'order-lg-2'}`}>
                      <div className="service-img-wrapper">
                        <Image 
                          src={itemImage} 
                          alt={titleText || defaultAltText}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </div>

                    {/* CONTENT COLUMN */}
                    <div className={`col-lg-6 ${isEven ? 'order-lg-2' : 'order-lg-1'} ps-lg-5`}>
  <span className="service-badge font-quicksand">Premium Interiors</span>
  
  <h2 className="font-outfit fw-bold text-dark mb-4" style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)', lineHeight: '1.2' }}>
    {titleText}
  </h2>
  
  {/* Apply the CSS class directly here */}
  <div 
    className="service-rich-text mb-4 text-muted" 
    dangerouslySetInnerHTML={{ __html: safeDescription }} 
  />

  <div className="d-flex align-items-center">
    <Link href={targetLink} className="btn-modern-primary font-quicksand">
      {btnText} <FaArrowRight />
    </Link>
  </div>
</div>

                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center my-5 py-5">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <p className="font-quicksand text-muted">Loading services...</p>
            </div>
          )}
        </div>
      </main>
    </MainLayout>
  );
}