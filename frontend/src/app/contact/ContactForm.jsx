"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import api from "@/utils/api";
import { buildLeadMetadata } from "@/utils/leadForms";
import { validateLeadField as validateField } from "@/utils/leadValidation";

const ContactForm = () => {
  const pathname = usePathname();
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
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const fields = [
      "fullName",
      "contactNo",
      "email",
      "place",
      "query",
      "termsAccepted",
    ];
    const newErrors = {};
    fields.forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    // contact no: digits only, drop +91 / 91 prefix on paste, max 10
    if (name === "contactNo") {
      let digits = value.replace(/\D/g, "");
      if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
      value = digits.slice(0, 10);
    }

    if (name === "email") {
      value = value.toLowerCase().replace(/\s/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    // once a field has been validated, keep its error live while typing
    if (errors[name] !== undefined) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const trimmed = name === "email" ? value.trim().toLowerCase() : value.trim();
    setFormData((prev) => ({ ...prev, [name]: trimmed }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, trimmed) }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, termsAccepted: checked }));
    setErrors((prev) => ({
      ...prev,
      termsAccepted: validateField("termsAccepted", checked),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmissionError("");
    if (!validateForm()) return;

    const formRequestData = {
      name: formData.fullName.trim(),
      mobile: formData.contactNo.trim(),
      email: formData.email.trim().toLowerCase(),
      place: formData.place.trim(),
      query: formData.query.trim(),
      ...buildLeadMetadata({
        pathname,
        leadFormType: "inline",
        leadFormName: "Contact Page Lead Form",
        ctaText: "SEND",
      }),
    };

    try {
      const response = await api.post("/user-queries", formRequestData);

      if (response.status === 201) {
        setSubmissionMessage("Form submitted successfully!");
        setFormData({
          fullName: "",
          contactNo: "",
          email: "",
          place: "",
          query: "",
          termsAccepted: false,
        });
        // Increased timeout from 300ms to 1500ms so users can read the success message
        setErrors({});
        setTimeout(() => {
          window.location.href = "/thank-you";
        }, 1500);
      } else {
        setSubmissionError("Failed to submit form. Please try again.");
      }
    } catch (error) {
      setSubmissionError("Error submitting form. Please try again.");
      console.error("Error:", error);
    } finally {
      setTimeout(() => {
    setSubmissionError("");
        setSubmissionMessage("");
      }, 5000);
    }
  };

  return (
    <>
      <div className="contact_form contact">
        <h4 className="mb-3 text-black form_heading">Let’s Connect</h4>
        <form className="row" onSubmit={handleSubmit} noValidate >
          {submissionMessage && (
            <div className="text-center alert alert-success alert-dismissible fade show" role="alert">
              {submissionMessage}
            </div>
          )}
          {submissionError && (
            <div className="text-center alert alert-danger alert-dismissible fade show" role="alert">
              {submissionError}
            </div>
          )}

                    <div className="mb-3 col-md-6">
            <input
              type="text"
              className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
              name="fullName"
              placeholder="Full Name *"
              aria-label="Full Name"
              autoComplete="name"
              maxLength={60}
              value={formData.fullName}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
            />
            {errors.fullName && (
              <div className="invalid-feedback">{errors.fullName}</div>
            )}
          </div>
          <div className="mb-3 col-md-6">
            <input
              type="tel"
              inputMode="numeric"
              className={`form-control ${errors.contactNo ? "is-invalid" : ""}`}
              name="contactNo"
              placeholder="Contact No. *"
              aria-label="Contact Number"
              autoComplete="tel-national"
              maxLength={10}
              value={formData.contactNo}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
            />
            {errors.contactNo && (
              <div className="invalid-feedback">{errors.contactNo}</div>
            )}
          </div>

          <div className="mb-3 col-md-12">
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              name="email"
              placeholder="Email *"
              aria-label="Email Address"
              autoComplete="email"
              maxLength={100}
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="mb-3 col-md-12">
            <input
              type="text"
              className={`form-control ${errors.place ? "is-invalid" : ""}`}
              name="place"
              placeholder="Place *"
              aria-label="Place / City"
              autoComplete="address-level2"
              maxLength={60}
              value={formData.place}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
            />
            {errors.place && (
              <div className="invalid-feedback">{errors.place}</div>
            )}
          </div>

          <div className="mb-3 col-md-12">
            <textarea
              className={`form-control ${errors.query ? "is-invalid" : ""}`}
              name="query"
              placeholder="Query *"
              aria-label="Your Query"
              rows="3"
              maxLength={500}
              value={formData.query}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              required
            ></textarea>
            {errors.query && (
              <div className="invalid-feedback">{errors.query}</div>
            )}
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className={`form-check-input ${
                  errors.termsAccepted ? "is-invalid" : ""
                }`}
                type="checkbox"
                id="invalidCheck"
                checked={formData.termsAccepted}
                onChange={handleCheckboxChange}
                required
              />
              <label
                className="text-black form-check-label"
                htmlFor="invalidCheck"
              >
                Accept Terms & Conditions
              </label>
              {errors.termsAccepted && (
                <div className="text-danger small mt-1">
                  {errors.termsAccepted}
                </div>
              )}
            </div>
          </div>

          <div className="m-auto mt-3 col-12 d-flex justify-content-center">
            <button className="px-5 know_more btn" type="submit">
              SEND
            </button>
          </div>
        </form>
      </div>
      <style jsx global>{`
        .contact_wrapper p {
          font-size: 16px;
        }
      `}</style>
    </>
  );
};

export default ContactForm;