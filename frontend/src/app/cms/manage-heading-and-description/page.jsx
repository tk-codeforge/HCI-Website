"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { FaSave } from "react-icons/fa";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

const PAGE_DEFS = [
  { key: "designer_choice", label: "Designer Choice Page" },
  { key: "our_product", label: "Our Product Page" },
  { key: "residential_projects", label: "Residential Projects Page" },
  { key: "luxury_projects", label: "Luxury Projects Page" },
  { key: "ready_to_go_design", label: "Ready To Go Design Page" },
  { key: "wallpaper", label: "Wallpaper Page" },
  { key: "space_saving_furniture", label: "Space-Saving Furniture Page" },
  { key: "sustainable_furniture", label: "Sustainable Furniture Page" },
  { key: "furniture", label: "Furniture Page" },
  { key: "blogs", label: "Blogs Page" },
  { key: "rattan", label: "Rattan Page" },
  { key: "reclaimed_wood", label: "Reclaimed Wood Page" },
];

const HEADING_TAG_OPTIONS = ["h1", "h2", "h3", "h4", "h5", "h6"];

const CMS_KEY = "manage_heading_description";

const defaultEntry = (key) => ({
  headingText: "",
  headingTag: "h2",
  headingColor: "#222222",
  descriptionText: "",
  descriptionColor: "#555555",
  descriptionFontSize: 16,
  ...(key === "blogs" && {
    badgeText: "",
    badgeTextColor: "#ffffff",
    badgeBgColor: "#111111",
    badgeFontSize: 12,
  }),
});

