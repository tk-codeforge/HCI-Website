// "use client";
// // Admin editors for the city-page sections (process, projects heading, blogs heading,
// // stats, why-choose, FAQs, live preview).
// // Put at: src/app/components/CityContentEditor.jsx
// import React, { useState } from "react";
// import {
//     FaAward, FaBed, FaBolt, FaBuilding, FaCalendarAlt, FaCheck, FaCheckCircle, FaClock, FaCouch,
//     FaDraftingCompass, FaGem, FaHandshake, FaHardHat, FaHeart, FaHome, FaLeaf, FaLightbulb,
//     FaMapMarkerAlt, FaMedal, FaPaintRoller, FaPhoneAlt, FaRulerCombined, FaRupeeSign, FaShieldAlt,
//     FaSmile, FaStar, FaThumbsUp, FaTools, FaTrophy, FaUser, FaUsers, FaWallet,
// } from "react-icons/fa";
// import { HEADING_TAG_OPTIONS, ICON_OPTIONS, MAX_ITEMS, parseVideoUrl } from "@/utils/cityContent";

// const ICONS = {
//     FaAward, FaBed, FaBolt, FaBuilding, FaCalendarAlt, FaCheck, FaCheckCircle, FaClock, FaCouch,
//     FaDraftingCompass, FaGem, FaHandshake, FaHardHat, FaHeart, FaHome, FaLeaf, FaLightbulb,
//     FaMapMarkerAlt, FaMedal, FaPaintRoller, FaPhoneAlt, FaRulerCombined, FaRupeeSign, FaShieldAlt,
//     FaSmile, FaStar, FaThumbsUp, FaTools, FaTrophy, FaUser, FaUsers, FaWallet,
// };

// const moveItem = (items, from, to) => {
//     if (to < 0 || to >= items.length) return items;
//     const next = [...items];
//     const [moved] = next.splice(from, 1);
//     next.splice(to, 0, moved);
//     return next;
// };

// /* ---------- small building blocks ---------- */

// const SectionCard = ({ title, subtitle, children }) => (
//     <div className="col-12">
//         <div className="card mb-3">
//             <div className="card-header bg-light">
//                 <strong>{title}</strong>
//                 {subtitle && <div className="small text-muted">{subtitle}</div>}
//             </div>
//             <div className="card-body">
//                 <div className="row">{children}</div>
//             </div>
//         </div>
//     </div>
// );

// const TagSelect = ({ value, onChange }) => (
//     <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
//         {HEADING_TAG_OPTIONS.map((tag) => (
//             <option key={tag} value={tag}>{tag.toUpperCase()}</option>
//         ))}
//     </select>
// );

// const HeadingFields = ({ label = "Heading", title, tag, onTitle, onTag, hint }) => (
//     <>
//         <div className="mb-3 col-md-9">
//             <label className="form-label">{label}</label>
//             <input className="form-control" value={title} maxLength={180} onChange={(event) => onTitle(event.target.value)} />
//             {hint && <small className="text-muted">{hint}</small>}
//         </div>
//         <div className="mb-3 col-md-3">
//             <label className="form-label">Heading Tag</label>
//             <TagSelect value={tag} onChange={onTag} />
//         </div>
//     </>
// );

// const IconPicker = ({ value, onChange }) => {
//     const Icon = ICONS[value];
//     const options = ICON_OPTIONS.includes(value) ? ICON_OPTIONS : [value, ...ICON_OPTIONS];
//     return (
//         <div className="d-flex align-items-center gap-2">
//             <span
//                 className="d-inline-flex align-items-center justify-content-center border rounded flex-shrink-0"
//                 style={{ width: 38, height: 38, color: "#ff914d", background: "#fff4ed" }}
//                 aria-hidden="true"
//             >
//                 {Icon ? <Icon /> : "?"}
//             </span>
//             <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
//                 {options.map((name) => (
//                     <option key={name} value={name}>{name.replace(/^Fa/, "")}</option>
//                 ))}
//             </select>
//         </div>
//     );
// };

// const ItemShell = ({ index, total, label, onMove, onRemove, canRemove, children }) => (
//     <div className="col-12">
//         <div className="border rounded p-3 mb-3">
//             <div className="d-flex align-items-center gap-2 mb-3">
//                 <span className="badge bg-secondary">{index + 1}</span>
//                 <strong className="flex-grow-1">{label}</strong>
//                 <button type="button" className="btn btn-sm btn-outline-secondary" disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label="Move up">↑</button>
//                 <button type="button" className="btn btn-sm btn-outline-secondary" disabled={index === total - 1} onClick={() => onMove(index, index + 1)} aria-label="Move down">↓</button>
//                 <button type="button" className="btn btn-sm btn-outline-danger" disabled={!canRemove} onClick={() => onRemove(index)}>Remove</button>
//             </div>
//             <div className="row">{children}</div>
//         </div>
//     </div>
// );

// const TAG_HINT = "The tag only changes the HTML heading level (SEO). The visual size on the page stays the same.";

// /* ---------- sections ---------- */

// export const ProcessEditor = ({ value, onChange }) => {
//     const set = (patch) => onChange("process", patch);
//     const setItem = (index, patch) => set({ items: value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
//     return (
//         <SectionCard title="Design Process" subtitle="The numbered steps card (Consultation, 3D Concept, …). Use {city} to insert the city name.">
//             <HeadingFields title={value.title} tag={value.titleTag} onTitle={(title) => set({ title })} onTag={(titleTag) => set({ titleTag })} hint={TAG_HINT} />
//             {value.items.map((item, index) => (
//                 <ItemShell
//                     key={index}
//                     index={index}
//                     total={value.items.length}
//                     label={item.title || `Step ${index + 1}`}
//                     canRemove={value.items.length > 1}
//                     onMove={(from, to) => set({ items: moveItem(value.items, from, to) })}
//                     onRemove={(i) => set({ items: value.items.filter((_, idx) => idx !== i) })}
//                 >
//                     <div className="mb-3 col-md-3"><label className="form-label">Icon</label><IconPicker value={item.iconName} onChange={(iconName) => setItem(index, { iconName })} /></div>
//                     <div className="mb-3 col-md-7"><label className="form-label">Step Heading</label><input className="form-control" maxLength={120} value={item.title} onChange={(event) => setItem(index, { title: event.target.value })} /></div>
//                     <div className="mb-3 col-md-2"><label className="form-label">Tag</label><TagSelect value={item.titleTag} onChange={(titleTag) => setItem(index, { titleTag })} /></div>
//                     <div className="mb-0 col-12"><label className="form-label">Text</label><textarea className="form-control" rows={2} maxLength={300} value={item.description} onChange={(event) => setItem(index, { description: event.target.value })} /></div>
//                 </ItemShell>
//             ))}
//             {value.items.length < MAX_ITEMS.process && (
//                 <div className="col-12">
//                     <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => set({ items: [...value.items, { iconName: "FaCheckCircle", title: "", titleTag: "h4", description: "" }] })}>+ Add Step</button>
//                 </div>
//             )}
//         </SectionCard>
//     );
// };

// export const ProjectsHeadingEditor = ({ value, onChange }) => (
//     <SectionCard title="Interior Projects" subtitle="Heading above the project photo grid. The photos themselves are uploaded below. Use {city} to insert the city name.">
//         <HeadingFields title={value.title} tag={value.titleTag} onTitle={(title) => onChange("projects", { title })} onTag={(titleTag) => onChange("projects", { titleTag })} hint={TAG_HINT} />
//     </SectionCard>
// );

// export const BlogsHeadingEditor = ({ value, onChange }) => (
//     <SectionCard title="Design Inspiration" subtitle="Heading above the blog cards. Choose the blogs below.">
//         <HeadingFields title={value.title} tag={value.titleTag} onTitle={(title) => onChange("blogs", { title })} onTag={(titleTag) => onChange("blogs", { titleTag })} hint={TAG_HINT} />
//     </SectionCard>
// );

// export const StatsEditor = ({ value, onChange }) => {
//     const set = (patch) => onChange("stats", patch);
//     const setItem = (index, patch) => set({ items: value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
//     return (
//         <SectionCard title="Stats Strip (icons with numbers)" subtitle="The row with icon, number and label (e.g. 2270+ Home Renovations).">
//             <div className="col-12 mb-3">
//                 <div className="form-check form-switch bg-light rounded border p-3 ps-5">
//                     <input className="form-check-input" type="checkbox" role="switch" id="cityStatsCustom" checked={value.useCustom} onChange={(event) => set({ useCustom: event.target.checked })} />
//                     <label className="form-check-label fw-bold" htmlFor="cityStatsCustom">Use custom stats for this city</label>
//                     <div className="small text-muted">Off = this city keeps using the global “Excellence Stats” from CMS Content. On = the items below are used.</div>
//                 </div>
//             </div>
//             <fieldset disabled={!value.useCustom} className="col-12" style={{ opacity: value.useCustom ? 1 : 0.55 }}>
//                 <div className="row">
//                     {value.items.map((item, index) => (
//                         <ItemShell
//                             key={index}
//                             index={index}
//                             total={value.items.length}
//                             label={item.label || item.value || `Stat ${index + 1}`}
//                             canRemove={value.items.length > 1}
//                             onMove={(from, to) => set({ items: moveItem(value.items, from, to) })}
//                             onRemove={(i) => set({ items: value.items.filter((_, idx) => idx !== i) })}
//                         >
//                             <div className="mb-3 col-md-3"><label className="form-label">Icon</label><IconPicker value={item.iconName} onChange={(iconName) => setItem(index, { iconName })} /></div>
//                             <div className="mb-3 col-md-4"><label className="form-label">Heading (number)</label><input className="form-control" maxLength={30} value={item.value} onChange={(event) => setItem(index, { value: event.target.value })} placeholder="2270+" /></div>
//                             <div className="mb-3 col-md-2"><label className="form-label">Tag</label><TagSelect value={item.valueTag} onChange={(valueTag) => setItem(index, { valueTag })} /></div>
//                             <div className="mb-0 col-md-12"><label className="form-label">Text</label><input className="form-control" maxLength={80} value={item.label} onChange={(event) => setItem(index, { label: event.target.value })} placeholder="HOME RENOVATIONS" /></div>
//                         </ItemShell>
//                     ))}
//                     {value.items.length < MAX_ITEMS.stats && (
//                         <div className="col-12">
//                             <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => set({ items: [...value.items, { iconName: "FaStar", value: "", valueTag: "h3", label: "" }] })}>+ Add Stat</button>
//                         </div>
//                     )}
//                 </div>
//             </fieldset>
//         </SectionCard>
//     );
// };

