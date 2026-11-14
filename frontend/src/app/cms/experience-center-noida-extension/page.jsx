// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { useSelector } from "react-redux";
// import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
// import api from "@/utils/api";
// import { toast } from "react-toastify";

// const CmsExperienceCenterNoidaExtension = () => {
//     const authToken = useSelector((state) => state.auth.authToken);
//     const [pagesList, setPagesList] = useState();
//     const [pagesListVideo, setPagesListVideo] = useState();
//     const [loading, setLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         title: "",
//         description: "",
//         image: null,
//     });
//     const [selectedId, setSelectedId] = useState(null);
//         const [childAlts, setChildAlts] = useState({}); // { index: alt text draft }
//     const selectedPage = pagesList?.find(page => page.id === selectedId);

//     const fetchContentManagerPages = useCallback(async () => {
//         try {
//             const response = await api.get(`/cms-parent-child/experience_center_noida_extension`, {
//                 headers: {
//                     Authorization: `Bearer ${authToken}`, 
//                 },
//             });

//             if (response.data && response.data) {
//                 setPagesList(response.data);
//                 setLoading(false);
//             }
//         } catch (err) {
//             toast.error(err.message ?? "Failed to fetch data. Please try again.");
//             setLoading(false);
//         }
//     }, [authToken]);

//     const fetchContentManagerPagesVideo = useCallback(async () => {
//         try {
//             const response = await api.get(`/cms-parent-child/experience_center_noida_extension_video`, {
//                 headers: {
//                     Authorization: `Bearer ${authToken}`, 
//                 },
//             });

//             if (response.data && response.data) {
//                 setPagesListVideo(response.data);
//                 setLoading(false);
//             }
//         } catch (err) {
//             toast.error(err.message ?? "Failed to fetch data. Please try again.");
//             setLoading(false);
//         }
//     }, [authToken]);
    
//      // Handle form submission for video
//      const handleEditSubmitVideo = async (e) => {
//         e.preventDefault();

//         const formDataToSend = new FormData();
//         formDataToSend.append("title", formData.title);
//         formDataToSend.append("description", formData.description);
//         if (formData.image) {
//             formDataToSend.append("image", formData.image);
//         }

//         try {
//             const response = await api.patch(`/cms-parent-child/${selectedId}`, formDataToSend, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${authToken}`, 
//                 },
//             });

//             if (response.status === 200) {
//                 fetchContentManagerPagesVideo();
//                 toast.success("Form submitted successfully.");
//                 setFormData({
//                     title: "",
//                     description: "",
//                     image: null,
//                 });
//                 document.getElementById('editNewpageModalVideoClose').click();
//             } else {
//                 toast.error("Error submitting form. Please try again.");
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message ?? "Error fetching data. Please try again.");
//             console.error("Error:", error);
//         }
//     };

//     useEffect(() => {
//         fetchContentManagerPages();
//         fetchContentManagerPagesVideo();
//     }, [fetchContentManagerPages, fetchContentManagerPagesVideo]);
     
//     const handleInputChange = (e) => {
//         const { name, value, files } = e.target;
//         if (name === "image" && files.length > 0) {
//             setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
//         } else {
//             setFormData((prevData) => ({ ...prevData, [name]: value }));
//         }
//     };

//     const handleEditSubmit = async (e) => {
//         e.preventDefault();

//         const formDataToSend = new FormData();
//         formDataToSend.append("title", formData.title);
//         formDataToSend.append("description", formData.description);
//                 formDataToSend.append("image_alt", formData.image_alt || "");
//         if (formData.image) {
//             formDataToSend.append("image", formData.image);
//         }

//         try {
//             const response = await api.patch(`/cms-parent-child/${selectedId}`, formDataToSend, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${authToken}`, 
//                 },
//             });

//             if (response.status === 200) {
//                 fetchContentManagerPages();
//                 toast.success("Form submitted successfully.");
//                 setFormData({
//                     title: "",
//                     description: "",
//                     image: null,
//                 });
//                 document.getElementById('editNewpageModalClose').click();
//             } else {
//                 toast.error("Error submitting form. Please try again.");
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message ?? "Error fetching data. Please try again.");
//             console.error("Error:", error);
//         }
//     };

//     const handleAddSubmit = async (e) => {
//         e.preventDefault();

//         const formDataToSend = new FormData();
//         // 🌟 CRITICAL: This sets the correct type in your database
//         formDataToSend.append("page_type", "experience_center_noida_extension");
//         formDataToSend.append("title", formData.title);
//         formDataToSend.append("description", formData.description);
//                 formDataToSend.append("image_alt", formData.image_alt || "");
//         if (formData.image) {
//             formDataToSend.append("image", formData.image);
//         }

//         try {
//             const response = await api.post(`/cms-parent-child`, formDataToSend, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${authToken}`, 
//                 },
//             });

//             if (response.status === 201) {
//                 fetchContentManagerPages();
//                 toast.success("Form submitted successfully.");
//                 setFormData({
//                     title: "",
//                     description: "",
//                     image: null,
//                 });
//                 document.getElementById('addNewpageModalClose').click();
//             } else {
//                 toast.error("Error submitting form. Please try again.");
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message ?? "Error fetching data. Please try again.");
//             console.error("Error:", error);
//         }
//     };

//     const handleAddSubmitVideo = async (e) => {
//     e.preventDefault();

//     const formDataToSend = new FormData();
//     formDataToSend.append("page_type", "experience_center_noida_extension_video");
//     formDataToSend.append("title", formData.title);
//     formDataToSend.append("description", formData.description);
//     if (formData.image) {
//         formDataToSend.append("image", formData.image);
//     }

