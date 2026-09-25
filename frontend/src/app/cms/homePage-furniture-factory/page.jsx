// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { toast } from "react-toastify";
// import { FaSave, FaTrash } from "react-icons/fa";
// import api from "@/utils/api";
// import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

// const CONTENT_KEY = "home_page_content_furniture_factory";

// export default function ManageFurnitureFactory() {
//   const [contentId, setContentId] = useState(null);

//   const [heading, setHeading] = useState("Large Modular Furniture Factories");
//   const [headingColor, setHeadingColor] = useState("#000000");
//   const [description, setDescription] = useState("");
//   // 🆕 Description font size, 10px – 30px
//   const [descriptionFontSize, setDescriptionFontSize] = useState(16);
//   const [buttonText, setButtonText] = useState("View More");
//   const [buttonLink, setButtonLink] = useState("/furniture/gallery");

//   // Image 1
//   const [image1File, setImage1File] = useState(null); // File instance when a new file is chosen
//   const [image1Preview, setImage1Preview] = useState(""); // blob: URL, saved URL, or ""
//   const [image1Caption, setImage1Caption] = useState("");
//   const image1InputRef = useRef(null);

//   // Image 2
//   const [image2File, setImage2File] = useState(null);
//   const [image2Preview, setImage2Preview] = useState("");
//   const [image2Caption, setImage2Caption] = useState("");
//   const image2InputRef = useRef(null);

//   // 🆕 Video — now a media picker (file upload) instead of a URL text box
//   const [videoFile, setVideoFile] = useState(null);
//   const [videoPreview, setVideoPreview] = useState("");
//   const videoInputRef = useRef(null);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [removingKey, setRemovingKey] = useState(null); // 'image1' | 'image2' | 'video' | null

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const res = await api.get(`/cms-content/${CONTENT_KEY}`);
//       if (!res.data) return;

//       const record = Array.isArray(res.data) ? res.data[0] : res.data;
//       if (!record) return;

//       setContentId(record.id);
//       const content = record.json_content || {};

//       setHeading(content.heading || "Large Modular Furniture Factories");
//       setHeadingColor(content.headingColor || "#000000");
//       setDescription(content.description || "");
//       setDescriptionFontSize(
//         content.descriptionFontSize ? Number(content.descriptionFontSize) : 16
//       );
//       setButtonText(content.buttonText || "View More");
//       setButtonLink(content.buttonLink || "/furniture/gallery");

//       setImage1Preview(content.image1 || "");
//       setImage1Caption(content.image1Caption || "");

//       setImage2Preview(content.image2 || "");
//       setImage2Caption(content.image2Caption || "");

//       setVideoPreview(content.video || "");
//     } catch (err) {
//       console.log(err);
//       toast.error("Failed to load data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // CORE SAVE — everything routes through here so a remove-click and the
//   // Save button behave identically. `overrides` lets a caller (like a remove
//   // button) push a value straight into the request without waiting for a
//   // React state update to land first.
//   // ==========================================
//   const persist = async (overrides = {}) => {
//     const values = {
//       heading,
//       headingColor,
//       description,
//       descriptionFontSize,
//       buttonText,
//       buttonLink,
//       image1Preview,
//       image1File,
//       image1Caption,
//       image2Preview,
//       image2File,
//       image2Caption,
//       videoPreview,
//       videoFile,
//       ...overrides,
//     };

//     const formData = new FormData();

//     formData.append(
//       "json_content",
//       JSON.stringify({
//         heading: values.heading,
//         headingColor: values.headingColor,
//         description: values.description,
//         descriptionFontSize: values.descriptionFontSize,
//         buttonText: values.buttonText,
//         buttonLink: values.buttonLink,
//         // A "blob:" preview means a brand-new file is being uploaded in this
//         // same request — leave the JSON value blank and let the backend fill
//         // it in from the uploaded file. Anything else (including "") is the
//         // value to keep or clear as-is.
//         image1: values.image1Preview.startsWith("blob:") ? "" : values.image1Preview,
//         image1Caption: values.image1Caption,
//         image2: values.image2Preview.startsWith("blob:") ? "" : values.image2Preview,
//         image2Caption: values.image2Caption,
//         video: values.videoPreview.startsWith("blob:") ? "" : values.videoPreview,
//       })
//     );

