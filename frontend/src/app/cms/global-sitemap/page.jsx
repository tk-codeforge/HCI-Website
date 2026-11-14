// "use client";

// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { useSelector } from "react-redux";
// import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
// import api from "@/utils/api";
// import { toast } from "react-toastify";
// import { getCmsAccess, getDeletePermissionMessage, getPublishWorkflowMessage } from "@/utils/cmsAccess";
// import { DEFAULT_SITEMAP_CHANGE_FREQUENCY, DEFAULT_SITEMAP_PRIORITY, SITEMAP_CHANGE_FREQUENCY_OPTIONS } from "@/utils/seoHelpers";

// const SITE_URL = "https://hcinterior.in";
// const PAGE_SIZE = 100;

// // same mapping as the /services-detail/:city redirects in next.config
// const CITY_SLUG_PATHS = {
//     faridabad: "/best-interior-designers-in-faridabad",
//     gurugram: "/interior-designers-in-gurgaon",
//     greater_noida: "/interior-designers-in-greater-noida",
// };

// // "https://hcinterior.in/blog/x/?a=1" -> "/blog/x"
// const toPath = (value = "") => {
//     try {
//         const p = new URL(String(value).trim(), SITE_URL).pathname.replace(/\/+$/, "");
//         return p || "/";
//     } catch {
//         return "";
//     }
// };

// // every path that points to the same page (blog old/new form, city slug/services-detail form)
// const altPaths = (p) => {
//     const out = new Set([p]);
//     if (p.startsWith("/blog/")) out.add(p.slice(5));
//     else if (/^\/[^/]+$/.test(p)) out.add(`/blog${p}`);

//     const sd = p.match(/^\/services-detail\/([^/]+)$/);
//     if (sd) out.add(CITY_SLUG_PATHS[sd[1]] || `/interior-designers-in-${sd[1]}`);

//     Object.entries(CITY_SLUG_PATHS).forEach(([city, slugPath]) => {
//         if (p === slugPath) out.add(`/services-detail/${city}`);
//     });
//     const g = p.match(/^\/interior-designers-in-(.+)$/);
//     if (g) out.add(`/services-detail/${g[1]}`);

//     return [...out];
// };

// const isFalse = (v) => v === false || v === 0 || v === "0" || String(v).toLowerCase() === "false";
// const isExcluded = (row) => !!row && isFalse(row.include_in_sitemap);

// // the row the website reads: newest active match, else newest match
// const rowOrder = (a, b) =>
//     (b.status === "active") - (a.status === "active") ||
//     new Date(b.updated_at) - new Date(a.updated_at) ||
//     b.id - a.id;

// // sitemap-only form: include toggle, frequency, priority, status
// const SitemapForm = ({ initialData, onSubmit, canPublish, askPath = false }) => {
//     const [formData, setFormData] = useState({
//         page_name: "",
//         include_in_sitemap: true,
//         sitemap_change_frequency: DEFAULT_SITEMAP_CHANGE_FREQUENCY,
//         sitemap_priority: String(DEFAULT_SITEMAP_PRIORITY),
//         status: canPublish ? "active" : "inactive",
//     });

//     useEffect(() => {
//         if (!initialData) return;
//         const freq = String(initialData.sitemap_change_frequency || "").toLowerCase();
//         const prio = parseFloat(initialData.sitemap_priority);
//         setFormData({
//             page_name: initialData.page_name || "",
//             include_in_sitemap: !isFalse(initialData.include_in_sitemap ?? true),
//             sitemap_change_frequency: SITEMAP_CHANGE_FREQUENCY_OPTIONS.includes(freq) ? freq : DEFAULT_SITEMAP_CHANGE_FREQUENCY,
//             sitemap_priority: String(Number.isNaN(prio) ? DEFAULT_SITEMAP_PRIORITY : prio),
//             status: initialData.status || "inactive",
//         });
//     }, [initialData]);

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const prio = parseFloat(formData.sitemap_priority);
//         if (Number.isNaN(prio) || prio < 0 || prio > 1) {
//             toast.error("Sitemap priority must be between 0 and 1.");
//             return;
//         }
//         onSubmit({ ...formData, sitemap_priority: String(prio) });
//     };

//     return (
//         <form onSubmit={handleSubmit} className="row">
//             {askPath && (
//                 <div className="mb-3 col-md-12">
//                     <label className="form-label text-primary fw-bold">Route Path (e.g., /about-us)</label>
//                     <input type="text" className="form-control" name="page_name" value={formData.page_name} onChange={handleChange} placeholder="/about-us" required />
//                 </div>
//             )}

//             <div className="mb-3 col-md-12">
//                 <div className="form-check form-switch bg-light rounded border p-3">
//                     <input className="form-check-input" type="checkbox" role="switch" id="gsmIncludeToggle" name="include_in_sitemap" checked={Boolean(formData.include_in_sitemap)} onChange={handleChange} />
//                     <label className="form-check-label fw-bold ms-2" htmlFor="gsmIncludeToggle">Include in sitemap.xml</label>
//                 </div>
//             </div>

//             <div className="mb-3 col-md-6">
//                 <label className="form-label">Sitemap Frequency</label>
//                 <select className="form-control" name="sitemap_change_frequency" value={formData.sitemap_change_frequency} onChange={handleChange}>
//                     {SITEMAP_CHANGE_FREQUENCY_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
//                 </select>
//             </div>

//             <div className="mb-3 col-md-6">
//                 <label className="form-label">Sitemap Priority</label>
//                 <input type="number" className="form-control" name="sitemap_priority" min="0" max="1" step="0.1" value={formData.sitemap_priority} onChange={handleChange} />
//             </div>

