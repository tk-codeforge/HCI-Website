import BackgroundImageWithHeading from "../components/BackgroundImageWithHeading";
import MainLayout from "../layouts/MainLayout";

// Local fallback images — used only until a block is given an image via the CMS,
// or if the CMS hasn't been saved to yet at all. Nothing else changes about them.
const interiorDesignPlanningImg = "/images/what_we_offer/interior-design-planning.avif";
const customInteriorDesignImg = "/images/what_we_offer/custom-interior-design.avif";
const furnitureDecorImg = "/images/what_we_offer/furniture-decor.avif";
const kitchenInteriorDesignImg = "/images/what_we_offer/kitchen-interior-design.avif";

export const revalidate = 60;

const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

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
          tag.page_name === "https://hcinterior.in/what-we-offer" ||
          tag.page_name?.endsWith("/what-we-offer")
      );
    }
    return null;
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}


async function getWhatWeOfferContent() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/redirect_what_we_offer`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const record = Array.isArray(data) ? data[0] : data;
    return record?.json_content || null;
  } catch (err) {
    console.error("What We Offer Content Fetch Error:", err);
    return null;
  }
}

// useEffect(() => {
//     // Assuming your state variable is called 'dynamicOffers' or similar
//     if (dynamicOffers.length > 0 && window.location.hash) {
//       const id = window.location.hash.replace('#', '');
      
//       requestAnimationFrame(() => {
//         const element = document.getElementById(id);
//         if (element) {
//           element.scrollIntoView({ behavior: 'smooth' });
//         }
//       });
//     }
//   }, [dynamicOffers]);

export async function generateMetadata() {
  const seoData = await getSeoData();
  const defaultTitle = "What We Offer - High Creation Interior";
  const defaultDesc =
    "Explore the comprehensive interior design services offered by High Creation Interior.";
  const defaultCanonical = "https://hcinterior.in/what-we-offer";

  return {
    title: seoData?.title || defaultTitle,
    description: seoData?.meta_description || defaultDesc,
    alternates: { canonical: seoData?.page_name || defaultCanonical },
    openGraph: {
      title: seoData?.title || defaultTitle,
      description: seoData?.meta_description || defaultDesc,
      url: seoData?.page_name || defaultCanonical,
      type: "website",
    },
  };
}

const FALLBACK_IMAGES = [
  interiorDesignPlanningImg,
  customInteriorDesignImg,
  furnitureDecorImg,
  kitchenInteriorDesignImg,
];


const FALLBACK_OFFERINGS = [
  {
    title: "Interior Design & Planning",
    points: [
      "We listen to your ideas and understand how you want your home to feel.",
      "We create a clear design plan before work begins, so everything stays organized.",
      "Our team helps you choose the right layouts, materials, and finishes with confidence.",
      "The result is a home that looks beautiful and works perfectly for your everyday life.",
    ],
  },
  {
    title: "Custom Interior Design",
    points: [
      "Your home is designed around your personality, not a fixed template.",
      "Every colour, texture, and detail is selected to match your preferences.",
      "We make sure every room reflects the way you live and use the space.",
      "Our designers balance creativity with practical solutions for daily living.",
      "Every design is made exclusively for you, giving your home a unique identity.",
    ],
  },
  {
    title: "Furniture & Decor",
    points: [
      "We help you select furniture that fits your home without making it feel crowded.",
      "Every decor element is chosen to complement your home's overall design.",
      "We focus on creating a space that feels warm, welcoming, and complete.",
      "From lighting to accessories, every detail is carefully coordinated.",
      "Our selections add personality to your home while keeping it functional and elegant.",
    ],
  },
  {
    title: "Kitchen Interior Design",
    points: [
      "We design kitchens that make cooking and daily tasks easier.",
      "Smart storage solutions help keep your kitchen neat and organized.",
      "Every layout is planned for smooth movement and maximum convenience.",
      "We use durable materials that are easy to maintain and built to last.",
      "Your kitchen is designed to bring together style, comfort, and everyday practicality.",
    ],
  },
];

export default async function WhatWeOffer() {
  const cmsContent = await getWhatWeOfferContent();

  // ---- Banner (managed via CMS, falls back to the original static copy) ----
  const bannerHeading = cmsContent?.bannerHeading || "What We Offer";
  const bannerDescription =
    cmsContent?.bannerDescription ||
    "We provide bespoke interior design solutions tailored to your vision.";
  const bannerBgImage = cmsContent?.bg_image || "";

  // ---- Content blocks (managed via CMS, falls back to the original static copy) ----
  const cmsSections = Array.isArray(cmsContent?.sections) ? cmsContent.sections : [];

  const OFFERINGS =
    cmsSections.length > 0
      ? cmsSections.map((section, index) => {
          const fallback = FALLBACK_OFFERINGS[index];
          const points = Array.isArray(section.points)
            ? section.points.filter(Boolean)
            : [];

          return {
            id: `section-${index + 1}`,
            title: section.heading || fallback?.title || `Offering ${index + 1}`,
            img: section.image || FALLBACK_IMAGES[index] || interiorDesignPlanningImg,
            imageSize: section.imageSize || 100,
            points: points.length ? points : fallback?.points || [],
          };
        })
      : FALLBACK_OFFERINGS.map((offer, index) => ({
          id: `section-${index + 1}`,
          title: offer.title,
          img: FALLBACK_IMAGES[index],
          imageSize: 100,
          points: offer.points,
        }));

  return (
    <MainLayout>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .what-we-offer-section {
            overflow: hidden;
            background-color: #ffffff;
          }

          .offer-row-wrapper {
            padding: 4rem 0;
            transition: all 0.3s ease;
          }

          /* 🌟 LIGHT THEME (For Offers 1, 3) */
          .offer-row-light {
            background-color: #ffffff;
          }
          .offer-row-light .offer-title {
            color: #222222;
          }
          .offer-row-light .offer-list li {
            color: #555555;
          }

          /* 🌟 DARK THEME (For Offers 2, 4) */
          .offer-row-dark {
            background-color: #1a1a1a;
          }
          /* This strictly guarantees the heading is white in the dark sections */
          .offer-row-dark .offer-title {
            color: #ffffff !important;
          }
          .offer-row-dark .offer-list li {
            color: #e0e0e0;
          }

          .offer-title {
            font-family: var(--font-outfit), sans-serif;
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            line-height: 1.2;
          }

          .offer-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .offer-list li {
            position: relative;
            padding-left: 35px;
            margin-bottom: 1rem;
            font-family: var(--font-poppins), sans-serif;
            font-size: 1.05rem;
            line-height: 1.6;
          }

          /* Custom Brand-Colored Checkmarks */
          .offer-list li::before {
            content: '✔';
            position: absolute;
            left: 0;
            top: 2px;
            color: #ff914d;
            font-size: 1.1rem;
            background: rgba(255, 145, 77, 0.15);
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          }

          /* Sizing constraints for the icons/images */
          .offer-img-container {
          aspect-ratio: 4 / 3;
            text-align: center;
            padding: 1rem;
          }

          .offer-img {
            width: 100%;
            /* 🌟 NEW: --img-scale defaults to 1, so unless the CMS sets a custom
               Image Resize (%) for a block, this resolves to max-width: 450px,
               exactly as before. */
            max-width: calc(450px * var(--img-scale, 1));
            height: auto;
            object-fit: contain;
            border-radius: 1rem;
            transition: transform 0.4s ease;
          }

          .offer-img:hover {
            transform: translateY(-10px);
          }

          .what-we-offer-section .force-white-heading {
  color: var(--wwo-heading-color, #ffffff) !important;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9), 0 3px 12px rgba(0, 0, 0, 0.75);
}

.what-we-offer-section .text-center.bg-transparent {
  color: var(--wwo-description-color, #ffffff) !important;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9), 0 3px 12px rgba(0, 0, 0, 0.75);
  font-size: 1.25rem;
}

.what-we-offer-section.wwo-custom-bg .what_we_offer_banner {
  background-image: var(--wwo-bg-image) !important;
  background-size: cover !important;
  background-position: center !important;
}


          /* Mobile Adjustments */
          @media (max-width: 767px) {
            .offer-row-wrapper { padding: 3rem 0; }
            .offer-title { font-size: 1.6rem; }
            .offer-list li { font-size: 0.95rem; margin-bottom: 0.8rem; }

            /* 🌟 NEW: same --img-scale variable, so resizing still respects
               the mobile breakpoint instead of overriding it. */
            .offer-img { max-width: calc(280px * var(--img-scale, 1)); }
          }
        `,
        }}
      />

      <main
  className={`what-we-offer-section ${bannerBgImage ? "wwo-custom-bg" : ""}`}
  style={{
    "--wwo-heading-color": cmsContent?.bannerHeadingColor || "#ffffff",
    "--wwo-description-color": cmsContent?.bannerDescriptionColor || "#ffffff",
    ...(bannerBgImage ? { "--wwo-bg-image": `url(${bannerBgImage})` } : {}),
  }}
