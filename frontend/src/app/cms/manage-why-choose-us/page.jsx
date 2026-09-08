// "use client";

// import React, { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import api from "@/utils/api";
// import AuthMainLayout from "../../layouts/auth/AuthMainLayout"; 
// import { FaTrash, FaPlus, FaSave } from "react-icons/fa";

// // 🌟 Pre-defined list of icons matching your theme
// const AVAILABLE_ICONS = [
//   "FaShieldAlt", "FaClock", "FaCheckCircle", "FaHome", 
//   "FaMapMarkerAlt", "FaGem", "FaUser", "FaTools", 
//   "FaStar", "FaAward", "FaTrophy"
// ];

// export default function ManageWhyChooseUs() {
//   const [contentId, setContentId] = useState(null);
//   const [cards, setCards] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [heading, setHeading] = useState("Why Choose us");
//   const [headingColor, setHeadingColor] = useState("#222222");

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/cms-content/home_page_content_why_choose_us");

//       const record = Array.isArray(res.data) ? res.data[0] : res.data;

//       if (!record || !record.json_content) {
//         setContentId(null);
//         setCards([]);
//         return;
//       }

//       setContentId(record.id);

//       let json = record.json_content;
//       if (typeof json === "string") {
//         try { json = JSON.parse(json); } catch { json = {}; }
//       }

//       if (Array.isArray(json)) {
//         setCards(json);
//         setHeading("Why Choose us");
//         setHeadingColor("#222222");
//       } else {
//         setCards(Array.isArray(json.cards) ? json.cards : []);
//         setHeading(json.heading || "Why Choose us");
//         setHeadingColor(json.headingColor || "#222222");
//       }
//     } catch (error) {
//       setCards([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInitializeData = async () => {
//     try {
//       setLoading(true);
//       const defaultCards = [
//         { title: "Lifetime Warranty¹", description: "India's only full-home coverage guarantee.", icon: "FaShieldAlt" },
//         { title: "45-day move-in*²", description: "Swift, on-time installation.", icon: "FaClock" },
//         { title: "150+ quality checks", description: "Rigorous quality assurance.", icon: "FaCheckCircle" },
//         { title: "1,00,00+ happy homes", description: "Trusted by thousands.", icon: "FaHome" }
//       ];

//       const res = await api.post("/cms-content/home_page_content_why_choose_us", {
//         heading,
//         headingColor,
//         cards: defaultCards
//       });

//       if (res.status === 200 || res.status === 201) {
//         toast.success("Section initialized successfully!");
//         fetchData();
//       }
//     } catch (error) {
//       toast.error("Failed to initialize section.");
//       setLoading(false);
//     }
//   };

//   // --- DYNAMIC LIST CONTROLS ---
//   const handleAddCard = () => {
//     setCards([...cards, { title: "", description: "", icon: "FaCheckCircle" }]);
//   };

//   const handleRemoveCard = (index) => {
//     const updatedCards = cards.filter((_, i) => i !== index);
//     setCards(updatedCards);
//   };

//   const handleChange = (index, field, value) => {
//     const updatedCards = [...cards];
//     updatedCards[index][field] = value;
//     setCards(updatedCards);
//   };

//   // --- BULK SAVE TO BACKEND ---
//   const handleSaveAll = async () => {
//     if (!contentId) {
//       toast.error("Content ID missing. Initialize data first.");
//       return;
//     }
//     try {
//       setSaving(true);
//       // We use the standard PATCH endpoint to replace the whole JSON blob at once
//       const res = await api.patch(`/cms-content/${contentId}`, {
//         json_content: { heading,headingColor, cards }
//       });

//       if (res.status === 200 || res.status === 201) {
//         toast.success("All Why Choose Us cards saved successfully!");
//       }
//     } catch (error) {
//       toast.error("Failed to save changes.");
//       console.error(error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <AuthMainLayout>
//         <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
//           <div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div>
//         </div>
//       </AuthMainLayout>
//     );
//   }

//   return (
//     <AuthMainLayout>
//       <div className="container py-5">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h2 className="fw-bold text-dark">Manage {heading}</h2>
          
//           {cards.length > 0 && (
//             <button onClick={handleSaveAll} disabled={saving} className="btn btn-success fw-bold px-4">
//               {saving ? "Saving..." : <><FaSave className="me-2"/> Save All Changes</>}
//             </button>
//           )}
//         </div>

