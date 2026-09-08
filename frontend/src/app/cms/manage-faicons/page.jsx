"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSave, FaPlus, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

// Default fallback data for the icons
const DEFAULT_STATS = [
  { iconType: "fa", iconName: "FaHome", image: "", value: "2680+", label: "HOME RENOVATIONS", color: "#f5a623", size: 40 },
  { iconType: "fa", iconName: "FaSmile", image: "", value: "2660+", label: "HAPPY CUSTOMERS", color: "#f5a623", size: 40 },
  { iconType: "fa", iconName: "FaStar", image: "", value: "4.8/5", label: "CLIENT RATINGS", color: "#333333", size: 40 }
];

export default function ManageFaIcons() {
  const [contentId, setContentId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Using a unique key for these stats in your CMS
      const res = await api.get("/cms-content/excellence_stats"); 

      if (res.data) {
        const record = Array.isArray(res.data) ? res.data[0] : res.data;
        if (record) {
          setContentId(record.id);
          const content = record.json_content || {};
          setItems(content.items && content.items.length > 0 ? content.items : DEFAULT_STATS);
        } else {
          setItems(DEFAULT_STATS);
        }
      } else {
        setItems(DEFAULT_STATS);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load icon data. Using defaults.");
      setItems(DEFAULT_STATS);
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { iconType: "fa", iconName: "FaStar", image: "", value: "", label: "", color: "#000000", size: 40 }
    ]);
  };

  const deleteItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const moveItem = (index, direction) => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);
    setItems(updated);
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("image", file);
      // Assuming you have an image upload endpoint that returns the URL
      const uploadRes = await api.post("/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (uploadRes.data && uploadRes.data.url) {
        handleItemChange(index, "image", uploadRes.data.url);
        toast.success("Image uploaded successfully!");
      }
    } catch (err) {
      toast.error("Image upload failed.");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      formData.append(
        "json_content",
        JSON.stringify({ items })
      );

      if (contentId) {
        await api.patch(
          `/cms-content/update-with-image/${contentId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await api.post(
          "/cms-content/excellence_stats",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      toast.success("Icons saved successfully!");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AuthMainLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="spinner-border text-warning" />
        </div>
      </AuthMainLayout>
    );
  }

  return (
    <AuthMainLayout>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Manage Excellence Icons & Stats</h2>
          <button className="btn btn-success" disabled={saving} onClick={handleSave}>
            <FaSave className="me-2" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Stat Blocks</h4>
          <button className="btn btn-primary" onClick={addItem}>
            <FaPlus className="me-2" /> Add Stat
          </button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <div className="row align-items-center g-3">
                
                {/* Move Controls */}
                <div className="col-md-1 d-flex flex-column gap-1 justify-content-center">
                  <button type="button" className="btn btn-outline-secondary btn-sm" disabled={index === 0} onClick={() => moveItem(index, "up")} title="Move Up"><FaArrowUp /></button>
                  <button type="button" className="btn btn-outline-secondary btn-sm" disabled={index === items.length - 1} onClick={() => moveItem(index, "down")} title="Move Down"><FaArrowDown /></button>
                </div>

                {/* Type Selection */}
                <div className="col-md-2">
                  <label className="form-label fw-bold">Icon Type</label>
                  <select className="form-select" value={item.iconType} onChange={(e) => handleItemChange(index, "iconType", e.target.value)}>
                    <option value="fa">FontAwesome</option>
                    <option value="image">Custom SVG/PNG</option>
                  </select>
                </div>

                {/* Icon Source (FA Name or Image Upload) */}
                <div className="col-md-3">
                  {item.iconType === "fa" ? (
                    <>
                      <label className="form-label fw-bold">FA Icon Name</label>
                      <input type="text" className="form-control" placeholder="e.g. FaHome" value={item.iconName} onChange={(e) => handleItemChange(index, "iconName", e.target.value)} />
                    </>
                  ) : (
                    <>
                      <label className="form-label fw-bold">Upload Image/SVG</label>
                      <input type="file" className="form-control" accept="image/*, .svg" onChange={(e) => handleImageUpload(index, e.target.files[0])} />
                      {item.image && <small className="text-success mt-1 d-block">Image uploaded</small>}
                    </>
                  )}
                </div>

                {/* Values and Labels */}
                <div className="col-md-2">
                  <label className="form-label fw-bold">Value</label>
                  <input type="text" className="form-control" placeholder="e.g. 2680+" value={item.value} onChange={(e) => handleItemChange(index, "value", e.target.value)} />
                </div>
                <div className="col-md-2">
                  <label className="form-label fw-bold">Label</label>
                  <input type="text" className="form-control" placeholder="e.g. HOME RENOVATIONS" value={item.label} onChange={(e) => handleItemChange(index, "label", e.target.value)} />
                </div>

                {/* Size & Color Controls */}
                <div className="col-md-1">
                  <label className="form-label fw-bold">Size</label>
                  <input type="number" className="form-control px-1" value={item.size} onChange={(e) => handleItemChange(index, "size", Number(e.target.value))} />
                </div>
                <div className="col-md-1">
                  <label className="form-label fw-bold">Color</label>
                  <input type="color" className="form-control form-control-color w-100" value={item.color} onChange={(e) => handleItemChange(index, "color", e.target.value)} title="Choose your color" />
                </div>

                {/* Delete Button */}
                <div className="col-md-12 text-end border-top pt-2 mt-3">
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteItem(index)} title="Delete Item"><FaTrash /> Remove Block</button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </AuthMainLayout>
  );
}