//             <div className="mb-3 col-md-12">
//                 <label className="form-label">Status</label>
//                 <select className="form-control" name="status" value={formData.status} onChange={handleChange}>
//                     {canPublish && <option value="active">Active</option>}
//                     <option value="inactive">Inactive</option>
//                 </select>
//             </div>

//             <div className="m-auto mt-2 col-12 d-flex justify-content-center">
//                 <button className="px-5 btn btn-primary" type="submit">Save SEO Data</button>
//             </div>
//         </form>
//     );
// };

// const GlobalSitemap = () => {
//     const user = useSelector((state) => state.auth.user);
//     const authToken = useSelector((state) => state.auth.authToken);
//     const { canPublish, canDelete } = getCmsAccess(user);
//     const headers = { Authorization: `Bearer ${authToken}` };

//     const [sitemapUrls, setSitemapUrls] = useState([]);
//     const [rows, setRows] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [search, setSearch] = useState("");
//     const [filter, setFilter] = useState("all");
//     const [limit, setLimit] = useState(PAGE_SIZE);
//     const [editItem, setEditItem] = useState(null);
//     const [editData, setEditData] = useState(null);
//     const [addKey, setAddKey] = useState(0);

//     const fetchAll = useCallback(async () => {
//         setLoading(true);
//         setError("");
//         try {
//             const [xmlRes, rowsRes] = await Promise.all([
//                 fetch("/sitemap.xml", { cache: "no-store" }),
//                 api.get("/seo-tag", { headers: { Authorization: `Bearer ${authToken}` } }),
//             ]);
//             if (!xmlRes.ok) throw new Error("sitemap.xml could not be loaded");

//             const xml = new DOMParser().parseFromString(await xmlRes.text(), "application/xml");
//             const urls = Array.from(xml.getElementsByTagName("url"))
//                 .map((node) => {
//                     const get = (tag) => node.getElementsByTagName(tag)[0]?.textContent?.trim() || "";
//                     return { loc: get("loc"), lastmod: get("lastmod"), changefreq: get("changefreq"), priority: get("priority") };
//                 })
//                 .filter((u) => u.loc);

//             setSitemapUrls(urls);
//             setRows(Array.isArray(rowsRes.data) ? rowsRes.data : []);
//         } catch (err) {
//             setError("Failed to load the sitemap or SEO records. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     }, [authToken]);

//     useEffect(() => {
//         fetchAll();
//     }, [fetchAll]);

//     const rowsByPath = useMemo(() => {
//         const map = new Map();
//         rows.forEach((r) => {
//             const p = toPath(r.page_name);
//             if (!p) return;
//             if (!map.has(p)) map.set(p, []);
//             map.get(p).push(r);
//         });
//         return map;
//     }, [rows]);

//     const findRow = useCallback(
//         (path) => altPaths(path).flatMap((a) => rowsByPath.get(a) || []).sort(rowOrder)[0] || null,
//         [rowsByPath]
//     );

//     // sitemap.xml URLs + records that were removed from the sitemap (so they can be added back)
//     const items = useMemo(() => {
//         const used = new Set();
//         const list = sitemapUrls.map((u) => {
//             const path = toPath(u.loc);
//             const row = findRow(path);
//             if (row) used.add(row.id);
//             return { key: u.loc, loc: u.loc, path, lastmod: u.lastmod, changefreq: u.changefreq, priority: u.priority, row, inXml: true };
//         });
//         rows
//             .filter((r) => isExcluded(r) && !used.has(r.id))
//             .forEach((r) => {
//                 const path = toPath(r.page_name);
//                 list.push({ key: `row-${r.id}`, loc: `${SITE_URL}${path}`, path, lastmod: "", changefreq: r.sitemap_change_frequency || "", priority: r.sitemap_priority ?? "", row: r, inXml: false });
//             });
//         return list;
//     }, [sitemapUrls, rows, findRow]);

//     const visible = useMemo(() => {
//         const q = search.trim().toLowerCase();
//         return items.filter((i) => {
//             if (q && !i.loc.toLowerCase().includes(q)) return false;
//             if (filter === "excluded") return isExcluded(i.row);
//             if (filter === "included") return !isExcluded(i.row);
//             if (filter === "no-record") return !i.row;
//             return true;
//         });
//     }, [items, search, filter]);

//     const excludedCount = items.filter((i) => isExcluded(i.row)).length;

//     // ---------- ADD ----------
//     const handleCreate = async (formattedData) => {
//         const path = toPath(formattedData.page_name);
//         if (!path) { toast.error("Enter a valid route path, e.g. /about-us"); return; }
//         if (findRow(path)) { toast.error("A record for this URL already exists. Use Edit on that row instead."); return; }
//         try {
//             if (!canPublish && formattedData.status === "active") toast.info(getPublishWorkflowMessage("This SEO record"));
//             await api.post("/seo-tag", { ...formattedData, page_name: path, meta_robots: "index, follow" }, { headers });
//             document.getElementById("gsmAddModalClose").click();
//             toast.success("URL added.");
//             fetchAll();
//         } catch (err) {
//             toast.error("Failed to save data.");
//         }
//     };

