// "use client";
// // Project photo / testimonial-video grid with a full-screen popup viewer.
// // Put next to the city page, e.g. src/app/services-detail/ProjectGallery.jsx
// // (the CSS module goes in the same folder).
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import Image from "next/image";
// import { parseVideoUrl } from "@/utils/cityContent";
// import styles from "./ProjectGallery.module.css";

// /**
//  * items: [{
//  *   type: "image" | "video",
//  *   image:  string   // photo URL (type image) or thumbnail URL (type video, may be "")
//  *   alt, title: string
//  *   videoUrl: string // type video only
//  *   optimized: boolean // true = use next/image (hosts already allowed in next.config)
//  * }]
//  */
// export default function ProjectGallery({ items = [] }) {
//     const [active, setActive] = useState(null);
//     const closeButton = useRef(null);
//     const opener = useRef(null);
//     const count = items.length;

//     const openItem = (index, event) => {
//         opener.current = event.currentTarget;
//         setActive(index);
//     };
//     const close = useCallback(() => {
//         setActive(null);
//         if (opener.current && typeof opener.current.focus === "function") opener.current.focus();
//     }, []);
//     const move = useCallback((step) => {
//         setActive((current) => (current === null || !count ? current : (current + step + count) % count));
//     }, [count]);

//     useEffect(() => {
//         if (active === null) return undefined;
//         const onKey = (event) => {
//             if (event.key === "Escape") close();
//             else if (event.key === "ArrowLeft") move(-1);
//             else if (event.key === "ArrowRight") move(1);
//         };
//         document.addEventListener("keydown", onKey);
//         const previousOverflow = document.body.style.overflow;
//         document.body.style.overflow = "hidden";
//         if (closeButton.current) closeButton.current.focus();
//         return () => {
//             document.removeEventListener("keydown", onKey);
//             document.body.style.overflow = previousOverflow;
//         };
//     }, [active, close, move]);

//     if (!count) return null;
//     const current = active !== null ? items[active] : null;
//     const currentVideo = current && current.type === "video" ? parseVideoUrl(current.videoUrl) : null;

//     const thumbnail = (item) => {
//         if (item.type === "video") {
//             const poster = item.image || parseVideoUrl(item.videoUrl)?.poster || "";
//             return poster
//                 // eslint-disable-next-line @next/next/no-img-element
//                 ? <img src={poster} alt={item.alt} title={item.title || undefined} loading="lazy" />
//                 : <span className={styles.noPoster} aria-hidden="true" />;
//         }
//         return item.optimized ? (
//             <Image
//                 src={item.image}
//                 alt={item.alt}
//                 title={item.title || undefined}
//                 width={900}
//                 height={675}
//                 sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 420px"
//                 loading="lazy"
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//             />
//         ) : (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img src={item.image} alt={item.alt} title={item.title || undefined} loading="lazy" />
//         );
//     };

//     return (
//         <>
//             <div className="row g-3">
//                 {items.map((item, index) => (
//                     <div className="col-12 col-sm-6" key={`${item.type}-${item.image}-${item.videoUrl}-${index}`}>
//                         <figure className="city-project-card m-0">
//                             <button
//                                 type="button"
//                                 className={styles.cardButton}
//                                 onClick={(event) => openItem(index, event)}
//                                 aria-haspopup="dialog"
//                                 aria-label={item.type === "video" ? `Play video: ${item.alt}` : `View full size: ${item.alt}`}
//                             >
//                                 {thumbnail(item)}
//                                 {item.type === "video" && (
//                                     <span className={styles.play} aria-hidden="true">
//                                         <svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
//                                     </span>
//                                 )}
//                             </button>
//                         </figure>
//                     </div>
//                 ))}
//             </div>

//             {current && typeof document !== "undefined" && createPortal(
//                 <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={current.alt || "Project media"} onClick={close}>
//                     <button ref={closeButton} type="button" className={styles.close} onClick={close} aria-label="Close">×</button>
//                     {count > 1 && (
//                         <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={(event) => { event.stopPropagation(); move(-1); }} aria-label="Previous">‹</button>
//                     )}
//                     <div className={styles.stage} onClick={(event) => event.stopPropagation()}>
//                         {current.type === "video" ? (
//                             currentVideo && currentVideo.kind === "file" ? (
//                                 <video className={styles.media} src={currentVideo.embedUrl} controls autoPlay playsInline poster={current.image || undefined} />
//                             ) : currentVideo ? (
//                                 <div className={styles.frame}>
//                                     <iframe
//                                         key={currentVideo.embedUrl}
//                                         src={currentVideo.embedUrl}
//                                         title={current.alt || "Testimonial video"}
//                                         allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
//                                         allowFullScreen
//                                         referrerPolicy="strict-origin-when-cross-origin"
//                                     />
//                                 </div>
//                             ) : (
//                                 <p className={styles.unavailable}>This video is unavailable.</p>
//                             )
//                         ) : (
//                             // eslint-disable-next-line @next/next/no-img-element
//                             <img className={styles.media} src={current.image} alt={current.alt} />
//                         )}
//                     </div>
//                     {count > 1 && (
//                         <button type="button" className={`${styles.nav} ${styles.next}`} onClick={(event) => { event.stopPropagation(); move(1); }} aria-label="Next">›</button>
//                     )}
//                 </div>,
//                 document.body
//             )}
//         </>
//     );
// }

