"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/utils/api";
import { buildLeadMetadata } from "@/utils/leadForms";
import { validateLeadField } from "@/utils/leadValidation";

const PLACE_OPTIONS = ["Noida", "Delhi", "Gurugram", "Faridabad"];
const FIELD_ORDER = ["friend_name", "friend_number", "friend_email", "place", "other_place", "phone_no"];
const PHONE_FIELDS = ["friend_number", "phone_no"];
// maps this form's field names to the shared rules in leadValidation.js
const FIELD_MAP = {
  friend_name: "fullName",
  friend_number: "contact",
  friend_email: "email",
  other_place: "place",
  phone_no: "contact",
};

const sanitizePhone = (value) => {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  return digits.slice(0, 10);
};

const FieldError = ({ msg }) => (msg ? <div className="refer-field-error">{msg}</div> : null);

export default function ReferFormClient({
  formFields,
  submitButtonText,
  submitButtonBgColor,
  submitButtonColor,
}) {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    friend_name: "",
    friend_number: "",
    friend_email: "",
    place: "",
    other_place: "",
    phone_no: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Required-ness comes from the CMS; format is always checked when a value exists
  const validateField = (name, rawValue, values) => {
    const cfg = formFields[name];
    const value = rawValue.trim();
    if (!value) return cfg?.required ? `${cfg?.label || "This field"} is required.` : "";

    if (name === "place") {
      return PLACE_OPTIONS.includes(value) ? "" : "Please select a valid place.";
    }

    const err = validateLeadField(FIELD_MAP[name] || name, value);
    if (err) return err;

    if (name === "friend_number" && value === values.phone_no.trim()) {
      return "Friend's number must be different from your number.";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    FIELD_ORDER.forEach((key) => {
      if (!formFields[key]?.shown) return;
      const err = validateField(key, formData[key], formData);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name } = e.target;
    const value = PHONE_FIELDS.includes(name) ? sanitizePhone(e.target.value) : e.target.value;
    const next = { ...formData, [name]: value };
    setFormData(next);
    if (errors[name] !== undefined) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value, next) }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const trimmed = value.trim();
    const next = { ...formData, [name]: trimmed };
    setFormData(next);
    setErrors((prev) => ({ ...prev, [name]: validateField(name, trimmed, next) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the highlighted fields.");
      return;
    }
    setSubmitting(true);

    // ASSUMPTION: sends to the same /user-queries endpoint as your other lead forms.
    // If you have a dedicated referral endpoint, change the URL and payload here.
    try {
      const response = await api.post("/user-queries", {
        name: formData.friend_name.trim(),
        mobile: formData.friend_number.trim(),
        email: formData.friend_email.trim(),
        place: formData.other_place.trim() || formData.place,
        query: formData.phone_no.trim()
          ? `Referral. Referred by: ${formData.phone_no.trim()}`
          : "Referral",
        ...buildLeadMetadata({
          pathname,
          leadFormType: "inline",
          leadFormName: "Refer and Earn Form",
          ctaText: submitButtonText,
        }),
      });

      if (response.status === 201) {
        toast.success("Referral submitted successfully!");
        setFormData({
          friend_name: "",
          friend_number: "",
          friend_email: "",
          place: "",
          other_place: "",
          phone_no: "",
        });
        setErrors({});
        setTimeout(() => {
          window.location.href = "/thank-you";
        }, 300);
      } else {
        toast.error("Failed to submit. Please try again.");
      }
    } catch (error) {
      toast.error(error.message ?? "Error submitting form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const common = (key) => ({
    id: `refer_${key}`,
    name: key,
    value: formData[key],
    onChange: handleInputChange,
    onBlur: handleInputBlur,
    className: `form-control ${errors[key] ? "is-invalid" : ""}`,
    placeholder: formFields[key]?.placeholder,
    "aria-label": formFields[key]?.label,
    required: formFields[key]?.required,
  });

  return (
    <form className="row" onSubmit={handleSubmit} noValidate>
      {formFields.friend_name?.shown && (
        <div className="col-md-6 mb-3">
          <input type="text" {...common("friend_name")} maxLength={60} autoComplete="off" />
          <FieldError msg={errors.friend_name} />
        </div>
      )}

      {formFields.friend_number?.shown && (
        <div className="col-md-6 mb-3">
          <input type="tel" inputMode="numeric" {...common("friend_number")} maxLength={10} autoComplete="off" />
          <FieldError msg={errors.friend_number} />
        </div>
      )}

      {formFields.friend_email?.shown && (
        <div className="col-md-6 mb-3">
          <input type="email" {...common("friend_email")} maxLength={100} autoComplete="off" />
          <FieldError msg={errors.friend_email} />
        </div>
      )}

      {formFields.place?.shown && (
        <div className="col-md-6 mb-3">
          <select
            {...common("place")}
            className={`form-select form-control ${errors.place ? "is-invalid" : ""}`}
          >
            <option value="" hidden>{formFields.place.placeholder}</option>
            {PLACE_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <FieldError msg={errors.place} />
        </div>
      )}

      {formFields.other_place?.shown && (
        <div className="col-md-6 mb-3">
          <input type="text" {...common("other_place")} maxLength={50} autoComplete="off" />
          <FieldError msg={errors.other_place} />
        </div>
      )}

      {formFields.phone_no?.shown && (
        <div className="col-md-6 mb-3">
          <input type="tel" inputMode="numeric" {...common("phone_no")} maxLength={10} autoComplete="tel-national" />
          <FieldError msg={errors.phone_no} />
        </div>
      )}

      <style>{`
        .refer_form .form_heading {
          color: var(--form-heading-color) !important;
        }
        .refer_form .know_more {
          background-color: var(--submit-btn-bg-color) !important;
          color: var(--submit-btn-text-color) !important;
          border-color: var(--submit-btn-bg-color) !important;
        }
        .refer_form .refer-field-error {
          display: inline-block;
          margin-top: 4px;
          padding: 2px 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.9);
          color: #dc3545;
          font-size: 13px;
          text-align: left;
        }
      `}</style>

      <div className="col-12 mt-3 d-flex m-auto justify-content-center">
        <button
          className="btn know_more px-5 py-2"
          type="submit"
          disabled={submitting}
          style={{
            backgroundColor: submitButtonBgColor,
            color: submitButtonColor,
            borderColor: submitButtonBgColor,
          }}
        >
          {submitting ? "Submitting..." : submitButtonText}
        </button>
      </div>
    </form>
  );
}