//     // ---------- EDIT ----------
//     const handleEditClick = (item) => {
//         setEditItem(item);
//         if (item.row) {
//             const nextStatus = !canPublish && item.row.status === "active" ? "inactive" : (item.row.status || "active");
//             if (!canPublish && item.row.status === "active") {
//                 toast.info("Editing an active SEO record will save it as inactive until an admin republishes it.");
//             }
//             setEditData({
//                 page_name: item.row.page_name,
//                 include_in_sitemap: item.row.include_in_sitemap,
//                 sitemap_change_frequency: item.row.sitemap_change_frequency || item.changefreq,
//                 sitemap_priority: item.row.sitemap_priority ?? item.priority,
//                 status: nextStatus,
//             });
//         } else {
//             // URL comes from blogs / pages / cities and has no Global SEO record yet: saving creates a minimal one
//             setEditData({
//                 page_name: item.path,
//                 include_in_sitemap: true,
//                 sitemap_change_frequency: item.changefreq,
//                 sitemap_priority: item.priority,
//                 status: canPublish ? "active" : "inactive",
//             });
//         }
//     };

//     const handleUpdate = async (formattedData) => {
//         try {
//             if (!canPublish && formattedData.status === "active") toast.info(getPublishWorkflowMessage("This SEO record"));
//             const sitemapFields = {
//                 include_in_sitemap: formattedData.include_in_sitemap,
//                 sitemap_change_frequency: formattedData.sitemap_change_frequency,
//                 sitemap_priority: formattedData.sitemap_priority,
//                 status: formattedData.status,
//             };
//             if (editItem?.row) {
//                 // only the sitemap fields are sent, so the rest of the SEO record is left untouched
//                 await api.patch(`/seo-tag/${editItem.row.id}`, sitemapFields, { headers });
//             } else {
//                 await api.post("/seo-tag", { page_name: editItem.path, meta_robots: "index, follow", ...sitemapFields }, { headers });
//             }
//             document.getElementById("gsmEditModalClose").click();
//             toast.success("URL updated.");
//             fetchAll();
//         } catch (err) {
//             toast.error("Failed to update data.");
//         }
//     };

//     // ---------- DELETE ----------
//     // "Remove" keeps the SEO data and only switches "Include in sitemap" off (Edit can switch it back on)
//     const handleRemove = async (item) => {
//         if (!canPublish) { toast.error("Only admins can remove URLs from the sitemap."); return; }
//         const msg = item.row
//             ? "Remove this URL from the sitemap? Its SEO data is kept and you can add it back with Edit."
//             : "Remove this URL from the sitemap? A Global SEO record will be created for it with 'Include in sitemap' switched off.";
//         if (!window.confirm(msg)) return;
//         try {
//             if (item.row) {
//                 await api.patch(`/seo-tag/${item.row.id}`, { include_in_sitemap: false }, { headers });
//             } else {
//                 await api.post(
//                     "/seo-tag",
//                     { page_name: item.path, include_in_sitemap: false, meta_robots: "index, follow", status: "active" },
//                     { headers }
//                 );
//             }
//             toast.success("URL removed from the sitemap.");
//             fetchAll();
//         } catch (err) {
//             toast.error("Failed to remove the URL.");
//         }
//     };

//     // permanently deletes the Global SEO record (only offered for URLs that are already removed)
//     const handleDeleteRecord = async (item) => {
//         if (!canDelete) { toast.error(getDeletePermissionMessage("this SEO record")); return; }
//         if (!window.confirm("Permanently delete this SEO record? Its title, description and other SEO data will be lost.")) return;
//         try {
//             await api.delete(`/seo-tag/${item.row.id}`, { headers });
//             toast.success("SEO record deleted.");
//             fetchAll();
//         } catch (err) {
//             toast.error("Failed to delete the record.");
//         }
//     };

//     return (
//         <AuthMainLayout>
//             <div className="container my-5">
//                 <h1 className="mb-2 text-center">Global Sitemap</h1>
//                 <p className="text-center text-muted mb-4">
//                     All URLs currently listed in <a href="/sitemap.xml" target="_blank" rel="noreferrer">/sitemap.xml</a>. The sitemap refreshes about a minute after a change.
//                 </p>

//                 {!canPublish && (
//                     <div className="alert alert-info">
//                         Editors can prepare entries here. Publishing and removing URLs needs an admin.
//                     </div>
//                 )}

//                 <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
//                     <div className="d-flex flex-wrap gap-2">
//                         <input
//                             type="search"
//                             className="form-control"
//                             style={{ minWidth: 260 }}
//                             placeholder="Search URLs..."
//                             value={search}
//                             onChange={(e) => { setSearch(e.target.value); setLimit(PAGE_SIZE); }}
//                         />
//                         <select className="form-select" style={{ width: 190 }} value={filter} onChange={(e) => { setFilter(e.target.value); setLimit(PAGE_SIZE); }}>
//                             <option value="all">All URLs</option>
//                             <option value="included">In sitemap</option>
//                             <option value="excluded">Removed from sitemap</option>
//                             <option value="no-record">No SEO record</option>
//                         </select>
//                     </div>
//                     <div className="d-flex gap-2">
//                         <button type="button" className="btn btn-outline-secondary" onClick={fetchAll}>Refresh</button>
//                         <button
//                             type="button"
//                             className="btn btn-primary"
//                             data-bs-toggle="modal"
//                             data-bs-target="#gsmAddModal"
//                             onClick={() => setAddKey((k) => k + 1)}
//                         >
//                             Add New URL
//                         </button>
//                     </div>
//                 </div>

//                 {!loading && !error && (
//                     <p className="text-muted small mb-2">
//                         {items.length} URLs ({excludedCount} removed) &middot; showing {Math.min(visible.length, limit)} of {visible.length}
//                     </p>
//                 )}

