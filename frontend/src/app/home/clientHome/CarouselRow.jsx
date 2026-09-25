// "use client";
// import { useRef, useState, useCallback, useEffect } from "react";
// import { MdOutlineChevronLeft, MdKeyboardArrowRight } from "react-icons/md";

// const HIDE_DELAY_MS = 3000;

// export default function CarouselRow({ children, className = "" }) {
//   const trackRef = useRef(null);
//   const hideTimerRef = useRef(null);
//   const [showArrows, setShowArrows] = useState(false);

//   const revealArrows = useCallback(() => {
//     setShowArrows(true);

//     // Reset the auto-hide countdown on every touch/scroll so the arrows
//     // stay visible while the user is actively interacting.
//     if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
//     hideTimerRef.current = setTimeout(() => {
//       setShowArrows(false);
//     }, HIDE_DELAY_MS);
//   }, []);

//   // Clean up the pending timer if the component unmounts mid-countdown.
//   useEffect(() => {
//     return () => {
//       if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
//     };
//   }, []);

//   const scroll = (dir) => {
//     const el = trackRef.current;
//     if (!el) return;
//     const amount = el.clientWidth * 0.8;
//     el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
//     revealArrows(); // clicking an arrow also resets the 3s countdown
//   };

//   return (
//     <div className={`position-relative hcarousel-wrap ${showArrows ? "hcarousel-active" : ""}`}>
//       <style jsx global>{`
//         .hcarousel-wrap {
//           overflow-x: hidden; /* safety net: never let the arrows widen the page */
//         }
//         .hcarousel-arrow {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           z-index: 10;
//           cursor: pointer;
//           background: #fff;
//           border-radius: 50%;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 45px;
//           height: 45px;
//         }
//         .hcarousel-arrow-left { left: -15px; }
//         .hcarousel-arrow-right { right: -15px; }

//         @media (max-width: 767px) {
//           /* Keep arrows inside the row edge on mobile so they never
//              push the page wider than the viewport */
//           .hcarousel-arrow-left { left: 4px; }
//           .hcarousel-arrow-right { right: 4px; }

//           /* Hidden until the user touches/swipes the row, then fades in;
//              auto-hides again after HIDE_DELAY_MS of inactivity */
//           .hcarousel-arrow {
//             opacity: 0;
//             pointer-events: none;
//             transition: opacity 0.25s ease;
//           }
//           .hcarousel-wrap.hcarousel-active .hcarousel-arrow {
//             opacity: 1;
//             pointer-events: auto;
//           }
//         }
//       `}</style>

//       <div className="hcarousel-arrow hcarousel-arrow-left" onClick={() => scroll("left")}>
//         <MdOutlineChevronLeft size={30} color="#ff914d" />
//       </div>

//       <div
//         ref={trackRef}
//         className={`hcarousel-row ${className}`}
//         onTouchStart={revealArrows}
//         onPointerDown={revealArrows}
//         onScroll={revealArrows}
//       >
//         {children}
//       </div>

//       <div className="hcarousel-arrow hcarousel-arrow-right" onClick={() => scroll("right")}>
//         <MdKeyboardArrowRight size={30} color="#ff914d" />
//       </div>
//     </div>
//   );
// }


// "use client";
// import { useRef, useState, useCallback, useEffect } from "react";
// import { MdOutlineChevronLeft, MdKeyboardArrowRight } from "react-icons/md";

// const HIDE_DELAY_MS = 3000;

// export default function CarouselRow({ children, className = "", desktopCarousel = false }) {
//   const trackRef = useRef(null);
//   const hideTimerRef = useRef(null);
//   const [showArrows, setShowArrows] = useState(false);

//   const revealArrows = useCallback(() => {
//     setShowArrows(true);
//     if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
//     hideTimerRef.current = setTimeout(() => setShowArrows(false), HIDE_DELAY_MS);
//   }, []);

//   useEffect(() => {
//     return () => {
//       if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
//     };
//   }, []);

//   const scroll = (dir) => {
//     const el = trackRef.current;
//     if (!el) return;
//     const amount = el.clientWidth * 0.8;
//     el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
//     revealArrows();
//   };

