// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { useSelector } from "react-redux";
// import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
// import api from "@/utils/api";
// import { toast } from "react-toastify";
// import dynamic from "next/dynamic";
// import {
//     DEFAULT_SITEMAP_CHANGE_FREQUENCY,
//     DEFAULT_SITEMAP_PRIORITY,
//     SITEMAP_CHANGE_FREQUENCY_OPTIONS
// } from "@/utils/seoHelpers";

// import GlobalSeoForm from "@/app/components/GlobalSeoForm";
// import { getCmsAccess, getPublishWorkflowMessage } from "@/utils/cmsAccess";
// import { cityUrlMap } from "@/utils/cityRoutes";

// const CKEditorComponent = dynamic(() => import('@/app/components/CKEditorComponent'), { ssr: false });

// const Counter = ({ value = "", limit }) => (
//     <small className={value.length > limit ? "text-danger" : value.length >= limit - 10 ? "text-warning" : "text-muted"}>
//         {value.length}/{limit} characters
//     </small>
// );
// const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

// const MAX_IMAGE_BYTES = 200 * 1024;
// const validateImage = (file) => {
//     if (file.type !== "image/webp") {
//         toast.error("Only .webp images are allowed.");
//         return false;
//     }
//     if (file.size > MAX_IMAGE_BYTES) {
//         toast.error(`Image must be 200 KB or smaller (selected: ${Math.round(file.size / 1024)} KB).`);
//         return false;
//     }
//     return true;
// };

// const CmsCity = () => {

//     const authToken = useSelector((state) => state.auth.authToken);
//     const user = useSelector((state) => state.auth.user);
//     const { canPublish } = getCmsAccess(user);
//     const [pagesList, setPagesList] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         city_type: "",
//         main_title: "",
//         main_description: "",
//         location_image: null,
//         side_title: "",
//         side_description: "",
//         side_image: null,
//         banner_title: "",
//         banner_subtitle: "",
//         banner_image: null,
//         main_title_tag: "h2",
// banner_title_tag: "h1",
// side_title_tag: "h2",
//         banner_image_alt: "",
// location_image_alt: "",
// side_image_alt: "",
//     });
//     // const [formSeoContentData, setFormSeoContentData] = useState({
//     //     meta_title: "",
//     //     meta_description: "",
//     //     meta_keywords: "",
//     //     canonical_url: "",
//     //     meta_robots_index: "index",
//     //     meta_robots_follow: "follow",
//     //     include_in_sitemap: true,
//     //     sitemap_change_frequency: DEFAULT_SITEMAP_CHANGE_FREQUENCY,
//     //     sitemap_priority: String(DEFAULT_SITEMAP_PRIORITY),
//     //     og_title: "",
//     //     og_description: "",
//     //     og_image: "",
//     //     custom_schema: ""
//     // });

//     const [seoRow, setSeoRow] = useState(null);           // existing seo_tag row (null = will be created)
//     const [seoFormData, setSeoFormData] = useState(null);  // data handed to GlobalSeoForm
//     const [selectedId, setSelectedId] = useState(null);

//     const fetchContentManagerPages = useCallback(async () => {
//         try {
//             const response = await api.get("/cms-city", {
//                 headers: {
//                     Authorization: `Bearer ${authToken}`, // Send auth token
//                 },
//             });

//             setPagesList(response.data);
//             setSelectedId(response.data.id);
//             setLoading(false);

//         } catch (err) {
//             toast.error(err.response?.data?.message ?? "Error fetching data. Please try again.");
//             setLoading(false);
//         }
//     }, [authToken]);

//     useEffect(() => {
//         fetchContentManagerPages();
//     }, [fetchContentManagerPages]);

//     // Handle input change for text fields and image
//     const handleInputChange = (e) => {
//         const { name, value, files } = e.target;
//         if ((name === "location_image" || name === "side_image" || name === "banner_image") && files?.length > 0) {
//             if (!validateImage(files[0])) {
//     e.target.value = "";
//     return;
// }
//             setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
//         } else {
//             setFormData((prevData) => ({ ...prevData, [name]: value }));
//         }
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
       
//         const formDataToSend = new FormData();
//         // FIX: Appended city_type to the payload so it actually saves
//         formDataToSend.append("city_type", formData.city_type); 
//         formDataToSend.append("main_title", formData.main_title);
//         formDataToSend.append("main_description", formData.main_description);
//         formDataToSend.append("side_title", formData.side_title);
//         formDataToSend.append("side_description", formData.side_description);
//         formDataToSend.append("banner_title", formData.banner_title);
//         formDataToSend.append("banner_subtitle", formData.banner_subtitle);
//         formDataToSend.append("main_title_tag", formData.main_title_tag);
// formDataToSend.append("banner_title_tag", formData.banner_title_tag);
// formDataToSend.append("side_title_tag", formData.side_title_tag);
//         formDataToSend.append("banner_image_alt", (formData.banner_image_alt || "").trim());
// formDataToSend.append("location_image_alt", (formData.location_image_alt || "").trim());
// formDataToSend.append("side_image_alt", (formData.side_image_alt || "").trim());

//         if (formData.location_image) {
//             formDataToSend.append("location_image", formData.location_image);
//         }

//         if (formData.side_image) {
//             formDataToSend.append("side_image", formData.side_image);
//         }

//         if (formData.banner_image) {
//             formDataToSend.append("banner_image", formData.banner_image);
//         }

//         try {
//             // Send POST request to save form data
//             const response = await api.patch(`/cms-city/${selectedId}`, formDataToSend, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${authToken}`, // Send auth token
//                 },
//             });

//             // Handle success response
//             if (response.status === 200) {
//                 fetchContentManagerPages();
//                 toast.success("Form submitted successfully.");
//                 setFormData({
//                     city_type: "",
//                     main_title: "",
//                     main_description: "",
//                     location_image: null,
//                     side_title: "",
//                     side_description: "",
//                     side_image: null,
//                     banner_title: "",
//                     banner_subtitle: "",
//                     main_title_tag: "h2",
// banner_title_tag: "h1",
// side_title_tag: "h2",
//                     banner_image: null,
//                     banner_image_alt: "",
// location_image_alt: "",
// side_image_alt: "",
//                 });

//                 // Close modal and clear form data
//                 setTimeout(() => {
//                     document.getElementById('addNewpageModal').classList.remove('show');
//                     document.querySelector('.modal-backdrop').remove();
//                     document.body.classList.remove('modal-open');
//                     document.body.style = "";
//                 }, 1000);

//             } else {
//                 toast.error("Error submitting form. Please try again.");
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message ?? "Error submitting form. Please try again.");
//             console.error("Error:", error);
//         }
//     };

//     // Set form data when edit button is clicked
//     const handleEditClick = (item) => {
//         setSelectedId(item.id);
//         setFormData({
//             city_type: item.city_type,
//             main_title: item.main_title,
//             main_description: item.main_description,
//             location_image: null,
//             side_title: item.side_title,
//             side_description: item.side_description,
//             side_image: null,
//             banner_title: item.banner_title ?? "",
//             banner_subtitle: item.banner_subtitle ?? "",
//             banner_image: null,
//             main_title_tag: item.main_title_tag || "h2",
// banner_title_tag: item.banner_title_tag || "h1",
// side_title_tag: item.side_title_tag || "h2",
// banner_image_alt: item.banner_image_alt ?? "",
// location_image_alt: item.location_image_alt ?? "",
// side_image_alt: item.side_image_alt ?? ""
//         });
//     };

//     const setMainDescriptionData = (data) => {
//         setFormData((prevData) => ({ ...prevData, main_description: data }));
//     }

//     const setSideDescriptionData = (data) => {
//         setFormData((prevData) => ({ ...prevData, side_description: data }));
//     }

//     // const handleManageSeoContentClick = (id, item) => {
//     //     setSelectedId(id);
//     //     let schemaText = "";
//     //     if (item?.custom_schema) {
//     //         if (typeof item.custom_schema === "string") {
//     //             try { schemaText = JSON.stringify(JSON.parse(item.custom_schema), null, 2); }
//     //             catch (e) { schemaText = item.custom_schema; }
//     //         } else {
//     //             schemaText = JSON.stringify(item.custom_schema, null, 2);
//     //         }
//     //     }
//     //     setFormSeoContentData({
//     //         meta_title: item?.meta_title ?? "",
//     //         meta_description: item?.meta_description ?? "",
//     //         meta_keywords: item?.meta_keywords ?? "",
//     //         canonical_url: item?.canonical_url ?? "",
//     //         meta_robots_index: item?.meta_robots_index ?? "index",
//     //         meta_robots_follow: item?.meta_robots_follow ?? "follow",
//     //         include_in_sitemap: item?.include_in_sitemap ?? true,
//     //         sitemap_change_frequency: item?.sitemap_change_frequency ?? DEFAULT_SITEMAP_CHANGE_FREQUENCY,
//     //         sitemap_priority: String(item?.sitemap_priority ?? DEFAULT_SITEMAP_PRIORITY),
//     //         og_title: item?.og_title ?? "",
//     //         og_description: item?.og_description ?? "",
//     //         og_image: item?.og_image ?? "",
//     //         custom_schema: schemaText
//     //     });
//     // };

//     // const handleSeoContentInputChange = (e) => {
//     //     const { name, value, type, checked } = e.target;
//     //     setFormSeoContentData((prevData) => ({
//     //         ...prevData,
//     //         [name]: type === "checkbox" ? checked : value
//     //     }));
//     // };

//     // const handleSeoContentSubmit = async (e) => {
//     //     e.preventDefault();
//     //             if (formSeoContentData.meta_title.length > 60) { toast.error("Meta title must be 60 characters or less."); return; }
//     //     if (formSeoContentData.meta_description.length > 160) { toast.error("Meta description must be 160 characters or less."); return; }
//     //     if (formSeoContentData.og_title.length > 60) { toast.error("OG title must be 60 characters or less."); return; }
//     //     if (formSeoContentData.og_description.length > 200) { toast.error("OG description must be 200 characters or less."); return; }

//     //     let customSchema = null;
//     //     if (formSeoContentData.custom_schema && formSeoContentData.custom_schema.trim() !== "") {
//     //         try {
//     //             customSchema = JSON.parse(formSeoContentData.custom_schema);
//     //         } catch (err) {
//     //             toast.error("Invalid JSON in Custom Schema. Please check your formatting.");
//     //             return;
//     //         }
//     //     }

//     //     const formDataToSend = {
//     //         meta_title: formSeoContentData.meta_title,
//     //         meta_description: formSeoContentData.meta_description,
//     //         meta_keywords: formSeoContentData.meta_keywords,
//     //         canonical_url: formSeoContentData.canonical_url,
//     //         meta_robots_index: formSeoContentData.meta_robots_index,
//     //         meta_robots_follow: formSeoContentData.meta_robots_follow,
//     //         include_in_sitemap: formSeoContentData.include_in_sitemap,
//     //         sitemap_change_frequency: formSeoContentData.sitemap_change_frequency,
//     //         sitemap_priority: formSeoContentData.sitemap_priority,
//     //         og_title: formSeoContentData.og_title,
//     //         og_description: formSeoContentData.og_description,
//     //         og_image: formSeoContentData.og_image,
//     //         custom_schema: customSchema,
//     //     };

//     //     try {
//     //         // Send POST request to save form data
//     //         const response = await api.patch(`/cms-city/seo-content/${selectedId}`, formDataToSend, {
//     //             headers: {
//     //                 Authorization: `Bearer ${authToken}`, // Send auth token
//     //             },
//     //         });

//     //         // Handle success response
//     //         if (response.status === 200) {
//     //             fetchContentManagerPages();
//     //             toast.success("SEO Content saved successfully.");
//     //             // Close modal and clear form data
//     //             document.getElementById('seoContentModalClose').click();
//     //         } else {
//     //             toast.error("Error submitting form. Please try again.");
//     //         }
//     //     } catch (error) {
//     //         toast.error(error.response?.data?.message ?? "Error submitting form. Please try again.");
//     //         console.error("Error:", error);
//     //     }
//     // }

//         const normPath = (v) => {
//         let p = String(v || "").trim().toLowerCase().replace(/^https?:\/\/(www\.)?hcinterior\.in/, "").split(/[?#]/)[0];
//         if (!p.startsWith("/")) p = "/" + p;
//         if (p.length > 1) p = p.replace(/\/+$/, "");
//         return p;
//     };

//     const handleManageSeoContentClick = async (item) => {
//         setSelectedId(item.id);
//         setSeoRow(null);
//         setSeoFormData(null);

//         const path = cityUrlMap[item.city_type] || `/interior-designers-in-${item.city_type}`;
//         const p = normPath(path);
//         const keys = [p];
//         if (p.startsWith("/interior-designers-in-")) keys.push("/services-detail/" + p.replace("/interior-designers-in-", ""));

//         try {
//             const { data } = await api.get("/seo-tag", { headers: { Authorization: `Bearer ${authToken}` } });
//             // the row the website reads: newest active match, else newest match
//             const match = (Array.isArray(data) ? data : [])
//                 .filter((r) => keys.includes(normPath(r.page_name)))
//                 .sort((x, y) =>
//                     (y.status === "active") - (x.status === "active") ||
//                     new Date(y.updated_at) - new Date(x.updated_at) ||
//                     y.id - x.id)[0];
//             if (match) {
//                 setSeoRow(match);
//                 const nextStatus = !canPublish && match.status === "active" ? "inactive" : (match.status || "active");
//                 if (!canPublish && match.status === "active") {
//                     toast.info("Editing an active SEO record will save it as inactive until an admin republishes it.");
//                 }
//                 setSeoFormData({ ...match, status: nextStatus });
//                 return;
//             }
//         } catch (err) {
//             toast.error(err.response?.data?.message ?? "Could not load SEO data. Please try again.");
//             return;
//         }

//         // No seo_tag row yet: prefill from the old seo_content so nothing is lost on first save
//         const sc = item.seo_content || {};
//         let schema = null;
//         if (sc.custom_code) {
//             try { schema = JSON.parse(String(sc.custom_code).replace(/<script[^>]*>/gi, "").replace(/<\/script>/gi, "")); }
//             catch (e) { schema = null; }
//         }
//         setSeoFormData({
//             page_name: path,
//             meta_title: sc.meta_title ?? "",
//             meta_description: sc.meta_description ?? "",
//             keywords: sc.meta_keywords ?? "",
//             canonical_url: sc.canonical_url ?? "",
//             meta_robots: `${sc.meta_robots_index || "index"}, ${sc.meta_robots_follow || "follow"}`,
//             include_in_sitemap: sc.include_in_sitemap ?? true,
//             sitemap_change_frequency: sc.sitemap_change_frequency || DEFAULT_SITEMAP_CHANGE_FREQUENCY,
//             sitemap_priority: String(sc.sitemap_priority ?? DEFAULT_SITEMAP_PRIORITY),
//             custom_schema: schema,
//             status: canPublish ? "active" : "inactive",
//         });
//     };

//     const handleSeoSubmit = async (formattedData) => {
//         if ((formattedData.meta_title || "").length > 65) { toast.error("Meta title must be 65 characters or less."); return; }
//         if ((formattedData.meta_description || "").length > 160) { toast.error("Meta description must be 160 characters or less."); return; }
//         if ((formattedData.og_title || "").length > 65) { toast.error("OG title must be 65 characters or less."); return; }
//         if ((formattedData.og_description || "").length > 200) { toast.error("OG description must be 200 characters or less."); return; }

//         try {
//             if (!canPublish && formattedData.status === "active") {
//                 toast.info(getPublishWorkflowMessage("This SEO record"));
//             }
//             const headers = { Authorization: `Bearer ${authToken}` };
//             if (seoRow) {
//                 await api.patch(`/seo-tag/${seoRow.id}`, formattedData, { headers });
//             } else {
//                 await api.post("/seo-tag", formattedData, { headers });
//             }
//             toast.success("SEO saved successfully.");
//             document.getElementById("seoContentModalClose").click();
//         } catch (error) {
//             const msg = error.response?.data?.message;
//             toast.error(Array.isArray(msg) ? msg.join(", ") : msg ?? "Error saving SEO. Please try again.");
//         }
//     };

//     // Derived from existing pagesList + selectedId — no new state added.
//     const currentEditItem = pagesList.find((p) => p.id === selectedId);

//     return (
//         <AuthMainLayout>
//             <div className="container my-5">
//                 <h1 className="mb-4 text-center">CMS - City</h1>
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
//                                     <th>City Type</th>
//                                     <th>Main Title</th>
//                                     <th>Main Description</th>
//                                     <th>Location Image</th>
//                                     <th>Side Title</th>
//                                     <th>Side Description</th>
//                                     <th>Side Image</th>
//                                     <th>Banner Image</th>
//                                     <th>SEO Content</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {pagesList && pagesList?.map((item, index) => (
//                                     <tr key={item.id}>
//                                         <td>{index + 1}</td>
//                                         <td className="text-capitalize">{item.city_type}</td>
//                                         <td>{item.main_title}</td>
//                                         <td>
//                                             <span className="d-inline-block text-truncate" style={{ width: "250px" }} dangerouslySetInnerHTML={{ __html: item.main_description }}></span>
//                                         </td>
//                                         <td>
//                                             {item.location_image && <img src={item.location_image} alt={item.location_image_alt || "Location Image"}height="80" decoding="async"  loading="lazy" />}
//                                         </td>
//                                         <td>{item.side_title}</td>
//                                         <td>
//                                             <span className="d-inline-block text-truncate" style={{ width: "250px" }} dangerouslySetInnerHTML={{ __html: item.side_description }}></span>
//                                         </td>
//                                         <td>
//                                             {item.side_image && <img src={item.side_image} alt={item.side_image_alt || "Side Image"} height="80" decoding="async"  loading="lazy" />}
//                                         </td>
//                                         <td>
//                                             {item.banner_image && <img src={item.banner_image} alt={item.banner_image_alt || "Banner Image"} height="80" decoding="async" loading="lazy" />}
//                                         </td>
//                                         <td width={150}>
//                                             <button onClick={() => handleManageSeoContentClick(item)} className="btn btn-info text-nowrap" type="button" data-bs-toggle="modal" data-bs-target="#seoContentModal">SEO Content</button>
//                                         </td>
//                                         <td>
//                                             <button onClick={() => handleEditClick(item)} type="button" className="read_morebtn" data-bs-toggle="modal" data-bs-target="#addNewpageModal">
//                                                 Edit
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-focus="false">
//                 <div className="modal-dialog modal-lg">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="exampleModalLabel">Edit</h1>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <form onSubmit={handleSubmit}>
//                             <div className="modal-body row">

//                                 <div className="mb-3 col-md-12">
//                                 <label className="form-label">City Type</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="city_type"
//                                         placeholder="City Type"
//                                         value={formData.city_type}
//                                         onChange={handleInputChange}
//                                         required // FIX: Removed disabled, added required
//                                     />
//                                     <small className="text-muted">This acts as the URL slug (e.g. noida, new-delhi)</small>
//                                 </div>

//                                 <div className="mb-3 col-md-9">
//                                     <label className="form-label">Main Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="main_title"
//                                         placeholder="Main Title"
//                                         value={formData.main_title}
//                                         onChange={handleInputChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="mb-3 col-md-3">
//     <label className="form-label">Heading Tag</label>
//     <select
//         className="form-select"
//         name="main_title_tag"
//         value={formData.main_title_tag}
//         onChange={handleInputChange}
//     >
//         {HEADING_TAGS.map((t) => (
//             <option key={t} value={t}>{t.toUpperCase()}</option>
//         ))}
//     </select>
// </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Main Description</label>
//                                     <CKEditorComponent pageData={formData.main_description} setPageData={setMainDescriptionData} />
//                                 </div>

//                                 <div className="col-md-12">
//                                     <hr />
//                                     <h5 className="mb-3">Hero Banner</h5>
//                                 </div>

//                                 <div className="mb-3 col-md-9">
//                                     <label className="form-label">Banner Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="banner_title"
//                                         placeholder="Banner Title"
//                                         value={formData.banner_title}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 <div className="mb-3 col-md-3">
//     <label className="form-label">Heading Tag</label>
//     <select
//         className="form-select"
//         name="banner_title_tag"
//         value={formData.banner_title_tag}
//         onChange={handleInputChange}
//     >
//         {HEADING_TAGS.map((t) => (
//             <option key={t} value={t}>{t.toUpperCase()}</option>
//         ))}
//     </select>
// </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Banner Subtitle</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="banner_subtitle"
//                                         placeholder="Banner Subtitle"
//                                         value={formData.banner_subtitle}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Banner Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         name="banner_image"
//                                         accept="image/webp"
//                                         onChange={handleInputChange}
//                                     />
//                                     <small className="text-muted d-block">Only .webp, max 200 KB.</small>
// <input
//     type="text"
//     className="form-control mt-2"
//     name="banner_image_alt"
//     maxLength={125}
//     placeholder="Banner image alt text (for SEO)"
//     value={formData.banner_image_alt || ""}
//     onChange={handleInputChange}
// />
//                                     {currentEditItem?.banner_image && (
//                                         <div className="mt-2">
//                                             <small className="text-muted d-block">Current Banner Image:</small>
//                                             <img src={currentEditItem.banner_image} alt="Current Banner" height="80" decoding="async" loading="lazy" />
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Location Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         name="location_image"
//                                         accept="image/webp"
//                                         onChange={handleInputChange}
//                                     />
//                                     <small className="text-muted d-block">Only .webp, max 200 KB.</small>
// <input
//     type="text"
//     className="form-control mt-2"
//     name="location_image_alt"
//     maxLength={125}
//     placeholder="Location image alt text (for SEO)"
//     value={formData.location_image_alt || ""}
//     onChange={handleInputChange}
// />
//                                     {currentEditItem?.location_image && (
//                                         <div className="mt-2">
//                                             <small className="text-muted d-block">Current Location Image:</small>
//                                             <img src={currentEditItem.location_image} alt="Current Location" height="80" decoding="async" loading="lazy" />
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="mb-3 col-md-9">
//                                     <label className="form-label">Side Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="side_title"
//                                         placeholder="Side Title"
//                                         value={formData.side_title}
//                                         onChange={handleInputChange}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="mb-3 col-md-3">
//     <label className="form-label">Heading Tag</label>
//     <select
//         className="form-select"
//         name="side_title_tag"
//         value={formData.side_title_tag}
//         onChange={handleInputChange}
//     >
//         {HEADING_TAGS.map((t) => (
//             <option key={t} value={t}>{t.toUpperCase()}</option>
//         ))}
//     </select>
// </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Side Description</label>
//                                     <CKEditorComponent pageData={formData.side_description} setPageData={setSideDescriptionData} />
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Side Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         name="side_image"
//                                         accept="image/webp"
//                                         onChange={handleInputChange}
//                                     />
//                                     <small className="text-muted d-block">Only .webp, max 200 KB.</small>
// <input
//     type="text"
//     className="form-control mt-2"
//     name="side_image_alt"
//     maxLength={125}
//     placeholder="Side image alt text (for SEO)"
//     value={formData.side_image_alt || ""}
//     onChange={handleInputChange}
// />
//                                     {currentEditItem?.side_image && (
//                                         <div className="mt-2">
//                                             <small className="text-muted d-block">Current Side Image:</small>
//                                             <img src={currentEditItem.side_image} alt="Current Side" height="80" decoding="async" loading="lazy" />
//                                         </div>
//                                     )}
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

