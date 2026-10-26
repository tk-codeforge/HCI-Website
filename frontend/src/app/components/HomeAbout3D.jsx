// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import api from "@/utils/api";
// import DOMPurify from "isomorphic-dompurify";

// const TITLE_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

// const HomeAbout3D = () => {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchAboutData = async () => {
//             try {
//                 const res = await api.get("/home-about-video");
//                 setData(res.data);
//             } catch (error) {
//                 console.error("Failed to fetch About 3D data", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchAboutData();
//     }, []);

//     if (loading || !data) return null;
//     const TitleTag = TITLE_TAGS.includes(data.title_tag) ? data.title_tag : "h1";

//     return (
//         <section className="about-3d-wrapper py-5 my-lg-5">
//             <div className="container">
//                 <div className="row align-items-center">
                    
//                     {/* LEFT SIDE: Dynamic Media */}
//                     <div className="col-lg-6 col-md-12 mb-4 mb-lg-0 pe-lg-5">
                        
//                         {/* --- MOBILE DISPLAY (< 768px) --- */}
//                         <div className="d-block d-md-none w-100">
//                             {data.video && data.show_video_mobile ? (
//                                 <video 
//                                     src={data.video} 
//                                     autoPlay loop muted playsInline 
//                                     className="w-100 rounded-4 shadow-lg object-fit-cover" 
//                                     style={{ minHeight: "350px", backgroundColor: "#f8f9fa" }}
//                                 />
//                             ) : data.image ? (
//                                 <img 
//                                     src={data.image} 
//                                                                         alt={data.image_alt || data.title || "About High Creation"}
//                                     className="w-100 rounded-4 shadow-sm object-fit-cover" 
//                                 />
//                             ) : null}
//                         </div>

//                         {/* --- DESKTOP DISPLAY (>= 768px) --- */}
//                         <div className="d-none d-md-block w-100">
//                             {data.video && data.show_video_desktop ? (
//                                 <video 
//                                     src={data.video} 
//                                     autoPlay loop muted playsInline 
//                                     className="w-100 rounded-4 shadow-lg object-fit-cover" 
//                                     style={{ minHeight: "500px", backgroundColor: "#f8f9fa" }}
//                                 />
//                             ) : data.image ? (
//                                 <img 
//                                     src={data.image} 
//                                                                         alt={data.image_alt || data.title || "About High Creation"} 
//                                     className="w-100 rounded-4 shadow-sm object-fit-cover" 
//                                 />
//                             ) : null}
//                         </div>
//                     </div>

//                     {/* RIGHT SIDE: Text Content */}
//                     <div className="col-lg-6 col-md-12 mt-3 mt-lg-0 text-center text-lg-start">
//                         <TitleTag className="fw-bold mb-4 text-dark" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: "1.2" }}>
//                             {data.title}
//                         </TitleTag>
                        
//                         {/* <p className="text-muted font-poppins mb-5" style={{ fontSize: "16px", lineHeight: "1.8" }}>
//                             {data.description}
//                         </p> */}
//                         <div
//     className="text-muted font-poppins mb-5 about-3d-description"
//     style={{ fontSize: "16px", lineHeight: "1.8" }}
//     dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.description || "") }}
// />

//                         <div className="d-flex justify-content-center justify-content-lg-start">
//     <a 
//         href="/about-us" 
//         className="btn text-white px-5 py-3 rounded-pill fw-bold shadow-sm"
//         style={{ 
//             background: "linear-gradient(135deg, #ff914d 0%, #ff5722 100%)",
//             letterSpacing: "1px"
//         }}
//     >
//         KNOW MORE ABOUT US
//     </a>
// </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default HomeAbout3D;




"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/utils/api";
import DOMPurify from "isomorphic-dompurify";
import { canOptimize, optimizedUrl, optimizedSrcSet } from "@/utils/optimizedImage";

const TITLE_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

// Expected width/height of the About image. Only used to reserve space until the image
// has loaded (the real ratio takes over afterwards), so a wrong guess just means a small shift.
const ABOUT_IMAGE_RATIO = "4 / 3";

// Same <img> and classes as before, but: resized through /_next/image instead of the
// full CMS original, space reserved while loading, and lazy so the hidden mobile/desktop
// twin is not downloaded.
const AboutImage = ({ src, alt }) => {
    const optimizable = canOptimize(src);
    return (
        <img
            src={optimizable ? optimizedUrl(src, 1080) : src}
            srcSet={optimizedSrcSet(src)}
            sizes={optimizable ? "(min-width: 992px) 50vw, 100vw" : undefined}
            alt={alt}
            className="w-100 rounded-4 shadow-sm object-fit-cover"
            width={1200}
            height={900}
            style={{ height: "auto", aspectRatio: `auto ${ABOUT_IMAGE_RATIO}` }}
            loading="lazy"
            decoding="async"
        />
    );
};

// initialData is fetched on the server (HomeContent), so the About block is in the first
// HTML instead of popping in after hydration. If it is missing, we fetch in the browser
// exactly as before.
const HomeAbout3D = ({ initialData = null }) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (initialData) return;
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

    if (loading || !data) return null;
    const TitleTag = TITLE_TAGS.includes(data.title_tag) ? data.title_tag : "h1";

    return (
        <section className="about-3d-wrapper py-5 my-lg-5">
            <div className="container">
                <div className="row align-items-center">
                    
                    {/* LEFT SIDE: Dynamic Media */}
                    <div className="col-lg-6 col-md-12 mb-4 mb-lg-0 pe-lg-5">
                        
                        {/* --- MOBILE DISPLAY (< 768px) --- */}
                        <div className="d-block d-md-none w-100">
                            {data.video && data.show_video_mobile ? (
                                <video 
                                    src={data.video} 
                                    autoPlay loop muted playsInline 
                                    className="w-100 rounded-4 shadow-lg object-fit-cover" 
                                    style={{ minHeight: "350px", backgroundColor: "#f8f9fa" }}
                                />
                            ) : data.image ? (
                                <AboutImage src={data.image} alt={data.image_alt || data.title || "About High Creation"} />
                            ) : null}
                        </div>

                        {/* --- DESKTOP DISPLAY (>= 768px) --- */}
                        <div className="d-none d-md-block w-100">
                            {data.video && data.show_video_desktop ? (
                                <video 
                                    src={data.video} 
                                    autoPlay loop muted playsInline 
                                    className="w-100 rounded-4 shadow-lg object-fit-cover" 
                                    style={{ minHeight: "500px", backgroundColor: "#f8f9fa" }}
                                />
                            ) : data.image ? (
                                <AboutImage src={data.image} alt={data.image_alt || data.title || "About High Creation"} />
                            ) : null}
                        </div>
                    </div>

                    {/* RIGHT SIDE: Text Content */}
                    <div className="col-lg-6 col-md-12 mt-3 mt-lg-0 text-center text-lg-start">
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