"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { FaSave, FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
// Assuming standard Next.js aliasing based on your path
import dynamic from "next/dynamic";
const CKEditorComponent = dynamic(() => import("../../components/CKEditorComponent"), { ssr: false });

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export default function ManageCareer() {
  const [contentId, setContentId] = useState(null);

  // Banner states
  const [bannerHeading, setBannerHeading] = useState("Where passion for design meets innovation.");
  const [bannerHeadingTag, setBannerHeadingTag] = useState("h1");
  const [bannerDescription, setBannerDescription] = useState("");
  const [bannerDescFontSize, setBannerDescFontSize] = useState(16);
  const [bgHeading, setBgHeading] = useState("");
  const [bgHeadingTag, setBgHeadingTag] = useState("h2");
  
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState("");
  const fileInputRef = useRef(null);

  // CKEditor Table Content
  const [tableContent, setTableContent] = useState("");

  // Icon blocks
  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal (Edit Block) form state
  const [blockForm, setBlockForm] = useState({
    heading: "",
    headingTag: "h3",
    description: "",
    descriptionFontSize: 14,
    imageSize: 100,
    image: null,
    preview: "",
    item_index: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Adjusted endpoint for career page
      const res = await api.get("/cms-content/redirect_career");
      if (!res.data) return;

      const record = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!record) return;

      setContentId(record.id);
      const content = record.json_content || {};

      setBannerHeading(content.bannerHeading || "Where passion for design meets innovation.");
      setBannerHeadingTag(content.bannerHeadingTag || "h1");
      setBannerDescription(content.bannerDescription || "");
      setBannerDescFontSize(content.bannerDescFontSize || 16);
      setTableContent(content.tableContent || "");

      setBgHeading(content.bgHeading || "");
      setBgHeadingTag(content.bgHeadingTag || "h2");

      const dbImage = record.image || content.bg_image || "";
      setBackgroundPreview(dbImage === TRANSPARENT_PIXEL ? "" : dbImage);

      let sectionsData = content.sections;
      if (typeof sectionsData === "string") {
        try {
          sectionsData = JSON.parse(sectionsData);
        } catch (e) {
          sectionsData = [];
        }
      }

      const hydratedSections = Array.isArray(sectionsData)
        ? sectionsData.map((s) => ({
            heading: s.heading || "",
            headingTag: s.headingTag || "h3",
            description: s.description || "",
            descriptionFontSize: s.descriptionFontSize || 14,
            image: s.image || null,
            preview: "",
            imageSize: s.imageSize || 100,
          }))
        : [];

      setSections(hydratedSections);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBackground = () => {
    setBackgroundImage(null);
    setBackgroundPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openAddBlockModal = () => {
    setBlockForm({
      heading: "",
      headingTag: "h3",
      description: "",
      descriptionFontSize: 14,
      imageSize: 100,
      image: null,
      preview: "",
      item_index: sections.length, 
    });
  };

  const openEditBlockModal = (section, index) => {
    setBlockForm({
      heading: section.heading || "",
      headingTag: section.headingTag || "h3",
      description: section.description || "",
      descriptionFontSize: section.descriptionFontSize || 14,
      imageSize: section.imageSize || 100,
      image: null,
      preview: typeof section.image === "string" ? section.image : "",
      item_index: index,
    });
  };

  const handleBlockFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      setBlockForm((prev) => ({
        ...prev,
        image: files[0],
        preview: URL.createObjectURL(files[0]),
      }));
    } else {
      setBlockForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const persistSection = async (updatedSections, newSection, index) => {
    if (!contentId) {
      toast.error("Please save the banner first to create the page record.");
      return false;
    }

    try {
      const formData = new FormData();

      const cleanedSections = updatedSections.map((s) => ({
        heading: s.heading,
        headingTag: s.headingTag,
        description: s.description,
        descriptionFontSize: s.descriptionFontSize,
        imageSize: s.imageSize,
        image: typeof s.image === "string" ? s.image : "",
      }));

      formData.append(
        "json_content",
        JSON.stringify({
          bannerHeading,
          bannerHeadingTag,
          bannerDescription,
          bannerDescFontSize,
          tableContent,
          bgHeading,
          bgHeadingTag,
          bgSize: "cover",
          bg_image: backgroundPreview.startsWith("blob:") ? "" : backgroundPreview || "",
          sections: cleanedSections,
        })
      );

      if (newSection.image instanceof File) {
        formData.append("icons", newSection.image);
        formData.append("image_indices", JSON.stringify([index]));
      } else {
        formData.append("image_indices", JSON.stringify([]));
      }

      await api.patch(`/cms-content/update-with-image/${contentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  const handleBlockSave = async (e) => {
    e.preventDefault();

    const updated = [...sections];
    const existing = updated[blockForm.item_index];

    const newSection = {
      heading: blockForm.heading,
      headingTag: blockForm.headingTag,
      description: blockForm.description,
      descriptionFontSize: Number(blockForm.descriptionFontSize),
      imageSize: Number(blockForm.imageSize) || 100,
      image: blockForm.image instanceof File ? blockForm.image : existing?.image || null,
      preview: blockForm.image instanceof File ? blockForm.preview : "",
    };

    updated[blockForm.item_index] = newSection;

    const ok = await persistSection(updated, newSection, blockForm.item_index);

    if (ok) {
      toast.success("Block saved successfully.");
      document.getElementById("blockModalClose")?.click();
      fetchData(); 
    } else {
      toast.error("Failed to save block. Please try again.");
    }
  };

  const deleteSection = async (index) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this block?");
  if (!confirmDelete) return;

  const updated = [...sections];
  updated.splice(index, 1);
  
  if (!contentId) {
    setSections(updated);
    toast.success("Block removed locally.");
    return;
  }

  setSections(updated);
  const success = await savePageData(updated, "Block deleted successfully.");
  if (!success) {
    fetchData(); // Revert UI if update fails
  }
};

//   const deleteSection = (index) => {
//     const updated = [...sections];
//     updated.splice(index, 1);
//     setSections(updated);
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);
//       const formData = new FormData();

//       const updatedSections = sections.map(({ preview, image, ...section }) => ({
//         ...section,
//         image: typeof image === "string" ? image : "",
//       }));

//       let finalBgImage = backgroundPreview;
//       if (backgroundPreview.startsWith("blob:")) {
//         finalBgImage = "";
//       } else if (backgroundPreview === "") {
//         finalBgImage = TRANSPARENT_PIXEL;
//       }

//       formData.append(
//         "json_content",
//         JSON.stringify({
//           bannerHeading,
//           bannerHeadingTag,
//           bannerDescription,
//           bannerDescFontSize,
//           tableContent,
//           bgHeading,
//           bgSize: "cover",
//           bg_image: finalBgImage,
//           sections: updatedSections,
//         })
//       );

//       if (backgroundImage instanceof File) {
//         formData.append("image", backgroundImage);
//       }

//       if (contentId) {
//         await api.patch(`/cms-content/update-with-image/${contentId}`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else {
//         await api.post("/cms-content/redirect_career", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       toast.success("Saved Successfully");
//       fetchData();
//     } catch (err) {
//       console.log(err);
//       toast.error("Save Failed");
//     } finally {
//       setSaving(false);
//     }
//   };

// Centralized reusable save function
const savePageData = async (sectionsOverride = null, successMessage = "Saved Successfully") => {
  try {
    setSaving(true);
    const formData = new FormData();

    const currentSections = sectionsOverride !== null ? sectionsOverride : sections;
    const updatedSections = currentSections.map(({ preview, image, ...section }) => ({
      ...section,
      image: typeof image === "string" ? image : "",
    }));

    let finalBgImage = backgroundPreview;
    if (backgroundPreview.startsWith("blob:")) {
      finalBgImage = "";
    } else if (backgroundPreview === "") {
      finalBgImage = TRANSPARENT_PIXEL;
    }

    formData.append(
      "json_content",
      JSON.stringify({
        bannerHeading,
        bannerHeadingTag,
        bannerDescription,
        bannerDescFontSize,
        tableContent,
        bgHeading,
        bgHeadingTag,
        bgSize: "cover",
        bg_image: finalBgImage,
        sections: updatedSections,
      })
    );

    if (backgroundImage instanceof File) {
      formData.append("image", backgroundImage);
    }

    if (contentId) {
      await api.patch(`/cms-content/update-with-image/${contentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await api.post("/cms-content/redirect_career", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    toast.success(successMessage);
    fetchData();
    return true;
  } catch (err) {
    console.log(err);
    toast.error("Save Failed");
    return false;
  } finally {
    setSaving(false);
  }
};

// Section-specific save handlers
const handleSaveAll = () => savePageData(null, "All Content Saved Successfully");
const handleBannerSave = () => savePageData(null, "Header Content Saved Successfully");
const handleTableSave = () => savePageData(null, "Editor Content Saved Successfully");

  if (loading) {
    return (
      <AuthMainLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="spinner-border text-warning" />
        </div>
      </AuthMainLayout>
    );
  }

  return (
    <AuthMainLayout>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Manage Career Page</h2>
          <button className="btn btn-success" disabled={saving} onClick={handleSaveAll}>
  <FaSave className="me-2" />
  {saving ? "Saving..." : "Save All Content"}
</button>
        </div>

        {/* --- Banner Section --- */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
  <div className="d-flex justify-content-between align-items-center mb-3">
  <h5 className="fw-bold mb-0">Career Page Header Content</h5>
  <button className="btn btn-sm btn-success" disabled={saving} onClick={handleBannerSave}>
    <FaSave className="me-2" />
    {saving ? "Saving..." : "Save Header"}
  </button>
</div>
            <div className="row mb-3">
              <div className="col-md-9">
                <label className="form-label">Career Page Heading</label>
                <input
                  className="form-control"
                  value={bannerHeading}
                  onChange={(e) => setBannerHeading(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Heading Tag</label>
                <select 
                  className="form-select" 
                  value={bannerHeadingTag} 
                  onChange={(e) => setBannerHeadingTag(e.target.value)}
                >
                  <option value="h1">H1</option>
                  <option value="h2">H2</option>
                  <option value="h3">H3</option>
                  <option value="h4">H4</option>
                  <option value="h5">H5</option>
                  <option value="h6">H6</option>
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-9">
                <label className="form-label">Career Page Description</label>
                <textarea
                  rows={3}
                  className="form-control"
                  value={bannerDescription}
                  onChange={(e) => setBannerDescription(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Desc. Font Size (px)</label>
                <input
                  type="number"
                  min="10"
                  max="30"
                  className="form-control"
                  value={bannerDescFontSize}
                  onChange={(e) => setBannerDescFontSize(e.target.value)}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-9">
                <label className="form-label">Banner Heading</label>
                <input
                  type="text"
                  className="form-control"
                  value={bgHeading}
                  onChange={(e) => setBgHeading(e.target.value)}
                  placeholder="e.g., Join Our Team"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Heading Tag</label>
                <select 
                  className="form-select" 
                  value={bgHeadingTag} 
                  onChange={(e) => setBgHeadingTag(e.target.value)}
                >
                  <option value="h1">H1</option>
                  <option value="h2">H2</option>
                  <option value="h3">H3</option>
                  <option value="h4">H4</option>
                  <option value="h5">H5</option>
                  <option value="h6">H6</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <label className="form-label">Banner Image</label>
                <input
                  type="file"
                  className="form-control"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setBackgroundImage(e.target.files[0]);
                      setBackgroundPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
                {backgroundPreview && (
                  <div className="mt-3">
                    <img
                      src={backgroundPreview}
                      alt="Banner Background Preview"
                      className="rounded border w-100"
                      style={{ height: 160, objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- Icon Blocks Section --- */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Icon Blocks</h4>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#blockModal"
            onClick={openAddBlockModal}
          >
            <FaPlus className="me-2" /> Add Icon Block
          </button>
        </div>

        <div className="table-responsive mb-5">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>SN</th>
                <th>Icon</th>
                <th>Heading</th>
                <th>Tag</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section, index) => {
                const imgSrc =
                  section.image instanceof File
                    ? section.preview
                    : typeof section.image === "string"
                    ? section.image
                    : "";

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {imgSrc ? (
                        <img src={imgSrc} alt={section.heading} height="50" style={{ objectFit: "contain" }} />
                      ) : (
                        <span className="text-muted small">No icon</span>
                      )}
                    </td>
                    <td>{section.heading || <span className="text-muted">Untitled</span>}</td>
                    <td><span className="badge bg-secondary text-uppercase">{section.headingTag}</span></td>
                    <td>
                      <div className="text-truncate" style={{ maxWidth: "200px" }}>
                        {section.description}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#blockModal"
                        onClick={() => openEditBlockModal(section, index)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteSection(index)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- CKEditor Table Section --- */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
  <div className="d-flex justify-content-between align-items-center mb-3">
  <h5 className="fw-bold mb-0">Career Page Editor</h5>
  <button className="btn btn-sm btn-success" disabled={saving} onClick={handleTableSave}>
    <FaSave className="me-2" />
    {saving ? "Saving..." : "Save Content"}
  </button>
</div>
            <CKEditorComponent 
  pageData={tableContent} 
  setPageData={(data) => setTableContent(data)} 
/>
          </div>
        </div>

      </div>

      {/* --- Edit Icon Block Modal --- */}
      <div className="modal fade" id="blockModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Edit Icon Block</h1>
              <button
                type="button"
                className="btn-close"
                id="blockModalClose"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleBlockSave}>
              <div className="modal-body row">
                <div className="mb-3 col-md-9">
                  <label className="form-label">Icon Heading</label>
                  <input
                    type="text"
                    className="form-control"
                    name="heading"
                    value={blockForm.heading}
                    onChange={handleBlockFormChange}
                    required
                  />
                </div>
                <div className="mb-3 col-md-3">
                  <label className="form-label">Heading Tag</label>
                  <select 
                    className="form-select" 
                    name="headingTag"
                    value={blockForm.headingTag} 
                    onChange={handleBlockFormChange}
                  >
                    <option value="h2">H2</option>
                    <option value="h3">H3</option>
                    <option value="h4">H4</option>
                    <option value="h5">H5</option>
                    <option value="h6">H6</option>
                  </select>
                </div>

                <div className="mb-3 col-md-9">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={blockForm.description}
                    onChange={handleBlockFormChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-3 col-md-3">
                  <label className="form-label">Font Size (px)</label>
                  <input
                    type="number"
                    min="10"
                    max="30"
                    className="form-control"
                    name="descriptionFontSize"
                    value={blockForm.descriptionFontSize}
                    onChange={handleBlockFormChange}
                  />
                </div>

                {/* <div className="mb-3 col-md-6">
                  <label className="form-label">Icon Resize (%)</label>
                  <input
                    type="range"
                    className="form-range"
                    name="imageSize"
                    min="10"
                    max="150"
                    value={blockForm.imageSize}
                    onChange={handleBlockFormChange}
                  />
                  <div className="text-muted text-center fw-bold">
                    {blockForm.imageSize || 100}%
                  </div>
                </div> */}

                <div className="mb-3 col-md-6">
                  <label className="form-label">Upload New Icon</label>
                  <input
                    type="file"
                    className="form-control"
                    name="image"
                    accept="image/*"
                    onChange={handleBlockFormChange}
                  />
                  {blockForm.preview && (
                    <img
                      src={blockForm.preview}
                      alt="Block preview"
                      className="mt-2 border rounded"
                      style={{
                        width: `${(100 * (blockForm.imageSize || 100)) / 100}px`,
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>

                <div className="m-auto mt-2 col-12 d-flex justify-content-end">
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
}