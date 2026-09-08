"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect, useState } from "react";
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

const VideoTestimonial = () => {
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const settings = {
    dots: false,
    infinite: true,
    speed: 600, // Slightly slower transition for premium feel
    autoplay: true,
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
            padding: 0 20px;
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

        /* Slide Spacing and Center Highlight Effect */
        .slick-slider { padding: 20px 0; }
        .slick-slide { 
            padding: 0 15px; 
            transition: all 0.5s ease; 
            opacity: 0.5; 
            transform: scale(0.9); 
        }
        .slick-center { 
            opacity: 1; 
            transform: scale(1.05); 
            z-index: 10; 
            position: relative; 
        }

        /* 🌟 FIX: Force Strict 16:9 Aspect Ratio on Iframes */
        .video_card {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 16/9 !important;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            background-color: #000; /* Prevents white flashes during load */
            pointer-events: none; /* Disable interaction on non-center slides */
        }
        
        /* Only allow interaction on the focused center video */
        .slick-center .video_card {
            pointer-events: auto;
        }

        @media (max-width: 768px) {
            .yt-slider-wrapper { padding: 0; }
            .yt-nav-btn.prev { left: 5px; }
            .yt-nav-btn.next { right: 5px; }
            .yt-nav-btn { width: 44px; height: 44px; }
            .yt-nav-btn svg { width: 24px; height: 24px; }
            .slick-slide { padding: 0 10px; opacity: 0.6; transform: scale(0.95); }
            .slick-center {opacity:1 !important; transform: scale(1); }
            .video_card { border-radius: 12px; }
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
              {youtubeVideos.length > 0
                ? youtubeVideos.map((video, index) => (
                    <div key={index}>
                      <iframe
                        className="video_card"
                        src={video.json_content.description}
                        title={video.json_content.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))
                : // Fallback default videos if API fails
                  ["k2yUmWMMY_A", "CUSkOUgr0Oc", "Dc-7Fj8sOa8", "iqtAPVt4p-k"].map((id, index) => (
                    <div key={index}>
                      <iframe
                        className="video_card"
                        src={`https://www.youtube.com/embed/${id}?rel=0`}
                        title={`YouTube Video ${index + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoTestimonial;