"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { FaSave, FaImage, FaUpload } from "react-icons/fa";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

// You can add more pages here later if you want to manage other banners
const PAGE_DEFS = [
  { key: "design_idea", label: "Design Idea Banner" },
  { key: "award_gallery", label: "Awards Page Banner" },
  { key: "award_galleries", label: "Award Gallery Banner" },
  { key: "team", label: "Team Page Banner" },
  { key: "terms_and_condition", label: "Terms & Condition Page Banner" },
  { key: "privacy_policy", label: "Privacy Policy Page Banner" },
  { key: "cancellation_policy", label: "Cancellation Policy Page Banner" },
  { key: "refer_and_earn", label: "Refer and Earn Page Banner" }, 
];

const HEADING_TAG_OPTIONS = ["h1", "h2", "h3", "h4", "h5", "h6"];

const DEFAULT_TEXT_SHADOW = "2px 2px 4px rgba(0,0,0,0.8)";

// Default text based on your current design-idea/page.jsx
const defaultEntry = (key) => ({
  bannerImage: "", 
  headingText: key === "design_idea" ? "Design Gallery" : "",
  headingTag: "h1",
  descriptionText: key === "design_idea" ? "Designs That Speak Before Words Do—Explore Our Most Inspiring Creations, spaces that blend beauty, functionality, and timeless design." : "",
  descriptionFontSize: 16,
});

export default function ManageBanner() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingKeys, setSavingKeys] = useState({});

  const [entries, setEntries] = useState(() => {
    const initial = {};
    PAGE_DEFS.forEach((def) => (initial[def.key] = defaultEntry(def.key)));
    return initial;
  });

  const [recordId, setRecordId] = useState(null);

const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    const localRes = await api.get(`/cms-gallery-design/manage-banner`).catch(() => null);
    const localRecord = localRes?.data || null;
    setRecordId(localRecord?.id || null);

    // const hydrated = {
    //   design_idea: {
    //     bannerImage: localRecord?.banner_image ?? defaultEntry("design_idea").bannerImage,
    //     headingText: localRecord?.banner_heading ?? defaultEntry("design_idea").headingText,
    //     headingTag: HEADING_TAG_OPTIONS.includes(localRecord?.banner_heading_tag) ? localRecord.banner_heading_tag : "h1",
    //     descriptionText: localRecord?.banner_description ?? defaultEntry("design_idea").descriptionText,
    //     descriptionFontSize: localRecord?.banner_description_font_size || 16,
    //   },
    // };

    // setEntries(hydrated);
    const hydrated = {};