//             <div className="modal fade" id="seoContentModal" tabIndex="-1" aria-labelledby="seoContentModalLabel" aria-hidden="true">
//                 <div className="modal-dialog modal-lg">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="seoContentModalLabel">Manage SEO Content</h1>
//                             <button type="button" id="seoContentModalClose" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         {/* <form onSubmit={handleSeoContentSubmit}>
//                             <div className="modal-body row">
                                
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Meta Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="meta_title"
//                                         placeholder="Meta Title"
//                                         value={formSeoContentData?.meta_title}
//                                         onChange={handleSeoContentInputChange}
//                                         required maxLength={60}
//                                     />
//                                     <Counter value={formSeoContentData.meta_title} limit={60} />
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Meta Description</label>
//                                     <textarea
//                                         className="form-control"
//                                         name="meta_description"
//                                         placeholder="Meta Description"
//                                         value={formSeoContentData?.meta_description}
//                                         onChange={handleSeoContentInputChange}
//                                         rows="3"
//                                         required maxLength={160}
//                                     >
//                                         <Counter value={formSeoContentData.meta_description} limit={160} />
//                                     </textarea>
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Canonical URL</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="canonical_url"
//                                         placeholder="https://hcinterior.in/interior-designers-in-noida"
//                                         value={formSeoContentData?.canonical_url}
//                                         onChange={handleSeoContentInputChange}
//                                     />
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Meta Keywords</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="meta_keywords"
//                                         placeholder="Meta Keywords"
//                                         value={formSeoContentData?.meta_keywords}
//                                         onChange={handleSeoContentInputChange}
//                                     />
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//     <label className="form-label">OG Title <small className="text-muted">(social share title; blank uses Meta Title)</small></label>
//     <input type="text" className="form-control" name="og_title" value={formSeoContentData.og_title} onChange={handleSeoContentInputChange} maxLength={60} placeholder={formSeoContentData.meta_title} />
//     <Counter value={formSeoContentData.og_title} limit={60} />
// </div>
// <div className="mb-3 col-md-12">
//     <label className="form-label">OG Description <small className="text-muted">(blank uses Meta Description)</small></label>
//     <textarea className="form-control" name="og_description" rows="2" value={formSeoContentData.og_description} onChange={handleSeoContentInputChange} maxLength={200} placeholder={formSeoContentData.meta_description} />
//     <Counter value={formSeoContentData.og_description} limit={200} />
// </div>

// <div className="mb-3 col-md-12">
//     <label className="form-label">OG Image URL</label>
//     <input type="text" className="form-control" name="og_image" placeholder="https://..." value={formSeoContentData.og_image} onChange={handleSeoContentInputChange} />
//     <small className="text-muted d-block">Recommended 1200×630 px. Blank uses the city banner.</small>
//     {formSeoContentData.og_image && (
//         <img key={formSeoContentData.og_image} src={formSeoContentData.og_image} alt="OG preview" className="mt-2 border rounded"
//              style={{ maxWidth: "100%", maxHeight: 120, objectFit: "cover" }}
//              onError={(e) => (e.currentTarget.style.display = "none")} />
//     )}
// </div>
// <div className="mb-3 col-md-12">
//     <label className="form-label">Custom Schema.org (JSON Format)</label>
//     <textarea className="form-control font-monospace" name="custom_schema" rows="4" placeholder='{ "@context": "https://schema.org", "@type": "LocalBusiness" }' value={formSeoContentData.custom_schema} onChange={handleSeoContentInputChange} />
// </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Search Engine Indexing</label>
//                                     <select
//                                         className="form-control"
//                                         name="meta_robots_index"
//                                         value={formSeoContentData.meta_robots_index}
//                                         onChange={handleSeoContentInputChange}
//                                     >
//                                         <option value="index">Index</option>
//                                         <option value="noindex">No Index</option>
//                                     </select>
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Link Following</label>
//                                     <select
//                                         className="form-control"
//                                         name="meta_robots_follow"
//                                         value={formSeoContentData.meta_robots_follow}
//                                         onChange={handleSeoContentInputChange}
//                                     >
//                                         <option value="follow">Follow</option>
//                                         <option value="nofollow">No Follow</option>
//                                     </select>
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <div className="form-check form-switch bg-light rounded border p-3">
//                                         <input
//                                             className="form-check-input"
//                                             type="checkbox"
//                                             role="switch"
//                                             id="cityIncludeInSitemap"
//                                             name="include_in_sitemap"
//                                             checked={Boolean(formSeoContentData.include_in_sitemap)}
//                                             onChange={handleSeoContentInputChange}
//                                         />
//                                         <label className="form-check-label fw-bold ms-2" htmlFor="cityIncludeInSitemap">
//                                             Include this city page in sitemap.xml
//                                         </label>
//                                     </div>
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Sitemap Change Frequency</label>
//                                     <select
//                                         className="form-control"
//                                         name="sitemap_change_frequency"
//                                         value={formSeoContentData.sitemap_change_frequency}
//                                         onChange={handleSeoContentInputChange}
//                                     >
//                                         {SITEMAP_CHANGE_FREQUENCY_OPTIONS.map((option) => (
//                                             <option key={option} value={option}>
//                                                 {option.charAt(0).toUpperCase() + option.slice(1)}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Sitemap Priority</label>
//                                     <input
//                                         type="number"
//                                         className="form-control"
//                                         name="sitemap_priority"
//                                         min="0"
//                                         max="1"
//                                         step="0.1"
//                                         value={formSeoContentData.sitemap_priority}
//                                         onChange={handleSeoContentInputChange}
//                                     />
//                                 </div>

//                                 <div className="m-auto mt-2 col-12 d-flex justify-content-center">
//                                     <button className="px-5 read_morebtn" type="submit">
//                                         Save
//                                     </button>
//                                 </div>
//                             </div>
//                         </form> */}

//                         <div className="modal-body">
//     {seoFormData ? (
//         <GlobalSeoForm initialData={seoFormData} onSubmit={handleSeoSubmit} canPublish={canPublish} />
//     ) : (
//         <div className="text-center py-4">Loading...</div>
//     )}
// </div>
//                     </div>
//                 </div>
//             </div>
//         </AuthMainLayout>
//     );
// };

// export default CmsCity;



// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { useSelector } from "react-redux";
// import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
// import api from "@/utils/api";
// import { toast } from "react-toastify";
// import dynamic from "next/dynamic";
// import {
//     DEFAULT_SITEMAP_CHANGE_FREQUENCY,
//     DEFAULT_SITEMAP_PRIORITY,
//     SITEMAP_CHANGE_FREQUENCY_OPTIONS
// } from "@/utils/seoHelpers";

// import GlobalSeoForm from "@/app/components/GlobalSeoForm";
// import { getCmsAccess, getPublishWorkflowMessage } from "@/utils/cmsAccess";
// import { cityUrlMap } from "@/utils/cityRoutes";

// import SectionOrderManager, {
//     DEFAULT_SECTION_ORDER_STATE,
//     normalizeOrder,
// } from "@/app/components/SectionOrderManager";

// const CKEditorComponent = dynamic(() => import('@/app/components/CKEditorComponent'), { ssr: false });

// const Counter = ({ value = "", limit }) => (
//     <small className={value.length > limit ? "text-danger" : value.length >= limit - 10 ? "text-warning" : "text-muted"}>
//         {value.length}/{limit} characters
//     </small>
// );
// const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

// const MAX_IMAGE_BYTES = 200 * 1024;
// const validateImage = (file) => {
//     if (file.type !== "image/webp") {
//         toast.error("Only .webp images are allowed.");
//         return false;
//     }
//     if (file.size > MAX_IMAGE_BYTES) {
//         toast.error(`Image must be 200 KB or smaller (selected: ${Math.round(file.size / 1024)} KB).`);
//         return false;
//     }
//     return true;
// };

// const DEFAULT_PROMISE_ITEMS = [
//     { title: "Transparent Pricing", description: "No hidden costs, ever." },
//     { title: "In-House Execution", description: "No third-party contractors involved." },
// ];

// const parseSettingsObject = (value) => {
//     if (!value) return {};
//     if (typeof value === "object" && !Array.isArray(value)) return value;
//     try {
//         const parsed = JSON.parse(value);
//         return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
//     } catch { return {}; }
// };

// const niceCityName = (value) => String(value || "").replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
// const defaultServiceAreaText = () => Object.entries(cityUrlMap).map(([slug, url]) => `${niceCityName(slug)}|${url}`).join("\n");
// const defaultNearbyCityText = (currentCity = "") => Object.entries(cityUrlMap)
//     .filter(([slug]) => slug !== currentCity)
//     .slice(0, 3)
//     .map(([slug, url]) => `${niceCityName(slug)}|${url}|`)
//     .join("\n");

// const linesToEntries = (text, includeImage = false) => String(text || "")
//     .split(/\r?\n/)
//     .map((line) => line.split("|").map((part) => part.trim()))
//     .filter((parts) => parts[0] && parts[1] && parts[1].startsWith("/") && !parts[1].startsWith("//"))
//     .map((parts) => ({ name: parts[0], url: parts[1], ...(includeImage ? { image: parts[2] || "" } : {}) }));

// const settingsFromItem = (item) => {
//     const settings = parseSettingsObject(item?.city_settings ?? item?.city_settings_json);
//     const promises = Array.isArray(settings.promiseItems) && settings.promiseItems.length
//         ? settings.promiseItems
//         : DEFAULT_PROMISE_ITEMS;
//     const photos = Array.isArray(settings.projectImages) ? settings.projectImages : [];
//     return {
//         siteVisitTitle: settings.siteVisit?.title || settings.siteVisitTitle || "Book a Site Visit",
//         siteVisitDescription: settings.siteVisit?.description || settings.siteVisitDescription || "Expert designers will visit your {city} property.",
//         siteVisitButtonText: settings.siteVisit?.buttonText || settings.siteVisitButtonText || "Schedule Now",
//         siteVisitButtonUrl: settings.siteVisit?.buttonUrl || settings.siteVisitButtonUrl || "/contact",
//         promiseTitle: settings.promiseTitle || "The Promise",
//         promiseItems: promises.map((item, index) => ({
//             title: item?.title || DEFAULT_PROMISE_ITEMS[index]?.title || "",
//             description: item?.description || DEFAULT_PROMISE_ITEMS[index]?.description || "",
//         })).slice(0, 4),
//         serviceAreasTitle: settings.serviceAreasTitle || "Service Areas",
//         nearbyCitiesTitle: settings.nearbyCitiesTitle || "Nearby Cities",
//         serviceAreasText: Array.isArray(settings.serviceAreas) && settings.serviceAreas.length
//             ? settings.serviceAreas.map((entry) => `${entry.name || entry.title || ""}|${entry.url || entry.href || ""}`).join("\n")
//             : defaultServiceAreaText(),
//         nearbyCitiesText: Array.isArray(settings.nearbyCities) && settings.nearbyCities.length
//             ? settings.nearbyCities.map((entry) => `${entry.name || entry.title || ""}|${entry.url || entry.href || ""}|${entry.image || entry.imageUrl || ""}`).join("\n")
//             : defaultNearbyCityText(item?.city_type || ""),
//         projectAlts: Array.from({ length: 6 }, (_, index) => photos[index]?.alt || item?.[`project_image_${index + 1}_alt`] || ""),
//         projectImages: photos,
//         designInspirationBlogIds: Array.isArray(settings.designInspirationBlogIds)
//             ? settings.designInspirationBlogIds.map((id) => String(id))
//             : [],
//     };
// };

// const CmsCity = () => {

//     const authToken = useSelector((state) => state.auth.authToken);
//     const user = useSelector((state) => state.auth.user);
//     const { canPublish } = getCmsAccess(user);
//     const [pagesList, setPagesList] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         city_type: "",
//         main_title: "",
//         main_description: "",
//         location_image: null,
//         side_title: "",
//         side_description: "",
//         side_image: null,
//         banner_title: "",
//         banner_subtitle: "",
//         banner_image: null,
//         mobile_banner_image: null,
//         project_image_1: null,
//         project_image_2: null,
//         project_image_3: null,
//         project_image_4: null,
//         project_image_5: null,
//         project_image_6: null,
//         main_title_tag: "h2",
// banner_title_tag: "h1",
// side_title_tag: "h2",
//         banner_image_alt: "",
// location_image_alt: "",
// side_image_alt: "",
//     });
//     // const [formSeoContentData, setFormSeoContentData] = useState({
//     //     meta_title: "",
//     //     meta_description: "",
//     //     meta_keywords: "",
//     //     canonical_url: "",
//     //     meta_robots_index: "index",
//     //     meta_robots_follow: "follow",
//     //     include_in_sitemap: true,
//     //     sitemap_change_frequency: DEFAULT_SITEMAP_CHANGE_FREQUENCY,
//     //     sitemap_priority: String(DEFAULT_SITEMAP_PRIORITY),
//     //     og_title: "",
//     //     og_description: "",
//     //     og_image: "",
//     //     custom_schema: ""
//     // });

//     const [seoRow, setSeoRow] = useState(null);           // existing seo_tag row (null = will be created)
//     const [seoFormData, setSeoFormData] = useState(null);  // data handed to GlobalSeoForm
//     const [selectedId, setSelectedId] = useState(null);
//     const [blogsList, setBlogsList] = useState([]);
//     const [selectedBlogIds, setSelectedBlogIds] = useState([]);
//     const [citySettings, setCitySettings] = useState({
//         siteVisitTitle: "Book a Site Visit",
//         siteVisitDescription: "Expert designers will visit your {city} property.",
//         siteVisitButtonText: "Schedule Now",
//         siteVisitButtonUrl: "/contact",
//         promiseTitle: "The Promise",
//         promiseItems: DEFAULT_PROMISE_ITEMS,
//         serviceAreasTitle: "Service Areas",
//         nearbyCitiesTitle: "Nearby Cities",
//         serviceAreasText: defaultServiceAreaText(),
//         nearbyCitiesText: defaultNearbyCityText(),
//         projectAlts: Array(6).fill(""),
//         projectImages: [],
//     });

//     const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER_STATE);
//     const fetchContentManagerPages = useCallback(async () => {
//         try {
//             const response = await api.get("/cms-city", {
//                 headers: {
//                     Authorization: `Bearer ${authToken}`, // Send auth token
//                 },
//             });

//             setPagesList(Array.isArray(response.data) ? response.data : []);
//             if (!Array.isArray(response.data) && response.data?.id) setSelectedId(response.data.id);
//             try {
//                 const blogResponse = await api.get("/cms-blog", {
//                     headers: { Authorization: `Bearer ${authToken}` },
//                 });
//                 setBlogsList(Array.isArray(blogResponse.data) ? blogResponse.data : []);
//             } catch {
//                 setBlogsList([]);
//             }
//             setLoading(false);

//         } catch (err) {
//             toast.error(err.response?.data?.message ?? "Error fetching data. Please try again.");
//             setLoading(false);
//         }
//     }, [authToken]);

//     useEffect(() => {
//         fetchContentManagerPages();
//     }, [fetchContentManagerPages]);

//     const getCityMediaPreview = (cityType, slot) => {
//         const item = pagesList.find((page) => String(page.city_type).toLowerCase() === String(cityType || "").toLowerCase());
//         if (!item) return "";
//         if (slot === "mobile_banner") return item.mobile_banner_image || "";
//         const projectMatch = /^project_(\d+)$/.exec(String(slot || ""));
//         return projectMatch ? (item[`project_image_${projectMatch[1]}`] || "") : "";
//     };

//     // Handle input change for text fields and image
//     const handleInputChange = (e) => {
//         const { name, value, files } = e.target;
//         const isImageUpload = ["location_image", "side_image", "banner_image", "mobile_banner_image"].includes(name)
//             || /^project_image_[1-6]$/.test(name);
//         if (isImageUpload && files?.length > 0) {
//             if (!validateImage(files[0])) {
//                 e.target.value = "";
//                 return;
//             }
//             setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
//         } else {
//             setFormData((prevData) => ({ ...prevData, [name]: value }));
//         }
//     };

//     const updateCitySetting = (name, value) => {
//         setCitySettings((previous) => ({ ...previous, [name]: value }));
//     };

//     const updatePromiseItem = (index, key, value) => {
//         setCitySettings((previous) => ({
//             ...previous,
//             promiseItems: previous.promiseItems.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
//         }));
//     };

//     const toggleBlogSelection = (blogId) => {
//         const id = String(blogId);
//         setSelectedBlogIds((previous) => previous.includes(id)
//             ? previous.filter((selected) => selected !== id)
//             : (previous.length >= 6 ? previous : [...previous, id]));
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
       
//         const formDataToSend = new FormData();
//         const nextCitySettings = {
//             siteVisit: {
//                 title: citySettings.siteVisitTitle,
//                 description: citySettings.siteVisitDescription,
//                 buttonText: citySettings.siteVisitButtonText,
//                 buttonUrl: citySettings.siteVisitButtonUrl,
//             },
//             sectionOrder: {
//     desktop: normalizeOrder(sectionOrder.desktop),
//     mobile: normalizeOrder(sectionOrder.mobile),
// },
//             promiseTitle: citySettings.promiseTitle,
//             promiseItems: citySettings.promiseItems,
//             serviceAreasTitle: citySettings.serviceAreasTitle,
//             serviceAreas: linesToEntries(citySettings.serviceAreasText, false),
//             nearbyCitiesTitle: citySettings.nearbyCitiesTitle,
//             nearbyCities: linesToEntries(citySettings.nearbyCitiesText, true),
//             designInspirationBlogIds: selectedBlogIds,
//         };
//         formDataToSend.append("city_settings", JSON.stringify(nextCitySettings));
//         // FIX: Appended city_type to the payload so it actually saves
//         formDataToSend.append("city_type", formData.city_type); 
//         formDataToSend.append("main_title", formData.main_title);
//         formDataToSend.append("main_description", formData.main_description);
//         formDataToSend.append("side_title", formData.side_title);
//         formDataToSend.append("side_description", formData.side_description);
//         formDataToSend.append("banner_title", formData.banner_title);
//         formDataToSend.append("banner_subtitle", formData.banner_subtitle);
//         formDataToSend.append("main_title_tag", formData.main_title_tag);
// formDataToSend.append("banner_title_tag", formData.banner_title_tag);
// formDataToSend.append("side_title_tag", formData.side_title_tag);
//         formDataToSend.append("banner_image_alt", (formData.banner_image_alt || "").trim());
// formDataToSend.append("location_image_alt", (formData.location_image_alt || "").trim());
// formDataToSend.append("side_image_alt", (formData.side_image_alt || "").trim());

//         if (formData.location_image) {
//             formDataToSend.append("location_image", formData.location_image);
//         }

//         if (formData.side_image) {
//             formDataToSend.append("side_image", formData.side_image);
//         }

//         if (formData.banner_image) {
//             formDataToSend.append("banner_image", formData.banner_image);
//         }
//         if (formData.mobile_banner_image) {
//             formDataToSend.append("mobile_banner_image", formData.mobile_banner_image);
//         }
//         for (let index = 0; index < 6; index += 1) {
//             const fieldName = `project_image_${index + 1}`;
//             if (formData[fieldName]) {
//                 formDataToSend.append(fieldName, formData[fieldName]);
//             }
//             formDataToSend.append(
//                 `${fieldName}_alt`,
//                 String(citySettings.projectAlts[index] || "").trim(),
//             );
//         }
//         try {
//             // Send POST request to save form data
//             const response = await api.patch(`/cms-city/${selectedId}`, formDataToSend, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${authToken}`, // Send auth token
//                 },
//             });

//             // Handle success response
//             if (response.status === 200) {
//                 await fetchContentManagerPages();
//                 toast.success("City page saved successfully.");
//                 setFormData({
//                     city_type: "",
//                     main_title: "",
//                     main_description: "",
//                     location_image: null,
//                     side_title: "",
//                     side_description: "",
//                     side_image: null,
//                     banner_title: "",
//                     banner_subtitle: "",
//                     main_title_tag: "h2",
// banner_title_tag: "h1",
// side_title_tag: "h2",
//                     banner_image: null,
//                     mobile_banner_image: null,
//                     project_image_1: null,
//                     project_image_2: null,
//                     project_image_3: null,
//                     project_image_4: null,
//                     project_image_5: null,
//                     project_image_6: null,
//                     banner_image_alt: "",
//                     location_image_alt: "",
//                     side_image_alt: "",
//                 });
//                 setCitySettings({
//                     siteVisitTitle: "Book a Site Visit",
//                     siteVisitDescription: "Expert designers will visit your {city} property.",
//                     siteVisitButtonText: "Schedule Now",
//                     siteVisitButtonUrl: "/contact",
//                     promiseTitle: "The Promise",
//                     promiseItems: DEFAULT_PROMISE_ITEMS,
//                     serviceAreasTitle: "Service Areas",
//                     nearbyCitiesTitle: "Nearby Cities",
//                     serviceAreasText: defaultServiceAreaText(),
//                     nearbyCitiesText: defaultNearbyCityText(),
//                     projectAlts: Array(6).fill(""),
//                     projectImages: [],
//                 });
//                 setSelectedBlogIds([]);
//                 setSectionOrder(DEFAULT_SECTION_ORDER_STATE);

//                 // Close modal and clear form data
//                 setTimeout(() => {
//                     document.getElementById('addNewpageModal').classList.remove('show');
//                     document.querySelector('.modal-backdrop').remove();
//                     document.body.classList.remove('modal-open');
//                     document.body.style = "";
//                 }, 1000);

//             } else {
//                 toast.error("Error submitting form. Please try again.");
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message ?? "Error submitting form. Please try again.");
//             console.error("Error:", error);
//         }
//     };

