// "use client";
// import { toast } from "react-toastify";
// import BackgroundImageWithHeading from "../components/BackgroundImageWithHeading";
// import MainLayout from "../layouts/MainLayout";
// import { useCallback, useEffect, useState } from "react";
// import api from "@/utils/api";
// import Script from "next/script"; // ✅ Import Next.js Script
// // export const metadata = {
// //   title: "terms - My Website",
// //   description: "Learn more about our company, team, and values.",
// // };



// const Terms = () => {
//   const [pageData, setPageData] = useState("");
//   const [loading, setLoading] = useState(false);

//   const fetchContentManagerPages = useCallback(async () => {
//     try {
//       const response = await api.get("/cms-content/term_and_condition", {});
//       if (response.data && response.data.json_content) {
//         setPageData(response.data?.json_content?.html);
//       }
//       setLoading(false);
//     } catch (err) {
//       toast.error(err.message ?? "Failed to fetch data. Please try again.");
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchContentManagerPages();
//   }, [fetchContentManagerPages]);

//   return (
//     <div>
//       <head>
//         <title> Thank You = High Creation Interior </title>
//         <meta
//           name="description"
//           content="Thank you for contacting High Creation Interior."
//         />
//       </head>
//        {/* ✅ Facebook Pixel Script */}
//        <Script id="facebook-pixel" strategy="afterInteractive">
//         {`
//           !function(f,b,e,v,n,t,s)
//           {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//           n.callMethod.apply(n,arguments):n.queue.push(arguments)};
//           if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
//           n.queue=[];t=b.createElement(e);t.async=!0;
//           t.src=v;s=b.getElementsByTagName(e)[0];
//           s.parentNode.insertBefore(t,s)}(window, document,'script',
//           'https://connect.facebook.net/en_US/fbevents.js');
//           fbq('init', '768898314129368');
//           fbq('track', 'PageView');
//         `}
//       </Script>

//       {/* ✅ noscript version */}
//       <noscript>
//         <img
//           height="1"
//           width="1"
//           style={{ display: "none" }}
//           src="https://www.facebook.com/tr?id=768898314129368&ev=PageView&noscript=1"
//          alt="" decoding="async"  loading="lazy" />
//       </noscript>

//       <MainLayout>
//         <main>
        

//           <section className="privacy my-5">
//             <div className="container">
//               <div className=" text-center row mx-0">
//                 {/* <h2>Thank you</h2> */}
//                 <h3>
//                   <span className="font_stylish" style={{ color: "#ff914d" }}>
//                   Thank you
//                   </span>
//                 </h3>
                
//                                 <h5>Thank you for contacting High Creation Interior,  Team will connect with you soon.</h5>
//                                 <div className="text-center mt-4"><a href="/" className="know_more px-3" aria-label="Home">Back To Home</a></div>
//                  {/* <div dangerouslySetInnerHTML={{ __html: pageData }} /> */}
//               </div>
//             </div>
//           </section>
//           <hr />
//         </main>
//       </MainLayout>
//     </div>
//   );
// };

// export default Terms;

// "use client";
// import { toast } from "react-toastify";
// import MainLayout from "../layouts/MainLayout";
// import { useCallback, useEffect, useState } from "react";
// import api from "@/utils/api";
// import Script from "next/script"; // ✅ Import Next.js Script
// import DOMPurify from "isomorphic-dompurify";

// // Same defaults as the CMS page (cms/thank-you/page.jsx).
// // Used only when the CMS record is missing or the request fails.
// const DEFAULT_BUTTON = {
//   buttonText: "Back To Home",
//   buttonBgColor: "#ff914d",
//   buttonTextColor: "#ffffff",
//   buttonFontSize: 16,
//   buttonUrl: "/",
//   buttonNewTab: false,
// };

// // Only allow safe link targets coming from the CMS.
// const safeUrl = (url) => {
//   const value = String(url || "").trim();
//   return /^(\/|#|https?:\/\/|mailto:|tel:)/i.test(value) ? value : "/";
// };

// const clampFontSize = (value) => {
//   const n = Number(value);
//   if (!Number.isFinite(n)) return DEFAULT_BUTTON.buttonFontSize;
//   return Math.min(48, Math.max(10, Math.round(n)));
// };

// const ThankYou = () => {
//   // null = no CMS data (show the original static content)
//   const [cms, setCms] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchThankYouPage = useCallback(async () => {
//     try {
//       const response = await api.get("/cms-content/redirect_thank_you");