//     // Reuses the backend's generic "icons" (multi-file) field: slot 0 =
//     // image1, slot 1 = image2.
//     const iconIndices = [];
//     if (values.image1File instanceof File) {
//       formData.append("icons", values.image1File);
//       iconIndices.push(0);
//     }
//     if (values.image2File instanceof File) {
//       formData.append("icons", values.image2File);
//       iconIndices.push(1);
//     }
//     formData.append("icon_indices", JSON.stringify(iconIndices));

//     // The backend's update-with-image endpoint already whitelists a single
//     // "video" file field.
//     if (values.videoFile instanceof File) {
//       formData.append("video", values.videoFile);
//     }

//     if (contentId) {
//       await api.patch(`/cms-content/update-with-image/${contentId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//     } else {
//       const response = await api.post(`/cms-content/${CONTENT_KEY}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       const record = Array.isArray(response.data) ? response.data[0] : response.data;
//       if (record?.id) setContentId(record.id);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       await persist();
//       toast.success("Saved Successfully");
//       fetchData();
//     } catch (err) {
//       console.log(err);
//       toast.error("Save Failed");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ==========================================
//   // IMAGE 1 / IMAGE 2
//   // ==========================================
//   const handleImageChange = (slot, file) => {
//     if (!file) return;
//     const preview = URL.createObjectURL(file);
//     if (slot === 1) {
//       setImage1File(file);
//       setImage1Preview(preview);
//     } else {
//       setImage2File(file);
//       setImage2Preview(preview);
//     }
//   };

//   // 🆕 Removing now saves immediately — no separate Save click needed.
//   const handleRemoveImage = async (slot) => {
//     const key = slot === 1 ? "image1" : "image2";
//     try {
//       setRemovingKey(key);

//       if (slot === 1) {
//         setImage1File(null);
//         setImage1Preview("");
//         if (image1InputRef.current) image1InputRef.current.value = "";
//         await persist({ image1File: null, image1Preview: "" });
//       } else {
//         setImage2File(null);
//         setImage2Preview("");
//         if (image2InputRef.current) image2InputRef.current.value = "";
//         await persist({ image2File: null, image2Preview: "" });
//       }

//       toast.success("Image removed & saved");
//       fetchData();
//     } catch (err) {
//       console.log(err);
//       toast.error("Failed to remove image");
//     } finally {
//       setRemovingKey(null);
//     }
//   };

//   // ==========================================
//   // VIDEO (media picker, same pattern as the images)
//   // ==========================================
//   const handleVideoChange = (file) => {
//     if (!file) return;
//     setVideoFile(file);
//     setVideoPreview(URL.createObjectURL(file));
//   };

//   const handleRemoveVideo = async () => {
//     try {
//       setRemovingKey("video");
//       setVideoFile(null);
//       setVideoPreview("");
//       if (videoInputRef.current) videoInputRef.current.value = "";
//       await persist({ videoFile: null, videoPreview: "" });
//       toast.success("Video removed & saved");
//       fetchData();
//     } catch (err) {
//       console.log(err);
//       toast.error("Failed to remove video");
//     } finally {
//       setRemovingKey(null);
//     }
//   };

//   if (loading) {
//     return (
//       <AuthMainLayout>
//         <div
//           className="d-flex justify-content-center align-items-center"
//           style={{ minHeight: "60vh" }}
//         >
//           <div className="spinner-border text-warning" />
//         </div>
//       </AuthMainLayout>
//     );
//   }

//   const renderImageSlot = (slotNumber) => {
//     const preview = slotNumber === 1 ? image1Preview : image2Preview;
//     const caption = slotNumber === 1 ? image1Caption : image2Caption;
//     const setCaption = slotNumber === 1 ? setImage1Caption : setImage2Caption;
//     const inputRef = slotNumber === 1 ? image1InputRef : image2InputRef;
//     const key = slotNumber === 1 ? "image1" : "image2";
//     const isRemoving = removingKey === key;

//     return (
//       <div className="col-md-6">
//         <label className="form-label fw-bold">Image {slotNumber}</label>
//         <input
//           type="file"
//           accept="image/*"
//           className="form-control"
//           ref={inputRef}
//           onChange={(e) => handleImageChange(slotNumber, e.target.files?.[0])}
//         />

