"use client";

import React, { useState } from "react";
import BackgroundImageWithHeading from "../../components/BackgroundImageWithHeading";
import api from "@/utils/api";
import { toast } from "react-toastify";

export default function CareerFormClient({ cmsSettings, jobId, jobTitle, jobText }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    your_job_title: "",
    resume: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume" && files?.length > 0) {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    if (jobId) formDataToSend.append("job_id", jobId);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("your_job_title", formData.your_job_title);
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
        });
      } else {
        toast.error("Error submitting form. Please try again.");
      }
    } catch (error) {
      toast.error(error.message ?? "Error submitting form. Please try again.");
      console.error("Error submitting application:", error);
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
      />

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
            <div className="pe-lg-5">
              <h2 className="pb-4">
                {jobTitle || jobText?.heading || "High Creation Interior Team"}
              </h2>
              {jobText?.paragraph ? (
                <div dangerouslySetInnerHTML={{ __html: jobText.paragraph }} />
              ) : (
                <p style={{ fontSize: "18px" }}>
                  Can&apos;t find something suitable, but eager to work with us?
                  Write to us at hr@hcinterior.in and we&apos;ll try to make it
                  happen.
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
              <form className="row" onSubmit={handleSubmit}>
                <div className="mb-3 col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder={cmsSettings?.placeholder_name || "Full Name"}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder={cmsSettings?.placeholder_email || "Email"}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    placeholder={cmsSettings?.placeholder_phone || "Contact No."}
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3 col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    name="your_job_title"
                    placeholder={cmsSettings?.placeholder_job_position || "Job Position"}
                    value={formData.your_job_title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3 col-md-12">
                  <div className="input-group mb-3">
                    <input
                      type="file"
                      className="form-control me-2 w-75"
                      id="inputGroupFile02"
                      name="resume"
                      accept="application/pdf"
                      onChange={handleInputChange}
                    />
                    <label
                      className="input-group-text rounded-5 mt-3 mt-lg-0"
                      htmlFor="inputGroupFile02"
                    >
                      {cmsSettings?.resume_button_label || "Upload your resume"}
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="invalidCheck"
                      required
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
                    {cmsSettings?.submit_button_text || "Submit"}
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