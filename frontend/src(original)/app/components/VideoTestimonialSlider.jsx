// "use client";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
// import { useEffect, useState } from "react";
// import api from "@/utils/api";

// // 🌟 PREMIUM CUSTOM ARROWS (Matches Home Banner UI)
// const NextArrow = ({ onClick }) => (
//   <button className="yt-nav-btn next" onClick={onClick} aria-label="Next video">
//     <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
//   </button>
// );

// const PrevArrow = ({ onClick }) => (
//   <button className="yt-nav-btn prev" onClick={onClick} aria-label="Previous video">
//     <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
//   </button>
// );

// const VideoTestimonial = () => {
//   const [youtubeVideos, setYoutubeVideos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setLoading(true);
//     const fetchYoutubeVideos = async () => {
//       try {
//         const response = await api.get("/cms-content/home_page_content");
//         setYoutubeVideos(response.data);
//       } catch (err) {
//         console.error("Error fetching YouTube videos:", err);
//         setError("Failed to load videos. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchYoutubeVideos();
//   }, []);

//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 400, // Slightly slower transition for premium feel
//     cssEase: "ease-out",
//     autoplay: true,
//     autoplaySpeed: 5000,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     centerMode: true,
//     centerPadding: "0px", // Handled by custom CSS now
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1024, // Tablet
//         settings: { slidesToShow: 3, slidesToScroll: 1, centerMode: true },
//       },
//       {
//         breakpoint: 768, // Mobile
//         settings: { slidesToShow: 1, slidesToScroll: 1, centerMode: true, centerPadding: "30px" },
//       }
//     ],
//   };

//   return (
//     <div className="container position-relative yt-slider-wrapper mt-4">
//       {/* 🌟 SLIDER UI OVERRIDES */}
//       <style dangerouslySetInnerHTML={{__html: `
//         .yt-slider-wrapper {
//             padding: 0;
//         } 

//         /* Premium Floating Navigation Buttons */
//         .yt-nav-btn {
//             display: flex; 
//             position: absolute; 
//             top: 50%; 
//             transform: translateY(-50%); 
//             z-index: 20;
//             width: 54px; 
//             height: 54px; 
//             background: #ffffff;
//             box-shadow: 0 4px 15px rgba(0,0,0,0.12); 
//             border: 1px solid #eaeaea; 
//             border-radius: 50%;
//             align-items: center; 
//             justify-content: center; 
//             color: #333; 
//             cursor: pointer;
//             transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
//         }
//         .yt-nav-btn:hover {
//             background: #ff914d; 
//             color: #ffffff; 
//             border-color: #ff914d;
//             box-shadow: 0 8px 20px rgba(255, 145, 77, 0.4);
//             transform: translateY(-50%) scale(1.05);
//         }
//         .yt-nav-btn.prev { left: -25px; }
//         .yt-nav-btn.next { right: -25px; }
//         .yt-nav-btn svg { width: 28px; height: 28px; fill: currentColor; }

//         /* Hide default slick arrows just in case */
//         .slick-prev, .slick-next { display: none !important; }

//         /* Slide Spacing and Center Highlight Effect */
//         // .slick-slider { padding: 20px 0; }

//         .slick-slider { padding: 20px 0; }
// .yt-slider-wrapper .slick-list {
//     padding-top: 30px !important;
//     padding-bottom: 30px !important;
// }
        
//        /* .slick-slide { 
//             padding: 0 15px; 
//             transition: all 0.5s ease; 
//             opacity: 0.5; 
//             transform: scale(0.9); 
//         }
//         .slick-center { 
//             opacity: 1; 
//             transform: scale(1.05); 
//             z-index: 10; 
//             position: relative; 
//         } */

//             .slick-slide { 
//     padding: 0 8px; 
//     transition: all 0.5s ease; 
//     opacity: 0.5; 
//     transform: scale(0.95); 
// }
// .slick-center { 
//     opacity: 1; 
//     transform: scale(1.1);
//     z-index: 10; 
//     position: relative; 
// }

//         /* 🌟 FIX: Force Strict 16:9 Aspect Ratio on Iframes */
//         .video_card {
//             width: 100% !important;
//             height: auto !important;
//             aspect-ratio: 16/9 !important;
//             border-radius: 16px;
//             box-shadow: 0 10px 30px rgba(0,0,0,0.15);
//             background-color: #000; /* Prevents white flashes during load */
//             pointer-events: none; /* Disable interaction on non-center slides */
//         }
        
