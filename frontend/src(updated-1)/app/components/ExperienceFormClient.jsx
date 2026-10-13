"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import api from "../../utils/api";
import { buildLeadMetadata } from "../../utils/leadForms";

const CENTER_NAMES_BY_PATH = {
  "/experience-center-noida-extension": "Noida Extension",
  "/experience-center": "Noida",
  "/experience-center-gurugram": "Gurugram",
  "/experience-center-faridabad": "Faridabad",
  "/experience-center-new-delhi": "New Delhi",
};

function getCenterNameFromPath(pathname) {
  return CENTER_NAMES_BY_PATH[pathname] || "Experience Center";
}

export const EXPERIENCE_FORM_DEFAULT_CONFIG = {
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
  submitButton: {
    text: "Get free Quote",
    bgColor: "#ff914d",
    textColor: "#ffffff",
  },
  checkboxText:
    "By submitting this form, you agree to the privacy policy & terms and conditions.",
  checkboxLinks: [
    { text: "privacy policy", url: "/privacy-policy" },
    { text: "terms and conditions", url: "/terms-and-conditions" },
  ],
};

const FIELD_ORDER = ["fullName", "contactNo", "email", "place", "query"];

export function renderCheckboxText(text, links) {
  const usableLinks = (links || []).filter((l) => l?.text);
  if (usableLinks.length === 0) return text;

  const escaped = usableLinks.map((l) =>
    l.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const regex = new RegExp(`(${escaped.join("|")})`, "g");
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const match = usableLinks.find((l) => l.text === part);
    if (!match) return <span key={i}>{part}</span>;
    const isExternal = /^https?:\/\//.test(match.url || "");
    return (
      <a
        key={i}
        href={match.url || "#"}
        className="exp-checkbox-link"
        style={{ color: "#ffc107", textDecoration: "none" }}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {part}
      </a>
    );
  });
}