//     // Set form data when edit button is clicked
//     const handleEditClick = (item) => {
//         setSelectedId(item.id);
//         setFormData({
//             city_type: item.city_type,
//             main_title: item.main_title,
//             main_description: item.main_description,
//             location_image: null,
//             side_title: item.side_title,
//             side_description: item.side_description,
//             side_image: null,
//             banner_title: item.banner_title ?? "",
//             banner_subtitle: item.banner_subtitle ?? "",
//             banner_image: null,
//             mobile_banner_image: null,
//             project_image_1: null,
//             project_image_2: null,
//             project_image_3: null,
//             project_image_4: null,
//             project_image_5: null,
//             project_image_6: null,
//             main_title_tag: item.main_title_tag || "h2",
// banner_title_tag: item.banner_title_tag || "h1",
// side_title_tag: item.side_title_tag || "h2",
// banner_image_alt: item.banner_image_alt ?? "",
// location_image_alt: item.location_image_alt ?? "",
// side_image_alt: item.side_image_alt ?? ""
//         });
//         const itemSettings = item.city_settings ?? item.city_settings_json;
//         const hydratedSettings = settingsFromItem({ ...item, city_settings: itemSettings });
//         const projectMediaAlts = Array.from({ length: 6 }, (_, index) =>
//             item?.[`project_image_${index + 1}_alt`] || hydratedSettings.projectAlts[index] || ""
//         );
//         setCitySettings({
//             siteVisitTitle: hydratedSettings.siteVisitTitle,
//             siteVisitDescription: hydratedSettings.siteVisitDescription,
//             siteVisitButtonText: hydratedSettings.siteVisitButtonText,
//             siteVisitButtonUrl: hydratedSettings.siteVisitButtonUrl,
//             promiseTitle: hydratedSettings.promiseTitle,
//             promiseItems: hydratedSettings.promiseItems,
//             serviceAreasTitle: hydratedSettings.serviceAreasTitle,
//             nearbyCitiesTitle: hydratedSettings.nearbyCitiesTitle,
//             serviceAreasText: hydratedSettings.serviceAreasText,
//             nearbyCitiesText: hydratedSettings.nearbyCitiesText,
//             projectAlts: projectMediaAlts,
//             projectImages: hydratedSettings.projectImages,
//         });
//         const selectedIds = Array.isArray(parseSettingsObject(itemSettings).designInspirationBlogIds)
//             ? parseSettingsObject(itemSettings).designInspirationBlogIds.map((id) => String(id))
//             : hydratedSettings.designInspirationBlogIds;
//         setSelectedBlogIds(selectedIds.length ? selectedIds : blogsList.slice(0, 4).map((blog) => String(blog.id)));

//         const savedOrder = parseSettingsObject(itemSettings).sectionOrder || {};
// setSectionOrder({
//     desktop: normalizeOrder(savedOrder.desktop),
//     mobile: normalizeOrder(savedOrder.mobile),
// });
        
//     };

//     const setMainDescriptionData = (data) => {
//         setFormData((prevData) => ({ ...prevData, main_description: data }));
//     }

//     const setSideDescriptionData = (data) => {
//         setFormData((prevData) => ({ ...prevData, side_description: data }));
//     }

//     // const handleManageSeoContentClick = (id, item) => {
//     //     setSelectedId(id);
//     //     let schemaText = "";
//     //     if (item?.custom_schema) {
//     //         if (typeof item.custom_schema === "string") {
//     //             try { schemaText = JSON.stringify(JSON.parse(item.custom_schema), null, 2); }
//     //             catch (e) { schemaText = item.custom_schema; }
//     //         } else {
//     //             schemaText = JSON.stringify(item.custom_schema, null, 2);
//     //         }
//     //     }
//     //     setFormSeoContentData({
//     //         meta_title: item?.meta_title ?? "",
//     //         meta_description: item?.meta_description ?? "",
//     //         meta_keywords: item?.meta_keywords ?? "",
//     //         canonical_url: item?.canonical_url ?? "",
//     //         meta_robots_index: item?.meta_robots_index ?? "index",
//     //         meta_robots_follow: item?.meta_robots_follow ?? "follow",
//     //         include_in_sitemap: item?.include_in_sitemap ?? true,
//     //         sitemap_change_frequency: item?.sitemap_change_frequency ?? DEFAULT_SITEMAP_CHANGE_FREQUENCY,
//     //         sitemap_priority: String(item?.sitemap_priority ?? DEFAULT_SITEMAP_PRIORITY),
//     //         og_title: item?.og_title ?? "",
//     //         og_description: item?.og_description ?? "",
//     //         og_image: item?.og_image ?? "",
//     //         custom_schema: schemaText
//     //     });
//     // };

//     // const handleSeoContentInputChange = (e) => {
//     //     const { name, value, type, checked } = e.target;
//     //     setFormSeoContentData((prevData) => ({
//     //         ...prevData,
//     //         [name]: type === "checkbox" ? checked : value
//     //     }));
//     // };

//     // const handleSeoContentSubmit = async (e) => {
//     //     e.preventDefault();
//     //             if (formSeoContentData.meta_title.length > 60) { toast.error("Meta title must be 60 characters or less."); return; }
//     //     if (formSeoContentData.meta_description.length > 160) { toast.error("Meta description must be 160 characters or less."); return; }
//     //     if (formSeoContentData.og_title.length > 60) { toast.error("OG title must be 60 characters or less."); return; }
//     //     if (formSeoContentData.og_description.length > 200) { toast.error("OG description must be 200 characters or less."); return; }

//     //     let customSchema = null;
//     //     if (formSeoContentData.custom_schema && formSeoContentData.custom_schema.trim() !== "") {
//     //         try {
//     //             customSchema = JSON.parse(formSeoContentData.custom_schema);
//     //         } catch (err) {
//     //             toast.error("Invalid JSON in Custom Schema. Please check your formatting.");
//     //             return;
//     //         }
//     //     }

//     //     const formDataToSend = {
//     //         meta_title: formSeoContentData.meta_title,
//     //         meta_description: formSeoContentData.meta_description,
//     //         meta_keywords: formSeoContentData.meta_keywords,
//     //         canonical_url: formSeoContentData.canonical_url,
//     //         meta_robots_index: formSeoContentData.meta_robots_index,
//     //         meta_robots_follow: formSeoContentData.meta_robots_follow,
//     //         include_in_sitemap: formSeoContentData.include_in_sitemap,
//     //         sitemap_change_frequency: formSeoContentData.sitemap_change_frequency,
//     //         sitemap_priority: formSeoContentData.sitemap_priority,
//     //         og_title: formSeoContentData.og_title,
//     //         og_description: formSeoContentData.og_description,
//     //         og_image: formSeoContentData.og_image,
//     //         custom_schema: customSchema,
//     //     };

//     //     try {
//     //         // Send POST request to save form data
//     //         const response = await api.patch(`/cms-city/seo-content/${selectedId}`, formDataToSend, {
//     //             headers: {
//     //                 Authorization: `Bearer ${authToken}`, // Send auth token
//     //             },
//     //         });

//     //         // Handle success response
//     //         if (response.status === 200) {
//     //             fetchContentManagerPages();
//     //             toast.success("SEO Content saved successfully.");
//     //             // Close modal and clear form data
//     //             document.getElementById('seoContentModalClose').click();
//     //         } else {
//     //             toast.error("Error submitting form. Please try again.");
//     //         }
//     //     } catch (error) {
//     //         toast.error(error.response?.data?.message ?? "Error submitting form. Please try again.");
//     //         console.error("Error:", error);
//     //     }
//     // }

//         const normPath = (v) => {
//         let p = String(v || "").trim().toLowerCase().replace(/^https?:\/\/(www\.)?hcinterior\.in/, "").split(/[?#]/)[0];
//         if (!p.startsWith("/")) p = "/" + p;
//         if (p.length > 1) p = p.replace(/\/+$/, "");
//         return p;
//     };

//     const handleManageSeoContentClick = async (item) => {
//         setSelectedId(item.id);
//         setSeoRow(null);
//         setSeoFormData(null);

//         const path = cityUrlMap[item.city_type] || `/interior-designers-in-${item.city_type}`;
//         const p = normPath(path);
//         const keys = [p];
//         if (p.startsWith("/interior-designers-in-")) keys.push("/services-detail/" + p.replace("/interior-designers-in-", ""));

//         try {
//             const { data } = await api.get("/seo-tag", { headers: { Authorization: `Bearer ${authToken}` } });
//             // the row the website reads: newest active match, else newest match
//             const match = (Array.isArray(data) ? data : [])
//                 .filter((r) => keys.includes(normPath(r.page_name)))
//                 .sort((x, y) =>
//                     (y.status === "active") - (x.status === "active") ||
//                     new Date(y.updated_at) - new Date(x.updated_at) ||
//                     y.id - x.id)[0];
//             if (match) {
//                 setSeoRow(match);
//                 const nextStatus = !canPublish && match.status === "active" ? "inactive" : (match.status || "active");
//                 if (!canPublish && match.status === "active") {
//                     toast.info("Editing an active SEO record will save it as inactive until an admin republishes it.");
//                 }
//                 setSeoFormData({ ...match, status: nextStatus });
//                 return;
//             }
//         } catch (err) {
//             toast.error(err.response?.data?.message ?? "Could not load SEO data. Please try again.");
//             return;
//         }

//         // No seo_tag row yet: prefill from the old seo_content so nothing is lost on first save
//         const sc = item.seo_content || {};
//         let schema = null;
//         if (sc.custom_code) {
//             try { schema = JSON.parse(String(sc.custom_code).replace(/<script[^>]*>/gi, "").replace(/<\/script>/gi, "")); }
//             catch (e) { schema = null; }
//         }
//         setSeoFormData({
//             page_name: path,
//             meta_title: sc.meta_title ?? "",
//             meta_description: sc.meta_description ?? "",
//             keywords: sc.meta_keywords ?? "",
//             canonical_url: sc.canonical_url ?? "",
//             meta_robots: `${sc.meta_robots_index || "index"}, ${sc.meta_robots_follow || "follow"}`,
//             include_in_sitemap: sc.include_in_sitemap ?? true,
//             sitemap_change_frequency: sc.sitemap_change_frequency || DEFAULT_SITEMAP_CHANGE_FREQUENCY,
//             sitemap_priority: String(sc.sitemap_priority ?? DEFAULT_SITEMAP_PRIORITY),
//             custom_schema: schema,
//             status: canPublish ? "active" : "inactive",
//         });
//     };

//     const handleSeoSubmit = async (formattedData) => {
//         if ((formattedData.meta_title || "").length > 65) { toast.error("Meta title must be 65 characters or less."); return; }
//         if ((formattedData.meta_description || "").length > 160) { toast.error("Meta description must be 160 characters or less."); return; }
//         if ((formattedData.og_title || "").length > 65) { toast.error("OG title must be 65 characters or less."); return; }
//         if ((formattedData.og_description || "").length > 200) { toast.error("OG description must be 200 characters or less."); return; }

//         try {
//             if (!canPublish && formattedData.status === "active") {
//                 toast.info(getPublishWorkflowMessage("This SEO record"));
//             }
//             const headers = { Authorization: `Bearer ${authToken}` };
//             if (seoRow) {
//                 await api.patch(`/seo-tag/${seoRow.id}`, formattedData, { headers });
//             } else {
//                 await api.post("/seo-tag", formattedData, { headers });
//             }
//             toast.success("SEO saved successfully.");
//             document.getElementById("seoContentModalClose").click();
//         } catch (error) {
//             const msg = error.response?.data?.message;
//             toast.error(Array.isArray(msg) ? msg.join(", ") : msg ?? "Error saving SEO. Please try again.");
//         }
//     };

//     // Derived from existing pagesList + selectedId — no new state added.
//     const currentEditItem = pagesList.find((p) => p.id === selectedId);

//     return (
//         <AuthMainLayout>
//             <div className="container my-5">
//                 <h1 className="mb-4 text-center">CMS - City</h1>
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
//                                     <th>City Type</th>
//                                     <th>Main Title</th>
//                                     <th>Main Description</th>
//                                     <th>Location Image</th>
//                                     <th>Side Title</th>
//                                     <th>Side Description</th>
//                                     <th>Side Image</th>
//                                     <th>Banner Image</th>
//                                     <th>SEO Content</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {pagesList && pagesList?.map((item, index) => (
//                                     <tr key={item.id}>
//                                         <td>{index + 1}</td>
//                                         <td className="text-capitalize">{item.city_type}</td>
//                                         <td>{item.main_title}</td>
//                                         <td>
//                                             <span className="d-inline-block text-truncate" style={{ width: "250px" }} dangerouslySetInnerHTML={{ __html: item.main_description }}></span>
//                                         </td>
//                                         <td>
//                                             {item.location_image && <img src={item.location_image} alt={item.location_image_alt || "Location Image"}height="80" decoding="async"  loading="lazy" />}
//                                         </td>
//                                         <td>{item.side_title}</td>
//                                         <td>
//                                             <span className="d-inline-block text-truncate" style={{ width: "250px" }} dangerouslySetInnerHTML={{ __html: item.side_description }}></span>
//                                         </td>
//                                         <td>
//                                             {item.side_image && <img src={item.side_image} alt={item.side_image_alt || "Side Image"} height="80" decoding="async"  loading="lazy" />}
//                                         </td>
//                                         <td>
//                                             {item.banner_image && <img src={item.banner_image} alt={item.banner_image_alt || "Banner Image"} height="80" decoding="async" loading="lazy" />}
//                                         </td>
//                                         <td width={150}>
//                                             <button onClick={() => handleManageSeoContentClick(item)} className="btn btn-info text-nowrap" type="button" data-bs-toggle="modal" data-bs-target="#seoContentModal">SEO Content</button>
//                                         </td>
//                                         <td>
//                                             <button onClick={() => handleEditClick(item)} type="button" className="read_morebtn" data-bs-toggle="modal" data-bs-target="#addNewpageModal">
//                                                 Edit
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-focus="false">
//                 <div className="modal-dialog modal-lg">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="exampleModalLabel">Edit</h1>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <form onSubmit={handleSubmit}>
//                             <div className="modal-body row">

//                                 <div className="mb-3 col-md-12">
//                                 <label className="form-label">City Type</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="city_type"
//                                         placeholder="City Type"
//                                         value={formData.city_type}
//                                         onChange={handleInputChange}
//                                         required // FIX: Removed disabled, added required
//                                     />
//                                     <small className="text-muted">This acts as the URL slug (e.g. noida, new-delhi)</small>
//                                 </div>

//                                 <div className="mb-3 col-md-9">
//                                     <label className="form-label">Main Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="main_title"
//                                         placeholder="Main Title"
//                                         value={formData.main_title}
//                                         onChange={handleInputChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="mb-3 col-md-3">
//     <label className="form-label">Heading Tag</label>
//     <select
//         className="form-select"
//         name="main_title_tag"
//         value={formData.main_title_tag}
//         onChange={handleInputChange}
//     >
//         {HEADING_TAGS.map((t) => (
//             <option key={t} value={t}>{t.toUpperCase()}</option>
//         ))}
//     </select>
// </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Main Description</label>
//                                     <CKEditorComponent pageData={formData.main_description} setPageData={setMainDescriptionData} />
//                                 </div>

//                                 <div className="col-md-12">
//                                     <hr />
//                                     <h5 className="mb-3">Hero Banner</h5>
//                                 </div>

//                                 <div className="mb-3 col-md-9">
//                                     <label className="form-label">Banner Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="banner_title"
//                                         placeholder="Banner Title"
//                                         value={formData.banner_title}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 <div className="mb-3 col-md-3">
//     <label className="form-label">Heading Tag</label>
//     <select
//         className="form-select"
//         name="banner_title_tag"
//         value={formData.banner_title_tag}
//         onChange={handleInputChange}
//     >
//         {HEADING_TAGS.map((t) => (
//             <option key={t} value={t}>{t.toUpperCase()}</option>
//         ))}
//     </select>
// </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Banner Subtitle</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="banner_subtitle"
//                                         placeholder="Banner Subtitle"
//                                         value={formData.banner_subtitle}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Banner Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         name="banner_image"
//                                         accept="image/webp"
//                                         onChange={handleInputChange}
//                                     />
//                                     <small className="text-muted d-block">Only .webp, max 200 KB.</small>
// <input
//     type="text"
//     className="form-control mt-2"
//     name="banner_image_alt"
//     maxLength={125}
//     placeholder="Banner image alt text (for SEO)"
//     value={formData.banner_image_alt || ""}
//     onChange={handleInputChange}
// />
//                                     {currentEditItem?.banner_image && (
//                                         <div className="mt-2">
//                                             <small className="text-muted d-block">Current Banner Image:</small>
//                                             <img src={currentEditItem.banner_image} alt="Current Banner" height="80" decoding="async" loading="lazy" />
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Mobile Hero Banner (optional)</label>
//                                     <input type="file" className="form-control" name="mobile_banner_image" accept="image/webp" onChange={handleInputChange} />
//                                     <small className="text-muted d-block">Upload a mobile-specific WebP banner, max 200 KB. It uses the same Banner Image Alt Text above.</small>
//                                     {getCityMediaPreview(formData.city_type, "mobile_banner") && (
//                                         <div className="mt-2">
//                                             <small className="text-muted d-block">Current Mobile Banner:</small>
//                                             <img src={getCityMediaPreview(formData.city_type, "mobile_banner")} alt={formData.banner_image_alt || "Current mobile hero banner"} height="100" style={{ maxWidth: "180px", objectFit: "cover" }} decoding="async" loading="lazy" />
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Location Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         name="location_image"
//                                         accept="image/webp"
//                                         onChange={handleInputChange}
//                                     />
//                                     <small className="text-muted d-block">Only .webp, max 200 KB.</small>
// <input
//     type="text"
//     className="form-control mt-2"
//     name="location_image_alt"
//     maxLength={125}
//     placeholder="Location image alt text (for SEO)"
//     value={formData.location_image_alt || ""}
//     onChange={handleInputChange}
// />
//                                     {currentEditItem?.location_image && (
//                                         <div className="mt-2">
//                                             <small className="text-muted d-block">Current Location Image:</small>
//                                             <img src={currentEditItem.location_image} alt="Current Location" height="80" decoding="async" loading="lazy" />
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="mb-3 col-md-9">
//                                     <label className="form-label">Side Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="side_title"
//                                         placeholder="Side Title"
//                                         value={formData.side_title}
//                                         onChange={handleInputChange}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="mb-3 col-md-3">
//     <label className="form-label">Heading Tag</label>
//     <select
//         className="form-select"
//         name="side_title_tag"
//         value={formData.side_title_tag}
//         onChange={handleInputChange}
//     >
//         {HEADING_TAGS.map((t) => (
//             <option key={t} value={t}>{t.toUpperCase()}</option>
//         ))}
//     </select>
// </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Side Description</label>
//                                     <CKEditorComponent pageData={formData.side_description} setPageData={setSideDescriptionData} />
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Side Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         name="side_image"
//                                         accept="image/webp"
//                                         onChange={handleInputChange}
//                                     />
//                                     <small className="text-muted d-block">Only .webp, max 200 KB.</small>
// <input
//     type="text"
//     className="form-control mt-2"
//     name="side_image_alt"
//     maxLength={125}
//     placeholder="Side image alt text (for SEO)"
//     value={formData.side_image_alt || ""}
//     onChange={handleInputChange}
// />
//                                     {currentEditItem?.side_image && (
//                                         <div className="mt-2">
//                                             <small className="text-muted d-block">Current Side Image:</small>
//                                             <img src={currentEditItem.side_image} alt="Current Side" height="80" decoding="async" loading="lazy" />
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="col-12"><hr /><h5 className="mb-2">Large City Project Photos</h5><p className="text-muted small">Add up to six large project photos. Each image must be WebP and 200 KB or smaller. Blank fields keep the previously uploaded photo.</p></div>
//                                 {Array.from({ length: 6 }, (_, index) => {
//                                     const fieldName = `project_image_${index + 1}`;
//                                     const existingImage = getCityMediaPreview(formData.city_type, `project_${index + 1}`);
//                                     return (
//                                         <div className="mb-3 col-md-6" key={fieldName}>
//                                             <label className="form-label">Project Photo {index + 1}</label>
//                                             <input type="file" className="form-control" name={fieldName} accept="image/webp" onChange={handleInputChange} />
//                                             <input type="text" className="form-control mt-2" maxLength={125} placeholder={`Project photo ${index + 1} alt text`} value={citySettings.projectAlts[index] || ""} onChange={(event) => setCitySettings((previous) => ({ ...previous, projectAlts: previous.projectAlts.map((value, itemIndex) => itemIndex === index ? event.target.value : value) }))} />
//                                             {existingImage && <img src={existingImage} alt={citySettings.projectAlts[index] || `Current project photo ${index + 1}`} className="mt-2 rounded border" style={{ maxWidth: "100%", maxHeight: "110px", objectFit: "cover" }} decoding="async" loading="lazy" />}
//                                         </div>
//                                     );
//                                 })}

//                                 <div className="col-12"><hr /><h5 className="mb-2">Design Inspiration Blogs</h5><p className="text-muted small">Choose up to six blogs for this city's Design Inspiration block. If no selection is saved, the page continues showing the same first four blogs as its default.</p></div>
//                                 <div className="col-12">
//                                     {blogsList.length ? (
//                                         <div className="row border rounded p-3 mx-0" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                                             {blogsList.map((blog) => {
//                                                 const checked = selectedBlogIds.includes(String(blog.id));
//                                                 return <div className="col-md-6 form-check mb-2" key={blog.id}>
//                                                     <input className="form-check-input" id={`city-blog-${blog.id}`} type="checkbox" checked={checked} onChange={() => toggleBlogSelection(blog.id)} disabled={!checked && selectedBlogIds.length >= 6} />
//                                                     <label className="form-check-label" htmlFor={`city-blog-${blog.id}`}>{blog.title || `Blog #${blog.id}`}</label>
//                                                 </div>;
//                                             })}
//                                         </div>
//                                     ) : <div className="alert alert-light border small">Blog options could not be loaded. Existing default blogs will remain on the page.</div>}
//                                 </div>

//                                 <div className="col-12"><hr /><h5 className="mb-3">Sidebar: Book a Site Visit</h5></div>
//                                 <div className="mb-3 col-md-6"><label className="form-label">Site Visit Title</label><input className="form-control" value={citySettings.siteVisitTitle} onChange={(event) => updateCitySetting("siteVisitTitle", event.target.value)} maxLength={100} /></div>
//                                 <div className="mb-3 col-md-6"><label className="form-label">Button Text</label><input className="form-control" value={citySettings.siteVisitButtonText} onChange={(event) => updateCitySetting("siteVisitButtonText", event.target.value)} maxLength={60} /></div>
//                                 <div className="mb-3 col-md-8"><label className="form-label">Description</label><input className="form-control" value={citySettings.siteVisitDescription} onChange={(event) => updateCitySetting("siteVisitDescription", event.target.value)} maxLength={220} /><small className="text-muted">Use {'{city}'} to insert the current city name.</small></div>
//                                 <div className="mb-3 col-md-4"><label className="form-label">Button Link</label><input className="form-control" value={citySettings.siteVisitButtonUrl} onChange={(event) => updateCitySetting("siteVisitButtonUrl", event.target.value)} placeholder="/contact" /></div>