//         {preview ? (
//           <div className="mt-3">
//             <img
//               src={preview}
//               alt={`Image ${slotNumber} Preview`}
//               className="rounded border"
//               style={{ width: "100%", height: "160px", objectFit: "cover" }}
//             />
//             <button
//               type="button"
//               className="btn btn-outline-danger btn-sm mt-2"
//               disabled={isRemoving}
//               onClick={() => handleRemoveImage(slotNumber)}
//             >
//               <FaTrash className="me-1" /> {isRemoving ? "Removing..." : "Remove"}
//             </button>
//           </div>
//         ) : (
//           <div className="mt-2 text-muted small">No image selected.</div>
//         )}

//         <label className="form-label mt-3">Caption (e.g. "Production Unit - {slotNumber}")</label>
//         <input
//           className="form-control"
//           value={caption}
//           onChange={(e) => setCaption(e.target.value)}
//         />
//       </div>
//     );
//   };

//   return (
//     <AuthMainLayout>
//       <div className="container py-5">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h2 className="fw-bold">Manage Furniture Factory Section</h2>
//           <button className="btn btn-success" disabled={saving} onClick={handleSave}>
//             <FaSave className="me-2" />
//             {saving ? "Saving..." : "Save"}
//           </button>
//         </div>

//         {/* Heading & Text */}
//         <div className="card shadow-sm border-0 mb-4">
//           <div className="card-body row g-3">
//             <div className="col-md-8">
//               <label className="form-label fw-bold">Heading</label>
//               <input
//                 className="form-control"
//                 value={heading}
//                 onChange={(e) => setHeading(e.target.value)}
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label fw-bold">Heading Color</label>
//               <input
//                 type="color"
//                 className="form-control form-control-color w-100"
//                 value={headingColor}
//                 onChange={(e) => setHeadingColor(e.target.value)}
//               />
//             </div>

//             <div className="col-12">
//               <label className="form-label fw-bold">Description</label>
//               <textarea
//                 rows={4}
//                 className="form-control"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 style={{ fontSize: `${descriptionFontSize}px` }}
//               />
//             </div>

//             {/* 🆕 Description font size, 10px – 30px */}
//             <div className="col-md-6">
//               <label className="form-label fw-bold">Description Font Size</label>
//               <input
//                 type="range"
//                 className="w-100 d-block mt-2"
//                 min="10"
//                 max="30"
//                 value={descriptionFontSize}
//                 onChange={(e) => setDescriptionFontSize(Number(e.target.value))}
//               />
//               <div className="text-muted text-center fw-bold">{descriptionFontSize}px</div>
//             </div>

//             <div className="col-md-6">
//               <label className="form-label fw-bold">Button Text</label>
//               <input
//                 className="form-control"
//                 value={buttonText}
//                 onChange={(e) => setButtonText(e.target.value)}
//               />
//             </div>
//             <div className="col-md-6">
//               <label className="form-label fw-bold">Button Link</label>
//               <input
//                 className="form-control"
//                 value={buttonLink}
//                 onChange={(e) => setButtonLink(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Images */}
//         <div className="card shadow-sm border-0 mb-4">
//           <div className="card-body row g-3">
//             <h6 className="fw-bold mb-2">
//               Factory Images (shown side-by-side on the left of the section)
//             </h6>
//             {renderImageSlot(1)}
//             {renderImageSlot(2)}
//             <div className="col-12 text-muted small mt-2">
//               These two images are only shown when no video is set below.
//               Removing an image saves right away.
//             </div>
//           </div>
//         </div>

//         {/* 🆕 Video — media picker, same pattern as the images above */}
//         <div className="card shadow-sm border-0 mb-4">
//           <div className="card-body row g-3">
//             <h6 className="fw-bold mb-2">Video (optional)</h6>

//             <div className="col-md-6">
//               <label className="form-label">Video File</label>
//               <input
//                 type="file"
//                 accept="video/*"
//                 className="form-control"
//                 ref={videoInputRef}
//                 onChange={(e) => handleVideoChange(e.target.files?.[0])}
//               />

//               {videoPreview ? (
//                 <div className="mt-3">
//                   <video
//                     src={videoPreview}
//                     controls
//                     className="w-100 rounded border"
//                     style={{ maxHeight: "220px" }}
//                   />
//                   <button
//                     type="button"
//                     className="btn btn-outline-danger btn-sm mt-2"
//                     disabled={removingKey === "video"}
//                     onClick={handleRemoveVideo}
//                   >
//                     <FaTrash className="me-1" />
//                     {removingKey === "video" ? "Removing..." : "Remove"}
//                   </button>
//                 </div>
//               ) : (
//                 <div className="mt-2 text-muted small">No video selected.</div>
//               )}
//             </div>

