"use client";
import { useState, useEffect, useCallback } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpandArrowsAlt } from "react-icons/fa";

const GalleryDetail = ({ imgGalUrl, imgGalAlt, imgGalImgClass, images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const hasImages = images.length > 0;
  
  const currentImage = hasImages 
    ? (images[currentIndex]?.image ?? imgGalUrl) 
    : imgGalUrl;

  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    if (hasImages) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  }, [hasImages, images.length]);

  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    if (hasImages) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }
  }, [hasImages, images.length]);

  const handleClick = () => {
    const index = images.findIndex((img) => img.image === imgGalUrl);
    if (index !== -1) {
      setCurrentIndex(index);
    }
    setIsFullScreen(true);
    // Prevent background scrolling when lightbox is open
    document.body.style.overflow = "hidden";
  };

  const handleClose = useCallback(() => {
    setIsFullScreen(false);
    // Restore background scrolling
    document.body.style.overflow = "auto";
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullScreen) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen, handleClose, handleNext, handlePrev]);

  return (
    <div className="gallery-item-wrapper h-100 position-relative rounded-4 overflow-hidden shadow-sm" style={{ backgroundColor: '#f8f9fa' }}>
      
      {/* --- THUMBNAIL (With Hover Effect) --- */}
      <div 
        className="position-relative h-100 w-100 cursor-pointer overflow-hidden group" 
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <img
          src={imgGalUrl}
          alt={imgGalAlt}
          className={`${imgGalImgClass} premium-thumbnail`}
          decoding="async"  
          loading="lazy" 
        />
        {/* Hover Overlay */}
        <div className="thumbnail-overlay">
           <span className="view-btn"><FaExpandArrowsAlt className="me-2"/> View Full Size</span>
        </div>
      </div>

      {/* --- FULLSCREEN LIGHTBOX --- */}
      {isFullScreen && (
        <div className="lightbox-backdrop" onClick={handleClose}>
          
          <button className="glass-btn close-btn shadow-sm" onClick={handleClose} aria-label="Close">
            <FaTimes />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={currentImage}
              alt={imgGalAlt || "Fullscreen view"}
              className="lightbox-img"
              decoding="async"  
              loading="lazy" 
            />
            
            {hasImages && images.length > 1 && (
              <>
                <button className="glass-btn nav-btn left shadow-sm" onClick={handlePrev} aria-label="Previous">
                  <FaChevronLeft />
                </button>
                <button className="glass-btn nav-btn right shadow-sm" onClick={handleNext} aria-label="Next">
                  <FaChevronRight />
                </button>
                <div className="image-counter font-poppins">
                   {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* --- STYLES --- */}
      <style jsx>{`
        /* Thumbnail Hover Effects */
        .premium-thumbnail {
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .gallery-item-wrapper:hover .premium-thumbnail {
          transform: scale(1.05);
        }
        
        .thumbnail-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .gallery-item-wrapper:hover .thumbnail-overlay {
          opacity: 1;
        }
        
        .view-btn {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          color: white;
          padding: 10px 20px;
          border-radius: 30px;
          font-family: var(--font-poppins), sans-serif;
          font-weight: 500;
          font-size: 14px;
          border: 1px solid rgba(255,255,255,0.4);
          transform: translateY(20px);
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .gallery-item-wrapper:hover .view-btn {
          transform: translateY(0);
        }

        /* Lightbox Backdrop */
        .lightbox-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(15, 23, 42, 0.95); /* Deep slate premium background */
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999999;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: scaleUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 85vh;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        /* Glassmorphism Controls */
        .glass-btn {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .glass-btn:hover {
          background: rgba(255, 145, 77, 0.9); /* Theme Orange on hover */
          border-color: #ff914d;
          transform: scale(1.1);
        }

        .close-btn {
          position: absolute;
          top: 25px;
          right: 25px;
          width: 50px;
          height: 50px;
          font-size: 20px;
          z-index: 100;
        }

        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          font-size: 18px;
        }
        .nav-btn.left { left: -70px; }
        .nav-btn.right { right: -70px; }
        .nav-btn:hover { transform: translateY(-50%) scale(1.1); }

        .image-counter {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          letter-spacing: 2px;
        }

        @media (max-width: 768px) {
          .nav-btn { width: 40px; height: 40px; }
          .nav-btn.left { left: 10px; background: rgba(0,0,0,0.5); border: none; }
          .nav-btn.right { right: 10px; background: rgba(0,0,0,0.5); border: none; }
          .close-btn { top: 15px; right: 15px; width: 40px; height: 40px; }
          .lightbox-img { max-width: 100vw; max-height: 75vh; border-radius: 0; }
        }
      `}</style>
    </div>
  );
};

export default GalleryDetail;