// export const WhyChooseEditor = ({ value, onChange }) => {
//     const set = (patch) => onChange("whyChoose", patch);
//     const setItem = (index, patch) => set({ items: value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
//     return (
//         <SectionCard title="Why Choose Us (icon cards)" subtitle="The “What makes us the best choice” heading and its cards.">
//             <HeadingFields title={value.title} tag={value.titleTag} onTitle={(title) => set({ title })} onTag={(titleTag) => set({ titleTag })} hint={TAG_HINT} />
//             {value.items.map((item, index) => (
//                 <ItemShell
//                     key={index}
//                     index={index}
//                     total={value.items.length}
//                     label={item.title || `Card ${index + 1}`}
//                     canRemove={value.items.length > 1}
//                     onMove={(from, to) => set({ items: moveItem(value.items, from, to) })}
//                     onRemove={(i) => set({ items: value.items.filter((_, idx) => idx !== i) })}
//                 >
//                     <div className="mb-3 col-md-3"><label className="form-label">Icon</label><IconPicker value={item.iconName} onChange={(iconName) => setItem(index, { iconName })} /></div>
//                     <div className="mb-3 col-md-7"><label className="form-label">Card Heading</label><input className="form-control" maxLength={80} value={item.title} onChange={(event) => setItem(index, { title: event.target.value })} /></div>
//                     <div className="mb-3 col-md-2"><label className="form-label">Tag</label><TagSelect value={item.titleTag} onChange={(titleTag) => setItem(index, { titleTag })} /></div>
//                     <div className="mb-0 col-12"><label className="form-label">Text</label><textarea className="form-control" rows={2} maxLength={200} value={item.description} onChange={(event) => setItem(index, { description: event.target.value })} /></div>
//                 </ItemShell>
//             ))}
//             {value.items.length < MAX_ITEMS.whyChoose && (
//                 <div className="col-12">
//                     <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => set({ items: [...value.items, { iconName: "FaCheckCircle", title: "", titleTag: "h4", description: "" }] })}>+ Add Card</button>
//                 </div>
//             )}
//         </SectionCard>
//     );
// };

// export const FaqsEditor = ({ value, onChange }) => {
//     const set = (patch) => onChange("faqs", patch);
//     const setItem = (index, patch) => set({ items: value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
//     return (
//         <div className="row">
//             <SectionCard title="FAQ Section" subtitle="Shown as an accordion. Use {city} to insert the city name. If there are no FAQs here, nothing changes on the page.">
//                 <HeadingFields label="FAQ Heading" title={value.title} tag={value.titleTag} onTitle={(title) => set({ title })} onTag={(titleTag) => set({ titleTag })} hint={TAG_HINT} />
//                 <div className="mb-3 col-md-4">
//                     <label className="form-label">Small label above heading</label>
//                     <input className="form-control" maxLength={40} value={value.eyebrow} onChange={(event) => set({ eyebrow: event.target.value })} placeholder="Good to know" />
//                     <small className="text-muted">Leave empty to hide.</small>
//                 </div>
//                 <div className="mb-3 col-md-8">
//                     <label className="form-label">Short intro text under heading</label>
//                     <input className="form-control" maxLength={200} value={value.intro} onChange={(event) => set({ intro: event.target.value })} placeholder="Here are a few useful details about designing with HC Interior." />
//                 </div>
//             </SectionCard>

//             <div className="col-12">
//                 <div className="d-flex align-items-center justify-content-between mb-2">
//                     <h6 className="mb-0">FAQ Items ({value.items.length})</h6>
//                     {value.items.length < MAX_ITEMS.faqs && (
//                         <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => set({ items: [...value.items, { question: "", answer: "" }] })}>+ Add FAQ</button>
//                     )}
//                 </div>
//                 {!value.items.length && <div className="alert alert-light border small">No items added yet.</div>}
//             </div>

//             {value.items.map((item, index) => (
//                 <ItemShell
//                     key={index}
//                     index={index}
//                     total={value.items.length}
//                     label={item.question || `FAQ ${index + 1}`}
//                     canRemove
//                     onMove={(from, to) => set({ items: moveItem(value.items, from, to) })}
//                     onRemove={(i) => set({ items: value.items.filter((_, idx) => idx !== i) })}
//                 >
//                     <div className="mb-3 col-12"><label className="form-label">Question</label><input className="form-control" maxLength={250} value={item.question} onChange={(event) => setItem(index, { question: event.target.value })} /></div>
//                     <div className="mb-0 col-12"><label className="form-label">Answer</label><textarea className="form-control" rows={3} maxLength={1500} value={item.answer} onChange={(event) => setItem(index, { answer: event.target.value })} /><small className="text-muted">Line breaks are kept.</small></div>
//                 </ItemShell>
//             ))}
//         </div>
//     );
// };

// export const LivePreviewPane = ({ src }) => {
//     const [reloadKey, setReloadKey] = useState(0);
//     if (!src) return <div className="alert alert-light border">Enter a City Type first.</div>;
//     return (
//         <div>
//             <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
//                 <span className="small text-muted me-auto">Shows the last <strong>saved</strong> version of the page. Save, then reload to see changes.</span>
//                 <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setReloadKey((key) => key + 1)}>Reload</button>
//                 <a className="btn btn-sm btn-outline-primary" href={src} target="_blank" rel="noopener noreferrer">Open in new tab</a>
//             </div>
//             <iframe key={reloadKey} src={src} title="City page preview" style={{ width: "100%", height: "70vh", border: "1px solid #dee2e6", borderRadius: 8 }} />
//         </div>
//     );
// };

// /* ================= Sidebar editors ================= */

// // settings = admin "citySettings" state, onChange(name, value) = updateCitySetting
// export const SiteVisitEditor = ({ settings, onChange }) => (
//     <SectionCard title="Sidebar: Book a Site Visit" subtitle="The dark call-to-action box at the top of the sidebar.">
//         <HeadingFields
//             label="Heading"
//             title={settings.siteVisitTitle}
//             tag={settings.siteVisitTitleTag}
//             onTitle={(value) => onChange("siteVisitTitle", value)}
//             onTag={(value) => onChange("siteVisitTitleTag", value)}
//             hint={TAG_HINT}
//         />
//         <div className="mb-3 col-md-8">
//             <label className="form-label">Description</label>
//             <input className="form-control" maxLength={220} value={settings.siteVisitDescription} onChange={(event) => onChange("siteVisitDescription", event.target.value)} />
//             <small className="text-muted">Use {"{city}"} to insert the city name.</small>
//         </div>
//         <div className="mb-3 col-md-4">
//             <label className="form-label">Button Text</label>
//             <input className="form-control" maxLength={60} value={settings.siteVisitButtonText} onChange={(event) => onChange("siteVisitButtonText", event.target.value)} />
//         </div>
//         <div className="mb-0 col-md-12">
//             <label className="form-label">Button Link</label>
//             <input className="form-control" value={settings.siteVisitButtonUrl} onChange={(event) => onChange("siteVisitButtonUrl", event.target.value)} placeholder="/contact" />
//         </div>
//     </SectionCard>
// );

// export const PromiseEditor = ({ settings, onChange }) => {
//     const items = settings.promiseItems;
//     const setItems = (next) => onChange("promiseItems", next);
//     const setItem = (index, patch) => setItems(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
//     return (
//         <SectionCard title="Sidebar: The Promise" subtitle="The checklist box under the enquiry form. Pick an icon for each line; add or remove lines as needed.">
//             <HeadingFields
//                 label="Section Heading"
//                 title={settings.promiseTitle}
//                 tag={settings.promiseTitleTag}
//                 onTitle={(value) => onChange("promiseTitle", value)}
//                 onTag={(value) => onChange("promiseTitleTag", value)}
//                 hint={TAG_HINT}
//             />
//             {items.map((item, index) => (
//                 <ItemShell
//                     key={index}
//                     index={index}
//                     total={items.length}
//                     label={item.title || `Promise ${index + 1}`}
//                     canRemove={items.length > 1}
//                     onMove={(from, to) => setItems(moveItem(items, from, to))}
//                     onRemove={(i) => setItems(items.filter((_, idx) => idx !== i))}
//                 >
//                     <div className="mb-3 col-md-4"><label className="form-label">Icon</label><IconPicker value={item.iconName} onChange={(iconName) => setItem(index, { iconName })} /></div>
//                     <div className="mb-3 col-md-8"><label className="form-label">Title</label><input className="form-control" maxLength={80} value={item.title} onChange={(event) => setItem(index, { title: event.target.value })} /></div>
//                     <div className="mb-0 col-12"><label className="form-label">Description</label><input className="form-control" maxLength={180} value={item.description} onChange={(event) => setItem(index, { description: event.target.value })} /></div>
//                 </ItemShell>
//             ))}
//             {items.length < MAX_ITEMS.promise && (
//                 <div className="col-12">
//                     <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setItems([...items, { iconName: "FaCheckCircle", title: "", description: "" }])}>+ Add Promise</button>
//                 </div>
//             )}
//         </SectionCard>
//     );
// };

// const isInternalPath = (value) => {
//     const v = String(value || "").trim();
//     return v.startsWith("/") && !v.startsWith("//");
// };
// const isImageRef = (value) => {
//     const v = String(value || "").trim();
//     return !v || /^https?:\/\//i.test(v) || isInternalPath(v);
// };

