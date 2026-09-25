// "use client";
// import React from "react";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
// import { MdOutlineChevronLeft, MdKeyboardArrowRight } from "react-icons/md";

// const NextArrow = ({ onClick }) => (
//   <div
//     onClick={onClick}
//     style={{
//       position: "absolute", right: "-15px", top: "45%", transform: "translateY(-50%)",
//       zIndex: 10, cursor: "pointer", background: "#fff", borderRadius: "50%",
//       boxShadow: "0 2px 8px rgba(0,0,0,0.2)", display: "flex", alignItems: "center",
//       justifyContent: "center", width: "45px", height: "45px",
//     }}
//   >
//     <MdKeyboardArrowRight size={30} color="#ff914d" />
//   </div>
// );

// const PrevArrow = ({ onClick }) => (
//   <div
//     onClick={onClick}
//     style={{
//       position: "absolute", left: "-15px", top: "45%", transform: "translateY(-50%)",
//       zIndex: 10, cursor: "pointer", background: "#fff", borderRadius: "50%",
//       boxShadow: "0 2px 8px rgba(0,0,0,0.2)", display: "flex", alignItems: "center",
//       justifyContent: "center", width: "45px", height: "45px",
//     }}
//   >
//     <MdOutlineChevronLeft size={30} color="#ff914d" />
//   </div>
// );

// export default function PopCarousel({ children, slidesToShow = 3, dimSides = true }) {
//   const settings = {
//     dots: false,
//     infinite: false,
//     speed: 500,
//     slidesToShow,
//     slidesToScroll: 1,
//     centerMode: true,
//     centerPadding: "0px",
//     nextArrow: <NextArrow />,
//     prevArrow: <PrevArrow />,
//   };

//   return (
//     <div className={`pop-carousel-desktop-only ${dimSides ? "" : "pop-carousel-no-dim"}`}>
//       <style jsx global>{`
//         .pop-carousel-desktop-only {
//           display: none; /* hidden on mobile — CarouselRow handles mobile instead */
//         }
//         @media (min-width: 768px) {
//           .pop-carousel-desktop-only {
//             display: block;
//           }
//                     .pop-carousel-desktop-only .slick-slide {
//             transform: scale(0.85);
//             transition: transform 400ms ease, opacity 400ms ease;
//             opacity: 0.8;
//           }
//           .pop-carousel-no-dim.pop-carousel-desktop-only .slick-slide {
//             opacity: 1; /* solid-color cards look washed out when faded, unlike photo cards */
//           }
//           .pop-carousel-desktop-only .slick-center {
//             transform: scale(1.05);
//             opacity: 1;
//             z-index: 10;
//           }
//           .pop-carousel-desktop-only .slick-list {
//             padding-top: 20px !important;
//             padding-bottom: 20px !important;
//           }
//         }
//       `}</style>
//       <div className="position-relative">
//         <Slider {...settings}>
//           {React.Children.toArray(children).map((child, idx) => (
//             <div className="p-3" key={idx}>
//               {child}
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </div>
//   );
// }

"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { MdOutlineChevronLeft, MdKeyboardArrowRight } from "react-icons/md";

const NextArrow = ({ onClick, currentSlide, slideCount }) => {
  const isEnd = currentSlide === slideCount - 1;
  return (
    <div
      onClick={isEnd ? undefined : onClick}
      style={{
        position: "absolute", right: "-15px", top: "45%", transform: "translateY(-50%)",
        zIndex: 10, cursor: isEnd ? "default" : "pointer", background: "#fff", borderRadius: "50%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)", display: "flex", alignItems: "center",
        justifyContent: "center", width: "45px", height: "45px",
        opacity: isEnd ? 0.3 : 1,
        pointerEvents: isEnd ? "none" : "auto",
      }}
    >
      <MdKeyboardArrowRight size={30} color="#ff914d" />
    </div>
  );
};

const PrevArrow = ({ onClick, currentSlide }) => {
  const isStart = currentSlide === 0;
  return (
    <div
      onClick={isStart ? undefined : onClick}
      style={{
        position: "absolute", left: "-15px", top: "45%", transform: "translateY(-50%)",
        zIndex: 10, cursor: isStart ? "default" : "pointer", background: "#fff", borderRadius: "50%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)", display: "flex", alignItems: "center",
        justifyContent: "center", width: "45px", height: "45px",
        opacity: isStart ? 0.3 : 1,
        pointerEvents: isStart ? "none" : "auto",
      }}
    >
      <MdOutlineChevronLeft size={30} color="#ff914d" />
    </div>
  );
};

export default function PopCarousel({ children, slidesToShow = 3, dimSides = true }) {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    // Hack to unlock the edges: show 1 slide but pad the sides to mimic 3 slides
    slidesToShow: 1, 
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: slidesToShow === 3 ? "33.333%" : "0px",
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