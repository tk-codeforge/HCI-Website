"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";

// 🌟 Fallback layout — auto-applied based on odd/even position, same logic as the
// "What We Offer" page. Step 1, 3, 5 ... => WHITE background, image LEFT.
// Step 2, 4, 6 ... => BLACK background, image RIGHT.

const getFallbackStyle = (index) => {
    const isEven = index % 2 === 0;
    return {
        sectionBg: isEven ? "#ffffff" : "#1a1a1a",
        imagePosition: isEven ? "left" : "right",
        headingColor: isEven ? "#212529" : "#ffffff",
        textColor: isEven ? "#495057" : "#ced4da",
        tickColor: "#f97316",
    };
};

const CmsHowItsWorks = () => {
    const authToken = useSelector((state) => state.auth.authToken);
    const [pagesList, setPagesList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Banner State — heading + description + background image, same fields/fallback
    // pattern as the What We Offer banner
    const [bannerData, setBannerData] = useState({
        heading: "",
        headingColor: "#ffffff",
        description: "",
        descriptionColor: "#ffffff",
        bgImage: null,
        previewImage: "",
    });

    // Step Form State
    const [formData, setFormData] = useState({
        title: "",
        step_no: "",
        description: "",
        image_size: 100, // resizing (percentage)
        image: null,
        preview: "",
        imageRemoved: false,
        item_index: null,
    });

    const [selectedId, setSelectedId] = useState(null);

    const fetchContentManagerPages = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/cms-content/how_it_works', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.data) {
                // Handle both single-row and multi-row CMS responses safely
                const contentData = Array.isArray(response.data)
                    ? response.data[0]
                    : response.data;

                let stepsData = contentData?.json_content;

// If the backend sent it as a JSON string, parse it first
if (typeof stepsData === "string") {
    try {
        stepsData = JSON.parse(stepsData);
    } catch (e) {
        stepsData = [];
    }
}

// Only accept it if it's actually an array; otherwise fall back safely
const content = contentData?.json_content || {};

setPagesList(Array.isArray(content.steps) ? content.steps : []);

setBannerData({
    heading: content.bannerHeading || "",
    headingColor: content.bannerHeadingColor || "#ffffff",
    description: content.bannerDescription || "",
    descriptionColor: content.bannerDescriptionColor || "#ffffff",
    bgImage: null,
    previewImage: content.bg_image || "",
});

setSelectedId(contentData?.id || null);
            }
        } catch (err) {
            toast.error(err.message || "Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchContentManagerPages();
    }, [fetchContentManagerPages]);

    // Handle Banner Input Change
    const handleBannerChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "bgImage" && files.length > 0) {
        setBannerData((prev) => ({
            ...prev,
            bgImage: files[0],
            previewImage: URL.createObjectURL(files[0]), // show it immediately, before saving
        }));
    } else {
        setBannerData((prev) => ({ ...prev, [name]: value }));
    }
};

    // Handle Banner Submit
    const handleBannerSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("json_content", JSON.stringify({
        bannerHeading: bannerData.heading,
        bannerHeadingColor: bannerData.headingColor,
        bannerDescription: bannerData.description,
        bannerDescriptionColor: bannerData.descriptionColor,
        bg_image: bannerData.previewImage || "",
        steps: pagesList,
    }));
    if (bannerData.bgImage) formData.append("image", bannerData.bgImage);

    try {
        if (selectedId) {
            await api.patch(`/cms-content/update-with-image/${selectedId}`, formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
            });
        } else {
            await api.post(`/cms-content/how_it_works`, formData, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
            });
        }
        fetchContentManagerPages();
        toast.success("Banner updated successfully.");
    } catch (error) {
        toast.error(error.message ?? "Error updating banner.");
    }
};

    // Handle input change for steps
    const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
        setFormData((prevData) => ({
            ...prevData,
            image: files[0],
            preview: URL.createObjectURL(files[0]),
            imageRemoved: false,
        }));
    } else {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
};

const handleRemoveStepImage = () => {
    setFormData((prev) => ({ ...prev, image: null, preview: "", imageRemoved: true }));
};

    // Handle form submission for steps
    const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedSteps = [...pagesList];
