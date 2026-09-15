"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaImage, FaSave } from "react-icons/fa";

import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import { getCmsAccess } from "@/utils/cmsAccess";

const CKEditorComponent = dynamic(
  () => import("@/app/components/CKEditorComponent"),
  { ssr: false }
);

const DEFAULT_FORM = {
  title: "Warranty",
  status: "Draft",
  content: "",
  slug: "warranty",
  meta_title: "Warranty | High Creation Interior",
  meta_description:
    "Warranty information and coverage from High Creation Interior.",
  meta_keywords: "warranty, high creation interior, interior warranty",
  canonical_url: "https://hcinterior.in/warranty",
  banner_heading: "Warranty",
  banner_description: "Our warranty coverage and commitment to quality",
  banner_heading_tag: "h1",
  banner_description_font_size: 16,
  banner_image: "",
};

const normalizePageSeo = (seo = {}) => ({
  slug: seo.slug || DEFAULT_FORM.slug,
  meta_title: seo.meta_title || DEFAULT_FORM.meta_title,
  meta_description: seo.meta_description || DEFAULT_FORM.meta_description,
  meta_keywords: seo.meta_keywords || DEFAULT_FORM.meta_keywords,
  canonical_url: seo.canonical_url || DEFAULT_FORM.canonical_url,
});

