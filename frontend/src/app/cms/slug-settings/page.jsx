// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { useSelector } from "react-redux";
// import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
// import api from "@/utils/api";
// import { toast } from "react-toastify";
// import {
//     getCmsAccess,
//     getDeletePermissionMessage,
//     getPublishWorkflowMessage,
// } from "@/utils/cmsAccess";

// const SITE_URL = "https://hcinterior.in";
// // const initialFormState = { entityType: "", entityId: "", slug: "", isActive: true };
// const initialFormState = { entityType: "", entityId: "", slug: "", isActive: true, center: "" };
// const sanitizeCenter = (v) => v.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-{2,}/g, "-");

// const slugify = (v) =>
//     v.normalize("NFKD").toLowerCase().trim()
//         .replace(/[^a-z0-9\s-]/g, "")
//         .replace(/[\s_-]+/g, "-")
//         .replace(/^-+|-+$/g, "");

// const sanitizeSlugInput = (v) =>
//     v.normalize("NFKD").toLowerCase()
//         .replace(/[\s_]+/g, "-")
//         .replace(/[^a-z0-9-]/g, "")
//         .replace(/-{2,}/g, "-")
//         .replace(/^-+/, "");

// const errMsg = (error, fallback) => {
//     const m = error?.response?.data?.message;
//     return Array.isArray(m) ? m.join(", ") : m || fallback;
// };

// const CmsSlugSettings = () => {
//     const user = useSelector((state) => state.auth.user);
//     const authToken = useSelector((state) => state.auth.authToken);
//     const { canPublish, canDelete } = getCmsAccess(user);

//     const [types, setTypes] = useState([]);
//     const [slugList, setSlugList] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [typeFilter, setTypeFilter] = useState("");
//     const [search, setSearch] = useState("");
//     const [formData, setFormData] = useState({ ...initialFormState, isActive: canPublish });
//     const [selectedId, setSelectedId] = useState(null);
//     const [slugStatus, setSlugStatus] = useState("idle"); // idle | checking | available | taken

//     const authConfig = useCallback(
//         (extra = {}) => {
//             const token = authToken || (typeof window !== "undefined" ? localStorage.getItem("token") : "");
//             return { headers: { Authorization: `Bearer ${token}` }, ...extra };
//         },
//         [authToken]
//     );

//     // const baseOf = (type) => types.find((t) => t.type === type)?.basePath ?? "";
//     const baseOf = (type) => {
//     const known = types.find((t) => t.type === type);
//     if (known) return known.basePath;
//     return /^experience-center-.+-gallery$/.test(type || "") ? `/${type.slice(0, -8)}/gallery` : "";
// };

// const effectiveType =
//     formData.entityType === "__center__"
//         ? (formData.center ? `${formData.center}-gallery` : "")
//         : formData.entityType;

//     const fetchSlugs = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await api.get("/slug-edit", authConfig());
//             setSlugList(response.data || []);
//         } catch (err) {
//             toast.error(errMsg(err, "Error fetching slugs."));
//         } finally {
//             setLoading(false);
//         }
//     }, [authConfig]);

//     const fetchTypes = useCallback(async () => {
//         try {
//             const response = await api.get("/slug-edit/types", authConfig());
//             setTypes(response.data || []);
//         } catch (err) {
//             toast.error(errMsg(err, "Error fetching page types."));
//         }
//     }, [authConfig]);

//     useEffect(() => { fetchTypes(); fetchSlugs(); }, [fetchTypes, fetchSlugs]);

//     // Live duplicate check
//     useEffect(() => {
//         // if (!formData.entityType || !formData.slug) { setSlugStatus("idle"); return; }
//         if (!effectiveType || !slugify(formData.slug)) { setSlugStatus("idle"); return; }
//         setSlugStatus("checking");
//         const t = setTimeout(async () => {
//             try {
//                 // const params = { entityType: formData.entityType, slug: formData.slug };
//                 const params = { entityType: effectiveType, slug: slugify(formData.slug) };
//                 if (formData.entityId) params.entityId = formData.entityId;
//                 if (selectedId) params.excludeId = selectedId;
//                 const res = await api.get("/slug-edit/check", { ...authConfig(), params });
//                 setSlugStatus(res.data.available ? "available" : "taken");
//             } catch { setSlugStatus("idle"); }
//         }, 400);
//         return () => clearTimeout(t);
//     }, [effectiveType, formData.entityId, formData.slug, selectedId, authConfig]);

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             // [name]: type === "checkbox" ? checked : name === "slug" ? slugify(value) : value,
//             // [name]: type === "checkbox" ? checked : name === "slug" ? sanitizeSlugInput(value) : value,
//             [name]: type === "checkbox" ? checked
//     : name === "slug" ? sanitizeSlugInput(value)
//     : name === "center" ? sanitizeCenter(value)
//     : value,
//         }));
//     };

//     const openAdd = () => {
//         setSelectedId(null);
//         setFormData({ ...initialFormState, isActive: canPublish });
//     };

//     const handleAddSubmit = async (e) => {
//         e.preventDefault();
//         if (!effectiveType) return toast.error("Select a page type (and a center slug).");
//         if (formData.entityType === "__center__" && !formData.center.startsWith("experience-center-")) {
//     return toast.error("Center slug must start with experience-center-");
// }
//         if (slugStatus === "taken") return toast.error("This slug is already in use.");
//         try {
//             if (!canPublish) toast.info(getPublishWorkflowMessage("This slug"));
//             const payload = {
//                 entityType: effectiveType,
//                 entityId: Number(formData.entityId),
//                 // slug: formData.slug,
//                 slug: slugify(formData.slug),
//                 isActive: canPublish ? formData.isActive : false,
//             };
//             const response = await api.post("/slug-edit", payload, authConfig());
//             if (response.status === 201 || response.status === 200) {
//                 fetchSlugs();
//                 toast.success("Slug created successfully.");
//                 document.getElementById("addSlugModalClose").click();
//             }
//         } catch (error) { toast.error(errMsg(error, "Error creating slug.")); }
//     };

//     const handleEditSubmit = async (e) => {
//         e.preventDefault();
//         if (slugStatus === "taken") return toast.error("This slug is already in use.");
//         try {
//             if (!canPublish && formData.isActive) toast.info(getPublishWorkflowMessage("This slug"));
//             const response = await api.patch(
//                 `/slug-edit/${selectedId}`,
//                 { 
//                 // slug: formData.slug,
//                 slug: slugify(formData.slug),
//                 isActive: formData.isActive },
//                 authConfig()
//             );
//             if (response.status === 200) {
//                 fetchSlugs();
//                 toast.success("Slug updated. The old URL now redirects to the new one.");
//                 document.getElementById("editSlugModalClose").click();
//             }
//         } catch (error) { toast.error(errMsg(error, "Error updating slug.")); }
//     };

//     const deleteHandler = async (id) => {
//         if (!canDelete) {
//             toast.error(getDeletePermissionMessage("this slug"));
//             return;
//         }
//         if (window.confirm("Delete this slug? The page will go back to its ?id= URL.")) {
//             try {
//                 await api.delete(`/slug-edit/${id}`, authConfig());
//                 fetchSlugs();
//                 toast.success("Slug deleted.");
//             } catch (error) { toast.error(errMsg(error, "Failed to delete.")); }
//         }
//     };

//     const handleEditClick = (item) => {
//         const nextActiveState = canPublish ? item.isActive !== false : false;
//         if (!canPublish && item.isActive) {
//             toast.info("Editing an active slug will disable it until an admin republishes it.");
//         }
//         setSelectedId(item.id);

//         const isCenter = !types.some((t) => t.type === item.entityType);
// setFormData({
//     entityType: isCenter ? "__center__" : item.entityType,
//     center: isCenter ? item.entityType.replace(/-gallery$/, "") : "",
//     entityId: String(item.entityId),
//     slug: item.slug,
//     isActive: nextActiveState,
// });
//         // setFormData({
//         //     entityType: item.entityType,
//         //     entityId: String(item.entityId),
//         //     slug: item.slug,
//         //     isActive: nextActiveState,
//         // });
//     };

//     const visibleRows = slugList.filter((r) => {
//         if (typeFilter && r.entityType !== typeFilter) return false;
//         if (!search) return true;
//         const q = search.toLowerCase();
//         return r.slug.toLowerCase().includes(q) || String(r.entityId).includes(q);
//     });

//     const renderFormBody = (isEdit) => (
//         <div className="modal-body p-4 bg-light row g-3">
//             {/* <div className="col-md-12">
//                 <label className="form-label fw-bold">Page Type *</label>
//                 <select className="form-select" name="entityType" value={formData.entityType} onChange={handleInputChange} disabled={isEdit} required>
//                     <option value="">Select page type</option>
//                     {types.map((t) => (
//                         <option key={t.type} value={t.type}>{t.type} ({t.basePath})</option>
//                     ))}
//                     <option value="__center__">Experience Center gallery (generated centers)</option>
//                     {formData.entityType === "__center__" && (
//     <div className="col-md-12 mt-3">
//         <label className="form-label fw-bold">Center slug *</label>
//         <input type="text" className="form-control" name="center"
//                placeholder="the part of the URL after /experience-center/, e.g. ghaziabad"
//                value={formData.center} onChange={handleInputChange} disabled={isEdit} required />
//     </div>
// )}
//                 </select>
//             </div> */}