// /**
//  * Rows of text boxes with an "Add" button and a delete button per row.
//  * columns: [{ key, label, placeholder, flex, kind: "text" | "path" | "image", maxLength }]
//  */
// export const LinkRowsEditor = ({ title, subtitle, sectionTitle, onSectionTitle, rows, columns, onChange, addLabel, max, newRow, hint, twoUp = false }) => {
//     const update = (index, key, value) => onChange(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
//     const invalid = (column, value) => {
//         if (!String(value || "").trim()) return false;
//         if (column.kind === "path") return !isInternalPath(value);
//         if (column.kind === "image") return !isImageRef(value);
//         return false;
//     };
//     return (
//         <SectionCard title={title} subtitle={subtitle}>
//             <div className="mb-3 col-md-8">
//                 <label className="form-label">Section Heading</label>
//                 <input className="form-control" maxLength={80} value={sectionTitle} onChange={(event) => onSectionTitle(event.target.value)} />
//             </div>
//             <div className="mb-3 col-md-4 d-flex align-items-end justify-content-md-end">
//                 {rows.length < max && (
//                     <button type="button" className="btn btn-primary btn-sm" onClick={() => onChange([...rows, { ...newRow }])}>+ {addLabel}</button>
//                 )}
//             </div>
//             {!rows.length && <div className="col-12"><div className="alert alert-light border small mb-2">No rows. The page will fall back to its built-in default list.</div></div>}
//             {rows.map((row, index) => (
//                 <div className={twoUp ? "col-xl-6 mb-2" : "col-12 mb-2"} key={index}>
//                     <div className="d-flex gap-2 align-items-start">
//                         {columns.map((column) => (
//                             <div key={column.key} style={{ flex: column.flex || 1, minWidth: 0 }}>
//                                 <input
//                                     className={`form-control ${invalid(column, row[column.key]) ? "is-invalid" : ""}`}
//                                     value={row[column.key] || ""}
//                                     maxLength={column.maxLength || 300}
//                                     placeholder={column.placeholder}
//                                     aria-label={`${column.label} ${index + 1}`}
//                                     onChange={(event) => update(index, column.key, event.target.value)}
//                                 />
//                             </div>
//                         ))}
//                         <button type="button" className="btn btn-outline-danger flex-shrink-0" aria-label={`Delete row ${index + 1}`} title="Delete" onClick={() => onChange(rows.filter((_, i) => i !== index))}>🗑</button>
//                     </div>
//                 </div>
//             ))}
//             {hint && <div className="col-12"><small className="text-muted">{hint}</small></div>}
//         </SectionCard>
//     );
// };

// /* ================= Project photos & testimonial videos ================= */

// export const ProjectGalleryEditor = ({ items, onChange, onUpload }) => {
//     const [busy, setBusy] = useState(-1);
//     const setItem = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

//     const upload = async (index, key, file) => {
//         if (!file || !onUpload) return;
//         setBusy(index);
//         try {
//             const url = await onUpload(file);
//             if (url) setItem(index, { [key]: url });
//         } finally {
//             setBusy(-1);
//         }
//     };

//     const uploadButton = (index, field) => (
//         <label className={`btn btn-outline-secondary w-100 mb-0 ${busy === index ? "disabled" : ""}`}>
//             {busy === index ? "Uploading…" : "Upload"}
//             <input type="file" hidden accept="image/webp" onChange={(event) => { upload(index, field, event.target.files?.[0]); event.target.value = ""; }} />
//         </label>
//     );

//     return (
//         <SectionCard
//             title="More Project Photos & Testimonial Videos"
//             subtitle="Unlimited. These appear after the six fixed photos above, in this order. Click a photo to open it full size; click a video to play it in a popup."
//         >
//             <div className="col-12 mb-3 d-flex flex-wrap gap-2">
//                 {items.length < MAX_ITEMS.gallery && (
//                     <>
//                         <button type="button" className="btn btn-sm btn-primary" onClick={() => onChange([...items, { type: "image", src: "", alt: "", title: "", videoUrl: "", poster: "" }])}>+ Add Photo</button>
//                         <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onChange([...items, { type: "video", src: "", alt: "", title: "", videoUrl: "", poster: "" }])}>+ Add Testimonial Video</button>
//                     </>
//                 )}
//                 <span className="small text-muted align-self-center ms-auto">{items.length} extra item{items.length === 1 ? "" : "s"}</span>
//             </div>
//             {!items.length && <div className="col-12"><div className="alert alert-light border small">No extra items yet.</div></div>}
//             {items.map((item, index) => {
//                 const video = item.type === "video" ? parseVideoUrl(item.videoUrl) : null;
//                 const preview = item.type === "video" ? (item.poster || video?.poster || "") : item.src;
//                 return (
//                     <ItemShell
//                         key={index}
//                         index={index}
//                         total={items.length}
//                         label={`${item.type === "video" ? "🎬 Video" : "🖼 Photo"}${item.alt ? ` — ${item.alt}` : ""}`}
//                         canRemove
//                         onMove={(from, to) => onChange(moveItem(items, from, to))}
//                         onRemove={(i) => onChange(items.filter((_, idx) => idx !== i))}
//                     >
//                         {item.type === "video" ? (
//                             <>
//                                 <div className="mb-3 col-12">
//                                     <label className="form-label">Video link</label>
//                                     <input className={`form-control ${item.videoUrl && !video ? "is-invalid" : ""}`} maxLength={500} value={item.videoUrl} onChange={(event) => setItem(index, { videoUrl: event.target.value })} placeholder="https://www.youtube.com/watch?v=…  (YouTube, Vimeo or a direct .mp4 link)" />
//                                     {item.videoUrl && video && <small className="text-success">✓ {video.kind === "youtube" ? "YouTube" : video.kind === "vimeo" ? "Vimeo" : "Video file"} link recognised</small>}
//                                     {item.videoUrl && !video && <small className="text-danger">Not a supported link. Use a YouTube, Vimeo or direct .mp4/.webm link.</small>}
//                                 </div>
//                                 <div className="mb-3 col-md-9">
//                                     <label className="form-label">Thumbnail image URL (optional)</label>
//                                     <input className="form-control" maxLength={500} value={item.poster} onChange={(event) => setItem(index, { poster: event.target.value })} placeholder="Leave empty to use the YouTube thumbnail" />
//                                 </div>
//                                 <div className="mb-3 col-md-3"><label className="form-label">&nbsp;</label>{uploadButton(index, "poster")}</div>
//                             </>
//                         ) : (
//                             <>
//                                 <div className="mb-3 col-md-9">
//                                     <label className="form-label">Image URL</label>
//                                     <input className="form-control" maxLength={500} value={item.src} onChange={(event) => setItem(index, { src: event.target.value })} placeholder="Upload a .webp image or paste its URL" />
//                                 </div>
//                                 <div className="mb-3 col-md-3"><label className="form-label">&nbsp;</label>{uploadButton(index, "src")}</div>
//                             </>
//                         )}
//                         <div className="mb-0 col-md-6"><label className="form-label">Alt text (SEO / accessibility)</label><input className="form-control" maxLength={125} value={item.alt} onChange={(event) => setItem(index, { alt: event.target.value })} /></div>
//                         <div className="mb-0 col-md-4"><label className="form-label">Title (tooltip, optional)</label><input className="form-control" maxLength={120} value={item.title} onChange={(event) => setItem(index, { title: event.target.value })} /></div>
//                         <div className="mb-0 col-md-2 d-flex align-items-end">
//                             {preview && <img src={preview} alt="" style={{ width: "100%", maxHeight: 60, objectFit: "cover", borderRadius: 6, border: "1px solid #dee2e6" }} />}
//                         </div>
//                     </ItemShell>
//                 );
//             })}
//         </SectionCard>
//     );
// };



// "use client";
// // Admin editors for the city-page sections (process, projects heading, blogs heading,
// // stats, why-choose, FAQs, live preview).
// // Put at: src/app/components/CityContentEditor.jsx
// import React, { useState } from "react";
// import {
//     FaAward, FaBed, FaBolt, FaBuilding, FaCalendarAlt, FaCheck, FaCheckCircle, FaClock, FaCouch,
//     FaDraftingCompass, FaGem, FaHandshake, FaHardHat, FaHeart, FaHome, FaLeaf, FaLightbulb,
//     FaMapMarkerAlt, FaMedal, FaPaintRoller, FaPhoneAlt, FaRulerCombined, FaRupeeSign, FaShieldAlt,
//     FaSmile, FaStar, FaThumbsUp, FaTools, FaTrophy, FaUser, FaUsers, FaWallet,
// } from "react-icons/fa";
// import { HEADING_TAG_OPTIONS, ICON_OPTIONS, MAX_ITEMS, parseVideoUrl } from "@/utils/cityContent";

// const ICONS = {
//     FaAward, FaBed, FaBolt, FaBuilding, FaCalendarAlt, FaCheck, FaCheckCircle, FaClock, FaCouch,
//     FaDraftingCompass, FaGem, FaHandshake, FaHardHat, FaHeart, FaHome, FaLeaf, FaLightbulb,
//     FaMapMarkerAlt, FaMedal, FaPaintRoller, FaPhoneAlt, FaRulerCombined, FaRupeeSign, FaShieldAlt,
//     FaSmile, FaStar, FaThumbsUp, FaTools, FaTrophy, FaUser, FaUsers, FaWallet,
// };

// const moveItem = (items, from, to) => {
//     if (to < 0 || to >= items.length) return items;
//     const next = [...items];
//     const [moved] = next.splice(from, 1);
//     next.splice(to, 0, moved);
//     return next;
// };

// /* ---------- small building blocks ---------- */

// const SectionCard = ({ title, subtitle, children }) => (
//     <div className="col-12">
//         <div className="card mb-3">
//             <div className="card-header bg-light">
//                 <strong>{title}</strong>
//                 {subtitle && <div className="small text-muted">{subtitle}</div>}
//             </div>
//             <div className="card-body">
//                 <div className="row">{children}</div>
//             </div>
//         </div>
//     </div>
// );

// const TagSelect = ({ value, onChange }) => (
//     <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
//         {HEADING_TAG_OPTIONS.map((tag) => (
//             <option key={tag} value={tag}>{tag.toUpperCase()}</option>
//         ))}
//     </select>
// );

// const HeadingFields = ({ label = "Heading", title, tag, onTitle, onTag, hint }) => (
//     <>
//         <div className="mb-3 col-md-9">
//             <label className="form-label">{label}</label>
//             <input className="form-control" value={title} maxLength={180} onChange={(event) => onTitle(event.target.value)} />
//             {hint && <small className="text-muted">{hint}</small>}
//         </div>
//         <div className="mb-3 col-md-3">
//             <label className="form-label">Heading Tag</label>
//             <TagSelect value={tag} onChange={onTag} />
//         </div>
//     </>
// );

