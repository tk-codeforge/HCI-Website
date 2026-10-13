"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { FaSave, FaPlus, FaTrash } from "react-icons/fa";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

// 🌟 FIX: A tiny 1x1 transparent pixel to trick the backend into overwriting the old image
const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
const MAX_IMAGE_BYTES = 200 * 1024;

const validateImage = (file) => {
  if (!file || file.type !== "image/webp") {
    toast.error("Only .webp images are allowed.");
    return false;
  }

  if (file.size > MAX_IMAGE_BYTES) {
    toast.error("Image must be 200 KB or smaller.");
    return false;
  }

  return true;
};

const getMediaAlt = (image, mediaFiles) => {
  if (typeof image !== "string" || !image) return "";

  const filename = image.split(/[?#]/)[0].split("/").pop();

  const media = mediaFiles.find(
    (file) =>
      file.filename === filename ||
      file.url?.split(/[?#]/)[0].split("/").pop() === filename
  );

  return media?.alt_text || "";
};

export default function ManageTheWayWeWork() {
  const [contentId, setContentId] = useState(null);
  console.log("contentId =", contentId);

  const [heading, setHeading] = useState("The Way We Work");
  const [headingColor, setHeadingColor] = useState("#ffffff");
  const [headingTag, setHeadingTag] = useState("h2");

  const [backgroundImage, setBackgroundImage] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState("");
  const [bgSize, setBgSize] = useState("cover");
  const [backgroundAltText, setBackgroundAltText] = useState("");
const [mediaFiles, setMediaFiles] = useState([]);
  
  const fileInputRef = useRef(null); 

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      let mediaList = [];

try {
  const token = localStorage.getItem("token");

  const mediaRes = await api.get(
    "/cms-parent-child/media-library",
    {
      headers: {
        Authorization: `Bearer ${token || ""}`,
      },
    }
  );

  mediaList = Array.isArray(mediaRes.data)
    ? mediaRes.data
    : [];

  setMediaFiles(mediaList);
} catch (error) {
  console.error("Failed to load Media Library:", error);
}

      const res = await api.get(
        "/cms-content/home_page_content_the_way_we_work"
      );

      if (!res.data) return;

      const record = Array.isArray(res.data) ? res.data[0] : res.data;

      if (!record) return;

      setContentId(record.id);
      const content = record.json_content || {};

      setHeading(content.heading || "The Way We Work");
      setHeadingColor(content.headingColor || "#ffffff"); 
      setHeadingTag(content.headingTag || "h2");
      setBgSize(content.bgSize || "cover");  
      setBackgroundAltText(
  content.bg_image_alt ||
  getMediaAlt(content.bg_image, mediaList)
);             
      
      // const hydratedCards = (content.cards || []).map((card) => ({
      //   ...card,
      //   textColor: card.textColor || "#ffffff",
      //   iconColor: card.iconColor || "#343a40",
      //   iconSize: card.iconSize || 120,
      // }));

      const hydratedCards = (content.cards || []).map((card) => ({
  ...card,

  iconAltText:
    card.iconAltText ||
    getMediaAlt(card.icon, mediaList),

  textColor: card.textColor || "#ffffff",
  iconColor: card.iconColor || "#343a40",
  iconSize: card.iconSize || 120,
}));
      setCards(hydratedCards);

      // 🌟 FIX: Intercept the transparent pixel so the CMS shows "No image selected" properly
      const dbImage = content.bg_image || "";
      setBackgroundPreview(dbImage === TRANSPARENT_PIXEL ? "" : dbImage);

    } catch (err) {
      console.log(err);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (index, field, value) => {
    const updated = [...cards];
    updated[index][field] = value;
    setCards(updated);
  };

  // const handleIconChange = (index, file) => {
  //   const updated = [...cards];
  //   updated[index].icon = file;
  //   updated[index].preview = URL.createObjectURL(file);
  //   setCards(updated);
  // };

  const handleIconChange = (index, file) => {
  if (!file) return;

  if (!validateImage(file)) return;

  const updated = [...cards];

  updated[index] = {
    ...updated[index],
    icon: file,
    preview: URL.createObjectURL(file),
    iconAltText: "",
  };

  setCards(updated);
};

  const addCard = () => {
    setCards([
      ...cards,
      {
        number: "",
        title: "",
        description: "",
        buttonText: "Know More",
        buttonLink: "",
        icon: null,
        preview: "",
        iconSize: 44,
        textColor: "#ffffff",
        iconColor: "#ffffff",
        bgColorLeft: "#f8f9fa",
      },
    ]);
  };

  const deleteCard = (index) => {
    const updated = [...cards];
    updated.splice(index, 1);
    setCards(updated);
  };

  const handleRemoveBackground = () => {
    setBackgroundImage(null);
    setBackgroundPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log("contentId =", contentId);

      const formData = new FormData();

      // const updatedCards = cards.map(({ preview, ...card }) => ({
      //   ...card,
      //   icon: typeof card.icon === "string" ? card.icon : "",
      // }));

      const updatedCards = cards.map(({ preview, ...card }) => ({
  ...card,

  icon: typeof card.icon === "string" ? card.icon : "",

  iconAltText:
    card.iconAltText?.trim() ||
    getMediaAlt(
      typeof card.icon === "string" ? card.icon : "",
      mediaFiles
    ),
}));

      // 🌟 FIX: Logic to bypass backend empty-string ignores
      let finalBgImage = backgroundPreview;
      if (backgroundPreview.startsWith("blob:")) {
        // New file is being uploaded via formData.append("image", file)
        finalBgImage = ""; 
      } else if (backgroundPreview === "") {
        // Image was removed. Send the invisible pixel to force backend overwrite.
        finalBgImage = TRANSPARENT_PIXEL;
      }

      formData.append(
        "json_content",
        JSON.stringify({
          heading,
          headingColor,
          headingTag,
          bgSize,
          bg_image: finalBgImage, 
          cards: updatedCards,
           bg_image_alt:
    backgroundAltText.trim() ||
    getMediaAlt(backgroundPreview, mediaFiles),
        })
      );

      const iconIndices = [];
      cards.forEach((card, idx) => {
        if (card.icon instanceof File) {
          formData.append("icons", card.icon);
          iconIndices.push(idx);
        }
      });
      formData.append("icon_indices", JSON.stringify(iconIndices));

      if (backgroundImage instanceof File) {
        formData.append("image", backgroundImage);
      }

      let response;

      if (contentId) {
        response = await api.patch(
          `/cms-content/update-with-image/${contentId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await api.post(
          "/cms-content/home_page_content_the_way_we_work",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      toast.success("Saved Successfully");
      fetchData();
    } catch (err) {
      console.log(err);
      toast.error("Save Failed");
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
          <h2 className="fw-bold" >Manage {heading}</h2>

          <button
            className="btn btn-success"
            disabled={saving}
            onClick={handleSave}
          >
            <FaSave className="me-2" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        {/* Heading Settings */}
        <div className="card shadow-sm border-0 mb-4">
          {/* <div className="card-body row">
            <div className="col-md-8">
              <label className="form-label fw-bold">Section Heading</label>
              <input
                className="form-control"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Heading Color</label>
              <input
                type="color"
                className="form-control form-control-color w-100"
                value={headingColor}
                onChange={(e) => setHeadingColor(e.target.value)}
                title="Choose heading color"
              />
            </div>
          </div> */}

          <div className="card-body row g-3">
  <div className="col-md-6">
    <label className="form-label fw-bold">Section Heading</label>
    <input
      className="form-control"
      value={heading}
      onChange={(e) => setHeading(e.target.value)}
    />
  </div>
  <div className="col-md-3">
    <label className="form-label fw-bold">Heading Tag</label>
    <select
      className="form-select"
      value={headingTag}
      onChange={(e) => setHeadingTag(e.target.value)}
    >
      {HEADING_TAGS.map((t) => (
        <option key={t} value={t}>{t.toUpperCase()}</option>
      ))}
    </select>
  </div>
  <div className="col-md-3">
    <label className="form-label fw-bold">Heading Color</label>
    <input
      type="color"
      className="form-control form-control-color w-100"
      value={headingColor}
      onChange={(e) => setHeadingColor(e.target.value)}
      title="Choose heading color"
    />
  </div>
</div>
        </div>

        {/* Background Settings */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body row">
            <div className="col-md-8">
              <label className="form-label fw-bold">Background Image</label>
              {/* <input
                type="file"
                className="form-control"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setBackgroundImage(e.target.files[0]);
                    setBackgroundPreview(
                      URL.createObjectURL(e.target.files[0])
                    );
                  }
                }}
              /> */}

              <input
  type="file"
  className="form-control"
  accept=".webp,image/webp"
  ref={fileInputRef}
  onChange={(e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!validateImage(file)) {
      e.target.value = "";
      return;
    }

    setBackgroundImage(file);
    setBackgroundPreview(URL.createObjectURL(file));
    setBackgroundAltText("");
  }}
/>
              <label className="form-label fw-bold mt-3">
  Image Alt Text
</label>

<input
  type="text"
  className="form-control"
  name="bg_image_alt"
  value={backgroundAltText}
  onChange={(e) => setBackgroundAltText(e.target.value)}
  placeholder="Describe the banner image"
  maxLength={125}
/>

              {backgroundPreview ? (
                <div className="mt-3 d-flex align-items-center gap-3">
                  <img
                    src={backgroundPreview}
                    alt="Background Preview"
                    className="rounded border"
                    style={{
                      width: "250px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleRemoveBackground}
                  >
                    <FaTrash className="me-1" /> Remove Image (Use Default White)
                  </button>
                </div>
              ) : (
                <div className="mt-2 text-muted small">
                  No image selected. Section will use a default <strong>solid white background</strong>.
                </div>
              )}
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Background Size</label>
              <select
                className="form-select"
                value={bgSize}
                onChange={(e) => setBgSize(e.target.value)}
              >
                <option value="cover">Cover (Fills Area)</option>
                <option value="contain">Contain (Fits inside)</option>
                <option value="100% 100%">Stretch (100% x 100%)</option>
                <option value="auto">Auto (Original Size)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Process Cards</h4>
          <button className="btn btn-primary" onClick={addCard}>
            <FaPlus className="me-2" />
            Add Card
          </button>
        </div>

        {cards.map((card, index) => (
          <div key={index} className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-2">
                  <label className="form-label">Number</label>
                  <input
                    className="form-control"
                    value={card.number}
                    onChange={(e) =>
                      handleCardChange(index, "number", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-10">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    value={card.title}
                    onChange={(e) =>
                      handleCardChange(index, "title", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="form-label">Description</label>
                <textarea
                  rows={4}
                  className="form-control"
                  value={card.description}
                  onChange={(e) =>
                    handleCardChange(index, "description", e.target.value)
                  }
                />
              </div>

              <div className="row mt-3">
                <div className="col-md-6">
                  <label className="form-label">Button Text</label>
                  <input
                    className="form-control"
                    value={card.buttonText}
                    onChange={(e) =>
                      handleCardChange(index, "buttonText", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Button Link</label>
                  <input
                    className="form-control"
                    value={card.buttonLink}
                    onChange={(e) =>
                      handleCardChange(index, "buttonLink", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Advanced Styling Options for Cards */}
              <div className="row mt-4 p-3 bg-light rounded align-items-end">
                <h6 className="fw-bold mb-3">Card Styles & Icon</h6>
                <div className="col-md-4">
                  <label className="form-label">Card Icon</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".webp,image/webp"
                    onChange={(e) => handleIconChange(index, e.target.files[0])}
                  />
                  {(() => {
                    const imgSrc =
                      card.icon instanceof File
                        ? card.preview
                        : typeof card.icon === "string"
                        ? card.icon
                        : "";

                    return (
                      imgSrc && (
                        <div className="mt-3">
                          <img
                            src={imgSrc}
                            className="border rounded bg-dark p-1"
                            style={{ width: 80, objectFit: "contain" }}
                            alt="Card icon preview"
                          />
                        </div>
                      )
                    );
                  })()}
                  <label className="form-label mt-3">
  Icon Alt Text
</label>

<input
  type="text"
  className="form-control"
  name="iconAltText"
  value={card.iconAltText ?? ""}
  onChange={(e) =>
    handleCardChange(index, "iconAltText", e.target.value)
  }
  placeholder="Describe the icon"
  maxLength={125}
/>
                </div>

                <div className="col-md-3">
  <label className="form-label">Icon Size (px)</label>
  <input
    type="range"
    className="w-100 d-block mt-2"
    min="20"
    max="150"
    value={card.iconSize || 44}
    onChange={(e) => handleCardChange(index, "iconSize", Number(e.target.value))}
  />
  <div className="text-muted text-center fw-bold">
    {card.iconSize || 44}px
  </div>

  {/* 🌟 MOVED: Text Color now sits below the Icon Size slider instead of
      below the icon file preview, per updated layout request — no logic
      change, purely a JSX position move within the same row. */}
  <label className="form-label mt-3">Text Color</label>
  <input
    type="color"
    className="form-control form-control-color w-100"
    value={card.textColor || "#ffffff"}
    onChange={(e) => handleCardChange(index, "textColor", e.target.value)}
  />
</div>

                <div className="col-md-2">
  {/* Relabeled for clarity — this has always controlled the card's right-side
      panel background, not the icon glyph. Field name (iconColor) kept as-is
      to stay compatible with already-saved CMS records. */}
  <label className="form-label">Right Panel Background</label>
  <input
    type="color"
    className="form-control form-control-color w-100"
    value={card.iconColor || "#ffffff"}
    onChange={(e) => handleCardChange(index, "iconColor", e.target.value)}
  />
</div>

<div className="col-md-2">
  {/* 🌟 NEW: left panel background — previously hardcoded from a fixed
      palette array in HomeContent.jsx with no CMS control at all. */}
  <label className="form-label">Left Panel Background</label>
  <input
    type="color"
    className="form-control form-control-color w-100"
    value={card.bgColorLeft || "#f8f9fa"}
    onChange={(e) => handleCardChange(index, "bgColorLeft", e.target.value)}
  />
</div>

              </div>

              <div className="text-end mt-4">
                <button
                  className="btn btn-danger"
                  onClick={() => deleteCard(index)}
                >
                  <FaTrash className="me-2" />
                  Delete Card
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AuthMainLayout>
  );
}