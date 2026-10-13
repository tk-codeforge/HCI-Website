"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";

const PopupManager = () => {
    const user = useSelector((state) => state.auth?.user);
    const authToken = user?.token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const initialFormState = { 
        id: null, 
        target_url: "", is_enabled: true, show_mobile: true, show_desktop: true, 
        trigger_type: "time", delay_seconds: 6, scroll_percentage: 50, 
        heading: "Let's build your dream space.", sub_heading: "Enter your details to get a free estimate.", 
        cta_text: "GET FREE QUOTE", lead_form_name: "Modern Popup Form",
        redirect_url: "/thank-you", success_message: "Details submitted successfully!"
    };
    
    const [formData, setFormData] = useState(initialFormState);
    const [desktopFile, setDesktopFile] = useState(null);
    const [mobileFile, setMobileFile] = useState(null);

    const fetchRules = async () => {
        try {
            const res = await api.get("/popup-rules");
            setRules(res.data || []);
        } catch (err) {
            toast.error("Error fetching rules.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRules(); }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleDesktopFileChange = (e) => {
        if (e.target.files && e.target.files[0]) setDesktopFile(e.target.files[0]);
    };

    const handleMobileFileChange = (e) => {
        if (e.target.files && e.target.files[0]) setMobileFile(e.target.files[0]);
    };

    const handleEdit = (rule) => {
        setFormData({ ...initialFormState, ...rule });
        setDesktopFile(null);
        setMobileFile(null);
        if (document.getElementById("desktopImageInput")) document.getElementById("desktopImageInput").value = ""; 
        if (document.getElementById("mobileImageInput")) document.getElementById("mobileImageInput").value = ""; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!authToken) {
            toast.error("Authentication Error: No token found. Please log in again.");
            return;
        }

        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                submitData.append(key, formData[key]);
            }
        });
        
        if (desktopFile) submitData.append("desktop_image", desktopFile);
        if (mobileFile) submitData.append("mobile_image", mobileFile);

        try {
            if (formData.id) {
                await api.patch(`/popup-rules/${formData.id}`, submitData, { 
                    headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "multipart/form-data" } 
                });
            } else {
                await api.post("/popup-rules", submitData, { 
                    headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "multipart/form-data" } 
                });
            }
            
            toast.success("Popup rule saved successfully!");
            handleEdit(initialFormState);
            fetchRules();
            document.getElementById("ruleModalClose").click();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save rule.");
        }
    };

    const deleteRule = async (id) => {
        if (!authToken) return toast.error("Authentication Error. Log in again.");
        if (window.confirm("Delete this rule?")) {
            try {
                await api.delete(`/popup-rules/${id}`, { headers: { Authorization: `Bearer ${authToken}` } });
                toast.success("Rule deleted.");
                fetchRules();
            } catch (error) { 
                toast.error(error.response?.data?.message || "Failed to delete."); 
            }
        }
    };

    return (
        <AuthMainLayout>
            <div className="container-fluid my-5">
                <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h1 className="h3 mb-0 text-gray-800">Popup Management Rules</h1>
                                <small className="text-muted">Control popups per page. Use <b>*</b> as a Global fallback rule.</small>
                            </div>
                            <button onClick={() => handleEdit(initialFormState)} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#ruleModal">+ Add New Rule</button>
                        </div>
                        
                        {loading ? <div className="text-center py-5">Loading...</div> : (
                            <div className="table-responsive">
                                <table className="table table-hover align-middle border">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Target URL</th>
                                            <th>Desktop Banner</th>
                                            <th>Mobile Banner</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rules.map((rule) => (
                                            <tr key={rule.id}>
                                                <td className="fw-bold">{rule.target_url === '*' ? 'Global (*)' : rule.target_url}</td>
                                                <td>
                                                    {rule.desktop_image ? (
                                                        <img src={rule.desktop_image} alt="Desktop" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    ) : <span className="text-muted small">None</span>}
                                                </td>
                                                <td>
                                                    {rule.mobile_image ? (
                                                        <img src={rule.mobile_image} alt="Mobile" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    ) : <span className="text-muted small">None</span>}
                                                </td>
                                                <td><span className={`badge ${rule.is_enabled ? 'bg-success' : 'bg-danger'}`}>{rule.is_enabled ? 'Active' : 'Disabled'}</span></td>
                                                <td>
                                                    <button onClick={() => handleEdit(rule)} className="btn btn-sm btn-primary me-2" data-bs-toggle="modal" data-bs-target="#ruleModal">Edit</button>
                                                    <button onClick={() => deleteRule(rule.id)} className="btn btn-sm btn-danger">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Rule Configuration Modal */}
            <div className="modal fade" id="ruleModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header bg-dark text-white py-3">
                            <h5 className="modal-title fw-bold">{formData.id ? 'Edit Popup Rule' : 'Create Popup Rule'}</h5>
                            <button type="button" id="ruleModalClose" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body row g-3 p-4 bg-light">
                                <div className="col-md-12">
                                    <label className="fw-bold">Target Page URL *</label>
                                    <input type="text" className="form-control" name="target_url" value={formData.target_url} onChange={handleChange} placeholder="e.g. /home or /about-us or *" required />
                                </div>

                                <div className="col-md-4">
                                    <label className="fw-bold">Trigger Event</label>
                                    <select className="form-select" name="trigger_type" value={formData.trigger_type} onChange={handleChange}>
                                        <option value="time">Time Delay</option>
                                        <option value="scroll">Scroll Depth</option>
                                        <option value="exit">Exit Intent (Mouse Leave)</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="fw-bold">Trigger Value</label>
                                    <input type="number" className="form-control" name={formData.trigger_type === 'time' ? 'delay_seconds' : 'scroll_percentage'} value={formData.trigger_type === 'time' ? formData.delay_seconds : formData.scroll_percentage} onChange={handleChange} required />
                                </div>
                                <div className="col-md-4">
                                    <label className="fw-bold">Status</label>
                                    <select className="form-select" name="is_enabled" value={formData.is_enabled} onChange={handleChange}>
                                        <option value={true}>Enabled</option>
                                        <option value={false}>Disabled</option>
                                    </select>
                                </div>

                                <div className="col-md-12 mt-4"><h6 className="fw-bold border-bottom pb-2 text-primary">Text, Images & CTA</h6></div>
                                
                                <div className="col-md-6 mt-2">
                                    <label className="fw-bold">Desktop Banner Image (Portrait Ratio)</label>
                                    {formData.desktop_image && !desktopFile && (
                                        <div className="mb-2"><img src={formData.desktop_image} alt="Desktop preview" style={{ height: "60px", borderRadius: "6px" }} /></div>
                                    )}
                                    <input type="file" id="desktopImageInput" className="form-control" accept="image/*" onChange={handleDesktopFileChange} />
                                </div>
                                <div className="col-md-6 mt-2">
                                    <label className="fw-bold">Mobile Banner Image (Landscape Ratio)</label>
                                    {formData.mobile_image && !mobileFile && (
                                        <div className="mb-2"><img src={formData.mobile_image} alt="Mobile preview" style={{ height: "60px", borderRadius: "6px" }} /></div>
                                    )}
                                    <input type="file" id="mobileImageInput" className="form-control" accept="image/*" onChange={handleMobileFileChange} />
                                </div>

                                <div className="col-md-6 mt-3">
                                    <label className="fw-bold">Popup Heading</label>
                                    <input type="text" className="form-control" name="heading" value={formData.heading} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mt-3">
                                    <label className="fw-bold">Submit Button Text</label>
                                    <input type="text" className="form-control" name="cta_text" value={formData.cta_text} onChange={handleChange} required />
                                </div>
                                <div className="col-md-12 mt-3">
                                    <label className="fw-bold">Popup Sub-heading</label>
                                    <textarea className="form-control" name="sub_heading" value={formData.sub_heading} onChange={handleChange} rows="2"></textarea>
                                </div>
                                <div className="col-md-6 mt-3">
                                    <label className="fw-bold">Lead Form Name</label>
                                    <input type="text" className="form-control" name="lead_form_name" value={formData.lead_form_name} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mt-3">
                                    <label className="fw-bold">Redirect URL After Submit</label>
                                    <input type="text" className="form-control" name="redirect_url" value={formData.redirect_url} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="modal-footer bg-white border-top">
                                <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary px-5 fw-bold">Save Rule</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthMainLayout>
    );
};

export default PopupManager;