// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { useSelector } from "react-redux";
// import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
// import api from "@/utils/api";
// import { toast } from "react-toastify";


// const CmsReferAndEarn = () => {

//     const authToken = useSelector((state) => state.auth.authToken);
//     const [pagesList, setPagesList] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         title: "",
//         description: "",
//         image: null,
//         item_index: null,
//     });
//     const [selectedId, setSelectedId] = useState(null);

//     const fetchContentManagerPages = useCallback(async () => {
//         try {
//             const response = await api.get('/cms-content/refer_and_earn', {
//                 headers: {
//                     Authorization: `Bearer ${authToken}`, // Send auth token
//                 },
//             });

//             if (response.data && response.data.json_content) {
//                 setPagesList(response.data.json_content);
//                 setSelectedId(response.data.id);
//                 setLoading(false);
//             }


//         } catch (err) {
//             toast.error(err.message || "Failed to fetch data. Please try again.");
//             setLoading(false);
//         }
//     }, [authToken]);

//     useEffect(() => {
//         fetchContentManagerPages();
//     }, [fetchContentManagerPages]);

//     // Handle input change for text fields and image
//     const handleInputChange = (e) => {
//         const { name, value, files } = e.target;
//         if (name === "image" && files.length > 0) {
//             setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
//         } else {
//             setFormData((prevData) => ({ ...prevData, [name]: value }));
//         }
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const formDataToSend = new FormData();
//         formDataToSend.append("title", formData.title);
//         formDataToSend.append("description", formData.description);
//         formDataToSend.append("item_index", formData.item_index);
//         if (formData.image) {
//             formDataToSend.append("image", formData.image);
//         }

//         try {
//             // Send POST request to save form data
//             const response = await api.patch(`/cms-content/update-json-child-image/${selectedId}`, formDataToSend, {
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
//                     title: "",
//                     description: "",
//                     image: null,
//                 });

//                 // Close modal
//                 document.getElementById('addNewpageModalClose').click();

//             } else {
//                 toast.error("Error submitting form. Please try again.");
//             }
//         } catch (error) {
//             toast.error(error.message ?? "Error submitting form. Please try again.");
//             console.error("Error:", error);
//         }
//     };

//     // Set form data when edit button is clicked
//     const handleEditClick = (item, index) => {
//         setFormData({
//             title: item.title,
//             description: item.description,
//             image: null, // Reset image field
//             item_index: index,
//         });
//     };




//     return (
//         <AuthMainLayout>
//             <div className="container my-5">
//                 <h1 className="mb-4 text-center">CMS - Refer And Earn</h1>
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
//                                     <th>Title</th>
//                                     <th>Description</th>
//                                     <th width="80">Image</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {pagesList && pagesList?.map((item, index) => (
//                                     <tr key={index}>
//                                         <td>{index + 1}</td>
//                                         <td>{item.title}</td>
//                                         <td>{item.description}</td>
//                                         <td>
//                                             <img src={item?.image} alt={item.title} height="80" decoding="async"  loading="lazy" />
//                                         </td>
//                                         <td>
//                                             <button onClick={() => handleEditClick(item, index)} type="button" className="read_morebtn" data-bs-toggle="modal" data-bs-target="#addNewpageModal">
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

//             <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="exampleModalLabel">Edit</h1>
//                             <button type="button" className="btn-close" id="addNewpageModalClose" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <form onSubmit={handleSubmit}>
//                             <div className="modal-body row">

//                                 <div className="mb-3 col-md-12">
//                                     <label className="form-label">Title</label>
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
//                                     <label className="form-label">Description</label>
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

// export default CmsReferAndEarn;

"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";

// Display names + fixed field types, matching the ACTUAL fields on the
// public Refer & Earn form (page.jsx): Friend's Name, Friend's Number,
// Friend's Email, Place (dropdown), Other Place, Phone No.
// Types are intentionally NOT editable from the CMS — only label,
// placeholder, shown, and required are — so lead submissions keep working.
const FIELD_META = {
    friend_name: { displayName: "Your Friend's Name", type: "text" },
    friend_number: { displayName: "Your Friend's Number", type: "text" },
    friend_email: { displayName: "Your Friend's Email", type: "email" },
    place: { displayName: "Place", type: "select" },
    other_place: { displayName: "Other Place", type: "text" },
    phone_no: { displayName: "Phone No.", type: "text" },
};