//     try {
//         const response = await api.post(`/cms-parent-child`, formDataToSend, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//                 Authorization: `Bearer ${authToken}`,
//             },
//         });

//         if (response.status === 201) {
//             fetchContentManagerPagesVideo();
//             toast.success("Video added successfully.");
//             setFormData({
//                 title: "",
//                 description: "",
//                 image: null,
//             });
//             document.getElementById('addNewpageModalVideoClose').click();
//         } else {
//             toast.error("Error submitting form. Please try again.");
//         }
//     } catch (error) {
//         toast.error(error.response?.data?.message ?? "Error fetching data. Please try again.");
//         console.error("Error:", error);
//     }
// };

//     const handleEditClick = (item) => {
//         setSelectedId(item.id);
//         setFormData({
//             title: item.child_content?.title,
//             description: item.child_content?.description,
//                         image_alt: item.child_content?.image_alt || "",
//             image: null, 
//         });
//     };

//     const handleChildImageChange = async (index, e) => {
//         e.preventDefault();

//         if (e.target.files.length === 0) {
//             return;
//         }

//         const childDataToSend = new FormData();
//         childDataToSend.append('childImageIndex', index);
//         childDataToSend.append('image', e.target.files[0]);
//                 childDataToSend.append('image_alt', childAlts[index] ?? selectedPage?.child_images?.[index]?.image_alt ?? "");

//         try {
//             const response = await api.patch(`/cms-parent-child/update-child-image/${selectedId}`, childDataToSend, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${authToken}`, 
//                 },
//             });

//             if (response.status === 200) {
//                 fetchContentManagerPages();
//                 toast.success("Child image updated successfully.");
//             } else {
//                 toast.error("Error updating child image. Please try again.");
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message ?? "Error updating child image. Please try again.");
//             console.error("Error:", error);
//         }
//     }

//         const handleChildAltSave = async (index) => {
//         const alt = (childAlts[index] ?? selectedPage?.child_images?.[index]?.image_alt ?? "").trim();

//         const childDataToSend = new FormData();
//         childDataToSend.append('childImageIndex', index);
//         childDataToSend.append('image_alt', alt);

//         try {
//             const response = await api.patch(`/cms-parent-child/update-child-image/${selectedId}`, childDataToSend, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${authToken}`,
//                 },
//             });

//             if (response.status === 200) {
//                 fetchContentManagerPages();
//                 toast.success("Alt text updated.");
//             } else {
//                 toast.error("Error updating alt text. Please try again.");
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message ?? "Error updating alt text. Please try again.");
//             console.error("Error:", error);
//         }
//     };

//     const handleManageChild = (id) => {
//                 setSelectedId(id);
//         setChildAlts({});
//     }

//     const handleDeleteParent = async (id) => {
//     const confirmDelete = window.confirm(
//         "This will permanently delete this image and all of its child images. Continue?"
//     );
//     if (!confirmDelete) return;

//     try {
//         const response = await api.delete(`/cms-parent-child/${id}`, {
//             headers: {
//                 Authorization: `Bearer ${authToken}`,
//             },
//         });

//         if (response.status === 200 || response.status === 204) {
//             toast.success("Deleted successfully.");
//             fetchContentManagerPages();
//         } else {
//             toast.error("Error deleting item. Please try again.");
//         }
//     } catch (error) {
//         toast.error(error.response?.data?.message ?? "Error deleting item. Please try again.");
//         console.error("Error:", error);
//     }
// };

// const handleDeleteVideo = async (id) => {
//     const confirmDelete = window.confirm("This will permanently delete this video. Continue?");
//     if (!confirmDelete) return;

//     try {
//         const response = await api.delete(`/cms-parent-child/${id}`, {
//             headers: {
//                 Authorization: `Bearer ${authToken}`,
//             },
//         });

//         if (response.status === 200 || response.status === 204) {
//             toast.success("Deleted successfully.");
//             fetchContentManagerPagesVideo();
//         } else {
//             toast.error("Error deleting video. Please try again.");
//         }
//     } catch (error) {
//         toast.error(error.response?.data?.message ?? "Error deleting video. Please try again.");
//         console.error("Error:", error);
//     }
// };

//     return (
//         <AuthMainLayout>
//             <div className="container my-5">
//                 <h1 className="mb-4 text-center">CMS - Noida Extension Experience Center</h1>
//                 <div className="d-flex justify-content-end mb-3">
//                     <button
//                         onClick={() => setFormData({ title: "", description: "", image: null })}
//                         type="button"
//                         className="btn btn-primary"
//                         data-bs-toggle="modal"
//                         data-bs-target="#addNewpageModal"
//                     >
//                         Add New
//                     </button>
//                 </div>
//                 {loading ? (
//                     <div className="text-center">Loading...</div>
//                 ) : (
//                     <div className="table-responsive">
//                         <table
//                             id="usersTable"
//                             className="table display table-striped table-bordered"
//                             style={{ width: "100%" }}
//                         >
//                             <thead>
//                                 <tr>
//                                     <th>SN</th>
//                                     <th width="80">Image</th>
//                                     <th>Title</th>
//                                     <th>Description</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {pagesList && pagesList?.map((item, index) => (
//                                     <tr key={item.id}>
//                                         <td>{index + 1}</td>
//                                         <td>
//                                             <img src={item?.child_content?.image} alt={item?.child_content?.image_alt || item?.child_content?.title} height="80" decoding="async"  loading="lazy" />
//                                         </td>
//                                         <td>{item?.child_content.title}</td>
//                                         <td>{item?.child_content?.description}</td>
//                                         <td>
//                                             <button onClick={()=> handleManageChild(item.id)} type="button" className="btn btn-info me-1" data-bs-toggle="modal" data-bs-target="#manageChildModal">
//                                                 Manage Child
//                                             </button>
//                                             <button onClick={() => handleEditClick(item)} type="button" className="read_morebtn" data-bs-toggle="modal" data-bs-target="#editNewpageModal">
//                                                 Edit
//                                             </button>
//                                             <button onClick={() => handleDeleteParent(item.id)} type="button" className="btn btn-danger">
//         Delete
//     </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             {/* Modal Components */}
//             <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Page</h1>
//                             <button type="button" className="btn-close" id="addNewpageModalClose" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <form onSubmit={handleAddSubmit}>
//                             <div className="modal-body row">

