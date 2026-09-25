"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaImage, FaSave, FaPlus, FaTrash, FaGripVertical } from "react-icons/fa";

import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

const CKEditorComponent = dynamic(
  () => import("@/app/components/CKEditorComponent"),
  { ssr: false }
);

const DEFAULT_CATEGORIES = [
  { enabled: true, title: "Modular / Wooden Work", duration: "10 Years" },
  { enabled: true, title: "Loose Furniture", duration: "5 Years" },
  { enabled: true, title: "Hardware", duration: "3 + 7 Years" },
];

const DEFAULT_FORM = {
  title: "Warranty",
  status: "Published",
  content: "",
  slug: "warranty",
  meta_title: "Warranty | High Creation Interior",
  meta_description:
    "Warranty assurance, product-specific warranty periods, exclusions and claim process from High Creation Interior.",
  meta_keywords:
    "HCI warranty, High Creation Interior warranty, interior warranty",
  canonical_url: "https://hcinterior.in/warranty",
  banner_heading: "Warranty",
  banner_description:
    "Our commitment to quality and reliable interior solutions",
  banner_heading_tag: "h1",
  banner_description_font_size: 16,
  banner_image: "",
  hero: {
    enabled: true,
    eyebrow: "OUR WARRANTY COMMITMENT",
    heading: "Quality backed by clear warranty terms.",
    description:
      "Understand your applicable warranty coverage, conditions and claim process.",
  },
  summary: {
    enabled: true,
    heading: "Warranty at a glance",
    subheading:
      "Coverage varies by product, material, workmanship and applicable documentation.",
  },
  categories: DEFAULT_CATEGORIES,
  process: {
    enabled: true,
    eyebrow: "WARRANTY CLAIMS",
    heading: "A clear process when you need support",
    description:
      "Please follow the applicable warranty terms and project documentation when raising a claim.",
    steps: [
      {
        number: "01",
        title: "Report the issue",
        description:
          "Notify High Creation Interior within the applicable claim period.",
      },
      {
        number: "02",
        title: "Share details",
        description:
          "Provide the relevant invoice, work order, customer ID and supporting information.",
      },
      {
        number: "03",
        title: "Inspection",
        description:
          "Our team may inspect the product or completed work to assess warranty applicability.",
      },
      {
        number: "04",
        title: "Resolution",
        description:
          "Covered issues may be repaired, replaced or rectified according to the applicable terms.",
      },
    ],
  },
  supportForm: {
    enabled: true,
    eyebrow: "WARRANTY SUPPORT",
    heading: "Need help with a warranty concern?",
    description:
      "Share your details and our team can guide you to the appropriate next step.",
    submitLabel: "SUBMIT REQUEST",
    contactItems: [
    { icon: "phone", label: "Call Us", value: "+91 7070701373" },
    { icon: "mail", label: "Customer Care", value: "care@hcinterior.in" },
    { icon: "location", label: "Corporate Office", value: "H-56, 1st Floor, Sector-63, Noida, Uttar Pradesh - 201301" },
  ],
  },
  cta: {
    enabled: true,
    heading: "Need help with your project?",
    description:
      "Connect with the High Creation Interior team for support and assistance.",
    buttonText: "Contact HCI",
    buttonUrl: "/contact",
  },
};

const normalizeJson = (value) => {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return value;
};

const normalizeSeo = (seo = {}) => ({
  slug: seo.slug || DEFAULT_FORM.slug,
  meta_title: seo.meta_title || DEFAULT_FORM.meta_title,
  meta_description: seo.meta_description || DEFAULT_FORM.meta_description,
  meta_keywords: seo.meta_keywords || DEFAULT_FORM.meta_keywords,
  canonical_url: seo.canonical_url || DEFAULT_FORM.canonical_url,
});

