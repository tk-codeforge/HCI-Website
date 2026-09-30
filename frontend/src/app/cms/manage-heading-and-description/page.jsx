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

const SHADOW_MIN = 1;
const SHADOW_MAX = 20;
const SHADOW_STEP = 1;

// Builds the CSS text-shadow value. Use this same function on your public pages.
const buildTextShadow = (enabled, intensity) =>
  enabled
    ? `0 ${Math.ceil(intensity / 2)}px ${intensity}px rgba(0,0,0,0.6)`
    : "none";

// Small reusable control: toggle + (−) value (+)
function ShadowControl({ label, enabled, intensity, onToggle, onChange }) {
  const change = (delta) =>
    onChange(Math.min(SHADOW_MAX, Math.max(SHADOW_MIN, intensity + delta)));

  return (
    <div className="col-md-3">
      <label className="form-label fw-bold">{label}</label>
      <div className="form-check form-switch mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span className="form-check-label">{enabled ? "On" : "Off"}</span>
      </div>
      <div className="input-group input-group-sm">
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={!enabled || intensity <= SHADOW_MIN}
          onClick={() => change(-SHADOW_STEP)}
        >
          −
        </button>
        <input className="form-control text-center" value={intensity} readOnly />
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={!enabled || intensity >= SHADOW_MAX}
          onClick={() => change(SHADOW_STEP)}
        >
          +
        </button>
      </div>
    </div>
  );
}

