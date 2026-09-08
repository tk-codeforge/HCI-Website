"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { MdOutlineChevronLeft, MdKeyboardArrowRight } from "react-icons/md";
import Card from "../components/Card";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/utils/api";

const defaultAltText = "High Creation Interior Design";

// 🌟 FIX: Bulletproof inline styling ensures arrows are ALWAYS clickable and visible
const NextArrow = ({ onClick }) => {
  return (
    <div 
      onClick={onClick} 
      style={{
        position: "absolute", right: "-15px", top: "45%", transform: "translateY(-50%)",
        zIndex: 10, cursor: "pointer", background: "#fff", borderRadius: "50%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", 
        justifyContent: "center", width: "45px", height: "45px"
      }}
    >
      <MdKeyboardArrowRight size={30} color="#ff914d" />
    </div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <div 
      onClick={onClick} 
      style={{
        position: "absolute", left: "-15px", top: "45%", transform: "translateY(-50%)",
        zIndex: 10, cursor: "pointer", background: "#fff", borderRadius: "50%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", 
        justifyContent: "center", width: "45px", height: "45px"
      }}
    >
      <MdOutlineChevronLeft size={30} color="#ff914d" />
    </div>
  );
};

const SliderCard = (props) => {
  const [sliderListData, setSliderListData] = useState([]);

  const fetchContentManagerPages = useCallback(async () => {
    try {
      const response = await api.get(`/cms-parent-child/ready_to_go_design`, {});
      if (response.status === 200) {
        setSliderListData(response.data);
      }
    } catch (err) {
      toast.error(err.message || "Failed to fetch data.");
    }
  }, []);

  useEffect(() => {
    fetchContentManagerPages();
  }, [fetchContentManagerPages]);

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, 
    slidesToScroll: 1,
    centerMode: true, // 🌟 FIX: This triggers the "mid image slightly above screen" logic
    centerPadding: "0px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // Tablet
        settings: { slidesToShow: 3, centerMode: true },
      },
      {
        breakpoint: 768, // Mobile
        settings: { slidesToShow: 1, centerMode: true, centerPadding: "40px" },
      },
    ],
  };

  return (
    <div className="m-4">
      {/* 🌟 FIX: This custom styling scales up the center slide to create the pop-out effect! */}
      <style jsx global>{`
        .slick-slide {
          transform: scale(0.85);
          transition: transform 400ms ease, opacity 400ms ease;
          opacity: 0.8;
        }
        .slick-center {
          transform: scale(1.05);
          opacity: 1;
          z-index: 10;
        }
        .slick-list {
          padding-top: 20px !important;
          padding-bottom: 20px !important;
        }
      `}</style>

      <div className="container my-5 position-relative">
        <Slider {...settings}>
          {sliderListData && sliderListData.map((slider) => (
            <div className="p-3" key={slider.id}>
              <Card
                cardLinkName={`/ready-togo-design/gallery?id=${slider?.id}`}
                cardNameALl="cardoffer"
                imgSrc={slider?.child_content?.image || "/images/about/About-banner.jpg"}
                imgAlt={slider.child_content?.title ?? defaultAltText}
                imgClass={"fastrack_img w-100"}
                titleCard={slider.child_content?.title}
                titleClass="text-center text-muted mb-0 pb-0"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SliderCard;