export default function ExperienceFormClient({ initialConfig }) {
  const pathname = usePathname();

  const [config] = useState(() => {
    if (initialConfig) {
      return {
        ...EXPERIENCE_FORM_DEFAULT_CONFIG,
        ...initialConfig,
        fields: {
          ...EXPERIENCE_FORM_DEFAULT_CONFIG.fields,
          ...(initialConfig.fields || {}),
        },
        submitButton: {
          ...EXPERIENCE_FORM_DEFAULT_CONFIG.submitButton,
          ...(initialConfig.submitButton || {}),
        },
        checkboxLinks:
          initialConfig.checkboxLinks || EXPERIENCE_FORM_DEFAULT_CONFIG.checkboxLinks,
      };
    }
    return EXPERIENCE_FORM_DEFAULT_CONFIG;
  });

  const [formData, setFormData] = useState({
    fullName: "",
    contactNo: "",
    email: "",
    place: "",
    query: "",
    termsAccepted: false,
  });

  const [submissionError, setSubmissionError] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    fullName: false,
    email: false,
    contactNo: false,
    place: false,
    query: false,
    termsAccepted: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const errors = {};
    FIELD_ORDER.forEach((key) => {
      const fieldCfg = config.fields[key];
      if (!fieldCfg?.enabled) {
        errors[key] = false;
        return;
      }
      if (key === "email") {
        errors[key] =
          fieldCfg.required && !/^\S+@\S+\.\S+$/.test(formData.email);
      } else {
        errors[key] = fieldCfg.required && formData[key].trim() === "";
      }
    });

    errors.termsAccepted = !formData.termsAccepted;
    setFieldErrors(errors);
    return !Object.values(errors).some((error) => error === true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmissionError("Please fill in all required fields and accept the terms.");
      return;
    }

    const formRequestedData = {
      name: formData.fullName,
      email: formData.email,
      mobile: formData.contactNo,
      place: formData.place,
      query: formData.query,
      ...buildLeadMetadata({
        pathname,
        leadFormType: "inline",
        leadFormName: `Experience Center ${getCenterNameFromPath(pathname)} Lead Form`,
        ctaText: config.submitButton.text,
      }),
    };

    try {
      const response = await api.post("/user-queries", formRequestedData);
      if (response.status === 201) {
        setSubmissionMessage("Form submitted successfully!");
        setFormData({
          fullName: "",
          email: "",
          contactNo: "",
          place: "",
          query: "",
          termsAccepted: false,
        });
        setTimeout(() => {
          window.location.href = "/thank-you";
        }, 300);
      } else {
        setSubmissionError("Failed to submit form. Please try again.");
      }
    } catch (error) {
      setSubmissionError("Error submitting form. Please try again.");
    } finally {
      setTimeout(() => {
        setSubmissionError("");
        setSubmissionMessage("");
      }, 5000);
    }
  };

  const wrapperStyle = {
    ...(config.backgroundColor ? { backgroundColor: config.backgroundColor } : {}),
    "--experience-font-color": config.fontColor || "#ffffff",
    "--experience-submit-bg": config.submitButton.bgColor || "#ff914d",
    "--experience-submit-color": config.submitButton.textColor || "#ffffff",
  };

  return (
    <div className="form_experience_center mx-0" style={wrapperStyle}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .form_experience_center .exp-heading,
            .form_experience_center .exp-subheading,
            .form_experience_center .exp-checkbox-label {
              color: var(--experience-font-color) !important;
            }
            .form_experience_center .exp-checkbox-link {
              color: #ffc107 !important;
              text-decoration: none; 
            }
            .form_experience_center .exp-submit-btn {
              background-color: var(--experience-submit-bg) !important;
              border-color: var(--experience-submit-bg) !important;
              color: var(--experience-submit-color) !important;
            }
          `,
        }}
      />
      <form onSubmit={handleSubmit}>
        <h5 className="text-center exp-heading" style={{ color: "var(--experience-font-color)" }}>
          {config.heading}
        </h5>
        <p className="mb-4 text-center exp-subheading" style={{ color: "var(--experience-font-color)" }}>
          {config.subheading}
        </p>

        {config.fields.fullName?.enabled && (
          <div className="mt-3 mb-3">
            <input
              type="text"
              className={`form-control ${fieldErrors.fullName ? "is-invalid" : ""}`}
              placeholder={config.fields.fullName.placeholder}
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required={config.fields.fullName.required}
            />
          </div>
        )}

        {config.fields.contactNo?.enabled && (
          <div className="mb-3 col-md-12">
            <input
              type="text"
              className={`form-control ${fieldErrors.contactNo ? "is-invalid" : ""}`}
              name="contactNo"
              placeholder={config.fields.contactNo.placeholder}
              value={formData.contactNo}
              onChange={handleInputChange}
              required={config.fields.contactNo.required}
            />
          </div>
        )}

        {config.fields.email?.enabled && (
          <div className="mb-3">
            <input
              type="email"
              className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
              placeholder={config.fields.email.placeholder}
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required={config.fields.email.required}
            />
          </div>
        )}

        {config.fields.place?.enabled && (
          <div className="mb-3 col-md-12">
            <input
              type="text"
              className={`form-control ${fieldErrors.place ? "is-invalid" : ""}`}
              name="place"
              value={formData.place}
              onChange={handleInputChange}
              placeholder={config.fields.place.placeholder}
              required={config.fields.place.required}
            />
          </div>
        )}

        {config.fields.query?.enabled && (
          <div className="mb-3 col-md-12">
            <textarea
              className={`form-control ${fieldErrors.query ? "is-invalid" : ""}`}
              name="query"
              placeholder={config.fields.query.placeholder}
              rows="3"
              value={formData.query}
              onChange={handleInputChange}
              required={config.fields.query.required}
            ></textarea>
          </div>
        )}

        <div className="mb-3">
          <button type="submit" className="mb-3 know_more exp-submit-btn w-100">
            {config.submitButton.text}
          </button>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className={`form-check-input ${fieldErrors.termsAccepted ? "is-invalid" : ""}`}
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleCheckboxChange}
            required
          />
          <label className="form-check-label exp-checkbox-label">
            {renderCheckboxText(config.checkboxText, config.checkboxLinks)}
          </label>
        </div>

        {submissionError && <div className="text-center alert alert-danger">{submissionError}</div>}
        {submissionMessage && <div className="text-center alert alert-success">{submissionMessage}</div>}
      </form>
    </div>
  );
}