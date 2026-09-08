"use client";
import { useState } from "react";

const ResidentialCard = (props) => {
  const [imageError, setImageError] = useState(false);
  
  // Safe fallback for broken/missing images
  const defaultImage = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  const displayImage = imageError || !props.resiImgUrl ? defaultImage : props.resiImgUrl;

  return (
    <div className="h-100">
      <a href={props.projectCardLink} className="text-decoration-none">
        <div
          className={`${props.cardNameResid} card h-100 border-0 shadow-sm rounded-4 overflow-hidden`}
          style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px)";
            e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
          }}
        >
          {/* Image Container */}
          <div className="position-relative overflow-hidden bg-light" style={{ aspectRatio: '4/3' }}>
            <img
              src={displayImage}
              alt={props.resiImgAlt || "Residential Project"}
              className={`w-100 h-100 ${props.resiImgClass || ""}`}
              style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              loading="lazy"
              decoding="async"
              onError={() => setImageError(true)} 
            />
          </div>

          {/* Card Body */}
          <div className="card-body d-flex flex-column px-4 py-4 bg-white">
            <h5 className={`${props.residentialTitleClass} fw-bold text-dark mb-3`}>
              {props.residentialTitle}
            </h5>
            
            {/* Description - Safely rendering HTML with improved typography */}
            <div 
              className={`${props.residentialClassCss} text-muted mb-4 flex-grow-1`} 
              style={{ 
                display: '-webkit-box', 
                WebkitLineClamp: 3, 
                WebkitBoxOrient: 'vertical', 
                overflow: 'hidden',
                fontSize: '0.95rem',     // Slightly smaller text for elegance
                lineHeight: '1.6',       // Better breathing room between lines
                textOverflow: 'ellipsis'
              }}
              // This line parses the CMS HTML tags properly!
              dangerouslySetInnerHTML={{ __html: props.residentialDescriptiion || "" }} 
            />

            <div className="mt-auto">
              <span className="know_more rounded-pill px-4 py-2 fw-semibold d-inline-block">
                {props.residentialButton} <span className="ms-1">→</span>
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ResidentialCard;