//                 {loading ? (
//                     <div className="text-center">Loading...</div>
//                 ) : error ? (
//                     <div className="text-center alert alert-danger">{error}</div>
//                 ) : (
//                     <div className="table-responsive">
//                         <table className="table display table-striped table-bordered" style={{ width: "100%" }}>
//                             <thead>
//                                 <tr>
//                                     <th>SN</th>
//                                     <th>URL</th>
//                                     <th>Last Modified</th>
//                                     <th>Frequency</th>
//                                     <th>Priority</th>
//                                     <th>SEO Record</th>
//                                     <th>Sitemap</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {visible.slice(0, limit).map((item, index) => {
//                                     const excluded = isExcluded(item.row);
//                                     return (
//                                         <tr key={item.key} className={excluded ? "table-secondary" : ""}>
//                                             <td>{index + 1}</td>
//                                             <td style={{ wordBreak: "break-all" }}>
//                                                 <a href={item.loc} target="_blank" rel="noreferrer"><strong>{item.path}</strong></a>
//                                             </td>
//                                             <td>{item.lastmod ? item.lastmod.slice(0, 10) : "-"}</td>
//                                             <td>{item.changefreq || "-"}</td>
//                                             <td>{item.priority !== "" && item.priority != null ? item.priority : "-"}</td>
//                                             <td>
//                                                 <span className={`badge ${item.row ? "bg-info" : "bg-light text-dark border"}`}>
//                                                     {item.row ? (item.row.status === "active" ? "Active" : "Inactive") : "None"}
//                                                 </span>
//                                             </td>
//                                             <td>
//                                                 <span className={`badge ${excluded ? "bg-secondary" : "bg-success"}`}>
//                                                     {excluded ? (item.inXml ? "Removed (refreshing)" : "Removed") : "Included"}
//                                                 </span>
//                                             </td>
//                                             <td style={{ whiteSpace: "nowrap" }}>
//                                                 <button
//                                                     onClick={() => handleEditClick(item)}
//                                                     className="btn btn-sm btn-primary"
//                                                     data-bs-toggle="modal"
//                                                     data-bs-target="#gsmEditModal"
//                                                 >
//                                                     Edit
//                                                 </button>
//                                                 {!excluded && (
//                                                     <button className="ms-2 btn btn-sm btn-danger" onClick={() => handleRemove(item)}>Delete</button>
//                                                 )}
//                                                 {excluded && item.row && canDelete && (
//                                                     <button className="ms-2 btn btn-sm btn-outline-danger" onClick={() => handleDeleteRecord(item)}>Delete record</button>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                                 {visible.length === 0 && (
//                                     <tr><td colSpan={8} className="text-center text-muted">No URLs found.</td></tr>
//                                 )}
//                             </tbody>
//                         </table>
//                         {visible.length > limit && (
//                             <div className="text-center mb-3">
//                                 <button type="button" className="btn btn-outline-primary" onClick={() => setLimit((l) => l + PAGE_SIZE)}>Show more</button>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* ADD NEW URL MODAL */}
//             <div className="modal fade" id="gsmAddModal" tabIndex="-1" aria-hidden="true">
//                 <div className="modal-dialog modal-lg">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5">Add New URL</h1>
//                             <button type="button" className="btn-close" id="gsmAddModalClose" data-bs-dismiss="modal"></button>
//                         </div>
//                         <div className="modal-body">
//                             <SitemapForm key={addKey} askPath initialData={null} onSubmit={handleCreate} canPublish={canPublish} />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* EDIT URL MODAL */}
//             <div className="modal fade" id="gsmEditModal" tabIndex="-1" aria-hidden="true">
//                 <div className="modal-dialog modal-lg">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5">Edit URL</h1>
//                             <button type="button" className="btn-close" id="gsmEditModalClose" data-bs-dismiss="modal"></button>
//                         </div>
//                         <div className="modal-body">
//                             {editItem && (
//                                 <p className="mb-3" style={{ wordBreak: "break-all" }}>
//                                     <span className="text-muted">URL: </span><strong>{editItem.path}</strong>
//                                 </p>
//                             )}
//                             {editItem && !editItem.row && (
//                                 <div className="alert alert-warning py-2">
//                                     This URL has no Global SEO record yet. Saving creates a minimal one with only these sitemap settings.
//                                 </div>
//                             )}
//                             {editData && (
//                                 <SitemapForm key={editItem?.key} initialData={editData} onSubmit={handleUpdate} canPublish={canPublish} />
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AuthMainLayout>
//     );
// };

// export default GlobalSitemap;



"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { getCmsAccess, getDeletePermissionMessage, getPublishWorkflowMessage } from "@/utils/cmsAccess";
import { DEFAULT_SITEMAP_CHANGE_FREQUENCY, DEFAULT_SITEMAP_PRIORITY, SITEMAP_CHANGE_FREQUENCY_OPTIONS } from "@/utils/seoHelpers";

const SITE_URL = "https://hcinterior.in";
const PAGE_SIZE = 100;

// same mapping as the /services-detail/:city redirects in next.config
const CITY_SLUG_PATHS = {
    faridabad: "/best-interior-designers-in-faridabad",
    gurugram: "/interior-designers-in-gurgaon",
    greater_noida: "/interior-designers-in-greater-noida",
};

// "https://hcinterior.in/blog/x/?a=1" -> "/blog/x"
const toPath = (value = "") => {
    try {
        const p = new URL(String(value).trim(), SITE_URL).pathname.replace(/\/+$/, "");
        return p || "/";
    } catch {
        return "";
    }
};

