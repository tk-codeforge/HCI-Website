"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSave, FaPlus, FaTrash, FaEdit, FaCog } from "react-icons/fa";
import dynamic from "next/dynamic";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

const CAREER_FORM_PAGE_TYPE = "career_form";
const CMS_BASE = "/cms-parent-child";
// const CMS_SETTINGS_ENDPOINT = `${CMS_BASE}/page-type/${CAREER_FORM_PAGE_TYPE}`;
const CMS_SETTINGS_ENDPOINT = `${CMS_BASE}/${CAREER_FORM_PAGE_TYPE}`;
const CKEditorComponent = dynamic(
  () => import("../../components/CKEditorComponent"),
  { ssr: false }
);

const emptyJobForm = () => ({
  id: null,
  description: "",
});

const emptySettingsForm = () => ({
  id: null,
  banner_heading: "Career Form",
  banner_image: null,
  banner_image_preview: "",
  form_bg_color: "#ffffff",
  form_font_color: "#1a1a1a",
  form_heading: "Apply Now",
  placeholder_name: "Full Name",
  placeholder_email: "Email",
  placeholder_phone: "Contact No.",
  placeholder_job_position: "Job Position",
  resume_button_label: "Upload your resume",
  submit_button_text: "Submit",
  submit_button_color: "#f2793a",
  submit_button_text_color: "#ffffff",
  checkbox_text: "Accept Terms & Conditions",
  checkbox_links: [
    { text: "Accept Terms & Conditions", url: "/terms-and-conditions" },
  ],
  job_texts: {},
});