//                                 <div className="col-12"><hr /><h5 className="mb-3">Sidebar: The Promise</h5></div>
//                                 <div className="mb-3 col-md-12"><label className="form-label">Section Title</label><input className="form-control" value={citySettings.promiseTitle} onChange={(event) => updateCitySetting("promiseTitle", event.target.value)} maxLength={80} /></div>
//                                 {citySettings.promiseItems.map((promise, index) => (
//                                     <React.Fragment key={`promise-${index}`}>
//                                         <div className="mb-3 col-md-5"><label className="form-label">Promise {index + 1} Title</label><input className="form-control" value={promise.title} onChange={(event) => updatePromiseItem(index, "title", event.target.value)} maxLength={80} /></div>
//                                         <div className="mb-3 col-md-7"><label className="form-label">Promise {index + 1} Description</label><input className="form-control" value={promise.description} onChange={(event) => updatePromiseItem(index, "description", event.target.value)} maxLength={180} /></div>
//                                     </React.Fragment>
//                                 ))}

//                                 <div className="col-12"><hr /><h5 className="mb-3">Sidebar: Service Areas</h5></div>
//                                 <div className="mb-3 col-md-12"><label className="form-label">Section Title</label><input className="form-control mb-2" value={citySettings.serviceAreasTitle} onChange={(event) => updateCitySetting("serviceAreasTitle", event.target.value)} maxLength={80} /><label className="form-label">Area name | URL (one per line)</label><textarea className="form-control" rows={5} value={citySettings.serviceAreasText} onChange={(event) => updateCitySetting("serviceAreasText", event.target.value)} placeholder={'Noida|/interior-designers-in-noida\nDelhi|/interior-designers-in-delhi'} /><small className="text-muted">Only internal paths beginning with / are used.</small></div>

//                                 <div className="col-12"><hr /><h5 className="mb-3">Nearby Cities</h5></div>
//                                 <div className="mb-3 col-md-12"><label className="form-label">Section Title</label><input className="form-control mb-2" value={citySettings.nearbyCitiesTitle} onChange={(event) => updateCitySetting("nearbyCitiesTitle", event.target.value)} maxLength={80} /><label className="form-label">City name | URL | Image URL (one per line)</label><textarea className="form-control" rows={4} value={citySettings.nearbyCitiesText} onChange={(event) => updateCitySetting("nearbyCitiesText", event.target.value)} placeholder={'Delhi|/interior-designers-in-delhi|https://...\nNoida|/interior-designers-in-noida|'} /><small className="text-muted">Leave image URL empty to use the existing default city image.</small></div>

//                                 <div className="col-12">
//     <hr />
//     <h5 className="mb-2">Section Order</h5>
//     <SectionOrderManager value={sectionOrder} onChange={setSectionOrder} />
// </div>

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

//             <div className="modal fade" id="seoContentModal" tabIndex="-1" aria-labelledby="seoContentModalLabel" aria-hidden="true">
//                 <div className="modal-dialog modal-lg">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="seoContentModalLabel">Manage SEO Content</h1>
//                             <button type="button" id="seoContentModalClose" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         {/* <form onSubmit={handleSeoContentSubmit}>
//                             <div className="modal-body row">
                                
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Meta Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="meta_title"
//                                         placeholder="Meta Title"
//                                         value={formSeoContentData?.meta_title}
//                                         onChange={handleSeoContentInputChange}
//                                         required maxLength={60}
//                                     />
//                                     <Counter value={formSeoContentData.meta_title} limit={60} />
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Meta Description</label>
//                                     <textarea
//                                         className="form-control"
//                                         name="meta_description"
//                                         placeholder="Meta Description"
//                                         value={formSeoContentData?.meta_description}
//                                         onChange={handleSeoContentInputChange}
//                                         rows="3"
//                                         required maxLength={160}
//                                     >
//                                         <Counter value={formSeoContentData.meta_description} limit={160} />
//                                     </textarea>
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Canonical URL</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="canonical_url"
//                                         placeholder="https://hcinterior.in/interior-designers-in-noida"
//                                         value={formSeoContentData?.canonical_url}
//                                         onChange={handleSeoContentInputChange}
//                                     />
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Meta Keywords</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="meta_keywords"
//                                         placeholder="Meta Keywords"
//                                         value={formSeoContentData?.meta_keywords}
//                                         onChange={handleSeoContentInputChange}
//                                     />
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//     <label className="form-label">OG Title <small className="text-muted">(social share title; blank uses Meta Title)</small></label>
//     <input type="text" className="form-control" name="og_title" value={formSeoContentData.og_title} onChange={handleSeoContentInputChange} maxLength={60} placeholder={formSeoContentData.meta_title} />
//     <Counter value={formSeoContentData.og_title} limit={60} />
// </div>
// <div className="mb-3 col-md-12">
//     <label className="form-label">OG Description <small className="text-muted">(blank uses Meta Description)</small></label>
//     <textarea className="form-control" name="og_description" rows="2" value={formSeoContentData.og_description} onChange={handleSeoContentInputChange} maxLength={200} placeholder={formSeoContentData.meta_description} />
//     <Counter value={formSeoContentData.og_description} limit={200} />
// </div>

// <div className="mb-3 col-md-12">
//     <label className="form-label">OG Image URL</label>
//     <input type="text" className="form-control" name="og_image" placeholder="https://..." value={formSeoContentData.og_image} onChange={handleSeoContentInputChange} />
//     <small className="text-muted d-block">Recommended 1200×630 px. Blank uses the city banner.</small>
//     {formSeoContentData.og_image && (
//         <img key={formSeoContentData.og_image} src={formSeoContentData.og_image} alt="OG preview" className="mt-2 border rounded"
//              style={{ maxWidth: "100%", maxHeight: 120, objectFit: "cover" }}
//              onError={(e) => (e.currentTarget.style.display = "none")} />
//     )}
// </div>
// <div className="mb-3 col-md-12">
//     <label className="form-label">Custom Schema.org (JSON Format)</label>
//     <textarea className="form-control font-monospace" name="custom_schema" rows="4" placeholder='{ "@context": "https://schema.org", "@type": "LocalBusiness" }' value={formSeoContentData.custom_schema} onChange={handleSeoContentInputChange} />
// </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Search Engine Indexing</label>
//                                     <select
//                                         className="form-control"
//                                         name="meta_robots_index"
//                                         value={formSeoContentData.meta_robots_index}
//                                         onChange={handleSeoContentInputChange}
//                                     >
//                                         <option value="index">Index</option>
//                                         <option value="noindex">No Index</option>
//                                     </select>
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Link Following</label>
//                                     <select
//                                         className="form-control"
//                                         name="meta_robots_follow"
//                                         value={formSeoContentData.meta_robots_follow}
//                                         onChange={handleSeoContentInputChange}
//                                     >
//                                         <option value="follow">Follow</option>
//                                         <option value="nofollow">No Follow</option>
//                                     </select>
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <div className="form-check form-switch bg-light rounded border p-3">
//                                         <input
//                                             className="form-check-input"
//                                             type="checkbox"
//                                             role="switch"
//                                             id="cityIncludeInSitemap"
//                                             name="include_in_sitemap"
//                                             checked={Boolean(formSeoContentData.include_in_sitemap)}
//                                             onChange={handleSeoContentInputChange}
//                                         />
//                                         <label className="form-check-label fw-bold ms-2" htmlFor="cityIncludeInSitemap">
//                                             Include this city page in sitemap.xml
//                                         </label>
//                                     </div>
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Sitemap Change Frequency</label>
//                                     <select
//                                         className="form-control"
//                                         name="sitemap_change_frequency"
//                                         value={formSeoContentData.sitemap_change_frequency}
//                                         onChange={handleSeoContentInputChange}
//                                     >
//                                         {SITEMAP_CHANGE_FREQUENCY_OPTIONS.map((option) => (
//                                             <option key={option} value={option}>
//                                                 {option.charAt(0).toUpperCase() + option.slice(1)}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Sitemap Priority</label>
//                                     <input
//                                         type="number"
//                                         className="form-control"
//                                         name="sitemap_priority"
//                                         min="0"
//                                         max="1"
//                                         step="0.1"
//                                         value={formSeoContentData.sitemap_priority}
//                                         onChange={handleSeoContentInputChange}
//                                     />
//                                 </div>

//                                 <div className="m-auto mt-2 col-12 d-flex justify-content-center">
//                                     <button className="px-5 read_morebtn" type="submit">
//                                         Save
//                                     </button>
//                                 </div>
//                             </div>
//                         </form> */}

//                         <div className="modal-body">
//     {seoFormData ? (
//         <GlobalSeoForm initialData={seoFormData} onSubmit={handleSeoSubmit} canPublish={canPublish} />
//     ) : (
//         <div className="text-center py-4">Loading...</div>
//     )}
// </div>
//                     </div>
//                 </div>
//             </div>
//         </AuthMainLayout>
//     );
// };

// export default CmsCity;




// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { useSelector } from "react-redux";
// import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
// import api from "@/utils/api";
// import { toast } from "react-toastify";
// import dynamic from "next/dynamic";
// import {
//     DEFAULT_SITEMAP_CHANGE_FREQUENCY,
//     DEFAULT_SITEMAP_PRIORITY,
//     SITEMAP_CHANGE_FREQUENCY_OPTIONS
// } from "@/utils/seoHelpers";

// import GlobalSeoForm from "@/app/components/GlobalSeoForm";
// import { getCmsAccess, getPublishWorkflowMessage } from "@/utils/cmsAccess";
// import { cityUrlMap } from "@/utils/cityRoutes";
// import SectionOrderManager from "@/app/components/SectionOrderManager";
// import {
//     ProcessEditor,
//     ProjectsHeadingEditor,
//     BlogsHeadingEditor,
//     StatsEditor,
//     WhyChooseEditor,
//     FaqsEditor,
//     LivePreviewPane,
//     SiteVisitEditor,
//     PromiseEditor,
//     LinkRowsEditor,
//     ProjectGalleryEditor,
// } from "@/app/components/CityContentEditor";
// import { DEFAULT_SECTION_ORDER_STATE, getSectionOrder, normalizeOrder } from "@/utils/citySections";
// import { getCityContent, prepareContentForSave } from "@/utils/cityContent";

// const CKEditorComponent = dynamic(() => import('@/app/components/CKEditorComponent'), { ssr: false });

// const Counter = ({ value = "", limit }) => (
//     <small className={value.length > limit ? "text-danger" : value.length >= limit - 10 ? "text-warning" : "text-muted"}>
//         {value.length}/{limit} characters
//     </small>
// );
// const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

// const MAX_IMAGE_BYTES = 200 * 1024;
// const validateImage = (file) => {
//     if (file.type !== "image/webp") {
//         toast.error("Only .webp images are allowed.");
//         return false;
//     }
//     if (file.size > MAX_IMAGE_BYTES) {
//         toast.error(`Image must be 200 KB or smaller (selected: ${Math.round(file.size / 1024)} KB).`);
//         return false;
//     }
//     return true;
// };

// const DEFAULT_PROMISE_ITEMS = [
//     { iconName: "FaCheckCircle", title: "Transparent Pricing", description: "No hidden costs, ever." },
//     { iconName: "FaTools", title: "In-House Execution", description: "No third-party contractors involved." },
// ];

// // Extra gallery images are uploaded to this endpoint (multipart field "file" -> { url }).
// // If your API uses another path, change it here.
// const CITY_MEDIA_UPLOAD_PATH = "/cms-city/media";

// const parseSettingsObject = (value) => {
//     if (!value) return {};
//     if (typeof value === "object" && !Array.isArray(value)) return value;
//     try {
//         const parsed = JSON.parse(value);
//         return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
//     } catch { return {}; }
// };

// const niceCityName = (value) => String(value || "").replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
// const defaultServiceAreaList = () => Object.entries(cityUrlMap).map(([slug, url]) => ({ name: niceCityName(slug), url }));
// const defaultNearbyCityList = (currentCity = "") => Object.entries(cityUrlMap)
//     .filter(([slug]) => slug !== currentCity)
//     .slice(0, 3)
//     .map(([slug, url]) => ({ name: niceCityName(slug), url, image: "" }));

// const isInternalPath = (value) => {
//     const path = String(value || "").trim();
//     return path.startsWith("/") && !path.startsWith("//");
// };
// const cleanRows = (rows) => (Array.isArray(rows) ? rows : []).map((row) => ({
//     name: String(row?.name || "").trim(),
//     url: String(row?.url || "").trim(),
//     image: String(row?.image || "").trim(),
// }));
// // Keeps only complete rows (name + internal path). Same saved shape as before: {name,url[,image]}.
// const rowsToEntries = (rows, includeImage = false) => cleanRows(rows)
//     .filter((row) => row.name && isInternalPath(row.url))
//     .map((row) => (includeImage ? row : { name: row.name, url: row.url }));
// const countFilledRows = (rows) => cleanRows(rows).filter((row) => row.name || row.url || row.image).length;

// const settingsFromItem = (item) => {
//     const settings = parseSettingsObject(item?.city_settings ?? item?.city_settings_json);
//     const promises = Array.isArray(settings.promiseItems) && settings.promiseItems.length
//         ? settings.promiseItems
//         : DEFAULT_PROMISE_ITEMS;
//     const photos = Array.isArray(settings.projectImages) ? settings.projectImages : [];
//     return {
//         siteVisitTitle: settings.siteVisit?.title || settings.siteVisitTitle || "Book a Site Visit",
//         siteVisitDescription: settings.siteVisit?.description || settings.siteVisitDescription || "Expert designers will visit your {city} property.",
//         siteVisitButtonText: settings.siteVisit?.buttonText || settings.siteVisitButtonText || "Schedule Now",
//         siteVisitButtonUrl: settings.siteVisit?.buttonUrl || settings.siteVisitButtonUrl || "/contact",
//         siteVisitTitleTag: settings.siteVisit?.titleTag || settings.siteVisitTitleTag || "h4",
//         promiseTitle: settings.promiseTitle || "The Promise",
//         promiseTitleTag: settings.promiseTitleTag || "h4",
//         promiseItems: promises.map((item, index) => ({
//             iconName: item?.iconName || DEFAULT_PROMISE_ITEMS[index]?.iconName || (index === 0 ? "FaCheckCircle" : "FaTools"),
//             title: item?.title || DEFAULT_PROMISE_ITEMS[index]?.title || "",
//             description: item?.description || DEFAULT_PROMISE_ITEMS[index]?.description || "",
//         })).slice(0, 8),
//         serviceAreasTitle: settings.serviceAreasTitle || "Service Areas",
//         nearbyCitiesTitle: settings.nearbyCitiesTitle || "Nearby Cities",
//         serviceAreasList: Array.isArray(settings.serviceAreas) && settings.serviceAreas.length
//             ? settings.serviceAreas.map((entry) => ({ name: entry.name || entry.title || "", url: entry.url || entry.href || "" }))
//             : defaultServiceAreaList(),
//         nearbyCitiesList: Array.isArray(settings.nearbyCities) && settings.nearbyCities.length
//             ? settings.nearbyCities.map((entry) => ({ name: entry.name || entry.title || "", url: entry.url || entry.href || "", image: entry.image || entry.imageUrl || "" }))
//             : defaultNearbyCityList(item?.city_type || ""),
//         projectAlts: Array.from({ length: 6 }, (_, index) => photos[index]?.alt || item?.[`project_image_${index + 1}_alt`] || ""),
//         projectImages: photos,
//         designInspirationBlogIds: Array.isArray(settings.designInspirationBlogIds)
//             ? settings.designInspirationBlogIds.map((id) => String(id))
//             : [],
//     };
// };

// const CmsCity = () => {

//     const authToken = useSelector((state) => state.auth.authToken);
//     const user = useSelector((state) => state.auth.user);
//     const { canPublish } = getCmsAccess(user);
//     const [pagesList, setPagesList] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         city_type: "",
//         main_title: "",
//         main_description: "",
//         location_image: null,
//         side_title: "",
//         side_description: "",
//         side_image: null,
//         banner_title: "",
//         banner_subtitle: "",
//         banner_image: null,
//         mobile_banner_image: null,
//         project_image_1: null,
//         project_image_2: null,
//         project_image_3: null,
//         project_image_4: null,
//         project_image_5: null,
//         project_image_6: null,
//         main_title_tag: "h2",
// banner_title_tag: "h1",
// side_title_tag: "h2",
//         banner_image_alt: "",
// location_image_alt: "",
// side_image_alt: "",
//     });
//     // const [formSeoContentData, setFormSeoContentData] = useState({
//     //     meta_title: "",
//     //     meta_description: "",
//     //     meta_keywords: "",
//     //     canonical_url: "",
//     //     meta_robots_index: "index",
//     //     meta_robots_follow: "follow",
//     //     include_in_sitemap: true,
//     //     sitemap_change_frequency: DEFAULT_SITEMAP_CHANGE_FREQUENCY,
//     //     sitemap_priority: String(DEFAULT_SITEMAP_PRIORITY),
//     //     og_title: "",
//     //     og_description: "",
//     //     og_image: "",
//     //     custom_schema: ""
//     // });

//     const [seoRow, setSeoRow] = useState(null);           // existing seo_tag row (null = will be created)
//     const [seoFormData, setSeoFormData] = useState(null);  // data handed to GlobalSeoForm
//     const [selectedId, setSelectedId] = useState(null);
//     const [blogsList, setBlogsList] = useState([]);
//     const [selectedBlogIds, setSelectedBlogIds] = useState([]);
//     const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER_STATE);
//     const [cityContent, setCityContent] = useState(() => getCityContent());
//     const [activeTab, setActiveTab] = useState("basic");
//     const updateCityContent = (section, patch) =>
//         setCityContent((previous) => ({ ...previous, [section]: { ...previous[section], ...patch } }));
//     const [citySettings, setCitySettings] = useState({
//         siteVisitTitle: "Book a Site Visit",
//         siteVisitTitleTag: "h4",
//         siteVisitDescription: "Expert designers will visit your {city} property.",
//         siteVisitButtonText: "Schedule Now",
//         siteVisitButtonUrl: "/contact",
//         promiseTitle: "The Promise",
//         promiseTitleTag: "h4",
//         promiseItems: DEFAULT_PROMISE_ITEMS,
//         serviceAreasTitle: "Service Areas",
//         nearbyCitiesTitle: "Nearby Cities",
//         serviceAreasList: defaultServiceAreaList(),
//         nearbyCitiesList: defaultNearbyCityList(),
//         projectAlts: Array(6).fill(""),
//         projectImages: [],
//     });
//     const fetchContentManagerPages = useCallback(async () => {
//         try {
//             const response = await api.get("/cms-city", {
//                 headers: {
//                     Authorization: `Bearer ${authToken}`, // Send auth token
//                 },
//             });

//             setPagesList(Array.isArray(response.data) ? response.data : []);
//             if (!Array.isArray(response.data) && response.data?.id) setSelectedId(response.data.id);
//             try {
//                 const blogResponse = await api.get("/cms-blog", {
//                     headers: { Authorization: `Bearer ${authToken}` },
//                 });
//                 setBlogsList(Array.isArray(blogResponse.data) ? blogResponse.data : []);
//             } catch {
//                 setBlogsList([]);
//             }
//             setLoading(false);

//         } catch (err) {
//             toast.error(err.response?.data?.message ?? "Error fetching data. Please try again.");
//             setLoading(false);
//         }
//     }, [authToken]);

//     useEffect(() => {
//         fetchContentManagerPages();
//     }, [fetchContentManagerPages]);

//     const getCityMediaPreview = (cityType, slot) => {
//         const item = pagesList.find((page) => String(page.city_type).toLowerCase() === String(cityType || "").toLowerCase());
//         if (!item) return "";
//         if (slot === "mobile_banner") return item.mobile_banner_image || "";
//         const projectMatch = /^project_(\d+)$/.exec(String(slot || ""));
//         return projectMatch ? (item[`project_image_${projectMatch[1]}`] || "") : "";
//     };

//     // Handle input change for text fields and image
//     const handleInputChange = (e) => {
//         const { name, value, files } = e.target;
//         const isImageUpload = ["location_image", "side_image", "banner_image", "mobile_banner_image"].includes(name)
//             || /^project_image_[1-6]$/.test(name);
//         if (isImageUpload && files?.length > 0) {
//             if (!validateImage(files[0])) {
//                 e.target.value = "";
//                 return;
//             }
//             setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
//         } else {
//             setFormData((prevData) => ({ ...prevData, [name]: value }));
//         }
//     };

//     // Uploads one gallery image/thumbnail and returns its URL ("" on failure)
//     const uploadCityMedia = async (file) => {
//         if (!validateImage(file)) return "";
//         const body = new FormData();
//         body.append("file", file);
//         try {
//             const { data } = await api.post(CITY_MEDIA_UPLOAD_PATH, body, {
//                 headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
//             });
//             const url = data?.url || data?.path || data?.image || data?.location || "";
//             if (!url) throw new Error("The upload response did not contain a URL.");
//             toast.success("Image uploaded.");
//             return url;
//         } catch (error) {
//             toast.error(error.response?.status === 404
//                 ? "Image upload is not enabled on the server yet. Paste an image URL instead."
//                 : (error.response?.data?.message ?? error.message ?? "Image upload failed."));
//             return "";
//         }
//     };

//     const updateCitySetting = (name, value) => {
//         setCitySettings((previous) => ({ ...previous, [name]: value }));
//     };

//     const updatePromiseItem = (index, key, value) => {
//         setCitySettings((previous) => ({
//             ...previous,
//             promiseItems: previous.promiseItems.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
//         }));
//     };

//     const toggleBlogSelection = (blogId) => {
//         const id = String(blogId);
//         setSelectedBlogIds((previous) => previous.includes(id)
//             ? previous.filter((selected) => selected !== id)
//             : (previous.length >= 6 ? previous : [...previous, id]));
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();
       
