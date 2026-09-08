"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EstimateCalculator({ estimateSectionData }) {
    const router = useRouter();
    const [submittingId, setSubmittingId] = useState(null);

    const handleCalculateClick = async (propertyType) => {
        setSubmittingId(propertyType);
        await new Promise(resolve => setTimeout(resolve, 600));
        setSubmittingId(null);
        router.push('/estimator-for-home');
    };

    const headingBase = estimateSectionData?.heading || "Get an estimate for your";
    const subHeading = estimateSectionData?.sub_heading || "Select your property type to calculate the cost of your interiors.";

    const defaultPropertyCards = [
        {
            id: '2BHK', title: '2 BHK', description: 'Perfect for small families. Get a tailored estimate for your cozy space.',
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18"></path><path d="M5 21V8l7-5 7 5v13"></path><rect x="9" y="14" width="6" height="7"></rect>
                </svg>
            )
        },
        {
            id: '3BHK', title: '3 BHK', description: 'Ideal for growing families needing that extra room and spacious layout.',
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 21h20"></path><path d="M4 21V8l8-5 8 5v13"></path><rect x="7" y="13" width="4" height="8"></rect><rect x="13" y="13" width="4" height="8"></rect><path d="M12 8v13"></path>
                </svg>
            )
        },
        {
            id: '4BHK', title: '4 BHK', description: 'Luxurious space with plenty of room for guests, a home office, and more.',
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 21h20"></path><path d="M4 21V6l8-4 8 4v15"></path><rect x="6" y="10" width="4" height="4"></rect><rect x="14" y="10" width="4" height="4"></rect><path d="M9 21v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5"></path>
                </svg>
            )
        },
        {
            id: 'Villa', title: 'Villa', description: 'Ultimate premium living. Calculate interiors for expansive, multi-floor spaces.',
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 21h20"></path><path d="M12 3L2 11h3v10h14V11h3L12 3z"></path><path d="M10 21v-5a2 2 0 0 1 4 0v5"></path><path d="M14 9h-4"></path><path d="M7 11v3"></path><path d="M17 11v3"></path>
                </svg>
            )
        }
    ];

    const cmsCards = Array.isArray(estimateSectionData?.cards)
    ? estimateSectionData.cards.filter(card => card?.is_active !== false)
    : [];

    const propertyCards =
    cmsCards.length > 0
        ? cmsCards
        : defaultPropertyCards;

    const rotatingWords =
    propertyCards.length > 0
        ? propertyCards.map(card => card?.title).filter(Boolean)
        : [];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useEffect(() => {
    if (rotatingWords.length <= 1) return;

    const interval = setInterval(() => {
        setCurrentWordIndex(
            prevIndex =>
                (prevIndex + 1) % rotatingWords.length
        );
    }, 4000);

    return () => clearInterval(interval);
}, [rotatingWords.length]);

    return (
        <section className="estimate-wrapper w-100 position-relative">
            <style dangerouslySetInnerHTML={{
                __html: `
                .estimate-wrapper { background-color: #fafafa; padding: 5rem 0; font-family: var(--font-poppins), sans-serif; }
                .estimate-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; text-align: center; }
                
                .estimate-section-title { font-family: var(--font-outfit), sans-serif; font-size: 2.8rem; font-weight: 600; color: #111; margin-bottom: 0.5rem; }
                .estimate-subheading { font-size: 1.1rem; color: #666; margin-bottom: 3.5rem; font-weight: 400; }

                .rotating-text-wrapper { display: inline-block; min-width: 120px; text-align: left; vertical-align: bottom; overflow: hidden; height: 1.2em; position: relative; top: 5px; }
                
                .rotating-text { 
                    color: #ff914d; 
                    display: block; 
                    font-weight: 600;
                    animation: slideUp 4s infinite cubic-bezier(0.25, 1, 0.5, 1); 
                }

                @keyframes slideUp {
                    0% { transform: translateY(100%); opacity: 0; }
                    15% { transform: translateY(0); opacity: 1; }
                    85% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-100%); opacity: 0; }
                }

                .property-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
                .property-card { background: #ffffff; border: 1px solid #eaeaea; border-radius: 16px; padding: 35px 25px; transition: all 0.3s ease; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
                .property-card:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(0,0,0,0.08); border-color: #ffc099; }
                .card-icon-wrapper { width: 80px; height: 80px; border-radius: 50%; background: var(--icon-bg-color, #fff6f0); color: #ff914d; display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; transition: all 0.3s ease; }
                .property-card:hover .card-icon-wrapper { background: #ff914d; color: #ffffff; transform: scale(1.05); }
                .card-title { font-family: var(--font-outfit), sans-serif; font-size: 1.5rem; font-weight: 700; color: #222; margin-bottom: 0.75rem; }
                .property-card:hover .card-icon-wrapper img {
                    filter: brightness(0) invert(1);
                }
                .card-description { font-size: 0.9rem; color: #666; line-height: 1.5; margin-bottom: 2rem; flex-grow: 1; }
                .btn-card-action { width: 100%; background: transparent; color: #ff914d; border: 2px solid #ff914d; padding: 12px 20px; border-radius: 8px; font-family: var(--font-outfit), sans-serif; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s ease; }
                .property-card:hover .btn-card-action { background: #ff914d; color: #ffffff; }
                .btn-card-action:disabled { background: #ffc099 !important; border-color: #ffc099 !important; color: #fff !important; cursor: not-allowed; }

                @media (max-width: 1024px) { .property-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; } }
                
                /* 🌟 FIX: Mobile Slider CSS matches HomeContent safe-zones */
                @media (max-width: 768px) { 
                    .estimate-section-title { font-size: 2.2rem; } 
                    .estimate-container { padding: 0 15px !important; overflow: hidden; }
                    .property-grid { 
                        display: flex !important; 
                        flex-wrap: nowrap !important; 
                        overflow-x: auto !important; 
                        overflow-y: visible !important; 
                        scroll-snap-type: x mandatory; 
                        padding-top: 10px !important; /* Added slight top buffer for shadows */
                        padding-bottom: 25px !important; 
                        -webkit-overflow-scrolling: touch; 
                        scrollbar-width: none; 
                        scroll-padding-left: 20px;
                        scroll-padding-left: 20px;
                        padding-left: 20px !important; 
                        padding-right: 20px !important; /* Buffer to prevent cropped edges */
                        margin-left: -20px; /* Bleed edge to edge of the screen */
                        margin-right: -20px; 
                        gap: 15px;
                    }
                    .property-grid::-webkit-scrollbar { display: none; }
                    .property-card { 
                        flex: 0 0 100% !important; 
                        max-width: 100% !important; 
                        scroll-snap-align: start !important; /* Ensures clean snapping to the left */
                        padding: 30px 20px;
                    }
                    .estimate-wrapper { padding: 4rem 0; }
                }
            `}} />

            <div className="estimate-container">
                <h2 className="estimate-section-title">
                    {headingBase} <span className="rotating-text-wrapper">
                        <span key={currentWordIndex} className="rotating-text">
                            {rotatingWords[currentWordIndex]}
                        </span>
                    </span>
                </h2>
                <p className="estimate-subheading">{subHeading}</p>

                <div className="property-grid">
                    {propertyCards.map((card) => {
                        const isThisCardLoading = submittingId === card.id;
                        return (
                            <div key={card.id} className="property-card">
                                <div
    className="card-icon-wrapper"
    style={{
        "--icon-bg-color": card?.icon_bg_color || "#fff6f0"
    }}
>
    {card?.image ? (
        <img
            src={card.image}
            alt={card?.title || "Estimate icon"}
            style={{
                width: "48px",
                height: "48px",
                objectFit: "contain"
            }}
        />
    ) : (
        card?.icon
    )}
</div>
                                <h3 className="card-title">{card.title}</h3>
                                <p className="card-description">{card.description}</p>
                                
                                <button onClick={() => handleCalculateClick(card.id)} className="btn-card-action" disabled={isThisCardLoading}>
                                    {isThisCardLoading ? 'Processing...' : 'Calculate Estimate'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}