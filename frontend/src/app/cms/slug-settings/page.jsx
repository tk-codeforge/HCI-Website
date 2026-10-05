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

const SITE_URL = "https://hcinterior.in";
// const initialFormState = { entityType: "", entityId: "", slug: "", isActive: true };
const initialFormState = { entityType: "", entityId: "", slug: "", isActive: true, center: "" };
const sanitizeCenter = (v) => v.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-{2,}/g, "-");

const slugify = (v) =>
    v.normalize("NFKD").toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

const sanitizeSlugInput = (v) =>
    v.normalize("NFKD").toLowerCase()
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-{2,}/g, "-")
        .replace(/^-+/, "");

const errMsg = (error, fallback) => {
    const m = error?.response?.data?.message;
    return Array.isArray(m) ? m.join(", ") : m || fallback;
};

const CmsSlugSettings = () => {
    const user = useSelector((state) => state.auth.user);
    const authToken = useSelector((state) => state.auth.authToken);
    const { canPublish, canDelete } = getCmsAccess(user);

    const [types, setTypes] = useState([]);
    const [slugList, setSlugList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState("");
    const [search, setSearch] = useState("");
    const [formData, setFormData] = useState({ ...initialFormState, isActive: canPublish });
    const [selectedId, setSelectedId] = useState(null);
    const [slugStatus, setSlugStatus] = useState("idle"); // idle | checking | available | taken

    const authConfig = useCallback(
        (extra = {}) => {
            const token = authToken || (typeof window !== "undefined" ? localStorage.getItem("token") : "");
            return { headers: { Authorization: `Bearer ${token}` }, ...extra };
        },
        [authToken]
    );

    // const baseOf = (type) => types.find((t) => t.type === type)?.basePath ?? "";
    const baseOf = (type) => {
    const known = types.find((t) => t.type === type);
    if (known) return known.basePath;
    return /^experience-center-.+-gallery$/.test(type || "") ? `/${type.slice(0, -8)}/gallery` : "";
};

const effectiveType =
    formData.entityType === "__center__"
        ? (formData.center ? `${formData.center}-gallery` : "")
        : formData.entityType;

    const fetchSlugs = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/slug-edit", authConfig());
            setSlugList(response.data || []);
        } catch (err) {
            toast.error(errMsg(err, "Error fetching slugs."));
        } finally {
            setLoading(false);
        }
    }, [authConfig]);

    const fetchTypes = useCallback(async () => {
        try {
            const response = await api.get("/slug-edit/types", authConfig());
            setTypes(response.data || []);
        } catch (err) {
            toast.error(errMsg(err, "Error fetching page types."));
        }
    }, [authConfig]);

    useEffect(() => { fetchTypes(); fetchSlugs(); }, [fetchTypes, fetchSlugs]);

    // Live duplicate check
    useEffect(() => {
        // if (!formData.entityType || !formData.slug) { setSlugStatus("idle"); return; }
        if (!effectiveType || !slugify(formData.slug)) { setSlugStatus("idle"); return; }
        setSlugStatus("checking");
        const t = setTimeout(async () => {
            try {
                // const params = { entityType: formData.entityType, slug: formData.slug };
                const params = { entityType: effectiveType, slug: slugify(formData.slug) };
                if (formData.entityId) params.entityId = formData.entityId;
                if (selectedId) params.excludeId = selectedId;
                const res = await api.get("/slug-edit/check", { ...authConfig(), params });
                setSlugStatus(res.data.available ? "available" : "taken");
            } catch { setSlugStatus("idle"); }
        }, 400);
        return () => clearTimeout(t);
    }, [effectiveType, formData.entityId, formData.slug, selectedId, authConfig]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            // [name]: type === "checkbox" ? checked : name === "slug" ? slugify(value) : value,
            // [name]: type === "checkbox" ? checked : name === "slug" ? sanitizeSlugInput(value) : value,
            [name]: type === "checkbox" ? checked
    : name === "slug" ? sanitizeSlugInput(value)
    : name === "center" ? sanitizeCenter(value)
    : value,
        }));
    };

    const openAdd = () => {
        setSelectedId(null);
        setFormData({ ...initialFormState, isActive: canPublish });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!effectiveType) return toast.error("Select a page type (and a center slug).");
        if (formData.entityType === "__center__" && !formData.center.startsWith("experience-center-")) {
    return toast.error("Center slug must start with experience-center-");
}
        if (slugStatus === "taken") return toast.error("This slug is already in use.");
        try {
            if (!canPublish) toast.info(getPublishWorkflowMessage("This slug"));
            const payload = {
                entityType: effectiveType,
                entityId: Number(formData.entityId),
                // slug: formData.slug,
                slug: slugify(formData.slug),
                isActive: canPublish ? formData.isActive : false,
            };
            const response = await api.post("/slug-edit", payload, authConfig());
            if (response.status === 201 || response.status === 200) {
                fetchSlugs();
                toast.success("Slug created successfully.");
                document.getElementById("addSlugModalClose").click();
            }
        } catch (error) { toast.error(errMsg(error, "Error creating slug.")); }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (slugStatus === "taken") return toast.error("This slug is already in use.");
        try {
            if (!canPublish && formData.isActive) toast.info(getPublishWorkflowMessage("This slug"));
            const response = await api.patch(
                `/slug-edit/${selectedId}`,
                { 
                // slug: formData.slug,
                slug: slugify(formData.slug),
                isActive: formData.isActive },
                authConfig()
            );
            if (response.status === 200) {
                fetchSlugs();
                toast.success("Slug updated. The old URL now redirects to the new one.");
                document.getElementById("editSlugModalClose").click();
            }
        } catch (error) { toast.error(errMsg(error, "Error updating slug.")); }
    };

    const deleteHandler = async (id) => {
        if (!canDelete) {
            toast.error(getDeletePermissionMessage("this slug"));
            return;
        }
        if (window.confirm("Delete this slug? The page will go back to its ?id= URL.")) {
            try {
                await api.delete(`/slug-edit/${id}`, authConfig());
                fetchSlugs();
                toast.success("Slug deleted.");
            } catch (error) { toast.error(errMsg(error, "Failed to delete.")); }
        }
    };

    const handleEditClick = (item) => {
        const nextActiveState = canPublish ? item.isActive !== false : false;
        if (!canPublish && item.isActive) {
            toast.info("Editing an active slug will disable it until an admin republishes it.");
        }
        setSelectedId(item.id);

        const isCenter = !types.some((t) => t.type === item.entityType);
setFormData({
    entityType: isCenter ? "__center__" : item.entityType,
    center: isCenter ? item.entityType.replace(/-gallery$/, "") : "",
    entityId: String(item.entityId),
    slug: item.slug,
    isActive: nextActiveState,
});
        // setFormData({
        //     entityType: item.entityType,
        //     entityId: String(item.entityId),
        //     slug: item.slug,
        //     isActive: nextActiveState,
        // });
    };

    const visibleRows = slugList.filter((r) => {
        if (typeFilter && r.entityType !== typeFilter) return false;
        if (!search) return true;
        const q = search.toLowerCase();
        return r.slug.toLowerCase().includes(q) || String(r.entityId).includes(q);
    });

    const renderFormBody = (isEdit) => (
        <div className="modal-body p-4 bg-light row g-3">
            {/* <div className="col-md-12">
                <label className="form-label fw-bold">Page Type *</label>
                <select className="form-select" name="entityType" value={formData.entityType} onChange={handleInputChange} disabled={isEdit} required>
                    <option value="">Select page type</option>
                    {types.map((t) => (
                        <option key={t.type} value={t.type}>{t.type} ({t.basePath})</option>
                    ))}
                    <option value="__center__">Experience Center gallery (generated centers)</option>
                    {formData.entityType === "__center__" && (
    <div className="col-md-12 mt-3">
        <label className="form-label fw-bold">Center slug *</label>
        <input type="text" className="form-control" name="center"
               placeholder="the part of the URL after /experience-center/, e.g. ghaziabad"
               value={formData.center} onChange={handleInputChange} disabled={isEdit} required />
    </div>
)}
                </select>
            </div> */}

            <div className="col-md-12">
    <label className="form-label fw-bold">Page Type *</label>
    <select className="form-select" name="entityType" value={formData.entityType} onChange={handleInputChange} disabled={isEdit} required>
        <option value="">Select page type</option>
        {types.map((t) => (
            <option key={t.type} value={t.type}>{t.type} ({t.basePath})</option>
        ))}
        <option value="__center__">Experience Center gallery (generated centers)</option>
    </select>

    {formData.entityType === "__center__" && (
        <div className="mt-3">
            <label className="form-label fw-bold">Center slug *</label>
            <input type="text" className="form-control" name="center"
                   placeholder="the part of the URL after /experience-center/, e.g. ghaziabad"
                   value={formData.center} onChange={handleInputChange} disabled={isEdit} required />
        </div>
    )}
</div>
            <div className="col-md-12 mt-3">
                <label className="form-label fw-bold">Item ID *</label>
                <input type="number" min="1" className="form-control" name="entityId" placeholder="The number in ?id=103" value={formData.entityId} onChange={handleInputChange} disabled={isEdit} required />
            </div>
            <div className="col-md-12 mt-3">
                <label className="form-label fw-bold">Slug *</label>
                <input type="text" className="form-control" name="slug" placeholder="e.g., modern-living-room" value={formData.slug} onChange={handleInputChange} onBlur={() => setFormData((p) => ({ ...p, slug: slugify(p.slug) }))} required />
                {slugStatus === "checking" && <small className="text-muted">Checking...</small>}
                {slugStatus === "available" && <small className="text-success fw-semibold">Slug is available</small>}
                {slugStatus === "taken" && <small className="text-danger fw-semibold">Slug already in use</small>}
            </div>
            {/* {formData.entityType && formData.slug && (
                <div className="col-md-12 mt-3">
                    <div className="alert alert-secondary py-2 mb-0 small">
                        <div><strong>New URL:</strong> {SITE_URL}{effectiveType && formData.slug}/{slugify(formData.slug)}</div>
                        {formData.entityId && (
                            <div><strong>Old URL (redirects):</strong> {baseOf(effectiveType)}?id={formData.entityId}</div>
                        )}
                    </div>
                </div>
            )} */}

            {effectiveType && formData.slug && (
    <div className="col-md-12 mt-3">
        <div className="alert alert-secondary py-2 mb-0 small">
            <div><strong>New URL:</strong> {SITE_URL}{baseOf(effectiveType)}/{slugify(formData.slug)}</div>
            {formData.entityId && (
                <div><strong>Old URL (redirects):</strong> {baseOf(effectiveType)}?id={formData.entityId}</div>
            )}
        </div>
    </div>
)}
            <div className="col-md-6 mt-4 d-flex align-items-end">
                <div className="form-check form-switch fs-5">
                    <input className="form-check-input" type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} disabled={!canPublish} />
                    <label className="form-check-label ms-2 fs-6">{canPublish ? "Active" : "Admin Publish Required"}</label>
                </div>
            </div>
        </div>
    );

    const saveDisabled = slugStatus === "taken" || slugStatus === "checking";

    return (
        <AuthMainLayout>
            <div className="container-fluid my-5 px-4">
                <div className="card shadow-sm border-0">
                    <div className="card-header bg-dark text-white p-4 border-0">
                        <h1 className="h3 mb-1 text-white">Slug Settings</h1>
                        <p className="small mb-0 text-white">Edit page URLs. Duplicate slugs are blocked and old URLs redirect automatically.</p>
                    </div>
                    <div className="card-body p-4">
                        {(!canPublish || !canDelete) && (
                            <div className="alert alert-info">
                                Editors can stage slugs here. Publish and delete access can be granted separately by an admin.
                            </div>
                        )}

                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                            <div className="d-flex gap-2">
                                <select className="form-select" style={{ minWidth: 200 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                                    <option value="">All page types</option>
                                    {types.map((t) => <option key={t.type} value={t.type}>{t.type}</option>)}
                                </select>
                                <input type="text" className="form-control" placeholder="Search slug or ID" value={search} onChange={(e) => setSearch(e.target.value)} />
                            </div>
                            <button onClick={openAdd} className="btn btn-primary px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#addSlugModal">
                                + Add Slug
                            </button>
                        </div>

                        {loading && !slugList.length ? (
                            <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle border">
                                    <thead className="table-light">
                                        <tr><th>SN</th><th>Type</th><th>Item ID</th><th>Slug URL</th><th>Old URL</th><th>Status</th><th className="text-end">Actions</th></tr>
                                    </thead>
                                    <tbody>
                                        {visibleRows.length > 0 ? visibleRows.map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="fw-bold text-muted">{index + 1}</td>
                                                <td><span className="badge bg-secondary">{item.entityType}</span></td>
                                                <td>{item.entityId}</td>
                                                <td className="text-success fw-semibold">
                                                    <a href={`${SITE_URL}${baseOf(item.entityType)}/${item.slug}`} target="_blank" rel="noreferrer" className="text-success">
                                                        {baseOf(item.entityType)}/{item.slug}
                                                    </a>
                                                </td>
                                                <td className="text-danger fw-semibold">{baseOf(item.entityType)}?id={item.entityId}</td>
                                                <td>{item.isActive ? <span className="text-success fw-bold">Active</span> : <span className="text-muted">Disabled</span>}</td>
                                                <td className="text-end">
                                                    <button onClick={() => handleEditClick(item)} className="btn btn-sm btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#editSlugModal">Edit</button>
                                                    {canDelete && <button className="btn btn-sm btn-outline-danger" onClick={() => deleteHandler(item.id)}>Delete</button>}
                                                </td>
                                            </tr>
                                        )) : (<tr><td colSpan="7" className="text-center py-4 text-muted">No slugs configured.</td></tr>)}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="modal fade" id="addSlugModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog"><div className="modal-content"><form onSubmit={handleAddSubmit}>
                    <div className="modal-header"><h5 className="modal-title">Add Slug</h5></div>
                    {renderFormBody(false)}
                    <div className="modal-footer">
                        <button type="button" id="addSlugModalClose" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button className="btn btn-primary" type="submit" disabled={saveDisabled}>Save</button>
                    </div>
                </form></div></div>
            </div>

            <div className="modal fade" id="editSlugModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog"><div className="modal-content"><form onSubmit={handleEditSubmit}>
                    <div className="modal-header"><h5 className="modal-title">Edit Slug</h5></div>
                    {renderFormBody(true)}
                    <div className="modal-footer">
                        <button type="button" id="editSlugModalClose" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button className="btn btn-primary" type="submit" disabled={saveDisabled}>Update</button>
                    </div>
                </form></div></div>
            </div>
        </AuthMainLayout>
    );
};

export default CmsSlugSettings;