//       const record = Array.isArray(response.data) ? response.data[0] : response.data;
//       let data = record?.json_content || null;

//       if (typeof data === "string") {
//         try {
//           data = JSON.parse(data);
//         } catch (e) {
//           data = null;
//         }
//       }

//       setCms(data && typeof data === "object" ? data : null);
//     } catch (err) {
//       // Keep the page usable with the default content, but still report the error.
//       toast.error(err.message ?? "Failed to fetch data. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchThankYouPage();
//   }, [fetchThankYouPage]);

//   const hasCmsContent = Boolean(cms && cms.content);

//   const cleanHtml = hasCmsContent
//     ? DOMPurify.sanitize(cms.content, { ADD_ATTR: ["target", "rel"] })
//     : "";

//   const button = {
//     ...DEFAULT_BUTTON,
//     ...(cms || {}),
//   };
//   const buttonUrl = safeUrl(button.buttonUrl);
//   const buttonNewTab = Boolean(button.buttonNewTab);

//     const buttonBgColor = button.buttonBgColor;
//   const buttonTextColor = button.buttonTextColor;
//   const buttonFontSize = `${clampFontSize(button.buttonFontSize)}px`;

//   // Inline styles with the "important" flag beat global !important CSS.
//   const applyButtonStyle = useCallback(
//     (el) => {
//       if (!el) return;
//       el.style.setProperty("background-color", buttonBgColor, "important");
//       el.style.setProperty("background-image", "none", "important");
//       el.style.setProperty("color", buttonTextColor, "important");
//       el.style.setProperty("font-size", buttonFontSize, "important");
//       el.style.setProperty("padding", "0.75em 1.75em", "important");
//     },
//     [buttonBgColor, buttonTextColor, buttonFontSize]
//   );

//   return (
//     <div>
//       <head>
//         <title>Thank You - High Creation Interior</title>
//         <meta
//           name="description"
//           content="Thank you for contacting High Creation Interior."
//         />
//       </head>

//       {/* ✅ Facebook Pixel Script */}
//       <Script id="facebook-pixel" strategy="afterInteractive">
//         {`
//           !function(f,b,e,v,n,t,s)
//           {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
//           n.callMethod.apply(n,arguments):n.queue.push(arguments)};
//           if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
//           n.queue=[];t=b.createElement(e);t.async=!0;
//           t.src=v;s=b.getElementsByTagName(e)[0];
//           s.parentNode.insertBefore(t,s)}(window, document,'script',
//           'https://connect.facebook.net/en_US/fbevents.js');
//           fbq('init', '768898314129368');
//           fbq('track', 'PageView');
//         `}
//       </Script>

//       {/* ✅ noscript version */}
//       <noscript>
//         <img
//           height="1"
//           width="1"
//           style={{ display: "none" }}
//           src="https://www.facebook.com/tr?id=768898314129368&ev=PageView&noscript=1"
//           alt=""
//           decoding="async"
//           loading="lazy"
//         />
//       </noscript>

//       <MainLayout>
//         <main>
//           <section className="privacy my-5">
//             <div className="container">
//               <div className="text-center row mx-0">
//                 {loading ? (
//                   // Reserve space while the CMS content loads, so nothing flashes.
//                   <div style={{ minHeight: 160 }} />
//                 ) : hasCmsContent ? (
//                   <>
//                     {/* ✅ Heading, text and image managed from the CMS (CKEditor) */}
//                     <div
//                       className="thank-you-content"
//                       dangerouslySetInnerHTML={{ __html: cleanHtml }}
//                     />

//                     {/* ✅ Button managed from the CMS */}
//                     <div className="text-center mt-4">
//                       <a
//                        ref={applyButtonStyle}
//                         href={buttonUrl}
//                         className="know_more"
//                         aria-label={button.buttonText || DEFAULT_BUTTON.buttonText}
//                         target={buttonNewTab ? "_blank" : undefined}
//                         rel={buttonNewTab ? "noopener noreferrer" : undefined}
//                         style={{
//                           display: "inline-block",
//                           boxSizing: "border-box",
//                           backgroundColor: buttonBgColor,
// color: buttonTextColor,
//                           maxWidth: "100%",
//                           padding: "0.75em 1.75em",
//                           fontSize: buttonFontSize,
//                           borderRadius: "50px",
//                           fontWeight: 500,
//                           lineHeight: 1.2,
//                           textDecoration: "none",
//                         }}
//                       >
//                         {button.buttonText || DEFAULT_BUTTON.buttonText}
//                       </a>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     {/* Fallback: original static content (no CMS record yet) */}
//                     <h3>
//                       <span className="font_stylish" style={{ color: "#ff914d" }}>
//                         Thank you
//                       </span>
//                     </h3>