//         const formDataToSend = new FormData();
//         const skippedServiceRows = countFilledRows(citySettings.serviceAreasList) - rowsToEntries(citySettings.serviceAreasList, false).length;
//         const skippedNearbyRows = countFilledRows(citySettings.nearbyCitiesList) - rowsToEntries(citySettings.nearbyCitiesList, true).length;
//         if (skippedServiceRows > 0 || skippedNearbyRows > 0) {
//             toast.warning(`${skippedServiceRows + skippedNearbyRows} incomplete row(s) in Service Areas / Nearby Cities were skipped (each needs a name and a URL starting with /).`);
//         }
//         const nextCitySettings = {
//             siteVisit: {
//                 title: citySettings.siteVisitTitle,
//                 titleTag: citySettings.siteVisitTitleTag,
//                 description: citySettings.siteVisitDescription,
//                 buttonText: citySettings.siteVisitButtonText,
//                 buttonUrl: citySettings.siteVisitButtonUrl,
//             },
//             promiseTitle: citySettings.promiseTitle,
//             promiseTitleTag: citySettings.promiseTitleTag,
//             promiseItems: citySettings.promiseItems
//                 .filter((item) => (item.title || "").trim() || (item.description || "").trim())
//                 .map((item) => ({ iconName: item.iconName, title: (item.title || "").trim(), description: (item.description || "").trim() })),
//             serviceAreasTitle: citySettings.serviceAreasTitle,
//             serviceAreas: rowsToEntries(citySettings.serviceAreasList, false),
//             nearbyCitiesTitle: citySettings.nearbyCitiesTitle,
//             nearbyCities: rowsToEntries(citySettings.nearbyCitiesList, true),
//             designInspirationBlogIds: selectedBlogIds,
//             content: prepareContentForSave(cityContent),
//             sectionOrder: {
//                 desktop: normalizeOrder(sectionOrder.desktop),
//                 mobile: normalizeOrder(sectionOrder.mobile),
//             },
//         };
//         formDataToSend.append("city_settings", JSON.stringify(nextCitySettings));
//         // FIX: Appended city_type to the payload so it actually saves
//         formDataToSend.append("city_type", formData.city_type); 
//         formDataToSend.append("main_title", formData.main_title);
//         formDataToSend.append("main_description", formData.main_description);
//         formDataToSend.append("side_title", formData.side_title);
//         formDataToSend.append("side_description", formData.side_description);
//         formDataToSend.append("banner_title", formData.banner_title);
//         formDataToSend.append("banner_subtitle", formData.banner_subtitle);
//         formDataToSend.append("main_title_tag", formData.main_title_tag);
// formDataToSend.append("banner_title_tag", formData.banner_title_tag);
// formDataToSend.append("side_title_tag", formData.side_title_tag);
//         formDataToSend.append("banner_image_alt", (formData.banner_image_alt || "").trim());
// formDataToSend.append("location_image_alt", (formData.location_image_alt || "").trim());
// formDataToSend.append("side_image_alt", (formData.side_image_alt || "").trim());

//         if (formData.location_image) {
//             formDataToSend.append("location_image", formData.location_image);
//         }

//         if (formData.side_image) {
//             formDataToSend.append("side_image", formData.side_image);
//         }

//         if (formData.banner_image) {
//             formDataToSend.append("banner_image", formData.banner_image);
//         }
//         if (formData.mobile_banner_image) {
//             formDataToSend.append("mobile_banner_image", formData.mobile_banner_image);
//         }
//         for (let index = 0; index < 6; index += 1) {
//             const fieldName = `project_image_${index + 1}`;
//             if (formData[fieldName]) {
//                 formDataToSend.append(fieldName, formData[fieldName]);
//             }
//             formDataToSend.append(
//                 `${fieldName}_alt`,
//                 String(citySettings.projectAlts[index] || "").trim(),
//             );
//         }
//         try {
//             // Send POST request to save form data
//             const response = await api.patch(`/cms-city/${selectedId}`, formDataToSend, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${authToken}`, // Send auth token
//                 },
//             });

//             // Handle success response
//             if (response.status === 200) {
//                 await fetchContentManagerPages();
//                 toast.success("City page saved successfully.");
//                 setFormData({
//                     city_type: "",
//                     main_title: "",
//                     main_description: "",
//                     location_image: null,
//                     side_title: "",
//                     side_description: "",
//                     side_image: null,
//                     banner_title: "",
//                     banner_subtitle: "",
//                     main_title_tag: "h2",
// banner_title_tag: "h1",
// side_title_tag: "h2",
//                     banner_image: null,
//                     mobile_banner_image: null,
//                     project_image_1: null,
//                     project_image_2: null,
//                     project_image_3: null,
//                     project_image_4: null,
//                     project_image_5: null,
//                     project_image_6: null,
//                     banner_image_alt: "",
//                     location_image_alt: "",
//                     side_image_alt: "",
//                 });
//                 setCitySettings({
//                     siteVisitTitle: "Book a Site Visit",
//         siteVisitTitleTag: "h4",
//                     siteVisitDescription: "Expert designers will visit your {city} property.",
//                     siteVisitButtonText: "Schedule Now",
//                     siteVisitButtonUrl: "/contact",
//                     promiseTitle: "The Promise",
//         promiseTitleTag: "h4",
//                     promiseItems: DEFAULT_PROMISE_ITEMS,
//                     serviceAreasTitle: "Service Areas",
//                     nearbyCitiesTitle: "Nearby Cities",
//                     serviceAreasList: defaultServiceAreaList(),
//                     nearbyCitiesList: defaultNearbyCityList(),
//                     projectAlts: Array(6).fill(""),
//                     projectImages: [],
//                 });
//                 setSelectedBlogIds([]);
//                 setCityContent(getCityContent());
//                 setSectionOrder(DEFAULT_SECTION_ORDER_STATE);
//                 setActiveTab("basic");

//                 // Close modal and clear form data
//                 setTimeout(() => {
//                     document.getElementById('addNewpageModal').classList.remove('show');
//                     document.querySelector('.modal-backdrop').remove();
//                     document.body.classList.remove('modal-open');
//                     document.body.style = "";
//                 }, 1000);

//             } else {
//                 toast.error("Error submitting form. Please try again.");
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message ?? "Error submitting form. Please try again.");
//             console.error("Error:", error);
//         }
//     };

//     // Set form data when edit button is clicked
//     const handleEditClick = (item) => {
//         setSelectedId(item.id);
//         setFormData({
//             city_type: item.city_type,
//             main_title: item.main_title,
//             main_description: item.main_description,
//             location_image: null,
//             side_title: item.side_title,
//             side_description: item.side_description,
//             side_image: null,
//             banner_title: item.banner_title ?? "",
//             banner_subtitle: item.banner_subtitle ?? "",
//             banner_image: null,
//             mobile_banner_image: null,
//             project_image_1: null,
//             project_image_2: null,
//             project_image_3: null,
//             project_image_4: null,
//             project_image_5: null,
//             project_image_6: null,
//             main_title_tag: item.main_title_tag || "h2",
// banner_title_tag: item.banner_title_tag || "h1",
// side_title_tag: item.side_title_tag || "h2",
// banner_image_alt: item.banner_image_alt ?? "",
// location_image_alt: item.location_image_alt ?? "",
// side_image_alt: item.side_image_alt ?? ""
//         });
//         const itemSettings = item.city_settings ?? item.city_settings_json;
//         const hydratedSettings = settingsFromItem({ ...item, city_settings: itemSettings });
//         const projectMediaAlts = Array.from({ length: 6 }, (_, index) =>
//             item?.[`project_image_${index + 1}_alt`] || hydratedSettings.projectAlts[index] || ""
//         );
//         setCitySettings({
//             siteVisitTitle: hydratedSettings.siteVisitTitle,
//             siteVisitTitleTag: hydratedSettings.siteVisitTitleTag,
//             siteVisitDescription: hydratedSettings.siteVisitDescription,
//             siteVisitButtonText: hydratedSettings.siteVisitButtonText,
//             siteVisitButtonUrl: hydratedSettings.siteVisitButtonUrl,
//             promiseTitle: hydratedSettings.promiseTitle,
//             promiseTitleTag: hydratedSettings.promiseTitleTag,
//             promiseItems: hydratedSettings.promiseItems,
//             serviceAreasTitle: hydratedSettings.serviceAreasTitle,
//             nearbyCitiesTitle: hydratedSettings.nearbyCitiesTitle,
//             serviceAreasList: hydratedSettings.serviceAreasList,
//             nearbyCitiesList: hydratedSettings.nearbyCitiesList,
//             projectAlts: projectMediaAlts,
//             projectImages: hydratedSettings.projectImages,
//         });
//         const selectedIds = Array.isArray(parseSettingsObject(itemSettings).designInspirationBlogIds)
//             ? parseSettingsObject(itemSettings).designInspirationBlogIds.map((id) => String(id))
//             : hydratedSettings.designInspirationBlogIds;
//         setSelectedBlogIds(selectedIds.length ? selectedIds : blogsList.slice(0, 4).map((blog) => String(blog.id)));
//         const parsedItemSettings = parseSettingsObject(itemSettings);
//         setCityContent(getCityContent(parsedItemSettings.content));
//         setSectionOrder(getSectionOrder(parsedItemSettings.sectionOrder));
//         setActiveTab("basic");
//     };

//     const setMainDescriptionData = (data) => {
//         setFormData((prevData) => ({ ...prevData, main_description: data }));
//     }

//     const setSideDescriptionData = (data) => {
//         setFormData((prevData) => ({ ...prevData, side_description: data }));
//     }

//     // const handleManageSeoContentClick = (id, item) => {
//     //     setSelectedId(id);
//     //     let schemaText = "";
//     //     if (item?.custom_schema) {
//     //         if (typeof item.custom_schema === "string") {
//     //             try { schemaText = JSON.stringify(JSON.parse(item.custom_schema), null, 2); }
//     //             catch (e) { schemaText = item.custom_schema; }
//     //         } else {
//     //             schemaText = JSON.stringify(item.custom_schema, null, 2);
//     //         }
//     //     }
//     //     setFormSeoContentData({
//     //         meta_title: item?.meta_title ?? "",
//     //         meta_description: item?.meta_description ?? "",
//     //         meta_keywords: item?.meta_keywords ?? "",
//     //         canonical_url: item?.canonical_url ?? "",
//     //         meta_robots_index: item?.meta_robots_index ?? "index",
//     //         meta_robots_follow: item?.meta_robots_follow ?? "follow",
//     //         include_in_sitemap: item?.include_in_sitemap ?? true,
//     //         sitemap_change_frequency: item?.sitemap_change_frequency ?? DEFAULT_SITEMAP_CHANGE_FREQUENCY,
//     //         sitemap_priority: String(item?.sitemap_priority ?? DEFAULT_SITEMAP_PRIORITY),
//     //         og_title: item?.og_title ?? "",
//     //         og_description: item?.og_description ?? "",
//     //         og_image: item?.og_image ?? "",
//     //         custom_schema: schemaText
//     //     });
//     // };

//     // const handleSeoContentInputChange = (e) => {
//     //     const { name, value, type, checked } = e.target;
//     //     setFormSeoContentData((prevData) => ({
//     //         ...prevData,
//     //         [name]: type === "checkbox" ? checked : value
//     //     }));
//     // };

//     // const handleSeoContentSubmit = async (e) => {
//     //     e.preventDefault();
//     //             if (formSeoContentData.meta_title.length > 60) { toast.error("Meta title must be 60 characters or less."); return; }
//     //     if (formSeoContentData.meta_description.length > 160) { toast.error("Meta description must be 160 characters or less."); return; }
//     //     if (formSeoContentData.og_title.length > 60) { toast.error("OG title must be 60 characters or less."); return; }
//     //     if (formSeoContentData.og_description.length > 200) { toast.error("OG description must be 200 characters or less."); return; }

//     //     let customSchema = null;
//     //     if (formSeoContentData.custom_schema && formSeoContentData.custom_schema.trim() !== "") {
//     //         try {
//     //             customSchema = JSON.parse(formSeoContentData.custom_schema);
//     //         } catch (err) {
//     //             toast.error("Invalid JSON in Custom Schema. Please check your formatting.");
//     //             return;
//     //         }
//     //     }

//     //     const formDataToSend = {
//     //         meta_title: formSeoContentData.meta_title,
//     //         meta_description: formSeoContentData.meta_description,
//     //         meta_keywords: formSeoContentData.meta_keywords,
//     //         canonical_url: formSeoContentData.canonical_url,
//     //         meta_robots_index: formSeoContentData.meta_robots_index,
//     //         meta_robots_follow: formSeoContentData.meta_robots_follow,
//     //         include_in_sitemap: formSeoContentData.include_in_sitemap,
//     //         sitemap_change_frequency: formSeoContentData.sitemap_change_frequency,
//     //         sitemap_priority: formSeoContentData.sitemap_priority,
//     //         og_title: formSeoContentData.og_title,
//     //         og_description: formSeoContentData.og_description,
//     //         og_image: formSeoContentData.og_image,
//     //         custom_schema: customSchema,
//     //     };

//     //     try {
//     //         // Send POST request to save form data
//     //         const response = await api.patch(`/cms-city/seo-content/${selectedId}`, formDataToSend, {
//     //             headers: {
//     //                 Authorization: `Bearer ${authToken}`, // Send auth token
//     //             },
//     //         });

//     //         // Handle success response
//     //         if (response.status === 200) {
//     //             fetchContentManagerPages();
//     //             toast.success("SEO Content saved successfully.");
//     //             // Close modal and clear form data
//     //             document.getElementById('seoContentModalClose').click();
//     //         } else {
//     //             toast.error("Error submitting form. Please try again.");
//     //         }
//     //     } catch (error) {
//     //         toast.error(error.response?.data?.message ?? "Error submitting form. Please try again.");
//     //         console.error("Error:", error);
//     //     }
//     // }

//         const normPath = (v) => {
//         let p = String(v || "").trim().toLowerCase().replace(/^https?:\/\/(www\.)?hcinterior\.in/, "").split(/[?#]/)[0];
//         if (!p.startsWith("/")) p = "/" + p;
//         if (p.length > 1) p = p.replace(/\/+$/, "");
//         return p;
//     };

//     const handleManageSeoContentClick = async (item) => {
//         setSelectedId(item.id);
//         setSeoRow(null);
//         setSeoFormData(null);

//         const path = cityUrlMap[item.city_type] || `/interior-designers-in-${item.city_type}`;
//         const p = normPath(path);
//         const keys = [p];
//         if (p.startsWith("/interior-designers-in-")) keys.push("/services-detail/" + p.replace("/interior-designers-in-", ""));

//         try {
//             const { data } = await api.get("/seo-tag", { headers: { Authorization: `Bearer ${authToken}` } });
//             // the row the website reads: newest active match, else newest match
//             const match = (Array.isArray(data) ? data : [])
//                 .filter((r) => keys.includes(normPath(r.page_name)))
//                 .sort((x, y) =>
//                     (y.status === "active") - (x.status === "active") ||
//                     new Date(y.updated_at) - new Date(x.updated_at) ||
//                     y.id - x.id)[0];
//             if (match) {
//                 setSeoRow(match);
//                 const nextStatus = !canPublish && match.status === "active" ? "inactive" : (match.status || "active");
//                 if (!canPublish && match.status === "active") {
//                     toast.info("Editing an active SEO record will save it as inactive until an admin republishes it.");
//                 }
//                 setSeoFormData({ ...match, status: nextStatus });
//                 return;
//             }
//         } catch (err) {
//             toast.error(err.response?.data?.message ?? "Could not load SEO data. Please try again.");
//             return;
//         }

//         // No seo_tag row yet: prefill from the old seo_content so nothing is lost on first save
//         const sc = item.seo_content || {};
//         let schema = null;
//         if (sc.custom_code) {
//             try { schema = JSON.parse(String(sc.custom_code).replace(/<script[^>]*>/gi, "").replace(/<\/script>/gi, "")); }
//             catch (e) { schema = null; }
//         }
//         setSeoFormData({
//             page_name: path,
//             meta_title: sc.meta_title ?? "",
//             meta_description: sc.meta_description ?? "",
//             keywords: sc.meta_keywords ?? "",
//             canonical_url: sc.canonical_url ?? "",
//             meta_robots: `${sc.meta_robots_index || "index"}, ${sc.meta_robots_follow || "follow"}`,
//             include_in_sitemap: sc.include_in_sitemap ?? true,
//             sitemap_change_frequency: sc.sitemap_change_frequency || DEFAULT_SITEMAP_CHANGE_FREQUENCY,
//             sitemap_priority: String(sc.sitemap_priority ?? DEFAULT_SITEMAP_PRIORITY),
//             custom_schema: schema,
//             status: canPublish ? "active" : "inactive",
//         });
//     };

//     const handleSeoSubmit = async (formattedData) => {
//         if ((formattedData.meta_title || "").length > 65) { toast.error("Meta title must be 65 characters or less."); return; }
//         if ((formattedData.meta_description || "").length > 160) { toast.error("Meta description must be 160 characters or less."); return; }
//         if ((formattedData.og_title || "").length > 65) { toast.error("OG title must be 65 characters or less."); return; }
//         if ((formattedData.og_description || "").length > 200) { toast.error("OG description must be 200 characters or less."); return; }

//         try {
//             if (!canPublish && formattedData.status === "active") {
//                 toast.info(getPublishWorkflowMessage("This SEO record"));
//             }
//             const headers = { Authorization: `Bearer ${authToken}` };
//             if (seoRow) {
//                 await api.patch(`/seo-tag/${seoRow.id}`, formattedData, { headers });
//             } else {
//                 await api.post("/seo-tag", formattedData, { headers });
//             }
//             toast.success("SEO saved successfully.");
//             document.getElementById("seoContentModalClose").click();
//         } catch (error) {
//             const msg = error.response?.data?.message;
//             toast.error(Array.isArray(msg) ? msg.join(", ") : msg ?? "Error saving SEO. Please try again.");
//         }
//     };

//     // Derived from existing pagesList + selectedId — no new state added.
//     const currentEditItem = pagesList.find((p) => p.id === selectedId);
//     const editTabs = [
//         { id: "basic", label: "Basic Info & Editor" },
//         { id: "images", label: "Hero & Images" },
//         { id: "sections", label: "Page Sections" },
//         { id: "faqs", label: `FAQs (${cityContent.faqs.items.length})` },
//         { id: "sidebar", label: "Sidebar & Cities" },
//         { id: "order", label: "Section Order" },
//         { id: "preview", label: "Live Preview" },
//     ];
//     const paneClass = (id) => (activeTab === id ? "" : "d-none");
//     const previewSrc = formData.city_type
//         ? (cityUrlMap[formData.city_type] || `/interior-designers-in-${formData.city_type}`)
//         : "";

//     return (
//         <AuthMainLayout>
//             <div className="container my-5">
//                 <h1 className="mb-4 text-center">CMS - City</h1>
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
//                                     <th>City Type</th>
//                                     <th>Main Title</th>
//                                     <th>Main Description</th>
//                                     <th>Location Image</th>
//                                     <th>Side Title</th>
//                                     <th>Side Description</th>
//                                     <th>Side Image</th>
//                                     <th>Banner Image</th>
//                                     <th>SEO Content</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {pagesList && pagesList?.map((item, index) => (
//                                     <tr key={item.id}>
//                                         <td>{index + 1}</td>
//                                         <td className="text-capitalize">{item.city_type}</td>
//                                         <td>{item.main_title}</td>
//                                         <td>
//                                             <span className="d-inline-block text-truncate" style={{ width: "250px" }} dangerouslySetInnerHTML={{ __html: item.main_description }}></span>
//                                         </td>
//                                         <td>
//                                             {item.location_image && <img src={item.location_image} alt={item.location_image_alt || "Location Image"}height="80" decoding="async"  loading="lazy" />}
//                                         </td>
//                                         <td>{item.side_title}</td>
//                                         <td>
//                                             <span className="d-inline-block text-truncate" style={{ width: "250px" }} dangerouslySetInnerHTML={{ __html: item.side_description }}></span>
//                                         </td>
//                                         <td>
//                                             {item.side_image && <img src={item.side_image} alt={item.side_image_alt || "Side Image"} height="80" decoding="async"  loading="lazy" />}
//                                         </td>
//                                         <td>
//                                             {item.banner_image && <img src={item.banner_image} alt={item.banner_image_alt || "Banner Image"} height="80" decoding="async" loading="lazy" />}
//                                         </td>
//                                         <td width={150}>
//                                             <button onClick={() => handleManageSeoContentClick(item)} className="btn btn-info text-nowrap" type="button" data-bs-toggle="modal" data-bs-target="#seoContentModal">SEO Content</button>
//                                         </td>
//                                         <td>
//                                             <button onClick={() => handleEditClick(item)} type="button" className="read_morebtn" data-bs-toggle="modal" data-bs-target="#addNewpageModal">
//                                                 Edit
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>

//             <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-focus="false">
//                 <div className="modal-dialog modal-xl">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="exampleModalLabel">{formData.city_type ? `Edit City Page: ${niceCityName(formData.city_type)}` : "Edit City Page"}</h1>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
// <form
//                             onSubmit={handleSubmit}
//                             onInvalidCapture={() => {
//                                 setActiveTab("basic");
//                                 toast.error("Please fill the required fields in the Basic Info tab.", { toastId: "city-required-fields" });
//                             }}
//                         >
//                             <div className="modal-body">
//                                 <ul className="nav nav-pills nav-fill gap-2 mb-4" role="tablist">
//                                     {editTabs.map((tab) => (
//                                         <li className="nav-item" key={tab.id}>
//                                             <button
//                                                 type="button"
//                                                 role="tab"
//                                                 aria-selected={activeTab === tab.id}
//                                                 className={`nav-link border ${activeTab === tab.id ? "active fw-bold" : "bg-white text-dark"}`}
//                                                 onClick={() => setActiveTab(tab.id)}
//                                             >
//                                                 {tab.label}
//                                             </button>
//                                         </li>
//                                     ))}
//                                 </ul>

//                                 {/* ===== TAB: Basic Info & Editor ===== */}
//                                 <div className={paneClass("basic")}>
//                                     <div className="row">

//                                 <div className="mb-3 col-md-12">
//                                 <label className="form-label">City Type</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="city_type"
//                                         placeholder="City Type"
//                                         value={formData.city_type}
//                                         onChange={handleInputChange}
//                                         required // FIX: Removed disabled, added required
//                                     />
//                                     <small className="text-muted">This acts as the URL slug (e.g. noida, new-delhi)</small>
//                                 </div>

//                                 <div className="mb-3 col-md-9">
//                                     <label className="form-label">Main Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="main_title"
//                                         placeholder="Main Title"
//                                         value={formData.main_title}
//                                         onChange={handleInputChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="mb-3 col-md-3">
//     <label className="form-label">Heading Tag</label>
//     <select
//         className="form-select"
//         name="main_title_tag"
//         value={formData.main_title_tag}
//         onChange={handleInputChange}
//     >
//         {HEADING_TAGS.map((t) => (
//             <option key={t} value={t}>{t.toUpperCase()}</option>
//         ))}
//     </select>
// </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Main Description</label>
//                                     <CKEditorComponent pageData={formData.main_description} setPageData={setMainDescriptionData} />
//                                 </div>