//         /* Only allow interaction on the focused center video */
//         .slick-center .video_card {
//             pointer-events: auto;
//         }

//         @media (max-width: 768px) {
//             .yt-slider-wrapper { padding: 0; }
//             .yt-nav-btn.prev { left: 5px; }
//             .yt-nav-btn.next { right: 5px; }
//             .yt-nav-btn { width: 44px; height: 44px; }
//             .yt-nav-btn svg { width: 24px; height: 24px; }
//             .slick-slide { padding: 0 10px; opacity: 0.6; transform: scale(0.95); }
//             .slick-center {opacity:1 !important; transform: scale(1); }
//             .video_card { border-radius: 12px; }
//         }
//       `}} />

//       <div className="row justify-content-center mx-0">
//         <div className="col-12 px-0">
//           {loading ? (
//             <div className="text-center py-5 text-muted">Loading testimonials...</div>
//           ) : error ? (
//             <div className="text-center py-5 text-danger">{error}</div>
//           ) : (
//             <Slider {...settings}>
//               {youtubeVideos.length > 0
//                 ? youtubeVideos.map((video, index) => (
//                     <div key={index}>
//                       <iframe
//                         className="video_card"
//                         src={video.json_content.description}
//                         title={video.json_content.title}
//                         frameBorder="0"
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                         referrerPolicy="strict-origin-when-cross-origin"
//                         allowFullScreen
//                       ></iframe>
//                     </div>
//                   ))
//                 : // Fallback default videos if API fails
//                   ["k2yUmWMMY_A", "CUSkOUgr0Oc", "Dc-7Fj8sOa8", "iqtAPVt4p-k"].map((id, index) => (
//                     <div key={index}>
//                       <iframe
//                         className="video_card"
//                         src={`https://www.youtube.com/embed/${id}?rel=0`}
//                         title={`YouTube Video ${index + 1}`}
//                         frameBorder="0"
//                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//                         referrerPolicy="strict-origin-when-cross-origin"
//                         allowFullScreen
//                       ></iframe>
//                     </div>
//                   ))}
//             </Slider>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoTestimonial;


// "use client";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
// import { useCallback, useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import api from "@/utils/api";

// // 🌟 PREMIUM CUSTOM ARROWS (Matches Home Banner UI)
// const NextArrow = ({ onClick }) => (
//   <button className="yt-nav-btn next" onClick={onClick} aria-label="Next video">
//     <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
//   </button>
// );

// const PrevArrow = ({ onClick }) => (
//   <button className="yt-nav-btn prev" onClick={onClick} aria-label="Previous video">
//     <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
//   </button>
// );

// // Pull the 11-char YouTube id out of an embed / watch / youtu.be URL
// const getYoutubeId = (url = "") => {
//   const m = String(url).match(/(?:embed\/|v=|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{11})/);
//   return m ? m[1] : "";
// };

// const FALLBACK_IDS = ["k2yUmWMMY_A", "CUSkOUgr0Oc", "Dc-7Fj8sOa8", "iqtAPVt4p-k"];

// // Card thumbnail (no YouTube UI on the page, just the poster image)
// const Thumb = ({ id, alt }) => {
//   const [src, setSrc] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);
//   return (
//     <img
//       src={src}
//       alt={alt}
//       loading="lazy"
//       draggable={false}
//       onError={() => {
//         if (!src.includes("hqdefault")) setSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
//       }}
//     />
//   );
// };

// // Popup player with prev / next
// const VideoPopup = ({ items, index, onChange, onClose }) => {
//   const item = items[index];
//   const multiple = items.length > 1;

//   const prev = useCallback(() => onChange((index - 1 + items.length) % items.length), [index, items.length, onChange]);
//   const next = useCallback(() => onChange((index + 1) % items.length), [index, items.length, onChange]);

//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape") onClose();
//       if (multiple && e.key === "ArrowLeft") prev();
//       if (multiple && e.key === "ArrowRight") next();
//     };
//     document.addEventListener("keydown", onKey);
//     const prevOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.removeEventListener("keydown", onKey);
//       document.body.style.overflow = prevOverflow;
//     };
//   }, [multiple, prev, next, onClose]);