//                                 <div className="mb-3 col-md-12">
//                                     <label htmlFor="title" className="form-label">Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="title"
//                                         placeholder="Title"
//                                         value={formData.title}
//                                         onChange={handleInputChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label htmlFor="description" className="form-label">Description</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="description"
//                                         placeholder="Description"
//                                         value={formData.description}
//                                         onChange={handleInputChange}
//                                         required
//                                     />
//                                 </div>


//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         name="image"
//                                         accept="image/*"
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Image Alt Text</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="image_alt"
//                                         value={formData.image_alt || ""}
//                                         onChange={handleInputChange}
//                                         placeholder="Describe the image (for SEO & accessibility)"
//                                         maxLength={125}
//                                     />
//                                 </div>

//                                 <div className="m-auto mt-2 col-12 d-flex justify-content-center">
//                                     <button className="px-5 read_morebtn" type="submit">
//                                         Save Changes
//                                     </button>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>

//             <div className="modal fade" id="editNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="exampleModalLabel">Edit</h1>
//                             <button type="button" className="btn-close" id="editNewpageModalClose" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <form onSubmit={handleEditSubmit}>
//                             <div className="modal-body row">

//                                 <div className="mb-3 col-md-12">
//                                     <label htmlFor="title" className="form-label">Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="title"
//                                         placeholder="Title"
//                                         value={formData.title}
//                                         onChange={handleInputChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label htmlFor="description" className="form-label">Description</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="description"
//                                         placeholder="Description"
//                                         value={formData.description}
//                                         onChange={handleInputChange}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         name="image"
//                                         accept="image/*"
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Image Alt Text</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="image_alt"
//                                         value={formData.image_alt || ""}
//                                         onChange={handleInputChange}
//                                         placeholder="Describe the image (for SEO & accessibility)"
//                                         maxLength={125}
//                                     />
//                                 </div>

//                                 <div className="m-auto mt-2 col-12 d-flex justify-content-center">
//                                     <button className="px-5 read_morebtn" type="submit">
//                                         Save Changes
//                                     </button>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>

//             <div className="modal fade" id="manageChildModal" tabIndex="-1" aria-labelledby="manageChildModalLabel" aria-hidden="true">
//                 <div className="modal-dialog modal-lg">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="manageChildModalLabel">Manage Child Images</h1>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <div className="modal-body">
//                             {selectedPage?.child_images?.map((imageItem, index) => (
//                                 <div className={`row border-bottom ${index !== 0 ? 'py-2' : ''}`} key={index}>
//                                     <div className="mb-2 col-md-6">
//                                         <label className="form-label">Image {index + 1}</label>
//                                         <input
//                                             type="file"
//                                             className="form-control"
//                                             accept="image/*"
//                                             onChange={(e) => handleChildImageChange(index, e)}
//                                         />
//                                                                                 <input
//                                             type="text"
//                                             className="form-control mt-2"
//                                             value={childAlts[index] ?? imageItem?.image_alt ?? ""}
//                                             onChange={(e) => setChildAlts((prev) => ({ ...prev, [index]: e.target.value }))}
//                                             placeholder="Alt text for this image"
//                                             maxLength={125}
//                                         />
//                                         <button
//                                             type="button"
//                                             className="btn btn-sm btn-outline-success mt-2"
//                                             onClick={() => handleChildAltSave(index)}
//                                         >
//                                             Save Alt Text
//                                         </button>
//                                     </div>
//                                     <div className="col-md-6">
//                                         {imageItem && <img src={imageItem.image} alt={imageItem.image_alt || `Image ${index + 1}`} style={{ height: '100px', marginTop: '10px' }} decoding="async"  loading="lazy" />}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="m-auto mt-2 col-12 d-flex justify-content-center mb-4">
//                             <button className="px-5 read_morebtn" type="button" data-bs-dismiss="modal">
//                                 Save Changes
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="container my-5">
//                 <h1 className="mb-4 text-center">Experience Center Video</h1>
//                 {(!pagesListVideo || pagesListVideo.length === 0) && (
//         <div className="d-flex justify-content-end mb-3">
//             <button
//                 onClick={() => setFormData({ title: "", description: "", image: null })}
//                 type="button"
//                 className="btn btn-primary"
//                 data-bs-toggle="modal"
//                 data-bs-target="#addNewpageModalVideo"
//             >
//                 Add New Video
//             </button>
//         </div>
//     )}
                 