const DEFAULT_FORM_FIELDS = {
    friend_name: { label: "Your Friend's Name", placeholder: "Your Friend's Name", shown: true, required: true },
    friend_number: { label: "Your Friend's Number", placeholder: "Your Friend's Number", shown: true, required: true },
    friend_email: { label: "Your Friend's Email", placeholder: "Your Friend's Email", shown: true, required: true },
    place: { label: "Place", placeholder: "Place", shown: true, required: true },
    other_place: { label: "Other Place", placeholder: "Other Place", shown: true, required: false },
    phone_no: { label: "Phone No.", placeholder: "your Phone No.", shown: true, required: true },
};

const CmsReferAndEarn = () => {

    const authToken = useSelector((state) => state.auth.authToken);
    const [pagesList, setPagesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        description_font_size: 16,
        image: null,
        item_index: null,
    });
    const [selectedId, setSelectedId] = useState(null);

    // Page-level content: main heading + description + form styling + form fields
    const [pageContent, setPageContent] = useState({
        main_heading: "",
        main_heading_tag: "h2",
        main_description: "",
        main_description_font_size: 16,
        form_heading: "Refer and Earn",
        form_image: null,
        form_bg_color: "#ff914d",
        form_heading_color: "#000000",
        submit_button_text: "Submit Now",
      submit_button_bg_color: "#ff914d",
      submit_button_color: "#ffffff",
        form_fields: DEFAULT_FORM_FIELDS,
    });

    const extractHex = (colorVal, defaultHex) => {
    if (!colorVal) return defaultHex;
    if (Array.isArray(colorVal)) return colorVal[0];
    if (typeof colorVal === 'string' && colorVal.includes(',')) {
        return colorVal.split(',')[0].trim();
    }
    return colorVal;
};
    const fetchContentManagerPages = useCallback(async () => {
        try {
            const response = await api.get('/cms-content/refer_and_earn', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.data) {

                const data = response.data.json_content || {};
                const isObject = !Array.isArray(data);

                // setPagesList(response.data.json_content || []);
                // setSelectedId(response.data.id);
                setPagesList(isObject ? (data.cards || []) : data);
                setSelectedId(response.data.id);

                let fetchedFields = DEFAULT_FORM_FIELDS;
                if (isObject && data.form_fields) {
                    const parsed = typeof data.form_fields === "string"
                            ? JSON.parse(data.form_fields)
                            : data.form_fields;
                    fetchedFields = { ...DEFAULT_FORM_FIELDS, ...parsed };
                }

                // setPageContent({
                //     main_heading: response.data.main_heading || "",
                //     main_heading_tag: response.data.main_heading_tag || "h2",
                //     main_description: response.data.main_description || "",
                //     main_description_font_size: response.data.main_description_font_size || 16,
                //     form_image: null,
                //     form_bg_color: response.data.form_bg_color || "#ff914d",
                //     form_heading_color: response.data.form_heading_color || "#000000",
                //     form_fields: fetchedFields,
                // });
                // setLoading(false);

                setPageContent({
                    main_heading: isObject ? data.main_heading || "" : "",
                    main_heading_tag: isObject ? data.main_heading_tag || "h2" : "h2",
                    main_description: isObject ? data.main_description || "" : "",
                    main_description_font_size: isObject ? data.main_description_font_size || 16 : 16,
                    form_image: null,
                    form_heading: isObject ? data.form_heading || "Refer and Earn" : "Refer and Earn",
      form_image: null,
      form_heading_color: extractHex(isObject ? data.form_heading_color : null, "#000000"),
                    form_bg_color: extractHex(isObject ? data.form_bg_color : null, "#ffc5a1"),
                    submit_button_text: isObject ? data.submit_button_text || "Submit Now" : "Submit Now",
      submit_button_bg_color: extractHex(isObject ? data.submit_button_bg_color : null, "#ff914d"),
    submit_button_color: extractHex(isObject ? data.submit_button_color : null, "#ffffff"),
                    form_fields: fetchedFields,
                });
                setLoading(false);
            }

        } catch (err) {
            toast.error(err.message || "Failed to fetch data. Please try again.");
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchContentManagerPages();
    }, [fetchContentManagerPages]);

    // Handle input change for text fields and image (icon items)
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files.length > 0) {
            setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    // Handle form submission (icon items) — endpoint unchanged
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("description_font_size", formData.description_font_size);
        formDataToSend.append("item_index", formData.item_index);
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            const response = await api.patch(`/cms-content/update-json-child-image/${selectedId}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`, // Send auth token
                },
            });

            if (response.status === 200) {
                fetchContentManagerPages();
                toast.success("Form submitted successfully.");
                setFormData({
                    title: "",
                    description: "",
                    description_font_size: 16,
                    image: null,
                    item_index: null,
                });

                document.getElementById('addNewpageModalClose').click();

            } else {
                toast.error("Error submitting form. Please try again.");
            }
        } catch (error) {
            toast.error(error.message ?? "Error submitting form. Please try again.");
            console.error("Error:", error);
        }
    };

    const handleEditClick = (item, index) => {
        setFormData({
            title: item.title,
            description: item.description,
            description_font_size: item.description_font_size || 16,
            image: null,
            item_index: index,
        });
    };

    // --- Page content (heading + description + form styling) ---
    const handlePageContentChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files.length > 0) {
            setPageContent((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setPageContent((prev) => ({ ...prev, [name]: value }));
        }
    };

    // --- Per-field (label / placeholder / shown / required) ---
    const handleFieldTextChange = (fieldKey, prop, value) => {
        setPageContent((prev) => ({
            ...prev,
            form_fields: {
                ...prev.form_fields,
                [fieldKey]: {
                    ...prev.form_fields[fieldKey],
                    [prop]: value,
                },
            },
        }));
    };

    const handleFieldToggle = (fieldKey, prop) => {
        setPageContent((prev) => ({
            ...prev,
            form_fields: {
                ...prev.form_fields,
                [fieldKey]: {
                    ...prev.form_fields[fieldKey],
                    [prop]: !prev.form_fields[fieldKey][prop],
                },
            },
        }));
    };

    const handlePageContentSubmit = async (e) => {
        e.preventDefault();

        const pageContentToSend = new FormData();
        pageContentToSend.append("main_heading", pageContent.main_heading);
  pageContentToSend.append("main_heading_tag", pageContent.main_heading_tag);
  pageContentToSend.append("main_description", pageContent.main_description);
  pageContentToSend.append("main_description_font_size", pageContent.main_description_font_size);
  pageContentToSend.append("form_bg_color", pageContent.form_bg_color);
  pageContentToSend.append("form_heading_color", pageContent.form_heading_color);
  pageContentToSend.append("form_heading", pageContent.form_heading);
  pageContentToSend.append("submit_button_text", pageContent.submit_button_text);
  pageContentToSend.append("submit_button_bg_color", pageContent.submit_button_bg_color);
  pageContentToSend.append("submit_button_color", pageContent.submit_button_color);
  pageContentToSend.append("form_fields", JSON.stringify(pageContent.form_fields));
        if (pageContent.form_image instanceof File) {
            pageContentToSend.append("form_image", pageContent.form_image);
        }

        try {
            const response = await api.patch(`/cms-content/update-page-content/${selectedId}`, pageContentToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 200) {
                toast.success("Page content updated successfully.");
                fetchContentManagerPages();
            } else {
                toast.error("Error updating page content. Please try again.");
            }
        } catch (error) {
            toast.error(error.message ?? "Error updating page content. Please try again.");
            console.error("Error:", error);
        }
    };

    return (
        <AuthMainLayout>
            <div className="container my-5">
                <h1 className="mb-4 text-center">CMS - Refer And Earn</h1>

                {/* Main heading + description + form styling + form fields */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title mb-3">Section Heading & Description</h5>
                        <form onSubmit={handlePageContentSubmit} className="row">
                            <div className="col-md-8 mb-3">
                                <label className="form-label">Heading Text</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="main_heading"
                                    placeholder="e.g. High Creation Interior"
                                    value={pageContent.main_heading}
                                    onChange={handlePageContentChange}
                                    required
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Heading Tag</label>
                                <select
                                    className="form-select form-control"
                                    name="main_heading_tag"
                                    value={pageContent.main_heading_tag}
                                    onChange={handlePageContentChange}
                                >
                                    <option value="h1">H1</option>
                                    <option value="h2">H2</option>
                                    <option value="h3">H3</option>
                                    <option value="h4">H4</option>
                                    <option value="h5">H5</option>
                                    <option value="h6">H6</option>
                                </select>
                            </div>

                            <div className="col-md-8 mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    name="main_description"
                                    placeholder="Short description shown under the heading"
                                    value={pageContent.main_description}
                                    onChange={handlePageContentChange}
                                    rows={2}
                                    required
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Description Font Size (px)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="main_description_font_size"
                                    min={10}
                                    max={30}
                                    value={pageContent.main_description_font_size}
                                    onChange={handlePageContentChange}
                                    required
                                />
                            </div>

                            <hr className="my-3" />

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Form Image (left side image)</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    name="form_image"
                                    accept="image/*"
                                    onChange={handlePageContentChange}
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Form Background Colour</label>
                                <input
                                    type="color"
                                    className="form-control form-control-color"
                                    name="form_bg_color"
                                    value={pageContent.form_bg_color}
                                    onChange={handlePageContentChange}
                                />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Form Heading Colour</label>
                                <input
                                    type="color"
                                    className="form-control form-control-color"
                                    name="form_heading_color"
                                    value={pageContent.form_heading_color}
                                    onChange={handlePageContentChange}
                                />
                            </div>

                            <hr className="my-3" />
                            <div className="col-md-6 mb-3">
    <label className="form-label">Form Title</label>
    <input
        type="text"
        className="form-control"
        name="form_heading"
        value={pageContent.form_heading}
        onChange={handlePageContentChange}
    />
</div>

                            <h6 className="mb-3">Form Fields</h6>
                            {Object.keys(FIELD_META).map((fieldKey) => {
                                const meta = FIELD_META[fieldKey];
                                const field = pageContent.form_fields[fieldKey];
                                return (
                                    <div className="col-12 mb-3" key={fieldKey}>
                                        <div className="border rounded p-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <strong>{meta.displayName}</strong>
                                                <div className="d-flex align-items-center gap-4">
                                                    <div className="form-check form-switch mb-0">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            role="switch"
                                                            id={`${fieldKey}_shown`}
                                                            checked={field.shown}
                                                            onChange={() => handleFieldToggle(fieldKey, "shown")}
                                                        />
                                                        <label className="form-check-label" htmlFor={`${fieldKey}_shown`}>
                                                            Shown
                                                        </label>
                                                    </div>
                                                    <div className="form-check mb-0">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`${fieldKey}_required`}
                                                            checked={field.required}
                                                            onChange={() => handleFieldToggle(fieldKey, "required")}
                                                        />
                                                        <label className="form-check-label" htmlFor={`${fieldKey}_required`}>
                                                            Required
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 mb-2 mb-md-0">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Label"
                                                        value={field.label}
                                                        onChange={(e) => handleFieldTextChange(fieldKey, "label", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Placeholder"
                                                        value={field.placeholder}
                                                        onChange={(e) => handleFieldTextChange(fieldKey, "placeholder", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <p className="text-muted small">
                                Field types (text / email / select) are fixed to keep lead submissions
                                working correctly — only labels, placeholders, and required/shown state
                                are editable here.
                            </p>
<div className="col-md-6 mb-3">
    <label className="form-label">Submit Button Text</label>
    <input
        type="text"
        className="form-control"
        name="submit_button_text"
        value={pageContent.submit_button_text}
        onChange={handlePageContentChange}
    />
</div>
<div className="col-md-3 mb-3">
    <label className="form-label">Button Background</label>
    <input
        type="color"
        className="form-control form-control-color"
        name="submit_button_bg_color"
        value={pageContent.submit_button_bg_color}
        onChange={handlePageContentChange}
    />
</div>
<div className="col-md-3 mb-3">
    <label className="form-label">Button Text Colour</label>
    <input
        type="color"
        className="form-control form-control-color"
        name="submit_button_color"
        value={pageContent.submit_button_color}
        onChange={handlePageContentChange}
    />
</div>
                            <div className="col-12 mt-2 d-flex justify-content-center">
                                <button className="px-5 read_morebtn" type="submit">
                                    Save Page Content
                                </button>
                            </div>
                        </form>
                    </div>
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
                                    <th>Description</th>
                                    <th width="80">Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagesList && pagesList?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.title}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <img src={item?.image} alt={item.title} height="80" decoding="async"  loading="lazy" />
                                        </td>
                                        <td>
                                            <button onClick={() => handleEditClick(item, index)} type="button" className="read_morebtn" data-bs-toggle="modal" data-bs-target="#addNewpageModal">
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

            <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit</h1>
                            <button type="button" className="btn-close" id="addNewpageModalClose" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit}>
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
                                    <label className="form-label">Description Font Size (px)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="description_font_size"
                                        placeholder="Description Font Size"
                                        min={10}
                                        max={30}
                                        value={formData.description_font_size}
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

export default CmsReferAndEarn;

