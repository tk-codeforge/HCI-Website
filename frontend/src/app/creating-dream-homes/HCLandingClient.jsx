// "use client";

// import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import DOMPurify from "isomorphic-dompurify";
// import BgImageCard from "../components/BgImageCard";
// import VideoBox from "../components/VideoBox";
// import { useMediaAlt } from "../components/MediaImage";
// import api from "@/utils/api";
// import { buildLeadMetadata } from "@/utils/leadForms";

// // The existing popup is intentionally lazy-loaded: it is triggered later by
// // scroll/time/exit intent and should not delay the landing page's first paint.
// const ContactUsPopUp = dynamic(() => import("../components/ContactUsPopUp"), {
//   ssr: false,
// });

// const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
// const pickTag = (tag, fallback) => (HEADING_TAGS.includes(tag) ? tag : fallback);
// const dynSize = (tag) => (HEADING_TAGS.includes(tag) ? `hci-dyn-size hci-${tag}` : "");

// const Html = memo(function Html({ html, className = "", style }) {
//   const clean = useMemo(() => DOMPurify.sanitize(html || ""), [html]);
//   return (
//     <div
//       className={className}
//       style={style}
//       dangerouslySetInnerHTML={{ __html: clean }}
//     />
//   );
// });

// const OPTIMIZED_HOSTS = [
//   "hcinterior.in",
//   "www.hcinterior.in",
//   "apidev.hcinterior.in",
//   "localhost",
// ];

// function canOptimize(src) {
//   if (!src || src.startsWith("//")) return false;
//   if (src.startsWith("/")) return true;
//   try {
//     return OPTIMIZED_HOSTS.includes(new URL(src).hostname);
//   } catch {
//     return false;
//   }
// }

// const HERO_IMG_STYLE = {
//   position: "absolute",
//   inset: 0,
//   width: "100%",
//   height: "100%",
//   objectFit: "cover",
//   objectPosition: "center",
//   pointerEvents: "none",
//   zIndex: 0,
// };

// function HeroImage({ src, alt, fallbackAlt }) {
//   const mappedAlt = useMediaAlt(src, fallbackAlt);
//   const finalAlt = alt || mappedAlt || "High Creation Interior designed living space";

//   if (!src) return null;
//   if (canOptimize(src)) {
//     return (
//       <Image
//         src={src}
//         alt={finalAlt}
//         fill
//         priority
//         sizes="100vw"
//         quality={75}
//         style={HERO_IMG_STYLE}
//       />
//     );
//   }

//   // eslint-disable-next-line @next/next/no-img-element
//   return (
//     <img
//       src={src}
//       alt={finalAlt}
//       fetchPriority="high"
//       loading="eager"
//       decoding="async"
//       style={HERO_IMG_STYLE}
//     />
//   );
// }

// const EMPTY_FORM = {
//   fullName: "",
//   contact: "",
//   email: "",
//   place: "",
//   query: "",
//   termsAndConditions: false,
// };

// function LeadForm() {
//   const pathname = usePathname();
//   const [formData, setFormData] = useState(EMPTY_FORM);
//   const [submitting, setSubmitting] = useState(false);

//   const onChange = (event) => {
//     const { name, value, type, checked } = event.target;
//     setFormData((current) => ({
//       ...current,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const onSubmit = async (event) => {
//     event.preventDefault();
//     if (submitting) return;
//     if (!formData.termsAndConditions) {
//       toast.error("Please agree to the privacy policy and terms before submitting.");
//       return;
//     }

//     setSubmitting(true);
//     const requestData = {
//       name: formData.fullName.trim(),
//       mobile: formData.contact.trim(),
//       email: formData.email.trim(),
//       place: formData.place.trim(),
//       query: formData.query.trim(),
//       ...buildLeadMetadata({
//         pathname,
//         leadFormType: "inline",
//         leadFormName: "Creating The Home Of Your Dreams Lead Form",
//         ctaText: "REQUEST A CONSULTATION",
//       }),
//     };

//     try {
//       const response = await api.post("/user-queries", requestData);
//       if (response.status === 201) {
//         setFormData(EMPTY_FORM);
//         toast.success("Thank you. Our team will be in touch soon.");
//         window.setTimeout(() => {
//           window.location.href = "/thank-you";
//         }, 300);
//       } else {
//         toast.error("We could not submit your details. Please try again.");
//       }
//     } catch (error) {
//       toast.error(error?.message || "Something went wrong. Please try again.");
//       console.error("HCI landing enquiry submission failed:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="hci-form-card" id="hci-enquiry-form">
//       <div className="hci-form-topline"><span /> PERSONALISE YOUR SPACE</div>
//       <h2>Let’s make room for better living.</h2>
//       <p className="hci-form-intro">Tell us a little about your home. Our design team will help you plan the next step.</p>
//       <form onSubmit={onSubmit} className="hci-lead-form">
//         <label className="hci-field">
//           <span>Your name</span>
//           <input
//             type="text"
//             name="fullName"
//             autoComplete="name"
//             placeholder="Enter your full name"
//             value={formData.fullName}
//             onChange={onChange}
//             minLength={2}
//             maxLength={80}
//             required
//           />
//         </label>
//         <div className="hci-form-row">
//           <label className="hci-field">
//             <span>Mobile number</span>
//             <input
//               type="tel"
//               name="contact"
//               autoComplete="tel"
//               inputMode="tel"
//               placeholder="10-digit number"
//               value={formData.contact}
//               onChange={onChange}
//               maxLength={15}
//               required
//             />
//           </label>
//           <label className="hci-field">
//             <span>Email address</span>
//             <input
//               type="email"
//               name="email"
//               autoComplete="email"
//               placeholder="you@example.com"
//               value={formData.email}
//               onChange={onChange}
//               required
//             />
//           </label>
//         </div>
//         <label className="hci-field">
//           <span>City / location <em>(optional)</em></span>
//           <input
//             type="text"
//             name="place"
//             autoComplete="address-level2"
//             placeholder="Where is your home?"
//             value={formData.place}
//             onChange={onChange}
//             maxLength={100}
//           />
//         </label>
//         <label className="hci-field">
//           <span>What are you planning? <em>(optional)</em></span>
//           <textarea
//             name="query"
//             placeholder="A new home, a kitchen refresh, a complete makeover…"
//             value={formData.query}
//             onChange={onChange}
//             rows={2}
//             maxLength={1200}
//           />
//         </label>
//         <label className="hci-consent">
//           <input
//             type="checkbox"
//             name="termsAndConditions"
//             checked={formData.termsAndConditions}
//             onChange={onChange}
//             required
//           />
//           <span>By submitting, you agree to our <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a> and terms.</span>
//         </label>
//         <button className="hci-button hci-button-dark hci-form-submit" type="submit" disabled={submitting}>
//           {submitting ? "Sending…" : "Request a consultation"}
//           <span aria-hidden="true">↗</span>
//         </button>
//         <p className="hci-form-footnote">Your details are used only to respond to your enquiry.</p>
//       </form>
//     </div>
//   );
// }

// /**
//  * Typewriter text. The full text is always laid out (the not-yet-typed part is
//  * rendered with visibility:hidden), so nothing shifts while it "writes".
//  * `text` can be a string or an array of { t, em } segments.
//  * Screen readers get the complete text immediately via the sr-only copy.
//  */
// function TypeText({
//   as: Tag = "span",
//   text,
//   active,
//   instant = false,
//   speed = 20,
//   onDone,
//   className,
//   ...rest
// }) {
//   const segments = useMemo(
//     () => (typeof text === "string" ? [{ t: text }] : text),
//     [text]
//   );
//   const full = useMemo(() => segments.map((segment) => segment.t).join(""), [segments]);
//   const [count, setCount] = useState(0);
//   const doneRef = useRef(onDone);
//   doneRef.current = onDone;

//   useEffect(() => {
//     if (!active || instant) return undefined;
//     if (!full.length) {
//       doneRef.current?.();
//       return undefined;
//     }
//     let index = 0;
//     setCount(0);
//     const timer = window.setInterval(() => {
//       index += 1;
//       setCount(index);
//       if (index >= full.length) {
//         window.clearInterval(timer);
//         doneRef.current?.();
//       }
//     }, speed);
//     return () => window.clearInterval(timer);
//   }, [active, instant, full, speed]);

//   useEffect(() => {
//     if (!active) setCount(0);
//   }, [active]);

//   const shown = instant ? full.length : count;
//   const typing = active && !instant && shown < full.length;

//   let offset = 0;
//   const nodes = segments.map((segment, index) => {
//     const start = offset;
//     offset += segment.t.length;
//     const typedLength = Math.max(0, Math.min(segment.t.length, shown - start));
//     const typed = segment.t.slice(0, typedLength);
//     const rest = segment.t.slice(typedLength);
//     const showCaret =
//       typing && shown >= start && (shown < start + segment.t.length || index === segments.length - 1);

//     const inner = (
//       <>
//         {typed}
//         {showCaret ? <span className="hci-caret" aria-hidden="true" /> : null}
//         {rest ? <span style={{ visibility: "hidden" }}>{rest}</span> : null}
//       </>
//     );
//     return segment.em ? <em key={index}>{inner}</em> : <Fragment key={index}>{inner}</Fragment>;
//   });

//   return (
//     <Tag className={className} {...rest}>
//       <span className="hci-sr-only">{full}</span>
//       <span aria-hidden="true">{nodes}</span>
//     </Tag>
//   );
// }

// const HCI_STORY_SLIDES = [
//   {
//     number: "01",
//     eyebrow: "DISCOVER YOUR WAY OF LIVING",
//     title: "A home that starts with you.",
//     description:
//       "We begin with your routines, priorities and the small details that make a space feel unmistakably yours.",
//     details: "Your lifestyle · Space planning · Everyday comfort",
//   },
//   {
//     number: "02",
//     eyebrow: "DESIGN WITH INTENTION",
//     title: "Every detail finds its place.",
//     description:
//       "Layouts, materials, lighting and finishes come together in one thoughtful direction—beautiful to look at and practical to live with.",
//     details: "Materials · Colours · Lighting · Finishes",
//   },
//   {
//     number: "03",
//     eyebrow: "FROM IDEA TO REALITY",
//     title: "A vision made beautifully real.",
//     description:
//       "With a clear process and considered decisions, your ideas become a cohesive home, finished with care from the first plan to the final detail.",
//     details: "Clear guidance · Considered choices · Finishing touches",
//   },
// ];

// /** "The HCI experience": static content, no typing or reveal animation. */
// function HCIStickyStory() {
//   return (
//     <section className="hci-scroll-story" aria-labelledby="hci-scroll-story-title">
//       <div className="hci-scroll-story-stage">
//         <div className="hci-scroll-story-heading">
//           <p className="hci-eyebrow">The HCI experience</p>
//           <h2 id="hci-scroll-story-title" className="hci-title">
//             Designed around <em>your life.</em>
//           </h2>
//           <p>
//             A considered journey from the first conversation to the finishing
//             touches—made personal at every step.
//           </p>
//           <span className="hci-story-scroll-cue" aria-hidden="true">
//             DISCOVER OUR PROCESS <span className="hci-cue-arrow">↓</span>
//           </span>
//         </div>

//         <div className="hci-story-step-area" aria-label="Our design journey">
//           <div className="hci-story-progress-track" aria-hidden="true">
//             <span className="hci-story-progress-fill" />
//           </div>
//           <div className="hci-story-steps">
//             {HCI_STORY_SLIDES.map((slide, index) => (
//               <article className="hci-story-step" data-story-index={index} key={slide.number}>
//                 <div className="hci-story-step-topline">
//                   <span className="hci-story-step-number">{slide.number}</span>
//                   <span className="hci-story-step-eyebrow">{slide.eyebrow}</span>
//                 </div>
//                 <h3 className="hci-title">{slide.title}</h3>
//                 <p className="hci-story-step-description">{slide.description}</p>
//                 <div className="hci-story-step-footer">
//                   <span className="hci-story-step-details">{slide.details}</span>
//                   <a
//                     className="hci-story-talk-button"
//                     href="#hci-enquiry-form"
//                     aria-label={`Discuss step ${slide.number}: ${slide.title}`}
//                   >
//                     Let’s talk <span aria-hidden="true">↗</span>
//                   </a>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function htmlToText(html) {
//   const source = html || "";
//   if (typeof document === "undefined") return source.replace(/<[^>]*>/g, " ").trim();
//   const box = document.createElement("div");
//   box.innerHTML = DOMPurify.sanitize(source);
//   return (box.textContent || "").replace(/\s+/g, " ").trim();
// }

// /** Hero (first slide), left side of the form: types eyebrow, kicker, title, description, then shows the buttons. */
// function HeroCopy({ data1 }) {
//   const [stage, setStage] = useState(-1);
//   const [instant, setInstant] = useState(false);
//   const [descText, setDescText] = useState("");

//   const descHtml = data1?.top_description || "Thoughtful interior design for the way you live, gather and grow.";
//   useEffect(() => {
//     setDescText(htmlToText(descHtml));
//   }, [descHtml]);

//   useEffect(() => {
//     const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
//     if (reducedMotion) {
//       setInstant(true);
//       setStage(999);
//       return undefined;
//     }
//     return undefined;
//   }, []);

//   // Infinite loop: type everything, hold, clear, then type again.
//   useEffect(() => {
//     if (instant) return undefined;
//     let delay = null;
//     let next = null;
//     if (stage === -1) {
//       delay = 400;
//       next = 0;
//     } else if (stage === 4) {
//       delay = 3500;
//       next = -1;
//     }
//     if (delay === null) return undefined;
//     const timer = window.setTimeout(() => setStage(next), delay);
//     return () => window.clearTimeout(timer);
//   }, [stage, instant]);

//   const done = (key) => () => setStage((current) => (current === key ? key + 1 : current));
//   const hasKicker = Boolean(data1?.top_title);
//   const KickerTag = hasKicker ? pickTag(data1?.top_title_tag, "p") : "span";
//   const TitleTag = pickTag(data1?.mid_sub_title_tag, "h1");

//   return (
//     <div className="hci-hero-copy">
//       <TypeText
//         as="p"
//         className="hci-eyebrow"
//         text="High Creation Interior"
//         active={stage >= 0}
//         instant={instant}
//         speed={12}
//         onDone={done(0)}
//       />
//       <TypeText
//         as={KickerTag}
//         className={`hci-hero-kicker ${hasKicker ? dynSize(data1?.top_title_tag) : ""}`}
//         text={data1?.top_title || "Considered design. Beautifully lived in."}
//         active={stage >= 1}
//         instant={instant}
//         speed={12}
//         onDone={done(1)}
//       />
//       <TypeText
//         as={TitleTag}
//         id="hci-hero-title"
//         className={`hci-title hci-hero-title ${dynSize(data1?.mid_sub_title_tag)}`}
//         text={data1?.mid_sub_title || "A home that feels like you."}
//         active={stage >= 2}
//         instant={instant}
//         speed={22}
//         onDone={done(2)}
//       />
//       <TypeText
//         as="p"
//         className="hci-hero-desc"
//         text={descText}
//         active={stage >= 3}
//         instant={instant}
//         speed={7}
//         onDone={done(3)}
//       />
//       <div className="hci-hero-links">
//         <a className="hci-button hci-button-dark" href="#hci-enquiry-form">Plan your home <span aria-hidden="true">↗</span></a>
//         <a className="hci-button hci-button-outline" href="#hci-projects">Explore our work <span aria-hidden="true">↓</span></a>
//       </div>
//     </div>
//   );
// }

// async function fetchSection(endpoint, setter) {
//   try {
//     const response = await api.get(endpoint, {});
//     if (response?.data?.json_content) setter(response.data.json_content);
//   } catch (error) {
//     console.error(`HCI landing CMS request failed (${endpoint}):`, error);
//   }
// }

// export default function HCLandingPage({ initialData }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [data1, setData1] = useState(initialData?.data1 ?? null);
//   const [data2, setData2] = useState(initialData?.data2 ?? null);
//   const [data3, setData3] = useState(initialData?.data3 ?? null);
//   const [data4, setData4] = useState(initialData?.data4 ?? null);
//   const [data6, setData6] = useState(initialData?.data6 ?? null);
//   const [faqData, setFaqData] = useState(initialData?.faqs ?? []);
//   const [faqLoading, setFaqLoading] = useState(initialData?.faqs == null);
//   const [faqError, setFaqError] = useState("");
//   const [designIdea, setDesignIdea] = useState(initialData?.designIdea ?? []);
//   const [designLoading, setDesignLoading] = useState(initialData?.designIdea == null);

//   useEffect(() => {
//     const init = initialData || {};
//     if (!init.data1) fetchSection("/cms-content/creating_the_home_of_your_dreams", setData1);
//     if (!init.data2) fetchSection("/cms-content/creating_the_home_of_your_dreams_2", setData2);
//     if (!init.data3) fetchSection("/cms-content/creating_the_home_of_your_dreams_3", setData3);
//     if (!init.data4) fetchSection("/cms-content/creating_the_home_of_your_dreams_4", setData4);
//     if (!init.data6) fetchSection("/cms-content/creating_the_home_of_your_dreams_6", setData6);

//     if (init.faqs == null) {
//       api.get("/cms-content/faqs")
//         .then((response) => setFaqData(Array.isArray(response?.data) ? response.data : []))
//         .catch(() => setFaqError("FAQs could not be loaded right now."))
//         .finally(() => setFaqLoading(false));
//     }
//     if (init.designIdea == null) {
//       api.get("/cms-parent-child/designer_choice")
//         .then((response) => setDesignIdea(Array.isArray(response?.data) ? response.data : []))
//         .catch((error) => console.error("HCI designer-choice content failed to load:", error))
//         .finally(() => setDesignLoading(false));
//     }
//   }, [initialData]);

//   const staticRecords = useMemo(
//     () => [...designIdea].sort((a, b) => Number(b.id) - Number(a.id)).slice(-5),
//     [designIdea]
//   );
//   const handleModalStateChange = useCallback((open) => setIsModalOpen(open), []);

//   const S2SubTag = HEADING_TAGS.includes(data2?.top_description_tag) ? data2.top_description_tag : "h3";
//   const S6Tag = pickTag(data6?.top_title_tag, "h2");

//   return (
//     <div className={`hci-editorial ${isModalOpen ? "hci-modal-open" : ""}`}>
//       <style jsx global>{`
//         .hci-editorial {
//           --hci-paper: #f5f1e9;
//           --hci-paper-light: #fbf9f5;
//           --hci-ink: #30271f;
//           --hci-muted: #71685f;
//           --hci-clay: #9b6244;
//           --hci-line: rgba(48,39,31,.16);
//           color: var(--hci-ink);
//           background: var(--hci-paper-light);
//           font-family: var(--font-poppins), Arial, sans-serif;
//           overflow: clip;
//         }
//         .hci-editorial * { box-sizing: border-box; }
//         .hci-editorial img { max-width: 100%; }
//         .hci-editorial a { color: inherit; }
//         .hci-sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
//         .hci-caret { display: inline-block; position: relative; width: 0; height: 1em; vertical-align: text-bottom; }
//         .hci-caret::after { content: ""; position: absolute; left: 1px; top: .08em; height: .95em; border-left: 2px solid #ff8b49; animation: hci-caret-blink 1s steps(1) infinite; }
//         @keyframes hci-caret-blink { 50% { opacity: 0; } }
//         .hci-shell { width: min(1280px, calc(100% - 64px)); margin-inline: auto; }
//         .hci-eyebrow { display: inline-flex; align-items: center; gap: 10px; margin: 0 0 18px; color: var(--hci-clay); font-size: 10px; font-weight: 700; letter-spacing: .22em; text-transform: uppercase; }
//         .hci-eyebrow::before { content: ""; display: block; width: 28px; height: 1px; background: currentColor; }
//         .hci-title { font-family: Georgia, "Times New Roman", serif; font-weight: 400; letter-spacing: -.045em; line-height: .99; }
//         .hci-button { display: inline-flex; min-height: 48px; align-items: center; justify-content: center; gap: 12px; padding: 0 22px; border: 1px solid #ff8b49; border-radius: 4px; background: #ff8b49; color: #fff !important; text-decoration: none; text-transform: none; letter-spacing: 0; font-size: 15px; font-weight: 600; line-height: 1; transition: background .2s ease, border-color .2s ease, transform .2s ease; cursor: pointer; }
//         .hci-button > span[aria-hidden="true"] { display: inline-grid; place-items: center; width: 26px; height: 26px; flex: 0 0 auto; border: 1.5px solid rgba(255,255,255,.92); border-radius: 50%; font-size: 13px; line-height: 1; }
//         .hci-button:hover { transform: translateY(-2px); }
//         .hci-button:focus-visible, .hci-editorial input:focus-visible, .hci-editorial textarea:focus-visible, .hci-editorial summary:focus-visible { outline: 2px solid var(--hci-clay); outline-offset: 3px; }
//         .hci-button-dark { background: #ff8b49; border-color: #ff8b49; color: #fff !important; }
//         .hci-button-dark:hover { background: #ef7735; border-color: #ef7735; color: #fff !important; }
//         .hci-button-dark:focus-visible, .hci-story-talk-button:focus-visible { outline-color: #ff8b49; }
//         .hci-button-outline { background: #ff8b49; border-color: #ff8b49; color: #fff !important; }
//         .hci-button-outline:hover { background: #ef7735; border-color: #ef7735; color: #fff !important; }

//         /* The sticky photo covers ONLY the hero and the "HCI experience" section.
//            overflow: clip keeps it from ever painting over the sections below. */
//         .hci-intro-experience { position: relative; z-index: 1; isolation: isolate; overflow: clip; background: #40372f; }
//         .hci-shared-backdrop { position: sticky; z-index: 0; top: 0; height: 100svh; margin-bottom: -100svh; overflow: hidden; background: #40372f; pointer-events: none; }
//         .hci-shared-backdrop::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(28,23,19,.69) 0%, rgba(28,23,19,.45) 42%, rgba(28,23,19,.24) 72%, rgba(28,23,19,.38) 100%), linear-gradient(0deg, rgba(28,23,19,.48), transparent 48%); pointer-events: none; }
//         .hci-intro-experience > .hci-hero, .hci-intro-experience > .hci-scroll-story { position: relative; z-index: 1; }

//         /* Every section after the intro sits above the sticky photo with its own solid background. */
//         .hci-intro-experience ~ * { position: relative; z-index: 2; }
//         .hci-intro-experience ~ .hci-section { background: var(--hci-paper-light); }
//         .hci-intro-experience ~ .hci-section-paper { background: var(--hci-paper); }

//         .hci-hero { position: relative; isolation: isolate; min-height: min(790px, calc(100svh - 88px)); display: flex; align-items: center; background: transparent; color: #fff; }
//         .hci-hero::after { display: none; }
//         .hci-hero-inner { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(350px, .72fr); gap: clamp(40px, 7vw, 108px); align-items: center; padding-block: 64px; }
//         .hci-hero-copy { max-width: 660px; padding-block: 12px; }
//         .hci-hero .hci-eyebrow { color: #e6c8aa; }
//         .hci-hero-kicker { display: block; color: rgba(255,255,255,.82); font-size: clamp(13px, 1.4vw, 17px); letter-spacing: .045em; margin-bottom: 18px; }
//         .hci-hero-title { margin: 0; max-width: 720px; font-size: clamp(52px, 6.4vw, 88px); text-wrap: balance; }
//         .hci-hero-title em { color: #e8c8a9; font-weight: 400; }
//         .hci-hero-desc { max-width: 510px; margin-top: 24px; color: rgba(255,255,255,.86); font-size: 14px; line-height: 1.9; }
//         .hci-hero-desc, .hci-hero-desc * { color: rgba(255,255,255,.86) !important; }
//         .hci-hero-links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
//         .hci-hero p.hci-hero-desc { margin-bottom: 0; }


//         .hci-form-card { padding: clamp(22px, 3vw, 34px); color: var(--hci-ink); background: rgba(250,248,243,.97); box-shadow: 0 25px 65px rgba(17,13,10,.2); border: 1px solid rgba(255,255,255,.55); }
//         .hci-form-topline { display: flex; align-items: center; gap: 9px; color: var(--hci-clay); font-size: 9px; letter-spacing: .18em; font-weight: 700; }
//         .hci-form-topline span { width: 7px; height: 7px; border-radius: 50%; background: var(--hci-clay); }
//         .hci-form-card h2 { margin: 14px 0 8px; font: 400 clamp(29px, 3vw, 37px)/1.08 Georgia, "Times New Roman", serif; letter-spacing: -.035em; }
//         .hci-form-intro { color: var(--hci-muted); font-size: 12px; line-height: 1.7; margin: 0 0 22px; }
//         .hci-lead-form { display: grid; gap: 13px; }
//         .hci-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//         .hci-field { display: grid; gap: 7px; min-width: 0; }
//         .hci-field > span { font-size: 10px; font-weight: 700; color: #50463d; }
//         .hci-field em { color: #8a8178; font-style: normal; font-weight: 400; }
//         .hci-field input, .hci-field textarea { width: 100%; min-width: 0; padding: 12px 13px; border: 1px solid #ded8ce; border-radius: 0; background: #fffdfa; color: var(--hci-ink); font: inherit; font-size: 12px; outline-offset: 2px; }
//         .hci-field input { min-height: 43px; }
//         .hci-field textarea { resize: vertical; min-height: 70px; }
//         .hci-field input::placeholder, .hci-field textarea::placeholder { color: #a49a90; }
//         .hci-consent { display: flex; align-items: flex-start; gap: 9px; font-size: 10px; line-height: 1.6; color: var(--hci-muted); }
//         .hci-consent input { margin-top: 2px; accent-color: var(--hci-clay); }
//         .hci-consent a { text-decoration: underline; text-underline-offset: 2px; }
//         .hci-form-submit { width: 100%; margin-top: 2px; }
//         .hci-form-submit:disabled { opacity: .65; cursor: wait; transform: none; }
//         .hci-form-footnote { margin: -2px 0 0; text-align: center; font-size: 9px; color: #8c8379; }

//         /* "HCI experience" section: natural flow over the sticky backdrop, content is typed in. */
//         .hci-scroll-story { position: relative; padding: clamp(66px, 8vw, 108px) max(24px, calc((100vw - 1280px) / 2)); color: #fff; background: transparent; }
//         .hci-scroll-story::before { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(25,20,16,.2) 0%, rgba(25,20,16,.62) 100%); pointer-events: none; }
//         .hci-scroll-story-stage { position: relative; z-index: 1; width: 100%; max-width: 1280px; margin-inline: auto; display: flex; flex-direction: column; gap: clamp(32px, 4vw, 52px); }
//         .hci-scroll-story-heading { position: relative; width: min(740px, 70%); color: #fff; }
//         .hci-scroll-story-heading .hci-eyebrow { color: #e8c8a9; }
//         .hci-scroll-story-heading h2 { max-width: 740px; margin: 0; font-size: clamp(44px, 5.8vw, 76px); line-height: .98; text-wrap: balance; }
//         .hci-scroll-story-heading h2 em { color: #e8c8a9; font-weight: 400; }
//         .hci-scroll-story-heading > p:not(.hci-eyebrow) { max-width: 480px; margin: 20px 0 0; color: rgba(255,255,255,.86); font-size: 13px; line-height: 1.9; }
//         .hci-story-scroll-cue { display: inline-flex; align-items: center; gap: 14px; margin-top: 25px; color: #e8c8a9; font-size: 9px; font-weight: 700; letter-spacing: .18em; }
//         .hci-cue-arrow { display: inline-grid; place-items: center; width: 28px; height: 28px; border: 1px solid rgba(232,200,169,.7); border-radius: 50%; font-size: 14px; }
//         .hci-story-step-area { position: relative; width: 100%; }
//         .hci-story-progress-track { position: relative; height: 1px; margin-bottom: 24px; background: rgba(255,255,255,.5); }
//         .hci-story-progress-fill { position: absolute; inset: 0 auto 0 0; display: block; width: 100%; background: #ff8b49; }
//         .hci-story-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; align-items: stretch; }
//         .hci-story-step { position: relative; display: flex; flex-direction: column; min-width: 0; min-height: 315px; padding: clamp(22px, 2.6vw, 34px); border: 1px solid rgba(255,255,255,.62); border-radius: 3px; background: rgba(250,248,243,.96); box-shadow: 0 16px 42px rgba(18,13,9,.16); color: var(--hci-ink); }
//         .hci-story-step-topline { display: flex; align-items: center; gap: 12px; min-height: 38px; margin-bottom: 23px; }
//         .hci-story-step-number { display: inline-grid; place-items: center; width: 38px; height: 38px; flex: 0 0 38px; border: 1px solid #ff8b49; border-radius: 50%; background: #ff8b49; color: #fff; font: 400 13px Georgia, "Times New Roman", serif; }
//         .hci-story-step-eyebrow { color: #9b6244; font-size: 8px; font-weight: 700; letter-spacing: .14em; line-height: 1.5; }
//         .hci-story-step h3 { max-width: 400px; margin: 0; color: var(--hci-ink); font-size: clamp(24px, 2.35vw, 35px); line-height: 1.08; letter-spacing: -.025em; }
//         .hci-story-step-description { max-width: 410px; margin: 14px 0 0; color: var(--hci-muted); font-size: 11px; line-height: 1.8; }
//         .hci-story-step-footer { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin-top: auto; padding-top: 22px; }
//         .hci-story-step-details { max-width: 68%; color: #81766b; font-size: 8px; line-height: 1.7; }
//         .hci-story-talk-button { display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; gap: 8px; padding: 9px 14px; border: 1px solid #ff8b49; border-radius: 4px; background: #ff8b49; color: #fff !important; font-size: 12px; font-weight: 600; letter-spacing: 0; line-height: 1; text-decoration: none; text-transform: none; white-space: nowrap; transition: background .2s ease, border-color .2s ease, transform .2s ease; }
//         .hci-story-talk-button:hover { background: #ef7735; border-color: #ef7735; transform: translateY(-2px); }
//         .hci-story-talk-button span { display: inline-grid; place-items: center; width: 20px; height: 20px; border: 1.5px solid rgba(255,255,255,.92); border-radius: 50%; font-size: 11px; line-height: 1; }

//         .hci-section { padding-block: clamp(70px, 9vw, 132px); }
//         .hci-section-paper { background: var(--hci-paper); }
//         .hci-about-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, .9fr); gap: clamp(36px, 7vw, 100px); align-items: center; }
//         .hci-about-image-wrap { position: relative; padding: 0 22px 22px 0; }
//         .hci-about-image-wrap::after { content: ""; position: absolute; right: 0; bottom: 0; width: 65%; height: 68%; border: 1px solid #bda18a; z-index: 0; }
//         .hci-about-image { position: relative; z-index: 1; display: block; width: 100%; aspect-ratio: 4 / 5; max-height: 630px; object-fit: cover; background: #e5ded3; }
//         .hci-about-copy h2, .hci-section-heading { margin: 0; font-size: clamp(38px, 4.7vw, 62px); }
//         .hci-about-copy h2 { max-width: 570px; }
//         .hci-about-copy h2 em, .hci-section-heading em { color: var(--hci-clay); font-weight: 400; }
//         .hci-about-desc { margin-top: 22px; max-width: 590px; color: var(--hci-muted); font-size: 13px; line-height: 1.95; }
//         .hci-about-desc p { margin: 0 0 12px; }
//         .hci-text-link { display: inline-flex; align-items: center; gap: 18px; margin-top: 24px; color: var(--hci-ink); font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; text-decoration: none; border-bottom: 1px solid var(--hci-clay); padding-bottom: 9px; }
//         .hci-text-link span { font-size: 17px; transition: transform .2s ease; }
//         .hci-text-link:hover span { transform: translate(3px,-2px); }
//         .hci-section-head { display: flex; flex-direction: column; align-items: center; gap: 0; margin-bottom: 36px; text-align: center; }
//         .hci-section-head > div { width: 100%; }
//         .hci-section-head .hci-section-heading { margin-inline: auto; }
//         .hci-section-heading { max-width: 750px; }
//         .hci-section-intro { max-width: 460px; margin: 17px 0 0; color: var(--hci-muted); font-size: 13px; line-height: 1.9; }
//         .hci-section-head .hci-section-intro { max-width: 920px; margin: 20px auto 0; text-align: center; }
//         .hci-video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
//         .hci-video-card { position: relative; overflow: hidden; background: #e5ded3; }
//         .hci-video-grid .video-thumbnail { border-radius: 0 !important; box-shadow: none !important; }
//         .hci-video-caption { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 16px 2px; border-bottom: 1px solid var(--hci-line); color: var(--hci-ink); font: 400 20px Georgia, serif; }
//         .hci-video-caption span { color: var(--hci-clay); font: 700 9px var(--font-poppins), Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; }
//         .hci-portfolio { padding-block: clamp(70px, 8vw, 112px); background: #f8f5ef; }
//         .hci-intro-experience ~ .hci-portfolio { background: #f8f5ef; }
//         .hci-portfolio-kicker { display: block; text-align: center; margin-bottom: 15px; color: var(--hci-clay); font-size: 10px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; }
//         .hci-portfolio-title { text-align: center; margin: 0 auto; font-size: clamp(42px, 5.3vw, 68px); }
//         .hci-portfolio-description { max-width: min(1100px, 100%); margin: 18px auto 0; text-align: center; color: var(--hci-muted); font-size: 13px; line-height: 1.9; }
//         .hci-portfolio-grid { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 18px; margin-top: 46px; }
//         .hci-portfolio-card { grid-column: span 6; min-width: 0; overflow: hidden; background: #ddd3c7; }
//         .hci-portfolio-card:nth-child(3n) { grid-column: span 12; }
//         .hci-portfolio-card .designercard { min-height: 360px; border-radius: 0 !important; overflow: hidden; }
//         .hci-portfolio-card .designercard * { text-shadow: 0 3px 18px rgba(0,0,0,.55) !important; }
//         .hci-portfolio-card .designercard:hover { transform: none; }
//         .hci-portfolio-footer { display: flex; justify-content: center; margin-top: 32px; }
//         .hci-process-head { text-align: center; }
//         .hci-process-head .hci-section-heading { margin-inline: auto; }
//         .hci-process-head .hci-section-intro { max-width: 640px; margin: 17px auto 0; }
//         .hci-process-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; margin-top: 48px; }
//         .hci-process-step { position: relative; display: flex; flex-direction: column; min-width: 0; padding: 28px 24px 30px; border: 1px solid rgba(48,39,31,.07); border-radius: 18px; background: #fff; box-shadow: 0 12px 32px rgba(48,39,31,.07); overflow: hidden; transition: transform .25s ease, box-shadow .25s ease; }
//         .hci-process-step::before { content: ""; position: absolute; inset: 0 0 auto 0; height: 4px; background: linear-gradient(90deg, #ff8b49, #ffc09a); }
//         .hci-process-step:hover { transform: translateY(-6px); box-shadow: 0 20px 44px rgba(48,39,31,.12); }
//         .hci-process-top { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
//         .hci-process-badge { display: inline-grid; place-items: center; width: 44px; height: 44px; flex: 0 0 44px; border-radius: 12px; background: #fff1e6; color: #ef7735; font: 400 18px Georgia, serif; }
//         .hci-process-label { color: var(--hci-muted); font-size: 12px; font-weight: 600; letter-spacing: .02em; }
//         .hci-process-step h3 { margin: 0 0 10px; color: var(--hci-ink); font: 400 23px/1.2 Georgia, serif; }
//         .hci-process-step p { margin: 0; color: var(--hci-muted); font-size: 12px; line-height: 1.85; }
//         .hci-faq { background: #eee7dc; }
//         .hci-intro-experience ~ .hci-faq { background: #eee7dc; }
//         .hci-faq-grid { display: grid; grid-template-columns: minmax(0,.75fr) minmax(0,1.25fr); gap: clamp(35px, 8vw, 110px); align-items: start; }
//         .hci-faq-intro h2 { margin: 0; font-size: clamp(38px, 4.4vw, 58px); }
//         .hci-faq-intro p { max-width: 340px; color: var(--hci-muted); font-size: 13px; line-height: 1.9; }
//         .hci-faq-intro p.hci-eyebrow { max-width: none; color: var(--hci-clay); font-size: 10px; line-height: normal; }
//         .hci-faq-list { border-top: 1px solid var(--hci-line); }
//         .hci-faq-item { border-bottom: 1px solid var(--hci-line); }
//         .hci-faq-item summary { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 21px 0; cursor: pointer; list-style: none; font: 400 19px Georgia, serif; }
//         .hci-faq-item summary::-webkit-details-marker { display: none; }
//         .hci-faq-item summary::after { content: "+"; flex: 0 0 auto; color: var(--hci-clay); font: 400 25px Georgia, serif; }
//         .hci-faq-item[open] summary::after { content: "−"; }
//         .hci-faq-answer { padding: 0 35px 21px 0; color: var(--hci-muted); font-size: 12px; line-height: 1.9; }
//         .hci-faq-answer p { margin: 0 0 8px; }

//         /* Final CTA: light grey background, dark text, brand-orange button. */
//         .hci-final-cta { position: relative; padding-block: clamp(74px, 9vw, 120px); color: var(--hci-ink); background: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,.65), transparent 60%), linear-gradient(135deg, #fff1e6 0%, #ffe0cc 48%, #fccdb0 100%); text-align: center; }
//         .hci-intro-experience ~ .hci-final-cta { background: radial-gradient(ellipse at 50% 0%, rgba(255,255,255,.65), transparent 60%), linear-gradient(135deg, #fff1e6 0%, #ffe0cc 48%, #fccdb0 100%); }


//         .hci-final-cta .hci-eyebrow { color: var(--hci-clay); }
//         .hci-final-cta h2 { max-width: 850px; margin: 0 auto; color: var(--hci-ink); font-size: clamp(44px, 6vw, 76px); }
//         .hci-final-desc { max-width: 860px; margin: 20px auto 30px; color: var(--hci-muted); font-size: 13px; line-height: 1.9; }
//         .hci-final-desc, .hci-final-desc * { color: var(--hci-muted) !important; }
//         .hci-final-desc h1, .hci-final-desc h2, .hci-final-desc h3, .hci-final-desc h4 { color: var(--hci-ink) !important; }
//         .hci-final-desc p { margin: 0; }

//         .hci-side-enquiry { position: fixed; z-index: 90; right: 0; top: 48%; writing-mode: vertical-rl; transform: rotate(180deg); padding: 16px 11px; color: #fff !important; background: #ff8b49; border-radius: 0 6px 6px 0; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: .02em; text-transform: none; box-shadow: 0 6px 20px rgba(0,0,0,.16); transition: background .2s ease; }
//         .hci-side-enquiry:hover { background: #ef7735; }
//         .hci-modal-open { filter: none; }
//         .hci-editorial .hci-dyn-size.hci-h1 { font-size: clamp(47px, 6vw, 82px); }
//         .hci-editorial .hci-dyn-size.hci-h2 { font-size: clamp(40px, 4.8vw, 64px); }
//         .hci-editorial .hci-dyn-size.hci-h3 { font-size: clamp(32px, 3.8vw, 48px); }
//         .hci-editorial .hci-dyn-size.hci-h4 { font-size: clamp(28px, 3vw, 38px); }
//         /* CMS heading-tag choices must not shrink the editorial hero headline. */
//         .hci-editorial .hci-hero-title.hci-dyn-size { font-size: clamp(52px, 6.4vw, 88px); }
//         @media (max-width: 1199.98px) {
//           .hci-scroll-story { padding-left: 32px; padding-right: 32px; }
//           .hci-story-step { padding: 24px; }
//         }
//         @media (max-width: 991.98px) {
//           .hci-scroll-story { padding: 54px 22px; }
//           .hci-scroll-story-stage { gap: 32px; }
//           .hci-scroll-story-heading { width: min(620px, 88%); }
//           .hci-scroll-story-heading h2 { font-size: clamp(38px, 5.4vw, 56px); }
//           .hci-scroll-story-heading > p:not(.hci-eyebrow) { font-size: 11px; line-height: 1.75; }
//           .hci-story-steps { gap: 12px; }
//           .hci-story-step { padding: 21px 18px; min-height: 320px; }
//           .hci-story-step-topline { align-items: flex-start; flex-direction: column; gap: 8px; margin-bottom: 14px; }
//           .hci-story-step h3 { font-size: clamp(22px, 2.8vw, 30px); }
//           .hci-story-step-description { font-size: 10px; }
//           .hci-story-step-footer { align-items: flex-start; flex-direction: column; gap: 10px; padding-top: 18px; }
//           .hci-story-step-details { max-width: 100%; }
//           .hci-shell { width: min(100% - 40px, 760px); }
//           .hci-hero { min-height: 0; }
//           .hci-hero-inner { grid-template-columns: 1fr; gap: 38px; padding-block: 76px 56px; }
//           .hci-hero-copy { max-width: 720px; }
//           .hci-form-card { max-width: 680px; }
//           .hci-about-grid, .hci-faq-grid { grid-template-columns: 1fr 1fr; gap: 35px; }
//           .hci-about-image { aspect-ratio: 4 / 5; }
//           .hci-portfolio-card .designercard { min-height: 300px; }
//         }
//         @media (max-width: 640px) {
//           .hci-shared-backdrop { height: 100svh; }
//           .hci-scroll-story { padding: 48px 18px 38px; }
//           .hci-scroll-story-stage { gap: 30px; }
//           .hci-scroll-story-heading { width: 100%; }
//           .hci-scroll-story-heading h2 { font-size: clamp(38px, 10vw, 50px); }
//           .hci-scroll-story-heading > p:not(.hci-eyebrow) { max-width: 95%; margin-top: 14px; font-size: 12px; line-height: 1.75; }
//           .hci-story-scroll-cue { margin-top: 17px; }
//           .hci-story-step-area { margin-top: 0; }
//           .hci-story-progress-track { margin-bottom: 16px; }
//           .hci-story-steps { grid-template-columns: 1fr; gap: 12px; }
//           .hci-story-step, .hci-story-step:first-child, .hci-story-step:last-child { min-height: 0; padding: 22px; border: 1px solid rgba(255,255,255,.65); border-radius: 3px; }
//           .hci-story-step-topline { flex-direction: row; align-items: center; gap: 12px; margin-bottom: 15px; }
//           .hci-story-step h3 { font-size: clamp(27px, 7vw, 36px); }
//           .hci-story-step-description { font-size: 11px; line-height: 1.75; }
//           .hci-story-step-footer { align-items: center; flex-direction: row; gap: 12px; padding-top: 18px; }
//           .hci-story-step-details { max-width: 66%; font-size: 8px; }
//           .hci-story-talk-button { font-size: 12px; padding: 8px 12px; }
//           .hci-shell { width: calc(100% - 36px); }
//           .hci-hero::after { display: none; }
//           .hci-hero-inner { padding-block: 54px 38px; gap: 28px; }
//           .hci-hero-title, .hci-editorial .hci-hero-title.hci-dyn-size { font-size: clamp(44px, 13vw, 64px); line-height: 1.01; }
//           .hci-hero-desc { font-size: 12px; margin-top: 19px; }
//           .hci-hero-links { margin-top: 22px; }
//           .hci-button { min-height: 48px; padding-inline: 17px; gap: 12px; font-size: 9px; }
//           .hci-form-card { padding: 23px 19px; }
//           .hci-form-row { grid-template-columns: 1fr; gap: 13px; }
//           .hci-section { padding-block: 64px; }
//           .hci-about-grid, .hci-faq-grid { grid-template-columns: 1fr; gap: 34px; }
//           .hci-about-image-wrap { max-width: 520px; }
//           .hci-about-image { aspect-ratio: 4 / 3; max-height: none; }
//           .hci-about-copy h2, .hci-section-heading { font-size: clamp(38px, 11vw, 52px); }
//           .hci-section-head { display: block; margin-bottom: 25px; }
//           .hci-section-intro { margin-top: 13px; }
//           .hci-video-grid { grid-template-columns: 1fr; gap: 22px; }
//           .hci-video-caption { font-size: 18px; }
//           .hci-portfolio { padding-block: 64px; }
//           .hci-portfolio-title { font-size: clamp(40px, 11vw, 55px); }
//           .hci-portfolio-grid { grid-template-columns: 1fr; gap: 14px; margin-top: 30px; }
//           .hci-portfolio-card, .hci-portfolio-card:nth-child(3n) { grid-column: auto; }
//           .hci-portfolio-card .designercard { min-height: 280px; }
//           .hci-faq-intro h2 { font-size: 42px; }
//           .hci-faq-item summary { font-size: 17px; }
//           .hci-final-cta h2 { font-size: clamp(42px, 12vw, 58px); }
//           .hci-side-enquiry { display: none; }
//         }
//         @media (max-width: 1100px) {
//           .hci-process-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
//         }
//         @media (max-width: 640px) {
//           .hci-hero-inner > * { min-width: 0; }
//           .hci-hero-links { flex-direction: column; align-items: stretch; }
//           .hci-hero-links .hci-button { width: 100%; }
//           .hci-button { font-size: 14px; min-height: 46px; }
//           .hci-eyebrow { letter-spacing: .16em; font-size: 9px; }
//           .hci-section-head .hci-section-intro { font-size: 12px; margin-top: 14px; }
//           .hci-portfolio-description { font-size: 12px; }
//           .hci-portfolio-footer .hci-button { width: 100%; }
//           .hci-video-caption { flex-direction: column; align-items: flex-start; gap: 6px; }
//           .hci-process-grid { grid-template-columns: 1fr; gap: 14px; margin-top: 30px; }
//           .hci-process-step { padding: 24px 20px 26px; }
//           .hci-process-step:hover { transform: none; }
//           .hci-process-step h3 { font-size: 21px; }
//           .hci-faq-answer { padding-right: 0; }
//           .hci-final-desc { font-size: 12px; }
//           .hci-final-cta .hci-button { width: 100%; max-width: 360px; }
//         }
//         @media (max-width: 400px) {
//           .hci-shell { width: calc(100% - 28px); }
//           .hci-hero-title, .hci-editorial .hci-hero-title.hci-dyn-size { font-size: clamp(38px, 12.5vw, 48px); }
//           .hci-form-card { padding: 20px 16px; }
//           .hci-form-card h2 { font-size: 27px; }
//           .hci-scroll-story { padding-inline: 14px; }
//           .hci-story-step { padding: 18px; }
//           .hci-story-step-footer { flex-wrap: wrap; }
//           .hci-story-step-details { max-width: 100%; }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .hci-editorial *, .hci-editorial *::before, .hci-editorial *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
//         }
//       `}</style>

//       <div className="hci-page">
//         {/* Sticky background + scrolling effect lives ONLY across these two sections:
//             1) hero  2) "The HCI experience" */}
//         <div className="hci-intro-experience">
//           <div className="hci-shared-backdrop" aria-hidden="true">
//             {data1?.mid_image || data2?.mid_image ? (
//               <HeroImage
//                 src={data1?.mid_image || data2?.mid_image}
//                 alt=""
//                 fallbackAlt="A thoughtfully designed home by High Creation Interior"
//               />
//             ) : null}
//           </div>

//           <section className="hci-hero" aria-labelledby="hci-hero-title">
//             <div className="hci-shell hci-hero-inner">
//               <HeroCopy data1={data1} />
//               <LeadForm />
//             </div>
//           </section>

//           <HCIStickyStory />
//         </div>

//         <section className="hci-section hci-section-paper" aria-labelledby="hci-about-title">
//           <div className="hci-shell hci-about-grid">
//             <div className="hci-about-image-wrap">
//               {data2?.mid_image && data2.mid_image !== (data1?.mid_image || "") ? (
//                 // CMS images may be hosted outside the Next Image allowlist. This
//                 // secondary image is lazy-loaded to protect first-view performance.
//                 // eslint-disable-next-line @next/next/no-img-element
//                 <img className="hci-about-image" src={data2.mid_image} alt={data2?.mid_image_alt || data2?.top_title || "Interior design detail by High Creation Interior"} loading="lazy" decoding="async" />
//               ) : (
//                 <div className="hci-about-image" role="img" aria-label="Interior design image placeholder" />
//               )}
//             </div>
//             <div className="hci-about-copy">
//               <p className="hci-eyebrow">A little more personal</p>
//               <h2 id="hci-about-title" className="hci-title">{data2?.top_title || "Good design is felt, not just seen."}</h2>
//               <S2SubTag className={`hci-section-intro ${dynSize(data2?.top_description_tag)}`}>{data2?.top_description}</S2SubTag>
//               <Html className="hci-about-desc" html={data2?.mid_sub_title || "Every home has its own rhythm. We bring together practical planning, considered materials and a clear design point of view to create spaces that feel personal and work beautifully every day."} />
//               <a className="hci-text-link" href={data2?.mid_sub_description || "/about-us"}>Discover our approach <span aria-hidden="true">↗</span></a>
//             </div>
//           </div>
//         </section>

//         <section className="hci-section" aria-labelledby="hci-design-thinking-title">
//           <div className="hci-shell">
//             <div className="hci-section-head">
//               <div>
//                 <p className="hci-eyebrow">Ideas with intention</p>
//                 <h2 id="hci-design-thinking-title" className="hci-title hci-section-heading">{data3?.top_title || "Find the feeling that feels like you."}</h2>
//               </div>
//               <Html className="hci-section-intro" html={data3?.top_description || "Explore different moods, materials and ways of living. Start with inspiration, then make the details your own."} />
//             </div>
//             <div className="hci-video-grid">
//               <div className="hci-video-card">
//                 <VideoBox videoUrl={data3?.mid_sub_title} imageUrl="/images/Designer_Choice/Vintage_blue.webp" />
//                 <div className="hci-video-caption">Character, colour and contrast <span>01 / Explore</span></div>
//               </div>
//               <div className="hci-video-card">
//                 <VideoBox videoUrl={data3?.mid_sub_description} imageUrl="/images/Designer_Choice/Natural.jpg" />
//                 <div className="hci-video-caption">Natural textures, quieter spaces <span>02 / Explore</span></div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="hci-portfolio" id="hci-projects" aria-labelledby="hci-portfolio-title">
//           <div className="hci-shell">
//             <span className="hci-portfolio-kicker">The designer’s edit</span>
//             <h2 id="hci-portfolio-title" className="hci-title hci-portfolio-title">{data4?.top_title || "Rooms with a point of view."}</h2>
//             <Html className="hci-portfolio-description" html={data4?.top_description || "A selection of design directions to spark your imagination. Explore the details, then tell us what feels right for your home."} />
//             <div className="hci-portfolio-grid" style={designLoading ? { minHeight: 300 } : undefined}>
//               {staticRecords.map((record) => (
//                 <div className="hci-portfolio-card" key={record.id}>
//                   <BgImageCard
//                     style={{ backgroundImage: `url(${record?.child_content?.image || ""})` }}
//                     cardLinkTag={`/designer-choice/gallery?id=${record.id}`}
//                     designerCardBgDiv="designercard designercardimg1"
//                     titleBgImage={record?.child_content?.title}
//                     imageAlt={record?.child_content?.image_alt}
//                     descriptionBg={record?.child_content?.description}
//                   />
//                 </div>
//               ))}
//             </div>
//             {!designLoading && staticRecords.length === 0 ? (
//               <p className="hci-portfolio-description">Our latest design stories are being refreshed. Please explore the designer’s choice gallery.</p>
//             ) : null}
//             <div className="hci-portfolio-footer" style={{ flexWrap: "wrap", gap: 12 }}><a className="hci-button hci-button-dark" href="/designer-choice">View all design ideas <span aria-hidden="true">↗</span></a><a className="hci-button hci-button-dark" href={data4?.mid_sub_title || "/contact"}>Let’s connect <span aria-hidden="true">↗</span></a></div>
//           </div>
//         </section>

//         <section className="hci-section hci-section-paper" aria-labelledby="hci-process-title">
//           <div className="hci-shell">
//             <div className="hci-process-head">
//               <p className="hci-eyebrow">From first thought to final detail</p>
//               <h2 className="hci-title hci-section-heading" id="hci-process-title">A considered process.<br /><em>A home made yours.</em></h2>
//               <p className="hci-section-intro">A clear route from an early idea to a finished space helps every decision feel easier.</p>
//             </div>
//             <div className="hci-process-grid">
//               <article className="hci-process-step"><div className="hci-process-top"><span className="hci-process-badge">01</span><span className="hci-process-label">Listen</span></div><h3>Understand your life</h3><p>We begin with your space, needs, tastes and priorities.</p></article>
//               <article className="hci-process-step"><div className="hci-process-top"><span className="hci-process-badge">02</span><span className="hci-process-label">Imagine</span></div><h3>Shape the design</h3><p>Ideas become a considered direction for materials, finishes and layout.</p></article>
//               <article className="hci-process-step"><div className="hci-process-top"><span className="hci-process-badge">03</span><span className="hci-process-label">Plan</span></div><h3>Work through details</h3><p>Bring the practical choices together before moving into execution.</p></article>
//               <article className="hci-process-step"><div className="hci-process-top"><span className="hci-process-badge">04</span><span className="hci-process-label">Complete</span></div><h3>Bring it to life</h3><p>See your vision take shape, right down to the finishing touches.</p></article>
//             </div>
//           </div>
//         </section>

//         <section className="hci-section hci-faq" aria-labelledby="hci-faq-title">
//           <div className="hci-shell hci-faq-grid">
//             <div className="hci-faq-intro">
//               <p className="hci-eyebrow">Before we begin</p>
//               <h2 id="hci-faq-title" className="hci-title">A few things you may be wondering.</h2>
//               <p>Good decisions start with clear answers. Here are some common questions about getting started.</p>
//               <a className="hci-text-link" href="/contact">Talk to our team <span aria-hidden="true">↗</span></a>
//             </div>
//             <div className="hci-faq-list">
//               {faqLoading ? <p className="hci-section-intro">Loading FAQs…</p> : null}
//               {faqError ? <p className="hci-section-intro">{faqError}</p> : null}
//               {!faqLoading && !faqError && faqData.map((faq, index) => {
//                 const item = faq?.json_content || faq || {};
//                 if (!item.title && !item.description) return null;
//                 return (
//                   <details className="hci-faq-item" key={faq?.id || `${item.title}-${index}`} open={index === 0}>
//                     <summary>{item.title || "Frequently asked question"}</summary>
//                     <Html className="hci-faq-answer" html={item.description || ""} />
//                   </details>
//                 );
//               })}
//             </div>
//           </div>
//         </section>

//         <section className="hci-final-cta" aria-labelledby="hci-final-title">
//           <div className="hci-shell">
//             <p className="hci-eyebrow">Your home, thoughtfully considered</p>
//             <S6Tag id="hci-final-title" className="hci-title">{data6?.top_title || "Let’s create a home you love coming back to."}</S6Tag>
//             <Html className="hci-final-desc" html={data6?.top_description || "Share your ideas with us. We’ll help you work out a practical, personal next step."} />
//             <a className="hci-button hci-button-dark" href={data6?.mid_sub_title || "#hci-enquiry-form"}>Let’s connect <span aria-hidden="true">↗</span></a>
//           </div>
//         </section>
//       </div>

//       <a href="/contact" className="hci-side-enquiry" aria-label="Open the contact page">Enquire with HCI</a>
//       <ContactUsPopUp onModalStateChange={handleModalStateChange} />
//     </div>
//   );
// }



// "use client";

// import { memo, useCallback, useEffect, useMemo, useState } from "react";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import DOMPurify from "isomorphic-dompurify";
// import api from "@/utils/api";
// import { buildLeadMetadata } from "@/utils/leadForms";

// // Lazy-loaded: triggered later by scroll/time/exit intent, must not delay first paint.
// const ContactUsPopUp = dynamic(() => import("../components/ContactUsPopUp"), {
//   ssr: false,
// });

// /* -------------------------------------------------------------------------- */
// /*  Static content, taken from https://www.hcinterior.in/                     */
// /* -------------------------------------------------------------------------- */

// const CMS_IMG = "https://apidev.hcinterior.in/uploads/cms-content/";
// const HERO_VIDEO = `${CMS_IMG}banner_image-1791979629832-642156515.mp4`;

// const PHONE_TEL = "tel:+917070701373";
// const PHONE_LABEL = "+91 70707 01373";
// const WHATSAPP = "https://wa.me/919560277787";

// const HERO_POINTS = [
//   "Free design consultation",
//   "Complete customization",
//   "In-house production",
// ];

// const STATS = [
//   { value: "8+", label: "years of experience" },
//   { value: "2,750+", label: "projects completed" },
//   { value: "450+", label: "people on our team" },
//   { value: "5", label: "branches across NCR" },
// ];

// const OFFERS = [
//   {
//     icon: `${CMS_IMG}icons-1787850499686-644533899.avif`,
//     title: "Interior design & planning",
//     text: "We work closely with you to turn your ideas into reality and create designs that are fully customized to your needs.",
//     href: "/what-we-offer#section-1",
//   },
//   {
//     icon: `${CMS_IMG}icons-1787850499687-781926192.avif`,
//     title: "Custom interior design",
//     text: "Every interior is crafted to match your style while ensuring lasting functionality and everyday comfort.",
//     href: "/what-we-offer#section-2",
//   },
//   {
//     icon: `${CMS_IMG}icons-1787850499688-372983121.avif`,
//     title: "Furniture & decor",
//     text: "Carefully selected furniture and decor that enhance the interior design of your home.",
//     href: "/what-we-offer#section-3",
//   },
//   {
//     icon: `${CMS_IMG}icons-1787850499689-288081392.avif`,
//     title: "Kitchen interior design",
//     text: "Kitchens that are stylish, practical and designed around the way you cook and live.",
//     href: "/what-we-offer#section-4",
//   },
// ];

// const WHY_POINTS = [
//   {
//     title: "Complete customization",
//     text: "Every project is designed around your vision, your space and your lifestyle, not a fixed catalogue.",
//   },
//   {
//     title: "In-house production",
//     text: "We make furniture, fixtures and design elements in our own facility, so quality, cost and timelines stay in our hands.",
//   },
//   {
//     title: "One team, one roof",
//     text: "Design and production are managed together, which means fewer third-party vendors and a smoother process.",
//   },
// ];

// const STEPS = [
//   {
//     icon: `${CMS_IMG}icons-1785928632924-898978816.avif`,
//     title: "Initial consultation",
//     text: "We understand your preferences and vision.",
//   },
//   {
//     icon: `${CMS_IMG}icons-1785928632924-944812370.avif`,
//     title: "Creative concept",
//     text: "We create a design that matches your style.",
//   },
//   {
//     icon: `${CMS_IMG}icons-1785928632925-954209315.avif`,
//     title: "Design strategy",
//     text: "We turn ideas into a clear plan, carefully.",
//   },
//   {
//     icon: `${CMS_IMG}icons-1785928632925-601818278.avif`,
//     title: "Execution planning",
//     text: "We prepare everything for smooth project execution.",
//   },
//   {
//     icon: `${CMS_IMG}icons-1785928632925-877520389.avif`,
//     title: "Final handover",
//     text: "We hand over your finished home with care.",
//   },
// ];

// const AREAS = [
//   { label: "Noida", href: "/interior-designers-in-noida" },
//   { label: "Greater Noida", href: "/interior-designers-in-greater-noida" },
//   { label: "Noida Extension", href: "/interior-designer-in-noida-extension" },
//   { label: "Ghaziabad", href: "/interior-designers-in-ghaziabad" },
//   { label: "Delhi", href: "/interior-designers-in-delhi" },
//   { label: "Dwarka", href: "/interior-designers-in-dwarka" },
//   { label: "Gurugram", href: "/interior-designers-in-gurgaon" },
//   { label: "Faridabad", href: "/interior-designers-in-faridabad" },
//   { label: "Manesar", href: "/interior-designers-in-manesar" },
//   { label: "Sohna", href: "/interior-designer-in-sohna-gurgaon" },
// ];

// const CENTERS = [
//   { label: "New Delhi", href: "/experience-center-new-delhi/" },
//   { label: "Noida", href: "/experience-center/" },
//   { label: "Noida Extension", href: "/experience-center-noida-extension/" },
//   { label: "Gurgaon", href: "/experience-center-gurugram/" },
//   { label: "Faridabad", href: "/experience-center-faridabad/" },
// ];

// const PROPERTY_TYPES = ["1 BHK", "2 BHK", "3 BHK", "4 BHK or larger", "Villa / builder floor"];

// /* -------------------------------------------------------------------------- */
// /*  Helpers                                                                    */
// /* -------------------------------------------------------------------------- */

// const Html = memo(function Html({ html, className = "" }) {
//   const clean = useMemo(() => DOMPurify.sanitize(html || ""), [html]);
//   return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
// });

// const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// const OPTIMIZED_HOSTS = ["hcinterior.in", "www.hcinterior.in", "apidev.hcinterior.in", "localhost"];

// function canOptimize(src) {
//   if (!src || src.startsWith("//")) return false;
//   if (src.startsWith("/")) return true;
//   try {
//     return OPTIMIZED_HOSTS.includes(new URL(src).hostname);
//   } catch {
//     return false;
//   }
// }

// function HeroImage({ src }) {
//   if (!src) return null;
//   if (canOptimize(src)) {
//     return <Image src={src} alt="" fill priority sizes="100vw" quality={75} className="hcx-hero-img" />;
//   }
//   // eslint-disable-next-line @next/next/no-img-element
//   return <img src={src} alt="" fetchPriority="high" loading="eager" decoding="async" className="hcx-hero-img" />;
// }

// const Arrow = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
//     <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const Tick = () => (
//   <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
//     <circle cx="9" cy="9" r="9" fill="#ff8b49" />
//     <path d="M5 9.3l2.6 2.6L13 6.6" stroke="#18201c" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// /* -------------------------------------------------------------------------- */
// /*  Lead form (same API + tracking as before)                                  */
// /* -------------------------------------------------------------------------- */

// const EMPTY_FORM = {
//   fullName: "",
//   contact: "",
//   email: "",
//   place: "",
//   property: "",
//   termsAndConditions: false,
// };

// const CTA_TEXT = "Book free consultation";

// function LeadForm() {
//   const pathname = usePathname();
//   const [formData, setFormData] = useState(EMPTY_FORM);
//   const [submitting, setSubmitting] = useState(false);

//   const onChange = (event) => {
//     const { name, value, type, checked } = event.target;
//     setFormData((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
//   };

//   const onSubmit = async (event) => {
//     event.preventDefault();
//     if (submitting) return;
//     if (!formData.termsAndConditions) {
//       toast.error("Please agree to the privacy policy and terms before submitting.");
//       return;
//     }

//     setSubmitting(true);
//     const requestData = {
//       name: formData.fullName.trim(),
//       mobile: formData.contact.trim(),
//       email: formData.email.trim(),
//       place: formData.place.trim(),
//       query: formData.property ? `Property type: ${formData.property}` : "",
//       ...buildLeadMetadata({
//         pathname,
//         leadFormType: "inline",
//         leadFormName: "Creating The Home Of Your Dreams Lead Form",
//         ctaText: CTA_TEXT.toUpperCase(),
//       }),
//     };

//     try {
//       const response = await api.post("/user-queries", requestData);
//       if (response.status === 201) {
//         setFormData(EMPTY_FORM);
//         toast.success("Thank you. Our team will be in touch soon.");
//         window.setTimeout(() => {
//           window.location.href = "/thank-you";
//         }, 300);
//       } else {
//         toast.error("We could not submit your details. Please try again.");
//       }
//     } catch (error) {
//       toast.error(error?.message || "Something went wrong. Please try again.");
//       console.error("HCI landing enquiry submission failed:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="hcx-form-card" id="hcx-enquiry-form">
//       <h2>Get a free design consultation</h2>
//       <p className="hcx-form-intro">Share a few details and a designer will call you to plan the next step.</p>
//       <form onSubmit={onSubmit} className="hcx-form">
//         <label className="hcx-field">
//           <span>Your name</span>
//           <input
//             type="text"
//             name="fullName"
//             autoComplete="name"
//             placeholder="Full name"
//             value={formData.fullName}
//             onChange={onChange}
//             minLength={2}
//             maxLength={80}
//             required
//           />
//         </label>
//         <label className="hcx-field">
//           <span>Mobile number</span>
//           <input
//             type="tel"
//             name="contact"
//             autoComplete="tel"
//             inputMode="tel"
//             placeholder="10-digit mobile number"
//             value={formData.contact}
//             onChange={onChange}
//             maxLength={15}
//             required
//           />
//         </label>
//         <label className="hcx-field">
//           <span>Email address</span>
//           <input
//             type="email"
//             name="email"
//             autoComplete="email"
//             placeholder="you@example.com"
//             value={formData.email}
//             onChange={onChange}
//             required
//           />
//         </label>
//         <div className="hcx-form-row">
//           <label className="hcx-field">
//             <span>City <em>(optional)</em></span>
//             <input
//               type="text"
//               name="place"
//               autoComplete="address-level2"
//               placeholder="Noida, Gurugram…"
//               value={formData.place}
//               onChange={onChange}
//               maxLength={100}
//             />
//           </label>
//           <label className="hcx-field">
//             <span>Property <em>(optional)</em></span>
//             <select name="property" value={formData.property} onChange={onChange}>
//               <option value="">Select</option>
//               {PROPERTY_TYPES.map((type) => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//           </label>
//         </div>
//         <label className="hcx-consent">
//           <input
//             type="checkbox"
//             name="termsAndConditions"
//             checked={formData.termsAndConditions}
//             onChange={onChange}
//             required
//           />
//           <span>
//             I agree to the <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a> and terms.
//           </span>
//         </label>
//         <button className="hcx-btn hcx-btn-primary hcx-form-submit" type="submit" disabled={submitting}>
//           {submitting ? "Sending…" : CTA_TEXT}
//         </button>
//       </form>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  Page                                                                       */
// /* -------------------------------------------------------------------------- */

// async function fetchSection(endpoint, setter) {
//   try {
//     const response = await api.get(endpoint, {});
//     if (response?.data?.json_content) setter(response.data.json_content);
//   } catch (error) {
//     console.error(`HCI landing CMS request failed (${endpoint}):`, error);
//   }
// }

// export default function HCLandingPage({ initialData }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [data1, setData1] = useState(initialData?.data1 ?? null);
//   const [data4, setData4] = useState(initialData?.data4 ?? null);
//   const [data6, setData6] = useState(initialData?.data6 ?? null);
//   const [faqData, setFaqData] = useState(initialData?.faqs ?? []);
//   const [faqLoading, setFaqLoading] = useState(initialData?.faqs == null);
//   const [faqError, setFaqError] = useState("");
//   const [designIdea, setDesignIdea] = useState(initialData?.designIdea ?? []);
//   const [designLoading, setDesignLoading] = useState(initialData?.designIdea == null);
//   const [showVideo, setShowVideo] = useState(false);

//   // Same fallbacks as before: anything the server could not fetch is fetched here.
//   useEffect(() => {
//     const init = initialData || {};
//     if (!init.data1) fetchSection("/cms-content/creating_the_home_of_your_dreams", setData1);
//     if (!init.data4) fetchSection("/cms-content/creating_the_home_of_your_dreams_4", setData4);
//     if (!init.data6) fetchSection("/cms-content/creating_the_home_of_your_dreams_6", setData6);

//     if (init.faqs == null) {
//       api.get("/cms-content/faqs")
//         .then((response) => setFaqData(Array.isArray(response?.data) ? response.data : []))
//         .catch(() => setFaqError("FAQs could not be loaded right now."))
//         .finally(() => setFaqLoading(false));
//     }
//     if (init.designIdea == null) {
//       api.get("/cms-parent-child/designer_choice")
//         .then((response) => setDesignIdea(Array.isArray(response?.data) ? response.data : []))
//         .catch((error) => console.error("HCI designer-choice content failed to load:", error))
//         .finally(() => setDesignLoading(false));
//     }
//   }, [initialData]);

//   // Hero video only for people who can afford it: desktop, no reduced-motion, no data saver.
//   useEffect(() => {
//     const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
//     const narrow = window.matchMedia?.("(max-width: 700px)")?.matches;
//     const saveData = navigator.connection?.saveData;
//     setShowVideo(!reduce && !narrow && !saveData);
//   }, []);

//   const projects = useMemo(
//     () => [...designIdea].sort((a, b) => Number(b.id) - Number(a.id)).slice(-5),
//     [designIdea]
//   );
//   const faqs = useMemo(
//     () =>
//       faqData
//         .map((faq) => faq?.json_content || faq || {})
//         .map((item, index) => ({ ...item, key: faqData[index]?.id || `${item.title}-${index}` }))
//         .filter((item) => item.title || item.description),
//     [faqData]
//   );
//   const handleModalStateChange = useCallback((open) => setIsModalOpen(open), []);

//   const heroImage = data1?.mid_image;
//   const heroTitle = data1?.mid_sub_title || "Interiors designed and built around your home.";
//   const heroDesc =
//     data1?.top_description ||
//     "Customized home interiors across Delhi NCR, planned with you and made in our own production facility.";

//   return (
//     <div className={`hcx ${isModalOpen ? "hcx-modal-open" : ""}`}>
//       <style jsx global>{`
//         .hcx {
//           --ink: #18201c;
//           --forest: #123b30;
//           --forest-soft: #1c4e41;
//           --stone: #eef1ee;
//           --muted: #5b655f;
//           --line: #d5dcd7;
//           --orange: #ff8b49;
//           --orange-hover: #f27a35;
//           color: var(--ink);
//           background: #fff;
//           font-family: var(--font-poppins), system-ui, Arial, sans-serif;
//           font-size: 16px;
//           line-height: 1.6;
//           overflow: clip;
//           padding-bottom: 0;
//         }
//         .hcx *, .hcx *::before, .hcx *::after { box-sizing: border-box; }
//         .hcx img { max-width: 100%; display: block; }
//         .hcx a { color: inherit; }
//         .hcx h1, .hcx h2, .hcx h3, .hcx p { margin: 0; }
//         .hcx-wrap { width: min(1240px, calc(100% - 48px)); margin-inline: auto; }
//         .hcx-section { padding-block: clamp(56px, 8vw, 104px); }
//         .hcx-h2 { font-size: clamp(28px, 3.6vw, 44px); line-height: 1.12; font-weight: 600; letter-spacing: -0.02em; max-width: 20ch; }
//         .hcx-lead { margin-top: 14px; max-width: 56ch; color: var(--muted); font-size: 17px; }

//         /* Buttons */
//         .hcx-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 50px; padding: 0 26px; border: 2px solid transparent; border-radius: 6px; font: 600 16px/1 var(--font-poppins), system-ui, sans-serif; text-decoration: none; cursor: pointer; transition: background-color .18s ease, border-color .18s ease, color .18s ease; }
//         .hcx-btn-primary { background: var(--orange); border-color: var(--orange); color: var(--ink) !important; }
//         .hcx-btn-primary:hover { background: var(--orange-hover); border-color: var(--orange-hover); }
//         .hcx-btn-ghost { background: transparent; border-color: currentColor; }
//         .hcx-btn-ghost:hover { background: rgba(255,255,255,.12); }
//         .hcx-btn:disabled { opacity: .7; cursor: progress; }
//         .hcx a:focus-visible, .hcx button:focus-visible, .hcx input:focus-visible, .hcx select:focus-visible, .hcx summary:focus-visible { outline: 3px solid var(--orange); outline-offset: 3px; }

//         /* Hero */
//         .hcx-hero { position: relative; isolation: isolate; background: var(--forest); color: #fff; }
//         .hcx-hero-media { position: absolute; inset: 0; z-index: -1; overflow: hidden; }
//         .hcx-hero-media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(10,28,22,.86) 0%, rgba(10,28,22,.62) 48%, rgba(10,28,22,.35) 100%); }
//         .hcx-hero-img, .hcx-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
//         .hcx-hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(340px, 420px); gap: clamp(32px, 6vw, 96px); align-items: center; padding-block: clamp(48px, 7vw, 88px); min-height: min(720px, calc(100svh - 80px)); }
//         .hcx-hero h1 { font-size: clamp(36px, 5.4vw, 68px); line-height: 1.05; font-weight: 600; letter-spacing: -0.03em; max-width: 14ch; text-wrap: balance; }
//         .hcx-hero-desc { margin-top: 20px; max-width: 50ch; font-size: 18px; color: rgba(255,255,255,.9); }
//         .hcx-hero-desc, .hcx-hero-desc * { color: rgba(255,255,255,.9) !important; }
//         .hcx-hero-desc p { margin: 0; }
//         .hcx-points { list-style: none; display: grid; gap: 10px; margin: 28px 0 0; padding: 0; }
//         .hcx-points li { display: flex; align-items: center; gap: 12px; font-weight: 500; }
//         .hcx-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
//         .hcx-hero-actions .hcx-btn-ghost { color: #fff; }

//         /* Form */
//         .hcx-form-card { background: #fff; color: var(--ink); border-radius: 10px; padding: clamp(22px, 3vw, 32px); box-shadow: 0 24px 60px rgba(5,20,15,.35); scroll-margin-top: 24px; }
//         .hcx-form-card h2 { font-size: 24px; line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; }
//         .hcx-form-intro { margin: 8px 0 20px; color: var(--muted); font-size: 14px; line-height: 1.55; }
//         .hcx-form { display: grid; gap: 14px; }
//         .hcx-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//         .hcx-field { display: grid; gap: 6px; min-width: 0; }
//         .hcx-field > span { font-size: 13px; font-weight: 600; }
//         .hcx-field em { font-style: normal; font-weight: 400; color: var(--muted); }
//         .hcx-field input, .hcx-field select { width: 100%; min-height: 46px; padding: 0 14px; border: 1px solid #b8c2bc; border-radius: 6px; background: #fff; color: var(--ink); font: 400 15px var(--font-poppins), system-ui, sans-serif; }
//         .hcx-field input::placeholder { color: #7d8781; }
//         .hcx-consent { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: var(--muted); line-height: 1.5; }
//         .hcx-consent input { width: 18px; height: 18px; margin-top: 2px; accent-color: var(--forest); flex: 0 0 auto; }
//         .hcx-consent a { color: var(--forest); text-decoration: underline; }
//         .hcx-form-submit { width: 100%; }

//         /* Stats */
//         .hcx-stats { background: var(--forest); color: #fff; border-top: 1px solid rgba(255,255,255,.14); }
//         .hcx-stats-grid { list-style: none; margin: 0 auto; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); }
//         .hcx-stats-grid li { padding: 28px 24px; border-left: 1px solid rgba(255,255,255,.16); }
//         .hcx-stats-grid li:first-child { border-left: 0; padding-left: 0; }
//         .hcx-stat-value { display: block; font-size: clamp(30px, 3.6vw, 44px); font-weight: 600; line-height: 1.1; letter-spacing: -0.02em; }
//         .hcx-stat-label { display: block; margin-top: 4px; font-size: 14px; color: rgba(255,255,255,.78); }

//         /* Offers */
//         .hcx-offers-head { display: flex; justify-content: space-between; align-items: end; gap: 32px; flex-wrap: wrap; }
//         .hcx-offers { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 48px; border-top: 1px solid var(--line); }
//         .hcx-offer { padding: 32px 28px 8px 0; }
//         .hcx-offer + .hcx-offer { padding-left: 28px; border-left: 1px solid var(--line); }
//         .hcx-offer-icon { width: 56px; height: 56px; object-fit: contain; margin-bottom: 20px; }
//         .hcx-offer h3 { font-size: 20px; line-height: 1.25; font-weight: 600; }
//         .hcx-offer p { margin-top: 10px; color: var(--muted); font-size: 15px; }
//         .hcx-link { display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; font-weight: 600; font-size: 15px; color: var(--forest); text-decoration: none; border-bottom: 2px solid var(--orange); padding-bottom: 2px; }
//         .hcx-link:hover { color: #000; }

//         /* Why us */
//         .hcx-why { background: var(--forest); color: #fff; }
//         .hcx-why-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: clamp(32px, 6vw, 88px); align-items: center; }
//         .hcx-why-media { border-radius: 10px; overflow: hidden; background: var(--forest-soft); }
//         .hcx-why-media img { width: 100%; height: auto; }
//         .hcx-why .hcx-h2 { max-width: 18ch; }
//         .hcx-why-list { list-style: none; margin: 36px 0 0; padding: 0; display: grid; gap: 0; }
//         .hcx-why-list li { padding: 22px 0; border-top: 1px solid rgba(255,255,255,.2); }
//         .hcx-why-list h3 { font-size: 19px; font-weight: 600; }
//         .hcx-why-list p { margin-top: 6px; color: rgba(255,255,255,.82); font-size: 15px; max-width: 52ch; }

//         /* Process */
//         .hcx-process { background: var(--stone); }
//         .hcx-steps { list-style: none; margin: 52px 0 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); }
//         .hcx-step { position: relative; padding: 28px 24px 0 0; border-top: 2px solid #b8c2bc; }
//         .hcx-step::before { content: ""; position: absolute; top: -7px; left: 0; width: 12px; height: 12px; border-radius: 50%; background: var(--orange); }
//         .hcx-step-no { font-size: 14px; font-weight: 600; color: var(--forest); }
//         .hcx-step img { width: 48px; height: 48px; object-fit: contain; margin: 14px 0; }
//         .hcx-step h3 { font-size: 18px; line-height: 1.3; font-weight: 600; }
//         .hcx-step p { margin-top: 8px; font-size: 15px; color: var(--muted); }
//         .hcx-process-cta { margin-top: 44px; }

//         /* Projects */
//         .hcx-projects-head { display: flex; justify-content: space-between; align-items: end; gap: 28px; flex-wrap: wrap; }
//         .hcx-project-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 28px 24px; margin-top: 44px; }
//         .hcx-project { grid-column: span 2; text-decoration: none; display: block; }
//         .hcx-project:nth-child(-n+2) { grid-column: span 3; }
//         .hcx-project-img { aspect-ratio: 4 / 3; border-radius: 8px; overflow: hidden; background: var(--stone); }
//         .hcx-project:nth-child(-n+2) .hcx-project-img { aspect-ratio: 16 / 10; }
//         .hcx-project-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
//         .hcx-project:hover .hcx-project-img img { transform: scale(1.04); }
//         .hcx-project h3 { margin-top: 14px; font-size: 19px; font-weight: 600; line-height: 1.3; }
//         .hcx-project p { margin-top: 4px; color: var(--muted); font-size: 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
//         .hcx-projects-foot { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 44px; }
//         .hcx-btn-outline { border-color: var(--forest); color: var(--forest); background: transparent; }
//         .hcx-btn-outline:hover { background: var(--forest); color: #fff; }

//         /* Areas */
//         .hcx-areas { background: var(--stone); }
//         .hcx-areas-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: clamp(32px, 6vw, 88px); }
//         .hcx-areas h3 { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
//         .hcx-chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
//         .hcx-chips a { display: inline-block; padding: 9px 18px; border: 1px solid #aab5ae; border-radius: 999px; background: #fff; text-decoration: none; font-size: 15px; font-weight: 500; transition: background-color .15s ease, color .15s ease, border-color .15s ease; }
//         .hcx-chips a:hover { background: var(--forest); color: #fff; border-color: var(--forest); }
//         .hcx-areas-col + .hcx-areas-col { margin-top: 0; }

//         /* FAQ */
//         .hcx-faq-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 88px); align-items: start; }
//         .hcx-faq-intro { position: sticky; top: 32px; }
//         .hcx-faq-item { border-top: 1px solid var(--line); }
//         .hcx-faq-item:last-child { border-bottom: 1px solid var(--line); }
//         .hcx-faq-item summary { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px 0; font-size: 18px; font-weight: 600; line-height: 1.35; cursor: pointer; list-style: none; }
//         .hcx-faq-item summary::-webkit-details-marker { display: none; }
//         .hcx-faq-item summary::after { content: "+"; flex: 0 0 auto; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: var(--stone); font-size: 22px; font-weight: 400; line-height: 1; }
//         .hcx-faq-item[open] summary::after { content: "–"; background: var(--orange); }
//         .hcx-faq-answer { padding: 0 52px 24px 0; color: var(--muted); font-size: 16px; }
//         .hcx-faq-answer p { margin: 0 0 10px; }
//         .hcx-faq-answer, .hcx-faq-answer * { color: var(--muted) !important; }

//         /* Final CTA */
//         .hcx-final { background: var(--ink); color: #fff; }
//         .hcx-final-inner { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 40px; align-items: center; }
//         .hcx-final h2 { font-size: clamp(30px, 4.4vw, 54px); line-height: 1.08; font-weight: 600; letter-spacing: -0.025em; max-width: 16ch; }
//         .hcx-final-desc { margin-top: 16px; max-width: 48ch; color: rgba(255,255,255,.8); }
//         .hcx-final-desc, .hcx-final-desc * { color: rgba(255,255,255,.8) !important; }
//         .hcx-final-desc p { margin: 0; }
//         .hcx-final-actions { display: grid; gap: 12px; justify-items: stretch; }
//         .hcx-final-actions .hcx-btn-ghost { color: #fff; }

//         /* Mobile bar */
//         .hcx-mobile-bar { display: none; }
//         .hcx-modal-open { filter: none; }

//         @media (max-width: 1100px) {
//           .hcx-offers { grid-template-columns: repeat(2, 1fr); }
//           .hcx-offer:nth-child(3) { padding-left: 0; border-left: 0; }
//           .hcx-offer:nth-child(n+3) { border-top: 1px solid var(--line); margin-top: 24px; }
//           .hcx-steps { grid-template-columns: repeat(3, 1fr); row-gap: 40px; }
//         }
//         @media (max-width: 900px) {
//           .hcx-hero-grid { grid-template-columns: 1fr; min-height: 0; }
//           .hcx-hero h1 { max-width: 18ch; }
//           .hcx-form-card { max-width: 560px; }
//           .hcx-stats-grid { grid-template-columns: repeat(2, 1fr); }
//           .hcx-stats-grid li:nth-child(odd) { border-left: 0; padding-left: 0; }
//           .hcx-stats-grid li:nth-child(n+3) { border-top: 1px solid rgba(255,255,255,.16); }
//           .hcx-why-grid, .hcx-areas-grid, .hcx-faq-grid, .hcx-final-inner { grid-template-columns: 1fr; }
//           .hcx-faq-intro { position: static; }
//           .hcx-project-grid { grid-template-columns: repeat(2, 1fr); }
//           .hcx-project, .hcx-project:nth-child(-n+2) { grid-column: span 1; }
//           .hcx-project:nth-child(-n+2) .hcx-project-img { aspect-ratio: 4 / 3; }
//           .hcx-project:first-child { grid-column: 1 / -1; }
//         }
//         @media (max-width: 700px) {
//           .hcx { padding-bottom: 72px; }
//           .hcx-wrap { width: calc(100% - 32px); }
//           .hcx-hero-media::after { background: linear-gradient(180deg, rgba(10,28,22,.82), rgba(10,28,22,.72)); }
//           .hcx-hero-desc { font-size: 16px; }
//           .hcx-hero-actions .hcx-btn { width: 100%; }
//           .hcx-form-row { grid-template-columns: 1fr; }
//           .hcx-offers { grid-template-columns: 1fr; }
//           .hcx-offer, .hcx-offer + .hcx-offer { padding: 28px 0 4px; border-left: 0; margin-top: 0; }
//           .hcx-offer + .hcx-offer { border-top: 1px solid var(--line); }
//           .hcx-steps { grid-template-columns: 1fr; margin-top: 36px; row-gap: 0; border-left: 2px solid #b8c2bc; }
//           .hcx-step { padding: 0 0 32px 28px; border-top: 0; }
//           .hcx-step::before { top: 4px; left: -7px; }
//           .hcx-project-grid { grid-template-columns: 1fr; }
//           .hcx-project:first-child { grid-column: auto; }
//           .hcx-faq-item summary { font-size: 16px; }
//           .hcx-faq-answer { padding-right: 0; }
//           .hcx-projects-foot .hcx-btn, .hcx-final-actions .hcx-btn { width: 100%; }
//           .hcx-mobile-bar { position: fixed; z-index: 90; left: 0; right: 0; bottom: 0; display: grid; grid-template-columns: 1fr 1.6fr; gap: 10px; padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 0px)); background: #fff; box-shadow: 0 -6px 24px rgba(0,0,0,.14); }
//           .hcx-mobile-bar .hcx-btn { min-height: 48px; padding: 0 12px; font-size: 15px; }
//           .hcx-mobile-bar .hcx-btn-outline { border-color: var(--forest); }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .hcx *, .hcx *::before, .hcx *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; scroll-behavior: auto !important; }
//         }
//       `}</style>

//       {/* Hero */}
//       <section className="hcx-hero" aria-labelledby="hcx-hero-title">
//         <div className="hcx-hero-media" aria-hidden="true">
//           <HeroImage src={heroImage} />
//           {showVideo ? (
//             <video
//               className="hcx-hero-video"
//               src={HERO_VIDEO}
//               autoPlay
//               muted
//               loop
//               playsInline
//               preload="metadata"
//             />
//           ) : null}
//         </div>
//         <div className="hcx-wrap hcx-hero-grid">
//           <div>
//             <h1 id="hcx-hero-title">{heroTitle}</h1>
//             <Html className="hcx-hero-desc" html={heroDesc} />
//             <ul className="hcx-points">
//               {HERO_POINTS.map((point) => (
//                 <li key={point}><Tick /> {point}</li>
//               ))}
//             </ul>
//             <div className="hcx-hero-actions">
//               <a className="hcx-btn hcx-btn-primary" href="/estimator-for-home">Get a free estimate</a>
//               <a className="hcx-btn hcx-btn-ghost" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//             </div>
//           </div>
//           <LeadForm />
//         </div>
//       </section>

//       {/* Trust numbers */}
//       <section className="hcx-stats" aria-label="High Creation Interior at a glance">
//         <div className="hcx-wrap">
//           <ul className="hcx-stats-grid">
//             {STATS.map((stat) => (
//               <li key={stat.label}>
//                 <span className="hcx-stat-value">{stat.value}</span>
//                 <span className="hcx-stat-label">{stat.label}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>

//       {/* What we offer */}
//       <section className="hcx-section" aria-labelledby="hcx-offer-title">
//         <div className="hcx-wrap">
//           <div className="hcx-offers-head">
//             <div>
//               <h2 id="hcx-offer-title" className="hcx-h2">Everything your home needs, from one team</h2>
//               <p className="hcx-lead">From the first sketch to the last piece of decor, we design and deliver every part of your interior.</p>
//             </div>
//             <a className="hcx-link" href="/what-we-offer">See all services <Arrow /></a>
//           </div>
//           <div className="hcx-offers">
//             {OFFERS.map((offer) => (
//               <article className="hcx-offer" key={offer.title}>
//                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                 <img className="hcx-offer-icon" src={offer.icon} alt="" loading="lazy" decoding="async" width="56" height="56" />
//                 <h3>{offer.title}</h3>
//                 <p>{offer.text}</p>
//                 <a className="hcx-link" href={offer.href}>Know more <Arrow /></a>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Why High Creation Interior */}
//       <section className="hcx-section hcx-why" aria-labelledby="hcx-why-title">
//         <div className="hcx-wrap hcx-why-grid">
//           <div className="hcx-why-media">
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img src="/images/about/Whatmakes.png" alt="What makes High Creation Interior different" loading="lazy" decoding="async" width="640" height="560" />
//           </div>
//           <div>
//             <h2 id="hcx-why-title" className="hcx-h2">Your space designed around you, not around a fixed design</h2>
//             <ul className="hcx-why-list">
//               {WHY_POINTS.map((point) => (
//                 <li key={point.title}>
//                   <h3>{point.title}</h3>
//                   <p>{point.text}</p>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </section>

//       {/* Process */}
//       <section className="hcx-section hcx-process" aria-labelledby="hcx-process-title">
//         <div className="hcx-wrap">
//           <h2 id="hcx-process-title" className="hcx-h2">Our step-by-step interior design process</h2>
//           <p className="hcx-lead">Five clear steps from the first conversation to the day we hand over your home.</p>
//           <ol className="hcx-steps">
//             {STEPS.map((step, index) => (
//               <li className="hcx-step" key={step.title}>
//                 <span className="hcx-step-no">Step {index + 1}</span>
//                 {/* eslint-disable-next-line @next/next/no-img-element */}
//                 <img src={step.icon} alt="" loading="lazy" decoding="async" width="48" height="48" />
//                 <h3>{step.title}</h3>
//                 <p>{step.text}</p>
//               </li>
//             ))}
//           </ol>
//           <div className="hcx-process-cta">
//             <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Start with a free consultation</a>
//           </div>
//         </div>
//       </section>

//       {/* Projects / design ideas (CMS: designer_choice) */}
//       {designLoading || projects.length > 0 ? (
//         <section className="hcx-section" id="hcx-projects" aria-labelledby="hcx-projects-title" style={designLoading ? { minHeight: 480 } : undefined}>
//           <div className="hcx-wrap">
//             <div className="hcx-projects-head">
//               <div>
//                 <h2 id="hcx-projects-title" className="hcx-h2">{data4?.top_title || "Design ideas to start from"}</h2>
//                 <p className="hcx-lead">
//                   {data4?.top_description ? stripHtml(data4.top_description) : "A few of our favourite interiors. Open one to see the details, then tell us what feels right for your home."}
//                 </p>
//               </div>
//             </div>
//             <div className="hcx-project-grid">
//               {projects.map((record) => {
//                 const item = record?.child_content || {};
//                 return (
//                   <a className="hcx-project" key={record.id} href={`/designer-choice/gallery?id=${record.id}`}>
//                     <div className="hcx-project-img">
//                       {item.image ? (
//                         // eslint-disable-next-line @next/next/no-img-element
//                         <img src={item.image} alt={item.image_alt || item.title || "Interior designed by High Creation Interior"} loading="lazy" decoding="async" />
//                       ) : null}
//                     </div>
//                     <h3>{item.title}</h3>
//                     {item.description ? <p>{stripHtml(item.description)}</p> : null}
//                   </a>
//                 );
//               })}
//             </div>
//             <div className="hcx-projects-foot">
//               <a className="hcx-btn hcx-btn-outline" href="/designer-choice">View all design ideas</a>
//               <a className="hcx-btn hcx-btn-outline" href="/residential-projects">Residential projects</a>
//             </div>
//           </div>
//         </section>
//       ) : null}

//       {/* Where we work */}
//       <section className="hcx-section hcx-areas" aria-labelledby="hcx-areas-title">
//         <div className="hcx-wrap">
//           <h2 id="hcx-areas-title" className="hcx-h2">Interior designers across Delhi NCR</h2>
//           <p className="hcx-lead">Five branches and experience centers across NCR. Visit one to see materials and finishes in person.</p>
//           <div className="hcx-areas-grid" style={{ marginTop: 40 }}>
//             <div className="hcx-areas-col">
//               <h3>Areas we serve</h3>
//               <ul className="hcx-chips">
//                 {AREAS.map((area) => (
//                   <li key={area.label}><a href={area.href}>{area.label}</a></li>
//                 ))}
//               </ul>
//             </div>
//             <div className="hcx-areas-col">
//               <h3>Experience centers</h3>
//               <ul className="hcx-chips">
//                 {CENTERS.map((center) => (
//                   <li key={center.label}><a href={center.href}>{center.label}</a></li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FAQ (CMS: faqs) */}
//       {faqLoading || faqError || faqs.length > 0 ? (
//         <section className="hcx-section" aria-labelledby="hcx-faq-title">
//           <div className="hcx-wrap hcx-faq-grid">
//             <div className="hcx-faq-intro">
//               <h2 id="hcx-faq-title" className="hcx-h2">Questions before you begin</h2>
//               <p className="hcx-lead">Clear answers to the things people ask us most. Still unsure? Call us and we will walk you through it.</p>
//               <a className="hcx-link" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//             </div>
//             <div>
//               {faqLoading ? <p className="hcx-lead">Loading FAQs…</p> : null}
//               {faqError ? <p className="hcx-lead">{faqError}</p> : null}
//               {!faqLoading && !faqError && faqs.map((faq, index) => (
//                 <details className="hcx-faq-item" key={faq.key} open={index === 0}>
//                   <summary>{faq.title || "Frequently asked question"}</summary>
//                   <Html className="hcx-faq-answer" html={faq.description || ""} />
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>
//       ) : null}

//       {/* Final CTA */}
//       <section className="hcx-section hcx-final" aria-labelledby="hcx-final-title">
//         <div className="hcx-wrap hcx-final-inner">
//           <div>
//             <h2 id="hcx-final-title">{data6?.top_title || "Let’s plan the home you want to come back to."}</h2>
//             <Html
//               className="hcx-final-desc"
//               html={data6?.top_description || "Tell us about your space. A High Creation Interior designer will help you plan a practical, personal next step."}
//             />
//           </div>
//           <div className="hcx-final-actions">
//             <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Book free consultation</a>
//             <a className="hcx-btn hcx-btn-ghost" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//             <a className="hcx-btn hcx-btn-ghost" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
//           </div>
//         </div>
//       </section>

//       {/* Mobile sticky actions */}
//       <div className="hcx-mobile-bar">
//         <a className="hcx-btn hcx-btn-outline" href={PHONE_TEL}>Call us</a>
//         <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Book free consultation</a>
//       </div>

//       <ContactUsPopUp onModalStateChange={handleModalStateChange} />
//     </div>
//   );
// }



// "use client";

// import { memo, useCallback, useEffect, useMemo, useState } from "react";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import DOMPurify from "isomorphic-dompurify";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import api from "@/utils/api";
// import { buildLeadMetadata } from "@/utils/leadForms";
// import { leadSchema, normalizePhone } from "@/utils/leadValidation";

// // Lazy-loaded: triggered later by scroll/time/exit intent, must not delay first paint.
// const ContactUsPopUp = dynamic(() => import("../components/ContactUsPopUp"), {
//   ssr: false,
// });

// /* -------------------------------------------------------------------------- */
// /*  Static content, taken from https://www.hcinterior.in/                     */
// /* -------------------------------------------------------------------------- */

// const CMS_IMG = "https://apidev.hcinterior.in/uploads/cms-content/";
// const HERO_VIDEO = `${CMS_IMG}banner_image-1791979629832-642156515.mp4`;

// const PHONE_TEL = "tel:+917070701373";
// const PHONE_LABEL = "+91 70707 01373";
// const WHATSAPP = "https://wa.me/919560277787";

// const HERO_POINTS = [
//   "Free design consultation",
//   "Complete customization",
//   "In-house production",
// ];

// const STATS = [
//   { value: "8+", label: "years of experience" },
//   { value: "2,750+", label: "projects completed" },
//   { value: "450+", label: "people on our team" },
//   { value: "5", label: "branches across NCR" },
// ];

// const WHY_POINTS = [
//   {
//     title: "Complete customization",
//     text: "Every project is designed around your vision, your space and your lifestyle, not a fixed catalogue.",
//   },
//   {
//     title: "In-house production",
//     text: "We make furniture, fixtures and design elements in our own facility, so quality, cost and timelines stay in our hands.",
//   },
//   {
//     title: "One team, one roof",
//     text: "Design and production are managed together, which means fewer third-party vendors and a smoother process.",
//   },
// ];

// const AREAS = [
//   { label: "Noida", href: "/interior-designers-in-noida" },
//   { label: "Greater Noida", href: "/interior-designers-in-greater-noida" },
//   { label: "Noida Extension", href: "/interior-designer-in-noida-extension" },
//   { label: "Ghaziabad", href: "/interior-designers-in-ghaziabad" },
//   { label: "Delhi", href: "/interior-designers-in-delhi" },
//   { label: "Dwarka", href: "/interior-designers-in-dwarka" },
//   { label: "Gurugram", href: "/interior-designers-in-gurgaon" },
//   { label: "Faridabad", href: "/interior-designers-in-faridabad" },
//   { label: "Manesar", href: "/interior-designers-in-manesar" },
//   { label: "Sohna", href: "/interior-designer-in-sohna-gurgaon" },
// ];

// const CENTERS = [
//   { label: "New Delhi", href: "/experience-center-new-delhi/" },
//   { label: "Noida", href: "/experience-center/" },
//   { label: "Noida Extension", href: "/experience-center-noida-extension/" },
//   { label: "Gurgaon", href: "/experience-center-gurugram/" },
//   { label: "Faridabad", href: "/experience-center-faridabad/" },
// ];

// const PROPERTY_TYPES = ["1 BHK", "2 BHK", "3 BHK", "4 BHK or larger", "Villa / builder floor"];

// // Same CMS parent-child type that powers /ready-togo-design.
// // Verify this name against ready-togo-design/page.jsx (and keep it in sync with page.jsx).
// const READY_TO_GO_TYPE = "ready_to_go_design";

// // Shown only if the CMS returns nothing. Copy is from hcinterior.in/ready-togo-design.
// const READY_FALLBACK = [
//   { id: "living", title: "Living Room", text: "Design a living room that blends style and function, perfect for relaxation and gatherings.", href: "/ready-togo-design/gallery?id=5" },
//   { id: "kitchen", title: "Modular Kitchen", text: "Your kitchen deserves perfection. Let’s create the dream space where cooking and style come together.", href: "/ready-togo-design/gallery?id=6" },
//   { id: "master", title: "Master Bedroom", text: "Transform your master bedroom into a luxurious retreat where elegance and comfort create perfect tranquility.", href: "/ready-togo-design/gallery?id=3" },
//   { id: "kids", title: "Kids Room", text: "A playful, cozy and colorful design that sparks creativity and fun.", href: "/ready-togo-design/gallery?id=7" },
//   { id: "dining", title: "Dining", text: "Where every meal feels like a celebration. A stylish haven of comfort and elegance.", href: "/ready-togo-design/gallery?id=9" },
//   { id: "mandir", title: "Mandir", text: "A serene sanctuary where devotion and design come together beautifully.", href: "/ready-togo-design/gallery?id=4" },
//   { id: "parents", title: "Parents Room", text: "A haven of comfort and peace, designed with care.", href: "/ready-togo-design/gallery?id=1" },
//   { id: "entrance", title: "Entrance", text: "Make a lasting first impression with a welcoming, functional entryway.", href: "/ready-togo-design/gallery?id=8" },
// ];

// /* -------------------------------------------------------------------------- */
// /*  Helpers                                                                    */
// /* -------------------------------------------------------------------------- */

// const Html = memo(function Html({ html, className = "" }) {
//   const clean = useMemo(() => DOMPurify.sanitize(html || ""), [html]);
//   return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
// });

// const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// const cardContent = (record) => record?.child_content || record?.parent_content || {};

// const OPTIMIZED_HOSTS = ["hcinterior.in", "www.hcinterior.in", "apidev.hcinterior.in", "localhost"];

// function canOptimize(src) {
//   if (!src || src.startsWith("//")) return false;
//   if (src.startsWith("/")) return true;
//   try {
//     return OPTIMIZED_HOSTS.includes(new URL(src).hostname);
//   } catch {
//     return false;
//   }
// }

// function HeroImage({ src }) {
//   if (!src) return null;
//   if (canOptimize(src)) {
//     return <Image src={src} alt="" fill priority sizes="100vw" quality={75} className="hcx-hero-img" />;
//   }
//   // eslint-disable-next-line @next/next/no-img-element
//   return <img src={src} alt="" fetchPriority="high" loading="eager" decoding="async" className="hcx-hero-img" />;
// }

// const Arrow = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
//     <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const Tick = () => (
//   <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
//     <circle cx="9" cy="9" r="9" fill="#ff8b49" />
//     <path d="M5 9.3l2.6 2.6L13 6.6" stroke="#18201c" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// /* -------------------------------------------------------------------------- */
// /*  Lead form (react-hook-form + zod, same API + tracking as before)           */
// /* -------------------------------------------------------------------------- */

// const EMPTY_FORM = {
//   fullName: "",
//   contact: "",
//   email: "",
//   place: "",
//   property: "",
//   termsAndConditions: false,
//   website: "",
// };

// const CTA_TEXT = "Book free consultation";

// function LeadForm() {
//   const pathname = usePathname();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(leadSchema),
//     defaultValues: EMPTY_FORM,
//     mode: "onTouched", // validate when a field is left, then live while fixing it
//   });

//   const onSubmit = async (values) => {
//     if (values.website) return; // honeypot filled: bot, silently ignore

//     const requestData = {
//       name: values.fullName.trim().replace(/\s+/g, " "),
//       mobile: normalizePhone(values.contact), // always a clean 10-digit number
//       email: values.email.trim().toLowerCase(),
//       place: values.place.trim(),
//       query: values.property ? `Property type: ${values.property}` : "",
//       ...buildLeadMetadata({
//         pathname,
//         leadFormType: "inline",
//         leadFormName: "Creating The Home Of Your Dreams Lead Form",
//         ctaText: CTA_TEXT.toUpperCase(),
//       }),
//     };

//     try {
//       const response = await api.post("/user-queries", requestData);
//       if (response.status === 201) {
//         reset(EMPTY_FORM);
//         toast.success("Thank you. Our team will be in touch soon.");
//         window.setTimeout(() => {
//           window.location.href = "/thank-you";
//         }, 300);
//       } else {
//         toast.error("We could not submit your details. Please try again.");
//       }
//     } catch (error) {
//       toast.error(error?.message || "Something went wrong. Please try again.");
//       console.error("HCI landing enquiry submission failed:", error);
//     }
//   };

//   return (
//     <div className="hcx-form-card" id="hcx-enquiry-form">
//       <h2>Get a free design consultation</h2>
//       <p className="hcx-form-intro">Share a few details and a designer will call you to plan the next step.</p>
//       <form onSubmit={handleSubmit(onSubmit)} className="hcx-form" noValidate>
//         <label className="hcx-field">
//           <span>Your name</span>
//           <input
//             type="text"
//             autoComplete="name"
//             placeholder="Full name"
//             maxLength={60}
//             aria-invalid={errors.fullName ? "true" : "false"}
//             {...register("fullName")}
//           />
//           {errors.fullName ? <small className="hcx-err" role="alert">{errors.fullName.message}</small> : null}
//         </label>

//         <label className="hcx-field">
//           <span>Mobile number</span>
//           <input
//             type="tel"
//             autoComplete="tel"
//             inputMode="tel"
//             placeholder="10-digit mobile number"
//             maxLength={16}
//             aria-invalid={errors.contact ? "true" : "false"}
//             {...register("contact")}
//           />
//           {errors.contact ? <small className="hcx-err" role="alert">{errors.contact.message}</small> : null}
//         </label>

//         <label className="hcx-field">
//           <span>Email address</span>
//           <input
//             type="email"
//             autoComplete="email"
//             placeholder="you@example.com"
//             maxLength={100}
//             aria-invalid={errors.email ? "true" : "false"}
//             {...register("email")}
//           />
//           {errors.email ? <small className="hcx-err" role="alert">{errors.email.message}</small> : null}
//         </label>

//         <div className="hcx-form-row">
//           <label className="hcx-field">
//             <span>City <em>(optional)</em></span>
//             <input
//               type="text"
//               autoComplete="address-level2"
//               placeholder="Noida, Gurugram…"
//               maxLength={50}
//               aria-invalid={errors.place ? "true" : "false"}
//               {...register("place")}
//             />
//             {errors.place ? <small className="hcx-err" role="alert">{errors.place.message}</small> : null}
//           </label>
//           <label className="hcx-field">
//             <span>Property <em>(optional)</em></span>
//             <select {...register("property")}>
//               <option value="">Select</option>
//               {PROPERTY_TYPES.map((type) => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//           </label>
//         </div>

//         {/* Honeypot: hidden from people, bots tend to fill it */}
//         <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hcx-hp" {...register("website")} />

//         <div>
//           <label className="hcx-consent">
//             <input type="checkbox" aria-invalid={errors.termsAndConditions ? "true" : "false"} {...register("termsAndConditions")} />
//             <span>
//               I agree to the <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a> and terms.
//             </span>
//           </label>
//           {errors.termsAndConditions ? <small className="hcx-err" role="alert">{errors.termsAndConditions.message}</small> : null}
//         </div>

//         <button className="hcx-btn hcx-btn-primary hcx-form-submit" type="submit" disabled={isSubmitting}>
//           {isSubmitting ? "Sending…" : CTA_TEXT}
//         </button>
//       </form>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  Page                                                                       */
// /* -------------------------------------------------------------------------- */

// async function fetchSection(endpoint, setter) {
//   try {
//     const response = await api.get(endpoint, {});
//     if (response?.data?.json_content) setter(response.data.json_content);
//   } catch (error) {
//     console.error(`HCI landing CMS request failed (${endpoint}):`, error);
//   }
// }

// export default function HCLandingPage({ initialData }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [data1, setData1] = useState(initialData?.data1 ?? null);
//   const [data6, setData6] = useState(initialData?.data6 ?? null);
//   const [faqData, setFaqData] = useState(initialData?.faqs ?? []);
//   const [faqLoading, setFaqLoading] = useState(initialData?.faqs == null);
//   const [faqError, setFaqError] = useState("");
//   const [readyDesigns, setReadyDesigns] = useState(initialData?.readyDesigns ?? []);
//   const [showVideo, setShowVideo] = useState(false);

//   // Anything the server could not fetch is fetched here.
//   useEffect(() => {
//     const init = initialData || {};
//     if (!init.data1) fetchSection("/cms-content/creating_the_home_of_your_dreams", setData1);
//     if (!init.data6) fetchSection("/cms-content/creating_the_home_of_your_dreams_6", setData6);

//     if (init.faqs == null) {
//       api.get("/cms-content/faqs")
//         .then((response) => setFaqData(Array.isArray(response?.data) ? response.data : []))
//         .catch(() => setFaqError("FAQs could not be loaded right now."))
//         .finally(() => setFaqLoading(false));
//     }
//     if (init.readyDesigns == null) {
//       api.get(`/cms-parent-child/${READY_TO_GO_TYPE}`)
//         .then((response) => setReadyDesigns(Array.isArray(response?.data) ? response.data : []))
//         .catch((error) => console.error("HCI ready-to-go designs failed to load:", error));
//     }
//   }, [initialData]);

//   // Hero video only for people who can afford it: desktop, no reduced-motion, no data saver.
//   useEffect(() => {
//     const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
//     const narrow = window.matchMedia?.("(max-width: 700px)")?.matches;
//     const saveData = navigator.connection?.saveData;
//     setShowVideo(!reduce && !narrow && !saveData);
//   }, []);

//   const readyCards = useMemo(() => {
//     const fromCms = [...readyDesigns]
//       .sort((a, b) => Number(a.id) - Number(b.id))
//       .slice(0, 8)
//       .map((record) => {
//         const c = cardContent(record);
//         return {
//           id: record.id,
//           title: c.title,
//           text: stripHtml(c.description),
//           image: c.image,
//           alt: c.image_alt,
//           href: `/ready-togo-design/gallery?id=${record.id}`,
//         };
//       })
//       .filter((card) => card.title);
//     return fromCms.length ? fromCms : READY_FALLBACK;
//   }, [readyDesigns]);

//   const faqs = useMemo(
//     () =>
//       faqData
//         .map((faq) => faq?.json_content || faq || {})
//         .map((item, index) => ({ ...item, key: faqData[index]?.id || `${item.title}-${index}` }))
//         .filter((item) => item.title || item.description),
//     [faqData]
//   );
//   const handleModalStateChange = useCallback((open) => setIsModalOpen(open), []);

//   const heroImage = data1?.mid_image;
//   const heroTitle = data1?.mid_sub_title || "Interiors designed and built around your home.";
//   const heroDesc =
//     data1?.top_description ||
//     "Customized home interiors across Delhi NCR, planned with you and made in our own production facility.";

//   return (
//     <div className={`hcx ${isModalOpen ? "hcx-modal-open" : ""}`}>
//       <style jsx global>{`
//         .hcx {
//           --ink: #18201c;
//           --forest: #123b30;
//           --forest-soft: #1c4e41;
//           --stone: #eef1ee;
//           --muted: #5b655f;
//           --line: #d5dcd7;
//           --orange: #ff8b49;
//           --orange-hover: #f27a35;
//           color: var(--ink);
//           background: #fff;
//           font-family: var(--font-poppins), system-ui, Arial, sans-serif;
//           font-size: 16px;
//           line-height: 1.6;
//           overflow: clip;
//           padding-bottom: 0;
//         }
//         .hcx *, .hcx *::before, .hcx *::after { box-sizing: border-box; }
//         .hcx img { max-width: 100%; display: block; }
//         .hcx a { color: inherit; }
//         .hcx h1, .hcx h2, .hcx h3, .hcx p { margin: 0; }
//         .hcx-wrap { width: min(1240px, calc(100% - 48px)); margin-inline: auto; }
//         .hcx-section { padding-block: clamp(56px, 8vw, 104px); }
//         .hcx-h2 { font-size: clamp(28px, 3.6vw, 44px); line-height: 1.12; font-weight: 600; letter-spacing: -0.02em; max-width: 20ch; }
//         .hcx-lead { margin-top: 14px; max-width: 56ch; color: var(--muted); font-size: 17px; }

//         /* Buttons */
//         .hcx-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 50px; padding: 0 26px; border: 2px solid transparent; border-radius: 6px; font: 600 16px/1 var(--font-poppins), system-ui, sans-serif; text-decoration: none; cursor: pointer; transition: background-color .18s ease, border-color .18s ease, color .18s ease; }
//         .hcx-btn-primary { background: var(--orange); border-color: var(--orange); color: var(--ink) !important; }
//         .hcx-btn-primary:hover { background: var(--orange-hover); border-color: var(--orange-hover); }
//         .hcx-btn-ghost { background: transparent; border-color: currentColor; }
//         .hcx-btn-ghost:hover { background: rgba(255,255,255,.12); }
//         .hcx-btn-outline { border-color: var(--forest); color: var(--forest); background: transparent; }
//         .hcx-btn-outline:hover { background: var(--forest); color: #fff; }
//         .hcx-btn:disabled { opacity: .7; cursor: progress; }
//         .hcx a:focus-visible, .hcx button:focus-visible, .hcx input:focus-visible, .hcx select:focus-visible, .hcx summary:focus-visible { outline: 3px solid var(--orange); outline-offset: 3px; }
//         .hcx-link { display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; font-weight: 600; font-size: 15px; color: var(--forest); text-decoration: none; border-bottom: 2px solid var(--orange); padding-bottom: 2px; }
//         .hcx-link:hover { color: #000; }

//         /* Hero */
//         .hcx-hero { position: relative; isolation: isolate; background: var(--forest); color: #fff; }
//         .hcx-hero-media { position: absolute; inset: 0; z-index: -1; overflow: hidden; }
//         .hcx-hero-media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(10,28,22,.86) 0%, rgba(10,28,22,.62) 48%, rgba(10,28,22,.35) 100%); }
//         .hcx-hero-img, .hcx-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
//         .hcx-hero-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(340px, 420px); gap: clamp(32px, 6vw, 96px); align-items: center; padding-block: clamp(48px, 7vw, 88px); min-height: min(720px, calc(100svh - 80px)); }
//         .hcx-hero h1 { font-size: clamp(36px, 5.4vw, 68px); line-height: 1.05; font-weight: 600; letter-spacing: -0.03em; max-width: 14ch; text-wrap: balance; }
//         .hcx-hero-desc { margin-top: 20px; max-width: 50ch; font-size: 18px; color: rgba(255,255,255,.9); }
//         .hcx-hero-desc, .hcx-hero-desc * { color: rgba(255,255,255,.9) !important; }
//         .hcx-hero-desc p { margin: 0; }
//         .hcx-points { list-style: none; display: grid; gap: 10px; margin: 28px 0 0; padding: 0; }
//         .hcx-points li { display: flex; align-items: center; gap: 12px; font-weight: 500; }
//         .hcx-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 32px; }
//         .hcx-hero-actions .hcx-btn-ghost { color: #fff; }

//         /* Form */
//         .hcx-form-card { background: #fff; color: var(--ink); border-radius: 10px; padding: clamp(22px, 3vw, 32px); box-shadow: 0 24px 60px rgba(5,20,15,.35); scroll-margin-top: 24px; }
//         .hcx-form-card h2 { font-size: 24px; line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; }
//         .hcx-form-intro { margin: 8px 0 20px; color: var(--muted); font-size: 14px; line-height: 1.55; }
//         .hcx-form { display: grid; gap: 14px; }
//         .hcx-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//         .hcx-field { display: grid; gap: 6px; min-width: 0; }
//         .hcx-field > span { font-size: 13px; font-weight: 600; }
//         .hcx-field em { font-style: normal; font-weight: 400; color: var(--muted); }
//         .hcx-field input, .hcx-field select { width: 100%; min-height: 46px; padding: 0 14px; border: 1px solid #b8c2bc; border-radius: 6px; background: #fff; color: var(--ink); font: 400 15px var(--font-poppins), system-ui, sans-serif; }
//         .hcx-field input::placeholder { color: #7d8781; }
//         .hcx-field input[aria-invalid="true"] { border-color: #b42318; background: #fff8f7; }
//         .hcx-err { display: block; margin-top: 2px; color: #b42318; font-size: 12.5px; line-height: 1.4; font-weight: 500; }
//         .hcx-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
//         .hcx-consent { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: var(--muted); line-height: 1.5; }
//         .hcx-consent input { width: 18px; height: 18px; margin-top: 2px; accent-color: var(--forest); flex: 0 0 auto; }
//         .hcx-consent input[aria-invalid="true"] { outline: 2px solid #b42318; outline-offset: 2px; }
//         .hcx-consent a { color: var(--forest); text-decoration: underline; }
//         .hcx-form-submit { width: 100%; }

//         /* Stats */
//         .hcx-stats { background: var(--forest); color: #fff; border-top: 1px solid rgba(255,255,255,.14); }
//         .hcx-stats-grid { list-style: none; margin: 0 auto; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); }
//         .hcx-stats-grid li { padding: 28px 24px; border-left: 1px solid rgba(255,255,255,.16); }
//         .hcx-stats-grid li:first-child { border-left: 0; padding-left: 0; }
//         .hcx-stat-value { display: block; font-size: clamp(30px, 3.6vw, 44px); font-weight: 600; line-height: 1.1; letter-spacing: -0.02em; }
//         .hcx-stat-label { display: block; margin-top: 4px; font-size: 14px; color: rgba(255,255,255,.78); }

//         /* Ready-to-go designs */
//         .hcx-ready-head { display: flex; justify-content: space-between; align-items: end; gap: 28px; flex-wrap: wrap; }
//         .hcx-ready-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 44px; }
//         .hcx-ready-card { display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; background: #fff; text-decoration: none; transition: box-shadow .2s ease, transform .2s ease; }
//         .hcx-ready-card:hover { box-shadow: 0 14px 34px rgba(18,59,48,.14); transform: translateY(-3px); }
//         .hcx-ready-img { aspect-ratio: 4 / 3; overflow: hidden; background: linear-gradient(135deg, var(--forest), var(--forest-soft)); }
//         .hcx-ready-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
//         .hcx-ready-card:hover .hcx-ready-img img { transform: scale(1.05); }
//         .hcx-ready-ph { display: grid; place-items: center; height: 100%; padding: 16px; color: #fff; font-size: 20px; font-weight: 600; text-align: center; }
//         .hcx-ready-body { display: flex; flex-direction: column; flex: 1; padding: 18px 18px 20px; }
//         .hcx-ready-body h3 { font-size: 18px; font-weight: 600; line-height: 1.3; }
//         .hcx-ready-body p { margin-top: 6px; color: var(--muted); font-size: 14px; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
//         .hcx-ready-cta { margin-top: auto; padding-top: 14px; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--forest); }
//         .hcx-ready-foot { margin-top: 40px; }

//         /* Why us */
//         .hcx-why { background: var(--forest); color: #fff; }
//         .hcx-why-grid { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: clamp(32px, 6vw, 88px); align-items: center; }
//         .hcx-why-media { border-radius: 10px; overflow: hidden; background: var(--forest-soft); }
//         .hcx-why-media img { width: 100%; height: auto; }
//         .hcx-why .hcx-h2 { max-width: 18ch; }
//         .hcx-why-list { list-style: none; margin: 36px 0 0; padding: 0; display: grid; gap: 0; }
//         .hcx-why-list li { padding: 22px 0; border-top: 1px solid rgba(255,255,255,.2); }
//         .hcx-why-list h3 { font-size: 19px; font-weight: 600; }
//         .hcx-why-list p { margin-top: 6px; color: rgba(255,255,255,.82); font-size: 15px; max-width: 52ch; }

//         /* Areas */
//         .hcx-areas { background: var(--stone); }
//         .hcx-areas-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: clamp(32px, 6vw, 88px); }
//         .hcx-areas h3 { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
//         .hcx-chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
//         .hcx-chips a { display: inline-block; padding: 9px 18px; border: 1px solid #aab5ae; border-radius: 999px; background: #fff; text-decoration: none; font-size: 15px; font-weight: 500; transition: background-color .15s ease, color .15s ease, border-color .15s ease; }
//         .hcx-chips a:hover { background: var(--forest); color: #fff; border-color: var(--forest); }
//         .hcx-areas-col + .hcx-areas-col { margin-top: 0; }

//         /* FAQ */
//         .hcx-faq-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 88px); align-items: start; }
//         .hcx-faq-intro { position: sticky; top: 32px; }
//         .hcx-faq-item { border-top: 1px solid var(--line); }
//         .hcx-faq-item:last-child { border-bottom: 1px solid var(--line); }
//         .hcx-faq-item summary { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px 0; font-size: 18px; font-weight: 600; line-height: 1.35; cursor: pointer; list-style: none; }
//         .hcx-faq-item summary::-webkit-details-marker { display: none; }
//         .hcx-faq-item summary::after { content: "+"; flex: 0 0 auto; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: var(--stone); font-size: 22px; font-weight: 400; line-height: 1; }
//         .hcx-faq-item[open] summary::after { content: "–"; background: var(--orange); }
//         .hcx-faq-answer { padding: 0 52px 24px 0; color: var(--muted); font-size: 16px; }
//         .hcx-faq-answer p { margin: 0 0 10px; }
//         .hcx-faq-answer, .hcx-faq-answer * { color: var(--muted) !important; }

//         /* Final CTA */
//         .hcx-final { background: var(--ink); color: #fff; }
//         .hcx-final-inner { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 40px; align-items: center; }
//         .hcx-final h2 { font-size: clamp(30px, 4.4vw, 54px); line-height: 1.08; font-weight: 600; letter-spacing: -0.025em; max-width: 16ch; }
//         .hcx-final-desc { margin-top: 16px; max-width: 48ch; color: rgba(255,255,255,.8); }
//         .hcx-final-desc, .hcx-final-desc * { color: rgba(255,255,255,.8) !important; }
//         .hcx-final-desc p { margin: 0; }
//         .hcx-final-actions { display: grid; gap: 12px; justify-items: stretch; }
//         .hcx-final-actions .hcx-btn-ghost { color: #fff; }

//         /* Mobile bar */
//         .hcx-mobile-bar { display: none; }
//         .hcx-modal-open { filter: none; }

//         @media (max-width: 1100px) {
//           .hcx-ready-grid { grid-template-columns: repeat(2, 1fr); }
//         }
//         @media (max-width: 900px) {
//           .hcx-hero-grid { grid-template-columns: 1fr; min-height: 0; }
//           .hcx-hero h1 { max-width: 18ch; }
//           .hcx-form-card { max-width: 560px; }
//           .hcx-stats-grid { grid-template-columns: repeat(2, 1fr); }
//           .hcx-stats-grid li:nth-child(odd) { border-left: 0; padding-left: 0; }
//           .hcx-stats-grid li:nth-child(n+3) { border-top: 1px solid rgba(255,255,255,.16); }
//           .hcx-why-grid, .hcx-areas-grid, .hcx-faq-grid, .hcx-final-inner { grid-template-columns: 1fr; }
//           .hcx-faq-intro { position: static; }
//         }
//         @media (max-width: 700px) {
//           .hcx { padding-bottom: 72px; }
//           .hcx-wrap { width: calc(100% - 32px); }
//           .hcx-hero-media::after { background: linear-gradient(180deg, rgba(10,28,22,.82), rgba(10,28,22,.72)); }
//           .hcx-hero-desc { font-size: 16px; }
//           .hcx-hero-actions .hcx-btn { width: 100%; }
//           .hcx-form-row { grid-template-columns: 1fr; }
//           .hcx-ready-grid { grid-template-columns: 1fr; }
//           .hcx-ready-foot .hcx-btn { width: 100%; }
//           .hcx-faq-item summary { font-size: 16px; }
//           .hcx-faq-answer { padding-right: 0; }
//           .hcx-final-actions .hcx-btn { width: 100%; }
//           .hcx-mobile-bar { position: fixed; z-index: 90; left: 0; right: 0; bottom: 0; display: grid; grid-template-columns: 1fr 1.6fr; gap: 10px; padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 0px)); background: #fff; box-shadow: 0 -6px 24px rgba(0,0,0,.14); }
//           .hcx-mobile-bar .hcx-btn { min-height: 48px; padding: 0 12px; font-size: 15px; }
//           .hcx-mobile-bar .hcx-btn-outline { border-color: var(--forest); }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .hcx *, .hcx *::before, .hcx *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; scroll-behavior: auto !important; }
//         }
//       `}</style>

//       {/* Hero */}
//       <section className="hcx-hero" aria-labelledby="hcx-hero-title">
//         <div className="hcx-hero-media" aria-hidden="true">
//           <HeroImage src={heroImage} />
//           {showVideo ? (
//             <video
//               className="hcx-hero-video"
//               src={HERO_VIDEO}
//               autoPlay
//               muted
//               loop
//               playsInline
//               preload="metadata"
//             />
//           ) : null}
//         </div>
//         <div className="hcx-wrap hcx-hero-grid">
//           <div>
//             <h1 id="hcx-hero-title">{heroTitle}</h1>
//             <Html className="hcx-hero-desc" html={heroDesc} />
//             <ul className="hcx-points">
//               {HERO_POINTS.map((point) => (
//                 <li key={point}><Tick /> {point}</li>
//               ))}
//             </ul>
//             <div className="hcx-hero-actions">
//               <a className="hcx-btn hcx-btn-primary" href="/estimator-for-home">Get a free estimate</a>
//               <a className="hcx-btn hcx-btn-ghost" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//             </div>
//           </div>
//           <LeadForm />
//         </div>
//       </section>

//       {/* Trust numbers */}
//       <section className="hcx-stats" aria-label="High Creation Interior at a glance">
//         <div className="hcx-wrap">
//           <ul className="hcx-stats-grid">
//             {STATS.map((stat) => (
//               <li key={stat.label}>
//                 <span className="hcx-stat-value">{stat.value}</span>
//                 <span className="hcx-stat-label">{stat.label}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>

//       {/* Ready-to-go designs */}
//       <section className="hcx-section" id="hcx-ready" aria-labelledby="hcx-ready-title">
//         <div className="hcx-wrap">
//           <div className="hcx-ready-head">
//             <div>
//               <h2 id="hcx-ready-title" className="hcx-h2">Ready-to-go designs for every room</h2>
//               <p className="hcx-lead">Thoughtfully crafted interiors that combine good looks with smart functionality. Pick a room and start from a design you like.</p>
//             </div>
//             <a className="hcx-link" href="/ready-togo-design">View all designs <Arrow /></a>
//           </div>
//           <div className="hcx-ready-grid">
//             {readyCards.map((card) => (
//               <a className="hcx-ready-card" key={card.id} href={card.href}>
//                 <div className="hcx-ready-img">
//                   {card.image ? (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img src={card.image} alt={card.alt || `${card.title} interior design by High Creation Interior`} loading="lazy" decoding="async" width="640" height="480" />
//                   ) : (
//                     <span className="hcx-ready-ph">{card.title}</span>
//                   )}
//                 </div>
//                 <div className="hcx-ready-body">
//                   <h3>{card.title}</h3>
//                   {card.text ? <p>{card.text}</p> : null}
//                   <span className="hcx-ready-cta">View designs <Arrow /></span>
//                 </div>
//               </a>
//             ))}
//           </div>
//           <div className="hcx-ready-foot">
//             <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Get a free consultation</a>
//           </div>
//         </div>
//       </section>

//       {/* Why High Creation Interior */}
//       <section className="hcx-section hcx-why" aria-labelledby="hcx-why-title">
//         <div className="hcx-wrap hcx-why-grid">
//           <div className="hcx-why-media">
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img src="/images/about/Whatmakes.png" alt="What makes High Creation Interior different" loading="lazy" decoding="async" width="640" height="560" />
//           </div>
//           <div>
//             <h2 id="hcx-why-title" className="hcx-h2">Your space designed around you, not around a fixed design</h2>
//             <ul className="hcx-why-list">
//               {WHY_POINTS.map((point) => (
//                 <li key={point.title}>
//                   <h3>{point.title}</h3>
//                   <p>{point.text}</p>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </section>

//       {/* Where we work */}
//       <section className="hcx-section hcx-areas" aria-labelledby="hcx-areas-title">
//         <div className="hcx-wrap">
//           <h2 id="hcx-areas-title" className="hcx-h2">Interior designers across Delhi NCR</h2>
//           <p className="hcx-lead">Five branches and experience centers across NCR. Visit one to see materials and finishes in person.</p>
//           <div className="hcx-areas-grid" style={{ marginTop: 40 }}>
//             <div className="hcx-areas-col">
//               <h3>Areas we serve</h3>
//               <ul className="hcx-chips">
//                 {AREAS.map((area) => (
//                   <li key={area.label}><a href={area.href}>{area.label}</a></li>
//                 ))}
//               </ul>
//             </div>
//             <div className="hcx-areas-col">
//               <h3>Experience centers</h3>
//               <ul className="hcx-chips">
//                 {CENTERS.map((center) => (
//                   <li key={center.label}><a href={center.href}>{center.label}</a></li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FAQ (CMS: faqs) */}
//       {faqLoading || faqError || faqs.length > 0 ? (
//         <section className="hcx-section" aria-labelledby="hcx-faq-title">
//           <div className="hcx-wrap hcx-faq-grid">
//             <div className="hcx-faq-intro">
//               <h2 id="hcx-faq-title" className="hcx-h2">Questions before you begin</h2>
//               <p className="hcx-lead">Clear answers to the things people ask us most. Still unsure? Call us and we will walk you through it.</p>
//               <a className="hcx-link" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//             </div>
//             <div>
//               {faqLoading ? <p className="hcx-lead">Loading FAQs…</p> : null}
//               {faqError ? <p className="hcx-lead">{faqError}</p> : null}
//               {!faqLoading && !faqError && faqs.map((faq, index) => (
//                 <details className="hcx-faq-item" key={faq.key} open={index === 0}>
//                   <summary>{faq.title || "Frequently asked question"}</summary>
//                   <Html className="hcx-faq-answer" html={faq.description || ""} />
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>
//       ) : null}

//       {/* Final CTA */}
//       <section className="hcx-section hcx-final" aria-labelledby="hcx-final-title">
//         <div className="hcx-wrap hcx-final-inner">
//           <div>
//             <h2 id="hcx-final-title">{data6?.top_title || "Let’s plan the home you want to come back to."}</h2>
//             <Html
//               className="hcx-final-desc"
//               html={data6?.top_description || "Tell us about your space. A High Creation Interior designer will help you plan a practical, personal next step."}
//             />
//           </div>
//           <div className="hcx-final-actions">
//             <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Book free consultation</a>
//             <a className="hcx-btn hcx-btn-ghost" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//             <a className="hcx-btn hcx-btn-ghost" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
//           </div>
//         </div>
//       </section>

//       {/* Mobile sticky actions */}
//       <div className="hcx-mobile-bar">
//         <a className="hcx-btn hcx-btn-outline" href={PHONE_TEL}>Call us</a>
//         <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Book free consultation</a>
//       </div>

//       <ContactUsPopUp onModalStateChange={handleModalStateChange} />
//     </div>
//   );
// }




// "use client";

// import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import DOMPurify from "isomorphic-dompurify";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import api from "@/utils/api";
// import { buildLeadMetadata } from "@/utils/leadForms";
// import { leadSchema, normalizePhone } from "@/utils/leadValidation";

// // Lazy-loaded: triggered later by scroll/time/exit intent, must not delay first paint.
// const ContactUsPopUp = dynamic(() => import("../components/ContactUsPopUp"), {
//   ssr: false,
// });

// /* -------------------------------------------------------------------------- */
// /*  Static content, taken from https://www.hcinterior.in/                     */
// /* -------------------------------------------------------------------------- */

// const CMS_IMG = "https://apidev.hcinterior.in/uploads/cms-content/";
// const HERO_VIDEO = `${CMS_IMG}banner_image-1791979629832-642156515.mp4`;

// // Put hero-interior.webp in  public/images/landing/  (file is delivered next to this one).
// const HERO_INTERIOR = "/images/landing/hero-interior.webp";

// const PHONE_TEL = "tel:+917070701373";
// const PHONE_LABEL = "+91 70707 01373";
// const WHATSAPP = "https://wa.me/919560277787";

// const HERO_POINTS = [
//   "Free design consultation",
//   "Complete customization",
//   "In-house production",
// ];

// // Typed on slide 1. The CMS headline (if any) is always typed first.
// const TYPED_PHRASES = [
//   "Designed around you, not around a fixed design.",
//   "Made in our own production facility.",
//   "Complete customization for every room.",
//   "2,750+ projects completed across Delhi NCR.",
// ];

// const STATS = [
//   { value: "8+", label: "years of experience" },
//   { value: "2,750+", label: "projects completed" },
//   { value: "450+", label: "people on our team" },
//   { value: "5", label: "branches across NCR" },
// ];

// const WHY_POINTS = [
//   {
//     key: "custom",
//     title: "Complete customization",
//     text: "Every project is designed around your vision, your space and your lifestyle, not a fixed catalogue.",
//   },
//   {
//     key: "inhouse",
//     title: "In-house production",
//     text: "We make furniture, fixtures and design elements in our own facility, so quality, cost and timelines stay in our hands.",
//   },
//   {
//     key: "team",
//     title: "One team, one roof",
//     text: "Design and production are managed together, which means fewer third-party vendors and a smoother process.",
//   },
// ];

// // Addresses are from hcinterior.in/contact
// const CENTER_CARDS = [
//   {
//     city: "Noida",
//     address: "H101, LGF, Sector-63, Noida, Uttar Pradesh - 201301",
//     href: "/experience-center/",
//   },
//   {
//     city: "Noida Extension",
//     address: "Galaxy Blue Sapphire Plaza, Noida Extension, Haibatpur, Sector 4, Greater Noida, Uttar Pradesh 201305",
//     href: "/experience-center-noida-extension/",
//   },
//   {
//     city: "Gurugram",
//     address: "DDC Arcade, 1st Floor, Plot No 1 Main, Sector 48 Road, Badshahpur Sohna Rd, Opposite Vipul Business Park, Gurugram, Haryana 122018",
//     href: "/experience-center-gurugram/",
//   },
// ];

// const OTHER_CENTERS = [
//   { label: "Faridabad", href: "/experience-center-faridabad/" },
//   { label: "New Delhi", href: "/experience-center-new-delhi/" },
// ];

// const AREAS = [
//   { label: "Noida", href: "/interior-designers-in-noida" },
//   { label: "Greater Noida", href: "/interior-designers-in-greater-noida" },
//   { label: "Noida Extension", href: "/interior-designer-in-noida-extension" },
//   { label: "Ghaziabad", href: "/interior-designers-in-ghaziabad" },
//   { label: "Delhi", href: "/interior-designers-in-delhi" },
//   { label: "Dwarka", href: "/interior-designers-in-dwarka" },
//   { label: "Gurugram", href: "/interior-designers-in-gurgaon" },
//   { label: "Faridabad", href: "/interior-designers-in-faridabad" },
//   { label: "Manesar", href: "/interior-designers-in-manesar" },
//   { label: "Sohna", href: "/interior-designer-in-sohna-gurgaon" },
// ];

// const PROPERTY_TYPES = ["1 BHK", "2 BHK", "3 BHK", "4 BHK or larger", "Villa / builder floor"];

// // Same CMS parent-child type that powers /ready-togo-design.
// // Verify this name against ready-togo-design/page.jsx (and keep it in sync with page.jsx).
// const READY_TO_GO_TYPE = "ready_to_go_design";

// // CMS parent-child type behind /luxury-projects. I could not see it from outside the
// // site, so verify the name in luxury-projects/page.jsx. If it is wrong the section
// // still renders from the fallback list below, just without photos.
// const LUXURY_TYPE = "luxury_projects";

// // Shown only if the CMS returns nothing. Copy is from hcinterior.in/ready-togo-design.
// const READY_FALLBACK = [
//   { id: "living", title: "Living Room", text: "Design a living room that blends style and function, perfect for relaxation and gatherings.", href: "/ready-togo-design/gallery?id=5" },
//   { id: "kitchen", title: "Modular Kitchen", text: "Your kitchen deserves perfection. Let’s create the dream space where cooking and style come together.", href: "/ready-togo-design/gallery?id=6" },
//   { id: "master", title: "Master Bedroom", text: "Transform your master bedroom into a luxurious retreat where elegance and comfort create perfect tranquility.", href: "/ready-togo-design/gallery?id=3" },
//   { id: "kids", title: "Kids Room", text: "A playful, cozy and colorful design that sparks creativity and fun.", href: "/ready-togo-design/gallery?id=7" },
//   { id: "dining", title: "Dining", text: "Where every meal feels like a celebration. A stylish haven of comfort and elegance.", href: "/ready-togo-design/gallery?id=9" },
//   { id: "mandir", title: "Mandir", text: "A serene sanctuary where devotion and design come together beautifully.", href: "/ready-togo-design/gallery?id=4" },
//   { id: "parents", title: "Parents Room", text: "A haven of comfort and peace, designed with care.", href: "/ready-togo-design/gallery?id=1" },
//   { id: "entrance", title: "Entrance", text: "Make a lasting first impression with a welcoming, functional entryway.", href: "/ready-togo-design/gallery?id=8" },
// ];

// // Luxury project categories from hcinterior.in/luxury-projects (ids match project-gallery?id=).
// // PREFERRED decides which six are shown when the CMS has more.
// const LUXURY_PREFERRED_IDS = [23, 22, 18, 17, 16, 3];
// const LUXURY_FALLBACK = [
//   { id: 23, title: "Living Room" },
//   { id: 22, title: "Premium Bedroom" },
//   { id: 18, title: "Luxury Dining" },
//   { id: 17, title: "Luxury Bathroom" },
//   { id: 16, title: "Luxury Dressing Room" },
//   { id: 3, title: "Bar Area" },
// ].map((item) => ({
//   ...item,
//   text: "",
//   image: null,
//   href: `/luxury-projects/project-gallery?id=${item.id}`,
// }));

// /* -------------------------------------------------------------------------- */
// /*  Helpers                                                                    */
// /* -------------------------------------------------------------------------- */

// const Html = memo(function Html({ html, className = "" }) {
//   const clean = useMemo(() => DOMPurify.sanitize(html || ""), [html]);
//   return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
// });

// const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// const cardContent = (record) => record?.child_content || record?.parent_content || {};

// const OPTIMIZED_HOSTS = ["hcinterior.in", "www.hcinterior.in", "apidev.hcinterior.in", "localhost"];

// function canOptimize(src) {
//   if (!src || src.startsWith("//")) return false;
//   if (src.startsWith("/")) return true;
//   try {
//     return OPTIMIZED_HOSTS.includes(new URL(src).hostname);
//   } catch {
//     return false;
//   }
// }

// function SlideImage({ src, alt = "", priority = false, className = "" }) {
//   if (!src) return null;
//   if (canOptimize(src)) {
//     return <Image src={src} alt={alt} fill priority={priority} sizes="100vw" quality={80} className={className} />;
//   }
//   // eslint-disable-next-line @next/next/no-img-element
//   return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" className={className} />;
// }

// // Plays only while its slide is on screen.
// function SlideVideo({ src, active }) {
//   const ref = useRef(null);
//   useEffect(() => {
//     const video = ref.current;
//     if (!video) return;
//     if (active) video.play?.().catch(() => {});
//     else video.pause?.();
//   }, [active]);
//   return <video ref={ref} className="hcx-slide-img" src={src} muted loop playsInline preload="metadata" aria-hidden="true" />;
// }

// // Types each phrase, holds, deletes, then moves to the next. Restarts whenever its slide comes back.
// function useTypewriter(phrases, active, reduceMotion) {
//   const [text, setText] = useState("");
//   const key = phrases.join("|");

//   useEffect(() => {
//     const list = key.split("|").filter(Boolean);
//     if (!active || !list.length) {
//       setText("");
//       return undefined;
//     }
//     if (reduceMotion) {
//       setText(list[0]);
//       return undefined;
//     }

//     let phraseIndex = 0;
//     let charIndex = 0;
//     let deleting = false;
//     let timer;

//     const tick = () => {
//       const phrase = list[phraseIndex];
//       if (!deleting) {
//         charIndex += 1;
//         setText(phrase.slice(0, charIndex));
//         if (charIndex >= phrase.length) {
//           deleting = true;
//           timer = window.setTimeout(tick, 1800);
//           return;
//         }
//         timer = window.setTimeout(tick, 46);
//       } else {
//         charIndex -= 1;
//         setText(phrase.slice(0, Math.max(charIndex, 0)));
//         if (charIndex <= 0) {
//           deleting = false;
//           phraseIndex = (phraseIndex + 1) % list.length;
//           timer = window.setTimeout(tick, 320);
//           return;
//         }
//         timer = window.setTimeout(tick, 20);
//       }
//     };

//     timer = window.setTimeout(tick, 450);
//     return () => window.clearTimeout(timer);
//   }, [key, active, reduceMotion]);

//   return text;
// }

// const Arrow = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
//     <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const Tick = () => (
//   <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
//     <circle cx="9" cy="9" r="9" fill="#ff8b49" />
//     <path d="M5 9.3l2.6 2.6L13 6.6" stroke="#18201c" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const PauseIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="2" y="1.5" width="3.6" height="11" rx="1" fill="currentColor" /><rect x="8.4" y="1.5" width="3.6" height="11" rx="1" fill="currentColor" /></svg>
// );
// const PlayIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.8v10.4a.6.6 0 0 0 .9.5l8.2-5.2a.6.6 0 0 0 0-1L3.9 1.3a.6.6 0 0 0-.9.5Z" fill="currentColor" /></svg>
// );

// const PinIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//     <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//     <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
//   </svg>
// );

// const WHY_ICONS = {
//   custom: (
//     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
//       <path d="M4 8h20M4 14h20M4 20h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//       <circle cx="9" cy="8" r="2.6" fill="#123b30" stroke="currentColor" strokeWidth="1.8" />
//       <circle cx="19" cy="14" r="2.6" fill="#123b30" stroke="currentColor" strokeWidth="1.8" />
//       <circle cx="12" cy="20" r="2.6" fill="#123b30" stroke="currentColor" strokeWidth="1.8" />
//     </svg>
//   ),
//   inhouse: (
//     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
//       <path d="M3 24V12l7 4v-4l7 4v-4l8 4v8H3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//       <path d="M19 12V4h4v10" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//       <path d="M8 24v-4h4v4M15 24v-4h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//     </svg>
//   ),
//   team: (
//     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
//       <path d="M3 13.5 14 4l11 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//       <path d="M6 12v12h16V12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//       <circle cx="11" cy="15.5" r="2" stroke="currentColor" strokeWidth="1.6" />
//       <circle cx="17.5" cy="15.5" r="2" stroke="currentColor" strokeWidth="1.6" />
//       <path d="M8 22c.4-2 1.6-3 3-3s2.6 1 3 3M14.5 22c.4-2 1.6-3 3-3s2.6 1 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
//   ),
// };

// /* -------------------------------------------------------------------------- */
// /*  Lead form (react-hook-form + zod, same API + tracking as before)           */
// /* -------------------------------------------------------------------------- */

// const EMPTY_FORM = {
//   fullName: "",
//   contact: "",
//   email: "",
//   place: "",
//   property: "",
//   termsAndConditions: false,
//   website: "",
// };

// const CTA_TEXT = "Book free consultation";

// function LeadForm() {
//   const pathname = usePathname();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(leadSchema),
//     defaultValues: EMPTY_FORM,
//     mode: "onTouched", // validate when a field is left, then live while fixing it
//   });

//   const onSubmit = async (values) => {
//     if (values.website) return; // honeypot filled: bot, silently ignore

//     const requestData = {
//       name: values.fullName.trim().replace(/\s+/g, " "),
//       mobile: normalizePhone(values.contact), // always a clean 10-digit number
//       email: values.email.trim().toLowerCase(),
//       place: values.place.trim(),
//       query: values.property ? `Property type: ${values.property}` : "",
//       ...buildLeadMetadata({
//         pathname,
//         leadFormType: "inline",
//         leadFormName: "Creating The Home Of Your Dreams Lead Form",
//         ctaText: CTA_TEXT.toUpperCase(),
//       }),
//     };

//     try {
//       const response = await api.post("/user-queries", requestData);
//       if (response.status === 201) {
//         reset(EMPTY_FORM);
//         toast.success("Thank you. Our team will be in touch soon.");
//         window.setTimeout(() => {
//           window.location.href = "/thank-you";
//         }, 300);
//       } else {
//         toast.error("We could not submit your details. Please try again.");
//       }
//     } catch (error) {
//       toast.error(error?.message || "Something went wrong. Please try again.");
//       console.error("HCI landing enquiry submission failed:", error);
//     }
//   };

//   return (
//     <div className="hcx-form-card" id="hcx-enquiry-form">
//       <h2>Get a free design consultation</h2>
//       <p className="hcx-form-intro">Share a few details and a designer will call you to plan the next step.</p>
//       <form onSubmit={handleSubmit(onSubmit)} className="hcx-form" noValidate>
//         <label className="hcx-field">
//           <span>Your name</span>
//           <input
//             type="text"
//             autoComplete="name"
//             placeholder="Full name"
//             maxLength={60}
//             aria-invalid={errors.fullName ? "true" : "false"}
//             {...register("fullName")}
//           />
//           {errors.fullName ? <small className="hcx-err" role="alert">{errors.fullName.message}</small> : null}
//         </label>

//         <label className="hcx-field">
//           <span>Mobile number</span>
//           <input
//             type="tel"
//             autoComplete="tel"
//             inputMode="tel"
//             placeholder="10-digit mobile number"
//             maxLength={16}
//             aria-invalid={errors.contact ? "true" : "false"}
//             {...register("contact")}
//           />
//           {errors.contact ? <small className="hcx-err" role="alert">{errors.contact.message}</small> : null}
//         </label>

//         <label className="hcx-field">
//           <span>Email address</span>
//           <input
//             type="email"
//             autoComplete="email"
//             placeholder="you@example.com"
//             maxLength={100}
//             aria-invalid={errors.email ? "true" : "false"}
//             {...register("email")}
//           />
//           {errors.email ? <small className="hcx-err" role="alert">{errors.email.message}</small> : null}
//         </label>

//         <div className="hcx-form-row">
//           <label className="hcx-field">
//             <span>City <em>(optional)</em></span>
//             <input
//               type="text"
//               autoComplete="address-level2"
//               placeholder="Noida, Gurugram…"
//               maxLength={50}
//               aria-invalid={errors.place ? "true" : "false"}
//               {...register("place")}
//             />
//             {errors.place ? <small className="hcx-err" role="alert">{errors.place.message}</small> : null}
//           </label>
//           <label className="hcx-field">
//             <span>Property <em>(optional)</em></span>
//             <select {...register("property")}>
//               <option value="">Select</option>
//               {PROPERTY_TYPES.map((type) => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//           </label>
//         </div>

//         {/* Honeypot: hidden from people, bots tend to fill it */}
//         <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hcx-hp" {...register("website")} />

//         <div>
//           <label className="hcx-consent">
//             <input type="checkbox" aria-invalid={errors.termsAndConditions ? "true" : "false"} {...register("termsAndConditions")} />
//             <span>
//               I agree to the <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a> and terms.
//             </span>
//           </label>
//           {errors.termsAndConditions ? <small className="hcx-err" role="alert">{errors.termsAndConditions.message}</small> : null}
//         </div>

//         <button className="hcx-btn hcx-btn-primary hcx-form-submit" type="submit" disabled={isSubmitting}>
//           {isSubmitting ? "Sending…" : CTA_TEXT}
//         </button>
//       </form>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  Page                                                                       */
// /* -------------------------------------------------------------------------- */

// async function fetchSection(endpoint, setter) {
//   try {
//     const response = await api.get(endpoint, {});
//     if (response?.data?.json_content) setter(response.data.json_content);
//   } catch (error) {
//     console.error(`HCI landing CMS request failed (${endpoint}):`, error);
//   }
// }

// export default function HCLandingPage({ initialData }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [data1, setData1] = useState(initialData?.data1 ?? null);
//   const [data6, setData6] = useState(initialData?.data6 ?? null);
//   const [faqData, setFaqData] = useState(initialData?.faqs ?? []);
//   const [faqLoading, setFaqLoading] = useState(initialData?.faqs == null);
//   const [faqError, setFaqError] = useState("");
//   const [readyDesigns, setReadyDesigns] = useState(initialData?.readyDesigns ?? []);
//   const [luxuryDesigns, setLuxuryDesigns] = useState(initialData?.luxuryDesigns ?? []);
//   const [showVideo, setShowVideo] = useState(false);

//   // Hero slider state
//   const [pos, setPos] = useState({ index: 0, prev: null });
//   const [playing, setPlaying] = useState(true);
//   const [hovered, setHovered] = useState(false);
//   const [focused, setFocused] = useState(false);
//   const [hidden, setHidden] = useState(false);
//   const [reduceMotion, setReduceMotion] = useState(false);

//   // Anything the server could not fetch is fetched here.
//   useEffect(() => {
//     const init = initialData || {};
//     if (!init.data1) fetchSection("/cms-content/creating_the_home_of_your_dreams", setData1);
//     if (!init.data6) fetchSection("/cms-content/creating_the_home_of_your_dreams_6", setData6);

//     if (init.faqs == null) {
//       api.get("/cms-content/faqs")
//         .then((response) => setFaqData(Array.isArray(response?.data) ? response.data : []))
//         .catch(() => setFaqError("FAQs could not be loaded right now."))
//         .finally(() => setFaqLoading(false));
//     }
//     if (init.readyDesigns == null) {
//       api.get(`/cms-parent-child/${READY_TO_GO_TYPE}`)
//         .then((response) => setReadyDesigns(Array.isArray(response?.data) ? response.data : []))
//         .catch((error) => console.error("HCI ready-to-go designs failed to load:", error));
//     }
//     if (init.luxuryDesigns == null) {
//       api.get(`/cms-parent-child/${LUXURY_TYPE}`)
//         .then((response) => setLuxuryDesigns(Array.isArray(response?.data) ? response.data : []))
//         .catch((error) => console.error("HCI luxury projects failed to load:", error));
//     }
//   }, [initialData]);

//   // Motion preferences + video eligibility + tab visibility.
//   useEffect(() => {
//     const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
//     const apply = () => {
//       const reduce = Boolean(mq?.matches);
//       setReduceMotion(reduce);
//       if (reduce) setPlaying(false);
//     };
//     apply();
//     mq?.addEventListener?.("change", apply);

//     const narrow = window.matchMedia?.("(max-width: 700px)")?.matches;
//     const saveData = navigator.connection?.saveData;
//     setShowVideo(!mq?.matches && !narrow && !saveData);

//     const onVisibility = () => setHidden(document.hidden);
//     document.addEventListener("visibilitychange", onVisibility);
//     return () => {
//       mq?.removeEventListener?.("change", apply);
//       document.removeEventListener("visibilitychange", onVisibility);
//     };
//   }, []);

//   /* ---------------------------- Hero content ---------------------------- */

//   const heroImage = data1?.mid_image;
//   const cmsHeadline = stripHtml(data1?.mid_sub_title);
//   const heroDesc =
//     data1?.top_description ||
//     "Customized home interiors across Delhi NCR, planned with you and made in our own production facility.";

//   const phrases = useMemo(
//     () => [cmsHeadline, ...TYPED_PHRASES].filter(Boolean),
//     [cmsHeadline]
//   );

//   // Slide 1 types, slide 2 is the CMS banner shown clean (no text on top), slide 3 is the site video.
//   const slides = useMemo(() => {
//     const list = [{ key: "intro", kind: "intro", dwell: 14000 }];
//     if (heroImage) list.push({ key: "banner", kind: "banner", dwell: 6500 });
//     if (showVideo) list.push({ key: "video", kind: "video", dwell: 8000 });
//     return list;
//   }, [heroImage, showVideo]);
//   const count = slides.length;

//   const goTo = useCallback(
//     (n) => setPos((p) => (p.index === n ? p : { index: n, prev: p.index })),
//     []
//   );
//   const goNext = useCallback(
//     () => setPos((p) => ({ index: (p.index + 1) % count, prev: p.index })),
//     [count]
//   );

//   const paused = hovered || focused || hidden;
//   const running = playing && !paused && count > 1;

//   // Infinite autoplay: each slide has its own dwell time and the last one wraps to the first.
//   useEffect(() => {
//     if (!running) return undefined;
//     const dwell = slides[pos.index]?.dwell || 6000;
//     const timer = window.setTimeout(goNext, dwell);
//     return () => window.clearTimeout(timer);
//   }, [running, slides, pos.index, goNext]);

//   const typed = useTypewriter(phrases, pos.index === 0, reduceMotion);

//   /* --------------------------- Section content --------------------------- */

//   const readyCards = useMemo(() => {
//     const fromCms = [...readyDesigns]
//       .sort((a, b) => Number(a.id) - Number(b.id))
//       .slice(0, 8)
//       .map((record) => {
//         const c = cardContent(record);
//         return {
//           id: record.id,
//           title: c.title,
//           text: stripHtml(c.description),
//           image: c.image,
//           alt: c.image_alt,
//           href: `/ready-togo-design/gallery?id=${record.id}`,
//         };
//       })
//       .filter((card) => card.title);
//     return fromCms.length ? fromCms : READY_FALLBACK;
//   }, [readyDesigns]);

//   const luxuryCards = useMemo(() => {
//     const toCard = (record) => {
//       const c = cardContent(record);
//       return {
//         id: record.id,
//         title: c.title,
//         text: stripHtml(c.description),
//         image: c.image,
//         alt: c.image_alt,
//         href: `/luxury-projects/project-gallery?id=${record.id}`,
//       };
//     };
//     const cards = luxuryDesigns.map(toCard).filter((card) => card.title);
//     if (!cards.length) return LUXURY_FALLBACK;
//     const preferred = LUXURY_PREFERRED_IDS
//       .map((id) => cards.find((card) => Number(card.id) === id))
//       .filter(Boolean);
//     const rest = cards
//       .filter((card) => !preferred.includes(card))
//       .sort((a, b) => Number(b.id) - Number(a.id));
//     return [...preferred, ...rest].slice(0, 6);
//   }, [luxuryDesigns]);

//   const faqs = useMemo(
//     () =>
//       faqData
//         .map((faq) => faq?.json_content || faq || {})
//         .map((item, index) => ({ ...item, key: faqData[index]?.id || `${item.title}-${index}` }))
//         .filter((item) => item.title || item.description),
//     [faqData]
//   );
//   const handleModalStateChange = useCallback((open) => setIsModalOpen(open), []);

//   const mapsUrl = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

//   return (
//     <div className={`hcx ${isModalOpen ? "hcx-modal-open" : ""}`}>
//       <style jsx global>{`
//         .hcx {
//           --ink: #18201c;
//           --forest: #123b30;
//           --forest-soft: #1c4e41;
//           --stone: #eef1ee;
//           --muted: #56605a;
//           --line: #d5dcd7;
//           --orange: #ff8b49;
//           --orange-hover: #f27a35;
//           --form-w: clamp(360px, 36vw, 420px);
//           color: var(--ink);
//           background: #fff;
//           font-family: var(--font-poppins, system-ui), system-ui, Arial, sans-serif;
//           font-size: 16px;
//           line-height: 1.6;
//           overflow: clip;
//         }
//         .hcx *, .hcx *::before, .hcx *::after { box-sizing: border-box; }
//         .hcx img, .hcx video { max-width: 100%; display: block; }
//         .hcx a { color: inherit; }
//         .hcx h1, .hcx h2, .hcx h3, .hcx p { margin: 0; }
//         /* Site-wide heading colours were turning headings dark on dark sections. Headings follow their section. */
//         .hcx h1, .hcx h2, .hcx h3 { color: inherit; font-family: inherit; }
//         .hcx button, .hcx input, .hcx select { font-family: inherit; }
//         .hcx-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
//         .hcx-wrap { width: min(1240px, calc(100% - 48px)); margin-inline: auto; }
//         .hcx-section { padding-block: clamp(56px, 8vw, 104px); }
//         .hcx-h2 { font-size: clamp(28px, 3.6vw, 44px); line-height: 1.12; font-weight: 600; letter-spacing: -0.02em; max-width: 22ch; }
//         .hcx-lead { margin-top: 14px; max-width: 58ch; color: var(--muted); font-size: 17px; }

//         /* Buttons */
//         .hcx-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 50px; padding: 0 26px; border: 2px solid transparent; border-radius: 8px; font-size: 16px; font-weight: 600; line-height: 1; text-decoration: none; cursor: pointer; transition: background-color .18s ease, border-color .18s ease, color .18s ease; }
//         .hcx-btn-primary { background: var(--orange); border-color: var(--orange); color: var(--ink) !important; }
//         .hcx-btn-primary:hover { background: var(--orange-hover); border-color: var(--orange-hover); }
//         .hcx-btn-ghost { background: transparent; border-color: currentColor; }
//         .hcx-btn-ghost:hover { background: rgba(255,255,255,.12); }
//         .hcx-btn-outline { border-color: var(--forest); color: var(--forest); background: transparent; }
//         .hcx-btn-outline:hover { background: var(--forest); color: #fff; }
//         .hcx-btn:disabled { opacity: .7; cursor: progress; }
//         .hcx a:focus-visible, .hcx button:focus-visible, .hcx input:focus-visible, .hcx select:focus-visible, .hcx summary:focus-visible { outline: 3px solid var(--orange); outline-offset: 3px; }
//         .hcx-link { display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; font-weight: 600; font-size: 15px; color: var(--forest); text-decoration: none; border-bottom: 2px solid var(--orange); padding-bottom: 2px; }
//         .hcx-link:hover { color: #000; }

//         /* ---------------------------- Hero slider ---------------------------- */
//         .hcx-hero { position: relative; background: var(--stone); }
//         .hcx-stage { position: relative; height: clamp(720px, 46vw, 800px); overflow: hidden; background: #dfe5e0; }
//         .hcx-slides { position: absolute; inset: 0; }
//         .hcx-slide { position: absolute; inset: 0; transform: translateX(100%); visibility: hidden; overflow: hidden; }
//         .hcx-slide.is-active { transform: translateX(0); visibility: visible; transition: transform .9s cubic-bezier(.65,0,.35,1); }
//         .hcx-slide.is-leaving { transform: translateX(-100%); visibility: visible; transition: transform .9s cubic-bezier(.65,0,.35,1); }
//         /* Two slides only: crossfade instead (sliding needs three to loop cleanly) */
//         .hcx-slides.is-fade .hcx-slide { transform: none; opacity: 0; transition: opacity .8s ease, visibility 0s linear .8s; }
//         .hcx-slides.is-fade .hcx-slide.is-active { opacity: 1; visibility: visible; transition: opacity .8s ease; }
//         .hcx-slide-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
//         .hcx-slide-intro.is-active .hcx-slide-img { animation: hcx-zoom 16s ease-out forwards; }
//         .hcx-slide-banner { background: #2a0f12; }
//         .hcx-wash { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(238,241,238,.97) 0%, rgba(238,241,238,.9) 38%, rgba(238,241,238,.4) 62%, rgba(238,241,238,0) 82%); }
//         .hcx-intro-wrap { position: relative; height: 100%; display: flex; align-items: center; }
//         .hcx-intro { width: min(660px, calc(100% - var(--form-w) - 40px)); padding-block: 48px; }
//         .hcx-typed { font-size: clamp(34px, 4.4vw, 62px); line-height: 1.08; font-weight: 600; letter-spacing: -0.03em; min-height: calc(1.08em * 4); color: var(--ink); }
//         .hcx-caret { display: inline-block; width: 3px; height: .85em; margin-left: 5px; vertical-align: -0.08em; background: var(--orange); animation: hcx-blink 1s steps(1) infinite; }
//         .hcx-hero-desc { margin-top: 18px; max-width: 48ch; font-size: 17px; }
//         .hcx-hero-desc, .hcx-hero-desc * { color: var(--ink) !important; }
//         .hcx-hero-desc p { margin: 0; }
//         .hcx-points { list-style: none; display: grid; gap: 10px; margin: 24px 0 0; padding: 0; }
//         .hcx-points li { display: flex; align-items: center; gap: 12px; font-weight: 500; }
//         @keyframes hcx-blink { 50% { opacity: 0; } }
//         @keyframes hcx-zoom { from { transform: scale(1); } to { transform: scale(1.07); } }
//         @keyframes hcx-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }

//         /* Persistent bar: dots + buttons stay put while slides run */
//         .hcx-ctabar { background: #fff; border-bottom: 1px solid var(--line); position: relative; z-index: 6; }
//         .hcx-ctabar-inner { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding-block: 16px; }
//         .hcx-controls { display: flex; align-items: center; gap: 6px; }
//         .hcx-playbtn { width: 40px; height: 40px; margin-right: 8px; border-radius: 50%; border: 1.5px solid var(--forest); background: #fff; color: var(--forest); display: grid; place-items: center; cursor: pointer; }
//         .hcx-playbtn:hover { background: var(--forest); color: #fff; }
//         .hcx-dot { height: 28px; padding: 0 3px; border: 0; background: none; cursor: pointer; display: grid; align-items: center; }
//         .hcx-dot-bar { display: block; position: relative; width: 28px; height: 4px; border-radius: 4px; background: #c4ccc7; overflow: hidden; transition: width .3s ease; }
//         .hcx-dot[aria-current="true"] .hcx-dot-bar { width: 64px; }
//         .hcx-dot-fill { position: absolute; inset: 0; background: var(--forest); transform-origin: left; transform: scaleX(0); }
//         .hcx-dot[aria-current="true"] .hcx-dot-fill { animation: hcx-fill var(--dwell, 6s) linear forwards; }
//         .hcx-controls.is-paused .hcx-dot-fill { animation-play-state: paused; }
//         .hcx-controls.is-stopped .hcx-dot[aria-current="true"] .hcx-dot-fill { animation: none; transform: scaleX(1); }
//         .hcx-ctas { display: flex; flex-wrap: wrap; gap: 12px; }

//         /* Form: floats over the right of the slider on desktop */
//         .hcx-form-slot { position: absolute; z-index: 5; top: 32px; right: calc((100% - min(1240px, 100% - 48px)) / 2); width: var(--form-w); }
//         .hcx-form-card { background: #fff; color: var(--ink); border-radius: 12px; padding: clamp(22px, 3vw, 30px); box-shadow: 0 24px 60px rgba(5,20,15,.28); scroll-margin-top: 24px; }
//         .hcx-form-card h2 { font-size: 24px; line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; }
//         .hcx-form-intro { margin: 8px 0 18px; color: var(--muted); font-size: 14px; line-height: 1.55; }
//         .hcx-form { display: grid; gap: 14px; }
//         .hcx-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//         .hcx-field { display: grid; gap: 6px; min-width: 0; }
//         .hcx-field > span { font-size: 13px; font-weight: 600; }
//         .hcx-field em { font-style: normal; font-weight: 400; color: var(--muted); }
//         .hcx-field input, .hcx-field select { width: 100%; min-height: 46px; padding: 0 14px; border: 1px solid #b8c2bc; border-radius: 8px; background: #fff; color: var(--ink); font-size: 15px; font-weight: 400; }
//         .hcx-field input::placeholder { color: #7d8781; }
//         .hcx-field input[aria-invalid="true"] { border-color: #b42318; background: #fff8f7; }
//         .hcx-err { display: block; margin-top: 2px; color: #b42318; font-size: 12.5px; line-height: 1.4; font-weight: 500; }
//         .hcx-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
//         .hcx-consent { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: var(--muted); line-height: 1.5; }
//         .hcx-consent input { width: 18px; height: 18px; margin-top: 2px; accent-color: var(--forest); flex: 0 0 auto; }
//         .hcx-consent input[aria-invalid="true"] { outline: 2px solid #b42318; outline-offset: 2px; }
//         .hcx-consent a { color: var(--forest); text-decoration: underline; }
//         .hcx-form-submit { width: 100%; }

//         /* Stats */
//         .hcx-stats { background: var(--forest); color: #fff; }
//         .hcx-stats-grid { list-style: none; margin: 0 auto; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); }
//         .hcx-stats-grid li { padding: 28px 24px; border-left: 1px solid rgba(255,255,255,.16); }
//         .hcx-stats-grid li:first-child { border-left: 0; padding-left: 0; }
//         .hcx-stat-value { display: block; font-size: clamp(30px, 3.6vw, 44px); font-weight: 600; line-height: 1.1; letter-spacing: -0.02em; }
//         .hcx-stat-label { display: block; margin-top: 4px; font-size: 14px; color: rgba(255,255,255,.8); }

//         /* Ready-to-go designs */
//         .hcx-head { display: flex; justify-content: space-between; align-items: end; gap: 28px; flex-wrap: wrap; }
//         .hcx-ready-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 44px; }
//         .hcx-ready-card { display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: #fff; text-decoration: none; transition: box-shadow .2s ease, transform .2s ease; }
//         .hcx-ready-card:hover { box-shadow: 0 14px 34px rgba(18,59,48,.14); transform: translateY(-3px); }
//         .hcx-ready-img { aspect-ratio: 4 / 3; overflow: hidden; background: linear-gradient(135deg, var(--forest), var(--forest-soft)); }
//         .hcx-ready-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
//         .hcx-ready-card:hover .hcx-ready-img img { transform: scale(1.05); }
//         .hcx-ready-ph { display: grid; place-items: center; height: 100%; padding: 16px; color: #fff; font-size: 20px; font-weight: 600; text-align: center; }
//         .hcx-ready-body { display: flex; flex-direction: column; flex: 1; padding: 18px 18px 20px; }
//         .hcx-ready-body h3 { font-size: 18px; font-weight: 600; line-height: 1.3; }
//         .hcx-ready-body p { margin-top: 6px; color: var(--muted); font-size: 14px; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
//         .hcx-ready-cta { margin-top: auto; padding-top: 14px; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--forest); }
//         .hcx-foot { margin-top: 40px; display: flex; flex-wrap: wrap; gap: 12px; }

//         /* Luxury projects: name sits on the photo */
//         .hcx-luxury { background: var(--stone); }
//         .hcx-lux-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; margin-top: 44px; }
//         .hcx-lux-card { position: relative; display: block; grid-column: span 6; height: clamp(250px, 26vw, 380px); border-radius: 8px; overflow: hidden; text-decoration: none; color: #fff; background: linear-gradient(135deg, var(--forest), var(--forest-soft)); }
//         .hcx-lux-card:nth-child(4n+1), .hcx-lux-card:nth-child(4n) { grid-column: span 5; }
//         .hcx-lux-card:nth-child(4n+2), .hcx-lux-card:nth-child(4n+3) { grid-column: span 7; }
//         .hcx-lux-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
//         .hcx-lux-card:hover img { transform: scale(1.05); }
//         .hcx-lux-cap { position: absolute; left: 0; right: 0; bottom: 0; padding: 64px 22px 20px; background: linear-gradient(0deg, rgba(8,16,12,.78), rgba(8,16,12,0)); }
//         .hcx-lux-cap h3 { font-size: 24px; font-weight: 700; line-height: 1.2; color: #fff; text-shadow: 0 1px 8px rgba(0,0,0,.35); }
//         .hcx-lux-cap p { margin-top: 4px; display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: rgba(255,255,255,.92); }

//         /* Why us: three cards, no image */
//         .hcx-why { background: var(--forest); color: #fff; }
//         .hcx-why .hcx-lead { color: rgba(255,255,255,.82); }
//         .hcx-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px; }
//         .hcx-why-card { padding: 30px 28px 32px; border: 1px solid rgba(255,255,255,.2); border-radius: 14px; background: rgba(255,255,255,.06); transition: background-color .2s ease, transform .2s ease, border-color .2s ease; }
//         .hcx-why-card:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.36); transform: translateY(-4px); }
//         .hcx-why-icon { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 14px; background: var(--orange); color: var(--ink); }
//         .hcx-why-card h3 { margin-top: 22px; font-size: 22px; font-weight: 600; line-height: 1.25; color: #fff; }
//         .hcx-why-card p { margin-top: 10px; color: rgba(255,255,255,.84); font-size: 16px; }

//         /* Experience centers */
//         .hcx-center-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 44px; }
//         .hcx-center-card { display: flex; flex-direction: column; padding: 28px; border: 1px solid var(--line); border-radius: 14px; background: #fff; transition: box-shadow .2s ease, transform .2s ease; }
//         .hcx-center-card:hover { box-shadow: 0 14px 34px rgba(18,59,48,.12); transform: translateY(-3px); }
//         .hcx-center-pin { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: var(--stone); color: var(--forest); }
//         .hcx-center-card h3 { margin-top: 18px; font-size: 24px; line-height: 1.2; font-weight: 600; }
//         .hcx-center-tag { margin-top: 2px; font-size: 14px; color: var(--muted); }
//         .hcx-center-addr { margin-top: 16px; font-size: 15px; line-height: 1.6; color: var(--ink); }
//         .hcx-center-phone { margin-top: 12px; font-size: 15px; font-weight: 600; color: var(--forest); text-decoration: none; }
//         .hcx-center-actions { margin-top: auto; padding-top: 22px; display: flex; flex-wrap: wrap; gap: 10px; }
//         .hcx-center-actions .hcx-btn { min-height: 44px; padding: 0 18px; font-size: 15px; }
//         .hcx-more-centers { margin-top: 28px; color: var(--muted); font-size: 15px; }
//         .hcx-more-centers a { color: var(--forest); font-weight: 600; margin-left: 6px; }

//         /* Areas */
//         .hcx-areas { background: var(--stone); }
//         .hcx-chips { list-style: none; margin: 36px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
//         .hcx-chips a { display: inline-block; padding: 9px 18px; border: 1px solid #aab5ae; border-radius: 999px; background: #fff; text-decoration: none; font-size: 15px; font-weight: 500; transition: background-color .15s ease, color .15s ease, border-color .15s ease; }
//         .hcx-chips a:hover { background: var(--forest); color: #fff; border-color: var(--forest); }

//         /* FAQ */
//         .hcx-faq-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 88px); align-items: start; }
//         .hcx-faq-intro { position: sticky; top: 32px; }
//         .hcx-faq-item { border-top: 1px solid var(--line); }
//         .hcx-faq-item:last-child { border-bottom: 1px solid var(--line); }
//         .hcx-faq-item summary { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px 0; font-size: 18px; font-weight: 600; line-height: 1.35; cursor: pointer; list-style: none; }
//         .hcx-faq-item summary::-webkit-details-marker { display: none; }
//         .hcx-faq-item summary::after { content: "+"; flex: 0 0 auto; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: var(--stone); font-size: 22px; font-weight: 400; line-height: 1; }
//         .hcx-faq-item[open] summary::after { content: "–"; background: var(--orange); }
//         .hcx-faq-answer { padding: 0 52px 24px 0; color: var(--muted); font-size: 16px; }
//         .hcx-faq-answer p { margin: 0 0 10px; }
//         .hcx-faq-answer, .hcx-faq-answer * { color: var(--muted) !important; }

//         /* Final CTA */
//         .hcx-final { background: var(--ink); color: #fff; }
//         .hcx-final-inner { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 40px; align-items: center; }
//         .hcx-final h2 { font-size: clamp(30px, 4.4vw, 54px); line-height: 1.08; font-weight: 600; letter-spacing: -0.025em; max-width: 16ch; }
//         .hcx-final-desc { margin-top: 16px; max-width: 48ch; }
//         .hcx-final-desc, .hcx-final-desc * { color: rgba(255,255,255,.82) !important; }
//         .hcx-final-desc p { margin: 0; }
//         .hcx-final-actions { display: grid; gap: 12px; justify-items: stretch; }
//         .hcx-final-actions .hcx-btn-ghost { color: #fff; }

//         /* Mobile bar */
//         .hcx-mobile-bar { display: none; }
//         .hcx-modal-open { filter: none; }

//         @media (max-width: 1100px) {
//           .hcx-ready-grid { grid-template-columns: repeat(2, 1fr); }
//           .hcx-why-grid, .hcx-center-grid { grid-template-columns: repeat(2, 1fr); }
//         }
//         @media (max-width: 1023px) {
//           .hcx-stage { height: 580px; }
//           .hcx-intro { width: 100%; }
//           .hcx-wash { background: linear-gradient(180deg, rgba(238,241,238,.95) 0%, rgba(238,241,238,.88) 100%); }
//           .hcx-form-slot { position: static; width: auto; padding: 28px 16px 36px; background: var(--stone); }
//           .hcx-form-card { max-width: 560px; margin-inline: auto; box-shadow: 0 10px 30px rgba(5,20,15,.12); }
//         }
//         @media (max-width: 900px) {
//           .hcx-stats-grid { grid-template-columns: repeat(2, 1fr); }
//           .hcx-stats-grid li:nth-child(odd) { border-left: 0; padding-left: 0; }
//           .hcx-stats-grid li:nth-child(n+3) { border-top: 1px solid rgba(255,255,255,.16); }
//           .hcx-faq-grid, .hcx-final-inner { grid-template-columns: 1fr; }
//           .hcx-faq-intro { position: static; }
//           .hcx-lux-grid { grid-template-columns: repeat(2, 1fr); }
//           .hcx-lux-card, .hcx-lux-card:nth-child(n) { grid-column: span 1; }
//         }
//         @media (max-width: 700px) {
//           .hcx { padding-bottom: 72px; }
//           .hcx-wrap { width: calc(100% - 32px); }
//           .hcx-stage { height: 520px; }
//           .hcx-slide-banner .hcx-slide-img { object-fit: contain; }
//           .hcx-hero-desc { font-size: 16px; }
//           .hcx-ctabar-inner { flex-direction: column; align-items: stretch; gap: 12px; }
//           .hcx-controls { justify-content: center; }
//           .hcx-ctas .hcx-btn { flex: 1 1 0; min-width: 0; padding: 0 14px; }
//           .hcx-only-desktop { display: none !important; }
//           .hcx-form-row { grid-template-columns: 1fr; }
//           .hcx-ready-grid, .hcx-why-grid, .hcx-center-grid { grid-template-columns: 1fr; }
//           .hcx-lux-grid { grid-template-columns: 1fr; }
//           .hcx-lux-card { height: 260px; }
//           .hcx-foot .hcx-btn { width: 100%; }
//           .hcx-faq-item summary { font-size: 16px; }
//           .hcx-faq-answer { padding-right: 0; }
//           .hcx-final-actions .hcx-btn { width: 100%; }
//           .hcx-mobile-bar { position: fixed; z-index: 90; left: 0; right: 0; bottom: 0; display: grid; grid-template-columns: 1fr 1.6fr; gap: 10px; padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 0px)); background: #fff; box-shadow: 0 -6px 24px rgba(0,0,0,.14); }
//           .hcx-mobile-bar .hcx-btn { min-height: 48px; padding: 0 12px; font-size: 15px; }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .hcx *, .hcx *::before, .hcx *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; scroll-behavior: auto !important; }
//           .hcx-caret { animation: none; }
//         }
//       `}</style>

//       {/* Hero: infinite slider. Buttons live outside the slides so they never move. */}
//       <section
//         className="hcx-hero"
//         aria-label="High Creation Interior"
//         onFocusCapture={() => setFocused(true)}
//         onBlurCapture={() => setFocused(false)}
//       >
//         <h1 className="hcx-sr">{phrases[0]}</h1>

//         <div
//           className="hcx-stage"
//           role="region"
//           aria-roledescription="carousel"
//           aria-label="Featured interiors"
//           onMouseEnter={() => setHovered(true)}
//           onMouseLeave={() => setHovered(false)}
//         >
//           <div className={`hcx-slides ${count < 3 ? "is-fade" : ""}`}>
//             {slides.map((slide, i) => {
//               const state =
//                 i === pos.index ? "is-active" : i === pos.prev ? "is-leaving" : "is-waiting";
//               return (
//                 <div
//                   key={slide.key}
//                   className={`hcx-slide hcx-slide-${slide.kind} ${state}`}
//                   role="group"
//                   aria-roledescription="slide"
//                   aria-label={`${i + 1} of ${count}`}
//                   aria-hidden={state !== "is-active"}
//                 >
//                   {slide.kind === "intro" ? (
//                     <>
//                       <SlideImage src={HERO_INTERIOR} priority className="hcx-slide-img" />
//                       <div className="hcx-wash" />
//                       <div className="hcx-wrap hcx-intro-wrap">
//                         <div className="hcx-intro">
//                           <div className="hcx-typed" aria-hidden="true">
//                             <span>{typed}</span>
//                             <i className="hcx-caret" />
//                           </div>
//                           <Html className="hcx-hero-desc" html={heroDesc} />
//                           <ul className="hcx-points">
//                             {HERO_POINTS.map((point) => (
//                               <li key={point}><Tick /> {point}</li>
//                             ))}
//                           </ul>
//                         </div>
//                       </div>
//                     </>
//                   ) : null}

//                   {slide.kind === "banner" ? (
//                     <SlideImage src={heroImage} alt="High Creation Interior festive offer banner" className="hcx-slide-img" />
//                   ) : null}

//                   {slide.kind === "video" ? (
//                     <SlideVideo src={HERO_VIDEO} active={state !== "is-waiting"} />
//                   ) : null}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div className="hcx-ctabar">
//           <div className="hcx-wrap hcx-ctabar-inner">
//             <div
//               className={`hcx-controls ${paused ? "is-paused" : ""} ${!playing ? "is-stopped" : ""}`}
//               style={{ "--dwell": `${slides[pos.index]?.dwell || 6000}ms` }}
//             >
//               {count > 1 ? (
//                 <>
//                   <button
//                     type="button"
//                     className="hcx-playbtn"
//                     onClick={() => setPlaying((value) => !value)}
//                     aria-label={playing ? "Pause slideshow" : "Play slideshow"}
//                   >
//                     {playing ? <PauseIcon /> : <PlayIcon />}
//                   </button>
//                   {slides.map((slide, i) => (
//                     <button
//                       type="button"
//                       key={slide.key}
//                       className="hcx-dot"
//                       onClick={() => goTo(i)}
//                       aria-label={`Show slide ${i + 1} of ${count}`}
//                       aria-current={i === pos.index ? "true" : "false"}
//                     >
//                       <span className="hcx-dot-bar">
//                         {i === pos.index ? <span key={`${pos.index}-${playing}`} className="hcx-dot-fill" /> : null}
//                       </span>
//                     </button>
//                   ))}
//                 </>
//               ) : null}
//             </div>
//             <div className="hcx-ctas">
//               <a className="hcx-btn hcx-btn-primary" href="/estimator-for-home">Get a free estimate</a>
//               <a className="hcx-btn hcx-btn-outline hcx-only-desktop" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//               <a className="hcx-btn hcx-btn-outline" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
//             </div>
//           </div>
//         </div>

//         <div className="hcx-form-slot">
//           <LeadForm />
//         </div>
//       </section>

//       {/* Trust numbers */}
//       <section className="hcx-stats" aria-label="High Creation Interior at a glance">
//         <div className="hcx-wrap">
//           <ul className="hcx-stats-grid">
//             {STATS.map((stat) => (
//               <li key={stat.label}>
//                 <span className="hcx-stat-value">{stat.value}</span>
//                 <span className="hcx-stat-label">{stat.label}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>

//       {/* Ready-to-go designs */}
//       <section className="hcx-section" id="hcx-ready" aria-labelledby="hcx-ready-title">
//         <div className="hcx-wrap">
//           <div className="hcx-head">
//             <div>
//               <h2 id="hcx-ready-title" className="hcx-h2">Ready-to-go designs for every room</h2>
//               <p className="hcx-lead">Thoughtfully crafted interiors that combine good looks with smart functionality. Pick a room and start from a design you like.</p>
//             </div>
//             <a className="hcx-link" href="/ready-togo-design">View all designs <Arrow /></a>
//           </div>
//           <div className="hcx-ready-grid">
//             {readyCards.map((card) => (
//               <a className="hcx-ready-card" key={card.id} href={card.href}>
//                 <div className="hcx-ready-img">
//                   {card.image ? (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img src={card.image} alt={card.alt || `${card.title} interior design by High Creation Interior`} loading="lazy" decoding="async" width="640" height="480" />
//                   ) : (
//                     <span className="hcx-ready-ph">{card.title}</span>
//                   )}
//                 </div>
//                 <div className="hcx-ready-body">
//                   <h3>{card.title}</h3>
//                   {card.text ? <p>{card.text}</p> : null}
//                   <span className="hcx-ready-cta">View designs <Arrow /></span>
//                 </div>
//               </a>
//             ))}
//           </div>
//           <div className="hcx-foot">
//             <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Get a free consultation</a>
//           </div>
//         </div>
//       </section>

//       {/* Luxury projects */}
//       <section className="hcx-section hcx-luxury" id="hcx-luxury" aria-labelledby="hcx-luxury-title">
//         <div className="hcx-wrap">
//           <div className="hcx-head">
//             <div>
//               <h2 id="hcx-luxury-title" className="hcx-h2">Luxury project concepts</h2>
//               <p className="hcx-lead">Feel the luxury. Live the experience. Premium materials, bespoke details and timeless design in every home we create.</p>
//             </div>
//             <a className="hcx-link" href="/luxury-projects/">View all luxury projects <Arrow /></a>
//           </div>
//           <div className="hcx-lux-grid">
//             {luxuryCards.map((card) => (
//               <a className="hcx-lux-card" key={card.id} href={card.href}>
//                 {card.image ? (
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img src={card.image} alt={card.alt || `${card.title}, luxury interior by High Creation Interior`} loading="lazy" decoding="async" />
//                 ) : null}
//                 <div className="hcx-lux-cap">
//                   <h3>{card.title}</h3>
//                   <p>{card.text || "View project"} {!card.text ? <Arrow /> : null}</p>
//                 </div>
//               </a>
//             ))}
//           </div>
//           <div className="hcx-foot">
//             <a className="hcx-btn hcx-btn-outline" href="/luxury-projects/">Explore luxury projects</a>
//             <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Talk to a designer</a>
//           </div>
//         </div>
//       </section>

//       {/* Why High Creation Interior: three cards */}
//       <section className="hcx-section hcx-why" aria-labelledby="hcx-why-title">
//         <div className="hcx-wrap">
//           <h2 id="hcx-why-title" className="hcx-h2">Your space designed around you, not around a fixed design</h2>
//           <p className="hcx-lead">One team handles design and production, so what you approve is what gets built.</p>
//           <div className="hcx-why-grid">
//             {WHY_POINTS.map((point) => (
//               <article className="hcx-why-card" key={point.key}>
//                 <span className="hcx-why-icon">{WHY_ICONS[point.key]}</span>
//                 <h3>{point.title}</h3>
//                 <p>{point.text}</p>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Experience centers */}
//       <section className="hcx-section" id="hcx-centers" aria-labelledby="hcx-centers-title">
//         <div className="hcx-wrap">
//           <div className="hcx-head">
//             <div>
//               <h2 id="hcx-centers-title" className="hcx-h2">Visit an experience center near you</h2>
//               <p className="hcx-lead">Walk through finished rooms, feel the materials and talk to a designer in person.</p>
//             </div>
//           </div>
//           <div className="hcx-center-grid">
//             {CENTER_CARDS.map((center) => (
//               <article className="hcx-center-card" key={center.city}>
//                 <span className="hcx-center-pin"><PinIcon /></span>
//                 <h3>{center.city}</h3>
//                 <p className="hcx-center-tag">Experience center</p>
//                 <p className="hcx-center-addr">{center.address}</p>
//                 <a className="hcx-center-phone" href={PHONE_TEL}>{PHONE_LABEL}</a>
//                 <div className="hcx-center-actions">
//                   <a className="hcx-btn hcx-btn-primary" href={mapsUrl(center.address)} target="_blank" rel="noreferrer">Get directions</a>
//                   <a className="hcx-btn hcx-btn-outline" href={center.href}>See the center</a>
//                 </div>
//               </article>
//             ))}
//           </div>
//           <p className="hcx-more-centers">
//             Also visit us in
//             {OTHER_CENTERS.map((center, index) => (
//               <a key={center.label} href={center.href}>{center.label}{index < OTHER_CENTERS.length - 1 ? "," : ""}</a>
//             ))}
//           </p>
//         </div>
//       </section>

//       {/* Where we work */}
//       <section className="hcx-section hcx-areas" aria-labelledby="hcx-areas-title">
//         <div className="hcx-wrap">
//           <h2 id="hcx-areas-title" className="hcx-h2">Areas we serve across Delhi NCR</h2>
//           <p className="hcx-lead">Pick your area to see how we design and deliver homes there.</p>
//           <ul className="hcx-chips">
//             {AREAS.map((area) => (
//               <li key={area.label}><a href={area.href}>{area.label}</a></li>
//             ))}
//           </ul>
//         </div>
//       </section>

//       {/* FAQ (CMS: faqs) */}
//       {faqLoading || faqError || faqs.length > 0 ? (
//         <section className="hcx-section" aria-labelledby="hcx-faq-title">
//           <div className="hcx-wrap hcx-faq-grid">
//             <div className="hcx-faq-intro">
//               <h2 id="hcx-faq-title" className="hcx-h2">Questions before you begin</h2>
//               <p className="hcx-lead">Clear answers to the things people ask us most. Still unsure? Call us and we will walk you through it.</p>
//               <a className="hcx-link" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//             </div>
//             <div>
//               {faqLoading ? <p className="hcx-lead">Loading FAQs…</p> : null}
//               {faqError ? <p className="hcx-lead">{faqError}</p> : null}
//               {!faqLoading && !faqError && faqs.map((faq, index) => (
//                 <details className="hcx-faq-item" key={faq.key} open={index === 0}>
//                   <summary>{faq.title || "Frequently asked question"}</summary>
//                   <Html className="hcx-faq-answer" html={faq.description || ""} />
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>
//       ) : null}

//       {/* Final CTA */}
//       <section className="hcx-section hcx-final" aria-labelledby="hcx-final-title">
//         <div className="hcx-wrap hcx-final-inner">
//           <div>
//             <h2 id="hcx-final-title">{data6?.top_title || "Let’s plan the home you want to come back to."}</h2>
//             <Html
//               className="hcx-final-desc"
//               html={data6?.top_description || "Tell us about your space. A High Creation Interior designer will help you plan a practical, personal next step."}
//             />
//           </div>
//           <div className="hcx-final-actions">
//             <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Book free consultation</a>
//             <a className="hcx-btn hcx-btn-ghost" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//             <a className="hcx-btn hcx-btn-ghost" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
//           </div>
//         </div>
//       </section>

//       {/* Mobile sticky actions: always on screen */}
//       <div className="hcx-mobile-bar">
//         <a className="hcx-btn hcx-btn-outline" href={PHONE_TEL}>Call us</a>
//         <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Book free consultation</a>
//       </div>

//       <ContactUsPopUp onModalStateChange={handleModalStateChange} />
//     </div>
//   );
// }




// "use client";

// import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import DOMPurify from "isomorphic-dompurify";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import api from "@/utils/api";
// import { buildLeadMetadata } from "@/utils/leadForms";
// import { leadSchema, normalizePhone } from "@/utils/leadValidation";

// // Lazy-loaded: triggered later by scroll/time/exit intent, must not delay first paint.
// const ContactUsPopUp = dynamic(() => import("../components/ContactUsPopUp"), {
//   ssr: false,
// });

// /* -------------------------------------------------------------------------- */
// /*  Static content, taken from https://www.hcinterior.in/                     */
// /* -------------------------------------------------------------------------- */

// // Put hero-interior.webp in  public/images/landing/  (delivered next to this file).
// const HERO_INTERIOR = "/images/landing/hero-interior.webp";

// const PHONE_TEL = "tel:+917070701373";
// const PHONE_LABEL = "+91 70707 01373";
// const WHATSAPP = "https://wa.me/919560277787";

// const HERO_POINTS = [
//   "Free design consultation",
//   "Complete customization",
//   "In-house production",
// ];

// // Typed in the banner. The CMS headline (if any) is always typed first.
// const TYPED_PHRASES = [
//   "Designed around you, not around a fixed design.",
//   "Made in our own production facility.",
//   "Complete customization for every room.",
//   "2,750+ projects completed across Delhi NCR.",
// ];

// // `end` is what the number counts up to when the section scrolls into view.
// const STATS = [
//   { end: 8, suffix: "+", label: "years of experience" },
//   { end: 2750, suffix: "+", label: "projects completed" },
//   { end: 450, suffix: "+", label: "people on our team" },
//   { end: 5, suffix: "", label: "branches across NCR" },
// ];

// const WHY_POINTS = [
//   {
//     key: "custom",
//     title: "Complete customization",
//     text: "Every project is designed around your vision, your space and your lifestyle, not a fixed catalogue.",
//   },
//   {
//     key: "inhouse",
//     title: "In-house production",
//     text: "We make furniture, fixtures and design elements in our own facility, so quality, cost and timelines stay in our hands.",
//   },
//   {
//     key: "team",
//     title: "One team, one roof",
//     text: "Design and production are managed together, which means fewer third-party vendors and a smoother process.",
//   },
// ];

// // Addresses are from hcinterior.in/contact
// const CENTER_CARDS = [
//   {
//     city: "Noida",
//     address: "H101, LGF, Sector-63, Noida, Uttar Pradesh - 201301",
//     href: "/experience-center/",
//   },
//   {
//     city: "Noida Extension",
//     address: "Galaxy Blue Sapphire Plaza, Noida Extension, Haibatpur, Sector 4, Greater Noida, Uttar Pradesh 201305",
//     href: "/experience-center-noida-extension/",
//   },
//   {
//     city: "Gurugram",
//     address: "DDC Arcade, 1st Floor, Plot No 1 Main, Sector 48 Road, Badshahpur Sohna Rd, Opposite Vipul Business Park, Gurugram, Haryana 122018",
//     href: "/experience-center-gurugram/",
//   },
// ];

// const OTHER_CENTERS = [
//   { label: "Faridabad", href: "/experience-center-faridabad/" },
//   { label: "New Delhi", href: "/experience-center-new-delhi/" },
// ];

// const AREAS = [
//   { label: "Noida", href: "/interior-designers-in-noida" },
//   { label: "Greater Noida", href: "/interior-designers-in-greater-noida" },
//   { label: "Noida Extension", href: "/interior-designer-in-noida-extension" },
//   { label: "Ghaziabad", href: "/interior-designers-in-ghaziabad" },
//   { label: "Delhi", href: "/interior-designers-in-delhi" },
//   { label: "Dwarka", href: "/interior-designers-in-dwarka" },
//   { label: "Gurugram", href: "/interior-designers-in-gurgaon" },
//   { label: "Faridabad", href: "/interior-designers-in-faridabad" },
//   { label: "Manesar", href: "/interior-designers-in-manesar" },
//   { label: "Sohna", href: "/interior-designer-in-sohna-gurgaon" },
// ];

// const PROPERTY_TYPES = ["1 BHK", "2 BHK", "3 BHK", "4 BHK or larger", "Villa / builder floor"];

// // Same CMS parent-child type that powers /ready-togo-design.
// // Verify this name against ready-togo-design/page.jsx (and keep it in sync with page.jsx).
// const READY_TO_GO_TYPE = "ready_to_go_design";

// // CMS parent-child type behind /luxury-projects. The exact name is not visible from outside
// // the site, so the first one of these that returns data is used. Open
// // luxury-projects/page.jsx, copy the real name, and put it FIRST in this list.
// // The browser console warns if none of them returns anything.
// const LUXURY_TYPES = ["luxury_projects", "luxury_project", "luxury_projects_design", "luxury_design", "luxury"];

// // Shown only if the CMS returns nothing. Copy is from hcinterior.in/ready-togo-design.
// const READY_FALLBACK = [
//   { id: "living", title: "Living Room", text: "Design a living room that blends style and function, perfect for relaxation and gatherings.", href: "/ready-togo-design/gallery?id=5" },
//   { id: "kitchen", title: "Modular Kitchen", text: "Your kitchen deserves perfection. Let’s create the dream space where cooking and style come together.", href: "/ready-togo-design/gallery?id=6" },
//   { id: "master", title: "Master Bedroom", text: "Transform your master bedroom into a luxurious retreat where elegance and comfort create perfect tranquility.", href: "/ready-togo-design/gallery?id=3" },
//   { id: "kids", title: "Kids Room", text: "A playful, cozy and colorful design that sparks creativity and fun.", href: "/ready-togo-design/gallery?id=7" },
//   { id: "dining", title: "Dining", text: "Where every meal feels like a celebration. A stylish haven of comfort and elegance.", href: "/ready-togo-design/gallery?id=9" },
//   { id: "mandir", title: "Mandir", text: "A serene sanctuary where devotion and design come together beautifully.", href: "/ready-togo-design/gallery?id=4" },
//   { id: "parents", title: "Parents Room", text: "A haven of comfort and peace, designed with care.", href: "/ready-togo-design/gallery?id=1" },
//   { id: "entrance", title: "Entrance", text: "Make a lasting first impression with a welcoming, functional entryway.", href: "/ready-togo-design/gallery?id=8" },
// ];

// // Luxury project categories from hcinterior.in/luxury-projects (ids match project-gallery?id=).
// // PREFERRED decides which six are shown when the CMS has more.
// const LUXURY_PREFERRED_IDS = [23, 22, 18, 17, 16, 3];
// const LUXURY_FALLBACK = [
//   { id: 23, title: "Living Room" },
//   { id: 22, title: "Premium Bedroom" },
//   { id: 18, title: "Luxury Dining" },
//   { id: 17, title: "Luxury Bathroom" },
//   { id: 16, title: "Luxury Dressing Room" },
//   { id: 3, title: "Bar Area" },
// ].map((item) => ({
//   ...item,
//   text: "",
//   image: null,
//   href: `/luxury-projects/project-gallery?id=${item.id}`,
// }));

// /* -------------------------------------------------------------------------- */
// /*  Helpers                                                                    */
// /* -------------------------------------------------------------------------- */

// const Html = memo(function Html({ html, className = "" }) {
//   const clean = useMemo(() => DOMPurify.sanitize(html || ""), [html]);
//   return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
// });

// const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// // A parent-child record can carry its card data on either side. Use the side that has content.
// const cardContent = (record, preferParent = false) => {
//   const child = record?.child_content;
//   const parent = record?.parent_content;
//   const [first, second] = preferParent ? [parent, child] : [child, parent];
//   if (first && (first.title || first.image)) return first;
//   return second || first || {};
// };

// // Cover image: the CMS has used different field names over time.
// const pickImage = (c) => {
//   const first = Array.isArray(c?.images) ? c.images[0] : null;
//   return (
//     c?.image ||
//     c?.cover_image ||
//     c?.thumbnail ||
//     c?.banner_image ||
//     c?.main_image ||
//     (typeof first === "string" ? first : first?.image || first?.url) ||
//     null
//   );
// };

// const OPTIMIZED_HOSTS = ["hcinterior.in", "www.hcinterior.in", "apidev.hcinterior.in", "localhost"];

// function canOptimize(src) {
//   if (!src || src.startsWith("//")) return false;
//   if (src.startsWith("/")) return true;
//   try {
//     return OPTIMIZED_HOSTS.includes(new URL(src).hostname);
//   } catch {
//     return false;
//   }
// }

// function SlideImage({ src, alt = "", priority = false, className = "" }) {
//   if (!src) return null;
//   if (canOptimize(src)) {
//     return <Image src={src} alt={alt} fill priority={priority} sizes="100vw" quality={80} className={className} />;
//   }
//   // eslint-disable-next-line @next/next/no-img-element
//   return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" className={className} />;
// }

// // Types each phrase, holds, deletes, then moves to the next, forever.
// function useTypewriter(phrases, reduceMotion) {
//   const [text, setText] = useState("");
//   const key = phrases.join("|");

//   useEffect(() => {
//     const list = key.split("|").filter(Boolean);
//     if (!list.length) return undefined;
//     if (reduceMotion) {
//       setText(list[0]);
//       return undefined;
//     }

//     let phraseIndex = 0;
//     let charIndex = 0;
//     let deleting = false;
//     let timer;

//     const tick = () => {
//       const phrase = list[phraseIndex];
//       if (!deleting) {
//         charIndex += 1;
//         setText(phrase.slice(0, charIndex));
//         if (charIndex >= phrase.length) {
//           deleting = true;
//           timer = window.setTimeout(tick, 1900);
//           return;
//         }
//         timer = window.setTimeout(tick, 46);
//       } else {
//         charIndex -= 1;
//         setText(phrase.slice(0, Math.max(charIndex, 0)));
//         if (charIndex <= 0) {
//           deleting = false;
//           phraseIndex = (phraseIndex + 1) % list.length;
//           timer = window.setTimeout(tick, 320);
//           return;
//         }
//         timer = window.setTimeout(tick, 20);
//       }
//     };

//     timer = window.setTimeout(tick, 450);
//     return () => window.clearTimeout(timer);
//   }, [key, reduceMotion]);

//   return text;
// }

// // Counts from 0 to `end` the first time it scrolls into view.
// function CountUp({ end, suffix = "", duration = 1900, reduceMotion }) {
//   const ref = useRef(null);
//   const [value, setValue] = useState(end);

//   useEffect(() => {
//     const el = ref.current;
//     if (!el || reduceMotion || typeof IntersectionObserver === "undefined") {
//       setValue(end);
//       return undefined;
//     }

//     setValue(0);
//     let raf = 0;
//     let started = false;

//     const run = () => {
//       const startTime = performance.now();
//       const step = (now) => {
//         const t = Math.min((now - startTime) / duration, 1);
//         const eased = 1 - Math.pow(1 - t, 3); // fast start, gentle landing
//         setValue(Math.round(end * eased));
//         if (t < 1) raf = requestAnimationFrame(step);
//       };
//       raf = requestAnimationFrame(step);
//     };

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && !started) {
//           started = true;
//           run();
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.4 }
//     );
//     observer.observe(el);

//     return () => {
//       observer.disconnect();
//       cancelAnimationFrame(raf);
//     };
//   }, [end, duration, reduceMotion]);

//   return (
//     <span ref={ref} className="hcx-count">
//       {value.toLocaleString("en-IN")}
//       {suffix}
//     </span>
//   );
// }

// const Arrow = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
//     <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const Tick = () => (
//   <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
//     <circle cx="9" cy="9" r="9" fill="#ff8b49" />
//     <path d="M5 9.3l2.6 2.6L13 6.6" stroke="#18201c" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const PinIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//     <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//     <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
//   </svg>
// );

// const WHY_ICONS = {
//   custom: (
//     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
//       <path d="M4 8h20M4 14h20M4 20h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//       <circle cx="9" cy="8" r="2.6" fill="#ff8b49" stroke="currentColor" strokeWidth="1.8" />
//       <circle cx="19" cy="14" r="2.6" fill="#ff8b49" stroke="currentColor" strokeWidth="1.8" />
//       <circle cx="12" cy="20" r="2.6" fill="#ff8b49" stroke="currentColor" strokeWidth="1.8" />
//     </svg>
//   ),
//   inhouse: (
//     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
//       <path d="M3 24V12l7 4v-4l7 4v-4l8 4v8H3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//       <path d="M19 12V4h4v10" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//       <path d="M8 24v-4h4v4M15 24v-4h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//     </svg>
//   ),
//   team: (
//     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
//       <path d="M3 13.5 14 4l11 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//       <path d="M6 12v12h16V12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//       <circle cx="11" cy="15.5" r="2" stroke="currentColor" strokeWidth="1.6" />
//       <circle cx="17.5" cy="15.5" r="2" stroke="currentColor" strokeWidth="1.6" />
//       <path d="M8 22c.4-2 1.6-3 3-3s2.6 1 3 3M14.5 22c.4-2 1.6-3 3-3s2.6 1 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
//   ),
// };

// /* -------------------------------------------------------------------------- */
// /*  Lead form (react-hook-form + zod, same API + tracking as before)           */
// /* -------------------------------------------------------------------------- */

// const EMPTY_FORM = {
//   fullName: "",
//   contact: "",
//   email: "",
//   place: "",
//   property: "",
//   termsAndConditions: false,
//   website: "",
// };

// const CTA_TEXT = "Book free consultation";

// function LeadForm() {
//   const pathname = usePathname();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(leadSchema),
//     defaultValues: EMPTY_FORM,
//     mode: "onTouched", // validate when a field is left, then live while fixing it
//   });

//   const onSubmit = async (values) => {
//     if (values.website) return; // honeypot filled: bot, silently ignore

//     const requestData = {
//       name: values.fullName.trim().replace(/\s+/g, " "),
//       mobile: normalizePhone(values.contact), // always a clean 10-digit number
//       email: values.email.trim().toLowerCase(),
//       place: values.place.trim(),
//       query: values.property ? `Property type: ${values.property}` : "",
//       ...buildLeadMetadata({
//         pathname,
//         leadFormType: "inline",
//         leadFormName: "Creating The Home Of Your Dreams Lead Form",
//         ctaText: CTA_TEXT.toUpperCase(),
//       }),
//     };

//     try {
//       const response = await api.post("/user-queries", requestData);
//       if (response.status === 201) {
//         reset(EMPTY_FORM);
//         toast.success("Thank you. Our team will be in touch soon.");
//         window.setTimeout(() => {
//           window.location.href = "/thank-you";
//         }, 300);
//       } else {
//         toast.error("We could not submit your details. Please try again.");
//       }
//     } catch (error) {
//       toast.error(error?.message || "Something went wrong. Please try again.");
//       console.error("HCI landing enquiry submission failed:", error);
//     }
//   };

//   return (
//     <div className="hcx-form-card" id="hcx-enquiry-form">
//       <h2>Get a free design consultation</h2>
//       <p className="hcx-form-intro">Share a few details and a designer will call you to plan the next step.</p>
//       <form onSubmit={handleSubmit(onSubmit)} className="hcx-form" noValidate>
//         <label className="hcx-field">
//           <span>Your name</span>
//           <input
//             type="text"
//             autoComplete="name"
//             placeholder="Full name"
//             maxLength={60}
//             aria-invalid={errors.fullName ? "true" : "false"}
//             {...register("fullName")}
//           />
//           {errors.fullName ? <small className="hcx-err" role="alert">{errors.fullName.message}</small> : null}
//         </label>

//         <label className="hcx-field">
//           <span>Mobile number</span>
//           <input
//             type="tel"
//             autoComplete="tel"
//             inputMode="tel"
//             placeholder="10-digit mobile number"
//             maxLength={16}
//             aria-invalid={errors.contact ? "true" : "false"}
//             {...register("contact")}
//           />
//           {errors.contact ? <small className="hcx-err" role="alert">{errors.contact.message}</small> : null}
//         </label>

//         <label className="hcx-field">
//           <span>Email address</span>
//           <input
//             type="email"
//             autoComplete="email"
//             placeholder="you@example.com"
//             maxLength={100}
//             aria-invalid={errors.email ? "true" : "false"}
//             {...register("email")}
//           />
//           {errors.email ? <small className="hcx-err" role="alert">{errors.email.message}</small> : null}
//         </label>

//         <div className="hcx-form-row">
//           <label className="hcx-field">
//             <span>City <em>(optional)</em></span>
//             <input
//               type="text"
//               autoComplete="address-level2"
//               placeholder="Noida, Gurugram…"
//               maxLength={50}
//               aria-invalid={errors.place ? "true" : "false"}
//               {...register("place")}
//             />
//             {errors.place ? <small className="hcx-err" role="alert">{errors.place.message}</small> : null}
//           </label>
//           <label className="hcx-field">
//             <span>Property <em>(optional)</em></span>
//             <select {...register("property")}>
//               <option value="">Select</option>
//               {PROPERTY_TYPES.map((type) => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//           </label>
//         </div>

//         {/* Honeypot: hidden from people, bots tend to fill it */}
//         <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hcx-hp" {...register("website")} />

//         <div>
//           <label className="hcx-consent">
//             <input type="checkbox" aria-invalid={errors.termsAndConditions ? "true" : "false"} {...register("termsAndConditions")} />
//             <span>
//               I agree to the <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a> and terms.
//             </span>
//           </label>
//           {errors.termsAndConditions ? <small className="hcx-err" role="alert">{errors.termsAndConditions.message}</small> : null}
//         </div>

//         <button className="hcx-btn hcx-btn-primary hcx-form-submit" type="submit" disabled={isSubmitting}>
//           {isSubmitting ? "Sending…" : CTA_TEXT}
//         </button>
//       </form>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  Page                                                                       */
// /* -------------------------------------------------------------------------- */

// async function fetchSection(endpoint, setter) {
//   try {
//     const response = await api.get(endpoint, {});
//     if (response?.data?.json_content) setter(response.data.json_content);
//   } catch (error) {
//     console.error(`HCI landing CMS request failed (${endpoint}):`, error);
//   }
// }

// // Tries each CMS type name in order and returns the first list that has records.
// async function fetchFirstAvailable(types) {
//   for (const type of types) {
//     try {
//       const response = await api.get(`/cms-parent-child/${type}`);
//       if (Array.isArray(response?.data) && response.data.length) return { type, data: response.data };
//     } catch {
//       /* try the next name */
//     }
//   }
//   return null;
// }

// export default function HCLandingPage({ initialData }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [data1, setData1] = useState(initialData?.data1 ?? null);
//   const [data6, setData6] = useState(initialData?.data6 ?? null);
//   const [faqData, setFaqData] = useState(initialData?.faqs ?? []);
//   const [faqLoading, setFaqLoading] = useState(initialData?.faqs == null);
//   const [faqError, setFaqError] = useState("");
//   const [readyDesigns, setReadyDesigns] = useState(initialData?.readyDesigns ?? []);
//   const [luxuryDesigns, setLuxuryDesigns] = useState(initialData?.luxuryDesigns ?? []);
//   const [reduceMotion, setReduceMotion] = useState(false);

//   // Anything the server could not fetch is fetched here.
//   useEffect(() => {
//     const init = initialData || {};
//     if (!init.data1) fetchSection("/cms-content/creating_the_home_of_your_dreams", setData1);
//     if (!init.data6) fetchSection("/cms-content/creating_the_home_of_your_dreams_6", setData6);

//     if (init.faqs == null) {
//       api.get("/cms-content/faqs")
//         .then((response) => setFaqData(Array.isArray(response?.data) ? response.data : []))
//         .catch(() => setFaqError("FAQs could not be loaded right now."))
//         .finally(() => setFaqLoading(false));
//     }
//     if (init.readyDesigns == null) {
//       api.get(`/cms-parent-child/${READY_TO_GO_TYPE}`)
//         .then((response) => setReadyDesigns(Array.isArray(response?.data) ? response.data : []))
//         .catch((error) => console.error("HCI ready-to-go designs failed to load:", error));
//     }
//     if (init.luxuryDesigns == null) {
//       fetchFirstAvailable(LUXURY_TYPES).then((result) => {
//         if (result) setLuxuryDesigns(result.data);
//         else console.warn(`HCI luxury projects: none of these CMS types returned data: ${LUXURY_TYPES.join(", ")}. Set the real name in LUXURY_TYPES.`);
//       });
//     }
//   }, [initialData]);

//   // Respect "reduce motion": no typing loop, no counting.
//   useEffect(() => {
//     const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
//     const apply = () => setReduceMotion(Boolean(mq?.matches));
//     apply();
//     mq?.addEventListener?.("change", apply);
//     return () => mq?.removeEventListener?.("change", apply);
//   }, []);

//   /* ---------------------------- Hero content ---------------------------- */

//   const cmsHeadline = stripHtml(data1?.mid_sub_title);
//   const heroDesc =
//     data1?.top_description ||
//     "Customized home interiors across Delhi NCR, planned with you and made in our own production facility.";

//   const phrases = useMemo(() => [cmsHeadline, ...TYPED_PHRASES].filter(Boolean), [cmsHeadline]);
//   const typed = useTypewriter(phrases, reduceMotion);

//   /* --------------------------- Section content --------------------------- */

//   const readyCards = useMemo(() => {
//     const fromCms = [...readyDesigns]
//       .sort((a, b) => Number(a.id) - Number(b.id))
//       .slice(0, 8)
//       .map((record) => {
//         const c = cardContent(record);
//         return {
//           id: record.id,
//           title: c.title,
//           text: stripHtml(c.description),
//           image: pickImage(c),
//           alt: c.image_alt,
//           href: `/ready-togo-design/gallery?id=${record.id}`,
//         };
//       })
//       .filter((card) => card.title);
//     return fromCms.length ? fromCms : READY_FALLBACK;
//   }, [readyDesigns]);

//   const luxuryCards = useMemo(() => {
//     const cards = luxuryDesigns
//       .map((record) => {
//         const c = cardContent(record, true);
//         return {
//           id: record.id,
//           title: c.title,
//           text: stripHtml(c.description),
//           image: pickImage(c),
//           alt: c.image_alt,
//           href: `/luxury-projects/project-gallery?id=${record.id}`,
//         };
//       })
//       .filter((card) => card.title);
//     if (!cards.length) return LUXURY_FALLBACK;
//     const preferred = LUXURY_PREFERRED_IDS
//       .map((id) => cards.find((card) => Number(card.id) === id))
//       .filter(Boolean);
//     const rest = cards
//       .filter((card) => !preferred.includes(card))
//       .sort((a, b) => Number(b.id) - Number(a.id));
//     return [...preferred, ...rest].slice(0, 6);
//   }, [luxuryDesigns]);

//   const faqs = useMemo(
//     () =>
//       faqData
//         .map((faq) => faq?.json_content || faq || {})
//         .map((item, index) => ({ ...item, key: faqData[index]?.id || `${item.title}-${index}` }))
//         .filter((item) => item.title || item.description),
//     [faqData]
//   );
//   const handleModalStateChange = useCallback((open) => setIsModalOpen(open), []);

//   const mapsUrl = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

//   return (
//     <div className={`hcx ${isModalOpen ? "hcx-modal-open" : ""}`}>
//       <style jsx global>{`
//         .hcx {
//           --ink: #18201c;
//           --forest: #123b30;
//           --forest-soft: #1c4e41;
//           --stone: #eef1ee;
//           --muted: #56605a;
//           --line: #d5dcd7;
//           --orange: #ff8b49;
//           --orange-hover: #f27a35;
//           --hcx-font: var(--font-poppins, system-ui), system-ui, Arial, sans-serif;
//           --form-w: clamp(360px, 36vw, 420px);
//           color: var(--ink);
//           background: #fff;
//           font-family: var(--hcx-font);
//           font-size: 16px;
//           line-height: 1.6;
//           overflow: clip;
//         }
//         .hcx *, .hcx *::before, .hcx *::after { box-sizing: border-box; }
//         .hcx img, .hcx video { max-width: 100%; display: block; }
//         .hcx a { color: inherit; }
//         .hcx h1, .hcx h2, .hcx h3, .hcx p { margin: 0; }
//         .hcx h1, .hcx h2, .hcx h3 { color: inherit; font-family: inherit; }
//         .hcx button, .hcx input, .hcx select { font-family: var(--hcx-font); }
//         .hcx .hcx-field input, .hcx .hcx-field select, .hcx .hcx-field input::placeholder { font-family: var(--hcx-font) !important; }
//         .hcx-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
//         .hcx-wrap { width: min(1240px, calc(100% - 48px)); margin-inline: auto; }
//         .hcx-section { padding-block: clamp(56px, 8vw, 104px); }
//         .hcx-h2 { font-size: clamp(28px, 3.6vw, 44px); line-height: 1.12; font-weight: 600; letter-spacing: -0.02em; max-width: 22ch; }
//         .hcx-lead { margin-top: 14px; max-width: 58ch; color: var(--muted); font-size: 17px; }

//         /* Headings on dark backgrounds: the site's global heading colour was winning, so force white. */
//         .hcx .hcx-why h2, .hcx .hcx-why h3,
//         .hcx .hcx-final h2,
//         .hcx .hcx-lux-cap h3 {
//           color: #fff !important;
//           -webkit-text-fill-color: #fff;
//         }

//         /* Buttons */
//         .hcx-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 50px; padding: 0 26px; border: 2px solid transparent; border-radius: 8px; font-size: 16px; font-weight: 600; line-height: 1; text-decoration: none; cursor: pointer; transition: background-color .18s ease, border-color .18s ease, color .18s ease; }
//         .hcx-btn-primary { background: var(--orange); border-color: var(--orange); color: var(--ink) !important; }
//         .hcx-btn-primary:hover { background: var(--orange-hover); border-color: var(--orange-hover); }
//         .hcx-btn-ghost { background: transparent; border-color: currentColor; }
//         .hcx-btn-ghost:hover { background: rgba(255,255,255,.12); }
//         .hcx-btn-outline { border-color: var(--forest); color: var(--forest); background: transparent; }
//         .hcx-btn-outline:hover { background: var(--forest); color: #fff; }
//         .hcx-btn:disabled { opacity: .7; cursor: progress; }
//         .hcx a:focus-visible, .hcx button:focus-visible, .hcx input:focus-visible, .hcx select:focus-visible, .hcx summary:focus-visible { outline: 3px solid var(--orange); outline-offset: 3px; }
//         .hcx-link { display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; font-weight: 600; font-size: 15px; color: var(--forest); text-decoration: none; border-bottom: 2px solid var(--orange); padding-bottom: 2px; }
//         .hcx-link:hover { color: #000; }

//         /* ------------------------------ Hero banner ------------------------------ */
//         .hcx-hero { position: relative; background: var(--stone); }
//         .hcx-stage { position: relative; height: clamp(720px, 46vw, 800px); overflow: hidden; background: linear-gradient(135deg, #e3e8e4, #eef1ee); }
//         .hcx-slide-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
//         .hcx-wash { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(238,241,238,.97) 0%, rgba(238,241,238,.9) 38%, rgba(238,241,238,.4) 62%, rgba(238,241,238,0) 82%); }
//         .hcx-intro-wrap { position: relative; height: 100%; display: flex; align-items: center; }
//         .hcx-intro { width: min(660px, calc(100% - var(--form-w) - 40px)); padding-block: 48px; }
//         .hcx-typed { font-size: clamp(34px, 4.4vw, 62px); line-height: 1.08; font-weight: 600; letter-spacing: -0.03em; min-height: calc(1.08em * 4); color: var(--ink); }
//         .hcx-caret { display: inline-block; width: 3px; height: .85em; margin-left: 5px; vertical-align: -0.08em; background: var(--orange); animation: hcx-blink 1s steps(1) infinite; }
//         .hcx-hero-desc { margin-top: 18px; max-width: 48ch; font-size: 17px; }
//         .hcx-hero-desc, .hcx-hero-desc * { color: var(--ink) !important; }
//         .hcx-hero-desc p { margin: 0; }
//         .hcx-points { list-style: none; display: grid; gap: 10px; margin: 24px 0 0; padding: 0; }
//         .hcx-points li { display: flex; align-items: center; gap: 12px; font-weight: 500; }
//         .hcx-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
//         @keyframes hcx-blink { 50% { opacity: 0; } }

//         /* Form: floats over the right of the banner on desktop */
//         .hcx-form-slot { position: absolute; z-index: 5; top: 32px; right: calc((100% - min(1240px, 100% - 48px)) / 2); width: var(--form-w); }
//         .hcx-form-card { background: #fff; color: var(--ink); border-radius: 12px; padding: clamp(22px, 3vw, 30px); box-shadow: 0 24px 60px rgba(5,20,15,.28); scroll-margin-top: 24px; }
//         .hcx-form-card h2 { font-size: 24px; line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; }
//         .hcx-form-intro { margin: 8px 0 18px; color: var(--muted); font-size: 14px; line-height: 1.55; }
//         .hcx-form { display: grid; gap: 14px; }
//         .hcx-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//         .hcx-field { display: grid; gap: 6px; min-width: 0; }
//         .hcx-field > span { font-size: 13px; font-weight: 600; }
//         .hcx-field em { font-style: normal; font-weight: 400; color: var(--muted); }
//         .hcx-field input, .hcx-field select { width: 100%; min-height: 46px; padding: 0 14px; border: 1px solid #b8c2bc; border-radius: 8px; background: #fff; color: var(--ink); font-size: 15px; font-weight: 400; }
//         .hcx-field input::placeholder { color: #7d8781; font-size: 15px; }
//         .hcx-field input[aria-invalid="true"] { border-color: #b42318; background: #fff8f7; }
//         .hcx-err { display: block; margin-top: 2px; color: #b42318; font-size: 12.5px; line-height: 1.4; font-weight: 500; }
//         .hcx-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
//         .hcx-consent { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: var(--muted); line-height: 1.5; }
//         .hcx-consent input { width: 18px; height: 18px; margin-top: 2px; accent-color: var(--forest); flex: 0 0 auto; }
//         .hcx-consent input[aria-invalid="true"] { outline: 2px solid #b42318; outline-offset: 2px; }
//         .hcx-consent a { color: var(--forest); text-decoration: underline; }
//         .hcx-form-submit { width: 100%; }

//         /* Stats: numbers count up */
//         .hcx-stats { background: var(--forest); color: #fff; }
//         .hcx-stats-grid { list-style: none; margin: 0 auto; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); }
//         .hcx-stats-grid li { padding: 28px 24px; border-left: 1px solid rgba(255,255,255,.16); }
//         .hcx-stats-grid li:first-child { border-left: 0; padding-left: 0; }
//         .hcx-stat-value { display: block; font-size: clamp(30px, 3.6vw, 44px); font-weight: 600; line-height: 1.1; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
//         .hcx-stat-label { display: block; margin-top: 4px; font-size: 14px; color: rgba(255,255,255,.8); }

//         /* Ready-to-go designs */
//         .hcx-head { display: flex; justify-content: space-between; align-items: end; gap: 28px; flex-wrap: wrap; }
//         .hcx-ready-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 44px; }
//         .hcx-ready-card { display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: #fff; text-decoration: none; transition: box-shadow .2s ease, transform .2s ease; }
//         .hcx-ready-card:hover { box-shadow: 0 14px 34px rgba(18,59,48,.14); transform: translateY(-3px); }
//         .hcx-ready-img { aspect-ratio: 4 / 3; overflow: hidden; background: linear-gradient(135deg, var(--forest), var(--forest-soft)); }
//         .hcx-ready-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
//         .hcx-ready-card:hover .hcx-ready-img img { transform: scale(1.05); }
//         .hcx-ready-ph { display: grid; place-items: center; height: 100%; padding: 16px; color: #fff; font-size: 20px; font-weight: 600; text-align: center; }
//         .hcx-ready-body { display: flex; flex-direction: column; flex: 1; padding: 18px 18px 20px; }
//         .hcx-ready-body h3 { font-size: 18px; font-weight: 600; line-height: 1.3; }
//         .hcx-ready-body p { margin-top: 6px; color: var(--muted); font-size: 14px; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
//         .hcx-ready-cta { margin-top: auto; padding-top: 14px; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--forest); }
//         .hcx-foot { margin-top: 40px; display: flex; flex-wrap: wrap; gap: 12px; }

//         /* Luxury projects: name sits on the photo */
//         .hcx-luxury { background: var(--stone); }
//         .hcx-lux-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; margin-top: 44px; }
//         .hcx-lux-card { position: relative; display: block; grid-column: span 6; height: clamp(250px, 26vw, 380px); border-radius: 8px; overflow: hidden; text-decoration: none; color: #fff; background: linear-gradient(135deg, var(--forest), var(--forest-soft)); }
//         .hcx-lux-card:nth-child(4n+1), .hcx-lux-card:nth-child(4n) { grid-column: span 5; }
//         .hcx-lux-card:nth-child(4n+2), .hcx-lux-card:nth-child(4n+3) { grid-column: span 7; }
//         .hcx-lux-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
//         .hcx-lux-card:hover img { transform: scale(1.05); }
//         .hcx-lux-cap { position: absolute; left: 0; right: 0; bottom: 0; padding: 64px 22px 20px; background: linear-gradient(0deg, rgba(8,16,12,.8), rgba(8,16,12,0)); }
//         .hcx-lux-cap h3 { font-size: 24px; font-weight: 700; line-height: 1.2; text-shadow: 0 1px 8px rgba(0,0,0,.4); }
//         .hcx-lux-cap p { margin-top: 4px; display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: rgba(255,255,255,.92); }

//         /* Why us: three cards */
//         .hcx-why { background: var(--forest); color: #fff; }
//         .hcx-why .hcx-lead { color: rgba(255,255,255,.84); }
//         .hcx-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px; }
//         .hcx-why-card { padding: 30px 28px 32px; border: 1px solid rgba(255,255,255,.2); border-radius: 14px; background: rgba(255,255,255,.06); transition: background-color .2s ease, transform .2s ease, border-color .2s ease; }
//         .hcx-why-card:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.36); transform: translateY(-4px); }
//         .hcx-why-icon { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 14px; background: var(--orange); color: var(--ink); }
//         .hcx-why-card h3 { margin-top: 22px; font-size: 22px; font-weight: 600; line-height: 1.25; }
//         .hcx-why-card p { margin-top: 10px; color: rgba(255,255,255,.86); font-size: 16px; }

//         /* Experience centers */
//         .hcx-center-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 44px; }
//         .hcx-center-card { display: flex; flex-direction: column; padding: 28px; border: 1px solid var(--line); border-radius: 14px; background: #fff; transition: box-shadow .2s ease, transform .2s ease; }
//         .hcx-center-card:hover { box-shadow: 0 14px 34px rgba(18,59,48,.12); transform: translateY(-3px); }
//         .hcx-center-pin { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: var(--stone); color: var(--forest); }
//         .hcx-center-card h3 { margin-top: 18px; font-size: 24px; line-height: 1.2; font-weight: 600; }
//         .hcx-center-tag { margin-top: 2px; font-size: 14px; color: var(--muted); }
//         .hcx-center-addr { margin-top: 16px; font-size: 15px; line-height: 1.6; color: var(--ink); }
//         .hcx-center-phone { margin-top: 12px; font-size: 15px; font-weight: 600; color: var(--forest); text-decoration: none; }
//         .hcx-center-actions { margin-top: auto; padding-top: 22px; display: flex; flex-wrap: wrap; gap: 10px; }
//         .hcx-center-actions .hcx-btn { min-height: 44px; padding: 0 18px; font-size: 15px; }
//         .hcx-more-centers { margin-top: 28px; color: var(--muted); font-size: 15px; }
//         .hcx-more-centers a { color: var(--forest); font-weight: 600; margin-left: 6px; }

//         /* Areas */
//         .hcx-areas { background: var(--stone); }
//         .hcx-chips { list-style: none; margin: 36px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
//         .hcx-chips a { display: inline-block; padding: 9px 18px; border: 1px solid #aab5ae; border-radius: 999px; background: #fff; text-decoration: none; font-size: 15px; font-weight: 500; transition: background-color .15s ease, color .15s ease, border-color .15s ease; }
//         .hcx-chips a:hover { background: var(--forest); color: #fff; border-color: var(--forest); }

//         /* FAQ */
//         .hcx-faq-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 88px); align-items: start; }
//         .hcx-faq-intro { position: sticky; top: 32px; }
//         .hcx-faq-item { border-top: 1px solid var(--line); }
//         .hcx-faq-item:last-child { border-bottom: 1px solid var(--line); }
//         .hcx-faq-item summary { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px 0; font-size: 18px; font-weight: 600; line-height: 1.35; cursor: pointer; list-style: none; }
//         .hcx-faq-item summary::-webkit-details-marker { display: none; }
//         .hcx-faq-item summary::after { content: "+"; flex: 0 0 auto; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: var(--stone); font-size: 22px; font-weight: 400; line-height: 1; }
//         .hcx-faq-item[open] summary::after { content: "–"; background: var(--orange); }
//         .hcx-faq-answer { padding: 0 52px 24px 0; color: var(--muted); font-size: 16px; }
//         .hcx-faq-answer p { margin: 0 0 10px; }
//         .hcx-faq-answer, .hcx-faq-answer * { color: var(--muted) !important; }

//         /* Final CTA */
//         .hcx-final { background: var(--ink); color: #fff; }
//         .hcx-final-inner { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 40px; align-items: center; }
//         .hcx-final h2 { font-size: clamp(30px, 4.4vw, 54px); line-height: 1.08; font-weight: 600; letter-spacing: -0.025em; max-width: 16ch; }
//         .hcx-final-desc { margin-top: 16px; max-width: 48ch; }
//         .hcx-final-desc, .hcx-final-desc * { color: rgba(255,255,255,.86) !important; }
//         .hcx-final-desc p { margin: 0; }
//         .hcx-final-actions { display: grid; gap: 12px; justify-items: stretch; }
//         .hcx-final-actions .hcx-btn-ghost { color: #fff; }

//         /* Mobile bar */
//         .hcx-mobile-bar { display: none; }
//         .hcx-modal-open { filter: none; }

//         @media (max-width: 1100px) {
//           .hcx-ready-grid { grid-template-columns: repeat(2, 1fr); }
//           .hcx-why-grid, .hcx-center-grid { grid-template-columns: repeat(2, 1fr); }
//         }
//         @media (max-width: 1023px) {
//           .hcx-stage { height: auto; }
//           .hcx-intro-wrap { height: auto; padding-block: 44px; }
//           .hcx-intro { width: 100%; padding-block: 0; }
//           .hcx-wash { background: linear-gradient(180deg, rgba(238,241,238,.95) 0%, rgba(238,241,238,.88) 100%); }
//           .hcx-form-slot { position: static; width: auto; padding: 28px 16px 36px; background: var(--stone); }
//           .hcx-form-card { max-width: 560px; margin-inline: auto; box-shadow: 0 10px 30px rgba(5,20,15,.12); }
//         }
//         @media (max-width: 900px) {
//           .hcx-stats-grid { grid-template-columns: repeat(2, 1fr); }
//           .hcx-stats-grid li:nth-child(odd) { border-left: 0; padding-left: 0; }
//           .hcx-stats-grid li:nth-child(n+3) { border-top: 1px solid rgba(255,255,255,.16); }
//           .hcx-faq-grid, .hcx-final-inner { grid-template-columns: 1fr; }
//           .hcx-faq-intro { position: static; }
//           .hcx-lux-grid { grid-template-columns: repeat(2, 1fr); }
//           .hcx-lux-card, .hcx-lux-card:nth-child(n) { grid-column: span 1; }
//         }
//         @media (max-width: 700px) {
//           .hcx { padding-bottom: 72px; }
//           .hcx-wrap { width: calc(100% - 32px); }
//           .hcx-hero-desc { font-size: 16px; }
//           .hcx-hero-actions .hcx-btn { flex: 1 1 100%; }
//           .hcx-only-desktop { display: none !important; }
//           .hcx-form-row { grid-template-columns: 1fr; }
//           .hcx-ready-grid, .hcx-why-grid, .hcx-center-grid { grid-template-columns: 1fr; }
//           .hcx-lux-grid { grid-template-columns: 1fr; }
//           .hcx-lux-card { height: 260px; }
//           .hcx-foot .hcx-btn { width: 100%; }
//           .hcx-faq-item summary { font-size: 16px; }
//           .hcx-faq-answer { padding-right: 0; }
//           .hcx-final-actions .hcx-btn { width: 100%; }
//           .hcx-mobile-bar { position: fixed; z-index: 90; left: 0; right: 0; bottom: 0; display: grid; grid-template-columns: 1fr 1.6fr; gap: 10px; padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 0px)); background: #fff; box-shadow: 0 -6px 24px rgba(0,0,0,.14); }
//           .hcx-mobile-bar .hcx-btn { min-height: 48px; padding: 0 12px; font-size: 15px; }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .hcx *, .hcx *::before, .hcx *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; scroll-behavior: auto !important; }
//           .hcx-caret { animation: none; }
//         }
//       `}</style>

//       {/* Hero: one banner, typing headline on the left, buttons under the points, form on the right */}
//       <section className="hcx-hero" aria-label="High Creation Interior">
//         <h1 className="hcx-sr">{phrases[0]}</h1>

//         <div className="hcx-stage">
//           <SlideImage src={HERO_INTERIOR} priority className="hcx-slide-img" />
//           <div className="hcx-wash" />
//           <div className="hcx-wrap hcx-intro-wrap">
//             <div className="hcx-intro">
//               <div className="hcx-typed" aria-hidden="true">
//                 <span>{typed}</span>
//                 <i className="hcx-caret" />
//               </div>
//               <Html className="hcx-hero-desc" html={heroDesc} />
//               <ul className="hcx-points">
//                 {HERO_POINTS.map((point) => (
//                   <li key={point}><Tick /> {point}</li>
//                 ))}
//               </ul>
//               <div className="hcx-hero-actions">
//                 <a className="hcx-btn hcx-btn-primary" href="/estimator-for-home">Get a free estimate</a>
//                 <a className="hcx-btn hcx-btn-outline hcx-only-desktop" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//                 <a className="hcx-btn hcx-btn-outline" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="hcx-form-slot">
//           <LeadForm />
//         </div>
//       </section>

//       {/* Trust numbers: count up when scrolled into view */}
//       <section className="hcx-stats" aria-label="High Creation Interior at a glance">
//         <div className="hcx-wrap">
//           <ul className="hcx-stats-grid">
//             {STATS.map((stat) => (
//               <li key={stat.label}>
//                 <span className="hcx-stat-value">
//                   <CountUp end={stat.end} suffix={stat.suffix} reduceMotion={reduceMotion} />
//                 </span>
//                 <span className="hcx-stat-label">{stat.label}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>

//       {/* Ready-to-go designs */}
//       <section className="hcx-section" id="hcx-ready" aria-labelledby="hcx-ready-title">
//         <div className="hcx-wrap">
//           <div className="hcx-head">
//             <div>
//               <h2 id="hcx-ready-title" className="hcx-h2">Ready-to-go designs for every room</h2>
//               <p className="hcx-lead">Thoughtfully crafted interiors that combine good looks with smart functionality. Pick a room and start from a design you like.</p>
//             </div>
//             <a className="hcx-link" href="/ready-togo-design">View all designs <Arrow /></a>
//           </div>
//           <div className="hcx-ready-grid">
//             {readyCards.map((card) => (
//               <a className="hcx-ready-card" key={card.id} href={card.href}>
//                 <div className="hcx-ready-img">
//                   {card.image ? (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img src={card.image} alt={card.alt || `${card.title} interior design by High Creation Interior`} loading="lazy" decoding="async" width="640" height="480" />
//                   ) : (
//                     <span className="hcx-ready-ph">{card.title}</span>
//                   )}
//                 </div>
//                 <div className="hcx-ready-body">
//                   <h3>{card.title}</h3>
//                   {card.text ? <p>{card.text}</p> : null}
//                   <span className="hcx-ready-cta">View designs <Arrow /></span>
//                 </div>
//               </a>
//             ))}
//           </div>
//           <div className="hcx-foot">
//             <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Get a free consultation</a>
//           </div>
//         </div>
//       </section>

//       {/* Luxury projects */}
//       <section className="hcx-section hcx-luxury" id="hcx-luxury" aria-labelledby="hcx-luxury-title">
//         <div className="hcx-wrap">
//           <div className="hcx-head">
//             <div>
//               <h2 id="hcx-luxury-title" className="hcx-h2">Luxury project concepts</h2>
//               <p className="hcx-lead">Feel the luxury. Live the experience. Premium materials, bespoke details and timeless design in every home we create.</p>
//             </div>
//             <a className="hcx-link" href="/luxury-projects/">View all luxury projects <Arrow /></a>
//           </div>
//           <div className="hcx-lux-grid">
//             {luxuryCards.map((card) => (
//               <a className="hcx-lux-card" key={card.id} href={card.href}>
//                 {card.image ? (
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img src={card.image} alt={card.alt || `${card.title}, luxury interior by High Creation Interior`} loading="lazy" decoding="async" />
//                 ) : null}
//                 <div className="hcx-lux-cap">
//                   <h3>{card.title}</h3>
//                   <p>{card.text || "View project"} {!card.text ? <Arrow /> : null}</p>
//                 </div>
//               </a>
//             ))}
//           </div>
//           <div className="hcx-foot">
//             <a className="hcx-btn hcx-btn-outline" href="/luxury-projects/">Explore luxury projects</a>
//             <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Talk to a designer</a>
//           </div>
//         </div>
//       </section>

//       {/* Why High Creation Interior: three cards */}
//       <section className="hcx-section hcx-why" aria-labelledby="hcx-why-title">
//         <div className="hcx-wrap">
//           <h2 id="hcx-why-title" className="hcx-h2">Your space designed around you, not around a fixed design</h2>
//           <p className="hcx-lead">One team handles design and production, so what you approve is what gets built.</p>
//           <div className="hcx-why-grid">
//             {WHY_POINTS.map((point) => (
//               <article className="hcx-why-card" key={point.key}>
//                 <span className="hcx-why-icon">{WHY_ICONS[point.key]}</span>
//                 <h3>{point.title}</h3>
//                 <p>{point.text}</p>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Experience centers */}
//       <section className="hcx-section" id="hcx-centers" aria-labelledby="hcx-centers-title">
//         <div className="hcx-wrap">
//           <div className="hcx-head">
//             <div>
//               <h2 id="hcx-centers-title" className="hcx-h2">Visit an experience center near you</h2>
//               <p className="hcx-lead">Walk through finished rooms, feel the materials and talk to a designer in person.</p>
//             </div>
//           </div>
//           <div className="hcx-center-grid">
//             {CENTER_CARDS.map((center) => (
//               <article className="hcx-center-card" key={center.city}>
//                 <span className="hcx-center-pin"><PinIcon /></span>
//                 <h3>{center.city}</h3>
//                 <p className="hcx-center-tag">Experience center</p>
//                 <p className="hcx-center-addr">{center.address}</p>
//                 <a className="hcx-center-phone" href={PHONE_TEL}>{PHONE_LABEL}</a>
//                 <div className="hcx-center-actions">
//                   <a className="hcx-btn hcx-btn-primary" href={mapsUrl(center.address)} target="_blank" rel="noreferrer">Get directions</a>
//                   <a className="hcx-btn hcx-btn-outline" href={center.href}>See the center</a>
//                 </div>
//               </article>
//             ))}
//           </div>
//           <p className="hcx-more-centers">
//             Also visit us in
//             {OTHER_CENTERS.map((center, index) => (
//               <a key={center.label} href={center.href}>{center.label}{index < OTHER_CENTERS.length - 1 ? "," : ""}</a>
//             ))}
//           </p>
//         </div>
//       </section>

//       {/* Where we work */}
//       <section className="hcx-section hcx-areas" aria-labelledby="hcx-areas-title">
//         <div className="hcx-wrap">
//           <h2 id="hcx-areas-title" className="hcx-h2">Areas we serve across Delhi NCR</h2>
//           <p className="hcx-lead">Pick your area to see how we design and deliver homes there.</p>
//           <ul className="hcx-chips">
//             {AREAS.map((area) => (
//               <li key={area.label}><a href={area.href}>{area.label}</a></li>
//             ))}
//           </ul>
//         </div>
//       </section>

//       {/* FAQ (CMS: faqs) */}
//       {faqLoading || faqError || faqs.length > 0 ? (
//         <section className="hcx-section" aria-labelledby="hcx-faq-title">
//           <div className="hcx-wrap hcx-faq-grid">
//             <div className="hcx-faq-intro">
//               <h2 id="hcx-faq-title" className="hcx-h2">Questions before you begin</h2>
//               <p className="hcx-lead">Clear answers to the things people ask us most. Still unsure? Call us and we will walk you through it.</p>
//               <a className="hcx-link" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//             </div>
//             <div>
//               {faqLoading ? <p className="hcx-lead">Loading FAQs…</p> : null}
//               {faqError ? <p className="hcx-lead">{faqError}</p> : null}
//               {!faqLoading && !faqError && faqs.map((faq, index) => (
//                 <details className="hcx-faq-item" key={faq.key} open={index === 0}>
//                   <summary>{faq.title || "Frequently asked question"}</summary>
//                   <Html className="hcx-faq-answer" html={faq.description || ""} />
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>
//       ) : null}

//       {/* Final CTA */}
//       <section className="hcx-section hcx-final" aria-labelledby="hcx-final-title">
//         <div className="hcx-wrap hcx-final-inner">
//           <div>
//             <h2 id="hcx-final-title">{data6?.top_title || "Let’s plan the home you want to come back to."}</h2>
//             <Html
//               className="hcx-final-desc"
//               html={data6?.top_description || "Tell us about your space. A High Creation Interior designer will help you plan a practical, personal next step."}
//             />
//           </div>
//           <div className="hcx-final-actions">
//             <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Book free consultation</a>
//             <a className="hcx-btn hcx-btn-ghost" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//             <a className="hcx-btn hcx-btn-ghost" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
//           </div>
//         </div>
//       </section>

//       {/* Mobile sticky actions: always on screen */}
//       <div className="hcx-mobile-bar">
//         <a className="hcx-btn hcx-btn-outline" href={PHONE_TEL}>Call us</a>
//         <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Book free consultation</a>
//       </div>

//       <ContactUsPopUp onModalStateChange={handleModalStateChange} />
//     </div>
//   );
// }



// "use client";

// import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import DOMPurify from "isomorphic-dompurify";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import api from "@/utils/api";
// import { buildLeadMetadata } from "@/utils/leadForms";
// import { leadSchema, normalizePhone } from "@/utils/leadValidation";

// // Lazy-loaded: triggered later by scroll/time/exit intent, must not delay first paint.
// const ContactUsPopUp = dynamic(() => import("../components/ContactUsPopUp"), {
//   ssr: false,
// });

// /* -------------------------------------------------------------------------- */
// /*  Static content, taken from https://www.hcinterior.in/                     */
// /* -------------------------------------------------------------------------- */

// // Put hero-interior.webp in  public/images/landing/  (delivered next to this file).
// const HERO_INTERIOR = "/images/landing/hero-interior.webp";

// const PHONE_TEL = "tel:+917070701373";
// const PHONE_LABEL = "+91 70707 01373";
// const WHATSAPP = "https://wa.me/919560277787";

// const HERO_POINTS = [
//   "Free design consultation",
//   "Complete customization",
//   "In-house production",
// ];

// // Typed in the banner. The CMS headline (if any) is always typed first.
// const TYPED_PHRASES = [
//   "Designed around you, not around a fixed design.",
//   "Made in our own production facility.",
//   "Complete customization for every room.",
//   "2,750+ projects completed across Delhi NCR.",
// ];

// // `end` is what the number counts up to when the section scrolls into view.
// const STATS = [
//   { end: 8, suffix: "+", label: "years of experience" },
//   { end: 2750, suffix: "+", label: "projects completed" },
//   { end: 450, suffix: "+", label: "people on our team" },
//   { end: 5, suffix: "", label: "branches across NCR" },
// ];

// const WHY_POINTS = [
//   {
//     key: "custom",
//     title: "Complete customization",
//     text: "Every project is designed around your vision, your space and your lifestyle, not a fixed catalogue.",
//   },
//   {
//     key: "inhouse",
//     title: "In-house production",
//     text: "We make furniture, fixtures and design elements in our own facility, so quality, cost and timelines stay in our hands.",
//   },
//   {
//     key: "team",
//     title: "One team, one roof",
//     text: "Design and production are managed together, which means fewer third-party vendors and a smoother process.",
//   },
// ];

// // Addresses are from hcinterior.in/contact
// const CENTER_CARDS = [
//   {
//     city: "Noida",
//     address: "H101, LGF, Sector-63, Noida, Uttar Pradesh - 201301",
//     href: "/experience-center/",
//   },
//   {
//     city: "Noida Extension",
//     address: "Galaxy Blue Sapphire Plaza, Noida Extension, Haibatpur, Sector 4, Greater Noida, Uttar Pradesh 201305",
//     href: "/experience-center-noida-extension/",
//   },
//   {
//     city: "Gurugram",
//     address: "DDC Arcade, 1st Floor, Plot No 1 Main, Sector 48 Road, Badshahpur Sohna Rd, Opposite Vipul Business Park, Gurugram, Haryana 122018",
//     href: "/experience-center-gurugram/",
//   },
// ];

// const OTHER_CENTERS = [
//   { label: "Faridabad", href: "/experience-center-faridabad/" },
//   { label: "New Delhi", href: "/experience-center-new-delhi/" },
// ];

// const AREAS = [
//   { label: "Noida", href: "/interior-designers-in-noida" },
//   { label: "Greater Noida", href: "/interior-designers-in-greater-noida" },
//   { label: "Noida Extension", href: "/interior-designer-in-noida-extension" },
//   { label: "Ghaziabad", href: "/interior-designers-in-ghaziabad" },
//   { label: "Delhi", href: "/interior-designers-in-delhi" },
//   { label: "Dwarka", href: "/interior-designers-in-dwarka" },
//   { label: "Gurugram", href: "/interior-designers-in-gurgaon" },
//   { label: "Faridabad", href: "/interior-designers-in-faridabad" },
//   { label: "Manesar", href: "/interior-designers-in-manesar" },
//   { label: "Sohna", href: "/interior-designer-in-sohna-gurgaon" },
// ];

// const PROPERTY_TYPES = ["1 BHK", "2 BHK", "3 BHK", "4 BHK or larger", "Villa / builder floor"];

// // Same CMS parent-child type that powers /ready-togo-design.
// // Verify this name against ready-togo-design/page.jsx (and keep it in sync with page.jsx).
// const READY_TO_GO_TYPE = "ready_to_go_design";

// // CMS parent-child type behind /luxury-projects. The exact name is not visible from outside
// // the site, so the first one of these that returns data is used. Open
// // luxury-projects/page.jsx, copy the real name, and put it FIRST in this list.
// // The browser console warns if none of them returns anything.
// const LUXURY_TYPES = ["luxury_projects", "luxury_project", "luxury_projects_design", "luxury_design", "luxury"];

// // Shown only if the CMS returns nothing. Copy is from hcinterior.in/ready-togo-design.
// const READY_FALLBACK = [
//   { id: "living", title: "Living Room", text: "Design a living room that blends style and function, perfect for relaxation and gatherings.", href: "/ready-togo-design/gallery?id=5" },
//   { id: "kitchen", title: "Modular Kitchen", text: "Your kitchen deserves perfection. Let’s create the dream space where cooking and style come together.", href: "/ready-togo-design/gallery?id=6" },
//   { id: "master", title: "Master Bedroom", text: "Transform your master bedroom into a luxurious retreat where elegance and comfort create perfect tranquility.", href: "/ready-togo-design/gallery?id=3" },
//   { id: "kids", title: "Kids Room", text: "A playful, cozy and colorful design that sparks creativity and fun.", href: "/ready-togo-design/gallery?id=7" },
//   { id: "dining", title: "Dining", text: "Where every meal feels like a celebration. A stylish haven of comfort and elegance.", href: "/ready-togo-design/gallery?id=9" },
//   { id: "mandir", title: "Mandir", text: "A serene sanctuary where devotion and design come together beautifully.", href: "/ready-togo-design/gallery?id=4" },
//   { id: "parents", title: "Parents Room", text: "A haven of comfort and peace, designed with care.", href: "/ready-togo-design/gallery?id=1" },
//   { id: "entrance", title: "Entrance", text: "Make a lasting first impression with a welcoming, functional entryway.", href: "/ready-togo-design/gallery?id=8" },
// ];

// // Luxury project categories from hcinterior.in/luxury-projects (ids match project-gallery?id=).
// // PREFERRED decides which six are shown when the CMS has more.
// const LUXURY_PREFERRED_IDS = [23, 22, 18, 17, 16, 3];
// const LUXURY_FALLBACK = [
//   { id: 23, title: "Living Room" },
//   { id: 22, title: "Premium Bedroom" },
//   { id: 18, title: "Luxury Dining" },
//   { id: 17, title: "Luxury Bathroom" },
//   { id: 16, title: "Luxury Dressing Room" },
//   { id: 3, title: "Bar Area" },
// ].map((item) => ({
//   ...item,
//   text: "",
//   image: null,
//   href: `/luxury-projects/project-gallery?id=${item.id}`,
// }));

// // Category names from hcinterior.in/luxury-projects, keyed by project-gallery id.
// const LUXURY_TITLE_BY_ID = {
//   26: "Wardrobe", 25: "Study Room", 24: "Roof", 23: "Living Room", 22: "Premium Bedroom",
//   21: "Outdoor", 20: "Modular Kitchen", 19: "Mandir", 18: "Luxury Dining", 17: "Luxury Bathroom",
//   16: "Luxury Dressing Room", 15: "Kids Room", 14: "Guest Room", 13: "Gate / Door",
//   6: "Breakfast Counter", 3: "Bar Area", 1: "Balcony",
// };

// /* -------------------------------------------------------------------------- */
// /*  Helpers                                                                    */
// /* -------------------------------------------------------------------------- */

// const Html = memo(function Html({ html, className = "" }) {
//   const clean = useMemo(() => DOMPurify.sanitize(html || ""), [html]);
//   return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
// });

// const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// // A parent-child record can carry its card data on either side. Use the side that has content.
// const cardContent = (record, preferParent = false) => {
//   const child = record?.child_content;
//   const parent = record?.parent_content;
//   const [first, second] = preferParent ? [parent, child] : [child, parent];
//   if (first && (first.title || first.image)) return first;
//   return second || first || {};
// };

// // ---- Card images -------------------------------------------------------------
// // The CMS has used different field names (and sometimes relative paths), so instead of
// // trusting one key we look for an image URL anywhere inside the record.
// const IMAGE_URL_RE = /(?:https?:\/\/|\/\/)?[^\s"'\\<>(),]+?\.(?:jpe?g|png|webp|avif|gif)(?:\?[^\s"'\\<>]*)?/i;

// const apiOrigin = () => {
//   try {
//     const base = api?.defaults?.baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
//     return base ? new URL(base).origin : "";
//   } catch {
//     return "";
//   }
// };

// const resolveImageUrl = (raw) => {
//   if (!raw || typeof raw !== "string") return null;
//   if (/^https?:\/\//i.test(raw)) return raw;
//   if (raw.startsWith("//")) return `https:${raw}`;
//   const origin = apiOrigin();
//   const path = raw.startsWith("/") ? raw : `/${raw}`;
//   return origin ? `${origin}${path}` : path;
// };

// const findImageUrl = (value) => {
//   if (!value) return null;
//   const text = typeof value === "string" ? value : JSON.stringify(value);
//   const match = text.match(IMAGE_URL_RE);
//   return match ? resolveImageUrl(match[0]) : null;
// };

// // Named fields first (fast path), then a scan of the whole object.
// const pickImage = (c) => {
//   if (!c) return null;
//   const first = Array.isArray(c.images) ? c.images[0] : null;
//   const named =
//     c.image ||
//     c.cover_image ||
//     c.thumbnail ||
//     c.banner_image ||
//     c.main_image ||
//     (typeof first === "string" ? first : first?.image || first?.url);
//   return resolveImageUrl(named) || findImageUrl(c);
// };

// // Image for a whole parent-child record: the card side first, then the other side, then everything.
// const recordImage = (record, preferParent = false) => {
//   const sides = preferParent
//     ? [record?.parent_content, record?.child_content]
//     : [record?.child_content, record?.parent_content];
//   for (const side of sides) {
//     const url = pickImage(side);
//     if (url) return url;
//   }
//   return findImageUrl(record);
// };

// const OPTIMIZED_HOSTS = ["hcinterior.in", "www.hcinterior.in", "apidev.hcinterior.in", "localhost"];

// function canOptimize(src) {
//   if (!src || src.startsWith("//")) return false;
//   if (src.startsWith("/")) return true;
//   try {
//     return OPTIMIZED_HOSTS.includes(new URL(src).hostname);
//   } catch {
//     return false;
//   }
// }

// function SlideImage({ src, alt = "", priority = false, className = "" }) {
//   if (!src) return null;
//   if (canOptimize(src)) {
//     return <Image src={src} alt={alt} fill priority={priority} sizes="100vw" quality={80} className={className} />;
//   }
//   // eslint-disable-next-line @next/next/no-img-element
//   return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" className={className} />;
// }

// // Types each phrase, holds, deletes, then moves to the next, forever.
// function useTypewriter(phrases, reduceMotion) {
//   const [text, setText] = useState("");
//   const key = phrases.join("|");

//   useEffect(() => {
//     const list = key.split("|").filter(Boolean);
//     if (!list.length) return undefined;
//     if (reduceMotion) {
//       setText(list[0]);
//       return undefined;
//     }

//     let phraseIndex = 0;
//     let charIndex = 0;
//     let deleting = false;
//     let timer;

//     const tick = () => {
//       const phrase = list[phraseIndex];
//       if (!deleting) {
//         charIndex += 1;
//         setText(phrase.slice(0, charIndex));
//         if (charIndex >= phrase.length) {
//           deleting = true;
//           timer = window.setTimeout(tick, 1900);
//           return;
//         }
//         timer = window.setTimeout(tick, 46);
//       } else {
//         charIndex -= 1;
//         setText(phrase.slice(0, Math.max(charIndex, 0)));
//         if (charIndex <= 0) {
//           deleting = false;
//           phraseIndex = (phraseIndex + 1) % list.length;
//           timer = window.setTimeout(tick, 320);
//           return;
//         }
//         timer = window.setTimeout(tick, 20);
//       }
//     };

//     timer = window.setTimeout(tick, 450);
//     return () => window.clearTimeout(timer);
//   }, [key, reduceMotion]);

//   return text;
// }

// // Counts from 0 to `end` the first time it scrolls into view.
// function CountUp({ end, suffix = "", duration = 1900, reduceMotion }) {
//   const ref = useRef(null);
//   const [value, setValue] = useState(end);

//   useEffect(() => {
//     const el = ref.current;
//     if (!el || reduceMotion || typeof IntersectionObserver === "undefined") {
//       setValue(end);
//       return undefined;
//     }

//     setValue(0);
//     let raf = 0;
//     let started = false;

//     const run = () => {
//       const startTime = performance.now();
//       const step = (now) => {
//         const t = Math.min((now - startTime) / duration, 1);
//         const eased = 1 - Math.pow(1 - t, 3); // fast start, gentle landing
//         setValue(Math.round(end * eased));
//         if (t < 1) raf = requestAnimationFrame(step);
//       };
//       raf = requestAnimationFrame(step);
//     };

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && !started) {
//           started = true;
//           run();
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.4 }
//     );
//     observer.observe(el);

//     return () => {
//       observer.disconnect();
//       cancelAnimationFrame(raf);
//     };
//   }, [end, duration, reduceMotion]);

//   return (
//     <span ref={ref} className="hcx-count">
//       {value.toLocaleString("en-IN")}
//       {suffix}
//     </span>
//   );
// }

// const Arrow = () => (
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
//     <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const Tick = () => (
//   <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
//     <circle cx="9" cy="9" r="9" fill="#ff8b49" />
//     <path d="M5 9.3l2.6 2.6L13 6.6" stroke="#18201c" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// const PinIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//     <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//     <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
//   </svg>
// );

// const WHY_ICONS = {
//   custom: (
//     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
//       <path d="M4 8h20M4 14h20M4 20h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//       <circle cx="9" cy="8" r="2.6" fill="#ff8b49" stroke="currentColor" strokeWidth="1.8" />
//       <circle cx="19" cy="14" r="2.6" fill="#ff8b49" stroke="currentColor" strokeWidth="1.8" />
//       <circle cx="12" cy="20" r="2.6" fill="#ff8b49" stroke="currentColor" strokeWidth="1.8" />
//     </svg>
//   ),
//   inhouse: (
//     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
//       <path d="M3 24V12l7 4v-4l7 4v-4l8 4v8H3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//       <path d="M19 12V4h4v10" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//       <path d="M8 24v-4h4v4M15 24v-4h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//     </svg>
//   ),
//   team: (
//     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
//       <path d="M3 13.5 14 4l11 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
//       <path d="M6 12v12h16V12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
//       <circle cx="11" cy="15.5" r="2" stroke="currentColor" strokeWidth="1.6" />
//       <circle cx="17.5" cy="15.5" r="2" stroke="currentColor" strokeWidth="1.6" />
//       <path d="M8 22c.4-2 1.6-3 3-3s2.6 1 3 3M14.5 22c.4-2 1.6-3 3-3s2.6 1 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
//   ),
// };

// /* -------------------------------------------------------------------------- */
// /*  Lead form (react-hook-form + zod, same API + tracking as before)           */
// /* -------------------------------------------------------------------------- */

// const EMPTY_FORM = {
//   fullName: "",
//   contact: "",
//   email: "",
//   place: "",
//   property: "",
//   termsAndConditions: false,
//   website: "",
// };

// const CTA_TEXT = "Book free consultation";

// function LeadForm() {
//   const pathname = usePathname();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(leadSchema),
//     defaultValues: EMPTY_FORM,
//     mode: "onTouched", // validate when a field is left, then live while fixing it
//   });

//   const onSubmit = async (values) => {
//     if (values.website) return; // honeypot filled: bot, silently ignore

//     const requestData = {
//       name: values.fullName.trim().replace(/\s+/g, " "),
//       mobile: normalizePhone(values.contact), // always a clean 10-digit number
//       email: values.email.trim().toLowerCase(),
//       place: values.place.trim(),
//       query: values.property ? `Property type: ${values.property}` : "",
//       ...buildLeadMetadata({
//         pathname,
//         leadFormType: "inline",
//         leadFormName: "Creating The Home Of Your Dreams Lead Form",
//         ctaText: CTA_TEXT.toUpperCase(),
//       }),
//     };

//     try {
//       const response = await api.post("/user-queries", requestData);
//       if (response.status === 201) {
//         reset(EMPTY_FORM);
//         toast.success("Thank you. Our team will be in touch soon.");
//         window.setTimeout(() => {
//           window.location.href = "/thank-you";
//         }, 300);
//       } else {
//         toast.error("We could not submit your details. Please try again.");
//       }
//     } catch (error) {
//       toast.error(error?.message || "Something went wrong. Please try again.");
//       console.error("HCI landing enquiry submission failed:", error);
//     }
//   };

//   return (
//     <div className="hcx-form-card" id="hcx-enquiry-form">
//       <h2>Get a free design consultation</h2>
//       <p className="hcx-form-intro">Share a few details and a designer will call you to plan the next step.</p>
//       <form onSubmit={handleSubmit(onSubmit)} className="hcx-form" noValidate>
//         <label className="hcx-field">
//           <span>Your name</span>
//           <input
//             type="text"
//             autoComplete="name"
//             placeholder="Full name"
//             maxLength={60}
//             aria-invalid={errors.fullName ? "true" : "false"}
//             {...register("fullName")}
//           />
//           {errors.fullName ? <small className="hcx-err" role="alert">{errors.fullName.message}</small> : null}
//         </label>

//         <label className="hcx-field">
//           <span>Mobile number</span>
//           <input
//             type="tel"
//             autoComplete="tel"
//             inputMode="tel"
//             placeholder="10-digit mobile number"
//             maxLength={16}
//             aria-invalid={errors.contact ? "true" : "false"}
//             {...register("contact")}
//           />
//           {errors.contact ? <small className="hcx-err" role="alert">{errors.contact.message}</small> : null}
//         </label>

//         <label className="hcx-field">
//           <span>Email address</span>
//           <input
//             type="email"
//             autoComplete="email"
//             placeholder="you@example.com"
//             maxLength={100}
//             aria-invalid={errors.email ? "true" : "false"}
//             {...register("email")}
//           />
//           {errors.email ? <small className="hcx-err" role="alert">{errors.email.message}</small> : null}
//         </label>

//         <div className="hcx-form-row">
//           <label className="hcx-field">
//             <span>City <em>(optional)</em></span>
//             <input
//               type="text"
//               autoComplete="address-level2"
//               placeholder="Noida, Gurugram…"
//               maxLength={50}
//               aria-invalid={errors.place ? "true" : "false"}
//               {...register("place")}
//             />
//             {errors.place ? <small className="hcx-err" role="alert">{errors.place.message}</small> : null}
//           </label>
//           <label className="hcx-field">
//             <span>Property <em>(optional)</em></span>
//             <select {...register("property")}>
//               <option value="">Select</option>
//               {PROPERTY_TYPES.map((type) => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//           </label>
//         </div>

//         {/* Honeypot: hidden from people, bots tend to fill it */}
//         <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hcx-hp" {...register("website")} />

//         <div>
//           <label className="hcx-consent">
//             <input type="checkbox" aria-invalid={errors.termsAndConditions ? "true" : "false"} {...register("termsAndConditions")} />
//             <span>
//               I agree to the <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a> and terms.
//             </span>
//           </label>
//           {errors.termsAndConditions ? <small className="hcx-err" role="alert">{errors.termsAndConditions.message}</small> : null}
//         </div>

//         <button className="hcx-btn hcx-btn-primary hcx-form-submit" type="submit" disabled={isSubmitting}>
//           {isSubmitting ? "Sending…" : CTA_TEXT}
//         </button>
//       </form>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*  Page                                                                       */
// /* -------------------------------------------------------------------------- */

// async function fetchSection(endpoint, setter) {
//   try {
//     const response = await api.get(endpoint, {});
//     if (response?.data?.json_content) setter(response.data.json_content);
//   } catch (error) {
//     console.error(`HCI landing CMS request failed (${endpoint}):`, error);
//   }
// }

// // Tries each CMS type name in order and returns the first list that has records.
// async function fetchFirstAvailable(types) {
//   for (const type of types) {
//     try {
//       const response = await api.get(`/cms-parent-child/${type}`);
//       if (Array.isArray(response?.data) && response.data.length) return { type, data: response.data };
//     } catch {
//       /* try the next name */
//     }
//   }
//   return null;
// }

// export default function HCLandingPage({ initialData }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [data1, setData1] = useState(initialData?.data1 ?? null);
//   const [data6, setData6] = useState(initialData?.data6 ?? null);
//   const [faqData, setFaqData] = useState(initialData?.faqs ?? []);
//   const [faqLoading, setFaqLoading] = useState(initialData?.faqs == null);
//   const [faqError, setFaqError] = useState("");
//   const [readyDesigns, setReadyDesigns] = useState(initialData?.readyDesigns ?? []);
//   const [luxuryDesigns, setLuxuryDesigns] = useState(initialData?.luxuryDesigns ?? []);
//   const [reduceMotion, setReduceMotion] = useState(false);

//   // Anything the server could not fetch is fetched here.
//   useEffect(() => {
//     const init = initialData || {};
//     if (!init.data1) fetchSection("/cms-content/creating_the_home_of_your_dreams", setData1);
//     if (!init.data6) fetchSection("/cms-content/creating_the_home_of_your_dreams_6", setData6);

//     if (init.faqs == null) {
//       api.get("/cms-content/faqs")
//         .then((response) => setFaqData(Array.isArray(response?.data) ? response.data : []))
//         .catch(() => setFaqError("FAQs could not be loaded right now."))
//         .finally(() => setFaqLoading(false));
//     }
//     if (init.readyDesigns == null) {
//       api.get(`/cms-parent-child/${READY_TO_GO_TYPE}`)
//         .then((response) => setReadyDesigns(Array.isArray(response?.data) ? response.data : []))
//         .catch((error) => console.error("HCI ready-to-go designs failed to load:", error));
//     }
//     if (init.luxuryDesigns == null) {
//       fetchFirstAvailable(LUXURY_TYPES).then((result) => {
//         if (result) {
//           if (process.env.NODE_ENV === "development") {
//             console.info(`HCI luxury projects loaded from "${result.type}". First record:`, result.data[0]);
//           }
//           setLuxuryDesigns(result.data);
//         } else console.warn(`HCI luxury projects: none of these CMS types returned data: ${LUXURY_TYPES.join(", ")}. Set the real name in LUXURY_TYPES.`);
//       });
//     }
//   }, [initialData]);

//   // Respect "reduce motion": no typing loop, no counting.
//   useEffect(() => {
//     const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
//     const apply = () => setReduceMotion(Boolean(mq?.matches));
//     apply();
//     mq?.addEventListener?.("change", apply);
//     return () => mq?.removeEventListener?.("change", apply);
//   }, []);

//   /* ---------------------------- Hero content ---------------------------- */

//   const cmsHeadline = stripHtml(data1?.mid_sub_title);
//   const heroDesc =
//     data1?.top_description ||
//     "Customized home interiors across Delhi NCR, planned with you and made in our own production facility.";

//   const phrases = useMemo(() => [cmsHeadline, ...TYPED_PHRASES].filter(Boolean), [cmsHeadline]);
//   const typed = useTypewriter(phrases, reduceMotion);

//   /* --------------------------- Section content --------------------------- */

//   const readyCards = useMemo(() => {
//     const fromCms = [...readyDesigns]
//       .sort((a, b) => Number(a.id) - Number(b.id))
//       .slice(0, 8)
//       .map((record) => {
//         const c = cardContent(record);
//         return {
//           id: record.id,
//           title: c.title,
//           text: stripHtml(c.description),
//           image: recordImage(record),
//           alt: c.image_alt,
//           href: `/ready-togo-design/gallery?id=${record.id}`,
//         };
//       })
//       .filter((card) => card.title);
//     return fromCms.length ? fromCms : READY_FALLBACK;
//   }, [readyDesigns]);

//   const luxuryCards = useMemo(() => {
//     const cards = luxuryDesigns
//       .map((record) => {
//         const c = cardContent(record, true);
//         return {
//           id: record.id,
//           title: c.title || c.name || c.heading || LUXURY_TITLE_BY_ID[Number(record.id)],
//           text: stripHtml(c.description),
//           image: recordImage(record, true),
//           alt: c.image_alt,
//           href: `/luxury-projects/project-gallery?id=${record.id}`,
//         };
//       })
//       .filter((card) => card.title);
//     if (!cards.length) return LUXURY_FALLBACK;
//     const preferred = LUXURY_PREFERRED_IDS
//       .map((id) => cards.find((card) => Number(card.id) === id))
//       .filter(Boolean);
//     const rest = cards
//       .filter((card) => !preferred.includes(card))
//       .sort((a, b) => Number(b.id) - Number(a.id));
//     return [...preferred, ...rest].slice(0, 6);
//   }, [luxuryDesigns]);

//   const faqs = useMemo(
//     () =>
//       faqData
//         .map((faq) => faq?.json_content || faq || {})
//         .map((item, index) => ({ ...item, key: faqData[index]?.id || `${item.title}-${index}` }))
//         .filter((item) => item.title || item.description),
//     [faqData]
//   );
//   const handleModalStateChange = useCallback((open) => setIsModalOpen(open), []);

//   const mapsUrl = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

//   return (
//     <div className={`hcx ${isModalOpen ? "hcx-modal-open" : ""}`}>
//       <style jsx global>{`
//         .hcx {
//           --ink: #18201c;
//           --forest: #123b30;
//           --forest-soft: #1c4e41;
//           --stone: #eef1ee;
//           --muted: #56605a;
//           --line: #d5dcd7;
//           --orange: #ff8b49;
//           --orange-hover: #f27a35;
//           --hcx-font: var(--font-poppins, system-ui), system-ui, Arial, sans-serif;
//           --form-w: clamp(360px, 36vw, 420px);
//           color: var(--ink);
//           background: #fff;
//           font-family: var(--hcx-font);
//           font-size: 16px;
//           line-height: 1.6;
//           overflow: clip;
//         }
//         .hcx *, .hcx *::before, .hcx *::after { box-sizing: border-box; }
//         .hcx img, .hcx video { max-width: 100%; display: block; }
//         .hcx a { color: inherit; }
//         .hcx h1, .hcx h2, .hcx h3, .hcx p { margin: 0; }
//         .hcx h1, .hcx h2, .hcx h3 { color: inherit; font-family: inherit; }
//         .hcx button, .hcx input, .hcx select { font-family: var(--hcx-font); }
//         .hcx .hcx-field input, .hcx .hcx-field select, .hcx .hcx-field input::placeholder { font-family: var(--hcx-font) !important; }
//         .hcx-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
//         .hcx-wrap { width: min(1240px, calc(100% - 48px)); margin-inline: auto; }
//         .hcx-section { padding-block: clamp(56px, 8vw, 104px); }
//         .hcx-h2 { font-size: clamp(28px, 3.6vw, 44px); line-height: 1.12; font-weight: 600; letter-spacing: -0.02em; max-width: 22ch; }
//         .hcx-lead { margin-top: 14px; max-width: 58ch; color: var(--muted); font-size: 17px; }

//         /* Headings on dark backgrounds: the site's global heading colour was winning, so force white. */
//         .hcx .hcx-why h2, .hcx .hcx-why h3,
//         .hcx .hcx-final h2,
//         .hcx .hcx-lux-cap h3 {
//           color: #fff !important;
//           -webkit-text-fill-color: #fff;
//         }

//         /* Buttons */
//         .hcx-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 50px; padding: 0 26px; border: 2px solid transparent; border-radius: 8px; font-size: 16px; font-weight: 600; line-height: 1; text-decoration: none; cursor: pointer; transition: background-color .18s ease, border-color .18s ease, color .18s ease; }
//         .hcx-btn-primary { background: var(--orange); border-color: var(--orange); color: var(--ink) !important; }
//         .hcx-btn-primary:hover { background: var(--orange-hover); border-color: var(--orange-hover); }
//         .hcx-btn-ghost { background: transparent; border-color: currentColor; }
//         .hcx-btn-ghost:hover { background: rgba(255,255,255,.12); }
//         .hcx-btn-outline { border-color: var(--forest); color: var(--forest); background: transparent; }
//         .hcx-btn-outline:hover { background: var(--forest); color: #fff; }
//         .hcx-btn:disabled { opacity: .7; cursor: progress; }
//         .hcx a:focus-visible, .hcx button:focus-visible, .hcx input:focus-visible, .hcx select:focus-visible, .hcx summary:focus-visible { outline: 3px solid var(--orange); outline-offset: 3px; }
//         .hcx-link { display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; font-weight: 600; font-size: 15px; color: var(--forest); text-decoration: none; border-bottom: 2px solid var(--orange); padding-bottom: 2px; }
//         .hcx-link:hover { color: #000; }

//         /* ------------------------------ Hero banner ------------------------------ */
//         .hcx-hero { position: relative; background: var(--stone); }
//         .hcx-stage { position: relative; height: clamp(720px, 46vw, 800px); overflow: hidden; background: linear-gradient(135deg, #e3e8e4, #eef1ee); }
//         .hcx-slide-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
//         .hcx-wash { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(238,241,238,.97) 0%, rgba(238,241,238,.9) 38%, rgba(238,241,238,.4) 62%, rgba(238,241,238,0) 82%); }
//         .hcx-intro-wrap { position: relative; height: 100%; display: flex; align-items: center; }
//         .hcx-intro { width: min(660px, calc(100% - var(--form-w) - 40px)); padding-block: 48px; }
//         .hcx-typed { font-size: clamp(34px, 4.4vw, 62px); line-height: 1.08; font-weight: 600; letter-spacing: -0.03em; min-height: calc(1.08em * 4); color: var(--ink); }
//         .hcx-caret { display: inline-block; width: 3px; height: .85em; margin-left: 5px; vertical-align: -0.08em; background: var(--orange); animation: hcx-blink 1s steps(1) infinite; }
//         .hcx-hero-desc { margin-top: 18px; max-width: 48ch; font-size: 17px; }
//         .hcx-hero-desc, .hcx-hero-desc * { color: var(--ink) !important; }
//         .hcx-hero-desc p { margin: 0; }
//         .hcx-points { list-style: none; display: grid; gap: 10px; margin: 24px 0 0; padding: 0; }
//         .hcx-points li { display: flex; align-items: center; gap: 12px; font-weight: 500; }
//         .hcx-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
//         @keyframes hcx-blink { 50% { opacity: 0; } }

//         /* Form: floats over the right of the banner on desktop */
//         .hcx-form-slot { position: absolute; z-index: 5; top: 32px; right: calc((100% - min(1240px, 100% - 48px)) / 2); width: var(--form-w); }
//         .hcx-form-card { background: #fff; color: var(--ink); border-radius: 12px; padding: clamp(22px, 3vw, 30px); box-shadow: 0 24px 60px rgba(5,20,15,.28); scroll-margin-top: 24px; }
//         .hcx-form-card h2 { font-size: 24px; line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; }
//         .hcx-form-intro { margin: 8px 0 18px; color: var(--muted); font-size: 14px; line-height: 1.55; }
//         .hcx-form { display: grid; gap: 14px; }
//         .hcx-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
//         .hcx-field { display: grid; gap: 6px; min-width: 0; }
//         .hcx-field > span { font-size: 13px; font-weight: 600; }
//         .hcx-field em { font-style: normal; font-weight: 400; color: var(--muted); }
//         .hcx-field input, .hcx-field select { width: 100%; min-height: 46px; padding: 0 14px; border: 1px solid #b8c2bc; border-radius: 8px; background: #fff; color: var(--ink); font-size: 15px; font-weight: 400; }
//         .hcx-field input::placeholder { color: #7d8781; font-size: 15px; }
//         .hcx-field input[aria-invalid="true"] { border-color: #b42318; background: #fff8f7; }
//         .hcx-err { display: block; margin-top: 2px; color: #b42318; font-size: 12.5px; line-height: 1.4; font-weight: 500; }
//         .hcx-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
//         .hcx-consent { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: var(--muted); line-height: 1.5; }
//         .hcx-consent input { width: 18px; height: 18px; margin-top: 2px; accent-color: var(--forest); flex: 0 0 auto; }
//         .hcx-consent input[aria-invalid="true"] { outline: 2px solid #b42318; outline-offset: 2px; }
//         .hcx-consent a { color: var(--forest); text-decoration: underline; }
//         .hcx-form-submit { width: 100%; }

//         /* Stats: numbers count up */
//         .hcx-stats { background: var(--forest); color: #fff; }
//         .hcx-stats-grid { list-style: none; margin: 0 auto; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); }
//         .hcx-stats-grid li { padding: 28px 24px; border-left: 1px solid rgba(255,255,255,.16); }
//         .hcx-stats-grid li:first-child { border-left: 0; padding-left: 0; }
//         .hcx-stat-value { display: block; font-size: clamp(30px, 3.6vw, 44px); font-weight: 600; line-height: 1.1; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
//         .hcx-stat-label { display: block; margin-top: 4px; font-size: 14px; color: rgba(255,255,255,.8); }

//         /* Ready-to-go designs */
//         .hcx-head { display: flex; justify-content: space-between; align-items: end; gap: 28px; flex-wrap: wrap; }
//         .hcx-ready-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 44px; }
//         .hcx-ready-card { display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: #fff; text-decoration: none; transition: box-shadow .2s ease, transform .2s ease; }
//         .hcx-ready-card:hover { box-shadow: 0 14px 34px rgba(18,59,48,.14); transform: translateY(-3px); }
//         .hcx-ready-img { aspect-ratio: 4 / 3; overflow: hidden; background: linear-gradient(135deg, var(--forest), var(--forest-soft)); }
//         .hcx-ready-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
//         .hcx-ready-card:hover .hcx-ready-img img { transform: scale(1.05); }
//         .hcx-ready-ph { display: grid; place-items: center; height: 100%; padding: 16px; color: #fff; font-size: 20px; font-weight: 600; text-align: center; }
//         .hcx-ready-body { display: flex; flex-direction: column; flex: 1; padding: 18px 18px 20px; }
//         .hcx-ready-body h3 { font-size: 18px; font-weight: 600; line-height: 1.3; }
//         .hcx-ready-body p { margin-top: 6px; color: var(--muted); font-size: 14px; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
//         .hcx-ready-cta { margin-top: auto; padding-top: 14px; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--forest); }
//         .hcx-foot { margin-top: 40px; display: flex; flex-wrap: wrap; gap: 12px; }

//         /* Luxury projects: name sits on the photo */
//         .hcx-luxury { background: var(--stone); }
//         .hcx-lux-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; margin-top: 44px; }
//         .hcx-lux-card { position: relative; display: block; grid-column: span 6; height: clamp(250px, 26vw, 380px); border-radius: 8px; overflow: hidden; text-decoration: none; color: #fff; background: radial-gradient(circle at 82% 16%, rgba(255,139,73,.3), transparent 44%), linear-gradient(135deg, var(--forest), var(--forest-soft)); }
//         .hcx-lux-card:nth-child(4n+1), .hcx-lux-card:nth-child(4n) { grid-column: span 5; }
//         .hcx-lux-card:nth-child(4n+2), .hcx-lux-card:nth-child(4n+3) { grid-column: span 7; }
//         .hcx-lux-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
//         .hcx-lux-card:hover img { transform: scale(1.05); }
//         .hcx-lux-cap { position: absolute; left: 0; right: 0; bottom: 0; padding: 64px 22px 20px; background: linear-gradient(0deg, rgba(8,16,12,.8), rgba(8,16,12,0)); }
//         .hcx-lux-cap h3 { font-size: 24px; font-weight: 700; line-height: 1.2; text-shadow: 0 1px 8px rgba(0,0,0,.4); }
//         .hcx-lux-cap p { margin-top: 4px; display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: rgba(255,255,255,.92); }

//         /* Why us: three cards */
//         .hcx-why { background: var(--forest); color: #fff; }
//         .hcx-why .hcx-lead { color: rgba(255,255,255,.84); }
//         .hcx-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px; }
//         .hcx-why-card { padding: 30px 28px 32px; border: 1px solid rgba(255,255,255,.2); border-radius: 14px; background: rgba(255,255,255,.06); transition: background-color .2s ease, transform .2s ease, border-color .2s ease; }
//         .hcx-why-card:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.36); transform: translateY(-4px); }
//         .hcx-why-icon { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 14px; background: var(--orange); color: var(--ink); }
//         .hcx-why-card h3 { margin-top: 22px; font-size: 22px; font-weight: 600; line-height: 1.25; }
//         .hcx-why-card p { margin-top: 10px; color: rgba(255,255,255,.86); font-size: 16px; }

//         /* Experience centers */
//         .hcx-center-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 44px; }
//         .hcx-center-card { display: flex; flex-direction: column; padding: 28px; border: 1px solid var(--line); border-radius: 14px; background: #fff; transition: box-shadow .2s ease, transform .2s ease; }
//         .hcx-center-card:hover { box-shadow: 0 14px 34px rgba(18,59,48,.12); transform: translateY(-3px); }
//         .hcx-center-pin { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: var(--stone); color: var(--forest); }
//         .hcx-center-card h3 { margin-top: 18px; font-size: 24px; line-height: 1.2; font-weight: 600; }
//         .hcx-center-tag { margin-top: 2px; font-size: 14px; color: var(--muted); }
//         .hcx-center-addr { margin-top: 16px; font-size: 15px; line-height: 1.6; color: var(--ink); }
//         .hcx-center-phone { margin-top: 12px; font-size: 15px; font-weight: 600; color: var(--forest); text-decoration: none; }
//         .hcx-center-actions { margin-top: auto; padding-top: 22px; display: flex; flex-wrap: wrap; gap: 10px; }
//         .hcx-center-actions .hcx-btn { min-height: 44px; padding: 0 18px; font-size: 15px; }
//         .hcx-more-centers { margin-top: 28px; color: var(--muted); font-size: 15px; }
//         .hcx-more-centers a { color: var(--forest); font-weight: 600; margin-left: 6px; }

//         /* Areas */
//         .hcx-areas { position: relative; overflow: hidden; color: #fff; background-color: var(--forest); background-image: radial-gradient(circle at 10% 14%, rgba(255,139,73,.18), transparent 36%), radial-gradient(circle at 94% 90%, rgba(255,255,255,.08), transparent 42%); }
//         .hcx .hcx-areas h2 { color: #fff !important; -webkit-text-fill-color: #fff; }
//         .hcx-areas .hcx-lead { color: rgba(255,255,255,.86); }
//         .hcx-areas-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 88px); align-items: start; }
//         .hcx-areas-intro { position: sticky; top: 32px; }
//         .hcx-areas-facts { display: flex; gap: 32px; margin-top: 28px; }
//         .hcx-areas-facts strong { display: block; font-size: clamp(30px, 3.4vw, 42px); line-height: 1.1; font-weight: 600; font-variant-numeric: tabular-nums; }
//         .hcx-areas-facts span { display: block; margin-top: 2px; font-size: 14px; color: rgba(255,255,255,.8); }
//         .hcx-areas-help { margin-top: 32px; padding: 22px; border: 1px solid rgba(255,255,255,.22); border-radius: 14px; background: rgba(255,255,255,.06); }
//         .hcx-areas-help p { font-size: 15px; color: rgba(255,255,255,.92); }
//         .hcx-areas-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
//         .hcx-areas-actions .hcx-btn { min-height: 44px; padding: 0 18px; font-size: 15px; }
//         .hcx-areas-actions .hcx-btn-ghost { color: #fff; }
//         .hcx-area-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
//         .hcx-area-tile { display: flex; align-items: center; gap: 14px; padding: 18px 20px; border: 1px solid rgba(255,255,255,.22); border-radius: 14px; background: rgba(255,255,255,.05); color: #fff; text-decoration: none; transition: background-color .2s ease, border-color .2s ease, color .2s ease, transform .2s ease; }
//         .hcx-area-tile:hover { background: var(--orange); border-color: var(--orange); color: var(--ink); transform: translateY(-2px); }
//         .hcx-area-pin { flex: 0 0 auto; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,.14); transition: background-color .2s ease; }
//         .hcx-area-tile:hover .hcx-area-pin { background: rgba(24,32,28,.14); }
//         .hcx-area-text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
//         .hcx-area-name { font-size: 19px; font-weight: 600; line-height: 1.25; }
//         .hcx-area-sub { font-size: 13.5px; line-height: 1.35; opacity: .82; }
//         .hcx-area-go { flex: 0 0 auto; opacity: .6; transition: transform .2s ease, opacity .2s ease; }
//         .hcx-area-tile:hover .hcx-area-go { opacity: 1; transform: translateX(4px); }

//         /* FAQ */
//         .hcx-faq-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 88px); align-items: start; }
//         .hcx-faq-intro { position: sticky; top: 32px; }
//         .hcx-faq-item { border-top: 1px solid var(--line); }
//         .hcx-faq-item:last-child { border-bottom: 1px solid var(--line); }
//         .hcx-faq-item summary { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px 0; font-size: 18px; font-weight: 600; line-height: 1.35; cursor: pointer; list-style: none; }
//         .hcx-faq-item summary::-webkit-details-marker { display: none; }
//         .hcx-faq-item summary::after { content: "+"; flex: 0 0 auto; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: var(--stone); font-size: 22px; font-weight: 400; line-height: 1; }
//         .hcx-faq-item[open] summary::after { content: "–"; background: var(--orange); }
//         .hcx-faq-answer { padding: 0 52px 24px 0; color: var(--muted); font-size: 16px; }
//         .hcx-faq-answer p { margin: 0 0 10px; }
//         .hcx-faq-answer, .hcx-faq-answer * { color: var(--muted) !important; }

//         /* Final CTA */
//         .hcx-final { background: var(--ink); color: #fff; }
//         .hcx-final-inner { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 40px; align-items: center; }
//         .hcx-final h2 { font-size: clamp(30px, 4.4vw, 54px); line-height: 1.08; font-weight: 600; letter-spacing: -0.025em; max-width: 16ch; }
//         .hcx-final-desc { margin-top: 16px; max-width: 48ch; }
//         .hcx-final-desc, .hcx-final-desc * { color: rgba(255,255,255,.86) !important; }
//         .hcx-final-desc p { margin: 0; }
//         .hcx-final-actions { display: grid; gap: 12px; justify-items: stretch; }
//         .hcx-final-actions .hcx-btn-ghost { color: #fff; }

//         /* Mobile bar */
//         .hcx-mobile-bar { display: none; }
//         .hcx-modal-open { filter: none; }

//         @media (max-width: 1100px) {
//           .hcx-ready-grid { grid-template-columns: repeat(2, 1fr); }
//           .hcx-why-grid, .hcx-center-grid { grid-template-columns: repeat(2, 1fr); }
//         }
//         @media (max-width: 1023px) {
//           .hcx-stage { height: auto; }
//           .hcx-intro-wrap { height: auto; padding-block: 44px; }
//           .hcx-intro { width: 100%; padding-block: 0; }
//           .hcx-wash { background: linear-gradient(180deg, rgba(238,241,238,.95) 0%, rgba(238,241,238,.88) 100%); }
//           .hcx-form-slot { position: static; width: auto; padding: 28px 16px 36px; background: var(--stone); }
//           .hcx-form-card { max-width: 560px; margin-inline: auto; box-shadow: 0 10px 30px rgba(5,20,15,.12); }
//         }
//         @media (max-width: 900px) {
//           .hcx-stats-grid { grid-template-columns: repeat(2, 1fr); }
//           .hcx-stats-grid li:nth-child(odd) { border-left: 0; padding-left: 0; }
//           .hcx-stats-grid li:nth-child(n+3) { border-top: 1px solid rgba(255,255,255,.16); }
//           .hcx-faq-grid, .hcx-final-inner, .hcx-areas-grid { grid-template-columns: 1fr; }
//           .hcx-areas-intro { position: static; }
//           .hcx-faq-intro { position: static; }
//           .hcx-lux-grid { grid-template-columns: repeat(2, 1fr); }
//           .hcx-lux-card, .hcx-lux-card:nth-child(n) { grid-column: span 1; }
//         }
//         @media (max-width: 700px) {
//           .hcx { padding-bottom: 72px; }
//           .hcx-wrap { width: calc(100% - 32px); }
//           .hcx-hero-desc { font-size: 16px; }
//           .hcx-hero-actions .hcx-btn { flex: 1 1 100%; }
//           .hcx-only-desktop { display: none !important; }
//           .hcx-form-row { grid-template-columns: 1fr; }
//           .hcx-ready-grid, .hcx-why-grid, .hcx-center-grid, .hcx-area-grid { grid-template-columns: 1fr; }
//           .hcx-areas-actions .hcx-btn { flex: 1 1 100%; }
//           .hcx-lux-grid { grid-template-columns: 1fr; }
//           .hcx-lux-card { height: 260px; }
//           .hcx-foot .hcx-btn { width: 100%; }
//           .hcx-faq-item summary { font-size: 16px; }
//           .hcx-faq-answer { padding-right: 0; }
//           .hcx-final-actions .hcx-btn { width: 100%; }
//           .hcx-mobile-bar { position: fixed; z-index: 90; left: 0; right: 0; bottom: 0; display: grid; grid-template-columns: 1fr 1.6fr; gap: 10px; padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 0px)); background: #fff; box-shadow: 0 -6px 24px rgba(0,0,0,.14); }
//           .hcx-mobile-bar .hcx-btn { min-height: 48px; padding: 0 12px; font-size: 15px; }
//         }
//         @media (prefers-reduced-motion: reduce) {
//           .hcx *, .hcx *::before, .hcx *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; scroll-behavior: auto !important; }
//           .hcx-caret { animation: none; }
//         }
//       `}</style>

//       {/* Hero: one banner, typing headline on the left, buttons under the points, form on the right */}
//       <section className="hcx-hero" aria-label="High Creation Interior">
//         <h1 className="hcx-sr">{phrases[0]}</h1>

//         <div className="hcx-stage">
//           <SlideImage src={HERO_INTERIOR} priority className="hcx-slide-img" />
//           <div className="hcx-wash" />
//           <div className="hcx-wrap hcx-intro-wrap">
//             <div className="hcx-intro">
//               <div className="hcx-typed" aria-hidden="true">
//                 <span>{typed}</span>
//                 <i className="hcx-caret" />
//               </div>
//               <Html className="hcx-hero-desc" html={heroDesc} />
//               <ul className="hcx-points">
//                 {HERO_POINTS.map((point) => (
//                   <li key={point}><Tick /> {point}</li>
//                 ))}
//               </ul>
//               <div className="hcx-hero-actions">
//                 <a className="hcx-btn hcx-btn-primary" href="/estimator-for-home">Get a free estimate</a>
//                 <a className="hcx-btn hcx-btn-outline hcx-only-desktop" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//                 <a className="hcx-btn hcx-btn-outline" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="hcx-form-slot">
//           <LeadForm />
//         </div>
//       </section>

//       {/* Trust numbers: count up when scrolled into view */}
//       <section className="hcx-stats" aria-label="High Creation Interior at a glance">
//         <div className="hcx-wrap">
//           <ul className="hcx-stats-grid">
//             {STATS.map((stat) => (
//               <li key={stat.label}>
//                 <span className="hcx-stat-value">
//                   <CountUp end={stat.end} suffix={stat.suffix} reduceMotion={reduceMotion} />
//                 </span>
//                 <span className="hcx-stat-label">{stat.label}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>

//       {/* Ready-to-go designs */}
//       <section className="hcx-section" id="hcx-ready" aria-labelledby="hcx-ready-title">
//         <div className="hcx-wrap">
//           <div className="hcx-head">
//             <div>
//               <h2 id="hcx-ready-title" className="hcx-h2">Ready-to-go designs for every room</h2>
//               <p className="hcx-lead">Thoughtfully crafted interiors that combine good looks with smart functionality. Pick a room and start from a design you like.</p>
//             </div>
//             <a className="hcx-link" href="/ready-togo-design">View all designs <Arrow /></a>
//           </div>
//           <div className="hcx-ready-grid">
//             {readyCards.map((card) => (
//               <a className="hcx-ready-card" key={card.id} href={card.href}>
//                 <div className="hcx-ready-img">
//                   {card.image ? (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img src={card.image} alt={card.alt || `${card.title} interior design by High Creation Interior`} loading="lazy" decoding="async" width="640" height="480" />
//                   ) : (
//                     <span className="hcx-ready-ph">{card.title}</span>
//                   )}
//                 </div>
//                 <div className="hcx-ready-body">
//                   <h3>{card.title}</h3>
//                   {card.text ? <p>{card.text}</p> : null}
//                   <span className="hcx-ready-cta">View designs <Arrow /></span>
//                 </div>
//               </a>
//             ))}
//           </div>
//           <div className="hcx-foot">
//             <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Get a free consultation</a>
//           </div>
//         </div>
//       </section>

//       {/* Luxury projects */}
//       <section className="hcx-section hcx-luxury" id="hcx-luxury" aria-labelledby="hcx-luxury-title">
//         <div className="hcx-wrap">
//           <div className="hcx-head">
//             <div>
//               <h2 id="hcx-luxury-title" className="hcx-h2">Luxury project concepts</h2>
//               <p className="hcx-lead">Feel the luxury. Live the experience. Premium materials, bespoke details and timeless design in every home we create.</p>
//             </div>
//             <a className="hcx-link" href="/luxury-projects/">View all luxury projects <Arrow /></a>
//           </div>
//           <div className="hcx-lux-grid">
//             {luxuryCards.map((card) => (
//               <a className="hcx-lux-card" key={card.id} href={card.href}>
//                 {card.image ? (
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img src={card.image} alt={card.alt || `${card.title}, luxury interior by High Creation Interior`} loading="lazy" decoding="async" />
//                 ) : null}
//                 <div className="hcx-lux-cap">
//                   <h3>{card.title}</h3>
//                   <p>{card.text || "View project"} {!card.text ? <Arrow /> : null}</p>
//                 </div>
//               </a>
//             ))}
//           </div>
//           <div className="hcx-foot">
//             <a className="hcx-btn hcx-btn-outline" href="/luxury-projects/">Explore luxury projects</a>
//             <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Talk to a designer</a>
//           </div>
//         </div>
//       </section>

//       {/* Why High Creation Interior: three cards */}
//       <section className="hcx-section hcx-why" aria-labelledby="hcx-why-title">
//         <div className="hcx-wrap">
//           <h2 id="hcx-why-title" className="hcx-h2">Your space designed around you, not around a fixed design</h2>
//           <p className="hcx-lead">One team handles design and production, so what you approve is what gets built.</p>
//           <div className="hcx-why-grid">
//             {WHY_POINTS.map((point) => (
//               <article className="hcx-why-card" key={point.key}>
//                 <span className="hcx-why-icon">{WHY_ICONS[point.key]}</span>
//                 <h3>{point.title}</h3>
//                 <p>{point.text}</p>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Experience centers */}
//       <section className="hcx-section" id="hcx-centers" aria-labelledby="hcx-centers-title">
//         <div className="hcx-wrap">
//           <div className="hcx-head">
//             <div>
//               <h2 id="hcx-centers-title" className="hcx-h2">Visit an experience center near you</h2>
//               <p className="hcx-lead">Walk through finished rooms, feel the materials and talk to a designer in person.</p>
//             </div>
//           </div>
//           <div className="hcx-center-grid">
//             {CENTER_CARDS.map((center) => (
//               <article className="hcx-center-card" key={center.city}>
//                 <span className="hcx-center-pin"><PinIcon /></span>
//                 <h3>{center.city}</h3>
//                 <p className="hcx-center-tag">Experience center</p>
//                 <p className="hcx-center-addr">{center.address}</p>
//                 <a className="hcx-center-phone" href={PHONE_TEL}>{PHONE_LABEL}</a>
//                 <div className="hcx-center-actions">
//                   <a className="hcx-btn hcx-btn-primary" href={mapsUrl(center.address)} target="_blank" rel="noreferrer">Get directions</a>
//                   <a className="hcx-btn hcx-btn-outline" href={center.href}>See the center</a>
//                 </div>
//               </article>
//             ))}
//           </div>
//           <p className="hcx-more-centers">
//             Also visit us in
//             {OTHER_CENTERS.map((center, index) => (
//               <a key={center.label} href={center.href}>{center.label}{index < OTHER_CENTERS.length - 1 ? "," : ""}</a>
//             ))}
//           </p>
//         </div>
//       </section>

//       {/* Where we work */}
//       <section className="hcx-section hcx-areas" aria-labelledby="hcx-areas-title">
//         <div className="hcx-wrap hcx-areas-grid">
//           <div className="hcx-areas-intro">
//             <h2 id="hcx-areas-title" className="hcx-h2">Areas we serve across Delhi NCR</h2>
//             <p className="hcx-lead">Pick your area to see how we design and deliver homes there.</p>
//             <div className="hcx-areas-facts">
//               <div><strong>{AREAS.length}</strong><span>areas covered</span></div>
//               <div><strong>5</strong><span>branches across NCR</span></div>
//             </div>
//             <div className="hcx-areas-help">
//               <p>Not sure we cover your area? Call us and we will tell you right away.</p>
//               <div className="hcx-areas-actions">
//                 <a className="hcx-btn hcx-btn-primary" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//                 <a className="hcx-btn hcx-btn-ghost" href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp us</a>
//               </div>
//             </div>
//           </div>
//           <ul className="hcx-area-grid">
//             {AREAS.map((area) => (
//               <li key={area.label}>
//                 <a className="hcx-area-tile" href={area.href}>
//                   <span className="hcx-area-pin"><PinIcon /></span>
//                   <span className="hcx-area-text">
//                     <span className="hcx-area-name">{area.label}</span>
//                     <span className="hcx-area-sub">Interior designers in {area.label}</span>
//                   </span>
//                   <span className="hcx-area-go"><Arrow /></span>
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>

//       {/* FAQ (CMS: faqs) */}
//       {faqLoading || faqError || faqs.length > 0 ? (
//         <section className="hcx-section" aria-labelledby="hcx-faq-title">
//           <div className="hcx-wrap hcx-faq-grid">
//             <div className="hcx-faq-intro">
//               <h2 id="hcx-faq-title" className="hcx-h2">Questions before you begin</h2>
//               <p className="hcx-lead">Clear answers to the things people ask us most. Still unsure? Call us and we will walk you through it.</p>
//               <a className="hcx-link" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//             </div>
//             <div>
//               {faqLoading ? <p className="hcx-lead">Loading FAQs…</p> : null}
//               {faqError ? <p className="hcx-lead">{faqError}</p> : null}
//               {!faqLoading && !faqError && faqs.map((faq, index) => (
//                 <details className="hcx-faq-item" key={faq.key} open={index === 0}>
//                   <summary>{faq.title || "Frequently asked question"}</summary>
//                   <Html className="hcx-faq-answer" html={faq.description || ""} />
//                 </details>
//               ))}
//             </div>
//           </div>
//         </section>
//       ) : null}

//       {/* Final CTA */}
//       <section className="hcx-section hcx-final" aria-labelledby="hcx-final-title">
//         <div className="hcx-wrap hcx-final-inner">
//           <div>
//             <h2 id="hcx-final-title">{data6?.top_title || "Let’s plan the home you want to come back to."}</h2>
//             <Html
//               className="hcx-final-desc"
//               html={data6?.top_description || "Tell us about your space. A High Creation Interior designer will help you plan a practical, personal next step."}
//             />
//           </div>
//           <div className="hcx-final-actions">
//             <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Book free consultation</a>
//             <a className="hcx-btn hcx-btn-ghost" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
//             <a className="hcx-btn hcx-btn-ghost" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
//           </div>
//         </div>
//       </section>

//       {/* Mobile sticky actions: always on screen */}
//       <div className="hcx-mobile-bar">
//         <a className="hcx-btn hcx-btn-outline" href={PHONE_TEL}>Call us</a>
//         <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Book free consultation</a>
//       </div>

//       <ContactUsPopUp onModalStateChange={handleModalStateChange} />
//     </div>
//   );
// }


"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import DOMPurify from "isomorphic-dompurify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/utils/api";
import { buildLeadMetadata } from "@/utils/leadForms";
import { leadSchema, normalizePhone } from "@/utils/leadValidation";

// Lazy-loaded: triggered later by scroll/time/exit intent, must not delay first paint.
const ContactUsPopUp = dynamic(() => import("../components/ContactUsPopUp"), {
  ssr: false,
});

/* -------------------------------------------------------------------------- */
/*  Static content, taken from https://www.hcinterior.in/                     */
/* -------------------------------------------------------------------------- */

// Put hero-interior.webp in  public/images/landing/  (delivered next to this file).
const HERO_INTERIOR = "/images/landing/hero-interior.webp";

const PHONE_TEL = "tel:+917070701373";
const PHONE_LABEL = "+91 70707 01373";
const WHATSAPP = "https://wa.me/919560277787";

const HERO_POINTS = [
  "Free design consultation",
  "Complete customization",
  "In-house production",
];

// Typed in the banner. The CMS headline (if any) is always typed first.
const TYPED_PHRASES = [
  "Designed around you, not around a fixed design.",
  "Made in our own production facility.",
  "Complete customization for every room.",
  "2,750+ projects completed across Delhi NCR.",
];

// `end` is what the number counts up to when the section scrolls into view.
const STATS = [
  { end: 8, suffix: "+", label: "years of experience" },
  { end: 2750, suffix: "+", label: "projects completed" },
  { end: 450, suffix: "+", label: "people on our team" },
  { end: 5, suffix: "", label: "branches across NCR" },
];

const WHY_POINTS = [
  {
    key: "custom",
    title: "Complete customization",
    text: "Every project is designed around your vision, your space and your lifestyle, not a fixed catalogue.",
  },
  {
    key: "inhouse",
    title: "In-house production",
    text: "We make furniture, fixtures and design elements in our own facility, so quality, cost and timelines stay in our hands.",
  },
  {
    key: "team",
    title: "One team, one roof",
    text: "Design and production are managed together, which means fewer third-party vendors and a smoother process.",
  },
];

// Addresses are from hcinterior.in/contact
const CENTER_CARDS = [
  {
    city: "Noida",
    address: "H101, LGF, Sector-63, Noida, Uttar Pradesh - 201301",
    href: "/experience-center/",
  },
  {
    city: "Noida Extension",
    address: "Galaxy Blue Sapphire Plaza, Noida Extension, Haibatpur, Sector 4, Greater Noida, Uttar Pradesh 201305",
    href: "/experience-center-noida-extension/",
  },
  {
    city: "Gurugram",
    address: "DDC Arcade, 1st Floor, Plot No 1 Main, Sector 48 Road, Badshahpur Sohna Rd, Opposite Vipul Business Park, Gurugram, Haryana 122018",
    href: "/experience-center-gurugram/",
  },
];

const OTHER_CENTERS = [
  { label: "Faridabad", href: "/experience-center-faridabad/" },
  { label: "New Delhi", href: "/experience-center-new-delhi/" },
];

const AREAS = [
  // Order matters: tiles fill left to right, so each pair below shares a row.
  { label: "Noida", href: "/interior-designers-in-noida" },
  { label: "Ghaziabad", href: "/interior-designers-in-ghaziabad" },
  { label: "Greater Noida", href: "/interior-designers-in-greater-noida" },
  { label: "Noida Extension", href: "/interior-designer-in-noida-extension" },
  { label: "Delhi", href: "/interior-designers-in-delhi" },
  { label: "Dwarka", href: "/interior-designers-in-dwarka" },
  { label: "Gurugram", href: "/interior-designers-in-gurgaon" },
  { label: "Manesar", href: "/interior-designers-in-manesar" },
  { label: "Sohna", href: "/interior-designer-in-sohna-gurgaon" },
  { label: "Faridabad", href: "/interior-designers-in-faridabad" },
];


// Same CMS parent-child type that powers /ready-togo-design.
// Verify this name against ready-togo-design/page.jsx (and keep it in sync with page.jsx).
const READY_TO_GO_TYPE = "ready_to_go_design";

// CMS parent-child type behind /luxury-projects. The exact name is not visible from outside
// the site, so the first one of these that returns data is used. Open
// luxury-projects/page.jsx, copy the real name, and put it FIRST in this list.
// The browser console warns if none of them returns anything.
const LUXURY_TYPES = [
  "luxury_projects",
  "luxury_project",
  "luxury_project_concepts",
  "luxury_projects_concepts",
  "luxury_project_concept",
  "luxury_concepts",
  "luxury_design",
  "luxury",
];

// Shown only if the CMS returns nothing. Copy is from hcinterior.in/ready-togo-design.
const READY_FALLBACK = [
  { id: "living", title: "Living Room", text: "Design a living room that blends style and function, perfect for relaxation and gatherings.", href: "/ready-togo-design/gallery?id=5" },
  { id: "kitchen", title: "Modular Kitchen", text: "Your kitchen deserves perfection. Let’s create the dream space where cooking and style come together.", href: "/ready-togo-design/gallery?id=6" },
  { id: "master", title: "Master Bedroom", text: "Transform your master bedroom into a luxurious retreat where elegance and comfort create perfect tranquility.", href: "/ready-togo-design/gallery?id=3" },
  { id: "kids", title: "Kids Room", text: "A playful, cozy and colorful design that sparks creativity and fun.", href: "/ready-togo-design/gallery?id=7" },
  { id: "dining", title: "Dining", text: "Where every meal feels like a celebration. A stylish haven of comfort and elegance.", href: "/ready-togo-design/gallery?id=9" },
  { id: "mandir", title: "Mandir", text: "A serene sanctuary where devotion and design come together beautifully.", href: "/ready-togo-design/gallery?id=4" },
  { id: "parents", title: "Parents Room", text: "A haven of comfort and peace, designed with care.", href: "/ready-togo-design/gallery?id=1" },
  { id: "entrance", title: "Entrance", text: "Make a lasting first impression with a welcoming, functional entryway.", href: "/ready-togo-design/gallery?id=8" },
];

// Luxury project categories from hcinterior.in/luxury-projects (ids match project-gallery?id=).
// PREFERRED decides which six are shown when the CMS has more.
const LUXURY_PREFERRED_IDS = [23, 22, 18, 17, 16, 3];
const LUXURY_FALLBACK = [
  { id: 23, title: "Living Room" },
  { id: 22, title: "Premium Bedroom" },
  { id: 18, title: "Luxury Dining" },
  { id: 17, title: "Luxury Bathroom" },
  { id: 16, title: "Luxury Dressing Room" },
  { id: 3, title: "Bar Area" },
].map((item) => ({
  ...item,
  text: "",
  image: null,
  href: `/luxury-projects/project-gallery?id=${item.id}`,
}));

// Category names from hcinterior.in/luxury-projects, keyed by project-gallery id.
const LUXURY_TITLE_BY_ID = {
  26: "Wardrobe", 25: "Study Room", 24: "Roof", 23: "Living Room", 22: "Premium Bedroom",
  21: "Outdoor", 20: "Modular Kitchen", 19: "Mandir", 18: "Luxury Dining", 17: "Luxury Bathroom",
  16: "Luxury Dressing Room", 15: "Kids Room", 14: "Guest Room", 13: "Gate / Door",
  6: "Breakfast Counter", 3: "Bar Area", 1: "Balcony",
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const Html = memo(function Html({ html, className = "" }) {
  const clean = useMemo(() => DOMPurify.sanitize(html || ""), [html]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
});

const stripHtml = (html) => (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// A parent-child record can carry its card data on either side. Use the side that has content.
const cardContent = (record, preferParent = false) => {
  const child = record?.child_content;
  const parent = record?.parent_content;
  const [first, second] = preferParent ? [parent, child] : [child, parent];
  if (first && (first.title || first.image)) return first;
  return second || first || {};
};

// ---- Card images -------------------------------------------------------------
// The CMS has used different field names (and sometimes relative paths), so instead of
// trusting one key we look for an image URL anywhere inside the record.
const IMAGE_URL_RE = /(?:https?:\/\/|\/\/)?[^\s"'\\<>(),]+?\.(?:jpe?g|png|webp|avif|gif)(?:\?[^\s"'\\<>]*)?/i;

const apiOrigin = () => {
  try {
    const base = api?.defaults?.baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
    return base ? new URL(base).origin : "";
  } catch {
    return "";
  }
};

const resolveImageUrl = (raw) => {
  if (!raw || typeof raw !== "string") return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  const origin = apiOrigin();
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return origin ? `${origin}${path}` : path;
};

const findImageUrl = (value) => {
  if (!value) return null;
  const text = typeof value === "string" ? value : JSON.stringify(value);
  const match = text.match(IMAGE_URL_RE);
  return match ? resolveImageUrl(match[0]) : null;
};

// Named fields first (fast path), then a scan of the whole object.
const pickImage = (c) => {
  if (!c) return null;
  const first = Array.isArray(c.images) ? c.images[0] : null;
  const named =
    c.image ||
    c.cover_image ||
    c.thumbnail ||
    c.banner_image ||
    c.main_image ||
    (typeof first === "string" ? first : first?.image || first?.url);
  return resolveImageUrl(named) || findImageUrl(c);
};

// Image for a whole parent-child record: the card side first, then the other side, then everything.
const recordImage = (record, preferParent = false) => {
  const sides = preferParent
    ? [record?.parent_content, record?.child_content]
    : [record?.child_content, record?.parent_content];
  for (const side of sides) {
    const url = pickImage(side);
    if (url) return url;
  }
  return findImageUrl(record);
};

const OPTIMIZED_HOSTS = ["hcinterior.in", "www.hcinterior.in", "apidev.hcinterior.in", "localhost"];

function canOptimize(src) {
  if (!src || src.startsWith("//")) return false;
  if (src.startsWith("/")) return true;
  try {
    return OPTIMIZED_HOSTS.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}

function SlideImage({ src, alt = "", priority = false, className = "" }) {
  if (!src) return null;
  if (canOptimize(src)) {
    return <Image src={src} alt={alt} fill priority={priority} sizes="100vw" quality={80} className={className} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" className={className} />;
}

// Types each phrase, holds, deletes, then moves to the next, forever.
function useTypewriter(phrases, reduceMotion) {
  const [text, setText] = useState("");
  const key = phrases.join("|");

  useEffect(() => {
    const list = key.split("|").filter(Boolean);
    if (!list.length) return undefined;
    if (reduceMotion) {
      setText(list[0]);
      return undefined;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const phrase = list[phraseIndex];
      if (!deleting) {
        charIndex += 1;
        setText(phrase.slice(0, charIndex));
        if (charIndex >= phrase.length) {
          deleting = true;
          timer = window.setTimeout(tick, 1900);
          return;
        }
        timer = window.setTimeout(tick, 46);
      } else {
        charIndex -= 1;
        setText(phrase.slice(0, Math.max(charIndex, 0)));
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % list.length;
          timer = window.setTimeout(tick, 320);
          return;
        }
        timer = window.setTimeout(tick, 20);
      }
    };

    timer = window.setTimeout(tick, 450);
    return () => window.clearTimeout(timer);
  }, [key, reduceMotion]);

  return text;
}

// Counts from 0 to `end` the first time it scrolls into view.
function CountUp({ end, suffix = "", duration = 1900, reduceMotion }) {
  const ref = useRef(null);
  const [value, setValue] = useState(end);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion || typeof IntersectionObserver === "undefined") {
      setValue(end);
      return undefined;
    }

    setValue(0);
    let raf = 0;
    let started = false;

    const run = () => {
      const startTime = performance.now();
      const step = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // fast start, gentle landing
        setValue(Math.round(end * eased));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end, duration, reduceMotion]);

  return (
    <span ref={ref} className="hcx-count">
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Tick = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="9" fill="#ff8b49" />
    <path d="M5 9.3l2.6 2.6L13 6.6" stroke="#18201c" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const WHY_ICONS = {
  custom: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 8h20M4 14h20M4 20h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="9" cy="8" r="2.6" fill="#ff8b49" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="19" cy="14" r="2.6" fill="#ff8b49" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="20" r="2.6" fill="#ff8b49" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  inhouse: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M3 24V12l7 4v-4l7 4v-4l8 4v8H3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M19 12V4h4v10" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 24v-4h4v4M15 24v-4h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  team: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M3 13.5 14 4l11 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 12v12h16V12" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="11" cy="15.5" r="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="15.5" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 22c.4-2 1.6-3 3-3s2.6 1 3 3M14.5 22c.4-2 1.6-3 3-3s2.6 1 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

/* -------------------------------------------------------------------------- */
/*  Lead form (react-hook-form + zod, same API + tracking as before)           */
/* -------------------------------------------------------------------------- */

const EMPTY_FORM = {
  fullName: "",
  contact: "",
  email: "",
  place: "",
    query: "",
  termsAndConditions: false,
  website: "",
};

const CTA_TEXT = "Book free consultation";

function LeadForm() {
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: EMPTY_FORM,
    mode: "onTouched", // validate when a field is left, then live while fixing it
  });

  const onSubmit = async (values) => {
    if (values.website) return; // honeypot filled: bot, silently ignore

    const requestData = {
      name: values.fullName.trim().replace(/\s+/g, " "),
      mobile: normalizePhone(values.contact), // always a clean 10-digit number
      email: values.email.trim().toLowerCase(),
      place: values.place.trim(),
            query: values.query.trim().replace(/\s+/g, " "),
      ...buildLeadMetadata({
        pathname,
        leadFormType: "inline",
        leadFormName: "Creating The Home Of Your Dreams Lead Form",
        ctaText: CTA_TEXT.toUpperCase(),
      }),
    };

    try {
      const response = await api.post("/user-queries", requestData);
      if (response.status === 201) {
        reset(EMPTY_FORM);
        toast.success("Thank you. Our team will be in touch soon.");
        window.setTimeout(() => {
          window.location.href = "/thank-you";
        }, 300);
      } else {
        toast.error("We could not submit your details. Please try again.");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong. Please try again.");
      console.error("HCI landing enquiry submission failed:", error);
    }
  };

  return (
    <div className="hcx-form-card" id="hcx-enquiry-form">
      <h2>Get a free design consultation</h2>
      <p className="hcx-form-intro">Share a few details and a designer will call you to plan the next step.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="hcx-form" noValidate>
        <label className="hcx-field">
          <span>Your name</span>
          <input
            type="text"
            autoComplete="name"
            placeholder="Full name"
            maxLength={60}
            aria-invalid={errors.fullName ? "true" : "false"}
            {...register("fullName")}
          />
          {errors.fullName ? <small className="hcx-err" role="alert">{errors.fullName.message}</small> : null}
        </label>

        <label className="hcx-field">
          <span>Mobile number</span>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="10-digit mobile number"
            maxLength={16}
            aria-invalid={errors.contact ? "true" : "false"}
            {...register("contact")}
          />
          {errors.contact ? <small className="hcx-err" role="alert">{errors.contact.message}</small> : null}
        </label>

        <label className="hcx-field">
          <span>Email address</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            maxLength={100}
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email")}
          />
          {errors.email ? <small className="hcx-err" role="alert">{errors.email.message}</small> : null}
        </label>

        {/* <div className="hcx-form-row">
          <label className="hcx-field">
            <span>City <em>(optional)</em></span>
            <input
              type="text"
              autoComplete="address-level2"
              placeholder="Noida, Gurugram…"
              maxLength={50}
              aria-invalid={errors.place ? "true" : "false"}
              {...register("place")}
            />
            {errors.place ? <small className="hcx-err" role="alert">{errors.place.message}</small> : null}
          </label>
          <label className="hcx-field">
            <span>Property <em>(optional)</em></span>
            <select {...register("property")}>
              <option value="">Select</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
        </div> */}

                <label className="hcx-field">
          <span>City</span>
          <input
            type="text"
            autoComplete="address-level2"
            placeholder="Noida, Gurugram…"
            maxLength={50}
            aria-invalid={errors.place ? "true" : "false"}
            {...register("place")}
          />
          {errors.place ? <small className="hcx-err" role="alert">{errors.place.message}</small> : null}
        </label>

        <label className="hcx-field">
          <span>Your requirement</span>
          <textarea
            rows={2}
            maxLength={500}
            placeholder="Tell us about your space and what you need…"
            aria-invalid={errors.query ? "true" : "false"}
            {...register("query")}
          />
          {errors.query ? <small className="hcx-err" role="alert">{errors.query.message}</small> : null}
        </label>

        {/* Honeypot: hidden from people, bots tend to fill it */}
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hcx-hp" {...register("website")} />

        <div>
          <label className="hcx-consent">
            <input type="checkbox" aria-invalid={errors.termsAndConditions ? "true" : "false"} {...register("termsAndConditions")} />
            <span>
              I agree to the <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a> and terms.
            </span>
          </label>
          {errors.termsAndConditions ? <small className="hcx-err" role="alert">{errors.termsAndConditions.message}</small> : null}
        </div>

        <button className="hcx-btn hcx-btn-primary hcx-form-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : CTA_TEXT}
        </button>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

async function fetchSection(endpoint, setter) {
  try {
    const response = await api.get(endpoint, {});
    if (response?.data?.json_content) setter(response.data.json_content);
  } catch (error) {
    console.error(`HCI landing CMS request failed (${endpoint}):`, error);
  }
}

// Tries each CMS type name in order and returns the first list that has records.
async function fetchFirstAvailable(types) {
  for (const type of types) {
    try {
      const response = await api.get(`/cms-parent-child/${type}`);
      if (Array.isArray(response?.data) && response.data.length) return { type, data: response.data };
    } catch {
      /* try the next name */
    }
  }
  return null;
}

// Fallback that needs no CMS name: read the cards (id, name, photo) from the site's own
// /luxury-projects/ page, which already renders them. Same origin, so no CORS problem.
async function scrapeLuxuryCards() {
  try {
    const response = await fetch("/luxury-projects/", { headers: { Accept: "text/html" } });
    if (!response.ok) return [];
    const doc = new DOMParser().parseFromString(await response.text(), "text/html");
    const selector = 'a[href*="project-gallery?id="]';
    const found = new Map();

    doc.querySelectorAll(selector).forEach((link) => {
      let id = 0;
      try {
        id = Number(new URL(link.getAttribute("href"), window.location.origin).searchParams.get("id"));
      } catch {
        return;
      }
      if (!id || found.has(id)) return;

      // The photo is inside the link, or inside the card that holds it.
      let node = link;
      let img = link.querySelector("img");
      while (!img && node.parentElement && node.parentElement.querySelectorAll(selector).length <= 1) {
        node = node.parentElement;
        img = node.querySelector("img");
      }

      let src = img?.getAttribute("src") || "";
      if (src.startsWith("data:")) src = img?.getAttribute("data-src") || "";
      if (src.includes("/_next/image")) {
        // Use the original file instead of the optimizer's huge variant.
        try {
          src = new URL(src, window.location.origin).searchParams.get("url") || src;
        } catch {
          /* keep src as is */
        }
      }

      const heading = node.querySelector("h1,h2,h3,h4,h5,h6")?.textContent?.trim();
      found.set(id, {
        id,
        title: img?.getAttribute("alt")?.trim() || heading || LUXURY_TITLE_BY_ID[id],
        text: "",
        image: src ? resolveImageUrl(src) : null,
        href: `/luxury-projects/project-gallery?id=${id}`,
      });
    });

    return [...found.values()].filter((card) => card.title);
  } catch (error) {
    console.error("HCI luxury page could not be read:", error);
    return [];
  }
}

export default function HCLandingPage({ initialData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data1, setData1] = useState(initialData?.data1 ?? null);
  const [data6, setData6] = useState(initialData?.data6 ?? null);
  const [faqData, setFaqData] = useState(initialData?.faqs ?? []);
  const [faqLoading, setFaqLoading] = useState(initialData?.faqs == null);
  const [faqError, setFaqError] = useState("");
  const [readyDesigns, setReadyDesigns] = useState(initialData?.readyDesigns ?? []);
  const [luxuryDesigns, setLuxuryDesigns] = useState(initialData?.luxuryDesigns ?? []);
  const [luxuryScraped, setLuxuryScraped] = useState([]);
  const [brokenImages, setBrokenImages] = useState({});
  const markBroken = useCallback(
    (key) => setBrokenImages((prev) => (prev[key] ? prev : { ...prev, [key]: true })),
    []
  );
  const [reduceMotion, setReduceMotion] = useState(false);

  // Anything the server could not fetch is fetched here.
  useEffect(() => {
    const init = initialData || {};
    if (!init.data1) fetchSection("/cms-content/creating_the_home_of_your_dreams", setData1);
    if (!init.data6) fetchSection("/cms-content/creating_the_home_of_your_dreams_6", setData6);

    if (init.faqs == null) {
      api.get("/cms-content/faqs")
        .then((response) => setFaqData(Array.isArray(response?.data) ? response.data : []))
        .catch(() => setFaqError("FAQs could not be loaded right now."))
        .finally(() => setFaqLoading(false));
    }
    if (init.readyDesigns == null) {
      api.get(`/cms-parent-child/${READY_TO_GO_TYPE}`)
        .then((response) => setReadyDesigns(Array.isArray(response?.data) ? response.data : []))
        .catch((error) => console.error("HCI ready-to-go designs failed to load:", error));
    }
    if (init.luxuryDesigns == null) {
      fetchFirstAvailable(LUXURY_TYPES).then(async (result) => {
        if (result) {
          if (process.env.NODE_ENV === "development") {
            console.info(`HCI luxury projects loaded from "${result.type}". First record:`, result.data[0]);
          }
          setLuxuryDesigns(result.data);
          if (result.data.some((record) => recordImage(record, true))) return; // photos found, done
        }
        const scraped = await scrapeLuxuryCards();
        if (scraped.length) setLuxuryScraped(scraped);
        else if (!result) console.warn(`HCI luxury projects: no CMS type in LUXURY_TYPES returned data (${LUXURY_TYPES.join(", ")}) and /luxury-projects/ could not be read. Put the real CMS name first in LUXURY_TYPES.`);
      });
    }
  }, [initialData]);

  // Respect "reduce motion": no typing loop, no counting.
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(Boolean(mq?.matches));
    apply();
    mq?.addEventListener?.("change", apply);
    return () => mq?.removeEventListener?.("change", apply);
  }, []);

  /* ---------------------------- Hero content ---------------------------- */

  const cmsHeadline = stripHtml(data1?.mid_sub_title);
  const heroDesc =
    data1?.top_description ||
    "Customized home interiors across Delhi NCR, planned with you and made in our own production facility.";

  const phrases = useMemo(() => [cmsHeadline, ...TYPED_PHRASES].filter(Boolean), [cmsHeadline]);
  const typed = useTypewriter(phrases, reduceMotion);

  /* --------------------------- Section content --------------------------- */

  const readyCards = useMemo(() => {
    const fromCms = [...readyDesigns]
      .sort((a, b) => Number(a.id) - Number(b.id))
      .slice(0, 8)
      .map((record) => {
        const c = cardContent(record);
        return {
          id: record.id,
          title: c.title,
          text: stripHtml(c.description),
          image: recordImage(record),
          alt: c.image_alt,
          href: `/ready-togo-design/gallery?id=${record.id}`,
        };
      })
      .filter((card) => card.title);
    return fromCms.length ? fromCms : READY_FALLBACK;
  }, [readyDesigns]);

  const luxuryCards = useMemo(() => {
    const cmsCards = luxuryDesigns
      .map((record) => {
        const c = cardContent(record, true);
        return {
          id: record.id,
          title: c.title || c.name || c.heading || LUXURY_TITLE_BY_ID[Number(record.id)],
          text: stripHtml(c.description),
          image: recordImage(record, true),
          alt: c.image_alt,
          href: `/luxury-projects/project-gallery?id=${record.id}`,
        };
      })
      .filter((card) => card.title);

    // Cards from the CMS win; the page scrape fills in missing photos, or supplies everything.
    const scrapedById = new Map(luxuryScraped.map((card) => [Number(card.id), card]));
    const cards = (cmsCards.length ? cmsCards : luxuryScraped).map((card) => {
      const extra = scrapedById.get(Number(card.id));
      return !card.image && extra?.image ? { ...card, image: extra.image } : card;
    });

    if (!cards.length) return LUXURY_FALLBACK;
    const preferred = LUXURY_PREFERRED_IDS
      .map((id) => cards.find((card) => Number(card.id) === id))
      .filter(Boolean);
    const rest = cards
      .filter((card) => !preferred.includes(card))
      .sort((a, b) => Number(b.id) - Number(a.id));
    return [...preferred, ...rest].slice(0, 6);
  }, [luxuryDesigns, luxuryScraped]);

  const faqs = useMemo(
    () =>
      faqData
        .map((faq) => faq?.json_content || faq || {})
        .map((item, index) => ({ ...item, key: faqData[index]?.id || `${item.title}-${index}` }))
        .filter((item) => item.title || item.description),
    [faqData]
  );
  const handleModalStateChange = useCallback((open) => setIsModalOpen(open), []);

  const mapsUrl = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <div className={`hcx ${isModalOpen ? "hcx-modal-open" : ""}`}>
      <style jsx global>{`
        .hcx {
          --ink: #18201c;
          --forest: #123b30;
          --forest-soft: #1c4e41;
          --stone: #eef1ee;
          --muted: #56605a;
          --line: #d5dcd7;
          --orange: #ff8b49;
          --orange-hover: #f27a35;
          --hcx-font: var(--font-poppins, system-ui), system-ui, Arial, sans-serif;
          --form-w: clamp(360px, 36vw, 420px);
          color: var(--ink);
          background: #fff;
          font-family: var(--hcx-font);
          font-size: 16px;
          line-height: 1.6;
          overflow: clip;
        }
        .hcx *, .hcx *::before, .hcx *::after { box-sizing: border-box; }
        .hcx img, .hcx video { max-width: 100%; display: block; }
        .hcx a { color: inherit; }
        .hcx h1, .hcx h2, .hcx h3, .hcx p { margin: 0; }
        .hcx h1, .hcx h2, .hcx h3 { color: inherit; font-family: inherit; }
        .hcx button, .hcx input, .hcx select { font-family: var(--hcx-font); }
        .hcx .hcx-field input, .hcx .hcx-field select, .hcx .hcx-field input::placeholder { font-family: var(--hcx-font) !important; }
        .hcx-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        .hcx-wrap { width: min(1240px, calc(100% - 48px)); margin-inline: auto; }
        .hcx-section { padding-block: clamp(56px, 8vw, 104px); }
        .hcx-h2 { font-size: clamp(28px, 3.6vw, 44px); line-height: 1.12; font-weight: 600; letter-spacing: -0.02em; max-width: 22ch; }
        .hcx-lead { margin-top: 14px; max-width: 58ch; color: var(--muted); font-size: 17px; }

        /* Headings on dark backgrounds: the site's global heading colour was winning, so force white. */
        .hcx .hcx-why h2, .hcx .hcx-why h3,
        .hcx .hcx-final h2,
        .hcx .hcx-lux-cap h3 {
          color: #fff !important;
          -webkit-text-fill-color: #fff;
        }

        /* Buttons */
        .hcx-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 50px; padding: 0 26px; border: 2px solid transparent; border-radius: 8px; font-size: 16px; font-weight: 600; line-height: 1; text-decoration: none; cursor: pointer; transition: background-color .18s ease, border-color .18s ease, color .18s ease; }
        .hcx-btn-primary { background: var(--orange); border-color: var(--orange); color: var(--ink) !important; }
        .hcx-btn-primary:hover { background: var(--orange-hover); border-color: var(--orange-hover); }
        .hcx-btn-ghost { background: transparent; border-color: currentColor; }
        .hcx-btn-ghost:hover { background: rgba(255,255,255,.12); }
        .hcx-btn-outline { border-color: var(--forest); color: var(--forest); background: transparent; }
        .hcx-btn-outline:hover { background: var(--forest); color: #fff; }
        .hcx-btn:disabled { opacity: .7; cursor: progress; }
        .hcx a:focus-visible, .hcx button:focus-visible, .hcx input:focus-visible, .hcx select:focus-visible, .hcx summary:focus-visible { outline: 3px solid var(--orange); outline-offset: 3px; }
        .hcx-link { display: inline-flex; align-items: center; gap: 8px; margin-top: 16px; font-weight: 600; font-size: 15px; color: var(--forest); text-decoration: none; border-bottom: 2px solid var(--orange); padding-bottom: 2px; }
        .hcx-link:hover { color: #000; }

        /* ------------------------------ Hero banner ------------------------------ */
        .hcx-hero { position: relative; background: var(--stone); }
        .hcx-stage { position: relative; height: clamp(720px, 46vw, 800px); overflow: hidden; background: linear-gradient(135deg, #e3e8e4, #eef1ee); }
        .hcx-slide-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .hcx-wash { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(238,241,238,.97) 0%, rgba(238,241,238,.9) 38%, rgba(238,241,238,.4) 62%, rgba(238,241,238,0) 82%); }
        .hcx-intro-wrap { position: relative; height: 100%; display: flex; align-items: center; }
        .hcx-intro { width: min(660px, calc(100% - var(--form-w) - 40px)); padding-block: 48px; }
        .hcx-typed { font-size: clamp(34px, 4.4vw, 62px); line-height: 1.08; font-weight: 600; letter-spacing: -0.03em; min-height: calc(1.08em * 4); color: var(--ink); }
        .hcx-caret { display: inline-block; width: 3px; height: .85em; margin-left: 5px; vertical-align: -0.08em; background: var(--orange); animation: hcx-blink 1s steps(1) infinite; }
        .hcx-hero-desc { margin-top: 18px; max-width: 48ch; font-size: 17px; }
        .hcx-hero-desc, .hcx-hero-desc * { color: var(--ink) !important; }
        .hcx-hero-desc p { margin: 0; }
        .hcx-points { list-style: none; display: grid; gap: 10px; margin: 24px 0 0; padding: 0; }
        .hcx-points li { display: flex; align-items: center; gap: 12px; font-weight: 500; }
        .hcx-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
        @keyframes hcx-blink { 50% { opacity: 0; } }

        /* Form: floats over the right of the banner on desktop */
        .hcx-form-slot { position: absolute; z-index: 5; top: 32px; right: calc((100% - min(1240px, 100% - 48px)) / 2); width: var(--form-w); }
        .hcx-form-card { background: #fff; color: var(--ink); border-radius: 12px; padding: clamp(22px, 3vw, 30px); box-shadow: 0 24px 60px rgba(5,20,15,.28); scroll-margin-top: 24px; }
        .hcx-form-card h2 { font-size: 24px; line-height: 1.2; font-weight: 600; letter-spacing: -0.01em; }
        .hcx-form-intro { margin: 8px 0 18px; color: var(--muted); font-size: 14px; line-height: 1.55; }
        .hcx-form { display: grid; gap: 14px; }
        .hcx-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .hcx-field { display: grid; gap: 6px; min-width: 0; }
        .hcx-field > span { font-size: 13px; font-weight: 600; }
        .hcx-field em { font-style: normal; font-weight: 400; color: var(--muted); }
        .hcx-field input, .hcx-field select { width: 100%; min-height: 46px; padding: 0 14px; border: 1px solid #b8c2bc; border-radius: 8px; background: #fff; color: var(--ink); font-size: 15px; font-weight: 400; }
        .hcx-field input::placeholder { color: #7d8781; font-size: 15px; }
        .hcx-field input[aria-invalid="true"] { border-color: #b42318; background: #fff8f7; }
                .hcx-field textarea { width: 100%; min-height: 76px; padding: 12px 14px; border: 1px solid #b8c2bc; border-radius: 8px; background: #fff; color: var(--ink); font-family: var(--hcx-font) !important; font-size: 15px; font-weight: 400; line-height: 1.5; resize: vertical; }
        .hcx-field textarea::placeholder { color: #7d8781; font-size: 15px; font-family: var(--hcx-font) !important; }
        .hcx-field textarea[aria-invalid="true"] { border-color: #b42318; background: #fff8f7; }
        .hcx textarea:focus-visible { outline: 3px solid var(--orange); outline-offset: 3px; }
        .hcx-err { display: block; margin-top: 2px; color: #b42318; font-size: 12.5px; line-height: 1.4; font-weight: 500; }
        .hcx-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
        .hcx-consent { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: var(--muted); line-height: 1.5; }
        .hcx-consent input { width: 18px; height: 18px; margin-top: 2px; accent-color: var(--forest); flex: 0 0 auto; }
        .hcx-consent input[aria-invalid="true"] { outline: 2px solid #b42318; outline-offset: 2px; }
        .hcx-consent a { color: var(--forest); text-decoration: underline; }
        .hcx-form-submit { width: 100%; }

        /* Stats: numbers count up */
        .hcx-stats { background: var(--forest); color: #fff; }
        .hcx-stats-grid { list-style: none; margin: 0 auto; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); }
        .hcx-stats-grid li { padding: 28px 24px; border-left: 1px solid rgba(255,255,255,.16); }
        .hcx-stats-grid li:first-child { border-left: 0; padding-left: 0; }
        .hcx-stat-value { display: block; font-size: clamp(30px, 3.6vw, 44px); font-weight: 600; line-height: 1.1; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
        .hcx-stat-label { display: block; margin-top: 4px; font-size: 14px; color: rgba(255,255,255,.8); }

        /* Ready-to-go designs */
        .hcx-head { display: flex; justify-content: space-between; align-items: end; gap: 28px; flex-wrap: wrap; }
        .hcx-ready-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 44px; }
        .hcx-ready-card { display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: #fff; text-decoration: none; transition: box-shadow .2s ease, transform .2s ease; }
        .hcx-ready-card:hover { box-shadow: 0 14px 34px rgba(18,59,48,.14); transform: translateY(-3px); }
        .hcx-ready-img { aspect-ratio: 4 / 3; overflow: hidden; background: linear-gradient(135deg, var(--forest), var(--forest-soft)); }
        .hcx-ready-img img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
        .hcx-ready-card:hover .hcx-ready-img img { transform: scale(1.05); }
        .hcx-ready-ph { display: grid; place-items: center; height: 100%; padding: 16px; color: #fff; font-size: 20px; font-weight: 600; text-align: center; }
        .hcx-ready-body { display: flex; flex-direction: column; flex: 1; padding: 18px 18px 20px; }
        .hcx-ready-body h3 { font-size: 18px; font-weight: 600; line-height: 1.3; }
        .hcx-ready-body p { margin-top: 6px; color: var(--muted); font-size: 14px; line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .hcx-ready-cta { margin-top: auto; padding-top: 14px; display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--forest); }
        .hcx-foot { margin-top: 40px; display: flex; flex-wrap: wrap; gap: 12px; }

        /* Luxury projects: name sits on the photo */
        .hcx-luxury { background: var(--stone); }
        .hcx-lux-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 20px; margin-top: 44px; }
        .hcx-lux-card { position: relative; display: block; grid-column: span 6; height: clamp(250px, 26vw, 380px); border-radius: 8px; overflow: hidden; text-decoration: none; color: #fff; background: radial-gradient(circle at 82% 16%, rgba(255,139,73,.3), transparent 44%), linear-gradient(135deg, var(--forest), var(--forest-soft)); }
        .hcx-lux-card:nth-child(4n+1), .hcx-lux-card:nth-child(4n) { grid-column: span 5; }
        .hcx-lux-card:nth-child(4n+2), .hcx-lux-card:nth-child(4n+3) { grid-column: span 7; }
        .hcx-lux-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; }
        .hcx-lux-card:hover img { transform: scale(1.05); }
        .hcx-lux-cap { position: absolute; left: 0; right: 0; bottom: 0; padding: 64px 22px 20px; background: linear-gradient(0deg, rgba(8,16,12,.8), rgba(8,16,12,0)); }
        .hcx-lux-cap h3 { font-size: 24px; font-weight: 700; line-height: 1.2; text-shadow: 0 1px 8px rgba(0,0,0,.4); }
        .hcx-lux-cap p { margin-top: 4px; display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; color: rgba(255,255,255,.92); }

        /* Why us: three cards */
        .hcx-why { background: var(--forest); color: #fff; }
        .hcx-why .hcx-lead { color: rgba(255,255,255,.84); }
        .hcx-why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px; }
        .hcx-why-card { padding: 30px 28px 32px; border: 1px solid rgba(255,255,255,.2); border-radius: 14px; background: rgba(255,255,255,.06); transition: background-color .2s ease, transform .2s ease, border-color .2s ease; }
        .hcx-why-card:hover { background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.36); transform: translateY(-4px); }
        .hcx-why-icon { display: grid; place-items: center; width: 56px; height: 56px; border-radius: 14px; background: var(--orange); color: var(--ink); }
        .hcx-why-card h3 { margin-top: 22px; font-size: 22px; font-weight: 600; line-height: 1.25; }
        .hcx-why-card p { margin-top: 10px; color: rgba(255,255,255,.86); font-size: 16px; }

        /* Experience centers */
        .hcx-center-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 44px; }
        .hcx-center-card { display: flex; flex-direction: column; padding: 28px; border: 1px solid var(--line); border-radius: 14px; background: #fff; transition: box-shadow .2s ease, transform .2s ease; }
        .hcx-center-card:hover { box-shadow: 0 14px 34px rgba(18,59,48,.12); transform: translateY(-3px); }
        .hcx-center-pin { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: var(--stone); color: var(--forest); }
        .hcx-center-card h3 { margin-top: 18px; font-size: 24px; line-height: 1.2; font-weight: 600; }
        .hcx-center-tag { margin-top: 2px; font-size: 14px; color: var(--muted); }
        .hcx-center-addr { margin-top: 16px; font-size: 15px; line-height: 1.6; color: var(--ink); }
        .hcx-center-phone { margin-top: 12px; font-size: 15px; font-weight: 600; color: var(--forest); text-decoration: none; }
        .hcx-center-actions { margin-top: auto; padding-top: 22px; display: flex; flex-wrap: wrap; gap: 10px; }
        .hcx-center-actions .hcx-btn { min-height: 44px; padding: 0 18px; font-size: 15px; }
        .hcx-more-centers { margin-top: 28px; color: var(--muted); font-size: 15px; }
        .hcx-more-centers a { color: var(--forest); font-weight: 600; margin-left: 6px; }

        /* Areas */
        .hcx-areas { position: relative; overflow: hidden; color: #fff; background-color: var(--forest); background-image: radial-gradient(circle at 10% 14%, rgba(255,139,73,.18), transparent 36%), radial-gradient(circle at 94% 90%, rgba(255,255,255,.08), transparent 42%); }
        .hcx .hcx-areas h2 { color: #fff !important; -webkit-text-fill-color: #fff; }
        .hcx-areas .hcx-lead { color: rgba(255,255,255,.86); }
        .hcx-areas-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 88px); align-items: start; }
        .hcx-areas-intro { position: sticky; top: 32px; }
        .hcx-areas-facts { display: flex; gap: 32px; margin-top: 28px; }
        .hcx-areas-facts strong { display: block; font-size: clamp(30px, 3.4vw, 42px); line-height: 1.1; font-weight: 600; font-variant-numeric: tabular-nums; }
        .hcx-areas-facts span { display: block; margin-top: 2px; font-size: 14px; color: rgba(255,255,255,.8); }
        .hcx-areas-help { margin-top: 32px; padding: 22px; border: 1px solid rgba(255,255,255,.22); border-radius: 14px; background: rgba(255,255,255,.06); }
        .hcx-areas-help p { font-size: 15px; color: rgba(255,255,255,.92); }
        .hcx-areas-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
        .hcx-areas-actions .hcx-btn { min-height: 44px; padding: 0 18px; font-size: 15px; }
        .hcx-areas-actions .hcx-btn-ghost { color: #fff; }
        .hcx-area-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; align-items: stretch; }
        .hcx-area-grid > li { display: flex; }
        .hcx-area-tile { flex: 1; display: flex; align-items: center; gap: 14px; padding: 18px 20px; border: 1px solid rgba(255,255,255,.22); border-radius: 14px; background: rgba(255,255,255,.05); color: #fff; text-decoration: none; transition: background-color .2s ease, border-color .2s ease, color .2s ease, transform .2s ease; }
        .hcx-area-tile:hover { background: var(--orange); border-color: var(--orange); color: var(--ink); transform: translateY(-2px); }
        .hcx-area-pin { flex: 0 0 auto; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: rgba(255,255,255,.14); transition: background-color .2s ease; }
        .hcx-area-tile:hover .hcx-area-pin { background: rgba(24,32,28,.14); }
        .hcx-area-text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        .hcx-area-name { font-size: 19px; font-weight: 600; line-height: 1.25; }
        .hcx-area-sub { font-size: 13.5px; line-height: 1.35; opacity: .82; }
        .hcx-area-go { flex: 0 0 auto; opacity: .6; transition: transform .2s ease, opacity .2s ease; }
        .hcx-area-tile:hover .hcx-area-go { opacity: 1; transform: translateX(4px); }

        /* FAQ */
        .hcx-faq-grid { display: grid; grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr); gap: clamp(32px, 6vw, 88px); align-items: start; }
        .hcx-faq-intro { position: sticky; top: 32px; }
        .hcx-faq-item { border-top: 1px solid var(--line); }
        .hcx-faq-item:last-child { border-bottom: 1px solid var(--line); }
        .hcx-faq-item summary { display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px 0; font-size: 18px; font-weight: 600; line-height: 1.35; cursor: pointer; list-style: none; }
        .hcx-faq-item summary::-webkit-details-marker { display: none; }
        .hcx-faq-item summary::after { content: "+"; flex: 0 0 auto; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: var(--stone); font-size: 22px; font-weight: 400; line-height: 1; }
        .hcx-faq-item[open] summary::after { content: "–"; background: var(--orange); }
        .hcx-faq-answer { padding: 0 52px 24px 0; color: var(--muted); font-size: 16px; }
        .hcx-faq-answer p { margin: 0 0 10px; }
        .hcx-faq-answer, .hcx-faq-answer * { color: var(--muted) !important; }

        /* Final CTA */
        .hcx-final { background: var(--ink); color: #fff; }
        .hcx-final-inner { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 40px; align-items: center; }
        .hcx-final h2 { font-size: clamp(30px, 4.4vw, 54px); line-height: 1.08; font-weight: 600; letter-spacing: -0.025em; max-width: 16ch; }
        .hcx-final-desc { margin-top: 16px; max-width: 48ch; }
        .hcx-final-desc, .hcx-final-desc * { color: rgba(255,255,255,.86) !important; }
        .hcx-final-desc p { margin: 0; }
        .hcx-final-actions { display: grid; gap: 12px; justify-items: stretch; }
        .hcx-final-actions .hcx-btn-ghost { color: #fff; }

        /* Mobile bar */
        .hcx-mobile-bar { display: none; }
        .hcx-modal-open { filter: none; }

        @media (max-width: 1100px) {
          .hcx-ready-grid { grid-template-columns: repeat(2, 1fr); }
          .hcx-why-grid, .hcx-center-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 1023px) {
          .hcx-stage { height: auto; }
          .hcx-intro-wrap { height: auto; padding-block: 44px; }
          .hcx-intro { width: 100%; padding-block: 0; }
          .hcx-wash { background: linear-gradient(180deg, rgba(238,241,238,.95) 0%, rgba(238,241,238,.88) 100%); }
          .hcx-form-slot { position: static; width: auto; padding: 28px 16px 36px; background: var(--stone); }
          .hcx-form-card { max-width: 560px; margin-inline: auto; box-shadow: 0 10px 30px rgba(5,20,15,.12); }
        }
        @media (max-width: 900px) {
          .hcx-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .hcx-stats-grid li:nth-child(odd) { border-left: 0; padding-left: 0; }
          .hcx-stats-grid li:nth-child(n+3) { border-top: 1px solid rgba(255,255,255,.16); }
          .hcx-faq-grid, .hcx-final-inner, .hcx-areas-grid { grid-template-columns: 1fr; }
          .hcx-areas-intro { position: static; }
          .hcx-faq-intro { position: static; }
          .hcx-lux-grid { grid-template-columns: repeat(2, 1fr); }
          .hcx-lux-card, .hcx-lux-card:nth-child(n) { grid-column: span 1; }
        }
        @media (max-width: 700px) {
          .hcx { padding-bottom: 72px; }
          .hcx-wrap { width: calc(100% - 32px); }
          .hcx-hero-desc { font-size: 16px; }
          .hcx-hero-actions .hcx-btn { flex: 1 1 100%; }
          .hcx-only-desktop { display: none !important; }
          .hcx-form-row { grid-template-columns: 1fr; }
          .hcx-ready-grid, .hcx-why-grid, .hcx-center-grid, .hcx-area-grid { grid-template-columns: 1fr; }
          .hcx-areas-actions .hcx-btn { flex: 1 1 100%; }
          .hcx-lux-grid { grid-template-columns: 1fr; }
          .hcx-lux-card { height: 260px; }
          .hcx-foot .hcx-btn { width: 100%; }
          .hcx-faq-item summary { font-size: 16px; }
          .hcx-faq-answer { padding-right: 0; }
          .hcx-final-actions .hcx-btn { width: 100%; }
          .hcx-mobile-bar { position: fixed; z-index: 90; left: 0; right: 0; bottom: 0; display: grid; grid-template-columns: 1fr 1.6fr; gap: 10px; padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 0px)); background: #fff; box-shadow: 0 -6px 24px rgba(0,0,0,.14); }
          .hcx-mobile-bar .hcx-btn { min-height: 48px; padding: 0 12px; font-size: 15px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hcx *, .hcx *::before, .hcx *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; scroll-behavior: auto !important; }
          .hcx-caret { animation: none; }
        }
      `}</style>

      {/* Hero: one banner, typing headline on the left, buttons under the points, form on the right */}
      <section className="hcx-hero" aria-label="High Creation Interior">
        <h1 className="hcx-sr">{phrases[0]}</h1>

        <div className="hcx-stage">
          <SlideImage src={HERO_INTERIOR} priority className="hcx-slide-img" />
          <div className="hcx-wash" />
          <div className="hcx-wrap hcx-intro-wrap">
            <div className="hcx-intro">
              <div className="hcx-typed" aria-hidden="true">
                <span>{typed}</span>
                <i className="hcx-caret" />
              </div>
              <Html className="hcx-hero-desc" html={heroDesc} />
              <ul className="hcx-points">
                {HERO_POINTS.map((point) => (
                  <li key={point}><Tick /> {point}</li>
                ))}
              </ul>
              <div className="hcx-hero-actions">
                <a className="hcx-btn hcx-btn-primary" href="/estimator-for-home">Get a free estimate</a>
                <a className="hcx-btn hcx-btn-outline hcx-only-desktop" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
                <a className="hcx-btn hcx-btn-outline" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
              </div>
            </div>
          </div>
        </div>

        <div className="hcx-form-slot">
          <LeadForm />
        </div>
      </section>

      {/* Trust numbers: count up when scrolled into view */}
      <section className="hcx-stats" aria-label="High Creation Interior at a glance">
        <div className="hcx-wrap">
          <ul className="hcx-stats-grid">
            {STATS.map((stat) => (
              <li key={stat.label}>
                <span className="hcx-stat-value">
                  <CountUp end={stat.end} suffix={stat.suffix} reduceMotion={reduceMotion} />
                </span>
                <span className="hcx-stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Ready-to-go designs */}
      <section className="hcx-section" id="hcx-ready" aria-labelledby="hcx-ready-title">
        <div className="hcx-wrap">
          <div className="hcx-head">
            <div>
              <h2 id="hcx-ready-title" className="hcx-h2">Ready-to-go designs for every room</h2>
              <p className="hcx-lead">Thoughtfully crafted interiors that combine good looks with smart functionality. Pick a room and start from a design you like.</p>
            </div>
            <a className="hcx-link" href="/ready-togo-design">View all designs <Arrow /></a>
          </div>
          <div className="hcx-ready-grid">
            {readyCards.map((card) => (
              <a className="hcx-ready-card" key={card.id} href={card.href}>
                <div className="hcx-ready-img">
                  {card.image && !brokenImages[`ready-${card.id}`] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={card.image} alt={card.alt || `${card.title} interior design by High Creation Interior`} loading="lazy" decoding="async" width="640" height="480" onError={() => markBroken(`ready-${card.id}`)} />
                  ) : (
                    <span className="hcx-ready-ph">{card.title}</span>
                  )}
                </div>
                <div className="hcx-ready-body">
                  <h3>{card.title}</h3>
                  {card.text ? <p>{card.text}</p> : null}
                  <span className="hcx-ready-cta">View designs <Arrow /></span>
                </div>
              </a>
            ))}
          </div>
          <div className="hcx-foot">
            <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Get a free consultation</a>
          </div>
        </div>
      </section>

      {/* Luxury projects */}
      <section className="hcx-section hcx-luxury" id="hcx-luxury" aria-labelledby="hcx-luxury-title">
        <div className="hcx-wrap">
          <div className="hcx-head">
            <div>
              <h2 id="hcx-luxury-title" className="hcx-h2">Luxury project concepts</h2>
              <p className="hcx-lead">Feel the luxury. Live the experience. Premium materials, bespoke details and timeless design in every home we create.</p>
            </div>
            <a className="hcx-link" href="/luxury-projects/">View all luxury projects <Arrow /></a>
          </div>
          <div className="hcx-lux-grid">
            {luxuryCards.map((card) => (
              <a className="hcx-lux-card" key={card.id} href={card.href}>
                {card.image && !brokenImages[`lux-${card.id}`] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.image}
                    alt={card.alt || `${card.title}, luxury interior by High Creation Interior`}
                    loading="lazy"
                    decoding="async"
                    onError={() => markBroken(`lux-${card.id}`)}
                  />
                ) : null}
                <div className="hcx-lux-cap">
                  <h3>{card.title}</h3>
                  <p>{card.text || "View project"} {!card.text ? <Arrow /> : null}</p>
                </div>
              </a>
            ))}
          </div>
          <div className="hcx-foot">
            <a className="hcx-btn hcx-btn-outline" href="/luxury-projects/">Explore luxury projects</a>
            <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Talk to a designer</a>
          </div>
        </div>
      </section>

      {/* Why High Creation Interior: three cards */}
      <section className="hcx-section hcx-why" aria-labelledby="hcx-why-title">
        <div className="hcx-wrap">
          <h2 id="hcx-why-title" className="hcx-h2">Your space designed around you, not around a fixed design</h2>
          <p className="hcx-lead">One team handles design and production, so what you approve is what gets built.</p>
          <div className="hcx-why-grid">
            {WHY_POINTS.map((point) => (
              <article className="hcx-why-card" key={point.key}>
                <span className="hcx-why-icon">{WHY_ICONS[point.key]}</span>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Experience centers */}
      <section className="hcx-section" id="hcx-centers" aria-labelledby="hcx-centers-title">
        <div className="hcx-wrap">
          <div className="hcx-head">
            <div>
              <h2 id="hcx-centers-title" className="hcx-h2">Visit an experience center near you</h2>
              <p className="hcx-lead">Walk through finished rooms, feel the materials and talk to a designer in person.</p>
            </div>
          </div>
          <div className="hcx-center-grid">
            {CENTER_CARDS.map((center) => (
              <article className="hcx-center-card" key={center.city}>
                <span className="hcx-center-pin"><PinIcon /></span>
                <h3>{center.city}</h3>
                <p className="hcx-center-tag">Experience center</p>
                <p className="hcx-center-addr">{center.address}</p>
                <a className="hcx-center-phone" href={PHONE_TEL}>{PHONE_LABEL}</a>
                <div className="hcx-center-actions">
                  <a className="hcx-btn hcx-btn-primary" href={mapsUrl(center.address)} target="_blank" rel="noreferrer">Get directions</a>
                  <a className="hcx-btn hcx-btn-outline" href={center.href}>See the center</a>
                </div>
              </article>
            ))}
          </div>
          <p className="hcx-more-centers">
            Also visit us in
            {OTHER_CENTERS.map((center, index) => (
              <a key={center.label} href={center.href}>{center.label}{index < OTHER_CENTERS.length - 1 ? "," : ""}</a>
            ))}
          </p>
        </div>
      </section>

      {/* Where we work */}
      <section className="hcx-section hcx-areas" aria-labelledby="hcx-areas-title">
        <div className="hcx-wrap hcx-areas-grid">
          <div className="hcx-areas-intro">
            <h2 id="hcx-areas-title" className="hcx-h2">Areas we serve across Delhi NCR</h2>
            <p className="hcx-lead">Pick your area to see how we design and deliver homes there.</p>
            <div className="hcx-areas-facts">
              <div><strong>{AREAS.length}</strong><span>areas covered</span></div>
              <div><strong>5</strong><span>branches across NCR</span></div>
            </div>
            <div className="hcx-areas-help">
              <p>Not sure we cover your area? Call us and we will tell you right away.</p>
              <div className="hcx-areas-actions">
                <a className="hcx-btn hcx-btn-primary" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
                <a className="hcx-btn hcx-btn-ghost" href={WHATSAPP} target="_blank" rel="noreferrer">WhatsApp us</a>
              </div>
            </div>
          </div>
          <ul className="hcx-area-grid">
            {AREAS.map((area) => (
              <li key={area.label}>
                <a className="hcx-area-tile" href={area.href}>
                  <span className="hcx-area-pin"><PinIcon /></span>
                  <span className="hcx-area-text">
                    <span className="hcx-area-name">{area.label}</span>
                    <span className="hcx-area-sub">Interior designers in {area.label}</span>
                  </span>
                  <span className="hcx-area-go"><Arrow /></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ (CMS: faqs) */}
      {faqLoading || faqError || faqs.length > 0 ? (
        <section className="hcx-section" aria-labelledby="hcx-faq-title">
          <div className="hcx-wrap hcx-faq-grid">
            <div className="hcx-faq-intro">
              <h2 id="hcx-faq-title" className="hcx-h2">Questions before you begin</h2>
              <p className="hcx-lead">Clear answers to the things people ask us most. Still unsure? Call us and we will walk you through it.</p>
              <a className="hcx-link" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
            </div>
            <div>
              {faqLoading ? <p className="hcx-lead">Loading FAQs…</p> : null}
              {faqError ? <p className="hcx-lead">{faqError}</p> : null}
              {!faqLoading && !faqError && faqs.map((faq, index) => (
                <details className="hcx-faq-item" key={faq.key} open={index === 0}>
                  <summary>{faq.title || "Frequently asked question"}</summary>
                  <Html className="hcx-faq-answer" html={faq.description || ""} />
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Final CTA */}
      <section className="hcx-section hcx-final" aria-labelledby="hcx-final-title">
        <div className="hcx-wrap hcx-final-inner">
          <div>
            <h2 id="hcx-final-title">{data6?.top_title || "Let’s plan the home you want to come back to."}</h2>
            <Html
              className="hcx-final-desc"
              html={data6?.top_description || "Tell us about your space. A High Creation Interior designer will help you plan a practical, personal next step."}
            />
          </div>
          <div className="hcx-final-actions">
            <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Book free consultation</a>
            <a className="hcx-btn hcx-btn-ghost" href={PHONE_TEL}>Call {PHONE_LABEL}</a>
            <a className="hcx-btn hcx-btn-ghost" href={WHATSAPP} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </div>
        </div>
      </section>

      {/* Mobile sticky actions: always on screen */}
      <div className="hcx-mobile-bar">
        <a className="hcx-btn hcx-btn-outline" href={PHONE_TEL}>Call us</a>
        <a className="hcx-btn hcx-btn-primary" href="#hcx-enquiry-form">Book free consultation</a>
      </div>

      <ContactUsPopUp onModalStateChange={handleModalStateChange} />
    </div>
  );
}