// const IconPicker = ({ value, onChange }) => {
//     const Icon = ICONS[value];
//     const options = ICON_OPTIONS.includes(value) ? ICON_OPTIONS : [value, ...ICON_OPTIONS];
//     return (
//         <div className="d-flex align-items-center gap-2">
//             <span
//                 className="d-inline-flex align-items-center justify-content-center border rounded flex-shrink-0"
//                 style={{ width: 38, height: 38, color: "#ff914d", background: "#fff4ed" }}
//                 aria-hidden="true"
//             >
//                 {Icon ? <Icon /> : "?"}
//             </span>
//             <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
//                 {options.map((name) => (
//                     <option key={name} value={name}>{name.replace(/^Fa/, "")}</option>
//                 ))}
//             </select>
//         </div>
//     );
// };

// const ItemShell = ({ index, total, label, onMove, onRemove, canRemove, children }) => (
//     <div className="col-12">
//         <div className="border rounded p-3 mb-3">
//             <div className="d-flex align-items-center gap-2 mb-3">
//                 <span className="badge bg-secondary">{index + 1}</span>
//                 <strong className="flex-grow-1">{label}</strong>
//                 <button type="button" className="btn btn-sm btn-outline-secondary" disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label="Move up">↑</button>
//                 <button type="button" className="btn btn-sm btn-outline-secondary" disabled={index === total - 1} onClick={() => onMove(index, index + 1)} aria-label="Move down">↓</button>
//                 <button type="button" className="btn btn-sm btn-outline-danger" disabled={!canRemove} onClick={() => onRemove(index)}>Remove</button>
//             </div>
//             <div className="row">{children}</div>
//         </div>
//     </div>
// );

// const TAG_HINT = "The tag only changes the HTML heading level (SEO). The visual size on the page stays the same.";

// /* ---------- sections ---------- */

// export const ProcessEditor = ({ value, onChange }) => {
//     const set = (patch) => onChange("process", patch);
//     const setItem = (index, patch) => set({ items: value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
//     return (
//         <SectionCard title="Design Process" subtitle="The numbered steps card (Consultation, 3D Concept, …). Use {city} to insert the city name.">
//             <HeadingFields title={value.title} tag={value.titleTag} onTitle={(title) => set({ title })} onTag={(titleTag) => set({ titleTag })} hint={TAG_HINT} />
//             {value.items.map((item, index) => (
//                 <ItemShell
//                     key={index}
//                     index={index}
//                     total={value.items.length}
//                     label={item.title || `Step ${index + 1}`}
//                     canRemove={value.items.length > 1}
//                     onMove={(from, to) => set({ items: moveItem(value.items, from, to) })}
//                     onRemove={(i) => set({ items: value.items.filter((_, idx) => idx !== i) })}
//                 >
//                     <div className="mb-3 col-md-3"><label className="form-label">Icon</label><IconPicker value={item.iconName} onChange={(iconName) => setItem(index, { iconName })} /></div>
//                     <div className="mb-3 col-md-7"><label className="form-label">Step Heading</label><input className="form-control" maxLength={120} value={item.title} onChange={(event) => setItem(index, { title: event.target.value })} /></div>
//                     <div className="mb-3 col-md-2"><label className="form-label">Tag</label><TagSelect value={item.titleTag} onChange={(titleTag) => setItem(index, { titleTag })} /></div>
//                     <div className="mb-0 col-12"><label className="form-label">Text</label><textarea className="form-control" rows={2} maxLength={300} value={item.description} onChange={(event) => setItem(index, { description: event.target.value })} /></div>
//                 </ItemShell>
//             ))}
//             {value.items.length < MAX_ITEMS.process && (
//                 <div className="col-12">
//                     <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => set({ items: [...value.items, { iconName: "FaCheckCircle", title: "", titleTag: "h4", description: "" }] })}>+ Add Step</button>
//                 </div>
//             )}
//         </SectionCard>
//     );
// };

// export const ProjectsHeadingEditor = ({ value, onChange }) => (
//     <SectionCard title="Interior Projects" subtitle="Heading above the project photo grid. The photos and videos themselves are added below. Use {city} to insert the city name.">
//         <HeadingFields title={value.title} tag={value.titleTag} onTitle={(title) => onChange("projects", { title })} onTag={(titleTag) => onChange("projects", { titleTag })} hint={TAG_HINT} />
//     </SectionCard>
// );

// export const BlogsHeadingEditor = ({ value, onChange }) => (
//     <SectionCard title="Design Inspiration" subtitle="Heading above the blog cards. Choose the blogs below.">
//         <HeadingFields title={value.title} tag={value.titleTag} onTitle={(title) => onChange("blogs", { title })} onTag={(titleTag) => onChange("blogs", { titleTag })} hint={TAG_HINT} />
//     </SectionCard>
// );

// export const StatsEditor = ({ value, onChange }) => {
//     const set = (patch) => onChange("stats", patch);
//     const setItem = (index, patch) => set({ items: value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
//     return (
//         <SectionCard title="Stats Strip (icons with numbers)" subtitle="The row with icon, number and label (e.g. 2270+ Home Renovations).">
//             <div className="col-12 mb-3">
//                 <div className="form-check form-switch bg-light rounded border p-3 ps-5">
//                     <input className="form-check-input" type="checkbox" role="switch" id="cityStatsCustom" checked={value.useCustom} onChange={(event) => set({ useCustom: event.target.checked })} />
//                     <label className="form-check-label fw-bold" htmlFor="cityStatsCustom">Use custom stats for this city</label>
//                     <div className="small text-muted">Off = this city keeps using the global “Excellence Stats” from CMS Content. On = the items below are used.</div>
//                 </div>
//             </div>
//             <fieldset disabled={!value.useCustom} className="col-12" style={{ opacity: value.useCustom ? 1 : 0.55 }}>
//                 <div className="row">
//                     {value.items.map((item, index) => (
//                         <ItemShell
//                             key={index}
//                             index={index}
//                             total={value.items.length}
//                             label={item.label || item.value || `Stat ${index + 1}`}
//                             canRemove={value.items.length > 1}
//                             onMove={(from, to) => set({ items: moveItem(value.items, from, to) })}
//                             onRemove={(i) => set({ items: value.items.filter((_, idx) => idx !== i) })}
//                         >
//                             <div className="mb-3 col-md-3"><label className="form-label">Icon</label><IconPicker value={item.iconName} onChange={(iconName) => setItem(index, { iconName })} /></div>
//                             <div className="mb-3 col-md-4"><label className="form-label">Heading (number)</label><input className="form-control" maxLength={30} value={item.value} onChange={(event) => setItem(index, { value: event.target.value })} placeholder="2270+" /></div>
//                             <div className="mb-3 col-md-2"><label className="form-label">Tag</label><TagSelect value={item.valueTag} onChange={(valueTag) => setItem(index, { valueTag })} /></div>
//                             <div className="mb-0 col-md-12"><label className="form-label">Text</label><input className="form-control" maxLength={80} value={item.label} onChange={(event) => setItem(index, { label: event.target.value })} placeholder="HOME RENOVATIONS" /></div>
//                         </ItemShell>
//                     ))}
//                     {value.items.length < MAX_ITEMS.stats && (
//                         <div className="col-12">
//                             <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => set({ items: [...value.items, { iconName: "FaStar", value: "", valueTag: "h3", label: "" }] })}>+ Add Stat</button>
//                         </div>
//                     )}
//                 </div>
//             </fieldset>
//         </SectionCard>
//     );
// };

// export const WhyChooseEditor = ({ value, onChange }) => {
//     const set = (patch) => onChange("whyChoose", patch);
//     const setItem = (index, patch) => set({ items: value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
//     return (
//         <SectionCard title="Why Choose Us (icon cards)" subtitle="The “What makes us the best choice” heading and its cards.">
//             <HeadingFields title={value.title} tag={value.titleTag} onTitle={(title) => set({ title })} onTag={(titleTag) => set({ titleTag })} hint={TAG_HINT} />
//             {value.items.map((item, index) => (
//                 <ItemShell
//                     key={index}
//                     index={index}
//                     total={value.items.length}
//                     label={item.title || `Card ${index + 1}`}
//                     canRemove={value.items.length > 1}
//                     onMove={(from, to) => set({ items: moveItem(value.items, from, to) })}
//                     onRemove={(i) => set({ items: value.items.filter((_, idx) => idx !== i) })}
//                 >
//                     <div className="mb-3 col-md-3"><label className="form-label">Icon</label><IconPicker value={item.iconName} onChange={(iconName) => setItem(index, { iconName })} /></div>
//                     <div className="mb-3 col-md-7"><label className="form-label">Card Heading</label><input className="form-control" maxLength={80} value={item.title} onChange={(event) => setItem(index, { title: event.target.value })} /></div>
//                     <div className="mb-3 col-md-2"><label className="form-label">Tag</label><TagSelect value={item.titleTag} onChange={(titleTag) => setItem(index, { titleTag })} /></div>
//                     <div className="mb-0 col-12"><label className="form-label">Text</label><textarea className="form-control" rows={2} maxLength={200} value={item.description} onChange={(event) => setItem(index, { description: event.target.value })} /></div>
//                 </ItemShell>
//             ))}
//             {value.items.length < MAX_ITEMS.whyChoose && (
//                 <div className="col-12">
//                     <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => set({ items: [...value.items, { iconName: "FaCheckCircle", title: "", titleTag: "h4", description: "" }] })}>+ Add Card</button>
//                 </div>
//             )}
//         </SectionCard>
//     );
// };

// export const FaqsEditor = ({ value, onChange }) => {
//     const set = (patch) => onChange("faqs", patch);
//     const setItem = (index, patch) => set({ items: value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
//     return (
//         <div className="row">
//             <SectionCard title="FAQ Section" subtitle="Shown as an accordion. Use {city} to insert the city name. If there are no FAQs here, nothing changes on the page.">
//                 <HeadingFields label="FAQ Heading" title={value.title} tag={value.titleTag} onTitle={(title) => set({ title })} onTag={(titleTag) => set({ titleTag })} hint={TAG_HINT} />
//                 <div className="mb-3 col-md-4">
//                     <label className="form-label">Small label above heading</label>
//                     <input className="form-control" maxLength={40} value={value.eyebrow} onChange={(event) => set({ eyebrow: event.target.value })} placeholder="Good to know" />
//                     <small className="text-muted">Leave empty to hide.</small>
//                 </div>
//                 <div className="mb-3 col-md-8">
//                     <label className="form-label">Short intro text under heading</label>
//                     <input className="form-control" maxLength={200} value={value.intro} onChange={(event) => set({ intro: event.target.value })} placeholder="Here are a few useful details about designing with HC Interior." />
//                 </div>
//             </SectionCard>