export default function CareerFormCMS() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobForm, setJobForm] = useState(emptyJobForm());

  const [settingsForm, setSettingsForm] = useState(emptySettingsForm());
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchJobs();
    fetchPageSettings();
  }, []);

  // Fetch ACTIVE jobs only
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/manage-job/active");
      const data = Array.isArray(res.data) ? res.data : [];
      const activeJobs = data.filter(
        (j) => !j.status || j.status.toLowerCase() === "active"
      );
      setJobs(activeJobs);
    } catch (err) {
      console.error("Error fetching active jobs:", err);
      try {
        const res = await api.get("/manage-job");
        const data = Array.isArray(res.data) ? res.data : [];
        setJobs(data.filter((j) => j.status?.toLowerCase() === "active"));
      } catch (fallbackErr) {
        toast.error("Failed to load active job postings.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch CMS Page Settings
  const fetchPageSettings = async () => {
    try {
      setSettingsLoading(true);
      const res = await api.get(CMS_SETTINGS_ENDPOINT);
      const records = Array.isArray(res.data) ? res.data : [];
      const record = records[0];
      const content = record?.child_content;

      if (record && content) {
        let parsedLinks = [
          { text: "Accept Terms & Conditions", url: "/terms-and-conditions" },
        ];

        if (content.checkbox_links) {
          try {
            parsedLinks =
              typeof content.checkbox_links === "string"
                ? JSON.parse(content.checkbox_links)
                : content.checkbox_links;
          } catch (e) {
            console.error("Failed to parse checkbox_links JSON", e);
          }
        } else if (content.checkbox_text) {
          parsedLinks = [
            { text: content.checkbox_text, url: content.checkbox_link || "" },
          ];
        }

        let jobTexts = {};
if (content.job_texts) {
  try {
    jobTexts = typeof content.job_texts === "string" ? JSON.parse(content.job_texts) : content.job_texts;
  } catch (e) {
    console.error("Failed to parse job_texts JSON", e);
  }
}

        setSettingsForm((prev) => ({
          ...prev,
          id: record.id,
          banner_heading: content.title || prev.banner_heading,
          banner_image_preview: content.image || "",
          form_bg_color: content.bg_color || prev.form_bg_color,
          form_font_color: content.font_color || prev.form_font_color,
          form_heading: content.form_heading || prev.form_heading,
          placeholder_name: content.placeholder_name || prev.placeholder_name,
          placeholder_email: content.placeholder_email || prev.placeholder_email,
          placeholder_phone: content.placeholder_phone || prev.placeholder_phone,
          placeholder_job_position:
            content.placeholder_job_position || prev.placeholder_job_position,
          resume_button_label:
            content.resume_button_label || prev.resume_button_label,
          submit_button_text:
            content.submit_button_text || prev.submit_button_text,
          submit_button_color:
            content.submit_button_color || prev.submit_button_color,
          submit_button_text_color:
            content.submit_button_text_color || prev.submit_button_text_color,
            checkbox_text: content.checkbox_text || prev.checkbox_text,
          checkbox_links: parsedLinks,
          job_texts: jobTexts,
        }));
      }
    } catch (err) {
      console.error("Error fetching page settings:", err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSettingsFieldChange = (e) => {
    const { name, value } = e.target;
    setSettingsForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSettingsForm((prev) => ({
      ...prev,
      banner_image: file,
      banner_image_preview: file
        ? URL.createObjectURL(file)
        : prev.banner_image_preview,
    }));
  };

  const handleCheckboxLinkChange = (index, field, value) => {
    setSettingsForm((prev) => {
      const updated = [...prev.checkbox_links];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, checkbox_links: updated };
    });
  };

  const addCheckboxLink = () => {
    setSettingsForm((prev) => ({
      ...prev,
      checkbox_links: [...prev.checkbox_links, { text: "", url: "" }],
    }));
  };

  const removeCheckboxLink = (index) => {
    setSettingsForm((prev) => ({
      ...prev,
      checkbox_links: prev.checkbox_links.filter((_, i) => i !== index),
    }));
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);

    const payload = new FormData();
    payload.append("page_type", CAREER_FORM_PAGE_TYPE);
    payload.append("title", settingsForm.banner_heading);
    payload.append("bg_color", settingsForm.form_bg_color);
    payload.append("font_color", settingsForm.form_font_color);
    payload.append("form_heading", settingsForm.form_heading);
    payload.append("placeholder_name", settingsForm.placeholder_name);
    payload.append("placeholder_email", settingsForm.placeholder_email);
    payload.append("placeholder_phone", settingsForm.placeholder_phone);
    payload.append("placeholder_job_position", settingsForm.placeholder_job_position);
    payload.append("resume_button_label", settingsForm.resume_button_label);
    payload.append("submit_button_text", settingsForm.submit_button_text);
    payload.append("submit_button_color", settingsForm.submit_button_color);
    payload.append("submit_button_text_color", settingsForm.submit_button_text_color);
    payload.append("checkbox_text", settingsForm.checkbox_text);
    payload.append("checkbox_links", JSON.stringify(settingsForm.checkbox_links));

    if (settingsForm.checkbox_links.length > 0) {
    //   payload.append("checkbox_text", settingsForm.checkbox_links[0].text);
      payload.append("checkbox_link", settingsForm.checkbox_links[0].url);
    }

    if (settingsForm.banner_image) {
      payload.append("image", settingsForm.banner_image);
    }

    try {
      if (settingsForm.id) {
        await api.patch(`${CMS_BASE}/${settingsForm.id}`, payload);
      } else {
        await api.post(CMS_BASE, payload);
      }
      toast.success("Career form page settings saved.");
      document.getElementById("pageSettingsModalClose")?.click();
      fetchPageSettings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save page settings.");
    } finally {
      setSettingsSaving(false);
    }
  };

  // --- Job Description Modal Actions ---
//   const openEditModal = (job) => {
//     setJobForm({
//       id: job.id,
//       description: job.description || "",
//     });
//   };
const openEditModal = (job) => {
  const existing = settingsForm.job_texts?.[job.id] || {};
  setJobForm({
    id: job.id,
    description: existing.paragraph || "",
  });
};

  const handleDescriptionChange = (html) => {
    setJobForm((prev) => ({ ...prev, description: html }));
  };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     const payload = {
//       description: jobForm.description,
//     };

//     try {
//       if (jobForm.id) {
//         await api.patch(`/manage-job/${jobForm.id}`, payload);
//         toast.success("Job description updated successfully.");
//       }
//       document.getElementById("jobModalClose")?.click();
//       fetchJobs();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update job description.");
//     } finally {
//       setSaving(false);
//     }
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setSaving(true);

//   const updatedJobTexts = {
//     ...(settingsForm.job_texts || {}),
//     [jobForm.id]: { heading: jobForm.heading, paragraph: jobForm.description },
//   };

//   const payload = new FormData();
//   payload.append("page_type", CAREER_FORM_PAGE_TYPE);
//   payload.append("job_texts", JSON.stringify(updatedJobTexts));

//   try {
//     if (settingsForm.id) {
//       await api.patch(`${CMS_BASE}/${settingsForm.id}`, payload);
//     } else {
//       await api.post(CMS_BASE, payload);
//     }
//     toast.success("Job description updated successfully.");
//     document.getElementById("jobModalClose")?.click();
//     fetchPageSettings();
//   } catch (err) {
//     console.error(err);
//     toast.error("Failed to update job description.");
//   } finally {
//     setSaving(false);
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    const latest = await api.get(CMS_SETTINGS_ENDPOINT);
    const latestRecord = Array.isArray(latest.data) ? latest.data[0] : null;
    const latestContent = latestRecord?.child_content || {};

    let currentJobTexts = {};
    if (latestContent.job_texts) {
      try {
        currentJobTexts =
          typeof latestContent.job_texts === "string"
            ? JSON.parse(latestContent.job_texts)
            : latestContent.job_texts;
      } catch (e) {
        console.error("Failed to parse job_texts JSON", e);
      }
    }

    const updatedJobTexts = {
      ...currentJobTexts,
      [jobForm.id]: { paragraph: jobForm.description },
    };

    const payload = new FormData();
    payload.append("page_type", CAREER_FORM_PAGE_TYPE);
    payload.append("job_texts", JSON.stringify(updatedJobTexts));

    const targetId = latestRecord?.id || settingsForm.id;
    if (targetId) {
      await api.patch(`${CMS_BASE}/${targetId}`, payload);
    } else {
      await api.post(CMS_BASE, payload);
    }

    toast.success("Job description updated successfully.");
    document.getElementById("jobModalClose")?.click();
    fetchPageSettings();
  } catch (err) {
    console.error(err);
    toast.error("Failed to update job description.");
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

  return (
    <AuthMainLayout>
      <style jsx global>{`
        :root {
          --ck-z-default: 100;
          --ck-z-modal: calc(var(--ck-z-default) + 999);
        }
      `}</style>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Career Form — Manage Jobs</h2>
          <div>
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-toggle="modal"
              data-bs-target="#pageSettingsModal"
            >
              <FaCog className="me-2" /> Page Settings
            </button>
          </div>
        </div>

        {/* Active Jobs Table */}
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Job Posting</th>
                <th>Experience</th>
                <th>No of Opening</th>
                <th>Location</th>
                <th>Posted On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="fw-semibold text-start ps-3">
                    {job.title || <span className="text-muted">Untitled</span>}
                  </td>
                  <td>{job.experience_required || "-"}</td>
                  <td>{job.job_opening || "-"}</td>
                  <td>{job.location || "-"}</td>
                  <td>
                    {job.created_at
                      ? new Date(job.created_at).toLocaleDateString("en-GB")
                      : job.last_date
                      ? new Date(job.last_date).toLocaleDateString("en-GB")
                      : "-"}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#jobModal"
                      onClick={() => openEditModal(job)}
                    >
                      <FaEdit className="me-1" /> Edit Description
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {jobs.length === 0 && (
          <div className="text-center text-muted py-5 border rounded">
            No active job postings found.
          </div>
        )}
      </div>

      {/* Edit Job Modal (Description Only) */}
      <div className="modal fade" id="jobModal" tabIndex="-1" aria-hidden="true" data-bs-focus="false">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Edit Job Description</h1>
              <button
                type="button"
                className="btn-close"
                id="jobModalClose"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body row g-3">
                <div className="col-12">
                  <label className="form-label fw-bold">Job Description</label>
                  <CKEditorComponent
                  key={jobForm.id ?? "new"}
  pageData={jobForm.description}
  setPageData={handleDescriptionChange}
/>
                </div>

                <div className="col-12 d-flex justify-content-end mt-3">
                  <button className="btn btn-primary px-5" type="submit" disabled={saving}>
                    <FaSave className="me-2" />
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Page Settings Modal */}
      <div className="modal fade" id="pageSettingsModal" tabIndex="-1" aria-hidden="true" data-bs-focus="false">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Career Form — Page Settings</h1>
              <button
                type="button"
                className="btn-close"
                id="pageSettingsModalClose"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <form onSubmit={handleSettingsSubmit}>
              <div className="modal-body">
                {settingsLoading ? (
                  <div className="spinner-border text-warning" />
                ) : (
                  <>
                    <h6 className="fw-bold mb-3">Banner</h6>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label">Banner Heading</label>
                        <input
                          type="text"
                          className="form-control"
                          name="banner_heading"
                          value={settingsForm.banner_heading}
                          onChange={handleSettingsFieldChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Banner Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          onChange={handleBannerImageChange}
                        />
                        {settingsForm.banner_image_preview && (
                          <img
                            src={settingsForm.banner_image_preview}
                            alt="Banner preview"
                            className="mt-2 rounded border"
                            style={{ maxHeight: 70 }}
                          />
                        )}
                      </div>
                    </div>

                    <h6 className="fw-bold mb-3">Apply Form Styling</h6>
                    <div className="row g-3 mb-4">
                      <div className="col-md-12">
                        <label className="form-label">Form Heading Text</label>
                        <input
                          type="text"
                          className="form-control"
                          name="form_heading"
                          value={settingsForm.form_heading}
                          onChange={handleSettingsFieldChange}
                          placeholder="Apply Now"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Form Background Colour</label>
                        <input
                          type="color"
                          className="form-control form-control-color w-100"
                          name="form_bg_color"
                          value={settingsForm.form_bg_color}
                          onChange={handleSettingsFieldChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Form Font Colour</label>
                        <input
                          type="color"
                          className="form-control form-control-color w-100"
                          name="form_font_color"
                          value={settingsForm.form_font_color}
                          onChange={handleSettingsFieldChange}
                        />
                      </div>
                    </div>

                    <h6 className="fw-bold mb-3">Field Placeholders</h6>
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label">Full Name placeholder</label>
                        <input
                          type="text"
                          className="form-control"
                          name="placeholder_name"
                          value={settingsForm.placeholder_name}
                          onChange={handleSettingsFieldChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email placeholder</label>
                        <input
                          type="text"
                          className="form-control"
                          name="placeholder_email"
                          value={settingsForm.placeholder_email}
                          onChange={handleSettingsFieldChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Contact No. placeholder</label>
                        <input
                          type="text"
                          className="form-control"
                          name="placeholder_phone"
                          value={settingsForm.placeholder_phone}
                          onChange={handleSettingsFieldChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Job Position placeholder</label>
                        <input
                          type="text"
                          className="form-control"
                          name="placeholder_job_position"
                          value={settingsForm.placeholder_job_position}
                          onChange={handleSettingsFieldChange}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Resume upload button label</label>
                        <input
                          type="text"
                          className="form-control"
                          name="resume_button_label"
                          value={settingsForm.resume_button_label}
                          onChange={handleSettingsFieldChange}
                        />
                      </div>
                    </div>

                    <h6 className="fw-bold mb-3">Submit Button</h6>
                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <label className="form-label">Button Text</label>
                        <input
                          type="text"
                          className="form-control"
                          name="submit_button_text"
                          value={settingsForm.submit_button_text}
                          onChange={handleSettingsFieldChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Button Colour</label>
                        <input
                          type="color"
                          className="form-control form-control-color w-100"
                          name="submit_button_color"
                          value={settingsForm.submit_button_color}
                          onChange={handleSettingsFieldChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Button Text Colour</label>
                        <input
                          type="color"
                          className="form-control form-control-color w-100"
                          name="submit_button_text_color"
                          value={settingsForm.submit_button_text_color}
                          onChange={handleSettingsFieldChange}
                        />
                      </div>
                    </div>
<div className="mb-4">
  <label className="form-label fw-bold">Checkbox Text</label>
  <input
    type="text"
    className="form-control"
    name="checkbox_text"
    value={settingsForm.checkbox_text}
    onChange={handleSettingsFieldChange}
    placeholder="Accept Terms & Conditions"
  />
</div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0">Terms Checkbox Links</h6>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={addCheckboxLink}
                      >
                        <FaPlus className="me-1" /> Add Link
                      </button>
                    </div>

                    {settingsForm.checkbox_links.map((link, idx) => (
                      <div
                        key={idx}
                        className="row g-2 align-items-center mb-3 border p-2 rounded"
                      >
                        <div className="col-md-5">
                          <label className="form-label small mb-1">Checkbox Text</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={link.text}
                            onChange={(e) =>
                              handleCheckboxLinkChange(idx, "text", e.target.value)
                            }
                            placeholder="Accept Terms & Conditions"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small mb-1">
                            Checkbox Link (URL)
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={link.url}
                            onChange={(e) =>
                              handleCheckboxLinkChange(idx, "url", e.target.value)
                            }
                            placeholder="/terms-and-conditions"
                          />
                        </div>
                        <div className="col-md-1 text-end mt-4">
                          {settingsForm.checkbox_links.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeCheckboxLink(idx)}
                              title="Remove Link"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary px-4"
                  type="submit"
                  disabled={settingsSaving || settingsLoading}
                >
                  <FaSave className="me-2" />
                  {settingsSaving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthMainLayout>
  );
}