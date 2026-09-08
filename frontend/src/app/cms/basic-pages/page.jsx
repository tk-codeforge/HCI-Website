"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import {
    DEFAULT_SITEMAP_CHANGE_FREQUENCY,
    DEFAULT_SITEMAP_PRIORITY,
    SITEMAP_CHANGE_FREQUENCY_OPTIONS
} from "@/utils/seoHelpers";
import { getCmsAccess, getDeletePermissionMessage, getPublishWorkflowMessage } from "@/utils/cmsAccess";

const CKEditorComponent = dynamic(() => import('@/app/components/CKEditorComponent'), { ssr: false });

const initialFormState = {
    title: "",
    writer_name: "",
    show_author_date: false,
    content: "",
    status: "Draft",
    faqs: [],
    accordions: []
};

const CmsBasicPages = () => {
    const user = useSelector((state) => state.auth.user);
    const authToken = useSelector((state) => state.auth.authToken) || user?.token;
    const { canPublish, canDelete } = getCmsAccess(user);

    const [pagesList, setPagesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('content'); // 'content', 'faqs', 'accordions', 'preview'
    const [formData, setFormData] = useState(initialFormState);
    const [selectedId, setSelectedId] = useState(null);

    const [formSeoContentData, setFormSeoContentData] = useState({
        slug: "", canonical_url: "", meta_title: "", meta_description: "", meta_keywords: "", custom_code: "",
        meta_robots_index: "index", meta_robots_follow: "follow", include_in_sitemap: true,
        sitemap_change_frequency: DEFAULT_SITEMAP_CHANGE_FREQUENCY, sitemap_priority: String(DEFAULT_SITEMAP_PRIORITY),
        og_title: "", og_description: "", og_image: ""
    });

    const fetchPages = useCallback(async () => {
        setLoading(true);
        try {
            const token = authToken || (typeof window !== "undefined" ? localStorage.getItem("token") : "");
            const response = await api.get("/cms-basic-pages/all", { headers: { Authorization: `Bearer ${token}` } });
            setPagesList(response.data || []);
        } catch (err) {
            toast.error("Error fetching pages.");
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => { fetchPages(); }, [fetchPages]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const setContentData = (data) => setFormData((prev) => ({ ...prev, content: data }));

    const handleAddStandardBlock = (type) => setFormData(prev => ({ ...prev, [type]: [...prev[type], type === 'faqs' ? { question: '', answer: '' } : { title: '', content: '' }] }));
    const handleRemoveStandardBlock = (type, index) => setFormData(prev => { const newArray = [...prev[type]]; newArray.splice(index, 1); return { ...prev, [type]: newArray }; });
    const handleStandardBlockChange = (type, index, field, value) => setFormData(prev => { const newArray = [...prev[type]]; newArray[index][field] = value; return { ...prev, [type]: newArray }; });

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/cms-basic-pages", formData, { headers: { Authorization: `Bearer ${authToken}` } });
            if (response.status === 201 || response.status === 200) {
                fetchPages(); 
                toast.success("Basic Page created.");
                setFormData(initialFormState);
                document.getElementById('addNewpageModalClose').click();
            }
        } catch (error) { toast.error("Error submitting form."); }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.patch(`/cms-basic-pages/${selectedId}`, formData, { headers: { Authorization: `Bearer ${authToken}` } });
            if (response.status === 200) {
                fetchPages(); 
                toast.success("Page updated.");
                document.getElementById('editNewpageModalClose').click();
            }
        } catch (error) { toast.error("Error updating page."); }
    };

    const deleteHandler = async (id) => {
        if (!canDelete) return toast.error(getDeletePermissionMessage("this page"));
        if (window.confirm("Delete this page?")) {
            try {
                await api.delete(`/cms-basic-pages/${id}`, { headers: { Authorization: `Bearer ${authToken}` } });
                fetchPages(); toast.success("Page deleted."); 
            } catch (error) { toast.error("Failed to delete."); }
        }
    };

    const duplicateHandler = async (id) => {
        try {
            await api.post(`/cms-basic-pages/${id}/duplicate`, {}, { headers: { Authorization: `Bearer ${authToken}` } });
            fetchPages(); toast.success("Page duplicated.");
        } catch (error) { toast.error("Failed to duplicate page."); }
    };

    const handleEditClick = (item) => {
        setSelectedId(item.id);
        setActiveTab('content');
        setFormData({
            title: item.title, writer_name: item.writer_name || "", show_author_date: item.show_author_date || false,
            content: item.content || "", status: item.status || "Draft", faqs: item.faqs || [], accordions: item.accordions || []
        });
    };

    const handleManageSeoContentClick = (id, item) => {
        setSelectedId(id);
        setFormSeoContentData({
            slug: item?.slug || "", canonical_url: item?.canonical_url || "", meta_title: item?.meta_title || "", 
            meta_description: item?.meta_description || "", meta_keywords: item?.meta_keywords || "", custom_code: item?.custom_code || "",
            meta_robots_index: item?.meta_robots_index || "index", meta_robots_follow: item?.meta_robots_follow || "follow", 
            include_in_sitemap: item?.include_in_sitemap ?? true, sitemap_change_frequency: item?.sitemap_change_frequency || DEFAULT_SITEMAP_CHANGE_FREQUENCY,
            sitemap_priority: String(item?.sitemap_priority ?? DEFAULT_SITEMAP_PRIORITY), og_title: item?.og_title || "", 
            og_description: item?.og_description || "", og_image: item?.og_image || "",
        });
    };

    const handleSeoContentSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/cms-basic-pages/seo-content/${selectedId}`, formSeoContentData, { headers: { Authorization: `Bearer ${authToken}` } });
            fetchPages(); toast.success("SEO saved.");
            document.getElementById('seoContentModalClose').click(); 
        } catch (error) { toast.error("Error saving SEO."); }
    };

    const handleSeoContentInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormSeoContentData((prevData) => ({ ...prevData, [name]: type === "checkbox" ? checked : value }));
    };

    const renderDynamicBlocks = (type) => (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold">{type === 'faqs' ? 'FAQ Sections' : 'Accordion Sections'}</h6>
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => handleAddStandardBlock(type)}>+ Add {type === 'faqs' ? 'FAQ' : 'Accordion'}</button>
            </div>
            {formData[type].map((block, index) => (
                <div key={index} className="card mb-3 border-light shadow-sm">
                    <div className="card-body">
                        <div className="d-flex justify-content-between mb-2">
                            <span className="badge bg-secondary">Item #{index + 1}</span>
                            <button type="button" className="btn btn-sm btn-danger" onClick={() => handleRemoveStandardBlock(type, index)}>Remove</button>
                        </div>
                        <input type="text" className="form-control mb-2" placeholder={type === 'faqs' ? 'Question' : 'Title'} value={type === 'faqs' ? block.question : block.title} onChange={(e) => handleStandardBlockChange(type, index, type === 'faqs' ? 'question' : 'title', e.target.value)} />
                        <textarea className="form-control" rows="3" placeholder={type === 'faqs' ? 'Answer' : 'Content'} value={type === 'faqs' ? block.answer : block.content} onChange={(e) => handleStandardBlockChange(type, index, type === 'faqs' ? 'answer' : 'content', e.target.value)} />
                    </div>
                </div>
            ))}
        </div>
    );

    const renderFormBody = () => (
        <div className="modal-body p-4 bg-light">
            <ul className="nav nav-tabs nav-fill mb-4 bg-white rounded shadow-sm">
                <li className="nav-item"><button type="button" className={`nav-link text-dark py-3 ${activeTab === 'content' ? 'active fw-bold bg-primary text-white' : ''}`} onClick={() => setActiveTab('content')}>Basic Info & Editor</button></li>
                <li className="nav-item"><button type="button" className={`nav-link text-dark py-3 ${activeTab === 'faqs' ? 'active fw-bold bg-primary text-white' : ''}`} onClick={() => setActiveTab('faqs')}>FAQs ({formData.faqs.length})</button></li>
                <li className="nav-item"><button type="button" className={`nav-link text-dark py-3 ${activeTab === 'accordions' ? 'active fw-bold bg-primary text-white' : ''}`} onClick={() => setActiveTab('accordions')}>Accordions ({formData.accordions.length})</button></li>
                <li className="nav-item"><button type="button" className={`nav-link text-dark py-3 ${activeTab === 'preview' ? 'active fw-bold bg-success text-white' : ''}`} onClick={() => setActiveTab('preview')}><i className="bi bi-eye"></i> Live Preview</button></li>
            </ul>

            {activeTab === 'content' && (
                <div className="row g-3 bg-white p-4 rounded shadow-sm border">
                    <div className="col-md-6"><label className="form-label fw-bold">Page Title *</label><input type="text" className="form-control form-control-lg" name="title" value={formData.title} onChange={handleInputChange} required /></div>
                    <div className="col-md-3"><label className="form-label fw-bold">Author Name</label><input type="text" className="form-control form-control-lg" name="writer_name" value={formData.writer_name} onChange={handleInputChange} /></div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Status</label>
                        <select className="form-select form-select-lg" name="status" value={formData.status} onChange={handleInputChange}>
                            <option value="Draft">Draft</option>
                            <option value="Pending Approval">Pending Approval</option>
                            {canPublish && <option value="Published">Published</option>}
                        </select>
                    </div>
                    <div className="col-md-12 mt-3">
                        <div className="form-check form-switch fs-5 bg-light p-3 rounded border">
                            <input className="form-check-input ms-0 me-3 shadow-sm" type="checkbox" role="switch" name="show_author_date" id="showAuthorDate" checked={formData.show_author_date} onChange={handleInputChange} style={{cursor: 'pointer'}} />
                            <label className="form-check-label fs-6 mt-1" htmlFor="showAuthorDate" style={{cursor: 'pointer'}}><strong>Display Author & Date on Page</strong></label>
                        </div>
                    </div>
                    <div className="col-md-12 mt-4"><label className="form-label fw-bold">Main Content</label><div className="border rounded"><CKEditorComponent pageData={formData.content} setPageData={setContentData} /></div></div>
                </div>
            )}
            {activeTab === 'faqs' && renderDynamicBlocks('faqs')}
            {activeTab === 'accordions' && renderDynamicBlocks('accordions')}
            {activeTab === 'preview' && (
                <div className="mt-4 border rounded p-4 bg-white shadow-sm" style={{minHeight: "500px"}}>
                    <div className="ck-content mb-5" dangerouslySetInnerHTML={{ __html: formData.content || "<p className='text-muted'>Main content will appear here...</p>" }}></div>
                </div>
            )}
        </div>
    );

    return (
        <AuthMainLayout>
            <div className="container-fluid my-5">
                <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h1 className="h3 mb-0 text-gray-800">Basic Pages</h1>
                            <button onClick={() => { setFormData(initialFormState); setActiveTab('content'); }} type="button" className="btn btn-primary px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#addNewpageModal">+ Add Basic Page</button>
                        </div>
                        
                        {loading && !pagesList.length ? (
                            <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle border" style={{ width: "100%" }}>
                                    <thead className="table-light"><tr><th>SN</th><th>Title</th><th>Status</th><th>SEO Settings</th><th className="text-end">Actions</th></tr></thead>
                                    <tbody>
                                        {pagesList.length > 0 ? pagesList.map((item, index) => (
                                            <tr key={item.id}>
                                                <td className="fw-bold text-muted">{index + 1}</td>
                                                <td className="fw-semibold text-dark">{item.title}</td>
                                                <td><span className={`badge rounded-pill px-3 py-2 ${item.status === 'Published' ? 'bg-success' : 'bg-warning text-dark'}`}>{item.status || 'Draft'}</span></td>
                                                <td><button onClick={() => handleManageSeoContentClick(item.id, item.seo_content || item)} className="btn btn-outline-info btn-sm" data-bs-toggle="modal" data-bs-target="#seoContentModal">Manage SEO</button></td>
                                                <td className="text-end">
                                                    {item.status === 'Published' && item.seo_content?.slug && (
                                                        <a href={`/p/${item.seo_content.slug}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-success me-2 shadow-sm">Live Link</a>
                                                    )}
                                                    <button onClick={() => duplicateHandler(item.id)} className="btn btn-sm btn-outline-secondary me-2 shadow-sm">Duplicate</button>
                                                    <button onClick={() => handleEditClick(item)} className="btn btn-sm btn-primary me-2 shadow-sm" data-bs-toggle="modal" data-bs-target="#editNewpageModal">Edit</button>
                                                    {canDelete && <button className="btn btn-sm btn-danger shadow-sm" onClick={() => deleteHandler(item.id)}>Delete</button>}
                                                </td>
                                            </tr>
                                        )) : (<tr><td colSpan="5" className="text-center py-4 text-muted">No basic pages found.</td></tr>)}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-hidden="true" data-bs-focus="false">
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content border-0">
                        <div className="modal-header bg-dark text-white py-3">
                            <h5 className="modal-title fw-bold">Create Basic Page</h5>
                            <button type="button" id="addNewpageModalClose" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleAddSubmit}>
                            {renderFormBody()}
                            <div className="modal-footer bg-white border-top shadow-sm position-sticky bottom-0">
                                <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">Close</button>
                                <button className="btn btn-primary px-5 fw-bold" type="submit">Save Page</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <div className="modal fade" id="editNewpageModal" tabIndex="-1" aria-hidden="true" data-bs-focus="false">
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content border-0">
                        <div className="modal-header bg-dark text-white py-3">
                            <h5 className="modal-title fw-bold">Edit Basic Page</h5>
                            <button type="button" id="editNewpageModalClose" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            {renderFormBody()}
                            <div className="modal-footer bg-white border-top shadow-sm position-sticky bottom-0">
                                <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">Close</button>
                                <button className="btn btn-primary px-5 fw-bold" type="submit">Update Page</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Advanced SEO Content Modal (Identical to your original, just pointing to Basic Pages API) */}
            <div className="modal fade" id="seoContentModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header bg-info text-white">
                            <h5 className="modal-title fw-bold">Search Engine Optimization (SEO)</h5>
                            <button type="button" id="seoContentModalClose" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleSeoContentSubmit}>
                            <div className="modal-body p-4 row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">URL Slug *</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light text-muted small">/p/</span>
                                        <input type="text" className="form-control" name="slug" placeholder="about-us" value={formSeoContentData.slug} onChange={handleSeoContentInputChange} required />
                                    </div>
                                </div>
                                <div className="col-md-6"><label className="form-label fw-bold">Canonical URL</label><input type="text" className="form-control" name="canonical_url" value={formSeoContentData.canonical_url} onChange={handleSeoContentInputChange} /></div>
                                <div className="col-md-12 mt-3"><label className="form-label fw-bold">Meta Title</label><input type="text" className="form-control" name="meta_title" value={formSeoContentData.meta_title} onChange={handleSeoContentInputChange} required /></div>
                                <div className="col-md-12 mt-3"><label className="form-label fw-bold">Meta Description</label><textarea className="form-control" name="meta_description" value={formSeoContentData.meta_description} onChange={handleSeoContentInputChange} rows="2" required></textarea></div>
                            </div>
                            <div className="modal-footer bg-light"><button className="btn btn-info px-5 text-white fw-bold" type="submit">Save SEO Data</button></div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthMainLayout>
    );
};

export default CmsBasicPages;