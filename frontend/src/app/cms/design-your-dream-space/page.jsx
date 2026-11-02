// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
// import api from "@/utils/api";
// import { DEFAULT_CONTENT, HEADING_TAGS, ICON_NAMES, PAGE_KEY, mergeContent } from "@/utils/hciLandingContent";

// /* ------------------------------------------------------------------ */
// /* Field + section schema. Add a field here and it shows up in the CMS. */
// /* ------------------------------------------------------------------ */
// const text = (name, label, o = {}) => ({ type: "text", name, label, ...o });
// const area = (name, label, o = {}) => ({ type: "area", name, label, ...o });
// const heading = (name, label, o = {}) => ({ type: "heading", name, label, ...o });
// const image = (name, label, o = {}) => ({ type: "image", name, label, ...o });
// const icon = (name, label) => ({ type: "icon", name, label });
// const tag = (name, label) => ({ type: "tag", name, label });
// const strings = (name, label, itemLabel, o = {}) => ({ type: "strings", name, label, itemLabel, ...o });
// const list = (name, label, itemLabel, fields, blank, o = {}) => ({ type: "list", name, label, itemLabel, fields, blank, ...o });

// const H = (value = "", tagName = "h3") => ({ text: value, tag: tagName });

// const SECTIONS = [
//   {
//     key: "contact",
//     title: "Phone & WhatsApp numbers",
//     fields: [
//       text("callNumber", "Phone number (Call buttons, floating call button, footer link)", { help: "Type it the way visitors should see it, e.g. +91 70707 01373. A 10-digit number gets +91 added for dialling." }),
//       text("whatsappNumber", "WhatsApp number (Chat on WhatsApp buttons)"),
//       area("whatsappGreeting", "WhatsApp pre-filled message"),
//     ],
//   },
//   {
//     key: "buttons",
//     title: "Button labels",
//     fields: [
//       text("getQuote", "Get quote button"),
//       text("getQuoteMobile", "Floating bar label (mobile)"),
//       text("call", "Call button prefix (shown before the phone number)"),
//       text("whatsapp", "WhatsApp button"),
//       text("directions", "Directions button (experience centers)"),
//       text("scheduleVisit", "Schedule visit button"),
//       text("bookConsultation", "Book a consultation button (bottom banner)"),
//     ],
//   },
//   {
//     key: "header",
//     title: "Header logo",
//     fields: [image("logo", "Logo image"), text("logoAlt", "Logo alt text")],
//   },
//   {
//     key: "form",
//     title: "Lead form",
//     fields: [heading("heading", "Form heading", { defaultTag: "h2" }), text("submitText", "Submit button text")],
//   },
//   {
//     key: "hero",
//     title: "Hero (top of page)",
//     fields: [
//       heading("heading", "Page heading (read by search engines; use H1 once per page)", { defaultTag: "h1", help: "This text is hidden on screen. Visitors see the typing lines below." }),
//       strings("phrases", "Typing lines (shown one after another)", "Line"),
//       image("image", "Background image"),
//       area("areasText", "Service areas line"),
//       strings("points", "Tick-mark points", "Point"),
//     ],
//   },
//   {
//     key: "benefits",
//     title: "Three benefits strip",
//     toggle: true,
//     fields: [
//       list("items", "Benefits", "Benefit", [icon("icon", "Icon"), heading("title", "Heading", { defaultTag: "h2" }), area("text", "Text")], { icon: "check", title: H("New benefit", "h2"), text: "" }),
//     ],
//   },
//   {
//     key: "propertyStrip",
//     title: "Home type selector",
//     toggle: true,
//     fields: [
//       text("eyebrow", "Small label above heading"),
//       heading("heading", "Heading", { defaultTag: "h2" }),
//       strings("options", "Home types", "Home type"),
//       text("hint", "Hint under the buttons"),
//     ],
//   },
//   {
//     key: "services",
//     title: "Services",
//     toggle: true,
//     fields: [
//       text("eyebrow", "Small label above heading"),
//       heading("heading", "Section heading", { defaultTag: "h2" }),
//       text("cardLabel", "Card label (after the number, e.g. SERVICE)"),
//       list("items", "Service cards", "Service", [heading("title", "Card heading", { defaultTag: "h3" }), area("text", "Text"), image("image", "Image")], { title: H("New service"), text: "", image: "" }),
//     ],
//   },
//   {
//     key: "rooms",
//     title: "Room inspiration",
//     toggle: true,
//     fields: [
//       text("eyebrow", "Small label above heading"),
//       heading("heading", "Section heading", { defaultTag: "h2" }),
//       list("items", "Room cards", "Room", [heading("title", "Room name", { defaultTag: "h3" }), text("label", "Small label on the image"), image("image", "Image")], { title: H("New room"), label: "", image: "" }),
//     ],
//   },
//   {
//     key: "story",
//     title: "Every room should earn its place",
//     toggle: true,
//     fields: [
//       text("eyebrow", "Small label above heading"),
//       heading("heading", "Section heading", { defaultTag: "h2" }),
//       area("text", "Intro paragraph"),
//       text("tagLabel", "Tag on the photo (before the point name)"),
//       list(
//         "points",
//         "Points (each one swaps the photo)",
//         "Point",
//         [text("short", "Short name (shown on the photo)"), icon("icon", "Icon"), text("title", "Title"), area("text", "Text"), image("image", "Photo"), text("alt", "Photo alt text")],
//         { short: "New", icon: "check", title: "", text: "", image: "", alt: "" }
//       ),
//     ],
//   },
//   {
//     key: "process",
//     title: "Process steps",
//     toggle: true,
//     fields: [
//       text("eyebrow", "Small label above heading"),
//       heading("heading", "Section heading", { defaultTag: "h2" }),
//       list("steps", "Steps (numbered automatically)", "Step", [heading("title", "Step heading", { defaultTag: "h3" }), area("text", "Text")], { title: H("New step"), text: "" }),
//       area("footnote", "Note under the steps"),
//     ],
//   },
//   {
//     key: "stats",
//     title: "Numbers strip",
//     toggle: true,
//     fields: [
//       list("items", "Numbers", "Number", [text("value", "Number (digits only, counts up on scroll)"), text("suffix", "After the number (e.g. +)"), text("label", "Label")], { value: "0", suffix: "", label: "" }),
//     ],
//   },
//   {
//     key: "ideas",
//     title: "Design ideas gallery",
//     toggle: true,
//     fields: [
//       text("eyebrow", "Small label above heading"),
//       heading("heading", "Section heading", { defaultTag: "h2" }),
//       list("items", "Gallery cards", "Card", [heading("title", "Card heading", { defaultTag: "h3" }), text("category", "Chip text"), image("image", "Image")], { title: H("New idea"), category: "", image: "" }),
//     ],
//   },
//   {
//     key: "experience",
//     title: "Experience centers",
//     toggle: true,
//     fields: [
//       heading("heading", "Section heading", { defaultTag: "h2" }),
//       area("text", "Text under heading"),
//       text("kicker", "Small label on each card"),
//       list("centers", "Centers", "Center", [heading("city", "City / center name", { defaultTag: "h3" }), area("address", "Address"), text("phone", "Phone number")], { city: H("New center"), address: "", phone: "" }),
//     ],
//   },
//   {
//     key: "locations",
//     title: "Serving areas",
//     toggle: true,
//     fields: [
//       text("eyebrow", "Small label above heading"),
//       heading("heading", "Section heading", { defaultTag: "h2" }),
//       area("text", "Text under heading"),
//       strings("areas", "Cities (also used as suggestions in the lead form)", "City"),
//     ],
//   },
//   {
//     key: "faq",
//     title: "FAQ",
//     toggle: true,
//     fields: [
//       text("eyebrow", "Small label above heading"),
//       heading("heading", "Section heading", { defaultTag: "h2" }),
//       area("text", "Text under heading"),
//       tag("questionTag", "Heading level used for every question"),
//       list("items", "Questions", "Question", [text("question", "Question"), area("answer", "Answer")], { question: "", answer: "" }),
//     ],
//   },
//   {
//     key: "finalCta",
//     title: "Bottom banner",
//     toggle: true,
//     fields: [
//       image("image", "Image"),
//       text("imageAlt", "Image alt text"),
//       text("eyebrow", "Small label above heading"),
//       heading("heading", "Heading", { defaultTag: "h2" }),
//       area("text", "Text"),
//     ],
//   },
// ];