// "use client";
// // Project photo / testimonial-video grid with a full-screen popup viewer.
// // Put next to the city page, e.g. src/app/services-detail/ProjectGallery.jsx
// // (the CSS module goes in the same folder).
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { createPortal } from "react-dom";
// import Image from "next/image";
// import { parseVideoUrl } from "@/utils/cityContent";
// import MobileSlider from "./MobileSlider";
// import styles from "./ProjectGallery.module.css";

// /**
//  * items: [{
//  *   type: "image" | "video",
//  *   image:  string   // photo URL (type image) or thumbnail URL (type video, may be "")
//  *   alt, title: string
//  *   videoUrl: string // type video only
//  *   optimized: boolean // true = use next/image (hosts already allowed in next.config)
//  * }]
//  */
// export default function ProjectGallery({ items = [] }) {
//     const [active, setActive] = useState(null);
//     const closeButton = useRef(null);
//     const opener = useRef(null);
//     // Photos and videos are shown as two separate groups (each one is a swipe slider with dots on mobile).
//     // The popup walks through them in the same order: photos first, then videos.
//     const photos = items.filter((item) => item.type !== "video");
//     const videos = items.filter((item) => item.type === "video");
//     const ordered = [...photos, ...videos];
//     const count = ordered.length;

//     const openItem = (index, event) => {
//         opener.current = event.currentTarget;
//         setActive(index);
//     };
//     const close = useCallback(() => {
//         setActive(null);
//         if (opener.current && typeof opener.current.focus === "function") opener.current.focus();
//     }, []);
//     const move = useCallback((step) => {
//         setActive((current) => (current === null || !count ? current : (current + step + count) % count));
//     }, [count]);

//     useEffect(() => {
//         if (active === null) return undefined;
//         const onKey = (event) => {
//             if (event.key === "Escape") close();
//             else if (event.key === "ArrowLeft") move(-1);
//             else if (event.key === "ArrowRight") move(1);
//         };
//         document.addEventListener("keydown", onKey);
//         const previousOverflow = document.body.style.overflow;
//         document.body.style.overflow = "hidden";
//         if (closeButton.current) closeButton.current.focus();
//         return () => {
//             document.removeEventListener("keydown", onKey);
//             document.body.style.overflow = previousOverflow;
//         };
//     }, [active, close, move]);

//     if (!count) return null;
//     const current = active !== null ? ordered[active] : null;
//     const currentVideo = current && current.type === "video" ? parseVideoUrl(current.videoUrl) : null;

//     // Tooltip on hover: the title if one was entered, otherwise the alt text
//     const tip = (item) => item.title || item.alt || undefined;

//     const thumbnail = (item) => {
//         if (item.type === "video") {
//             const parsed = parseVideoUrl(item.videoUrl);
//             const poster = item.image || parsed?.poster || "";
//             if (poster) {
//                 // eslint-disable-next-line @next/next/no-img-element
//                 return <img src={poster} alt={item.alt} loading="lazy" />;
//             }
//             // uploaded video without a thumbnail: show its first frame
//             if (parsed?.kind === "file") {
//                 return <video src={`${parsed.embedUrl}#t=0.1`} preload="metadata" muted playsInline tabIndex={-1} aria-hidden="true" />;
//             }
//             return <span className={styles.noPoster} aria-hidden="true" />;
//         }
//         return item.optimized ? (
//             <Image
//                 src={item.image}
//                 alt={item.alt}
//                 width={900}
//                 height={675}
//                 sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 420px"
//                 loading="lazy"
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//             />
//         ) : (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img src={item.image} alt={item.alt} loading="lazy" />
//         );
//     };