//             <div className="col-12 text-muted small">
//               When a video is set, it replaces both factory images on the home
//               page. Removing it saves right away and brings the images back.
//             </div>
//           </div>
//         </div>
//       </div>
//     </AuthMainLayout>
//   );
// }


"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { FaSave, FaTrash } from "react-icons/fa";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

const CONTENT_KEY = "home_page_content_furniture_factory";

export default function ManageFurnitureFactory() {
  const [contentId, setContentId] = useState(null);

  const [heading, setHeading] = useState("Large Modular Furniture Factories");
  const [headingColor, setHeadingColor] = useState("#000000");
  const [description, setDescription] = useState("");
  const [descriptionFontSize, setDescriptionFontSize] = useState(16);
  const [buttonText, setButtonText] = useState("View More");
  const [buttonLink, setButtonLink] = useState("/furniture/gallery");

  // 🆕 Top image (wide banner shown above the two bottom images)
  const [topImageFile, setTopImageFile] = useState(null);
  const [topImagePreview, setTopImagePreview] = useState("");
  const [topImageCaption, setTopImageCaption] = useState("");
  const topImageInputRef = useRef(null);

  // Image 1 (bottom-left)
  const [image1File, setImage1File] = useState(null);
  const [image1Preview, setImage1Preview] = useState("");
  const [image1Caption, setImage1Caption] = useState("");
  const image1InputRef = useRef(null);

  // Image 2 (bottom-right)
  const [image2File, setImage2File] = useState(null);
  const [image2Preview, setImage2Preview] = useState("");
  const [image2Caption, setImage2Caption] = useState("");
  const image2InputRef = useRef(null);

  // Video (media picker)
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const videoInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removingKey, setRemovingKey] = useState(null); // 'topImage' | 'image1' | 'image2' | 'video' | null

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/cms-content/${CONTENT_KEY}`);
      if (!res.data) return;

      const record = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!record) return;

      setContentId(record.id);
      const content = record.json_content || {};

      setHeading(content.heading || "Large Modular Furniture Factories");
      setHeadingColor(content.headingColor || "#000000");
      setDescription(content.description || "");
      setDescriptionFontSize(
        content.descriptionFontSize ? Number(content.descriptionFontSize) : 16
      );
      setButtonText(content.buttonText || "View More");
      setButtonLink(content.buttonLink || "/furniture/gallery");

      setTopImagePreview(content.topImage || "");
      setTopImageCaption(content.topImageCaption || "");

      setImage1Preview(content.image1 || "");
      setImage1Caption(content.image1Caption || "");

      setImage2Preview(content.image2 || "");
      setImage2Caption(content.image2Caption || "");

      setVideoPreview(content.video || "");
    } catch (err) {
      console.log(err);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CORE SAVE — everything routes through here so a remove-click and the
  // Save button behave identically. `overrides` lets a caller (like a remove
  // button) push a value straight into the request without waiting for a
  // React state update to land first.
  // ==========================================
  const persist = async (overrides = {}) => {
    const values = {
      heading,
      headingColor,
      description,
      descriptionFontSize,
      buttonText,
      buttonLink,
      topImagePreview,
      topImageFile,
      topImageCaption,
      image1Preview,
      image1File,
      image1Caption,
      image2Preview,
      image2File,
      image2Caption,
      videoPreview,
      videoFile,
      ...overrides,
    };

    const formData = new FormData();

    formData.append(
      "json_content",
      JSON.stringify({
        heading: values.heading,
        headingColor: values.headingColor,
        description: values.description,
        descriptionFontSize: values.descriptionFontSize,
        buttonText: values.buttonText,
        buttonLink: values.buttonLink,
        // A "blob:" preview means a brand-new file is being uploaded in this
        // same request — leave the JSON value blank and let the backend fill
        // it in from the uploaded file. Anything else (including "") is the
        // value to keep or clear as-is.
        topImage: values.topImagePreview.startsWith("blob:") ? "" : values.topImagePreview,
        topImageCaption: values.topImageCaption,
        image1: values.image1Preview.startsWith("blob:") ? "" : values.image1Preview,
        image1Caption: values.image1Caption,
        image2: values.image2Preview.startsWith("blob:") ? "" : values.image2Preview,
        image2Caption: values.image2Caption,
        video: values.videoPreview.startsWith("blob:") ? "" : values.videoPreview,
      })
    );

    // Reuses the backend's generic "icons" (multi-file) field.
    // Slot mapping: 0 = topImage, 1 = image1, 2 = image2.
    const iconIndices = [];
    if (values.topImageFile instanceof File) {
      formData.append("icons", values.topImageFile);
      iconIndices.push(0);
    }
    if (values.image1File instanceof File) {
      formData.append("icons", values.image1File);
      iconIndices.push(1);
    }
    if (values.image2File instanceof File) {
      formData.append("icons", values.image2File);
      iconIndices.push(2);
    }
    formData.append("icon_indices", JSON.stringify(iconIndices));

    if (values.videoFile instanceof File) {
      formData.append("video", values.videoFile);
    }

    if (contentId) {
      await api.patch(`/cms-content/update-with-image/${contentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      const response = await api.post(`/cms-content/${CONTENT_KEY}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const record = Array.isArray(response.data) ? response.data[0] : response.data;
      if (record?.id) setContentId(record.id);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await persist();
      toast.success("Saved Successfully");
      fetchData();
    } catch (err) {
      console.log(err);
      toast.error("Save Failed");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // TOP IMAGE
  // ==========================================
  const handleTopImageChange = (file) => {
    if (!file) return;
    setTopImageFile(file);
    setTopImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveTopImage = async () => {
    try {
      setRemovingKey("topImage");
      setTopImageFile(null);
      setTopImagePreview("");
      if (topImageInputRef.current) topImageInputRef.current.value = "";
      await persist({ topImageFile: null, topImagePreview: "" });
      toast.success("Image removed & saved");
      fetchData();
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove image");
    } finally {
      setRemovingKey(null);
    }
  };

  // ==========================================
  // IMAGE 1 / IMAGE 2
  // ==========================================
  const handleImageChange = (slot, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (slot === 1) {
      setImage1File(file);
      setImage1Preview(preview);
    } else {
      setImage2File(file);
      setImage2Preview(preview);
    }
  };

  const handleRemoveImage = async (slot) => {
    const key = slot === 1 ? "image1" : "image2";
    try {
      setRemovingKey(key);

      if (slot === 1) {
        setImage1File(null);
        setImage1Preview("");
        if (image1InputRef.current) image1InputRef.current.value = "";
        await persist({ image1File: null, image1Preview: "" });
      } else {
        setImage2File(null);
        setImage2Preview("");
        if (image2InputRef.current) image2InputRef.current.value = "";
        await persist({ image2File: null, image2Preview: "" });
      }

      toast.success("Image removed & saved");
      fetchData();
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove image");
    } finally {
      setRemovingKey(null);
    }
  };

  // ==========================================
  // VIDEO
  // ==========================================
  const handleVideoChange = (file) => {
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleRemoveVideo = async () => {
    try {
      setRemovingKey("video");
      setVideoFile(null);
      setVideoPreview("");
      if (videoInputRef.current) videoInputRef.current.value = "";
      await persist({ videoFile: null, videoPreview: "" });
      toast.success("Video removed & saved");
      fetchData();
    } catch (err) {
      console.log(err);
      toast.error("Failed to remove video");
    } finally {
      setRemovingKey(null);
    }
  };

  if (loading) {
    return (
      <AuthMainLayout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <div className="spinner-border text-warning" />
        </div>
      </AuthMainLayout>
    );
  }

  const renderImageSlot = (slotNumber) => {
    const preview = slotNumber === 1 ? image1Preview : image2Preview;
    const caption = slotNumber === 1 ? image1Caption : image2Caption;
    const setCaption = slotNumber === 1 ? setImage1Caption : setImage2Caption;
    const inputRef = slotNumber === 1 ? image1InputRef : image2InputRef;
    const key = slotNumber === 1 ? "image1" : "image2";
    const isRemoving = removingKey === key;

    return (
      <div className="col-md-6">
        <label className="form-label fw-bold">
          Bottom Image {slotNumber} ({slotNumber === 1 ? "left" : "right"})
        </label>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          ref={inputRef}
          onChange={(e) => handleImageChange(slotNumber, e.target.files?.[0])}
        />

        {preview ? (
          <div className="mt-3">
            <img
              src={preview}
              alt={`Image ${slotNumber} Preview`}
              className="border"
              style={{ width: "100%", height: "160px", objectFit: "cover" }}
            />
            <button
              type="button"
              className="btn btn-outline-danger btn-sm mt-2"
              disabled={isRemoving}
              onClick={() => handleRemoveImage(slotNumber)}
            >
              <FaTrash className="me-1" /> {isRemoving ? "Removing..." : "Remove"}
            </button>
          </div>
        ) : (
          <div className="mt-2 text-muted small">No image selected.</div>
        )}

        <label className="form-label mt-3">Caption (e.g. {`"Production Unit - ${slotNumber}"`})</label>
        <input
          className="form-control"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>
    );
  };

  return (
    <AuthMainLayout>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Manage Furniture Factory Section</h2>
          <button className="btn btn-success" disabled={saving} onClick={handleSave}>
            <FaSave className="me-2" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Heading & Text */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body row g-3">
            <div className="col-md-8">
              <label className="form-label fw-bold">Heading</label>
              <input
                className="form-control"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Heading Color</label>
              <input
                type="color"
                className="form-control form-control-color w-100"
                value={headingColor}
                onChange={(e) => setHeadingColor(e.target.value)}
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Description</label>
              <textarea
                rows={4}
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ fontSize: `${descriptionFontSize}px` }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Description Font Size</label>
              <input
                type="range"
                className="w-100 d-block mt-2"
                min="10"
                max="30"
                value={descriptionFontSize}
                onChange={(e) => setDescriptionFontSize(Number(e.target.value))}
              />
              <div className="text-muted text-center fw-bold">{descriptionFontSize}px</div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Button Text</label>
              <input
                className="form-control"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Button Link</label>
              <input
                className="form-control"
                value={buttonLink}
                onChange={(e) => setButtonLink(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 🆕 Top Image (wide banner) */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body row g-3">
            <h6 className="fw-bold mb-2">Top Image (wide banner shown above the two images below)</h6>
            <div className="col-md-6">
              <input
                type="file"
                accept="image/*"
                className="form-control"
                ref={topImageInputRef}
                onChange={(e) => handleTopImageChange(e.target.files?.[0])}
              />

              {topImagePreview ? (
                <div className="mt-3">
                  <img
                    src={topImagePreview}
                    alt="Top Image Preview"
                    className="border"
                    style={{ width: "100%", height: "160px", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm mt-2"
                    disabled={removingKey === "topImage"}
                    onClick={handleRemoveTopImage}
                  >
                    <FaTrash className="me-1" />
                    {removingKey === "topImage" ? "Removing..." : "Remove"}
                  </button>
                </div>
              ) : (
                <div className="mt-2 text-muted small">No image selected.</div>
              )}

              <label className="form-label mt-3">Caption (optional)</label>
              <input
                className="form-control"
                value={topImageCaption}
                onChange={(e) => setTopImageCaption(e.target.value)}
              />
            </div>
            <div className="col-12 text-muted small">
              This image is optional — leave it empty to show just the two
              images below, edge-to-edge.
            </div>
          </div>
        </div>

        {/* Bottom Images */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body row g-3">
            <h6 className="fw-bold mb-2">Bottom Images</h6>
            {renderImageSlot(1)}
            {renderImageSlot(2)}
            <div className="col-12 text-muted small mt-2">
              These are only shown when no video is set below. Removing an
              image saves right away.
            </div>
          </div>
        </div>

        {/* Video */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body row g-3">
            <h6 className="fw-bold mb-2">Video (optional)</h6>

            <div className="col-md-6">
              <label className="form-label">Video File</label>
              <input
                type="file"
                accept="video/*"
                className="form-control"
                ref={videoInputRef}
                onChange={(e) => handleVideoChange(e.target.files?.[0])}
              />

              {videoPreview ? (
                <div className="mt-3">
                  <video
                    src={videoPreview}
                    controls
                    className="w-100 border"
                    style={{ maxHeight: "220px" }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm mt-2"
                    disabled={removingKey === "video"}
                    onClick={handleRemoveVideo}
                  >
                    <FaTrash className="me-1" />
                    {removingKey === "video" ? "Removing..." : "Remove"}
                  </button>
                </div>
              ) : (
                <div className="mt-2 text-muted small">No video selected.</div>
              )}
            </div>

            <div className="col-12 text-muted small">
              When a video is set, it replaces the top image and both bottom
              images on the home page. Removing it saves right away and brings
              the images back.
            </div>
          </div>
        </div>
      </div>
    </AuthMainLayout>
  );
}
