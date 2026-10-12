"use client";

import { useSelector } from "react-redux";
import { getCmsAccess, getPublishWorkflowMessage } from "@/utils/cmsAccess";
import GlobalSeoForm from "@/app/components/GlobalSeoForm";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaCloudUploadAlt } from "react-icons/fa";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

const EP = {
  centers: "/cms-experience-center", 
  children: "/experience-center-assets",
  seo: "/seo-tag",
};
const CHILD_IMAGE_TYPE = "experience_center";
const CHILD_VIDEO_TYPE = "experience_center_video";
const CHILD_GALLERY_IMAGE_TYPE = "experience_center_gallery_image";
const HEADING_TAG_OPTIONS = ["h1", "h2", "h3", "h4", "h5", "h6"];
const MAX_IMAGE_BYTES = 200 * 1024;

const validateImage = (file) => {
  if (file.type !== "image/webp") {
    toast.error("Only .webp images are allowed.");
    return false;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    toast.error(`Image must be 200 KB or smaller (selected: ${Math.round(file.size / 1024)} KB).`);
    return false;
  }
  return true;
};

const HCI_ORANGE = "#ff914d";
const SITE_URL = "https://hcinterior.in";

const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

// Public route only renders slugs that start with "experience-center-"
const getSlug = (center) =>
  center?.slug
    ? center.slug
    : `experience-center-${slugify(center?.title || "")}`;

// const EMPTY_SEO = {
//   page_name: "",
//   canonical_url: "",
//   meta_title: "",
// meta_description: "",
// keywords: "",
//   robots_index: "index",
//   robots_follow: "follow",
//   include_in_sitemap: true,
//   sitemap_frequency: "monthly",
//   sitemap_priority: "0.8",
// };

const stripSlash = (s = "") => String(s).replace(/^\/+/, "");

const parseRobots = (v = "") => {
  const parts = String(v || "").toLowerCase().split(",").map((x) => x.trim());
  return {
    robots_index: parts.includes("noindex") ? "noindex" : "index",
    robots_follow: parts.includes("nofollow") ? "nofollow" : "follow",
  };
};