//             <div className="col-md-12">
//     <label className="form-label fw-bold">Page Type *</label>
//     <select className="form-select" name="entityType" value={formData.entityType} onChange={handleInputChange} disabled={isEdit} required>
//         <option value="">Select page type</option>
//         {types.map((t) => (
//             <option key={t.type} value={t.type}>{t.type} ({t.basePath})</option>
//         ))}
//         <option value="__center__">Experience Center gallery (generated centers)</option>
//     </select>

//     {formData.entityType === "__center__" && (
//         <div className="mt-3">
//             <label className="form-label fw-bold">Center slug *</label>
//             <input type="text" className="form-control" name="center"
//                    placeholder="the part of the URL after /experience-center/, e.g. ghaziabad"
//                    value={formData.center} onChange={handleInputChange} disabled={isEdit} required />
//         </div>
//     )}
// </div>
//             <div className="col-md-12 mt-3">
//                 <label className="form-label fw-bold">Item ID *</label>
//                 <input type="number" min="1" className="form-control" name="entityId" placeholder="The number in ?id=103" value={formData.entityId} onChange={handleInputChange} disabled={isEdit} required />
//             </div>
//             <div className="col-md-12 mt-3">
//                 <label className="form-label fw-bold">Slug *</label>
//                 <input type="text" className="form-control" name="slug" placeholder="e.g., modern-living-room" value={formData.slug} onChange={handleInputChange} onBlur={() => setFormData((p) => ({ ...p, slug: slugify(p.slug) }))} required />
//                 {slugStatus === "checking" && <small className="text-muted">Checking...</small>}
//                 {slugStatus === "available" && <small className="text-success fw-semibold">Slug is available</small>}
//                 {slugStatus === "taken" && <small className="text-danger fw-semibold">Slug already in use</small>}
//             </div>
//             {/* {formData.entityType && formData.slug && (
//                 <div className="col-md-12 mt-3">
//                     <div className="alert alert-secondary py-2 mb-0 small">
//                         <div><strong>New URL:</strong> {SITE_URL}{effectiveType && formData.slug}/{slugify(formData.slug)}</div>
//                         {formData.entityId && (
//                             <div><strong>Old URL (redirects):</strong> {baseOf(effectiveType)}?id={formData.entityId}</div>
//                         )}
//                     </div>
//                 </div>
//             )} */}

//             {effectiveType && formData.slug && (
//     <div className="col-md-12 mt-3">
//         <div className="alert alert-secondary py-2 mb-0 small">
//             <div><strong>New URL:</strong> {SITE_URL}{baseOf(effectiveType)}/{slugify(formData.slug)}</div>
//             {formData.entityId && (
//                 <div><strong>Old URL (redirects):</strong> {baseOf(effectiveType)}?id={formData.entityId}</div>
//             )}
//         </div>
//     </div>
// )}
//             <div className="col-md-6 mt-4 d-flex align-items-end">
//                 <div className="form-check form-switch fs-5">
//                     <input className="form-check-input" type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} disabled={!canPublish} />
//                     <label className="form-check-label ms-2 fs-6">{canPublish ? "Active" : "Admin Publish Required"}</label>
//                 </div>
//             </div>
//         </div>
//     );

//     const saveDisabled = slugStatus === "taken" || slugStatus === "checking";

//     return (
//         <AuthMainLayout>
//             <div className="container-fluid my-5 px-4">
//                 <div className="card shadow-sm border-0">
//                     <div className="card-header bg-dark text-white p-4 border-0">
//                         <h1 className="h3 mb-1 text-white">Slug Settings</h1>
//                         <p className="small mb-0 text-white">Edit page URLs. Duplicate slugs are blocked and old URLs redirect automatically.</p>
//                     </div>
//                     <div className="card-body p-4">
//                         {(!canPublish || !canDelete) && (
//                             <div className="alert alert-info">
//                                 Editors can stage slugs here. Publish and delete access can be granted separately by an admin.
//                             </div>
//                         )}

//                         <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
//                             <div className="d-flex gap-2">
//                                 <select className="form-select" style={{ minWidth: 200 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
//                                     <option value="">All page types</option>
//                                     {types.map((t) => <option key={t.type} value={t.type}>{t.type}</option>)}
//                                 </select>
//                                 <input type="text" className="form-control" placeholder="Search slug or ID" value={search} onChange={(e) => setSearch(e.target.value)} />
//                             </div>
//                             <button onClick={openAdd} className="btn btn-primary px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#addSlugModal">
//                                 + Add Slug
//                             </button>
//                         </div>

//                         {loading && !slugList.length ? (
//                             <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
//                         ) : (
//                             <div className="table-responsive">
//                                 <table className="table table-hover align-middle border">
//                                     <thead className="table-light">
//                                         <tr><th>SN</th><th>Type</th><th>Item ID</th><th>Slug URL</th><th>Old URL</th><th>Status</th><th className="text-end">Actions</th></tr>
//                                     </thead>
//                                     <tbody>
//                                         {visibleRows.length > 0 ? visibleRows.map((item, index) => (
//                                             <tr key={item.id}>
//                                                 <td className="fw-bold text-muted">{index + 1}</td>
//                                                 <td><span className="badge bg-secondary">{item.entityType}</span></td>
//                                                 <td>{item.entityId}</td>
//                                                 <td className="text-success fw-semibold">
//                                                     <a href={`${SITE_URL}${baseOf(item.entityType)}/${item.slug}`} target="_blank" rel="noreferrer" className="text-success">
//                                                         {baseOf(item.entityType)}/{item.slug}
//                                                     </a>
//                                                 </td>
//                                                 <td className="text-danger fw-semibold">{baseOf(item.entityType)}?id={item.entityId}</td>
//                                                 <td>{item.isActive ? <span className="text-success fw-bold">Active</span> : <span className="text-muted">Disabled</span>}</td>
//                                                 <td className="text-end">
//                                                     <button onClick={() => handleEditClick(item)} className="btn btn-sm btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#editSlugModal">Edit</button>
//                                                     {canDelete && <button className="btn btn-sm btn-outline-danger" onClick={() => deleteHandler(item.id)}>Delete</button>}
//                                                 </td>
//                                             </tr>
//                                         )) : (<tr><td colSpan="7" className="text-center py-4 text-muted">No slugs configured.</td></tr>)}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             <div className="modal fade" id="addSlugModal" tabIndex="-1" aria-hidden="true">
//                 <div className="modal-dialog"><div className="modal-content"><form onSubmit={handleAddSubmit}>
//                     <div className="modal-header"><h5 className="modal-title">Add Slug</h5></div>
//                     {renderFormBody(false)}
//                     <div className="modal-footer">
//                         <button type="button" id="addSlugModalClose" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//                         <button className="btn btn-primary" type="submit" disabled={saveDisabled}>Save</button>
//                     </div>
//                 </form></div></div>
//             </div>

//             <div className="modal fade" id="editSlugModal" tabIndex="-1" aria-hidden="true">
//                 <div className="modal-dialog"><div className="modal-content"><form onSubmit={handleEditSubmit}>
//                     <div className="modal-header"><h5 className="modal-title">Edit Slug</h5></div>
//                     {renderFormBody(true)}
//                     <div className="modal-footer">
//                         <button type="button" id="editSlugModalClose" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//                         <button className="btn btn-primary" type="submit" disabled={saveDisabled}>Update</button>
//                     </div>
//                 </form></div></div>
//             </div>
//         </AuthMainLayout>
//     );
// };

// export default CmsSlugSettings;



// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { useSelector } from "react-redux";
// import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
// import api from "@/utils/api";
// import { toast } from "react-toastify";

// import {
//     getCmsAccess,
//     getDeletePermissionMessage,
//     getPublishWorkflowMessage,
// } from "@/utils/cmsAccess";

// const SITE_URL = "https://hcinterior.in";

// const initialFormState = {
//     entityType: "",
//     entityId: "",
//     slug: "",
//     isActive: true,
//     redirectStatus: 301,
//     center: "",
// };

// const initialUrlMappingState = {
//     old_url: "",
//     new_url: "",
//     status_code: 301,
//     is_active: true,
// };

// const sanitizeCenter = (v) =>
//     v.toLowerCase()
//         .replace(/[^a-z0-9-]/g, "")
//         .replace(/-{2,}/g, "-");

// const slugify = (v) =>
//     v.normalize("NFKD")
//         .toLowerCase()
//         .trim()
//         .replace(/[^a-z0-9\s-]/g, "")
//         .replace(/[\s_-]+/g, "-")
//         .replace(/^-+|-+$/g, "");

// const sanitizeSlugInput = (v) =>
//     v.normalize("NFKD")
//         .toLowerCase()
//         .replace(/[\s_]+/g, "-")
//         .replace(/[^a-z0-9-]/g, "")
//         .replace(/-{2,}/g, "-")
//         .replace(/^-+/, "");

// const errMsg = (error, fallback) => {
//     const message = error?.response?.data?.message;

//     return Array.isArray(message)
//         ? message.join(", ")
//         : message || fallback;
// };

// const CmsSlugSettings = () => {
//     const user = useSelector((state) => state.auth.user);
//     const authToken = useSelector((state) => state.auth.authToken);

//     const { canPublish, canDelete } = getCmsAccess(user);

//     // ==========================================
//     // GALLERY SLUG STATES
//     // ==========================================

//     const [types, setTypes] = useState([]);
//     const [slugList, setSlugList] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const [typeFilter, setTypeFilter] = useState("");
//     const [search, setSearch] = useState("");

//     const [formData, setFormData] = useState({
//         ...initialFormState,
//         isActive: canPublish,
//     });

//     const [selectedId, setSelectedId] = useState(null);
//     const [slugStatus, setSlugStatus] = useState("idle");

