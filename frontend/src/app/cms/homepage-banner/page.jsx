"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";

const CmsHomepageBanner = () => {
    const authToken = useSelector((state) => state.auth.authToken);
    const [pagesList, setPagesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const [formData, setFormData] = useState({
        title: "", sub_title: "", top_slogan: "", description: "", 
        button_text: "", button_link: "", text_color: "#ffffff", 
        top_icon: null, banner_image: null, mobile_banner_image: null, // 🌟 Added mobile_banner_image
        item_index: null, action: "add", is_active: true
    });
    
    const fetchContentManagerPages = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/cms-content/homepage_banner', {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (response.data && response.data.json_content) {
                setPagesList(response.data.json_content);
                setSelectedId(response.data.id);
            }
        } catch (err) {
            toast.error(err.message || "Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => { fetchContentManagerPages(); }, [fetchContentManagerPages]);

    const handleInputChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        // 🌟 Check for new mobile_banner_image input
        if ((name === "top_icon" || name === "banner_image" || name === "mobile_banner_image") && files.length > 0) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else if (type === 'checkbox') {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) formDataToSend.append(key, formData[key]);
        });
    try {
        // Fallback to 0 or 1 so ParseIntPipe doesn't fail on a clean start
        const targetId = selectedId || 0; 
        
        const response = await api.patch(`/cms-content/update-json-homepage-banner/${targetId}`, formDataToSend, {
            headers: { Authorization: `Bearer ${authToken}` }, // Removed strict multipart boundary!
        });
            if (response.status === 200) {
                fetchContentManagerPages();
                toast.success(formData.action === 'add' ? "Banner added." : "Banner updated.");
                document.getElementById('addNewpageModalClose').click();
            }
        } catch (error) { toast.error("Error saving banner."); }
    };

    const handleToggleActive = async (index, currentStatus) => {
        const formDataToSend = new FormData();
        formDataToSend.append("action", "toggle_active");
        formDataToSend.append("item_index", index);
        formDataToSend.append("is_active", (!currentStatus).toString());

        try {
            await api.patch(`/cms-content/update-json-homepage-banner/${selectedId}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
            });
            fetchContentManagerPages();
            toast.success(!currentStatus ? "Slide is now Visible!" : "Slide is now Hidden!");
        } catch (error) { toast.error("Error updating visibility."); }
    };

    const handleReorder = async (fromIndex, toIndex) => {
        if (fromIndex === toIndex) return;
        const newList = [...pagesList];
        const [moved] = newList.splice(fromIndex, 1);
        newList.splice(toIndex, 0, moved);
        setPagesList(newList);

        const formDataToSend = new FormData();
        formDataToSend.append("action", "reorder");
        formDataToSend.append("from_index", fromIndex);
        formDataToSend.append("to_index", toIndex);

        try {
            await api.patch(`/cms-content/update-json-homepage-banner/${selectedId}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
            });
            toast.success("Order updated successfully!");
        } catch (error) { 
            toast.error("Error updating order.");
            fetchContentManagerPages(); 
        }
    };

    const handleDelete = async (index) => {
        if(!window.confirm("Are you sure you want to delete this banner?")) return;
        const formDataToSend = new FormData();
        formDataToSend.append("item_index", index);
        formDataToSend.append("action", "delete");
        try {
            await api.patch(`/cms-content/update-json-homepage-banner/${selectedId}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
            });
            fetchContentManagerPages();
            toast.success("Banner deleted.");
        } catch (error) { toast.error("Error deleting banner."); }
    };

    const handleEditClick = (item, index) => {
        setFormData({
            ...item, 
            item_index: index, 
            action: "update", 
            top_icon: null, 
            banner_image: null, 
            mobile_banner_image: null, // Ensure file inputs are clean
            text_color: item.text_color || "#ffffff",
            is_active: item.is_active !== false
        });
    };

    const handleAddNewClick = () => {
        setFormData({
            title: "", sub_title: "", top_slogan: "", description: "", button_text: "", button_link: "", text_color: "#ffffff",
            top_icon: null, banner_image: null, mobile_banner_image: null, item_index: pagesList.length, action: "add", is_active: true
        });
    };

    return (
        <AuthMainLayout>
            <div className="container my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="text-center mb-0">CMS - Homepage Banner</h1>
                    <button onClick={handleAddNewClick} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addNewpageModal" style={{ backgroundColor: '#ff914d', borderColor: '#ff914d' }}>
                        + Add New Banner
                    </button>
                </div>

                {loading ? <div className="text-center">Loading...</div> : (
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered" style={{ width: "100%", verticalAlign: 'middle' }}>
                            <thead className="table-light">
                                <tr>
                                    <th width="50">Drag</th>
                                    <th>Status</th>
                                    <th>Content</th>
                                    <th>Media Preview</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagesList && pagesList?.map((item, index) => {
                                    const isVideo = item?.banner_image?.match(/\.(mp4|webm|ogg)$/i);
                                    const isMobileVideo = item?.mobile_banner_image?.match(/\.(mp4|webm|ogg)$/i);
                                    const isActive = item.is_active !== false;
                                    
                                    return (
                                        <tr 
                                            key={index} 
                                            draggable 
                                            onDragStart={() => setDraggedItemIndex(index)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => handleReorder(draggedItemIndex, index)}
                                            style={{ backgroundColor: draggedItemIndex === index ? '#f8f9fa' : 'white', opacity: isActive ? 1 : 0.6 }}
                                        >
                                            <td style={{ cursor: 'grab', fontSize: '20px', textAlign: 'center', color: '#888' }}>
                                                ☰
                                            </td>
                                            <td>
                                                <div className="form-check form-switch d-flex justify-content-center">
                                                    <input 
                                                        className="form-check-input" 
                                                        type="checkbox" 
                                                        checked={isActive}
                                                        onChange={() => handleToggleActive(index, isActive)}
                                                        style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <strong>{item.title || '(No Title)'}</strong><br/>
                                                <small className="text-muted">{item.sub_title}</small>
                                            </td>
                                            <td>
                                                {/* 🌟 Desktop Preview */}
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <span className="badge bg-secondary">Desktop</span>
                                                    {isVideo ? (
                                                        <video src={item?.banner_image} height="40" muted playsInline />
                                                    ) : (
                                                        <img src={item?.banner_image} alt="Desktop Banner" height="40" decoding="async" loading="lazy" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                                                    )}
                                                </div>
                                                
                                                {/* 🌟 Mobile Preview */}
                                                {item?.mobile_banner_image && (
                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="badge bg-info">Mobile</span>
                                                        {isMobileVideo ? (
                                                            <video src={item?.mobile_banner_image} height="40" muted playsInline />
                                                        ) : (
                                                            <img src={item?.mobile_banner_image} alt="Mobile Banner" height="40" decoding="async" loading="lazy" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <button onClick={() => handleEditClick(item, index)} className="btn btn-sm btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#addNewpageModal">Edit</button>
                                                <button onClick={() => handleDelete(index)} className="btn btn-sm btn-outline-danger">Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <small className="text-muted">💡 Hint: Click and drag the <b>☰</b> icon to reorder slides.</small>
                    </div>
                )}
            </div>

            <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">{formData.action === 'add' ? 'Add New Banner' : 'Edit Banner'}</h1>
                            <button type="button" className="btn-close" id="addNewpageModalClose" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body row">
                                <div className="mb-3 col-md-12 d-flex align-items-center">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" name="is_active" id="isActiveSwitch" checked={formData.is_active} onChange={handleInputChange} />
                                        <label className="form-check-label ms-2" htmlFor="isActiveSwitch"><b>Show this banner on the Website</b></label>
                                    </div>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Title</label>
                                    <input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Sub Title</label>
                                    <input type="text" className="form-control" name="sub_title" value={formData.sub_title} onChange={handleInputChange} />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Top Slogan</label>
                                    <input type="text" className="form-control" name="top_slogan" value={formData.top_slogan} onChange={handleInputChange} />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-control" name="description" rows="2" value={formData.description} onChange={handleInputChange}></textarea>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Button Text</label>
                                    <input type="text" className="form-control" name="button_text" value={formData.button_text} onChange={handleInputChange} placeholder="e.g. Explore More" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Button Link</label>
                                    <input type="text" className="form-control" name="button_link" value={formData.button_link} onChange={handleInputChange} placeholder="e.g. /portfolio" />
                                </div>
                                
                                <div className="mb-3 col-md-12 border-top pt-3">
                                    <label className="form-label fw-bold">Banner Text Color</label>
                                    <div className="d-flex align-items-center gap-3">
                                        <input 
                                            type="color" 
                                            className="form-control form-control-color" 
                                            name="text_color" 
                                            value={formData.text_color} 
                                            onChange={handleInputChange} 
                                            title="Choose your text color" 
                                            style={{ width: '60px', padding: '0.2rem', cursor: 'pointer' }}
                                        />
                                        <span className="text-muted border rounded px-2 py-1 bg-light">
                                            {formData.text_color.toUpperCase()}
                                        </span>
                                    </div>
                                    <small className="text-muted d-block mt-1">This color will apply to the Title, Subtitle, Slogan, and Description for this slide.</small>
                                </div>

                                {/* 🌟 Split Uploads for Desktop & Mobile */}
                                <div className="mb-3 col-md-6 border-top pt-3">
                                    <label className="form-label text-danger fw-bold">Desktop Media <small>(16:9)</small></label>
                                    <input type="file" className="form-control" name="banner_image" accept="image/*,video/mp4,video/webm" onChange={handleInputChange} required={formData.action === 'add'} />
                                    <small className="text-muted d-block mt-1">Images (JPG/PNG) or Video (MP4)</small>
                                </div>

                                <div className="mb-3 col-md-6 border-top pt-3">
                                    <label className="form-label text-primary fw-bold">Mobile Media <small>(Optional Portrait)</small></label>
                                    <input type="file" className="form-control" name="mobile_banner_image" accept="image/*,video/mp4,video/webm" onChange={handleInputChange} />
                                    <small className="text-muted d-block mt-1">Custom image/video for phones.</small>
                                </div>

                                <div className="m-auto mt-4 col-12 d-flex justify-content-center">
                                    <button className="px-5 btn btn-primary py-2" type="submit" style={{ backgroundColor: '#ff914d', borderColor: '#ff914d' }}>Save Changes</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthMainLayout>
    );
};

export default CmsHomepageBanner;