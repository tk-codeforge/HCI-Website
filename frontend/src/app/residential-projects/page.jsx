import { getGallerySlugMap, pageGalleryHref } from "@/utils/slugEdit";
import ResidentialCard from "../components/ResidentialCard";
import MainLayout from "../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";
import { buildTextShadow } from "@/utils/textShadow";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import JsonLd from "../components/JsonLd";
import { canOptimize, optimizedSrcSet } from "@/utils/optimizedImage";

export const revalidate = 60;

const PAGE_PATH = "/residential-projects";
const REVALIDATE_SECONDS = 60;
const MEDIA_ALT_MAP_REVALIDATE_SECONDS = 60;
const ALLOWED_HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

const getApiUrl = (path) => {
  const baseUrl = getBaseUrl();
  return baseUrl ? `${baseUrl.replace(/\/+$/, "")}${path}` : null;
};

async function getResidentialProjects(page = 1) {
  const url = getApiUrl(
    `/portfolio-project/active/residential_projects/page/${page}/limit/20`
  );

  if (!url) {
    console.error("Residential Projects API base URL is not configured.");
    return { data: [], meta: { totalPages: 1 } };
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      console.error(`Failed to fetch residential projects: ${res.status}`);
      return { data: [], meta: { totalPages: 1 } };
    }

    const responseJson = await res.json();
    return {
      data: Array.isArray(responseJson?.data) ? responseJson.data : [],
      meta: responseJson?.meta || { totalPages: 1 },
    };
  } catch (err) {
    console.error("Residential Projects Fetch Error:", err);
    return { data: [], meta: { totalPages: 1 } };
  }
}

