"use client";
import React, { useState, useEffect } from "react";
import { DEFAULT_SITEMAP_CHANGE_FREQUENCY, DEFAULT_SITEMAP_PRIORITY, SITEMAP_CHANGE_FREQUENCY_OPTIONS } from "@/utils/seoHelpers";

export default function GlobalSeoForm({ initialData, onSubmit, canPublish }) {
    const [formData, setFormData] = useState({
        page_name: "",
        meta_title: "",
        meta_description: "",
        canonical_url: "",
        meta_robots: "index, follow",
        og_image: "",
        keywords: "",
        custom_schema: "", 
        include_in_sitemap: true,
        sitemap_change_frequency: DEFAULT_SITEMAP_CHANGE_FREQUENCY,
        sitemap_priority: String(DEFAULT_SITEMAP_PRIORITY),
        status: canPublish ? "active" : "inactive",
    });

    useEffect(() => {
        if (initialData) {
            // Safely parse existing schema if it exists
            let parsedSchema = "";
            if (initialData.custom_schema) {
                if (typeof initialData.custom_schema === 'string') {
                    try { parsedSchema = JSON.stringify(JSON.parse(initialData.custom_schema), null, 2); } 
                    catch(e) { parsedSchema = initialData.custom_schema; } // Fallback if corrupted
                } else {
                    parsedSchema = JSON.stringify(initialData.custom_schema, null, 2);
                }
            }

            setFormData({
                page_name: initialData.page_name || "",
                // 🌟 FIX: Support legacy database keys (title & meta_can_tag)
                meta_title: initialData.meta_title || initialData.title || "",
                meta_description: initialData.meta_description || "",
                canonical_url: initialData.canonical_url || initialData.meta_can_tag || "",
                meta_robots: initialData.meta_robots || "index, follow",
                og_image: initialData.og_image || "",
                keywords: initialData.keywords || "",
                custom_schema: parsedSchema,
                include_in_sitemap: initialData.include_in_sitemap ?? true,
                sitemap_change_frequency: initialData.sitemap_change_frequency || DEFAULT_SITEMAP_CHANGE_FREQUENCY,
                sitemap_priority: String(initialData.sitemap_priority ?? DEFAULT_SITEMAP_PRIORITY),
                status: initialData.status || "inactive",
            });
        }
    }, [initialData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        let formattedData = { ...formData };
        
        // 🌟 FIX: Explicitly handle empty schema to prevent backend crashes
        if (formattedData.custom_schema && formattedData.custom_schema.trim() !== "") {
            try {
                formattedData.custom_schema = JSON.parse(formattedData.custom_schema);
            } catch (err) {
                alert("Invalid JSON in Custom Schema. Please check your formatting.");
                return;
            }
        } else {
            // If empty, send null. Never send an empty string "" to a JSON column.
            formattedData.custom_schema = null; 
        }

        onSubmit(formattedData);
    };

    return (
        <form onSubmit={handleFormSubmit} className="row">
            <div className="mb-3 col-md-12">
                <label className="form-label text-primary fw-bold">Target Route / Page Name (e.g., /about-us)</label>
                <input type="text" className="form-control" name="page_name" value={formData.page_name} onChange={handleInputChange} required />
            </div>

            <div className="mb-3 col-md-6">
                <label className="form-label">Meta Title</label>
                <input type="text" className="form-control" name="meta_title" value={formData.meta_title} onChange={handleInputChange} required />
            </div>

            <div className="mb-3 col-md-6">
                <label className="form-label">Canonical Tag</label>
                <input type="text" className="form-control" name="canonical_url" value={formData.canonical_url} onChange={handleInputChange} required />
            </div>

            <div className="mb-3 col-md-12">
                <label className="form-label">Meta Description</label>
                <textarea className="form-control" name="meta_description" rows="2" value={formData.meta_description} onChange={handleInputChange} required />
            </div>

            <div className="mb-3 col-md-6">
                <label className="form-label">Meta Robots</label>
                <select className="form-control" name="meta_robots" value={formData.meta_robots} onChange={handleInputChange}>
                    <option value="index, follow">Index, Follow (Recommended)</option>
                    <option value="noindex, nofollow">No Index, No Follow</option>
                    <option value="index, nofollow">Index, No Follow</option>
                    <option value="noindex, follow">No Index, Follow</option>
                </select>
            </div>

            <div className="mb-3 col-md-6">
                <label className="form-label">OG Image URL</label>
                <input type="text" className="form-control" name="og_image" placeholder="https://..." value={formData.og_image} onChange={handleInputChange} />
            </div>

            <div className="mb-3 col-md-12">
                <label className="form-label">Keywords (Comma separated)</label>
                <input type="text" className="form-control" name="keywords" value={formData.keywords} onChange={handleInputChange} />
            </div>

            <div className="mb-3 col-md-12">
                <label className="form-label">Custom Schema.org (JSON Format)</label>
                <textarea className="form-control font-monospace" name="custom_schema" rows="4" placeholder='{ "@context": "https://schema.org", "@type": "WebPage" }' value={formData.custom_schema} onChange={handleInputChange} />
            </div>

            <div className="mb-3 col-md-12">
                <div className="form-check form-switch bg-light rounded border p-3">
                    <input className="form-check-input" type="checkbox" role="switch" id="seoSitemapToggle" name="include_in_sitemap" checked={Boolean(formData.include_in_sitemap)} onChange={handleInputChange} />
                    <label className="form-check-label fw-bold ms-2" htmlFor="seoSitemapToggle">Include in sitemap.xml</label>
                </div>
            </div>

            <div className="mb-3 col-md-6">
                <label className="form-label">Sitemap Frequency</label>
                <select className="form-control" name="sitemap_change_frequency" value={formData.sitemap_change_frequency} onChange={handleInputChange}>
                    {SITEMAP_CHANGE_FREQUENCY_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
                </select>
            </div>

            <div className="mb-3 col-md-6">
                <label className="form-label">Sitemap Priority</label>
                <input type="number" className="form-control" name="sitemap_priority" min="0" max="1" step="0.1" value={formData.sitemap_priority} onChange={handleInputChange} />
            </div>

            <div className="mb-3 col-md-12">
                <label className="form-label">Status</label>
                <select className="form-control" name="status" value={formData.status} onChange={handleInputChange}>
                    {canPublish && <option value="active">Active</option>}
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div className="m-auto mt-2 col-12 d-flex justify-content-center">
                <button className="px-5 btn btn-primary" type="submit">Save SEO Data</button>
            </div>
        </form>
    );
}