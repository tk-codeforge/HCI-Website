import dynamic from "next/dynamic";
import { 
  FaShieldAlt, FaClock, FaCheckCircle, FaHome, 
  FaMapMarkerAlt, FaGem, FaUser, FaTools, 
  FaStar, FaAward, FaTrophy
} from "react-icons/fa";

const ICON_MAP = {
  FaShieldAlt, FaClock, FaCheckCircle, FaHome, 
  FaMapMarkerAlt, FaGem, FaUser, FaTools, 
  FaStar, FaAward, FaTrophy
};
import React, { Fragment } from "react"; 

// --- CLIENT IMPORTS ---
import LazySection from "./clientHome/LazySection";
import ContactForm from "./clientHome/ContactForm";

import CarouselRow from "./clientHome/CarouselRow";
import PopCarousel from "./clientHome/PopCarousel";
import FactoryImageSlider from "./clientHome/FactoryImageSlider";

// --- SERVER IMPORTS ---
import RowImage from "../components/RowImage";
import Card from "../components/Card";
import VideoCardHome from "../components/VideoCardHome";
import BgImageCard from "../components/BgImageCard";
import RoomOfice from "../components/RoomOfice";
import HomeAbout3D from "../components/HomeAbout3D";
import EstimateCalculator from "./clientHome/EstimateCalculator";
import { getBackendImageUrl } from "@/utils/leadForms";

// --- DYNAMIC IMPORTS ---
const Blogs = dynamic(() => import("../components/Blogs"));
const SliderCard = dynamic(() => import("../components/SliderCard"), { ssr: false, loading: () => <div style={{ height: "400px", background: "#f8f9fa", width: "100%" }} /> });
const VideoTestimonialSlider = dynamic(() => import("../components/VideoTestimonialSlider"), { ssr: false, loading: () => <div style={{ height: "400px", background: "#f8f9fa", width: "100%" }} /> });
const CounterRow = dynamic(() => import("../components/CounterRow"), { ssr: false, loading: () => <div style={{ height: "300px", background: "#f8f9fa", width: "100%" }} /> });

// --- DATA FETCHING WITH FETCH ---
async function getRemainingData() {
  const baseURL = process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_API_DEV_URL : process.env.NEXT_PUBLIC_API_BASE_URL;
  const fetchData = async (endpoint) => {
      try {
          const res = await fetch(`${baseURL}${endpoint}`, { next: { revalidate: 60 } });
          if (!res.ok) return [];
          const text = await res.text();
          return text ? JSON.parse(text) : [];
      } catch (e) { return []; }
  };

  try {
    const [designIdea, h3d_gallery, contentData, blogsData, whyChooseUsRaw,estimateBannerRaw , estimateCardsRaw , theWayWeWorkRaw, whatWeOfferRaw, headingManagementRaw, furnitureFactoryRaw ] = await Promise.all([
      fetchData("/cms-parent-child/designer_choice"),
      fetchData("/cms-parent-child/h3d_gallery"),
      fetchData("/cms-content/home_page_content_what_we_are"),
     
      fetchData("/cms-blog"),
      fetchData("/cms-content/home_page_content_why_choose_us"),
      fetchData("/cms-content/home_page_estimate_banner"),
      fetchData("/cms-content/home_page_estimate_cards") ,
       fetchData("/cms-content/home_page_content_the_way_we_work"),
       fetchData("/cms-content/what_we_offer"),
       fetchData("/cms-content/home_page_heading_management"),
       fetchData("/cms-content/home_page_content_furniture_factory"),
    ]);

    let whatWeOfferData = null;
    if (whatWeOfferRaw) {
      const record = Array.isArray(whatWeOfferRaw) ? whatWeOfferRaw[0] : whatWeOfferRaw;
      const json = record?.json_content || {};
      whatWeOfferData = {
        heading: json.heading || "What We Offer",
        headingColor: json.headingColor || "#23236b",
        // 🌟 NEW: eyebrow span above the heading, previously hardcoded as a
        // literal "Explore" string in JSX below with no CMS backing at all.
        spanText: json.spanText || "Explore",
        spanColor: json.spanColor || "#ff914d",
        bg_image: json.bg_image || json.image || record?.image || "",
        bgSize: json.bgSize || "cover",
        cards: Array.isArray(json.cards) ? json.cards : [],
      };
    }

let theWayWeWorkData = {
  heading: "The Way We Work",
  bg_image: "",
  cards: [],
};

if (theWayWeWorkRaw) {
  const record = Array.isArray(theWayWeWorkRaw) ? theWayWeWorkRaw[0] : theWayWeWorkRaw;
  const json = record?.json_content || {};

  theWayWeWorkData = {
    heading: json.heading || "The Way We Work",
    headingColor: json.headingColor || "#ffffff", // Extract global heading color
    bg_image: json.bg_image || "",
    bgSize: json.bgSize || "cover",               // Extract background size
    cards: Array.isArray(json.cards) ? json.cards : [],
  };
}
  
    let whyChooseUsData = { heading: "Why Choose us", headingColor: "#222222", cards: [] };
    if (whyChooseUsRaw) {
      const record = Array.isArray(whyChooseUsRaw) ? whyChooseUsRaw[0] : whyChooseUsRaw;
      const json = record?.json_content;

      if (Array.isArray(json)) {
        whyChooseUsData = { heading: "Why Choose us", headingColor: "#222222", cards: json };
      } else if (json && typeof json === "object") {
        whyChooseUsData = {
          heading: json.heading || "Why Choose us",
          headingColor: json.headingColor || "#222222",
          cards: Array.isArray(json.cards) ? json.cards : [],
        };
      }
    }
    
    let estimateBannerData = null;
    if (estimateBannerRaw) {
        const record = Array.isArray(estimateBannerRaw) ? estimateBannerRaw[0] : estimateBannerRaw;
        estimateBannerData = record?.json_content;
    }

    let headingsData = {};
    if (headingManagementRaw) {
      const record = Array.isArray(headingManagementRaw) ? headingManagementRaw[0] : headingManagementRaw;
      headingsData = record?.json_content?.headings || {};
    }

    let estimateCardsData = [];
    if (estimateCardsRaw) {
        const record = Array.isArray(estimateCardsRaw) ? estimateCardsRaw[0] : estimateCardsRaw;
        let json = record?.json_content !== undefined ? record.json_content : record;
        if (typeof json === "string") {
          try { json = JSON.parse(json); } catch (e) { json = []; }
        }
        if (json && typeof json === 'object' && !Array.isArray(json) && json.json_content) {
            json = json.json_content;
        }
        estimateCardsData = Array.isArray(json) ? json : [];
    }

    let furnitureFactoryData = {
  heading: "Large Modular Furniture Factories",
  headingColor: "#000000",
  description: "",
  buttonText: "View More",
  buttonLink: "/furniture/",
  video: "",
  topImage: "",              // 🆕 ADD
      topImageCaption: "",
  image1: "",
  image1Caption: "",
  image2: "",
  image2Caption: "",
  descriptionFontSize: 16,
};

if (furnitureFactoryRaw) {
  const record = Array.isArray(furnitureFactoryRaw) ? furnitureFactoryRaw[0] : furnitureFactoryRaw;
  const json = record?.json_content || {};

  furnitureFactoryData = {
    heading: json.heading || "Large Modular Furniture Factories",
    headingColor: json.headingColor || "#000000",
    description: json.description || "",
    buttonText: json.buttonText || "View More",
    buttonLink: json.buttonLink || "/furniture/",
    video: json.video || "",
    topImage: json.topImage || "",              // 🆕 ADD
        topImageCaption: json.topImageCaption || "", // 🆕 ADD
    image1: json.image1 || "",
    image1Caption: json.image1Caption || "",
    image2: json.image2 || "",
    image2Caption: json.image2Caption || "",
    descriptionFontSize: json.descriptionFontSize || 16,
  };
}

    return { designIdea: designIdea || [], h3d_gallery: h3d_gallery || [], content: contentData || [], blogs: Array.isArray(blogsData) ? blogsData.slice(0, 3) : [], theWayWeWorkData,whyChooseUsData, estimateBannerData, estimateCardsData, whatWeOfferData, headingsData, furnitureFactoryData };
  } catch (err) {
    return {
      designIdea: [], h3d_gallery: [], content: [], blogs: [],
      theWayWeWorkData: { heading: "The Way We Work", bg_image: "", cards: [] },
      furnitureFactoryData: { heading: "Large Modular Furniture Factories", headingColor: "#000000", description: "", buttonText: "View More", buttonLink: "/furniture/", video: "", image1: "", image1Caption: "", image2: "", image2Caption: "" },
      whyChooseUsData: { heading: "Why Choose us", headingColor: "#222222", cards: [] },
      estimateBannerData: null, estimateCardsData: [], whatWeOfferData: null, headingsData: {}  };
  }
}

