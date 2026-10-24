"use client";

import React, { useRef, useState } from "react";
import BackgroundImageWithHeading from "../../components/BackgroundImageWithHeading";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { validateLeadField } from "@/utils/leadValidation";

const FIELD_MAP = { name: "fullName", phone: "contact", your_job_title: "jobTitle" };
const validateField = (name, value) => validateLeadField(FIELD_MAP[name] || name, value);

const MAX_RESUME_MB = 5; // set this to your API's upload limit
const validateResume = (file) => {
  if (!file) return "Please upload your resume (PDF).";
  if (file.size === 0) return "The selected file is empty.";
  if (file.type !== "application/pdf" || !/\.pdf$/i.test(file.name))
    return "Only PDF files are allowed.";
  if (file.size > MAX_RESUME_MB * 1024 * 1024)
    return `File must be smaller than ${MAX_RESUME_MB} MB.`;
  return "";
};

export default function CareerFormClient({ cmsSettings, jobId, jobTitle, jobText }) {
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   phone: "",
  //   your_job_title: "",
  //   resume: null,
  // });

    const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    your_job_title: "",
    resume: null,
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // const handleInputChange = (e) => {
  //   const { name, value, files } = e.target;
  //   if (name === "resume" && files?.length > 0) {
  //     setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
  //   } else {
  //     setFormData((prevData) => ({ ...prevData, [name]: value }));
  //   }
  // };

    const validateForm = () => {
    const newErrors = {};
    ["name", "email", "phone", "your_job_title"].forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    });
    const resumeErr = validateResume(formData.resume);
    if (resumeErr) newErrors.resume = resumeErr;
    if (!formData.termsAccepted) newErrors.termsAccepted = "You must agree before submitting.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    // phone: digits only, drop a pasted +91 / 91 prefix, max 10
    if (name === "phone") {
      let digits = value.replace(/\D/g, "");
      if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
      value = digits.slice(0, 10);
    }
    if (name === "email") {
  value = value.toLowerCase().replace(/\s/g, "");
}

    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    const err = validateResume(file);
    if (err) e.target.value = ""; // drop an invalid file so it can't be submitted
    setFormData((prev) => ({ ...prev, resume: err ? null : file }));
    setErrors((prev) => ({ ...prev, resume: err }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({ ...prev, termsAccepted: checked }));
    setErrors((prev) => ({
      ...prev,
      termsAccepted: checked ? "" : "You must agree before submitting.",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        if (!validateForm()) {
      toast.error("Please correct the highlighted fields.");
      return;
    }
    setSubmitting(true);

    const formDataToSend = new FormData();
    if (jobId) formDataToSend.append("job_id", jobId);
    formDataToSend.append("name", formData.name.trim());
    formDataToSend.append("email", formData.email.trim().toLowerCase());
    formDataToSend.append("phone", formData.phone.trim());
    formDataToSend.append("your_job_title", formData.your_job_title.trim());
    if (formData.resume) {
      formDataToSend.append("resume", formData.resume);
    }

    try {
      const response = await api.post(`/job-application`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Form submitted successfully.");
                setFormData({
          name: "",
          email: "",
          phone: "",
          your_job_title: "",
          resume: null,
          termsAccepted: false,
        });
        setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error("Error submitting form. Please try again.");
      }
    } catch (error) {
      toast.error(error.message ?? "Error submitting form. Please try again.");
      console.error("Error submitting application:", error);
    }
    finally {
      setSubmitting(false);
    }
  };

  const renderCheckboxLabel = () => {
    const mainText = cmsSettings?.checkbox_text || "Accept Terms & Conditions";
    const links = cmsSettings?.checkbox_links || [];

    if (!links || links.length === 0) {
      return mainText;
    }

    let matchedAny = false;
    let elements = [mainText];

    links.forEach((link, linkIdx) => {
      if (!link.text) return;

      const newElements = [];
      elements.forEach((node) => {
        if (typeof node !== "string") {
          newElements.push(node);
          return;
        }

        const index = node.indexOf(link.text);
        if (index !== -1) {
          matchedAny = true;
          const before = node.slice(0, index);
          const after = node.slice(index + link.text.length);

          if (before) newElements.push(before);
          newElements.push(
            link.url ? (
              <a
                key={`link-${linkIdx}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="career-form-checkbox-link"
              >
                {link.text}
              </a>
            ) : (
              link.text
            )
          );
          if (after) newElements.push(after);
        } else {
          newElements.push(node);
        }
      });
      elements = newElements;
    });

    if (!matchedAny) {
      return (
        <>
          <span className="me-1">{mainText}</span>
          {links.map((link, idx) => (
            <span key={idx}>
              {idx > 0 && " "}
              {link.url ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="career-form-checkbox-link"
                >
                  {link.text}
                </a>
              ) : (
                link.text
              )}
            </span>
          ))}
        </>
      );
    }

    return elements;
  };

  return (
    <main>
      <BackgroundImageWithHeading
        sectionBgImages={"contact_wrapper career_form_banner"}
        sectionBgHeading={cmsSettings?.title || "Career Form"}
        secBgHeadingClass="sec_bgheading_lass"
        sectionBgDescription=""
        secBgDesClass={"text-center text-white"}
                bgImageUrl={cmsSettings?.image}
        bgImageAlt={cmsSettings?.image_alt}
      />

<style>{`
        .job-description-content a {
          color: inherit !important;
          text-decoration: none !important;
          transition: color 0.2s ease-in-out;
        }
        
        .job-description-content a:hover {
          color: #f2793a !important; /* Theme orange */
          text-decoration: none !important;
        }

                .career-form-card .career-field-error {
          display: inline-block;
          margin-top: 4px;
          padding: 2px 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.9);
          color: #dc3545;
          font-size: 13px;
        }
      `}</style>

      {(cmsSettings?.bg_color || cmsSettings?.font_color) && (
        <style>{`
          .career-form-card {
            ${cmsSettings?.bg_color ? `background-color: ${cmsSettings.bg_color} !important;` : ""}
            ${cmsSettings?.font_color ? `color: ${cmsSettings.font_color} !important;` : ""}
          }
        `}</style>
      )}
      {(cmsSettings?.submit_button_color || cmsSettings?.submit_button_text_color) && (
        <style>{`
          .career-form-submit-btn {
            ${cmsSettings?.submit_button_color ? `background-color: ${cmsSettings.submit_button_color} !important; border-color:${cmsSettings.submit_button_color} !important;` : ""}
            ${cmsSettings?.submit_button_text_color ? `color: ${cmsSettings.submit_button_text_color} !important;` : ""}
          }
          .career-form-card h4.career-form-title {
            ${cmsSettings?.font_color ? `color: ${cmsSettings.font_color} !important;` : ""}
          }
          .career-form-card .career-form-checkbox-link {
            color: #ffc107 !important;
            text-decoration: underline;
          }
        `}</style>
      )}

      <section className="container my-5 map">
        <div className="row mx-0 g-3">
          <div className="col-lg-5 d-flex align-items-center">
            <div className="pe-lg-5 job-description-content">
              <h2 className="pb-4">
                {jobTitle || jobText?.heading || "High Creation Interior Team"}
              </h2>
              {jobText?.paragraph ? (
                <div dangerouslySetInnerHTML={{ __html: jobText.paragraph }} />
              ) : (
                // <p style={{ fontSize: "17px" }}>
                //   Can&apos;t find something suitable, but eager to work with us?
                //   Write to us at hr@hcinterior.in and we&apos;ll try to make it
                //   happen.
                // </p>
                <p style={{ fontSize: "17px" }}>
  Can&apos;t find something suitable, but eager to work with us?
  Write to us at{" "}
  <a href="mailto:hr@hcinterior.in">
    hr@hcinterior.in
  </a>{" "}
  and we&apos;ll try to make it happen.
</p>
              )}
            </div>
          </div>
          <div className="col-lg-7">
            <div
              className="contact_form contact p-4 career-form-card"
              style={{ borderRadius: "24px" }}
            >
              <h4
                className="mb-4 career-form-title"
                style={{ color: cmsSettings?.font_color || "#000000" }}
              >
                {cmsSettings?.form_heading || "Apply Now"}
              </h4>
              <form className="row" onSubmit={handleSubmit} noValidate>
                <div className="mb-3 col-md-6">
                  <input
                    type="text"
                                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    name="name"
                    placeholder={cmsSettings?.placeholder_name || "Full Name"}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                                        onBlur={handleInputBlur}
                    maxLength={60}
                    autoComplete="name"
                    aria-label="Full Name"
                  />
                                    {errors.name && <div className="career-field-error">{errors.name}</div>}
                </div>
                <div className="mb-3 col-md-6">
                  <input
                    type="email"
                                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    name="email"
                    placeholder={cmsSettings?.placeholder_email || "Email"}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                                        onBlur={handleInputBlur}
                    maxLength={100}
                    autoComplete="email"
                    aria-label="Email"
                  />
                                    {errors.email && <div className="career-field-error">{errors.email}</div>}
                </div>
                <div className="mb-3 col-md-6">
                  <input
                    type="tel"
                                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                    name="phone"
                    placeholder={cmsSettings?.placeholder_phone || "Contact No."}
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                                        onBlur={handleInputBlur}
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel-national"
                    aria-label="Contact Number"
                  />
                                    {errors.phone && <div className="career-field-error">{errors.phone}</div>}
                </div>

                <div className="mb-3 col-md-6">
                  <input
                    type="text"
                                        className={`form-control ${errors.your_job_title ? "is-invalid" : ""}`}
                    name="your_job_title"
                    placeholder={cmsSettings?.placeholder_job_position || "Job Position"}
                    value={formData.your_job_title}
                    onChange={handleInputChange}
                    required
                                        onBlur={handleInputBlur}
                    maxLength={60}
                    autoComplete="organization-title"
                    aria-label="Job Position"
                  />
                                    {errors.your_job_title && <div className="career-field-error">{errors.your_job_title}</div>}
                </div>
                <div className="mb-3 col-md-12">
                  <div className="input-group mb-3">
                    <input
                      type="file"
                                           className={`form-control me-2 w-75 ${errors.resume ? "is-invalid" : ""}`}
                      id="inputGroupFile02"
                      name="resume"
                      accept="application/pdf"
                      ref={fileInputRef}
                      required
                      onChange={handleFileChange}
                    />
                    <label
                      className="input-group-text rounded-5 mt-3 mt-lg-0"
                      htmlFor="inputGroupFile02"
                    >
                      {cmsSettings?.resume_button_label || "Upload your resume"}
                    </label>
                  </div>
                                    {errors.resume && <div className="career-field-error">{errors.resume}</div>}
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                                            className={`form-check-input ${errors.termsAccepted ? "is-invalid" : ""}`}
                      type="checkbox"
                      id="invalidCheck"
                      required
                                            checked={formData.termsAccepted}
                      onChange={handleCheckboxChange}
                    />
                    <label
                      className="form-check-label ms-1"
                      htmlFor="invalidCheck"
                      style={{ color: cmsSettings?.font_color || "#000000" }}
                    >
                      {renderCheckboxLabel()}
                    </label>
                    <div
                      className="invalid-feedback"
                      style={{ color: cmsSettings?.font_color || "inherit" }}
                    >
                      You must agree before submitting.
                    </div>
                  </div>
                </div>

                <div className="m-auto mt-3 col-12 d-flex justify-content-center">
                  <button
                    className="px-5 know_more career-form-submit-btn"
                    type="submit"
                  >
                                        {submitting ? "Submitting..." : cmsSettings?.submit_button_text || "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <hr />
    </main>
  );
}