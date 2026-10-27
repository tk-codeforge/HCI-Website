"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { MdOutlineChevronLeft, MdKeyboardArrowRight } from "react-icons/md";

const arrowStyle = {
  position: "absolute",
  top: "45%",
  transform: "translateY(-50%)",
  zIndex: 20,
  cursor: "pointer",
  background: "#fff",
  borderRadius: "50%",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "45px",
  height: "45px",
};

const NextArrow = ({ onClick }) => (
  <div
    role="button"
    aria-label="Next"
    onClick={onClick}
    style={{ ...arrowStyle, right: "-25px" }}
  >
    <MdKeyboardArrowRight size={30} color="#ff914d" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    role="button"
    aria-label="Previous"
    onClick={onClick}
    style={{ ...arrowStyle, left: "-15px" }}
  >
    <MdOutlineChevronLeft size={30} color="#ff914d" />
  </div>
);


export default function PopCarousel({ children, slidesToShow = 3, dimSides = true }) {
  const settings = {
  dots: false,
  infinite: true,
  speed: 300,
  cssEase: "ease-out",
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: slidesToShow === 3 ? "33.333%" : "0px",
  waitForAnimate: true,   // clicks are accepted even mid-animation
  swipeToSlide: true,      // a short drag moves the slider
  touchThreshold: 15,      // drag needed = ~1/15 of the width instead of 1/5
  draggable: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};

  return (
    <div className={`pop-carousel-desktop-only ${dimSides ? "" : "pop-carousel-no-dim"}`}>
      <style jsx global>{`
        .pop-carousel-desktop-only {
          display: none; 
        }
        @media (min-width: 768px) {
          .pop-carousel-desktop-only {
            display: block;
          }
          .pop-carousel-desktop-only .slick-slide {
            transform: scale(0.85);
            transition: transform 400ms ease, opacity 400ms ease;
            opacity: 0.8;
          }
          .pop-carousel-no-dim.pop-carousel-desktop-only .slick-slide {
            opacity: 1; 
          }
          .pop-carousel-desktop-only .slick-center {
            transform: scale(1.05);
            opacity: 1;
            z-index: 10;
          }
          .pop-carousel-desktop-only .slick-list {
            padding-top: 20px !important;
            padding-bottom: 20px !important;
          }
        }
      `}</style>
      <div className="position-relative">
        <Slider {...settings}>
          {React.Children.toArray(children).map((child, idx) => (
            <div className="p-3" key={idx}>
              {child}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}