export default function ManageHeadingDescription() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // Save All
  const [savingKeys, setSavingKeys] = useState({}); // per-card saving state, e.g. { our_product: true }

  const [entries, setEntries] = useState(() => {
    const initial = {};
    PAGE_DEFS.forEach((def) => (initial[def.key] = defaultEntry(def.key)));
    return initial;
  });

  // Record id for the single manage_heading_description row, so Save
  // knows whether to PATCH (already exists) or POST (first time ever saved).
  const [recordId, setRecordId] = useState(null);

  const readRecord = (res) => {
    if (!res?.data) return null;
    return Array.isArray(res.data) ? res.data[0] : res.data;
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // OK for this to 404/return nothing the very first time this page is
      // used — the record is created on first Save.
      const localRes = await api.get(`/cms-content/${CMS_KEY}`).catch(() => null);

      const localRecord = readRecord(localRes);
      const localSections = localRecord?.json_content?.sections || {};

      setRecordId(localRecord?.id || null);

      const hydrated = {};
      PAGE_DEFS.forEach((def) => {
        const source = localSections[def.key] || {};
        hydrated[def.key] = {
          headingText: source.headingText ?? "",
          headingTag: HEADING_TAG_OPTIONS.includes(source.headingTag)
            ? source.headingTag
            : "h2",
          headingColor: source.headingColor || "#222222",
          descriptionText: source.descriptionText ?? "",
          descriptionColor: source.descriptionColor || "#555555",
          descriptionFontSize: source.descriptionFontSize || 16,
          ...(def.key === "blogs" && {
    badgeText: source.badgeText ?? "",
    badgeTextColor: source.badgeTextColor || "#ffffff",
    badgeBgColor: source.badgeBgColor || "#111111",
    badgeFontSize: source.badgeFontSize || 12,
  }),
        };
      });

      setEntries(hydrated);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load heading & description data.");
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

  const buildSectionsPayload = () => {
    const localSections = {};
    PAGE_DEFS.forEach((def) => {
      localSections[def.key] = entries[def.key];
    });
    return localSections;
  };

  const persistSections = async (localSections) => {
    if (recordId) {
      await api.patch(`/cms-content/${recordId}`, {
        json_content: { sections: localSections },
      });
    } else {
      const res = await api.post(`/cms-content/${CMS_KEY}`, {
        json_content: { sections: localSections },
      });
      const created = readRecord(res);
      if (created?.id) setRecordId(created.id);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await persistSections(buildSectionsPayload());
      toast.success("All headings & descriptions saved successfully.");
    } catch (err) {
      console.log(err);
      toast.error("Failed to save headings & descriptions.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSection = async (key, label) => {
    try {
      setSavingKeys((prev) => ({ ...prev, [key]: true }));
      await persistSections(buildSectionsPayload());
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
          <div>
            <h2 className="fw-bold mb-1">Manage Heading &amp; Description</h2>
            <small className="text-muted">
              Edit the heading and description for each of the pages below.
            </small>
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
                  {def.key === "blogs" && (
    <>
      <div className="col-md-6">
        <label className="form-label fw-bold">Badge Text</label>
        <input
          className="form-control"
          value={entry.badgeText}
          onChange={(e) => handleEntryChange(def.key, "badgeText", e.target.value)}
          placeholder="e.g. Design Insights"
        />
      </div>

      <div className="col-md-2">
        <label className="form-label fw-bold">Badge Font Size</label>
        <div className="input-group">
          <input
            type="number"
            min={10}
            max={30}
            className="form-control"
            value={entry.badgeFontSize}
            onChange={(e) =>
              handleEntryChange(def.key, "badgeFontSize", Number(e.target.value) || 0)
            }
          />
          <span className="input-group-text">px</span>
        </div>
      </div>

      <div className="col-md-2">
        <label className="form-label fw-bold">Badge Text Color</label>
        <input
          type="color"
          className="form-control form-control-color w-100"
          value={entry.badgeTextColor}
          onChange={(e) => handleEntryChange(def.key, "badgeTextColor", e.target.value)}
        />
      </div>

      <div className="col-md-2">
        <label className="form-label fw-bold">Badge Background</label>
        <input
          type="color"
          className="form-control form-control-color w-100"
          value={entry.badgeBgColor}
          onChange={(e) => handleEntryChange(def.key, "badgeBgColor", e.target.value)}
        />
      </div>
    </>
  )}

                  {/* ---------- Heading controls ---------- */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Heading Text</label>
                    <input
                      className="form-control"
                      value={entry.headingText}
                      onChange={(e) =>
                        handleEntryChange(def.key, "headingText", e.target.value)
                      }
                      placeholder="Enter heading text"
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label fw-bold">Heading Tag</label>
                    <select
                      className="form-select"
                      value={entry.headingTag}
                      onChange={(e) =>
                        handleEntryChange(def.key, "headingTag", e.target.value)
                      }
                    >
                      {HEADING_TAG_OPTIONS.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-2">
                    <label className="form-label fw-bold">Heading Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color w-100"
                      value={entry.headingColor}
                      onChange={(e) =>
                        handleEntryChange(def.key, "headingColor", e.target.value)
                      }
                    />
                  </div>

                  {/* ---------- Description controls ---------- */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Description Text</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={entry.descriptionText}
                      onChange={(e) =>
                        handleEntryChange(def.key, "descriptionText", e.target.value)
                      }
                      placeholder="Enter description text"
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="form-label fw-bold">Description Font Size</label>
                    <div className="input-group">
                      <input
                        type="number"
                        min={10}
                        max={30}
                        className="form-control"
                        value={entry.descriptionFontSize}
                        onChange={(e) =>
                          handleEntryChange(
                            def.key,
                            "descriptionFontSize",
                            Number(e.target.value) || 0
                          )
                        }
                      />
                      <span className="input-group-text">px</span>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <label className="form-label fw-bold">Description Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color w-100"
                      value={entry.descriptionColor}
                      onChange={(e) =>
                        handleEntryChange(def.key, "descriptionColor", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Live preview using the chosen tag, colors, and font sizes */}
                <div className="mt-3 p-3 bg-light rounded">
                  {def.key === "blogs" && entry.badgeText && (
  <span
    className="d-inline-block mb-2 rounded-pill fw-bold text-uppercase px-3 py-1"
    style={{
      color: entry.badgeTextColor,
      backgroundColor: entry.badgeBgColor,
      fontSize: `${entry.badgeFontSize}px`,
    }}
  >
    {entry.badgeText}
  </span>
)}
                  <small className="text-muted d-block mb-2">Preview</small>

                  {React.createElement(
                    PreviewTag,
                    {
                      style: {
                        color: entry.headingColor,
                        margin: 0,
                        fontWeight: 700,
                      },
                    },
                    entry.headingText || (
                      <span className="text-muted">Heading preview</span>
                    )
                  )}

                  <p
                    className="mb-0 mt-2"
                    style={{
                      color: entry.descriptionColor,
                      fontSize: `${entry.descriptionFontSize}px`,
                    }}
                  >
                    {entry.descriptionText || (
                      <span className="text-muted">Description preview</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AuthMainLayout>
  );
}