export default function CmsWarranty() {
  const user = useSelector((state) => state.auth.user);
  const authToken = useSelector((state) => state.auth.authToken) || user?.token;
  const { canPublish } = getCmsAccess(user);

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [pageId, setPageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");

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
      const [pagesResponse, bannerResponse] = await Promise.all([
        api.get("/cms-basic-pages/all", authConfig),
        api.get("/cms-gallery-design/manage-banner?key=warranty", authConfig).catch(
          () => null
        ),
      ]);

      const pages = Array.isArray(pagesResponse.data) ? pagesResponse.data : [];
      const page = pages.find(
        (item) => item?.seo_content?.slug === DEFAULT_FORM.slug
      );
      const banner = bannerResponse?.data || null;
      const seo = normalizePageSeo(page?.seo_content);

      setPageId(page?.id || null);
      setFormData({
        ...DEFAULT_FORM,
        title: page?.title || DEFAULT_FORM.title,
        status: page?.status || DEFAULT_FORM.status,
        content: page?.content || "",
        ...seo,
        banner_heading: banner?.banner_heading || DEFAULT_FORM.banner_heading,
        banner_description:
          banner?.banner_description || DEFAULT_FORM.banner_description,
        banner_heading_tag:
          banner?.banner_heading_tag || DEFAULT_FORM.banner_heading_tag,
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Banner image must be 5 MB or smaller.");
      return;
    }

    setBannerImageFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const persistPage = async () => {
    const nextStatus = canPublish ? formData.status : "Draft";

    const payload = {
      title: formData.title.trim(),
      content: formData.content || "",
      status: nextStatus,
      faqs: [],
      accordions: [],
      seo_content: {
        slug: DEFAULT_FORM.slug,
        meta_title: formData.meta_title.trim(),
        meta_description: formData.meta_description.trim(),
        meta_keywords: formData.meta_keywords.trim(),
        canonical_url: formData.canonical_url.trim(),
      },
    };

    if (!payload.title) {
      throw new Error("Page title is required.");
    }

    if (pageId) {
      return api.patch(`/cms-basic-pages/${pageId}`, payload, authConfig);
    }

    return api.post("/cms-basic-pages", payload, authConfig);
  };

  const persistBanner = async () => {
    const payload = new FormData();
    payload.append("banner_heading", formData.banner_heading.trim());
    payload.append("banner_description", formData.banner_description.trim());
    payload.append("banner_heading_tag", formData.banner_heading_tag);
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
      authToken
        ? { headers: { Authorization: `Bearer ${authToken}` } }
        : undefined
    );
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      const pageResponse = await persistPage();
      const persistedPage = pageResponse?.data;

      // If the page was newly created, keep the returned id so the next save is an update.
      if (!pageId && persistedPage?.id) {
        setPageId(persistedPage.id);
      }

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

  if (loading) {
    return (
      <AuthMainLayout>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "60vh" }}
        >
          <div className="spinner-border text-warning" role="status" />
        </div>
      </AuthMainLayout>
    );
  }

  return (
    <AuthMainLayout>
      <div className="container-fluid py-5">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4 p-lg-5">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
              <div>
                <h1 className="h3 fw-bold mb-1">Warranty Page</h1>
                <p className="text-muted mb-0">
                  Manage the public Warranty page, banner and CKEditor content from one screen.
                </p>
              </div>
              <span className="badge bg-light text-dark border px-3 py-2">
                Slug: /warranty
              </span>
            </div>

            <form onSubmit={handleSave}>
              <section className="border rounded-3 p-4 mb-4">
                <h2 className="h5 fw-bold mb-4">Page Details</h2>
                <div className="row g-3">
                  <div className="col-lg-7">
                    <label className="form-label fw-bold">Page Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setField("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-lg-5">
                    <label className="form-label fw-bold">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setField("status", e.target.value)}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Pending Approval">Pending Approval</option>
                      {canPublish && <option value="Published">Published</option>}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold">Main Content</label>
                    <div className="border rounded overflow-hidden">
                      <CKEditorComponent
                        pageData={formData.content}
                        setPageData={(value) => setField("content", value)}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="border rounded-3 p-4 mb-4">
                <h2 className="h5 fw-bold mb-4">Warranty Banner</h2>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-bold">Banner Image</label>
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
                    <small className="text-muted d-block mt-1">
                      Recommended max upload size: 5 MB.
                    </small>
                    {bannerPreview && (
                      <div className="mt-3 border rounded overflow-hidden bg-light">
                        <img
                          src={bannerPreview}
                          alt="Warranty banner preview"
                          style={{
                            display: "block",
                            width: "100%",
                            maxHeight: 280,
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="col-lg-8">
                    <label className="form-label fw-bold">Banner Heading</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.banner_heading}
                      onChange={(e) => setField("banner_heading", e.target.value)}
                    />
                  </div>

                  <div className="col-lg-4">
                    <label className="form-label fw-bold">Heading Tag</label>
                    <select
                      className="form-select"
                      value={formData.banner_heading_tag}
                      onChange={(e) => setField("banner_heading_tag", e.target.value)}
                    >
                      {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((tag) => (
                        <option key={tag} value={tag}>
                          {tag.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-lg-8">
                    <label className="form-label fw-bold">Banner Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.banner_description}
                      onChange={(e) => setField("banner_description", e.target.value)}
                    />
                  </div>

                  <div className="col-lg-4">
                    <label className="form-label fw-bold">Description Font Size</label>
                    <div className="input-group">
                      <input
                        type="number"
                        min={10}
                        max={30}
                        className="form-control"
                        value={formData.banner_description_font_size}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (Number.isNaN(value)) return;
                          setField(
                            "banner_description_font_size",
                            Math.min(30, Math.max(10, value))
                          );
                        }}
                      />
                      <span className="input-group-text">px</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="border rounded-3 p-4 mb-4">
                <h2 className="h5 fw-bold mb-4">SEO</h2>
                <div className="row g-3">
                  <div className="col-lg-6">
                    <label className="form-label fw-bold">Meta Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.meta_title}
                      onChange={(e) => setField("meta_title", e.target.value)}
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label fw-bold">Canonical URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.canonical_url}
                      onChange={(e) => setField("canonical_url", e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">Meta Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.meta_description}
                      onChange={(e) => setField("meta_description", e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold">Meta Keywords</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.meta_keywords}
                      onChange={(e) => setField("meta_keywords", e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={loadWarranty}
                  disabled={saving}
                >
                  Reset Changes
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={saving}
                >
                  <FaSave className="me-2" />
                  {saving ? "Saving..." : "Save Warranty Page"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthMainLayout>
  );
}