//                 {loading ? (
//                     <div className="text-center">Loading...</div>
//                 ) : (
//                     <div className="table-responsive">
//                         <table
//                             id="usersTable"
//                             className="table display table-striped table-bordered"
//                             style={{ width: "100%" }}
//                         >
//                             <thead>
//                                 <tr>
//                                     <th>SN</th>
//                                     <th width="80">Video</th>
//                                     <th>Title</th>
//                                      <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {pagesListVideo && pagesListVideo?.map((item, index) => (
//                                     <tr key={item.id}>
//                                         <td>{index + 1}</td>
//                                         <td><a target="_blank" href={item?.child_content?.image} rel="noopener noreferrer">Video </a></td>
//                                         <td>{item?.child_content.title}</td>
//                                         <td>
//                                             <button onClick={() => handleEditClick(item)} type="button" className="read_morebtn" data-bs-toggle="modal" data-bs-target="#editNewpageModalVideo">
//                                                 Edit
//                                             </button>
//                                             <button onClick={() => handleDeleteVideo(item.id)} type="button" className="btn btn-danger">
//         Delete
//     </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             <div className="modal fade" id="addNewpageModalVideo" tabIndex="-1" aria-labelledby="addNewpageModalVideoLabel" aria-hidden="true">
//     <div className="modal-dialog">
//         <div className="modal-content">
//             <div className="modal-header">
//                 <h1 className="modal-title fs-5" id="addNewpageModalVideoLabel">Add New Video</h1>
//                 <button type="button" className="btn-close" id="addNewpageModalVideoClose" data-bs-dismiss="modal" aria-label="Close"></button>
//             </div>
//             <form onSubmit={handleAddSubmitVideo}>
//                 <div className="modal-body row">

//                     <div className="mb-3 col-md-12">
//                         <label htmlFor="title" className="form-label">Title</label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             name="title"
//                             placeholder="Title"
//                             value={formData.title}
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>

//                     <div className="mb-3 col-md-12">
//                         <label className="form-label">Video</label>
//                         <input
//                             type="file"
//                             className="form-control"
//                             name="image"
//                             accept="*"
//                             onChange={handleInputChange}
//                             required
//                         />
//                     </div>

//                     <div className="m-auto mt-2 col-12 d-flex justify-content-center">
//                         <button className="px-5 read_morebtn" type="submit">
//                             Save Changes
//                         </button>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     </div>
// </div>

//             <div className="modal fade" id="editNewpageModalVideo" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Video</h1>
//                             <button type="button" className="btn-close" id="editNewpageModalVideoClose" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <form onSubmit={handleEditSubmitVideo}>
//                             <div className="modal-body row">

//                                 <div className="mb-3 col-md-12">
//                                     <label htmlFor="title" className="form-label">Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="title"
//                                         placeholder="Title"
//                                         value={formData.title}
//                                         onChange={handleInputChange}
//                                         required
//                                     />
//                                 </div>
                                
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Video</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         name="image"
//                                         accept="*"
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 <div className="m-auto mt-2 col-12 d-flex justify-content-center">
//                                     <button className="px-5 read_morebtn" type="submit">
//                                         Save Changes
//                                     </button>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
            
//         </AuthMainLayout>
//     );
// };

// export default CmsExperienceCenterNoidaExtension;



"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import {
    HEADING_TAGS,
    DEFAULT_CARD_TAG,
    DEFAULT_CHILD_TAG,
    heroFromContent,
    childFromContent,
    normalizeMapEmbedUrl,
    validatePosterFile,
    POSTER_MAX_KB,
} from "@/utils/noidaCenterSettings";

const CENTER_DEFAULT_H1 = "HCI Experience Center, Noida Extension";
const CKEditorComponent = dynamic(() => import("../../components/CKEditorComponent"), { ssr: false });

