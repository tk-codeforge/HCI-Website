"use client";
import React from "react";
import BackgroundImageWithHeading from "../components/BackgroundImageWithHeading";

export default function WhatWeOfferClient({ OFFERINGS, bannerData }) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .what-we-offer-section {
            overflow: hidden;
            background-color: #ffffff;
          }

          .offer-row-wrapper {
            padding: 4rem 0;
            transition: all 0.3s ease;
          }

          /* 🌟 LIGHT THEME (For Offers 1, 3) */
          .offer-row-light {
            background-color: #ffffff;
          }
          .offer-row-light .offer-title {
            color: #222222;
          }
          .offer-row-light .offer-list li {
            color: #555555;
          }

          /* 🌟 DARK THEME (For Offers 2, 4) */
          .offer-row-dark {
            background-color: #1a1a1a;
          }
          /* This strictly guarantees the heading is white in the dark sections */
          .offer-row-dark .offer-title {
            color: #ffffff !important;
          }
          .offer-row-dark .offer-list li {
            color: #e0e0e0;
          }

          .offer-title {
            font-family: var(--font-outfit), sans-serif;
            font-size: 2.2rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            line-height: 1.2;
          }

          .offer-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .offer-list li {
            position: relative;
            padding-left: 35px;
            margin-bottom: 1rem;
            font-family: var(--font-poppins), sans-serif;
            font-size: 1.05rem;
            line-height: 1.6;
          }

          /* Custom Brand-Colored Checkmarks */
          .offer-list li::before {
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
          .offer-img-container {
            aspect-ratio: 4 / 3;
            text-align: center;
            padding: 1rem;
          }

          .offer-img {
            width: 100%;
            /* 🌟 NEW: --img-scale defaults to 1 */
            max-width: calc(450px * var(--img-scale, 1));
            height: auto;
            object-fit: contain;
            border-radius: 1rem;
            transition: transform 0.4s ease;
          }

          .offer-img:hover {
            transform: translateY(-10px);
          }

          .what-we-offer-section .force-white-heading {
            color: var(--wwo-heading-color, #ffffff) !important;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9), 0 3px 12px rgba(0, 0, 0, 0.75);
          }

          .what-we-offer-section .text-center.bg-transparent {
            color: var(--wwo-description-color, #ffffff) !important;
            text-shadow: 0 1px 4px rgba(0, 0, 0, 0.9), 0 3px 12px rgba(0, 0, 0, 0.75);
            font-size: 1.25rem;
          }

          .what-we-offer-section.wwo-custom-bg .what_we_offer_banner {
            background-image: var(--wwo-bg-image) !important;
            background-size: cover !important;
            background-position: center !important;
          }

          /* Mobile Adjustments */
          @media (max-width: 767px) {
            .offer-row-wrapper { padding: 3rem 0; }
            .offer-title { font-size: 1.6rem; }
            .offer-list li { font-size: 0.95rem; margin-bottom: 0.8rem; }
            .offer-img { max-width: calc(280px * var(--img-scale, 1)); }
          }
        `,
        }}
      />

      <main
        className={`what-we-offer-section ${bannerData.bgImage ? "wwo-custom-bg" : ""}`}
        style={{
          "--wwo-heading-color": bannerData.headingColor,
          "--wwo-description-color": bannerData.descriptionColor,
          ...(bannerData.bgImage ? { "--wwo-bg-image": `url(${bannerData.bgImage})` } : {}),
        }}
      >
        <BackgroundImageWithHeading
          sectionBgImages={"contact_wrapper what_we_offer_banner"}
          sectionBgHeading={bannerData.heading}
          secBgHeadingClass="sec_bgheading_lass force-white-heading"
          sectionBgDescription={bannerData.description}
          secBgDesClass={"text-center bg-transparent"}
        />

        {OFFERINGS.map((offer, index) => {
          const isDarkTheme = index % 2 !== 0;
          const isImageLeft = !isDarkTheme;

          return (
            <div
              className={`offer-row-wrapper ${
                isDarkTheme ? "offer-row-dark" : "offer-row-light"
              }`}
              id={offer.id}
              key={offer.id}
            >
              <div className="container">
                <div className="row align-items-center">
                  {/* IMAGE COLUMN */}
                  <div
                    className={`col-12 col-md-5 ${
                      isImageLeft ? "order-1 order-md-1" : "order-1 order-md-2"
                    }`}
                  >
                    <div className="offer-img-container">
                      <img
                        src={offer.img}
                        alt={offer.title}
                        className="offer-img"
                        style={{ "--img-scale": offer.imageSize / 100 }}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* SPACING COLUMN FOR DESKTOP */}
                  <div className="d-none d-md-block col-md-1 order-md-1"></div>

                  {/* TEXT COLUMN */}
                  <div
                    className={`col-12 col-md-6 mt-4 mt-md-0 ${
                      isImageLeft ? "order-2 order-md-2" : "order-2 order-md-1"
                    }`}
                  >
                    <div className="offer-content px-2 px-md-0">
                      <h2 className="offer-title">{offer.title}</h2>

                      <ul className="offer-list">
                        {offer.points.map((point, i) => (
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