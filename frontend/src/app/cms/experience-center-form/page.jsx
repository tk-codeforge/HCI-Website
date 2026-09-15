"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { EXPERIENCE_FORM_DEFAULT_CONFIG as IMPORTED_DEFAULT_CONFIG, renderCheckboxText  } from "../../experience-center-noida-extension/ExperienceForm";

const EXPERIENCE_FORM_DEFAULT_CONFIG = IMPORTED_DEFAULT_CONFIG || {
  backgroundColor: "",
  fontColor: "#ffffff",
  heading: "Design for Every Budget",
  subheading: "Get Your Dream house today. Let Our experts help you.",
  fields: {
    fullName: { label: "Name", placeholder: "Name", required: true, enabled: true },
    contactNo: { label: "Contact No.", placeholder: "Contact No.", required: true, enabled: true },
    email: { label: "Email ID", placeholder: "Email ID", required: true, enabled: true },
    place: { label: "Place", placeholder: "Place", required: true, enabled: true },
    query: { label: "Query", placeholder: "Query", required: false, enabled: true },
  },
  submitButton: { text: "Get free Quote", bgColor: "#ff914d", textColor: "#ffffff" },
  checkboxText: "By submitting this form, you agree to the privacy policy & terms and conditions.",
  checkboxLinks: [
    { text: "privacy policy", url: "/privacy-policy" },
    { text: "terms and conditions", url: "/terms-and-conditions" },
  ],
};

const FIELD_ORDER = ["fullName", "contactNo", "email", "place", "query"];
const FIELD_TYPE = {
  fullName: "text",
  contactNo: "text",
  email: "email",
  place: "text",
  query: "textarea",
};

const CMS_ENDPOINT = "/cms-content/experience_center_form";