//   return createPortal(
//     <div className="yt-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Client video review">
//       <div className="yt-modal" onClick={(e) => e.stopPropagation()}>
//         <button type="button" className="yt-close" onClick={onClose} aria-label="Close video">&times;</button>
//         <div className="yt-frame">
//           <iframe
//             key={item.id}
//             src={`https://www.youtube.com/embed/${item.id}?autoplay=1&rel=0&playsinline=1`}
//             title={item.title}
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//             referrerPolicy="strict-origin-when-cross-origin"
//             allowFullScreen
//           />
//         </div>
//         {multiple && (
//           <>
//             <button type="button" className="yt-modal-nav prev" onClick={prev} aria-label="Previous video">&#8249;</button>
//             <button type="button" className="yt-modal-nav next" onClick={next} aria-label="Next video">&#8250;</button>
//           </>
//         )}
//       </div>
//     </div>,
//     document.body
//   );
// };

// const VideoTestimonial = () => {
//   const [youtubeVideos, setYoutubeVideos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [openIndex, setOpenIndex] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     const fetchYoutubeVideos = async () => {
//       try {
//         const response = await api.get("/cms-content/home_page_content");
//         setYoutubeVideos(response.data);
//       } catch (err) {
//         console.error("Error fetching YouTube videos:", err);
//         setError("Failed to load videos. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchYoutubeVideos();
//   }, []);

//   // Normalise CMS rows (or fallback ids) into one list used by both cards and popup.
//   // Optional CMS fields: json_content.name, json_content.city, json_content.review
//   const cards = (Array.isArray(youtubeVideos) && youtubeVideos.length > 0
//     ? youtubeVideos.map((v) => {
//         const c = v.json_content || {};
//         return {
//           id: getYoutubeId(c.description),
//           title: c.title || "Client review",
//           name: c.name || c.title || "Client review",
//           city: c.city || "",
//           review: c.review || "",
//         };
//       })
//     : FALLBACK_IDS.map((id, i) => ({ id, title: `Client review ${i + 1}`, name: `Client review ${i + 1}`, city: "", review: "" }))
//   ).filter((c) => c.id);

//   const settings = {
//     dots: false,
//     infinite: true,
//     speed: 400, // Slightly slower transition for premium feel
//     cssEase: "ease-out",
//     autoplay: openIndex === null, // pause the carousel while the popup is open
//     autoplaySpeed: 5000,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     centerMode: true,
//     centerPadding: "0px", // Handled by custom CSS now
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1024, // Tablet
//         settings: { slidesToShow: 3, slidesToScroll: 1, centerMode: true },
//       },
//       {
//         breakpoint: 768, // Mobile
//         settings: { slidesToShow: 1, slidesToScroll: 1, centerMode: true, centerPadding: "30px" },
//       }
//     ],
//   };

//   return (
//     <div className="container position-relative yt-slider-wrapper mt-4">
//       {/* 🌟 SLIDER UI OVERRIDES */}
//       <style dangerouslySetInnerHTML={{__html: `
//         .yt-slider-wrapper {
//             padding: 0;
//         } 

//         /* Premium Floating Navigation Buttons */
//         .yt-nav-btn {
//             display: flex; 
//             position: absolute; 
//             top: 50%; 
//             transform: translateY(-50%); 
//             z-index: 20;
//             width: 54px; 
//             height: 54px; 
//             background: #ffffff;
//             box-shadow: 0 4px 15px rgba(0,0,0,0.12); 
//             border: 1px solid #eaeaea; 
//             border-radius: 50%;
//             align-items: center; 
//             justify-content: center; 
//             color: #333; 
//             cursor: pointer;
//             transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
//         }
//         .yt-nav-btn:hover {
//             background: #ff914d; 
//             color: #ffffff; 
//             border-color: #ff914d;
//             box-shadow: 0 8px 20px rgba(255, 145, 77, 0.4);
//             transform: translateY(-50%) scale(1.05);
//         }
//         .yt-nav-btn.prev { left: -25px; }
//         .yt-nav-btn.next { right: -25px; }
//         .yt-nav-btn svg { width: 28px; height: 28px; fill: currentColor; }

//         /* Hide default slick arrows just in case */
//         .slick-prev, .slick-next { display: none !important; }

//         .slick-slider { padding: 20px 0; }
//         .yt-slider-wrapper .slick-list {
//             padding-top: 30px !important;
//             padding-bottom: 30px !important;
//         }

//         .slick-slide { 
//             padding: 0 8px; 
//             transition: all 0.5s ease; 
//             opacity: 0.5; 
//             transform: scale(0.95); 
//         }
//         .slick-center { 
//             opacity: 1; 
//             transform: scale(1.1);
//             z-index: 10; 
//             position: relative; 
//         }

