// src/app/home/clientHome/HeroCarousel.jsx
"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function HeroCarousel({ bannerData }) {
  const [showRest, setShowRest] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 60 }, 
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    setIsMounted(true);
    if (window.innerWidth >= 768) {
      const timer = setTimeout(() => setShowRest(true), 2500);
      return () => clearTimeout(timer);
    } else {
      setShowRest(true);
    }
  }, []);

  const activeBanners = (showRest ? bannerData : bannerData?.slice(0, 1) || []).filter(Boolean);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [emblaApi, activeBanners.length]);

  if (!bannerData || bannerData.length === 0) return null;

  return (
    <section className="position-relative w-100" style={{ backgroundColor: '#f0f0f0' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .embla { 
            overflow: hidden; 
            width: 100%; 
            aspect-ratio: 3/4; 
            min-height: 500px; 
        }
        
        @media (min-width: 768px) { 
            .embla { aspect-ratio: 192/85; min-height: unset; } 
        }
        
        .embla__container { display: flex; height: 100%; }
        .embla__slide { flex: 0 0 100%; min-width: 0; position: relative; }
        .banner-media { object-fit: cover; object-position: center; width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
        
        .banner-overlay { 
            position: absolute; 
            z-index: 10; 
            inset: 0; 
            display: flex; 
            flex-direction: column; 
            justify-content: flex-end; 
            align-items: center;      
            padding-bottom: 1.5rem;       
            pointer-events: none;
            background: transparent;
            text-align: center;
        }
        
        .banner-overlay * { pointer-events: auto; }
        
        .banner-content-wrapper { 
            width: 100%; 
            padding: 0 1.25rem; 
        }

        /* 🌟 DYNAMIC TYPOGRAPHY UPDATES & COLOR FIXES */
        .banner-top-slogan { 
            font-family: var(--dynamic-paragraph-font) !important;
            font-size: 0.75rem; 
            font-weight: 600;
            letter-spacing: 2px; 
            margin-bottom: 0.25rem !important; 
            text-transform: uppercase;
            color: #ff914d !important; 
        }
        
        .home_banner_heading { 
            font-family: var(--dynamic-heading-font) !important; 
            font-size: 1.75rem; 
            font-weight: 700;
            line-height: 1.1; 
            margin-bottom: 0 !important; 
            color: #ffffff !important; /* 🌟 FIX: Forces white over global black CSS */
        }
        
        /* 🌟 Replaced Cursive with Clean Sub-Heading */
        .font_stylish_home { 
            font-family: var(--dynamic-heading-font) !important; 
            font-size: 1.25rem; 
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #ffffff !important; /* 🌟 FIX: Forces white */
            margin-bottom: 0.25rem !important; 
            line-height: 1.2;
            margin-top: 0.5rem; 
        }
        
        .banner-desc { 
            font-family: var(--dynamic-paragraph-font) !important;
            font-size: 0.8rem; 
            line-height: 1.3; 
            margin-bottom: 1.2rem !important; 
            color: rgba(255, 255, 255, 0.85) !important; 
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .banner-btn {
            background-color: #ff914d;
            border: none;
            font-family: var(--dynamic-heading-font) !important;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(255, 145, 77, 0.4);
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #ffffff !important;
            padding: 14px 0 !important; 
            font-size: 0.85rem !important;
            border-radius: 8px; 
            display: block; 
            width: 100%; 
        }
        .banner-btn:hover { background-color: #e67d3c; transform: translateY(-2px); }

        .embla__nav-btn { display: none; }

        @media (min-width: 768px) {
            .banner-overlay { padding-bottom: 5%; background: transparent; }
            .banner-content-wrapper { width: 90%; max-width: 900px; padding: 0 10px; }
            .banner-top-slogan { font-size: 1rem; margin-bottom: 0.75rem !important; color: #ffffff !important; }
            .home_banner_heading { font-size: 3.5rem; margin-bottom: 0.5rem !important; color: #ffffff !important; }
            
            /* 🌟 Subheading retains orange accent on desktop */
            .font_stylish_home { font-size: 1.75rem; margin-bottom: 1rem !important; margin-top: 0.5rem; color: #ff914d !important; }
            
            .banner-desc { font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem !important; -webkit-line-clamp: unset; overflow: visible; color: #ffffff !important; }
            
            .banner-btn { display: inline-block; width: auto; padding: 14px 45px !important; font-size: 1rem !important; border-radius: 50px; }
            
            .embla__nav-btn {
                display: flex;
                position: absolute; top: 50%; transform: translateY(-50%); z-index: 20;
                width: 44px; height: 44px; 
                background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(4px);
                border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 50%;
                align-items: center; justify-content: center; color: white; cursor: pointer;
            }
            .embla__nav-btn:hover { background: rgba(255, 145, 77, 0.9); border-color: #ff914d; }
            .embla__nav-btn.prev { left: 20px; }
            .embla__nav-btn.next { right: 20px; }
        }
        
        .embla__nav-icon { width: 20px; height: 20px; fill: currentColor; }
      `}} />

      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {activeBanners.map((banner, index) => {
            const isVideo = banner?.banner_image?.match(/\.(mp4|webm|ogg)$/i);
            const isFirstSlide = index === 0;

            return (
              <div className="embla__slide" key={banner.id || index}>
                {isVideo ? (
                  <video className="banner-media" autoPlay loop muted playsInline preload={isFirstSlide ? "auto" : "metadata"} poster={banner?.banner_image_poster || ""}>
                    <source src={banner?.banner_image} type="video/mp4" />
                  </video>
                ) : (
                  <Image src={banner?.banner_image ?? "/images/home-banner-1.png"} className="banner-media" alt={banner?.title?.trim() || "High Creation Interior Banner"} fill priority={isFirstSlide} fetchPriority={isFirstSlide ? "high" : "auto"} quality={isFirstSlide ? 90 : 75} sizes="(max-width: 768px) 100vw, 100vw" />
                )}

                <div className="banner-overlay text-white">
                  <div className="banner-content-wrapper">
                    {banner?.top_slogan && (
                       <div className="banner-top-slogan" style={{ textShadow: '0px 4px 12px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,0.8)' }}>
                         {banner.top_slogan}
                       </div>
                    )}
                    
                    {isFirstSlide ? (
                      <h1 className="home_banner_heading" style={{ textShadow: '0px 4px 12px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,0.8)' }}>
                        {banner?.title}
                      </h1>
                    ) : (
                      <h2 className="home_banner_heading" style={{ textShadow: '0px 4px 12px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,0.8)' }}>
                        {banner?.title}
                      </h2>
                    )}
                    
                    {banner?.sub_title && (
                       <div className="font_stylish_home" style={{ textShadow: '0px 4px 12px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,0.8)' }}>
                         {banner.sub_title}
                       </div>
                    )}
                    
                    {banner?.description && (
                       <p className="banner-desc mx-auto" style={{ textShadow: '0px 4px 12px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,0.8)' }}>
                         {banner.description}
                       </p>
                    )}
                    
                    {banner?.button_text && banner?.button_link && (
                       <div className="mt-1 mb-1 w-100">
                         <Link href={banner.button_link} className="btn banner-btn">
                           {banner.button_text}
                         </Link>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isMounted && bannerData.length > 1 && (
        <>
          <button className="embla__nav-btn prev" onClick={scrollPrev} aria-label="Previous slide">
            <svg className="embla__nav-icon" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          </button>
          <button className="embla__nav-btn next" onClick={scrollNext} aria-label="Next slide">
            <svg className="embla__nav-icon" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        </>
      )}
    </section>
  );
}