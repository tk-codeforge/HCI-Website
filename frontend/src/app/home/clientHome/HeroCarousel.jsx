"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Image, { getImageProps } from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import api from "@/utils/api";

// Renders ONE banner image. When a separate mobile image exists we use a <picture>, so
// the browser downloads only the version for its screen. Before, both versions were
// rendered with `priority`, which preloaded and downloaded BOTH on every device.
const FILL_STYLE = { position: "absolute", inset: 0, width: "100%", height: "100%", color: "transparent" };
const isVideoSource = (value) => /\.(?:mp4|webm|ogg|mov)(?:[?#].*)?$/i.test(String(value || ""));

// Carousel videos load and play directly. Poster images are intentionally not
// used here; the About section is the only video area with a poster fallback.
function HeroBannerVideo({ src, active, title }) {
  const videoRef = React.useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    if (!active) {
      video.pause();
      return undefined;
    }

    const tryPlay = () => {
      const promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {
          // Browsers may block autoplay; keep the active video source attached.
        });
      }
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("canplay", tryPlay, { once: true });
    }

    return () => {
      video.pause();
      video.removeEventListener("canplay", tryPlay);
    };
  }, [active, src]);

  return (
    <video
      ref={videoRef}
      className="banner-media"
      autoPlay={Boolean(active)}
      loop
      muted
      playsInline
      preload={active ? "auto" : "none"}
      src={active ? src : undefined}
      aria-label={title || undefined}
    />
  );
}