//             <div className="col-12">
//                 <div className="d-flex align-items-center justify-content-between mb-2">
//                     <h6 className="mb-0">FAQ Items ({value.items.length})</h6>
//                     {value.items.length < MAX_ITEMS.faqs && (
//                         <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => set({ items: [...value.items, { question: "", answer: "" }] })}>+ Add FAQ</button>
//                     )}
//                 </div>
//                 {!value.items.length && <div className="alert alert-light border small">No items added yet.</div>}
//             </div>

//             {value.items.map((item, index) => (
//                 <ItemShell
//                     key={index}
//                     index={index}
//                     total={value.items.length}
//                     label={item.question || `FAQ ${index + 1}`}
//                     canRemove
//                     onMove={(from, to) => set({ items: moveItem(value.items, from, to) })}
//                     onRemove={(i) => set({ items: value.items.filter((_, idx) => idx !== i) })}
//                 >
//                     <div className="mb-3 col-12"><label className="form-label">Question</label><input className="form-control" maxLength={250} value={item.question} onChange={(event) => setItem(index, { question: event.target.value })} /></div>
//                     <div className="mb-0 col-12"><label className="form-label">Answer</label><textarea className="form-control" rows={3} maxLength={1500} value={item.answer} onChange={(event) => setItem(index, { answer: event.target.value })} /><small className="text-muted">Line breaks are kept.</small></div>
//                 </ItemShell>
//             ))}
//         </div>
//     );
// };

// export const LivePreviewPane = ({ src }) => {
//     const [reloadKey, setReloadKey] = useState(0);
//     if (!src) return <div className="alert alert-light border">Enter a City Type first.</div>;
//     return (
//         <div>
//             <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
//                 <span className="small text-muted me-auto">Shows the last <strong>saved</strong> version of the page. Save, then reload to see changes.</span>
//                 <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setReloadKey((key) => key + 1)}>Reload</button>
//                 <a className="btn btn-sm btn-outline-primary" href={src} target="_blank" rel="noopener noreferrer">Open in new tab</a>
//             </div>
//             <iframe key={reloadKey} src={src} title="City page preview" style={{ width: "100%", height: "70vh", border: "1px solid #dee2e6", borderRadius: 8 }} />
//         </div>
//     );
// };

// /* ================= Sidebar editors ================= */

// // settings = admin "citySettings" state, onChange(name, value) = updateCitySetting
// export const SiteVisitEditor = ({ settings, onChange }) => (
//     <SectionCard title="Sidebar: Book a Site Visit" subtitle="The dark call-to-action box at the top of the sidebar.">
//         <HeadingFields
//             label="Heading"
//             title={settings.siteVisitTitle}
//             tag={settings.siteVisitTitleTag}
//             onTitle={(value) => onChange("siteVisitTitle", value)}
//             onTag={(value) => onChange("siteVisitTitleTag", value)}
//             hint={TAG_HINT}
//         />
//         <div className="mb-3 col-md-8">
//             <label className="form-label">Description</label>
//             <input className="form-control" maxLength={220} value={settings.siteVisitDescription} onChange={(event) => onChange("siteVisitDescription", event.target.value)} />
//             <small className="text-muted">Use {"{city}"} to insert the city name.</small>
//         </div>
//         <div className="mb-3 col-md-4">
//             <label className="form-label">Button Text</label>
//             <input className="form-control" maxLength={60} value={settings.siteVisitButtonText} onChange={(event) => onChange("siteVisitButtonText", event.target.value)} />
//         </div>
//         <div className="mb-0 col-md-12">
//             <label className="form-label">Button Link</label>
//             <input className="form-control" value={settings.siteVisitButtonUrl} onChange={(event) => onChange("siteVisitButtonUrl", event.target.value)} placeholder="/contact" />
//         </div>
//     </SectionCard>
// );

// export const PromiseEditor = ({ settings, onChange }) => {
//     const items = settings.promiseItems;
//     const setItems = (next) => onChange("promiseItems", next);
//     const setItem = (index, patch) => setItems(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
//     return (
//         <SectionCard title="Sidebar: The Promise" subtitle="The checklist box under the enquiry form. Pick an icon for each line; add or remove lines as needed.">
//             <HeadingFields
//                 label="Section Heading"
//                 title={settings.promiseTitle}
//                 tag={settings.promiseTitleTag}
//                 onTitle={(value) => onChange("promiseTitle", value)}
//                 onTag={(value) => onChange("promiseTitleTag", value)}
//                 hint={TAG_HINT}
//             />
//             {items.map((item, index) => (
//                 <ItemShell
//                     key={index}
//                     index={index}
//                     total={items.length}
//                     label={item.title || `Promise ${index + 1}`}
//                     canRemove={items.length > 1}
//                     onMove={(from, to) => setItems(moveItem(items, from, to))}
//                     onRemove={(i) => setItems(items.filter((_, idx) => idx !== i))}
//                 >
//                     <div className="mb-3 col-md-4"><label className="form-label">Icon</label><IconPicker value={item.iconName} onChange={(iconName) => setItem(index, { iconName })} /></div>
//                     <div className="mb-3 col-md-8"><label className="form-label">Title</label><input className="form-control" maxLength={80} value={item.title} onChange={(event) => setItem(index, { title: event.target.value })} /></div>
//                     <div className="mb-0 col-12"><label className="form-label">Description</label><input className="form-control" maxLength={180} value={item.description} onChange={(event) => setItem(index, { description: event.target.value })} /></div>
//                 </ItemShell>
//             ))}
//             {items.length < MAX_ITEMS.promise && (
//                 <div className="col-12">
//                     <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setItems([...items, { iconName: "FaCheckCircle", title: "", description: "" }])}>+ Add Promise</button>
//                 </div>
//             )}
//         </SectionCard>
//     );
// };

// const isInternalPath = (value) => {
//     const v = String(value || "").trim();
//     return v.startsWith("/") && !v.startsWith("//");
// };
// const isImageRef = (value) => {
//     const v = String(value || "").trim();
//     return !v || /^https?:\/\//i.test(v) || isInternalPath(v);
// };

// /**
//  * Rows of text boxes with an "Add" button and a delete button per row.
//  * columns: [{ key, label, placeholder, flex, kind: "text" | "path" | "image", maxLength }]
//  */
// export const LinkRowsEditor = ({ title, subtitle, sectionTitle, onSectionTitle, rows, columns, onChange, addLabel, max, newRow, hint, twoUp = false }) => {
//     const update = (index, key, value) => onChange(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
//     const invalid = (column, value) => {
//         if (!String(value || "").trim()) return false;
//         if (column.kind === "path") return !isInternalPath(value);
//         if (column.kind === "image") return !isImageRef(value);
//         return false;
//     };
//     return (
//         <SectionCard title={title} subtitle={subtitle}>
//             <div className="mb-3 col-md-8">
//                 <label className="form-label">Section Heading</label>
//                 <input className="form-control" maxLength={80} value={sectionTitle} onChange={(event) => onSectionTitle(event.target.value)} />
//             </div>
//             <div className="mb-3 col-md-4 d-flex align-items-end justify-content-md-end">
//                 {rows.length < max && (
//                     <button type="button" className="btn btn-primary btn-sm" onClick={() => onChange([...rows, { ...newRow }])}>+ {addLabel}</button>
//                 )}
//             </div>
//             {!rows.length && <div className="col-12"><div className="alert alert-light border small mb-2">No rows. The page will fall back to its built-in default list.</div></div>}
//             {rows.map((row, index) => (
//                 <div className={twoUp ? "col-xl-6 mb-2" : "col-12 mb-2"} key={index}>
//                     <div className="d-flex gap-2 align-items-start">
//                         {columns.map((column) => (
//                             <div key={column.key} style={{ flex: column.flex || 1, minWidth: 0 }}>
//                                 <input
//                                     className={`form-control ${invalid(column, row[column.key]) ? "is-invalid" : ""}`}
//                                     value={row[column.key] || ""}
//                                     maxLength={column.maxLength || 300}
//                                     placeholder={column.placeholder}
//                                     aria-label={`${column.label} ${index + 1}`}
//                                     onChange={(event) => update(index, column.key, event.target.value)}
//                                 />
//                             </div>
//                         ))}
//                         <button type="button" className="btn btn-outline-danger flex-shrink-0" aria-label={`Delete row ${index + 1}`} title="Delete" onClick={() => onChange(rows.filter((_, i) => i !== index))}>🗑</button>
//                     </div>
//                 </div>
//             ))}
//             {hint && <div className="col-12"><small className="text-muted">{hint}</small></div>}
//         </SectionCard>
//     );
// };

// /* ================= Project photos & testimonial videos ================= */

// export const ProjectGalleryEditor = ({ items, onChange, onUpload }) => {
//     const [busy, setBusy] = useState(-1);
//     const setItem = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

//     const upload = async (index, key, file) => {
//         if (!file || !onUpload) return;
//         setBusy(index);
//         try {
//             const url = await onUpload(file);
//             if (url) setItem(index, { [key]: url });
//         } finally {
//             setBusy(-1);
//         }
//     };

//     const uploadButton = (index, field) => (
//         <label className={`btn btn-outline-secondary w-100 mb-0 ${busy === index ? "disabled" : ""}`}>
//             {busy === index ? "Uploading…" : "Upload"}
//             <input type="file" hidden accept="image/webp" onChange={(event) => { upload(index, field, event.target.files?.[0]); event.target.value = ""; }} />
//         </label>
//     );

