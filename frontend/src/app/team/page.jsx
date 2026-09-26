import TeamGallery from "../components/TeamGallery";
import MainLayout from "../layouts/MainLayout";
import BackgroundImageRow from "../components/BackgroundImageRow";
import TeamMediaGallery from "../components/TeamMediaGallery";

// --- CONFIGURATION ---
export const revalidate = 60; // Regenerate page every 60 seconds

// --- HELPER: Base URL Logic ---
const getBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;
};

// --- HELPER: Fetch SEO Data ---
async function getSeoData() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/seo-tag`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const allTags = await res.json();

    // Match the specific page URL for the Team page
    if (Array.isArray(allTags)) {
      return allTags.find(
        (tag) =>
          tag.page_name === "https://hcinterior.in/team" ||
          tag.page_name?.endsWith("/team")
      );
    }
    return null;
  } catch (err) {
    console.error("SEO Fetch Error:", err);
    return null;
  }
}

async function getBannerData() {
  try {
    const baseURL = getBaseUrl();
    console.log("BANNER FETCH URL:", `${baseURL}/cms-gallery-design/manage-banner`);
    const res = await fetch(`${baseURL}/cms-gallery-design/manage-banner?key=team`, {
      cache: "no-store",
      headers: { Connection: "close" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    console.log("BANNER DATA RECEIVED:", data);
    return data;
  } catch (err) {
    console.error("Banner Fetch Error:", err);
    return null;
  }
}

async function getTeamPageMedia() {
  try {
    const baseURL = getBaseUrl();
    const res = await fetch(`${baseURL}/cms-content/team_page_media`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

// --- DYNAMIC METADATA GENERATION ---
export async function generateMetadata() {
  const seoData = await getSeoData();

  const defaultTitle = "Step Into The Team's Gallery Of High Creation Interior";
  const defaultDesc =
    "Team of expert interior designers in Noida & Delhi NCR · High Creation Interior Team · Noida & Delhi NCR";
  const defaultCanonical = "https://hcinterior.in/team";

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
export default async function TeamGallerys() {

  const bannerRecord = await getBannerData();
const bgHeading = bannerRecord?.banner_heading || "Teams";
const bgDescription = bannerRecord?.banner_description || "Great design starts with great people—meet our passionate designers, planners, and innovators who turn ideas into beautiful interiors and dreams into reality.";

const teamPageMedia = await getTeamPageMedia();
const teamMediaItems = teamPageMedia?.json_content?.items || [];
const hasMedia = teamMediaItems.length > 0;
  return (
    <MainLayout>
      <main>
        {/* 1. RESTORED ORIGINAL IMAGE BANNER */}
        {/* <BackgroundImageRow
          sectionBgImages={"sectionbg teamsImage"}
          sectionBgHeading="Teams"
          secBgHeadingClass="sec_bgheading_lass"
          sectionBgDescription="Great design starts with great people—meet our passionate designers, planners, and innovators who turn ideas into beautiful interiors and dreams into reality. "
          secBgDesClass="secbgbesclass"
        /> */}

        <BackgroundImageRow
          sectionBgImages={"contact_wrapper teamsImage"}
          sectionBgHeading={bgHeading}
          secBgHeadingClass="sec_bgheading_lass"
          sectionBgDescription={bgDescription}
          secBgDesClass="secbgbesclass"
          bgImageUrl={bannerRecord?.banner_image}
headingTag={bannerRecord?.banner_heading_tag || "h1"}
descriptionFontSize={bannerRecord?.banner_description_font_size || 16}
sectionBgHeadingStyle={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
  sectionBgDescriptionStyle={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
        />
        {/* <style dangerouslySetInnerHTML={{__html: `
  .team-media-image {
    width: 100%;
    height: 450px;
    object-fit: cover;
    display: block;
  }
  @media (max-width: 768px) {
    .team-media-image {
      height: auto;
      aspect-ratio: 16 / 9;
    }
  }
