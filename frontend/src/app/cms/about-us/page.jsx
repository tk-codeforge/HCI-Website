"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";

const CmsAboutUs = () => {

    const authToken = useSelector((state) => state.auth.authToken);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        banner_heading: "About Us",
        banner_heading_tag: "h1",
        banner_description: "Get A Place Designed Exactly How You Wished",
        banner_description_font_size: "16",
        banner_image: null,
        top_title: "",
        top_title_tag: "h2",
        top_description: "",
        top_description_font_size: "16",
        mid_sub_title: "",
        mid_sub_title_tag: "h3",
        mid_sub_span_title: "",
        mid_sub_span_title_tag: "h4",
        mid_sub_description: "",
        mid_sub_description_font_size: "16",
        mid_image: null,
        mid_image_size: "100"
    });
    const [selectedId, setSelectedId] = useState(null);

    // const fetchContentManagerPages = useCallback(async () => {
    //     try {
    //         const response = await api.get("/cms-content/about_us", {
    //             headers: {
    //                 Authorization: `Bearer ${authToken}`, // Send auth token
    //             },
    //         });
    //         if (response.data && response.data.json_content) {
    //             setFormData({
    //                 top_title: response.data.json_content?.top_title || "",
    //                 top_description: response.data.json_content?.top_description || "",
    //                 mid_sub_title: response.data.json_content?.mid_sub_title || "",
    //                 mid_sub_description: response.data.json_content?.mid_sub_description || "",
    //                 mid_image: response.data.json_content?.mid_image || "",
    //             });
    //             setSelectedId(response.data.id);
    //         }
    //         setLoading(false);

    //     } catch (err) {
    //         toast.error(err.message ?? "Failed to fetch data. Please try again.");
    //         setLoading(false);
    //     }
    // }, [authToken]);

    const fetchContentManagerPages = useCallback(async () => {
    try {
        const response = await api.get("/cms-content/about_us", {
            headers: {
                Authorization: `Bearer ${authToken}`, 
            },
        });
        
        // 1. Fix the Array Issue: Grab the first object if the backend returns an array
        // const pageData = Array.isArray(response.data) ? response.data[0] : response.data;

        const pageData = Array.isArray(response.data) 
    ? response.data[response.data.length - 1] // Grabs the last item (newest ID) instead of [0]
    : response.data;

        if (pageData && pageData.json_content) {
            // 2. Fix the Nested JSON Issue: Handle rows where data is double-nested
            const content = pageData.json_content.json_content || pageData.json_content;

            setFormData({
                banner_heading: content.banner_heading || "About Us",
                    banner_heading_tag: content.banner_heading_tag || "h1",
                    banner_description: content.banner_description || "",
                    banner_description_font_size: content.banner_description_font_size || "16",
                    banner_image: pageData.json_content.banner_image || content.banner_image || "",
                top_title: content.top_title || "",
                top_title_tag: content.top_title_tag || "h2",
                top_description: content.top_description || "",
                top_description_font_size: content.top_description_font_size || "16",
                mid_sub_title: content.mid_sub_title || "",
                mid_sub_title_tag: content.mid_sub_title_tag || "h3",
                mid_sub_span_title: content.mid_sub_span_title || "",
                    mid_sub_span_title_tag: content.mid_sub_span_title_tag || "h4",
                mid_sub_description: content.mid_sub_description || "",
                mid_sub_description_font_size: content.mid_sub_description_font_size || "16",
                // Ensure we get the image correctly depending on nesting level
                mid_image: pageData.json_content.mid_image || content.mid_image || "",
                mid_image_size: content.mid_image_size || pageData.json_content.mid_image_size || "100"
            });
            // 3. Successfully set ID so PATCH triggers instead of POST
            setSelectedId(pageData.id);
        }
        setLoading(false);

    } catch (err) {
        toast.error(err.message ?? "Failed to fetch data. Please try again.");
        setLoading(false);
    }
}, [authToken]);

    useEffect(() => {
        fetchContentManagerPages();
    }, [fetchContentManagerPages]);

    // Handle input change for text fields and image
    // const handleInputChange = (e) => {
    //     const { name, value, files } = e.target;
    //     if (name === "mid_image" && files.length > 0) {
    //         setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    //     } else {
    //         setFormData((prevData) => ({ ...prevData, [name]: value }));
    //     }
    // };
    const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if ((name === "mid_image" || name === "banner_image") && files && files.length > 0) {
        setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
};

    // Handle form submission
    const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    // Banner fields
        formDataToSend.append("json_content[banner_heading]", formData.banner_heading);
        formDataToSend.append("json_content[banner_heading_tag]", formData.banner_heading_tag);
        formDataToSend.append("json_content[banner_description]", formData.banner_description);
        formDataToSend.append("json_content[banner_description_font_size]", formData.banner_description_font_size);
    
    // Keep your text fields matching the expected JSON structure
    formDataToSend.append("json_content[top_title]", formData.top_title);
    formDataToSend.append("json_content[top_description]", formData.top_description);
    formDataToSend.append("json_content[mid_sub_title]", formData.mid_sub_title);
    formDataToSend.append("json_content[mid_sub_description]", formData.mid_sub_description);

    formDataToSend.append("json_content[mid_sub_span_title]", formData.mid_sub_span_title);
        formDataToSend.append("json_content[mid_sub_span_title_tag]", formData.mid_sub_span_title_tag);

    formDataToSend.append("json_content[top_title_tag]", formData.top_title_tag);
