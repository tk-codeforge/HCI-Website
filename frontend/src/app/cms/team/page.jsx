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
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        designation: "",
        image: null,
        item_index: null,
    });
    const [selectedId, setSelectedId] = useState(null);

    const [pageMediaId, setPageMediaId] = useState(null);
const [teamMediaItems, setTeamMediaItems] = useState([]);
const [newImageFile, setNewImageFile] = useState(null);
const [newVideoFile, setNewVideoFile] = useState(null);
const [mediaDescriptions, setMediaDescriptions] = useState({});

    const fetchContentManagerPages = useCallback(async () => {
        try {
            const response = await api.get('/cms-content/team', {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Send auth token
                },
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

    const fetchTeamPageMedia = useCallback(async () => {
    try {
        const response = await api.get('/cms-content/team_page_media', {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (response.data) {
            const record = Array.isArray(response.data) ? response.data[0] : response.data;
            setPageMediaId(record?.id || null);
            // setTeamMediaItems(record?.json_content?.items || []);
            const items = record?.json_content?.items || [];
setTeamMediaItems(items);
setMediaDescriptions(
    items.reduce((acc, item, idx) => {
        acc[idx] = item.description || "";
        return acc;
    }, {})
);
        }
    } catch (err) {
        console.error("Failed to fetch team page media:", err);
    }
}, [authToken]);

    useEffect(() => {
        fetchContentManagerPages();
        fetchTeamPageMedia();
    }, [fetchContentManagerPages, fetchTeamPageMedia]);

    // Handle input change for text fields and image
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files.length > 0) {
            setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    // Handle form submission
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
            // Send POST request to save form data
            const response = await api.patch(`/cms-content/update-with-image/${selectedId}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`, // Send auth token
                },
            });

            // Handle success response
            if (response.status === 200) {
                fetchContentManagerPages();
                toast.success("Form submitted successfully.");
                setFormData({
                    title: "",
                    description: "",
                    designation: "",
                    image: null,
                });

                // Close modal
                document.getElementById('editNewpageModalClose').click();

            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.message ?? "Error submitting form. Please try again.");
            console.error("Error:", error);
        }
    };

    const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImageFile) {
        toast.error("Please select an image to add.");
        return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("action", "add");
    formDataToSend.append("image", newImageFile);

    try {
        const response = await api.patch(`/cms-content/update-team-page-media/${pageMediaId}`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
        });
        if (response.status === 200) {
            toast.success("Image added successfully.");
            setNewImageFile(null);
            e.target.reset();
            fetchTeamPageMedia();
        }
    } catch (error) {
        toast.error(error.message ?? "Error adding image.");
    }
};

const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!newVideoFile) {
        toast.error("Please select a video to add.");
        return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("action", "add");
    formDataToSend.append("video", newVideoFile);

    try {
        const response = await api.patch(`/cms-content/update-team-page-media/${pageMediaId}`, formDataToSend, {
            headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
        });
        if (response.status === 200) {
            toast.success("Video added successfully.");
            setNewVideoFile(null);
            e.target.reset();
            fetchTeamPageMedia();
        }
    } catch (error) {
        toast.error(error.message ?? "Error adding video.");
    }
};

