import MainLayout from "../layouts/MainLayout";
import BackgroundImageRow from "../components/BackgroundImageRow";
import { defaultAltText } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../components/JsonLd";

const TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
const safeTag = (tag, fallback) => (TAGS.includes(tag) ? tag : fallback);

// Keep page data fresh while allowing Next.js to cache the page and its API requests.
export const revalidate = 60;

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

async function getServiceData() {
  const baseURL = getBaseUrl();
  if (!baseURL) {
    console.error("Services Fetch Error: API base URL is not configured.");
    return [];
  }

  try {
    const res = await fetch(`${baseURL}/cms-city`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch services: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Services Fetch Error:", error);
    return [];
  }
}

async function getSeoData() {
  const baseURL = getBaseUrl();
  if (!baseURL) {
    console.error("SEO Fetch Error: API base URL is not configured.");
    return null;
  }

  try {
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/services")}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("SEO Fetch Error:", error);
    return null;
  }
}

async function getServicesPageContent() {
  const baseURL = getBaseUrl();
  if (!baseURL) {
    console.error("CMS Services Content Fetch Error: API base URL is not configured.");
    return { cmsData: null, recordImage: null };
  }

  try {
    // Previously cache: "no-store" forced this route to render dynamically and
    // prevented the page's ISR setting from helping mobile TTFB.
    const res = await fetch(`${baseURL}/cms-content/services_page`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`CMS Services Content Fetch Error: ${res.status}`);
      return { cmsData: null, recordImage: null };
    }

    const jsonRes = await res.json();
    const record = Array.isArray(jsonRes)
      ? jsonRes.data?.[0] || jsonRes[0]
      : jsonRes;

    return {
      cmsData: record?.json_content || record || null,
      recordImage: record?.image || null,
    };
  } catch (error) {
    console.error("CMS Services Content Fetch Error:", error);
    return { cmsData: null, recordImage: null };
  }
}