//     return (
//         <>
//             {[
//                 { list: photos, offset: 0, label: "Project photos" },
//                 { list: videos, offset: photos.length, label: "Testimonial videos" },
//             ].filter((group) => group.list.length > 0).map((group, groupIndex) => (
//                 <div className={groupIndex > 0 ? "mt-4" : undefined} key={group.label}>
//                     <MobileSlider label={group.label} className="row g-3 mobile-slider-wrapper gallery-slider">
//                         {group.list.map((item, position) => {
//                             const index = group.offset + position;
//                             return (
//                                 <div className="col-12 col-sm-6" key={`${item.type}-${item.image}-${item.videoUrl}-${index}`}>
//                                     <figure className="city-project-card m-0">
//                                         <button
//                                             type="button"
//                                             className={styles.cardButton}
//                                             onClick={(event) => openItem(index, event)}
//                                             title={tip(item)}
//                                             aria-haspopup="dialog"
//                                             aria-label={item.type === "video" ? `Play video: ${item.alt}` : `View full size: ${item.alt}`}
//                                         >
//                                             {thumbnail(item)}
//                                             {item.type === "video" && (
//                                                 <span className={styles.play} aria-hidden="true">
//                                                     <svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
//                                                 </span>
//                                             )}
//                                         </button>
//                                     </figure>
//                                 </div>
//                             );
//                         })}
//                     </MobileSlider>
//                 </div>
//             ))}

//             {current && typeof document !== "undefined" && createPortal(
//                 <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={current.alt || "Project media"} onClick={close}>
//                     <button ref={closeButton} type="button" className={styles.close} onClick={close} aria-label="Close">×</button>
//                     {count > 1 && (
//                         <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={(event) => { event.stopPropagation(); move(-1); }} aria-label="Previous">‹</button>
//                     )}
//                     <div className={styles.stage} onClick={(event) => event.stopPropagation()}>
//                         {current.type === "video" ? (
//                             currentVideo && currentVideo.kind === "file" ? (
//                                 <video className={styles.media} src={currentVideo.embedUrl} controls autoPlay playsInline poster={current.image || undefined} title={tip(current)} />
//                             ) : currentVideo ? (
//                                 <div className={styles.frame}>
//                                     <iframe
//                                         key={currentVideo.embedUrl}
//                                         src={currentVideo.embedUrl}
//                                         title={current.alt || "Testimonial video"}
//                                         allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
//                                         allowFullScreen
//                                         referrerPolicy="strict-origin-when-cross-origin"
//                                     />
//                                 </div>
//                             ) : (
//                                 <p className={styles.unavailable}>This video is unavailable.</p>
//                             )
//                         ) : (
//                             // eslint-disable-next-line @next/next/no-img-element
//                             <img className={styles.media} src={current.image} alt={current.alt} title={tip(current)} />
//                         )}
//                     </div>
//                     {count > 1 && (
//                         <button type="button" className={`${styles.nav} ${styles.next}`} onClick={(event) => { event.stopPropagation(); move(1); }} aria-label="Next">›</button>
//                     )}
//                 </div>,
//                 document.body
//             )}
//         </>
//     );
// }



"use client";
// Project photo / testimonial-video grid with a full-screen popup viewer.
// Put next to the city page, e.g. src/app/services-detail/ProjectGallery.jsx
// (the CSS module goes in the same folder).
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { parseVideoUrl } from "@/utils/cityContent";
import MobileSlider from "./MobileSlider";
import styles from "./ProjectGallery.module.css";

/**
 * items: [{
 *   type: "image" | "video",
 *   image:  string   // photo URL (type image) or thumbnail URL (type video, may be "")
 *   alt, title: string
 *   videoUrl: string // type video only
 *   optimized: boolean // true = use next/image (hosts already allowed in next.config)
 * }]
 */