//                                 <div className="mb-3 col-md-9">
//                                     <label className="form-label">Side Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="side_title"
//                                         placeholder="Side Title"
//                                         value={formData.side_title}
//                                         onChange={handleInputChange}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="mb-3 col-md-3">
//     <label className="form-label">Heading Tag</label>
//     <select
//         className="form-select"
//         name="side_title_tag"
//         value={formData.side_title_tag}
//         onChange={handleInputChange}
//     >
//         {HEADING_TAGS.map((t) => (
//             <option key={t} value={t}>{t.toUpperCase()}</option>
//         ))}
//     </select>
// </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Side Description</label>
//                                     <CKEditorComponent pageData={formData.side_description} setPageData={setSideDescriptionData} />
//                                 </div>

//                                     </div>
//                                 </div>

//                                 {/* ===== TAB: Hero & Images ===== */}
//                                 <div className={paneClass("images")}>
//                                     <div className="row">
//                                 <div className="col-md-12">
//                                     <hr />
//                                     <h5 className="mb-3">Hero Banner</h5>
//                                 </div>

//                                 <div className="mb-3 col-md-9">
//                                     <label className="form-label">Banner Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="banner_title"
//                                         placeholder="Banner Title"
//                                         value={formData.banner_title}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 <div className="mb-3 col-md-3">
//     <label className="form-label">Heading Tag</label>
//     <select
//         className="form-select"
//         name="banner_title_tag"
//         value={formData.banner_title_tag}
//         onChange={handleInputChange}
//     >
//         {HEADING_TAGS.map((t) => (
//             <option key={t} value={t}>{t.toUpperCase()}</option>
//         ))}
//     </select>
// </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Banner Subtitle</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="banner_subtitle"
//                                         placeholder="Banner Subtitle"
//                                         value={formData.banner_subtitle}
//                                         onChange={handleInputChange}
//                                     />
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Banner Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         name="banner_image"
//                                         accept="image/webp"
//                                         onChange={handleInputChange}
//                                     />
//                                     <small className="text-muted d-block">Only .webp, max 200 KB.</small>
// <input
//     type="text"
//     className="form-control mt-2"
//     name="banner_image_alt"
//     maxLength={125}
//     placeholder="Banner image alt text (for SEO)"
//     value={formData.banner_image_alt || ""}
//     onChange={handleInputChange}
// />
//                                     {currentEditItem?.banner_image && (
//                                         <div className="mt-2">
//                                             <small className="text-muted d-block">Current Banner Image:</small>
//                                             <img src={currentEditItem.banner_image} alt="Current Banner" height="80" decoding="async" loading="lazy" />
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Mobile Hero Banner (optional)</label>
//                                     <input type="file" className="form-control" name="mobile_banner_image" accept="image/webp" onChange={handleInputChange} />
//                                     <small className="text-muted d-block">Upload a mobile-specific WebP banner, max 200 KB. It uses the same Banner Image Alt Text above.</small>
//                                     {getCityMediaPreview(formData.city_type, "mobile_banner") && (
//                                         <div className="mt-2">
//                                             <small className="text-muted d-block">Current Mobile Banner:</small>
//                                             <img src={getCityMediaPreview(formData.city_type, "mobile_banner")} alt={formData.banner_image_alt || "Current mobile hero banner"} height="100" style={{ maxWidth: "180px", objectFit: "cover" }} decoding="async" loading="lazy" />
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Location Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         name="location_image"
//                                         accept="image/webp"
//                                         onChange={handleInputChange}
//                                     />
//                                     <small className="text-muted d-block">Only .webp, max 200 KB.</small>
// <input
//     type="text"
//     className="form-control mt-2"
//     name="location_image_alt"
//     maxLength={125}
//     placeholder="Location image alt text (for SEO)"
//     value={formData.location_image_alt || ""}
//     onChange={handleInputChange}
// />
//                                     {currentEditItem?.location_image && (
//                                         <div className="mt-2">
//                                             <small className="text-muted d-block">Current Location Image:</small>
//                                             <img src={currentEditItem.location_image} alt="Current Location" height="80" decoding="async" loading="lazy" />
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Side Image</label>
//                                     <input
//                                         type="file"
//                                         className="form-control"
//                                         name="side_image"
//                                         accept="image/webp"
//                                         onChange={handleInputChange}
//                                     />
//                                     <small className="text-muted d-block">Only .webp, max 200 KB.</small>
// <input
//     type="text"
//     className="form-control mt-2"
//     name="side_image_alt"
//     maxLength={125}
//     placeholder="Side image alt text (for SEO)"
//     value={formData.side_image_alt || ""}
//     onChange={handleInputChange}
// />
//                                     {currentEditItem?.side_image && (
//                                         <div className="mt-2">
//                                             <small className="text-muted d-block">Current Side Image:</small>
//                                             <img src={currentEditItem.side_image} alt="Current Side" height="80" decoding="async" loading="lazy" />
//                                         </div>
//                                     )}
//                                 </div>

//                                     </div>
//                                 </div>

//                                 {/* ===== TAB: Page Sections ===== */}
//                                 <div className={paneClass("sections")}>
//                                     <div className="row">
//                                         <ProcessEditor value={cityContent.process} onChange={updateCityContent} />
//                                         <ProjectsHeadingEditor value={cityContent.projects} onChange={updateCityContent} />
//                                 <div className="col-12"><hr /><h5 className="mb-2">Large City Project Photos</h5><p className="text-muted small">Add up to six large project photos. Each image must be WebP and 200 KB or smaller. Blank fields keep the previously uploaded photo.</p></div>
//                                 {Array.from({ length: 6 }, (_, index) => {
//                                     const fieldName = `project_image_${index + 1}`;
//                                     const existingImage = getCityMediaPreview(formData.city_type, `project_${index + 1}`);
//                                     return (
//                                         <div className="mb-3 col-md-6" key={fieldName}>
//                                             <label className="form-label">Project Photo {index + 1}</label>
//                                             <input type="file" className="form-control" name={fieldName} accept="image/webp" onChange={handleInputChange} />
//                                             <input type="text" className="form-control mt-2" maxLength={125} placeholder={`Project photo ${index + 1} alt text`} value={citySettings.projectAlts[index] || ""} onChange={(event) => setCitySettings((previous) => ({ ...previous, projectAlts: previous.projectAlts.map((value, itemIndex) => itemIndex === index ? event.target.value : value) }))} />
//                                             {existingImage && <img src={existingImage} alt={citySettings.projectAlts[index] || `Current project photo ${index + 1}`} className="mt-2 rounded border" style={{ maxWidth: "100%", maxHeight: "110px", objectFit: "cover" }} decoding="async" loading="lazy" />}
//                                         </div>
//                                     );
//                                 })}

//                                         <ProjectGalleryEditor
//                                             items={cityContent.projects.gallery}
//                                             onChange={(gallery) => updateCityContent("projects", { gallery })}
//                                             onUpload={uploadCityMedia}
//                                         />
//                                         <BlogsHeadingEditor value={cityContent.blogs} onChange={updateCityContent} />
//                                 <div className="col-12"><hr /><h5 className="mb-2">Design Inspiration Blogs</h5><p className="text-muted small">Choose up to six blogs for this city's Design Inspiration block. If no selection is saved, the page continues showing the same first four blogs as its default.</p></div>
//                                 <div className="col-12">
//                                     {blogsList.length ? (
//                                         <div className="row border rounded p-3 mx-0" style={{ maxHeight: "240px", overflowY: "auto" }}>
//                                             {blogsList.map((blog) => {
//                                                 const checked = selectedBlogIds.includes(String(blog.id));
//                                                 return <div className="col-md-6 form-check mb-2" key={blog.id}>
//                                                     <input className="form-check-input" id={`city-blog-${blog.id}`} type="checkbox" checked={checked} onChange={() => toggleBlogSelection(blog.id)} disabled={!checked && selectedBlogIds.length >= 6} />
//                                                     <label className="form-check-label" htmlFor={`city-blog-${blog.id}`}>{blog.title || `Blog #${blog.id}`}</label>
//                                                 </div>;
//                                             })}
//                                         </div>
//                                     ) : <div className="alert alert-light border small">Blog options could not be loaded. Existing default blogs will remain on the page.</div>}
//                                 </div>

//                                         <StatsEditor value={cityContent.stats} onChange={updateCityContent} />
//                                         <WhyChooseEditor value={cityContent.whyChoose} onChange={updateCityContent} />
//                                     </div>
//                                 </div>

//                                 {/* ===== TAB: FAQs ===== */}
//                                 <div className={paneClass("faqs")}>
//                                     <FaqsEditor value={cityContent.faqs} onChange={updateCityContent} />
//                                 </div>

//                                 {/* ===== TAB: Sidebar & Cities ===== */}
//                                 <div className={paneClass("sidebar")}>
//                                     <div className="row">
//                                 <SiteVisitEditor settings={citySettings} onChange={updateCitySetting} />

//                                         <PromiseEditor settings={citySettings} onChange={updateCitySetting} />

//                                         <LinkRowsEditor
//                                             title="Sidebar: Service Areas"
//                                             subtitle="Links listed in the sidebar. Only internal paths that start with / are used."
//                                             sectionTitle={citySettings.serviceAreasTitle}
//                                             onSectionTitle={(value) => updateCitySetting("serviceAreasTitle", value)}
//                                             rows={citySettings.serviceAreasList}
//                                             onChange={(rows) => updateCitySetting("serviceAreasList", rows)}
//                                             columns={[
//                                                 { key: "name", label: "City name", placeholder: "City name", flex: 1, maxLength: 80 },
//                                                 { key: "url", label: "URL", placeholder: "/interior-designers-in-noida", flex: 1.2, kind: "path", maxLength: 200 },
//                                             ]}
//                                             newRow={{ name: "", url: "" }}
//                                             addLabel="Add Area"
//                                             max={60}
//                                             twoUp
//                                         />

//                                         <LinkRowsEditor
//                                             title="Nearby Cities"
//                                             subtitle="Image cards at the bottom of the page."
//                                             sectionTitle={citySettings.nearbyCitiesTitle}
//                                             onSectionTitle={(value) => updateCitySetting("nearbyCitiesTitle", value)}
//                                             rows={citySettings.nearbyCitiesList}
//                                             onChange={(rows) => updateCitySetting("nearbyCitiesList", rows)}
//                                             columns={[
//                                                 { key: "name", label: "City name", placeholder: "City name", flex: 1, maxLength: 80 },
//                                                 { key: "url", label: "URL", placeholder: "/interior-designers-in-delhi", flex: 1.2, kind: "path", maxLength: 200 },
//                                                 { key: "image", label: "Image URL", placeholder: "Image URL (optional)", flex: 1.6, kind: "image", maxLength: 500 },
//                                             ]}
//                                             newRow={{ name: "", url: "", image: "" }}
//                                             addLabel="Add City"
//                                             max={12}
//                                             hint="Leave the image URL empty to use the existing default city image."
//                                         />

//                                     </div>
//                                 </div>

//                                 {/* ===== TAB: Section Order ===== */}
//                                 <div className={paneClass("order")}>
//                                     <SectionOrderManager value={sectionOrder} onChange={setSectionOrder} />
//                                 </div>

//                                 {/* ===== TAB: Live Preview ===== */}
//                                 <div className={paneClass("preview")}>
//                                     {activeTab === "preview" && <LivePreviewPane src={previewSrc} />}
//                                 </div>
//                             </div>
//                             <div className="modal-footer justify-content-end gap-2">
//                                 <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//                                 <button className="px-5 read_morebtn" type="submit">
//                                     Save Changes
//                                 </button>
//                             </div>

//                         </form>
//                     </div>
//                 </div>
//             </div>

//             <div className="modal fade" id="seoContentModal" tabIndex="-1" aria-labelledby="seoContentModalLabel" aria-hidden="true">
//                 <div className="modal-dialog modal-lg">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="seoContentModalLabel">Manage SEO Content</h1>
//                             <button type="button" id="seoContentModalClose" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         {/* <form onSubmit={handleSeoContentSubmit}>
//                             <div className="modal-body row">
                                
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Meta Title</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="meta_title"
//                                         placeholder="Meta Title"
//                                         value={formSeoContentData?.meta_title}
//                                         onChange={handleSeoContentInputChange}
//                                         required maxLength={60}
//                                     />
//                                     <Counter value={formSeoContentData.meta_title} limit={60} />
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Meta Description</label>
//                                     <textarea
//                                         className="form-control"
//                                         name="meta_description"
//                                         placeholder="Meta Description"
//                                         value={formSeoContentData?.meta_description}
//                                         onChange={handleSeoContentInputChange}
//                                         rows="3"
//                                         required maxLength={160}
//                                     >
//                                         <Counter value={formSeoContentData.meta_description} limit={160} />
//                                     </textarea>
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Canonical URL</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="canonical_url"
//                                         placeholder="https://hcinterior.in/interior-designers-in-noida"
//                                         value={formSeoContentData?.canonical_url}
//                                         onChange={handleSeoContentInputChange}
//                                     />
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Meta Keywords</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="meta_keywords"
//                                         placeholder="Meta Keywords"
//                                         value={formSeoContentData?.meta_keywords}
//                                         onChange={handleSeoContentInputChange}
//                                     />
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//     <label className="form-label">OG Title <small className="text-muted">(social share title; blank uses Meta Title)</small></label>
//     <input type="text" className="form-control" name="og_title" value={formSeoContentData.og_title} onChange={handleSeoContentInputChange} maxLength={60} placeholder={formSeoContentData.meta_title} />
//     <Counter value={formSeoContentData.og_title} limit={60} />
// </div>
// <div className="mb-3 col-md-12">
//     <label className="form-label">OG Description <small className="text-muted">(blank uses Meta Description)</small></label>
//     <textarea className="form-control" name="og_description" rows="2" value={formSeoContentData.og_description} onChange={handleSeoContentInputChange} maxLength={200} placeholder={formSeoContentData.meta_description} />
//     <Counter value={formSeoContentData.og_description} limit={200} />
// </div>

// <div className="mb-3 col-md-12">
//     <label className="form-label">OG Image URL</label>
//     <input type="text" className="form-control" name="og_image" placeholder="https://..." value={formSeoContentData.og_image} onChange={handleSeoContentInputChange} />
//     <small className="text-muted d-block">Recommended 1200×630 px. Blank uses the city banner.</small>
//     {formSeoContentData.og_image && (
//         <img key={formSeoContentData.og_image} src={formSeoContentData.og_image} alt="OG preview" className="mt-2 border rounded"
//              style={{ maxWidth: "100%", maxHeight: 120, objectFit: "cover" }}
//              onError={(e) => (e.currentTarget.style.display = "none")} />
//     )}
// </div>
// <div className="mb-3 col-md-12">
//     <label className="form-label">Custom Schema.org (JSON Format)</label>
//     <textarea className="form-control font-monospace" name="custom_schema" rows="4" placeholder='{ "@context": "https://schema.org", "@type": "LocalBusiness" }' value={formSeoContentData.custom_schema} onChange={handleSeoContentInputChange} />
// </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Search Engine Indexing</label>
//                                     <select
//                                         className="form-control"
//                                         name="meta_robots_index"
//                                         value={formSeoContentData.meta_robots_index}
//                                         onChange={handleSeoContentInputChange}
//                                     >
//                                         <option value="index">Index</option>
//                                         <option value="noindex">No Index</option>
//                                     </select>
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Link Following</label>
//                                     <select
//                                         className="form-control"
//                                         name="meta_robots_follow"
//                                         value={formSeoContentData.meta_robots_follow}
//                                         onChange={handleSeoContentInputChange}
//                                     >
//                                         <option value="follow">Follow</option>
//                                         <option value="nofollow">No Follow</option>
//                                     </select>
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <div className="form-check form-switch bg-light rounded border p-3">
//                                         <input
//                                             className="form-check-input"
//                                             type="checkbox"
//                                             role="switch"
//                                             id="cityIncludeInSitemap"
//                                             name="include_in_sitemap"
//                                             checked={Boolean(formSeoContentData.include_in_sitemap)}
//                                             onChange={handleSeoContentInputChange}
//                                         />
//                                         <label className="form-check-label fw-bold ms-2" htmlFor="cityIncludeInSitemap">
//                                             Include this city page in sitemap.xml
//                                         </label>
//                                     </div>
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Sitemap Change Frequency</label>
//                                     <select
//                                         className="form-control"
//                                         name="sitemap_change_frequency"
//                                         value={formSeoContentData.sitemap_change_frequency}
//                                         onChange={handleSeoContentInputChange}
//                                     >
//                                         {SITEMAP_CHANGE_FREQUENCY_OPTIONS.map((option) => (
//                                             <option key={option} value={option}>
//                                                 {option.charAt(0).toUpperCase() + option.slice(1)}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div className="mb-3 col-md-6">
//                                     <label className="form-label">Sitemap Priority</label>
//                                     <input
//                                         type="number"
//                                         className="form-control"
//                                         name="sitemap_priority"
//                                         min="0"
//                                         max="1"
//                                         step="0.1"
//                                         value={formSeoContentData.sitemap_priority}
//                                         onChange={handleSeoContentInputChange}
//                                     />
//                                 </div>

//                                 <div className="m-auto mt-2 col-12 d-flex justify-content-center">
//                                     <button className="px-5 read_morebtn" type="submit">
//                                         Save
//                                     </button>
//                                 </div>
//                             </div>
//                         </form> */}

//                         <div className="modal-body">
//     {seoFormData ? (
//         <GlobalSeoForm initialData={seoFormData} onSubmit={handleSeoSubmit} canPublish={canPublish} />
//     ) : (
//         <div className="text-center py-4">Loading...</div>
//     )}
// </div>
//                     </div>
//                 </div>
//             </div>
//         </AuthMainLayout>
//     );
// };

// export default CmsCity;




"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import {
    DEFAULT_SITEMAP_CHANGE_FREQUENCY,
    DEFAULT_SITEMAP_PRIORITY,
    SITEMAP_CHANGE_FREQUENCY_OPTIONS
} from "@/utils/seoHelpers";

import GlobalSeoForm from "@/app/components/GlobalSeoForm";
import { getCmsAccess, getPublishWorkflowMessage } from "@/utils/cmsAccess";
import { cityUrlMap } from "@/utils/cityRoutes";
import SectionOrderManager from "@/app/components/SectionOrderManager";
import {
    ProcessEditor,
    ProjectsHeadingEditor,
    BlogsHeadingEditor,
    StatsEditor,
    WhyChooseEditor,
    FaqsEditor,
    LivePreviewPane,
    SiteVisitEditor,
    PromiseEditor,
    LinkRowsEditor,
    ProjectGalleryEditor,
} from "@/app/components/CityContentEditor";
import { DEFAULT_SECTION_ORDER_STATE, getSectionOrder, normalizeOrder } from "@/utils/citySections";
import { getCityContent, prepareContentForSave } from "@/utils/cityContent";

const CKEditorComponent = dynamic(() => import('@/app/components/CKEditorComponent'), { ssr: false });

const Counter = ({ value = "", limit }) => (
    <small className={value.length > limit ? "text-danger" : value.length >= limit - 10 ? "text-warning" : "text-muted"}>
        {value.length}/{limit} characters
    </small>
);
const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];

const MAX_IMAGE_BYTES = 200 * 1024;
const validateImage = (file) => {
    if (file.type !== "image/webp") {
        toast.error("Only .webp images are allowed.");
        return false;
    }
    if (file.size > MAX_IMAGE_BYTES) {
        toast.error(`Image must be 200 KB or smaller (selected: ${Math.round(file.size / 1024)} KB).`);
        return false;
    }
    return true;
};

const MAX_VIDEO_BYTES = 25 * 1024 * 1024;
const validateVideo = (file) => {
    if (!["video/mp4", "video/webm"].includes(file.type)) {
        toast.error("Only .mp4 or .webm videos are allowed.");
        return false;
    }
    if (file.size > MAX_VIDEO_BYTES) {
        toast.error(`Video must be 25 MB or smaller (selected: ${(file.size / 1024 / 1024).toFixed(1)} MB).`);
        return false;
    }
    return true;
};

const DEFAULT_PROMISE_ITEMS = [
    { iconName: "FaCheckCircle", title: "Transparent Pricing", description: "No hidden costs, ever." },
    { iconName: "FaTools", title: "In-House Execution", description: "No third-party contractors involved." },
];

// Extra gallery images are uploaded to this endpoint (multipart field "file" -> { url }).
// If your API uses another path, change it here.
const CITY_MEDIA_UPLOAD_PATH = "/cms-city/media";