// /* ------------------------------------------------------------------ */
// /* Helpers                                                             */
// /* ------------------------------------------------------------------ */
// const clone = (value) => JSON.parse(JSON.stringify(value));

// function countH1(node) {
//   if (Array.isArray(node)) return node.reduce((sum, item) => sum + countH1(item), 0);
//   if (node && typeof node === "object") {
//     const own = node.tag === "h1" && "text" in node && String(node.text).trim() ? 1 : 0;
//     return Object.entries(node).reduce((sum, [, child]) => sum + countH1(child), own);
//   }
//   return 0;
// }

// function itemTitle(item, fallback) {
//   const candidate = item?.title?.text ?? item?.city?.text ?? item?.title ?? item?.question ?? item?.short ?? item?.label ?? item?.value;
//   return typeof candidate === "string" && candidate.trim() ? candidate : fallback;
// }

// /* ------------------------------------------------------------------ */
// /* Field editors                                                       */
// /* ------------------------------------------------------------------ */
// function TagSelect({ value, onChange, fallback = "h2", label = "Tag" }) {
//   return (
//     <select className="cc-select" value={HEADING_TAGS.includes(value) ? value : fallback} onChange={(event) => onChange(event.target.value)} aria-label={label}>
//       {HEADING_TAGS.map((name) => (
//         <option key={name} value={name}>{name.toUpperCase()}</option>
//       ))}
//     </select>
//   );
// }

// function ImageEditor({ value, onChange }) {
//   const url = value || "";
//   return (
//     <div className="cc-image">
//       <div className="cc-image-preview">
//         {url ? <img src={url} alt="" /> : <span>No image</span>}
//       </div>
//       <div className="cc-image-controls">
//         <input className="cc-input" value={url} placeholder="Image URL (https://... or /images/...)" onChange={(event) => onChange(event.target.value)} />
//         <div className="cc-row">
//           <button type="button" className="cc-btn cc-btn-small" onClick={() => onChange("")} disabled={!url}>Remove image</button>
//           <span className="cc-help">Paste a new URL to replace the image.</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// function StringsEditor({ field, value, onChange }) {
//   const items = Array.isArray(value) ? value : [];
//   const move = (index, step) => {
//     const target = index + step;
//     if (target < 0 || target >= items.length) return;
//     const next = [...items];
//     [next[index], next[target]] = [next[target], next[index]];
//     onChange(next);
//   };
//   return (
//     <div className="cc-stack">
//       {items.map((item, index) => (
//         <div className="cc-row" key={index}>
//           <input
//             className="cc-input"
//             value={item}
//             onChange={(event) => onChange(items.map((current, i) => (i === index ? event.target.value : current)))}
//             aria-label={`${field.itemLabel} ${index + 1}`}
//           />
//           <button type="button" className="cc-btn cc-btn-icon" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">↑</button>
//           <button type="button" className="cc-btn cc-btn-icon" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Move down">↓</button>
//           <button type="button" className="cc-btn cc-btn-icon cc-btn-danger" onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label="Delete">×</button>
//         </div>
//       ))}
//       <div><button type="button" className="cc-btn cc-btn-small" onClick={() => onChange([...items, ""])}>+ Add {field.itemLabel.toLowerCase()}</button></div>
//     </div>
//   );
// }

// function ListEditor({ field, value, onChange }) {
//   const items = Array.isArray(value) ? value : [];
//   const move = (index, step) => {
//     const target = index + step;
//     if (target < 0 || target >= items.length) return;
//     const next = [...items];
//     [next[index], next[target]] = [next[target], next[index]];
//     onChange(next);
//   };
//   return (
//     <div className="cc-stack">
//       {items.map((item, index) => (
//         <div className="cc-item" key={index}>
//           <div className="cc-item-head">
//             <strong>{field.itemLabel} {index + 1}: <span>{itemTitle(item, "Untitled")}</span></strong>
//             <span className="cc-row">
//               <button type="button" className="cc-btn cc-btn-icon" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">↑</button>
//               <button type="button" className="cc-btn cc-btn-icon" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Move down">↓</button>
//               <button
//                 type="button"
//                 className="cc-btn cc-btn-small cc-btn-danger"
//                 onClick={() => {
//                   if (window.confirm(`Delete ${field.itemLabel.toLowerCase()} ${index + 1}?`)) onChange(items.filter((_, i) => i !== index));
//                 }}
//               >Delete</button>
//             </span>
//           </div>
//           <Fields fields={field.fields} value={item} onChange={(next) => onChange(items.map((current, i) => (i === index ? next : current)))} />
//         </div>
//       ))}
//       {!items.length ? <p className="cc-help">Nothing here yet. The section will show no cards.</p> : null}
//       <div><button type="button" className="cc-btn" onClick={() => onChange([...items, clone(field.blank)])}>+ Add {field.itemLabel.toLowerCase()}</button></div>
//     </div>
//   );
// }

// function Field({ field, value, onChange }) {
//   let control = null;
//   switch (field.type) {
//     case "text":
//       control = <input className="cc-input" value={value ?? ""} onChange={(event) => onChange(event.target.value)} />;
//       break;
//     case "area":
//       control = <textarea className="cc-input" rows={3} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />;
//       break;
//     case "heading":
//       control = (
//         <div className="cc-heading">
//           <textarea
//             className="cc-input"
//             rows={2}
//             value={value?.text ?? ""}
//             onChange={(event) => onChange({ ...(value ?? {}), text: event.target.value })}
//           />
//           <TagSelect value={value?.tag} fallback={field.defaultTag} onChange={(next) => onChange({ ...(value ?? {}), tag: next })} label="Heading tag" />
//         </div>
//       );
//       break;
//     case "image":
//       control = <ImageEditor value={value} onChange={onChange} />;
//       break;
//     case "icon":
//       control = (
//         <select className="cc-select" value={value ?? ""} onChange={(event) => onChange(event.target.value)}>
//           {ICON_NAMES.map((name) => (
//             <option key={name} value={name}>{name}</option>
//           ))}
//         </select>
//       );
//       break;
//     case "tag":
//       control = <TagSelect value={value} fallback="h3" onChange={onChange} />;
//       break;
//     case "strings":
//       control = <StringsEditor field={field} value={value} onChange={onChange} />;
//       break;
//     case "list":
//       control = <ListEditor field={field} value={value} onChange={onChange} />;
//       break;
//     default:
//       return null;
//   }
//   return (
//     <div className="cc-field">
//       <label className="cc-label">{field.label}</label>
//       {control}
//       {field.help ? <p className="cc-help">{field.help}</p> : null}
//     </div>
//   );
// }

// function Fields({ fields, value, onChange }) {
//   return fields.map((field) => (
//     <Field
//       key={field.name}
//       field={field}
//       value={value?.[field.name]}
//       onChange={(next) => onChange({ ...(value ?? {}), [field.name]: next })}
//     />
//   ));
// }

