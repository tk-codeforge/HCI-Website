// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { useSelector } from "react-redux";
// import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
// import api from "@/utils/api";
// import { toast } from "react-toastify";

// const CmsCancellationPolicy = () => {

//     const authToken = useSelector((state) => state.auth.authToken);
//     const [loading, setLoading] = useState(false);
//     const [pagesList, setPagesList] = useState([]);
//     const [formData, setFormData] = useState({
//         phase: "",
//         time_period: "",
//         eligibility: "",
//     });
//     const [selectedId, setSelectedId] = useState(null);

//     const fetchContentManagerPages = useCallback(async () => {
//         try {
//             const response = await api.get("/cms-content/cancellation_policy", {
//                 headers: {
//                     Authorization: `Bearer ${authToken}`, // Send auth token
//                 },
//             });
//             if (response.data && response.data) {
//                 setPagesList(response.data)
//             }
//             setLoading(false);

//         } catch (err) {
//             toast.error(err.message ?? "Failed to fetch data. Please try again.");
//             setLoading(false);
//         }
//     }, [authToken]);

//     useEffect(() => {
//         fetchContentManagerPages();
//     }, [fetchContentManagerPages]);

//     // Handle input change for text fields and image
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({ ...prevData, [name]: value }));
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const formDataToSend = new FormData();
//         formDataToSend.append("json_content[phase]", formData.phase);
//         formDataToSend.append("json_content[time_period]", formData.time_period);
//         formDataToSend.append("json_content[eligibility]", formData.eligibility);

