"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaBuilding,
    FaStore,
    FaTools,
    FaMapMarkerAlt,
    FaWhatsapp,
    FaClock,
    FaFax,
    FaGlobe,
    FaUser,
    FaHome,
    FaWarehouse,
    FaIndustry,
} from "react-icons/fa";

/*
  ============================================================================
  CmsContactPage.jsx
  ----------------------------------------------------------------------------
  This CMS panel manages ALL dynamic content shown on the public Contact page:

    1. Hero Banner        -> heading (tag h1-h6), heading colour, description,
                              description font-size (10-30px), gradient bg colours
    2. Info Cards         -> "Call Us", "Email Us", "Corporate Office",
                              "Workshop" style cards. Icon, title & rows (label /
                              value / link) are all editable, and new cards can
                              be added or removed.
    3. Experience Centers -> section heading + icon, and a list of
                              {heading, address} entries.
    4. Explore-us-on-Map  -> section heading and a list of
                              {type, address, mapSrc} entries (mapSrc is the
                              Google Maps embed URL used in the <iframe>).

  "Send a Message" (the ContactForm component) is intentionally NOT part of
  this CMS - it stays exactly where it is in contact/page.jsx, untouched.

  Data is persisted to a single CMS row (page key: "contact_page") using the
  same api/toast/FormData pattern used across the rest of the admin panel
  (see CmsHowItsWorks.jsx), so it plugs into the existing backend without any
  schema changes - everything lives inside one `json_content` JSON blob.
  ============================================================================
*/

const PAGE_KEY = "contact_page";

// Icons the admin can pick from for any card / section icon.
const ICON_MAP = {
    FaPhoneAlt,
    FaEnvelope,
    FaBuilding,
    FaStore,
    FaTools,
    FaMapMarkerAlt,
    FaWhatsapp,
    FaClock,
    FaFax,
    FaGlobe,
    FaUser,
    FaHome,
    FaWarehouse,
    FaIndustry,
};
const ICON_NAMES = Object.keys(ICON_MAP);

