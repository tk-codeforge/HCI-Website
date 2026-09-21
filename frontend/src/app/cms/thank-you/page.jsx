"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSave } from "react-icons/fa";
import api from "@/utils/api";
import dynamic from "next/dynamic";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

const CKEditorComponent = dynamic(() => import("../../components/CKEditorComponent"), { ssr: false });

const DEFAULT_CONTENT =
  "<h1 style=\"text-align:center\">THANK YOU</h1>" +
  "<p style=\"text-align:center\">Thank you for contacting High Creation Interior, our team will connect with you soon.</p>";

// Button size is controlled only by font size (in pixels).
// Padding is set in em on the button, so the button grows and shrinks with the text.
const SIZE_LIMITS = {
  fontSize: { min: 10, max: 30 },
};

const clampPx = (value, { min, max }, fallback) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
};

const DEFAULTS = {
  content: DEFAULT_CONTENT,
  buttonText: "Back To Home",
  buttonBgColor: "#ff914d",
  buttonTextColor: "#ffffff",
  buttonFontSize: 16,
  buttonUrl: "/",
  buttonNewTab: false,
};

export default function ManageThankYou() {
  const [contentId, setContentId] = useState(null);

  const [content, setContent] = useState(DEFAULTS.content);
  const [buttonText, setButtonText] = useState(DEFAULTS.buttonText);
  const [buttonBgColor, setButtonBgColor] = useState(DEFAULTS.buttonBgColor);
  const [buttonTextColor, setButtonTextColor] = useState(DEFAULTS.buttonTextColor);
  const [buttonFontSize, setButtonFontSize] = useState(DEFAULTS.buttonFontSize);
  const [buttonUrl, setButtonUrl] = useState(DEFAULTS.buttonUrl);
  const [buttonNewTab, setButtonNewTab] = useState(DEFAULTS.buttonNewTab);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/cms-content/redirect_thank_you");
      if (!res.data) return;

      const record = Array.isArray(res.data) ? res.data[0] : res.data;
      if (!record) return;

      setContentId(record.id);

      let data = record.json_content || {};
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
          data = {};
        }
      }

      setContent(data.content || DEFAULTS.content);
      setButtonText(data.buttonText || DEFAULTS.buttonText);
      setButtonBgColor(data.buttonBgColor || DEFAULTS.buttonBgColor);
      setButtonTextColor(data.buttonTextColor || DEFAULTS.buttonTextColor);
      setButtonFontSize(clampPx(data.buttonFontSize, SIZE_LIMITS.fontSize, DEFAULTS.buttonFontSize));
      setButtonUrl(data.buttonUrl || DEFAULTS.buttonUrl);
      setButtonNewTab(Boolean(data.buttonNewTab));
    } catch (err) {
      console.log(err);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async () => {
    if (!buttonText.trim()) {
      toast.error("Button text is required.");
      return;
    }

    const url = buttonUrl.trim() || "/";
    const isValidUrl = /^(\/|#|https?:\/\/|mailto:|tel:)/i.test(url);
    if (!isValidUrl) {
      toast.error("Button URL must start with /, http://, https://, mailto: or tel:");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append(
        "json_content",
        JSON.stringify({
          content,
          buttonText: buttonText.trim(),
          buttonBgColor,
          buttonTextColor,
          buttonFontSize: clampPx(buttonFontSize, SIZE_LIMITS.fontSize, DEFAULTS.buttonFontSize),
          buttonUrl: url,
          buttonNewTab,
        })
      );

      if (contentId) {
        await api.patch(`/cms-content/update-with-image/${contentId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/cms-content/redirect_thank_you", formData, {
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

  const previewButtonStyle = {
    display: "inline-block",
    boxSizing: "border-box",
    backgroundColor: buttonBgColor,
    color: buttonTextColor,
    maxWidth: "100%",
    padding: "0.75em 1.75em",
    fontSize: `${Number(buttonFontSize) || DEFAULTS.buttonFontSize}px`,
    borderRadius: "50px",
    fontWeight: 500,
    lineHeight: 1.2,
  };

  return (
    <AuthMainLayout>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Thank You Page</h2>

          <button className="btn btn-success" disabled={saving} onClick={handleSave}>
            <FaSave className="me-2" />
            {saving ? "Saving..." : "Save Page"}
          </button>
        </div>

        {/* Text + Image (CKEditor) */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-1">Page Content</h5>
            <p className="text-muted small mb-3">
              Write the heading and message, and insert an image if you want one.
              Everything here is shown above the button.
            </p>

            <CKEditorComponent pageData={content} setPageData={setContent} />
          </div>
        </div>

        {/* Button settings (separate column set) */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Button Settings</h5>

            {/* Row 1 — Text + URL */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Button Text</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Back To Home"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Button URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. / or https://example.com"
                  value={buttonUrl}
                  onChange={(e) => setButtonUrl(e.target.value)}
                />
                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="buttonNewTab"
                    checked={buttonNewTab}
                    onChange={(e) => setButtonNewTab(e.target.checked)}
                  />
                  <label className="form-check-label small" htmlFor="buttonNewTab">
                    Open in a new tab
                  </label>
                </div>
              </div>
            </div>

            {/* Row 2 — Colors */}
            <div className="row align-items-start mb-3">
              <div className="col-md-3">
                <label className="form-label">Background Color</label>
                <input
                  type="color"
                  className="form-control form-control-color w-100"
                  value={buttonBgColor}
                  onChange={(e) => setButtonBgColor(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Text Color</label>
                <input
                  type="color"
                  className="form-control form-control-color w-100"
                  value={buttonTextColor}
                  onChange={(e) => setButtonTextColor(e.target.value)}
                />
              </div>
              {/* Row 3 — Size (font size only; the button grows with the text) */}
              <div className="col-md-3">
                <label className="form-label">Button Size — Font Size (px)</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    min={SIZE_LIMITS.fontSize.min}
                    max={SIZE_LIMITS.fontSize.max}
                    value={buttonFontSize}
                    onChange={(e) => setButtonFontSize(e.target.value)}
                  />
                  <span className="input-group-text">px</span>
                </div>
                <div className="form-text">
                  The button size adjusts automatically with the font size.
                </div>
              </div>
            </div>

            {/* Live button preview */}
            <div className="p-3 bg-white border rounded text-center">
              <small className="text-muted d-block mb-2">Button Preview</small>
              <span style={previewButtonStyle}>
                {buttonText || "Button"}
              </span>
            </div>
          </div>
        </div>

        {/* Full page preview */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Page Preview</h5>
            <div className="border rounded p-4 text-center bg-white">
              <div
                className="thank-you-preview"
                dangerouslySetInnerHTML={{ __html: content }}
              />
              <span style={{ ...previewButtonStyle, marginTop: 16 }}>
                {buttonText || "Button"}
              </span>
            </div>
            <style>{`
              .thank-you-preview img {
                max-width: 100%;
                height: auto;
              }
            `}</style>
          </div>
        </div>
      </div>
    </AuthMainLayout>
  );
}