//         {(!cards || cards.length === 0) ? (
//           <div className="text-center p-5 bg-white rounded-4 shadow-sm border">
//             <h4 className="fw-bold mb-3">No Data Found</h4>
//             <p className="text-muted mb-4">Initialize the default cards to start editing.</p>
//             <button onClick={handleInitializeData} className="btn btn-warning fw-bold text-white px-4 py-2 rounded-3">
//               Initialize Section
//             </button>
//           </div>
//         ) : (
//           <>
//             <div className="row g-4">

//               <div className="card shadow-sm border-0 mb-4">
//   <div className="card-body">
//     <label className="form-label fw-bold">
//       Section Heading
//     </label>

//     <input
//       type="text"
//       className="form-control"
//       value={heading}
//       onChange={(e) => setHeading(e.target.value)}
//       placeholder="Enter section heading"
//       style={{ borderRadius: "8px" }}
//     />
//   </div>
// </div>
//               {cards.map((card, index) => (
//                 <div className="col-md-6" key={index}>
//                   <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "16px" }}>
//                     <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
//                       <h5 className="mb-0 fw-bold" style={{ color: "#ff914d" }}>Card {index + 1}</h5>
//                       <button onClick={() => handleRemoveCard(index)} className="btn btn-sm btn-outline-danger border-0">
//                         <FaTrash /> Remove
//                       </button>
//                     </div>

//                     <div className="card-body p-4">
//                       <div className="mb-3">
//                         <label className="form-label text-muted small fw-bold">Title</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={card.title}
//                           onChange={(e) => handleChange(index, 'title', e.target.value)}
//                           style={{ borderRadius: "8px" }}
//                         />
//                       </div>

//                       <div className="mb-3">
//                         <label className="form-label text-muted small fw-bold">Description (Optional)</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           value={card.description || ""}
//                           onChange={(e) => handleChange(index, 'description', e.target.value)}
//                           style={{ borderRadius: "8px" }}
//                         />
//                       </div>

//                       <div className="mb-3">
//                         <label className="form-label text-muted small fw-bold">Select Icon</label>
//                         <select 
//                           className="form-select" 
//                           value={card.icon || "FaCheckCircle"} 
//                           onChange={(e) => handleChange(index, 'icon', e.target.value)}
//                           style={{ borderRadius: "8px" }}
//                         >
//                           {AVAILABLE_ICONS.map(icon => (
//                             <option key={icon} value={icon}>{icon}</option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-4 text-center">
//               <button onClick={handleAddCard} className="btn btn-outline-primary fw-bold px-5 py-2" style={{ borderRadius: "30px" }}>
//                 <FaPlus className="me-2" /> Add New Card
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </AuthMainLayout>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout"; 
import { FaTrash, FaPlus, FaSave } from "react-icons/fa";

// 🌟 Pre-defined list of icons matching your theme
const AVAILABLE_ICONS = [
  "FaShieldAlt", "FaClock", "FaCheckCircle", "FaHome", 
  "FaMapMarkerAlt", "FaGem", "FaUser", "FaTools", 
  "FaStar", "FaAward", "FaTrophy"
];

