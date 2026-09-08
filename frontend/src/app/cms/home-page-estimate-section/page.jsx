"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";

const EstimateBannerCms = () => {
    const authToken = useSelector((state) => state.auth.authToken);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [formData, setFormData] = useState({
        is_active: true,
        heading: "Calculate the cost of your",
        rotating_words: "Kitchen, Wardrobe, Full Home, Living Room",
        description: "Select your floor plan to get a personalized, transparent estimate in seconds.",
        button_text: "Get Free Estimate",
        button_url: "/estimator", // NEW
        font_color: "#000000", // NEW
        bg_image: null, // NEW
        remove_bg: false
    });

    const fetchContent = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/cms-content/home_page_estimate_banner', {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (response.data && response.data.length > 0) {
                const record = response.data[0];
                setSelectedId(record.id);
                if (record.json_content) {
                    setFormData({
                        is_active: record.json_content.is_active !== false,
                        heading: record.json_content.heading || "",
                        rotating_words: record.json_content.rotating_words || "",
                        description: record.json_content.description || "",
                        button_text: record.json_content.button_text || "",
                        button_url: record.json_content.button_url || "", // NEW
                        font_color: record.json_content.font_color || "#000000", // NEW
                        bg_image: record.json_content.bg_image || null, // NEW
                        remove_bg: false
                    });
                }
            }
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'file' && files && files.length > 0) {
            setFormData((prev) => ({ ...prev, [name]: files[0], remove_bg: false }));
        } else {
            setFormData((prevData) => ({ 
                ...prevData, 
                [name]: type === 'checkbox' ? checked : value
        }));
    }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
        if (formData[key] !== null) formDataToSend.append(key, formData[key]);
    });

        try {
            if (selectedId) {
                await api.patch(`/cms-content/${selectedId}`, formDataToSend, { 
                headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}` 
                } 
            });
            toast.success("Calculator Settings updated successfully!");
            } else {
                await api.post(`/cms-content/home_page_estimate_banner`, formDataToSend, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}` 
                }
            });
            toast.success("Calculator Settings created successfully!");
            fetchContent();
            }
        } catch (error) {
            toast.error(error.message ?? "Error saving data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthMainLayout>
            <div className="container my-5">
                <div className="card shadow-sm border-0">
                    <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                        <h1 className="h4 mb-0" style={{ color: '#ff914d' }}>CMS - Home Page Estimate Section</h1>
                        <div className="form-check form-switch fs-5">
                            <input className="form-check-input" type="checkbox" name="is_active" id="isActive" checked={formData.is_active} onChange={handleInputChange} style={{ cursor: 'pointer' }} />
                            <label className="form-check-label fw-bold" htmlFor="isActive">Show on Website</label>
                        </div>
                    </div>
                    
                    <div className="card-body p-4 p-md-5">
                        {loading && !selectedId ? (
                            <div className="text-center py-5">Loading...</div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Button URL</label>
                                        <input type="text" className="form-control" name="button_url" value={formData.button_url} onChange={handleInputChange} placeholder="e.g. /estimator" required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Font Color</label>
                                        <input type="color" className="form-control form-control-color" name="font_color" value={formData.font_color} onChange={handleInputChange} title="Choose your color" />
                                    </div>

                                    <div className="col-md-12 border rounded p-3 mt-3">
                                        <label className="form-label fw-bold">Background Image</label>
                                        <input type="file" className="form-control mb-2" name="bg_image" accept="image/*" onChange={handleInputChange} />
                                        
                                        {/* Delete Background Button */}
                                        <div className="d-flex align-items-center mt-2">
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => setFormData(prev => ({ ...prev, bg_image: null, remove_bg: true }))}
                                            >
                                                Delete Background (Set to White)
                                            </button>
                                            {formData.remove_bg && <span className="ms-3 text-danger small">Background will be removed on save.</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Static Heading</label>
                                        <input type="text" className="form-control" name="heading" value={formData.heading} onChange={handleInputChange} placeholder="e.g. Calculate the cost of your" required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold text-primary">Rotating Words (Comma Separated)</label>
                                        <input type="text" className="form-control border-primary" name="rotating_words" value={formData.rotating_words} onChange={handleInputChange} placeholder="Kitchen, Wardrobe, Full Home" required />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Sub-Description</label>
                                        <textarea className="form-control" name="description" rows="2" value={formData.description} onChange={handleInputChange} placeholder="Select your floor plan..." required></textarea>
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Button Text</label>
                                        <input type="text" className="form-control" name="button_text" value={formData.button_text} onChange={handleInputChange} placeholder="e.g. Get Free Estimate" required />
                                    </div>

                                    <div className="col-12 text-center mt-5">
                                        <button type="submit" className="btn btn-primary px-5 py-2 fw-bold" style={{ backgroundColor: '#ff914d', borderColor: '#ff914d' }} disabled={loading}>
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AuthMainLayout>
    );
};

export default EstimateBannerCms;