//     return (
//         <SectionCard
//             title="More Project Photos & Testimonial Videos"
//             subtitle="Unlimited. These appear after the six fixed photos above, in this order. Click a photo to open it full size; click a video to play it in a popup."
//         >
//             <div className="col-12 mb-3 d-flex flex-wrap gap-2">
//                 {items.length < MAX_ITEMS.gallery && (
//                     <>
//                         <button type="button" className="btn btn-sm btn-primary" onClick={() => onChange([...items, { type: "image", src: "", alt: "", title: "", videoUrl: "", poster: "" }])}>+ Add Photo</button>
//                         <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onChange([...items, { type: "video", src: "", alt: "", title: "", videoUrl: "", poster: "" }])}>+ Add Testimonial Video</button>
//                     </>
//                 )}
//                 <span className="small text-muted align-self-center ms-auto">{items.length} extra item{items.length === 1 ? "" : "s"}</span>
//             </div>
//             {!items.length && <div className="col-12"><div className="alert alert-light border small">No extra items yet.</div></div>}
//             {items.map((item, index) => {
//                 const video = item.type === "video" ? parseVideoUrl(item.videoUrl) : null;
//                 const preview = item.type === "video" ? (item.poster || video?.poster || "") : item.src;
//                 return (
//                     <ItemShell
//                         key={index}
//                         index={index}
//                         total={items.length}
//                         label={`${item.type === "video" ? "🎬 Video" : "🖼 Photo"}${item.alt ? ` — ${item.alt}` : ""}`}
//                         canRemove
//                         onMove={(from, to) => onChange(moveItem(items, from, to))}
//                         onRemove={(i) => onChange(items.filter((_, idx) => idx !== i))}
//                     >
//                         {item.type === "video" ? (
//                             <>
//                                 <div className="mb-3 col-12">
//                                     <label className="form-label">Video link</label>
//                                     <input className={`form-control ${item.videoUrl && !video ? "is-invalid" : ""}`} maxLength={500} value={item.videoUrl} onChange={(event) => setItem(index, { videoUrl: event.target.value })} placeholder="https://www.youtube.com/watch?v=…  (YouTube, Vimeo or a direct .mp4 link)" />
//                                     {item.videoUrl && video && <small className="text-success">✓ {video.kind === "youtube" ? "YouTube" : video.kind === "vimeo" ? "Vimeo" : "Video file"} link recognised</small>}
//                                     {item.videoUrl && !video && <small className="text-danger">Not a supported link. Use a YouTube, Vimeo or direct .mp4/.webm link.</small>}
//                                 </div>
//                                 <div className="mb-3 col-md-9">
//                                     <label className="form-label">Thumbnail image URL (optional)</label>
//                                     <input className="form-control" maxLength={500} value={item.poster} onChange={(event) => setItem(index, { poster: event.target.value })} placeholder="Leave empty to use the YouTube thumbnail" />
//                                 </div>
//                                 <div className="mb-3 col-md-3"><label className="form-label">&nbsp;</label>{uploadButton(index, "poster")}</div>
//                             </>
//                         ) : (
//                             <>
//                                 <div className="mb-3 col-md-9">
//                                     <label className="form-label">Image URL</label>
//                                     <input className="form-control" maxLength={500} value={item.src} onChange={(event) => setItem(index, { src: event.target.value })} placeholder="Upload a .webp image or paste its URL" />
//                                 </div>
//                                 <div className="mb-3 col-md-3"><label className="form-label">&nbsp;</label>{uploadButton(index, "src")}</div>
//                             </>
//                         )}
//                         <div className="mb-0 col-md-6"><label className="form-label">Alt text (SEO / accessibility)</label><input className="form-control" maxLength={125} value={item.alt} onChange={(event) => setItem(index, { alt: event.target.value })} /></div>
//                         <div className="mb-0 col-md-4"><label className="form-label">Title (tooltip, optional)</label><input className="form-control" maxLength={120} value={item.title} onChange={(event) => setItem(index, { title: event.target.value })} /></div>
//                         <div className="mb-0 col-md-2 d-flex align-items-end">
//                             {preview && <img src={preview} alt="" style={{ width: "100%", maxHeight: 60, objectFit: "cover", borderRadius: 6, border: "1px solid #dee2e6" }} />}
//                         </div>
//                     </ItemShell>
//                 );
//             })}
//         </SectionCard>
//     );
// };



"use client";
// Admin editors for the city-page sections (process, projects heading, blogs heading,
// stats, why-choose, FAQs, live preview).
// Put at: src/app/components/CityContentEditor.jsx
import React, { useState } from "react";
import {
    FaAward, FaBed, FaBolt, FaBuilding, FaCalendarAlt, FaCheck, FaCheckCircle, FaClock, FaCouch,
    FaDraftingCompass, FaGem, FaHandshake, FaHardHat, FaHeart, FaHome, FaLeaf, FaLightbulb,
    FaMapMarkerAlt, FaMedal, FaPaintRoller, FaPhoneAlt, FaRulerCombined, FaRupeeSign, FaShieldAlt,
    FaSmile, FaStar, FaThumbsUp, FaTools, FaTrophy, FaUser, FaUsers, FaWallet,
} from "react-icons/fa";
import { HEADING_TAG_OPTIONS, ICON_OPTIONS, MAX_ITEMS, parseVideoUrl } from "@/utils/cityContent";

const ICONS = {
    FaAward, FaBed, FaBolt, FaBuilding, FaCalendarAlt, FaCheck, FaCheckCircle, FaClock, FaCouch,
    FaDraftingCompass, FaGem, FaHandshake, FaHardHat, FaHeart, FaHome, FaLeaf, FaLightbulb,
    FaMapMarkerAlt, FaMedal, FaPaintRoller, FaPhoneAlt, FaRulerCombined, FaRupeeSign, FaShieldAlt,
    FaSmile, FaStar, FaThumbsUp, FaTools, FaTrophy, FaUser, FaUsers, FaWallet,
};

const moveItem = (items, from, to) => {
    if (to < 0 || to >= items.length) return items;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
};

/* ---------- small building blocks ---------- */

const SectionCard = ({ title, subtitle, children }) => (
    <div className="col-12">
        <div className="card mb-3">
            <div className="card-header bg-light">
                <strong>{title}</strong>
                {subtitle && <div className="small text-muted">{subtitle}</div>}
            </div>
            <div className="card-body">
                <div className="row">{children}</div>
            </div>
        </div>
    </div>
);

const TagSelect = ({ value, onChange }) => (
    <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
        {HEADING_TAG_OPTIONS.map((tag) => (
            <option key={tag} value={tag}>{tag.toUpperCase()}</option>
        ))}
    </select>
);

const HeadingFields = ({ label = "Heading", title, tag, onTitle, onTag, hint }) => (
    <>
        <div className="mb-3 col-md-9">
            <label className="form-label">{label}</label>
            <input className="form-control" value={title} maxLength={180} onChange={(event) => onTitle(event.target.value)} />
            {hint && <small className="text-muted">{hint}</small>}
        </div>
        <div className="mb-3 col-md-3">
            <label className="form-label">Heading Tag</label>
            <TagSelect value={tag} onChange={onTag} />
        </div>
    </>
);

const IconPicker = ({ value, onChange }) => {
    const Icon = ICONS[value];
    const options = ICON_OPTIONS.includes(value) ? ICON_OPTIONS : [value, ...ICON_OPTIONS];
    return (
        <div className="d-flex align-items-center gap-2">
            <span
                className="d-inline-flex align-items-center justify-content-center border rounded flex-shrink-0"
                style={{ width: 38, height: 38, color: "#ff914d", background: "#fff4ed" }}
                aria-hidden="true"
            >
                {Icon ? <Icon /> : "?"}
            </span>
            <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
                {options.map((name) => (
                    <option key={name} value={name}>{name.replace(/^Fa/, "")}</option>
                ))}
            </select>
        </div>
    );
};

const ItemShell = ({ index, total, label, onMove, onRemove, canRemove, children }) => (
    <div className="col-12">
        <div className="border rounded p-3 mb-3">
            <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-secondary">{index + 1}</span>
                <strong className="flex-grow-1">{label}</strong>
                <button type="button" className="btn btn-sm btn-outline-secondary" disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label="Move up">↑</button>
                <button type="button" className="btn btn-sm btn-outline-secondary" disabled={index === total - 1} onClick={() => onMove(index, index + 1)} aria-label="Move down">↓</button>
                <button type="button" className="btn btn-sm btn-outline-danger" disabled={!canRemove} onClick={() => onRemove(index)}>Remove</button>
            </div>
            <div className="row">{children}</div>
        </div>
    </div>
);

const TAG_HINT = "The tag only changes the HTML heading level (SEO). The visual size on the page stays the same.";

/* ---------- sections ---------- */

