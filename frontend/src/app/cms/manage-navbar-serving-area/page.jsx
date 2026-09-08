"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSave, FaPlus, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

const DEFAULT_SERVING_AREAS = [
  { label: "Interior Designers In Noida", href: "/interior-designers-in-noida" },
  { label: "Interior Designers in Ghaziabad", href: "/interior-designers-in-ghaziabad" },
  { label: "Interior Designers in Greater Noida", href: "/interior-designers-in-greater-noida" },
  { label: "Interior Designers in Delhi", href: "/interior-designers-in-delhi" },
  { label: "Interior Designers in Dwarka", href: "/interior-designers-in-dwarka" },
  { label: "Interior Designers in Faridabad", href: "/interior-designers-in-faridabad" },
  { label: "Interior Designers in Gurugram", href: "/interior-designers-in-gurgaon" },
  { label: "Interior Designers In Manesar", href: "/interior-designers-in-manesar" },
  { label: "Interior Designers in Sohna", href: "/interior-designer-in-sohna-gurgaon" },
  { label: "Interior Designer in Noida Extension", href: "/interior-designer-in-noida-extension" }
];

export default function ManageNavbarServingArea() {
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
      const res = await api.get("/cms-content/navbar_serving_area");

      if (res.data) {
        const record = Array.isArray(res.data) ? res.data[0] : res.data;
        if (record) {
          setContentId(record.id);
          const content = record.json_content || {};
          setItems(content.items && content.items.length > 0 ? content.items : DEFAULT_SERVING_AREAS);
        } else {
          setItems(DEFAULT_SERVING_AREAS);
        }
      } else {
        setItems(DEFAULT_SERVING_AREAS);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load navigation data. Using defaults.");
      setItems(DEFAULT_SERVING_AREAS);
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
      { label: "", href: "" }
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

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();

      formData.append(
        "json_content",
        JSON.stringify({
          items,
        })
      );

      if (contentId) {
        await api.patch(
          `/cms-content/update-with-image/${contentId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await api.post(
          "/cms-content/navbar_serving_area",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      toast.success("Serving Area menu saved successfully!");
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
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Manage Serving Area Links</h2>
          <button
            className="btn btn-success"
            disabled={saving}
            onClick={handleSave}
          >
            <FaSave className="me-2" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Navigation Links</h4>
          <button className="btn btn-primary" onClick={addItem}>
            <FaPlus className="me-2" />
            Add Page
          </button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-1 d-flex gap-1 justify-content-center">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={index === 0}
                    onClick={() => moveItem(index, "up")}
                    title="Move Up"
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(index, "down")}
                    title="Move Down"
                  >
                    <FaArrowDown />
                  </button>
                </div>

                <div className="col-md-5">
                  <label className="form-label fw-bold">Page Title / Label</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Interior Designers In Noida"
                    value={item.label}
                    onChange={(e) =>
                      handleItemChange(index, "label", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-5">
                  <label className="form-label fw-bold">Page Link / URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. /interior-designers-in-noida"
                    value={item.href}
                    onChange={(e) =>
                      handleItemChange(index, "href", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-1 text-end mt-3 mt-md-0">
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteItem(index)}
                    title="Delete Item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AuthMainLayout>
  );
}