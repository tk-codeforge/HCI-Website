import ResidentialCard from "../components/ResidentialCard";
import MainLayout from "../layouts/MainLayout";
import { defaultAltText } from "@/utils/helper";

// --- CONFIGURATION ---
export const revalidate = 60; // Regenerate page every 60 seconds

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- HELPER: Fetch Residential Projects Data ---
async function getResidentialProjects(page = 1) {
  try {
    const baseURL = getBaseUrl();
    const limit = 20;
    const res = await fetch(
      `${baseURL}/portfolio-project/active/residential_projects/page/${page}/limit/${limit}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch residential projects: ${res.status}`);
      return { data: [], meta: { totalPages: 1 } };
    }

    const responseJson = await res.json();
    
    return {
      data: responseJson.data || [],
      meta: responseJson.meta || { totalPages: 1 },
    };
  } catch (err) {
    console.error("Residential Projects Fetch Error:", err);
    return { data: [], meta: { totalPages: 1 } };
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
          tag.page_name === "https://hcinterior.in/residential-projects" ||
          tag.page_name?.endsWith("/residential-projects")
      );
    }
    return null;
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
    return data?.json_content?.sections?.residential_projects || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}

// --- DYNAMIC METADATA GENERATION ---
export async function generateMetadata() {
  const seoData = await getSeoData();

  const defaultTitle =
    "Residential Project Interior Portfolio : High creation Interior";
  const defaultDesc =
    "Every home has a story, and we are proud to help bring it to life. Explore our portfolio of beautifully designed residential interiors, where stunning design, modern functionality, and meticulous attention to detail come together seamlessly. ";
  const defaultCanonical = "https://hcinterior.in/residential-projects";

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
export default async function ResidentialProjects({ searchParams }) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;

  const { data: projects, meta } = await getResidentialProjects(currentPage);
  const totalPages = meta?.totalPages || 1;

  const headingData = await getHeadingDescriptionData();

  const HeadingTag = headingData?.headingTag || "h1";
const headingText = headingData?.headingText || "Residential Projects";
const headingStyle = {
  textShadow: "none",
  fontFamily: "inherit",
  ...(headingData?.headingColor && { color: headingData.headingColor }),
};

const descriptionText =
  headingData?.descriptionText ||
  "Explore a curated selection of premium living room interior designs and décor ideas at High Creation. We offer customizable, functional, and stylish solutions to elevate your living space. From modular TV units to wall art and innovative wall designs, find all the inspiration you need to transform your living room. Start browsing today to discover designs that perfectly reflect your personal style."
const descriptionStyle = {
  ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
};

  return (
    <MainLayout>
      <main>
        {/* EXACT ORIGINAL HERO SECTION RESTORED */}
        <section className="container my-5">
          <div className="text-center mb-5">
            <HeadingTag id="residential-projects-heading" className="wallpaperHeading" style={headingStyle}>
  {headingText}
</HeadingTag>
<p id="residential-projects-description" className="px-lg-5 fs-6 text-muted" style={descriptionStyle}>
  {descriptionText}
</p>
<style>{`
  ${headingData?.headingColor ? `#residential-projects-heading { color: ${headingData.headingColor} !important; }` : ""}
  ${headingData?.descriptionColor ? `#residential-projects-description { color: ${headingData.descriptionColor} !important; }` : ""}
  ${headingData?.descriptionFontSize ? `#residential-projects-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
`}</style>
          </div>
        </section>

        {/* Modernized Projects Grid */}
        <section className="resi_card">
          <div className="container">
            <div className="row mx-0 g-4">
              {projects && projects.length > 0 ? (
                projects.map((project, index) => (
                  <div key={index} className="col-lg-4 col-md-6 col-sm-12">
                    <ResidentialCard
                      projectCardLink={`/residential-projects/project-gallery?id=${project.id}`}
                      cardNameResid="card_product"
                      resiImgUrl={project.image}
                      resiImgALt={project.title ?? defaultAltText}
                      resiImgClass={"resi_img"}
                      residentialTitle={project.title}
                      residentialTitleClass="product_heading h4"
                      // residentialDescriptiion={project.description}
                      residentialClassCss="team_designation"
                      residentialButton="Explore Design"
                      residentialButtonUrl={`/residential-projects/project-gallery?id=${project.id}`}
                    />
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <div className="p-5 bg-white rounded-4 shadow-sm">
                    <h3 className="text-muted">New designs coming soon.</h3>
                    <p>We are currently updating our portfolio.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modern Pagination Controls */}
            {totalPages > 1 && (
              <nav aria-label="Project pagination" className="mt-5 pt-4">
                <style>{`
                  @media (max-width: 768px) {
                    .mobile-wrap-pagination {
                      flex-wrap: wrap !important;
                    }
                    .mobile-full-width {
                      flex: 0 0 100%;
                      display: flex;
                      justify-content: center;
                      margin-bottom: 15px;
                    }
                    .mobile-full-width:last-child {
                      margin-bottom: 0;
                      margin-top: 15px;
                    }
                  }
                `}</style>
                <ul className="pagination pagination-lg justify-content-center gap-2 mobile-wrap-pagination">
                  <li className={`page-item mobile-full-width ${currentPage === 1 ? "disabled" : ""}`}>
                    <a
                      className="page-link rounded-pill px-4 border-0 shadow-sm"
                      href={currentPage > 1 ? `/residential-projects?page=${currentPage - 1}` : "#"}
                      aria-disabled={currentPage === 1}
                    >
                      Previous
                    </a>
                  </li>

                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <li key={index} className={`page-item ${currentPage === pageNum ? "active" : ""}`}>
                        <a
                          className={`page-link rounded-circle border-0 shadow-sm ${currentPage === pageNum ? 'bg-dark text-white' : ''}`}
                          style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          href={`/residential-projects?page=${pageNum}`}
                        >
                          {pageNum}
                        </a>
                      </li>
                    );
                  })}

                  <li className={`page-item mobile-full-width ${currentPage === totalPages ? "disabled" : ""}`}>
                    <a
                      className="page-link rounded-pill px-4 border-0 shadow-sm"
                      href={currentPage < totalPages ? `/residential-projects?page=${currentPage + 1}` : "#"}
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