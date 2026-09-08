"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import { FaSave, FaPlus, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";

const PAGE_TYPE = "services_page";

export default function ManageServicesPage() {
  return (
    <AuthMainLayout>
      <ManageServicesContent />
    </AuthMainLayout>
  );
}

function ManageServicesContent() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contentId, setContentId] = useState(null);
  const [bannerHeadingColor, setBannerHeadingColor] = useState("#ffffff");
const [bannerDescriptionColor, setBannerDescriptionColor] = useState("#ffffff");

  // Banner States
  const [bannerHeading, setBannerHeading] = useState("Services");
  const [bannerDescription, setBannerDescription] = useState("Every home has potential, and we at High Creation Interior bring it to life with exceptional design...");
  const [bgImage, setBgImage] = useState(""); 
  const [bgImageFile, setBgImageFile] = useState(null);
  const [bgImagePreview, setBgImagePreview] = useState(""); 
  const [bgImageRemoved, setBgImageRemoved] = useState(false);

  // Premium Interiors (Services List) States
  const [services, setServices] = useState([]);
  const [serviceImages, setServiceImages] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/cms-content/${PAGE_TYPE}`);

      if (res.data) {
        const record = Array.isArray(res.data) ? res.data[0] : res.data;
        if (record) {
          setContentId(record.id);
          const content = record.json_content || {};

          setBannerHeading(content.bannerHeading || "Services");
setBannerDescription(content.bannerDescription || "");
setBannerHeadingColor(content.bannerHeadingColor || "#ffffff");
setBannerDescriptionColor(content.bannerDescriptionColor || "#ffffff");
          setBgImage(content.bg_image || content.image || record.image || "");
          setBgImageRemoved(false);
          setServices(Array.isArray(content.services) ? content.services : []);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleImageChange = (index, file) => {
    if (file) {
      setServiceImages((prev) => ({ ...prev, [index]: file }));
      const updated = [...services];
      // Clear string path so preview prioritizes the new file
      updated[index] = { ...updated[index], image: "" }; 
      setServices(updated);
    }
  };

  const deleteBgImage = () => {
    setBgImage("");
    setBgImageFile(null);
    setBgImagePreview("");
    setBgImageRemoved(true);
  };

  const addService = () => {
    setServices([
      ...services,
      { title: "", description: "", buttonText: "Read More", buttonLink: "", image: "" },
    ]);
  };

  const deleteService = (index) => {
    const updated = [...services];
    updated.splice(index, 1);
    setServices(updated);
    
    const updatedImages = { ...serviceImages };
    delete updatedImages[index];
    setServiceImages(updatedImages);
  };

  const moveService = (index, direction) => {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= services.length) return;

  const updated = [...services];
  [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
  setServices(updated);

  // Keep any pending File uploads in serviceImages aligned with the new positions
  setServiceImages((prev) => {
    const updatedImages = { ...prev };
    const a = updatedImages[index];
    const b = updatedImages[newIndex];

    if (b !== undefined) updatedImages[index] = b; else delete updatedImages[index];
    if (a !== undefined) updatedImages[newIndex] = a; else delete updatedImages[newIndex];

    return updatedImages;
  });
};

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const payload = { 
  bannerHeading, 
  bannerDescription,
  bannerHeadingColor,
  bannerDescriptionColor,
  bg_image: bgImage, 
  image: bgImage, 
  services 
};
      
      const formData = new FormData();
      formData.append("json_content", JSON.stringify(payload));
      
      // Main Banner Image[cite: 1]
      if (bgImageFile instanceof File) {
        formData.append("image", bgImageFile);
      } else if (bgImageRemoved) {
        formData.append("remove_image", "true");
      }

      // Premium Interiors Images (using 'icons' key to match existing backend logic)[cite: 1]
      const iconIndices = [];
      services.forEach((_, index) => {
        if (serviceImages[index] instanceof File) {
          formData.append("icons", serviceImages[index]);
          iconIndices.push(index);
        }
      });
      
      if (iconIndices.length > 0) {
        formData.append("icon_indices", JSON.stringify(iconIndices));
      }

      if (contentId) {
        await api.patch(`/cms-content/update-with-image/${contentId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const createRes = await api.post(`/cms-content/${PAGE_TYPE}`, payload);
        const newId = createRes?.data?.id;

        if (newId && (bgImageFile || iconIndices.length > 0)) {
          await api.patch(`/cms-content/update-with-image/${newId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      toast.success("Services page updated successfully!");
      setBgImageFile(null);
      setBgImageRemoved(false);
      setServiceImages({});
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const displayedBgImage = bgImageFile instanceof File ? bgImagePreview : bgImage;

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold" style={{ fontSize: "2.5rem" }}>
          Manage Services Page
        </h1>
        <button className="btn btn-success px-4 d-flex align-items-center gap-2" onClick={handleSave} disabled={saving || loading}>
          <FaSave /> {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Banner Settings */}
      <div className="card shadow-sm border-0 mb-5 rounded-4">
        <div className="card-header bg-white pt-4 pb-0 border-0">
            <h3 className="fw-bold m-0 text-primary">Banner Section</h3>
        </div>
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-md-12">
              <label className="form-label fw-bold">Banner Heading</label>
              <input type="text" className="form-control form-control-lg rounded-pill" value={bannerHeading} onChange={(e) => setBannerHeading(e.target.value)} />
            </div>
            
            <div className="col-12">
  <label className="form-label fw-bold">Banner Description</label>
  <textarea rows={4} className="form-control" value={bannerDescription} onChange={(e) => setBannerDescription(e.target.value)} />
</div>

<div className="col-md-6">
  <label className="form-label fw-bold">Heading Color</label>
  <input type="color" className="form-control form-control-color w-100" value={bannerHeadingColor} onChange={(e) => setBannerHeadingColor(e.target.value)} />
</div>

<div className="col-md-6">
  <label className="form-label fw-bold">Description Color</label>
  <input type="color" className="form-control form-control-color w-100" value={bannerDescriptionColor} onChange={(e) => setBannerDescriptionColor(e.target.value)} />
</div>

            <div className="col-md-12 mt-4">
              <label className="form-label fw-bold">Banner Background Image</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setBgImageFile(file);
                  setBgImagePreview(URL.createObjectURL(file));
                  setBgImageRemoved(false);
                }} />
              {displayedBgImage && (
                <div className="mt-3">
                  <div className="overflow-hidden rounded-3 shadow-sm" style={{ maxWidth: "400px", height: "200px" }}>
                    <img src={displayedBgImage} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <button type="button" className="btn btn-outline-danger btn-sm mt-2 d-flex align-items-center gap-2" onClick={deleteBgImage}>
                    <FaTrash /> Remove Background Image
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold m-0">Premium Interiors Content</h3>
        <button className="btn btn-primary px-4 rounded-pill d-flex align-items-center gap-2" onClick={addService}>
          <FaPlus /> Add Content Block
        </button>
      </div>

      {/* Services List */}
      {services.map((service, index) => (
        <div key={index} className="card shadow-sm border-0 mb-4 rounded-4 border-start border-4 border-primary">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
               <h5 className="fw-bold text-secondary m-0">Content Block {index + 1}</h5>
               <div className="d-flex align-items-center gap-2">
               <span className="badge bg-light text-dark border">
                 {index % 2 === 0 ? "Image Left / Text Right" : "Image Right / Text Left"}
               </span>
               <button
       type="button"
       className="btn btn-outline-secondary btn-sm"
       onClick={() => moveService(index, -1)}
       disabled={index === 0}
       title="Move up"
     >
       <FaArrowUp />
     </button>
     <button
       type="button"
       className="btn btn-outline-secondary btn-sm"
       onClick={() => moveService(index, 1)}
       disabled={index === services.length - 1}
       title="Move down"
     >
       <FaArrowDown />
     </button>
     </div>
            </div>
            <div className="row g-3">
              
              <div className="col-md-12">
                <label className="form-label fw-bold text-primary">Location / Interior Image</label>
                <input type="file" accept="image/*" className="form-control" onChange={(e) => handleImageChange(index, e.target.files?.[0])} />
                {(service.image || serviceImages[index]) && (
                  <div className="mt-2">
                    <img 
                      src={serviceImages[index] ? URL.createObjectURL(serviceImages[index]) : service.image} 
                      alt="Service" 
                      style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: "10px" }} 
                    />
                  </div>
                )}
              </div>

              <div className="col-md-12">
                <label className="form-label">Heading</label>
                <input className="form-control" value={service.title} onChange={(e) => handleServiceChange(index, "title", e.target.value)} placeholder="e.g. Interior Designer in Noida for Home in 2026" />
              </div>

              <div className="col-12">
                <label className="form-label">Description (HTML supported)</label>
                <textarea rows={4} className="form-control" value={service.description} onChange={(e) => handleServiceChange(index, "description", e.target.value)} />
              </div>

              <div className="col-md-6">
                <label className="form-label">Button Text</label>
                <input className="form-control" value={service.buttonText} onChange={(e) => handleServiceChange(index, "buttonText", e.target.value)} placeholder="Read More" />
              </div>

              <div className="col-md-6">
                <label className="form-label">Button URL (Target Link)</label>
                <input className="form-control" value={service.buttonLink} onChange={(e) => handleServiceChange(index, "buttonLink", e.target.value)} placeholder="/interior-designers-in-noida" />
              </div>
            </div>

            <div className="text-end mt-4 pt-3 border-top">
              <button className="btn btn-danger" onClick={() => deleteService(index)}>
                <FaTrash className="me-2" /> Delete Block
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {services.length === 0 && (
         <div className="text-center p-5 bg-white rounded-4 shadow-sm border-0">
            <p className="text-muted mb-0">No premium interior content blocks added yet. Click &quot;Add Content Block&quot; to start.</p>
         </div>
      )}
    </div>
  );
}