const handleUpdateDescription = async (index) => {
    const formDataToSend = new FormData();
    formDataToSend.append("action", "update_description");
    formDataToSend.append("item_index", index);
    formDataToSend.append("description", mediaDescriptions[index] || "");

    try {
        const response = await api.patch(
            `/cms-content/update-team-page-media/${pageMediaId}`,
            formDataToSend,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        if (response.status === 200) {
            toast.success("Description updated.");
            fetchTeamPageMedia();
        }
    } catch (error) {
        toast.error(error.message ?? "Error updating description.");
    }
};

const handleDeleteMedia = async (index) => {
    if (!window.confirm("Are you sure you want to delete this media item?")) return;

    const formDataToSend = new FormData();
    formDataToSend.append("action", "delete");
    formDataToSend.append("item_index", index);

    try {
        const response = await api.patch(
            `/cms-content/update-team-page-media/${pageMediaId}`,
            formDataToSend,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        if (response.status === 200) {
            toast.success("Media deleted successfully.");
            fetchTeamPageMedia();
        }
    } catch (error) {
        toast.error(error.message ?? "Error deleting media.");
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
            // Send POST request to save form data
            const response = await api.post(`/cms-content/team`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`, // Send auth token
                },
            });

            // Handle success response
            if (response.status === 201) {
                fetchContentManagerPages();
                toast.success("Form submitted successfully.");
                setFormData({
                    title: "",
                    description: "",
                    designation: "",
                    image: null,
                });

                // Close modal
                document.getElementById('addNewpageModalClose').click();

            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.message ?? "Error submitting form. Please try again.");
            console.error("Error:", error);
        }
    };

    // Set form data when edit button is clicked
    const handleEditClick = (item, index) => {
        setSelectedId(item.id);
        setFormData({
            title: item?.json_content?.title,
            description: item?.json_content?.description,
            designation: item?.json_content?.designation,
            image: null, // Reset image field
            item_index: index,
        });
    };

    const deleteHandler = async (id) => {
        if (!canDelete) {
            toast.error(getDeletePermissionMessage("this team member"));
            return;
        }

        if (window.confirm("Are you sure you want to delete this team?")) {
            try {
                const response = await api.delete(`/cms-content/${id}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Send auth token
                    },
                });

                if (response.status === 200) {
                    fetchContentManagerPages();
                } else {
                    toast.error("Failed to delete team. Please try again.");
                }
            } catch (error) {
                toast.error("Failed to delete team. Please try again.");
                console.error("Error:", error);
            }
        }
    };


    return (
        <AuthMainLayout>
            <div className="container my-5">
                <h1 className="mb-4 text-center">CMS - Team</h1>
                <div className="d-flex justify-content-end mb-3">
                    <button
                        onClick={() => setFormData({ title: "", description: "", writer_name: "", published_on: "", image: null })}
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
                                    <th>Title</th>
                                    <th width="300">Description</th>
                                    <th>Designation</th>
                                    <th width="80">Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagesList && pagesList?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item?.json_content?.title}</td>
                                        <td>{item?.json_content?.description}</td>
                                        <td>{item?.json_content?.designation}</td>
                                        <td>
                                            <img src={item?.json_content?.image} alt={item?.json_content?.title} height="80" decoding="async"  loading="lazy" />
                                        </td>
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

            <div className="container my-5">
    <h3 className="mb-3">Team Page - Videos & Images</h3>

    {/* Existing media list */}
    {/* <div className="row g-3 mb-4">
        {teamMediaItems.length === 0 && (
            <p className="text-muted">No media added yet. Fallback video/image will be shown on the site.</p>
        )} */}
        {/* {teamMediaItems.map((item, idx) => (
            <div className="col-md-4" key={idx}>
                <div className="card p-2">
                    {item.image && (
                        <img src={item.image} alt="Team media" height="120" style={{ objectFit: "cover" }} />
                    )}
                    {item.video && (
                        <div className="small text-muted mt-1">Video: {item.video.split('/').pop()}</div>
                    )}
                    <button
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => handleDeleteMedia(idx)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ))} */}
        {/* {teamMediaItems.map((item, idx) => (
    <div className="col-md-4" key={idx}>
        <div className="card p-2">
            {item.type === 'image' && (
                <img src={item.url} alt="Team media" height="120" style={{ objectFit: "cover" }} />
            )}
            {item.type === 'video' && (
                <div className="small text-muted mt-1">Video: {item.url?.split('/').pop()}</div>
            )}
            <button className="btn btn-danger btn-sm mt-2" onClick={() => handleDeleteMedia(idx)}>
                Delete
            </button>
        </div>
    </div>
))}
    </div> */}

    {/* Add new media form */}
    {/* <form onSubmit={handleAddMedia} className="row align-items-end">
        <div className="mb-3 col-md-5">
            <label className="form-label">Add Image</label>
            <input
                type="file"
                className="form-control"
                name="image"
                accept="image/*"
                onChange={handleNewMediaChange}
            />
        </div>
        <div className="mb-3 col-md-5">
            <label className="form-label">Add Video</label>
            <input
                type="file"
                className="form-control"
                name="video"
                accept="video/*"
                onChange={handleNewMediaChange}
            />
        </div>
        <div className="mb-3 col-md-2">
            <button className="btn btn-primary w-100" type="submit">
                Add
            </button>
        </div>
    </form> */}

    {/* <div className="row">
    <div className="col-md-6 mb-4">
        <h5>Add Video</h5>
        <form onSubmit={handleAddVideo}>
            <div className="mb-3">
                <input
                    type="file"
                    className="form-control"
                    accept="video/*"
                    onChange={(e) => setNewVideoFile(e.target.files[0] || null)}
                />
            </div>
            <button className="btn btn-primary" type="submit">Save Video</button>
        </form>
    </div>
    <div className="col-md-6 mb-4">
        <h5>Add Image</h5>
        <form onSubmit={handleAddImage}>
            <div className="mb-3">
                <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setNewImageFile(e.target.files[0] || null)}
                />
            </div>
            <button className="btn btn-primary" type="submit">Save Image</button>
        </form>
    </div>
</div> */}