export async function generateMetadata() {
  const seo = await getSeoData();
  const title = seo?.meta_title || "Our Taganting Site Services Page";
  const description = seo?.meta_description || "Our Taganting Site Services Page";
  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/services",
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

export default async function Services() {
  // Run independent API requests concurrently to avoid serial server wait time.
  const [seo, rawPageDataList, pageContent] = await Promise.all([
    getSeoData(),
    getServiceData(),
    getServicesPageContent(),
  ]);

  const { cmsData, recordImage } = pageContent;
  const customServices = cmsData?.blocks || cmsData?.services || [];
  const hasCustomContent = Array.isArray(customServices) && customServices.length > 0;

  const normalizeCity = (value) =>
    (value || "").toLowerCase().trim().replace(/[\s_-]+/g, "");
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
    "manesar",
  ].map(normalizeCity);

  let pageDataList = [];
  if (!hasCustomContent && Array.isArray(rawPageDataList)) {
    pageDataList = [...rawPageDataList].sort((a, b) => {
      const indexA = desiredOrder.indexOf(resolveCityKey(a.city_type));
      const indexB = desiredOrder.indexOf(resolveCityKey(b.city_type));
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return 0;
    });
  }

  const activeItems = hasCustomContent ? customServices : pageDataList;
  const bannerHeading =
    cmsData?.banner?.heading || cmsData?.bannerHeading || "Services";
  const bannerDesc =
    cmsData?.banner?.description ||
    cmsData?.bannerDescription ||
    "Every home has potential, and we at High Creation Interior bring it to life with exceptional design—discover our range of interior services crafted for living rooms, bedrooms, kitchens, dining areas, and more, where stylish design meets everyday functionality.";
  const bannerHeadingColor = cmsData?.bannerHeadingColor || "#ffffff";
  const bannerDescriptionColor = cmsData?.bannerDescriptionColor || "#ffffff";
  const bannerHeadingTag = safeTag(cmsData?.bannerHeadingTag, "h1");
  const bannerDescriptionSize = Number(cmsData?.bannerDescriptionSize) || 14;
  const rawBannerImg =
    cmsData?.banner?.image || cmsData?.bg_image || cmsData?.image || recordImage;
  const hasCustomBanner =
    typeof rawBannerImg === "string" && rawBannerImg.trim() !== "";
  const bannerImageAlt = cmsData?.bg_image_alt?.trim() || bannerHeading;

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <style dangerouslySetInnerHTML={{ __html: `
        .services-page-wrapper {
          --hc-primary: #ff914d;
          --hc-dark: #0f172a;
        }
        .services-page-wrapper .font-outfit {
          font-family: var(--font-outfit), sans-serif;
        }
        .services-page-wrapper .font-quicksand {
          font-family: var(--font-quicksand), sans-serif;
        }
        .services-page-wrapper .secbgbesclass {
          border-left: none !important;
          color: var(--services-description-color, #ffffff) !important;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9), 0 3px 12px rgba(0, 0, 0, 0.75);
          font-size: var(--services-description-size, 14px) !important;
        }
        .services-page-wrapper .sec_bgheading_lass {
          color: var(--services-heading-color, #ffffff) !important;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9), 0 3px 12px rgba(0, 0, 0, 0.75);
        }

        /* Use the MediaImg element as the single banner image source. The old
           !important CSS background requested the same banner a second time. */
        .services-page-wrapper.services-custom-bg .sectionbg.services {
          background-image: none !important;
        }
        .services-page-wrapper.services-custom-bg .sectionbg.services .services-bg-img {
          object-position: center;
        }

        .services-page-wrapper .modern-service-row {
          padding: 4rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .services-page-wrapper .modern-service-row:last-child {
          border-bottom: none;
        }
        .services-page-wrapper .service-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
        }
        .services-page-wrapper .service-img-wrapper img {
          display: block;
        }
        .services-page-wrapper .service-badge {
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
        .services-page-wrapper .btn-modern-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 28px;
          background: #ffffff;
          color: var(--hc-primary) !important;
          border: 2px solid var(--hc-primary);
          font-weight: 600;
          border-radius: 30px;
          text-decoration: none;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15);
        }
        .services-page-wrapper .service-rich-text {
          max-height: 250px;
          overflow: hidden;
          position: relative;
          white-space: pre-line;
        }
        .services-page-wrapper .service-rich-text p {
          margin-bottom: 1.25rem;
          line-height: 1.6;
        }
        .services-page-wrapper .service-rich-text img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
        }

        @media (hover: hover) and (pointer: fine) {
          .services-page-wrapper .modern-service-row {
            transition: background 0.3s ease;
          }
          .services-page-wrapper .modern-service-row:hover {
            background: #fdfdfd;
          }
          .services-page-wrapper .modern-service-row .service-img-wrapper {
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease;
          }
          .services-page-wrapper .modern-service-row:hover .service-img-wrapper {
            transform: translateY(-8px);
            box-shadow: 0 30px 50px rgba(0, 0, 0, 0.12);
          }
          .services-page-wrapper .service-img-wrapper img {
            transition: transform 0.7s ease;
          }
          .services-page-wrapper .modern-service-row:hover .service-img-wrapper img {
            transform: scale(1.05);
          }
          .services-page-wrapper .btn-modern-primary {
            transition: color 0.3s ease, background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
          }
          .services-page-wrapper .btn-modern-primary:hover {
            background: linear-gradient(135deg, var(--hc-primary) 0%, #ff5722 100%);
            color: #ffffff !important;
            transform: translateY(-3px);
            box-shadow: 0 15px 25px rgba(255, 145, 77, 0.25);
          }
        }

        @media (max-width: 768px) {
          .services-page-wrapper {
            overflow-x: hidden;
            width: 100%;
            max-width: 100%;
          }
          .services-page-wrapper .modern-service-row {
            padding: 2rem 0;
          }
          .services-page-wrapper.services-custom-bg .sectionbg.services {
            position: relative;
            height: 0 !important;
            padding-top: 31.25% !important;
            background-color: transparent !important;
            min-height: unset !important;
            overflow: hidden;
          }
          .services-page-wrapper.services-custom-bg .sectionbg.services > .container {
            position: absolute !important;
            inset: 0;
            display: flex;
            align-items: center;
          }
          .services-page-wrapper.services-custom-bg .sectionbg.services .services-bg-img {
            object-position: 45% center !important;
          }
        }
      ` }} />

      <main
        className={
          hasCustomBanner
            ? "services-page-wrapper services-custom-bg"
            : "services-page-wrapper"
        }
        style={{
          "--services-heading-color": bannerHeadingColor,
          "--services-description-color": bannerDescriptionColor,
          "--services-description-size": `${bannerDescriptionSize}px`,
        }}
      >
        <BackgroundImageRow
          sectionBgImages="sectionbg services"
          sectionBgHeading={bannerHeading}
          headingTag={bannerHeadingTag}
          secBgHeadingClass="sec_bgheading_lass"
          sectionBgDescription={bannerDesc}
          descriptionFontSize={bannerDescriptionSize}
          secBgDesClass="secbgbesclass"
          noDivider
          bgImageUrl={hasCustomBanner ? rawBannerImg : undefined}
          bgImageAlt={bannerImageAlt}
          bgImageClassName="services-bg-img"
          bgImageSizes="100vw"
        />

        <div className="container py-5">
          {activeItems.length > 0 ? (
            activeItems.map((item, index) => {
              const isEven = index % 2 === 0;
              let targetLink = item?.button_url || item?.buttonLink;

              if (!targetLink) {
                const cityValue = item?.city_type?.toLowerCase().trim() || "";
                let citySlug = cityValue.replace(/[\s_]+/g, "-");
                if (citySlug === "gurugram") citySlug = "gurgaon";
                targetLink = cityValue
                  ? `/interior-designers-in-${citySlug}`
                  : "#";
              }

              const titleText = hasCustomContent
                ? item?.title || ""
                : item?.main_title ?? `Interior Designers in ${(item?.city_type || "").toUpperCase()}`;
              const safeDescription = hasCustomContent
                ? item?.description || ""
                : item?.main_description || "";
              const itemImage = item?.image || null;
              const CardTag = safeTag(item?.headingTag, "h2");
              const btnText = item?.button_text || item?.buttonText || "Read More";
              const isFirstItem = index === 0;

              return (
                <div className="modern-service-row" key={item.id || index}>
                  <div className="row g-3 g-lg-5 align-items-center">
                    <div className={`col-lg-6 ${isEven ? "order-lg-1" : "order-lg-2"}`}>
                      <div className="service-img-wrapper">
                        {itemImage ? (
                          <Image
                            src={itemImage}
                            alt={item?.image_alt?.trim() || titleText || defaultAltText}
                            width={1200}
                            height={900}
                            sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 991px) calc(100vw - 3rem), 50vw"
                            priority={isFirstItem}
                            fetchPriority={isFirstItem ? "high" : "auto"}
                            style={{
                              position: "absolute",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light text-muted">
                            No image
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`col-lg-6 ${isEven ? "order-lg-2" : "order-lg-1"} ps-lg-5`}>
                      <span className="service-badge font-quicksand">Premium Interiors</span>
                      <CardTag
                        className="font-outfit fw-bold text-dark mb-4"
                        style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)", lineHeight: "1.2" }}
                      >
                        {titleText}
                      </CardTag>

                      <div
                        className="service-rich-text mb-4 text-muted"
                        dangerouslySetInnerHTML={{ __html: safeDescription }}
                      />

                      <div className="d-flex align-items-center">
                        <Link href={targetLink} className="btn-modern-primary font-quicksand">
                          {btnText} <FaArrowRight aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center my-5 py-5">
              <div className="spinner-border text-primary mb-3" role="status" aria-label="Loading services" />
              <p className="font-quicksand text-muted">Loading services...</p>
            </div>
          )}
        </div>
      </main>
    </MainLayout>
  );
}