>
        <BackgroundImageWithHeading
          sectionBgImages={"contact_wrapper what_we_offer_banner"}
          sectionBgHeading={bannerHeading}
          secBgHeadingClass="sec_bgheading_lass force-white-heading"
          sectionBgDescription={bannerDescription}
          secBgDesClass={"text-center bg-transparent"}
        />

        {OFFERINGS.map((offer, index) => {
          const isDarkTheme = index % 2 !== 0;
          const isImageLeft = !isDarkTheme;

          return (
            <div
              className={`offer-row-wrapper ${
                isDarkTheme ? "offer-row-dark" : "offer-row-light"
              }`}
              id={offer.id}
              key={offer.id}
            >
              <div className="container">
                <div className="row align-items-center">
                  {/* IMAGE COLUMN */}
                  <div
                    className={`col-12 col-md-5 ${
                      isImageLeft ? "order-1 order-md-1" : "order-1 order-md-2"
                    }`}
                  >
                    <div className="offer-img-container">
                      <img
                        src={offer.img}
                        alt={offer.title}
                        className="offer-img"
                        style={{ "--img-scale": offer.imageSize / 100 }}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* SPACING COLUMN FOR DESKTOP */}
                  <div className="d-none d-md-block col-md-1 order-md-1"></div>

                  {/* TEXT COLUMN */}
                  <div
                    className={`col-12 col-md-6 mt-4 mt-md-0 ${
                      isImageLeft ? "order-2 order-md-2" : "order-2 order-md-1"
                    }`}
                  >
                    <div className="offer-content px-2 px-md-0">
                      <h2 className="offer-title">{offer.title}</h2>

                      <ul className="offer-list">
                        {offer.points.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </MainLayout>
  );
}