export default function ExperienceCenterFormCms() {
  const [config, setConfig] = useState(EXPERIENCE_FORM_DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveIsError, setSaveIsError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(CMS_ENDPOINT);
        const record = Array.isArray(res.data) ? res.data[0] : res.data;
        const content = record?.json_content;
        if (content) {
          setConfig({
            ...EXPERIENCE_FORM_DEFAULT_CONFIG,
            ...content,
            fields: {
              ...EXPERIENCE_FORM_DEFAULT_CONFIG.fields,
              ...(content.fields || {}),
            },
            submitButton: {
              ...EXPERIENCE_FORM_DEFAULT_CONFIG.submitButton,
              ...(content.submitButton || {}),
            },
            checkboxLinks:
              content.checkboxLinks || EXPERIENCE_FORM_DEFAULT_CONFIG.checkboxLinks,
          });
        }
      } catch (err) {
        // No record saved yet — start from the defaults.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---- generic setters ----
  const setTop = (key, value) => setConfig((c) => ({ ...c, [key]: value }));

  const setField = (key, patch) =>
    setConfig((c) => ({
      ...c,
      fields: { ...c.fields, [key]: { ...c.fields[key], ...patch } },
    }));

  const setSubmitButton = (patch) =>
    setConfig((c) => ({ ...c, submitButton: { ...c.submitButton, ...patch } }));

  const setLink = (index, patch) =>
    setConfig((c) => {
      const links = [...c.checkboxLinks];
      links[index] = { ...links[index], ...patch };
      return { ...c, checkboxLinks: links };
    });

  const addLink = () =>
    setConfig((c) => ({
      ...c,
      checkboxLinks: [...c.checkboxLinks, { text: "", url: "" }],
    }));

  const removeLink = (index) =>
    setConfig((c) => ({
      ...c,
      checkboxLinks: c.checkboxLinks.filter((_, i) => i !== index),
    }));

  // ---- save ----
  // NOTE: adjust this to match your actual backend contract. This assumes
  // the same shape your other CMS content records use
  // (`{ page_name, json_content }`, upserted by page_name). If your API
  // needs a PUT to an existing record ID instead, swap it in here.
  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");
    setSaveIsError(false);
    try {
      await api.post("/cms-content", {
        page_name: "experience_center_form",
        json_content: config,
      });
      setSaveMessage("Saved. All 5 Experience Center pages now use this form.");
    } catch (err) {
      setSaveIsError(true);
      setSaveMessage(
        "Couldn't save — check that the /cms-content endpoint and payload shape match your backend."
      );
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(""), 6000);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center text-muted">
        Loading form settings…
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1">Experience Center Form</h2>
          <p className="text-muted mb-0">
            One shared form config used by all 5 Experience Center pages.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary px-4"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {saveMessage && (
        <div
          className={`alert ${saveIsError ? "alert-danger" : "alert-success"}`}
        >
          {saveMessage}
        </div>
      )}

      <div className="row g-4">
        {/* ---------------- LEFT: CONTROLS ---------------- */}
        <div className="col-lg-7">
          {/* Colors & headline copy */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Appearance</h5>

              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label className="form-label">Background Color</label>
                  <div className="d-flex gap-2">
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={config.backgroundColor || "#1a1a1a"}
                      onChange={(e) => setTop("backgroundColor", e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={config.backgroundColor}
                      placeholder="e.g. #1a1a1a (blank = default)"
                      onChange={(e) => setTop("backgroundColor", e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Font Color</label>
                  <div className="d-flex gap-2">
                    <input
                      type="color"
                      className="form-control form-control-color"
                      value={config.fontColor}
                      onChange={(e) => setTop("fontColor", e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={config.fontColor}
                      onChange={(e) => setTop("fontColor", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Heading</label>
                <input
                  type="text"
                  className="form-control"
                  value={config.heading}
                  onChange={(e) => setTop("heading", e.target.value)}
                />
              </div>

              <div className="mb-0">
                <label className="form-label">Subheading</label>
                <input
                  type="text"
                  className="form-control"
                  value={config.subheading}
                  onChange={(e) => setTop("subheading", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Form Fields</h5>
              {FIELD_ORDER.map((key) => {
                const field = config.fields[key];
                return (
                  <div key={key} className="border rounded-3 p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-semibold text-capitalize">{key}</span>
                      <div className="d-flex gap-3">
                        <div className="form-check form-switch mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={field.enabled}
                            onChange={(e) =>
                              setField(key, { enabled: e.target.checked })
                            }
                            id={`${key}-enabled`}
                          />
                          <label
                            className="form-check-label small"
                            htmlFor={`${key}-enabled`}
                          >
                            Shown
                          </label>
                        </div>
                        <div className="form-check mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) =>
                              setField(key, { required: e.target.checked })
                            }
                            id={`${key}-required`}
                            disabled={!field.enabled}
                          />
                          <label
                            className="form-check-label small"
                            htmlFor={`${key}-required`}
                          >
                            Required
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row g-2">
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={field.label}
                          placeholder="Label"
                          onChange={(e) =>
                            setField(key, { label: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-sm-6">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={field.placeholder}
                          placeholder="Placeholder"
                          onChange={(e) =>
                            setField(key, { placeholder: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <p className="text-muted small mb-0">
                Field types (text / email / textarea) are fixed to keep lead
                submissions working correctly — only labels, placeholders,
                and required/shown state are editable here.
              </p>
            </div>
          </div>

          {/* Submit button */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Submit Button</h5>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label">Button Text</label>
                  <input
                    type="text"
                    className="form-control"
                    value={config.submitButton.text}
                    onChange={(e) => setSubmitButton({ text: e.target.value })}
                  />
                </div>
                <div className="col-sm-3">
                  <label className="form-label">Background</label>
                  <input
                    type="color"
                    className="form-control form-control-color w-100"
                    value={config.submitButton.bgColor}
                    onChange={(e) => setSubmitButton({ bgColor: e.target.value })}
                  />
                </div>
                <div className="col-sm-3">
                  <label className="form-label">Text Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color w-100"
                    value={config.submitButton.textColor}
                    onChange={(e) =>
                      setSubmitButton({ textColor: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Checkbox + links */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-1">Checkbox Text & Links</h5>
              <p className="text-muted small">
                Write the full sentence below. In the Links list, each "Link
                Text" must match a phrase inside that sentence exactly — that
                phrase becomes a clickable link to the URL you give it.
              </p>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows={2}
                  value={config.checkboxText}
                  onChange={(e) => setTop("checkboxText", e.target.value)}
                />
              </div>

              {config.checkboxLinks.map((link, i) => (
                <div className="row g-2 mb-2 align-items-center" key={i}>
                  <div className="col-sm-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Link text (must match sentence above)"
                      value={link.text}
                      onChange={(e) => setLink(i, { text: e.target.value })}
                    />
                  </div>
                  <div className="col-sm-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => setLink(i, { url: e.target.value })}
                    />
                  </div>
                  <div className="col-sm-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={() => removeLink(i)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm mt-2"
                onClick={addLink}
              >
                + Add Link
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT: LIVE PREVIEW ---------------- */}
        <div className="col-lg-5">
          <div className="position-sticky" style={{ top: "1rem" }}>
            <h6 className="text-muted text-uppercase small mb-2">Preview</h6>
            <div
              className="rounded-4 p-4"
              style={{
                backgroundColor: config.backgroundColor || "#1a1a1a",
                color: config.fontColor,
              }}
            >
              <h5 className="text-center" style={{ color: config.fontColor }}>
                {config.heading}
              </h5>
              <p className="text-center mb-4" style={{ color: config.fontColor }}>
                {config.subheading}
              </p>

              {FIELD_ORDER.filter((key) => config.fields[key]?.enabled).map(
                (key) =>
                  FIELD_TYPE[key] === "textarea" ? (
                    <textarea
                      key={key}
                      className="form-control mb-3"
                      rows={2}
                      placeholder={config.fields[key].placeholder}
                      disabled
                    />
                  ) : (
                    <input
                      key={key}
                      type={FIELD_TYPE[key]}
                      className="form-control mb-3"
                      placeholder={config.fields[key].placeholder}
                      disabled
                    />
                  )
              )}

              <button
                type="button"
                className="btn w-100 mb-3"
                style={{
                  backgroundColor: config.submitButton.bgColor,
                  color: config.submitButton.textColor,
                }}
                disabled
              >
                {config.submitButton.text}
              </button>

              <div className="form-check">
                <input type="checkbox" className="form-check-input" disabled />
                <label
                  className="form-check-label small"
                  style={{ color: config.fontColor }}
                >
                  {renderCheckboxText(config.checkboxText, config.checkboxLinks, config.fontColor)}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
