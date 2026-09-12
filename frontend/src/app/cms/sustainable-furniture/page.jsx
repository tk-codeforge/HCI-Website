"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

const PAGE_TYPE = "sustainable_furniture";

export default function ManageSustainableFurniturePage() {
  return (
    <AuthMainLayout>
      <ManageSustainableFurnitureContent />
    </AuthMainLayout>
  );
}

function ManageSustainableFurnitureContent() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingIndex, setSavingIndex] = useState(null);
  const [contentId, setContentId] = useState(null);

  const [cards, setCards] = useState([]);
  const [cardImages, setCardImages] = useState({}); // index -> File

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

  const handleImageChange = (index, file) => {
    if (!file) return;

    setCardImages((prev) => ({ ...prev, [index]: file }));

    // Clear the stored URL so the freshly uploaded file preview takes over
    const updated = [...cards];
    updated[index] = { ...updated[index], image: "" };
    setCards(updated);
  };

  const addCard = () => {
    setCards([
      ...cards,
      {
        title: "",
        description: "",
        buttonText: "View More",
        buttonLink: "",
        image: "",
      },
    ]);
  };

//   const deleteCard = (index) => {
//     const updated = [...cards];
//     updated.splice(index, 1);
//     setCards(updated);
//     setCardImages((prev) => {
//       const reKeyed = {};
//       Object.keys(prev)
//         .map((k) => parseInt(k, 10))
//         .forEach((oldIndex) => {
//           if (oldIndex === index) return;
//           const newIndex = oldIndex > index ? oldIndex - 1 : oldIndex;
//           reKeyed[newIndex] = prev[oldIndex];
//         });
//       return reKeyed;
//     });
//   };

const deleteCard = async (index) => {
    // Optional: Add a confirmation prompt to prevent accidental clicks
    if (!window.confirm("Are you sure you want to delete this card?")) return;

    // 1. Calculate the updated card array
    const updatedCards = [...cards];
    updatedCards.splice(index, 1);

    // 2. Calculate the updated images object
    const updatedImages = {};
    Object.keys(cardImages)
      .map((k) => parseInt(k, 10))
      .forEach((oldIndex) => {
        if (oldIndex === index) return;
        const newIndex = oldIndex > index ? oldIndex - 1 : oldIndex;
        updatedImages[newIndex] = cardImages[oldIndex];
      });

    // 3. Update the UI state instantly
    setCards(updatedCards);
    setCardImages(updatedImages);

    // 4. Immediately trigger the backend save
    try {
      setSaving(true);
      await persistCards(updatedCards, updatedImages);
      toast.success("Card deleted successfully!");
      fetchData(); // Refresh to ensure sync
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete card.");
    } finally {
      setSaving(false);
    }
  };

  // Cards all live together in a single json_content blob on the backend,
  // so every save (whole-page or per-card) writes the full cards array.
  // This just makes the network call; callers handle their own
  // loading state and toast message.
  const persistCards = async (cardsData = cards, imagesData = cardImages) => {
    const payload = { cards: cardsData };

    const formData = new FormData();
    formData.append("json_content", JSON.stringify(payload));

    const imageIndices = [];
    cards.forEach((_, index) => {
      if (cardImages[index] instanceof File) {
        formData.append("icons", cardImages[index]);
        imageIndices.push(index);
      }
    });

    if (imageIndices.length > 0) {
      formData.append("icon_indices", JSON.stringify(imageIndices));
    }

    if (contentId) {
      await api.patch(`/cms-content/update-with-image/${contentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      const createRes = await api.post(`/cms-content/${PAGE_TYPE}`, payload);
      const newId = createRes?.data?.id;

      if (newId && imageIndices.length > 0) {
        await api.patch(`/cms-content/update-with-image/${newId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await persistCards();
      toast.success("Section updated successfully!");
      setCardImages({});
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCard = async (index) => {
    try {
      setSavingIndex(index);
      await persistCards();
      toast.success(`Card ${index + 1} saved successfully!`);
      setCardImages({});
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save card.");
    } finally {
      setSavingIndex(null);
    }
  };

  const isBusy = saving || savingIndex !== null;

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold" style={{ fontSize: "2.5rem" }}>
          Sustainable Furniture Cards
        </h1>
        <button
          className="btn btn-success px-4 d-flex align-items-center gap-2"
          onClick={handleSave}
          disabled={isBusy || loading}
        >
          <FaSave /> {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      <div className="d-flex justify-content-end align-items-center mb-3">
        <button
          className="btn btn-primary px-4 rounded-pill d-flex align-items-center gap-2"
          onClick={addCard}
          disabled={isBusy}
        >
          <FaPlus /> Add Card
        </button>
      </div>

      {/* Cards List */}
      {cards.map((card, index) => {
        const previewSrc = cardImages[index] instanceof File ? URL.createObjectURL(cardImages[index]) : card.image;

        return (
          <div key={index} className="card shadow-sm border-0 mb-4 rounded-4">
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-12">
                  <label className="form-label fw-bold text-primary">Card Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) => handleImageChange(index, e.target.files?.[0])}
                  />
                  {previewSrc && (
                    <div className="mt-3">
                      <div
                        className="overflow-hidden rounded-3 shadow-sm"
                        style={{ maxWidth: "300px", height: "150px" }}
                      >
                        <img
                          src={previewSrc}
                          alt="Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-md-12">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    value={card.title}
                    onChange={(e) => handleCardChange(index, "title", e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    value={card.description}
                    onChange={(e) => handleCardChange(index, "description", e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Button Text</label>
                  <input
                    className="form-control"
                    value={card.buttonText}
                    onChange={(e) => handleCardChange(index, "buttonText", e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Button Link</label>
                  <input
                    className="form-control"
                    value={card.buttonLink}
                    onChange={(e) => handleCardChange(index, "buttonLink", e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  className="btn btn-success d-flex align-items-center gap-2"
                  onClick={() => handleSaveCard(index)}
                  disabled={isBusy}
                >
                  <FaSave /> {savingIndex === index ? "Saving..." : "Save"}
                </button>
                <button className="btn btn-danger" onClick={() => deleteCard(index)} disabled={isBusy}>
                  <FaTrash className="me-2" /> Delete Card
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