//   return (
//     <div
//       className={`position-relative hcarousel-wrap ${showArrows ? "hcarousel-active" : ""} ${desktopCarousel ? "hcarousel-desktop" : ""}`}
//     >
//       <style jsx global>{`
//         .hcarousel-wrap {
//           overflow-x: hidden; /* safety net: never let the arrows widen the page */
//         }
//         .hcarousel-arrow {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           z-index: 10;
//           cursor: pointer;
//           background: #fff;
//           border-radius: 50%;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
//           display: none; /* hidden by default on all screen sizes */
//           align-items: center;
//           justify-content: center;
//           width: 45px;
//           height: 45px;
//         }
//         .hcarousel-arrow-left { left: -15px; }
//         .hcarousel-arrow-right { right: -15px; }

//         /* Desktop arrows: opt-in only, for rows passed desktopCarousel */
//         .hcarousel-desktop .hcarousel-arrow {
//           display: flex;
//         }

//         @media (max-width: 767px) {
//           /* Every row gets mobile carousel behavior, regardless of desktopCarousel */
//           .hcarousel-arrow-left { left: 4px; }
//           .hcarousel-arrow-right { right: 4px; }

//           .hcarousel-arrow {
//             display: flex;
//             opacity: 0;
//             pointer-events: none;
//             transition: opacity 0.25s ease;
//           }
//           .hcarousel-wrap.hcarousel-active .hcarousel-arrow {
//             opacity: 1;
//             pointer-events: auto;
//           }
//         }
//       `}</style>

//       <div className="hcarousel-arrow hcarousel-arrow-left" onClick={() => scroll("left")}>
//         <MdOutlineChevronLeft size={30} color="#ff914d" />
//       </div>

//       <div
//         ref={trackRef}
//         className={`hcarousel-row ${className}`}
//         onTouchStart={revealArrows}
//         onPointerDown={revealArrows}
//         onScroll={revealArrows}
//       >
//         {children}
//       </div>

//       <div className="hcarousel-arrow hcarousel-arrow-right" onClick={() => scroll("right")}>
//         <MdKeyboardArrowRight size={30} color="#ff914d" />
//       </div>
//     </div>
//   );
// }

"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { MdOutlineChevronLeft, MdKeyboardArrowRight } from "react-icons/md";

const HIDE_DELAY_MS = 3000;

export default function CarouselRow({ children, className = "", desktopCarousel = false }) {
  const trackRef = useRef(null);
  const hideTimerRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);

  const revealArrows = useCallback(() => {
    setShowArrows(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowArrows(false), HIDE_DELAY_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    revealArrows();
  };

  return (
    <div
      className={`position-relative hcarousel-wrap ${showArrows ? "hcarousel-active" : ""} ${desktopCarousel ? "hcarousel-desktop" : ""}`}
    >
      <style jsx global>{`
        .hcarousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          cursor: pointer;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          display: none; /* hidden by default everywhere */
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
        }
        .hcarousel-arrow-left { left: -15px; }
        .hcarousel-arrow-right { right: -15px; }

        /* Desktop carousel: opt-in only (Designer's Choice / Way We Work) */
        .hcarousel-desktop .hcarousel-arrow {
          display: flex;
        }
        .hcarousel-desktop .hcarousel-row {
          display: flex !important;
          flex-wrap: nowrap !important;
          overflow-x: auto !important;
          overflow-y: visible !important;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .hcarousel-desktop .hcarousel-row::-webkit-scrollbar { display: none; }
        .hcarousel-desktop .hcarousel-row > [class*="col-"] {
          scroll-snap-align: start;
        }

        @media (max-width: 767px) {
          .hcarousel-arrow-left { left: 4px; }
          .hcarousel-arrow-right { right: 4px; }

          .hcarousel-arrow {
            display: flex;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease;
          }
          .hcarousel-wrap.hcarousel-active .hcarousel-arrow {
            opacity: 1;
            pointer-events: auto;
          }
        }
      `}</style>

      <div className="hcarousel-arrow hcarousel-arrow-left" onClick={() => scroll("left")}>
        <MdOutlineChevronLeft size={30} color="#ff914d" />
      </div>

      <div
        ref={trackRef}
        className={`hcarousel-row ${className}`}
        onTouchStart={revealArrows}
        onPointerDown={revealArrows}
        onScroll={revealArrows}
      >
        {children}
      </div>

      <div className="hcarousel-arrow hcarousel-arrow-right" onClick={() => scroll("right")}>
        <MdKeyboardArrowRight size={30} color="#ff914d" />
      </div>
    </div>
  );
}