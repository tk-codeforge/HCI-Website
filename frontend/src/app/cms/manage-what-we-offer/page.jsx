"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

const PAGE_TYPE = "what_we_offer";

export default function ManageWhatWeOfferPage() {
  return (
    <AuthMainLayout>
      <ManageWhatWeOfferContent />
    </AuthMainLayout>
  );
}

function ManageWhatWeOfferContent() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [contentId, setContentId] = useState(null);

  const [heading, setHeading] = useState("What We Offer");
  const [headingColor, setHeadingColor] = useState("#23236b");
  // 🌟 NEW: eyebrow span above the heading (was hardcoded as "Explore" with
  // no CMS backing in HomeContent.jsx). Saved/read as spanText/spanColor
  // alongside heading/headingColor in the same json_content blob.
  const [spanText, setSpanText] = useState("Explore");
  const [spanColor, setSpanColor] = useState("#ff914d");
  const [bgImage, setBgImage] = useState(""); 
  const [bgImageFile, setBgImageFile] = useState(null);
  const [bgImagePreview, setBgImagePreview] = useState(""); 
  const [bgImageRemoved, setBgImageRemoved] = useState(false);
  const [bgSize, setBgSize] = useState("contain");

  const [cards, setCards] = useState([]);
  const [cardIcons, setCardIcons] = useState({});

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

          setHeading(content.heading || "What We Offer");
          setHeadingColor(content.headingColor || "#23236b");
          // 🌟 NEW: hydrate span text/color, defaulting to the original
          // hardcoded copy for older records saved before this field existed.
          setSpanText(content.spanText || "Explore");
          setSpanColor(content.spanColor || "#ff914d");
          // Read image from json_content or record table
          setBgImage(content.bg_image || content.image || record.image || "");
          setBgImageRemoved(false);
          setBgSize(content.bgSize || "cover");
          setCards(Array.isArray(content.cards) ? content.cards : []);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (index, field, value) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    setCards(updated);
  };

  const handleIconChange = (index, file) => {
    if (file) {
      setCardIcons((prev) => ({ ...prev, [index]: file }));
      
      const updated = [...cards];
      updated[index] = { ...updated[index], icon: "", image: "" };
      setCards(updated);
    }
  };

  const deleteBgImage = () => {
    setBgImage("");
    setBgImageFile(null);
    setBgImagePreview("");
    setBgImageRemoved(true);
  };

  const addCard = () => {
    setCards([
      ...cards,
      { title: "", description: "", buttonText: "Read More", buttonLink: "", iconColor: "#23236b" },
    ]);
  };

  const deleteCard = (index) => {
    const updated = [...cards];
    updated.splice(index, 1);
    setCards(updated);
    
    const updatedIcons = { ...cardIcons };
    delete updatedIcons[index];
    setCardIcons(updatedIcons);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // ✅ FIX: Explicitly save bg_image and image as empty strings when deleted
      // 🌟 NEW: spanText/spanColor now saved alongside heading/headingColor
      const payload = { 
        heading, 
        headingColor, 
        spanText,
        spanColor,
        bgSize, 
        bg_image: bgImage, 
        image: bgImage, 
        cards 
      };
      
      const formData = new FormData();
      formData.append("json_content", JSON.stringify(payload));
      
      if (bgImageFile instanceof File) {
        formData.append("image", bgImageFile);
      } else if (bgImageRemoved || !bgImage) {
        // Clear DB column
        formData.append("remove_image", "true");
      }

      const iconIndices = [];
      cards.forEach((_, index) => {
        if (cardIcons[index] instanceof File) {
          formData.append("icons", cardIcons[index]);
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

      toast.success("Section updated successfully!");
      setBgImageFile(null);
      setBgImageRemoved(false);
      setCardIcons({});
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
          Manage {heading}
        </h1>
        <button className="btn btn-success px-4 d-flex align-items-center gap-2" onClick={handleSave} disabled={saving || loading}>
          <FaSave /> {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Main Settings */}
      <div className="card shadow-sm border-0 mb-5 rounded-4">
        <div className="card-body p-4">
          <div className="row g-4">
            <div className="col-md-8">
              <label className="form-label fw-bold">Section Heading</label>
              <input type="text" className="form-control form-control-lg rounded-pill" value={heading} onChange={(e) => setHeading(e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Heading Color</label>
              <input type="color" className="form-control form-control-color border-0 p-0" value={headingColor} onChange={(e) => setHeadingColor(e.target.value)} style={{ width: "100%", height: "45px", borderRadius: "30px", cursor: "pointer" }} />
            </div>
            {/* 🌟 NEW: Span / Eyebrow Text + Color, same layout pattern as
                Section Heading / Heading Color above. */}
            <div className="col-md-8">
              <label className="form-label fw-bold">Span / Eyebrow Text</label>
              <input type="text" className="form-control form-control-lg rounded-pill" value={spanText} onChange={(e) => setSpanText(e.target.value)} placeholder="e.g. Explore" />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Span Color</label>
              <input type="color" className="form-control form-control-color border-0 p-0" value={spanColor} onChange={(e) => setSpanColor(e.target.value)} style={{ width: "100%", height: "45px", borderRadius: "30px", cursor: "pointer" }} />
            </div>
            <div className="col-md-8 mt-4">
              <label className="form-label fw-bold">Background Image</label>
              <input type="file" accept="image/*" className="form-control" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setBgImageFile(file);
                  setBgImagePreview(URL.createObjectURL(file));
                  setBgImageRemoved(false);
                }} />
              {displayedBgImage && (
                <div className="mt-3">
                  <div className="overflow-hidden rounded-3 shadow-sm" style={{ maxWidth: "300px", height: "150px" }}>
                    <img src={displayedBgImage} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm mt-2 d-flex align-items-center gap-2"
                    onClick={deleteBgImage}
                  >
                    <FaTrash /> Remove Background Image
                  </button>
                </div>
              )}
            </div>
            <div className="col-md-4 mt-4">
              <label className="form-label fw-bold">Background Size</label>
              <select className="form-select" value={bgSize} onChange={(e) => setBgSize(e.target.value)}>
                <option value="cover">Cover (Fills entire space)</option>
                <option value="contain">Contain (Fits inside)</option>
                <option value="auto">Auto (Original Size)</option>
                <option value="100% 100%">Stretch (100% x 100%)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold m-0">Offer Cards</h3>
        <button className="btn btn-primary px-4 rounded-pill d-flex align-items-center gap-2" onClick={addCard}>
          <FaPlus /> Add Card
        </button>
      </div>

      {/* Cards List */}
      {cards.map((card, index) => (
        <div key={index} className="card shadow-sm border-0 mb-4 rounded-4">
          <div className="card-body p-4">
            <div className="row g-3">
              
              <div className="col-md-12">
                <label className="form-label fw-bold text-primary">Card Icon / Image</label>
                <input type="file" accept="image/*" className="form-control" onChange={(e) => handleIconChange(index, e.target.files?.[0])} />
                {(card.icon || card.image || cardIcons[index]) && (
                  <div className="mt-2">
                    <img 
                      src={cardIcons[index] ? URL.createObjectURL(cardIcons[index]) : (card.icon || card.image)} 
                      alt="Icon" 
                      style={{ width: "50px", height: "50px", objectFit: "contain", padding: "5px", borderRadius: "10px" }} 
                    />
                  </div>
                )}
              </div>

              {/* ✅ REMOVED: Icon Background Color Input */}
              
              <div className="col-md-2">
                <label className="form-label">Title / Font Color</label>
                <input type="color" className="form-control form-control-color border-0 p-0 w-100" value={card.iconColor || "#23236b"} onChange={(e) => handleCardChange(index, "iconColor", e.target.value)} style={{ height: "40px" }} />
              </div>

              <div className="col-md-10">
                <label className="form-label">Title</label>
                <input className="form-control" value={card.title} onChange={(e) => handleCardChange(index, "title", e.target.value)} />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea rows={3} className="form-control" value={card.description} onChange={(e) => handleCardChange(index, "description", e.target.value)} />
              </div>

              <div className="col-md-6">
                <label className="form-label">Button Text</label>
                <input className="form-control" value={card.buttonText} onChange={(e) => handleCardChange(index, "buttonText", e.target.value)} />
              </div>

              <div className="col-md-6">
                <label className="form-label">Button Link</label>
                <input className="form-control" value={card.buttonLink} onChange={(e) => handleCardChange(index, "buttonLink", e.target.value)} />
              </div>
            </div>

            <div className="text-end mt-3">
              <button className="btn btn-danger" onClick={() => deleteCard(index)}>
                <FaTrash className="me-2" /> Delete Card
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}