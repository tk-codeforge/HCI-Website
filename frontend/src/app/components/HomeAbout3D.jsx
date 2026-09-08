"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/utils/api";

const HomeAbout3D = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading || !data) return null;

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
                                <img 
                                    src={data.image} 
                                    alt="About High Creation" 
                                    className="w-100 rounded-4 shadow-sm object-fit-cover" 
                                />
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
                                <img 
                                    src={data.image} 
                                    alt="About High Creation" 
                                    className="w-100 rounded-4 shadow-sm object-fit-cover" 
                                />
                            ) : null}
                        </div>
                    </div>

                    {/* RIGHT SIDE: Text Content */}
                    <div className="col-lg-6 col-md-12 mt-3 mt-lg-0 text-center text-lg-start">
                        <h2 className="fw-bold mb-4 text-dark" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: "1.2" }}>
                            {data.title}
                        </h2>
                        
                        <p className="text-muted font-poppins mb-5" style={{ fontSize: "16px", lineHeight: "1.8" }}>
                            {data.description}
                        </p>

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