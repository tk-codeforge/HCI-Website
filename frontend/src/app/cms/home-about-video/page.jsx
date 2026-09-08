"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";

const CmsHomeAboutVideo = () => {
    const authToken = useSelector((state) => state.auth.authToken);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        show_video_desktop: true,
        show_video_mobile: true,
        image_url: "", // Just for preview
        video_url: ""  // Just for preview
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get("/home-about-video");
                if (res.data) {
                    setFormData({
                        title: res.data.title || "",
                        description: res.data.description || "",
                        show_video_desktop: res.data.show_video_desktop,
                        show_video_mobile: res.data.show_video_mobile,
                        image_url: res.data.image,
                        video_url: res.data.video
                    });
                }
            } catch (err) {
                toast.error("Failed to load settings.");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("show_video_desktop", formData.show_video_desktop);
        data.append("show_video_mobile", formData.show_video_mobile);
        
        if (imageFile) data.append("image", imageFile);
        if (videoFile) data.append("video", videoFile);

        try {
            await api.patch("/home-about-video", data, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("About Us section updated successfully!");
            
            // Reload page to fetch new preview URLs
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            toast.error("Error saving updates.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <AuthMainLayout>
            <div className="container my-5">
                <div className="card shadow-sm border-0 rounded-4">
                    <div className="card-header bg-white py-4 border-bottom">
                        <h2 className="h4 mb-0 fw-bold">{`Manage "About Us" 3D Video Section`}</h2>
                    </div>
                    
                    {loading ? <p className="text-center p-5">Loading...</p> : (
                        <div className="card-body p-4 p-md-5">
                            <form onSubmit={handleSubmit} className="row g-4">
                                
                                <div className="col-12"><h5 className="text-primary fw-bold">1. Text Content</h5></div>
                                
                                <div className="col-md-12">
                                    <label className="form-label fw-bold">Title</label>
                                    <input type="text" className="form-control" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label fw-bold">Description</label>
                                    <textarea className="form-control" rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
                                </div>

                                <div className="col-12 mt-5"><h5 className="text-primary fw-bold">2. Media Uploads</h5></div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Fallback Image</label>
                                    {formData.image_url && <div className="mb-2"><img src={formData.image_url} alt="preview" style={{height: '80px', borderRadius: '8px'}} /></div>}
                                    <input type="file" className="form-control" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                                    <small className="text-muted">Displays if video is disabled.</small>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">3D Video (MP4)</label>
                                    {formData.video_url && <div className="mb-2"><video src={formData.video_url} style={{height: '80px', borderRadius: '8px'}} muted /></div>}
                                    <input type="file" className="form-control" accept="video/mp4,video/webm" onChange={(e) => setVideoFile(e.target.files[0])} />
                                    <small className="text-muted">Max size: 100MB.</small>
                                </div>

                                <div className="col-12 mt-5"><h5 className="text-primary fw-bold">3. Video Visibility Controls</h5></div>

                                <div className="col-md-6">
                                    <div className="form-check form-switch fs-5">
                                        <input className="form-check-input ms-0 me-2" type="checkbox" style={{cursor: 'pointer'}} checked={formData.show_video_desktop} onChange={(e) => setFormData({...formData, show_video_desktop: e.target.checked})} />
                                        <label className="form-check-label ms-2 mt-1">Play Video on Desktop</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-check form-switch fs-5">
                                        <input className="form-check-input ms-0 me-2" type="checkbox" style={{cursor: 'pointer'}} checked={formData.show_video_mobile} onChange={(e) => setFormData({...formData, show_video_mobile: e.target.checked})} />
                                        <label className="form-check-label ms-2 mt-1">Play Video on Mobile</label>
                                    </div>
                                </div>

                                <div className="col-12 mt-5 text-end border-top pt-4">
                                    <button type="submit" className="btn btn-primary px-5 py-3 fw-bold rounded-pill" disabled={saving}>
                                        {saving ? "SAVING UPDATES..." : "SAVE ABOUT US SECTION"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </AuthMainLayout>
    );
};
export default CmsHomeAboutVideo;