export default function CmsWarranty() {
  const authToken = useSelector((state) => 
  state.auth.authToken || state.auth.user?.token
);

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [pageId, setPageId] = useState(null);
  const [legacyPageId, setLegacyPageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [activeTab, setActiveTab] = useState("content");

  const authConfig = useMemo(
    () => ({
      headers: authToken
        ? { Authorization: `Bearer ${authToken}` }
        : undefined,
    }),
    [authToken]
  );

  const loadWarranty = useCallback(async () => {
    setLoading(true);

    try {
      const [contentResponse, pagesResponse, bannerResponse] =
        await Promise.all([
          api
            .get("/cms-content/warranty", authConfig)
            .catch(() => null),
          api
            .get("/cms-basic-pages/all", authConfig)
            .catch(() => null),
          api
            .get(
              "/cms-gallery-design/manage-banner?key=warranty",
              authConfig
            )
            .catch(() => null),
        ]);

      const cmsRecord = contentResponse?.data || null;
      const pages = Array.isArray(pagesResponse?.data)
        ? pagesResponse.data
        : [];

      const legacyPage =
        pages.find(
          (item) => item?.seo_content?.slug === DEFAULT_FORM.slug
        ) || null;

      const source = cmsRecord?.json_content
        ? normalizeJson(cmsRecord.json_content)
        : legacyPage
          ? {
              ...DEFAULT_FORM,
              content: legacyPage.content || "",
              ...normalizeSeo(legacyPage.seo_content),
              status: legacyPage.status || "Draft",
            }
          : DEFAULT_FORM;

      const banner = bannerResponse?.data || null;

      setPageId(cmsRecord?.id || null);
      setLegacyPageId(legacyPage?.id || null);

      setFormData({
        ...DEFAULT_FORM,
        ...source,
        content: source.html || source.content || "",
        ...normalizeSeo(source.seo || legacyPage?.seo_content),
        hero: {
          ...DEFAULT_FORM.hero,
          ...(source.hero || {}),
        },
        summary: {
          ...DEFAULT_FORM.summary,
          ...(source.summary || {}),
        },
        categories:
          Array.isArray(source.categories) && source.categories.length
            ? source.categories
            : DEFAULT_CATEGORIES,
        process: {
          ...DEFAULT_FORM.process,
          ...(source.process || {}),
          steps:
            Array.isArray(source.process?.steps) &&
            source.process.steps.length
              ? source.process.steps
              : DEFAULT_FORM.process.steps,
        },
        supportForm: {
          ...DEFAULT_FORM.supportForm,
          ...(source.supportForm || {}),
        },
        cta: {
          ...DEFAULT_FORM.cta,
          ...(source.cta || {}),
        },
        banner_heading:
          banner?.banner_heading ?? DEFAULT_FORM.banner_heading,
        banner_description:
          banner?.banner_description ??
          DEFAULT_FORM.banner_description,
        banner_heading_tag:
          banner?.banner_heading_tag ||
          DEFAULT_FORM.banner_heading_tag,
        banner_description_font_size:
          Number(banner?.banner_description_font_size) ||
          DEFAULT_FORM.banner_description_font_size,
        banner_image: banner?.banner_image || "",
      });

      setBannerPreview(banner?.banner_image || "");
      setBannerImageFile(null);
    } catch (error) {
      console.error("Warranty CMS load error:", error);
      toast.error("Failed to load Warranty content.");
    } finally {
      setLoading(false);
    }
  }, [authConfig]);

  useEffect(() => {
    loadWarranty();
  }, [loadWarranty]);

  useEffect(() => {
    return () => {
      if (bannerPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [bannerPreview]);

  const setField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateNested = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleBannerImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Banner image must be 5 MB or smaller.");
      return;
    }

    setBannerImageFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const updateCategory = (index, field, value) => {
    setFormData((prev) => {
      const categories = [...prev.categories];
      categories[index] = {
        ...categories[index],
        [field]: value,
      };

      return {
        ...prev,
        categories,
      };
    });
  };

  const addCategory = () => {
    setFormData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          enabled: true,
          title: "New Warranty Category",
          duration: "1 Year",
        },
      ],
    }));
  };

  const removeCategory = (index) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateStep = (index, field, value) => {
    setFormData((prev) => {
      const steps = [...prev.process.steps];
      steps[index] = {
        ...steps[index],
        [field]: value,
      };

      return {
        ...prev,
        process: {
          ...prev.process,
          steps,
        },
      };
    });
  };

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      process: {
        ...prev.process,
        steps: [
          ...prev.process.steps,
          {
            number: String(prev.process.steps.length + 1).padStart(2, "0"),
            title: "New Step",
            description: "",
          },
        ],
      },
    }));
  };

  const removeStep = (index) => {
    setFormData((prev) => ({
      ...prev,
      process: {
        ...prev.process,
        steps: prev.process.steps.filter(
          (_, itemIndex) => itemIndex !== index
        ),
      },
    }));
  };

  const updateContactItem = (index, field, value) => {
  setFormData((prev) => {
    const contactItems = [...prev.supportForm.contactItems];
    contactItems[index] = { ...contactItems[index], [field]: value };
    return { ...prev, supportForm: { ...prev.supportForm, contactItems } };
  });
};