export const ProcessEditor = ({ value, onChange }) => {
    const set = (patch) => onChange("process", patch);
    const setItem = (index, patch) => set({ items: value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
    return (
        <SectionCard title="Design Process" subtitle="The numbered steps card (Consultation, 3D Concept, …). Use {city} to insert the city name.">
            <HeadingFields title={value.title} tag={value.titleTag} onTitle={(title) => set({ title })} onTag={(titleTag) => set({ titleTag })} hint={TAG_HINT} />
            {value.items.map((item, index) => (
                <ItemShell
                    key={index}
                    index={index}
                    total={value.items.length}
                    label={item.title || `Step ${index + 1}`}
                    canRemove={value.items.length > 1}
                    onMove={(from, to) => set({ items: moveItem(value.items, from, to) })}
                    onRemove={(i) => set({ items: value.items.filter((_, idx) => idx !== i) })}
                >
                    <div className="mb-3 col-md-3"><label className="form-label">Icon</label><IconPicker value={item.iconName} onChange={(iconName) => setItem(index, { iconName })} /></div>
                    <div className="mb-3 col-md-7"><label className="form-label">Step Heading</label><input className="form-control" maxLength={120} value={item.title} onChange={(event) => setItem(index, { title: event.target.value })} /></div>
                    <div className="mb-3 col-md-2"><label className="form-label">Tag</label><TagSelect value={item.titleTag} onChange={(titleTag) => setItem(index, { titleTag })} /></div>
                    <div className="mb-0 col-12"><label className="form-label">Text</label><textarea className="form-control" rows={2} maxLength={300} value={item.description} onChange={(event) => setItem(index, { description: event.target.value })} /></div>
                </ItemShell>
            ))}
            {value.items.length < MAX_ITEMS.process && (
                <div className="col-12">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => set({ items: [...value.items, { iconName: "FaCheckCircle", title: "", titleTag: "h4", description: "" }] })}>+ Add Step</button>
                </div>
            )}
        </SectionCard>
    );
};

export const ProjectsHeadingEditor = ({ value, onChange }) => (
    <SectionCard title="Interior Projects" subtitle="Heading above the project photo grid. The photos and videos themselves are added below. Use {city} to insert the city name.">
        <HeadingFields title={value.title} tag={value.titleTag} onTitle={(title) => onChange("projects", { title })} onTag={(titleTag) => onChange("projects", { titleTag })} hint={TAG_HINT} />
    </SectionCard>
);

export const BlogsHeadingEditor = ({ value, onChange }) => (
    <SectionCard title="Design Inspiration" subtitle="Heading above the blog cards. Choose the blogs below.">
        <HeadingFields title={value.title} tag={value.titleTag} onTitle={(title) => onChange("blogs", { title })} onTag={(titleTag) => onChange("blogs", { titleTag })} hint={TAG_HINT} />
    </SectionCard>
);

export const StatsEditor = ({ value, onChange }) => {
    const set = (patch) => onChange("stats", patch);
    const setItem = (index, patch) => set({ items: value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
    return (
        <SectionCard title="Stats Strip (icons with numbers)" subtitle="The row with icon, number and label (e.g. 2270+ Home Renovations).">
            <div className="col-12 mb-3">
                <div className="form-check form-switch bg-light rounded border p-3 ps-5">
                    <input className="form-check-input" type="checkbox" role="switch" id="cityStatsCustom" checked={value.useCustom} onChange={(event) => set({ useCustom: event.target.checked })} />
                    <label className="form-check-label fw-bold" htmlFor="cityStatsCustom">Use custom stats for this city</label>
                    <div className="small text-muted">Off = this city keeps using the global “Excellence Stats” from CMS Content. On = the items below are used.</div>
                </div>
            </div>
            <fieldset disabled={!value.useCustom} className="col-12" style={{ opacity: value.useCustom ? 1 : 0.55 }}>
                <div className="row">
                    {value.items.map((item, index) => (
                        <ItemShell
                            key={index}
                            index={index}
                            total={value.items.length}
                            label={item.label || item.value || `Stat ${index + 1}`}
                            canRemove={value.items.length > 1}
                            onMove={(from, to) => set({ items: moveItem(value.items, from, to) })}
                            onRemove={(i) => set({ items: value.items.filter((_, idx) => idx !== i) })}
                        >
                            <div className="mb-3 col-md-3"><label className="form-label">Icon</label><IconPicker value={item.iconName} onChange={(iconName) => setItem(index, { iconName })} /></div>
                            <div className="mb-3 col-md-4"><label className="form-label">Heading (number)</label><input className="form-control" maxLength={30} value={item.value} onChange={(event) => setItem(index, { value: event.target.value })} placeholder="2270+" /></div>
                            <div className="mb-3 col-md-2"><label className="form-label">Tag</label><TagSelect value={item.valueTag} onChange={(valueTag) => setItem(index, { valueTag })} /></div>
                            <div className="mb-0 col-md-12"><label className="form-label">Text</label><input className="form-control" maxLength={80} value={item.label} onChange={(event) => setItem(index, { label: event.target.value })} placeholder="HOME RENOVATIONS" /></div>
                        </ItemShell>
                    ))}
                    {value.items.length < MAX_ITEMS.stats && (
                        <div className="col-12">
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => set({ items: [...value.items, { iconName: "FaStar", value: "", valueTag: "h3", label: "" }] })}>+ Add Stat</button>
                        </div>
                    )}
                </div>
            </fieldset>
        </SectionCard>
    );
};

export const WhyChooseEditor = ({ value, onChange }) => {
    const set = (patch) => onChange("whyChoose", patch);
    const setItem = (index, patch) => set({ items: value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
    return (
        <SectionCard title="Why Choose Us (icon cards)" subtitle="The “What makes us the best choice” heading and its cards.">
            <HeadingFields title={value.title} tag={value.titleTag} onTitle={(title) => set({ title })} onTag={(titleTag) => set({ titleTag })} hint={TAG_HINT} />
            {value.items.map((item, index) => (
                <ItemShell
                    key={index}
                    index={index}
                    total={value.items.length}
                    label={item.title || `Card ${index + 1}`}
                    canRemove={value.items.length > 1}
                    onMove={(from, to) => set({ items: moveItem(value.items, from, to) })}
                    onRemove={(i) => set({ items: value.items.filter((_, idx) => idx !== i) })}
                >
                    <div className="mb-3 col-md-3"><label className="form-label">Icon</label><IconPicker value={item.iconName} onChange={(iconName) => setItem(index, { iconName })} /></div>
                    <div className="mb-3 col-md-7"><label className="form-label">Card Heading</label><input className="form-control" maxLength={80} value={item.title} onChange={(event) => setItem(index, { title: event.target.value })} /></div>
                    <div className="mb-3 col-md-2"><label className="form-label">Tag</label><TagSelect value={item.titleTag} onChange={(titleTag) => setItem(index, { titleTag })} /></div>
                    <div className="mb-0 col-12"><label className="form-label">Text</label><textarea className="form-control" rows={2} maxLength={200} value={item.description} onChange={(event) => setItem(index, { description: event.target.value })} /></div>
                </ItemShell>
            ))}
            {value.items.length < MAX_ITEMS.whyChoose && (
                <div className="col-12">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => set({ items: [...value.items, { iconName: "FaCheckCircle", title: "", titleTag: "h4", description: "" }] })}>+ Add Card</button>
                </div>
            )}
        </SectionCard>
    );
};

export const FaqsEditor = ({ value, onChange }) => {
    const set = (patch) => onChange("faqs", patch);
    const setItem = (index, patch) => set({ items: value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) });
    return (
        <div className="row">
            <SectionCard title="FAQ Section" subtitle="Shown as an accordion. Use {city} to insert the city name. If there are no FAQs here, nothing changes on the page.">
                <HeadingFields label="FAQ Heading" title={value.title} tag={value.titleTag} onTitle={(title) => set({ title })} onTag={(titleTag) => set({ titleTag })} hint={TAG_HINT} />
                <div className="mb-3 col-md-4">
                    <label className="form-label">Small label above heading</label>
                    <input className="form-control" maxLength={40} value={value.eyebrow} onChange={(event) => set({ eyebrow: event.target.value })} placeholder="Good to know" />
                    <small className="text-muted">Leave empty to hide.</small>
                </div>
                <div className="mb-3 col-md-8">
                    <label className="form-label">Short intro text under heading</label>
                    <input className="form-control" maxLength={200} value={value.intro} onChange={(event) => set({ intro: event.target.value })} placeholder="Here are a few useful details about designing with HC Interior." />
                </div>
            </SectionCard>

            <div className="col-12">
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="mb-0">FAQ Items ({value.items.length})</h6>
                    {value.items.length < MAX_ITEMS.faqs && (
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => set({ items: [...value.items, { question: "", answer: "" }] })}>+ Add FAQ</button>
                    )}
                </div>
                {!value.items.length && <div className="alert alert-light border small">No items added yet.</div>}
            </div>

            {value.items.map((item, index) => (
                <ItemShell
                    key={index}
                    index={index}
                    total={value.items.length}
                    label={item.question || `FAQ ${index + 1}`}
                    canRemove
                    onMove={(from, to) => set({ items: moveItem(value.items, from, to) })}
                    onRemove={(i) => set({ items: value.items.filter((_, idx) => idx !== i) })}
                >
                    <div className="mb-3 col-12"><label className="form-label">Question</label><input className="form-control" maxLength={250} value={item.question} onChange={(event) => setItem(index, { question: event.target.value })} /></div>
                    <div className="mb-0 col-12"><label className="form-label">Answer</label><textarea className="form-control" rows={3} maxLength={1500} value={item.answer} onChange={(event) => setItem(index, { answer: event.target.value })} /><small className="text-muted">Line breaks are kept.</small></div>
                </ItemShell>
            ))}
        </div>
    );
};

export const LivePreviewPane = ({ src }) => {
    const [reloadKey, setReloadKey] = useState(0);
    if (!src) return <div className="alert alert-light border">Enter a City Type first.</div>;
    return (
        <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span className="small text-muted me-auto">Shows the last <strong>saved</strong> version of the page. Save, then reload to see changes.</span>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setReloadKey((key) => key + 1)}>Reload</button>
                <a className="btn btn-sm btn-outline-primary" href={src} target="_blank" rel="noopener noreferrer">Open in new tab</a>
            </div>
            <iframe key={reloadKey} src={src} title="City page preview" style={{ width: "100%", height: "70vh", border: "1px solid #dee2e6", borderRadius: 8 }} />
        </div>
    );
};

/* ================= Sidebar editors ================= */

// settings = admin "citySettings" state, onChange(name, value) = updateCitySetting
export const SiteVisitEditor = ({ settings, onChange }) => (
    <SectionCard title="Sidebar: Book a Site Visit" subtitle="The dark call-to-action box at the top of the sidebar.">
        <HeadingFields
            label="Heading"
            title={settings.siteVisitTitle}
            tag={settings.siteVisitTitleTag}
            onTitle={(value) => onChange("siteVisitTitle", value)}
            onTag={(value) => onChange("siteVisitTitleTag", value)}
            hint={TAG_HINT}
        />
        <div className="mb-3 col-md-8">
            <label className="form-label">Description</label>
            <input className="form-control" maxLength={220} value={settings.siteVisitDescription} onChange={(event) => onChange("siteVisitDescription", event.target.value)} />
            <small className="text-muted">Use {"{city}"} to insert the city name.</small>
        </div>
        <div className="mb-3 col-md-4">
            <label className="form-label">Button Text</label>
            <input className="form-control" maxLength={60} value={settings.siteVisitButtonText} onChange={(event) => onChange("siteVisitButtonText", event.target.value)} />
        </div>
        <div className="mb-0 col-md-12">
            <label className="form-label">Button Link</label>
            <input className="form-control" value={settings.siteVisitButtonUrl} onChange={(event) => onChange("siteVisitButtonUrl", event.target.value)} placeholder="/contact" />
        </div>
    </SectionCard>
);