const parseSettingsObject = (value) => {
    if (!value) return {};
    if (typeof value === "object" && !Array.isArray(value)) return value;
    try {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch { return {}; }
};

const niceCityName = (value) => String(value || "").replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
const defaultServiceAreaList = () => Object.entries(cityUrlMap).map(([slug, url]) => ({ name: niceCityName(slug), url }));
const defaultNearbyCityList = (currentCity = "") => Object.entries(cityUrlMap)
    .filter(([slug]) => slug !== currentCity)
    .slice(0, 3)
    .map(([slug, url]) => ({ name: niceCityName(slug), url, image: "" }));

const isInternalPath = (value) => {
    const path = String(value || "").trim();
    return path.startsWith("/") && !path.startsWith("//");
};
const cleanRows = (rows) => (Array.isArray(rows) ? rows : []).map((row) => ({
    name: String(row?.name || "").trim(),
    url: String(row?.url || "").trim(),
    image: String(row?.image || "").trim(),
}));
// Keeps only complete rows (name + internal path). Same saved shape as before: {name,url[,image]}.
const rowsToEntries = (rows, includeImage = false) => cleanRows(rows)
    .filter((row) => row.name && isInternalPath(row.url))
    .map((row) => (includeImage ? row : { name: row.name, url: row.url }));
const countFilledRows = (rows) => cleanRows(rows).filter((row) => row.name || row.url || row.image).length;

const settingsFromItem = (item) => {
    const settings = parseSettingsObject(item?.city_settings ?? item?.city_settings_json);
    const promises = Array.isArray(settings.promiseItems) && settings.promiseItems.length
        ? settings.promiseItems
        : DEFAULT_PROMISE_ITEMS;
    const photos = Array.isArray(settings.projectImages) ? settings.projectImages : [];
    return {
        siteVisitTitle: settings.siteVisit?.title || settings.siteVisitTitle || "Book a Site Visit",
        siteVisitDescription: settings.siteVisit?.description || settings.siteVisitDescription || "Expert designers will visit your {city} property.",
        siteVisitButtonText: settings.siteVisit?.buttonText || settings.siteVisitButtonText || "Schedule Now",
        siteVisitButtonUrl: settings.siteVisit?.buttonUrl || settings.siteVisitButtonUrl || "/contact",
        siteVisitTitleTag: settings.siteVisit?.titleTag || settings.siteVisitTitleTag || "h4",
        promiseTitle: settings.promiseTitle || "The Promise",
        promiseTitleTag: settings.promiseTitleTag || "h4",
        promiseItems: promises.map((item, index) => ({
            iconName: item?.iconName || DEFAULT_PROMISE_ITEMS[index]?.iconName || (index === 0 ? "FaCheckCircle" : "FaTools"),
            title: item?.title || DEFAULT_PROMISE_ITEMS[index]?.title || "",
            description: item?.description || DEFAULT_PROMISE_ITEMS[index]?.description || "",
        })).slice(0, 8),
        serviceAreasTitle: settings.serviceAreasTitle || "Service Areas",
        serviceAreasTitleTag: settings.serviceAreasTitleTag || "h4",
        nearbyCitiesTitle: settings.nearbyCitiesTitle || "Nearby Cities",
        nearbyCitiesTitleTag: settings.nearbyCitiesTitleTag || "h2",
        serviceAreasList: Array.isArray(settings.serviceAreas) && settings.serviceAreas.length
            ? settings.serviceAreas.map((entry) => ({ name: entry.name || entry.title || "", url: entry.url || entry.href || "" }))
            : defaultServiceAreaList(),
        nearbyCitiesList: Array.isArray(settings.nearbyCities) && settings.nearbyCities.length
            ? settings.nearbyCities.map((entry) => ({ name: entry.name || entry.title || "", url: entry.url || entry.href || "", image: entry.image || entry.imageUrl || "" }))
            : defaultNearbyCityList(item?.city_type || ""),
        projectAlts: Array.from({ length: 6 }, (_, index) => photos[index]?.alt || item?.[`project_image_${index + 1}_alt`] || ""),
        projectImages: photos,
        designInspirationBlogIds: Array.isArray(settings.designInspirationBlogIds)
            ? settings.designInspirationBlogIds.map((id) => String(id))
            : [],
    };
};

const CmsCity = () => {

    const authToken = useSelector((state) => state.auth.authToken);
    const user = useSelector((state) => state.auth.user);
    const { canPublish } = getCmsAccess(user);
    const [pagesList, setPagesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        city_type: "",
        main_title: "",
        main_description: "",
        location_image: null,
        side_title: "",
        side_description: "",
        side_image: null,
        banner_title: "",
        banner_subtitle: "",
        banner_image: null,
        mobile_banner_image: null,
        project_image_1: null,
        project_image_2: null,
        project_image_3: null,
        project_image_4: null,
        project_image_5: null,
        project_image_6: null,
        main_title_tag: "h2",
banner_title_tag: "h1",
side_title_tag: "h2",
        banner_image_alt: "",
location_image_alt: "",
side_image_alt: "",
    });
    // const [formSeoContentData, setFormSeoContentData] = useState({
    //     meta_title: "",
    //     meta_description: "",
    //     meta_keywords: "",
    //     canonical_url: "",
    //     meta_robots_index: "index",
    //     meta_robots_follow: "follow",
    //     include_in_sitemap: true,
    //     sitemap_change_frequency: DEFAULT_SITEMAP_CHANGE_FREQUENCY,
    //     sitemap_priority: String(DEFAULT_SITEMAP_PRIORITY),
    //     og_title: "",
    //     og_description: "",
    //     og_image: "",
    //     custom_schema: ""
    // });

    const [seoRow, setSeoRow] = useState(null);           // existing seo_tag row (null = will be created)
    const [seoFormData, setSeoFormData] = useState(null);  // data handed to GlobalSeoForm
    const [selectedId, setSelectedId] = useState(null);
    const [blogsList, setBlogsList] = useState([]);
    const [selectedBlogIds, setSelectedBlogIds] = useState([]);
    const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER_STATE);
    const [cityContent, setCityContent] = useState(() => getCityContent());
    const [activeTab, setActiveTab] = useState("basic");
    const updateCityContent = (section, patch) =>
        setCityContent((previous) => ({ ...previous, [section]: { ...previous[section], ...patch } }));
    const [citySettings, setCitySettings] = useState({
        siteVisitTitle: "Book a Site Visit",
        siteVisitTitleTag: "h4",
        siteVisitDescription: "Expert designers will visit your {city} property.",
        siteVisitButtonText: "Schedule Now",
        siteVisitButtonUrl: "/contact",
        promiseTitle: "The Promise",
        promiseTitleTag: "h4",
        promiseItems: DEFAULT_PROMISE_ITEMS,
        serviceAreasTitle: "Service Areas",
        serviceAreasTitleTag: "h4",
        nearbyCitiesTitle: "Nearby Cities",
        nearbyCitiesTitleTag: "h2",
        serviceAreasList: defaultServiceAreaList(),
        nearbyCitiesList: defaultNearbyCityList(),
        projectAlts: Array(6).fill(""),
        projectImages: [],
    });
    const fetchContentManagerPages = useCallback(async () => {
        try {
            const response = await api.get("/cms-city", {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Send auth token
                },
            });

            setPagesList(Array.isArray(response.data) ? response.data : []);
            if (!Array.isArray(response.data) && response.data?.id) setSelectedId(response.data.id);
            try {
                const blogResponse = await api.get("/cms-blog", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setBlogsList(Array.isArray(blogResponse.data) ? blogResponse.data : []);
            } catch {
                setBlogsList([]);
            }
            setLoading(false);

        } catch (err) {
            toast.error(err.response?.data?.message ?? "Error fetching data. Please try again.");
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchContentManagerPages();
    }, [fetchContentManagerPages]);

    const getCityMediaPreview = (cityType, slot) => {
        const item = pagesList.find((page) => String(page.city_type).toLowerCase() === String(cityType || "").toLowerCase());
        if (!item) return "";
        if (slot === "mobile_banner") return item.mobile_banner_image || "";
        const projectMatch = /^project_(\d+)$/.exec(String(slot || ""));
        return projectMatch ? (item[`project_image_${projectMatch[1]}`] || "") : "";
    };

    // Handle input change for text fields and image
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        const isImageUpload = ["location_image", "side_image", "banner_image", "mobile_banner_image"].includes(name)
            || /^project_image_[1-6]$/.test(name);
        if (isImageUpload && files?.length > 0) {
            if (!validateImage(files[0])) {
                e.target.value = "";
                return;
            }
            setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    // Uploads one gallery photo / thumbnail / video file and returns its URL ("" on failure)
    const uploadCityMedia = async (file, { kind = "image", onProgress } = {}) => {
        if (kind === "video" ? !validateVideo(file) : !validateImage(file)) return "";
        const body = new FormData();
        body.append("file", file);
        try {
            const { data } = await api.post(CITY_MEDIA_UPLOAD_PATH, body, {
                headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
                timeout: kind === "video" ? 0 : 60000,
                onUploadProgress: (event) => {
                    if (onProgress && event.total) onProgress(Math.min(100, Math.round((event.loaded * 100) / event.total)));
                },
            });
            const url = data?.url || data?.path || data?.image || data?.video || data?.location || "";
            if (!url) throw new Error("The upload response did not contain a URL.");
            toast.success(kind === "video" ? "Video uploaded." : "Image uploaded.");
            return url;
        } catch (error) {
            const status = error.response?.status;
            toast.error(
                status === 404 ? "Upload endpoint not found on the server (POST /cms-city/media). Ask your developer to add it - see city-media-upload.example.ts."
                : status === 413 ? "The server rejected the file because it is too large (check the web server upload limit)."
                : (error.response?.data?.message ?? error.message ?? "Upload failed.")
            );
            return "";
        }
    };

    const updateCitySetting = (name, value) => {
        setCitySettings((previous) => ({ ...previous, [name]: value }));
    };

    const updatePromiseItem = (index, key, value) => {
        setCitySettings((previous) => ({
            ...previous,
            promiseItems: previous.promiseItems.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
        }));
    };

    const toggleBlogSelection = (blogId) => {
        const id = String(blogId);
        setSelectedBlogIds((previous) => previous.includes(id)
            ? previous.filter((selected) => selected !== id)
            : (previous.length >= 6 ? previous : [...previous, id]));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
       
        const formDataToSend = new FormData();
        const skippedServiceRows = countFilledRows(citySettings.serviceAreasList) - rowsToEntries(citySettings.serviceAreasList, false).length;
        const skippedNearbyRows = countFilledRows(citySettings.nearbyCitiesList) - rowsToEntries(citySettings.nearbyCitiesList, true).length;
        if (skippedServiceRows > 0 || skippedNearbyRows > 0) {
            toast.warning(`${skippedServiceRows + skippedNearbyRows} incomplete row(s) in Service Areas / Nearby Cities were skipped (each needs a name and a URL starting with /).`);
        }
        const nextCitySettings = {
            siteVisit: {
                title: citySettings.siteVisitTitle,
                titleTag: citySettings.siteVisitTitleTag,
                description: citySettings.siteVisitDescription,
                buttonText: citySettings.siteVisitButtonText,
                buttonUrl: citySettings.siteVisitButtonUrl,
            },
            promiseTitle: citySettings.promiseTitle,
            promiseTitleTag: citySettings.promiseTitleTag,
            promiseItems: citySettings.promiseItems
                .filter((item) => (item.title || "").trim() || (item.description || "").trim())
                .map((item) => ({ iconName: item.iconName, title: (item.title || "").trim(), description: (item.description || "").trim() })),
            serviceAreasTitle: citySettings.serviceAreasTitle,
            serviceAreasTitleTag: citySettings.serviceAreasTitleTag,
            serviceAreas: rowsToEntries(citySettings.serviceAreasList, false),
            nearbyCitiesTitle: citySettings.nearbyCitiesTitle,
            nearbyCitiesTitleTag: citySettings.nearbyCitiesTitleTag,
            nearbyCities: rowsToEntries(citySettings.nearbyCitiesList, true),
            designInspirationBlogIds: selectedBlogIds,
            content: prepareContentForSave(cityContent),
            sectionOrder: {
                desktop: normalizeOrder(sectionOrder.desktop),
                mobile: normalizeOrder(sectionOrder.mobile),
            },
        };
        formDataToSend.append("city_settings", JSON.stringify(nextCitySettings));
        // FIX: Appended city_type to the payload so it actually saves
        formDataToSend.append("city_type", formData.city_type); 
        formDataToSend.append("main_title", formData.main_title);
        formDataToSend.append("main_description", formData.main_description);
        formDataToSend.append("side_title", formData.side_title);
        formDataToSend.append("side_description", formData.side_description);
        formDataToSend.append("banner_title", formData.banner_title);
        formDataToSend.append("banner_subtitle", formData.banner_subtitle);
        formDataToSend.append("main_title_tag", formData.main_title_tag);
formDataToSend.append("banner_title_tag", formData.banner_title_tag);
formDataToSend.append("side_title_tag", formData.side_title_tag);
        formDataToSend.append("banner_image_alt", (formData.banner_image_alt || "").trim());
formDataToSend.append("location_image_alt", (formData.location_image_alt || "").trim());
formDataToSend.append("side_image_alt", (formData.side_image_alt || "").trim());

        if (formData.location_image) {
            formDataToSend.append("location_image", formData.location_image);
        }

        if (formData.side_image) {
            formDataToSend.append("side_image", formData.side_image);
        }

        if (formData.banner_image) {
            formDataToSend.append("banner_image", formData.banner_image);
        }
        if (formData.mobile_banner_image) {
            formDataToSend.append("mobile_banner_image", formData.mobile_banner_image);
        }
        for (let index = 0; index < 6; index += 1) {
            const fieldName = `project_image_${index + 1}`;
            if (formData[fieldName]) {
                formDataToSend.append(fieldName, formData[fieldName]);
            }
            formDataToSend.append(
                `${fieldName}_alt`,
                String(citySettings.projectAlts[index] || "").trim(),
            );
        }
        try {
            // Send POST request to save form data
            const response = await api.patch(`/cms-city/${selectedId}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`, // Send auth token
                },
            });

            // Handle success response
            if (response.status === 200) {
                await fetchContentManagerPages();
                toast.success("City page saved successfully.");
                setFormData({
                    city_type: "",
                    main_title: "",
                    main_description: "",
                    location_image: null,
                    side_title: "",
                    side_description: "",
                    side_image: null,
                    banner_title: "",
                    banner_subtitle: "",
                    main_title_tag: "h2",
banner_title_tag: "h1",
side_title_tag: "h2",
                    banner_image: null,
                    mobile_banner_image: null,
                    project_image_1: null,
                    project_image_2: null,
                    project_image_3: null,
                    project_image_4: null,
                    project_image_5: null,
                    project_image_6: null,
                    banner_image_alt: "",
                    location_image_alt: "",
                    side_image_alt: "",
                });
                setCitySettings({
                    siteVisitTitle: "Book a Site Visit",
        siteVisitTitleTag: "h4",
                    siteVisitDescription: "Expert designers will visit your {city} property.",
                    siteVisitButtonText: "Schedule Now",
                    siteVisitButtonUrl: "/contact",
                    promiseTitle: "The Promise",
        promiseTitleTag: "h4",
                    promiseItems: DEFAULT_PROMISE_ITEMS,
                    serviceAreasTitle: "Service Areas",
                    serviceAreasTitleTag: "h4",
                    nearbyCitiesTitle: "Nearby Cities",
                    nearbyCitiesTitleTag: "h2",
                    serviceAreasList: defaultServiceAreaList(),
                    nearbyCitiesList: defaultNearbyCityList(),
                    projectAlts: Array(6).fill(""),
                    projectImages: [],
                });
                setSelectedBlogIds([]);
                setCityContent(getCityContent());
                setSectionOrder(DEFAULT_SECTION_ORDER_STATE);
                setActiveTab("basic");

                // Close modal and clear form data
                setTimeout(() => {
                    document.getElementById('addNewpageModal').classList.remove('show');
                    document.querySelector('.modal-backdrop').remove();
                    document.body.classList.remove('modal-open');
                    document.body.style = "";
                }, 1000);

            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message ?? "Error submitting form. Please try again.");
            console.error("Error:", error);
        }
    };

    // Set form data when edit button is clicked
    const handleEditClick = (item) => {
        setSelectedId(item.id);
        setFormData({
            city_type: item.city_type,
            main_title: item.main_title,
            main_description: item.main_description,
            location_image: null,
            side_title: item.side_title,
            side_description: item.side_description,
            side_image: null,
            banner_title: item.banner_title ?? "",
            banner_subtitle: item.banner_subtitle ?? "",
            banner_image: null,
            mobile_banner_image: null,
            project_image_1: null,
            project_image_2: null,
            project_image_3: null,
            project_image_4: null,
            project_image_5: null,
            project_image_6: null,
            main_title_tag: item.main_title_tag || "h2",
banner_title_tag: item.banner_title_tag || "h1",
side_title_tag: item.side_title_tag || "h2",
banner_image_alt: item.banner_image_alt ?? "",
location_image_alt: item.location_image_alt ?? "",
side_image_alt: item.side_image_alt ?? ""
        });
        const itemSettings = item.city_settings ?? item.city_settings_json;
        const hydratedSettings = settingsFromItem({ ...item, city_settings: itemSettings });
        const projectMediaAlts = Array.from({ length: 6 }, (_, index) =>
            item?.[`project_image_${index + 1}_alt`] || hydratedSettings.projectAlts[index] || ""
        );
        setCitySettings({
            siteVisitTitle: hydratedSettings.siteVisitTitle,
            siteVisitTitleTag: hydratedSettings.siteVisitTitleTag,
            siteVisitDescription: hydratedSettings.siteVisitDescription,
            siteVisitButtonText: hydratedSettings.siteVisitButtonText,
            siteVisitButtonUrl: hydratedSettings.siteVisitButtonUrl,
            promiseTitle: hydratedSettings.promiseTitle,
            promiseTitleTag: hydratedSettings.promiseTitleTag,
            promiseItems: hydratedSettings.promiseItems,
            serviceAreasTitle: hydratedSettings.serviceAreasTitle,
            serviceAreasTitleTag: hydratedSettings.serviceAreasTitleTag,
            nearbyCitiesTitle: hydratedSettings.nearbyCitiesTitle,
            nearbyCitiesTitleTag: hydratedSettings.nearbyCitiesTitleTag,
            serviceAreasList: hydratedSettings.serviceAreasList,
            nearbyCitiesList: hydratedSettings.nearbyCitiesList,
            projectAlts: projectMediaAlts,
            projectImages: hydratedSettings.projectImages,
        });
        const selectedIds = Array.isArray(parseSettingsObject(itemSettings).designInspirationBlogIds)
            ? parseSettingsObject(itemSettings).designInspirationBlogIds.map((id) => String(id))
            : hydratedSettings.designInspirationBlogIds;
        setSelectedBlogIds(selectedIds.length ? selectedIds : blogsList.slice(0, 4).map((blog) => String(blog.id)));
        const parsedItemSettings = parseSettingsObject(itemSettings);
        setCityContent(getCityContent(parsedItemSettings.content));
        setSectionOrder(getSectionOrder(parsedItemSettings.sectionOrder));
        setActiveTab("basic");
    };

    const setMainDescriptionData = (data) => {
        setFormData((prevData) => ({ ...prevData, main_description: data }));
    }

    const setSideDescriptionData = (data) => {
        setFormData((prevData) => ({ ...prevData, side_description: data }));
    }

    // const handleManageSeoContentClick = (id, item) => {
    //     setSelectedId(id);
    //     let schemaText = "";
    //     if (item?.custom_schema) {
    //         if (typeof item.custom_schema === "string") {
    //             try { schemaText = JSON.stringify(JSON.parse(item.custom_schema), null, 2); }
    //             catch (e) { schemaText = item.custom_schema; }
    //         } else {
    //             schemaText = JSON.stringify(item.custom_schema, null, 2);
    //         }
    //     }
    //     setFormSeoContentData({
    //         meta_title: item?.meta_title ?? "",
    //         meta_description: item?.meta_description ?? "",
    //         meta_keywords: item?.meta_keywords ?? "",
    //         canonical_url: item?.canonical_url ?? "",
    //         meta_robots_index: item?.meta_robots_index ?? "index",
    //         meta_robots_follow: item?.meta_robots_follow ?? "follow",
    //         include_in_sitemap: item?.include_in_sitemap ?? true,
    //         sitemap_change_frequency: item?.sitemap_change_frequency ?? DEFAULT_SITEMAP_CHANGE_FREQUENCY,
    //         sitemap_priority: String(item?.sitemap_priority ?? DEFAULT_SITEMAP_PRIORITY),
    //         og_title: item?.og_title ?? "",
    //         og_description: item?.og_description ?? "",
    //         og_image: item?.og_image ?? "",
    //         custom_schema: schemaText
    //     });
    // };

    // const handleSeoContentInputChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     setFormSeoContentData((prevData) => ({
    //         ...prevData,
    //         [name]: type === "checkbox" ? checked : value
    //     }));
    // };

    // const handleSeoContentSubmit = async (e) => {
    //     e.preventDefault();
    //             if (formSeoContentData.meta_title.length > 60) { toast.error("Meta title must be 60 characters or less."); return; }
    //     if (formSeoContentData.meta_description.length > 160) { toast.error("Meta description must be 160 characters or less."); return; }
    //     if (formSeoContentData.og_title.length > 60) { toast.error("OG title must be 60 characters or less."); return; }
    //     if (formSeoContentData.og_description.length > 200) { toast.error("OG description must be 200 characters or less."); return; }

    //     let customSchema = null;
    //     if (formSeoContentData.custom_schema && formSeoContentData.custom_schema.trim() !== "") {
    //         try {
    //             customSchema = JSON.parse(formSeoContentData.custom_schema);
    //         } catch (err) {
    //             toast.error("Invalid JSON in Custom Schema. Please check your formatting.");
    //             return;
    //         }
    //     }

    //     const formDataToSend = {
    //         meta_title: formSeoContentData.meta_title,
    //         meta_description: formSeoContentData.meta_description,
    //         meta_keywords: formSeoContentData.meta_keywords,
    //         canonical_url: formSeoContentData.canonical_url,
    //         meta_robots_index: formSeoContentData.meta_robots_index,
    //         meta_robots_follow: formSeoContentData.meta_robots_follow,
    //         include_in_sitemap: formSeoContentData.include_in_sitemap,
    //         sitemap_change_frequency: formSeoContentData.sitemap_change_frequency,
    //         sitemap_priority: formSeoContentData.sitemap_priority,
    //         og_title: formSeoContentData.og_title,
    //         og_description: formSeoContentData.og_description,
    //         og_image: formSeoContentData.og_image,
    //         custom_schema: customSchema,
    //     };

    //     try {
    //         // Send POST request to save form data
    //         const response = await api.patch(`/cms-city/seo-content/${selectedId}`, formDataToSend, {
    //             headers: {
    //                 Authorization: `Bearer ${authToken}`, // Send auth token
    //             },
    //         });

    //         // Handle success response
    //         if (response.status === 200) {
    //             fetchContentManagerPages();
    //             toast.success("SEO Content saved successfully.");
    //             // Close modal and clear form data
    //             document.getElementById('seoContentModalClose').click();
    //         } else {
    //             toast.error("Error submitting form. Please try again.");
    //         }
    //     } catch (error) {
    //         toast.error(error.response?.data?.message ?? "Error submitting form. Please try again.");
    //         console.error("Error:", error);
    //     }
    // }

        const normPath = (v) => {
        let p = String(v || "").trim().toLowerCase().replace(/^https?:\/\/(www\.)?hcinterior\.in/, "").split(/[?#]/)[0];
        if (!p.startsWith("/")) p = "/" + p;
        if (p.length > 1) p = p.replace(/\/+$/, "");
        return p;
    };

    const handleManageSeoContentClick = async (item) => {
        setSelectedId(item.id);
        setSeoRow(null);
        setSeoFormData(null);

        const path = cityUrlMap[item.city_type] || `/interior-designers-in-${item.city_type}`;
        const p = normPath(path);
        const keys = [p];
        if (p.startsWith("/interior-designers-in-")) keys.push("/services-detail/" + p.replace("/interior-designers-in-", ""));

        try {
            const { data } = await api.get("/seo-tag", { headers: { Authorization: `Bearer ${authToken}` } });
            // the row the website reads: newest active match, else newest match
            const match = (Array.isArray(data) ? data : [])
                .filter((r) => keys.includes(normPath(r.page_name)))
                .sort((x, y) =>
                    (y.status === "active") - (x.status === "active") ||
                    new Date(y.updated_at) - new Date(x.updated_at) ||
                    y.id - x.id)[0];
            if (match) {
                setSeoRow(match);
                const nextStatus = !canPublish && match.status === "active" ? "inactive" : (match.status || "active");
                if (!canPublish && match.status === "active") {
                    toast.info("Editing an active SEO record will save it as inactive until an admin republishes it.");
                }
                setSeoFormData({ ...match, status: nextStatus });
                return;
            }
        } catch (err) {
            toast.error(err.response?.data?.message ?? "Could not load SEO data. Please try again.");
            return;
        }

        // No seo_tag row yet: prefill from the old seo_content so nothing is lost on first save
        const sc = item.seo_content || {};
        let schema = null;
        if (sc.custom_code) {
            try { schema = JSON.parse(String(sc.custom_code).replace(/<script[^>]*>/gi, "").replace(/<\/script>/gi, "")); }
            catch (e) { schema = null; }
        }
        setSeoFormData({
            page_name: path,
            meta_title: sc.meta_title ?? "",
            meta_description: sc.meta_description ?? "",
            keywords: sc.meta_keywords ?? "",
            canonical_url: sc.canonical_url ?? "",
            meta_robots: `${sc.meta_robots_index || "index"}, ${sc.meta_robots_follow || "follow"}`,
            include_in_sitemap: sc.include_in_sitemap ?? true,
            sitemap_change_frequency: sc.sitemap_change_frequency || DEFAULT_SITEMAP_CHANGE_FREQUENCY,
            sitemap_priority: String(sc.sitemap_priority ?? DEFAULT_SITEMAP_PRIORITY),
            custom_schema: schema,
            status: canPublish ? "active" : "inactive",
        });
    };

    const handleSeoSubmit = async (formattedData) => {
        if ((formattedData.meta_title || "").length > 65) { toast.error("Meta title must be 65 characters or less."); return; }
        if ((formattedData.meta_description || "").length > 160) { toast.error("Meta description must be 160 characters or less."); return; }
        if ((formattedData.og_title || "").length > 65) { toast.error("OG title must be 65 characters or less."); return; }
        if ((formattedData.og_description || "").length > 200) { toast.error("OG description must be 200 characters or less."); return; }

        try {
            if (!canPublish && formattedData.status === "active") {
                toast.info(getPublishWorkflowMessage("This SEO record"));
            }
            const headers = { Authorization: `Bearer ${authToken}` };
            if (seoRow) {
                await api.patch(`/seo-tag/${seoRow.id}`, formattedData, { headers });
            } else {
                await api.post("/seo-tag", formattedData, { headers });
            }
            toast.success("SEO saved successfully.");
            document.getElementById("seoContentModalClose").click();
        } catch (error) {
            const msg = error.response?.data?.message;
            toast.error(Array.isArray(msg) ? msg.join(", ") : msg ?? "Error saving SEO. Please try again.");
        }
    };

    // Derived from existing pagesList + selectedId — no new state added.
    const currentEditItem = pagesList.find((p) => p.id === selectedId);
    const editTabs = [
        { id: "basic", label: "Basic Info & Editor" },
        { id: "images", label: "Hero & Images" },
        { id: "sections", label: "Page Sections" },
        { id: "faqs", label: `FAQs (${cityContent.faqs.items.length})` },
        { id: "sidebar", label: "Sidebar & Cities" },
        { id: "order", label: "Section Order" },
        { id: "preview", label: "Live Preview" },
    ];
    const paneClass = (id) => (activeTab === id ? "" : "d-none");
    // Photos uploaded in the old fixed "Project Photo 1-6" slots (offered for import into the gallery)
    const legacyPhotos = Array.from({ length: 6 }, (_, index) => ({
        src: getCityMediaPreview(formData.city_type, `project_${index + 1}`),
        alt: citySettings.projectAlts[index] || "",
    })).filter((photo) => photo.src);
    const previewSrc = formData.city_type
        ? (cityUrlMap[formData.city_type] || `/interior-designers-in-${formData.city_type}`)
        : "";

    return (
        <AuthMainLayout>
            <div className="container my-5">
                <h1 className="mb-4 text-center">CMS - City</h1>
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
                                    <th>City Type</th>
                                    <th>Main Title</th>
                                    <th>Main Description</th>
                                    <th>Location Image</th>
                                    <th>Side Title</th>
                                    <th>Side Description</th>
                                    <th>Side Image</th>
                                    <th>Banner Image</th>
                                    <th>SEO Content</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagesList && pagesList?.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td className="text-capitalize">{item.city_type}</td>
                                        <td>{item.main_title}</td>
                                        <td>
                                            <span className="d-inline-block text-truncate" style={{ width: "250px" }} dangerouslySetInnerHTML={{ __html: item.main_description }}></span>
                                        </td>
                                        <td>
                                            {item.location_image && <img src={item.location_image} alt={item.location_image_alt || "Location Image"}height="80" decoding="async"  loading="lazy" />}
                                        </td>
                                        <td>{item.side_title}</td>
                                        <td>
                                            <span className="d-inline-block text-truncate" style={{ width: "250px" }} dangerouslySetInnerHTML={{ __html: item.side_description }}></span>
                                        </td>
                                        <td>
                                            {item.side_image && <img src={item.side_image} alt={item.side_image_alt || "Side Image"} height="80" decoding="async"  loading="lazy" />}
                                        </td>
                                        <td>
                                            {item.banner_image && <img src={item.banner_image} alt={item.banner_image_alt || "Banner Image"} height="80" decoding="async" loading="lazy" />}
                                        </td>
                                        <td width={150}>
                                            <button onClick={() => handleManageSeoContentClick(item)} className="btn btn-info text-nowrap" type="button" data-bs-toggle="modal" data-bs-target="#seoContentModal">SEO Content</button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleEditClick(item)} type="button" className="read_morebtn" data-bs-toggle="modal" data-bs-target="#addNewpageModal">
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

            <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-focus="false">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">{formData.city_type ? `Edit City Page: ${niceCityName(formData.city_type)}` : "Edit City Page"}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
<form
                            onSubmit={handleSubmit}
                            onInvalidCapture={() => {
                                setActiveTab("basic");
                                toast.error("Please fill the required fields in the Basic Info tab.", { toastId: "city-required-fields" });
                            }}
                        >
                            <div className="modal-body">
                                <ul className="nav nav-pills nav-fill gap-2 mb-4" role="tablist">
                                    {editTabs.map((tab) => (
                                        <li className="nav-item" key={tab.id}>
                                            <button
                                                type="button"
                                                role="tab"
                                                aria-selected={activeTab === tab.id}
                                                className={`nav-link border ${activeTab === tab.id ? "active fw-bold" : "bg-white text-dark"}`}
                                                onClick={() => setActiveTab(tab.id)}
                                            >
                                                {tab.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {/* ===== TAB: Basic Info & Editor ===== */}
                                <div className={paneClass("basic")}>
                                    <div className="row">

                                <div className="mb-3 col-md-12">
                                <label className="form-label">City Type</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="city_type"
                                        placeholder="City Type"
                                        value={formData.city_type}
                                        onChange={handleInputChange}
                                        required // FIX: Removed disabled, added required
                                    />
                                    <small className="text-muted">This acts as the URL slug (e.g. noida, new-delhi)</small>
                                </div>

                                <div className="mb-3 col-md-9">
                                    <label className="form-label">Main Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="main_title"
                                        placeholder="Main Title"
                                        value={formData.main_title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3 col-md-3">
    <label className="form-label">Heading Tag</label>
    <select
        className="form-select"
        name="main_title_tag"
        value={formData.main_title_tag}
        onChange={handleInputChange}
    >
        {HEADING_TAGS.map((t) => (
            <option key={t} value={t}>{t.toUpperCase()}</option>
        ))}
    </select>
</div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Main Description</label>
                                    <CKEditorComponent pageData={formData.main_description} setPageData={setMainDescriptionData} />
                                </div>

                                <div className="mb-3 col-md-9">
                                    <label className="form-label">Side Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="side_title"
                                        placeholder="Side Title"
                                        value={formData.side_title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3 col-md-3">
    <label className="form-label">Heading Tag</label>
    <select
        className="form-select"
        name="side_title_tag"
        value={formData.side_title_tag}
        onChange={handleInputChange}
    >
        {HEADING_TAGS.map((t) => (
            <option key={t} value={t}>{t.toUpperCase()}</option>
        ))}
    </select>
</div>

                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Side Description</label>
                                    <CKEditorComponent pageData={formData.side_description} setPageData={setSideDescriptionData} />
                                </div>

                                    </div>
                                </div>

                                {/* ===== TAB: Hero & Images ===== */}
                                <div className={paneClass("images")}>
                                    <div className="row">
                                <div className="col-md-12">
                                    <hr />
                                    <h5 className="mb-3">Hero Banner</h5>
                                </div>

                                <div className="mb-3 col-md-9">
                                    <label className="form-label">Banner Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="banner_title"
                                        placeholder="Banner Title"
                                        value={formData.banner_title}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="mb-3 col-md-3">
    <label className="form-label">Heading Tag</label>
    <select
        className="form-select"
        name="banner_title_tag"
        value={formData.banner_title_tag}
        onChange={handleInputChange}
    >
        {HEADING_TAGS.map((t) => (
            <option key={t} value={t}>{t.toUpperCase()}</option>
        ))}
    </select>
</div>

                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Banner Subtitle</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="banner_subtitle"
                                        placeholder="Banner Subtitle"
                                        value={formData.banner_subtitle}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Banner Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="banner_image"
                                        accept="image/webp"
                                        onChange={handleInputChange}
                                    />
                                    <small className="text-muted d-block">Only .webp, max 200 KB.</small>
<input
    type="text"
    className="form-control mt-2"
    name="banner_image_alt"
    maxLength={125}
    placeholder="Banner image alt text (for SEO)"
    value={formData.banner_image_alt || ""}
    onChange={handleInputChange}
/>
                                    {currentEditItem?.banner_image && (
                                        <div className="mt-2">
                                            <small className="text-muted d-block">Current Banner Image:</small>
                                            <img src={currentEditItem.banner_image} alt="Current Banner" height="80" decoding="async" loading="lazy" />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Mobile Hero Banner (optional)</label>
                                    <input type="file" className="form-control" name="mobile_banner_image" accept="image/webp" onChange={handleInputChange} />
                                    <small className="text-muted d-block">Upload a mobile-specific WebP banner, max 200 KB. It uses the same Banner Image Alt Text above.</small>
                                    {getCityMediaPreview(formData.city_type, "mobile_banner") && (
                                        <div className="mt-2">
                                            <small className="text-muted d-block">Current Mobile Banner:</small>
                                            <img src={getCityMediaPreview(formData.city_type, "mobile_banner")} alt={formData.banner_image_alt || "Current mobile hero banner"} height="100" style={{ maxWidth: "180px", objectFit: "cover" }} decoding="async" loading="lazy" />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Location Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="location_image"
                                        accept="image/webp"
                                        onChange={handleInputChange}
                                    />
                                    <small className="text-muted d-block">Only .webp, max 200 KB.</small>
<input
    type="text"
    className="form-control mt-2"
    name="location_image_alt"
    maxLength={125}
    placeholder="Location image alt text (for SEO)"
    value={formData.location_image_alt || ""}
    onChange={handleInputChange}
/>
                                    {currentEditItem?.location_image && (
                                        <div className="mt-2">
                                            <small className="text-muted d-block">Current Location Image:</small>
                                            <img src={currentEditItem.location_image} alt="Current Location" height="80" decoding="async" loading="lazy" />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Side Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        name="side_image"
                                        accept="image/webp"
                                        onChange={handleInputChange}
                                    />
                                    <small className="text-muted d-block">Only .webp, max 200 KB.</small>
<input
    type="text"
    className="form-control mt-2"
    name="side_image_alt"
    maxLength={125}
    placeholder="Side image alt text (for SEO)"
    value={formData.side_image_alt || ""}
    onChange={handleInputChange}
/>
                                    {currentEditItem?.side_image && (
                                        <div className="mt-2">
                                            <small className="text-muted d-block">Current Side Image:</small>
                                            <img src={currentEditItem.side_image} alt="Current Side" height="80" decoding="async" loading="lazy" />
                                        </div>
                                    )}
                                </div>

                                    </div>
                                </div>

                                {/* ===== TAB: Page Sections ===== */}
                                <div className={paneClass("sections")}>
                                    <div className="row">
                                        <ProcessEditor value={cityContent.process} onChange={updateCityContent} />
                                        <ProjectsHeadingEditor value={cityContent.projects} onChange={updateCityContent} />

                                        <ProjectGalleryEditor
                                            items={cityContent.projects.gallery}
                                            onChange={(gallery) => updateCityContent("projects", { gallery })}
                                            onUpload={uploadCityMedia}
                                            legacyPhotos={legacyPhotos}
                                        />
                                        <BlogsHeadingEditor value={cityContent.blogs} onChange={updateCityContent} />
                                <div className="col-12"><hr /><h5 className="mb-2">Design Inspiration Blogs</h5><p className="text-muted small">Choose up to six blogs for this city's Design Inspiration block. If no selection is saved, the page continues showing the same first four blogs as its default.</p></div>
                                <div className="col-12">
                                    {blogsList.length ? (
                                        <div className="row border rounded p-3 mx-0" style={{ maxHeight: "240px", overflowY: "auto" }}>
                                            {blogsList.map((blog) => {
                                                const checked = selectedBlogIds.includes(String(blog.id));
                                                return <div className="col-md-6 form-check mb-2" key={blog.id}>
                                                    <input className="form-check-input" id={`city-blog-${blog.id}`} type="checkbox" checked={checked} onChange={() => toggleBlogSelection(blog.id)} disabled={!checked && selectedBlogIds.length >= 6} />
                                                    <label className="form-check-label" htmlFor={`city-blog-${blog.id}`}>{blog.title || `Blog #${blog.id}`}</label>
                                                </div>;
                                            })}
                                        </div>
                                    ) : <div className="alert alert-light border small">Blog options could not be loaded. Existing default blogs will remain on the page.</div>}
                                </div>

                                        <StatsEditor value={cityContent.stats} onChange={updateCityContent} />
                                        <WhyChooseEditor value={cityContent.whyChoose} onChange={updateCityContent} />
                                    </div>
                                </div>

                                {/* ===== TAB: FAQs ===== */}
                                <div className={paneClass("faqs")}>
                                    <FaqsEditor value={cityContent.faqs} onChange={updateCityContent} />
                                </div>

                                {/* ===== TAB: Sidebar & Cities ===== */}
                                <div className={paneClass("sidebar")}>
                                    <div className="row">
                                <SiteVisitEditor settings={citySettings} onChange={updateCitySetting} />

                                        <PromiseEditor settings={citySettings} onChange={updateCitySetting} />

                                        <LinkRowsEditor
                                            title="Sidebar: Service Areas"
                                            subtitle="Links listed in the sidebar. Only internal paths that start with / are used."
                                            sectionTitle={citySettings.serviceAreasTitle}
                                            onSectionTitle={(value) => updateCitySetting("serviceAreasTitle", value)}
                                            sectionTag={citySettings.serviceAreasTitleTag}
                                            onSectionTag={(value) => updateCitySetting("serviceAreasTitleTag", value)}
                                            rows={citySettings.serviceAreasList}
                                            onChange={(rows) => updateCitySetting("serviceAreasList", rows)}
                                            columns={[
                                                { key: "name", label: "City name", placeholder: "City name", flex: 1, maxLength: 80 },
                                                { key: "url", label: "URL", placeholder: "/interior-designers-in-noida", flex: 1.2, kind: "path", maxLength: 200 },
                                            ]}
                                            newRow={{ name: "", url: "" }}
                                            addLabel="Add Area"
                                            max={60}
                                            twoUp
                                        />

                                        <LinkRowsEditor
                                            title="Nearby Cities"
                                            subtitle="Image cards at the bottom of the page."
                                            sectionTitle={citySettings.nearbyCitiesTitle}
                                            onSectionTitle={(value) => updateCitySetting("nearbyCitiesTitle", value)}
                                            sectionTag={citySettings.nearbyCitiesTitleTag}
                                            onSectionTag={(value) => updateCitySetting("nearbyCitiesTitleTag", value)}
                                            rows={citySettings.nearbyCitiesList}
                                            onChange={(rows) => updateCitySetting("nearbyCitiesList", rows)}
                                            columns={[
                                                { key: "name", label: "City name", placeholder: "City name", flex: 1, maxLength: 80 },
                                                { key: "url", label: "URL", placeholder: "/interior-designers-in-delhi", flex: 1.2, kind: "path", maxLength: 200 },
                                                { key: "image", label: "Image URL", placeholder: "Image URL (optional)", flex: 1.6, kind: "image", maxLength: 500 },
                                            ]}
                                            newRow={{ name: "", url: "", image: "" }}
                                            addLabel="Add City"
                                            max={12}
                                            hint="Leave the image URL empty to use the existing default city image."
                                        />

                                    </div>
                                </div>

                                {/* ===== TAB: Section Order ===== */}
                                <div className={paneClass("order")}>
                                    <SectionOrderManager value={sectionOrder} onChange={setSectionOrder} />
                                </div>

                                {/* ===== TAB: Live Preview ===== */}
                                <div className={paneClass("preview")}>
                                    {activeTab === "preview" && <LivePreviewPane src={previewSrc} />}
                                </div>
                            </div>
                            <div className="modal-footer justify-content-end gap-2">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button className="px-5 read_morebtn" type="submit">
                                    Save Changes
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="seoContentModal" tabIndex="-1" aria-labelledby="seoContentModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="seoContentModalLabel">Manage SEO Content</h1>
                            <button type="button" id="seoContentModalClose" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {/* <form onSubmit={handleSeoContentSubmit}>
                            <div className="modal-body row">
                                
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Meta Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="meta_title"
                                        placeholder="Meta Title"
                                        value={formSeoContentData?.meta_title}
                                        onChange={handleSeoContentInputChange}
                                        required maxLength={60}
                                    />
                                    <Counter value={formSeoContentData.meta_title} limit={60} />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Meta Description</label>
                                    <textarea
                                        className="form-control"
                                        name="meta_description"
                                        placeholder="Meta Description"
                                        value={formSeoContentData?.meta_description}
                                        onChange={handleSeoContentInputChange}
                                        rows="3"
                                        required maxLength={160}
                                    >
                                        <Counter value={formSeoContentData.meta_description} limit={160} />
                                    </textarea>
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Canonical URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="canonical_url"
                                        placeholder="https://hcinterior.in/interior-designers-in-noida"
                                        value={formSeoContentData?.canonical_url}
                                        onChange={handleSeoContentInputChange}
                                    />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label className="form-label">Meta Keywords</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="meta_keywords"
                                        placeholder="Meta Keywords"
                                        value={formSeoContentData?.meta_keywords}
                                        onChange={handleSeoContentInputChange}
                                    />
                                </div>

                                <div className="mb-3 col-md-12">
    <label className="form-label">OG Title <small className="text-muted">(social share title; blank uses Meta Title)</small></label>
    <input type="text" className="form-control" name="og_title" value={formSeoContentData.og_title} onChange={handleSeoContentInputChange} maxLength={60} placeholder={formSeoContentData.meta_title} />
    <Counter value={formSeoContentData.og_title} limit={60} />
</div>
<div className="mb-3 col-md-12">
    <label className="form-label">OG Description <small className="text-muted">(blank uses Meta Description)</small></label>
    <textarea className="form-control" name="og_description" rows="2" value={formSeoContentData.og_description} onChange={handleSeoContentInputChange} maxLength={200} placeholder={formSeoContentData.meta_description} />
    <Counter value={formSeoContentData.og_description} limit={200} />
</div>

<div className="mb-3 col-md-12">
    <label className="form-label">OG Image URL</label>
    <input type="text" className="form-control" name="og_image" placeholder="https://..." value={formSeoContentData.og_image} onChange={handleSeoContentInputChange} />
    <small className="text-muted d-block">Recommended 1200×630 px. Blank uses the city banner.</small>
    {formSeoContentData.og_image && (
        <img key={formSeoContentData.og_image} src={formSeoContentData.og_image} alt="OG preview" className="mt-2 border rounded"
             style={{ maxWidth: "100%", maxHeight: 120, objectFit: "cover" }}
             onError={(e) => (e.currentTarget.style.display = "none")} />
    )}
</div>
<div className="mb-3 col-md-12">
    <label className="form-label">Custom Schema.org (JSON Format)</label>
    <textarea className="form-control font-monospace" name="custom_schema" rows="4" placeholder='{ "@context": "https://schema.org", "@type": "LocalBusiness" }' value={formSeoContentData.custom_schema} onChange={handleSeoContentInputChange} />
</div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Search Engine Indexing</label>
                                    <select
                                        className="form-control"
                                        name="meta_robots_index"
                                        value={formSeoContentData.meta_robots_index}
                                        onChange={handleSeoContentInputChange}
                                    >
                                        <option value="index">Index</option>
                                        <option value="noindex">No Index</option>
                                    </select>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Link Following</label>
                                    <select
                                        className="form-control"
                                        name="meta_robots_follow"
                                        value={formSeoContentData.meta_robots_follow}
                                        onChange={handleSeoContentInputChange}
                                    >
                                        <option value="follow">Follow</option>
                                        <option value="nofollow">No Follow</option>
                                    </select>
                                </div>
                                <div className="mb-3 col-md-12">
                                    <div className="form-check form-switch bg-light rounded border p-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="cityIncludeInSitemap"
                                            name="include_in_sitemap"
                                            checked={Boolean(formSeoContentData.include_in_sitemap)}
                                            onChange={handleSeoContentInputChange}
                                        />
                                        <label className="form-check-label fw-bold ms-2" htmlFor="cityIncludeInSitemap">
                                            Include this city page in sitemap.xml
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Sitemap Change Frequency</label>
                                    <select
                                        className="form-control"
                                        name="sitemap_change_frequency"
                                        value={formSeoContentData.sitemap_change_frequency}
                                        onChange={handleSeoContentInputChange}
                                    >
                                        {SITEMAP_CHANGE_FREQUENCY_OPTIONS.map((option) => (
                                            <option key={option} value={option}>
                                                {option.charAt(0).toUpperCase() + option.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label className="form-label">Sitemap Priority</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="sitemap_priority"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={formSeoContentData.sitemap_priority}
                                        onChange={handleSeoContentInputChange}
                                    />
                                </div>

                                <div className="m-auto mt-2 col-12 d-flex justify-content-center">
                                    <button className="px-5 read_morebtn" type="submit">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form> */}

                        <div className="modal-body">
    {seoFormData ? (
        <GlobalSeoForm initialData={seoFormData} onSubmit={handleSeoSubmit} canPublish={canPublish} />
    ) : (
        <div className="text-center py-4">Loading...</div>
    )}
</div>
                    </div>
                </div>
            </div>
        </AuthMainLayout>
    );
};

export default CmsCity;
