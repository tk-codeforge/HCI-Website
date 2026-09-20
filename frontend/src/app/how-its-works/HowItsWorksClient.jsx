"use client";
import React, { useEffect } from "react";
import BackgroundImageWithHeading from "../components/BackgroundImageWithHeading";

export default function HowItsWorksClient({ displaySteps, bannerData }) {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .how-it-works-section {
          overflow: hidden;
          background-color: #ffffff;
        }
        .step-row-wrapper {
          padding: 4rem 0;
          transition: all 0.3s ease;
        }
        .step-row-light { background-color: #ffffff; }
        .step-row-light .step-title { color: #222222; }
        .step-row-light .step-list li { color: #555555; }
        .step-row-dark { background-color: #1a1a1a; }
        .step-row-dark .step-title { color: #ffffff !important; }
        .step-row-dark .step-list li { color: #e0e0e0; }
        .step-badge {
          display: inline-block;
          background-color: rgba(255, 145, 77, 0.1);
          color: #ff914d;
          font-family: var(--font-outfit), sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 8px 20px;
          border-radius: 50px;
          margin-bottom: 1rem;
          border: 1px solid rgba(255, 145, 77, 0.3);
        }
        .step-title {
          font-family: var(--font-outfit), sans-serif;
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        .step-list { list-style: none; padding: 0; margin: 0; }
        .step-list li {
          position: relative;
          padding-left: 35px;
          margin-bottom: 1rem;
          font-family: var(--font-poppins), sans-serif;
          font-size: 1.05rem;
          line-height: 1.6;
        }
        .step-list li::before {
          content: '✔';
          position: absolute;
          left: 0;
          top: 2px;
          color: #ff914d;
          font-size: 1.1rem;
          background: rgba(255, 145, 77, 0.15);
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .step-img-container { text-align: center; padding: 1rem; }
        .step-img {
          width: 100%;
          max-width: 450px; 
          height: auto;
          object-fit: contain;
          transition: transform 0.4s ease;
        }
        .step-img:hover { transform: translateY(-10px); }
        .how-it-works-section .force-white-heading {
          color: var(--hiw-heading-color, #ffffff) !important;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9), 0 3px 12px rgba(0, 0, 0, 0.75);
        }
        .how-it-works-section .text-center.bg-transparent {
          color: var(--hiw-description-color, #ffffff) !important;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9), 0 3px 12px rgba(0, 0, 0, 0.75);
          font-size: 1.25rem;
        }
        .how-it-works-section.hiw-custom-bg .contact_wrapper.services {
          background-image: var(--hiw-bg-image) !important;
          background-size: cover !important;
          background-position: center !important;
        }
        @media (max-width: 767px) {
          .step-row-wrapper { padding: 3rem 0; }
          .step-title { font-size: 1.6rem; }
          .step-list li { font-size: 0.95rem; margin-bottom: 0.8rem; }
          .step-img { max-width: 280px; }
        }
      `}} />

      <main
        className={`how-it-works-section ${bannerData.image && bannerData.image !== "contact_wrapper services" ? "hiw-custom-bg" : ""}`}
        style={{
          "--hiw-heading-color": bannerData.headingColor || "#ffffff",
          "--hiw-description-color": bannerData.descriptionColor || "#ffffff",
          ...(bannerData.image && bannerData.image !== "contact_wrapper services"
            ? { "--hiw-bg-image": `url(${bannerData.image})` }
            : {}),
        }}
      >
        <BackgroundImageWithHeading
          sectionBgImages={"contact_wrapper services"}
          sectionBgHeading={bannerData.heading} 
          secBgHeadingClass="sec_bgheading_lass force-white-heading" 
          sectionBgDescription={bannerData.description}
          secBgDesClass={"text-center bg-transparent"}
        />

        {displaySteps.map((step, index) => {
          const isImageLeft = index % 2 === 0;
          const isDarkTheme = index % 2 !== 0; 

          const pointsToRender = step.points 
            ? step.points 
            : (step.description ? step.description.split('\n').filter(p => p.trim() !== '') : []);
          
          const stepNumDisplay = step.stepNumber || (index + 1 < 10 ? '0' + (index + 1) : index + 1);
          const targetId = step.id || `step-${index + 1}`;

          return (
            <div className={`step-row-wrapper ${isDarkTheme ? 'step-row-dark' : 'step-row-light'}`} id={targetId} key={index}>
              <div className="container">
                <div className="row align-items-center">
                  
                  {/* IMAGE COLUMN */}
                  <div className={`col-12 col-md-5 ${isImageLeft ? 'order-1 order-md-1' : 'order-1 order-md-2'}`}>
                    <div className="step-img-container">
                      <img 
                        src={step.img || step.image} 
                        alt={step.title} 
                        className="step-img"
                        style={{ width: step.image_size ? step.image_size + '%' : '100%' }}
                        loading="eager" 
                      />
                    </div>
                  </div>

                  {/* SPACING COLUMN FOR DESKTOP */}
                  <div className="d-none d-md-block col-md-1 order-md-1"></div>

                  {/* TEXT COLUMN */}
                  <div className={`col-12 col-md-6 mt-4 mt-md-0 ${isImageLeft ? 'order-2 order-md-2' : 'order-2 order-md-1'}`}>
                    <div className="step-content px-2 px-md-0">
                      <span className="step-badge">Step {stepNumDisplay}</span>
                      
                      <h2 className="step-title">
                        {step.title}
                      </h2>
                      
                      <ul className="step-list">
                        {pointsToRender.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </main>
    </>
  );
}