//         /* ---------- Review card (replaces the inline YouTube iframe) ---------- */
//         .yt-card {
//             background: #fff;
//             border-radius: 16px;
//             box-shadow: 0 10px 30px rgba(0,0,0,0.15);
//             overflow: hidden;
//         }
//         .yt-thumb {
//             position: relative;
//             display: block;
//             width: 100%;
//             padding: 0;
//             border: 0;
//             background: #000;
//             aspect-ratio: 16 / 9;
//             cursor: pointer;
//             overflow: hidden;
//         }
//         .yt-thumb img {
//             position: absolute; inset: 0;
//             width: 100%; height: 100%;
//             object-fit: cover;
//             transition: transform 0.5s ease;
//         }
//         .yt-thumb:hover img { transform: scale(1.05); }
//         .yt-thumb::after {
//             content: "";
//             position: absolute; inset: 0;
//             background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.05) 100%);
//         }
//         .yt-play {
//             position: absolute; z-index: 2;
//             top: 42%; left: 50%;
//             transform: translate(-50%, -50%);
//             width: 54px; height: 54px;
//             border-radius: 50%;
//             background: rgba(255,255,255,0.9);
//             display: flex; align-items: center; justify-content: center;
//             transition: background 0.25s ease, transform 0.25s ease;
//         }
//         .yt-play::before {
//             content: "";
//             margin-left: 4px;
//             border-style: solid;
//             border-width: 9px 0 9px 15px;
//             border-color: transparent transparent transparent #333;
//             transition: border-color 0.25s ease;
//         }
//         .yt-thumb:hover .yt-play,
//         .yt-thumb:focus-visible .yt-play { background: #ff914d; transform: translate(-50%, -50%) scale(1.08); }
//         .yt-thumb:hover .yt-play::before,
//         .yt-thumb:focus-visible .yt-play::before { border-left-color: #fff; }
//         .yt-thumb:focus-visible { outline: 3px solid #ff914d; outline-offset: -3px; }
//         .yt-who {
//             position: absolute; z-index: 2;
//             left: 12px; right: 12px; bottom: 12px;
//             text-align: center; color: #fff; line-height: 1.25;
//         }
//         .yt-who strong {
//             display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
//             overflow: hidden; font-size: 1rem; font-weight: 700;
//         }
//         .yt-who span { font-size: 0.85rem; opacity: 0.9; }
//         .yt-review {
//             margin: 0;
//             padding: 14px 18px 18px;
//             text-align: center;
//             font-style: italic;
//             color: #555;
//             font-size: 0.92rem;
//             line-height: 1.5;
//             min-height: 5.4em; /* keeps all cards the same height */
//             display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
//             overflow: hidden;
//         }

//         /* ---------- Popup ---------- */
//         .yt-overlay {
//             position: fixed; inset: 0; z-index: 10000;
//             background: rgba(0,0,0,0.8);
//             display: flex; align-items: center; justify-content: center;
//             padding: 16px;
//         }
//         .yt-modal { position: relative; width: min(960px, 100%); }
//         .yt-frame {
//             position: relative; width: 100%;
//             aspect-ratio: 16 / 9;
//             background: #000; border-radius: 10px; overflow: hidden;
//         }
//         .yt-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
//         .yt-close {
//             position: absolute; top: -46px; right: 0;
//             width: 36px; height: 36px;
//             border: 0; border-radius: 50%;
//             background: #fff; color: #222;
//             font-size: 24px; line-height: 1; cursor: pointer;
//         }
//         .yt-modal-nav {
//             position: absolute; top: 50%; transform: translateY(-50%);
//             width: 46px; height: 46px;
//             border: 0; border-radius: 50%;
//             background: rgba(255,255,255,0.92); color: #ff914d;
//             font-size: 30px; line-height: 1; cursor: pointer;
//         }
//         .yt-modal-nav.prev { left: -58px; }
//         .yt-modal-nav.next { right: -58px; }
//         @media (max-width: 1100px) {
//             .yt-modal-nav.prev { left: 8px; }
//             .yt-modal-nav.next { right: 8px; }
//             .yt-modal-nav { background: rgba(255,255,255,0.75); }
//         }

