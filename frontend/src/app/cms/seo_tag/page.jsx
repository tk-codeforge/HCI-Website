"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { getCmsAccess, getDeletePermissionMessage, getPublishWorkflowMessage } from "@/utils/cmsAccess";

// IMPORT THE NEW REUSABLE COMPONENT
import GlobalSeoForm from "@/app/components/GlobalSeoForm"; 

const SeoTag = () => {
    const user = useSelector((state) => state.auth.user);
    const { canPublish, canDelete } = getCmsAccess(user);
    const authToken = useSelector((state) => state.auth.authToken);

    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [activeFormData, setActiveFormData] = useState(null); // Holds data for the modal

    const fetchQueries = useCallback(async () => { 
        try {
            const response = await api.get("/seo-tag", {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setQueries(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch queries form data. Please try again.");
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchQueries();
    }, [fetchQueries]);

    // Handle Create Submit
    const handleCreate = async (formattedData) => {
        try {
            if (!canPublish && formattedData.status === "active") {
                toast.info(getPublishWorkflowMessage("This SEO record"));
            }
            await api.post("/seo-tag", formattedData, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            document.getElementById('addNewpageModalClose').click();
            fetchQueries();
            toast.success("SEO Tag created successfully!");
        } catch (err) {
            toast.error("Failed to save data.");
        }
    };

    // Handle Edit Submit
    const handleUpdate = async (formattedData) => {
        try {
            if (!canPublish && formattedData.status === "active") {
                toast.info(getPublishWorkflowMessage("This SEO record"));
            }
            await api.patch(`/seo-tag/${selectedId}`, formattedData, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            document.getElementById('editNewpageModalClose').click();
            fetchQueries();
            toast.success("SEO Tag updated successfully!");
        } catch (err) {
            toast.error("Failed to update data.");
        }
    };

    const handleEditClick = (query) => {
        setSelectedId(query.id);
        const nextStatus = !canPublish && query.status === "active" ? "inactive" : (query.status || "active");
        if (!canPublish && query.status === "active") {
            toast.info("Editing an active SEO record will save it as inactive until an admin republishes it.");
        }
        
        setActiveFormData({ ...query, status: nextStatus });
    };

    const deleteHandler = async (id) => {
        if (!canDelete) {
            toast.error(getDeletePermissionMessage("this SEO record"));
            return;
        }
        if (window.confirm("Are you sure you want to delete this URL?")) {
            try {
                const response = await api.delete(`/seo-tag/${id}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                if (response.status === 200) fetchQueries();
            } catch (error) {
                toast.error("Failed to delete job.");
            }
        }
    };

    return (
        <AuthMainLayout>
            <div className="container my-5">
                <h1 className="mb-4 text-center">Global Route SEO Manager</h1>
                {(!canPublish || !canDelete) && (
                    <div className="alert alert-info">
                        Editors can prepare SEO entries here. Publish and delete access can be granted separately by an admin.
                    </div>
                )}
                
                <div className="d-flex justify-content-end mb-3">
                    <button 
                        onClick={() => setActiveFormData(null)} 
                        type="button" 
                        className="btn btn-primary" 
                        data-bs-toggle="modal" 
                        data-bs-target="#addNewpageModal"
                    >
                        Add New Route
                    </button>
                </div>

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
                                    <th>Route Path</th>
                                    <th>Meta Title</th>
                                    <th>Canonical URL</th>
                                    <th>Sitemap</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {queries.map((query, index) => (
                                    <tr key={query.id}>
                                        <td>{index + 1}</td>
                                        <td><strong>{query.page_name}</strong></td>
                                        <td>{query.meta_title}</td>
                                        <td>{query.canonical_url}</td>
                                        <td>
                                            <span className={`badge ${query.include_in_sitemap === false ? "bg-secondary" : "bg-success"}`}>
                                                {query.include_in_sitemap === false ? "Excluded" : "Included"}
                                            </span>
                                        </td>
                                        <td className="text-capitalize">{query.status}</td>
                                        <td>
                                            <button onClick={() => handleEditClick(query)} className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#editNewpageModal">Edit</button>
                                            {canDelete && <button className="ms-2 btn btn-sm btn-danger" onClick={() => deleteHandler(query.id)}>Delete</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ADD NEW MODAL */}
            <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Add New Route SEO</h1>
                            <button type="button" className="btn-close" id="addNewpageModalClose" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            {/* REUSABLE FORM HERE */}
                            <GlobalSeoForm initialData={activeFormData} onSubmit={handleCreate} canPublish={canPublish} />
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            <div className="modal fade" id="editNewpageModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">Edit Route SEO</h1>
                            <button type="button" className="btn-close" id="editNewpageModalClose" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            {/* REUSABLE FORM HERE */}
                            {activeFormData && (
                                <GlobalSeoForm initialData={activeFormData} onSubmit={handleUpdate} canPublish={canPublish} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthMainLayout>
    );
};

export default SeoTag;