const RenderIcon = ({ name, ...rest }) => {
    const Cmp = ICON_MAP[name] || FaPhoneAlt;
    return <Cmp {...rest} />;
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const DEFAULT_CONTENT = {
    banner: {
        headingTag: "h1",
        heading: "Let's Design Your Dream Space",
        headingColor: "#ffffff",
        eyebrow: "Get in Touch",
        description:
            "For inquiries regarding any interior design service or expert advice, our team is ready to help you bring your vision to life.",
        descriptionColor: "#ffffff",
        descriptionFontSize: 18,
        bgColorStart: "#0f172a",
        bgColorEnd: "#1e293b",
    },
    cards: [
        {
            id: uid(),
            icon: "FaPhoneAlt",
            title: "Call Us",
            rows: [
                { id: uid(), label: "General Inquiry", value: "+91 7070701373", link: "tel:7070701373" },
                { id: uid(), label: "Toll Free", value: "1800-1200-532", link: "tel:18001200532" },
            ],
        },
        {
            id: uid(),
            icon: "FaEnvelope",
            title: "Email Us",
            rows: [
                { id: uid(), label: "General Info", value: "info@hcinterior.in", link: "mailto:info@hcinterior.in" },
                { id: uid(), label: "Customer Care", value: "care@hcinterior.in", link: "mailto:care@hcinterior.in" },
            ],
        },
        {
            id: uid(),
            icon: "FaBuilding",
            title: "Corporate Office",
            rows: [{ id: uid(), label: "", value: "H-56, 1st Floor, Sector-63, Noida, Uttar Pradesh - 201301", link: "" }],
        },
        {
            id: uid(),
            icon: "FaTools",
            title: "Workshop",
            rows: [{ id: uid(), label: "", value: "Gata No - 336, Village - Upeda, Hapur, Uttar Pradesh 245201", link: "" }],
        },
    ],
    experienceCenters: {
        heading: "Experience Centers",
        icon: "FaStore",
        centers: [
            { id: uid(), heading: "Noida", address: "H101, LGF, Sector-63, Noida, Uttar Pradesh - 201301" },
            {
                id: uid(),
                heading: "Gurugram (DDC Arcade)",
                address: "1st Floor, Plot No 1 Main, Sector 48 Road, Badshahpur Sohna Rd, Haryana - 122018",
            },
            {
                id: uid(),
                heading: "Faridabad",
                address: "1st Floor, Plot No 24, near old Faridabad Metro Station, Sector 20A, Haryana - 121002",
            },
        ],
    },
    mapSection: {
        heading: "Explore us on Map",
        locations: [
            {
                id: uid(),
                type: "Corporate Office",
                address: "H-56, 1st Floor, Sector-63, Noida, Uttar Pradesh- 201301",
                mapSrc:
                    "https://www.google.com/maps?q=H-56,+1st+Floor,+Sector-63,+Noida,+Uttar+Pradesh-+201301&output=embed",
            },
            {
                id: uid(),
                type: "Experience Center",
                address: "H101, LGF, Sector-63, Noida, Uttar Pradesh- 201301",
                mapSrc:
                    "https://www.google.com/maps?q=H101,+LGF,+Sector-63,+Noida,+Uttar+Pradesh-+201301&output=embed",
            },
            {
                id: uid(),
                type: "Experience Center",
                address:
                    "DDC Arcade, 1st Floor, Plot No 1 Main, Sector 48 Road, Badshahpur Sohna Rd, Opposite Vipul Business Park, Gurugram, Haryana 122018",
                mapSrc: "https://www.google.com/maps?q=DDC+Arcade,+Badshahpur+Sohna+Rd,+Gurugram,+Haryana&output=embed",
            },
            {
                id: uid(),
                type: "Experience Center",
                address: "1st Floor, Plot No 24, near old Faridabad Metro Station, Sector 20A, Faridabad, Haryana 121002",
                mapSrc: "https://www.google.com/maps?q=Plot+No+24,+Sector+20A,+Faridabad,+Haryana&output=embed",
            },
            {
                id: uid(),
                type: "Workshop",
                address: "Gata No - 336, Village - Upeda, Hapur, Uttar Pradesh 245201",
                mapSrc: "https://www.google.com/maps?q=Upeda,+Hapur,+Uttar+Pradesh+245201&output=embed",
            },
        ],
    },
};

const EMPTY_CARD = { icon: "FaPhoneAlt", title: "", rows: [{ label: "", value: "", link: "" }] };
const EMPTY_CENTER = { heading: "", address: "" };
const EMPTY_MAP_LOC = { type: "", address: "", mapSrc: "" };

const CmsContactPage = () => {
    const authToken = useSelector((state) => state.auth.authToken);

    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [content, setContent] = useState(DEFAULT_CONTENT);

    // ---- Banner draft (kept separate so typing doesn't re-render everything) ----
    const [bannerDraft, setBannerDraft] = useState(DEFAULT_CONTENT.banner);

    // ---- Card modal state ----
    const [cardForm, setCardForm] = useState(EMPTY_CARD);
    const [cardIndex, setCardIndex] = useState(null);

    // ---- Experience center modal state ----
    const [centerForm, setCenterForm] = useState(EMPTY_CENTER);
    const [centerIndex, setCenterIndex] = useState(null);
    const [ecHeading, setEcHeading] = useState(DEFAULT_CONTENT.experienceCenters.heading);
    const [ecIcon, setEcIcon] = useState(DEFAULT_CONTENT.experienceCenters.icon);

    // ---- Map modal state ----
    const [mapLocForm, setMapLocForm] = useState(EMPTY_MAP_LOC);
    const [mapLocIndex, setMapLocIndex] = useState(null);
    const [mapHeading, setMapHeading] = useState(DEFAULT_CONTENT.mapSection.heading);

    // ----------------------------------------------------------------------
    // Fetch existing content
    // ----------------------------------------------------------------------
    const fetchContent = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`/cms-content/${PAGE_KEY}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (response.data) {
                const contentData = Array.isArray(response.data) ? response.data[0] : response.data;

                let parsed = contentData?.json_content;
                if (typeof parsed === "string") {
                    try {
                        parsed = JSON.parse(parsed);
                    } catch (e) {
                        parsed = null;
                    }
                }

                const merged = {
                    banner: { ...DEFAULT_CONTENT.banner, ...(parsed?.banner || {}) },
                    cards: Array.isArray(parsed?.cards) && parsed.cards.length ? parsed.cards : DEFAULT_CONTENT.cards,
                    experienceCenters: {
                        ...DEFAULT_CONTENT.experienceCenters,
                        ...(parsed?.experienceCenters || {}),
                        centers:
                            parsed?.experienceCenters?.centers && parsed.experienceCenters.centers.length
                                ? parsed.experienceCenters.centers
                                : DEFAULT_CONTENT.experienceCenters.centers,
                    },
                    mapSection: {
                        ...DEFAULT_CONTENT.mapSection,
                        ...(parsed?.mapSection || {}),
                        locations:
                            parsed?.mapSection?.locations && parsed.mapSection.locations.length
                                ? parsed.mapSection.locations
                                : DEFAULT_CONTENT.mapSection.locations,
                    },
                };

                setContent(merged);
                setBannerDraft(merged.banner);
                setEcHeading(merged.experienceCenters.heading);
                setEcIcon(merged.experienceCenters.icon);
                setMapHeading(merged.mapSection.heading);
                setSelectedId(contentData?.id || null);
            }
        } catch (err) {
            toast.error(err.message || "Failed to fetch contact page content.");
        } finally {
            setLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    // ----------------------------------------------------------------------
    // Persist helper - always sends the FULL content object so nothing is
    // ever lost, regardless of which section was edited.
    // ----------------------------------------------------------------------
    const persist = async (nextContent, successMsg) => {
        const formDataToSend = new FormData();
        formDataToSend.append("json_content", JSON.stringify(nextContent));

        try {
            if (selectedId) {
                await api.patch(`/cms-content/update-with-image/${selectedId}`, formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
                });
            } else {
                await api.post(`/cms-content/${PAGE_KEY}`, formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${authToken}` },
                });
            }
            setContent(nextContent);
            toast.success(successMsg || "Updated successfully.");
            fetchContent();
        } catch (error) {
            toast.error(error.message || "Something went wrong while saving.");
        }
    };

    // ----------------------------------------------------------------------
    // 1. BANNER
    // ----------------------------------------------------------------------
    const handleBannerChange = (e) => {
        const { name, value } = e.target;
        setBannerDraft((prev) => ({ ...prev, [name]: value }));
    };

    const handleBannerSubmit = (e) => {
        e.preventDefault();
        persist({ ...content, banner: bannerDraft }, "Banner updated successfully.");
    };

    // ----------------------------------------------------------------------
    // 2. CONTACT CARDS
    // ----------------------------------------------------------------------
    const openAddCard = () => {
        setCardForm({ icon: "FaPhoneAlt", title: "", rows: [{ label: "", value: "", link: "" }] });
        setCardIndex(content.cards.length);
    };

    const openEditCard = (card, index) => {
        setCardForm({
            icon: card.icon || "FaPhoneAlt",
            title: card.title || "",
            rows: card.rows && card.rows.length ? card.rows.map((r) => ({ ...r })) : [{ label: "", value: "", link: "" }],
        });
        setCardIndex(index);
    };

    const handleCardFieldChange = (e) => {
        const { name, value } = e.target;
        setCardForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCardRowChange = (rowIdx, field, value) => {
        setCardForm((prev) => {
            const rows = [...prev.rows];
            rows[rowIdx] = { ...rows[rowIdx], [field]: value };
            return { ...prev, rows };
        });
    };

    const addCardRow = () => {
        setCardForm((prev) => ({ ...prev, rows: [...prev.rows, { label: "", value: "", link: "" }] }));
    };

    const removeCardRow = (rowIdx) => {
        setCardForm((prev) => ({ ...prev, rows: prev.rows.filter((_, i) => i !== rowIdx) }));
    };

    const handleCardSubmit = (e) => {
        e.preventDefault();
        const updatedCards = [...content.cards];
        const cleanRows = cardForm.rows.filter((r) => (r.value || "").trim() !== "");
        const newCard = {
            id: updatedCards[cardIndex]?.id || uid(),
            icon: cardForm.icon,
            title: cardForm.title,
            rows: cleanRows.length ? cleanRows : [{ label: "", value: "", link: "" }],
        };
        updatedCards[cardIndex] = newCard;
        persist({ ...content, cards: updatedCards }, "Card saved successfully.");
        document.getElementById("closeCardModal")?.click();
    };

    const handleDeleteCard = (index) => {
        if (!window.confirm("Delete this card? This cannot be undone.")) return;
        const updatedCards = content.cards.filter((_, i) => i !== index);
        persist({ ...content, cards: updatedCards }, "Card deleted successfully.");
    };

    // ----------------------------------------------------------------------
    // 3. EXPERIENCE CENTERS
    // ----------------------------------------------------------------------
    const handleEcMetaSubmit = (e) => {
        e.preventDefault();
        persist(
            {
                ...content,
                experienceCenters: { ...content.experienceCenters, heading: ecHeading, icon: ecIcon },
            },
            "Experience Centers section updated."
        );
    };

    const openAddCenter = () => {
        setCenterForm({ heading: "", address: "" });
        setCenterIndex(content.experienceCenters.centers.length);
    };

    const openEditCenter = (center, index) => {
        setCenterForm({ heading: center.heading || "", address: center.address || "" });
        setCenterIndex(index);
    };

    const handleCenterFieldChange = (e) => {
        const { name, value } = e.target;
        setCenterForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCenterSubmit = (e) => {
        e.preventDefault();
        const updatedCenters = [...content.experienceCenters.centers];
        updatedCenters[centerIndex] = { id: updatedCenters[centerIndex]?.id || uid(), ...centerForm };
        persist(
            { ...content, experienceCenters: { ...content.experienceCenters, centers: updatedCenters } },
            "Experience center saved."
        );
        document.getElementById("closeCenterModal")?.click();
    };

    const handleDeleteCenter = (index) => {
        if (!window.confirm("Delete this experience center? This cannot be undone.")) return;
        const updatedCenters = content.experienceCenters.centers.filter((_, i) => i !== index);
        persist(
            { ...content, experienceCenters: { ...content.experienceCenters, centers: updatedCenters } },
            "Experience center deleted."
        );
    };

    // ----------------------------------------------------------------------
    // 4. MAP SECTION
    // ----------------------------------------------------------------------
    const handleMapMetaSubmit = (e) => {
        e.preventDefault();
        persist({ ...content, mapSection: { ...content.mapSection, heading: mapHeading } }, "Map section updated.");
    };

    const openAddMapLoc = () => {
        setMapLocForm({ type: "", address: "", mapSrc: "" });
        setMapLocIndex(content.mapSection.locations.length);
    };

    const openEditMapLoc = (loc, index) => {
        setMapLocForm({ type: loc.type || "", address: loc.address || "", mapSrc: loc.mapSrc || "" });
        setMapLocIndex(index);
    };

    const handleMapLocFieldChange = (e) => {
        const { name, value } = e.target;
        setMapLocForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleMapLocSubmit = (e) => {
        e.preventDefault();
        const updatedLocations = [...content.mapSection.locations];
        updatedLocations[mapLocIndex] = { id: updatedLocations[mapLocIndex]?.id || uid(), ...mapLocForm };
        persist({ ...content, mapSection: { ...content.mapSection, locations: updatedLocations } }, "Map location saved.");
        document.getElementById("closeMapModal")?.click();
    };

    const handleDeleteMapLoc = (index) => {
        if (!window.confirm("Delete this map location? This cannot be undone.")) return;
        const updatedLocations = content.mapSection.locations.filter((_, i) => i !== index);
        persist({ ...content, mapSection: { ...content.mapSection, locations: updatedLocations } }, "Map location deleted.");
    };

    const moveMapLoc = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= content.mapSection.locations.length) return;

    const updatedLocations = [...content.mapSection.locations];
    [updatedLocations[index], updatedLocations[newIndex]] = [updatedLocations[newIndex], updatedLocations[index]];

    persist({ ...content, mapSection: { ...content.mapSection, locations: updatedLocations } }, "Location order updated.");
};

    // ----------------------------------------------------------------------
    // RENDER
    // ----------------------------------------------------------------------
    return (
        <AuthMainLayout>
            <div className="container my-5">
                <h1 className="mb-4 text-center">Manage Contact Page</h1>

                {loading && <div className="text-center mb-4">Loading...</div>}

                {/* ================= 1. BANNER ================= */}
                <div className="card mb-5 shadow-sm">
                    <div className="card-header bg-dark text-white">
                        <h5 className="mb-0">Hero Banner</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleBannerSubmit}>
                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label className="form-label">Eyebrow Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="eyebrow"
                                        value={bannerDraft.eyebrow}
                                        onChange={handleBannerChange}
                                        placeholder="e.g. Get in Touch"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Heading Tag</label>
                                    <select
                                        className="form-select"
                                        name="headingTag"
                                        value={bannerDraft.headingTag}
                                        onChange={handleBannerChange}
                                    >
                                        {["h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => (
                                            <option key={tag} value={tag}>
                                                {tag.toUpperCase()}
                                            </option>
                                        ))}
                                    </select>
                                    <small className="text-muted">Controls which heading tag renders on the page.</small>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Heading Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="heading"
                                        value={bannerDraft.heading}
                                        onChange={handleBannerChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-8">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        rows="2"
                                        value={bannerDraft.description}
                                        onChange={handleBannerChange}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Description Font Size (px)</label>
                                    <input
                                        type="range"
                                        className="form-range"
                                        name="descriptionFontSize"
                                        min="10"
                                        max="30"
                                        value={bannerDraft.descriptionFontSize}
                                        onChange={handleBannerChange}
                                    />
                                    <div className="text-muted text-center fw-bold">
                                        {bannerDraft.descriptionFontSize || 18}px
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label className="form-label">Heading Color</label>
                                    <input
                                        type="color"
                                        className="form-control form-control-color w-100"
                                        name="headingColor"
                                        value={bannerDraft.headingColor}
                                        onChange={handleBannerChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Description Color</label>
                                    <input
                                        type="color"
                                        className="form-control form-control-color w-100"
                                        name="descriptionColor"
                                        value={bannerDraft.descriptionColor}
                                        onChange={handleBannerChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Background Color (Start)</label>
                                    <input
                                        type="color"
                                        className="form-control form-control-color w-100"
                                        name="bgColorStart"
                                        value={bannerDraft.bgColorStart}
                                        onChange={handleBannerChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Background Color (End)</label>
                                    <input
                                        type="color"
                                        className="form-control form-control-color w-100"
                                        name="bgColorEnd"
                                        value={bannerDraft.bgColorEnd}
                                        onChange={handleBannerChange}
                                    />
                                </div>
                            </div>

                            {/* Live preview */}
                            <div
                                className="rounded p-4 mb-3 text-center"
                                style={{
                                    background: `linear-gradient(135deg, ${bannerDraft.bgColorStart} 0%, ${bannerDraft.bgColorEnd} 100%)`,
                                }}
                            >
                                <span style={{ color: bannerDraft.headingColor, opacity: 0.85, fontWeight: 600 }}>
                                    {bannerDraft.eyebrow}
                                </span>
                                <div
                                    style={{
                                        color: bannerDraft.headingColor,
                                        fontWeight: 700,
                                        fontSize: "2rem",
                                        margin: "8px 0",
                                    }}
                                >
                                    {bannerDraft.heading}
                                </div>
                                <div
                                    style={{
                                        color: bannerDraft.descriptionColor,
                                        fontSize: `${bannerDraft.descriptionFontSize || 18}px`,
                                    }}
                                >
                                    {bannerDraft.description}
                                </div>
                            </div>

                            <button className="btn btn-primary" type="submit">
                                Update Banner
                            </button>
                        </form>
                    </div>
                </div>

                {/* ================= 2. INFO CARDS ================= */}
                <div className="card mb-5 shadow-sm">
                    <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Info Cards (Call Us, Email Us, Office, Workshop, ...)</h5>
                        <button
                            type="button"
                            className="btn btn-success btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#cardModal"
                            onClick={openAddCard}
                        >
                            + Add New Card
                        </button>
                    </div>
                    <div className="card-body table-responsive">
                        <table className="table table-striped table-bordered align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>SN</th>
                                    <th width="70">Icon</th>
                                    <th>Title</th>
                                    <th>Rows</th>
                                    <th width="160">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {content.cards.map((card, index) => (
                                    <tr key={card.id}>
                                        <td>{index + 1}</td>
                                        <td className="text-center fs-4 text-warning">
                                            <RenderIcon name={card.icon} />
                                        </td>
                                        <td>{card.title}</td>
                                        <td>
                                            {card.rows.map((r, i) => (
                                                <div key={i} className="small">
                                                    {r.label ? <b>{r.label}: </b> : null}
                                                    {r.value}
                                                    {r.link ? ` (${r.link})` : ""}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary me-2"
                                                data-bs-toggle="modal"
                                                data-bs-target="#cardModal"
                                                onClick={() => openEditCard(card, index)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDeleteCard(index)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ================= 3. EXPERIENCE CENTERS ================= */}
                <div className="card mb-5 shadow-sm">
                    <div className="card-header bg-dark text-white">
                        <h5 className="mb-0">Experience Centers</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleEcMetaSubmit} className="row g-3 align-items-end mb-4">
                            <div className="col-md-4">
                                <label className="form-label">Section Heading</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={ecHeading}
                                    onChange={(e) => setEcHeading(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Section Icon</label>
                                <select className="form-select" value={ecIcon} onChange={(e) => setEcIcon(e.target.value)}>
                                    {ICON_NAMES.map((name) => (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2 fs-3 text-warning">
                                <RenderIcon name={ecIcon} />
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-primary w-100" type="submit">
                                    Save Heading
                                </button>
                            </div>
                        </form>

                        <div className="d-flex justify-content-end mb-2">
                            <button
                                type="button"
                                className="btn btn-success btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#centerModal"
                                onClick={openAddCenter}
                            >
                                + Add New Center
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-striped table-bordered align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>SN</th>
                                        <th>Heading</th>
                                        <th>Address</th>
                                        <th width="160">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {content.experienceCenters.centers.map((center, index) => (
                                        <tr key={center.id}>
                                            <td>{index + 1}</td>
                                            <td>{center.heading}</td>
                                            <td>{center.address}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#centerModal"
                                                    onClick={() => openEditCenter(center, index)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteCenter(index)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ================= 4. MAP SECTION ================= */}
                <div className="card mb-5 shadow-sm">
                    <div className="card-header bg-dark text-white">
                        <h5 className="mb-0">Explore Us On Map</h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleMapMetaSubmit} className="row g-3 align-items-end mb-4">
                            <div className="col-md-8">
                                <label className="form-label">Section Heading</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={mapHeading}
                                    onChange={(e) => setMapHeading(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4">
                                <button className="btn btn-primary w-100" type="submit">
                                    Save Heading
                                </button>
                            </div>
                        </form>

                        <div className="d-flex justify-content-end mb-2">
                            <button
                                type="button"
                                className="btn btn-success btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#mapModal"
                                onClick={openAddMapLoc}
                            >
                                + Add New Location
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-striped table-bordered align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>SN</th>
                                        <th>Type / Group</th>
                                        <th>Address</th>
                                        <th>Google Maps Embed URL</th>
                                        <th width="160">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {content.mapSection.locations.map((loc, index) => (
                                        <tr key={loc.id}>
                                            <td>{index + 1}</td>
                                            <td>{loc.type}</td>
                                            <td>{loc.address}</td>
                                            <td className="text-truncate" style={{ maxWidth: 260 }}>
                                                {loc.mapSrc}
                                            </td>
                                            <td>
    <button
        type="button"
        className="btn btn-sm btn-outline-secondary me-1"
        onClick={() => moveMapLoc(index, -1)}
        disabled={index === 0}
        title="Move up"
    >
        ↑
    </button>
    <button
        type="button"
        className="btn btn-sm btn-outline-secondary me-2"
        onClick={() => moveMapLoc(index, 1)}
        disabled={index === content.mapSection.locations.length - 1}
        title="Move down"
    >
        ↓
    </button>
    <button
        type="button"
        className="btn btn-sm btn-outline-primary me-2"
        data-bs-toggle="modal"
        data-bs-target="#mapModal"
        onClick={() => openEditMapLoc(loc, index)}
    >
        Edit
    </button>
    <button
        type="button"
        className="btn btn-sm btn-outline-danger"
        onClick={() => handleDeleteMapLoc(index)}
    >
        Delete
    </button>
</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* <div className="alert alert-info">
                    <b>Note:</b> The &ldquo;Send a Message&rdquo; contact form keeps its original place on the page and is
                    not managed from this CMS panel.
                </div> */}
            </div>

            {/* ============================================================
                MODAL: Add / Edit Card
            ============================================================ */}
            <div className="modal fade" id="cardModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Card Details</h5>
                            <button type="button" className="btn-close" id="closeCardModal" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleCardSubmit}>
                            <div className="modal-body row g-3">
                                <div className="col-md-4">
                                    <label className="form-label">Icon</label>
                                    <select className="form-select" name="icon" value={cardForm.icon} onChange={handleCardFieldChange}>
                                        {ICON_NAMES.map((name) => (
                                            <option key={name} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-2 fs-3 text-warning d-flex align-items-end">
                                    <RenderIcon name={cardForm.icon} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Card Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={cardForm.title}
                                        onChange={handleCardFieldChange}
                                        required
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label d-flex justify-content-between align-items-center">
                                        <span>
                                            Rows (leave &ldquo;Label&rdquo; blank for a plain paragraph, like Corporate
                                            Office / Workshop)
                                        </span>
                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={addCardRow}>
                                            + Add Row
                                        </button>
                                    </label>

                                    {cardForm.rows.map((row, idx) => (
                                        <div className="row g-2 mb-2 align-items-center" key={idx}>
                                            <div className="col-md-3">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Label (optional)"
                                                    value={row.label}
                                                    onChange={(e) => handleCardRowChange(idx, "label", e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Value (e.g. +91 7070701373 or address)"
                                                    value={row.value}
                                                    onChange={(e) => handleCardRowChange(idx, "value", e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Link (optional, e.g. tel:... or mailto:...)"
                                                    value={row.link}
                                                    onChange={(e) => handleCardRowChange(idx, "link", e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => removeCardRow(idx)}
                                                    disabled={cardForm.rows.length === 1}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" type="submit">
                                    Save Card
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* ============================================================
                MODAL: Add / Edit Experience Center
            ============================================================ */}
            <div className="modal fade" id="centerModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Experience Center Details</h5>
                            <button type="button" className="btn-close" id="closeCenterModal" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleCenterSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Heading (e.g. Noida)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="heading"
                                        value={centerForm.heading}
                                        onChange={handleCenterFieldChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Address</label>
                                    <textarea
                                        className="form-control"
                                        name="address"
                                        rows="3"
                                        value={centerForm.address}
                                        onChange={handleCenterFieldChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" type="submit">
                                    Save Center
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* ============================================================
                MODAL: Add / Edit Map Location
            ============================================================ */}
            <div className="modal fade" id="mapModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Map Location Details</h5>
                            <button type="button" className="btn-close" id="closeMapModal" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleMapLocSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Type / Group Heading</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="type"
                                        placeholder="e.g. Corporate Office / Experience Center / Workshop"
                                        value={mapLocForm.type}
                                        onChange={handleMapLocFieldChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Address</label>
                                    <textarea
                                        className="form-control"
                                        name="address"
                                        rows="2"
                                        value={mapLocForm.address}
                                        onChange={handleMapLocFieldChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Google Maps Embed URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="mapSrc"
                                        placeholder="https://www.google.com/maps?q=...&output=embed"
                                        value={mapLocForm.mapSrc}
                                        onChange={handleMapLocFieldChange}
                                        required
                                    />
                                    <small className="text-muted">
                                        Use a Google Maps share/embed URL ending in <code>&amp;output=embed</code>.
                                    </small>
                                </div>
                                {mapLocForm.mapSrc && (
                                    <div className="rounded overflow-hidden border" style={{ height: 220 }}>
                                        <iframe
                                            src={mapLocForm.mapSrc}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Map preview"
                                        ></iframe>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" type="submit">
                                    Save Location
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthMainLayout>
    );
};

export default CmsContactPage;