//     // ==========================================
//     // SECTION NAVIGATION
//     // UI ONLY
//     // ==========================================

//     const [activeSection, setActiveSection] = useState("slugs");

//     // ==========================================
//     // CUSTOM URL MAPPING STATES
//     // ==========================================

//     const [urlMappings, setUrlMappings] = useState([]);
//     const [urlMappingLoading, setUrlMappingLoading] = useState(false);

//     const [urlMappingForm, setUrlMappingForm] = useState({
//         ...initialUrlMappingState,
//         is_active: canPublish,
//     });

//     const [selectedMappingId, setSelectedMappingId] = useState(null);
//     const [urlMappingStatus, setUrlMappingStatus] = useState("idle");

//     // NEW: Custom URL search state (UI only)
//     const [urlSearch, setUrlSearch] = useState("");

//     // ==========================================
//     // AUTH CONFIGURATION
//     // ==========================================

//     const authConfig = useCallback(
//         (extra = {}) => {
//             const token =
//                 authToken ||
//                 (typeof window !== "undefined"
//                     ? localStorage.getItem("token")
//                     : "");

//             return {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 ...extra,
//             };
//         },
//         [authToken]
//     );

//     // ==========================================
//     // SLUG URL HELPERS
//     // ==========================================

//     const baseOf = (type) => {
//         const known = types.find((t) => t.type === type);

//         if (known) {
//             return known.basePath;
//         }

//         if (type?.startsWith("center~")) {
//             return `/experience-center/${type.slice("center~".length)}/gallery`;
//         }

//         return /^experience-center-.+-gallery$/.test(type || "")
//             ? `/experience-center/${type.slice(0, -8)}/gallery`
//             : "";
//     };

//     const canonicalBaseOf = (type) =>
//         baseOf(type).replace(/\/(?:project-)?gallery$/, "");

//     const effectiveType =
//         formData.entityType === "__center__"
//             ? formData.center
//                 ? `center~${
//                     formData.center.startsWith("experience-center-")
//                         ? formData.center
//                         : `experience-center-${formData.center}`
//                 }`
//                 : ""
//             : formData.entityType;

//     // ==========================================
//     // FETCH GALLERY SLUGS
//     // ==========================================

//     const fetchSlugs = useCallback(async () => {
//         setLoading(true);

//         try {
//             const response = await api.get(
//                 "/slug-edit",
//                 authConfig()
//             );

//             setSlugList(response.data || []);

//         } catch (error) {
//             toast.error(
//                 errMsg(error, "Error fetching slugs.")
//             );

//         } finally {
//             setLoading(false);
//         }
//     }, [authConfig]);

//     // ==========================================
//     // FETCH CUSTOM URL MAPPINGS
//     // ==========================================

//     const fetchUrlMappings = useCallback(async () => {
//         setUrlMappingLoading(true);

//         try {
//             const response = await api.get(
//                 "/redirects",
//                 authConfig()
//             );

//             setUrlMappings(
//                 (response.data || []).filter(
//                     (item) => item.is_url_rewrite === true
//                 )
//             );

//         } catch (error) {
//             toast.error(
//                 errMsg(error, "Error fetching custom URL mappings.")
//             );

//         } finally {
//             setUrlMappingLoading(false);
//         }
//     }, [authConfig]);

//     // ==========================================
//     // FETCH PAGE TYPES
//     // ==========================================

//     const fetchTypes = useCallback(async () => {
//         try {
//             const response = await api.get(
//                 "/slug-edit/types",
//                 authConfig()
//             );

//             setTypes(response.data || []);

//         } catch (error) {
//             toast.error(
//                 errMsg(error, "Error fetching page types.")
//             );
//         }
//     }, [authConfig]);

//     // ==========================================
//     // INITIAL DATA LOADING
//     // ==========================================

//     useEffect(() => {
//         fetchTypes();
//         fetchSlugs();
//         fetchUrlMappings();
//     }, [fetchTypes, fetchSlugs, fetchUrlMappings]);

//     // ==========================================
//     // LIVE SLUG DUPLICATE CHECK
//     // ==========================================

//     useEffect(() => {
//         if (!effectiveType || !slugify(formData.slug)) {
//             setSlugStatus("idle");
//             return;
//         }

//         setSlugStatus("checking");

//         const timer = setTimeout(async () => {
//             try {
//                 const params = {
//                     entityType: effectiveType,
//                     slug: slugify(formData.slug),
//                 };

//                 if (formData.entityId) {
//                     params.entityId = formData.entityId;
//                 }

//                 if (selectedId) {
//                     params.excludeId = selectedId;
//                 }

//                 const response = await api.get(
//                     "/slug-edit/check",
//                     {
//                         ...authConfig(),
//                         params,
//                     }
//                 );

//                 setSlugStatus(
//                     response.data.available
//                         ? "available"
//                         : "taken"
//                 );

//             } catch {
//                 setSlugStatus("idle");
//             }

//         }, 400);

//         return () => clearTimeout(timer);

//     }, [
//         effectiveType,
//         formData.entityId,
//         formData.slug,
//         selectedId,
//         authConfig,
//     ]);

//     // ==========================================
//     // CUSTOM URL ADD FORM
//     // ==========================================

//     const openAddUrlMapping = () => {
//         setSelectedMappingId(null);

//         setUrlMappingForm({
//             ...initialUrlMappingState,
//             is_active: canPublish,
//         });

//         setUrlMappingStatus("idle");
//     };

//     // ==========================================
//     // CUSTOM URL INPUT HANDLER
//     // ==========================================

//     const handleUrlMappingInput = (e) => {
//         const { name, value, checked, type } = e.target;

//         setUrlMappingForm((previous) => ({
//             ...previous,
//             [name]:
//                 type === "checkbox"
//                     ? checked
//                     : name === "status_code"
//                         ? Number(value)
//                         : value,
//         }));
//     };

//     // ==========================================
//     // LIVE CUSTOM URL DUPLICATE CHECK
//     // ==========================================

//     useEffect(() => {
//         const oldUrl = urlMappingForm.old_url.trim();
//         const newUrl = urlMappingForm.new_url.trim();

//         if (!oldUrl || !newUrl) {
//             setUrlMappingStatus("idle");
//             return;
//         }

//         setUrlMappingStatus("checking");

//         const timer = setTimeout(async () => {
//             try {
//                 const params = {
//                     old_url: oldUrl,
//                     new_url: newUrl,
//                 };

//                 if (selectedMappingId) {
//                     params.excludeId = selectedMappingId;
//                 }

//                 const response = await api.get(
//                     "/redirects/check",
//                     {
//                         ...authConfig(),
//                         params,
//                     }
//                 );

//                 setUrlMappingStatus(
//                     response.data?.available
//                         ? "available"
//                         : "taken"
//                 );

//             } catch {
//                 setUrlMappingStatus("idle");
//             }

//         }, 350);

//         return () => clearTimeout(timer);

//     }, [
//         urlMappingForm.old_url,
//         urlMappingForm.new_url,
//         selectedMappingId,
//         authConfig,
//     ]);

//     // ==========================================
//     // SAVE CUSTOM URL MAPPING
//     // ==========================================

//     const saveUrlMapping = async (event) => {
//         event.preventDefault();

//         if (urlMappingStatus === "taken") {
//             return toast.error(
//                 "This URL mapping conflicts with an existing URL."
//             );
//         }

//         if (urlMappingStatus === "checking") {
//             return toast.info(
//                 "Please wait for the duplicate check to finish."
//             );
//         }

//         const oldUrl = urlMappingForm.old_url.trim();
//         const newUrl = urlMappingForm.new_url.trim();

//         if (
//             !oldUrl.startsWith("/") ||
//             !newUrl.startsWith("/")
//         ) {
//             return toast.error(
//                 "Enter both URLs as internal paths beginning with /."
//             );
//         }

//         if (oldUrl === newUrl) {
//             return toast.error(
//                 "Old URL and new URL cannot be the same."
//             );
//         }

//         const payload = {
//             old_url: oldUrl,
//             new_url: newUrl,
//             status_code: Number(urlMappingForm.status_code),
//             is_active: canPublish
//                 ? urlMappingForm.is_active
//                 : false,
//             is_url_rewrite: true,
//         };

//         try {
//             if (!canPublish) {
//                 toast.info(
//                     getPublishWorkflowMessage("This URL mapping")
//                 );
//             }

//             if (selectedMappingId) {
//                 await api.patch(
//                     `/redirects/${selectedMappingId}`,
//                     payload,
//                     authConfig()
//                 );

//                 toast.success(
//                     "URL mapping updated successfully."
//                 );

//             } else {
//                 await api.post(
//                     "/redirects",
//                     payload,
//                     authConfig()
//                 );

//                 toast.success(
//                     "URL mapping created successfully."
//                 );
//             }

//             await fetchUrlMappings();

//             document
//                 .getElementById("urlMappingModalClose")
//                 ?.click();

//         } catch (error) {
//             toast.error(
//                 errMsg(error, "Unable to save this URL mapping.")
//             );
//         }
//     };

//     // ==========================================
//     // EDIT CUSTOM URL MAPPING
//     // ==========================================

//     const editUrlMapping = (item) => {
//         setSelectedMappingId(item.id);

//         setUrlMappingForm({
//             old_url: item.old_url,
//             new_url: item.new_url,
//             status_code: item.status_code || 301,
//             is_active: canPublish
//                 ? item.is_active !== false
//                 : false,
//         });

//         setUrlMappingStatus("idle");
//     };

//     // ==========================================
//     // DELETE CUSTOM URL MAPPING
//     // ==========================================