{teamMediaItems.length === 0 && (
        <p className="text-muted">No media added yet. Fallback video/image will be shown on the site.</p>
    )}

    {/* --- 1. VIDEOS GROUP --- */}
    {teamMediaItems.some((item) => item.type === 'video') && (
        <div className="mb-5">
            <h5 className="border-bottom pb-2 text-primary">Videos</h5>
            <div className="row g-3">
                {teamMediaItems.map((item, idx) => {
                    if (item.type !== 'video') return null;
                    return (
                        <div className="col-md-4" key={idx}>
                            <div className="card p-2 h-100 justify-content-between shadow-sm">
                                <video
                                    src={item.url}
                                    controls
                                    muted
                                    preload="metadata"
                                    height="160"
                                    style={{ objectFit: "cover", width: "100%", borderRadius: "6px" }}
                                />
                                <div className="small text-muted mt-2 text-truncate" title={item.url}>
                                    {item.url?.split('/').pop()}
                                </div>
                                <textarea
    className="form-control form-control-sm mt-2"
    placeholder="Add description..."
    rows={2}
    value={mediaDescriptions[idx] || ""}
    onChange={(e) =>
        setMediaDescriptions((prev) => ({ ...prev, [idx]: e.target.value }))
    }
/>
<button
    className="btn btn-outline-primary btn-sm mt-2 w-100"
    onClick={() => handleUpdateDescription(idx)}
>
    Save Description
</button>
                                <button className="btn btn-danger btn-sm mt-2 w-100" onClick={() => handleDeleteMedia(idx)}>
                                    Delete Video
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )}

    {/* --- 2. IMAGES GROUP --- */}
    {teamMediaItems.some((item) => item.type === 'image') && (
        <div className="mb-5">
            <h5 className="border-bottom pb-2 text-primary">Images</h5>
            <div className="row g-3">
                {teamMediaItems.map((item, idx) => {
                    if (item.type !== 'image') return null;
                    return (
                        <div className="col-md-4" key={idx}>
                            <div className="card p-2 h-100 justify-content-between shadow-sm">
                                <img
                                    src={item.url}
                                    alt="Team media"
                                    height="160"
                                    style={{ objectFit: "cover", width: "100%", borderRadius: "6px" }}
                                />
                                <textarea
    className="form-control form-control-sm mt-2"
    placeholder="Add description..."
    rows={2}
    value={mediaDescriptions[idx] || ""}
    onChange={(e) =>
        setMediaDescriptions((prev) => ({ ...prev, [idx]: e.target.value }))
    }
/>
<button
    className="btn btn-outline-primary btn-sm mt-2 w-100"
    onClick={() => handleUpdateDescription(idx)}
>
    Save Description
</button>
                                <button className="btn btn-danger btn-sm mt-2 w-100" onClick={() => handleDeleteMedia(idx)}>
                                    Delete Image
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )}

    {/* Upload Forms */}
    <div className="row pt-3 border-top">
        <div className="col-md-6 mb-4">
            <h5>Add Video</h5>
            <form onSubmit={handleAddVideo}>
                <div className="mb-3">
                    <input
                        type="file"
                        className="form-control"
                        accept="video/*"
                        onChange={(e) => setNewVideoFile(e.target.files[0] || null)}
                    />
                </div>
                <button className="btn btn-primary" type="submit">Save Video</button>
            </form>
        </div>
        <div className="col-md-6 mb-4">
            <h5>Add Image</h5>
            <form onSubmit={handleAddImage}>
                <div className="mb-3">
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setNewImageFile(e.target.files[0] || null)}
                    />
                </div>
                <button className="btn btn-primary" type="submit">Save Image</button>
            </form>
        </div>
    </div>
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
                                    <label className="form-label">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="description"
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Designation</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="designation"
                                        placeholder="Designation"
                                        value={formData.designation}
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
                                    <label className="form-label">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="description"
                                        placeholder="Description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Designation</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="designation"
                                        placeholder="Designation"
                                        value={formData.designation}
                                        onChange={handleInputChange}
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
                                        onChange={handleInputChange}
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
        </AuthMainLayout>
    );
};

export default CmsHowItsWorks;