export default function ManageWhyChooseUs() {
  const [contentId, setContentId] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heading, setHeading] = useState("Why Choose us");
  // 🌟 NEW: heading color, saved/read alongside `heading` in the same
  // { heading, headingColor, cards } json_content blob — mirrors the pattern
  // already used by What We Offer / The Way We Work heading colors.
  const [headingColor, setHeadingColor] = useState("#222222");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cms-content/home_page_content_why_choose_us");

      const record = Array.isArray(res.data) ? res.data[0] : res.data;

      if (!record || !record.json_content) {
        setContentId(null);
        setCards([]);
        return;
      }

      setContentId(record.id);

      let json = record.json_content;
      if (typeof json === "string") {
        try { json = JSON.parse(json); } catch { json = {}; }
      }

      // 🌟 FIX: json_content can be in two shapes:
      //  - legacy: a plain array of cards (no heading was ever saved)
      //  - current: { heading, cards }
      // Previously this always did `setCards(record?.json_content || [])`,
      // which after the first "Save All Changes" set `cards` to the WHOLE
      // { heading, cards } object instead of the cards array, breaking
      // cards.map(...) below and silently dropping the heading on every
      // reload (so it always looked "reset").
      if (Array.isArray(json)) {
        setCards(json);
        setHeading("Why Choose us");
        setHeadingColor("#222222");
      } else {
        setCards(Array.isArray(json.cards) ? json.cards : []);
        setHeading(json.heading || "Why Choose us");
        // 🌟 NEW: hydrate heading color, defaulting for records saved before
        // this field existed so nothing breaks for older data.
        setHeadingColor(json.headingColor || "#222222");
      }
    } catch (error) {
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeData = async () => {
    try {
      setLoading(true);
      const defaultCards = [
        { title: "Lifetime Warranty¹", description: "India's only full-home coverage guarantee.", icon: "FaShieldAlt" },
        { title: "45-day move-in*²", description: "Swift, on-time installation.", icon: "FaClock" },
        { title: "150+ quality checks", description: "Rigorous quality assurance.", icon: "FaCheckCircle" },
        { title: "1,00,00+ happy homes", description: "Trusted by thousands.", icon: "FaHome" }
      ];

      // 🌟 FIX: initialize with the { heading, headingColor, cards } shape from
      // the start, so the very first save already matches what fetchData/handleSaveAll expect.
      const res = await api.post("/cms-content/home_page_content_why_choose_us", {
        heading,
        headingColor,
        cards: defaultCards
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Section initialized successfully!");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to initialize section.");
      setLoading(false);
    }
  };

  // --- DYNAMIC LIST CONTROLS ---
  const handleAddCard = () => {
    setCards([...cards, { title: "", description: "", icon: "FaCheckCircle" }]);
  };

  const handleRemoveCard = (index) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards);
  };

  const handleChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  // --- BULK SAVE TO BACKEND ---
  const handleSaveAll = async () => {
    if (!contentId) {
      toast.error("Content ID missing. Initialize data first.");
      return;
    }
    try {
      setSaving(true);
      // We use the standard PATCH endpoint to replace the whole JSON blob at once
      const res = await api.patch(`/cms-content/${contentId}`, {
        json_content: { heading, headingColor, cards }
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("All Why Choose Us cards saved successfully!");
      }
    } catch (error) {
      toast.error("Failed to save changes.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AuthMainLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      </AuthMainLayout>
    );
  }

  return (
    <AuthMainLayout>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-dark">Manage {heading}</h2>
          
          {cards.length > 0 && (
            <button onClick={handleSaveAll} disabled={saving} className="btn btn-success fw-bold px-4">
              {saving ? "Saving..." : <><FaSave className="me-2"/> Save All Changes</>}
            </button>
          )}
        </div>

        {(!cards || cards.length === 0) ? (
          <div className="text-center p-5 bg-white rounded-4 shadow-sm border">
            <h4 className="fw-bold mb-3">No Data Found</h4>
            <p className="text-muted mb-4">Initialize the default cards to start editing.</p>
            <button onClick={handleInitializeData} className="btn btn-warning fw-bold text-white px-4 py-2 rounded-3">
              Initialize Section
            </button>
          </div>
        ) : (
          <>
            <div className="row g-4">

              <div className="card shadow-sm border-0 mb-4">
  <div className="card-body">
    <div className="row g-3">
      <div className="col-md-9">
        <label className="form-label fw-bold">
          Section Heading
        </label>

        <input
          type="text"
          className="form-control"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          placeholder="Enter section heading"
          style={{ borderRadius: "8px" }}
        />
      </div>

      {/* 🌟 NEW: Heading Color picker, same pattern as the other CMS
          heading-management pages (color input + hex value in state). */}
      <div className="col-md-3">
        <label className="form-label fw-bold">
          Heading Color
        </label>
        <input
          type="color"
          className="form-control form-control-color w-100"
          value={headingColor}
          onChange={(e) => setHeadingColor(e.target.value)}
        />
      </div>
    </div>
  </div>
</div>
              {cards.map((card, index) => (
                <div className="col-md-6" key={index}>
                  <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "16px" }}>
                    <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-bold" style={{ color: "#ff914d" }}>Card {index + 1}</h5>
                      <button onClick={() => handleRemoveCard(index)} className="btn btn-sm btn-outline-danger border-0">
                        <FaTrash /> Remove
                      </button>
                    </div>

                    <div className="card-body p-4">
                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={card.title}
                          onChange={(e) => handleChange(index, 'title', e.target.value)}
                          style={{ borderRadius: "8px" }}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">Description (Optional)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={card.description || ""}
                          onChange={(e) => handleChange(index, 'description', e.target.value)}
                          style={{ borderRadius: "8px" }}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-muted small fw-bold">Select Icon</label>
                        <select 
                          className="form-select" 
                          value={card.icon || "FaCheckCircle"} 
                          onChange={(e) => handleChange(index, 'icon', e.target.value)}
                          style={{ borderRadius: "8px" }}
                        >
                          {AVAILABLE_ICONS.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button onClick={handleAddCard} className="btn btn-outline-primary fw-bold px-5 py-2" style={{ borderRadius: "30px" }}>
                <FaPlus className="me-2" /> Add New Card
              </button>
            </div>
          </>
        )}
      </div>
    </AuthMainLayout>
  );
}