export default function ProjectGallery({ items = [] }) {
    const [active, setActive] = useState(null);
    const closeButton = useRef(null);
    const opener = useRef(null);
    // Always photos first, then videos. The popup walks through them in the same order.
    // Desktop: ONE continuous grid (a video fills the free space next to the last photo).
    // Mobile: two swipe sliders (photos, then videos), unchanged.
    const photos = items.filter((item) => item.type !== "video");
    const videos = items.filter((item) => item.type === "video");
    const ordered = [...photos, ...videos];
    const count = ordered.length;

    const openItem = (index, event) => {
        opener.current = event.currentTarget;
        setActive(index);
    };
    const close = useCallback(() => {
        setActive(null);
        if (opener.current && typeof opener.current.focus === "function") opener.current.focus();
    }, []);
    const move = useCallback((step) => {
        setActive((current) => (current === null || !count ? current : (current + step + count) % count));
    }, [count]);

    useEffect(() => {
        if (active === null) return undefined;
        const onKey = (event) => {
            if (event.key === "Escape") close();
            else if (event.key === "ArrowLeft") move(-1);
            else if (event.key === "ArrowRight") move(1);
        };
        document.addEventListener("keydown", onKey);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        if (closeButton.current) closeButton.current.focus();
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [active, close, move]);

    if (!count) return null;
    const current = active !== null ? ordered[active] : null;
    const currentVideo = current && current.type === "video" ? parseVideoUrl(current.videoUrl) : null;

    // Tooltip on hover: the title if one was entered, otherwise the alt text
    const tip = (item) => item.title || item.alt || undefined;

    const thumbnail = (item) => {
        if (item.type === "video") {
            const parsed = parseVideoUrl(item.videoUrl);
            const poster = item.image || parsed?.poster || "";
            if (poster) {
                // eslint-disable-next-line @next/next/no-img-element
                return <img src={poster} alt={item.alt} title={tip(item)} loading="lazy" />;
            }
            // uploaded video without a thumbnail: show its first frame
            if (parsed?.kind === "file") {
                return <video src={`${parsed.embedUrl}#t=0.1`} preload="metadata" muted playsInline tabIndex={-1} aria-hidden="true" />;
            }
            return <span className={styles.noPoster} aria-hidden="true" />;
        }
        return item.optimized ? (
            <Image
                src={item.image}
                alt={item.alt}
                title={tip(item)}
                width={900}
                height={675}
                sizes="(max-width: 575px) 100vw, (max-width: 991px) 50vw, 420px"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
        ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt={item.alt} title={tip(item)} loading="lazy" />
        );
    };

    const card = (item, index) => (
        <figure className="city-project-card m-0" title={tip(item)}>
            <button
                type="button"
                className={styles.cardButton}
                onClick={(event) => openItem(index, event)}
                title={tip(item)}
                aria-haspopup="dialog"
                aria-label={item.type === "video" ? `Play video: ${item.alt}` : `View full size: ${item.alt}`}
            >
                {thumbnail(item)}
                {item.type === "video" && (
                    <span className={styles.play} aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                    </span>
                )}
            </button>
        </figure>
    );
    const itemKey = (item, index) => `${item.type}-${item.image}-${item.videoUrl}-${index}`;

    return (
        <>
            {/* DESKTOP / TABLET: one grid, photos first then videos, no empty cells between them */}
            <div className="row g-3 d-none d-md-flex">
                {ordered.map((item, index) => (
                    <div className="col-md-6" key={itemKey(item, index)}>
                        {card(item, index)}
                    </div>
                ))}
            </div>

            {/* MOBILE: photos slider, then videos slider (unchanged) */}
            <div className="d-md-none">
                <style>{`
                    @media (max-width: 768px) {
                        .mobile-slider-wrapper.gallery-slider > div {
                            flex: 0 0 100% !important;
                            max-width: 100% !important;
                            padding-left: 0 !important;
                            padding-right: 0 !important;
                            scroll-snap-align: start;
                            scroll-snap-stop: always;
                        }
                    }
                `}</style>
                {[
                    { list: photos, offset: 0, label: "Project photos" },
                    { list: videos, offset: photos.length, label: "Testimonial videos" },
                ].filter((group) => group.list.length > 0).map((group, groupIndex) => (
                    <div className={groupIndex > 0 ? "mt-4" : undefined} key={group.label}>
                        <MobileSlider label={group.label} className="row g-3 mobile-slider-wrapper gallery-slider">
                            {group.list.map((item, position) => {
                                const index = group.offset + position;
                                return (
                                    <div className="col-12" key={itemKey(item, index)}>
                                        {card(item, index)}
                                    </div>
                                );
                            })}
                        </MobileSlider>
                    </div>
                ))}
            </div>

            {current && typeof document !== "undefined" && createPortal(
                <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={current.alt || "Project media"} onClick={close}>
                    <button ref={closeButton} type="button" className={styles.close} onClick={close} aria-label="Close">×</button>
                    {count > 1 && (
                        <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={(event) => { event.stopPropagation(); move(-1); }} aria-label="Previous">‹</button>
                    )}
                    <div className={styles.stage} onClick={(event) => event.stopPropagation()}>
                        {current.type === "video" ? (
                            currentVideo && currentVideo.kind === "file" ? (
                                <video className={styles.media} src={currentVideo.embedUrl} controls autoPlay playsInline poster={current.image || undefined} title={tip(current)} />
                            ) : currentVideo ? (
                                <div className={styles.frame}>
                                    <iframe
                                        key={currentVideo.embedUrl}
                                        src={currentVideo.embedUrl}
                                        title={current.alt || "Testimonial video"}
                                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                        allowFullScreen
                                        referrerPolicy="strict-origin-when-cross-origin"
                                    />
                                </div>
                            ) : (
                                <p className={styles.unavailable}>This video is unavailable.</p>
                            )
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img className={styles.media} src={current.image} alt={current.alt} title={tip(current)} />
                        )}
                    </div>
                    {count > 1 && (
                        <button type="button" className={`${styles.nav} ${styles.next}`} onClick={(event) => { event.stopPropagation(); move(1); }} aria-label="Next">›</button>
                    )}
                </div>,
                document.body
            )}
        </>
    );
}