//     const deleteUrlMapping = async (id) => {
//         if (!canDelete) {
//             toast.error(
//                 getDeletePermissionMessage("this URL mapping")
//             );

//             return;
//         }

//         if (
//             !window.confirm(
//                 "Delete this URL mapping? The old URL will stop redirecting and the new URL will stop rewriting to the original page."
//             )
//         ) {
//             return;
//         }

//         try {
//             await api.delete(
//                 `/redirects/${id}`,
//                 authConfig()
//             );

//             await fetchUrlMappings();

//             toast.success("URL mapping deleted.");

//         } catch (error) {
//             toast.error(
//                 errMsg(error, "Failed to delete URL mapping.")
//             );
//         }
//     };

//     // ==========================================
//     // CUSTOM URL SEARCH
//     // SEARCHES OLD URL AND NEW URL
//     // ==========================================

//     const visibleUrlMappings = urlMappings.filter((item) => {
//         const query = urlSearch.trim().toLowerCase();

//         if (!query) {
//             return true;
//         }

//         return (
//             String(item.old_url || "")
//                 .toLowerCase()
//                 .includes(query) ||

//             String(item.new_url || "")
//                 .toLowerCase()
//                 .includes(query)
//         );
//     });

//     // ==========================================
//     // GALLERY SLUG INPUT HANDLER
//     // ==========================================

//     const handleInputChange = (e) => {
//         const { name, value, type, checked } = e.target;

//         setFormData((previous) => ({
//             ...previous,
//             [name]:
//                 type === "checkbox"
//                     ? checked
//                     : name === "slug"
//                         ? sanitizeSlugInput(value)
//                         : name === "center"
//                             ? sanitizeCenter(value)
//                             : value,
//         }));
//     };

//     // ==========================================
//     // OPEN ADD SLUG
//     // ==========================================

//     const openAdd = () => {
//         setSelectedId(null);

//         setFormData({
//             ...initialFormState,
//             isActive: canPublish,
//         });
//     };

//     // ==========================================
//     // CREATE GALLERY SLUG
//     // ==========================================

//     const handleAddSubmit = async (e) => {
//         e.preventDefault();

//         if (!effectiveType) {
//             return toast.error(
//                 "Select a page type (and a center slug)."
//             );
//         }

//         if (slugStatus === "taken") {
//             return toast.error(
//                 "This slug is already in use."
//             );
//         }

//         if (slugStatus === "checking") {
//             return toast.info(
//                 "Please wait for the slug check to finish."
//             );
//         }

//         try {
//             if (!canPublish) {
//                 toast.info(
//                     getPublishWorkflowMessage("This slug")
//                 );
//             }

//             const payload = {
//                 entityType: effectiveType,
//                 entityId: Number(formData.entityId),
//                 slug: slugify(formData.slug),
//                 isActive: canPublish
//                     ? formData.isActive
//                     : false,
//                 redirectStatus: Number(formData.redirectStatus),
//             };

//             const response = await api.post(
//                 "/slug-edit",
//                 payload,
//                 authConfig()
//             );

//             if (
//                 response.status === 201 ||
//                 response.status === 200
//             ) {
//                 await fetchSlugs();

//                 toast.success(
//                     "Slug created successfully."
//                 );

//                 document
//                     .getElementById("addSlugModalClose")
//                     ?.click();
//             }

//         } catch (error) {
//             toast.error(
//                 errMsg(error, "Error creating slug.")
//             );
//         }
//     };

//     // ==========================================
//     // UPDATE GALLERY SLUG
//     // ==========================================

//     const handleEditSubmit = async (e) => {
//         e.preventDefault();

//         if (slugStatus === "taken") {
//             return toast.error(
//                 "This slug is already in use."
//             );
//         }

//         if (slugStatus === "checking") {
//             return toast.info(
//                 "Please wait for the slug check to finish."
//             );
//         }

//         try {
//             if (!canPublish && formData.isActive) {
//                 toast.info(
//                     getPublishWorkflowMessage("This slug")
//                 );
//             }

//             const response = await api.patch(
//                 `/slug-edit/${selectedId}`,
//                 {
//                     slug: slugify(formData.slug),
//                     isActive: formData.isActive,
//                     redirectStatus: Number(formData.redirectStatus),
//                 },
//                 authConfig()
//             );

//             if (response.status === 200) {
//                 await fetchSlugs();

//                 toast.success(
//                     "Slug updated. The old URL now redirects to the new one."
//                 );

//                 document
//                     .getElementById("editSlugModalClose")
//                     ?.click();
//             }

//         } catch (error) {
//             toast.error(
//                 errMsg(error, "Error updating slug.")
//             );
//         }
//     };

//     // ==========================================
//     // DELETE GALLERY SLUG
//     // ==========================================

//     const deleteHandler = async (id) => {
//         if (!canDelete) {
//             toast.error(
//                 getDeletePermissionMessage("this slug")
//             );

//             return;
//         }

//         if (
//             window.confirm(
//                 "Delete this slug? The page will go back to its ?id= URL."
//             )
//         ) {
//             try {
//                 await api.delete(
//                     `/slug-edit/${id}`,
//                     authConfig()
//                 );

//                 await fetchSlugs();

//                 toast.success("Slug deleted.");

//             } catch (error) {
//                 toast.error(
//                     errMsg(error, "Failed to delete.")
//                 );
//             }
//         }
//     };

//     // ==========================================
//     // EDIT GALLERY SLUG
//     // ==========================================

//     const handleEditClick = (item) => {
//         const nextActiveState = canPublish
//             ? item.isActive !== false
//             : false;

//         if (!canPublish && item.isActive) {
//             toast.info(
//                 "Editing an active slug will disable it until an admin republishes it."
//             );
//         }

//         setSelectedId(item.id);

//         const isCenter =
//             item.entityType.startsWith("center~") ||
//             !types.some(
//                 (type) => type.type === item.entityType
//             );

//         setFormData({
//             entityType: isCenter
//                 ? "__center__"
//                 : item.entityType,

//             center: isCenter
//                 ? item.entityType.startsWith("center~")
//                     ? item.entityType.slice("center~".length)
//                     : item.entityType.replace(/-gallery$/, "")
//                 : "",

//             entityId: String(item.entityId),
//             slug: item.slug,
//             isActive: nextActiveState,
//             redirectStatus: item.redirectStatus || 301,
//         });
//     };

//     // ==========================================
//     // FILTER GALLERY SLUGS
//     // ==========================================

//     const visibleRows = slugList.filter((item) => {
//         if (
//             typeFilter &&
//             item.entityType !== typeFilter
//         ) {
//             return false;
//         }

//         if (!search) {
//             return true;
//         }

//         const query = search.toLowerCase();

//         return (
//             item.slug.toLowerCase().includes(query) ||
//             String(item.entityId).includes(query)
//         );
//     });

//     // ==========================================
//     // COMMON SLUG MODAL FORM
//     // ==========================================

//     const renderFormBody = (isEdit) => (
//         <div className="modal-body p-4 bg-light row g-3">

//             <div className="col-md-12">

//                 <label className="form-label fw-bold">
//                     Page Type *
//                 </label>

//                 <select
//                     className="form-select"
//                     name="entityType"
//                     value={formData.entityType}
//                     onChange={handleInputChange}
//                     disabled={isEdit}
//                     required
//                 >

//                     <option value="">
//                         Select page type
//                     </option>

//                     {types.map((type) => (
//                         <option
//                             key={type.type}
//                             value={type.type}
//                         >
//                             {type.type} ({type.basePath})
//                         </option>
//                     ))}

//                     <option value="__center__">
//                         Experience Center gallery (generated centers)
//                     </option>

//                 </select>

//                 {formData.entityType === "__center__" && (

//                     <div className="mt-3">

//                         <label className="form-label fw-bold">
//                             Center slug *
//                         </label>

//                         <input
//                             type="text"
//                             className="form-control"
//                             name="center"
//                             placeholder="The part of the URL after /experience-center/, e.g. ghaziabad"
//                             value={formData.center}
//                             onChange={handleInputChange}
//                             disabled={isEdit}
//                             required
//                         />

//                     </div>

//                 )}

//             </div>


//             <div className="col-md-12">

//                 <label className="form-label fw-bold">
//                     Item ID *
//                 </label>

//                 <input
//                     type="number"
//                     min="1"
//                     className="form-control"
//                     name="entityId"
//                     placeholder="The number in ?id=103"
//                     value={formData.entityId}
//                     onChange={handleInputChange}
//                     disabled={isEdit}
//                     required
//                 />

//             </div>


//             <div className="col-md-12">

//                 <label className="form-label fw-bold">
//                     Slug *
//                 </label>

//                 <input
//                     type="text"
//                     className="form-control"
//                     name="slug"
//                     placeholder="e.g. modern-living-room"
//                     value={formData.slug}
//                     onChange={handleInputChange}
//                     onBlur={() =>
//                         setFormData((previous) => ({
//                             ...previous,
//                             slug: slugify(previous.slug),
//                         }))
//                     }
//                     required
//                 />

//                 {slugStatus === "checking" && (
//                     <small className="text-muted">
//                         Checking...
//                     </small>
//                 )}

//                 {slugStatus === "available" && (
//                     <small className="text-success fw-semibold">
//                         Slug is available
//                     </small>
//                 )}

//                 {slugStatus === "taken" && (
//                     <small className="text-danger fw-semibold">
//                         Slug already in use
//                     </small>
//                 )}

//             </div>


//             {effectiveType && formData.slug && (

//                 <div className="col-md-12">