// Same path normalisation the backend uses to match seo_tag rows
const normPath = (v) => {
  let p = String(v || "").trim().toLowerCase().replace(/^https?:\/\/(www\.)?hcinterior\.in/, "").split(/[?#]/)[0];
  if (!p.startsWith("/")) p = "/" + p;
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p;
};

// Bottom-row layout of the live page, in upload order starting at index 2.
// Mirrors src/app/experience-center/[experience-center]/page.jsx exactly:
// cards 3–7 (index 2..6) keep the fixed hand-built layout below, and every
// card after that (index 7+, unlimited) is paired two-per-row — with a
// trailing single left over spanning the full row instead of sitting next
// to empty space.
const FIXED_ROW_LAYOUT = [
  { basis: "100%" }, // card 3
  { basis: "75%" }, // card 4
  { basis: "25%" }, // card 5
  { basis: "50%" }, // card 6
  { basis: "50%" }, // card 7
];

// Turns a flat list of "card 3+" images into pattern-tagged slots: the
// fixed layout for the first 5, then paired slots (or a full-width single
// for a trailing odd one out) for everything after.
const buildBottomSlots = (imgsFrom2) => {
  const fixed = imgsFrom2.slice(0, 5).map((img, i) => ({ img, basis: FIXED_ROW_LAYOUT[i].basis }));
  const extra = imgsFrom2.slice(5);
  const extraSlots = extra.map((img, i) => {
    const isLastOdd = i === extra.length - 1 && extra.length % 2 === 1;
    return { img, basis: isLastOdd ? "100%" : "50%" };
  });
  return [...fixed, ...extraSlots];
};


export default function ManageExperienceCenters() {
    const authToken = useSelector((state) => state.auth.authToken);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  // add / edit-basic modal
  const [showBasic, setShowBasic] = useState(false);
  const [basicEditId, setBasicEditId] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);


  // seo modal
  const [seoCenter, setSeoCenter] = useState(null);

  // full editor (video / images / preview)
  const [editorCenter, setEditorCenter] = useState(null);

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const res = await api.get(EP.centers);
      setCenters(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load experience centers.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- add / rename modal ---------- */
  const openBasic = (center = null) => {
    if (center) {
      setBasicEditId(center.id);
      setFormData({ title: center.title || "", description: center.description || "" });
    } else {
      setBasicEditId(null);
      setFormData({ title: "", description: "" });
    }
    setShowBasic(true);
  };

  const closeBasic = () => {
    setShowBasic(false);
    setBasicEditId(null);
  };

  const handleBasicSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = new FormData();
    payload.append("title", formData.title);
    if (formData.description) payload.append("description", formData.description);
    try {
      if (basicEditId) {
        await api.patch(`${EP.centers}/${basicEditId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Page updated successfully");
      } else {
        await api.post(EP.centers, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Page created successfully");
      }
      fetchCenters();
      closeBasic();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save page.");
    } finally {
      setSubmitting(false);
    }
  };

  
  const handleDelete = async (center) => {
    if (!window.confirm(`Delete "${center.title}"? This cannot be undone.`)) return;
    const slug = getSlug(center);
    try {
      await api.delete(`${EP.centers}/${center.id}`);

      try {
        await api.delete(`${EP.children}/by-slug/${slug}`);
      } catch (cleanupErr) {
        // Parent page is already gone at this point; log but don't block
        // the user on cleanup of the child rows.
        console.error("Cleanup of child assets failed:", cleanupErr);
      }
            // Remove the page's SEO record(s) too, otherwise the sitemap keeps listing a deleted URL
      try {
        const seoHeaders = { headers: { Authorization: `Bearer ${authToken}` } };
        const seoRes = await api.get(EP.seo, seoHeaders);
        const rows = (Array.isArray(seoRes.data) ? seoRes.data : []).filter(
          (t) => normPath(t.page_name) === normPath(`/${slug}`)
        );
        await Promise.all(rows.map((t) => api.delete(`${EP.seo}/${t.id}`, seoHeaders)));
      } catch (seoErr) {
        console.error("Cleanup of SEO record failed:", seoErr);
      }

      toast.success("Page deleted");
      setCenters((prev) => prev.filter((c) => c.id !== center.id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete page.");
    }
  };

  return (
    <AuthMainLayout>
      <style>{`
        .hci-card { background:#fff; border-radius:8px; padding:28px; box-shadow:0 2px 12px rgba(0,0,0,.05); }
        .hci-table { border:1px solid ${HCI_ORANGE}; }
        .hci-table th, .hci-table td { border:1px solid ${HCI_ORANGE} !important; vertical-align:middle; }
        .hci-table thead th { background:#f8f9fa; font-weight:700; }
        .hci-thumb { width:180px; height:100px; object-fit:cover; border-radius:4px; }
        .hci-section { border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; background:#fff; }
        .hci-section > .hci-section-head { padding:12px 18px; font-weight:700; background:#fff7f1; border-bottom:2px solid ${HCI_ORANGE}; display:flex; justify-content:space-between; align-items:center; }
        .hci-drop { border:2px dashed ${HCI_ORANGE}; border-radius:8px; padding:22px; text-align:center; background:#fffaf6; }
        .hci-btn-orange { background:${HCI_ORANGE}; border-color:${HCI_ORANGE}; color:#fff; }
        .hci-btn-orange:hover { background:#f27f36; border-color:#f27f36; color:#fff; }
        .hci-fullscreen { position:fixed; inset:0; z-index:1055; background:#f4f5f7; overflow-y:auto; }
        .hci-fullscreen-head { background:#212529; color:#fff; padding:16px 24px; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; z-index:2; }

        /* ---- two-column editor layout ---- */
        .hci-editor-grid { display:flex; align-items:flex-start; gap:24px; }
        .hci-editor-main { flex:1 1 58%; min-width:0; display:flex; flex-direction:column; gap:24px; }
        .hci-editor-preview-col { flex:1 1 42%; min-width:320px; position:sticky; top:88px; align-self:flex-start; }
        @media (max-width: 991px) {
          .hci-editor-grid { flex-direction:column; }
          .hci-editor-preview-col { position:static; width:100%; }
        }

        /* ---- live preview replica of the public experience-center page ---- */
        .hci-live-preview { border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; background:#fff; }
        .hci-live-preview-video { width:100%; height:170px; object-fit:cover; background:#000; display:block; }
        .hci-live-preview-video-empty { width:100%; height:170px; display:flex; align-items:center; justify-content:center; background:#111; color:#888; font-size:.8rem; }
        .hci-live-preview-body { padding:12px; background:#f4f5f7; display:flex; flex-direction:column; gap:10px; }
        .hci-live-preview-row { display:flex; gap:10px; flex-wrap:wrap; }
        .hci-live-preview-row-main { flex:1 1 58%; display:flex; flex-direction:column; gap:10px; min-width:0; }
        .hci-live-preview-row-side { flex:1 1 38%; min-width:0; border:1px dashed #cbd5e1; border-radius:8px; background:#fff; display:flex; align-items:center; justify-content:center; text-align:center; color:#94a3b8; font-size:.75rem; padding:10px; }
        .hci-prev-card { position:relative; border-radius:8px; overflow:hidden; background:#ddd; min-height:90px; }
        .hci-prev-card img { width:100%; height:100%; object-fit:cover; position:absolute; inset:0; }
        .hci-prev-card span { position:absolute; left:0; right:0; bottom:0; padding:6px 10px; color:#fff; font-weight:600; font-size:.75rem; background:linear-gradient(transparent, rgba(0,0,0,.7)); }
        .hci-prev-placeholder { border:1px dashed #cbd5e1; border-radius:8px; min-height:90px; display:flex; align-items:center; justify-content:center; color:#b6bec9; font-size:.7rem; background:#fff; }
      `}</style>

      <div className="container-fluid py-4">
        <div className="hci-card">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fw-bold m-0" style={{ fontSize: "2.6rem" }}>
              Website Pages
            </h1>
            <button className="btn btn-primary btn-lg px-4" onClick={() => openBasic()}>
              <FaPlus className="me-2" /> Add New Page
            </button>
          </div>

          <div className="table-responsive">
            <table className="table hci-table text-center mb-0">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}>SN</th>
                  <th style={{ width: "15%" }}>Title</th>
                  <th style={{ width: "30%" }}>Description</th>
                  <th style={{ width: "15%" }}>Status</th>
                  <th style={{ width: "15%" }}>SEO Settings</th>
                  <th style={{ width: "20%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-5">
                      <div className="spinner-border text-primary" />
                    </td>
                  </tr>
                ) : centers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-5 text-muted">
                      No pages yet. Click {'"Add New Page"'} to create one.
                    </td>
                  </tr>
                ) : (
                  centers.map((center, index) => (
                    <tr key={center.id}>
                      <td className="fw-bold">{index + 1}</td>
                      <td className="fw-bold">{center.title}</td>
                      <td className="text-muted">{center.description || "N/A"}</td>
                      <td>
                        <span className="badge bg-success rounded-pill px-3 py-2">Published</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => setSeoCenter(center)}
                        >
                          Manage SEO
                        </button>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-2">
                          <a
                            href={`/${getSlug(center)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-success"
                          >
                            Live Link <FaExternalLinkAlt size={10} className="ms-1" />
                          </a>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => setEditorCenter(center)}
                          >
                            <FaEdit className="me-1" /> Edit / Preview
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openBasic(center)}
                          >
                            Rename
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(center)}
                          >
                            <FaTrash className="me-1" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / rename modal */}
        {showBasic && (
          <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold">
                    {basicEditId ? "Edit Page Details" : "Add New Page"}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeBasic}></button>
                </div>
                <form onSubmit={handleBasicSubmit}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Page Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Interior Decorators in South Delhi"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                      {!basicEditId && formData.title && (
                        <div className="form-text">
                          {/* URL: /{slugify(formData.title)} */}
                          URL: /{getSlug({ title: formData.title })}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="modal-footer bg-light">
                    <button type="button" className="btn btn-secondary" onClick={closeBasic} disabled={submitting}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success px-4" disabled={submitting}>
                      {submitting ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {seoCenter && <SeoModal center={seoCenter} onClose={() => setSeoCenter(null)} />}

        {editorCenter && (
          <EditorScreen center={editorCenter} onClose={() => setEditorCenter(null)} />
        )}
      </div>
    </AuthMainLayout>
  );
}

/* ------------------------------------------------------------------ */
/*  SEO MODAL                                                          */
/* ------------------------------------------------------------------ */
// function SeoModal({ center, onClose }) {
//   const slug = getSlug(center);
//   const authToken = useSelector((state) => state.auth.authToken);
//   const user = useSelector((state) => state.auth.user);
//   const { canPublish } = getCmsAccess(user);
//   const authHeaders = { headers: { Authorization: `Bearer ${authToken}` } };

//   const [seo, setSeo] = useState({
//     page_name: `/${slug}`,
//     meta_title: center.title || "",
//     meta_description: "",
//     canonical_url: `${SITE_URL}/${slug}`,
//     keywords: "",
//     robots_index: "index",
//     robots_follow: "follow",
//     include_in_sitemap: true,
//     sitemap_change_frequency: "monthly",
//     sitemap_priority: "0.8",
//     custom_schema: "",
//     status: "active",
//   });
//   const [seoId, setSeoId] = useState(null);
//   const [fromGlobal, setFromGlobal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   // Finds the record the Global SEO manager uses (stored with or without "/")
//   const findExisting = async () => {
//     const res = await api.get(EP.seo, authHeaders);
//     const list = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
//     return list.find((t) => stripSlash(t.page_name) === slug) || null;
//   };

//   useEffect(() => {
//     (async () => {
//       try {
//         const found = await findExisting();
//         if (found) {
//           setSeoId(found.id);
//           setFromGlobal(true);
//           setSeo((prev) => ({
//             ...prev,
//             page_name: found.page_name,
//             meta_title: found.meta_title ?? prev.meta_title,
//             meta_description: found.meta_description ?? "",
//             canonical_url: found.canonical_url || prev.canonical_url,
//             keywords: found.keywords ?? "",
//             ...parseRobots(found.meta_robots),
//             custom_schema:
//   typeof found.custom_schema === "string"
//     ? found.custom_schema
//     : found.custom_schema
//     ? JSON.stringify(found.custom_schema, null, 2)
//     : "",
//             include_in_sitemap: found.include_in_sitemap !== false,
//             sitemap_change_frequency: found.sitemap_change_frequency || "monthly",
//             sitemap_priority: found.sitemap_priority || "0.8",
//             status: found.status || "active",
//           }));
//         }
//       } catch (err) {
//         console.error(err); // no SEO row yet – keep defaults
//       } finally {
//         setLoading(false);
//       }
//     })();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const set = (name, value) => setSeo((p) => ({ ...p, [name]: value }));

//   const handleSave = async () => {
//     if (!stripSlash(seo.page_name)) {
//       toast.error("URL slug is required.");
//       return;
//     }
//     if ((seo.meta_title || "").length > 60) {
//       toast.error("Meta title must be 60 characters or less.");
//       return;
//     }
//     if ((seo.meta_description || "").length > 160) {
//       toast.error("Meta description must be 160 characters or less.");
//       return;
//     }
//     if (seo.custom_schema.trim()) {
//   try {
//     JSON.parse(seo.custom_schema);
//   } catch {
//     toast.error("Custom schema is not valid JSON.");
//     return;
//   }
// }

//     setSaving(true);
//     try {
//       // Re-check so we never create a duplicate of a record made in Global SEO
//       let id = seoId;
//       let pageName = seo.page_name;
//       if (!id) {
//         const existing = await findExisting();
//         if (existing) {
//           id = existing.id;
//           pageName = existing.page_name; // keep the global record's exact format
//         }
//       }

//       // Only fields the backend DTO accepts
//       const payload = {
//         page_name: pageName,
//         meta_title: seo.meta_title,
//         meta_description: seo.meta_description,
//         canonical_url: seo.canonical_url,
//         keywords: seo.keywords,
//         meta_robots: `${seo.robots_index}, ${seo.robots_follow}`,
//         include_in_sitemap: !!seo.include_in_sitemap,
//         sitemap_change_frequency: seo.sitemap_change_frequency,
//         sitemap_priority: String(seo.sitemap_priority),
//         custom_schema: seo.custom_schema.trim(),
//         status: seo.status,
//       };

//       if (id) {
//         if (!canPublish && payload.status === "active") {
//           payload.status = "inactive";
//           toast.info("Saved as inactive until an admin republishes it.");
//         }
//         await api.patch(`${EP.seo}/${id}`, payload, authHeaders);
//       } else {
//         const res = await api.post(EP.seo, payload, authHeaders);
//         setSeoId(res.data?.id || null);
//       }
//       toast.success("SEO settings saved");
//       onClose();
//     } catch (err) {
//       console.error(err);
//       const msg = err.response?.data?.message;
//       toast.error(Array.isArray(msg) ? msg.join(", ") : msg || "Failed to save SEO settings.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//       <div className="modal-dialog modal-lg modal-dialog-scrollable">
//         <div className="modal-content" style={{ borderRadius: 8, overflow: "hidden" }}>
//           <div className="modal-header text-white" style={{ background: "#0dcaf0" }}>
//             <h5 className="modal-title">Search Engine Optimization (SEO)</h5>
//             <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
//           </div>

//           <div className="modal-body p-4">
//             {loading ? (
//               <div className="text-center py-5">
//                 <div className="spinner-border text-primary" />
//               </div>
//             ) : (
//               <>
//                 {fromGlobal && (
//                   <div className="alert alert-info py-2">
//                     This route already exists in Global Route SEO. Changes here update that same record.
//                   </div>
//                 )}

//                 <div className="row g-3 mb-3">
//                   <div className="col-md-6">
//                     <label className="form-label fw-bold">Route Path *</label>
//                     <input
//                       className="form-control"
//                       value={seo.page_name}
//                       onChange={(e) => set("page_name", e.target.value)}
//                       disabled={!!seoId}
//                     />
//                     {!stripSlash(seo.page_name).startsWith("experience-center-") && (
//                       <div className="form-text text-danger">
//                         Must start with {'"experience-center-"'} or the page will return 404.
//                       </div>
//                     )}
//                   </div>
//                   <div className="col-md-6">
//                     <label className="form-label fw-bold">Canonical URL</label>
//                     <input
//                       className="form-control"
//                       value={seo.canonical_url}
//                       onChange={(e) => set("canonical_url", e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label fw-bold">
//                     Meta Title <small className="text-muted">({seo.meta_title.length}/60)</small>
//                   </label>
//                   <input
//                     className="form-control"
//                     maxLength={60}
//                     value={seo.meta_title}
//                     onChange={(e) => set("meta_title", e.target.value)}
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label fw-bold">
//                     Meta Description <small className="text-muted">({seo.meta_description.length}/160)</small>
//                   </label>
//                   <textarea
//                     className="form-control"
//                     rows="3"
//                     maxLength={160}
//                     value={seo.meta_description}
//                     onChange={(e) => set("meta_description", e.target.value)}
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label className="form-label fw-bold">Meta Keywords</label>
//                   <input
//                     className="form-control"
//                     value={seo.keywords}
//                     onChange={(e) => set("keywords", e.target.value)}
//                   />
//                 </div>

//                 <div className="mb-3">
//   <label className="form-label fw-bold">Custom Schema.org (JSON Format)</label>
//   <textarea
//     className="form-control font-monospace"
//     rows="6"
//     placeholder='{ "@context": "https://schema.org", "@type": "WebPage" }'
//     value={seo.custom_schema}
//     onChange={(e) => set("custom_schema", e.target.value)}
//   />
//   <div className="form-text">Must be valid JSON. Leave empty for no page schema.</div>
// </div>

//                 <div className="row g-3 mb-3">
//                   <div className="col-md-6">
//                     <label className="form-label fw-bold">Search Engine Indexing</label>
//                     <select
//                       className="form-select"
//                       value={seo.robots_index}
//                       onChange={(e) => set("robots_index", e.target.value)}
//                     >
//                       <option value="index">Index (Allow search engines)</option>
//                       <option value="noindex">No Index (Hide from search engines)</option>
//                     </select>
//                   </div>
//                   <div className="col-md-6">
//                     <label className="form-label fw-bold">Link Following</label>
//                     <select
//                       className="form-select"
//                       value={seo.robots_follow}
//                       onChange={(e) => set("robots_follow", e.target.value)}
//                     >
//                       <option value="follow">Follow (Follow links on page)</option>
//                       <option value="nofollow">No Follow</option>
//                     </select>
//                   </div>
//                 </div>

//                 <h6 className="text-primary mt-4 pb-2 border-bottom">XML Sitemap Controls</h6>
//                 <div className="border rounded p-3 bg-light mb-3">
//                   <div className="form-check form-switch">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id="sitemapSwitch"
//                       checked={!!seo.include_in_sitemap}
//                       onChange={(e) => set("include_in_sitemap", e.target.checked)}
//                     />
//                     <label className="form-check-label fw-bold" htmlFor="sitemapSwitch">
//                       Include this page in sitemap.xml
//                     </label>
//                   </div>
//                   <small className="text-muted">
//                     Turn this off to exclude the page from the XML sitemap even if it is indexable.
//                   </small>
//                 </div>

//                 <div className="row g-3">
//                   <div className="col-md-6">
//                     <label className="form-label fw-bold">Sitemap Change Frequency</label>
//                     <select
//                       className="form-select"
//                       value={seo.sitemap_change_frequency}
//                       onChange={(e) => set("sitemap_change_frequency", e.target.value)}
//                     >
//                       {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map((f) => (
//                         <option key={f} value={f}>
//                           {f.charAt(0).toUpperCase() + f.slice(1)}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="col-md-6">
//                     <label className="form-label fw-bold">Sitemap Priority</label>
//                     <input
//                       type="number"
//                       min="0"
//                       max="1"
//                       step="0.1"
//                       className="form-control"
//                       value={seo.sitemap_priority}
//                       onChange={(e) => set("sitemap_priority", e.target.value)}
//                     />
//                     <div className="form-text">Use a value between 0.0 and 1.0.</div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           <div className="modal-footer bg-light">
//             <button className="btn btn-secondary" onClick={onClose} disabled={saving}>
//               Close
//             </button>
//             <button className="btn btn-primary px-4" onClick={handleSave} disabled={saving || loading}>
//               {saving ? "Saving..." : "Save SEO"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

function SeoModal({ center, onClose }) {
  const slug = getSlug(center);
  const path = `/${slug}`;
  const authToken = useSelector((state) => state.auth.authToken);
  const user = useSelector((state) => state.auth.user);
  const { canPublish } = getCmsAccess(user);
  const authHeaders = { headers: { Authorization: `Bearer ${authToken}` } };

  const [seoRow, setSeoRow] = useState(null);           // existing seo_tag row (null = will be created)
  const [seoFormData, setSeoFormData] = useState(null); // data handed to GlobalSeoForm
  const [loading, setLoading] = useState(true);

  // Finds the record the website reads (stored with or without "/", any spelling):
  // newest active match, else newest match
  const findExisting = async () => {
    const res = await api.get(EP.seo, authHeaders);
    const list = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
    return (
      list
        .filter((t) => normPath(t.page_name) === normPath(path))
        .sort(
          (x, y) =>
            (y.status === "active") - (x.status === "active") ||
            new Date(y.updated_at) - new Date(x.updated_at) ||
            y.id - x.id
        )[0] || null
    );
  };

  useEffect(() => {
    (async () => {
      try {
        const found = await findExisting();
        if (found) {
          setSeoRow(found);
          const nextStatus = !canPublish && found.status === "active" ? "inactive" : found.status || "active";
          if (!canPublish && found.status === "active") {
            toast.info("Editing an active SEO record will save it as inactive until an admin republishes it.");
          }
          setSeoFormData({ ...found, status: nextStatus });
        } else {
          // no SEO row yet: same defaults the old modal used
          setSeoFormData({
            page_name: path,
            meta_title: center.title || "",
            canonical_url: `${SITE_URL}${path}`,
            status: canPublish ? "active" : "inactive",
          });
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Could not load SEO data. Please try again.");
        onClose();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (formattedData) => {
    if ((formattedData.meta_title || "").length > 60) { toast.error("Meta title must be 60 characters or less."); return; }
    if ((formattedData.meta_description || "").length > 160) { toast.error("Meta description must be 160 characters or less."); return; }
    if ((formattedData.og_title || "").length > 60) { toast.error("OG title must be 60 characters or less."); return; }
    if ((formattedData.og_description || "").length > 200) { toast.error("OG description must be 200 characters or less."); return; }

    try {
      let id = seoRow?.id;
      const payload = { ...formattedData };
      if (!id) {
        // Re-check so we never create a duplicate of a record made in Global SEO
        const existing = await findExisting();
        if (existing) {
          id = existing.id;
          payload.page_name = existing.page_name; // keep the global record's exact format
        }
      }
      if (!canPublish && payload.status === "active") {
        toast.info(getPublishWorkflowMessage("This SEO record"));
      }
      if (id) {
        await api.patch(`${EP.seo}/${id}`, payload, authHeaders);
      } else {
        const res = await api.post(EP.seo, payload, authHeaders);
        setSeoRow(res.data || null);
      }
      toast.success("SEO settings saved");
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg || "Failed to save SEO settings.");
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content" style={{ borderRadius: 8, overflow: "hidden" }}>
          <div className="modal-header text-white" style={{ background: "#0dcaf0" }}>
            <h5 className="modal-title">Search Engine Optimization (SEO)</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            {!slug.startsWith("experience-center-") && (
              <div className="alert alert-danger py-2">
                Route must start with {'"experience-center-"'} or the page will return 404.
              </div>
            )}
            {loading || !seoFormData ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" />
              </div>
            ) : (
              <>
                {seoRow && (
                  <div className="alert alert-info py-2">
                    This route already exists in Global Route SEO. Changes here update that same record.
                  </div>
                )}
                <GlobalSeoForm initialData={seoFormData} onSubmit={handleSubmit} canPublish={canPublish} lockPageName />
              </>
            )}
          </div>

          <div className="modal-footer bg-light">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditorScreen({ center, onClose }) {
  const slug = getSlug(center);

  const [video, setVideo] = useState(null); // existing child row
  const [images, setImages] = useState([]); // existing child rows
  const [loading, setLoading] = useState(true);

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState("");
    const [newAlt, setNewAlt] = useState("");
  const [newTitleTag, setNewTitleTag] = useState("h4");
  const [uploadingImage, setUploadingImage] = useState(false);

  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const [childModalImg, setChildModalImg] = useState(null);
  const [editImg, setEditImg] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
    const [editAlt, setEditAlt] = useState("");
  const [editTitleTag, setEditTitleTag] = useState("h4");
  const [childAlts, setChildAlts] = useState({}); 
  const [savingEdit, setSavingEdit] = useState(false);
  const editImageInputRef = useRef(null);
  const [childRows, setChildRows] = useState([]);
  const [loadingChildRows, setLoadingChildRows] = useState(false);
  const [newChildFile, setNewChildFile] = useState(null);
  const [newChildPreview, setNewChildPreview] = useState("");
  const [addingChild, setAddingChild] = useState(false);
  const [replacingChildId, setReplacingChildId] = useState(null);
  const [deletingChildId, setDeletingChildId] = useState(null);
  const newChildInputRef = useRef(null);

  const load = async () => {
    try {
      setLoading(true);
      const [imgRes, vidRes] = await Promise.all([
        api.get(`${EP.children}/${CHILD_IMAGE_TYPE}/${slug}`),
        api.get(`${EP.children}/${CHILD_VIDEO_TYPE}/${slug}`),
      ]);
      setImages(Array.isArray(imgRes.data) ? imgRes.data : []);
      setVideo(Array.isArray(vidRes.data) ? vidRes.data[0] || null : null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load page content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- video ---- */
  const uploadVideo = async () => {
    if (!videoFile) return;
    setUploadingVideo(true);
    try {
      const fd = new FormData();
      fd.append("parent_slug", slug);
      fd.append("page_type", CHILD_VIDEO_TYPE);
      fd.append("image", videoFile); // public page reads child_content.image for the video src
      if (video) {
        await api.patch(`${EP.children}/${video.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post(EP.children, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      toast.success("Video saved");
      setVideoFile(null);
      setVideoPreview("");
      if (videoInputRef.current) videoInputRef.current.value = "";
      load();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload video.");
    } finally {
      setUploadingVideo(false);
    }
  };

  const deleteVideo = async () => {
    if (!video || !window.confirm("Remove the banner video?")) return;
    try {
      await api.delete(`${EP.children}/${video.id}`);
      toast.success("Video removed");
      setVideo(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove video.");
    }
  };

  /* ---- images ---- */
  const uploadImage = async () => {
    if (!newImage || !newTitle.trim()) {
      toast.error("Add both a title and an image.");
      return;
    }
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("parent_slug", slug);
      fd.append("page_type", CHILD_IMAGE_TYPE);
      fd.append("title", newTitle);
            fd.append("image_alt", newAlt.trim());
      fd.append("title_tag", newTitleTag);
      fd.append("image", newImage);
      await api.post(EP.children, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Image added");
      setNewTitle("");
            setNewAlt("");
      setNewTitleTag("h4");
      setNewImage(null);
      setNewImagePreview("");
      if (imageInputRef.current) imageInputRef.current.value = "";
      load();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteImage = async (img) => {
    if (!window.confirm("Delete this image card?")) return;
    try {
      await api.delete(`${EP.children}/${img.id}`);
      toast.success("Image deleted");
      setImages((prev) => prev.filter((i) => i.id !== img.id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete image.");
    }
  };

  /* ---- edit an existing gallery card's title / image ---- */
  const openEditImage = (img) => {
    setEditImg(img);
    setEditTitle(img.child_content?.title || "");
        setEditAlt(img.child_content?.image_alt || "");
    setEditTitleTag(img.child_content?.title_tag || "h4");
    setEditImageFile(null);
    setEditImagePreview(img.child_content?.image || "");
    if (editImageInputRef.current) editImageInputRef.current.value = "";
  };

  const closeEditImage = () => setEditImg(null);

  const saveEditImage = async () => {
    if (!editTitle.trim()) {
      toast.error("Card title can't be empty.");
      return;
    }
    setSavingEdit(true);
    try {
      const fd = new FormData();
      fd.append("title", editTitle);
            fd.append("image_alt", editAlt.trim());
      fd.append("title_tag", editTitleTag);
      if (editImageFile) fd.append("image", editImageFile);
      await api.patch(`${EP.children}/${editImg.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Image updated");
      setEditImg(null);
      load();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update image.");
    } finally {
      setSavingEdit(false);
    }
  };

  const loadChildRows = async (parentAssetId) => {
    setLoadingChildRows(true);
    try {
      const res = await api.get(`${EP.children}/gallery/${parentAssetId}`);
      setChildRows(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load child images.");
    } finally {
      setLoadingChildRows(false);
    }
  };

  const openChildModal = (img) => {
    setChildModalImg(img);
    setChildRows([]);
        setChildAlts({});
    setNewChildFile(null);
    setNewChildPreview("");
    if (newChildInputRef.current) newChildInputRef.current.value = "";
    loadChildRows(img.id);
  };

  const closeChildModal = () => setChildModalImg(null);

  // Adds one more child image — no cap, click "Add" as many times as needed.
  const addChildImage = async () => {
    if (!newChildFile) {
      toast.error("Choose an image first.");
      return;
    }
    setAddingChild(true);
    try {
      const fd = new FormData();
      fd.append("parent_slug", slug);
      fd.append("page_type", CHILD_GALLERY_IMAGE_TYPE);
      fd.append("parent_asset_id", childModalImg.id);
      fd.append("image", newChildFile);
      await api.post(EP.children, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Image added");
      setNewChildFile(null);
      setNewChildPreview("");
      if (newChildInputRef.current) newChildInputRef.current.value = "";
      loadChildRows(childModalImg.id);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add image.");
    } finally {
      setAddingChild(false);
    }
  };

  // Swaps the file for one existing child row in place.
  const replaceChildImage = async (row, file) => {
    if (!file) return;
        if (!validateImage(file)) return;
    setReplacingChildId(row.id);
    try {
      const fd = new FormData();
      fd.append("image", file);
      await api.patch(`${EP.children}/${row.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Image updated");
      loadChildRows(childModalImg.id);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update image.");
    } finally {
      setReplacingChildId(null);
    }
  };

    const saveChildAlt = async (row) => {
    const alt = (childAlts[row.id] ?? row.child_content?.image_alt ?? "").trim();
    try {
      const fd = new FormData();
      fd.append("image_alt", alt);
      await api.patch(`${EP.children}/${row.id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Alt text saved");
      setChildAlts((prev) => {
        const { [row.id]: _removed, ...rest } = prev;
        return rest;
      });
      loadChildRows(childModalImg.id);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save alt text.");
    }
  };

  // Deletes one existing child row — as many times as there are rows.
  const deleteChildImage = async (row) => {
    if (!window.confirm("Delete this image?")) return;
    setDeletingChildId(row.id);
    try {
      await api.delete(`${EP.children}/${row.id}`);
      toast.success("Image deleted");
      setChildRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete image.");
    } finally {
      setDeletingChildId(null);
    }
  };

  const videoSrc = videoPreview || video?.child_content?.image;
  const bottomSlots = buildBottomSlots(images.slice(2)); // item 2 onward, unlimited

  return (
    <div className="hci-fullscreen">
      <div className="hci-fullscreen-head">
        <h5 className="m-0">Edit Page: {center.title}</h5>
        <button className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
      </div>

      <div className="container-fluid py-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <div className="hci-editor-grid">
            {/* ---------------- LEFT: uploads ---------------- */}
            <div className="hci-editor-main">
              {/* 1. VIDEO */}
              <section className="hci-section">
                <div className="hci-section-head">
                  <span>1. Banner Video</span>
                </div>
                <div className="p-4">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="hci-drop">
                        <FaCloudUploadAlt size={32} color={HCI_ORANGE} />
                        <p className="mb-2 mt-2 text-muted">MP4 / WebM. The video autoplays muted on the live page.</p>
                        <input
                          type="file"
                          accept="video/*"
                          className="form-control"
                          ref={videoInputRef}
                          onChange={(e) => {
                            const f = e.target.files[0];
                            if (f) {
                              setVideoFile(f);
                              setVideoPreview(URL.createObjectURL(f));
                            }
                          }}
                        />
                        <div className="d-flex gap-2 justify-content-center mt-3">
                          <button
                            className="btn hci-btn-orange"
                            disabled={!videoFile || uploadingVideo}
                            onClick={uploadVideo}
                          >
                            {uploadingVideo ? "Uploading..." : video ? "Update Video" : "Upload Video"}
                          </button>
                          {video && (
                            <button className="btn btn-outline-danger" onClick={deleteVideo}>
                              <FaTrash className="me-1" /> Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      {videoSrc ? (
                        <video src={videoSrc} controls muted className="w-100 rounded" style={{ maxHeight: 240, background: "#000" }} />
                      ) : (
                        <div className="text-muted text-center py-5 border rounded">No video uploaded yet</div>
                      )}
                      {videoFile && <small className="text-muted">Not saved yet – click Upload Video.</small>}
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. IMAGES (child images) */}
              <section className="hci-section">
                <div className="hci-section-head">
                  <span>2. Gallery Images ({images.length})</span>
                </div>
                <div className="p-4">
                  {/* <div className="row g-3 align-items-end mb-4">
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Card Title</label>
                      <input
                        className="form-control"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Modular Kitchen"
                      />
                    </div>
                              <div className="row g-2 mb-3">
            <div className="col-4">
              <label className="form-label fw-bold">Title Tag</label>
              <select className="form-select" value={editTitleTag} onChange={(e) => setEditTitleTag(e.target.value)}>
                {HEADING_TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="col-8">
              <label className="form-label fw-bold">Image Alt Text</label>
              <input
                className="form-control"
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
                maxLength={125}
              />
            </div>
          </div>
                    <div className="col-md-5">
                      <label className="form-label fw-bold">Image</label>
                      <input
                        type="file"
                        accept="image/webp"
                        className="form-control"
                        ref={imageInputRef}
                        // onChange={(e) => {
                        //   const f = e.target.files[0];
                        //   if (f) {
                        //     setNewImage(f);
                        //     setNewImagePreview(URL.createObjectURL(f));
                        //   }
                        // }}

                        onChange={(e) => {
                          const f = e.target.files[0];
                          if (!f) return;
                          if (!validateImage(f)) { e.target.value = ""; return; }
                          setNewImage(f);
                          setNewImagePreview(URL.createObjectURL(f));
                        }}
                      />
                    </div>
                    <div className="col-md-3">
                      <button className="btn hci-btn-orange w-100" disabled={uploadingImage} onClick={uploadImage}>
                        <FaPlus className="me-1" /> {uploadingImage ? "Adding..." : "Add Image"}
                      </button>
                    </div>

                                        <div className="col-md-3">
                      <label className="form-label fw-bold">Title Tag</label>
                      <select className="form-select" value={newTitleTag} onChange={(e) => setNewTitleTag(e.target.value)}>
                        {HEADING_TAG_OPTIONS.map((t) => (
                          <option key={t} value={t}>{t.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-9">
                      <label className="form-label fw-bold">Image Alt Text</label>
                      <input
                        className="form-control"
                        value={newAlt}
                        onChange={(e) => setNewAlt(e.target.value)}
                        placeholder="Describe the image (for SEO & accessibility)"
                        maxLength={125}
                      />
                    </div>
                    {newImagePreview && (
                      <div className="col-12">
                        <img src={newImagePreview} alt="New" className="img-thumbnail" style={{ height: 90 }} />
                      </div>
                    )}
                  </div> */}

                                    <div className="row g-3 align-items-end mb-4">
                    <div className="col-md-8">
                      <label className="form-label fw-bold">Card Title</label>
                      <input
                        className="form-control"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Modular Kitchen"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Title Tag</label>
                      <select
                        className="form-select"
                        value={newTitleTag}
                        onChange={(e) => setNewTitleTag(e.target.value)}
                      >
                        {HEADING_TAG_OPTIONS.map((t) => (
                          <option key={t} value={t}>{t.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold">Image</label>
                      <input
                        type="file"
                        accept="image/webp"
                        className="form-control"
                        ref={imageInputRef}
                        onChange={(e) => {
                          const f = e.target.files[0];
                          if (!f) return;
                          if (!validateImage(f)) { e.target.value = ""; return; }
                          setNewImage(f);
                          setNewImagePreview(URL.createObjectURL(f));
                        }}
                      />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label fw-bold">Image Alt Text</label>
                      <input
                        className="form-control"
                        value={newAlt}
                        onChange={(e) => setNewAlt(e.target.value)}
                        placeholder="Describe the image (for SEO & accessibility)"
                        maxLength={125}
                      />
                    </div>
                    <div className="col-md-3">
                      <button className="btn hci-btn-orange w-100" disabled={uploadingImage} onClick={uploadImage}>
                        <FaPlus className="me-1" /> {uploadingImage ? "Adding..." : "Add Image"}
                      </button>
                    </div>

                    {newImagePreview && (
                      <div className="col-12">
                        <img src={newImagePreview} alt="New" className="img-thumbnail" style={{ height: 90 }} />
                      </div>
                    )}
                  </div>
                  {images.length === 0 ? (
                    <div className="text-muted text-center py-4 border rounded">No images yet</div>
                  ) : (
                    <div className="row g-3">
                      {images.map((img, i) => (
                        <div className="col-6 col-md-3" key={img.id}>
                          <div className="border rounded overflow-hidden h-100">
                            <img
                              src={img.child_content?.image}
                              alt={img.child_content?.image_alt || img.child_content?.title}
                              style={{ width: "100%", height: 110, objectFit: "cover" }}
                            />
                            <div className="p-2 d-flex flex-column gap-2">
                              <small className="fw-semibold text-truncate" title={img.child_content?.title}>
                                {i + 1}. {img.child_content?.title}
                              </small>
                              <div className="d-flex gap-1">
                                <button
                                  className="btn btn-sm btn-outline-primary flex-fill"
                                  onClick={() => openEditImage(img)}
                                  title="Edit title / image"
                                >
                                  <FaEdit size={11} />
                                </button>
                                <button className="btn btn-sm btn-info flex-fill" onClick={() => openChildModal(img)} title="Manage child images">
                                  Child
                                </button>
                                <button className="btn btn-sm btn-danger flex-fill" onClick={() => deleteImage(img)} title="Delete">
                                  <FaTrash size={11} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* ---------------- RIGHT: live preview ---------------- */}
            <div className="hci-editor-preview-col">
              <section className="hci-section">
                <div className="hci-section-head">
                  <span>3. Live Preview</span>
                  <a href={`/${slug}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success">
                    Open live page <FaExternalLinkAlt size={10} className="ms-1" />
                  </a>
                </div>
                <div className="p-3">
                  <div className="hci-live-preview">
                    {videoSrc ? (
                      <video src={videoSrc} autoPlay loop muted className="hci-live-preview-video" />
                    ) : (
                      <div className="hci-live-preview-video-empty">No banner video uploaded yet</div>
                    )}

                    <div className="hci-live-preview-body">
                      {/* Row 1: cards 1 & 2 beside the enquiry-form slot (col-lg-7 / col-lg-5) */}
                      <div className="hci-live-preview-row">
                        <div className="hci-live-preview-row-main">
                          {images[0] ? (
                            <PreviewCard img={images[0]} />
                          ) : (
                            <div className="hci-prev-placeholder">Card 1</div>
                          )}
                          {images[1] ? (
                            <PreviewCard img={images[1]} />
                          ) : (
                            <div className="hci-prev-placeholder">Card 2</div>
                          )}
                        </div>
                        <div className="hci-live-preview-row-side">Enquiry form appears here</div>
                      </div>

                      {/* Cards from index 2 onward: fixed layout for 3–7, then paired (or a full-width trailing single) after that */}
                      <div className="hci-live-preview-row">
                        {bottomSlots.length === 0 ? (
                          FIXED_ROW_LAYOUT.map((s, i) => (
                            <div
                              key={i}
                              style={{
                                flex: `0 0 calc(${s.basis} - 6px)`,
                                maxWidth: `calc(${s.basis} - 6px)`,
                              }}
                            >
                              <div className="hci-prev-placeholder">Card {i + 3}</div>
                            </div>
                          ))
                        ) : (
                          bottomSlots.map((slot, i) => (
                            <div
                              key={slot.img.id}
                              style={{ flex: `0 0 calc(${slot.basis} - 6px)`, maxWidth: `calc(${slot.basis} - 6px)` }}
                            >
                              <PreviewCard img={slot.img} />
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

{editImg && (
  <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Edit Card</h5>
          <button className="btn-close" onClick={closeEditImage}></button>
        </div>
        <div className="modal-body p-4">
          {/* <div className="mb-3">
            <label className="form-label fw-bold">Card Title</label>
            <input
              className="form-control"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div> */}

                    <div className="row g-2 mb-3">
            <div className="col-8">
              <label className="form-label fw-bold">Card Title</label>
              <input
                className="form-control"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="col-4">
              <label className="form-label fw-bold">Title Tag</label>
              <select
                className="form-select"
                value={editTitleTag}
                onChange={(e) => setEditTitleTag(e.target.value)}
              >
                {HEADING_TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-2">
            <label className="form-label fw-bold">Image</label>
            <input
              type="file"
              accept="image/webp"
              className="form-control"
              ref={editImageInputRef}
              // onChange={(e) => {
              //   const f = e.target.files[0];
              //   if (f) {
              //     setEditImageFile(f);
              //     setEditImagePreview(URL.createObjectURL(f));
              //   }
              // }}

              onChange={(e) => {
                const f = e.target.files[0];
                if (!f) return;
                if (!validateImage(f)) { e.target.value = ""; return; }
                setEditImageFile(f);
                setEditImagePreview(URL.createObjectURL(f));
              }}
            />
            <div className="form-text">Leave empty to keep the current image.</div>
          </div>

                    <div className="mb-3">
            <label className="form-label fw-bold">Image Alt Text</label>
            <input
              className="form-control"
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
              placeholder="Describe the image (for SEO & accessibility)"
              maxLength={125}
            />
          </div>
          {editImagePreview && (
            <img src={editImagePreview} alt="Preview" className="img-thumbnail" style={{ height: 140, width: "100%", objectFit: "cover" }} />
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={closeEditImage} disabled={savingEdit}>
            Cancel
          </button>
          <button className="btn hci-btn-orange px-4" onClick={saveEditImage} disabled={savingEdit}>
            {savingEdit ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{childModalImg && (
  <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            Manage Child Images — {childModalImg.child_content?.title}
          </h5>
          <button className="btn-close" onClick={closeChildModal}></button>
        </div>
        <div className="modal-body p-4">
          {loadingChildRows ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" />
            </div>
          ) : childRows.length === 0 ? (
            <p className="text-muted text-center py-3 border rounded mb-4">No child images yet</p>
          ) : (
            <div className="row g-3 mb-4">
              {childRows.map((row, i) => (
                <div className="col-6 col-md-4" key={row.id}>
                  <div className="border rounded overflow-hidden h-100">
                    {row.child_content?.image && (
                      <img
                        src={row.child_content.image}
                        alt={row.child_content?.image_alt || ""}
                        style={{ width: "100%", height: 110, objectFit: "cover" }}
                      />
                    )}
                    <div className="p-2 d-flex flex-column gap-2">
                      <small className="text-muted">Image {i + 1}</small>
                      <input
                        type="file"
                        accept="image/webp"
                        className="form-control form-control-sm"
                        disabled={replacingChildId === row.id}
                        onChange={(e) => replaceChildImage(row, e.target.files[0])}
                      />
                                            <input
                        className="form-control form-control-sm"
                        value={childAlts[row.id] ?? row.child_content?.image_alt ?? ""}
                        onChange={(e) => setChildAlts((prev) => ({ ...prev, [row.id]: e.target.value }))}
                        placeholder="Alt text"
                        maxLength={125}
                      />
                      <button className="btn btn-sm btn-outline-success" onClick={() => saveChildAlt(row)}>
                        Save Alt Text
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        disabled={deletingChildId === row.id}
                        onClick={() => deleteChildImage(row)}
                      >
                        <FaTrash className="me-1" />
                        {deletingChildId === row.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <hr />

          <div className="row g-2 align-items-end">
            <div className="col-8">
              <label className="form-label fw-bold">Add another image</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                ref={newChildInputRef}
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) {
                    setNewChildFile(f);
                    setNewChildPreview(URL.createObjectURL(f));
                  }
                }}
              />
            </div>
            <div className="col-4">
              <button className="btn hci-btn-orange w-100" disabled={!newChildFile || addingChild} onClick={addChildImage}>
                <FaPlus className="me-1" /> {addingChild ? "Adding..." : "Add"}
              </button>
            </div>
            {newChildPreview && (
              <div className="col-12">
                <img src={newChildPreview} alt="New" className="img-thumbnail mt-2" style={{ height: 80 }} />
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary w-100" onClick={closeChildModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      <div className="bg-white border-top py-3 px-4 d-flex justify-content-end sticky-bottom">
        <button className="btn btn-secondary px-4" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function PreviewCard({ img }) {
  return (
    <div className="hci-prev-card">
      <img src={img.child_content?.image} alt={img.child_content?.image_alt || img.child_content?.title || ""} />
      <span>{img.child_content?.title}</span>
    </div>
  );
}