function HeroPicture({ desktopSrc, mobileSrc, alt, mobileAlt, isFirstSlide }) {
  const quality = 75;
  // A mobile video must be rendered by HeroBannerVideo, never as an <img src="...mp4">.
  const mobileImageSrc = mobileSrc && !isVideoSource(mobileSrc) ? mobileSrc : null;

  if (!mobileImageSrc) {
    return (
      <Image
        src={desktopSrc}
        className="banner-media"
        alt={alt}
          width={1920}
        height={800}
        style={FILL_STYLE}
        priority={isFirstSlide}
        fetchPriority={isFirstSlide ? "high" : "auto"}
        quality={quality}
        sizes="100vw"
      />
    );
  }

    const common = { width: 1920, height: 800, sizes: "100vw", quality, style: FILL_STYLE };
  const desktop = getImageProps({ ...common, src: desktopSrc, alt }).props;
  const mobile = getImageProps({ ...common, width: 768, height: 960, src: mobileImageSrc, alt: mobileAlt }).props;

  return (
    <picture>
      {/* 768px matches the old .desktop-banner / .mobile-banner CSS switch */}
      <source media="(min-width: 768px)" srcSet={desktop.srcSet} sizes="100vw" />
      <img
        {...mobile}
        className="banner-media"
        loading={isFirstSlide ? "eager" : "lazy"}
        fetchPriority={isFirstSlide ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}

export default function HeroCarousel({ bannerData, carouselSpeed = null }) {
  const [showRest, setShowRest] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  // carouselSpeed (seconds) comes from the server; 7s is the old default.
  const [speed, setSpeed] = useState(carouselSpeed ? Number(carouselSpeed) * 1000 : 7000);
    const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (carouselSpeed) return; // already provided by the server
    api.get("/site-settings")
      .then((res) => {
        if (res.data?.carousel_speed) {
          setSpeed(res.data.carousel_speed * 1000);
        }
      })
      .catch((err) => console.error("Failed to load carousel speed", err));
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 100 }, 
    [Autoplay({ delay: speed, stopOnInteraction: false })]
  );

  useEffect(() => {
    if (emblaApi && emblaApi.plugins().autoplay) {
      emblaApi.plugins().autoplay.options.delay = speed;
      emblaApi.plugins().autoplay.reset();
    }
  }, [speed, emblaApi]);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    setIsMounted(true);
    if (window.innerWidth >= 768) {
      const timer = setTimeout(() => setShowRest(true), 2500);
      return () => clearTimeout(timer);
    } else {
      setShowRest(true);
    }
  }, []);

    useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const activeBanners = (showRest ? bannerData : bannerData?.slice(0, 1) || []).filter(Boolean);

  if (!bannerData || bannerData.length === 0) return null;

  return (
    <section className="home-hero position-relative w-100" style={{ backgroundColor: '#f0f0f0', marginTop: '35px' }}>
      <style dangerouslySetInnerHTML={{ __html: `

                .home-hero .embla { 
            overflow: hidden; 
            width: 100%; 
            aspect-ratio: 774/1016; 
        }
        
        @media (min-width: 768px) { 
            .home-hero .embla { aspect-ratio: 192/85; min-height: unset; } 
        }
        
        .home-hero .embla__container { display: flex; height: 100%; }
        .home-hero .embla__slide { flex: 0 0 100%; min-width: 0; position: relative; }
        .home-hero .banner-media { object-fit: cover; object-position: center; width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
        .home-hero .banner-video-shell { position: absolute; inset: 0; width: 100%; height: 100%; }
        
        /* Mobile vs Desktop image toggle classes */
        .home-hero .desktop-banner { display: none !important; }
        .home-hero .mobile-banner { display: block !important; }

        .home-hero .banner-overlay { 
            position: absolute; 
            z-index: 10; 
            inset: 0; 
            display: flex; 
            flex-direction: column; 
            justify-content: flex-end; 
            align-items: center;      
            padding-bottom: 7rem;      
            pointer-events: none;
            background: transparent;
            text-align: center;
        }
        
        .home-hero .banner-overlay * { pointer-events: auto; }
        .home-hero .banner-content-wrapper { width: 100%; padding: 0 1.25rem; }

        .home-hero .embla__dots {
            position: absolute;
            bottom: 45px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            z-index: 20;
        }
        .home-hero .embla__dot {
            width: 10px; height: 10px; border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
            border: none; cursor: pointer; padding: 0;
            transition: all 0.3s ease;
        }
        .home-hero .embla__dot:hover { background-color: rgba(255, 255, 255, 0.8); }
        .home-hero .embla__dot--selected {
            background-color: #ff914d; transform: scale(1.4);
            box-shadow: 0 0 8px rgba(255, 145, 77, 0.8);
        }

        .home-hero .banner-top-slogan { 
            font-family: var(--dynamic-paragraph-font) !important;
            font-size: 0.8rem; 
            font-weight: 300 !important;
            letter-spacing: 2px; 
            margin-bottom: 0.5rem !important; 
            text-transform: uppercase;
            color: #ff914d !important; 
        }
        
        /* THICK Main Heading - Reduced font-size for mobile from 2rem to 1.5rem */
        .home-hero .home_banner_heading { 
            font-family: var(--dynamic-heading-font) !important; 
            font-size: 1.5rem; 
            font-weight: 800 !important;
            line-height: 1.2; 
            margin-bottom: 0.5rem !important; 
            color: #ffffff !important; 
        }
        
        .home-hero .font_stylish_home { 
            font-family: var(--dynamic-heading-font) !important; 
            font-size: 1.1rem; 
            font-weight: 300 !important;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #ffffff !important; 
            margin-bottom: 0.5rem !important; 
            line-height: 1.2;
        }
        
        .home-hero .banner-desc { 
            font-family: var(--dynamic-paragraph-font) !important;
            font-size: 0.9rem; 
            font-weight: 300 !important;
            line-height: 1.4; 
            margin-bottom: 1.5rem !important; 
            color: rgba(255, 255, 255, 0.9) !important; 
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .home-hero .banner-btn {
            background-color: #ff914d; border: none;
            font-family: var(--dynamic-heading-font) !important;
            font-weight: 700 !important;
            box-shadow: 0 4px 15px rgba(255, 145, 77, 0.4);
            transition: all 0.3s ease; text-transform: uppercase;
            letter-spacing: 0.8px; color: #ffffff !important;
            padding: 8px 24px !important; /* Added side padding for mobile */
            font-size: 0.8rem !important;
            border-radius: 24px; 
            display: inline-block; /* Keeps button wrapping the text */
            width: fit-content; /* Hugs the text size */
            max-width: 100%; /* Prevents overflow if text is very long */
            margin: 0 auto; /* Centers the button naturally */
        }
        .home-hero .banner-btn:hover { background-color: #e67d3c; transform: translateY(-2px); }

        .home-hero .embla__nav-btn { display: none; }

        @media (min-width: 768px) {
            .home-hero .desktop-banner { display: block !important; }
            .home-hero .mobile-banner { display: none !important; }

            .home-hero .banner-overlay { padding-bottom: 9rem; background: transparent; }
            .home-hero .banner-content-wrapper { width: 90%; max-width: 1200px; padding: 0 20px; }
            .home-hero .banner-top-slogan { font-size: 1.1rem; margin-bottom: 1rem !important; }
            
            /* Desktop font size restored */
            .home-hero .home_banner_heading { font-size: 4.5rem; margin-bottom: 1rem !important; line-height: 1.1; }
            
            .home-hero .font_stylish_home { font-size: 1.5rem; margin-bottom: 1rem !important; }
            .home-hero .banner-desc { font-size: 1.2rem; line-height: 1.6; margin-bottom: 2rem !important; max-width: 800px; margin-left: auto; margin-right: auto; }
            .home-hero .banner-btn { display: inline-block; width: fit-content; padding: 16px 50px !important; font-size: 1.1rem !important; border-radius: 50px; }
            
            .home-hero .embla__dots {
                bottom: 55px; 
            }

            .home-hero .embla__nav-btn {
                display: flex; position: absolute; top: 50%; transform: translateY(-50%); z-index: 20;
                width: 44px; height: 44px; background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(4px);
                border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 50%;
                align-items: center; justify-content: center; color: white; cursor: pointer;
            }
            .home-hero .embla__nav-btn:hover { background: rgba(255, 145, 77, 0.9); border-color: #ff914d; }
            .home-hero .embla__nav-btn.prev { left: 20px; }
            .home-hero .embla__nav-btn.next { right: 20px; }
        }

        @media (min-width: 1200px) { .home-hero .home_banner_heading { font-size: 5.5rem; } }
        .home-hero .embla__nav-icon { width: 20px; height: 20px; fill: currentColor; }
      `}} />

      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {activeBanners.map((banner, index) => {
            const mediaSrc = isMobile && banner?.mobile_banner_image ? banner.mobile_banner_image : banner?.banner_image;
            const isVideo = isVideoSource(mediaSrc);
            const isFirstSlide = index === 0;
            const isActiveSlide = index === selectedIndex;

            return (
              <div className="embla__slide" key={banner.id || index}>
                {isVideo ? (
                  <HeroBannerVideo
                    key={`${banner.id || index}-${mediaSrc}`}
                    src={mediaSrc}
                    active={isActiveSlide}
                    title={banner?.title?.trim() || "High Creation Interior banner"}
                  />
                ) : (
                  <HeroPicture
                    desktopSrc={banner?.banner_image ?? "/images/home-banner-1.png"}
                    mobileSrc={banner?.mobile_banner_image}
                    alt={banner?.title?.trim() || "High Creation Interior Banner"}
                    mobileAlt={banner?.title?.trim() || "High Creation Interior Mobile Banner"}
                    isFirstSlide={isFirstSlide}
                  />
                )}

                <div className="banner-overlay">
                  <div className="banner-content-wrapper">
                    {banner?.top_slogan && <div className="banner-top-slogan" style={{ textShadow: '0px 4px 12px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,0.8)' }}>{banner.top_slogan}</div>}
                    
                    {isFirstSlide ? (
                      <h1 className="home_banner_heading" style={{ textShadow: '0px 4px 12px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,0.8)' }}>{banner?.title}</h1>
                    ) : (
                      <h2 className="home_banner_heading" style={{ textShadow: '0px 4px 12px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,0.8)' }}>{banner?.title}</h2>
                    )}
                    
                    {banner?.sub_title && <div className="font_stylish_home" style={{ textShadow: '0px 4px 12px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,0.8)' }}>{banner.sub_title}</div>}
                    {banner?.description && <p className="banner-desc" style={{ textShadow: '0px 4px 12px rgba(0,0,0,0.9), 0px 1px 3px rgba(0,0,0,0.8)' }}>{banner.description}</p>}
                    
                    {banner?.button_text && banner?.button_link && (
                       <div className="mt-2 w-100">
                         <Link href={banner.button_link} className="btn banner-btn">{banner.button_text}</Link>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isMounted && activeBanners.length > 1 && (
        <div className="embla__dots">
          {activeBanners.map((_, index) => (
            <button key={index} className={`embla__dot ${index === selectedIndex ? 'embla__dot--selected' : ''}`} type="button" onClick={() => scrollTo(index)} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      )}

      {isMounted && bannerData.length > 1 && (
        <>
          <button className="embla__nav-btn prev" onClick={scrollPrev} aria-label="Previous slide"><svg className="embla__nav-icon" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg></button>
          <button className="embla__nav-btn next" onClick={scrollNext} aria-label="Next slide"><svg className="embla__nav-icon" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></button>
        </>
      )}
    </section>
  );
}