updatedSteps[formData.item_index] = {
    ...updatedSteps[formData.item_index],
    title: formData.title,
    step_no: formData.step_no || String(formData.item_index + 1).padStart(2, "0"),
    description: formData.description,
    image_size: formData.image_size || 100,
    image: formData.imageRemoved
        ? ""
        : (typeof updatedSteps[formData.item_index]?.image === "string"
            ? updatedSteps[formData.item_index].image : ""),
};

    const formDataToSend = new FormData();
    formDataToSend.append("json_content", JSON.stringify({
        bannerHeading: bannerData.heading,
        bannerHeadingColor: bannerData.headingColor,
        bannerDescription: bannerData.description,
        bannerDescriptionColor: bannerData.descriptionColor,
        bg_image: bannerData.previewImage || "",
        steps: updatedSteps,
    }));

    if (formData.image) {
        formDataToSend.append("icons", formData.image);
        formDataToSend.append("image_indices", JSON.stringify([formData.item_index]));
    } else {
        formDataToSend.append("image_indices", JSON.stringify([]));
    }

    try {
        await api.patch(`/cms-content/update-with-image/${selectedId}`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
        });
        fetchContentManagerPages();
        toast.success("Step updated successfully.");
        setFormData({ title: "", step_no: "", description: "", image_size: 100, image: null, item_index: null });
        document.getElementById('addNewpageModalClose').click();
    } catch (error) {
        toast.error(error.message ?? "Error submitting form.");
    }
};

    // Set form data when edit button is clicked
    const handleEditClick = (item, index) => {
    setFormData({
        title: item.title || "",
        step_no: item.step_no || String(index + 1).padStart(2, "0"),
        description: item.description || (item.points ? item.points.join("\n") : ""),
        image_size: item.image_size || 100,
        image: null,
        preview: typeof item.image === "string" ? item.image : "",
        imageRemoved: false,
        item_index: index,
    });
};

const handleDeleteStep = async (index) => {
    if (!window.confirm("Delete this step? This cannot be undone.")) return;

    const updatedSteps = [...pagesList];
    updatedSteps.splice(index, 1);

    try {
        const formDataToSend = new FormData();
        formDataToSend.append("json_content", JSON.stringify({
            bannerHeading: bannerData.heading,
            bannerHeadingColor: bannerData.headingColor,
            bannerDescription: bannerData.description,
            bannerDescriptionColor: bannerData.descriptionColor,
            bg_image: bannerData.previewImage && !bannerData.previewImage.startsWith("blob:")
                ? bannerData.previewImage : "",
            steps: updatedSteps,
        }));
        formDataToSend.append("image_indices", JSON.stringify([]));

        await api.patch(`/cms-content/update-with-image/${selectedId}`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
        });
        fetchContentManagerPages();
        toast.success("Step deleted successfully.");
    } catch (error) {
        toast.error(error.message ?? "Error deleting step.");
    }
};

    const handleRemoveBackground = () => {
    setBannerData((prev) => ({ ...prev, bgImage: null, previewImage: "" }));
};

    return (
        <AuthMainLayout>
            <div className="container my-5">
                <h1 className="mb-4 text-center">{bannerData.heading || "How It Works"}</h1>

                {/* Banner Management Section */}
                <div className="card mb-5 shadow-sm">
                    <div className="card-header bg-dark text-white">
                        <h5 className="mb-0">Manage Banner</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleBannerSubmit}>
    {/* Row 1 — heading + description */}
<div className="row align-items-start mb-3">
    <div className="col-md-6">
        <label className="form-label">Banner Heading</label>
        <input type="text" className="form-control" name="heading"
            placeholder="e.g. Our Design Process"
            value={bannerData.heading} onChange={handleBannerChange} required />
    </div>

    <div className="col-md-6">
        <label className="form-label">Banner Description</label>
        <textarea className="form-control" name="description" rows="2"
            placeholder="e.g. A step-by-step look at how we bring your vision to life."
            value={bannerData.description} onChange={handleBannerChange} />
    </div>
</div>

{/* Row 2 — colors */}
<div className="row align-items-start mb-3">
    <div className="col-md-6">
        <label className="form-label">Heading Color</label>
        <input type="color" className="form-control form-control-color w-100"
            name="headingColor" value={bannerData.headingColor} onChange={handleBannerChange} />
    </div>

    <div className="col-md-6">
        <label className="form-label">Description Color</label>
        <input type="color" className="form-control form-control-color w-100"
            name="descriptionColor" value={bannerData.descriptionColor} onChange={handleBannerChange} />
    </div>
</div>

{/* Row 3 — background image + submit, full width */}
<div className="row align-items-end">
    <div className="col-md-10">
        <label className="form-label">Background Image</label>
        <input type="file" className="form-control" name="bgImage" accept="image/*"
            onChange={handleBannerChange} />
        {bannerData.previewImage && (
    <div className="mt-2">
        <img
            src={bannerData.previewImage}
            alt="Banner background preview"
            className="border rounded d-block mb-2"
            style={{ width: "100%", maxWidth: 400, height: 140, objectFit: "cover", backgroundColor: "#f8f9fa" }}
        />
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleRemoveBackground}>
            Remove Image (Use Default)
        </button>
    </div>
)}
    </div>

    <div className="col-md-2">
        <button className="btn btn-primary w-100" type="submit">Update Banner</button>
    </div>
