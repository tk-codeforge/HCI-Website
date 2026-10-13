"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import api from "@/utils/api";
import DOMPurify from "isomorphic-dompurify";

const TITLE_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

// Reserve the About section's expected dimensions while its CMS request is in
// flight. Keeping the reservation invisible avoids a loading flash while
// preventing the content below it from jumping when the request completes.
const ABOUT_LAYOUT_STYLES = `
    .about-3d-media-frame { min-height: 350px; }
    .about-3d-content-frame { min-height: 328px; }
    @media (min-width: 768px) {
      .about-3d-media-frame { min-height: 500px; }
    }
`;

const HomeAbout3D = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const mobileVideoRef = useRef(null);
    const desktopVideoRef = useRef(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const res = await api.get("/home-about-video");
                setData(res.data);
            } catch (error) {
                console.error("Failed to fetch About 3D data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAboutData();
    }, []);

    // Assign the video URL only when the About section reaches the viewport,
    // and only to the responsive video element currently visible. This avoids
    // having desktop and mobile video elements both request the same file.
    useEffect(() => {
        if (!data?.video) return;

        const section = sectionRef.current;
        if (!section) return;

        let sectionNearViewport = false;
        const mobileBreakpoint = window.matchMedia("(max-width: 767px)");

        const loadVisibleVideo = () => {
            if (!sectionNearViewport) return;

            // A breakpoint change should only attach a second source if the
            // section is still on screen, not just because the window resized.
            const sectionBounds = section.getBoundingClientRect();
            if (sectionBounds.bottom < 0 || sectionBounds.top > window.innerHeight) return;

            const isMobile = mobileBreakpoint.matches;
            const videoEnabled = isMobile ? data.show_video_mobile : data.show_video_desktop;
            const video = isMobile ? mobileVideoRef.current : desktopVideoRef.current;
            if (!videoEnabled || !video) return;

            if (video.getAttribute("src") !== data.video) {
                video.setAttribute("src", data.video);
                video.load();
            }

            const playAttempt = video.play();
            if (playAttempt && typeof playAttempt.catch === "function") {
                playAttempt.catch(() => {
                    // Autoplay may be restricted by the browser; keep layout intact.
                });
            }
        };

        let observer = null;
        if (typeof IntersectionObserver !== "undefined") {
            observer = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    sectionNearViewport = true;
                    loadVisibleVideo();
                    observer?.disconnect();
                }
            }, { rootMargin: "0px" });
            observer.observe(section);
        } else {
            // Compatibility fallback for browsers without IntersectionObserver.
            sectionNearViewport = true;
            loadVisibleVideo();
        }

        window.addEventListener("resize", loadVisibleVideo, { passive: true });

        return () => {
            observer?.disconnect();
            window.removeEventListener("resize", loadVisibleVideo);
        };
    }, [data]);

    if (loading) {
        return (
            <section ref={sectionRef} className="about-3d-wrapper py-5 my-lg-5" aria-hidden="true">
                <style>{ABOUT_LAYOUT_STYLES}</style>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-12 mb-4 mb-lg-0 pe-lg-5">
                            <div className="about-3d-media-frame d-block d-md-none w-100" style={{ visibility: "hidden" }} />
                            <div className="about-3d-media-frame d-none d-md-block w-100" style={{ visibility: "hidden" }} />
                        </div>
                        <div className="about-3d-content-frame col-lg-6 col-md-12 mt-3 mt-lg-0 text-center text-lg-start" style={{ visibility: "hidden" }}>
                            <div style={{ height: "clamp(2.4rem, 3.5vw, 3rem)", marginBottom: "1.5rem" }} />
                            <div style={{ height: "9rem", marginBottom: "3rem" }} />
                            <div style={{ height: "3.25rem" }} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!data) return null;
    const TitleTag = TITLE_TAGS.includes(data.title_tag) ? data.title_tag : "h1";

    return (
        <section ref={sectionRef} className="about-3d-wrapper py-5 my-lg-5">
            <style>{ABOUT_LAYOUT_STYLES}</style>
            <div className="container">
                <div className="row align-items-center">
                    
                    {/* LEFT SIDE: Dynamic Media */}
                    <div className="col-lg-6 col-md-12 mb-4 mb-lg-0 pe-lg-5">
                        
                        {/* --- MOBILE DISPLAY (< 768px) --- */}
                        <div className="about-3d-media-frame d-block d-md-none w-100">
                            {data.video && data.show_video_mobile ? (
                                <video
                                    ref={mobileVideoRef}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="none"
                                    className="w-100 rounded-4 shadow-lg object-fit-cover"
                                    style={{ minHeight: "350px", backgroundColor: "#f8f9fa" }}
                                />
                            ) : data.image ? (
                                <img 
                                    src={data.image} 
                                                                        alt={data.image_alt || data.title || "About High Creation"}
                                    className="w-100 rounded-4 shadow-sm object-fit-cover" 
                                />
                            ) : null}
                        </div>

                        {/* --- DESKTOP DISPLAY (>= 768px) --- */}
                        <div className="about-3d-media-frame d-none d-md-block w-100">
                            {data.video && data.show_video_desktop ? (
                                <video
                                    ref={desktopVideoRef}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="none"
                                    className="w-100 rounded-4 shadow-lg object-fit-cover"
                                    style={{ minHeight: "500px", backgroundColor: "#f8f9fa" }}
                                />
                            ) : data.image ? (
                                <img 
                                    src={data.image} 
                                                                        alt={data.image_alt || data.title || "About High Creation"} 
                                    className="w-100 rounded-4 shadow-sm object-fit-cover" 
                                />
                            ) : null}
                        </div>
                    </div>

                    {/* RIGHT SIDE: Text Content */}
                    <div className="about-3d-content-frame col-lg-6 col-md-12 mt-3 mt-lg-0 text-center text-lg-start">
                        <TitleTag className="fw-bold mb-4 text-dark" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: "1.2" }}>
                            {data.title}
                        </TitleTag>
                        
                        {/* <p className="text-muted font-poppins mb-5" style={{ fontSize: "16px", lineHeight: "1.8" }}>
                            {data.description}
                        </p> */}
                        <div
    className="text-muted font-poppins mb-5 about-3d-description"
    style={{ fontSize: "16px", lineHeight: "1.8" }}
    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.description || "") }}
/>

                        <div className="d-flex justify-content-center justify-content-lg-start">
    <a 
        href="/about-us" 
        className="btn text-white px-5 py-3 rounded-pill fw-bold shadow-sm"
        style={{ 
            background: "linear-gradient(135deg, #ff914d 0%, #ff5722 100%)",
            letterSpacing: "1px"
        }}
    >
        KNOW MORE ABOUT US
    </a>
</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeAbout3D;