export const PromiseEditor = ({ settings, onChange }) => {
    const items = settings.promiseItems;
    const setItems = (next) => onChange("promiseItems", next);
    const setItem = (index, patch) => setItems(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    return (
        <SectionCard title="Sidebar: The Promise" subtitle="The checklist box under the enquiry form. Pick an icon for each line; add or remove lines as needed.">
            <HeadingFields
                label="Section Heading"
                title={settings.promiseTitle}
                tag={settings.promiseTitleTag}
                onTitle={(value) => onChange("promiseTitle", value)}
                onTag={(value) => onChange("promiseTitleTag", value)}
                hint={TAG_HINT}
            />
            {items.map((item, index) => (
                <ItemShell
                    key={index}
                    index={index}
                    total={items.length}
                    label={item.title || `Promise ${index + 1}`}
                    canRemove={items.length > 1}
                    onMove={(from, to) => setItems(moveItem(items, from, to))}
                    onRemove={(i) => setItems(items.filter((_, idx) => idx !== i))}
                >
                    <div className="mb-3 col-md-4"><label className="form-label">Icon</label><IconPicker value={item.iconName} onChange={(iconName) => setItem(index, { iconName })} /></div>
                    <div className="mb-3 col-md-8"><label className="form-label">Title</label><input className="form-control" maxLength={80} value={item.title} onChange={(event) => setItem(index, { title: event.target.value })} /></div>
                    <div className="mb-0 col-12"><label className="form-label">Description</label><input className="form-control" maxLength={180} value={item.description} onChange={(event) => setItem(index, { description: event.target.value })} /></div>
                </ItemShell>
            ))}
            {items.length < MAX_ITEMS.promise && (
                <div className="col-12">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setItems([...items, { iconName: "FaCheckCircle", title: "", description: "" }])}>+ Add Promise</button>
                </div>
            )}
        </SectionCard>
    );
};

const isInternalPath = (value) => {
    const v = String(value || "").trim();
    return v.startsWith("/") && !v.startsWith("//");
};
const isImageRef = (value) => {
    const v = String(value || "").trim();
    return !v || /^https?:\/\//i.test(v) || isInternalPath(v);
};

/**
 * Rows of text boxes with an "Add" button and a delete button per row.
 * columns: [{ key, label, placeholder, flex, kind: "text" | "path" | "image", maxLength }]
 */
export const LinkRowsEditor = ({ title, subtitle, sectionTitle, onSectionTitle, sectionTag, onSectionTag, rows, columns, onChange, addLabel, max, newRow, hint, twoUp = false }) => {
    const update = (index, key, value) => onChange(rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
    const invalid = (column, value) => {
        if (!String(value || "").trim()) return false;
        if (column.kind === "path") return !isInternalPath(value);
        if (column.kind === "image") return !isImageRef(value);
        return false;
    };
    return (
        <SectionCard title={title} subtitle={subtitle}>
            <div className={onSectionTag ? "mb-3 col-md-6" : "mb-3 col-md-8"}>
                <label className="form-label">Section Heading</label>
                <input className="form-control" maxLength={80} value={sectionTitle} onChange={(event) => onSectionTitle(event.target.value)} />
            </div>
            {onSectionTag && (
                <div className="mb-3 col-md-2">
                    <label className="form-label">Heading Tag</label>
                    <TagSelect value={sectionTag} onChange={onSectionTag} />
                </div>
            )}
            <div className="mb-3 col-md-4 d-flex align-items-end justify-content-md-end">
                {rows.length < max && (
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => onChange([...rows, { ...newRow }])}>+ {addLabel}</button>
                )}
            </div>
            {!rows.length && <div className="col-12"><div className="alert alert-light border small mb-2">No rows. The page will fall back to its built-in default list.</div></div>}
            {rows.map((row, index) => (
                <div className={twoUp ? "col-xl-6 mb-2" : "col-12 mb-2"} key={index}>
                    <div className="d-flex gap-2 align-items-start">
                        {columns.map((column) => (
                            <div key={column.key} style={{ flex: column.flex || 1, minWidth: 0 }}>
                                <input
                                    className={`form-control ${invalid(column, row[column.key]) ? "is-invalid" : ""}`}
                                    value={row[column.key] || ""}
                                    maxLength={column.maxLength || 300}
                                    placeholder={column.placeholder}
                                    aria-label={`${column.label} ${index + 1}`}
                                    onChange={(event) => update(index, column.key, event.target.value)}
                                />
                            </div>
                        ))}
                        <button type="button" className="btn btn-outline-danger flex-shrink-0" aria-label={`Delete row ${index + 1}`} title="Delete" onClick={() => onChange(rows.filter((_, i) => i !== index))}>🗑</button>
                    </div>
                </div>
            ))}
            {hint && <div className="col-12"><small className="text-muted">{hint}</small></div>}
        </SectionCard>
    );
};

/* ================= Project photos & testimonial videos ================= */

/**
 * Unlimited photos and testimonial videos. Every item is added by pasting its URL
 * (files live in the backend uploads folder, or use a YouTube / Vimeo link).
 */
export const ProjectGalleryEditor = ({ items, onChange, legacyPhotos = [] }) => {
    const setItem = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

    return (
        <SectionCard
            title="Project Photos & Testimonial Videos"
            subtitle="Unlimited. Paste a link for each item; they appear on the page in this order (all photos first, then all videos, one per row). Visitors click a photo to see it full size, or click a video to play it in a popup. Once you add items here, the old fixed six photos are no longer shown."
        >
            {!items.length && legacyPhotos.length > 0 && (
                <div className="col-12 mb-3">
                    <div className="alert alert-warning d-flex flex-wrap align-items-center gap-2 mb-0">
                        <span className="me-auto small">This page still shows its {legacyPhotos.length} old project photo{legacyPhotos.length === 1 ? "" : "s"} until you add items here.</span>
                        <button
                            type="button"
                            className="btn btn-sm btn-warning"
                            onClick={() => onChange(legacyPhotos.map((photo) => ({ type: "image", src: photo.src, alt: photo.alt || "", title: "", videoUrl: "", poster: "" })))}
                        >
                            Import current {legacyPhotos.length} photo{legacyPhotos.length === 1 ? "" : "s"} into this list
                        </button>
                    </div>
                </div>
            )}
            <div className="col-12 mb-3 d-flex flex-wrap gap-2">
                {items.length < MAX_ITEMS.gallery && (
                    <>
                        <button type="button" className="btn btn-sm btn-primary" onClick={() => onChange([...items, { type: "image", src: "", alt: "", title: "", videoUrl: "", poster: "" }])}>+ Add Photo</button>
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onChange([...items, { type: "video", src: "", alt: "", title: "", videoUrl: "", poster: "" }])}>+ Add Video</button>
                    </>
                )}
                <span className="small text-muted align-self-center ms-auto">{items.length} extra item{items.length === 1 ? "" : "s"}</span>
            </div>
            {!items.length && <div className="col-12"><div className="alert alert-light border small">No items yet.</div></div>}

            {items.map((item, index) => {
                const isVideo = item.type === "video";
                const video = isVideo ? parseVideoUrl(item.videoUrl) : null;
                const preview = isVideo ? (item.poster || video?.poster || "") : item.src;
                const kindLabel = video ? (video.kind === "youtube" ? "YouTube link" : video.kind === "vimeo" ? "Vimeo link" : "Video file") : "";
                return (
                    <ItemShell
                        key={index}
                        index={index}
                        total={items.length}
                        label={`${isVideo ? "🎬 Video" : "🖼 Photo"}${item.alt ? ` — ${item.alt}` : ""}`}
                        canRemove
                        onMove={(from, to) => onChange(moveItem(items, from, to))}
                        onRemove={(i) => onChange(items.filter((_, idx) => idx !== i))}
                    >
                        {isVideo ? (
                            <>
                                <div className="mb-3 col-12">
                                    <label className="form-label">Video link</label>
                                    <input className={`form-control ${item.videoUrl && !video ? "is-invalid" : ""}`} maxLength={500} value={item.videoUrl} onChange={(event) => setItem(index, { videoUrl: event.target.value })} placeholder="YouTube / Vimeo link, or a .mp4 / .webm file URL from the uploads folder" />
                                    {item.videoUrl && video && <small className="text-success">✓ {kindLabel} recognised</small>}
                                    {item.videoUrl && !video && <small className="text-danger">Not a supported link. Use a YouTube, Vimeo or direct .mp4/.webm link.</small>}
                                </div>
                                <div className="mb-3 col-12">
                                    <label className="form-label">Thumbnail image URL (optional)</label>
                                    <input className="form-control" maxLength={500} value={item.poster} onChange={(event) => setItem(index, { poster: event.target.value })} placeholder="Leave empty to use the YouTube thumbnail / first frame of the video" />
                                </div>
                            </>
                        ) : (
                            <div className="mb-3 col-12">
                                <label className="form-label">Image URL</label>
                                <input className="form-control" maxLength={500} value={item.src} onChange={(event) => setItem(index, { src: event.target.value })} placeholder="Paste the image URL (.webp) from the uploads folder" />
                            </div>
                        )}
                        <div className="mb-0 col-md-6"><label className="form-label">Alt text (SEO / accessibility)</label><input className="form-control" maxLength={125} value={item.alt} onChange={(event) => setItem(index, { alt: event.target.value })} placeholder={isVideo ? "e.g. Client testimonial – 3BHK Noida" : "Describe the photo"} /></div>
                        <div className="mb-0 col-md-4"><label className="form-label">Title (tooltip, optional)</label><input className="form-control" maxLength={120} value={item.title} onChange={(event) => setItem(index, { title: event.target.value })} /></div>
                        <div className="mb-0 col-md-2 d-flex align-items-end">
                            {preview ? (
                                <img src={preview} alt="" style={{ width: "100%", maxHeight: 60, objectFit: "cover", borderRadius: 6, border: "1px solid #dee2e6" }} />
                            ) : video?.kind === "file" ? (
                                <video src={`${item.videoUrl}#t=0.1`} muted preload="metadata" style={{ width: "100%", maxHeight: 60, objectFit: "cover", borderRadius: 6, border: "1px solid #dee2e6", background: "#000" }} />
                            ) : null}
                        </div>
                    </ItemShell>
                );
            })}
        </SectionCard>
    );
};
