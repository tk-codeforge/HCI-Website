"use client";
import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function ExpandableRichText({ htmlContent, className = "rich-text-content", maxHeight = 280 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    // If the content is taller than the max height (roughly 100-120 words), enable the Read More feature
    if (contentRef.current && contentRef.current.scrollHeight > maxHeight) {
      setNeedsExpansion(true);
    }
  }, [htmlContent, maxHeight]);

  if (!htmlContent) return null;

  return (
    <div className="premium-expandable-wrapper" style={{ position: "relative", marginBottom: "1rem" }}>
      <div
        ref={contentRef}
        className={`${className} expandable-text-container`}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{
          maxHeight: needsExpansion && !isExpanded ? `${maxHeight}px` : "10000px",
          overflow: "hidden",
          transition: "max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative"
        }}
      />
      
      {/* The beautiful gradient fade overlay */}
      {needsExpansion && !isExpanded && (
        <div 
          className="fade-overlay" 
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            height: "140px",
            background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1) 90%)",
            pointerEvents: "none"
          }}
        />
      )}

      {/* The Premium Toggle Button */}
      {needsExpansion && (
        <div className="mt-3 text-start position-relative z-index-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: isExpanded ? "var(--hc-primary, #ff914d)" : "transparent",
              border: "2px solid var(--hc-primary, #ff914d)",
              color: isExpanded ? "#fff" : "var(--hc-primary, #ff914d)",
              padding: "8px 24px",
              borderRadius: "30px",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s ease",
              cursor: "pointer",
              fontFamily: "var(--font-poppins)"
            }}
            onMouseEnter={(e) => { 
                e.target.style.background = 'var(--hc-primary, #ff914d)'; 
                e.target.style.color = '#fff'; 
                e.target.style.boxShadow = '0 8px 20px rgba(255,145,77,0.3)';
            }}
            onMouseLeave={(e) => { 
                e.target.style.boxShadow = 'none';
                if (!isExpanded) {
                    e.target.style.background = 'transparent'; 
                    e.target.style.color = 'var(--hc-primary, #ff914d)'; 
                }
            }}
          >
            {isExpanded ? "Read Less" : "Read More"} 
            {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </button>
        </div>
      )}
    </div>
  );
}