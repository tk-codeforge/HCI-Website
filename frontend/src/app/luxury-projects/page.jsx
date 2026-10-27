import { getGallerySlugMap, pageGalleryHref } from "@/utils/slugEdit";
import ResidentialCard from "../components/ResidentialCard";
import MainLayout from "../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";
import { buildTextShadow } from "@/utils/textShadow";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import { MediaBg } from "../components/MediaImage";
import JsonLd from "../components/JsonLd";

export const revalidate = 60;

const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

async function getLuxuryProjects(page = 1) {
  try {
    const baseURL = getBaseUrl();
    const limit = 20;
    const res = await fetch(
      `${baseURL}/portfolio-project/active/luxury_projects/page/${page}/limit/${limit}`
    );

    if (!res.ok) {
      console.error(`Failed to fetch luxury projects: ${res.status}`);
      return { data: [], meta: { totalPages: 1 } };
    }

    const responseJson = await res.json();
    return {
      data: responseJson.data || [],
      meta: responseJson.meta || { totalPages: 1 },
    };
  } catch (err) {
    console.error("Luxury Projects Fetch Error:", err);
    return { data: [], meta: { totalPages: 1 } };
  }
}

async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(
      `${baseURL}/seo-tag/route?path=${encodeURIComponent("/luxury-projects")}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

async function getHeadingDescriptionData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/manage_heading_description`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const record = await res.json();
    const data = Array.isArray(record) ? record[0] : record;
    return data?.json_content?.sections?.luxury_projects || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}

export async function generateMetadata() {
  const seo = await getSeoData();

  const title =
    seo?.meta_title ||
    "Luxury Interior Project Interior Portfolio : High creation Interior";
  const description =
    seo?.meta_description ||
    "Discover High Creation Interior's luxury interior project portfolio, featuring exquisite designs and elegant solutions crafted to transform spaces into timeless masterpieces.";
  const ogTitle = seo?.og_title || title;
  const ogDescription = seo?.og_description || description;

  const canonical = getCanonicalUrl({
    canonicalUrl: seo?.canonical_url,
    fallbackPath: "/luxury-projects",
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

export default async function LuxuryProjects({ searchParams }) {
  // Resolve the query string first, then fetch independent API data concurrently.
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;

  const [seo, slugMap, projectResult, headingData] = await Promise.all([
    getSeoData(),
    getGallerySlugMap("luxury-projects", "project-gallery"),
    getLuxuryProjects(currentPage),
    getHeadingDescriptionData(),
  ]);

  const { data: projects, meta } = projectResult;
  const totalPages = meta?.totalPages || 1;

  const HeadingTag = headingData?.headingTag || "h1";
  const headingText = headingData?.headingText || "Luxury Projects";
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
    "Luxury is not just seen, it is felt and experienced—explore our collection of luxury interiors, thoughtfully designed with premium materials, bespoke details, and timeless sophistication to create homes that are truly extraordinary.";
  const descriptionStyle = {
    ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
    textShadow: buildTextShadow(
      headingData?.descriptionShadowEnabled,
      headingData?.descriptionShadowIntensity
    ),
  };

  const bannerImage = headingData?.bannerImage || "";

  const headingBlock = (
    <>
      <HeadingTag
        id="luxury-projects-heading"
        className="wallpaperHeading"
        style={headingStyle}
      >
        {headingText}
      </HeadingTag>
      <p
        id="luxury-projects-description"
        className="px-lg-5 fs-6 text-muted"
        style={descriptionStyle}
      >
        {descriptionText}
      </p>
      <style>{`
        ${headingData?.headingColor ? `#luxury-projects-heading { color: ${headingData.headingColor} !important; }` : ""}
        ${headingData?.descriptionColor ? `#luxury-projects-description { color: ${headingData.descriptionColor} !important; }` : ""}
        ${headingData?.descriptionFontSize ? `#luxury-projects-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
        #luxury-projects-heading { text-shadow: ${buildTextShadow(headingData?.headingShadowEnabled, headingData?.headingShadowIntensity)} !important; }
        #luxury-projects-description { text-shadow: ${buildTextShadow(headingData?.descriptionShadowEnabled, headingData?.descriptionShadowIntensity)} !important; }
      `}</style>
    </>
  );

  return (
    <MainLayout>
      <JsonLd data={seo?.custom_schema} />
      <main>
        {bannerImage ? (
          <MediaBg
            src={bannerImage}
            alt={headingData?.bannerAlt}
            fallbackAlt={headingText}
            className="w-100 d-flex align-items-center justify-content-center mb-5"
            style={{ aspectRatio: "1900 / 441" }}
          >
            <div className="container text-center py-5">{headingBlock}</div>
          </MediaBg>
        ) : (
          <div className="container mt-5">
            <div className="text-center mb-5 row mx-0">{headingBlock}</div>
          </div>
        )}

        <section className="resi_card">
          <div className="container">
            <div className="row mx-0 g-4">
              {projects && projects.length > 0 ? (
                projects.map((project, index) => {
                  const projectHref = pageGalleryHref(
                    "luxury-projects",
                    slugMap,
                    project.id,
                    "project-gallery"
                  );

                  return (
                    <div
                      key={project.id ?? index}
                      className="col-lg-4 col-md-6 col-12"
                    >
                      <ResidentialCard
                        projectCardLink={projectHref}
                        cardNameResid="card_product"
                        resiImgUrl={project.image}
                        resiImgALt={project.title ?? defaultAltText}
                        cmsAltResi={project.image_alt}
                        resiImgClass="resi_img"
                        residentialTitle={project.title}
                        residentialTitleClass="product_heading"
                        residentialButton="View More"
                        // The first visible card is a likely LCP candidate on mobile.
                        // Keep all following cards lazy-loaded to avoid competing requests.
                        imageLoading={index === 0 ? "eager" : "lazy"}
                        imageFetchPriority={index === 0 ? "high" : undefined}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center">
                  <p>No projects found.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <nav aria-label="Project pagination">
                <ul className="pagination justify-content-center mt-5">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <a
                      className="page-link"
                      href={
                        currentPage > 1
                          ? `/luxury-projects?page=${currentPage - 1}`
                          : "#"
                      }
                      aria-disabled={currentPage === 1}
                    >
                      Previous
                    </a>
                  </li>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNum = index + 1;
                    return (
                      <li
                        key={pageNum}
                        className={`page-item ${currentPage === pageNum ? "active" : ""}`}
                      >
                        <a
                          className="page-link"
                          href={`/luxury-projects?page=${pageNum}`}
                          aria-current={currentPage === pageNum ? "page" : undefined}
                        >
                          {pageNum}
                        </a>
                      </li>
                    );
                  })}

                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <a
                      className="page-link"
                      href={
                        currentPage < totalPages
                          ? `/luxury-projects?page=${currentPage + 1}`
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
