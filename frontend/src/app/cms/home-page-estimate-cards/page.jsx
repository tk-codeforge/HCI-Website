"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";

const EstimateCardsCms = () => {
    const authToken = useSelector((state) => state.auth.authToken);
    const [pagesList, setPagesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const [formData, setFormData] = useState({
        title: "", link: "/estimator-for-home", image: null, item_index: null, action: "add", is_active: true,
        description: "", // NEW
        icon_bg_color: "#ffffff", // NEW
        font_color: "#000000" // NEW
    });
    
    const fetchContent = useCallback(async () => {
        setLoading(true);
        try {
            let response = await api.get('/cms-content/home_page_estimate_cards', { 
                headers: { Authorization: `Bearer ${authToken}` } 
            });
            
            // Handle TypeORM returning an array vs single object
            let record = Array.isArray(response.data) ? response.data[0] : response.data;
            
            // Auto-create base array record if it doesn't exist
            if (!record || !record.id) {
                 await api.post(`/cms-content/home_page_estimate_cards`, [], { 
                     headers: { Authorization: `Bearer ${authToken}` }
                 });
                 response = await api.get('/cms-content/home_page_estimate_cards', { 
                     headers: { Authorization: `Bearer ${authToken}` } 
                 });
                 record = Array.isArray(response.data) ? response.data[0] : response.data;
            }

            if (record && record.id) {
                setSelectedId(record.id);
                let content = record.json_content;

                // 🌟 FIX 1: Recover from stringified JSON
                if (typeof content === 'string') {
                    try { content = JSON.parse(content); } catch(e) { content = []; }
                }

                // 🌟 FIX 2: Recover from double-nested JSON object (This is what caused your crash!)
                if (content && typeof content === 'object' && !Array.isArray(content) && content.json_content) {
                    content = content.json_content;
                }

                // 🌟 FIX 3: Guarantee it's an Array before setting State
                setPagesList(Array.isArray(content) ? content : []);
            }
        } catch (err) { 
            toast.error("Failed to fetch data."); 
            setPagesList([]); 
        } finally { 
            setLoading(false); 
        }
    }, [authToken]);

    useEffect(() => { fetchContent(); }, [fetchContent]);

    const handleInputChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        if (name === "image" && files.length > 0) setFormData(prev => ({ ...prev, [name]: files[0] }));
        else if (type === 'checkbox') setFormData(prev => ({ ...prev, [name]: checked }));
        else setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await api.patch(`/cms-content/update-estimate-cards/${selectedId}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
            });
            if (response.status === 200) {
                fetchContent();
                toast.success(formData.action === 'add' ? "Card added." : "Card updated.");
                document.getElementById('addNewpageModalClose').click();
            }
        } catch (error) { toast.error("Error saving card."); }
    };

    const handleToggleActive = async (index, currentStatus) => {
        const formDataToSend = new FormData();
        formDataToSend.append("action", "toggle_active");
        formDataToSend.append("item_index", index);
        formDataToSend.append("is_active", (!currentStatus).toString());
        try {
            await api.patch(`/cms-content/update-estimate-cards/${selectedId}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
            });
            fetchContent();
            toast.success("Visibility updated!");
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
            await api.patch(`/cms-content/update-estimate-cards/${selectedId}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
            });
        } catch (error) { fetchContent(); toast.error("Error updating order."); }
    };

    const handleDelete = async (index) => {
        if(!window.confirm("Are you sure you want to delete this card?")) return;
        const formDataToSend = new FormData();
        formDataToSend.append("item_index", index);
        formDataToSend.append("action", "delete");
        try {
            await api.patch(`/cms-content/update-estimate-cards/${selectedId}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
            });
            fetchContent();
            toast.success("Card deleted.");
        } catch (error) { toast.error("Error deleting card."); }
    };

    const handleEditClick = (item, index) => {
        setFormData({ ...item, item_index: index, action: "update", image: null, is_active: item.is_active !== false,
        description: item.description || "", // NEW
        icon_bg_color: item.icon_bg_color || "#ffffff", // NEW
        font_color: item.font_color || "#000000" // NEW

         });
    };

    const handleAddNewClick = () => {
        setFormData({ title: "", link: "/estimator-for-home", image: null, item_index: pagesList.length || 0, action: "add", is_active: true,
        description: "", // NEW
        icon_bg_color: "#ffffff", // NEW
        font_color: "#000000" // NEW

         });
    };

    return (
        <AuthMainLayout>
            <div className="container my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="text-center mb-0" style={{ color: '#ff914d' }}>CMS - Estimate Marquee Cards</h1>
                    <button onClick={handleAddNewClick} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addNewpageModal" style={{ backgroundColor: '#ff914d', borderColor: '#ff914d' }}>
                        + Add New Card
                    </button>
                </div>

                {loading ? <div className="text-center">Loading...</div> : (
                    <div className="table-responsive bg-white rounded-3 shadow-sm border p-3">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th width="50">Drag</th>
                                    <th>Status</th>
                                    <th>Card Details</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 🌟 FIX 4: Safety Check Array.isArray before .map() */}
                                {Array.isArray(pagesList) && pagesList.map((item, index) => {
                                    if (!item) return null;
                                    const isActive = item.is_active !== false;
                                    return (
                                        <tr key={index} draggable onDragStart={() => setDraggedItemIndex(index)} onDragOver={(e) => e.preventDefault()} onDrop={() => handleReorder(draggedItemIndex, index)} style={{ opacity: isActive ? 1 : 0.6 }}>
                                            <td style={{ cursor: 'grab', fontSize: '20px', color: '#888' }}>☰</td>
                                            <td>
                                                <div className="form-check form-switch"><input className="form-check-input fs-4" type="checkbox" checked={isActive} onChange={() => handleToggleActive(index, isActive)} style={{ cursor: 'pointer' }} /></div>
                                            </td>
                                            <td>
                                                <strong>{item.title}</strong><br/>
                                                <small className="text-primary">{item.link}</small>
                                            </td>
                                            <td>
                                                {item?.image ? <img src={item?.image} alt={item.title} height="60" style={{ borderRadius: '8px', objectFit: 'cover', width: '80px' }} /> : <span className="text-muted small">No Image</span>}
                                            </td>
                                            <td>
                                                <button onClick={() => handleEditClick(item, index)} className="btn btn-sm btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#addNewpageModal">Edit</button>
                                                <button onClick={() => handleDelete(index)} className="btn btn-sm btn-outline-danger">Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {(!pagesList || pagesList.length === 0) && <tr><td colSpan="5" className="text-center py-4 text-muted">No cards added yet. The site is currently using the fallback gallery.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">{formData.action === 'add' ? 'Add New Card' : 'Edit Card'}</h1>
                            <button type="button" className="btn-close" id="addNewpageModalClose" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body row g-3">
                                <div className="col-12">
                                    <label className="form-label fw-bold">Card Title</label>
                                    <input type="text" className="form-control" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. 2 BHK, Villa, etc." required />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-bold">Card Description</label>
                                    <textarea className="form-control" name="description" rows="2" value={formData.description} onChange={handleInputChange} placeholder="Enter card description..."></textarea>
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-bold">Redirect Link</label>
                                    <input type="text" className="form-control" name="link" value={formData.link} onChange={handleInputChange} placeholder="/estimator-for-home" required />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-bold">
                                        Card Icon (SVG)
                                    </label>

                                    <input
                                        type="file"
                                        className="form-control"
                                        name="image"
                                        accept=".svg,image/svg+xml"
                                        onChange={handleInputChange}
                                        required={formData.action === 'add'}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Icon Background Color</label>
                                    <input type="color" className="form-control form-control-color w-100" name="icon_bg_color" value={formData.icon_bg_color} onChange={handleInputChange} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Font Color</label>
                                    <input type="color" className="form-control form-control-color w-100" name="font_color" value={formData.font_color} onChange={handleInputChange} />
                                </div>
                                <div className="col-12 mt-4 text-center">
                                    <button className="px-5 py-2 fw-bold btn btn-primary" type="submit" style={{ backgroundColor: '#ff914d', borderColor: '#ff914d' }}>Save Card</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthMainLayout>
    );
};

export default EstimateCardsCms;