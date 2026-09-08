"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import {
    DEFAULT_SITEMAP_CHANGE_FREQUENCY,
    DEFAULT_SITEMAP_PRIORITY,
    SITEMAP_CHANGE_FREQUENCY_OPTIONS
} from "@/utils/seoHelpers";
import {
    getCmsAccess,
    getDeletePermissionMessage,
    getPublishWorkflowMessage,
} from "@/utils/cmsAccess";

const CKEditorComponent = dynamic(() => import('@/app/components/CKEditorComponent'), { ssr: false });

const initialFormData = {
    title: "",
    description: "",
    writer_name: "",
    published_on: "",
    image: null,
    image_alt: "",
    status: "Draft",
};

const CmsBlog = () => {
    const user = useSelector((state) => state.auth.user);
    const authToken = useSelector((state) => state.auth.authToken);
    const { canPublish, canDelete } = getCmsAccess(user);
    const [pagesList, setPagesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [formSeoContentData, setFormSeoContentData] = useState({
        slug: "",
        canonical_url: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        custom_code: "",
        meta_robots_index: "index",
        meta_robots_follow: "follow",
        include_in_sitemap: true,
        sitemap_change_frequency: DEFAULT_SITEMAP_CHANGE_FREQUENCY,
        sitemap_priority: String(DEFAULT_SITEMAP_PRIORITY),
    });
    
    const [selectedId, setSelectedId] = useState(null);

    // --- Versioning & Autosave States ---
    const [versionsList, setVersionsList] = useState([]);
    const [isAutosaving, setIsAutosaving] = useState(false);
    const [lastSavedTime, setLastSavedTime] = useState(null);
    const skipNextAutosave = useRef(false);

    const fetchContentManagerPages = useCallback(async () => {
        try {
            const response = await api.get("/cms-blog/all", {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setPagesList(response.data);
            setLoading(false);
        } catch (err) {
            toast.error(err.response?.data?.message ?? "Error fetching data.");
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchContentManagerPages();
    }, [fetchContentManagerPages]);

    const performAutosave = useCallback(async () => {
        setIsAutosaving(true);
        const formDataToSend = new FormData();
        
        // Pass the ID so the backend knows whether to create a new draft or update the existing one
        if (selectedId) {
            formDataToSend.append("id", selectedId);
        }
        
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("writer_name", formData.writer_name);
        if (formData.published_on) formDataToSend.append("published_on", formData.published_on);
        if (formData.image_alt) formDataToSend.append("image_alt", formData.image_alt);
        formDataToSend.append("status", formData.status || "Draft");

        try {
            const response = await api.post(`/cms-blog/auto-save`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            
            setLastSavedTime(new Date());

            // 🌟 CRITICAL: If this was a brand new blog, capture the ID the backend just created
            // so the next autosave doesn't create a duplicate!
            if (!selectedId && response.data?.id) {
                setSelectedId(response.data.id);
                fetchContentManagerPages(); // Silently update the table behind the modal
            }
        } catch (error) {
            console.error("Autosave failed", error);
        } finally {
            setIsAutosaving(false);
        }
    }, [authToken, selectedId, formData.title, formData.description, formData.writer_name, formData.status, formData.image_alt, formData.published_on, fetchContentManagerPages]);

    // --- NEW: Unified Autosave Debouncer (Works for New & Existing Blogs) ---
    useEffect(() => {
        if (skipNextAutosave.current) {
            skipNextAutosave.current = false;
            return;
        }

        // Don't spam empty autosaves if the user hasn't typed anything yet
        if (!formData.title && !formData.description) return;

        const timer = setTimeout(() => {
            performAutosave();
        }, 3000); // Wait 3 seconds after user stops typing

        return () => clearTimeout(timer);
    }, [formData.title, formData.description, formData.writer_name, formData.status, formData.image_alt, formData.published_on, performAutosave]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files.length > 0) {
            setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    // --- NEW: Unified Final Form Submission ---
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("writer_name", formData.writer_name);
        formDataToSend.append("published_on", formData.published_on);
        formDataToSend.append("image_alt", formData.image_alt);
        formDataToSend.append("status", formData.status);

        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            if (!canPublish && formData.status === "Published") {
                toast.info(getPublishWorkflowMessage("This blog"));
            }

            let response;
            
            // If we have a selectedId, it was either explicitly edited OR autosaved as a new draft
            if (selectedId) {
                response = await api.patch(`/cms-blog/${selectedId}`, formDataToSend, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${authToken}`,
                    },
                });
            } else {
                // Failsafe: User typed incredibly fast and hit "Save" before the 3s autosave triggered
                response = await api.post("/cms-blog", formDataToSend, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${authToken}`,
                    },
                });
            }

            if (response.status === 200 || response.status === 201) {
                fetchContentManagerPages();
                if (!canPublish && response.data?.status === "Pending Approval") {
                    toast.info("Blog saved/moved to Pending Approval for admin review.");
                } else {
                    toast.success("Saved successfully.");
                }
                
                setFormData(initialFormData);
                setSelectedId(null);
                
                // Safely close whichever modal was open
                const addCloseBtn = document.getElementById('addNewpageModalClose');
                if (addCloseBtn) addCloseBtn.click();
                
                const editCloseBtn = document.getElementById('editNewpageModalClose');
                if (editCloseBtn) editCloseBtn.click();
            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Error submitting form.");
            console.error("Error:", error);
        }
    };

    const handleAddNewClick = () => {
        skipNextAutosave.current = true; // Prevent instant empty autosave
        setSelectedId(null);
        setLastSavedTime(null);
        setFormData(initialFormData);
    };

    const handleEditClick = (item) => {
        let nextStatus = item.status || "Draft";

        if (!canPublish && nextStatus === "Published") {
            nextStatus = "Pending Approval";
            toast.info("Editing a live blog will move it to Pending Approval.");
        }

        skipNextAutosave.current = true; 
        setLastSavedTime(null);
        setSelectedId(item.id);
        
        setFormData({
            title: item.title,
            description: item.description,
            writer_name: item.writer_name,
            published_on: item.published_on,
            image: null,
            image_alt: item.image_alt || "",
            status: nextStatus,
        });
    };

    // --- History Features ---
    const handleViewHistory = async (id) => {
        setSelectedId(id);
        setVersionsList([]); // Clear previous
        try {
            const response = await api.get(`/cms-blog/${id}/versions`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setVersionsList(response.data);
        } catch (error) {
            toast.error("Failed to fetch version history.");
        }
    };

    const handleRestore = async (versionId) => {
        if (window.confirm("Are you sure you want to restore this version? Your current state will be backed up.")) {
            try {
                await api.post(`/cms-blog/${selectedId}/restore/${versionId}`, {}, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                toast.success("Blog restored to previous version!");
                fetchContentManagerPages();
                document.getElementById('historyModalClose').click();
            } catch (error) {
                toast.error("Failed to restore version.");
            }
        }
    };

    const handleManageSeoContentClick = (id, item) => {
        setSelectedId(id);
        setFormSeoContentData({
            slug: item?.slug ?? "",
            canonical_url: item?.canonical_url ?? "",
            meta_title: item?.meta_title ?? "",
            meta_description: item?.meta_description ?? "",
            meta_keywords: item?.meta_keywords ?? "",
            custom_code: item?.custom_code ?? "",
            meta_robots_index: item?.meta_robots_index ?? "index",
            meta_robots_follow: item?.meta_robots_follow ?? "follow",
            include_in_sitemap: item?.include_in_sitemap ?? true,
            sitemap_change_frequency: item?.sitemap_change_frequency ?? DEFAULT_SITEMAP_CHANGE_FREQUENCY,
            sitemap_priority: String(item?.sitemap_priority ?? DEFAULT_SITEMAP_PRIORITY),
        });
    };

    const deleteHandler = async (id) => {
        if (!canDelete) {
            toast.error(getDeletePermissionMessage("this blog"));
            return;
        }

        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                const response = await api.delete(`/cms-blog/${id}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                if (response.status === 200) {
                    fetchContentManagerPages();
                } else {
                    toast.error("Failed to delete blog. Please try again.");
                }
            } catch (error) {
                toast.error("Failed to delete blog. Please try again.");
                console.error("Error:", error);
            }
        }
    };

    const setDescriptionData = (data) => {
        setFormData((prevData) => ({ ...prevData, description: data }));
    };

    const quickApproveHandler = async (id) => {
        try {
            const response = await api.patch(
                `/cms-blog/${id}`,
                { status: "Published" },
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                },
            );

            if (response.status === 200) {
                fetchContentManagerPages();
                toast.success("Blog approved and published.");
            }
        } catch (error) {
            toast.error("Failed to approve blog.");
        }
    };

    const handleSeoContentInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormSeoContentData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSeoContentSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = {
            slug: formSeoContentData.slug,
            canonical_url: formSeoContentData.canonical_url,
            meta_title: formSeoContentData.meta_title,
            meta_description: formSeoContentData.meta_description,
            meta_keywords: formSeoContentData.meta_keywords,
            custom_code: formSeoContentData.custom_code,
            meta_robots_index: formSeoContentData.meta_robots_index,
            meta_robots_follow: formSeoContentData.meta_robots_follow,
            include_in_sitemap: formSeoContentData.include_in_sitemap,
            sitemap_change_frequency: formSeoContentData.sitemap_change_frequency,
            sitemap_priority: formSeoContentData.sitemap_priority,
        };

        try {
            const response = await api.patch(`/cms-blog/seo-content/${selectedId}`, formDataToSend, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (response.status === 200) {
                fetchContentManagerPages();
                if (!canPublish && response.data?.status === "Pending Approval") {
                    toast.info("SEO changes moved this blog to Pending Approval for admin review.");
                } else {
                    toast.success("SEO Content saved successfully.");
                }
                document.getElementById('seoContentModalClose').click();
            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Error submitting form.");
            console.error("Error:", error);
        }
    }

    return (
        <AuthMainLayout>
            <div className="container my-5">
                <h1 className="mb-4 text-center">CMS - Blog</h1>
                {(!canPublish || !canDelete) && (
                    <div className="alert alert-info">
                        Editors can create and update blogs. Publish and delete access can be granted separately by an admin.
                    </div>
                )}
                <div className="d-flex justify-content-end mb-3">
                    <button
                        onClick={handleAddNewClick}
                        type="button"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#addNewpageModal"
                    >
                        Add New
                    </button>
                </div>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="table-responsive">
                        <table
                            id="usersTable"
                            className="table display table-striped table-bordered"
                            style={{ width: "100%" }}
                        >
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>Title</th>
                                    <th>Writer Name</th>
                                    <th>Published On</th>
                                    <th>Status</th>
                                    <th>Image</th>
                                    <th>SEO Content</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagesList && pagesList?.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.title}</td>
                                        <td>{item.writer_name}</td>
                                        <td>{item?.published_on ? new Date(item?.published_on).toLocaleDateString() : ""}</td>
                                        <td>
                                            <span className={`badge ${item.status === "Published" ? "bg-success" : item.status === "Pending Approval" ? "bg-info text-dark" : "bg-warning text-dark"}`}>
                                                {item.status || "Draft"}
                                            </span>
                                        </td>
                                        <td>
                                            <img src={item.image} alt={item.image_alt || item.title || "Blog Image"} height="80" decoding="async"  loading="lazy" />
                                        </td>
                                        <td width={150}>
                                            <button onClick={() => handleManageSeoContentClick(item.id, item.seo_content)} className="btn btn-info" type="button" data-bs-toggle="modal" data-bs-target="#seoContentModal">SEO Content</button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleEditClick(item)} type="button" className="read_morebtn mb-2" data-bs-toggle="modal" data-bs-target="#editNewpageModal">
                                                Edit
                                            </button>
                                            <button onClick={() => handleViewHistory(item.id)} type="button" className="ms-2 btn btn-secondary mb-2" data-bs-toggle="modal" data-bs-target="#historyModal">
                                                History
                                            </button>
                                            {canPublish && item.status === "Pending Approval" && (
                                                <button className="ms-2 btn btn-success mb-2" onClick={() => quickApproveHandler(item.id)}>
                                                    Approve
                                                </button>
                                            )}
                                            {item.status === "Published" && item.seo_content?.slug && (
                                                <a
                                                    className="ms-2 btn btn-outline-success mb-2"
                                                    href={`/${item.seo_content.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Live Link
                                                </a>
                                            )}
                                            {canDelete && <button className="ms-2 btn btn-danger mb-2" onClick={() => deleteHandler(item.id)}>Delete</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Version History Modal */}
            <div className="modal fade" id="historyModal" tabIndex="-1" aria-labelledby="historyModalLabel" aria-hidden="true" data-bs-focus="false">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="historyModalLabel">Version History</h1>
                            <button type="button" id="historyModalClose" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {versionsList.length === 0 ? (
                                <p className="text-center my-4 text-muted">No history found for this blog.</p>
                            ) : (
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Saved At</th>
                                            <th>Title Record</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {versionsList.map((version) => (
                                            <tr key={version.id}>
                                                <td>{new Date(version.savedAt).toLocaleString()}</td>
                                                <td>{version.title}</td>
                                                <td>
                                                    <button onClick={() => handleRestore(version.id)} className="btn btn-sm btn-warning">
                                                        Restore this version
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add New Modal */}
            <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-focus="false">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Page</h1>
                            <button type="button" id="addNewpageModalClose" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {/* 🌟 Unified submission handler */}
                        <form onSubmit={handleFormSubmit}>
                            <div className="modal-body row">
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Title</label>
                                    <input type="text" className="form-control" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Description</label>
                                    <CKEditorComponent pageData={formData.description} setPageData={setDescriptionData} />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Writer Name</label>
                                    <input type="text" className="form-control" name="writer_name" placeholder="Writer Name" value={formData.writer_name} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Published On</label>
                                    <input type="date" className="form-control" name="published_on" placeholder="Published On" value={formData.published_on} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Image</label>
                                    <input type="file" className="form-control" name="image" accept="image/*" onChange={handleInputChange} />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Image Alt Text</label>
                                    <input type="text" className="form-control" name="image_alt" placeholder="Describe the featured image" value={formData.image_alt} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Workflow Status</label>
                                    <select className="form-control" name="status" value={formData.status} onChange={handleInputChange}>
                                        <option value="Draft">Draft</option>
                                        <option value="Pending Approval">Pending Approval</option>
                                        {canPublish && <option value="Published">Published</option>}
                                    </select>
                                </div>
                                <div className="m-auto mt-2 col-12 d-flex flex-column align-items-center">
                                    <button className="px-5 read_morebtn" type="submit">Save</button>
                                    <div className="mt-2 text-muted small" style={{ minHeight: '20px' }}>
                                        {isAutosaving ? "Saving draft..." : (lastSavedTime ? `Draft autosaved at ${lastSavedTime.toLocaleTimeString()}` : "")}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <div className="modal fade" id="editNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-focus="false">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit</h1>
                            <button type="button" id="editNewpageModalClose" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {/* 🌟 Unified submission handler */}
                        <form onSubmit={handleFormSubmit}>
                            <div className="modal-body row">
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Title</label>
                                    <input type="text" className="form-control" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Description</label>
                                    <CKEditorComponent pageData={formData.description} setPageData={setDescriptionData} />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Writer Name</label>
                                    <input type="text" className="form-control" name="writer_name" placeholder="Writer Name" value={formData.writer_name} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Published On</label>
                                    <input type="date" className="form-control" name="published_on" placeholder="Published On" value={formData.published_on && !isNaN(new Date(formData.published_on)) ? format(new Date(formData.published_on), "yyyy-MM-dd") : ''} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Image</label>
                                    <input type="file" className="form-control" name="image" accept="image/*" onChange={handleInputChange} />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Image Alt Text</label>
                                    <input type="text" className="form-control" name="image_alt" placeholder="Describe the featured image" value={formData.image_alt} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Workflow Status</label>
                                    <select className="form-control" name="status" value={formData.status} onChange={handleInputChange}>
                                        <option value="Draft">Draft</option>
                                        <option value="Pending Approval">Pending Approval</option>
                                        {canPublish && <option value="Published">Published</option>}
                                    </select>
                                </div>
                                
                                <div className="m-auto mt-2 col-12 d-flex flex-column align-items-center">
                                    <button className="px-5 read_morebtn" type="submit">
                                        Save Changes
                                    </button>
                                    <div className="mt-2 text-muted small" style={{ minHeight: '20px' }}>
                                        {isAutosaving ? "Saving draft..." : (lastSavedTime ? `Draft autosaved at ${lastSavedTime.toLocaleTimeString()}` : "")}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* SEO Modal */}
            <div className="modal fade" id="seoContentModal" tabIndex="-1" aria-labelledby="seoContentModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="seoContentModalLabel">Manage SEO Content</h1>
                            <button type="button" id="seoContentModalClose" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSeoContentSubmit}>
                            <div className="modal-body row">
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Slug</label>
                                    <input type="text" className="form-control" name="slug" placeholder="Slug" value={formSeoContentData.slug} onChange={handleSeoContentInputChange} required />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Canonical URL</label>
                                    <input type="text" className="form-control" name="canonical_url" placeholder="Canonical URL" value={formSeoContentData.canonical_url} onChange={handleSeoContentInputChange} required />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Meta Title</label>
                                    <input type="text" className="form-control" name="meta_title" placeholder="Meta Title" value={formSeoContentData.meta_title} onChange={handleSeoContentInputChange} required />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Meta Description</label>
                                    <textarea className="form-control" name="meta_description" placeholder="Meta Description" value={formSeoContentData.meta_description} onChange={handleSeoContentInputChange} rows="3" required></textarea>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Search Engine Indexing</label>
                                    <select className="form-control" name="meta_robots_index" value={formSeoContentData.meta_robots_index} onChange={handleSeoContentInputChange}>
                                        <option value="index">Index</option>
                                        <option value="noindex">No Index</option>
                                    </select>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Link Following</label>
                                    <select className="form-control" name="meta_robots_follow" value={formSeoContentData.meta_robots_follow} onChange={handleSeoContentInputChange}>
                                        <option value="follow">Follow</option>
                                        <option value="nofollow">No Follow</option>
                                    </select>
                                </div>
                                <div className="mb-3 col-md-12">
                                    <div className="form-check form-switch bg-light rounded border p-3">
                                        <input className="form-check-input" type="checkbox" role="switch" id="blogIncludeInSitemap" name="include_in_sitemap" checked={Boolean(formSeoContentData.include_in_sitemap)} onChange={handleSeoContentInputChange} />
                                        <label className="form-check-label fw-bold ms-2" htmlFor="blogIncludeInSitemap">Include this blog in sitemap.xml</label>
                                    </div>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Sitemap Change Frequency</label>
                                    <select className="form-control" name="sitemap_change_frequency" value={formSeoContentData.sitemap_change_frequency} onChange={handleSeoContentInputChange}>
                                        {SITEMAP_CHANGE_FREQUENCY_OPTIONS.map((option) => (
                                            <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Sitemap Priority</label>
                                    <input type="number" className="form-control" name="sitemap_priority" min="0" max="1" step="0.1" value={formSeoContentData.sitemap_priority} onChange={handleSeoContentInputChange} />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Meta Keywords</label>
                                    <input type="text" className="form-control" name="meta_keywords" placeholder="Meta Keywords" value={formSeoContentData.meta_keywords} onChange={handleSeoContentInputChange} required />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Custom Code</label>
                                    <textarea className="form-control" name="custom_code" placeholder="Custom Code" rows="3" value={formSeoContentData.custom_code} onChange={handleSeoContentInputChange}></textarea>
                                </div>
                                <div className="m-auto mt-2 col-12 d-flex justify-content-center">
                                    <button className="px-5 read_morebtn" type="submit">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthMainLayout>
    );
};

export default CmsBlog;