//                     <h5>
//                       Thank you for contacting High Creation Interior, our team will
//                       connect with you soon.
//                     </h5>
//                     <div className="text-center mt-4">
//                       <a href="/" className="know_more px-3" aria-label="Home">
//                         Back To Home
//                       </a>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </section>
//           <hr />
//         </main>
//       </MainLayout>

//       {/* Keeps CKEditor images responsive and centred on the public page */}
//       <style>{`
//         .thank-you-content img {
//           max-width: 100%;
//           height: auto;
//         }
//         .thank-you-content figure.image {
//           display: table;
//           margin: 0.9em auto;
//         }
//         .thank-you-content figure.image img {
//           display: block;
//           margin: 0 auto;
//         }
//         .thank-you-content figure.image_resized {
//           display: block;
//           max-width: 100%;
//           box-sizing: border-box;
//         }
//         .thank-you-content figure.image_resized img {
//           width: 100%;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ThankYou;


"use client";

import { toast } from "react-toastify";
import MainLayout from "../layouts/MainLayout";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import api from "@/utils/api";
import Script from "next/script";
import DOMPurify from "isomorphic-dompurify";

// -----------------------------------------------------------------------------
// HCI DEFAULT BUTTON SETTINGS
// -----------------------------------------------------------------------------

const DEFAULT_BUTTON = {
  buttonText: "Back To Home",
  buttonBgColor: "#ff914d",
  buttonTextColor: "#ffffff",
  buttonFontSize: 16,
  buttonUrl: "/",
  buttonNewTab: false,
};

// -----------------------------------------------------------------------------
// SAFE URL HELPER
// Only allow safe URL formats coming from CMS.
// -----------------------------------------------------------------------------

const safeUrl = (url) => {
  const value = String(url || "").trim();

  return /^(\/|#|https?:\/\/|mailto:|tel:)/i.test(value)
    ? value
    : "/";
};

// -----------------------------------------------------------------------------
// BUTTON FONT SIZE
// -----------------------------------------------------------------------------

const clampFontSize = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return DEFAULT_BUTTON.buttonFontSize;
  }

  return Math.min(48, Math.max(10, Math.round(number)));
};

// =============================================================================
// MODERN CONFETTI
// =============================================================================

const CONFETTI_COLORS = [
  "#ff914d",
  "#ff7a29",
  "#ffb37a",
  "#ffd166",
  "#fff0e5",
  "#212529",
  "#adb5bd",
];

