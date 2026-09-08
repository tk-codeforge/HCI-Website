"use client";
import React, { useState, useEffect } from "react";
import BackgroundImageWithHeading from "../components/BackgroundImageWithHeading";
import MainLayout from "../layouts/MainLayout";
import api from "@/utils/api"; 

// FALLBACK DATA (Unchanged)
const stepsData = [
  {
    id: "step-1",
    stepNumber: "01",
    title: "Consultation & Requirement Gathering",
    img: "/images/how-it-work/1.png",
    points: [
      "Your comfort is our priority. We offer online consultations, offline discussions, or in-person meetings.",
      "Choose the mode that suits your comfort and schedule.",
      "Our team ensures a smooth and personalized experience at every step.",
      "We understand your needs and bring your vision to life.",
      "Get the first design cut of your dream interior to visualize your space better."
    ],
    align: "left"
  },
  {
    id: "step-2",
    stepNumber: "02",
    title: "Site Visit & Measurement",
    img: "/images/how-it-work/2.png",
    points: [
      "Our team conducts a site visit to understand the space and layout.",
      "Accurate measurements are taken to ensure a perfect fit for your design.",
      "This step helps us plan every detail with precision and efficiency.",
      "It also allows us to identify any on-site challenges in advance.",
      "A well-measured space is the foundation of flawless interior execution."
    ],
    align: "right"
  },
  {
    id: "step-3",
    stepNumber: "03",
    title: "Design Presentation & Finalization",
    img: "/images/how-it-work/3.png",
    points: [
      "We begin by presenting carefully curated design concepts tailored to your preferences.",
      "Detailed layouts, 3D visuals, and material selections are shared for better clarity.",
      "Your feedback is taken into consideration to refine and finalize the design.",
      "Every element is discussed thoroughly to ensure it aligns with your vision.",
      "Final approval is taken before moving ahead with execution."
    ],
    align: "left"
  },
  {
    id: "step-4",
    stepNumber: "04",
    title: "Quotation & Agreement",
    img: "/images/how-it-work/10.png",
    points: [
      "A detailed quotation will be provided outlining all costs and services.",
      "It ensures complete transparency in pricing with no hidden charges.",
      "Once the quotation is approved, an agreement will be shared for mutual clarity.",
      "The agreement will cover scope of work, timelines, payment terms, and warranties.",
      "This helps ensure smooth execution and builds trust throughout the project."
    ],
    align: "right"
  },
  {
    id: "step-5",
    stepNumber: "05",
    title: "Execution & Handover",
    img: "/images/how-it-work/5.png",
    points: [
      "Our expert team ensures smooth and timely project execution as per the approved design.",
      "Quality checks are conducted at every stage to maintain high standards.",
      "Regular updates are shared to keep you informed throughout the process.",
      "Final inspection is done to ensure everything is perfect before handover.",
      "Your dream space is handed over, ready for you to move in and enjoy."
    ],
    align: "left"
  }
];

// export const metadata = {
//   title: "How High Creation Interior Work",
//   description: "How High Creation Interior Works For Residential Projects. Want to know more about work contact us today.",
//   alternates: {
//     canonical: "https://hcinterior.in/how-its-works",
//   },
// };

const HowItsWork = () => {
  // STATE ADDED FOR CMS INTEGRATION
  const [dynamicSteps, setDynamicSteps] = useState([]);
  const [bannerData, setBannerData] = useState({
    heading: "We make home interiors a breeze!",
    image: "contact_wrapper services"
  });


  useEffect(() => {
    const fetchCmsData = async () => {
      try {
        const response = await api.get('/cms-content/how_it_works');
if (response.data) {
  const content = response.data.json_content || {};
  if (Array.isArray(content.steps) && content.steps.length > 0) {
    setDynamicSteps(content.steps);
  }
  setBannerData(prev => ({
    ...prev,
    heading: content.bannerHeading || prev.heading,
    headingColor: content.bannerHeadingColor || "#ffffff",
    description: content.bannerDescription || "",
    descriptionColor: content.bannerDescriptionColor || "#ffffff",
    image: content.bg_image || prev.image,
  }));
}
      } catch (error) {
        console.error("Failed to load CMS data, falling back to static data.");
      }
    };
    fetchCmsData();
  }, []);

  useEffect(() => {
    if (dynamicSteps.length > 0 && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      
      // Fires the exact millisecond the new CMS cards are painted to the DOM
      requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }, [dynamicSteps]);

  // Determine which data to map: CMS data if it exists, otherwise the fallback stepsData
  const displaySteps = dynamicSteps.length > 0 ? dynamicSteps : stepsData;

  return (


      <MainLayout>
        <style dangerouslySetInnerHTML={{ __html: `
          .how-it-works-section {
            overflow: hidden;
            background-color: #ffffff;
          }
          
          .step-row-wrapper {
            padding: 4rem 0;
            transition: all 0.3s ease;
          }

          /* 🌟 LIGHT THEME (For Steps 1, 3, 5) */
          .step-row-light {
            background-color: #ffffff;
          }
          .step-row-light .step-title {
            color: #222222;
          }
          .step-row-light .step-list li {
            color: #555555;
          }

          /* 🌟 DARK THEME (For Steps 2, 4) */
          .step-row-dark {
            background-color: #1a1a1a; 
          }
          /* This strictly guarantees the heading is white in the dark sections */
          .step-row-dark .step-title {
            color: #ffffff !important;
          }
          .step-row-dark .step-list li {
            color: #e0e0e0; 
          }

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

          .step-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .step-list li {
            position: relative;
            padding-left: 35px;
            margin-bottom: 1rem;
            font-family: var(--font-poppins), sans-serif;
            font-size: 1.05rem;
            line-height: 1.6;
          }

          /* Custom Brand-Colored Checkmarks */
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

          /* Sizing constraints for the icons/images */
          .step-img-container {
            text-align: center;
            padding: 1rem;
          }

          .step-img {
            width: 100%;
            max-width: 450px; 
            height: auto;
            object-fit: contain;
            transition: transform 0.4s ease;
          }

          .step-img:hover {
            transform: translateY(-10px);
          }

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
          /* Mobile Adjustments */
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
            const isImageLeft = index % 2 === 0
            const isDarkTheme = index % 2 !== 0; 

            // Formats CMS text block into list items, or uses fallback points array
            const pointsToRender = step.points 
              ? step.points 
              : (step.description ? step.description.split('\n').filter(p => p.trim() !== '') : []);
            
            // Generates Step Number safely (01, 02...) if not provided by CMS
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
                          loading="lazy" 
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
      </MainLayout>
  );
};

export default HowItsWork;