`}} /> */}

<style dangerouslySetInnerHTML={{__html: `
  .team-media-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  // .team-media-video,
  // .team-media-image {
  //   width: 100%;
  //   height: 450px;
  //   object-fit: contain;
  //   display: block;
  //   border-radius: 15px;
  //   overflow: hidden;
  // }

  .team-media-video,
  .team-media-image {
    width: 100%;
    height: 360px;
    display: block;
    border-radius: 15px;
  }
  .team-media-description {
    margin-top: 8px;
    font-size: 14px;
    color: #555;
    white-space: pre-line;
  }
  @media (min-width: 768px) {
    .team-media-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 768px) {
    .team-media-video,
    .team-media-image {
      height: auto;
      aspect-ratio: 16 / 9;
    }
  }

  // .team-media-cell {
  //   position: relative;
  // }
  // .team-media-overlay {
  //   position: absolute;
  //   inset: 0;
  //   background: rgba(0, 0, 0, 0.35);
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   opacity: 0;
  //   cursor: pointer;
  //   border-radius: 15px;
  //   transition: opacity 0.2s ease;
  // }

  .team-media-box {
    position: relative;
    width: 100%;
    line-height: 0;
    cursor: pointer;
  }

  .team-media-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    cursor: pointer;
    border-radius: 15px;
    transition: opacity 0.2s ease;
  }
  // .team-media-cell:hover .team-media-overlay {
  //   opacity: 1;
  // }
  .team-media-box:hover .team-media-overlay {
    opacity: 1;
  }
  .team-media-viewfull {
    padding: 12px 24px;
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 999px;
    font-size: 18px;
    font-weight: 500;
    backdrop-filter: blur(2px);
  }
  .team-media-lightbox {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.92);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .team-media-lightbox-content {
    max-width: 90vw;
    max-height: 85vh;
  }
  .team-media-lightbox-media {
    max-width: 90vw;
    max-height: 85vh;
    object-fit: contain;
    display: block;
    margin: 0 auto;
  }
  .team-media-lightbox-close {
    position: absolute;
    top: 20px;
    right: 30px;
    background: none;
    border: none;
    color: #fff;
    font-size: 36px;
    cursor: pointer;
  }
  .team-media-lightbox-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    font-size: 22px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    cursor: pointer;
  }
  .team-media-lightbox-arrow.left {
    left: 20px;
  }
  .team-media-lightbox-arrow.right {
    right: 20px;
  }
  .team-media-lightbox-counter {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-size: 14px;
  }
  // @media (max-width: 768px) {
  //   .team-media-overlay {
  //     opacity: 1;
  //     background: transparent;
  //   }
  //   .team-media-viewfull {
  //     display: none;
  //   }
  // }