// every path that points to the same page (blog old/new form, city slug/services-detail form)
const altPaths = (p) => {
    const out = new Set([p]);
    if (p.startsWith("/blog/")) out.add(p.slice(5));
    else if (/^\/[^/]+$/.test(p)) out.add(`/blog${p}`);

    const sd = p.match(/^\/services-detail\/([^/]+)$/);
    if (sd) out.add(CITY_SLUG_PATHS[sd[1]] || `/interior-designers-in-${sd[1]}`);

    Object.entries(CITY_SLUG_PATHS).forEach(([city, slugPath]) => {
        if (p === slugPath) out.add(`/services-detail/${city}`);
    });
    const g = p.match(/^\/interior-designers-in-(.+)$/);
    if (g) out.add(`/services-detail/${g[1]}`);

    return [...out];
};

const isFalse = (v) => v === false || v === 0 || v === "0" || String(v).toLowerCase() === "false";
const isExcluded = (row) => !!row && isFalse(row.include_in_sitemap);

// the row the website reads: newest active match, else newest match
const rowOrder = (a, b) =>
    (b.status === "active") - (a.status === "active") ||
    new Date(b.updated_at) - new Date(a.updated_at) ||
    b.id - a.id;

// sitemap-only form: include toggle, frequency, priority, status
const SitemapForm = ({ initialData, onSubmit, canPublish, askPath = false }) => {
    const [formData, setFormData] = useState({
        page_name: "",
        include_in_sitemap: true,
        sitemap_change_frequency: DEFAULT_SITEMAP_CHANGE_FREQUENCY,
        sitemap_priority: String(DEFAULT_SITEMAP_PRIORITY),
        status: canPublish ? "active" : "inactive",
    });

    useEffect(() => {
        if (!initialData) return;
        const freq = String(initialData.sitemap_change_frequency || "").toLowerCase();
        const prio = parseFloat(initialData.sitemap_priority);
        setFormData({
            page_name: initialData.page_name || "",
            include_in_sitemap: !isFalse(initialData.include_in_sitemap ?? true),
            sitemap_change_frequency: SITEMAP_CHANGE_FREQUENCY_OPTIONS.includes(freq) ? freq : DEFAULT_SITEMAP_CHANGE_FREQUENCY,
            sitemap_priority: String(Number.isNaN(prio) ? DEFAULT_SITEMAP_PRIORITY : prio),
            status: initialData.status || "inactive",
        });
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const prio = parseFloat(formData.sitemap_priority);
        if (Number.isNaN(prio) || prio < 0 || prio > 1) {
            toast.error("Sitemap priority must be between 0 and 1.");
            return;
        }
        onSubmit({ ...formData, sitemap_priority: String(prio) });
    };

    return (
        <form onSubmit={handleSubmit} className="row">
            {askPath && (
                <div className="mb-3 col-md-12">
                    <label className="form-label text-primary fw-bold">Route Path (e.g., /about-us)</label>
                    <input type="text" className="form-control" name="page_name" value={formData.page_name} onChange={handleChange} placeholder="/about-us" required />
                </div>
            )}

            <div className="mb-3 col-md-12">
                <div className="form-check form-switch bg-light rounded border p-3">
                    <input className="form-check-input" type="checkbox" role="switch" id="gsmIncludeToggle" name="include_in_sitemap" checked={Boolean(formData.include_in_sitemap)} onChange={handleChange} />
                    <label className="form-check-label fw-bold ms-2" htmlFor="gsmIncludeToggle">Include in sitemap.xml</label>
                </div>
            </div>

            <div className="mb-3 col-md-6">
                <label className="form-label">Sitemap Frequency</label>
                <select className="form-control" name="sitemap_change_frequency" value={formData.sitemap_change_frequency} onChange={handleChange}>
                    {SITEMAP_CHANGE_FREQUENCY_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
                </select>
            </div>

            <div className="mb-3 col-md-6">
                <label className="form-label">Sitemap Priority</label>
                <input type="number" className="form-control" name="sitemap_priority" min="0" max="1" step="0.1" value={formData.sitemap_priority} onChange={handleChange} />
            </div>

            <div className="mb-3 col-md-12">
                <label className="form-label">Status</label>
                <select className="form-control" name="status" value={formData.status} onChange={handleChange}>
                    {canPublish && <option value="active">Active</option>}
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div className="m-auto mt-2 col-12 d-flex justify-content-center">
                <button className="px-5 btn btn-primary" type="submit">Save Sitemap Settings</button>
            </div>
        </form>
    );
};

// Settings saved on this page live in ONE hidden record (read by app/sitemap.js), so URLs can be added,
// included, removed and given a frequency / priority without creating a Global SEO record.
// The record is hidden on the Global SEO Tags page.
const MANAGER_KEY = "__sitemap_manager__";

const findManagerRow = (all = []) => {
    const holders = all.filter((r) => r?.page_name === MANAGER_KEY);
    return holders.find((r) => r.status === "active") || holders[0] || null;
};

const readConfig = (holder) => {
    try {
        const raw = typeof holder?.custom_schema === "string" ? JSON.parse(holder.custom_schema) : holder?.custom_schema;
        return raw?.urls && typeof raw.urls === "object" ? raw.urls : {};
    } catch {
        return {};
    }
};

const GlobalSitemap = () => {
    const user = useSelector((state) => state.auth.user);
    const authToken = useSelector((state) => state.auth.authToken);
    const { canPublish, canDelete } = getCmsAccess(user);
    const headers = { Authorization: `Bearer ${authToken}` };

    const [sitemapUrls, setSitemapUrls] = useState([]);
    const [rows, setRows] = useState([]);
    const [config, setConfig] = useState({}); // sitemap-only settings per URL (no SEO record needed)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [limit, setLimit] = useState(PAGE_SIZE);
    const [editItem, setEditItem] = useState(null);
    const [editData, setEditData] = useState(null);
    const [addKey, setAddKey] = useState(0);

    // Opened from the admin search bar (?highlight=/some/path, or picked while already on this page):
    // filter the table to that URL so the row is on the first page.
    useEffect(() => {
        const fromUrl = new URLSearchParams(window.location.search).get("highlight");
        if (fromUrl) setSearch(fromUrl);
        const onPick = (event) => {
            if (!event.detail) return;
            setSearch(String(event.detail));
            setLimit(PAGE_SIZE);
        };
        window.addEventListener("hc:highlight", onPick);
        return () => window.removeEventListener("hc:highlight", onPick);
    }, []);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const [xmlRes, rowsRes] = await Promise.all([
                fetch("/sitemap.xml", { cache: "no-store" }),
                api.get("/seo-tag", { headers: { Authorization: `Bearer ${authToken}` } }),
            ]);
            if (!xmlRes.ok) throw new Error("sitemap.xml could not be loaded");

            const xml = new DOMParser().parseFromString(await xmlRes.text(), "application/xml");
            const urls = Array.from(xml.getElementsByTagName("url"))
                .map((node) => {
                    const get = (tag) => node.getElementsByTagName(tag)[0]?.textContent?.trim() || "";
                    return { loc: get("loc"), lastmod: get("lastmod"), changefreq: get("changefreq"), priority: get("priority") };
                })
                .filter((u) => u.loc);

            const all = Array.isArray(rowsRes.data) ? rowsRes.data : [];
            setSitemapUrls(urls);
            // the hidden settings record is not a page: keep it out of the list
            setRows(all.filter((r) => r.page_name !== MANAGER_KEY));
            setConfig(readConfig(findManagerRow(all)));
        } catch (err) {
            setError("Failed to load the sitemap or SEO records. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const rowsByPath = useMemo(() => {
        const map = new Map();
        rows.forEach((r) => {
            const p = toPath(r.page_name);
            if (!p) return;
            if (!map.has(p)) map.set(p, []);
            map.get(p).push(r);
        });
        return map;
    }, [rows]);

    const findRow = useCallback(
        (path) => altPaths(path).flatMap((a) => rowsByPath.get(a) || []).sort(rowOrder)[0] || null,
        [rowsByPath]
    );

    // Everything the page can manage:
    //  1) every URL of sitemap.xml
    //  2) URLs saved on this page that are not in sitemap.xml (yet): added here, removed, or waiting for the refresh
    //  3) Global SEO records that are not in sitemap.xml (removed ones, and ones that never made it in)
    const items = useMemo(() => {
        const used = new Set();
        const listed = new Set();
        const list = [];

        sitemapUrls.forEach((u) => {
            const path = toPath(u.loc);
            const row = findRow(path);
            if (row) used.add(row.id);
            listed.add(path);
            list.push({ key: u.loc, loc: u.loc, path, lastmod: u.lastmod, changefreq: u.changefreq, priority: u.priority, row, cfg: config[path] || null, inXml: true });
        });

        Object.entries(config).forEach(([path, cfg]) => {
            if (!path || listed.has(path)) return;
            const row = findRow(path);
            if (row) used.add(row.id);
            listed.add(path);
            list.push({ key: `cfg-${path}`, loc: `${SITE_URL}${path}`, path, lastmod: cfg.updated_at || "", changefreq: cfg.frequency || "", priority: cfg.priority ?? "", row, cfg, inXml: false });
        });

        rows
            .filter((r) => !used.has(r.id))
            .forEach((r) => {
                const path = toPath(r.page_name);
                if (!path || listed.has(path)) return;
                listed.add(path);
                list.push({ key: `row-${r.id}`, loc: `${SITE_URL}${path}`, path, lastmod: "", changefreq: r.sitemap_change_frequency || "", priority: r.sitemap_priority ?? "", row: r, cfg: null, inXml: false });
            });
        return list;
    }, [sitemapUrls, rows, config, findRow]);

    // settings saved on this page win over the SEO record (same rule as sitemap.js)
    const cfgActive = (cfg) => !!cfg && cfg.status !== "inactive";
    const itemExcluded = (item) =>
        cfgActive(item.cfg) && typeof item.cfg.include === "boolean" ? item.cfg.include === false : isExcluded(item.row);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return items.filter((i) => {
            if (q && !i.loc.toLowerCase().includes(q)) return false;
            const excluded = itemExcluded(i);
            if (filter === "excluded") return excluded;
            if (filter === "included") return !excluded;
            if (filter === "pending") return !i.inXml && !excluded;
            if (filter === "no-record") return !i.row;
            return true;
        });
    }, [items, search, filter]);

    const excludedCount = items.filter(itemExcluded).length;

    // ---------- save (sitemap-only settings, no Global SEO record) ----------
    // Reads the latest settings first so two people editing at once don't overwrite each other.
    const saveConfig = async (mutate) => {
        const res = await api.get("/seo-tag", { headers });
        const all = Array.isArray(res.data) ? res.data : [];
        const holder = findManagerRow(all);
        const nextUrls = mutate({ ...readConfig(holder) });
        const payload = { urls: nextUrls };
        if (holder) {
            await api.patch(
                `/seo-tag/${holder.id}`,
                { custom_schema: payload, ...(canPublish && holder.status !== "active" ? { status: "active" } : {}) },
                { headers }
            );
        } else {
            if (!canPublish) throw new Error("NEEDS_ADMIN");
            await api.post(
                "/seo-tag",
                { page_name: MANAGER_KEY, meta_robots: "index, follow", include_in_sitemap: false, status: "active", custom_schema: payload },
                { headers }
            );
        }
    };

    const writeEntry = (path, patch) =>
        saveConfig((urls) => ({ ...urls, [path]: { ...(urls[path] || {}), ...patch, updated_at: new Date().toISOString() } }));

    const failMessage = (err, fallback) =>
        err?.message === "NEEDS_ADMIN" ? "An admin has to make the first sitemap change on this site." : fallback;

    // ---------- ADD ----------
    const handleCreate = async (formattedData) => {
        const path = toPath(formattedData.page_name);
        if (!path) { toast.error("Enter a valid route path, e.g. /about-us"); return; }
        if (items.some((i) => i.path === path)) { toast.error("This URL is already in the list. Use Edit on that row instead."); return; }
        try {
            if (!canPublish && formattedData.status === "active") toast.info(getPublishWorkflowMessage("This sitemap URL"));
            await writeEntry(path, {
                include: formattedData.include_in_sitemap !== false,
                frequency: formattedData.sitemap_change_frequency,
                priority: parseFloat(formattedData.sitemap_priority),
                status: formattedData.status,
                custom: true,
            });
            document.getElementById("gsmAddModalClose").click();
            toast.success("URL added to the sitemap.");
            fetchAll();
        } catch (err) {
            toast.error(failMessage(err, "Failed to save data."));
        }
    };

    // ---------- EDIT ----------
    const handleEditClick = (item) => {
        setEditItem(item);
        const prio = parseFloat(item.cfg?.priority ?? item.row?.sitemap_priority ?? item.priority);
        setEditData({
            page_name: item.path,
            include_in_sitemap: !itemExcluded(item),
            sitemap_change_frequency: item.cfg?.frequency || item.row?.sitemap_change_frequency || item.changefreq,
            sitemap_priority: Number.isNaN(prio) ? DEFAULT_SITEMAP_PRIORITY : prio,
            status: canPublish ? "active" : "inactive",
        });
    };

    const handleUpdate = async (formattedData) => {
        try {
            if (!canPublish && formattedData.status === "active") toast.info(getPublishWorkflowMessage("This sitemap URL"));
            await writeEntry(editItem.path, {
                include: formattedData.include_in_sitemap !== false,
                frequency: formattedData.sitemap_change_frequency,
                priority: parseFloat(formattedData.sitemap_priority),
                status: formattedData.status,
                // a URL that is not in sitemap.xml has to be added by the sitemap itself
                custom: editItem.inXml ? !!editItem.cfg?.custom : true,
            });
            document.getElementById("gsmEditModalClose").click();
            toast.success("Sitemap settings saved.");
            fetchAll();
        } catch (err) {
            toast.error(failMessage(err, "Failed to update data."));
        }
    };

    // ---------- REMOVE / INCLUDE ----------
    // URLs added on this page are deleted; every other URL is only switched off (Include / Edit switches it back on)
    const handleRemove = async (item) => {
        if (!canPublish) { toast.error("Only admins can remove URLs from the sitemap."); return; }
        const addedHere = !!item.cfg?.custom;
        const msg = addedHere
            ? "Delete this URL from the sitemap? It was added on this page, so it will disappear from the list."
            : "Remove this URL from the sitemap? You can include it again later. No SEO data is changed.";
        if (!window.confirm(msg)) return;
        try {
            if (addedHere) {
                await saveConfig((urls) => {
                    const next = { ...urls };
                    delete next[item.path];
                    return next;
                });
            } else {
                await writeEntry(item.path, { include: false, status: "active", custom: !!item.cfg?.custom });
            }
            toast.success(addedHere ? "URL deleted." : "URL removed from the sitemap.");
            fetchAll();
        } catch (err) {
            toast.error(failMessage(err, "Failed to remove the URL."));
        }
    };

    const handleInclude = async (item) => {
        if (!canPublish) { toast.error("Only admins can add URLs back to the sitemap."); return; }
        try {
            await writeEntry(item.path, { include: true, status: "active", custom: item.inXml ? !!item.cfg?.custom : true });
            toast.success("URL included in the sitemap.");
            fetchAll();
        } catch (err) {
            toast.error(failMessage(err, "Failed to include the URL."));
        }
    };

    // permanently deletes a Global SEO record (only offered for URLs that are already removed)
    const handleDeleteRecord = async (item) => {
        if (!canDelete) { toast.error(getDeletePermissionMessage("this SEO record")); return; }
        if (!window.confirm("Permanently delete this SEO record? Its title, description and other SEO data will be lost.")) return;
        try {
            await api.delete(`/seo-tag/${item.row.id}`, { headers });
            toast.success("SEO record deleted.");
            fetchAll();
        } catch (err) {
            toast.error("Failed to delete the record.");
        }
    };

    const sitemapBadge = (item, excluded) => {
        if (item.cfg && item.cfg.status === "inactive") return { cls: "bg-warning text-dark", text: "Pending approval" };
        if (excluded) return { cls: "bg-secondary", text: item.inXml ? "Removed (refreshing)" : "Removed" };
        if (!item.inXml) return { cls: "bg-warning text-dark", text: "Not in sitemap.xml yet" };
        return { cls: "bg-success", text: "Included" };
    };

    return (
        <AuthMainLayout>
            <div className="container my-5">
                <h1 className="mb-2 text-center">Global Sitemap</h1>
                <p className="text-center text-muted mb-4">
                    URLs listed in <a href="/sitemap.xml" target="_blank" rel="noreferrer">/sitemap.xml</a> plus the URLs you add here. Add, include, remove and change frequency / priority directly &mdash; no Global SEO record is needed. The sitemap refreshes about a minute after a change.
                </p>

                {!canPublish && (
                    <div className="alert alert-info">
                        Editors can prepare entries here. Publishing and removing URLs needs an admin.
                    </div>
                )}

                <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
                    <div className="d-flex flex-wrap gap-2">
                        <input
                            type="search"
                            className="form-control"
                            style={{ minWidth: 260 }}
                            placeholder="Search URLs..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setLimit(PAGE_SIZE); }}
                        />
                        <select className="form-select" style={{ width: 210 }} value={filter} onChange={(e) => { setFilter(e.target.value); setLimit(PAGE_SIZE); }}>
                            <option value="all">All URLs</option>
                            <option value="included">In sitemap</option>
                            <option value="excluded">Removed from sitemap</option>
                            <option value="pending">Not in sitemap.xml yet</option>
                            <option value="no-record">No SEO record</option>
                        </select>
                    </div>
                    <div className="d-flex gap-2">
                        <button type="button" className="btn btn-outline-secondary" onClick={fetchAll}>Refresh</button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#gsmAddModal"
                            onClick={() => setAddKey((k) => k + 1)}
                        >
                            Add New URL
                        </button>
                    </div>
                </div>

                {!loading && !error && (
                    <p className="text-muted small mb-2">
                        {items.length} URLs ({excludedCount} removed) &middot; showing {Math.min(visible.length, limit)} of {visible.length}
                    </p>
                )}

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : error ? (
                    <div className="text-center alert alert-danger">{error}</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table display table-striped table-bordered" style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>URL</th>
                                    <th>Last Modified</th>
                                    <th>Frequency</th>
                                    <th>Priority</th>
                                    <th>SEO Record</th>
                                    <th>Sitemap</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visible.slice(0, limit).map((item, index) => {
                                    const excluded = itemExcluded(item);
                                    const badge = sitemapBadge(item, excluded);
                                    return (
                                        <tr key={item.key} className={excluded ? "table-secondary" : ""}>
                                            <td>{index + 1}</td>
                                            <td style={{ wordBreak: "break-all" }}>
                                                <a href={item.loc} target="_blank" rel="noreferrer"><strong>{item.path}</strong></a>
                                            </td>
                                            <td>{item.lastmod ? item.lastmod.slice(0, 10) : "-"}</td>
                                            <td>{item.changefreq || "-"}</td>
                                            <td>{item.priority !== "" && item.priority != null ? item.priority : "-"}</td>
                                            <td>
                                                <span className={`badge ${item.row ? "bg-info" : "bg-light text-dark border"}`}>
                                                    {item.row ? (item.row.status === "active" ? "Active" : "Inactive") : "None"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${badge.cls}`}>{badge.text}</span>
                                            </td>
                                            <td style={{ whiteSpace: "nowrap" }}>
                                                <button
                                                    onClick={() => handleEditClick(item)}
                                                    className="btn btn-sm btn-primary"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#gsmEditModal"
                                                >
                                                    Edit
                                                </button>
                                                {!excluded && (
                                                    <button className="ms-2 btn btn-sm btn-danger" onClick={() => handleRemove(item)}>Delete</button>
                                                )}
                                                {excluded && (
                                                    <button className="ms-2 btn btn-sm btn-success" onClick={() => handleInclude(item)}>Include</button>
                                                )}
                                                {excluded && item.row && canDelete && (
                                                    <button className="ms-2 btn btn-sm btn-outline-danger" onClick={() => handleDeleteRecord(item)}>Delete SEO record</button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {visible.length === 0 && (
                                    <tr><td colSpan={8} className="text-center text-muted">No URLs found.</td></tr>
                                )}
                            </tbody>
                        </table>
                        {visible.length > limit && (
                            <div className="text-center mb-3">
                                <button type="button" className="btn btn-outline-primary" onClick={() => setLimit((l) => l + PAGE_SIZE)}>Show more</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ADD NEW URL MODAL */}
            <div className="modal fade" id="gsmAddModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Add New URL</h1>
                            <button type="button" className="btn-close" id="gsmAddModalClose" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="alert alert-light border py-2 small">
                                The URL is added to the sitemap only. No Global SEO record is created.
                            </div>
                            <SitemapForm key={addKey} askPath initialData={null} onSubmit={handleCreate} canPublish={canPublish} />
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT URL MODAL */}
            <div className="modal fade" id="gsmEditModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Edit URL</h1>
                            <button type="button" className="btn-close" id="gsmEditModalClose" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            {editItem && (
                                <p className="mb-3" style={{ wordBreak: "break-all" }}>
                                    <span className="text-muted">URL: </span><strong>{editItem.path}</strong>
                                </p>
                            )}
                            <div className="alert alert-light border py-2 small">
                                These settings are saved for the sitemap only. Global SEO data is not created or changed.
                            </div>
                            {editData && (
                                <SitemapForm key={editItem?.key} initialData={editData} onSubmit={handleUpdate} canPublish={canPublish} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthMainLayout>
    );
};

export default GlobalSitemap;