const defaultEntry = (key) => ({
  headingText: "",
  headingTag: "h2",
  headingColor: "#222222",
  descriptionText: "",
  descriptionColor: "#555555",
  descriptionFontSize: 16,
  bannerImage: "",
  headingShadowEnabled: false,
  headingShadowIntensity: 6,
  descriptionShadowEnabled: false,
  descriptionShadowIntensity: 4,
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
  const [savingKeys, setSavingKeys] = useState({});
  const [bannerFiles, setBannerFiles] = useState({}); // { our_product: { file, previewUrl } } 

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

  const fetchData = useCallback(async (silent = false) => {
    try {
     if (!silent) setLoading(true);

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
                    bannerImage: source.bannerImage ?? "",
          headingShadowEnabled: source.headingShadowEnabled ?? false,
          headingShadowIntensity: source.headingShadowIntensity || 6,
          descriptionShadowEnabled: source.descriptionShadowEnabled ?? false,
          descriptionShadowIntensity: source.descriptionShadowIntensity || 4,
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

 const handleBannerSelect = (key, file) => {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    toast.error("Please select an image file.");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image must be smaller than 5 MB.");
    return;
  }
  setBannerFiles((prev) => {
    if (prev[key]?.previewUrl) URL.revokeObjectURL(prev[key].previewUrl);
    return { ...prev, [key]: { file, previewUrl: URL.createObjectURL(file) } };
  });
};

const handleBannerRemove = async (key, label) => {
  const discardPending = () =>
    setBannerFiles((prev) => {
      if (prev[key]?.previewUrl) URL.revokeObjectURL(prev[key].previewUrl);
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });

  // Nothing saved on the server yet (only a picked file): just discard it locally
  if (!entries[key]?.bannerImage) {
    discardPending();
    return;
  }

  try {
    setSavingKeys((prev) => ({ ...prev, [key]: true }));

    const { [key]: _skip, ...otherFiles } = bannerFiles; // don't re-upload this page's picked file
    const payload = {
      ...buildSectionsPayload(),
      [key]: { ...entries[key], bannerImage: "" },
    };

    await persistSections(payload, otherFiles);
    discardPending();
    toast.success(`${label} banner removed.`);
  } catch (err) {
    console.log(err);
    toast.error(`Failed to remove ${label} banner.`);
  } finally {
    setSavingKeys((prev) => ({ ...prev, [key]: false }));
  }
};

  const buildSectionsPayload = () => {
    const localSections = {};
    PAGE_DEFS.forEach((def) => {
      localSections[def.key] = entries[def.key];
    });
    return localSections;
  };

  // const persistSections = async (localSections) => {
  //   if (recordId) {
  //     await api.patch(`/cms-content/${recordId}`, {
  //       json_content: { sections: localSections },
  //     });
  //   } else {
  //     const res = await api.post(`/cms-content/${CMS_KEY}`, {
  //       json_content: { sections: localSections },
  //     });
  //     const created = readRecord(res);
  //     if (created?.id) setRecordId(created.id);
  //   }
  // };

const persistSections = async (localSections, filesToSend = bannerFiles) => {
  let id = recordId;

  // First time ever: create the row with plain JSON (no files)
  if (!id) {
    const res = await api.post(`/cms-content/${CMS_KEY}`, {
      json_content: { sections: localSections },
    });
    id = readRecord(res)?.id;
    if (!id) throw new Error("Could not create record");
    setRecordId(id);
  }

  const formData = new FormData();
  formData.append("sections", JSON.stringify(localSections));
   Object.entries(filesToSend).forEach(([key, { file }]) => {
    formData.append(`banner_${key}`, file);
  });

  await api.patch(`/cms-content/update-heading-description/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

    const ok = await fetchData(true); // reload so bannerImage becomes the real server URL
  if (ok) {
    Object.values(bannerFiles).forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
    setBannerFiles({});
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
            <h2 className="fw-bold mb-1">Manage Heading, Description &amp; Banner</h2>
          </div>

          <button className="btn btn-success" disabled={saving} onClick={handleSave}>
            <FaSave className="me-2" />
            {saving ? "Saving..." : "Save All"}
          </button>
        </div>

        {PAGE_DEFS.map((def) => {
          const entry = entries[def.key];
          const PreviewTag = entry.headingTag;
          const bannerSrc = bannerFiles[def.key]?.previewUrl || entry.bannerImage;

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

                                    {/* ---------- Banner ---------- */}
<div className="col-md-12">
  <label className="form-label fw-bold">Banner Image</label>

  <div className="d-flex align-items-center gap-3 flex-wrap">
    <input
      type="file"
      accept="image/*"
      className="form-control"
      style={{ maxWidth: 360 }}
      onChange={(e) => {
        handleBannerSelect(def.key, e.target.files?.[0]);
        e.target.value = "";
      }}
    />

    {(bannerFiles[def.key]?.previewUrl || entry.bannerImage) && (
      <>
        <img
          src={bannerFiles[def.key]?.previewUrl || entry.bannerImage}
          alt="Banner thumbnail"
          style={{ height: 48, borderRadius: 4, objectFit: "cover" }}
        />
        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          disabled={!!savingKeys[def.key]}
  onClick={() => handleBannerRemove(def.key, def.label)}
        >
          Remove
        </button>
      </>
    )}
  </div>
</div>

                  {/* ---------- Shadows ---------- */}
                  <ShadowControl
                    label="Heading Shadow"
                    enabled={entry.headingShadowEnabled}
                    intensity={entry.headingShadowIntensity}
                    onToggle={(v) => handleEntryChange(def.key, "headingShadowEnabled", v)}
                    onChange={(v) => handleEntryChange(def.key, "headingShadowIntensity", v)}
                  />

                  <ShadowControl
                    label="Description Shadow"
                    enabled={entry.descriptionShadowEnabled}
                    intensity={entry.descriptionShadowIntensity}
                    onToggle={(v) => handleEntryChange(def.key, "descriptionShadowEnabled", v)}
                    onChange={(v) => handleEntryChange(def.key, "descriptionShadowIntensity", v)}
                  />
                </div>

                {/* Live preview using the chosen tag, colors, and font sizes */}
                {/* <div className="mt-3 p-3 bg-light rounded">
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
                </div> */}

                                {/* Live preview: heading + description on the banner */}

                                <style>{`
  #preview-heading-${def.key} {
    color: ${entry.headingColor} !important;
    text-shadow: ${buildTextShadow(entry.headingShadowEnabled, entry.headingShadowIntensity)} !important;
  }
  #preview-description-${def.key} {
    color: ${entry.descriptionColor} !important;
    font-size: ${entry.descriptionFontSize}px !important;
    text-shadow: ${buildTextShadow(entry.descriptionShadowEnabled, entry.descriptionShadowIntensity)} !important;
  }
`}</style>
                <small className="text-muted d-block mt-3 mb-2">Preview</small>
                <div
                  className="rounded d-flex flex-column justify-content-center align-items-center text-center p-4"
                  style={{
                    minHeight: 220,
                    backgroundColor: "#888",
                    backgroundImage: bannerSrc ? `url("${bannerSrc}")` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
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

                  {React.createElement(
                    PreviewTag,
                    {
                       id: `preview-heading-${def.key}`,
                      style: {
                        color: entry.headingColor,
                        margin: 0,
                        fontWeight: 700,
                        textShadow: buildTextShadow(
                          entry.headingShadowEnabled,
                          entry.headingShadowIntensity
                        ),
                      },
                    },
                    entry.headingText || "Heading preview"
                  )}

                  <p
                  id={`preview-description-${def.key}`}
                    className="mb-0 mt-2"
                    style={{
                      color: entry.descriptionColor,
                      fontSize: `${entry.descriptionFontSize}px`,
                      textShadow: buildTextShadow(
                        entry.descriptionShadowEnabled,
                        entry.descriptionShadowIntensity
                      ),
                    }}
                  >
                    {entry.descriptionText || "Description preview"}
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