`}} />

        {/* 2. CLEAR VIDEO SECTION (No dark overlays, no blurry stretching) */}
        {/* <section className="container my-5">
          <div 
            className="video-container shadow-lg" 
            style={{ borderRadius: "15px", overflow: "hidden", backgroundColor: "#000" }}
          >
            <video
              width="100%"
              autoPlay
              loop
              muted
              playsInline
              controls // Adds play/pause buttons for the user
              style={{ display: "block", maxHeight: "70vh", objectFit: "contain" }}
            >
              <source src={teamVideoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section> */}

        {/* 2. CLEAR VIDEO/IMAGE SECTION (No dark overlays, no blurry stretching) */}
{/* <section className="container my-5"> */}
  {/* {hasMedia ? (
    <div className="row g-4"> */}
      {/* {teamMediaItems.map((item, idx) => (
        <div className="col-md-6" key={idx}>
          {item.video ? (
            <div
              className="video-container shadow-lg"
              style={{ borderRadius: "15px", overflow: "hidden", backgroundColor: "#000" }}
            >
              <video
                width="100%"
                autoPlay
                loop
                muted
                playsInline
                controls
                style={{ display: "block", maxHeight: "70vh", objectFit: "contain" }}
              >
                <source src={item.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : item.image ? (
            <img
              src={item.image}
              alt="Team media"
              className="img-fluid rounded-3 shadow-lg"
              style={{ width: "100%", maxHeight: "70vh", objectFit: "cover" }}
            />
          ) : null}
        </div>
      ))} */}

      {/* {teamMediaItems.map((item, idx) => (
  <div className="col-md-6" key={idx}>
    {item.type === 'video' ? (
      <div
        className="video-container shadow-lg"
        style={{ borderRadius: "15px", overflow: "hidden", backgroundColor: "#000" }}
      >
        <video
          width="100%"
          autoPlay
          loop
          muted
          playsInline
          controls
          style={{ display: "block", maxHeight: "70vh", objectFit: "contain" }}
        >
          <source src={item.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    ) : item.type === 'image' ? (
      <img
        src={item.url}
        alt="Team media"
        className="img-fluid rounded-3 shadow-lg"
        style={{ width: "100%", maxHeight: "70vh", objectFit: "cover" }}
      />
    ) : null}
  </div>
))}
    </div>
  ) : (
    <div
      className="video-container shadow-lg"
      style={{ borderRadius: "15px", overflow: "hidden", backgroundColor: "#000" }}
    >
      <video
        width="100%"
        autoPlay
        loop
        muted
        playsInline
        controls
        style={{ display: "block", maxHeight: "70vh", objectFit: "contain" }}
      >
        <source src="/team.MP4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )}
</section> */}

{/* <section className="container my-5">
  {teamMediaItems
    .filter((item) => item.type === 'video')
    .map((item, idx) => (
      <div
        key={`video-${idx}`}
        className="video-container shadow-lg mb-4 w-100"
        style={{ borderRadius: "15px", overflow: "hidden", backgroundColor: "#000" }}
      >
        <video
          width="100%"
          autoPlay
          loop
          muted
          playsInline
          controls
          style={{ display: "block", width: "100%", maxHeight: "70vh", objectFit: "contain" }}
        >
          <source src={item.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    ))}

    {teamMediaItems
  .filter((item) => item.type === 'image')
  .map((item, idx) => (
    <div key={`image-${idx}`} className="mb-4">
      <img
        src={item.url}
        alt="Team media"
        className="img-thumbnail team-media-image"
        loading="lazy"
        decoding="async"
      />
    </div>
  ))}

  {!hasMedia && (
    <div
      className="video-container shadow-lg w-100"
      style={{ borderRadius: "15px", overflow: "hidden", backgroundColor: "#000" }}
    >
      <video
        width="100%"
        autoPlay
        loop
        muted
        playsInline
        controls
        style={{ display: "block", width: "100%", maxHeight: "70vh", objectFit: "contain" }}
      >
        <source src="/team.MP4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )}
</section> */}

<section className="container my-5">
  {/* <div className="team-media-grid">
    {teamMediaItems
      .filter((item) => item.type === 'video')
      .map((item, idx) => (
        <div key={`video-${idx}`}>
          <video
            className="team-media-video"
            autoPlay
            loop
            muted
            playsInline
            controls
          >
            <source src={item.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {item.description && (
            <p className="team-media-description">{item.description}</p>
          )}
        </div>
      ))}

    {teamMediaItems
      .filter((item) => item.type === 'image')
      .map((item, idx) => (
        <div key={`image-${idx}`}>
          <img
            src={item.url}
            alt="Team media"
            className="img-thumbnail team-media-image"
            loading="lazy"
            decoding="async"
          />
          {item.description && (
            <p className="team-media-description">{item.description}</p>
          )}
        </div>
      ))}
  </div> */}
  {hasMedia && (
  <TeamMediaGallery
    items={[
      ...teamMediaItems.filter((item) => item.type === "video"),
      ...teamMediaItems.filter((item) => item.type === "image"),
    ]}
  />
)}

  {!hasMedia && (
    <div
      className="video-container shadow-lg w-100"
      style={{ borderRadius: "15px", overflow: "hidden", backgroundColor: "#000" }}
    >
      <video
        width="100%"
        autoPlay
        loop
        muted
        playsInline
        controls
        style={{ display: "block", width: "100%", maxHeight: "70vh", objectFit: "contain" }}
      >
        <source src="/team.MP4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )}
</section>

        {/* 3. TEAM GALLERY */}
        <TeamGallery 
  galleryImage={hasMedia ? null : "images/teams.jpeg"} 
  showFallback={!hasMedia} 
/>
      </main>
    </MainLayout>
  );
}