</div>
</form>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h5 className="mb-0">Page Steps</h5>
                    </div>
                    <button
                        type="button"
                        className="btn btn-success"
                        data-bs-toggle="modal"
                        data-bs-target="#addNewpageModal"
                        onClick={() => {
    // Reset form for a completely new entry
    setFormData({
        title: "",
        step_no: String(pagesList.length + 1).padStart(2, "0"),
        description: "",
        image_size: 100,
        image: null,
        preview: "",
        imageRemoved: false,
        item_index: pagesList.length, // Append to end of list
    });
}}
                    >
                        + Add New Step
                    </button>
                </div>

                {/* Steps List Table */}
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="table-responsive">
                        <table
                            id="usersTable"
                            className="table display table-striped table-bordered align-middle"
                            style={{ width: "100%" }}
                        >
                            <thead className="table-dark">
                                <tr>
                                    <th>SN</th>
                                    <th>Step No</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Layout (auto)</th>
                                    <th width="100">Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagesList && pagesList.map((item, index) => {
                                    const fallback = getFallbackStyle(index);
                                    const isEven = index % 2 === 0;
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <span className="badge bg-secondary">
                                                    STEP {item.step_no || String(index + 1).padStart(2, "0")}
                                                </span>
                                            </td>
                                            <td>{item.title}</td>
                                            <td>
                                                {/* Truncate long descriptions for table view */}
                                                {item.description ? item.description.substring(0, 50) + "..." : "..."}
                                            </td>
                                            <td>
                                                <span
                                                    className="badge"
                                                    style={{
                                                        backgroundColor: fallback.sectionBg,
                                                        color: fallback.headingColor,
                                                        border: "1px solid #dee2e6",
                                                    }}
                                                >
                                                    {isEven ? "White · Left" : "Black · Right"}
                                                </span>
                                            </td>
                                            <td>
                                                <img
                                                    src={item?.image || item?.img}
                                                    alt={item.title}
                                                    height="60"
                                                    style={{ objectFit: 'contain' }}
                                                    decoding="async"
                                                    loading="lazy"
                                                />
                                            </td>
                                            <td>
    <button
        onClick={() => handleEditClick(item, index)}
        type="button"
        className="btn btn-sm btn-outline-primary me-2"
        data-bs-toggle="modal"
        data-bs-target="#addNewpageModal"
    >
        Edit Step
    </button>
    <button
        onClick={() => handleDeleteStep(index)}
        type="button"
        className="btn btn-sm btn-outline-danger"
    >
        Delete
    </button>
</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Step Modal */}
            <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Step Details</h1>
                            <button type="button" className="btn-close" id="addNewpageModalClose" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body row">

                                <div className="mb-3 col-md-3">
                                    <label className="form-label">Step No</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="step_no"
                                        placeholder="01"
                                        value={formData.step_no}
                                        onChange={handleInputChange}
                                    />
                                    <small className="text-muted">Shown as &ldquo;STEP {formData.step_no || "01"}&rdquo;</small>
                                </div>

                                <div className="mb-3 col-md-9">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        placeholder="Title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {/* Paragraph textarea — each line becomes a tick-point on the public page,
                                    same tick + paragraph structure used on the What We Offer page. The
                                    tick icon itself is fixed and not editable. */}
                                <div className="mb-2 col-md-12">
                                    <label className="form-label">Description (one point per line)</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        rows="4"
                                        placeholder="Write one point per line. Each line will render with a tick icon in front of it"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>

                                {/* Live-style preview of how each line will render, so the fixed
                                    tick + paragraph structure is visible while editing */}
                                {formData.description && (
                                    <div className="col-md-12 mb-3 p-3 bg-white border rounded">
                                        <small className="text-muted d-block mb-2">Preview</small>
                                        {formData.description.split("\n").filter(Boolean).map((line, i) => (
                                            <div key={i} className="d-flex align-items-start gap-2 mb-1">
                                                <span
                                                    className="d-flex align-items-center justify-content-center flex-shrink-0"
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: "50%",
                                                        border: "1px solid #f97316",
                                                        color: "#f97316",
                                                        fontSize: 10,
                                                        marginTop: 3,
                                                    }}
                                                >
                                                    <FaCheck />
                                                </span>
                                                <span className="small text-muted">{line}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Image Resize (%)</label>
                                    <input
                                        type="range"
                                        className="form-range"
                                        name="image_size"
                                        min="10"
                                        max="150"
                                        value={formData.image_size}
                                        onChange={handleInputChange}
                                    />
                                    <div className="text-muted text-center fw-bold">{formData.image_size || 100}%</div>
                                </div>

                                <div className="mb-3 col-md-6">
    <label className="form-label">Upload New Image</label>
    <input
        type="file"
        className="form-control"
        name="image"
        accept="image/*"
        onChange={handleInputChange}
    />
    {formData.preview ? (
        <div className="mt-2">
            <img
                src={formData.preview}
                alt="Step preview"
                className="border rounded d-block"
                style={{ width: 120, height: 90, objectFit: "contain", backgroundColor: "#f8f9fa" }}
            />
            <button
                type="button"
                className="btn btn-outline-danger btn-sm mt-2"
                onClick={handleRemoveStepImage}
            >
                Remove Image (Use Default)
            </button>
        </div>
    ) : (
        <small className="text-muted d-block mt-2">No image selected yet.</small>
    )}
</div>

                                <div className="m-auto mt-4 col-12 d-flex justify-content-end">
                                    <button className="btn btn-primary px-5" type="submit">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthMainLayout>
    );
};

export default CmsHowItsWorks;