const Confetti = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect accessibility preference.
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      return undefined;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = window.innerWidth;
    let height = window.innerHeight;

    let frameId = 0;
    let particles = [];

    let lastTime = performance.now();

    const startedAt = performance.now();

    const timers = [];

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    const random = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    const randomColor = () => {
      return CONFETTI_COLORS[
        Math.floor(Math.random() * CONFETTI_COLORS.length)
      ];
    };

    // -------------------------------------------------------------------------
    // Resize canvas
    // -------------------------------------------------------------------------

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // -------------------------------------------------------------------------
    // Create confetti particle
    // -------------------------------------------------------------------------

    const spawn = ({
      x,
      y,
      angle,
      speed,
      life = random(130, 220),
      shape = "rect",
      scale = 1,
    }) => {
      const size = random(5, 10) * scale;

      particles.push({
        x,
        y,

        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,

        width: size,
        height: size * random(1.1, 1.7),

        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.16, 0.16),

        tilt: random(0, Math.PI * 2),
        tiltSpeed: random(0.07, 0.16),

        gravity: random(0.22, 0.38),

        color: randomColor(),

        shape,

        life: 0,
        maxLife: life,
      });
    };

    // -------------------------------------------------------------------------
    // Draw triangle
    // -------------------------------------------------------------------------

    const drawTriangle = (size) => {
      ctx.beginPath();

      ctx.moveTo(0, -size);
      ctx.lineTo(size, size);
      ctx.lineTo(-size, size);

      ctx.closePath();
      ctx.fill();
    };

    // -------------------------------------------------------------------------
    // Side cannon burst
    // -------------------------------------------------------------------------

    const sideBurst = (side, count = 38) => {
      const isLeft = side === "left";

      const x = isLeft ? -10 : width + 10;

      const baseAngle = isLeft
        ? -0.75
        : Math.PI + 0.75;

      for (let i = 0; i < count; i += 1) {
        spawn({
          x,
          y: height * random(0.72, 0.98),

          angle:
            baseAngle +
            random(-0.55, 0.55),

          speed: random(9, 17),

          life: random(150, 240),

          shape:
            Math.random() < 0.2
              ? "circle"
              : "rect",

          scale:
            width < 576
              ? 0.8
              : 1,
        });
      }
    };

    // -------------------------------------------------------------------------
    // Center burst
    // -------------------------------------------------------------------------

    const centerBurst = () => {
      const x = width / 2;

      const y = Math.min(
        height * 0.58,
        520
      );

      const count =
        width < 576
          ? 40
          : 65;

      for (let i = 0; i < count; i += 1) {
        const angle = random(
          -Math.PI,
          0
        );

        const randomShape = Math.random();

        let shape = "rect";

        if (randomShape < 0.18) {
          shape = "circle";
        } else if (randomShape < 0.34) {
          shape = "triangle";
        }

        spawn({
          x,
          y,

          angle,

          speed: random(7, 14),

          life: random(120, 210),

          shape,

          scale:
            width < 576
              ? 0.8
              : 1,
        });
      }
    };

    // -------------------------------------------------------------------------
    // Top confetti rain
    // -------------------------------------------------------------------------

    const topRain = () => {
      const count =
        width < 576
          ? 18
          : 28;

      for (let i = 0; i < count; i += 1) {
        spawn({
          x: random(0, width),

          y: random(-30, -5),

          angle:
            Math.PI / 2 +
            random(-0.45, 0.45),

          speed: random(2.5, 4.5),

          life: random(170, 250),

          shape:
            Math.random() < 0.2
              ? "circle"
              : "rect",

          scale:
            width < 576
              ? 0.75
              : 0.9,
        });
      }
    };

    // -------------------------------------------------------------------------
    // Animation frame
    // -------------------------------------------------------------------------

    const tick = (now) => {
      const dt = Math.min(
        (now - lastTime) / 16.67,
        2
      );

      lastTime = now;

      const elapsed =
        now - startedAt;

      // Clear previous frame.
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      // Remove dead particles.
      particles = particles.filter(
        (particle) =>
          particle.life <
            particle.maxLife &&
          particle.y <
            height + 50
      );

      // Draw particles.
      particles.forEach((particle) => {
        particle.life += dt;

        // Horizontal drag.
        particle.vx *= Math.pow(
          0.992,
          dt
        );

        // Vertical movement + gravity.
        particle.vy =
          particle.vy *
            Math.pow(0.994, dt) +
          particle.gravity * dt;

        particle.x +=
          particle.vx * dt;

        particle.y +=
          particle.vy * dt;

        // Rotation.
        particle.rotation +=
          particle.rotationSpeed * dt;

        // Flutter.
        particle.tilt +=
          particle.tiltSpeed * dt;

        // Fade near the end.
        const lifeRatio =
          particle.life /
          particle.maxLife;

        const alpha =
          lifeRatio > 0.78
            ? Math.max(
                0,
                (1 - lifeRatio) /
                  0.22
              )
            : 1;

        ctx.save();

        ctx.globalAlpha = alpha;

        ctx.translate(
          particle.x,
          particle.y
        );

        ctx.rotate(
          particle.rotation
        );

        ctx.fillStyle =
          particle.color;

        // Circle.
        if (
          particle.shape ===
          "circle"
        ) {
          ctx.beginPath();

          ctx.arc(
            0,
            0,
            particle.width / 2,
            0,
            Math.PI * 2
          );

          ctx.fill();
        }

        // Triangle.
        else if (
          particle.shape ===
          "triangle"
        ) {
          drawTriangle(
            particle.width / 2
          );
        }

        // Rectangle.
        else {
          ctx.scale(
            1,
            Math.cos(
              particle.tilt
            )
          );

          ctx.fillRect(
            -particle.width / 2,
            -particle.height / 2,
            particle.width,
            particle.height
          );
        }

        ctx.restore();
      });

      // Small amount of continuous rain.
      if (
        elapsed < 1800 &&
        Math.random() < 0.18
      ) {
        spawn({
          x: random(0, width),

          y: -12,

          angle:
            Math.PI / 2 +
            random(-0.3, 0.3),

          speed: random(2, 4),

          life: random(140, 200),

          shape:
            Math.random() < 0.25
              ? "circle"
              : "rect",

          scale: 0.7,
        });
      }

      // Continue until all particles disappear.
      if (
        elapsed < 3600 ||
        particles.length > 0
      ) {
        frameId =
          requestAnimationFrame(
            tick
          );
      } else {
        ctx.clearRect(
          0,
          0,
          width,
          height
        );
      }
    };

    // -------------------------------------------------------------------------
    // Start animation
    // -------------------------------------------------------------------------

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    // Initial central burst.
    centerBurst();

    // Left/right cannons.
    timers.push(
      setTimeout(() => {
        sideBurst("left");
        sideBurst("right");
      }, 180)
    );

    // Second central burst.
    timers.push(
      setTimeout(() => {
        centerBurst();
      }, 520)
    );

    // Final top sprinkle.
    timers.push(
      setTimeout(() => {
        topRain();
      }, 900)
    );

    frameId =
      requestAnimationFrame(tick);

    // -------------------------------------------------------------------------
    // Cleanup
    // -------------------------------------------------------------------------

    return () => {
      cancelAnimationFrame(
        frameId
      );

      timers.forEach(
        clearTimeout
      );

      window.removeEventListener(
        "resize",
        resize
      );

      ctx.clearRect(
        0,
        0,
        width,
        height
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

// =============================================================================
// THANK YOU PAGE
// =============================================================================

const ThankYou = () => {
  const [cms, setCms] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ---------------------------------------------------------------------------
  // Fetch Thank You CMS data
  // ---------------------------------------------------------------------------

  const fetchThankYouPage =
    useCallback(async () => {
      try {
        const response =
          await api.get(
            "/cms-content/redirect_thank_you"
          );

        const record =
          Array.isArray(
            response.data
          )
            ? response.data[0]
            : response.data;

        let data =
          record?.json_content ||
          null;

        // Some APIs return JSON as a string.
        if (
          typeof data === "string"
        ) {
          try {
            data = JSON.parse(
              data
            );
          } catch (error) {
            data = null;
          }
        }

        setCms(
          data &&
            typeof data ===
              "object"
            ? data
            : null
        );
      } catch (err) {
        // Keep the page usable if the CMS request fails.
        toast.error(
          err?.message ??
            "Failed to fetch data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  // ---------------------------------------------------------------------------
  // Load CMS content
  // ---------------------------------------------------------------------------

  useEffect(() => {
    fetchThankYouPage();
  }, [fetchThankYouPage]);

  // ---------------------------------------------------------------------------
  // CMS content
  // ---------------------------------------------------------------------------

  const hasCmsContent =
    Boolean(
      cms &&
        cms.content
    );

  const cleanHtml =
    hasCmsContent
      ? DOMPurify.sanitize(
          cms.content,
          {
            ADD_ATTR: [
              "target",
              "rel",
            ],
          }
        )
      : "";

  // ---------------------------------------------------------------------------
  // Button values
  // ---------------------------------------------------------------------------

  const button =
    cms || {};

  const buttonText =
    button.buttonText ||
    DEFAULT_BUTTON.buttonText;

  const buttonBgColor =
    button.buttonBgColor ||
    DEFAULT_BUTTON.buttonBgColor;

  const buttonTextColor =
    button.buttonTextColor ||
    DEFAULT_BUTTON.buttonTextColor;

  const buttonFontSize =
    `${clampFontSize(
      button.buttonFontSize
    )}px`;

  const buttonUrl =
    safeUrl(
      button.buttonUrl ||
        DEFAULT_BUTTON.buttonUrl
    );

  const buttonNewTab =
    Boolean(
      button.buttonNewTab
    );

  // ---------------------------------------------------------------------------
  // Apply important inline button styles.
  //
  // Your global CSS contains !important rules for .know_more / anchors.
  // React's style prop cannot set !important, so we apply it using the DOM API.
  // ---------------------------------------------------------------------------

  const applyButtonStyle =
    useCallback(
      (element) => {
        if (!element) {
          return;
        }

        element.style.setProperty(
          "background-color",
          buttonBgColor,
          "important"
        );

        element.style.setProperty(
          "background-image",
          "none",
          "important"
        );

        element.style.setProperty(
          "color",
          buttonTextColor,
          "important"
        );

        element.style.setProperty(
          "font-size",
          buttonFontSize,
          "important"
        );

        element.style.setProperty(
          "padding",
          "0.75em 1.75em",
          "important"
        );
      },
      [
        buttonBgColor,
        buttonTextColor,
        buttonFontSize,
      ]
    );

  // =============================================================================
  // RENDER
  // =============================================================================

  return (
    <div>
      {/* -----------------------------------------------------------------------
          CONFETTI
          ----------------------------------------------------------------------- */}

      <Confetti />

      {/* -----------------------------------------------------------------------
          FACEBOOK PIXEL
          ----------------------------------------------------------------------- */}

      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
      >
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          fbq('init', '768898314129368');
          fbq('track', 'PageView');
        `}
      </Script>

      {/* -----------------------------------------------------------------------
          FACEBOOK NOSCRIPT
          ----------------------------------------------------------------------- */}

      <noscript>
        <img
          height="1"
          width="1"
          style={{
            display: "none",
          }}
          src="https://www.facebook.com/tr?id=768898314129368&ev=PageView&noscript=1"
          alt=""
          decoding="async"
          loading="lazy"
        />
      </noscript>

      {/* -----------------------------------------------------------------------
          MAIN LAYOUT
          ----------------------------------------------------------------------- */}

      <MainLayout>
        <main>
          <section className="ty-section">

            <div className="container">
              <div className="ty-card">
                {/* -------------------------------------------------------------
                    SUCCESS ICON
                    ------------------------------------------------------------- */}

                <div
                  className="ty-icon"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 52 52"
                    width="44"
                    height="44"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      className="ty-check"
                      d="M14 27 l8 8 l16 -18"
                    />
                  </svg>
                </div>

                {/* -------------------------------------------------------------
                    CONTENT
                    ------------------------------------------------------------- */}

                {loading ? (
                  // Reserve space while CMS loads.
                  <div
                    className="ty-loading"
                    aria-hidden="true"
                  />
                ) : (
                  <>
                    {hasCmsContent ? (
                      // CMS / CKEditor content.
                      <div
                        className="ty-content thank-you-content"
                        dangerouslySetInnerHTML={{
                          __html:
                            cleanHtml,
                        }}
                      />
                    ) : (
                      // Default fallback.
                      <div className="ty-content">
                        <h1>
                          <span
                            className="font_stylish"
                            style={{
                              color:
                                "#ff914d",
                            }}
                          >
                            Thank you
                          </span>
                        </h1>

                        <p>
                          Thank you for
                          contacting
                          High Creation
                          Interior, our
                          team will
                          connect with
                          you soon.
                        </p>
                      </div>
                    )}

                    {/* -----------------------------------------------------------
                        BUTTON
                        ----------------------------------------------------------- */}

                    <div className="ty-actions">
                      <a
                        ref={
                          applyButtonStyle
                        }
                        href={
                          buttonUrl
                        }
                        className="know_more ty-btn"
                        aria-label={
                          buttonText
                        }
                        target={
                          buttonNewTab
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          buttonNewTab
                            ? "noopener noreferrer"
                            : undefined
                        }
                        style={{
                          display:
                            "inline-block",

                          boxSizing:
                            "border-box",

                          backgroundColor:
                            buttonBgColor,

                          color:
                            buttonTextColor,

                          maxWidth:
                            "100%",

                          padding:
                            "0.75em 1.75em",

                          fontSize:
                            buttonFontSize,

                          borderRadius:
                            "50px",

                          fontWeight:
                            500,

                          lineHeight:
                            1.2,

                          textDecoration:
                            "none",
                        }}
                      >
                        {buttonText}
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
      </MainLayout>

      {/* =============================================================================
          PAGE STYLES
          ============================================================================= */}

      <style>{`
        /* =======================================================================
           MAIN SECTION
           ======================================================================= */

        .ty-section {
          position: relative;
          isolation: isolate;
          overflow: hidden;

          display: flex;
          align-items: center;

          min-height: 72vh;

          padding: clamp(56px, 8vw, 100px) 0;

          background: #ffffff;
        }

        .ty-section .container {
          position: relative;

          z-index: 2;

          width: 100%;
        }

        /* =======================================================================
           BACKGROUND BLOBS
           ======================================================================= */

        .ty-blob {
          position: absolute;

          border-radius: 50%;

          pointer-events: none;

          filter: blur(70px);

          opacity: 0.24;

          animation:
            ty-float
            12s
            ease-in-out
            infinite;
        }

        .ty-blob--1 {
          width: 360px;
          height: 360px;

          top: -140px;
          left: -120px;

          background:
            #ff914d;
        }

        .ty-blob--2 {
          width: 320px;
          height: 320px;

          right: -110px;
          bottom: -140px;

          background:
            #ffd5b8;

          animation-duration:
            15s;

          animation-direction:
            reverse;
        }

        /* =======================================================================
           MAIN CARD
           ======================================================================= */

        .ty-card {
          position: relative;

          max-width: 760px;

          margin: 0 auto;

          padding:
            clamp(42px, 6vw, 64px)
            clamp(22px, 5vw, 54px)
            clamp(40px, 5vw, 56px);

          text-align: center;

          background:
            rgba(255, 255, 255, 0.88);

          border:
            1px solid
            rgba(255, 145, 77, 0.18);

          border-radius:
            30px;

          box-shadow:
            0 35px 90px
            rgba(37, 24, 17, 0.08),
            0 12px 32px
            rgba(255, 145, 77, 0.12);

          backdrop-filter:
            blur(16px);

          -webkit-backdrop-filter:
            blur(16px);

          animation:
            ty-fade-up
            0.8s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            both;
        }

        /* Orange accent on top */

        .ty-card::before {
          content: "";

          position: absolute;

          top: 0;
          left: 50%;

          width: 160px;
          height: 4px;

          transform:
            translateX(-50%);

          border-radius:
            0 0 999px 999px;

          background:
            linear-gradient(
              90deg,
              #ff7a29,
              #ffb37a
            );

          box-shadow:
            0 4px 16px
            rgba(255, 145, 77, 0.35);
        }

        /* =======================================================================
           SUCCESS ICON
           ======================================================================= */

        .ty-icon {
          position: relative;

          display: flex;

          align-items: center;
          justify-content: center;

          width: 94px;
          height: 94px;

          margin:
            0 auto
            24px;

          border-radius: 50%;

          background:
            linear-gradient(
              135deg,
              #ffbc8c 0%,
              #ff914d 50%,
              #ff7020 100%
            );

          box-shadow:
            0 14px 34px
            rgba(255, 145, 77, 0.38),
            inset 0 1px 2px
            rgba(255, 255, 255, 0.55);

          animation:
            ty-pop
            0.65s
            cubic-bezier(
              0.34,
              1.56,
              0.64,
              1
            )
            0.12s
            both;
        }

        /* Outer glowing ring */

        .ty-icon::after {
          content: "";

          position: absolute;

          inset: -9px;

          border-radius: 50%;

          border:
            2px solid
            rgba(255, 145, 77, 0.28);

          animation:
            ty-ring
            2.3s
            ease-out
            0.7s
            infinite;
        }

        /* Inner ring */

        .ty-icon::before {
          content: "";

          position: absolute;

          inset: 5px;

          border-radius: 50%;

          border:
            1px solid
            rgba(255, 255, 255, 0.30);
        }

        .ty-check {
          stroke-dasharray: 40;

          stroke-dashoffset:
            40;

          animation:
            ty-draw
            0.6s
            ease
            0.5s
            forwards;
        }

        /* =======================================================================
           LOADING
           ======================================================================= */

        .ty-loading {
          min-height: 145px;
        }

        /* =======================================================================
           CONTENT
           ======================================================================= */

        .ty-content {
          animation:
            ty-fade-up
            0.8s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            0.2s
            both;
        }

        .ty-content h1,
        .ty-content h2,
        .ty-content h3 {
          margin:
            0 0 14px;

          font-weight:
            800;

          line-height:
            1.12;

          letter-spacing:
            -0.02em;

          color:
            #20252b;
        }

        .ty-content h1 {
          font-size:
            clamp(
              2.25rem,
              6vw,
              3.6rem
            );
        }

        .ty-content h2 {
          font-size:
            clamp(
              1.85rem,
              5vw,
              2.8rem
            );
        }

        .ty-content p {
          max-width:
            600px;

          margin:
            0 auto;

          font-size:
            clamp(
              1rem,
              2vw,
              1.16rem
            );

          line-height:
            1.75;

          color:
            #5c6570;
        }

        /* =======================================================================
           CMS / CKEDITOR IMAGES
           ======================================================================= */

        .thank-you-content img {
          display: block;

          max-width: 100%;
          height: auto;

          margin:
            18px auto;

          border-radius:
            16px;
        }

        .thank-you-content figure.image {
          display: table;

          margin:
            1.2em auto;
        }

        .thank-you-content figure.image img {
          display: block;

          margin:
            0 auto;
        }

        .thank-you-content figure.image_resized {
          display: block;

          max-width: 100%;

          box-sizing:
            border-box;
        }

        .thank-you-content figure.image_resized img {
          width: 100%;
        }

        /* =======================================================================
           BUTTON
           ======================================================================= */

        .ty-actions {
          margin-top:
            30px;

          animation:
            ty-fade-up
            0.8s
            cubic-bezier(
              0.22,
              1,
              0.36,
              1
            )
            0.35s
            both;
        }

        .ty-btn {
          position: relative;

          overflow: hidden;

          cursor: pointer;

          box-shadow:
            0 10px 25px
            rgba(255, 145, 77, 0.25);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        /* Button shine */

        .ty-btn::before {
          content: "";

          position: absolute;

          top: 0;
          left: -120%;

          width: 70%;
          height: 100%;

          transform:
            skewX(-20deg);

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.35),
              transparent
            );

          transition:
            left 0.55s ease;
        }

        .ty-btn:hover {
          transform:
            translateY(-3px);

          box-shadow:
            0 16px 32px
            rgba(255, 145, 77, 0.30);
        }

        .ty-btn:hover::before {
          left:
            140%;
        }

        .ty-btn:active {
          transform:
            translateY(0);
        }

        .ty-btn:focus-visible {
          outline:
            3px solid
            rgba(255, 145, 77, 0.35);

          outline-offset:
            4px;
        }

        /* =======================================================================
           ANIMATIONS
           ======================================================================= */

        @keyframes ty-fade-up {
          from {
            opacity: 0;

            transform:
              translateY(28px);
          }

          to {
            opacity: 1;

            transform:
              translateY(0);
          }
        }

        @keyframes ty-pop {
          from {
            opacity: 0;

            transform:
              scale(0.45);
          }

          to {
            opacity: 1;

            transform:
              scale(1);
          }
        }

        @keyframes ty-draw {
          to {
            stroke-dashoffset:
              0;
          }
        }

        @keyframes ty-ring {
          0% {
            opacity: 0.8;

            transform:
              scale(0.92);
          }

          100% {
            opacity: 0;

            transform:
              scale(1.42);
          }
        }

        @keyframes ty-float {
          0%,
          100% {
            transform:
              translate(0, 0);
          }

          50% {
            transform:
              translate(28px, 24px);
          }
        }

        /* =======================================================================
           MOBILE
           ======================================================================= */

        @media (max-width: 575px) {
          .ty-section {
            min-height:
              68vh;

            padding:
              42px 0 56px;
          }

          .ty-card {
            padding:
              38px
              18px
              34px;

            border-radius:
              24px;
          }

          .ty-icon {
            width:
              78px;

            height:
              78px;

            margin-bottom:
              20px;
          }

          .ty-content h1 {
            font-size:
              2.1rem;
          }

          .ty-content p {
            font-size:
              0.98rem;

            line-height:
              1.65;
          }

          .ty-actions {
            margin-top:
              26px;
          }

          .ty-blob--1 {
            width:
              240px;

            height:
              240px;
          }

          .ty-blob--2 {
            width:
              220px;

            height:
              220px;
          }
        }

        /* =======================================================================
           REDUCED MOTION
           ======================================================================= */

        @media (prefers-reduced-motion: reduce) {
          .ty-card,
          .ty-icon,
          .ty-icon::after,
          .ty-content,
          .ty-actions,
          .ty-blob {
            animation:
              none !important;
          }

          .ty-check {
            animation:
              none !important;

            stroke-dashoffset:
              0;
          }

          .ty-btn {
            transition:
              none;
          }
        }
      `}</style>
    </div>
  );
};

export default ThankYou;