//         try {
//             // Send POST request to save form data
//             const response = await api.patch(`/cms-content/${selectedId}`, formDataToSend, {
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${authToken}`, // Send auth token
//                 },
//             });

//             // Handle success response
//             if (response.status === 200) {
//                 fetchContentManagerPages();
//                 toast.success("Form submitted successfully.");
//                 document.getElementById('addNewpageModalClose').click();
                
//                 setFormData({
//                     phase: "",
//                     time_period: "",
//                     eligibility: ""
//                 });

//             } else {
//                 toast.error("Error submitting form. Please try again.");
//             }
//         } catch (error) {
//             toast.error(error.message ?? "Error submitting form. Please try again.");
//             console.error("Error:", error);
//         }
//     };

//     const handleEditClick = (item) => {
//         setSelectedId(item.id);
//         setFormData({
//             phase: item.json_content?.phase,
//             time_period: item.json_content?.time_period,
//             eligibility: item.json_content?.eligibility
//         });
//     };

//     return (
//         <AuthMainLayout>
//             <div className="container my-5">
//                 <h1 className="mb-4 text-center">CMS - Cancellation Policy</h1>
//                 {loading ? (
//                     <div className="text-center">Loading...</div>
//                 ) : (
//                     <>
//                         <div className="table-responsive">
//                             <table
//                                 id="usersTable"
//                                 className="table display table-striped table-bordered"
//                                 style={{ width: "100%" }}
//                             >
//                                 <thead>
//                                     <tr>
//                                         <th>SN</th>
//                                         <th>Phase</th>
//                                         <th>Time Period</th>
//                                         <th>Eligibility</th>
//                                         <th>Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {pagesList && pagesList?.map((item, index) => (
//                                         <tr key={index}>
//                                             <td>{index + 1}</td>
//                                             <td>{item.json_content?.phase}</td>
//                                             <td>{item.json_content?.time_period}</td>
//                                             <td>{item.json_content?.eligibility}</td>
//                                             <td>
//                                                 <button onClick={() => handleEditClick(item)} type="button" className="read_morebtn" data-bs-toggle="modal" data-bs-target="#addNewpageModal">
//                                                     Edit
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </>
//                 )}
//             </div>

//             <div className="modal fade" id="addNewpageModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h1 className="modal-title fs-5" id="exampleModalLabel">Edit</h1>
//                             <button type="button" id="addNewpageModalClose" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <form onSubmit={handleSubmit}>
//                             <div className="modal-body row">

//                                 <div className="mb-3 col-md-12">
//                                     <label htmlFor="phase" className="form-label">Phase</label>
//                                     <input
//                                         type="text"
//                                         className="form-control"
//                                         name="phase"
//                                         placeholder="Phase"
//                                         value={formData.phase}
//                                         onChange={handleInputChange}
//                                         required
//                                     />
//                                 </div>
//                                 <div className="mb-3 col-md-12">
//                                     <label htmlFor="time_period" className="form-label">Time Period</label>
//                                     <textarea
//                                         className="form-control"
//                                         name="time_period"
//                                         placeholder="Time Period"
//                                         rows="3"
//                                         value={formData.time_period}
//                                         onChange={handleInputChange}
//                                     ></textarea>
//                                 </div>

//                                 <div className="mb-3 col-md-12">
//                                     <label htmlFor="eligibility" className="form-label">Eligibility</label>
//                                     <textarea
//                                         className="form-control"
//                                         name="eligibility"
//                                         placeholder="Eligibility"
//                                         rows="3"
//                                         value={formData.eligibility}
//                                         onChange={handleInputChange}
//                                     ></textarea>
//                                 </div>

//                                 <div className="m-auto mt-2 col-12 d-flex justify-content-center">
//                                     <button className="px-5 read_morebtn" type="submit">
//                                         Save Changes
//                                     </button>
//                                 </div>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>


//         </AuthMainLayout>
//     );
// };

// export default CmsCancellationPolicy;

"use client";
import React, { useState, useEffect, useCallback} from "react";
import { useSelector } from "react-redux";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";
import api from "@/utils/api";
import { toast } from "react-toastify";

import dynamic from "next/dynamic";
const CKEditorComponent = dynamic(() => import("../../components/CKEditorComponent"), { ssr: false });

const CMS_KEY = "cancellation_policy";
const HEADING_TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 30;

const emptyHeading = {
    heading_text: "",
    heading_tag: "h2",
    subheading_text: "",
    subheading_tag: "h3",
    description_text: "",
    description_font_size: 16,
};


const makeEmptyCard = (order) => ({
    _localId: `new-card-${Date.now()}-${Math.random()}`,
    id: null,
    bodyHtml: "",
    order,
});


const getInitialBodyHtml = (jsonContent) => {
    if (typeof jsonContent?.bodyHtml === "string") return jsonContent.bodyHtml;

    if (Array.isArray(jsonContent?.blocks) && jsonContent.blocks.length > 0) {
        let html = "";
        let bulletBuffer = [];
        const flush = () => {
            if (bulletBuffer.length > 0) {
                html += `<ul>${bulletBuffer.map((t) => `<li>${t}</li>`).join("")}</ul>`;
                bulletBuffer = [];
            }
        };
        jsonContent.blocks.forEach((b) => {
            if (b.type === "bullet") {
                bulletBuffer.push(b.text || "");
            } else {
                flush();
                if (b.text) html += `<p>${b.text}</p>`;
            }
        });
        flush();
        return html;
    }

    let html = "";
    if (jsonContent?.body) html += `<p>${jsonContent.body}</p>`;
    if (Array.isArray(jsonContent?.bullets) && jsonContent.bullets.length > 0) {
        html += `<ul>${jsonContent.bullets.map((t) => `<li>${t}</li>`).join("")}</ul>`;
    }
    return html;
};

const emptyFooterNote = {
    line1: "",
    line2: "",
};

const CmsCancellationPolicy = () => {
    const authToken = useSelector((state) => state.auth.authToken);
    const authHeaders = { Authorization: `Bearer ${authToken}` };

    const [loading, setLoading] = useState(true);

    // Section 1: heading / sub heading / description
    const [headingId, setHeadingId] = useState(null);
    const [heading, setHeading] = useState(emptyHeading);
    const [headingSaving, setHeadingSaving] = useState(false);

    // Section 3: example cards
    const [cards, setCards] = useState([]);
    const [cardSavingId, setCardSavingId] = useState(null);
    const [cardDeletingId, setCardDeletingId] = useState(null);

    // Section 4: closing / footer note (shared across all cards)
    const [footerNoteId, setFooterNoteId] = useState(null);
    const [footerNote, setFooterNote] = useState(emptyFooterNote);
    const [footerNoteSaving, setFooterNoteSaving] = useState(false);

    const [tableId, setTableId] = useState(null);
const [tableHtml, setTableHtml] = useState("");
const [tableSaving, setTableSaving] = useState(false);

    const fetchContentManagerPages = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get(`/cms-content/${CMS_KEY}`, {
                headers: authHeaders,
            });
            const list = Array.isArray(response.data) ? response.data : [];

            const headingRecord = list.find((item) => item.json_content?.section === "heading");
            if (headingRecord) {
                setHeadingId(headingRecord.id);
                setHeading({
                    heading_text: headingRecord.json_content?.heading_text || "",
                    heading_tag: headingRecord.json_content?.heading_tag || "h2",
                    subheading_text: headingRecord.json_content?.subheading_text || "",
                    subheading_tag: headingRecord.json_content?.subheading_tag || "h3",
                    description_text: headingRecord.json_content?.description_text || "",
                    description_font_size: headingRecord.json_content?.description_font_size || 16,
                });
            } else {
                setHeadingId(null);
                setHeading(emptyHeading);
            }


            const tableRecord = list.find((item) => item.json_content?.section === "table");
if (tableRecord) {
    setTableId(tableRecord.id);
    setTableHtml(tableRecord.json_content?.tableHtml || "");
} else {
    setTableId(null);
    setTableHtml(buildTableHtmlFromLegacyRows(list));
}

                        const cardRecords = list
    .filter((item) => item.json_content?.section === "card")
    .sort((a, b) => (a.json_content?.order ?? 0) - (b.json_content?.order ?? 0))
    .map((item) => ({
        _localId: `card-${item.id}`,
        id: item.id,
        bodyHtml: getInitialBodyHtml(item.json_content),
        order: item.json_content?.order ?? 0,
    }));
            setCards(cardRecords);

            const footerNoteRecord = list.find((item) => item.json_content?.section === "footer_note");
            if (footerNoteRecord) {
                setFooterNoteId(footerNoteRecord.id);
                setFooterNote({
                    line1: footerNoteRecord.json_content?.line1 || "",
                    line2: footerNoteRecord.json_content?.line2 || "",
                });
            } else {
                setFooterNoteId(null);
                setFooterNote(emptyFooterNote);
            }
        } catch (err) {
            toast.error(err.message ?? "Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authToken]);

    useEffect(() => {
        fetchContentManagerPages();
    }, [fetchContentManagerPages]);

    const handleSaveTable = async () => {
    setTableSaving(true);
    const sectionData = { section: "table", tableHtml };
    try {
        let response;
        if (tableId) {
            response = await api.patch(`/cms-content/${tableId}`, { json_content: sectionData }, { headers: authHeaders });
        } else {
            response = await api.post(`/cms-content/${CMS_KEY}`, sectionData, { headers: authHeaders });
            if (response.data?.id) setTableId(response.data.id);
        }
        if (response.status === 200 || response.status === 201) {
            toast.success("Table saved.");
        } else {
            toast.error("Error saving table. Please try again.");
        }
    } catch (err) {
        toast.error(err.message ?? "Error saving table. Please try again.");
    } finally {
        setTableSaving(false);
    }
};

    const buildTableHtmlFromLegacyRows = (list) => {
    const rowRecords = list
        .filter((item) => item.json_content?.section === "table_row")
        .sort((a, b) => (a.json_content?.order ?? 0) - (b.json_content?.order ?? 0));
    if (rowRecords.length === 0) return "";

    const bodyRows = rowRecords
        .map(({ json_content: r }) => {
            if (r.row_type === "section_header") {
                return `<tr><td colspan="3" style="text-align:center;font-weight:bold;background-color:#e9ecef;">${r.scenario || ""}</td></tr>`;
            }
            return `<tr><td><strong>${r.scenario || ""}</strong></td><td>${r.condition || ""}</td><td>${r.charges || ""}</td></tr>`;
        })
        .join("");

    return `<figure class="table"><table><thead><tr><th>Scenario</th><th>Condition</th><th>Applicable charges</th></tr></thead><tbody>${bodyRows}</tbody></table></figure>`;
};

    // ---------------- HEADING / SUBHEADING / DESCRIPTION ----------------
    const handleHeadingChange = (e) => {
        const { name, value } = e.target;
        setHeading((prev) => ({ ...prev, [name]: value }));
    };

        const handleSaveHeading = async () => {
        setHeadingSaving(true);
        const sectionData = { section: "heading", ...heading };
        try {
            let response;
            if (headingId) {
                response = await api.patch(`/cms-content/${headingId}`, { json_content: sectionData }, { headers: authHeaders });
            } else {
                response = await api.post(`/cms-content/${CMS_KEY}`, sectionData, { headers: authHeaders });
                if (response.data?.id) setHeadingId(response.data.id);
            }
            if (response.status === 200 || response.status === 201) {
                toast.success("Heading section saved.");
            } else {
                toast.error("Error saving heading section. Please try again.");
            }
        } catch (err) {
            toast.error(err.message ?? "Error saving heading section. Please try again.");
        } finally {
            setHeadingSaving(false);
        }
    };

    const handleAddCard = () => {
        setCards((prev) => [...prev, makeEmptyCard(prev.length)]);
    };


const handleCardBodyChange = (cardLocalId, html) => {
    setCards((prev) =>
        prev.map((c) => (c._localId === cardLocalId ? { ...c, bodyHtml: html } : c))
    );
};


        const handleSaveCard = async (card) => {
        setCardSavingId(card._localId);
                                                const sectionData = {
            section: "card",
            bodyHtml: card.bodyHtml,
            order: card.order,
        };
        try {
            let response;
            if (card.id) {
                response = await api.patch(`/cms-content/${card.id}`, { json_content: sectionData }, { headers: authHeaders });
            } else {
                response = await api.post(`/cms-content/${CMS_KEY}`, sectionData, { headers: authHeaders });
                if (response.data?.id) {
                    setCards((prev) =>
                        prev.map((c) => (c._localId === card._localId ? { ...c, id: response.data.id } : c))
                    );
                }
            }
            if (response.status === 200 || response.status === 201) {
                toast.success("Card saved.");
            } else {
                toast.error("Error saving card. Please try again.");
            }
        } catch (err) {
            toast.error(err.message ?? "Error saving card. Please try again.");
        } finally {
            setCardSavingId(null);
        }
    };

    const handleDeleteCard = async (card) => {
        if (!window.confirm("Delete this card?")) return;
        if (!card.id) {
            setCards((prev) => prev.filter((c) => c._localId !== card._localId));
            return;
        }
        setCardDeletingId(card._localId);
        try {
            const response = await api.delete(`/cms-content/${card.id}`, { headers: authHeaders });
            if (response.status === 200 || response.status === 204) {
                setCards((prev) => prev.filter((c) => c._localId !== card._localId));
                toast.success("Card deleted.");
            } else {
                toast.error("Error deleting card. Please try again.");
            }
        } catch (err) {
            toast.error(err.message ?? "Error deleting card. Please try again.");
        } finally {
            setCardDeletingId(null);
        }
    };

    // ---------------- CLOSING / FOOTER NOTE ----------------
    const handleFooterNoteChange = (e) => {
        const { name, value } = e.target;
        setFooterNote((prev) => ({ ...prev, [name]: value }));
    };

        const handleSaveFooterNote = async () => {
        setFooterNoteSaving(true);
        const sectionData = { section: "footer_note", ...footerNote };
        try {
            let response;
            if (footerNoteId) {
                response = await api.patch(`/cms-content/${footerNoteId}`, { json_content: sectionData }, { headers: authHeaders });
            } else {
                response = await api.post(`/cms-content/${CMS_KEY}`, sectionData, { headers: authHeaders });
                if (response.data?.id) setFooterNoteId(response.data.id);
            }
            if (response.status === 200 || response.status === 201) {
                toast.success("Closing note saved.");
            } else {
                toast.error("Error saving closing note. Please try again.");
            }
        } catch (err) {
            toast.error(err.message ?? "Error saving closing note. Please try again.");
        } finally {
            setFooterNoteSaving(false);
        }
    };

    return (
        <AuthMainLayout>
            <div className="container my-5">
                <h1 className="mb-4 text-center">CMS - Cancellation Policy</h1>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <>
                        {/* SECTION 1: Heading / Sub Heading / Description */}
                        <div className="card mb-5 shadow-sm">
                            <div className="card-header fw-bold">Heading, Sub Heading &amp; Description</div>
                            <div className="card-body row g-3">
                                <div className="col-md-8">
                                    <label className="form-label">Heading Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="heading_text"
                                        value={heading.heading_text}
                                        onChange={handleHeadingChange}
                                        placeholder="e.g. High Creation Interior"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Heading Tag</label>
                                    <select
                                        className="form-select"
                                        name="heading_tag"
                                        value={heading.heading_tag}
                                        onChange={handleHeadingChange}
                                    >
                                        {HEADING_TAGS.map((tag) => (
                                            <option key={tag} value={tag}>{tag.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-8">
                                    <label className="form-label">Sub Heading Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="subheading_text"
                                        value={heading.subheading_text}
                                        onChange={handleHeadingChange}
                                        placeholder="e.g. Our Cancellation & Refund Terms"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Sub Heading Tag</label>
                                    <select
                                        className="form-select"
                                        name="subheading_tag"
                                        value={heading.subheading_tag}
                                        onChange={handleHeadingChange}
                                    >
                                        {HEADING_TAGS.map((tag) => (
                                            <option key={tag} value={tag}>{tag.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-9">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        name="description_text"
                                        rows="3"
                                        value={heading.description_text}
                                        onChange={handleHeadingChange}
                                        placeholder="Lead paragraph shown under the sub heading"
                                    ></textarea>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">
                                        Description Font Size ({heading.description_font_size}px)
                                    </label>
                                    <input
                                        type="range"
                                        className="form-range"
                                        name="description_font_size"
                                        min={MIN_FONT_SIZE}
                                        max={MAX_FONT_SIZE}
                                        value={heading.description_font_size}
                                        onChange={handleHeadingChange}
                                    />
                                    <input
                                        type="number"
                                        className="form-control mt-2"
                                        name="description_font_size"
                                        min={MIN_FONT_SIZE}
                                        max={MAX_FONT_SIZE}
                                        value={heading.description_font_size}
                                        onChange={handleHeadingChange}
                                    />
                                </div>

                                <div className="col-12 border-top pt-3 mt-2">
                                    <p className="text-muted small mb-1">Preview:</p>
                                    {React.createElement(
                                        heading.heading_tag,
                                        { className: "fw-bold mb-2" },
                                        heading.heading_text || "Heading preview"
                                    )}
                                    {React.createElement(
                                        heading.subheading_tag,
                                        { className: "mb-2", style: { color: "#ff914d" } },
                                        heading.subheading_text || "Sub heading preview"
                                    )}
                                    <p
                                        className="text-muted mb-0"
                                        style={{ fontSize: `${heading.description_font_size}px` }}
                                    >
                                        {heading.description_text || "Description preview text."}
                                    </p>
                                </div>

                                <div className="col-12 d-flex justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-success px-4"
                                        onClick={handleSaveHeading}
                                        disabled={headingSaving}
                                    >
                                        {headingSaving ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card mb-5 shadow-sm">
    <div className="card-header fw-bold">Policy Table</div>
    <div className="card-body">
        <div className="mb-2 border rounded">
            <CKEditorComponent
                pageData={tableHtml}
                setPageData={setTableHtml}
            />
        </div>
        <div className="d-flex justify-content-end mt-2">
            <button
                type="button"
                className="btn btn-success px-4"
                onClick={handleSaveTable}
                disabled={tableSaving}
            >
                {tableSaving ? "Saving..." : "Save Table"}
            </button>
        </div>
    </div>
</div>

                        {/* SECTION 3: Example Cards */}
                        <div className="card mb-5 shadow-sm">
                            <div className="card-header fw-bold d-flex justify-content-between align-items-center">
                                <span>Example Cards</span>
                                <button type="button" className="btn btn-sm btn-primary" onClick={handleAddCard}>
                                    + Add Card
                                </button>
                            </div>
                            <div className="card-body row g-4">
                                {cards.map((card) => (
                                    <div className="col-md-4" key={card._localId}>
                                        <div className="p-3 border rounded bg-light h-100 d-flex flex-column">

                                            <label className="form-label small fw-bold mb-1">Content</label>
                                            <div className="mb-2 border rounded">
                                                <CKEditorComponent
                                                    pageData={card.bodyHtml}
                                                    setPageData={(html) => handleCardBodyChange(card._localId, html)}
                                                />
                                            </div>

                                            <div className="mt-auto d-flex gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-success flex-fill"
                                                    onClick={() => handleSaveCard(card)}
                                                    disabled={cardSavingId === card._localId}
                                                >
                                                    {cardSavingId === card._localId ? "Saving..." : "Save"}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger flex-fill"
                                                    onClick={() => handleDeleteCard(card)}
                                                    disabled={cardDeletingId === card._localId}
                                                >
                                                    {cardDeletingId === card._localId ? "Deleting..." : "Delete"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {cards.length === 0 && (
                                    <div className="col-12 text-center text-muted">
                                        {`No cards yet. Click "+ Add Card" to create one.`}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SECTION 4: Closing Note (shared, shown once below all cards) */}
                        <div className="card mb-5 shadow-sm">
                            <div className="card-header fw-bold">Closing Note</div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Line 1 (normal text)</label>
                                    <textarea
                                        className="form-control"
                                        name="line1"
                                        rows="2"
                                        value={footerNote.line1}
                                        onChange={handleFooterNoteChange}
                                        placeholder="e.g. All charges are applicable due to resource allocation, design efforts, and operational planning already undertaken by the company."
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Line 2 (highlighted text)</label>
                                    <textarea
                                        className="form-control"
                                        name="line2"
                                        rows="2"
                                        value={footerNote.line2}
                                        onChange={handleFooterNoteChange}
                                        placeholder="e.g. Discount is not applicable in any type of either partial or full cancellation"
                                    />
                                </div>

                                <div className="border-top pt-3 mb-3">
                                    <p className="text-muted small mb-1">Preview:</p>
                                    <div className="alert alert-warning border-warning mb-0" role="alert">
                                        <p className="mb-1">{footerNote.line1 || "Line 1 preview text."}</p>
                                        <p className="mb-0 fw-bold text-danger">{footerNote.line2 || "Line 2 preview text."}</p>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-success px-4"
                                        onClick={handleSaveFooterNote}
                                        disabled={footerNoteSaving}
                                    >
                                        {footerNoteSaving ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AuthMainLayout>
    );
};

export default CmsCancellationPolicy;