for (const def of PAGE_DEFS) {
  const res = await api.get(`/cms-gallery-design/manage-banner?key=${def.key}`).catch(() => null);
  const record = res?.data || null;
  hydrated[def.key] = {
    bannerImage: record?.banner_image ?? defaultEntry(def.key).bannerImage,
    headingText: record?.banner_heading ?? defaultEntry(def.key).headingText,
    headingTag: HEADING_TAG_OPTIONS.includes(record?.banner_heading_tag) ? record.banner_heading_tag : "h1",
    descriptionText: record?.banner_description ?? defaultEntry(def.key).descriptionText,
    descriptionFontSize: record?.banner_description_font_size || 16,
  };
}
setEntries(hydrated);
  } catch (err) {
    console.log(err);
    toast.error("Failed to load banner data.");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEntryChange = (key, field, value) => {
    setEntries((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleImageUpload = (key, e) => {
  const file = e.target.files[0];
  if (file) {
    handleEntryChange(key, "bannerImageFile", file); // raw file for upload
    const reader = new FileReader();
    reader.onloadend = () => {
      handleEntryChange(key, "bannerImage", reader.result); // base64 for preview only
    };
    reader.readAsDataURL(file);
  }
};

  const buildSectionsPayload = () => {
    const localSections = {};
    PAGE_DEFS.forEach((def) => {
      localSections[def.key] = entries[def.key];
    });
    return localSections;
  };

  const persistSections = async (key) => {
  const entry = entries[key];
  const formData = new FormData();
  formData.append("banner_heading", entry.headingText);
  formData.append("banner_description", entry.descriptionText);
  formData.append("banner_heading_tag", entry.headingTag);
  formData.append("banner_description_font_size", entry.descriptionFontSize);
  formData.append("banner_key", key);

  // Only attach the file if the user picked a new one (not the existing URL string)
  if (entry.bannerImageFile) {
    formData.append("banner_image", entry.bannerImageFile);
  }

  await api.patch(`/cms-gallery-design/manage-banner?key=${key}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

  const handleSave = async () => {
    try {
      setSaving(true);
      for (const def of PAGE_DEFS) {
      await persistSections(def.key);
    }
      toast.success("All banners saved successfully.");
    } catch (err) {
      console.log(err);
      toast.error("Failed to save banners.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSection = async (key, label) => {
    try {
      setSavingKeys((prev) => ({ ...prev, [key]: true }));
      await persistSections(key);
      toast.success(`${label} saved successfully.`);
    } catch (err) {
      console.log(err);
      toast.error(`Failed to save ${label}.`);
    } finally {
      setSavingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

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
        <style>{`.live-preview-heading { color: #ffffff !important; }`}</style>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Manage Banners</h2>
            <small className="text-muted">Edit the banner image, heading, and description for your pages.</small>
          </div>
          <button className="btn btn-success" disabled={saving} onClick={handleSave}>
            <FaSave className="me-2" />
            {saving ? "Saving..." : "Save All"}
          </button>
        </div>

        {PAGE_DEFS.map((def) => {
          const entry = entries[def.key];
          const PreviewTag = entry.headingTag;

          return (
            <div key={def.key} className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="fw-bold mb-0">{def.label}</h5>
                  <button
                    className="btn btn-outline-success btn-sm"
                    disabled={!!savingKeys[def.key]}
                    onClick={() => handleSaveSection(def.key, def.label)}
                  >
                    <FaSave className="me-2" />
                    {savingKeys[def.key] ? "Saving..." : "Save"}
                  </button>
                </div>

                <div className="row g-3">
                  {/* ---------- Media Picker controls ---------- */}
                  <div className="col-md-12">
                    <label className="form-label fw-bold">Banner Image</label>
                    <div className="input-group">
                      <span className="input-group-text"><FaUpload /></span>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => handleImageUpload(def.key, e)}
                      />
                    </div>
                    {entry.bannerImage && (
                      <small className="text-success mt-1 d-block">Image uploaded and ready for preview.</small>
                    )}
                  </div>

                  {/* ---------- Heading controls ---------- */}
                  <div className="col-md-9">
                    <label className="form-label fw-bold">Heading Text</label>
                    <input
                      className="form-control"
                      value={entry.headingText}
                      onChange={(e) => handleEntryChange(def.key, "headingText", e.target.value)}
                      placeholder="Enter heading text"
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-bold">Heading Tag</label>
                    <select
                      className="form-select"
                      value={entry.headingTag}
                      onChange={(e) => handleEntryChange(def.key, "headingTag", e.target.value)}
                    >
                      {HEADING_TAG_OPTIONS.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ---------- Description controls ---------- */}
                  
                  <div className="col-md-9">
                    <label className="form-label fw-bold">Description Text</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={entry.descriptionText}
                      onChange={(e) => handleEntryChange(def.key, "descriptionText", e.target.value)}
                      placeholder="Enter description text"
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-bold">Font Size (10-30)</label>
                    <div className="input-group">
                      <input
                        type="number"
                        min={10}
                        max={30}
                        className="form-control"
                        value={entry.descriptionFontSize}
                        onChange={(e) => {
                          let val = Number(e.target.value);
                          if (val > 30) val = 30;
                          if (val < 10 && e.target.value !== "") val = 10;
                          handleEntryChange(def.key, "descriptionFontSize", val);
                        }}
                      />
                      <span className="input-group-text">px</span>
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="mt-4">
                  <small className="text-muted d-block mb-2 fw-bold">Live Preview (Shadows applied by default)</small>
                  <div
                    className="p-5 rounded d-flex flex-column justify-content-center align-items-center text-center"
                    style={{
                      minHeight: "250px",
                      backgroundColor: entry.bannerImage ? "transparent" : "#cccccc",
                      backgroundImage: entry.bannerImage ? `url(${entry.bannerImage})` : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {React.createElement(
                      PreviewTag,
                      {
                        className: "live-preview-heading",
    style: {
      color: "#ffffff",
      textShadow: DEFAULT_TEXT_SHADOW,
      margin: "0 0 10px 0",
      fontWeight: 700,
    },
                      },
                      entry.headingText || "Heading Preview"
                    )}
                    <p
                      className="mb-0"
                      style={{
                        color: "#ffffff",
                        fontSize: `${entry.descriptionFontSize || 16}px`,
                        textShadow: DEFAULT_TEXT_SHADOW,
                        maxWidth: "800px",
                      }}
                    >
                      {entry.descriptionText || "Description preview"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AuthMainLayout>
  );
}