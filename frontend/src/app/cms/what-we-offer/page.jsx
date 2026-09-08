"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { FaSave, FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

// 🌟 FIX: A tiny 1x1 transparent pixel to trick the backend into overwriting the old image
const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// 🌟 Fallback layout — auto-applied based on odd/even position, no manual toggle needed.
// Block 1, 3, 5 ... => WHITE background, image LEFT.
// Block 2, 4, 6 ... => BLACK background, image RIGHT.
const getFallbackStyle = (index) => {
  const isEven = index % 2 === 0;
  return {
    sectionBg: isEven ? "#ffffff" : "#1a1a1a",
    headingColor: isEven ? "#212529" : "#ffffff",
    textColor: isEven ? "#495057" : "#ced4da",
    tickColor: "#f97316",
    layoutLabel: isEven ? "White · Image Left" : "Black · Image Right",
  };
};

export default function ManageWhatWeOffer() {
  const [contentId, setContentId] = useState(null);

  // Banner states
  const [bannerHeading, setBannerHeading] = useState("What We Offer");
  const [bannerHeadingColor, setBannerHeadingColor] = useState("#ffffff");
  const [bannerDescription, setBannerDescription] = useState(
    "We provide bespoke interior design solutions tailored to your vision."
  );
  const [bannerDescriptionColor, setBannerDescriptionColor] = useState("#ffffff");

  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState("");
  const fileInputRef = useRef(null);

  // Content blocks (odd/even alternating)
  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal (Edit Block) form state
  const [blockForm, setBlockForm] = useState({
    heading: "",
    pointsText: "",
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

      const res = await api.get("/cms-content/redirect_what_we_offer");
      if (!res.data) return;

      const record = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!record) return;

      setContentId(record.id);
      const content = record.json_content || {};

      setBannerHeading(content.bannerHeading || "What We Offer");
      setBannerHeadingColor(content.bannerHeadingColor || "#ffffff");
      setBannerDescription(
        content.bannerDescription ||
          "We provide bespoke interior design solutions tailored to your vision."
      );
      setBannerDescriptionColor(content.bannerDescriptionColor || "#ffffff");

      // 🌟 FIX: Intercept the transparent pixel so the CMS shows "No image selected" properly
      const dbImage = content.bg_image || "";
      setBackgroundPreview(dbImage === TRANSPARENT_PIXEL ? "" : dbImage);

      // 🌟 FIX: Guard against json_content.sections coming back as a string or non-array
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
            points: Array.isArray(s.points) && s.points.length ? s.points : [""],
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

  // ---------------- Banner handlers ----------------
  const handleRemoveBackground = () => {
    setBackgroundImage(null);
    setBackgroundPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ---------------- Block modal handlers ----------------
  const openAddBlockModal = () => {
    setBlockForm({
      heading: "",
      pointsText: "",
      imageSize: 100,
      image: null,
      preview: "",
      item_index: sections.length, // append to end
    });
  };

  const openEditBlockModal = (section, index) => {
    setBlockForm({
      heading: section.heading || "",
      pointsText: (section.points || []).join("\n"),
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

  // Persists a single block's changes (including its image) to the backend
// right away, instead of waiting for the page-level Save button.
const persistSection = async (updatedSections, newSection, index) => {
  if (!contentId) {
    toast.error("Please save the banner first — it creates the page record blocks attach to.");
    return false;
  }

  try {
    const formData = new FormData();

    const cleanedSections = updatedSections.map((s) => ({
      heading: s.heading,
      points: s.points,
      imageSize: s.imageSize,
      image: typeof s.image === "string" ? s.image : "",
    }));

    formData.append(
      "json_content",
      JSON.stringify({
        bannerHeading,
        bannerHeadingColor,
        bannerDescription,
        bannerDescriptionColor,
        bgSize: "cover",
        bg_image: backgroundPreview.startsWith("blob:") ? "" : backgroundPreview || "",
        sections: cleanedSections,
      })
    );

    if (newSection.image instanceof File) {
      formData.append("icons", newSection.image); // 🌟 FIX: was "images"
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

  // Saves the modal's edits into local state only. Nothing hits the backend
  // until the page-level "Save" button (top right) is clicked.
  const handleBlockSave = async (e) => {
  e.preventDefault();

  const updated = [...sections];
  const points = blockForm.pointsText.split("\n").map((p) => p.trim()).filter(Boolean);
  const existing = updated[blockForm.item_index];

  const newSection = {
    heading: blockForm.heading,
    points: points.length ? points : [""],
    imageSize: Number(blockForm.imageSize) || 100,
    image: blockForm.image instanceof File ? blockForm.image : existing?.image || null,
    preview: blockForm.image instanceof File ? blockForm.preview : "",
  };

  updated[blockForm.item_index] = newSection;

  const ok = await persistSection(updated, newSection, blockForm.item_index);

  if (ok) {
    toast.success("Block saved successfully.");
    document.getElementById("blockModalClose")?.click();
    fetchData(); // re-syncs the real image URL from the backend
  } else {
    toast.error("Failed to save block. Please try again.");
  }
};

  const deleteSection = (index) => {
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
  };

  // ---------------- Save (page-level, persists everything) ----------------
  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();

      const updatedSections = sections.map(({ preview, image, ...section }) => ({
        ...section,
        image: typeof image === "string" ? image : "",
      }));

      // 🌟 FIX: Logic to bypass backend empty-string ignores (banner background only)
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
          bannerHeadingColor,
          bannerDescription,
          bannerDescriptionColor,
          bgSize: "cover", // background image always fills the banner
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
        await api.post("/cms-content/redirect_what_we_offer", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Saved Successfully");
      fetchData();
    } catch (err) {
      console.log(err);
      toast.error("Save Failed");
    } finally {
      setSaving(false);
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

  return (
    <AuthMainLayout>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">{bannerHeading}</h2>

          <button className="btn btn-success" disabled={saving} onClick={handleSave}>
  <FaSave className="me-2" />
  {saving ? "Saving..." : "Save Banner"}
</button>
        </div>

        {/* Banner Content */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Banner Content</h5>

            {/* Row 1 — Heading + Description */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Banner Heading</label>
                <input
                  className="form-control"
                  value={bannerHeading}
                  onChange={(e) => setBannerHeading(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Banner Description</label>
                <textarea
                  rows={2}
                  className="form-control"
                  value={bannerDescription}
                  onChange={(e) => setBannerDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Row 2 — Heading Color + Description Color */}
            <div className="row align-items-start mb-3">
              <div className="col-md-6">
                <label className="form-label">Heading Color</label>
                <input
                  type="color"
                  className="form-control form-control-color w-100"
                  value={bannerHeadingColor}
                  onChange={(e) => setBannerHeadingColor(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Description Color</label>
                <input
                  type="color"
                  className="form-control form-control-color w-100"
                  value={bannerDescriptionColor}
                  onChange={(e) => setBannerDescriptionColor(e.target.value)}
                />
              </div>
            </div>

            {/* Row 3 — Background Image, full width, always fills as cover */}
            <div className="row">
              <div className="col-md-12">
                <label className="form-label">Background Image</label>
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
                {backgroundPreview ? (
                  <div className="mt-3">
                    <img
                      src={backgroundPreview}
                      alt="Banner Background Preview"
                      className="rounded border w-100"
                      style={{ height: 160, objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm mt-2"
                      onClick={handleRemoveBackground}
                    >
                      <FaTrash className="me-1" /> Remove Image (Use Default)
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 text-muted small">
                    No image selected. Falls back to default background. The image
                    always fills the banner completely (cover).
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Blocks */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="fw-bold mb-0">Content Blocks</h4>
          </div>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#blockModal"
            onClick={openAddBlockModal}
          >
            <FaPlus className="me-2" /> Add Block
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>SN</th>
                <th>Heading</th>
                <th>Points</th>
                <th>Layout (auto)</th>
                <th width="100">Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section, index) => {
                const fallback = getFallbackStyle(index);
                const imgSrc =
                  section.image instanceof File
                    ? section.preview
                    : typeof section.image === "string"
                    ? section.image
                    : "";

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{section.heading || <span className="text-muted">Untitled</span>}</td>
                    <td>{(section.points || []).filter(Boolean).length} point(s)</td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: fallback.sectionBg,
                          color: fallback.headingColor,
                          border: "1px solid #dee2e6",
                        }}
                      >
                        {fallback.layoutLabel}
                      </span>
                    </td>
                    <td>
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={section.heading}
                          height="50"
                          style={{ objectFit: "contain" }}
                          decoding="async"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-muted small">No image</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#blockModal"
                        onClick={() => openEditBlockModal(section, index)}
                      >
                        Edit Block
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

        {sections.length === 0 && (
          <div className="text-center text-muted py-5 border rounded">
            No content blocks yet. Click <strong>Add Block</strong> to create the first one.
          </div>
        )}
      </div>

      {/* Edit Block Modal */}
      <div className="modal fade" id="blockModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Edit Block Details</h1>
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
                <div className="mb-3 col-md-12">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="heading"
                    placeholder="e.g. Interior Design & Planning"
                    value={blockForm.heading}
                    onChange={handleBlockFormChange}
                    required
                  />
                </div>

                {/* Paragraph textarea — each line becomes a tick-point on the public page.
                    The tick icon itself is fixed and not editable. */}
                <div className="mb-2 col-md-12">
                  <label className="form-label">Description (one point per line)</label>
                  <textarea
                    className="form-control"
                    name="pointsText"
                    rows="4"
                    placeholder="Write one point per line. Each line will render with a tick icon in front of it."
                    value={blockForm.pointsText}
                    onChange={handleBlockFormChange}
                    required
                  ></textarea>
                </div>

                {blockForm.pointsText && (
                  <div className="col-md-12 mb-3 p-3 bg-white border rounded">
                    <small className="text-muted d-block mb-2">Preview</small>
                    {blockForm.pointsText
                      .split("\n")
                      .filter(Boolean)
                      .map((line, i) => (
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
                    name="imageSize"
                    min="10"
                    max="150"
                    style={{ accentColor: "#f97316" }}
                    value={blockForm.imageSize}
                    onChange={handleBlockFormChange}
                  />
                  <div className="text-muted text-center fw-bold">
                    {blockForm.imageSize || 100}%
                  </div>
                </div>

                <div className="mb-3 col-md-6">
                  <label className="form-label">Upload New Image</label>
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
                        width: `${(280 * (blockForm.imageSize || 100)) / 100}px`,
                        maxWidth: "100%",
                        objectFit: "cover",
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