//                     <div className="alert alert-secondary py-2 mb-0 small">

//                         <div>
//                             <strong>New URL:</strong>{" "}
//                             {SITE_URL}
//                             {canonicalBaseOf(effectiveType)}/
//                             {slugify(formData.slug)}
//                         </div>

//                         {formData.entityId && (

//                             <div>
//                                 <strong>Old URL (redirects):</strong>{" "}
//                                 {baseOf(effectiveType)}?id=
//                                 {formData.entityId}
//                             </div>

//                         )}

//                     </div>

//                 </div>

//             )}


//             <div className="col-md-6 mt-4">

//                 <label className="form-label fw-bold">
//                     Redirect Type
//                 </label>

//                 <select
//                     className="form-select"
//                     name="redirectStatus"
//                     value={formData.redirectStatus || 301}
//                     onChange={handleInputChange}
//                 >

//                     <option value={301}>
//                         301 (Permanent)
//                     </option>

//                     <option value={302}>
//                         302 (Temporary)
//                     </option>

//                 </select>

//             </div>


//             <div className="col-md-6 mt-4 d-flex align-items-end">

//                 <div className="form-check form-switch fs-5">

//                     <input
//                         className="form-check-input"
//                         type="checkbox"
//                         name="isActive"
//                         checked={formData.isActive}
//                         onChange={handleInputChange}
//                         disabled={!canPublish}
//                     />

//                     <label className="form-check-label ms-2 fs-6">
//                         {canPublish
//                             ? "Active"
//                             : "Admin Publish Required"}
//                     </label>

//                 </div>

//             </div>

//         </div>
//     );

//     const saveDisabled =
//         slugStatus === "taken" ||
//         slugStatus === "checking";

//     // ==========================================
//     // MAIN PAGE
//     // ==========================================

//     return (
//         <AuthMainLayout>

//             {/* Scoped heading CSS.
//                 Fixes global CSS overriding the white title. */}

//             <style>{`
//                 .url-slug-settings-header .url-slug-settings-title {
//                     color: #ffffff !important;
//                 }

//                 .url-slug-settings-header .url-slug-settings-subtitle {
//                     color: #ffffff !important;
//                 }
//             `}</style>

//             <div className="container-fluid my-5 px-4">

//                 <div className="card shadow-sm border-0">

//                     {/* ==================================
//                         PAGE HEADER
//                     ================================== */}

//                     <div className="card-header bg-dark text-white p-4 border-0 url-slug-settings-header">

//                         <h1 className="h3 mb-1 text-white url-slug-settings-title">
//                             URL &amp; Slug Settings
//                         </h1>

//                         <p className="small mb-0 text-white url-slug-settings-subtitle">
//                             Manage gallery slugs and custom page URL changes.
//                             Duplicate URLs are blocked; CMS and dashboard routes are protected.
//                         </p>

//                     </div>


//                     <div className="card-body p-4">

//                         {/* ==================================
//                             PERMISSION NOTICE
//                         ================================== */}

//                         {(!canPublish || !canDelete) && (

//                             <div className="alert alert-info">
//                                 Editors can stage slugs here.
//                                 Publish and delete access can be granted
//                                 separately by an admin.
//                             </div>

//                         )}


//                         {/* ==================================
//                             SECTION NAVIGATION
//                         ================================== */}

//                         <div className="card border-0 shadow-sm mb-4">

//                             <div className="card-body p-3">

//                                 <div className="row g-3">

//                                     {/* GALLERY SLUG BUTTON */}

//                                     <div className="col-md-6">

//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 setActiveSection("slugs")
//                                             }
//                                             className={`btn w-100 text-start p-3 ${
//                                                 activeSection === "slugs"
//                                                     ? "btn-primary shadow"
//                                                     : "btn-outline-secondary"
//                                             }`}
//                                             aria-pressed={
//                                                 activeSection === "slugs"
//                                             }
//                                         >

//                                             <div className="d-flex justify-content-between align-items-center">

//                                                 <div>

//                                                     <div className="fw-bold fs-5">
//                                                         Gallery Slug Management
//                                                     </div>

//                                                     <small>
//                                                         Manage gallery slugs,
//                                                         parent pages and old URLs.
//                                                     </small>

//                                                 </div>

//                                                 <span className="badge bg-light text-dark fs-6 ms-2">
//                                                     {slugList.length}
//                                                 </span>

//                                             </div>

//                                         </button>

//                                     </div>


//                                     {/* CUSTOM URL BUTTON */}

//                                     <div className="col-md-6">

//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 setActiveSection("urls")
//                                             }
//                                             className={`btn w-100 text-start p-3 ${
//                                                 activeSection === "urls"
//                                                     ? "btn-primary shadow"
//                                                     : "btn-outline-secondary"
//                                             }`}
//                                             aria-pressed={
//                                                 activeSection === "urls"
//                                             }
//                                         >

//                                             <div className="d-flex justify-content-between align-items-center">

//                                                 <div>

//                                                     <div className="fw-bold fs-5">
//                                                         Custom URL Changes
//                                                     </div>

//                                                     <small>
//                                                         Change public page URLs
//                                                         with 301 or 302 redirects.
//                                                     </small>

//                                                 </div>

//                                                 <span className="badge bg-light text-dark fs-6 ms-2">
//                                                     {urlMappings.length}
//                                                 </span>

//                                             </div>

//                                         </button>

//                                     </div>

//                                 </div>

//                             </div>

//                         </div>


//                         {/* ==================================
//                             SECTION 1: GALLERY SLUG MANAGEMENT
//                         ================================== */}

//                         {activeSection === "slugs" && (

//                             <div className="card border shadow-sm">

//                                 <div className="card-header bg-light py-3">

//                                     <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

//                                         <div>
//                                             <h2 className="h4 mb-1">
//                                                 Gallery Slug Management
//                                             </h2>

//                                             <p className="small text-muted mb-0">
//                                                 Manage existing gallery slugs
//                                                 and their redirect settings.
//                                             </p>
//                                         </div>

//                                         <button
//                                             type="button"
//                                             onClick={openAdd}
//                                             className="btn btn-primary px-4 shadow-sm"
//                                             data-bs-toggle="modal"
//                                             data-bs-target="#addSlugModal"
//                                         >
//                                             + Add Slug
//                                         </button>

//                                     </div>

//                                 </div>


//                                 <div className="card-body p-3">

//                                     {/* SEARCH AND FILTER IN SAME ROW */}

//                                     <div className="row g-2 align-items-center mb-4">

//                                         <div className="col-12 col-md-4">

//                                             <select
//                                                 className="form-select"
//                                                 value={typeFilter}
//                                                 onChange={(e) =>
//                                                     setTypeFilter(e.target.value)
//                                                 }
//                                             >

//                                                 <option value="">
//                                                     All page types
//                                                 </option>

//                                                 {types.map((type) => (

//                                                     <option
//                                                         key={type.type}
//                                                         value={type.type}
//                                                     >
//                                                         {type.type}
//                                                     </option>

//                                                 ))}

//                                             </select>

//                                         </div>


//                                         <div className="col-12 col-md-5">

//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 placeholder="Search slug or ID"
//                                                 value={search}
//                                                 onChange={(e) =>
//                                                     setSearch(e.target.value)
//                                                 }
//                                             />

//                                         </div>


//                                         <div className="col-12 col-md-3 text-md-end">

//                                             <span className="text-muted small">
//                                                 Showing {visibleRows.length} of{" "}
//                                                 {slugList.length} slugs
//                                             </span>

//                                         </div>

//                                     </div>


//                                     {/* GALLERY SLUG TABLE */}

//                                     {loading && !slugList.length ? (

//                                         <div className="text-center py-5">

//                                             <div
//                                                 className="spinner-border text-primary"
//                                                 role="status"
//                                             />

//                                         </div>

//                                     ) : (

//                                         <div className="table-responsive">

//                                             <table className="table table-hover align-middle border">

//                                                 <thead className="table-light">

//                                                     <tr>
//                                                         <th>SN</th>
//                                                         <th>Type</th>
//                                                         <th>Item ID</th>
//                                                         <th>Slug URL</th>
//                                                         <th>Old URL</th>
//                                                         <th>Redirect</th>
//                                                         <th>Status</th>
//                                                         <th className="text-end">
//                                                             Actions
//                                                         </th>
//                                                     </tr>

//                                                 </thead>


//                                                 <tbody>

//                                                     {visibleRows.length > 0 ? (

//                                                         visibleRows.map((item, index) => (

//                                                             <tr key={item.id}>

//                                                                 <td className="fw-bold text-muted">
//                                                                     {index + 1}
//                                                                 </td>

//                                                                 <td>
//                                                                     <span className="badge bg-secondary">
//                                                                         {item.entityType}
//                                                                     </span>
//                                                                 </td>

//                                                                 <td>
//                                                                     {item.entityId}
//                                                                 </td>

//                                                                 <td className="text-success fw-semibold text-break">

//                                                                     <a
//                                                                         href={`${SITE_URL}${canonicalBaseOf(item.entityType)}/${item.slug}`}
//                                                                         target="_blank"
//                                                                         rel="noreferrer"
//                                                                         className="text-success"
//                                                                     >
//                                                                         {canonicalBaseOf(item.entityType)}/{item.slug}
//                                                                     </a>

//                                                                 </td>

//                                                                 <td className="text-danger fw-semibold text-break">
//                                                                     {baseOf(item.entityType)}?id={item.entityId}
//                                                                 </td>

//                                                                 <td>