formDataToSend.append("json_content[top_description_font_size]", formData.top_description_font_size);
formDataToSend.append("json_content[mid_sub_title_tag]", formData.mid_sub_title_tag);
formDataToSend.append("json_content[mid_sub_description_font_size]", formData.mid_sub_description_font_size);
formDataToSend.append("json_content[mid_image_size]", formData.mid_image_size || "100");


    // FIX: Only append if it's an actual File, and use the key "image" to match the NestJS interceptor
    if (formData.mid_image instanceof File) {
        formDataToSend.append("image", formData.mid_image);
    }
    if (formData.banner_image instanceof File) {
            formDataToSend.append("banner_image", formData.banner_image);
        }

    try {
        // Prevent sending request to /null
        if (!selectedId) {
            toast.error("No database record exists yet. Please insert a default row in the database first.");
            return; 
        }

        const response = await api.patch(`/cms-content/update-with-image/${selectedId}`, formDataToSend, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${authToken}`,
            },
        });
        
        // ... rest of your success logic

            // Handle success response
            if (response.status === 200) {
                toast.success("Form submitted successfully.");
                fetchContentManagerPages();
            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.message ?? "Error submitting form. Please try again.");
            console.error("Error:", error);
        }
    };

    return (
        <AuthMainLayout>
            <div className="container my-5">
                <h1 className="mb-4 text-center">CMS - About Us</h1>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body row">
                                {/* BANNER SECTION */}
<div className="col-12 mb-3">
    <h4 className="border-bottom pb-2">Banner Section</h4>
</div>

<div className="mb-3 col-md-8">
    <label className="form-label">Banner Heading</label>
    <input
        type="text"
        className="form-control"
        name="banner_heading"
        value={formData.banner_heading}
        onChange={handleInputChange}
    />
</div>

<div className="mb-3 col-md-4">
    <label className="form-label">Banner Heading Tag</label>
    <select className="form-control" name="banner_heading_tag" value={formData.banner_heading_tag} onChange={handleInputChange}>
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
        <option value="h4">H4</option>
        <option value="h5">H5</option>
        <option value="h6">H6</option>
    </select>
</div>

<div className="mb-3 col-md-8">
    <label className="form-label">Banner Description</label>
    <textarea
        className="form-control"
        name="banner_description"
        rows="3"
        value={formData.banner_description}
        onChange={handleInputChange}
    ></textarea>
</div>

<div className="mb-3 col-md-4">
    <label className="form-label">Banner Description Font Size (px)</label>
    <input
        type="number"
        className="form-control"
        name="banner_description_font_size"
        value={formData.banner_description_font_size}
        onChange={handleInputChange}
        min="10"
        max="30"
    />
</div>

<div className="row mb-4">
    <div className="col-md-6">
        <label className="form-label">Banner Image</label>
        <input
            type="file"
            className="form-control"
            name="banner_image"
            accept="image/*"
            onChange={handleInputChange}
        />
    </div>
    <div className="col-md-6">
        {typeof formData?.banner_image === 'string' && formData.banner_image && (
            <img src={formData.banner_image} alt="Banner Image" style={{ height: '100px', marginTop: '10px' }} />
        )}
    </div>
</div>

                                <div className="mb-3 col-md-8">
    <label htmlFor="top_title" className="form-label">Top Title</label>
    <input
        type="text"
        className="form-control"
        name="top_title"
        placeholder="Top Title"
        value={formData.top_title}
        onChange={handleInputChange}
        required
    />
</div>

<div className="mb-3 col-md-4">
    <label className="form-label">Top Title Tag</label>
    <select className="form-control" name="top_title_tag" value={formData.top_title_tag} onChange={handleInputChange}>
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
        <option value="h4">H4</option>
        <option value="h5">H5</option>
        <option value="h6">H6</option>
    </select>
</div>

<div className="mb-3 col-md-8">
    <label htmlFor="top_description" className="form-label">Top Description</label>
    <textarea
        className="form-control"
        name="top_description"
        placeholder="Top Description"
        rows="4"
        value={formData.top_description}
        onChange={handleInputChange}
    ></textarea>
</div>

<div className="mb-3 col-md-4">
    <label className="form-label">Top Description Font Size (px)</label>
    <input
        type="number"
        className="form-control"
        name="top_description_font_size"
        value={formData.top_description_font_size}
        onChange={handleInputChange}
        min="10"
        max="30"
    />
</div>
                                <div className="mb-3 col-md-8">
    <label htmlFor="mid_sub_title" className="form-label">Mid Sub Title</label>
    <input
        type="text"
        className="form-control"
        name="mid_sub_title"
        placeholder="Mid Sub Title"
        value={formData.mid_sub_title}
        onChange={handleInputChange}
        required
    />
</div>

<div className="mb-3 col-md-4">
    <label className="form-label">Mid Sub Title Tag</label>
    <select className="form-control" name="mid_sub_title_tag" value={formData.mid_sub_title_tag} onChange={handleInputChange}>
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
        <option value="h4">H4</option>
        <option value="h5">H5</option>
        <option value="h6">H6</option>
    </select>
</div>

<div className="mb-3 col-md-8">
    <label className="form-label">Span Heading</label>
    <input
        type="text"
        className="form-control"
        name="mid_sub_span_title"
        placeholder="e.g. Interior designing Company?"
        value={formData.mid_sub_span_title}
        onChange={handleInputChange}
    />
</div>

<div className="mb-3 col-md-4">
    <label className="form-label">Span Heading Tag</label>
    <select className="form-control" name="mid_sub_span_title_tag" value={formData.mid_sub_span_title_tag} onChange={handleInputChange}>
        <option value="h1">H1</option>
        <option value="h2">H2</option>
        <option value="h3">H3</option>
        <option value="h4">H4</option>
        <option value="h5">H5</option>
        <option value="h6">H6</option>
    </select>
</div>

<div className="mb-3 col-md-8">
    <label htmlFor="mid_sub_description" className="form-label">Mid Sub Description</label>
    <textarea
        className="form-control"
        name="mid_sub_description"
        placeholder="Mid Sub Description"
        rows="4"
        value={formData.mid_sub_description}
        onChange={handleInputChange}
    ></textarea>
</div>

<div className="mb-3 col-md-4">
    <label className="form-label">Mid Sub Description Font Size (px)</label>
    <input
        type="number"
        className="form-control"
        name="mid_sub_description_font_size"
        value={formData.mid_sub_description_font_size}
        onChange={handleInputChange}
        min="10"
        max="30"
    />
</div>
                                
                               <div className="row mb-3">
                               <div className="col-md-6">
                                    <label className="form-label">Mid Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="mid_image"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-md-6">
                                        {typeof formData?.mid_image === 'string' && (<img src={formData?.mid_image} alt="Mid Image" style={{ height: '100px', marginTop: '10px' }} decoding="async"  loading="lazy" />)}
                                    </div>
                                    <div className="col-md-6 mt-2">
        <label className="form-label font-weight-bold">
            Mid Image Size: {formData.mid_image_size || 100} %
        </label>
        <input 
            type="range" 
            className="form-range w-100" 
            name="mid_image_size" 
            min="25" 
            max="125" 
            value={formData.mid_image_size || "100"} 
            onChange={handleInputChange} 
        />
    </div>
                               </div>
                                <div className="m-auto mt-2 col-12 d-flex justify-content-center">
                                    <button className="px-5 read_morebtn" type="submit">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </>
                )}
            </div>


        </AuthMainLayout>
    );
};

export default CmsAboutUs;