//         @media (max-width: 768px) {
//             .yt-slider-wrapper { padding: 0; }
//             .yt-nav-btn.prev { left: 5px; }
//             .yt-nav-btn.next { right: 5px; }
//             .yt-nav-btn { width: 44px; height: 44px; }
//             .yt-nav-btn svg { width: 24px; height: 24px; }
//             .slick-slide { padding: 0 10px; opacity: 0.6; transform: scale(0.95); }
//             .slick-center {opacity:1 !important; transform: scale(1); }
//             .yt-card { border-radius: 12px; }
//         }
//       `}} />

//       <div className="row justify-content-center mx-0">
//         <div className="col-12 px-0">
//           {loading ? (
//             <div className="text-center py-5 text-muted">Loading testimonials...</div>
//           ) : error ? (
//             <div className="text-center py-5 text-danger">{error}</div>
//           ) : (
//             <Slider {...settings}>
//               {cards.map((c, index) => (
//                 <div key={index}>
//                   <div className="yt-card">
//                     <button
//                       type="button"
//                       className="yt-thumb"
//                       onClick={() => setOpenIndex(index)}
//                       aria-label={`Play video review: ${c.name}`}
//                     >
//                       <Thumb id={c.id} alt={c.title} />
//                       <span className="yt-play" aria-hidden="true" />
//                       <span className="yt-who">
//                         <strong>{c.name}</strong>
//                         {c.city && <span>{c.city}</span>}
//                       </span>
//                     </button>
//                     {c.review && <p className="yt-review">{c.review}</p>}
//                   </div>
//                 </div>
//               ))}
//             </Slider>
//           )}
//         </div>
//       </div>

//       {openIndex !== null && (
//         <VideoPopup items={cards} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
//       )}
//     </div>
//   );
// };

// export default VideoTestimonial;


"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "@/utils/api";

// 🌟 PREMIUM CUSTOM ARROWS (Matches Home Banner UI)
const NextArrow = ({ onClick }) => (
  <button className="yt-nav-btn next" onClick={onClick} aria-label="Next video">
    <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
  </button>
);

const PrevArrow = ({ onClick }) => (
  <button className="yt-nav-btn prev" onClick={onClick} aria-label="Previous video">
    <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
  </button>
);