//                                                                     <span
//                                                                         className={`badge ${
//                                                                             item.redirectStatus === 302
//                                                                                 ? "bg-warning text-dark"
//                                                                                 : "bg-primary"
//                                                                         }`}
//                                                                     >
//                                                                         {item.redirectStatus || 301}
//                                                                     </span>

//                                                                 </td>

//                                                                 <td>

//                                                                     {item.isActive ? (

//                                                                         <span className="text-success fw-bold">
//                                                                             Active
//                                                                         </span>

//                                                                     ) : (

//                                                                         <span className="text-muted">
//                                                                             Disabled
//                                                                         </span>

//                                                                     )}

//                                                                 </td>

//                                                                 <td className="text-end text-nowrap">

//                                                                     <button
//                                                                         type="button"
//                                                                         onClick={() =>
//                                                                             handleEditClick(item)
//                                                                         }
//                                                                         className="btn btn-sm btn-outline-primary me-2"
//                                                                         data-bs-toggle="modal"
//                                                                         data-bs-target="#editSlugModal"
//                                                                     >
//                                                                         Edit
//                                                                     </button>

//                                                                     {canDelete && (

//                                                                         <button
//                                                                             type="button"
//                                                                             className="btn btn-sm btn-outline-danger"
//                                                                             onClick={() =>
//                                                                                 deleteHandler(item.id)
//                                                                             }
//                                                                         >
//                                                                             Delete
//                                                                         </button>

//                                                                     )}

//                                                                 </td>

//                                                             </tr>

//                                                         ))

//                                                     ) : (

//                                                         <tr>

//                                                             <td
//                                                                 colSpan="8"
//                                                                 className="text-center py-5 text-muted"
//                                                             >
//                                                                 No slugs configured.
//                                                             </td>

//                                                         </tr>

//                                                     )}

//                                                 </tbody>

//                                             </table>

//                                         </div>

//                                     )}

//                                 </div>

//                             </div>

//                         )}


//                         {/* ==================================
//                             SECTION 2: CUSTOM URL CHANGES
//                         ================================== */}

//                         {activeSection === "urls" && (

//                             <div className="card border shadow-sm">

//                                 <div className="card-header bg-light py-3">

//                                     <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

//                                         <div>
//                                             <h2 className="h4 mb-1">
//                                                 Custom URL Changes
//                                             </h2>

//                                             <p className="small text-muted mb-0">
//                                                 Change any public page path,
//                                                 including parent pages such as /product.
//                                                 Child URLs follow parent path changes automatically.
//                                             </p>
//                                         </div>

//                                         <button
//                                             type="button"
//                                             onClick={openAddUrlMapping}
//                                             className="btn btn-primary px-4"
//                                             data-bs-toggle="modal"
//                                             data-bs-target="#urlMappingModal"
//                                         >
//                                             + Add URL Change
//                                         </button>

//                                     </div>

//                                 </div>


//                                 <div className="card-body p-3">

//                                     {/* CUSTOM URL SEARCH IN SAME ROW */}

//                                     <div className="row g-2 align-items-center mb-4">

//                                         <div className="col-12 col-md-8">

//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 placeholder="Search old URL or new URL"
//                                                 value={urlSearch}
//                                                 onChange={(e) =>
//                                                     setUrlSearch(e.target.value)
//                                                 }
//                                             />

//                                         </div>


//                                         <div className="col-12 col-md-4 text-md-end">

//                                             <span className="text-muted small">
//                                                 Showing {visibleUrlMappings.length} of{" "}
//                                                 {urlMappings.length} URL changes
//                                             </span>

//                                         </div>

//                                     </div>


//                                     {/* CUSTOM URL TABLE */}

//                                     {urlMappingLoading && !urlMappings.length ? (

//                                         <div className="text-center py-4">

//                                             <div
//                                                 className="spinner-border text-primary"
//                                                 role="status"
//                                             />

//                                         </div>

//                                     ) : (

//                                         <div className="table-responsive">

//                                             <table className="table table-hover align-middle border mb-0">

//                                                 <thead className="table-light">

//                                                     <tr>
//                                                         <th>SN</th>
//                                                         <th>Old URL</th>
//                                                         <th>New URL</th>
//                                                         <th>Redirect</th>
//                                                         <th>Status</th>
//                                                         <th className="text-end">
//                                                             Actions
//                                                         </th>
//                                                     </tr>

//                                                 </thead>


//                                                 <tbody>

//                                                     {visibleUrlMappings.length > 0 ? (

//                                                         visibleUrlMappings.map((item, index) => (

//                                                             <tr key={item.id}>

//                                                                 <td className="text-muted fw-bold">
//                                                                     {index + 1}
//                                                                 </td>

//                                                                 <td className="text-danger fw-semibold text-break">
//                                                                     {item.old_url}
//                                                                 </td>

//                                                                 <td className="text-success fw-semibold text-break">
//                                                                     {item.new_url}
//                                                                 </td>

//                                                                 <td>

//                                                                     <span
//                                                                         className={`badge ${
//                                                                             item.status_code === 301
//                                                                                 ? "bg-primary"
//                                                                                 : "bg-warning text-dark"
//                                                                         }`}
//                                                                     >
//                                                                         {item.status_code === 301
//                                                                             ? "301 Permanent"
//                                                                             : "302 Temporary"}
//                                                                     </span>

//                                                                 </td>

//                                                                 <td>

//                                                                     {item.is_active ? (

//                                                                         <span className="text-success fw-bold">
//                                                                             Active
//                                                                         </span>

//                                                                     ) : (

//                                                                         <span className="text-muted">
//                                                                             Inactive
//                                                                         </span>

//                                                                     )}

//                                                                 </td>

//                                                                 <td className="text-end text-nowrap">

//                                                                     <button
//                                                                         type="button"
//                                                                         onClick={() =>
//                                                                             editUrlMapping(item)
//                                                                         }
//                                                                         className="btn btn-sm btn-outline-primary me-2"
//                                                                         data-bs-toggle="modal"
//                                                                         data-bs-target="#urlMappingModal"
//                                                                     >
//                                                                         Edit
//                                                                     </button>

//                                                                     {canDelete && (

//                                                                         <button
//                                                                             type="button"
//                                                                             className="btn btn-sm btn-outline-danger"
//                                                                             onClick={() =>
//                                                                                 deleteUrlMapping(item.id)
//                                                                             }
//                                                                         >
//                                                                             Delete
//                                                                         </button>

//                                                                     )}

//                                                                 </td>

//                                                             </tr>

//                                                         ))

//                                                     ) : (

//                                                         <tr>

//                                                             <td
//                                                                 colSpan="6"
//                                                                 className="text-center text-muted py-5"
//                                                             >
//                                                                 {urlSearch.trim()
//                                                                     ? "No URL changes match your search."
//                                                                     : "No custom URL changes configured."}
//                                                             </td>

//                                                         </tr>

//                                                     )}

//                                                 </tbody>

//                                             </table>

//                                         </div>

//                                     )}

//                                 </div>

//                             </div>

//                         )}

//                     </div>

//                 </div>

//             </div>


//             {/* ==========================================
//                 CUSTOM URL MAPPING MODAL
//                 OUTSIDE CONDITIONAL SECTIONS
//             ========================================== */}

//             <div
//                 className="modal fade"
//                 id="urlMappingModal"
//                 tabIndex="-1"
//                 aria-hidden="true"
//             >

//                 <div className="modal-dialog modal-lg">

//                     <div className="modal-content">

//                         <form onSubmit={saveUrlMapping}>

//                             <div className="modal-header">

//                                 <h5 className="modal-title">
//                                     {selectedMappingId
//                                         ? "Edit URL Change"
//                                         : "Add URL Change"}
//                                 </h5>

//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     data-bs-dismiss="modal"
//                                     aria-label="Close"
//                                 />

//                             </div>


//                             <div className="modal-body p-4 bg-light row g-3">

//                                 <div className="col-12">

//                                     <label className="form-label fw-bold">
//                                         Old URL *
//                                     </label>

//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="old_url"
//                                         value={urlMappingForm.old_url}
//                                         onChange={handleUrlMappingInput}
//                                         placeholder="/design-idea/gallery?id=83"
//                                         required
//                                     />

//                                     <small className="text-muted">
//                                         Use the current public path.
//                                         Query strings such as ?id=83 are supported.
//                                     </small>

//                                 </div>


//                                 <div className="col-12">

//                                     <label className="form-label fw-bold">
//                                         New URL *
//                                     </label>

//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="new_url"
//                                         value={urlMappingForm.new_url}
//                                         onChange={handleUrlMappingInput}
//                                         placeholder="/design-idea/balcony"
//                                         required
//                                     />

//                                     <small className="text-muted">
//                                         This URL will display the original page
//                                         content without exposing the old route.
//                                     </small>

//                                 </div>


//                                 {urlMappingStatus === "checking" && (

//                                     <div className="col-12">
//                                         <small className="text-muted">
//                                             Checking for duplicate URLs...
//                                         </small>
//                                     </div>

//                                 )}


//                                 {urlMappingStatus === "available" && (

//                                     <div className="col-12">
//                                         <small className="text-success fw-semibold">
//                                             Both URLs are available.
//                                         </small>
//                                     </div>

//                                 )}


//                                 {urlMappingStatus === "taken" && (

//                                     <div className="col-12">
//                                         <small className="text-danger fw-semibold">
//                                             Duplicate or conflicting URL mapping.
//                                             Choose another path.
//                                         </small>
//                                     </div>

//                                 )}


//                                 <div className="col-md-6">

//                                     <label className="form-label fw-bold">
//                                         Redirect Type
//                                     </label>