// /* ------------------------------------------------------------------ */
// /* Page                                                                */
// /* ------------------------------------------------------------------ */
// export default function DesignYourDreamSpaceCmsPage() {
//   const [content, setContent] = useState(null);
//   const [savedSnapshot, setSavedSnapshot] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [status, setStatus] = useState(null);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setStatus(null);
//     try {
//       const response = await api.get(`/cms-landing-page/${PAGE_KEY}`);
//       const merged = mergeContent(DEFAULT_CONTENT, response.data?.content);
//       setContent(merged);
//       setSavedSnapshot(JSON.stringify(merged));
//     } catch (error) {
//       console.error("CMS content load error:", error.response?.data || error);
//       setContent(clone(DEFAULT_CONTENT));
//       setSavedSnapshot("");
//       setStatus({ type: "error", text: "Could not load saved content. Showing the built-in defaults." });
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const dirty = content !== null && JSON.stringify(content) !== savedSnapshot;
//   const h1Count = useMemo(() => (content ? countH1(content) + (content.faq?.questionTag === "h1" ? content.faq.items.length : 0) : 0), [content]);

//   useEffect(() => {
//     if (!dirty) return undefined;
//     const warn = (event) => {
//       event.preventDefault();
//       event.returnValue = "";
//     };
//     window.addEventListener("beforeunload", warn);
//     return () => window.removeEventListener("beforeunload", warn);
//   }, [dirty]);

//   const updateSection = (key, next) => setContent((current) => ({ ...current, [key]: next }));

//   const save = async () => {
//     setSaving(true);
//     setStatus(null);
//     try {
//       await api.put(`/cms-landing-page/${PAGE_KEY}`, { content });
//       setSavedSnapshot(JSON.stringify(content));
//       setStatus({ type: "ok", text: "Saved. The live page updates within about a minute." });
//     } catch (error) {
//       console.error("CMS content save error:", error.response?.data || error);
//       const serverMsg = error.response?.data?.message;
//       setStatus({ type: "error", text: (Array.isArray(serverMsg) ? serverMsg.join(", ") : serverMsg) || "Save failed. Please try again." });
//     } finally {
//       setSaving(false);
//     }
//   };

//   const resetAll = () => {
//     if (!window.confirm("Replace everything on this screen with the original built-in content? Nothing is saved until you press Save.")) return;
//     setContent(clone(DEFAULT_CONTENT));
//   };

//   return (
//     <AuthMainLayout>
//       <style dangerouslySetInnerHTML={{ __html: CMS_CSS }} />
//       <div className="cc-page">
//         <div className="cc-bar">
//           <div>
//             <h1 className="cc-title">Landing page: Design Your Dream Space</h1>
//             <p className="cc-help">Public page: /design-your-dream-space</p>
//           </div>
//           <div className="cc-row">
//             {dirty ? <span className="cc-dirty">Unsaved changes</span> : null}
//             <button type="button" className="cc-btn" onClick={load} disabled={loading || saving}>Reload</button>
//             <button type="button" className="cc-btn" onClick={resetAll} disabled={loading || saving}>Reset to defaults</button>
//             <button type="button" className="cc-btn cc-btn-primary" onClick={save} disabled={loading || saving || !dirty}>{saving ? "Saving..." : "Save changes"}</button>
//           </div>
//         </div>

//         {status ? <p className={`cc-status cc-status-${status.type}`} role="status">{status.text}</p> : null}
//         {content && h1Count !== 1 ? (
//           <p className="cc-status cc-status-warn">
//             This page has {h1Count} H1 headings. For SEO keep exactly one H1 (the hero page heading) and use H2 and below for everything else.
//           </p>
//         ) : null}

//         {loading || !content ? (
//           <p className="cc-help">Loading...</p>
//         ) : (
//           SECTIONS.map((section, index) => {
//             const value = content[section.key];
//             return (
//               <details className="cc-section" key={section.key} open={index < 2}>
//                 <summary>
//                   <span>{section.title}</span>
//                   {section.toggle && value?.visible === false ? <em>Hidden on page</em> : null}
//                 </summary>
//                 <div className="cc-section-body">
//                   {section.toggle ? (
//                     <label className="cc-toggle">
//                       <input
//                         type="checkbox"
//                         checked={value?.visible !== false}
//                         onChange={(event) => updateSection(section.key, { ...(value ?? {}), visible: event.target.checked })}
//                       />
//                       <span>Show this section on the page</span>
//                     </label>
//                   ) : null}
//                   <Fields fields={section.fields} value={value} onChange={(next) => updateSection(section.key, next)} />
//                 </div>
//               </details>
//             );
//           })
//         )}
//       </div>
//     </AuthMainLayout>
//   );
// }

// const CMS_CSS = `
//   .cc-page { max-width: 980px; margin: 0 auto; padding: 24px 16px 80px; color: #1f2937; }
//   .cc-bar { position: sticky; top: 0; z-index: 20; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 0; background: #fff; border-bottom: 1px solid #e5e7eb; margin-bottom: 16px; }
//   .cc-title { margin: 0; font-size: 22px; font-weight: 700; }
//   .cc-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
//   .cc-stack { display: flex; flex-direction: column; gap: 10px; }
//   .cc-help { margin: 4px 0 0; font-size: 12px; color: #6b7280; }
//   .cc-dirty { font-size: 12px; font-weight: 600; color: #b45309; }
//   .cc-status { margin: 0 0 14px; padding: 10px 12px; border-radius: 6px; font-size: 13px; }
//   .cc-status-ok { background: #ecfdf5; color: #065f46; }
//   .cc-status-error { background: #fef2f2; color: #991b1b; }
//   .cc-status-warn { background: #fffbeb; color: #92400e; }
//   .cc-section { margin-bottom: 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; }
//   .cc-section > summary { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; cursor: pointer; font-weight: 600; font-size: 15px; }
//   .cc-section > summary em { font-size: 12px; font-style: normal; color: #b45309; }
//   .cc-section-body { padding: 4px 16px 18px; border-top: 1px solid #f1f5f9; }
//   .cc-toggle { display: flex; align-items: center; gap: 8px; margin: 14px 0 4px; font-size: 14px; font-weight: 600; }
//   .cc-field { margin-top: 16px; }
//   .cc-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; }
//   .cc-input { width: 100%; padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; font: inherit; font-size: 14px; background: #fff; }
//   .cc-input:focus, .cc-select:focus { outline: 2px solid #ff914d; outline-offset: 0; }
//   .cc-select { padding: 8px 10px; border: 1px solid #d1d5db; border-radius: 6px; font: inherit; font-size: 14px; background: #fff; }
//   .cc-heading { display: flex; gap: 8px; align-items: flex-start; }
//   .cc-heading .cc-select { min-width: 76px; }
//   .cc-btn { padding: 8px 14px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
//   .cc-btn:hover:not(:disabled) { background: #f3f4f6; }
//   .cc-btn:disabled { opacity: .5; cursor: not-allowed; }
//   .cc-btn-primary { background: #ff914d; border-color: #ff914d; color: #fff; }
//   .cc-btn-primary:hover:not(:disabled) { background: #f57735; }
//   .cc-btn-small { padding: 5px 10px; font-size: 12px; }
//   .cc-btn-icon { width: 32px; height: 32px; padding: 0; font-size: 16px; line-height: 1; }
//   .cc-btn-danger { color: #b91c1c; border-color: #fecaca; }
//   .cc-item { padding: 12px 14px 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fafafa; }
//   .cc-item-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
//   .cc-item-head strong { font-size: 13px; }
//   .cc-item-head strong span { font-weight: 500; color: #6b7280; }
//   .cc-image { display: flex; gap: 12px; align-items: flex-start; }
//   .cc-image-preview { width: 120px; height: 80px; flex: 0 0 120px; display: grid; place-items: center; overflow: hidden; border: 1px solid #e5e7eb; border-radius: 6px; background: #f3f4f6; font-size: 12px; color: #9ca3af; }
//   .cc-image-preview img { width: 100%; height: 100%; object-fit: cover; }
//   .cc-image-controls { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
//   @media (max-width: 640px) { .cc-image { flex-direction: column; } .cc-heading { flex-direction: column; } }
// `;