// Pull the 11-char YouTube id out of an embed / watch / youtu.be URL
const getYoutubeId = (url = "") => {
  const m = String(url).match(/(?:embed\/|v=|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : "";
};

const FALLBACK_IDS = ["k2yUmWMMY_A", "CUSkOUgr0Oc", "Dc-7Fj8sOa8", "iqtAPVt4p-k"];

// Card thumbnail (no YouTube UI on the page, just the poster image)
const Thumb = ({ id, alt }) => {
  const [src, setSrc] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      draggable={false}
      onError={() => {
        if (!src.includes("hqdefault")) setSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
      }}
    />
  );
};

// Popup player with prev / next
const VideoPopup = ({ items, index, onChange, onClose }) => {
  const item = items[index];
  const multiple = items.length > 1;

  const prev = useCallback(() => onChange((index - 1 + items.length) % items.length), [index, items.length, onChange]);
  const next = useCallback(() => onChange((index + 1) % items.length), [index, items.length, onChange]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (multiple && e.key === "ArrowLeft") prev();
      if (multiple && e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [multiple, prev, next, onClose]);

  return createPortal(
    <div className="yt-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Client video review">
      <div className="yt-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="yt-close" onClick={onClose} aria-label="Close video">&times;</button>
        <div className="yt-frame">
          <iframe
            key={item.id}
            src={`https://www.youtube.com/embed/${item.id}?autoplay=1&rel=0&playsinline=1`}
            // title={item.title}
            aria-label="Client video review"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        {multiple && (
          <>
            <button type="button" className="yt-modal-nav prev" onClick={prev} aria-label="Previous video">&#8249;</button>
            <button type="button" className="yt-modal-nav next" onClick={next} aria-label="Next video">&#8250;</button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

const VideoTestimonial = () => {
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchYoutubeVideos = async () => {
      try {
        const response = await api.get("/cms-content/home_page_content");
        setYoutubeVideos(response.data);
      } catch (err) {
        console.error("Error fetching YouTube videos:", err);
        setError("Failed to load videos. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchYoutubeVideos();
  }, []);

  // Normalise CMS rows (or fallback ids) into one list used by both cards and popup.
  // Optional CMS fields: json_content.name, json_content.city, json_content.review
  const cards = (Array.isArray(youtubeVideos) && youtubeVideos.length > 0
    ? youtubeVideos.map((v) => {
        const c = v.json_content || {};
        return {
          id: getYoutubeId(c.description),
          title: c.title || "Client review",
          name: c.name || "",
          city: c.city || "",
          review: c.review || "",
        };
      })
    : FALLBACK_IDS.map((id, i) => ({ id, title: `Client review ${i + 1}`, name: "", city: "", review: "" }))
  ).filter((c) => c.id);

  const settings = {
    dots: false,
    infinite: true,
    speed: 400, // Slightly slower transition for premium feel
    cssEase: "ease-out",
    autoplay: openIndex === null, // pause the carousel while the popup is open
    autoplaySpeed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0px", // Handled by custom CSS now
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // Tablet
        settings: { slidesToShow: 3, slidesToScroll: 1, centerMode: true },
      },
      {
        breakpoint: 768, // Mobile
        settings: { slidesToShow: 1, slidesToScroll: 1, centerMode: true, centerPadding: "30px" },
      }
    ],
  };

  return (
    <div className="container position-relative yt-slider-wrapper mt-4">
      {/* 🌟 SLIDER UI OVERRIDES */}
      <style dangerouslySetInnerHTML={{__html: `
        .yt-slider-wrapper {
            padding: 0;
        } 

        /* Premium Floating Navigation Buttons */
        .yt-nav-btn {
            display: flex; 
            position: absolute; 
            top: 50%; 
            transform: translateY(-50%); 
            z-index: 20;
            width: 54px; 
            height: 54px; 
            background: #ffffff;
            box-shadow: 0 4px 15px rgba(0,0,0,0.12); 
            border: 1px solid #eaeaea; 
            border-radius: 50%;
            align-items: center; 
            justify-content: center; 
            color: #333; 
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .yt-nav-btn:hover {
            background: #ff914d; 
            color: #ffffff; 
            border-color: #ff914d;
            box-shadow: 0 8px 20px rgba(255, 145, 77, 0.4);
            transform: translateY(-50%) scale(1.05);
        }
        .yt-nav-btn.prev { left: -25px; }
        .yt-nav-btn.next { right: -25px; }
        .yt-nav-btn svg { width: 28px; height: 28px; fill: currentColor; }

        /* Hide default slick arrows just in case */
        .slick-prev, .slick-next { display: none !important; }

        .slick-slider { padding: 20px 0; }
        .yt-slider-wrapper .slick-list {
            padding-top: 30px !important;
            padding-bottom: 30px !important;
        }

        .slick-slide { 
            padding: 0 14px; 
            transition: all 0.5s ease; 
            opacity: 1; 
            transform: scale(0.95); 
        }
        .slick-center { 
            opacity: 1; 
            transform: scale(1.1);
            z-index: 10; 
            position: relative; 
        }

        /* ---------- Review card (replaces the inline YouTube iframe) ---------- */
        .yt-card {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            overflow: hidden;
        }
        .yt-thumb {
            position: relative;
            display: block;
            width: 100%;
            padding: 0;
            border: 0;
            background: #000;
            aspect-ratio: 16 / 9;
            cursor: pointer;
            overflow: hidden;
        }
        .yt-thumb img {
            position: absolute; inset: 0;
            width: 100%; height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }
        .yt-thumb:hover img { transform: scale(1.03); }
        .yt-thumb::after {
            content: "";
            position: absolute; inset: 0;
            background: none;
        }
        .yt-play {
            position: absolute; z-index: 2;
            top: 42%; left: 50%;
            transform: translate(-50%, -50%);
            width: 54px; height: 54px;
            border-radius: 50%;
            background: rgba(255,255,255,0.9);
            display: flex; align-items: center; justify-content: center;
            transition: background 0.25s ease, transform 0.25s ease;
        }
        .yt-play::before {
            content: "";
            margin-left: 4px;
            border-style: solid;
            border-width: 9px 0 9px 15px;
            border-color: transparent transparent transparent #333;
            transition: border-color 0.25s ease;
        }
        .yt-thumb:hover .yt-play,
        .yt-thumb:focus-visible .yt-play { background: #ff914d; transform: translate(-50%, -50%) scale(1.08); }
        .yt-thumb:hover .yt-play::before,
        .yt-thumb:focus-visible .yt-play::before { border-left-color: #fff; }
        .yt-thumb:focus-visible { outline: 3px solid #ff914d; outline-offset: -3px; }
        .yt-who {
            position: absolute; z-index: 2;
            left: 12px; right: 12px; bottom: 12px;
            text-align: center; color: #fff; line-height: 1.25;
        }
        .yt-who strong {
            display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
            overflow: hidden; font-size: 1rem; font-weight: 700;
        }
        .yt-who span { font-size: 0.85rem; opacity: 0.9; }
        .yt-review {
            margin: 0;
            padding: 14px 18px 18px;
            text-align: center;
            font-style: italic;
            color: #555;
            font-size: 0.92rem;
            line-height: 1.5;
            min-height: 5.4em; /* keeps all cards the same height */
            display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
            overflow: hidden;
        }

        /* ---------- Popup ---------- */
        .yt-overlay {
            position: fixed; inset: 0; z-index: 10000;
            background: rgba(0,0,0,0.8);
            display: flex; align-items: center; justify-content: center;
            padding: 16px;
        }
        .yt-modal { position: relative; width: min(960px, 100%); }
        .yt-frame {
            position: relative; width: 100%;
            aspect-ratio: 16 / 9;
            background: #000; border-radius: 10px; overflow: hidden;
        }
        .yt-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
        .yt-close {
            position: absolute; top: -46px; right: 0;
            width: 36px; height: 36px;
            border: 0; border-radius: 50%;
            background: #fff; color: #222;
            font-size: 24px; line-height: 1; cursor: pointer;
        }
        .yt-modal-nav {
            position: absolute; top: 50%; transform: translateY(-50%);
            width: 46px; height: 46px;
            border: 0; border-radius: 50%;
            background: rgba(255,255,255,0.92); color: #ff914d;
            font-size: 30px; line-height: 1; cursor: pointer;
        }
        .yt-modal-nav.prev { left: -58px; }
        .yt-modal-nav.next { right: -58px; }
        @media (max-width: 1100px) {
            .yt-modal-nav.prev { left: 8px; }
            .yt-modal-nav.next { right: 8px; }
            .yt-modal-nav { background: rgba(255,255,255,0.75); }
        }

        /* Desktop: arrows live OUTSIDE the cards (prev on the far left, next on the far right) */
        @media (min-width: 1400px) {
            .container.yt-slider-wrapper { padding-left: 0; padding-right: 0; }
            .yt-nav-btn.prev { left: -50px; }
            .yt-nav-btn.next { right: -50px; }
        }
        /* Laptops / tablets: reserve a small side lane so the arrows still sit outside the cards */
        @media (min-width: 769px) and (max-width: 1399px) {
            .container.yt-slider-wrapper { padding-left: 66px; padding-right: 66px; }
            .yt-nav-btn.prev { left: -60px; }
            .yt-nav-btn.next { right: -60px; }
        }

        @media (max-width: 768px) {
            .yt-slider-wrapper { padding: 0; }
            .yt-nav-btn.prev { left: 5px; }
            .yt-nav-btn.next { right: 5px; }
            .yt-nav-btn { width: 44px; height: 44px; }
            .yt-nav-btn svg { width: 24px; height: 24px; }
            .slick-slide { padding: 0 10px; opacity: 1; transform: scale(0.95); }
            .slick-center {opacity:1 !important; transform: scale(1); }
            .yt-card { border-radius: 12px; }
        }
      `}} />

      <div className="row justify-content-center mx-0">
        <div className="col-12 px-0">
          {loading ? (
            <div className="text-center py-5 text-muted">Loading testimonials...</div>
          ) : error ? (
            <div className="text-center py-5 text-danger">{error}</div>
          ) : (
            <Slider {...settings}>
              {cards.map((c, index) => (
                <div key={index}>
                  <div className="yt-card">
                    <button
                      type="button"
                      className="yt-thumb"
                      onClick={() => setOpenIndex(index)}
                      aria-label={`Play video review ${index + 1}`}
                    >
                      <Thumb id={c.id} alt={c.title} />
                      <span className="yt-play" aria-hidden="true" />
                      {(c.name || c.city) && (
                        <span className="yt-who">
                          {c.name && <strong>{c.name}</strong>}
                          {c.city && <span>{c.city}</span>}
                        </span>
                      )}
                    </button>
                    {c.review && <p className="yt-review">{c.review}</p>}
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>

      {openIndex !== null && (
        <VideoPopup items={cards} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </div>
  );
};

export default VideoTestimonial;