//                                     <select
//                                         className="form-select"
//                                         name="status_code"
//                                         value={urlMappingForm.status_code}
//                                         onChange={handleUrlMappingInput}
//                                     >

//                                         <option value={301}>
//                                             301 (Permanent)
//                                         </option>

//                                         <option value={302}>
//                                             302 (Temporary)
//                                         </option>

//                                     </select>

//                                 </div>


//                                 <div className="col-md-6 d-flex align-items-end">

//                                     <div className="form-check form-switch fs-5">

//                                         <input
//                                             className="form-check-input"
//                                             type="checkbox"
//                                             name="is_active"
//                                             id="urlMappingActive"
//                                             checked={urlMappingForm.is_active}
//                                             onChange={handleUrlMappingInput}
//                                             disabled={!canPublish}
//                                         />

//                                         <label
//                                             className="form-check-label ms-2 fs-6"
//                                             htmlFor="urlMappingActive"
//                                         >
//                                             {canPublish
//                                                 ? "Active"
//                                                 : "Admin Publish Required"}
//                                         </label>

//                                     </div>

//                                 </div>


//                                 <div className="col-12">

//                                     <div className="alert alert-info small mb-0">
//                                         Parent path changes also apply to child URLs.
//                                         For an item-specific gallery change, include
//                                         the old ?id= value, for example:
//                                         /design-idea/gallery?id=83.
//                                     </div>

//                                 </div>

//                             </div>


//                             <div className="modal-footer">

//                                 <button
//                                     type="button"
//                                     id="urlMappingModalClose"
//                                     className="btn btn-secondary"
//                                     data-bs-dismiss="modal"
//                                 >
//                                     Close
//                                 </button>

//                                 <button
//                                     className="btn btn-primary"
//                                     type="submit"
//                                     disabled={
//                                         urlMappingStatus === "checking" ||
//                                         urlMappingStatus === "taken" ||
//                                         urlMappingStatus === "idle"
//                                     }
//                                 >
//                                     {selectedMappingId
//                                         ? "Update"
//                                         : "Save"}
//                                 </button>

//                             </div>

//                         </form>

//                     </div>

//                 </div>

//             </div>


//             {/* ==========================================
//                 ADD SLUG MODAL
//                 OUTSIDE CONDITIONAL SECTIONS
//             ========================================== */}

//             <div
//                 className="modal fade"
//                 id="addSlugModal"
//                 tabIndex="-1"
//                 aria-hidden="true"
//             >

//                 <div className="modal-dialog">

//                     <div className="modal-content">

//                         <form onSubmit={handleAddSubmit}>

//                             <div className="modal-header">

//                                 <h5 className="modal-title">
//                                     Add Slug
//                                 </h5>

//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     data-bs-dismiss="modal"
//                                     aria-label="Close"
//                                 />

//                             </div>

//                             {renderFormBody(false)}

//                             <div className="modal-footer">

//                                 <button
//                                     type="button"
//                                     id="addSlugModalClose"
//                                     className="btn btn-secondary"
//                                     data-bs-dismiss="modal"
//                                 >
//                                     Close
//                                 </button>

//                                 <button
//                                     className="btn btn-primary"
//                                     type="submit"
//                                     disabled={saveDisabled}
//                                 >
//                                     Save
//                                 </button>

//                             </div>

//                         </form>

//                     </div>

//                 </div>

//             </div>


//             {/* ==========================================
//                 EDIT SLUG MODAL
//                 OUTSIDE CONDITIONAL SECTIONS
//             ========================================== */}

//             <div
//                 className="modal fade"
//                 id="editSlugModal"
//                 tabIndex="-1"
//                 aria-hidden="true"
//             >

//                 <div className="modal-dialog">

//                     <div className="modal-content">

//                         <form onSubmit={handleEditSubmit}>

//                             <div className="modal-header">

//                                 <h5 className="modal-title">
//                                     Edit Slug
//                                 </h5>

//                                 <button
//                                     type="button"
//                                     className="btn-close"
//                                     data-bs-dismiss="modal"
//                                     aria-label="Close"
//                                 />

//                             </div>

//                             {renderFormBody(true)}

//                             <div className="modal-footer">

//                                 <button
//                                     type="button"
//                                     id="editSlugModalClose"
//                                     className="btn btn-secondary"
//                                     data-bs-dismiss="modal"
//                                 >
//                                     Close
//                                 </button>

//                                 <button
//                                     className="btn btn-primary"
//                                     type="submit"
//                                     disabled={saveDisabled}
//                                 >
//                                     Update
//                                 </button>

//                             </div>

//                         </form>

//                     </div>

//                 </div>

//             </div>

//         </AuthMainLayout>
//     );
// };

// export default CmsSlugSettings;




"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";

import {
    getCmsAccess,
    getDeletePermissionMessage,
    getPublishWorkflowMessage,
} from "@/utils/cmsAccess";

const initialUrlMappingState = {
    old_url: "",
    new_url: "",
    status_code: 301,
    is_active: true,
};

const errMsg = (error, fallback) => {
    const message = error?.response?.data?.message;
    return Array.isArray(message)
        ? message.join(", ")
        : message || fallback;
};