const CmsExperienceCenterNoidaExtension = () => {
    const authToken = useSelector((state) => state.auth.authToken);
    const [pagesList, setPagesList] = useState();
    const [pagesListVideo, setPagesListVideo] = useState();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: null,
    });
    const [selectedId, setSelectedId] = useState(null);
        const [childAlts, setChildAlts] = useState({}); // { index: alt text draft }
    const selectedPage = pagesList?.find(page => page.id === selectedId);

    // ---- Extra experience-center fields. They are saved INTO THE EXISTING RECORDS (child_content), no new record:
    //  video record  -> poster + first-screen block (hero_* keys)
    //  parent record -> title_tag, child_heading, child_heading_tag, child_html
    const videoRecord = pagesListVideo?.[0] || null;
    const [heroDraft, setHeroDraft] = useState(heroFromContent(null, CENTER_DEFAULT_H1));
    const [mapInput, setMapInput] = useState("");
    const [posterFile, setPosterFile] = useState(null);
    const [removePoster, setRemovePoster] = useState(false);
    const [savingHero, setSavingHero] = useState(false);
    const [childDraft, setChildDraft] = useState({ heading: "", headingTag: "", html: "" });
    const [childEditorKey, setChildEditorKey] = useState(0);
    const [savingChild, setSavingChild] = useState(false);

    // fill the form from the saved video record whenever it is (re)loaded
    useEffect(() => {
        if (!videoRecord) return;
        const hero = heroFromContent(videoRecord.child_content, CENTER_DEFAULT_H1);
        setHeroDraft(hero);
        setMapInput(hero.mapEmbedUrl || "");
    }, [videoRecord]);

    const handleHeroChange = (e) => {
        const { name, value } = e.target;
        setHeroDraft((prev) => ({ ...prev, [name]: value }));
    };

    const handleHeroSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!videoRecord) {
            toast.error("Add the experience center video first.");
            return;
        }
        const mapUrl = normalizeMapEmbedUrl(mapInput);
        if (mapInput.trim() && !mapUrl) {
            toast.error("Map must be a Google Maps embed link (Share > Embed a map). Paste the iframe code or its src URL.");
            return;
        }
        const posterError = validatePosterFile(posterFile);
        if (posterError) {
            toast.error(posterError);
            return;
        }
        setSavingHero(true);
        try {
            const fd = new FormData();
            fd.append("hero_h1", heroDraft.h1 || CENTER_DEFAULT_H1);
            fd.append("hero_h1_tag", heroDraft.h1Tag || "h1");
            fd.append("hero_address", heroDraft.address || "");
            fd.append("hero_hours", heroDraft.hours || "");
            fd.append("hero_phone", heroDraft.phone || "");
            fd.append("hero_map_embed_url", mapUrl);
            fd.append("hero_directions_url", heroDraft.directionsUrl || "");
            fd.append("hero_call_label", heroDraft.callLabel || "");
            fd.append("hero_directions_label", heroDraft.directionsLabel || "");
            fd.append("hero_book_label", heroDraft.bookVisitLabel || "");
            fd.append("hero_book_url", heroDraft.bookVisitUrl || "");

            // Poster goes through the existing image-upload endpoint (it must NOT use the record's own
            // "image" field - that is the video file). Only the returned URL is stored on the video record.
            if (posterFile) {
                const up = new FormData();
                up.append("image", posterFile);
                up.append("alt_text", `${heroDraft.h1 || CENTER_DEFAULT_H1} - video poster`);
                const upRes = await api.post(`/cms-parent-child/upload-image`, up, {
                    headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
                });
                if (!upRes.data?.url) throw new Error("Poster upload failed.");
                fd.append("poster", upRes.data.url);
            } else if (removePoster) {
                fd.append("poster", "");
            }

            const response = await api.patch(`/cms-parent-child/${videoRecord.id}`, fd, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
            });
            if (response.status === 200) {
                toast.success("Poster & location block saved.");
                setPosterFile(null);
                setRemovePoster(false);
                const input = document.getElementById("noidaPosterInput");
                if (input) input.value = "";
                fetchContentManagerPagesVideo();
            } else {
                toast.error("Error saving. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message ?? error.message ?? "Error saving. Please try again.");
            console.error("Error:", error);
        } finally {
            setSavingHero(false);
        }
    };

    const handleChildContentSave = async () => {
        if (!selectedId) return;
        setSavingChild(true);
        try {
            const fd = new FormData();
            fd.append("child_heading", childDraft.heading || "");
            fd.append("child_heading_tag", childDraft.headingTag || "");
            fd.append("child_html", childDraft.html || "");
            const response = await api.patch(`/cms-parent-child/${selectedId}`, fd, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
            });
            if (response.status === 200) {
                toast.success("Child page heading & text saved.");
                fetchContentManagerPages();
            } else {
                toast.error("Error saving. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Error saving. Please try again.");
            console.error("Error:", error);
        } finally {
            setSavingChild(false);
        }
    };


    const fetchContentManagerPages = useCallback(async () => {
        try {
            const response = await api.get(`/cms-parent-child/experience_center_noida_extension`, {
                headers: {
                    Authorization: `Bearer ${authToken}`, 
                },
            });

            if (response.data && response.data) {
                setPagesList(response.data);
                setLoading(false);
            }
        } catch (err) {
            toast.error(err.message ?? "Failed to fetch data. Please try again.");
            setLoading(false);
        }
    }, [authToken]);

    const fetchContentManagerPagesVideo = useCallback(async () => {
        try {
            const response = await api.get(`/cms-parent-child/experience_center_noida_extension_video`, {
                headers: {
                    Authorization: `Bearer ${authToken}`, 
                },
            });

            if (response.data && response.data) {
                setPagesListVideo(response.data);
                setLoading(false);
            }
        } catch (err) {
            toast.error(err.message ?? "Failed to fetch data. Please try again.");
            setLoading(false);
        }
    }, [authToken]);
    
     // Handle form submission for video
     const handleEditSubmitVideo = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            const response = await api.patch(`/cms-parent-child/${selectedId}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`, 
                },
            });

            if (response.status === 200) {
                fetchContentManagerPagesVideo();
                toast.success("Form submitted successfully.");
                setFormData({
                    title: "",
                    description: "",
                    image: null,
                });
                document.getElementById('editNewpageModalVideoClose').click();
            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Error fetching data. Please try again.");
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchContentManagerPages();
        fetchContentManagerPagesVideo();
    }, [fetchContentManagerPages, fetchContentManagerPagesVideo]);
     
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files.length > 0) {
            setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
                formDataToSend.append("image_alt", formData.image_alt || "");
                formDataToSend.append("title_tag", formData.titleTag || "");
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            const response = await api.patch(`/cms-parent-child/${selectedId}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`, 
                },
            });

            if (response.status === 200) {
                fetchContentManagerPages();
                toast.success("Form submitted successfully.");
                setFormData({
                    title: "",
                    description: "",
                    image: null,
                });
                document.getElementById('editNewpageModalClose').click();
            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Error fetching data. Please try again.");
            console.error("Error:", error);
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        // 🌟 CRITICAL: This sets the correct type in your database
        formDataToSend.append("page_type", "experience_center_noida_extension");
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
                formDataToSend.append("image_alt", formData.image_alt || "");
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            const response = await api.post(`/cms-parent-child`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`, 
                },
            });

            if (response.status === 201) {
                fetchContentManagerPages();
                toast.success("Form submitted successfully.");
                setFormData({
                    title: "",
                    description: "",
                    image: null,
                });
                document.getElementById('addNewpageModalClose').click();
            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Error fetching data. Please try again.");
            console.error("Error:", error);
        }
    };

    const handleAddSubmitVideo = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("page_type", "experience_center_noida_extension_video");
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    if (formData.image) {
        formDataToSend.append("image", formData.image);
    }

    try {
        const response = await api.post(`/cms-parent-child`, formDataToSend, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 201) {
            fetchContentManagerPagesVideo();
            toast.success("Video added successfully.");
            setFormData({
                title: "",
                description: "",
                image: null,
            });
            document.getElementById('addNewpageModalVideoClose').click();
        } else {
            toast.error("Error submitting form. Please try again.");
        }
    } catch (error) {
        toast.error(error.response?.data?.message ?? "Error fetching data. Please try again.");
        console.error("Error:", error);
    }
};

    const handleEditClick = (item) => {
        setSelectedId(item.id);
        setFormData({
            title: item.child_content?.title,
            description: item.child_content?.description,
                        image_alt: item.child_content?.image_alt || "",
                        titleTag: item.child_content?.title_tag || "",
            image: null, 
        });
    };

    const handleChildImageChange = async (index, e) => {
        e.preventDefault();

        if (e.target.files.length === 0) {
            return;
        }

        const childDataToSend = new FormData();
        childDataToSend.append('childImageIndex', index);
        childDataToSend.append('image', e.target.files[0]);
                childDataToSend.append('image_alt', childAlts[index] ?? selectedPage?.child_images?.[index]?.image_alt ?? "");

        try {
            const response = await api.patch(`/cms-parent-child/update-child-image/${selectedId}`, childDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`, 
                },
            });

            if (response.status === 200) {
                fetchContentManagerPages();
                toast.success("Child image updated successfully.");
            } else {
                toast.error("Error updating child image. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Error updating child image. Please try again.");
            console.error("Error:", error);
        }
    }

        const handleChildAltSave = async (index) => {
        const alt = (childAlts[index] ?? selectedPage?.child_images?.[index]?.image_alt ?? "").trim();

        const childDataToSend = new FormData();
        childDataToSend.append('childImageIndex', index);
        childDataToSend.append('image_alt', alt);

        try {
            const response = await api.patch(`/cms-parent-child/update-child-image/${selectedId}`, childDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 200) {
                fetchContentManagerPages();
                toast.success("Alt text updated.");
            } else {
                toast.error("Error updating alt text. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Error updating alt text. Please try again.");
            console.error("Error:", error);
        }
    };

    const handleManageChild = (id) => {
                setSelectedId(id);
        setChildAlts({});
        const item = pagesList?.find((page) => page.id === id);
        setChildDraft(childFromContent(item?.child_content));
        setChildEditorKey((k) => k + 1);
    }

    const handleDeleteParent = async (id) => {
    const confirmDelete = window.confirm(
        "This will permanently delete this image and all of its child images. Continue?"
    );
    if (!confirmDelete) return;

    try {
        const response = await api.delete(`/cms-parent-child/${id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200 || response.status === 204) {
            toast.success("Deleted successfully.");
            fetchContentManagerPages();
        } else {
            toast.error("Error deleting item. Please try again.");
        }
    } catch (error) {
        toast.error(error.response?.data?.message ?? "Error deleting item. Please try again.");
        console.error("Error:", error);
    }
};

const handleDeleteVideo = async (id) => {
    const confirmDelete = window.confirm("This will permanently delete this video. Continue?");
    if (!confirmDelete) return;

    try {
        const response = await api.delete(`/cms-parent-child/${id}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200 || response.status === 204) {
            toast.success("Deleted successfully.");
            fetchContentManagerPagesVideo();
        } else {
            toast.error("Error deleting video. Please try again.");
        }
    } catch (error) {
        toast.error(error.response?.data?.message ?? "Error deleting video. Please try again.");
        console.error("Error:", error);
    }
};

    return (
        <AuthMainLayout>
            <div className="container my-5">
                <h1 className="mb-4 text-center">CMS - Noida Extension Experience Center</h1>
                <div className="d-flex justify-content-end mb-3">
                    <button
                        onClick={() => setFormData({ title: "", description: "", image: null })}
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
                                    <th width="80">Image</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagesList && pagesList?.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img src={item?.child_content?.image} alt={item?.child_content?.image_alt || item?.child_content?.title} height="80" decoding="async"  loading="lazy" />
                                        </td>
                                        <td>{item?.child_content.title}</td>
                                        <td>{item?.child_content?.description}</td>
                                        <td>
                                            <button onClick={()=> handleManageChild(item.id)} type="button" className="btn btn-info me-1" data-bs-toggle="modal" data-bs-target="#manageChildModal">
                                                Manage Child
                                            </button>
                                            <button onClick={() => handleEditClick(item)} type="button" className="read_morebtn" data-bs-toggle="modal" data-bs-target="#editNewpageModal">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteParent(item.id)} type="button" className="btn btn-danger">
        Delete
    </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Components */}
            <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Page</h1>
                            <button type="button" className="btn-close" id="addNewpageModalClose" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleAddSubmit}>
                            <div className="modal-body row">

                                <div className="mb-3 col-md-12">
                                    <label htmlFor="title" className="form-label">Title</label>
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
                                    <label htmlFor="description" className="form-label">Description</label>
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
                                    <label className="form-label">Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                    />
                                </div>

                                                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Image Alt Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="image_alt"
                                        value={formData.image_alt || ""}
                                        onChange={handleInputChange}
                                        placeholder="Describe the image (for SEO & accessibility)"
                                        maxLength={125}
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
                                    <label htmlFor="title" className="form-label">Title</label>
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
                                    <label className="form-label">Title Heading Tag (SEO)</label>
                                    <select
                                        className="form-select"
                                        name="titleTag"
                                        value={formData.titleTag || ""}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Default ({DEFAULT_CARD_TAG.toUpperCase()})</option>
                                        {HEADING_TAGS.map((tag) => (
                                            <option key={tag} value={tag}>{tag.toUpperCase()}</option>
                                        ))}
                                    </select>
                                    <div className="form-text">The title above is shown on the public page with this heading tag.</div>
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label htmlFor="description" className="form-label">Description</label>
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
                                    <label className="form-label">Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                    />
                                </div>

                                                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Image Alt Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="image_alt"
                                        value={formData.image_alt || ""}
                                        onChange={handleInputChange}
                                        placeholder="Describe the image (for SEO & accessibility)"
                                        maxLength={125}
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

            <div className="modal fade" id="manageChildModal" data-bs-focus="false" tabIndex="-1" aria-labelledby="manageChildModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="manageChildModalLabel">Manage Child Images</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* --- Child page heading + rich text: the text appears just below the heading on the public child page --- */}
                            {selectedPage && (
                                <div className="border rounded p-3 mb-3">
                                    <h2 className="fs-6 mb-3">Child Page Heading &amp; Text</h2>
                                    <div className="row g-2 mb-3">
                                        <div className="col-md-9">
                                            <label className="form-label">Heading</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={childDraft.heading}
                                                onChange={(e) => setChildDraft((prev) => ({ ...prev, heading: e.target.value }))}
                                                placeholder={`Leave empty to use the title: ${selectedPage?.child_content?.title || ""}`}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Heading Tag</label>
                                            <select
                                                className="form-select"
                                                value={childDraft.headingTag}
                                                onChange={(e) => setChildDraft((prev) => ({ ...prev, headingTag: e.target.value }))}
                                            >
                                                <option value="">Default ({DEFAULT_CHILD_TAG.toUpperCase()})</option>
                                                {HEADING_TAGS.map((tag) => (
                                                    <option key={tag} value={tag}>{tag.toUpperCase()}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <label className="form-label">Text (shown just below the heading on the page)</label>
                                    <CKEditorComponent
                                        key={`child-${selectedId}-${childEditorKey}`}
                                        pageData={childDraft.html || ""}
                                        setPageData={(data) => setChildDraft((prev) => ({ ...prev, html: data }))}
                                    />
                                    <div className="d-flex justify-content-end mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-success"
                                            onClick={handleChildContentSave}
                                            disabled={savingChild}
                                        >
                                            {savingChild ? "Saving..." : "Save Heading & Text"}
                                        </button>
                                    </div>
                                </div>
                            )}
                                                        {selectedPage?.child_images?.map((imageItem, index) => (
                                <div className={`row border-bottom ${index !== 0 ? 'py-2' : ''}`} key={index}>
                                    <div className="mb-2 col-md-6">
                                        <label className="form-label">Image {index + 1}</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={(e) => handleChildImageChange(index, e)}
                                        />
                                                                                <input
                                            type="text"
                                            className="form-control mt-2"
                                            value={childAlts[index] ?? imageItem?.image_alt ?? ""}
                                            onChange={(e) => setChildAlts((prev) => ({ ...prev, [index]: e.target.value }))}
                                            placeholder={`Alt text for this image (fallback: ${selectedPage?.child_content?.title || "title"})`}
                                            maxLength={125}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-success mt-2"
                                            onClick={() => handleChildAltSave(index)}
                                        >
                                            Save Alt Text
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        {imageItem && <img src={imageItem.image} alt={imageItem.image_alt || `Image ${index + 1}`} style={{ height: '100px', marginTop: '10px' }} decoding="async"  loading="lazy" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="m-auto mt-2 col-12 d-flex justify-content-center mb-4">
                            <button className="px-5 read_morebtn" type="button" data-bs-dismiss="modal">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container my-5">
                <h1 className="mb-4 text-center">Experience Center Video</h1>
                {(!pagesListVideo || pagesListVideo.length === 0) && (
        <div className="d-flex justify-content-end mb-3">
            <button
                onClick={() => setFormData({ title: "", description: "", image: null })}
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#addNewpageModalVideo"
            >
                Add New Video
            </button>
        </div>
    )}
                 
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
                                    <th width="80">Video</th>
                                    <th>Title</th>
                                     <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagesListVideo && pagesListVideo?.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td><a target="_blank" href={item?.child_content?.image} rel="noopener noreferrer">Video </a></td>
                                        <td>{item?.child_content.title}</td>
                                        <td>
                                            <button onClick={() => handleEditClick(item)} type="button" className="read_morebtn" data-bs-toggle="modal" data-bs-target="#editNewpageModalVideo">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeleteVideo(item.id)} type="button" className="btn btn-danger">
        Delete
    </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="modal fade" id="addNewpageModalVideo" tabIndex="-1" aria-labelledby="addNewpageModalVideoLabel" aria-hidden="true">
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="addNewpageModalVideoLabel">Add New Video</h1>
                <button type="button" className="btn-close" id="addNewpageModalVideoClose" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleAddSubmitVideo}>
                <div className="modal-body row">

                    <div className="mb-3 col-md-12">
                        <label htmlFor="title" className="form-label">Title</label>
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
                        <label className="form-label">Video</label>
                        <input
                            type="file"
                            className="form-control"
                            name="image"
                            accept="*"
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

            <div className="modal fade" id="editNewpageModalVideo" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Video</h1>
                            <button type="button" className="btn-close" id="editNewpageModalVideoClose" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleEditSubmitVideo}>
                            <div className="modal-body row">

                                <div className="mb-3 col-md-12">
                                    <label htmlFor="title" className="form-label">Title</label>
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
                                    <label className="form-label">Video</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="image"
                                        accept="*"
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
            
            {/* --- Noida Extension page: video poster, H1 and location block (first screen) --- */}
            <style>{`.ck.ck-balloon-panel{z-index:2000 !important}.ck-body-wrapper{z-index:2000}`}</style>
            <div className="container my-5">
                <h1 className="mb-2 text-center">Video Poster, H1 &amp; Location Block</h1>
                <p className="text-center text-muted mb-4">Shown in the first screen of the Noida Extension experience center page.</p>
                {!videoRecord ? (
                    <div className="alert alert-warning">Add the experience center video above first - these settings are saved with the video.</div>
                ) : (
                <form onSubmit={handleHeroSave}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Video Poster Image</label>
                            <input
                                id="noidaPosterInput"
                                type="file"
                                className="form-control"
                                accept="image/webp,.webp"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    const error = validatePosterFile(file);
                                    if (error) {
                                        toast.error(error);
                                        e.target.value = "";
                                        setPosterFile(null);
                                        return;
                                    }
                                    setPosterFile(file);
                                }}
                            />
                            <div className="form-text">Shown while the video loads. WebP only, under {POSTER_MAX_KB} KB. If none is uploaded, the first card image is used.</div>
                        </div>
                        <div className="col-md-6">
                            {heroDraft.poster && !removePoster && (
                                <div>
                                    <img src={heroDraft.poster} alt="Current video poster" height="90" style={{ borderRadius: 6 }} />
                                    <div>
                                        <button type="button" className="btn btn-sm btn-outline-danger mt-2" onClick={() => setRemovePoster(true)}>
                                            Remove poster
                                        </button>
                                    </div>
                                </div>
                            )}
                            {removePoster && (
                                <div className="text-danger">
                                    Poster will be removed on save.{" "}
                                    <button type="button" className="btn btn-link btn-sm p-0" onClick={() => setRemovePoster(false)}>Undo</button>
                                </div>
                            )}
                        </div>
                        <div className="col-md-9">
                            <label className="form-label">Main Heading</label>
                            <input type="text" className="form-control" name="h1" value={heroDraft.h1} onChange={handleHeroChange} placeholder={CENTER_DEFAULT_H1} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Heading Tag</label>
                            <select className="form-select" name="h1Tag" value={heroDraft.h1Tag || "h1"} onChange={handleHeroChange}>
                                {HEADING_TAGS.map((tag) => (
                                    <option key={tag} value={tag}>{tag.toUpperCase()}</option>
                                ))}
                            </select>
                            <div className="form-text">Use H1 for the main page heading (one per page).</div>
                        </div>
                        <div className="col-12">
                            <label className="form-label">Address</label>
                            <textarea className="form-control" rows={2} name="address" value={heroDraft.address} onChange={handleHeroChange} placeholder="Full address of the experience center" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Opening Hours (one line per row)</label>
                            <textarea className="form-control" rows={3} name="hours" value={heroDraft.hours} onChange={handleHeroChange} placeholder={"Mon - Sat: 10:00 AM - 7:00 PM\nSunday: 11:00 AM - 5:00 PM"} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Phone (click-to-call)</label>
                            <input type="text" className="form-control" name="phone" value={heroDraft.phone} onChange={handleHeroChange} placeholder="+91 70707 01373" />
                            <label className="form-label mt-3">Call Button Text</label>
                            <input type="text" className="form-control" name="callLabel" value={heroDraft.callLabel} onChange={handleHeroChange} />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Google Map Embed</label>
                            <textarea
                                className="form-control"
                                rows={2}
                                value={mapInput}
                                onChange={(e) => setMapInput(e.target.value)}
                                placeholder='Google Maps > Share > Embed a map > paste the <iframe ...> code (or just its src URL)'
                            />
                            {mapInput.trim() && (
                                <div className={`form-text ${normalizeMapEmbedUrl(mapInput) ? "text-success" : "text-danger"}`}>
                                    {normalizeMapEmbedUrl(mapInput) ? "Valid Google Maps embed." : "Not a Google Maps embed link."}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Get Directions Button Text</label>
                            <input type="text" className="form-control" name="directionsLabel" value={heroDraft.directionsLabel} onChange={handleHeroChange} />
                            <label className="form-label mt-3">Get Directions Link (optional)</label>
                            <input type="text" className="form-control" name="directionsUrl" value={heroDraft.directionsUrl} onChange={handleHeroChange} placeholder="Empty = Google Maps directions to the address" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Book a Visit Button Text</label>
                            <input type="text" className="form-control" name="bookVisitLabel" value={heroDraft.bookVisitLabel} onChange={handleHeroChange} />
                            <label className="form-label mt-3">Book a Visit Link</label>
                            <input type="text" className="form-control" name="bookVisitUrl" value={heroDraft.bookVisitUrl} onChange={handleHeroChange} placeholder="/contact" />
                        </div>
                        <div className="col-12 d-flex justify-content-center">
                            <button className="px-5 read_morebtn" type="submit" disabled={savingHero}>
                                {savingHero ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </form>
                )}
            </div>


        </AuthMainLayout>
    );
};

export default CmsExperienceCenterNoidaExtension;