const formatDate = (dateString) => {
  if (!dateString) return "Date not available";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
};

export default async function HomeContent() {
  const { designIdea, h3d_gallery, content, blogs, theWayWeWorkData, whyChooseUsData, estimateBannerData,estimateCardsData,whatWeOfferData, headingsData , furnitureFactoryData} = await getRemainingData();
  const readyToGoDesignsHeading = headingsData?.ready_to_go_designs || {};
  const designersChoiceHeading = headingsData?.designers_choice || {};
  const celebratingExcellenceHeading = headingsData?.celebrating_excellence || {};
  const blogsHeading = headingsData?.blogs || {};
  const whatPeopleSayHeading = headingsData?.what_people_say || {};

  const offerCards = Array.isArray(whatWeOfferData?.cards) ? whatWeOfferData.cards : [];
  const safeEstimateCards = Array.isArray(estimateCardsData) ? estimateCardsData : [];
  const sortedDesignIdea = [...designIdea].sort((a, b) => b.id - a.id);
  const staticRecords = sortedDesignIdea.slice(-5);

  const workProcessConfig = [
    { id: 1, contentIdx: 20, number: "01", col1Class: "col-lg-2 col-md-3 col-6 pe-0", boxClass: "box1", col2Class: "col-lg-2 col-md-3 col-6 ps-0", dataBoxClass: "box2" },
    { id: 2, contentIdx: 19, number: "02", col1Class: "col-lg-2 col-md-3 col-6 ps-lg-3 pe-0", boxClass: "box_2", col2Class: "col-lg-2 col-md-3 col-6 ps-0", dataBoxClass: "box2_data" },
    { id: 3, contentIdx: 18, number: "03", col1Class: "col-lg-2 col-md-3 col-6 pe-0 ps-lg-3", boxClass: "box_3", col2Class: "col-lg-2 col-md-3 col-6 ps-0", dataBoxClass: "box3_data" },
    { id: 4, contentIdx: 17, number: "04", col1Class: "col-lg-2 col-md-3 col-6 pe-0 ps-lg-3 mt-lg-3", boxClass: "box4 box_3", col2Class: "col-lg-2 col-md-3 col-6 ps-0 mt-lg-3", dataBoxClass: "box4_data" },
    { id: 5, contentIdx: 16, number: "05", col1Class: "col-lg-2 col-md-3 col-6 pe-0 ps-lg-3 mt-lg-3", boxClass: "box5 box_3", col2Class: "col-lg-2 col-md-3 col-6 ps-0 mt-lg-3", dataBoxClass: "box5_data" },
  ];

  const activetheWayWeWorkData = Array.isArray(theWayWeWorkData.cards) && theWayWeWorkData.cards.length > 0 ? theWayWeWorkData.cards : [
    { title: "We Work with Experienced Team"}, {title: "We Work with Good Materials"}
  ];

 
  const activeWhyChooseUsData = Array.isArray(whyChooseUsData.cards) && whyChooseUsData.cards.length > 0 ? whyChooseUsData.cards : [
    { title: "Lifetime warranty¹", icon: "FaShieldAlt" }, { title: "45-day move-in guarantee²", icon: "FaClock" }, { title: "150+ quality checks", icon: "FaCheckCircle" }
  ];

  const activeEstimateBanner = estimateBannerData || { is_active: true, heading: "Get an estimate for your", rotating_words: "Kitchen, Wardrobe, Full Home, Living Room", description: "Get a personalized, transparent estimate for your interior project in just a few clicks. No hidden costs.", button_text: "Get Free Estimate" };
 const activeEstimateCards = safeEstimateCards.filter(
  card => card?.is_active !== false
);
  
        
const dynamicBgUrl = theWayWeWorkData.bg_image || "";
const offerBgUrl = whatWeOfferData?.bg_image || "";

  
  const WAY_WE_WORK_PALETTE = [
    { light: "#ffe3cc", dark: "#ff914d" },
    { light: "#cdc3b4", dark: "#4a3728" },
    { light: "#c9e2e6", dark: "#57665f" },
    { light: "#f4f7df", dark: "#3a3025" },
    { light: "#f6f0c8", dark: "#eba931" },
  ];
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `

      html, body {
          overflow-x: hidden;
        }
        .text-orange-force { color: #ff914d !important; }
        .banner-overlay { padding-bottom: 7rem !important; }
        .force-white-title { color: #ffffff !important; }
        
        /* 🌟 FIX 1: Restored Old Styling for "The Way We Work" Numbers */
        .box_heading { 
            color: #ffffff !important; 
            -webkit-text-stroke: 2px rgba(255, 255, 255, 0.8) !important; 
            font-weight: 800 !important; 
            font-size: 5.5rem !important; 
            line-height: 1 !important;
            opacity: 0.9;
        }

        /* Screenshot-matched styling for "The Way We Work" Cards & Numbers */
        .way-work-number{
    font-size:82px !important;
    font-weight:700 !important;

    color:rgba(255,255,255,.78) !important;

    -webkit-text-stroke:0 !important;
    text-shadow:none !important;

    letter-spacing:-3px;
    line-height:1;
}
        
        .way-work-card{
    display:flex !important;
    min-height:320px !important;
    height:100% !important;
    // border-radius:12px !important;
    overflow:hidden !important;
    box-shadow:none !important;
}

.way-work-card.way-work-card-pop{
    height: 306px !important;
    min-height: 306px !important;
}

        .way-work-card > div:first-child{
    width:50% !important;
    flex:0 0 50% !important;

    display:flex;
    justify-content:center;
    align-items:center;
}
        .way-work-card > div:last-child{
    width:50% !important;
    flex:0 0 50% !important;

    padding:24px 20px !important;

    display:flex;
    flex-direction:column;
     height:100%;
}

        

        @media (max-width: 992px) {
          .way-work-number { font-size: 3.75rem !important; }
        }

        @media (max-width: 767px) {
  /* Keep cards full width and identical in appearance — only change
     the direction they flow: left-to-right (swipe) instead of stacked. */
  .way_wework .row.g-4.justify-content-center {
    flex-wrap: nowrap !important;
    justify-content: flex-start !important; /* was centering the row,
      which pushed card 1 & 2 off-screen with nowrap + overflow */
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;      /* hide scrollbar: Firefox */
    -ms-overflow-style: none;   /* hide scrollbar: IE/Edge */
  }

  .way_wework .row.g-4.justify-content-center::-webkit-scrollbar {
    display: none; /* hide scrollbar: Chrome/Safari */
  }

  .way_wework .row.g-4.justify-content-center > [class*="col-"] {
    flex: 0 0 100%;
    max-width: 100%;
    scroll-snap-align: start;
  }
}

        .know_mores { display: inline-block; font-weight: 600; }
        .know_mores:hover { opacity: 0.85; }

        /* Fix visibility on images */
        .bgsectionroom .designercard *,
        .cardoffer h3, .cardoffer span,
        .card_room h3, .card_room h5, .card_room p, .card_room span {
            color: #ffffff !important;
            text-shadow: 0px 4px 12px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,0.8) !important;
        }

        /* 🌟 FIX: Force 'What We Offer' images to span full width on all devices */
        .cardoffer .offerimg {
            width: 100% !important;
            height: 220px !important; /* Adjust height slightly if needed to match desktop precisely */
            object-fit: cover !important;
            border-top-left-radius: 16px !important;
            border-top-right-radius: 16px !important;
            display: block !important;
            margin: 0 !important;
        }
        
        /* Ensure the wrapper holding the image doesn't collapse padding */
        .cardoffer > div:first-child {
            padding: 0 !important;
            width: 100% !important;
        }
        .bgsectionroom .designercard *, .card_room h3 { font-weight: 800 !important; }

        .oofer_card .row > div { display: flex; }
        .oofer_card .cardoffer { height: 100%; width: 100%; flex-direction: column; }
        /* Forces the inner body (which holds text and button) to fill remaining space */
        .oofer_card .cardoffer > div:last-child { display: flex; flex-direction: column; flex-grow: 1; }
        /* Pushes the button (link) to the very bottom */
        .oofer_card .cardoffer a { margin-top: auto !important; align-self: flex-start; }

        /* Revert cards to white */
        .savedesign .cardoffer * { color: #171717 !important; text-shadow: none !important; } 
        .savedesign .cardoffer .card-title { font-size: 1.25rem !important; font-weight: 700 !important; padding: 1rem 0.5rem !important; }
        .savedesign .cardoffer { display: flex; flex-direction: column; justify-content: space-between; height: 100%; }

        .estimate-fix-wrapper h2, .estimate-fix-wrapper h3, .estimate-fix-wrapper span { font-weight: 800 !important; }

        /* Robust Marquee Fix */
        .marquee-container-fix {
            display: flex;
            overflow: hidden;
            width: 100%;
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .marquee-content-fix {
            display: flex;
            animation: marqueeScroll 60s linear infinite;
            will-change: transform;
        }
        .marquee-container-fix:hover .marquee-content-fix {
            animation-play-state: paused;
        }
        @keyframes marqueeScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }

        .yt-fix-wrapper iframe, .yt-fix-wrapper [class*="youtube"] {
            width: 100% !important; height: auto !important;
            aspect-ratio: 16/9 !important; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .yt-fix-wrapper .card { border-radius: 12px; overflow: hidden; border: none; }
        
        @media (min-width: 768px) {
            .banner-overlay { padding-bottom: 9rem !important; }
        }

        @media (max-width: 768px) {

  .designidea .btn_knowmoreblack {
    margin-left: 0 !important;
    margin-right: auto !important;
    align-self: flex-start !important;
    display: inline-block !important;
    float: left !important;
  }
          /* 🌟 FIX 2: Reduce all large bootstrap spacings on mobile devices to collapse whitespace */
          .my-5 { margin-top: 1.5rem !important; margin-bottom: 1.5rem !important; }
          .py-5 { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
          .mb-5 { margin-bottom: 1.5rem !important; }
          .mt-5 { margin-top: 1.5rem !important; }
          .pt-5 { padding-top: 1.5rem !important; }
          .pb-5 { padding-bottom: 1.5rem !important; }
          
          // .mobile-scroll-row { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; scroll-snap-type: x mandatory; padding-top:20px !important; padding-bottom: 20px !important; margin-bottom: 10px !important; -webkit-overflow-scrolling: touch; scrollbar-width: none; justify-content: flex-start !important; }
.mobile-scroll-row { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; overflow-y: visible !important; scroll-snap-type: x mandatory; padding-top:20px !important; padding-bottom: 20px !important; margin-bottom: 10px !important; -webkit-overflow-scrolling: touch; scrollbar-width: none; justify-content: flex-start !important; }

          .mobile-scroll-row::-webkit-scrollbar { display: none; }
          .mobile-scroll-row > [class*="col-"] { flex: 0 0 100% !important; max-width: 100% !important; scroll-snap-align: center; }

/* Reusable horizontal carousel behavior for CarouselRow — additive only,
   doesn't touch .mobile-scroll-row so Blogs/RoomOffice rows are unaffected */
// .hcarousel-row {
//   display: flex !important;
//   flex-wrap: nowrap !important;
//   overflow-x: auto !important;
//   scroll-snap-type: x mandatory;
//   -webkit-overflow-scrolling: touch;
//   scrollbar-width: none;
// }
.hcarousel-row {
  display: flex !important;
  flex-wrap: nowrap !important;
  overflow-x: auto !important;
  overflow-y: visible !important;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.hcarousel-row::-webkit-scrollbar { display: none; }
.hcarousel-row > [class*="col-"] {
  scroll-snap-align: start;
}

          .mobile-process-row { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; scroll-snap-type: x mandatory; padding-bottom: 20px !important; -webkit-overflow-scrolling: touch; scrollbar-width: none; gap: 15px; margin-left: 0; margin-right: 0; justify-content: flex-start !important; }
          .mobile-process-row::-webkit-scrollbar { display: none; }
          .process-mobile-wrap { flex: 0 0 85% !important; scroll-snap-align: center; display: flex; flex-direction: column; }
          .process-mobile-wrap > div { width: 100% !important; max-width: 100% !important; flex: unset !important; padding-left: 0 !important; padding-right: 0 !important; }
        }
        @media (min-width: 769px) { .process-mobile-wrap { display: contents; } }
      `}} />

      <HomeAbout3D />

      <div
        className="my-5 oofer_card py-4"
        style={{
          backgroundColor: offerBgUrl ? "transparent" : "#ffffff",
          backgroundImage: offerBgUrl ? `url(${offerBgUrl})` : "none",
          backgroundSize: whatWeOfferData?.bgSize || "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <style>{`
          .what-we-offer-main-heading {
            color: ${whatWeOfferData?.headingColor || "#23236b"} !important;
          }
          .what-we-offer-span-color {
            color: ${whatWeOfferData?.spanColor || "#ff914d"} !important;
          }
        `}</style>

        <div className="container">
          <div className="mb-4 text-center">
             {/* 🌟 NEW: span text/color now come from CMS instead of a hardcoded "Explore" literal */}
             <span className="font_stylish text-orange-force d-block mb-1 what-we-offer-span-color">{whatWeOfferData?.spanText || "Explore"}</span>
             <h2 className="h2 font_about mb-0 fw-bold what-we-offer-main-heading">
               {whatWeOfferData?.heading || "What we Offer"}
             </h2>
          </div>
          
          <CarouselRow className="mx-0 row g-4 mobile-scroll-row">
            {offerCards.length > 0 ? (
              offerCards.map((card, index) => { const targetId = `section-${index + 1}`;
                return (
                <div className="col-lg-3 col-md-6 col-12 d-flex" key={index}>
                  <Card 
                    cardNameALl="cardoffer h-100 w-100" 
                    imgSrc={card.image || card.icon} 
                    imgAlt={card.title || "Offer"} 
                    imgClass={"offerimg"} 
                    titleCard={card.title} 
                    descriptionCard={card.description} 
                    buttonTextCard={card.buttonText || "Know More"} 
                    linkCard={card.buttonLink || `/what-we-offer#${targetId}`} 
                  />
                </div>
              );
              })
            ) : (
              [23, 24, 22, 21].map((index,i) => {
                const targetId = `section-${i + 1}`;
                return (
                // Added d-flex here for the fallback as well
                <div className="col-lg-3 col-md-6 col-12 d-flex" key={index}>
                  <div className="w-100 d-flex">
                    <Card 
                      cardNameALl="cardoffer h-100 w-100" 
                      imgSrc={content[index]?.json_content?.image} 
                      imgAlt={"room"} 
                      imgClass={"offerimg"} 
                      titleCard={content[index]?.json_content?.title} 
                      descriptionCard={content[index]?.json_content?.description} 
                      buttonTextCard={"Know More"} 
                      linkCard={content[index]?.json_content?.designation || `/what-we-offer#${targetId}`} 
                    />
                  </div>
                </div>
              );
            })
            )}
          </CarouselRow>
        </div>
      </div>

      <div
        className="way_wework py-5"
        style={{
          backgroundColor: dynamicBgUrl ? "transparent" : "#ffffff",
          backgroundImage: dynamicBgUrl ? `url(${dynamicBgUrl})` : "none",
          backgroundSize: theWayWeWorkData.bgSize || "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* FORCE HEADING COLOR TO OVERRIDE CSS !important */}
        <style>{`
          .way-work-main-heading {
            color: ${theWayWeWorkData.headingColor || "#ffffff"} !important;
          }
        `}</style>

        <div className="container">
          <div className="mb-5 text-center">
            <h2 className="h2 font_about fw-bold mb-0 way-work-main-heading">
              {theWayWeWorkData.heading}
            </h2>
          </div>

          {/* <div className="row g-4 justify-content-center"> */}
          <div className="d-block d-md-none">
          <CarouselRow className="row g-4 justify-content-center"> 
            {theWayWeWorkData.cards.map((card, index) => {
              
              const palette = WAY_WE_WORK_PALETTE[index % WAY_WE_WORK_PALETTE.length] || { light: "#f8f9fa", dark: "#e9ecef" };
              const rawNumber = card.number
                ? parseInt(String(card.number).replace(/\D/g, ""), 10)
                : NaN;
              const number = String(
                Number.isFinite(rawNumber) && rawNumber > 0 ? rawNumber : index + 1
              ).padStart(2, "0");
              const iconSize = card.iconSize ? `${card.iconSize}px` : "80px";

              const rightSideBgColor = card.iconColor || palette.dark;
              const textColor = card.textColor || "#ffffff";
             const leftSideBgColor = card.bgColorLeft || palette.light;
              const titleColorClass = `way-work-title-color-${index}`;

const targetId = `step-${index + 1}`;


                            return (
                <div key={index} className="col-lg-4 col-md-6 col-12">
                  <div
                    className="way-work-card h-100 d-flex overflow-hidden"
                    style={{ height: "306px" }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ background: leftSideBgColor, width: "50%" }}
                    >
                      {/* Ghost-white number, matching the original mockup —
                          not tied to the card's own dark color. */}
                      <span className="way-work-number" style={{ color: rightSideBgColor }}>{number}</span>
                    </div>

                    <div
                      className="p-4 d-flex flex-column align-items-start text-start"
                      style={{ background: rightSideBgColor, color: textColor, width: "50%" }}
                    >
                      {card.icon && (
                        <div className="mb-3">
                          <img
                            src={card.icon}
                            alt={card.title}
                            style={{
                              width: iconSize,
                              height: iconSize,
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      )}

                    {textColor && (
  <style>{`.${titleColorClass} { color: ${textColor} !important; }`}</style>
)}
<h4
  className={`fw-bold mb-3 force-white-title ${titleColorClass}`}
  style={{
      fontSize:"20px",
      lineHeight:"1.25",
      overflow: "hidden",
      textOverflow: "ellipsis"
  }}
>
  {card.title}
</h4>

                      {card.description && (
                                                <p
                            className="mb-4"
                            style={{
                                color: textColor,
                                opacity: .95,
                                fontSize: "14px",
                                lineHeight: "1.45"
                            }}
                        >
                          {card.description}
                        </p>
                      )}
                      <a
                        href={card.buttonLink || `/how-its-works#${targetId}`}
                        className="know_mores mt-auto align-self-start"
                        style={{
                          borderRadius: "30px",
                          padding:"6px 20px",
                          fontSize:"14px",
                          fontWeight:"500",
                          textDecoration: "none",
                          borderStyle: "solid",
                          borderWidth: "1px",
                          color: textColor,
                          borderColor: textColor,
                        }}
                      >
                        {card.buttonText || "Know More"}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
           </CarouselRow> 
          </div>
          <PopCarousel slidesToShow={3} dimSides={false}>
            {theWayWeWorkData.cards.map((card, index) => {
              const palette = WAY_WE_WORK_PALETTE[index % WAY_WE_WORK_PALETTE.length] || { light: "#f8f9fa", dark: "#e9ecef" };
              const rawNumber = card.number
                ? parseInt(String(card.number).replace(/\D/g, ""), 10)
                : NaN;
              const number = String(
                Number.isFinite(rawNumber) && rawNumber > 0 ? rawNumber : index + 1
              ).padStart(2, "0");
              const iconSize = card.iconSize ? `${card.iconSize}px` : "80px";
              const rightSideBgColor = card.iconColor || palette.dark;
              const textColor = card.textColor || "#ffffff";
              const leftSideBgColor = card.bgColorLeft || palette.light;
              const titleColorClass = `way-work-title-color-pop-${index}`;
              const targetId = `step-${index + 1}`;

                            return (
                <div
                  key={index}
                  className="way-work-card way-work-card-pop h-100 d-flex overflow-hidden"
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ background: leftSideBgColor, width: "50%" }}
                  >
                    <span className="way-work-number" style={{ color: rightSideBgColor }}>{number}</span>
                  </div>

                  <div
                    className="p-4 d-flex flex-column align-items-start text-start"
                    style={{ background: rightSideBgColor, color: textColor, width: "50%" }}
                  >
                    {card.icon && (
                      <div className="mb-3">
                        <img
                          src={card.icon}
                          alt={card.title}
                          style={{ width: iconSize, height: iconSize, objectFit: "contain" }}
                        />
                      </div>
                    )}

                    {textColor && (
                      <style>{`.${titleColorClass} { color: ${textColor} !important; }`}</style>
                    )}
                    <h4
                      className={`fw-bold mb-3 force-white-title ${titleColorClass}`}
                      style={{ fontSize: "20px", lineHeight: "1.25", overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {card.title}
                    </h4>

                    {card.description && (
                      <p
                        className="mb-4"
                        style={{ color: textColor, opacity: .95, fontSize: "14px", lineHeight: "1.45" }}
                      >
                        {card.description}
                      </p>
                                        )}
                    
                      <a href={card.buttonLink || `/how-its-works#${targetId}`}
                      className="know_mores mt-auto align-self-start"
                      style={{
                        borderRadius: "30px",
                        padding: "6px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        textDecoration: "none",
                        borderStyle: "solid",
                        borderWidth: "1px",
                        color: textColor,
                        borderColor: textColor,
                      }}
                    >
                      {card.buttonText || "Know More"}
                    </a>
                  </div>
                </div>
              );
            })}
          </PopCarousel>
        </div>
         </div>
      
      <LazySection placeholderHeight="300px">
        <section className="my-5 py-5" style={{ backgroundColor: "#fafafa" }}>
          {whyChooseUsData.headingColor && (
            <style>{`.why-choose-us-heading-color { color: ${whyChooseUsData.headingColor} !important; }`}</style>
          )}
          <div className="container mb-5"><div className="text-center"><h2 className="h2 font_about fw-bold mb-0 why-choose-us-heading-color">{whyChooseUsData.heading}</h2></div></div>
          
          <div className="marquee-container-fix">
            <div className="marquee-content-fix">
              {[...activeWhyChooseUsData, ...activeWhyChooseUsData, ...activeWhyChooseUsData, ...activeWhyChooseUsData].map((item, idx) => {
                const IconComponent = ICON_MAP[item.icon] || FaCheckCircle;
                return (
                  <div key={idx} className="bg-white p-4 rounded-4 shadow-sm text-center flex-shrink-0 mx-3" style={{ width: "220px", height: "180px", transition: "transform 0.3s ease" }}>
                    <div className="mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "64px", height: "64px", backgroundColor: "#fff4ed", borderRadius: "50%" }}>
                      <IconComponent size={32} color="#ff914d" />
                    </div>
                    <p className="fw-bold mt-2 font-poppins text-dark" style={{ fontSize: "15px" }}>{item.title}</p>
                    {item.description && <p className="small text-muted mb-0">{item.description}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </LazySection>

      <LazySection placeholderHeight="700px">
        <div className="pt-5 my-5 designidea" style={{ backgroundImage: `url(${content[1]?.json_content?.image})` }}>
          <div className="container">
            <div className="mb-5 text-center">
              <h2 className="h2 font_about fw-bold mb-0">{content[1]?.json_content?.title} <span className="font_stylish text-orange-force d-block mt-1">{content[1]?.json_content?.description}</span></h2>
            </div>
            <CarouselRow className="row g-4 mobile-scroll-row">
              <div className="col-lg-6 col-md-6 col-12"><RoomOfice cardRoomOffice={"card card_room border-0 h-100"} badge_circle="badge_circleblack" arrowIcon="images/arrow_icon.png" altArrow="arrow" width="80" imageRoom_Office={content[15]?.json_content?.image} roomImg="residential_imgs" altImage="room" cardBody="card_body office_card_body" cardTitle={content[15]?.json_content?.title} cardText={content[15]?.json_content?.description} btnText="Know More " btnLink={content[15]?.json_content?.designation} btnClass={"btn_knowmoreblack"} /></div>
              <div className="col-lg-6 col-md-6 col-12"><RoomOfice cardRoomOffice={"card card_room border-0 h-100"} badge_circle="badge_circleblack" arrowIcon="images/arrow_icon.png" altArrow="arrow" width="80" imageRoom_Office={content[14]?.json_content?.image} roomImg="residential_imgs" altImage="room" cardBody="card_body office_card_body" cardTitle={content[14]?.json_content?.title} cardText={content[14]?.json_content?.description} btnText="Know More " btnLink={content[14]?.json_content?.designation} btnClass={"btn_knowmoreblack"} /></div>
            </CarouselRow>
          </div>
        </div>
      </LazySection>

      <LazySection placeholderHeight="400px">
        <section className="my-5">
          <div className="container">
            <div className="mx-0 mb-5 row justify-content-center text-center">
              <div className="col-12 d-flex flex-column align-items-center gap-2">

                {readyToGoDesignsHeading.spanColor && (
                  <style>{`.rtgd-span-color { color: ${readyToGoDesignsHeading.spanColor} !important; }`}</style>
                )}
                {readyToGoDesignsHeading.color && (
                  <style>{`.rtgd-heading-color { color: ${readyToGoDesignsHeading.color} !important; }`}</style>
                )}
                <span className="font_stylish text-orange-force mb-0 rtgd-span-color">{readyToGoDesignsHeading.spanText || "Ready To Go Designs"}</span>
                <h2 className="h2 font_about fw-bold mb-0 rtgd-heading-color">{readyToGoDesignsHeading.text || "with Our Exclusive Design Choices"}</h2>
              </div>
            </div>
            <SliderCard />
          </div>
        </section>
      </LazySection>

      <LazySection placeholderHeight="800px">
        <div className="my-5 bgsectionroom">
          <div className="container ">
            <div className="row mx-0 mb-4 text-center">
               <div className="col-12 px-0">
                 {/* 🎨 COLOR FIX: same !important-vs-!important cascade-order trick as above */}
                 {designersChoiceHeading.spanColor && (
                   <style>{`.dc-span-color { color: ${designersChoiceHeading.spanColor} !important; }`}</style>
                 )}
                 {designersChoiceHeading.color && (
                   <style>{`.dc-heading-color { color: ${designersChoiceHeading.color} !important; }`}</style>
                 )}
                 <span className="font_stylish text-orange-force d-block mb-1 dc-span-color">{designersChoiceHeading.spanText || "Designer's Choice:"}</span>
                 <h2 className="h2 font_about fw-bold mb-0 dc-heading-color">{designersChoiceHeading.text || "Exclusive Design Specials"}</h2>
               </div>
            </div>
            {/* <div className="mt-4 row g-4 mx-0 mobile-scroll-row">
              {staticRecords.map((record, i) => (
                <div className={`col-lg-${i === 0 || i === 3 ? '5' : i === 4 ? '12' : '7'} col-md-6 col-12`} key={record.id}>
                  <BgImageCard style={{ backgroundImage: `url(${record?.child_content?.image})` }} cardLinkTag={`/designer-choice/gallery?id=${record?.id}`} designerCardBgDiv={"designercard designercardimg1"} titleBgImage={record?.child_content?.title} descriptionBg={record?.child_content?.description} />
                </div>
              ))}
            </div> */}
            {/* <CarouselRow className="mt-4 row g-4 mx-0 mobile-scroll-row" desktopCarousel>
  {staticRecords.map((record, i) => (
    <div className={`col-lg-${i === 0 || i === 3 ? '5' : i === 4 ? '12' : '7'} col-md-6 col-12`} key={record.id}>
      <BgImageCard style={{ backgroundImage: `url(${record?.child_content?.image})` }} cardLinkTag={`/designer-choice/gallery?id=${record?.id}`} designerCardBgDiv={"designercard designercardimg1"} titleBgImage={record?.child_content?.title} descriptionBg={record?.child_content?.description} />
    </div>
  ))}
</CarouselRow> */}

            <div className="d-block d-md-none">
              <CarouselRow className="mt-4 row g-4 mx-0 mobile-scroll-row">
                {staticRecords.map((record, i) => (
                  <div className={`col-lg-${i === 0 || i === 3 ? '5' : i === 4 ? '12' : '7'} col-md-6 col-12`} key={record.id}>
                    <BgImageCard style={{ backgroundImage: `url(${record?.child_content?.image})` }} cardLinkTag={`/designer-choice/gallery?id=${record?.id}`} designerCardBgDiv={"designercard designercardimg1"} titleBgImage={record?.child_content?.title} descriptionBg={record?.child_content?.description} />
                  </div>
                ))}
              </CarouselRow>
            </div>

            <PopCarousel slidesToShow={3}>
              {staticRecords.map((record) => (
                <BgImageCard
                  key={record.id}
                  style={{ backgroundImage: `url(${record?.child_content?.image})` }}
                  cardLinkTag={`/designer-choice/gallery?id=${record?.id}`}
                  designerCardBgDiv={"designercard designercardimg1"}
                  titleBgImage={record?.child_content?.title}
                  descriptionBg={record?.child_content?.description}
                />
              ))}
            </PopCarousel>
            <div className="mt-4 col-lg-12 text-end pe-3"><a href="/designer-choice" className="know_more" style={{ 
      padding: '12px 32px', 
      fontSize: '16px', 
      fontWeight: '600', 
      display: 'inline-block' 
    }} >Know More</a></div>
          </div>
        </div>
      </LazySection>

      <LazySection placeholderHeight="300px">
        <CounterRow 
          ImgCounter={content[13]?.json_content?.image} 
          imgAltCounter={content[13]?.json_content?.title} 
          titleHeadingCounter={celebratingExcellenceHeading.text || "Celebrating Excellence:"}
          titleHeadingColorCounter={celebratingExcellenceHeading.color || undefined}
          subHeadingCounter=""
          counterEnd={content[12]?.json_content?.title} 
          label1={content[12]?.json_content?.description} 
          counterDuration="5" 
          counterEnd2={content[11]?.json_content?.title} 
          label2={content[11]?.json_content?.description} 
          counterDuration2="5" 
          counterEnd3={content[10]?.json_content?.title} 
          label3={content[10]?.json_content?.description} 
          counterDuration3="5" 
          counterEnd4={content[9]?.json_content?.title} 
          label4={content[9]?.json_content?.description} 
          counterDuration4="5" 
          descriptionCounter={content[13]?.json_content?.description} 
          btnLink="/residential-projects" 
          textAboutBtnCounter="View Our Projects" 
          btnLink2={content[13]?.json_content?.designation || "/serving-areas"} 
          textAboutBtnCounter2="Serving Areas" 
        />
      </LazySection>

                  <LazySection placeholderHeight="400px">
        <section className="my-5">
          <style dangerouslySetInnerHTML={{__html: `
            .factory-video-wrap {
              overflow: hidden;
            }
            .btn-factory-cta {
              display: inline-block;
              background: linear-gradient(90deg, #ff914d, #ff6a3d);
              color: #ffffff !important;
              font-weight: 700;
              letter-spacing: 0.03em;
              text-transform: uppercase;
              border-radius: 50px;
              padding: 0.6rem 1.5rem; 
              font-size: 16px;
              border: none;
              transition: all 0.3s ease;
              text-decoration: none;
            }
            .btn-factory-cta:hover {
              color: #ffffff !important;
              box-shadow: 0 0.5rem 1.2rem rgba(255, 145, 77, 0.4);
              transform: translateY(-2px);
            }
          `}} />
          <div className="container">
            <div className="row align-items-center g-4 g-lg-5">

              {furnitureFactoryData.video ? (
                <div className="col-lg-7">
                  <div className="ratio ratio-16x9 factory-video-wrap">
                    <video
                      src={furnitureFactoryData.video}
                      controls
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="col-lg-7">
                  <FactoryImageSlider
                    topImage={
                      furnitureFactoryData.topImage
                        ? { src: furnitureFactoryData.topImage, caption: furnitureFactoryData.topImageCaption }
                        : null
                    }
                    images={[
                      furnitureFactoryData.image1
                        ? { src: furnitureFactoryData.image1, caption: furnitureFactoryData.image1Caption }
                        : null,
                      furnitureFactoryData.image2
                        ? { src: furnitureFactoryData.image2, caption: furnitureFactoryData.image2Caption }
                        : null,
                    ]}
                  />
                </div>
              )}

              <div className="col-lg-5">
                {furnitureFactoryData.headingColor && (
                  <style>{`.furniture-factory-heading-color { color: ${furnitureFactoryData.headingColor} !important; }`}</style>
                )}
                <h2 className="h2 font_about fw-bold mb-3 furniture-factory-heading-color">
                  {furnitureFactoryData.heading}
                </h2>
                <p
                  className="mb-4 text-secondary"
                  style={{ fontSize: `${furnitureFactoryData.descriptionFontSize || 16}px` }}
                >
                  {furnitureFactoryData.description}
                </p>
<div className="text-center text-lg-start">
                 <a href={furnitureFactoryData.buttonLink || "/furniture/"}
                  className="btn-factory-cta"
                >
                  {furnitureFactoryData.buttonText || "View More"}
                </a>
              </div>
</div>
            </div>
          </div>
        </section>
      </LazySection>

      {activeEstimateBanner.is_active !== false && (
        <LazySection placeholderHeight="600px">
          <section className="my-5 py-5 estimate-fix-wrapper" style={{ backgroundColor: "#fff9f9", borderTop: "1px solid #ffeeee", borderBottom: "1px solid #ffeeee" }}>
            
            {/* NEW: CSS specific to the estimate cards moved here */}
            <style dangerouslySetInnerHTML={{__html: `
              .estimate-card-custom { border: 1px solid #eaeaea; border-radius: 12px; transition: all 0.3s ease; }
              .estimate-card-custom:hover { border-color: #ff914d; box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.05); }
              .icon-circle-wrap { width: 80px; height: 80px; border-radius: 50%; transition: all 0.3s ease; }
              .estimate-card-custom:hover .icon-circle-wrap { background-color: #ff914d !important; }
              .icon-img-custom { width: 40px; height: 40px; object-fit: contain; transition: filter 0.3s ease; }
              .estimate-card-custom:hover .icon-img-custom { filter: brightness(0) invert(1); }
              .btn-estimate-custom { border: 1px solid #ff914d; color: #ff914d; font-weight: 600; border-radius: 6px; transition: all 0.3s ease; }
              .estimate-card-custom:hover .btn-estimate-custom { background-color: #ff914d; color: #ffffff !important; }
            `}} />

            {/* Top Heading from the Banner CMS */}
            <EstimateCalculator
              estimateSectionData={{
                  ...activeEstimateBanner,
                  cards: activeEstimateCards
              }}
          />
          </section>
        </LazySection>
      )}

      <LazySection placeholderHeight="500px">
        <div className="my-5 blogs_wrapper">
          <div className="container">
            {/* 🎨 COLOR FIX: same !important-vs-!important cascade-order trick as above */}
            {blogsHeading.color && (
              <style>{`.blogs-heading-color { color: ${blogsHeading.color} !important; }`}</style>
            )}
            <h2 className="h2 pb-4 text-center font_about fw-bold blogs-heading-color">{blogsHeading.text || "Blogs"}</h2>
            <CarouselRow className="row g-2 g-lg-4 justify-content-center mx-1 mobile-scroll-row">
              {blogs.map((blog, index) => (
                <div key={index} className="col-lg-4 col-md-6 col-12">
                  <Blogs blogCard="blog_cards" imgSrcBlog={blog?.image || "/images/default.jpg"} blogImglink={`/${blog?.seo_content?.slug || `blog-detail?id=${blog?.id}`}`} blogImgALt={blog?.title || "Blog Image"} blogClassImg="card-img-top rounded-4 object-fit-cover" blogdate={blog?.published_on ? formatDate(blog.published_on) : "Date not available"} blogTitle={blog?.title || "Untitled Blog"} blogDescription={blog?.description || "No description available"} buttonBlog="Continue Reading" blogBtnHref={`/${blog?.seo_content?.slug || `blog-detail?id=${blog?.id}`}`} writer_name={blog?.writer_name || "High Creation"} />
                </div>
              ))}
            </CarouselRow>
          </div>
        </div>
      </LazySection>

      <hr />
      
      <LazySection placeholderHeight="400px">
        <section className="my-5 yt-fix-wrapper">
          {/* 🎨 COLOR FIX: same !important-vs-!important cascade-order trick as above */}
          {whatPeopleSayHeading.spanColor && (
            <style>{`.wps-span-color { color: ${whatPeopleSayHeading.spanColor} !important; }`}</style>
          )}
          <div className="mb-5 text-center"><span className="font_stylish text-orange-force wps-span-color">{whatPeopleSayHeading.spanText || "What People Say"}</span></div>
          <VideoTestimonialSlider />
        </section>
      </LazySection>
      
      <hr />

      <LazySection placeholderHeight="600px">
         <ContactForm mapSrc={content[3]?.json_content?.description} />
      </LazySection>

            <hr />
    </>
  );
}