const CmsSlugSettings = () => {
    const user = useSelector((state) => state.auth.user);
    const authToken = useSelector((state) => state.auth.authToken);
    const { canPublish, canDelete } = getCmsAccess(user);

    // All public URL changes, including gallery URLs, are managed here.
    const [urlMappings, setUrlMappings] = useState([]);
    const [urlMappingLoading, setUrlMappingLoading] = useState(false);
    const [urlSearch, setUrlSearch] = useState("");

    const [urlMappingForm, setUrlMappingForm] = useState({
        ...initialUrlMappingState,
        is_active: canPublish,
    });
    const [selectedMappingId, setSelectedMappingId] = useState(null);
    const [urlMappingStatus, setUrlMappingStatus] = useState("idle");

    // Original URLs let an existing mapping be saved when only its status
    // or redirect code changes, without running a duplicate check against itself.
    const [originalUrlMapping, setOriginalUrlMapping] = useState(null);

    const authConfig = useCallback(
        (extra = {}) => {
            const token =
                authToken ||
                (typeof window !== "undefined"
                    ? localStorage.getItem("token")
                    : "");

            return {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                ...extra,
            };
        },
        [authToken]
    );

    const fetchUrlMappings = useCallback(async () => {
        setUrlMappingLoading(true);

        try {
            const response = await api.get("/redirects", authConfig());
            setUrlMappings(
                (response.data || []).filter(
                    (item) => item.is_url_rewrite === true || item.is_url_rewrite === 1
                )
            );
        } catch (error) {
            toast.error(
                errMsg(error, "Error fetching custom URL mappings.")
            );
        } finally {
            setUrlMappingLoading(false);
        }
    }, [authConfig]);

    useEffect(() => {
        fetchUrlMappings();
    }, [fetchUrlMappings]);

    const isEditingUnchangedUrls = (() => {
        if (!selectedMappingId || !originalUrlMapping) return false;

        return (
            urlMappingForm.old_url.trim() === originalUrlMapping.old_url.trim() &&
            urlMappingForm.new_url.trim() === originalUrlMapping.new_url.trim()
        );
    })();

    const openAddUrlMapping = () => {
        setSelectedMappingId(null);
        setOriginalUrlMapping(null);
        setUrlMappingForm({
            ...initialUrlMappingState,
            is_active: canPublish,
        });
        setUrlMappingStatus("idle");
    };

    const handleUrlMappingInput = (event) => {
        const { name, value, checked, type } = event.target;

        setUrlMappingForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : name === "status_code"
                        ? Number(value)
                        : value,
        }));
    };

    // Duplicate validation runs for new mappings and whenever an existing
    // mapping's old/new URL is changed. It is skipped for status-only edits.
    useEffect(() => {
        const oldUrl = urlMappingForm.old_url.trim();
        const newUrl = urlMappingForm.new_url.trim();

        if (!oldUrl || !newUrl) {
            setUrlMappingStatus("idle");
            return;
        }

        const unchangedExistingMapping =
            Boolean(selectedMappingId && originalUrlMapping) &&
            oldUrl === originalUrlMapping.old_url.trim() &&
            newUrl === originalUrlMapping.new_url.trim();

        if (unchangedExistingMapping) {
            setUrlMappingStatus("available");
            return;
        }

        setUrlMappingStatus("checking");

        let cancelled = false;
        const timer = setTimeout(async () => {
            try {
                const params = {
                    old_url: oldUrl,
                    new_url: newUrl,
                };

                if (selectedMappingId) {
                    params.excludeId = selectedMappingId;
                }

                const response = await api.get("/redirects/check", {
                    ...authConfig(),
                    params,
                });

                if (!cancelled) {
                    setUrlMappingStatus(
                        response.data?.available ? "available" : "taken"
                    );
                }
            } catch {
                if (!cancelled) {
                    setUrlMappingStatus("error");
                }
            }
        }, 350);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [
        urlMappingForm.old_url,
        urlMappingForm.new_url,
        selectedMappingId,
        originalUrlMapping,
        authConfig,
    ]);

    const saveUrlMapping = async (event) => {
        event.preventDefault();

        const oldUrl = urlMappingForm.old_url.trim();
        const newUrl = urlMappingForm.new_url.trim();

        if (!oldUrl.startsWith("/") || !newUrl.startsWith("/")) {
            return toast.error(
                "Enter both URLs as internal paths beginning with /."
            );
        }

        if (oldUrl === newUrl) {
            return toast.error(
                "Old URL and new URL cannot be the same."
            );
        }

        // When URLs are unchanged on an existing mapping, allow status-only
        // or 301/302-only updates without waiting for /redirects/check.
        if (!isEditingUnchangedUrls) {
            if (urlMappingStatus === "taken") {
                return toast.error(
                    "This URL mapping conflicts with an existing URL."
                );
            }

            if (urlMappingStatus === "checking") {
                return toast.info(
                    "Please wait for the duplicate check to finish."
                );
            }

            if (urlMappingStatus !== "available") {
                return toast.error(
                    "The URL availability could not be verified. Please check the URLs and try again."
                );
            }
        }

        const statusCode = Number(urlMappingForm.status_code);
        if (![301, 302].includes(statusCode)) {
            return toast.error("Redirect type must be 301 or 302.");
        }

        const payload = {
            old_url: oldUrl,
            new_url: newUrl,
            status_code: statusCode,
            is_active: canPublish ? urlMappingForm.is_active : false,
            is_url_rewrite: true,
        };

        try {
            if (!canPublish) {
                toast.info(getPublishWorkflowMessage("This URL mapping"));
            }

            if (selectedMappingId) {
                await api.patch(
                    `/redirects/${selectedMappingId}`,
                    payload,
                    authConfig()
                );
                toast.success("URL mapping updated successfully.");
            } else {
                await api.post("/redirects", payload, authConfig());
                toast.success("URL mapping created successfully.");
            }

            await fetchUrlMappings();
            document.getElementById("urlMappingModalClose")?.click();
        } catch (error) {
            toast.error(
                errMsg(error, "Unable to save this URL mapping.")
            );
        }
    };

    const editUrlMapping = (item) => {
        const original = {
            old_url: String(item.old_url || ""),
            new_url: String(item.new_url || ""),
        };

        setSelectedMappingId(item.id);
        setOriginalUrlMapping(original);
        setUrlMappingForm({
            ...original,
            status_code: Number(item.status_code) === 302 ? 302 : 301,
            is_active: canPublish
                ? item.is_active !== false && item.is_active !== 0
                : false,
        });

        // The currently stored URLs are already valid for this record.
        // This enables Update immediately when only status changes.
        setUrlMappingStatus("available");
    };

    const deleteUrlMapping = async (id) => {
        if (!canDelete) {
            toast.error(
                getDeletePermissionMessage("this URL mapping")
            );
            return;
        }

        if (
            !window.confirm(
                "Delete this URL mapping? The old URL will stop redirecting and the new URL will stop rewriting to the original page."
            )
        ) {
            return;
        }

        try {
            await api.delete(`/redirects/${id}`, authConfig());
            await fetchUrlMappings();
            toast.success("URL mapping deleted.");
        } catch (error) {
            toast.error(
                errMsg(error, "Failed to delete URL mapping.")
            );
        }
    };

    const visibleUrlMappings = urlMappings.filter((item) => {
        const query = urlSearch.trim().toLowerCase();
        if (!query) return true;

        return (
            String(item.old_url || "").toLowerCase().includes(query) ||
            String(item.new_url || "").toLowerCase().includes(query)
        );
    });

    const oldUrlValue = urlMappingForm.old_url.trim();
    const newUrlValue = urlMappingForm.new_url.trim();
    const canSaveUrlMapping =
        Boolean(oldUrlValue && newUrlValue) &&
        (isEditingUnchangedUrls || urlMappingStatus === "available");

    return (
        <AuthMainLayout>
            <div className="container-fluid my-5 px-4">
                {(!canPublish || !canDelete) && (
                    <div className="alert alert-info">
                        Editors can stage URL changes here. Publishing and delete access
                        can be granted separately by an admin.
                    </div>
                )}

                <div className="card border shadow-sm">
                    <div className="card-header bg-light py-3">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                <h2 className="h4 mb-1">Custom URL Changes</h2>
                                <p className="small text-muted mb-0">
                                    Change any public page path, including gallery pages
                                    and parent pages such as /product. Child URLs can
                                    follow parent path changes automatically.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={openAddUrlMapping}
                                className="btn btn-primary px-4 flex-shrink-0 ms-md-auto"
                                data-bs-toggle="modal"
                                data-bs-target="#urlMappingModal"
                            >
                                + Add URL Change
                            </button>
                        </div>
                    </div>

                    <div className="card-body p-3">
                                <div className="row g-2 align-items-center mb-4">
                                    <div className="col-12 col-md-8">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search old URL or new URL"
                                            value={urlSearch}
                                            onChange={(event) => setUrlSearch(event.target.value)}
                                        />
                                    </div>
                                    <div className="col-12 col-md-4 text-md-end">
                                        <span className="text-muted small">
                                            Showing {visibleUrlMappings.length} of {urlMappings.length} URL changes
                                        </span>
                                    </div>
                                </div>

                                {urlMappingLoading && !urlMappings.length ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status" />
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle border mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>SN</th>
                                                    <th>Old URL</th>
                                                    <th>New URL</th>
                                                    <th>Redirect</th>
                                                    <th>Status</th>
                                                    <th className="text-end">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {visibleUrlMappings.length > 0 ? (
                                                    visibleUrlMappings.map((item, index) => (
                                                        <tr key={item.id}>
                                                            <td className="text-muted fw-bold">{index + 1}</td>
                                                            <td className="text-danger fw-semibold text-break">{item.old_url}</td>
                                                            <td className="text-success fw-semibold text-break">{item.new_url}</td>
                                                            <td>
                                                                <span
                                                                    className={`badge ${
                                                                        Number(item.status_code) === 301
                                                                            ? "bg-primary"
                                                                            : "bg-warning text-dark"
                                                                    }`}
                                                                >
                                                                    {Number(item.status_code) === 301
                                                                        ? "301 Permanent"
                                                                        : "302 Temporary"}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {item.is_active === true || item.is_active === 1 ? (
                                                                    <span className="text-success fw-bold">Active</span>
                                                                ) : (
                                                                    <span className="text-muted">Inactive</span>
                                                                )}
                                                            </td>
                                                            <td className="text-end text-nowrap">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => editUrlMapping(item)}
                                                                    className="btn btn-sm btn-outline-primary me-2"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#urlMappingModal"
                                                                >
                                                                    Edit
                                                                </button>
                                                                {canDelete && (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => deleteUrlMapping(item.id)}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="text-center text-muted py-5">
                                                            {urlSearch.trim()
                                                                ? "No URL changes match your search."
                                                                : "No custom URL changes configured."}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                    </div>
                </div>
            </div>

            {/* Single modal for creating and editing all public URL mappings. */}
            <div className="modal fade" id="urlMappingModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form onSubmit={saveUrlMapping}>
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {selectedMappingId ? "Edit URL Change" : "Add URL Change"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>

                            <div className="modal-body p-4 bg-light row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-bold">Old URL *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="old_url"
                                        value={urlMappingForm.old_url}
                                        onChange={handleUrlMappingInput}
                                        placeholder="/design-idea/gallery?id=83"
                                        required
                                    />
                                    <small className="text-muted">
                                        Enter the current public path. Query strings such as ?id=83 are supported.
                                    </small>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">New URL *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="new_url"
                                        value={urlMappingForm.new_url}
                                        onChange={handleUrlMappingInput}
                                        placeholder="/design-idea/balcony"
                                        required
                                    />
                                    <small className="text-muted">
                                        The new public path will serve the mapped page content.
                                    </small>
                                </div>

                                {urlMappingStatus === "checking" && (
                                    <div className="col-12">
                                        <small className="text-muted">Checking for duplicate URLs...</small>
                                    </div>
                                )}

                                {urlMappingStatus === "available" && (
                                    <div className="col-12">
                                        <small className="text-success fw-semibold">
                                            {isEditingUnchangedUrls
                                                ? "Existing URL mapping is valid. You can update its status or redirect type."
                                                : "Both URLs are available."}
                                        </small>
                                    </div>
                                )}

                                {urlMappingStatus === "taken" && (
                                    <div className="col-12">
                                        <small className="text-danger fw-semibold">
                                            Duplicate or conflicting URL mapping. Choose another path.
                                        </small>
                                    </div>
                                )}

                                {urlMappingStatus === "error" && (
                                    <div className="col-12">
                                        <small className="text-danger fw-semibold">
                                            Could not verify URL availability. Check the backend connection and try again.
                                        </small>
                                    </div>
                                )}

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Redirect Type</label>
                                    <select
                                        className="form-select"
                                        name="status_code"
                                        value={urlMappingForm.status_code}
                                        onChange={handleUrlMappingInput}
                                    >
                                        <option value={301}>301 (Permanent)</option>
                                        <option value={302}>302 (Temporary)</option>
                                    </select>
                                </div>

                                <div className="col-md-6 d-flex align-items-end">
                                    <div className="form-check form-switch fs-5">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="is_active"
                                            id="urlMappingActive"
                                            checked={Boolean(urlMappingForm.is_active)}
                                            onChange={handleUrlMappingInput}
                                            disabled={!canPublish}
                                        />
                                        <label
                                            className="form-check-label ms-2 fs-6"
                                            htmlFor="urlMappingActive"
                                        >
                                            {canPublish ? "Active" : "Admin Publish Required"}
                                        </label>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="alert alert-info small mb-0">
                                        Parent path changes can also apply to child URLs. For an item-specific gallery change,
                                        include the old ?id= value, for example /design-idea/gallery?id=83.
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    id="urlMappingModalClose"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={!canSaveUrlMapping}
                                >
                                    {selectedMappingId ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthMainLayout>
    );
};

export default CmsSlugSettings;
