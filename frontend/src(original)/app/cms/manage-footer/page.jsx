"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { FaSave, FaPlus, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

import dynamic from "next/dynamic";
const CKEditorComponent = dynamic(() => import("../../components/CKEditorComponent"), { ssr: false });

export default function ManageFooter() {
  const [contentId, setContentId] = useState(null);
  const [rulesContentId, setRulesContentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

const [allProfilesData, setAllProfilesData] = useState({
  default: {
    label: "Default Footer",
    footerSettings: { backgroundColor: "#ffffff", textColor: "#171717" },
    verticalColumns: [],
    horizontalSections: [],
    bottomBar: {
      copyright: "", designedBy: "",
      socials: { facebook: "", twitter: "", instagram: "", linkedin: "", whatsapp: "", pinterest: "", youtube: "" },
      legalLinks: [],
    },
  },
});
const [activeProfileKey, setActiveProfileKey] = useState("default");
const [pageRules, setPageRules] = useState([]);
const profiles = Object.keys(allProfilesData).map(key => ({
  key,
  label: allProfilesData[key]?.label || key,
}));

  // --- Footer State ---
  const [footerSettings, setFooterSettings] = useState({ backgroundColor: "#ffffff",  textColor: "#171717" });
  const [verticalColumns, setVerticalColumns] = useState([]);
  const [horizontalSections, setHorizontalSections] = useState([]);
  const [bottomBar, setBottomBar] = useState({
    copyright: "",
    designedBy: "",
    socials: { facebook: "", twitter: "", instagram: "", linkedin: "", whatsapp: "", pinterest: "", youtube: "" },
    legalLinks: [],
  });

const normalizeProfile = (parsedContent) => {

  const normalizedColumns = (parsedContent.verticalColumns || []).map(col => {
    if (!col.blocks) {
      return {
        id: col.id, logoUrl: col.logoUrl || "", homeUrl: col.homeUrl || "",
        blocks: [{
          id: Date.now().toString() + Math.random(),
          type: col.type || "links", title: col.title || "", headingTag: col.headingTag || "h4",
          url: col.url || "", emails: col.email ? [col.email] : [""],
          phones: col.phones ? String(col.phones).split(",").map(p => p.trim()).filter(Boolean) : [""],
          content: col.content || "", links: col.links || []
        }]
      };
    }
    const normalizedBlocks = (col.blocks || []).map(block => ({
      ...block, headingTag: block.headingTag || "h4", url: block.url || "",
      emails: Array.isArray(block.emails) ? block.emails : (block.email ? [block.email] : [""]),
      phones: Array.isArray(block.phones) ? block.phones
        : (block.phones ? String(block.phones).split(",").map(p => p.trim()).filter(Boolean) : [""]),
    }));
    return { ...col, blocks: normalizedBlocks };
  });

  const normalizedHorizontal = (parsedContent.horizontalSections || []).map(sec => {
    let actionWords = sec.actionWords || [];
    if (sec.actionWord && sec.actionLink && actionWords.length === 0) {
      actionWords = [{ word: sec.actionWord, link: sec.actionLink }];
    }
    return { ...sec, type: sec.type || "standard", headingTag: sec.headingTag || "h6",
      cloudLinks: sec.cloudLinks || [], actionWords };
  });

  return {
    footerSettings: parsedContent.footerSettings || { backgroundColor: "#ffffff", textColor: "#171717" },
    verticalColumns: normalizedColumns,
    horizontalSections: normalizedHorizontal,
    bottomBar: parsedContent.bottomBar || {
      copyright: "", designedBy: "",
      socials: { facebook: "", twitter: "", instagram: "", linkedin: "", whatsapp: "", pinterest: "", youtube: "" },
      legalLinks: [],
    },
  };
};

const loadProfileIntoForm = useCallback((key) => {
  const raw = allProfilesData[key];
  if (!raw) return;
  const normalized = normalizeProfile(raw);
  setFooterSettings(normalized.footerSettings);
  setVerticalColumns(normalized.verticalColumns);
  setHorizontalSections(normalized.horizontalSections);
  setBottomBar(normalized.bottomBar);
}, [allProfilesData]);

const fetchAllData = async () => {
  try {
    setLoading(true);

    // 1. Fetch all footer profiles (single row)
    const res = await api.get("/cms-content/footer_profiles");
    const record = Array.isArray(res.data) ? res.data[0] : res.data;
    if (record) {
      setContentId(record.id);
      let parsed = record.json_content;
      if (typeof parsed === "string") { try { parsed = JSON.parse(parsed); } catch { parsed = {}; } }
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
        setAllProfilesData(parsed);
      }
    }

    // 2. Fetch page visibility rules (single row)
    try {
      const rulesRes = await api.get("/cms-content/footer_page_rules");
      const rulesRecord = Array.isArray(rulesRes.data) ? rulesRes.data[0] : rulesRes.data;
      if (rulesRecord) {
        setRulesContentId(rulesRecord.id);
        let parsedRules = rulesRecord.json_content;
        if (typeof parsedRules === "string") { try { parsedRules = JSON.parse(parsedRules); } catch { parsedRules = []; } }
        if (Array.isArray(parsedRules)) setPageRules(parsedRules);
      }
    } catch (err) {
      console.log("No page rules yet.");
    }
  } catch (err) {
    console.log(err);
    toast.error("Failed to load footer data.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchAllData();
}, []);

useEffect(() => {
  loadProfileIntoForm(activeProfileKey);
}, [activeProfileKey, loadProfileIntoForm]);

const allProfilesDataRef = useRef(allProfilesData);
useEffect(() => { allProfilesDataRef.current = allProfilesData; }, [allProfilesData]);

const persistActiveProfile = async (successMessage, overrideData = {}) => {
  try {
    setSaving(true);

    const updatedProfilesData = {
      ...allProfilesData,
      [activeProfileKey]: {
        label: allProfilesData[activeProfileKey]?.label || "Default Footer",
        footerSettings,
        verticalColumns,
        horizontalSections,
        bottomBar,
        ...overrideData,
      },
    };
    allProfilesDataRef.current = updatedProfilesData;
    setAllProfilesData(updatedProfilesData);

    const payload = { json_content: JSON.stringify(updatedProfilesData) };

    if (contentId) {
      await api.patch(`/cms-content/${contentId}`, payload);
    } else {
      const res = await api.post("/cms-content/footer_profiles", payload);
      const created = Array.isArray(res.data) ? res.data[0] : res.data;
      if (created?.id) setContentId(created.id);
    }

    toast.success(successMessage);
  } catch (err) {
    console.log(err);
    toast.error("Save Failed");
  } finally {
    setSaving(false);
  }
};

const handleSave = () => persistActiveProfile("Footer Saved Successfully");
const saveVerticalColumnAt = (index) =>
  persistActiveProfile(`Column ${index + 1} Saved`);

const saveHorizontalSectionAt = (index) =>
  persistActiveProfile(`Row ${index + 1} Saved`);
const saveBackgroundColors = () => persistActiveProfile("Background & Text Colors Saved");
const saveVerticalColumns = () => persistActiveProfile("Vertical Columns Saved");
const saveHorizontalSections = () => persistActiveProfile("Horizontal Rows Saved");
const saveBottomBar = () => persistActiveProfile("Bottom Bar & Socials Saved");

const handleCreateProfile = () => {
  const label = window.prompt("Name this footer profile (e.g. Blog Footer):");
  if (!label || !label.trim()) return;

  const slug = label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  if (allProfilesData[slug]) {
    toast.error("A profile with that name already exists.");
    return;
  }

  setAllProfilesData(prev => ({
    ...prev,
    [slug]: {
      label: label.trim(),
      footerSettings: { backgroundColor: "#ffffff", textColor: "#171717" },
      verticalColumns: [],
      horizontalSections: [],
      bottomBar: {
        copyright: "", designedBy: "",
        socials: { facebook: "", twitter: "", instagram: "", linkedin: "", whatsapp: "", pinterest: "", youtube: "" },
        legalLinks: [],
      },
    },
  }));
  setActiveProfileKey(slug); // switches editor to the new blank profile
  toast.info("New profile created — click Save Footer to persist it.");
};

const handleDeleteProfile = async () => {
  if (activeProfileKey === "default") {
    toast.error("The Default Footer profile cannot be deleted.");
    return;
  }
  const confirmed = window.confirm(
    `Delete footer profile "${allProfilesData[activeProfileKey]?.label || activeProfileKey}"? This cannot be undone.`
  );
  if (!confirmed) return;

  const updatedProfilesData = { ...allProfilesData };
  delete updatedProfilesData[activeProfileKey];

  try {
    setSaving(true);
    const payload = { json_content: JSON.stringify(updatedProfilesData) };
    if (contentId) {
      await api.patch(`/cms-content/${contentId}`, payload);
    } else {
      const res = await api.post("/cms-content/footer_profiles", payload);
      const created = Array.isArray(res.data) ? res.data[0] : res.data;
      if (created?.id) setContentId(created.id);
    }
    setAllProfilesData(updatedProfilesData);
    setActiveProfileKey("default");
    toast.success("Footer profile deleted.");
  } catch (err) {
    console.log(err);
    toast.error("Failed to delete profile.");
  } finally {
    setSaving(false);
  }
};

  const addVerticalColumn = () => {
    const newColIndex = verticalColumns.length;
    setVerticalColumns([
      ...verticalColumns,
      {
        id: Date.now().toString(),
        logoUrl: "",
        homeUrl: "",
        blocks: [
          {
            id: Date.now().toString() + "b",
            type: newColIndex === 0 ? "contact" : "links",
            title: "",
            headingTag: "h4",
            url: "",
            emails: [""],
            phones: [""],
            content: "",
            links: [],
          }
        ]
      },
    ]);
  };

  const updateColumnConfig = (colIndex, field, value) => {
    const updated = [...verticalColumns];
    updated[colIndex][field] = value;
    setVerticalColumns(updated);
  };

const removeVerticalColumn = (index) => {
  if (!window.confirm(`Delete Column ${index + 1}? This saves immediately.`)) return;
  const updated = [...verticalColumns];
  updated.splice(index, 1);
  setVerticalColumns(updated);
  persistActiveProfile(`Column ${index + 1} deleted`, { verticalColumns: updated });
};

  const addBlockToColumn = (colIndex) => {
    const updated = [...verticalColumns];
    updated[colIndex].blocks.push({
      id: Date.now().toString(),
      type: colIndex === 0 ? "contact" : "links",
      title: "",
      headingTag: "h4",
      url: "",
      emails: [""],
      phones: [""],
      content: "",
      links: [],
    });
    setVerticalColumns(updated);
  };

  const updateBlock = (colIndex, blockIndex, field, value) => {
    const updated = [...verticalColumns];
    updated[colIndex].blocks[blockIndex][field] = value;
    setVerticalColumns(updated);
  };

  const removeBlock = (colIndex, blockIndex) => {
    const updated = [...verticalColumns];
    updated[colIndex].blocks.splice(blockIndex, 1);
    setVerticalColumns(updated);
  };

  const addBlockLink = (colIndex, blockIndex) => {
    const updated = [...verticalColumns];
    if (!updated[colIndex].blocks[blockIndex].links) updated[colIndex].blocks[blockIndex].links = [];
    updated[colIndex].blocks[blockIndex].links.push({ label: "", url: "" });
    setVerticalColumns(updated);
  };

  const updateBlockLink = (colIndex, blockIndex, linkIndex, field, value) => {
    const updated = [...verticalColumns];
    updated[colIndex].blocks[blockIndex].links[linkIndex][field] = value;
    setVerticalColumns(updated);
  };

  const removeBlockLink = (colIndex, blockIndex, linkIndex) => {
    const updated = [...verticalColumns];
    updated[colIndex].blocks[blockIndex].links.splice(linkIndex, 1);
    setVerticalColumns(updated);
  };

  const addBlockEmail = (colIndex, blockIndex) => {
    const updated = [...verticalColumns];
    if (!updated[colIndex].blocks[blockIndex].emails) updated[colIndex].blocks[blockIndex].emails = [];
    updated[colIndex].blocks[blockIndex].emails.push("");
    setVerticalColumns(updated);
  };

  const updateBlockEmail = (colIndex, blockIndex, emailIndex, value) => {
    const updated = [...verticalColumns];
    updated[colIndex].blocks[blockIndex].emails[emailIndex] = value;
    setVerticalColumns(updated);
  };

  const removeBlockEmail = (colIndex, blockIndex, emailIndex) => {
    const updated = [...verticalColumns];
    updated[colIndex].blocks[blockIndex].emails.splice(emailIndex, 1);
    setVerticalColumns(updated);
  };

  const addBlockPhone = (colIndex, blockIndex) => {
    const updated = [...verticalColumns];
    if (!updated[colIndex].blocks[blockIndex].phones) updated[colIndex].blocks[blockIndex].phones = [];
    updated[colIndex].blocks[blockIndex].phones.push("");
    setVerticalColumns(updated);
  };

  const updateBlockPhone = (colIndex, blockIndex, phoneIndex, value) => {
    const updated = [...verticalColumns];
    updated[colIndex].blocks[blockIndex].phones[phoneIndex] = value;
    setVerticalColumns(updated);
  };

  const removeBlockPhone = (colIndex, blockIndex, phoneIndex) => {
    const updated = [...verticalColumns];
    updated[colIndex].blocks[blockIndex].phones.splice(phoneIndex, 1);
    setVerticalColumns(updated);
  };

  const addPageRule = () => {
  setPageRules([
    ...pageRules,
    { id: Date.now().toString(), pattern: "", type: "profile", profileKey: "footer_content" },
  ]);
};

const updatePageRule = (index, field, value) => {
  const updated = [...pageRules];
  updated[index][field] = value;
  setPageRules(updated);
};

// const removePageRule = (index) => {
//   const updated = [...pageRules];
//   updated.splice(index, 1);
//   setPageRules(updated);
// };

const removePageRule = async (index) => {
  const updated = [...pageRules];
  updated.splice(index, 1);
  setPageRules(updated);

  try {
    const payload = { json_content: JSON.stringify(updated) };
    if (rulesContentId) {
      await api.patch(`/cms-content/${rulesContentId}`, payload);
    } else {
      const res = await api.post("/cms-content/footer_page_rules", payload);
      const created = Array.isArray(res.data) ? res.data[0] : res.data;
      if (created?.id) setRulesContentId(created.id);
    }
    toast.success("Rule deleted.");
  } catch (err) {
    console.log(err);
    toast.error("Failed to delete rule.");
  }
};


const savePageRules = async () => {
  try {
    const payload = { json_content: JSON.stringify(pageRules) };
    if (rulesContentId) {
      await api.patch(`/cms-content/${rulesContentId}`, payload);
    } else {
      const res = await api.post("/cms-content/footer_page_rules", payload);
      const created = Array.isArray(res.data) ? res.data[0] : res.data;
      if (created?.id) setRulesContentId(created.id);
    }
    toast.success("Visibility rules saved.");
  } catch (err) {
    console.log(err);
    toast.error("Failed to save visibility rules.");
  }
};

  // --- UPDATED: Horizontal Sections Handlers (Supports ActionWords Array) ---
  const addHorizontalSection = () => {
    setHorizontalSections([
      ...horizontalSections,
      {
        id: Date.now().toString(),
        type: "standard", 
        title: "",
        headingTag: "h6",
        description: "",
        actionWords: [], 
        cloudLinks: []
      },
    ]);
  };

  const updateHorizontalSection = (index, field, value) => {
    const updated = [...horizontalSections];
    updated[index][field] = value;
    setHorizontalSections(updated);
  };

  // --- NEW: Action Words Array Management ---
  const addActionWord = (secIndex) => {
    const updated = [...horizontalSections];
    if (!updated[secIndex].actionWords) updated[secIndex].actionWords = [];
    updated[secIndex].actionWords.push({ word: "", link: "" });
    setHorizontalSections(updated);
  };

  const updateActionWord = (secIndex, wordIndex, field, value) => {
    const updated = [...horizontalSections];
    updated[secIndex].actionWords[wordIndex][field] = value;
    setHorizontalSections(updated);
  };

  const removeActionWord = (secIndex, wordIndex) => {
    const updated = [...horizontalSections];
    updated[secIndex].actionWords.splice(wordIndex, 1);
    setHorizontalSections(updated);
  };
  // ----------------------------------------

  const addCloudLink = (index) => {
    const updated = [...horizontalSections];
    if (!updated[index].cloudLinks) updated[index].cloudLinks = [];
    updated[index].cloudLinks.push({ label: "", url: "" });
    setHorizontalSections(updated);
  };

  const updateCloudLink = (secIndex, linkIndex, field, value) => {
    const updated = [...horizontalSections];
    updated[secIndex].cloudLinks[linkIndex][field] = value;
    setHorizontalSections(updated);
  };

  const removeCloudLink = (secIndex, linkIndex) => {
    const updated = [...horizontalSections];
    updated[secIndex].cloudLinks.splice(linkIndex, 1);
    setHorizontalSections(updated);
  };

const removeHorizontalSection = (index) => {
  if (!window.confirm(`Delete Horizontal Section ${index + 1}? This saves immediately.`)) return;
  const updated = [...horizontalSections];
  updated.splice(index, 1);
  setHorizontalSections(updated);
  persistActiveProfile(`Row ${index + 1} deleted`, { horizontalSections: updated });
};

  const moveHorizontalSection = (index, direction) => {
    const updated = [...horizontalSections];
    if (direction === "up" && index > 0) {
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    } else if (direction === "down" && index < updated.length - 1) {
      [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    }
    setHorizontalSections(updated);
  };

  const updateBottomBar = (field, value) => {
    setBottomBar((prev) => ({ ...prev, [field]: value }));
  };

  const updateSocials = (platform, value) => {
    setBottomBar((prev) => ({
      ...prev,
      socials: { ...prev.socials, [platform]: value },
    }));
  };

  const addLegalLink = () => {
    const updatedLinks = [...(bottomBar.legalLinks || []), { label: "", url: "" }];
    updateBottomBar("legalLinks", updatedLinks);
  };

  const updateLegalLink = (index, field, value) => {
    const updatedLinks = [...bottomBar.legalLinks];
    updatedLinks[index][field] = value;
    updateBottomBar("legalLinks", updatedLinks);
  };

  const removeLegalLink = (index) => {
    const updatedLinks = [...bottomBar.legalLinks];
    updatedLinks.splice(index, 1);
    updateBottomBar("legalLinks", updatedLinks);
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
          <h2 className="fw-bold">Manage Footer</h2>
          <button className="btn btn-success" disabled={saving} onClick={handleSave}>
            <FaSave className="me-2" />
            {saving ? "Saving..." : "Save Footer"}
          </button>
        </div>

      <div className="card shadow-sm border-0 mb-4">
  <div className="card-body d-flex align-items-center gap-3 flex-wrap">
    <label className="fw-bold mb-0">Editing Footer Profile:</label>
    <select className="form-select w-auto" value={activeProfileKey}
      onChange={(e) => setActiveProfileKey(e.target.value)}>
      {profiles.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
    </select>
    <button className="btn btn-outline-primary btn-sm" onClick={handleCreateProfile}>
      <FaPlus className="me-1" /> New Footer Profile
    </button>
    <button className="btn btn-outline-danger btn-sm" disabled={activeProfileKey === "default" || saving} onClick={handleDeleteProfile}>
  <FaTrash className="me-1" /> Delete Profile
</button>
  </div>
</div>

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body d-flex align-items-center gap-4 flex-wrap">
            <div className="d-flex align-items-center gap-2">
                <label className="fw-bold mb-0">Footer Background Color:</label>
                <input 
                  type="color" 
                  className="form-control form-control-color" 
                  value={footerSettings.backgroundColor || "#ffffff"}
                  onChange={(e) => setFooterSettings({ ...footerSettings, backgroundColor: e.target.value })}
                  title="Choose background color"
                />
                <span className="text-muted small">({footerSettings.backgroundColor})</span>
            </div>

            <div className="d-flex align-items-center gap-2">
                <label className="fw-bold mb-0">Footer Text Color:</label>
                <input 
                  type="color" 
                  className="form-control form-control-color" 
                  value={footerSettings.textColor || "#171717"}
                  onChange={(e) => setFooterSettings({ ...footerSettings, textColor: e.target.value })}
                  title="Choose text color"
                />
                <span className="text-muted small">({footerSettings.textColor || "#171717"})</span>
            </div>
            <button className="btn btn-success btn-sm" disabled={saving} onClick={saveBackgroundColors}>
              <FaSave className="me-1" /> {saving ? "Saving..." : "Save Colors"}
            </button>
          </div>
        </div>

        <h4 className="fw-bold text-primary mb-3 mt-5">Footer Visibility & Page Assignment</h4>
<div className="card shadow-sm border-0 mb-5">
  <div className="card-body">
    <p className="text-muted small">First matching rule wins. Pages with no match use the Default Footer.</p>
    {pageRules.map((rule, i) => (
      <div key={rule.id} className="d-flex gap-2 mb-2">
        <input className="form-control form-control-sm" placeholder="/ or /blog or /blog/*"
          value={rule.pattern} onChange={(e) => updatePageRule(i, "pattern", e.target.value)} />
        <select className="form-select form-select-sm w-auto" value={rule.type}
          onChange={(e) => updatePageRule(i, "type", e.target.value)}>
          <option value="profile">Show Footer</option>
          <option value="hidden">Hide Footer</option>
        </select>
        {rule.type === "profile" && (
          <select className="form-select form-select-sm w-auto" value={rule.profileKey}
            onChange={(e) => updatePageRule(i, "profileKey", e.target.value)}>
            {profiles.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
          </select>
        )}
        <button className="btn btn-sm btn-outline-danger" onClick={() => removePageRule(i)}><FaTrash /></button>
      </div>
    ))}
    <button className="btn btn-outline-primary btn-sm mt-2" onClick={addPageRule}><FaPlus /> Add Rule</button>
    <button className="btn btn-success btn-sm mt-2 ms-2" onClick={savePageRules}>Save Visibility Rules</button>
  </div>
</div>

        <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
          <h4 className="fw-bold text-primary">1. Vertical Columns</h4>
          <button className="btn btn-primary btn-sm" onClick={addVerticalColumn}>
            <FaPlus className="me-2" /> Add Column
          </button>
          <button className="btn btn-success btn-sm" disabled={saving} onClick={saveVerticalColumns}>
              <FaSave className="me-2" /> {saving ? "Saving..." : "Save Columns"}
            </button>
        </div>

        <div className="row">
          {verticalColumns.map((col, index) => (
            <div key={col.id || index} className="col-12 mb-4">
              <div className="card shadow-sm border-primary h-100">
              
<div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
  <span className="fw-bold">Column {index + 1}</span>
  <div className="d-flex gap-2">
    <button
      className="btn btn-sm btn-success"
      disabled={saving}
      onClick={() => saveVerticalColumnAt(index)}
    >
      <FaSave /> {saving ? "Saving..." : "Save"}
    </button>
    <button className="btn btn-sm btn-light text-danger" onClick={() => removeVerticalColumn(index)}>
      <FaTrash /> Remove Column
    </button>
  </div>
</div>
                <div className="card-body bg-light">
                  
                  {index === 0 && (
                    <div className="row mb-4 p-3 bg-white border rounded mx-1">
                      <h6 className="fw-bold text-secondary mb-3">Column 1 Brand Settings</h6>
                      <div className="col-md-6 mb-2">
                         <label className="form-label">Brand Logo Image URL</label>
                         <input className="form-control" placeholder="e.g., /images/logo.png" value={col.logoUrl} onChange={(e) => updateColumnConfig(index, 'logoUrl', e.target.value)} />
                      </div>
                      <div className="col-md-6 mb-2">
                         <label className="form-label">Home Website URL</label>
                         <input className="form-control" placeholder="e.g., https://hcinterior.in" value={col.homeUrl} onChange={(e) => updateColumnConfig(index, 'homeUrl', e.target.value)} />
                      </div>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center mb-3">
                     <h6 className="fw-bold mb-0">Rows (Blocks) inside this Column</h6>
                     <button className="btn btn-sm btn-outline-primary" onClick={() => addBlockToColumn(index)}>
                        <FaPlus /> Add Row/Block
                     </button>
                  </div>

                  {col.blocks.map((block, bIndex) => (
                     <div key={block.id || bIndex} className="card mb-3 border-0 shadow-sm">
                       <div className="card-header bg-white d-flex justify-content-between align-items-center py-2">
                          <span className="small fw-bold text-muted">Row {bIndex + 1}</span>
                          <button className="btn btn-sm text-danger p-0" onClick={() => removeBlock(index, bIndex)}><FaTrash/></button>
                       </div>
                       <div className="card-body">
                          {!((index === 1 || index === 2) && bIndex > 0) && (
                            <div className="row mb-3">
                              <div className="col-md-4">
                                <label className="form-label fw-bold">Title (Optional)</label>
                                <input
                                  className="form-control form-control-sm"
                                  value={block.title}
                                  onChange={(e) => updateBlock(index, bIndex, "title", e.target.value)}
                                  placeholder="e.g., About Us"
                                />
                              </div>
                              <div className="col-md-3">
                                <label className="form-label fw-bold">Heading Tag</label>
                                <select
                                  className="form-select form-select-sm"
                                  value={block.headingTag || "h4"}
                                  onChange={(e) => updateBlock(index, bIndex, "headingTag", e.target.value)}
                                >
                                  <option value="p">Text</option>
                                  <option value="h1">H1</option>
                                  <option value="h2">H2</option>
                                  <option value="h3">H3</option>
                                  <option value="h4">H4</option>
                                  <option value="h5">H5</option>
                                  <option value="h6">H6</option>
                                </select>
                              </div>
                              <div className="col-md-5">
                                <label className="form-label fw-bold">Title URL (Clickable Link)</label>
                                <input
                                  className="form-control form-control-sm"
                                  value={block.url || ""}
                                  onChange={(e) => updateBlock(index, bIndex, "url", e.target.value)}
                                  placeholder="e.g., /about-us"
                                />
                              </div>
                            </div>
                          )}

                          {index === 0 && (
                            <div className="bg-light p-2 rounded border">
                              <div className="d-flex justify-content-between mb-2">
                                <label className="form-label small fw-bold mb-0">Email Address(es)</label>
                                <button className="btn btn-sm btn-secondary py-0" onClick={() => addBlockEmail(index, bIndex)}>
                                  <FaPlus className="small"/> Add Email
                                </button>
                              </div>
                              {(block.emails || [""]).map((email, eIndex) => (
                                <div key={eIndex} className="d-flex gap-2 mb-2">
                                  <input
                                    className="form-control form-control-sm"
                                    placeholder="e.g., info@example.com"
                                    value={email}
                                    onChange={(e) => updateBlockEmail(index, bIndex, eIndex, e.target.value)}
                                  />
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeBlockEmail(index, bIndex, eIndex)}><FaTrash /></button>
                                </div>
                              ))}

                              <div className="d-flex justify-content-between mb-2 mt-3">
                                <label className="form-label small fw-bold mb-0">Phone Number(s)</label>
                                <button className="btn btn-sm btn-secondary py-0" onClick={() => addBlockPhone(index, bIndex)}>
                                  <FaPlus className="small"/> Add Phone
                                </button>
                              </div>
                              {(block.phones || [""]).map((phone, pIndex) => (
                                <div key={pIndex} className="d-flex gap-2 mb-2">
                                  <input
                                    className="form-control form-control-sm"
                                    placeholder="e.g., +91 98765 43210"
                                    value={phone}
                                    onChange={(e) => updateBlockPhone(index, bIndex, pIndex, e.target.value)}
                                  />
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeBlockPhone(index, bIndex, pIndex)}><FaTrash /></button>
                                </div>
                              ))}
                            </div>
                          )}

                          {block.type === "text" && (
                            <div className="bg-light p-2 rounded border">
                              <label className="form-label small mb-1">Address / Content</label>
                              <textarea rows={3} className="form-control form-control-sm" value={block.content} onChange={(e) => updateBlock(index, bIndex, "content", e.target.value)} />
                            </div>
                          )}
                          {(block.type === "links" || !block.type) && !((index === 1 || index === 2) && bIndex === 0) && (
                            <div className="bg-light p-2 rounded border">
                              <div className="d-flex justify-content-between mb-2">
                                <label className="form-label small fw-bold mb-0">Links</label>
                                <button className="btn btn-sm btn-secondary py-0" onClick={() => addBlockLink(index, bIndex)}>
                                  <FaPlus className="small"/> Add Link
                                </button>
                              </div>
                              {(block.links || []).map((link, lIndex) => (
                                <div key={lIndex} className="d-flex gap-2 mb-2">
                                  <input className="form-control form-control-sm" placeholder="Label" value={link.label} onChange={(e) => updateBlockLink(index, bIndex, lIndex, "label", e.target.value)} />
                                  <input className="form-control form-control-sm" placeholder="URL" value={link.url} onChange={(e) => updateBlockLink(index, bIndex, lIndex, "url", e.target.value)} />
                                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeBlockLink(index, bIndex, lIndex)}><FaTrash /></button>
                                </div>
                              ))}
                            </div>
                          )}
                       </div>
                     </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
          <h4 className="fw-bold text-primary">2. Horizontal Rows (SEO & Locations)</h4>
          <button className="btn btn-primary btn-sm" onClick={addHorizontalSection}>
            <FaPlus className="me-2" /> Add Row
          </button>
          <button className="btn btn-success btn-sm" disabled={saving} onClick={saveHorizontalSections}>
              <FaSave className="me-2" /> {saving ? "Saving..." : "Save Rows"}
            </button>
        </div>

        {horizontalSections.map((sec, index) => (
          <div key={sec.id || index} className="card shadow-sm border-0 mb-3">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
        
<span className="fw-bold">Horizontal Section {index + 1}</span>
<div>
  <button
    className="btn btn-sm btn-success me-2"
    disabled={saving}
    onClick={() => saveHorizontalSectionAt(index)}
  >
    <FaSave /> {saving ? "Saving..." : "Save"}
  </button>
  <button
    className="btn btn-sm btn-secondary me-2"
    onClick={() => moveHorizontalSection(index, "up")}
    disabled={index === 0}
  >
    <FaArrowUp />
  </button>
                <button
                  className="btn btn-sm btn-secondary me-3"
                  onClick={() => moveHorizontalSection(index, "down")}
                  disabled={index === horizontalSections.length - 1}
                >
                  <FaArrowDown />
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => removeHorizontalSection(index)}>
                  <FaTrash />
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                 <div className="col-md-4">
                    <label className="form-label fw-bold">Section Type</label>
                    <select className="form-select" value={sec.type} onChange={(e) => updateHorizontalSection(index, "type", e.target.value)}>
                       <option value="standard">Standard Text (Clickable Text)</option>
                       <option value="linkCloud">Locations / Link Cloud (Multiple Links)</option>
                    </select>
                 </div>
                 <div className="col-md-5">
                    <label className="form-label fw-bold">Section Title</label>
                    <input
                      className="form-control"
                      value={sec.title}
                      onChange={(e) => updateHorizontalSection(index, "title", e.target.value)}
                      placeholder={sec.type === 'standard' ? "e.g., Discover Top Home Interior Designers..." : "e.g., Locations"}
                    />
                 </div>
                 <div className="col-md-3">
                    <label className="form-label fw-bold">Heading Tag</label>
                    <select
                      className="form-select"
                      value={sec.headingTag || "h6"}
                      onChange={(e) => updateHorizontalSection(index, "headingTag", e.target.value)}
                    >
                      <option value="h1">H1</option>
                      <option value="h2">H2</option>
                      <option value="h3">H3</option>
                      <option value="h4">H4</option>
                      <option value="h5">H5</option>
                      <option value="h6">H6</option>
                    </select>
                 </div>
              </div>

              {sec.type === 'standard' && (
                <div className="row">
                  <div className="col-md-12 mb-3">
  <label className="form-label fw-bold">Description / Paragraph</label>
  <CKEditorComponent
  pageData={sec.description || ""}
  setPageData={(html) => updateHorizontalSection(index, "description", html)}
/>
</div>
                  
                </div>
              )}

              {sec.type === 'linkCloud' && (
                 <div className="bg-light p-3 rounded border">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                       <span className="fw-bold small text-muted">Cloud Links (e.g., Interior Designer in Delhi)</span>
                       <button className="btn btn-sm btn-primary" onClick={() => addCloudLink(index)}>
                          <FaPlus/> Add Link
                       </button>
                    </div>
                    <div className="row">
                       {(sec.cloudLinks || []).map((cLink, cIndex) => (
                          <div key={cIndex} className="col-md-6 mb-2">
                             <div className="d-flex gap-2">
                                <input className="form-control form-control-sm" placeholder="Text (Delhi)" value={cLink.label} onChange={(e) => updateCloudLink(index, cIndex, "label", e.target.value)}/>
                                <input className="form-control form-control-sm" placeholder="URL" value={cLink.url} onChange={(e) => updateCloudLink(index, cIndex, "url", e.target.value)}/>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => removeCloudLink(index, cIndex)}><FaTrash/></button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
        <h4 className="fw-bold text-primary mb-0">3. Bottom Bar & Social Links</h4>
        <button className="btn btn-success btn-sm" disabled={saving} onClick={saveBottomBar}>
            <FaSave className="me-2" /> {saving ? "Saving..." : "Save Bottom Bar"}
          </button>
          </div>
        <div className="card shadow-sm border-0 mb-5">
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">Copyright Text</label>
                <input
                  className="form-control"
                  value={bottomBar.copyright}
                  onChange={(e) => updateBottomBar("copyright", e.target.value)}
                  placeholder="All Rights Reserved ©2026..."
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Designed By (Credit)</label>
                <input
                  className="form-control"
                  value={bottomBar.designedBy}
                  onChange={(e) => updateBottomBar("designedBy", e.target.value)}
                  placeholder="Designed By HC Interior"
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-12">
                <h6 className="fw-bold border-bottom pb-2">Social Media URLs</h6>
              </div>
              {["facebook", "instagram", "twitter", "linkedin", "whatsapp", "pinterest", "youtube"].map((platform) => (
                <div key={platform} className="col-md-3 mb-3">
                  <label className="form-label text-capitalize">{platform}</label>
                  <input
                    className="form-control form-control-sm"
                    value={bottomBar.socials?.[platform] || ""}
                    onChange={(e) => updateSocials(platform, e.target.value)}
                    placeholder={`${platform} URL`}
                  />
                </div>
              ))}
            </div>

            <div className="row">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                  <h6 className="fw-bold mb-0">Legal / Bottom Links</h6>
                  <button className="btn btn-sm btn-outline-primary" onClick={addLegalLink}>
                    <FaPlus /> Add Link
                  </button>
                </div>
                <div className="row">
                  {(bottomBar.legalLinks || []).map((link, index) => (
                    <div key={index} className="col-md-4 mb-2">
                      <div className="d-flex gap-2">
                        <input
                          className="form-control form-control-sm"
                          placeholder="Label (e.g. Privacy Policy)"
                          value={link.label}
                          onChange={(e) => updateLegalLink(index, "label", e.target.value)}
                        />
                        <input
                          className="form-control form-control-sm"
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) => updateLegalLink(index, "url", e.target.value)}
                        />
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeLegalLink(index)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AuthMainLayout>
  );
}