const addContactItem = () => {
  setFormData((prev) => ({
    ...prev,
    supportForm: {
      ...prev.supportForm,
      contactItems: [
        ...prev.supportForm.contactItems,
        { icon: "phone", label: "New Item", value: "" },
      ],
    },
  }));
};

const removeContactItem = (index) => {
  setFormData((prev) => ({
    ...prev,
    supportForm: {
      ...prev.supportForm,
      contactItems: prev.supportForm.contactItems.filter((_, i) => i !== index),
    },
  }));
};

  const persistContent = async () => {
    if (!pageId) {
      throw new Error(
        "Warranty CMS record is missing. Run the Warranty CMS migration before saving."
      );
    }

    const jsonContent = {
      html: formData.content || "",
      hero: formData.hero,
      summary: formData.summary,
      categories: formData.categories,
      process: formData.process,
      supportForm: formData.supportForm,
      cta: formData.cta,
    };

    const payload = new FormData();
    payload.append("json_content", JSON.stringify(jsonContent));

    return api.patch(
      `/cms-content/update-with-image/${pageId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  };

  const persistBanner = async () => {
    const payload = new FormData();

    payload.append(
      "banner_heading",
      formData.banner_heading.trim()
    );
    payload.append(
      "banner_description",
      formData.banner_description.trim()
    );
    payload.append(
      "banner_heading_tag",
      formData.banner_heading_tag
    );
    payload.append(
      "banner_description_font_size",
      String(formData.banner_description_font_size || 16)
    );
    payload.append("banner_key", "warranty");

    if (bannerImageFile) {
      payload.append("banner_image", bannerImageFile);
    }

    return api.patch(
      "/cms-gallery-design/manage-banner?key=warranty",
      payload,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (saving) return;

    if (!formData.content.trim()) {
      toast.error("Main Warranty content cannot be empty.");
      setActiveTab("content");
      return;
    }

    setSaving(true);

    try {
      await persistContent();
      await persistBanner();

      toast.success("Warranty page saved successfully.");
      await loadWarranty();
    } catch (error) {
      console.error("Warranty CMS save error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save Warranty page."
      );
    } finally {
      setSaving(false);
    }
  };

  const renderCategoryEditor = () => (
    <div className="row g-3">
      {formData.categories.map((category, index) => (
        <div className="col-xl-6" key={`${category.title}-${index}`}>
          <div className="border rounded-3 p-3 h-100 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <FaGripVertical className="text-muted" />
                <strong>Category #{index + 1}</strong>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeCategory(index)}
                aria-label={`Remove category ${index + 1}`}
              >
                <FaTrash />
              </button>
            </div>

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={category.enabled !== false}
                onChange={(event) =>
                  updateCategory(
                    index,
                    "enabled",
                    event.target.checked
                  )
                }
              />
              <label className="form-check-label">
                Show on public page
              </label>
            </div>

            <label className="form-label fw-semibold">
              Category Name
            </label>
            <input
              className="form-control mb-3"
              value={category.title || ""}
              onChange={(event) =>
                updateCategory(
                  index,
                  "title",
                  event.target.value
                )
              }
            />

            <label className="form-label fw-semibold">
              Warranty Duration
            </label>
            <input
              className="form-control"
              value={category.duration || ""}
              onChange={(event) =>
                updateCategory(
                  index,
                  "duration",
                  event.target.value
                )
              }
            />
          </div>
        </div>
      ))}

      <div className="col-12">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={addCategory}
        >
          <FaPlus className="me-2" />
          Add Warranty Category
        </button>
      </div>
    </div>
  );

  const renderProcessEditor = () => (
    <div>
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={formData.process.enabled !== false}
              onChange={(event) =>
                updateNested(
                  "process",
                  "enabled",
                  event.target.checked
                )
              }
            />
            <label className="form-check-label fw-semibold">
              Show claim process
            </label>
          </div>
        </div>

        <div className="col-lg-4">
          <label className="form-label fw-semibold">Eyebrow</label>
          <input
            className="form-control"
            value={formData.process.eyebrow || ""}
            onChange={(event) =>
              updateNested(
                "process",
                "eyebrow",
                event.target.value
              )
            }
          />
        </div>

        <div className="col-lg-8">
          <label className="form-label fw-semibold">
            Heading
          </label>
          <input
            className="form-control"
            value={formData.process.heading || ""}
            onChange={(event) =>
              updateNested(
                "process",
                "heading",
                event.target.value
              )
            }
          />
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold">
            Description
          </label>
          <textarea
            className="form-control"
            rows={3}
            value={formData.process.description || ""}
            onChange={(event) =>
              updateNested(
                "process",
                "description",
                event.target.value
              )
            }
          />
        </div>
      </div>

      <div className="row g-3">
        {formData.process.steps.map((step, index) => (
          <div className="col-xl-6" key={`${step.number}-${index}`}>
            <div className="border rounded-3 p-3 h-100 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong>Step #{index + 1}</strong>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeStep(index)}
                >
                  <FaTrash />
                </button>
              </div>

              <div className="row g-2">
                <div className="col-3">
                  <label className="form-label small fw-semibold">
                    Number
                  </label>
                  <input
                    className="form-control"
                    value={step.number || ""}
                    onChange={(event) =>
                      updateStep(
                        index,
                        "number",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="col-9">
                  <label className="form-label small fw-semibold">
                    Title
                  </label>
                  <input
                    className="form-control"
                    value={step.title || ""}
                    onChange={(event) =>
                      updateStep(
                        index,
                        "title",
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={step.description || ""}
                    onChange={(event) =>
                      updateStep(
                        index,
                        "description",
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="col-12">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={addStep}
          >
            <FaPlus className="me-2" />
            Add Process Step
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AuthMainLayout>
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "60vh" }}
        >
          <div className="spinner-border text-primary" role="status" />
        </div>
      </AuthMainLayout>
    );
  }

  return (
    <AuthMainLayout>
      <style jsx global>{`
        .warranty-cms-shell {
          max-width: 1440px;
          margin: 0 auto;
        }

        .warranty-cms-tabs .nav-link {
          color: #4b5563;
          border: 0;
          border-bottom: 2px solid transparent;
          border-radius: 0;
          font-weight: 600;
        }

        .warranty-cms-tabs .nav-link.active {
          color: #ff914d;
          border-bottom-color: #ff914d;
          background: transparent;
        }

        // .warranty-editor .ck-editor__top {
        //   position: sticky !important;
        //   top: 70px !important;
        //   z-index: 10 !important;
        // }

        // .warranty-editor .ck-editor__editable {
        //   min-height: 680px;
        //   max-height: none;
        //   overflow-y: visible;
        // }

        .warranty-editor .ck-editor__editable {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  overflow: hidden;
}
        .warranty-editor .ck-content {
          max-width: 100%;
          overflow-wrap: anywhere;
        }

        .warranty-editor .ck-content table {
          max-width: 100%;
        }
      `}</style>

      <div className="container-fluid py-4">
        <div className="warranty-cms-shell">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div>
              <div
                className="text-uppercase fw-semibold"
                style={{
                  color: "#ff914d",
                  letterSpacing: "0.12em",
                  fontSize: 12,
                }}
              >
                HCI Website CMS
              </div>

              <h1 className="h2 fw-bold mb-1">Warranty Page</h1>

              <p className="text-muted mb-0">
                Manage the Warranty Assurance content and the public
                page presentation from one place.
              </p>
            </div>

            <span className="badge bg-light text-dark border px-3 py-2">
              /warranty
            </span>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <ul className="nav nav-tabs warranty-cms-tabs px-4 pt-3">
                {[
                  ["content", "Policy Content"],
                  ["hero", "Intro"],
                  ["categories", "Warranty Categories"],
                  ["process", "Claim Process"],
                  ["support", "Support Form"],
                  ["banner", "Banner"],
                  ["seo", "SEO"],
                ].map(([key, label]) => (
                  <li className="nav-item" key={key}>
                    <button
                      type="button"
                      className={`nav-link ${
                        activeTab === key ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(key)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="p-4 p-lg-5 bg-light">
                {activeTab === "content" && (
                  <section className="bg-white border rounded-3 p-4">
                    <h2 className="h5 fw-bold mb-3">
                      Main Warranty Content
                    </h2>

                    <p className="text-muted small mb-4">
                      Keep the existing Warranty Assurance wording here.
                      This is the source of truth for the detailed policy.
                    </p>

                    <div className="warranty-editor border rounded">
                      <CKEditorComponent
                        pageData={formData.content}
                        setPageData={(value) =>
                          setField("content", value)
                        }
                      />
                    </div>
                  </section>
                )}

                {activeTab === "hero" && (
                  <section className="bg-white border rounded-3 p-4">
                    <div className="form-check form-switch mb-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.hero.enabled !== false}
                        onChange={(event) =>
                          updateNested(
                            "hero",
                            "enabled",
                            event.target.checked
                          )
                        }
                      />
                      <label className="form-check-label fw-semibold">
                        Show Warranty intro section
                      </label>
                    </div>

                    <div className="row g-3">
                      <div className="col-lg-4">
                        <label className="form-label fw-semibold">
                          Eyebrow
                        </label>
                        <input
                          className="form-control"
                          value={formData.hero.eyebrow || ""}
                          onChange={(event) =>
                            updateNested(
                              "hero",
                              "eyebrow",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-lg-8">
                        <label className="form-label fw-semibold">
                          Heading
                        </label>
                        <input
                          className="form-control"
                          value={formData.hero.heading || ""}
                          onChange={(event) =>
                            updateNested(
                              "hero",
                              "heading",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          rows={4}
                          value={formData.hero.description || ""}
                          onChange={(event) =>
                            updateNested(
                              "hero",
                              "description",
                              event.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === "categories" && (
                  <section>
                    <div className="mb-4">
                      <h2 className="h5 fw-bold mb-1">
                        Warranty at a Glance
                      </h2>
                      <p className="text-muted small mb-0">
                        These cards are presentation data. Keep the
                        detailed legal wording in Policy Content.
                      </p>
                    </div>

                    {renderCategoryEditor()}
                  </section>
                )}

                {activeTab === "process" && (
                  <section className="bg-white border rounded-3 p-4">
                    {renderProcessEditor()}
                  </section>
                )}

                {activeTab === "support" && (
                  <section className="bg-white border rounded-3 p-4">
                    <div className="form-check form-switch mb-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={
                          formData.supportForm.enabled !== false
                        }
                        onChange={(event) =>
                          updateNested(
                            "supportForm",
                            "enabled",
                            event.target.checked
                          )
                        }
                      />
                      <label className="form-check-label fw-semibold">
                        Show warranty support form
                      </label>
                    </div>

                    <div className="row g-3">
                      <div className="col-lg-4">
                        <label className="form-label fw-semibold">
                          Eyebrow
                        </label>
                        <input
                          className="form-control"
                          value={
                            formData.supportForm.eyebrow || ""
                          }
                          onChange={(event) =>
                            updateNested(
                              "supportForm",
                              "eyebrow",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-lg-8">
                        <label className="form-label fw-semibold">
                          Heading
                        </label>
                        <input
                          className="form-control"
                          value={
                            formData.supportForm.heading || ""
                          }
                          onChange={(event) =>
                            updateNested(
                              "supportForm",
                              "heading",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-lg-8">
                        <label className="form-label fw-semibold">
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={
                            formData.supportForm.description || ""
                          }
                          onChange={(event) =>
                            updateNested(
                              "supportForm",
                              "description",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-lg-4">
                        <label className="form-label fw-semibold">
                          Submit Button
                        </label>
                        <input
                          className="form-control"
                          value={
                            formData.supportForm.submitLabel || ""
                          }
                          onChange={(event) =>
                            updateNested(
                              "supportForm",
                              "submitLabel",
                              event.target.value
                            )
                          }
                        />
                      </div>
                      <div className="col-12">
  <hr className="my-3" />
  <label className="form-label fw-semibold">Contact Items</label>
  {formData.supportForm.contactItems.map((item, index) => (
    <div className="row g-2 align-items-center mb-2" key={index}>
      <div className="col-md-2">
        <select
          className="form-select"
          value={item.icon}
          onChange={(e) => updateContactItem(index, "icon", e.target.value)}
        >
          <option value="phone">Phone</option>
          <option value="mail">Mail</option>
          <option value="location">Location</option>
        </select>
      </div>
      <div className="col-md-3">
        <input
          className="form-control"
          placeholder="Label"
          value={item.label}
          onChange={(e) => updateContactItem(index, "label", e.target.value)}
        />
      </div>
      <div className="col-md-6">
        <input
          className="form-control"
          placeholder="Value"
          value={item.value}
          onChange={(e) => updateContactItem(index, "value", e.target.value)}
        />
      </div>
      <div className="col-md-1">
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeContactItem(index)}>
          <FaTrash />
        </button>
      </div>
    </div>
  ))}
  <button type="button" className="btn btn-outline-primary btn-sm mt-1" onClick={addContactItem}>
    <FaPlus className="me-2" />Add Contact Item
  </button>
</div>
                    </div>
                  </section>
                )}

                {activeTab === "banner" && (
                  <section className="bg-white border rounded-3 p-4">
                    <div className="row g-4">
                      <div className="col-lg-7">
                        <label className="form-label fw-semibold">
                          Banner Image
                        </label>

                        <div className="input-group">
                          <span className="input-group-text">
                            <FaImage />
                          </span>

                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={handleBannerImageChange}
                          />
                        </div>

                        {bannerPreview && (
                          <div className="mt-3 border rounded overflow-hidden">
                            <img
                              src={bannerPreview}
                              alt="Warranty banner preview"
                              style={{
                                display: "block",
                                width: "100%",
                                height: 260,
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="col-lg-5">
                        <label className="form-label fw-semibold">
                          Banner Heading
                        </label>
                        <input
                          className="form-control mb-3"
                          value={formData.banner_heading}
                          onChange={(event) =>
                            setField(
                              "banner_heading",
                              event.target.value
                            )
                          }
                        />

                        <label className="form-label fw-semibold">
                          Banner Description
                        </label>
                        <textarea
                          className="form-control mb-3"
                          rows={4}
                          value={formData.banner_description}
                          onChange={(event) =>
                            setField(
                              "banner_description",
                              event.target.value
                            )
                          }
                        />

                        <label className="form-label fw-semibold">
                          Heading Tag
                        </label>

                        <select
                          className="form-select"
                          value={formData.banner_heading_tag}
                          onChange={(event) =>
                            setField(
                              "banner_heading_tag",
                              event.target.value
                            )
                          }
                        >
                          {["h1", "h2", "h3", "h4", "h5", "h6"].map(
                            (tag) => (
                              <option key={tag} value={tag}>
                                {tag.toUpperCase()}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </section>
                )}

                {activeTab === "seo" && (
                  <section className="bg-white border rounded-3 p-4">
                    <div className="row g-3">
                      <div className="col-lg-6">
                        <label className="form-label fw-semibold">
                          Meta Title
                        </label>
                        <input
                          className="form-control"
                          value={formData.meta_title}
                          onChange={(event) =>
                            setField(
                              "meta_title",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-lg-6">
                        <label className="form-label fw-semibold">
                          Canonical URL
                        </label>
                        <input
                          className="form-control"
                          value={formData.canonical_url}
                          onChange={(event) =>
                            setField(
                              "canonical_url",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Meta Description
                        </label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={formData.meta_description}
                          onChange={(event) =>
                            setField(
                              "meta_description",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Meta Keywords
                        </label>
                        <input
                          className="form-control"
                          value={formData.meta_keywords}
                          onChange={(event) =>
                            setField(
                              "meta_keywords",
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-12">
                        <div className="alert alert-warning small mb-0">
                          Keep SEO changes separate from the policy
                          wording. The page remains CMS-controlled.
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2 p-4 border-top bg-white">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={loadWarranty}
                  disabled={saving}
                >
                  Discard Changes
                </button>

                <button
                  type="button"
                  className="btn px-4 text-white"
                  onClick={handleSave}
                  disabled={saving}
                  style={{ background: "#ff914d" }}
                >
                  <FaSave className="me-2" />
                  {saving ? "Saving..." : "Save Warranty Page"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthMainLayout>
  );
}
