"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { getCmsAccess, getDeletePermissionMessage } from "@/utils/cmsAccess";
 
const CmsHowItsWorks = () => {
    const user = useSelector((state) => state.auth.user);
    const authToken = useSelector((state) => state.auth.authToken);
    const { canDelete } = getCmsAccess(user);
    const [pagesList, setPagesList] = useState([]);
    const [pagesList_what_we_are, setPagesList_what_we_are] = useState([]);
    const [pagesList_meet_us, setPagesList_meet_us] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Updated formData to include video and visibility toggles
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        designation: "",
        image: null,
        video: null, // NEW
        show_video_desktop: true, // NEW
        show_video_mobile: true, // NEW
        item_index: null,
    });
    
    const [formData2, setFormData2] = useState({
        title: "",
        description: "",
        designation: "",
        image: null,
        item_index: null,
    });
    
    const [selectedId, setSelectedId] = useState(null);
    const [selectedId_every_space, setSelectedId_every_space] = useState(null);

    // --- MEET US HANDLERS ---
    const handleEditSubmit_meet_us = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("item_index", formData.item_index);
        formDataToSend.append("designation", formData.designation);
        if (formData.image) {
            formDataToSend.append("json_content[mid_image]", formData.image);
        }
        try {
            const response = await api.patch(`/cms-content/update-with-image/${selectedId}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.status === 200) {
                fetchContentManagerPages_meet_us();
                toast.success("Form submitted successfully.");
                setFormData({ title: "", description: "", designation: "", image: null, video: null });
                document.getElementById('editNewpageModalClose_meet_us').click();
            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.message ?? "Error submitting form. Please try again.");
        }
    };
    
    const handleAddSubmit_meet_us = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("designation", formData.designation);
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }
        try {
            const response = await api.post(`/cms-content/home_page_content_meet_us`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.status === 201) {
                fetchContentManagerPages_meet_us();
                toast.success("Form submitted successfully.");
                setFormData({ title: "", description: "", designation: "", image: null, video: null });
                document.getElementById('addNewpageModalClose_meet_us').click();
            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.message ?? "Error submitting form. Please try again.");
        }
    };
        
    const fetchContentManagerPages = useCallback(async () => {
        try {
            const response = await api.get('/cms-content/home_page_content', {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (response.data?.length > 0) {
                setPagesList(response.data);
                setLoading(false);
            }
        } catch (err) {
            toast.error(err.message || "Failed to fetch data. Please try again.");
            setLoading(false);
        }
    }, [authToken]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("item_index", formData.item_index);
        formDataToSend.append("designation", formData.designation);
        if (formData.image) {
            formDataToSend.append("json_content[mid_image]", formData.image);
        }
        try {
            const response = await api.patch(`/cms-content/update-with-image/${selectedId}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`, 
                },
            });
            if (response.status === 200) {
                fetchContentManagerPages();
                toast.success("Form submitted successfully.");
                setFormData({ title: "", description: "", designation: "", image: null, video: null });
                document.getElementById('editNewpageModalClose').click();
            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.message ?? "Error submitting form. Please try again.");
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("designation", formData.designation);
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }
        try {
            const response = await api.post(`/cms-content/home_page_content`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.status === 201) {
                fetchContentManagerPages();
                toast.success("Form submitted successfully.");
                setFormData({ title: "", description: "", designation: "", image: null, video: null });
                document.getElementById('addNewpageModalClose').click();
            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.message ?? "Error submitting form. Please try again.");
        }
    };

     const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files.length > 0) {
            setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    // --- WHAT WE ARE / ABOUT US HANDLERS ---
    const fetchContentManagerPages_what_we_are = useCallback(async () => {
        try {
            const response = await api.get('/cms-content/home_page_content_what_we_are', {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (response.data?.length > 0) {
                setPagesList_what_we_are(response.data);
            } else {
                setPagesList_what_we_are([]); 
            }
            setLoading(false);
        } catch (err) {
            toast.error(err.message || "Failed to fetch data. Please try again.");
            setLoading(false);
        }
    }, [authToken]);
    
    // UPDATED: Handle edit submit with Video and Visibility toggles
    const handleEditSubmit_what_we_are = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("item_index", formData.item_index);
        formDataToSend.append("designation", formData.designation);
        
        // Append Image (Mapped to Multer's FileFieldsInterceptor)
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }
        
        // Append Video
        if (formData.video) {
            formDataToSend.append("video", formData.video);
        }
        
        // Append Toggles
        formDataToSend.append("show_video_desktop", formData.show_video_desktop);
        formDataToSend.append("show_video_mobile", formData.show_video_mobile);

        try {
            // Re-using your exact endpoint
            const response = await api.patch(`/cms-content/update-with-image/${selectedId}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 200) {
                fetchContentManagerPages_what_we_are();
                toast.success("Form submitted successfully.");
                setFormData({
                    title: "", description: "", designation: "", image: null, video: null,
                    show_video_desktop: true, show_video_mobile: true
                });
                document.getElementById('editNewpageModalClose_what_we_are').click();
            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.message ?? "Error submitting form. Please try again.");
        }
    };

    const handleAddSubmit_what_we_are = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("designation", formData.designation);
        if (formData.image) formDataToSend.append("image", formData.image);
        
        try {
            const response = await api.post(`/cms-content/home_page_content_what_we_are`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`, 
                },
            });

            if (response.status === 201) {
                fetchContentManagerPages_what_we_are();
                toast.success("Form submitted successfully.");
                setFormData({ title: "", description: "", designation: "", image: null, video: null });
                document.getElementById('addNewpageModalClose_what_we_are').click();
            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.message ?? "Error submitting form. Please try again.");
        }
    };

    // UPDATED: Handle Checkbox and File Inputs securely
    const handleInputChange_what_we_are = (e) => {
        const { name, value, files, type, checked } = e.target;
        
        if ((name === "image" || name === "video") && files && files.length > 0) {
            setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
        } else if (type === "checkbox") {
            setFormData((prevData) => ({ ...prevData, [name]: checked }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    // UPDATED: Populate state when clicking edit (Reads from item JSON)
    const handleEditClick = (item, index) => {
        setSelectedId(item.id);
        setFormData({
            title: item?.json_content?.title || "",
            description: item?.json_content?.description || "",
            designation: item?.json_content?.designation || "",
            image: null,
            video: null,
            show_video_desktop: item?.json_content?.show_video_desktop !== false, // Defaults true if missing
            show_video_mobile: item?.json_content?.show_video_mobile !== false, // Defaults true if missing
            item_index: index,
        });
        
        // Reset file inputs in DOM
        const imgInput = document.getElementById("aboutImageInput");
        const vidInput = document.getElementById("aboutVideoInput");
        if(imgInput) imgInput.value = "";
        if(vidInput) vidInput.value = "";
    };

    // --- OTHER HANDLERS ---
    const fetchContentManagerPages_meet_us = useCallback(async () => {
        setLoading(true);
            try {
            const response = await api.get("/cms-content/home_page_content_meet_us", {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (response.data && response.data.json_content) {
                setFormData({
                    top_title: response.data.json_content?.top_title || "",
                    top_description: response.data.json_content?.top_description || "",
                    mid_sub_title: response.data.json_content?.mid_sub_title || "",
                    mid_sub_description: response.data.json_content?.mid_sub_description || "",
                    mid_image: response.data.json_content?.mid_image || "",
                });
                setSelectedId(response.data.id);
            }
            setLoading(false);
        } catch (err) {
            toast.error(err.message ?? "Failed to fetch data. Please try again.");
            setLoading(false);
        }
    }, [authToken]);
    
    const fetchContentManagerPages_every_space = useCallback(async () => {
        setLoading(true);
            try {
            const response = await api.get("/cms-content/home_page_content_every_space", {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (response.data && response.data.json_content) {
                setFormData2({
                    top_title: response.data.json_content?.top_title || "",
                    top_description: response.data.json_content?.top_description || "",
                    mid_sub_title: response.data.json_content?.mid_sub_title || "",
                    mid_sub_description: response.data.json_content?.mid_sub_description || "",
                    mid_image: response.data.json_content?.mid_image || "",
                });
                setSelectedId_every_space(response.data.id);
            }
            setLoading(false);
        } catch (err) {
            toast.error(err.message ?? "Failed to fetch data. Please try again.");
            setLoading(false);
        }
    }, [authToken]);
    
    useEffect(() => {
        fetchContentManagerPages();
        fetchContentManagerPages_what_we_are();
        fetchContentManagerPages_meet_us();
        fetchContentManagerPages_every_space();
     }, [fetchContentManagerPages, fetchContentManagerPages_what_we_are, fetchContentManagerPages_meet_us, fetchContentManagerPages_every_space]);
     
    const deleteHandler = async (id) => {
        if (!canDelete) {
            toast.error(getDeletePermissionMessage("this home page item"));
            return;
        }

        if (window.confirm("Are you sure you want to delete this team?")) {
            try {
                const response = await api.delete(`/cms-content/${id}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                if (response.status === 200) {
                    fetchContentManagerPages();
                    fetchContentManagerPages_what_we_are();
                    fetchContentManagerPages_meet_us();
                } else {
                    toast.error("Failed to delete team. Please try again.");
                }
            } catch (error) {
                toast.error("Failed to delete team. Please try again.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("json_content[top_title]", formData.top_title);
        formDataToSend.append("json_content[top_description]", formData.top_description);
        formDataToSend.append("json_content[mid_sub_title]", formData.mid_sub_title);
        formDataToSend.append("json_content[mid_sub_description]", formData.mid_sub_description);
        formDataToSend.append("json_content[mid_image]", formData.mid_image);

        try {
            const response = await api.patch(`/cms-content/update-with-image/${selectedId}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`, 
                },
            });
            if (response.status === 200) {
                toast.success("Form submitted successfully.");
                fetchContentManagerPages_meet_us();
            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.message ?? "Error submitting form. Please try again.");
        }
    };

    const handleInputChange_meet_us = (e) => {
        const { name, value, files } = e.target;
        if (name === "mid_image" && files.length > 0) {
            setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleSubmit_every_space = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("json_content[top_title]", formData2.top_title);
        formDataToSend.append("json_content[top_description]", formData2.top_description);
        formDataToSend.append("json_content[mid_sub_title]", formData2.mid_sub_title);
        formDataToSend.append("json_content[mid_sub_description]", formData2.mid_sub_description);
        formDataToSend.append("json_content[mid_image]", formData2.mid_image);

        try {
            const response = await api.patch(`/cms-content/update-with-image/${selectedId_every_space}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`, 
                },
            });

            if (response.status === 200) {
                toast.success("Form submitted successfully.");
                fetchContentManagerPages_every_space();
            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.message ?? "Error submitting form. Please try again.");
        }
    };

    const handleInputChange_every_space = (e) => {
        const { name, value, files } = e.target;
        if (name === "mid_image" && files.length > 0) {
            setFormData2((prevData) => ({ ...prevData, [name]: files[0] }));
        } else {
            setFormData2((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    return (
        <div>
        <AuthMainLayout>
      
        <div className="container my-5">
                <h1 className="mb-4 text-center">CMS - What People Say Videos </h1>
                <div className="d-flex justify-content-end mb-3">
                    <button
                        onClick={() => setFormData({ title: "", description: "", designation: "", image: null })}
                        type="button"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#addNewpageModal"
                    >
                        Add New
                    </button>
                </div>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="table-responsive">
                        <table
                            id="usersTable"
                            className="table display table-striped table-bordered"
                            style={{ width: "100%" }}
                        >
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>Video Name</th>
                                    <th>Embed URL</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagesList.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item?.json_content?.title}</td>
                                        <td>{item?.json_content?.description}</td>
                                        <td>
                                            <button onClick={() => handleEditClick(item, index)} type="button" className="read_morebtn" data-bs-toggle="modal" data-bs-target="#editNewpageModal">
                                                Edit
                                            </button>
                                            {canDelete && <button className="ms-2 btn btn-danger" onClick={() => deleteHandler(item.id)}>Delete</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add New</h1>
                            <button type="button" className="btn-close" id="addNewpageModalClose" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleAddSubmit}>
                            <div className="modal-body row">

                                <div className="mb-3 col-md-12">
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
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Embed URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="description"
                                        placeholder="url"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="m-auto mt-2 col-12 d-flex justify-content-center">
                                    <button className="px-5 read_morebtn" type="submit">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="editNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit</h1>
                            <button type="button" className="btn-close" id="editNewpageModalClose" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="modal-body row">

                                <div className="mb-3 col-md-12">
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
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Embed URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="description"
                                        placeholder="URL"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="m-auto mt-2 col-12 d-flex justify-content-center">
                                    <button className="px-5 read_morebtn" type="submit">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

             {/* WHAT WE ARE / ABOUT US */}
             <div className="container my-5">
                <h1 className="mb-4 text-center">CMS - All Home Page Content</h1>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="table-responsive">
                        <table
                            id="usersTable"
                            className="table display table-striped table-bordered"
                            style={{ width: "100%" }}
                        >
                            <thead>
                                <tr>
                                    <th width="5%">SN</th>
                                    <th  width="15%">Text 1</th>
                                    <th width="25%">Text 2</th>
                                    <th width="25%">Text 3</th>
                                    <th width="10%">Media (Image/Video)</th>
                                    <th width="100">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
    {pagesList_what_we_are.map((item, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{item?.json_content?.title}</td>
            <td>{item?.json_content?.description}</td>
            <td>{item?.json_content?.designation}</td>
            <td>
                {/* Dynamically show if it has Video or Image */}
                {item?.json_content?.video ? (
                   <span className="badge bg-primary">Video Uploaded</span>
                ) : item?.json_content?.image ? (
                   <img src={item?.json_content?.image} alt={item?.json_content?.title} width="80" decoding="async" loading="lazy" />
                ) : (
                   <span className="text-muted">No Media</span>
                )}
            </td>
            <td>
                <button onClick={() => handleEditClick(item, index)} type="button" className="read_morebtn" data-bs-toggle="modal" data-bs-target="#editNewpageModal_what_we_offer">
                    Edit
                </button>
            </td>
        </tr>
    ))}
</tbody>

                        </table>
                    </div>
                )}
            </div>

            {/* Modal for "What We Offer" / About Us */}
            <div className="modal fade" id="addNewpageModal_what_we_offer" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add New</h1>
                            <button type="button" className="btn-close" id="addNewpageModalClose_what_we_are" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleAddSubmit_what_we_are}>
                            <div className="modal-body row">

                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Text 1</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        placeholder="Title"
                                        value={formData.title}
                                        onChange={handleInputChange_what_we_are}
                                        required
                                    />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Text 2</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="description"
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={handleInputChange_what_we_are}
                                        required
                                    />
                                </div>

                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Text 3</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="designation"
                                        placeholder="Designation"
                                        value={formData.designation}
                                        onChange={handleInputChange_what_we_are}
                                        required
                                    />
                                </div>

                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleInputChange_what_we_are}
                                    />
                                </div>

                                <div className="m-auto mt-2 col-12 d-flex justify-content-center">
                                    <button className="px-5 read_morebtn" type="submit">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* EDIT Modal for "What We Offer" / About Us */}
            <div className="modal fade" id="editNewpageModal_what_we_offer" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-light">
                            <h1 className="modal-title fs-5 fw-bold" id="exampleModalLabel">Edit About Us Section</h1>
                            <button type="button" className="btn-close" id="editNewpageModalClose_what_we_are" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleEditSubmit_what_we_are}>
                            <div className="modal-body row p-4">

                                <div className="mb-3 col-md-12">
                                    <label className="form-label fw-bold">Title (Text 1)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        placeholder="Title"
                                        value={formData.title}
                                        onChange={handleInputChange_what_we_are}
                                        required
                                    />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label fw-bold">Highlight Text (Text 2)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="description"
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={handleInputChange_what_we_are}
                                        required
                                    />
                                </div>

                                <div className="mb-3 col-md-12">
                                    <label className="form-label fw-bold">Paragraph Description (Text 3)</label>
                                    <textarea
                                        className="form-control"
                                        name="designation"
                                        placeholder="Designation"
                                        value={formData.designation}
                                        onChange={handleInputChange_what_we_are}
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>

                                <div className="col-12 mt-3"><h6 className="fw-bold border-bottom pb-2 text-primary">Media Uploads</h6></div>

                                <div className="mb-3 col-md-6">
                                    <label className="form-label fw-bold">Fallback Image</label>
                                    <input
                                        id="aboutImageInput"
                                        type="file"
                                        className="form-control"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleInputChange_what_we_are}
                                    />
                                    <small className="text-muted">Displays if video is disabled.</small>
                                </div>
                                
                                {/* NEW: 3D Video Upload */}
                                <div className="mb-3 col-md-6">
                                    <label className="form-label fw-bold">3D Video (MP4)</label>
                                    <input
                                        id="aboutVideoInput"
                                        type="file"
                                        className="form-control"
                                        name="video"
                                        accept="video/mp4,video/webm"
                                        onChange={handleInputChange_what_we_are}
                                    />
                                    <small className="text-muted">Upload high-quality interior render video.</small>
                                </div>

                                <div className="col-12 mt-3"><h6 className="fw-bold border-bottom pb-2 text-primary">Video Visibility Controls</h6></div>

                                {/* NEW: Visibility Toggles */}
                                <div className="col-md-6 mt-2">
                                    <div className="form-check form-switch fs-6">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            name="show_video_desktop"
                                            style={{cursor: 'pointer'}}
                                            checked={formData.show_video_desktop} 
                                            onChange={handleInputChange_what_we_are} 
                                        />
                                        <label className="form-check-label fw-bold ms-2">Play Video on Desktop</label>
                                    </div>
                                </div>

                                <div className="col-md-6 mt-2">
                                    <div className="form-check form-switch fs-6">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            name="show_video_mobile"
                                            style={{cursor: 'pointer'}}
                                            checked={formData.show_video_mobile} 
                                            onChange={handleInputChange_what_we_are} 
                                        />
                                        <label className="form-check-label fw-bold ms-2">Play Video on Mobile</label>
                                    </div>
                                </div>

                                <div className="m-auto mt-5 col-12 d-flex justify-content-end">
                                    <button type="button" className="btn btn-secondary px-4 me-2" data-bs-dismiss="modal">Cancel</button>
                                    <button className="btn btn-primary px-5 fw-bold" type="submit">
                                        Save Updates
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthMainLayout>
        <style>{`
          table tbody tr td {
            word-break: break-all;
          }
        `}</style>
        
        </div>

    );
};

export default CmsHowItsWorks;