async function getSeoData() {
  // Preserve the SEO route currently used by the live page.
  const url = getApiUrl(
    `/seo-tag/route?path=${encodeURIComponent("/residential-project")}`
  );
  if (!url) return null;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

async function getHeadingDescriptionData() {
  const url = getApiUrl("/cms-content/manage_heading_description");
  if (!url) return null;

  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;

    const record = await res.json();
    const data = Array.isArray(record) ? record[0] : record;
    return data?.json_content?.sections?.residential_projects || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}

async function getMediaAltMap() {
  const url = getApiUrl("/cms-parent-child/media-library/alt-map");
  if (!url) return {};

  try {
    const res = await fetch(url, {
      next: { revalidate: MEDIA_ALT_MAP_REVALIDATE_SECONDS },
    });
    if (!res.ok) return {};

    const altMap = await res.json();
    return altMap && typeof altMap === "object" && !Array.isArray(altMap)
      ? altMap
      : {};
  } catch (err) {
    console.error("Media Library alt-map Fetch Error:", err);
    return {};
  }
}

function getMediaFileName(src) {
  if (!src || typeof src !== "string") return "";
  const withoutQueryOrHash = src.split("?")[0].split("#")[0];
  const encodedName = withoutQueryOrHash.split("/").pop() || "";
  try {
    return decodeURIComponent(encodedName);
  } catch {
    return encodedName;
  }
}

function getMediaLibraryAlt(src, altMap) {
  const fileName = getMediaFileName(src);
  return fileName ? altMap?.[fileName] || "" : "";
}

export async function generateMetadata() {
  const seo = await getSeoData();
  const title =
    seo?.meta_title ||
    "Residential Project Interior Portfolio : High creation Interior";
  const description =
    seo?.meta_description ||
    "Every home has a story, and we are proud to help bring it to life. Explore our portfolio of beautifully designed residential interiors, where stunning design, modern functionality, and meticulous attention to detail come together seamlessly.";
  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: PAGE_PATH,
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

export default async function ResidentialProjects({ searchParams }) {
  // Supports both plain and Promise-based searchParams across Next.js versions.
  const params = await searchParams;
  const requestedPage = Number(params?.page);
  const currentPage =
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  // All independent data requests run concurrently to avoid a sequential waterfall.
  const [seo, slugMap, projectResult, headingData, mediaAltMap] = await Promise.all([
    getSeoData(),
    getGallerySlugMap("residential-projects", "project-gallery"),
    getResidentialProjects(currentPage),
    getHeadingDescriptionData(),
    getMediaAltMap(),
  ]);

  const projects = Array.isArray(projectResult?.data) ? projectResult.data : [];
  const rawTotalPages = Number(projectResult?.meta?.totalPages) || 1;
  const totalPages = Math.max(1, Math.floor(rawTotalPages));

  const requestedHeadingTag = String(headingData?.headingTag || "h1").toLowerCase();
  const HeadingTag = ALLOWED_HEADING_TAGS.has(requestedHeadingTag)
    ? requestedHeadingTag
    : "h1";
  const headingText = headingData?.headingText || "Residential Projects";
  const headingStyle = {
    textShadow: buildTextShadow(
      headingData?.headingShadowEnabled,
      headingData?.headingShadowIntensity
    ),
    fontFamily: "inherit",
    ...(headingData?.headingColor && { color: headingData.headingColor }),
  };

  const descriptionText =
    headingData?.descriptionText ||
    "Explore a curated selection of premium living room interior designs and décor ideas at High Creation. We offer customizable, functional, and stylish solutions to elevate your living space. From modular TV units to wall art and innovative wall designs, find all the inspiration you need to transform your living room. Start browsing today to discover designs that perfectly reflect your personal style.";
  const descriptionStyle = {
    ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
    ...(headingData?.descriptionFontSize && {
      fontSize: `${Number(headingData.descriptionFontSize)}px`,
    }),
    textShadow: buildTextShadow(
      headingData?.descriptionShadowEnabled,
      headingData?.descriptionShadowIntensity
    ),
  };

  const bannerImage =
    typeof headingData?.bannerImage === "string" ? headingData.bannerImage : "";
  const bannerAlt =
    headingData?.bannerAlt || getMediaLibraryAlt(bannerImage, mediaAltMap) || headingText;
  // Use the site's supported responsive image variants where available; keep the
  // original URL as a safe fallback for media sources the optimizer does not handle.
  const bannerSrcSet =
    bannerImage && canOptimize(bannerImage)
      ? optimizedSrcSet(bannerImage)
      : undefined;

  const headingBlock = (
    <>
      <HeadingTag
        id="residential-projects-heading"
        className="wallpaperHeading"
        style={headingStyle}
      >
        {headingText}
      </HeadingTag>
      <p
        id="residential-projects-description"
        className="px-lg-5 fs-6 text-muted"
        style={descriptionStyle}
      >
        {descriptionText}
      </p>
    </>
  );

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <style>{`
        .residential-projects-page .residential-project-card {
          margin-bottom: 0;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .residential-projects-page .residential-project-card-image {
          transition: transform 0.35s ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .residential-projects-page .residential-project-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 26px rgba(0, 0, 0, 0.1);
          }
          .residential-projects-page .residential-project-card:hover .residential-project-card-image {
            transform: scale(1.04);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .residential-projects-page .residential-project-card,
          .residential-projects-page .residential-project-card-image {
            transition: none !important;
          }
          .residential-projects-page .residential-project-card:hover,
          .residential-projects-page .residential-project-card:hover .residential-project-card-image {
            transform: none !important;
          }
        }
        @media (max-width: 767px) {
          .residential-projects-page .residential-project-card-image {
            transition: none;
          }
        }
      `}</style>

      <main className="residential-projects-page">
        {bannerImage ? (
          <section
            className="w-100 d-flex align-items-center justify-content-center mb-5"
            style={{ position: "relative", aspectRatio: "1900 / 441" }}
          >
            <img
              src={bannerImage}
              srcSet={bannerSrcSet}
              sizes="100vw"
              alt={bannerAlt}
              width={1900}
              height={441}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            <div className="container text-center py-5 position-relative w-100">
              {headingBlock}
            </div>
          </section>
        ) : (
          <div className="container mt-5">
            <div className="text-center mb-5 row mx-0">{headingBlock}</div>
          </div>
        )}

        <section className="resi_card">
          <div className="container">
            <div className="row mx-0 g-4">
              {projects.length > 0 ? (
                projects.map((project, index) => {
                  const projectHref = pageGalleryHref(
                    "residential-projects",
                    slugMap,
                    project.id,
                    "project-gallery"
                  );
                  const imageAlt =
                    project.image_alt ||
                    getMediaLibraryAlt(project.image, mediaAltMap) ||
                    project.title ||
                    defaultAltText;
                  const firstImageIsLcpCandidate = !bannerImage && index === 0;

                  return (
                    <div
                      key={project.id ?? `${project.title || "project"}-${index}`}
                      className="col-lg-4 col-md-6 col-sm-12"
                    >
                      <ResidentialCard
                        projectCardLink={projectHref}
                        cardNameResid="card_product"
                        resiImgUrl={project.image}
                        resiImgALt={imageAlt}
                        resolvedImageAlt={imageAlt}
                        resiImgClass="resi_img"
                        residentialTitle={project.title}
                        residentialTitleClass="product_heading h4"
                        residentialClassCss="team_designation"
                        residentialButton="Explore Design"
                        residentialButtonUrl={projectHref}
                        imageSizes="(max-width: 767px) calc(100vw - 24px), (max-width: 991px) calc(50vw - 24px), 33vw"
                        imageLoading={firstImageIsLcpCandidate ? "eager" : "lazy"}
                        imageFetchPriority={firstImageIsLcpCandidate ? "high" : undefined}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center py-5">
                  <div className="p-5 bg-white rounded-4 shadow-sm">
                    <h3 className="text-muted">New designs coming soon.</h3>
                    <p>We are currently updating our portfolio.</p>
                  </div>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <nav aria-label="Project pagination" className="mt-5 pt-4">
                <style>{`
                  @media (max-width: 768px) {
                    .residential-projects-page .mobile-wrap-pagination { flex-wrap: wrap !important; }
                    .residential-projects-page .mobile-full-width {
                      flex: 0 0 100%;
                      display: flex;
                      justify-content: center;
                      margin-bottom: 15px;
                    }
                    .residential-projects-page .mobile-full-width:last-child {
                      margin-bottom: 0;
                      margin-top: 15px;
                    }
                  }
                `}</style>
                <ul className="pagination pagination-lg justify-content-center gap-2 mobile-wrap-pagination">
                  <li
                    className={`page-item mobile-full-width ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <a
                      className="page-link rounded-pill px-4 border-0 shadow-sm"
                      href={currentPage > 1 ? `/residential-projects?page=${currentPage - 1}` : "#"}
                      aria-disabled={currentPage === 1}
                    >
                      Previous
                    </a>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNum = index + 1;
                    const isCurrentPage = currentPage === pageNum;
                    return (
                      <li
                        key={pageNum}
                        className={`page-item ${isCurrentPage ? "active" : ""}`}
                      >
                        <a
                          className={`page-link rounded-circle border-0 shadow-sm ${isCurrentPage ? "bg-dark text-white" : ""}`}
                          style={{
                            width: "48px",
                            height: "48px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          href={`/residential-projects?page=${pageNum}`}
                          aria-current={isCurrentPage ? "page" : undefined}
                        >
                          {pageNum}
                        </a>
                      </li>
                    );
                  })}

                  <li
                    className={`page-item mobile-full-width ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <a
                      className="page-link rounded-pill px-4 border-0 shadow-sm"
                      href={
                        currentPage < totalPages
                          ? `/residential-projects?page=${currentPage + 1}`
                          : "#"
                      }
                      aria-disabled={currentPage === totalPages}
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </section>
        <hr className="mt-5" />
      </main>
    </MainLayout>
  );
}