"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { DEFAULT_CONTENT, HEADING_TAGS, ICON_NAMES, PAGE_KEY, mergeContent } from "@/utils/hciLandingContent";

/* ------------------------------------------------------------------ */
/* Field + section schema. Add a field here and it shows up in the CMS. */
/* ------------------------------------------------------------------ */
const text = (name, label, o = {}) => ({ type: "text", name, label, ...o });
const area = (name, label, o = {}) => ({ type: "area", name, label, ...o });
const heading = (name, label, o = {}) => ({ type: "heading", name, label, ...o });
const image = (name, label, o = {}) => ({ type: "image", name, label, ...o });
const url = (name, label, o = {}) => ({ type: "url", name, label, ...o });
const icon = (name, label) => ({ type: "icon", name, label });
const tag = (name, label) => ({ type: "tag", name, label });
const strings = (name, label, itemLabel, o = {}) => ({ type: "strings", name, label, itemLabel, ...o });
const list = (name, label, itemLabel, fields, blank, o = {}) => ({ type: "list", name, label, itemLabel, fields, blank, ...o });

const H = (value = "", tagName = "h3") => ({ text: value, tag: tagName });

const SECTIONS = [
  {
    key: "contact",
    title: "Phone & WhatsApp numbers",
    fields: [
      text("callNumber", "Phone number (Call buttons, floating call button, footer link)", { help: "Type it the way visitors should see it, e.g. +91 70707 01373. A 10-digit number gets +91 added for dialling." }),
      text("whatsappNumber", "WhatsApp number (Chat on WhatsApp buttons)"),
      area("whatsappGreeting", "WhatsApp pre-filled message"),
    ],
  },
  {
    key: "buttons",
    title: "Button labels",
    fields: [
      text("getQuote", "Get quote button"),
      text("getQuoteMobile", "Floating bar label (mobile)"),
      text("call", "Call button prefix (shown before the phone number)"),
      text("whatsapp", "WhatsApp button"),
      text("directions", "Directions button (experience centers)"),
      text("scheduleVisit", "Schedule visit button"),
      text("bookConsultation", "Book a consultation button (bottom banner)"),
    ],
  },
  {
    key: "header",
    title: "Header logo",
    fields: [image("logo", "Logo image"), text("logoAlt", "Logo alt text")],
  },
  {
    key: "form",
    title: "Lead form",
    fields: [
      heading("heading", "Form heading", { defaultTag: "h2" }),
      text("submitText", "Submit button text"),
      heading("thankYouHeading", "Thank-you heading (shown after the form is submitted)", { defaultTag: "h2" }),
      area("thankYouText", "Thank-you message", { help: "Shown in the same place as the form: inside the pop-up if the pop-up was filled, otherwise at the top form." }),
    ],
  },
  {
    key: "hero",
    title: "Hero (top of page)",
    fields: [
      heading("heading", "Page heading (read by search engines; use H1 once per page)", { defaultTag: "h1", help: "This text is hidden on screen. Visitors see the typing lines below." }),
      strings("phrases", "Typing lines (shown one after another)", "Line"),
      image("image", "Background image"),
      area("areasText", "Service areas line"),
      strings("points", "Tick-mark points", "Point"),
    ],
  },
  {
    key: "benefits",
    title: "Three benefits strip",
    toggle: true,
    fields: [
      list("items", "Benefits", "Benefit", [icon("icon", "Icon"), heading("title", "Heading", { defaultTag: "h2" }), area("text", "Text")], { icon: "check", title: H("New benefit", "h2"), text: "" }),
    ],
  },
  {
    key: "propertyStrip",
    title: "Home type selector",
    toggle: true,
    fields: [
      text("eyebrow", "Small label above heading"),
      heading("heading", "Heading", { defaultTag: "h2" }),
      strings("options", "Home types", "Home type"),
      text("hint", "Hint under the buttons"),
    ],
  },
  {
    key: "services",
    title: "Services",
    toggle: true,
    fields: [
      text("eyebrow", "Small label above heading"),
      heading("heading", "Section heading", { defaultTag: "h2" }),
      text("cardLabel", "Card label (after the number, e.g. SERVICE)"),
      list("items", "Service cards", "Service", [heading("title", "Card heading", { defaultTag: "h3" }), area("text", "Text"), image("image", "Image")], { title: H("New service"), text: "", image: "" }),
    ],
  },
  {
    key: "rooms",
    title: "Room inspiration",
    toggle: true,
    fields: [
      text("eyebrow", "Small label above heading"),
      heading("heading", "Section heading", { defaultTag: "h2" }),
      list("items", "Room cards", "Room", [heading("title", "Room name", { defaultTag: "h3" }), text("label", "Small label on the image"), image("image", "Image")], { title: H("New room"), label: "", image: "" }),
    ],
  },
  {
    key: "story",
    title: "Every room should earn its place",
    toggle: true,
    fields: [
      text("eyebrow", "Small label above heading"),
      heading("heading", "Section heading", { defaultTag: "h2" }),
      area("text", "Intro paragraph"),
      text("tagLabel", "Tag on the photo (before the point name)"),
      list(
        "points",
        "Points (each one swaps the photo)",
        "Point",
        [text("short", "Short name (shown on the photo)"), icon("icon", "Icon"), text("title", "Title"), area("text", "Text"), image("image", "Photo"), text("alt", "Photo alt text")],
        { short: "New", icon: "check", title: "", text: "", image: "", alt: "" }
      ),
    ],
  },
  {
    key: "process",
    title: "Process steps",
    toggle: true,
    fields: [
      text("eyebrow", "Small label above heading"),
      heading("heading", "Section heading", { defaultTag: "h2" }),
      list("steps", "Steps (numbered automatically)", "Step", [heading("title", "Step heading", { defaultTag: "h3" }), area("text", "Text")], { title: H("New step"), text: "" }),
      area("footnote", "Note under the steps"),
    ],
  },
  {
    key: "stats",
    title: "Numbers strip",
    toggle: true,
    fields: [
      list("items", "Numbers", "Number", [text("value", "Number (digits only, counts up on scroll)"), text("suffix", "After the number (e.g. +)"), text("label", "Label")], { value: "0", suffix: "", label: "" }),
    ],
  },
  {
    key: "ideas",
    title: "Design ideas gallery",
    toggle: true,
    fields: [
      text("eyebrow", "Small label above heading"),
      heading("heading", "Section heading", { defaultTag: "h2" }),
      list("items", "Gallery cards", "Card", [heading("title", "Card heading", { defaultTag: "h3" }), text("category", "Chip text"), image("image", "Image")], { title: H("New idea"), category: "", image: "" }),
    ],
  },
  {
    key: "experience",
    title: "Experience centers",
    toggle: true,
    fields: [
      heading("heading", "Section heading", { defaultTag: "h2" }),
      area("text", "Text under heading"),
      text("kicker", "Small label on each card"),
      list("centers", "Centers", "Center", [
        heading("city", "City / center name", { defaultTag: "h3" }),
        area("address", "Address"),
        text("phone", "Phone number"),
        url("mapUrl", "Google Maps link (used by the Get directions button)", { placeholder: "https://maps.app.goo.gl/...", help: "In Google Maps press Share and copy the link. Leave empty to open a Maps search for the address instead." }),
      ],
      { city: H("New center"), address: "", phone: "", mapUrl: "" }),
    ],
  },
  {
    key: "locations",
    title: "Serving areas",
    toggle: true,
    fields: [
      text("eyebrow", "Small label above heading"),
      heading("heading", "Section heading", { defaultTag: "h2" }),
      area("text", "Text under heading"),
      strings("areas", "Cities (also used as suggestions in the lead form)", "City"),
    ],
  },
  {
    key: "faq",
    title: "FAQ",
    toggle: true,
    fields: [
      text("eyebrow", "Small label above heading"),
      heading("heading", "Section heading", { defaultTag: "h2" }),
      area("text", "Text under heading"),
      tag("questionTag", "Heading level used for every question"),
      list("items", "Questions", "Question", [text("question", "Question"), area("answer", "Answer")], { question: "", answer: "" }),
    ],
  },
  {
    key: "finalCta",
    title: "Bottom banner",
    toggle: true,
    fields: [
      image("image", "Image"),
      text("imageAlt", "Image alt text"),
      text("eyebrow", "Small label above heading"),
      heading("heading", "Heading", { defaultTag: "h2" }),
      area("text", "Text"),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const clone = (value) => JSON.parse(JSON.stringify(value));

function countH1(node) {
  if (Array.isArray(node)) return node.reduce((sum, item) => sum + countH1(item), 0);
  if (node && typeof node === "object") {
    const own = node.tag === "h1" && "text" in node && String(node.text).trim() ? 1 : 0;
    return Object.entries(node).reduce((sum, [, child]) => sum + countH1(child), own);
  }
  return 0;
}

function itemTitle(item, fallback) {
  const candidate = item?.title?.text ?? item?.city?.text ?? item?.title ?? item?.question ?? item?.short ?? item?.label ?? item?.value;
  return typeof candidate === "string" && candidate.trim() ? candidate : fallback;
}

/* ------------------------------------------------------------------ */
/* Navigation metadata (group, icon, one-line description per section) */
/* ------------------------------------------------------------------ */
const SECTION_META = {
  contact: { group: "Site-wide", icon: "phone", desc: "Numbers used by every Call and WhatsApp button on the page." },
  buttons: { group: "Site-wide", icon: "cursor", desc: "Text on the buttons visitors tap." },
  header: { group: "Site-wide", icon: "image", desc: "The logo shown at the top of the page." },
  form: { group: "Site-wide", icon: "form", desc: "Form heading, submit button and the thank-you message shown after submitting." },
  hero: { group: "Page sections", icon: "sparkle", desc: "The first screen: typing lines, background and key points." },
  benefits: { group: "Page sections", icon: "check", desc: "Three short promises right under the hero." },
  propertyStrip: { group: "Page sections", icon: "home", desc: "Home type buttons that open the estimator." },
  services: { group: "Page sections", icon: "grid", desc: "Cards for each service you offer." },
  rooms: { group: "Page sections", icon: "image", desc: "Room photos with short labels." },
  story: { group: "Page sections", icon: "layers", desc: "Photo that changes as visitors hover over each point." },
  process: { group: "Page sections", icon: "list", desc: "Numbered steps of how a project runs." },
  stats: { group: "Page sections", icon: "hash", desc: "Counting numbers such as years and projects." },
  ideas: { group: "Page sections", icon: "grid", desc: "Gallery of design idea cards." },
  experience: { group: "Page sections", icon: "pin", desc: "Showroom addresses, phone numbers and Google Maps links." },
  locations: { group: "Page sections", icon: "pin", desc: "Cities you serve (also feeds the form city suggestions)." },
  faq: { group: "Page sections", icon: "chat", desc: "Questions and answers." },
  finalCta: { group: "Page sections", icon: "sparkle", desc: "Closing banner with the main call to action." },
};

const NAV_GROUPS = ["Site-wide", "Page sections"];

const ICON_PATHS = {
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 2.1 4.18 2 2 0 0 1 4.09 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.07 9.93a16 16 0 0 0 6 6l1.3-1.27a2 2 0 0 1 2.11-.45c.9.35 1.84.58 2.8.7A2 2 0 0 1 22 16.92Z",
  cursor: "M5 4l6 15 2.2-6.2L19 10.6 5 4Z",
  image: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4",
  form: "M5 4h14v16H5zM8 9h8M8 13h8M8 17h4",
  sparkle: "m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z",
  check: "m5 12 4 4L19 6",
  home: "m3 10 9-7 9 7M5.5 9v11h13V9M9.5 20v-6h5v6",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  layers: "m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  hash: "M5 9h14M5 15h14M10 4 8 20M16 4l-2 16",
  pin: "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0ZM12 10m-2.2 0a2.2 2.2 0 1 0 4.4 0 2.2 2.2 0 1 0-4.4 0",
  chat: "M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5.3A8.4 8.4 0 1 1 21 11.5Z",
  up: "m6 15 6-6 6 6",
  down: "m6 9 6 6 6-6",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  plus: "M12 5v14M5 12h14",
  external: "M14 4h6v6M20 4l-9 9M18 14v5H5V6h5",
};

function SvgIcon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICON_PATHS[name] || ICON_PATHS.sparkle} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Field editors                                                       */
/* ------------------------------------------------------------------ */
function TagSelect({ value, onChange, fallback = "h2", label = "Tag" }) {
  return (
    <select className="cc-select" value={HEADING_TAGS.includes(value) ? value : fallback} onChange={(event) => onChange(event.target.value)} aria-label={label}>
      {HEADING_TAGS.map((name) => (
        <option key={name} value={name}>{name.toUpperCase()}</option>
      ))}
    </select>
  );
}

function ImageEditor({ value, onChange }) {
  const url = value || "";
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [url]);
  return (
    <div className="cc-image">
      <div className="cc-image-preview">
        {url && !broken ? <img src={url} alt="" onError={() => setBroken(true)} /> : <span>{url ? "Cannot load image" : "No image"}</span>}
      </div>
      <div className="cc-image-controls">
        <input className="cc-input" value={url} placeholder="Image URL (https://... or /images/...)" onChange={(event) => onChange(event.target.value)} />
        <div className="cc-row">
          <button type="button" className="cc-btn cc-btn-small cc-btn-ghost-danger" onClick={() => onChange("")} disabled={!url}>
            <SvgIcon name="trash" size={14} /> Remove image
          </button>
          <span className="cc-hint">Paste a new URL to replace the image.</span>
        </div>
      </div>
    </div>
  );
}

function UrlEditor({ field, value, onChange }) {
  const current = value ?? "";
  const invalid = current.trim() !== "" && !/^https?:\/\//i.test(current.trim());
  return (
    <div className="cc-stack-sm">
      <div className="cc-row cc-nowrap">
        <input
          className={`cc-input${invalid ? " is-invalid" : ""}`}
          type="url"
          value={current}
          placeholder={field.placeholder || "https://"}
          onChange={(event) => onChange(event.target.value)}
        />
        {current.trim() && !invalid ? (
          <a className="cc-btn cc-btn-small" href={current.trim()} target="_blank" rel="noopener noreferrer">
            Test <SvgIcon name="external" size={13} />
          </a>
        ) : null}
      </div>
      {invalid ? <p className="cc-error">The link must start with http:// or https://. It is ignored until fixed.</p> : null}
    </div>
  );
}

function IconButton({ icon, label, onClick, disabled, danger = false }) {
  return (
    <button type="button" className={`cc-icon-btn${danger ? " is-danger" : ""}`} onClick={onClick} disabled={disabled} aria-label={label} title={label}>
      <SvgIcon name={icon} size={15} />
    </button>
  );
}

function StringsEditor({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const move = (index, step) => {
    const target = index + step;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  return (
    <div className="cc-stack-sm">
      {items.map((item, index) => (
        <div className="cc-string-row" key={index}>
          <span className="cc-badge">{index + 1}</span>
          <input
            className="cc-input"
            value={item}
            onChange={(event) => onChange(items.map((current, i) => (i === index ? event.target.value : current)))}
            aria-label={`${field.itemLabel} ${index + 1}`}
          />
          <IconButton icon="up" label="Move up" onClick={() => move(index, -1)} disabled={index === 0} />
          <IconButton icon="down" label="Move down" onClick={() => move(index, 1)} disabled={index === items.length - 1} />
          <IconButton icon="trash" label="Delete" danger onClick={() => onChange(items.filter((_, i) => i !== index))} />
        </div>
      ))}
      {!items.length ? <p className="cc-hint">Nothing added yet.</p> : null}
      <div>
        <button type="button" className="cc-btn cc-btn-small" onClick={() => onChange([...items, ""])}>
          <SvgIcon name="plus" size={14} /> Add {field.itemLabel.toLowerCase()}
        </button>
      </div>
    </div>
  );
}

function ListEditor({ field, value, onChange }) {
  const items = Array.isArray(value) ? value : [];
  const [openIndex, setOpenIndex] = useState(null);
  const imageField = field.fields.find((f) => f.type === "image");

  const move = (index, step) => {
    const target = index + step;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setOpenIndex((current) => (current === index ? target : current === target ? index : current));
  };

  return (
    <div className="cc-stack-sm">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const thumb = imageField ? item?.[imageField.name] : "";
        return (
          <div className={`cc-item${isOpen ? " is-open" : ""}`} key={index}>
            <div className="cc-item-bar">
              <button type="button" className="cc-item-toggle" onClick={() => setOpenIndex(isOpen ? null : index)} aria-expanded={isOpen}>
                <span className="cc-badge">{index + 1}</span>
                {imageField ? <span className="cc-thumb">{thumb ? <img src={thumb} alt="" /> : null}</span> : null}
                <span className="cc-item-title">{itemTitle(item, `${field.itemLabel} ${index + 1}`)}</span>
                <span className={`cc-chevron${isOpen ? " is-open" : ""}`}><SvgIcon name="down" size={16} /></span>
              </button>
              <div className="cc-item-actions">
                <IconButton icon="up" label="Move up" onClick={() => move(index, -1)} disabled={index === 0} />
                <IconButton icon="down" label="Move down" onClick={() => move(index, 1)} disabled={index === items.length - 1} />
                <IconButton
                  icon="trash"
                  label="Delete"
                  danger
                  onClick={() => {
                    if (!window.confirm(`Delete ${field.itemLabel.toLowerCase()} ${index + 1}?`)) return;
                    onChange(items.filter((_, i) => i !== index));
                    setOpenIndex(null);
                  }}
                />
              </div>
            </div>
            {isOpen ? (
              <div className="cc-item-body">
                <FieldGrid fields={field.fields} value={item} onChange={(next) => onChange(items.map((current, i) => (i === index ? next : current)))} />
              </div>
            ) : null}
          </div>
        );
      })}
      {!items.length ? <p className="cc-hint">Nothing here yet. The section will show no cards.</p> : null}
      <div>
        <button
          type="button"
          className="cc-btn"
          onClick={() => {
            onChange([...items, clone(field.blank)]);
            setOpenIndex(items.length);
          }}
        >
          <SvgIcon name="plus" size={14} /> Add {field.itemLabel.toLowerCase()}
        </button>
      </div>
    </div>
  );
}

const WIDE_TYPES = ["area", "heading", "image", "strings", "list", "url"];

function Field({ field, value, onChange }) {
  let control = null;
  switch (field.type) {
    case "text":
      control = <input className="cc-input" value={value ?? ""} onChange={(event) => onChange(event.target.value)} />;
      break;
    case "area":
      control = <textarea className="cc-input" rows={3} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />;
      break;
    case "url":
      control = <UrlEditor field={field} value={value} onChange={onChange} />;
      break;
    case "heading":
      control = (
        <div className="cc-heading">
          <textarea
            className="cc-input"
            rows={2}
            value={value?.text ?? ""}
            onChange={(event) => onChange({ ...(value ?? {}), text: event.target.value })}
          />
          <div className="cc-tag-box">
            <span>Heading tag</span>
            <TagSelect value={value?.tag} fallback={field.defaultTag} onChange={(next) => onChange({ ...(value ?? {}), tag: next })} label="Heading tag" />
          </div>
        </div>
      );
      break;
    case "image":
      control = <ImageEditor value={value} onChange={onChange} />;
      break;
    case "icon":
      control = (
        <select className="cc-select cc-select-full" value={value ?? ""} onChange={(event) => onChange(event.target.value)}>
          {ICON_NAMES.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      );
      break;
    case "tag":
      control = <TagSelect value={value} fallback="h3" onChange={onChange} />;
      break;
    case "strings":
      control = <StringsEditor field={field} value={value} onChange={onChange} />;
      break;
    case "list":
      control = <ListEditor field={field} value={value} onChange={onChange} />;
      break;
    default:
      return null;
  }
  return (
    <div className={`cc-field${WIDE_TYPES.includes(field.type) ? " is-wide" : ""}`}>
      <label className="cc-label">{field.label}</label>
      {control}
      {field.help ? <p className="cc-hint">{field.help}</p> : null}
    </div>
  );
}

function FieldGrid({ fields, value, onChange }) {
  return (
    <div className="cc-fields">
      {fields.map((field) => (
        <Field
          key={field.name}
          field={field}
          value={value?.[field.name]}
          onChange={(next) => onChange({ ...(value ?? {}), [field.name]: next })}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function DesignYourDreamSpaceCmsPage() {
  const [content, setContent] = useState(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [activeKey, setActiveKey] = useState(SECTIONS[0].key);

  const load = useCallback(async () => {
    setLoading(true);
    setStatus(null);
    try {
      const response = await api.get(`/cms-landing-page/${PAGE_KEY}`);
      const merged = mergeContent(DEFAULT_CONTENT, response.data?.content);
      setContent(merged);
      setSavedSnapshot(JSON.stringify(merged));
    } catch (error) {
      console.error("CMS content load error:", error.response?.data || error);
      setContent(clone(DEFAULT_CONTENT));
      setSavedSnapshot("");
      setStatus({ type: "error", text: "Could not load saved content. Showing the built-in defaults." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = content !== null && JSON.stringify(content) !== savedSnapshot;
  const h1Count = useMemo(() => (content ? countH1(content) + (content.faq?.questionTag === "h1" ? content.faq.items.length : 0) : 0), [content]);
  const activeSection = SECTIONS.find((section) => section.key === activeKey) ?? SECTIONS[0];

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const updateSection = (key, next) => setContent((current) => ({ ...current, [key]: next }));

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await api.put(`/cms-landing-page/${PAGE_KEY}`, { content });
      setSavedSnapshot(JSON.stringify(content));
      setStatus({ type: "ok", text: "Saved. The live page updates within about a minute." });
    } catch (error) {
      console.error("CMS content save error:", error.response?.data || error);
      const serverMsg = error.response?.data?.message;
      setStatus({ type: "error", text: (Array.isArray(serverMsg) ? serverMsg.join(", ") : serverMsg) || "Save failed. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const resetAll = () => {
    if (!window.confirm("Replace everything on this screen with the original built-in content? Nothing is saved until you press Save.")) return;
    setContent(clone(DEFAULT_CONTENT));
  };

  const meta = SECTION_META[activeSection.key] ?? { icon: "sparkle", desc: "" };
  const activeValue = content?.[activeSection.key];

  return (
    <AuthMainLayout>
      <style dangerouslySetInnerHTML={{ __html: CMS_CSS }} />
      <div className="cc-shell">
        <div className="cc-top">
          <div className="cc-top-copy">
            <div className="cc-title" role="heading" aria-level={1}>Design Your Dream Space</div>
            <p className="cc-sub">
              Landing page editor
              <a href={`/${PAGE_KEY}`} target="_blank" rel="noopener noreferrer">View live page <SvgIcon name="external" size={12} /></a>
            </p>
          </div>
          <div className="cc-top-actions">
            {dirty ? <span className="cc-pill is-warn">Unsaved changes</span> : <span className="cc-pill">All changes saved</span>}
            <button type="button" className="cc-btn" onClick={load} disabled={loading || saving}>Reload</button>
            <button type="button" className="cc-btn" onClick={resetAll} disabled={loading || saving}>Reset to defaults</button>
            <button type="button" className="cc-btn cc-btn-primary" onClick={save} disabled={loading || saving || !dirty}>{saving ? "Saving..." : "Save changes"}</button>
          </div>
        </div>

        {status ? <p className={`cc-alert cc-alert-${status.type}`} role="status">{status.text}</p> : null}
        {content && h1Count !== 1 ? (
          <p className="cc-alert cc-alert-warn">
            This page has {h1Count} H1 headings. For SEO keep exactly one H1 (the hero page heading) and use H2 and below everywhere else.
          </p>
        ) : null}

        {loading || !content ? (
          <div className="cc-loading">Loading content...</div>
        ) : (
          <div className="cc-layout">
            <nav className="cc-nav" aria-label="Page sections">
              {NAV_GROUPS.map((group) => (
                <div className="cc-nav-group" key={group}>
                  <div className="cc-nav-label">{group}</div>
                  <div className="cc-nav-list">
                    {SECTIONS.filter((section) => SECTION_META[section.key]?.group === group).map((section) => {
                      const itemMeta = SECTION_META[section.key];
                      const hidden = section.toggle && content[section.key]?.visible === false;
                      const isActive = section.key === activeSection.key;
                      return (
                        <button
                          type="button"
                          key={section.key}
                          className={`cc-nav-item${isActive ? " is-active" : ""}`}
                          onClick={() => setActiveKey(section.key)}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <span className="cc-nav-icon"><SvgIcon name={itemMeta.icon} size={17} /></span>
                          <span className="cc-nav-text">{section.title}</span>
                          {hidden ? <span className="cc-nav-off">Hidden</span> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <section className="cc-panel" aria-labelledby="cc-panel-title">
              <header className="cc-panel-head">
                <span className="cc-panel-icon"><SvgIcon name={meta.icon} size={22} /></span>
                <div className="cc-panel-copy">
                  <div className="cc-panel-title" id="cc-panel-title">{activeSection.title}</div>
                  <p>{meta.desc}</p>
                </div>
                {activeSection.toggle ? (
                  <label className="cc-switch">
                    <input
                      type="checkbox"
                      checked={activeValue?.visible !== false}
                      onChange={(event) => updateSection(activeSection.key, { ...(activeValue ?? {}), visible: event.target.checked })}
                    />
                    <span className="cc-switch-track" aria-hidden="true" />
                    <span className="cc-switch-text">{activeValue?.visible !== false ? "Shown on page" : "Hidden"}</span>
                  </label>
                ) : null}
              </header>
              <div className={`cc-panel-body${activeSection.toggle && activeValue?.visible === false ? " is-muted" : ""}`}>
                <FieldGrid fields={activeSection.fields} value={activeValue} onChange={(next) => updateSection(activeSection.key, next)} />
              </div>
              <footer className="cc-panel-foot">
                {(() => {
                  const index = SECTIONS.findIndex((section) => section.key === activeSection.key);
                  const previous = SECTIONS[index - 1];
                  const next = SECTIONS[index + 1];
                  return (
                    <>
                      {previous ? <button type="button" className="cc-btn" onClick={() => setActiveKey(previous.key)}>← {previous.title}</button> : <span />}
                      {next ? <button type="button" className="cc-btn" onClick={() => setActiveKey(next.key)}>{next.title} →</button> : <span />}
                    </>
                  );
                })()}
              </footer>
            </section>
          </div>
        )}
      </div>
    </AuthMainLayout>
  );
}

const CMS_CSS = `
  .cc-shell { --cc-accent: #ff914d; --cc-accent-deep: #f57735; --cc-accent-soft: #fff1e7; --cc-ink: #1e2430; --cc-muted: #6b7280; --cc-line: #e6e8ec; --cc-bg: #f5f6f8; --cc-danger: #c0392b; max-width: 1280px; margin: 0 auto; padding: 20px 16px 80px; color: var(--cc-ink); font-size: 14px; line-height: 1.5; }
  .cc-shell *, .cc-shell *::before, .cc-shell *::after { box-sizing: border-box; }
  .cc-shell button, .cc-shell input, .cc-shell select, .cc-shell textarea { font-family: inherit; }
  .cc-top { position: sticky; top: 0; z-index: 30; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 16px; padding: 14px 18px; border: 1px solid var(--cc-line); border-radius: 14px; background: rgba(255,255,255,.96); backdrop-filter: blur(6px); box-shadow: 0 4px 18px rgba(30,36,48,.06); }
  .cc-title { font-size: 22px; font-weight: 700; line-height: 1.2; letter-spacing: -.01em; }
  .cc-sub { display: flex; align-items: center; gap: 14px; margin: 3px 0 0; color: var(--cc-muted); font-size: 13px; }
  .cc-sub a { display: inline-flex; align-items: center; gap: 5px; color: var(--cc-accent-deep); font-weight: 600; text-decoration: none; }
  .cc-sub a:hover { text-decoration: underline; }
  .cc-top-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .cc-pill { padding: 5px 11px; border-radius: 999px; background: #eef2f1; color: #3c5a52; font-size: 12px; font-weight: 600; }
  .cc-pill.is-warn { background: #fff3d6; color: #8a5a00; }
  .cc-btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 38px; padding: 0 15px; border: 1px solid #d5d9df; border-radius: 9px; background: #fff; color: var(--cc-ink); font-size: 13px; font-weight: 600; text-decoration: none; cursor: pointer; transition: background .15s ease, border-color .15s ease, box-shadow .15s ease; }
  .cc-btn:hover:not(:disabled) { background: #f6f7f9; border-color: #c4cad2; }
  .cc-btn:disabled { opacity: .5; cursor: not-allowed; }
  .cc-btn-primary { border-color: var(--cc-accent); background: var(--cc-accent); color: #fff; box-shadow: 0 4px 12px rgba(255,145,77,.28); }
  .cc-btn-primary:hover:not(:disabled) { border-color: var(--cc-accent-deep); background: var(--cc-accent-deep); }
  .cc-btn-small { min-height: 32px; padding: 0 11px; font-size: 12px; }
  .cc-btn-ghost-danger { color: var(--cc-danger); }
  .cc-alert { margin: 0 0 14px; padding: 11px 14px; border-radius: 10px; font-size: 13px; }
  .cc-alert-ok { background: #e8f7ef; color: #11663d; }
  .cc-alert-error { background: #fdecea; color: #962d22; }
  .cc-alert-warn { background: #fff6dd; color: #84570a; }
  .cc-loading { padding: 60px 0; text-align: center; color: var(--cc-muted); }
  .cc-layout { display: grid; grid-template-columns: 264px minmax(0, 1fr); gap: 20px; align-items: start; }
  .cc-nav { position: sticky; top: 100px; max-height: calc(100vh - 120px); overflow-y: auto; padding: 14px 10px; border: 1px solid var(--cc-line); border-radius: 14px; background: #fff; }
  .cc-nav-group + .cc-nav-group { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--cc-line); }
  .cc-nav-label { padding: 0 10px 6px; color: #8a919c; font-size: 11px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; }
  .cc-nav-list { display: flex; flex-direction: column; gap: 2px; }
  .cc-nav-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 9px 10px; border: 0; border-radius: 9px; background: transparent; color: #3b4350; font-size: 13.5px; font-weight: 500; text-align: left; cursor: pointer; transition: background .15s ease, color .15s ease; }
  .cc-nav-item:hover { background: #f4f5f7; }
  .cc-nav-item.is-active { background: var(--cc-accent-soft); color: var(--cc-accent-deep); font-weight: 650; }
  .cc-nav-icon { display: grid; place-items: center; width: 30px; height: 30px; flex: 0 0 30px; border-radius: 8px; background: #f0f2f5; color: #5b6471; }
  .cc-nav-item.is-active .cc-nav-icon { background: var(--cc-accent); color: #fff; }
  .cc-nav-text { flex: 1; min-width: 0; }
  .cc-nav-off { padding: 2px 7px; border-radius: 999px; background: #fdecd0; color: #8a5a00; font-size: 10.5px; font-weight: 700; }
  .cc-panel { overflow: hidden; border: 1px solid var(--cc-line); border-radius: 14px; background: #fff; }
  .cc-panel-head { display: flex; align-items: center; gap: 14px; padding: 18px 22px; border-bottom: 1px solid var(--cc-line); background: linear-gradient(180deg, #fffaf6 0%, #fff 100%); }
  .cc-panel-icon { display: grid; place-items: center; width: 44px; height: 44px; flex: 0 0 44px; border-radius: 12px; background: var(--cc-accent-soft); color: var(--cc-accent-deep); }
  .cc-panel-copy { flex: 1; min-width: 0; }
  .cc-panel-title { font-size: 18px; font-weight: 700; line-height: 1.25; }
  .cc-panel-copy p { margin: 2px 0 0; color: var(--cc-muted); font-size: 13px; }
  .cc-switch { position: relative; display: inline-flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
  .cc-switch input { position: absolute; opacity: 0; width: 0; height: 0; }
  .cc-switch-track { position: relative; width: 42px; height: 24px; border-radius: 999px; background: #cfd4db; transition: background .2s ease; }
  .cc-switch-track::after { content: ""; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.25); transition: transform .2s ease; }
  .cc-switch input:checked + .cc-switch-track { background: var(--cc-accent); }
  .cc-switch input:checked + .cc-switch-track::after { transform: translateX(18px); }
  .cc-switch input:focus-visible + .cc-switch-track { outline: 2px solid var(--cc-ink); outline-offset: 2px; }
  .cc-switch-text { min-width: 86px; font-size: 13px; font-weight: 600; }
  .cc-panel-body { padding: 22px; }
  .cc-panel-body.is-muted { opacity: .6; }
  .cc-panel-foot { display: flex; justify-content: space-between; gap: 10px; padding: 14px 22px; border-top: 1px solid var(--cc-line); background: #fafbfc; }
  .cc-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 20px; }
  .cc-field { min-width: 0; }
  .cc-field.is-wide { grid-column: 1 / -1; }
  .cc-label { display: block; margin-bottom: 6px; color: #2a303b; font-size: 13px; font-weight: 650; }
  .cc-hint { margin: 6px 0 0; color: var(--cc-muted); font-size: 12px; }
  .cc-error { margin: 0; color: var(--cc-danger); font-size: 12px; }
  .cc-input, .cc-select { width: 100%; padding: 9px 12px; border: 1px solid #d5d9df; border-radius: 9px; background: #fff; color: var(--cc-ink); font-size: 14px; transition: border-color .15s ease, box-shadow .15s ease; }
  textarea.cc-input { resize: vertical; min-height: 44px; }
  .cc-input:focus, .cc-select:focus { border-color: var(--cc-accent); outline: 0; box-shadow: 0 0 0 3px rgba(255,145,77,.2); }
  .cc-input.is-invalid { border-color: var(--cc-danger); }
  .cc-select { width: auto; min-width: 84px; cursor: pointer; }
  .cc-select-full { width: 100%; }
  .cc-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .cc-nowrap { flex-wrap: nowrap; }
  .cc-stack-sm { display: flex; flex-direction: column; gap: 8px; }
  .cc-heading { display: flex; gap: 12px; align-items: flex-start; }
  .cc-heading .cc-input { flex: 1; }
  .cc-tag-box { display: flex; flex-direction: column; gap: 4px; }
  .cc-tag-box span { color: var(--cc-muted); font-size: 11px; font-weight: 600; }
  .cc-badge { display: inline-grid; place-items: center; min-width: 24px; height: 24px; padding: 0 6px; border-radius: 7px; background: #eef0f3; color: #4a5260; font-size: 12px; font-weight: 700; }
  .cc-string-row { display: flex; align-items: center; gap: 8px; }
  .cc-icon-btn { display: inline-grid; place-items: center; width: 32px; height: 32px; flex: 0 0 32px; border: 1px solid #d5d9df; border-radius: 8px; background: #fff; color: #4a5260; cursor: pointer; transition: background .15s ease, color .15s ease, border-color .15s ease; }
  .cc-icon-btn:hover:not(:disabled) { background: #f3f4f6; }
  .cc-icon-btn:disabled { opacity: .4; cursor: not-allowed; }
  .cc-icon-btn.is-danger { color: var(--cc-danger); border-color: #f1c9c4; }
  .cc-icon-btn.is-danger:hover:not(:disabled) { background: #fdecea; }
  .cc-item { border: 1px solid var(--cc-line); border-radius: 12px; background: #fff; transition: border-color .15s ease, box-shadow .15s ease; }
  .cc-item.is-open { border-color: #f6c7a6; box-shadow: 0 4px 16px rgba(255,145,77,.1); }
  .cc-item-bar { display: flex; align-items: center; gap: 8px; padding: 8px 10px; }
  .cc-item-toggle { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; padding: 4px; border: 0; background: transparent; color: inherit; text-align: left; cursor: pointer; }
  .cc-thumb { width: 44px; height: 34px; flex: 0 0 44px; overflow: hidden; border-radius: 6px; background: #eef0f3; }
  .cc-thumb img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .cc-item-title { flex: 1; min-width: 0; overflow: hidden; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
  .cc-chevron { display: inline-grid; color: #8a919c; transition: transform .2s ease; }
  .cc-chevron.is-open { transform: rotate(180deg); }
  .cc-item-actions { display: flex; gap: 6px; }
  .cc-item-body { padding: 6px 16px 18px; border-top: 1px dashed var(--cc-line); }
  .cc-item-body .cc-fields { margin-top: 12px; }
  .cc-image { display: flex; gap: 14px; align-items: flex-start; }
  .cc-image-preview { display: grid; place-items: center; width: 168px; height: 112px; flex: 0 0 168px; overflow: hidden; border: 1px solid var(--cc-line); border-radius: 10px; background: #f3f4f6 repeating-conic-gradient(#ececef 0% 25%, transparent 0% 50%) 50% / 16px 16px; color: #9aa1ab; font-size: 12px; }
  .cc-image-preview img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .cc-image-controls { display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 8px; }
  @media (max-width: 960px) {
    .cc-layout { grid-template-columns: 1fr; }
    .cc-nav { position: static; max-height: none; padding: 10px; }
    .cc-nav-group + .cc-nav-group { margin-top: 8px; padding-top: 8px; }
    .cc-nav-list { flex-direction: row; gap: 6px; overflow-x: auto; padding-bottom: 4px; }
    .cc-nav-item { width: auto; flex: 0 0 auto; white-space: nowrap; border: 1px solid var(--cc-line); }
    .cc-top { position: static; }
  }
  @media (max-width: 640px) {
    .cc-fields { grid-template-columns: 1fr; }
    .cc-panel-head { flex-wrap: wrap; padding: 16px; }
    .cc-panel-body { padding: 16px; }
    .cc-heading, .cc-image { flex-direction: column; }
    .cc-image-preview { width: 100%; flex-basis: auto; height: 160px; }
    .cc-top-actions .cc-btn { flex: 1; }
  }
`;
