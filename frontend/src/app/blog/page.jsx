import React from "react";
import { format } from "date-fns"; 
import MainLayout from "../layouts/MainLayout";
import Image from "next/image";
import Link from "next/link";
import { defaultAltText } from "@/utils/helper";
import { FaArrowRight, FaCalendarAlt, FaUserCircle } from "react-icons/fa";

// 🌟 IMPORT OUR GLOBAL PREMIUM TEXT EXPANDER
import ExpandableRichText from "../components/ModernPara";

export const dynamic = "force-dynamic";
export const revalidate = 60; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apidev.hcinterior.in";

// --- Dynamic Metadata for Pagination ---
export async function generateMetadata({ searchParams }) {
  const page = searchParams?.page || "1";
  const canonicalUrl = page === "1" 
    ? "https://hcinterior.in/blog" 
    : `https://hcinterior.in/blog?page=${page}`;

  return {
    title: "Latest News And Updates | High Creation Interior",
    description: "Latest News & Updates From High Creation Interior In Noida. Discover premium interior design blogs and insights.",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

// --- HELPER: Fetch Blogs Data ---
async function getBlogsData(page) {
  try {
    const res = await fetch(`${API_BASE_URL}/cms-blog?page=${page}`, { 
      next: { revalidate: 60 } 
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Blogs Fetch Error:", err);
    return [];
  }
}

async function getHeadingDescriptionData() {
  try {
    const res = await fetch(`${API_BASE_URL}/cms-content/manage_heading_description`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const record = await res.json();
    const data = Array.isArray(record) ? record[0] : record;
    return data?.json_content?.sections?.blogs || null;
  } catch (err) {
    console.error("Heading/Description Fetch Error:", err);
    return null;
  }
}

// --- MAIN SERVER COMPONENT ---
export default async function Blog({ searchParams }) {
  const page = searchParams?.page || "1";
  const rawBlogs = await getBlogsData(page);
  
  // Filter out draft/inactive blogs
  const allBlogs = rawBlogs.filter(blog => {
    if (blog.status === undefined || blog.status === null) return true;
    const status = String(blog.status).toLowerCase().trim();
    return status !== "draft" && status !== "inactive" && status !== "0";
  });

  // Featured blog logic (only show featured post on page 1)
  const isPageOne = page === "1";
  const featuredBlog = (isPageOne && allBlogs.length > 0) ? allBlogs[0] : null;
  const regularBlogs = featuredBlog ? allBlogs.slice(1) : allBlogs;

    const headingData = await getHeadingDescriptionData();

const HeadingTag = headingData?.headingTag || "h1";
const headingText = headingData?.headingText || "Latest News & Updates";
const headingStyle = {
  ...(headingData?.headingColor && { color: headingData.headingColor }),
};

const descriptionText =
  headingData?.descriptionText ||
  "Explore our curated library of interior design trends, expert advice, and home styling tips.";
const descriptionStyle = {
  ...(headingData?.descriptionColor && { color: headingData.descriptionColor }),
  ...(headingData?.descriptionFontSize && { fontSize: `${headingData.descriptionFontSize}px` }),
};

const badgeText = headingData?.badgeText || (isPageOne ? "Design Insights" : `Page ${page}`);
const badgeStyle = {
  ...(headingData?.badgeTextColor && { color: headingData.badgeTextColor }),
  ...(headingData?.badgeBgColor && { backgroundColor: headingData.badgeBgColor }),
  ...(headingData?.badgeFontSize && { fontSize: `${headingData.badgeFontSize}px` }),
};

  // SEO Content for the bottom of the page
  const seoPageDescription = `
    <h2>The Ultimate Guide to Interior Design Trends</h2>
    <p>Designing your dream home requires a perfect balance of aesthetics, functionality, and personal style. At High Creation Interior, we believe that every space has a unique story to tell. Whether you are looking to revamp a compact apartment in Delhi or design a sprawling luxury villa in Gurgaon, understanding the core principles of interior design is essential.</p>
    <p>Our expert designers continuously explore global design trends, from minimalist Scandinavian concepts to opulent Art Deco styles. We integrate sustainable materials, smart home technology, and bespoke furniture to create environments that are not only visually stunning but also highly practical for modern living.</p>
    <h3>Why Choose Professional Interior Designers?</h3>
    <ul>
      <li><strong>Space Optimization:</strong> Maximizing every square foot of your property.</li>
      <li><strong>Cost Efficiency:</strong> Avoiding costly mistakes and sourcing materials at trade prices.</li>
      <li><strong>Flawless Execution:</strong> Managing contractors, timelines, and quality control.</li>
    </ul>
    <p>Browse through our extensive library of articles above to discover DIY tips, color psychology, lighting strategies, and much more. Let us inspire your next home transformation journey.</p>
  `;

  return (
    <MainLayout>
      {/* --- INJECT PREMIUM MODERN STYLES --- */}
      <style dangerouslySetInnerHTML={{__html: `
        :root { --hc-primary: #ff914d; --hc-dark: #0f172a; }
        .font-outfit { font-family: var(--font-outfit), sans-serif; }
        .font-poppins { font-family: var(--font-poppins), sans-serif; }
        .text-gradient { background: linear-gradient(135deg, #ff914d 0%, #ff5722 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .blog-hero-section {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 5rem 0 3rem;
          border-bottom: 1px solid #e2e8f0;
          text-align: center;
        }

        .featured-blog-card {
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.02);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .featured-blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.1);
        }

        .modern-blog-card {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .modern-blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.08);
          border-color: #e2e8f0;
        }

        .card-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 22/12;
          overflow: hidden;
        }
        .card-img-wrapper img {
          transition: transform 0.6s ease;
        }
        .modern-blog-card:hover .card-img-wrapper img,
        .featured-blog-card:hover .card-img-wrapper img {
          transform: scale(1.02);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .read-article-btn {
          color: var(--hc-dark);
          font-weight: 700;
          text-decoration: none;
          font-family: var(--font-poppins);
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.3s ease;
        }
        .read-article-btn svg {
          transition: transform 0.3s ease;
        }
        .modern-blog-card:hover .read-article-btn,
        .featured-blog-card:hover .read-article-btn {
          color: var(--hc-primary);
        }
        .modern-blog-card:hover .read-article-btn svg,
        .featured-blog-card:hover .read-article-btn svg {
          transform: translateX(5px);
        }

        .meta-text {
          font-size: 13px;
          color: #64748b;
          font-family: var(--font-poppins);
        }
      `}} />

      <main className="bg-light pb-5">
        
        {/* --- HERO SECTION --- */}
        <section className="blog-hero-section">
  <div className="container">
    <span
      id="blog-hero-badge"
      className="badge bg-dark px-3 py-2 rounded-pill mb-3 font-poppins text-uppercase tracking-wider"
      style={badgeStyle}
    >
      {badgeText}
    </span>
    <HeadingTag
      id="blog-hero-heading"
      className="font-outfit fw-bold text-dark mb-3"
      style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em', ...headingStyle }}
    >
      {headingText}
    </HeadingTag>
    <p
      id="blog-hero-description"
      className="font-poppins text-muted mx-auto fs-5"
      style={{ maxWidth: '600px', ...descriptionStyle }}
    >
      {descriptionText}
    </p>
    <style>{`
      ${headingData?.headingColor ? `#blog-hero-heading { color: ${headingData.headingColor} !important; }` : ""}
      ${headingData?.descriptionColor ? `#blog-hero-description { color: ${headingData.descriptionColor} !important; }` : ""}
      ${headingData?.descriptionFontSize ? `#blog-hero-description { font-size: ${headingData.descriptionFontSize}px !important; }` : ""}
      ${headingData?.badgeTextColor ? `#blog-hero-badge { color: ${headingData.badgeTextColor} !important; }` : ""}
      ${headingData?.badgeBgColor ? `#blog-hero-badge { background-color: ${headingData.badgeBgColor} !important; }` : ""}
      ${headingData?.badgeFontSize ? `#blog-hero-badge { font-size: ${headingData.badgeFontSize}px !important; }` : ""}
    `}</style>
  </div>
</section>

        <div className="container py-5">
          {allBlogs.length === 0 ? (
            <div className="text-center py-5">
              <h3 className="font-outfit text-muted">No blogs found on this page. Check back later!</h3>
              <Link href="/blog" className="btn btn-outline-dark mt-3 rounded-pill px-4">Return to First Page</Link>
            </div>
          ) : (
            <>
              {/* --- FEATURED BLOG POST (ONLY ON PAGE 1) --- */}
              {featuredBlog && (
                <div className="row mb-5 pb-4">
                  <div className="col-12">
                    <Link href={`/${featuredBlog.seo_content?.slug || `blog-detail?id=${featuredBlog.id}`}`} className="text-decoration-none">
                      <div className="featured-blog-card row g-0 align-items-center">
                        <div className="col-lg-7">
                          <div className="card-img-wrapper" style={{ aspectRatio: '10/6' }}>
                            <Image 
                              src={featuredBlog.image || "/images/Blog/blo_img1.webp"} 
                              alt={featuredBlog.image_alt || featuredBlog.title || defaultAltText}
                              fill
                              sizes="(max-width: 992px) 100vw, 60vw"
                              style={{ objectFit: 'cover' }}
                              priority
                            />
                          </div>
                        </div>
                        <div className="col-lg-5 p-4 p-lg-5">
                          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3 font-poppins text-uppercase fw-bold">
                            Featured Post
                          </span>
                          <h2 className="font-outfit fw-bold text-dark mb-3" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', lineHeight: '1.2' }}>
                            {featuredBlog.title}
                          </h2>
                          
                          <div className="meta-text d-flex align-items-center gap-3 mb-4">
                            <span className="d-flex align-items-center gap-1"><FaUserCircle size={16}/> {featuredBlog.writer_name || "HC Team"}</span>
                            <span>•</span>
                            <span className="d-flex align-items-center gap-1">
                              <FaCalendarAlt size={14}/> 
                              {featuredBlog.published_on ? format(new Date(featuredBlog.published_on), "MMM dd, yyyy") : "Recent"}
                            </span>
                          </div>

                          <div 
                            className="text-muted font-poppins line-clamp-3 mb-4 fs-6" 
                            dangerouslySetInnerHTML={{ __html: featuredBlog.description || "" }} 
                          />
                          
                          <span className="read-article-btn">
                            Read Full Article <FaArrowRight />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}

              {/* --- REGULAR BLOGS GRID --- */}
              {regularBlogs.length > 0 && (
                <>
                  <h3 className="font-outfit fw-bold text-dark mb-4 h2">More Articles</h3>
                  <div className="row g-4">
                    {regularBlogs.map((blog, index) => (
                      <div className="col-md-6 col-lg-4" key={blog.id || index}>
                        <Link href={`/${blog.seo_content?.slug || `blog-detail?id=${blog.id}`}`} className="text-decoration-none">
                          <div className="modern-blog-card">
                            <div className="card-img-wrapper">
                              <Image 
                                src={blog.image || "/images/Blog/blo_img1.webp"} 
                                alt={blog.image_alt || blog.title || defaultAltText}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div className="p-4 d-flex flex-column flex-grow-1">
                              <div className="meta-text d-flex justify-content-between align-items-center mb-3">
                                <span className="text-uppercase fw-bold text-gradient" style={{ fontSize: '11px', letterSpacing: '1px' }}>
                                  {blog.category || "Design"}
                                </span>
                                <span>
                                  {blog.published_on ? format(new Date(blog.published_on), "MMM dd, yyyy") : "Recent"}
                                </span>
                              </div>
                              
                              <h4 className="font-outfit fw-bold text-dark h5 mb-3 line-clamp-2" style={{ lineHeight: '1.4' }}>
                                {blog.title}
                              </h4>
                              
                              <div className="mt-auto pt-3 border-top">
                                <span className="read-article-btn">
                                  Continue Reading <FaArrowRight />
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  
                  {/* Basic Pagination Logic Note: Depending on your API, you might map out page links here */}
                  <div className="d-flex justify-content-center mt-5">
                      {page !== "1" && (
                          <Link href={`/blog?page=${Number(page) - 1}`} className="btn btn-outline-dark rounded-pill px-4 mx-2">Previous Page</Link>
                      )}
                      {/* You can show a Next button if regularBlogs.length matches your API page size (e.g., 9 or 10) */}
                      {regularBlogs.length >= 8 && (
                          <Link href={`/blog?page=${Number(page) + 1}`} className="btn btn-dark rounded-pill px-4 mx-2">Next Page</Link>
                      )}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* --- SEO CONTENT SECTION UTILIZING ExpandableRichText --- */}
        {/* <div className="container mt-5 pt-4">
          <div className="bg-white p-4 p-lg-5 rounded-4 border shadow-sm">
            <div className="d-flex align-items-center gap-3 mb-4">
              <h2 className="font-outfit fw-bold m-0">About High Creation Blog</h2>
            </div> */}
            {/* 🌟 THIS IS WHERE WE USE THE GOD TIER EXPANDABLE PARAGRAPH COMPONENT 🌟 */}
            {/* <ExpandableRichText htmlContent={seoPageDescription} maxHeight={160} className="rich-text-content font-poppins text-muted" />
          </div>
        </div> */}

      </main>
      <hr className="m-0" />
    </MainLayout>
  );
}