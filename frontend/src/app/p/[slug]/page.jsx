import MainLayout from "@/app/layouts/MainLayout";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { FaPlus } from "react-icons/fa";

import { 
  generateOrganizationSchema, 
  generateLocalBusinessSchema, 
  generateBreadcrumbSchema, 
  generateFAQSchema 
} from "@/utils/schemaGenerator";
import { getCanonicalUrl, getRobotsDirectives } from "@/utils/seoHelpers";
import { getPageSEO } from "@/utils/getSEO"; 

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";

const isValidSlug = (slug) => {
  if (!slug || slug === "undefined" || slug === "null" || slug.includes(".")) return false;
  return true;
};

const isDraftStatus = (data) => {
  if (!data) return true;
  if (data.status === undefined || data.status === null) return false; 
  const status = String(data.status).toLowerCase().trim();
  return status === "draft" || status === "inactive" || status === "0";
};

async function getCmsBasicPageData(slug) {
  try {
    const timestamp = new Date().getTime();
    const res = await fetch(`${API_BASE_URL}/cms-basic-pages/slug/${slug}?t=${timestamp}`, {
      cache: "no-store", 
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
    });
    if (!res.ok) return null;
    let data = await res.json();
    return data || null;
  } catch (error) { return null; }
}

export async function generateMetadata({ params }) {
  headers();
  const slug = params.slug;

  if (!isValidSlug(slug)) return { title: "Not Found", robots: { index: false, follow: true } };

  const [cmsData, seoData] = await Promise.all([
    getCmsBasicPageData(slug).catch(() => null),
    getPageSEO(`/p/${slug}`).catch(() => null)
  ]);

  if (!cmsData || isDraftStatus(cmsData)) return { title: "Not Found", robots: { index: false, follow: true } };

  const robots = seoData?.robots || getRobotsDirectives(cmsData?.seo_content);
  const canonicalUrl = getCanonicalUrl({
    canonicalUrl: seoData?.alternates?.canonical || cmsData?.seo_content?.canonical_url,
    fallbackPath: `/p/${slug}`,
  });

  return {
    title: seoData?.title || cmsData?.seo_content?.meta_title || cmsData?.title || "HC Interior",
    description: seoData?.description || cmsData?.seo_content?.meta_description || "",
    keywords: seoData?.keywords || cmsData?.seo_content?.meta_keywords || "",
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

const BasicPageLayout = async ({ params }) => {
  headers();
  const slug = params.slug;

  if (!isValidSlug(slug)) notFound();

  const pageData = await getCmsBasicPageData(slug);
  if (!pageData || isDraftStatus(pageData)) notFound();

  const faqs = parseJsonSafe(pageData.faqs);
  const accordions = parseJsonSafe(pageData.accordions);

  return (
    <MainLayout>
      <style dangerouslySetInnerHTML={{__html: `
        :root { --hc-primary: #ff914d; --hc-dark: #0f172a; }
        .basic-page-wrapper { width: 100%; margin: 0; padding: 0; background-color: #ffffff; font-family: var(--font-poppins), sans-serif; }
        .ck-content { width: 100%; word-break: break-word; }
        .ck-content img { max-width: 100%; height: auto; border-radius: 8px; }
        .ck-content figure { margin: 2rem auto; text-align: center; display: flex; justify-content: center; }
        .ck-content h1, .ck-content h2, .ck-content h3 { font-family: var(--font-outfit), sans-serif; color: var(--hc-dark); }
        .ck-content p { line-height: 1.8; color: #475569; }
        .faq-premium-item { border: none !important; margin-bottom: 16px; border-radius: 16px !important; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04); background: #ffffff; border: 1px solid #f1f5f9 !important; }
        .faq-premium-btn { width: 100%; text-align: left; background: white; border: none; padding: 24px; font-weight: 700; font-size: 1.1rem; color: var(--hc-dark); display: flex; justify-content: space-between; align-items: center; box-shadow: none !important; }
        .faq-premium-btn::after { display: none !important; }
        .faq-premium-btn:not(.collapsed) { color: var(--hc-primary); background: #fffcf9; }
        .faq-icon-toggle { transition: transform 0.3s ease; color: var(--hc-primary); flex-shrink: 0; }
        .faq-premium-btn:not(.collapsed) .faq-icon-toggle { transform: rotate(45deg); color: #ff5722; }
        .faq-premium-body { padding: 0 24px 20px; color: #475569; line-height: 1.7; background: #fffcf9; }
      `}} />

      <main className="basic-page-wrapper pb-5">
        <div className="ck-content" dangerouslySetInnerHTML={{ __html: pageData.content }} />

        {/* Dynamic Render for FAQs */}
        {faqs.length > 0 && (
          <section className="container my-5">
             <h2 className="font-outfit fw-bold h3 mb-4 text-center">Frequently Asked Questions</h2>
             <div className="row justify-content-center"><div className="col-lg-10">
              <div className="accordion" id={`accordion-faq-${pageData?.id}`}>
                {faqs.map((faq, index) => (
                  <div className="accordion-item faq-premium-item" key={index}>
                    <h2 className="accordion-header">
                      <button className={`accordion-button faq-premium-btn ${index !== 0 ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`}>
                        <span className="pe-3">{faq.question}</span><FaPlus className="faq-icon-toggle flex-shrink-0" />
                      </button>
                    </h2>
                    <div id={`collapse${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent={`#accordion-faq-${pageData?.id}`}>
                      <div className="accordion-body faq-premium-body" style={{ whiteSpace: 'pre-line' }}>{faq.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div></div>
          </section>
        )}
      </main>
    </MainLayout>
  );
};

export default BasicPageLayout;