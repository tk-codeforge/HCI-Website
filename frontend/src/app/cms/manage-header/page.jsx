"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSave, FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaEdit } from "react-icons/fa";
import api from "@/utils/api";
import AuthMainLayout from "../../layouts/auth/AuthMainLayout";

const CMS_KEY = "navbar_header_menu";

const DEFAULT_MENU = [
  {
    label: "Design Ideas",
    href: "",
    dropdown: [
      { label: "Design Gallery", href: "/design-idea/" },
      { label: "Product", href: "/product/" },
    ],
  },
  {
    label: "Portfolio",
    href: "",
    dropdown: [
      { label: "Residential Projects", href: "/residential-projects/" },
      { label: "Luxury Projects", href: "/luxury-projects/" },
    ],
  },
  {
    label: "Experience Center",
    href: "",
    dropdown: [
      { label: "Experience Center New Delhi", href: "/experience-center-new-delhi/" },
      { label: "Experience Center Noida", href: "/experience-center/" },
      { label: "Experience Center Noida Extension", href: "/experience-center-noida-extension/" },
      { label: "Experience Center Gurgaon", href: "/experience-center-gurugram/" },
      { label: "Experience Center Faridabad", href: "/experience-center-faridabad/" },
    ],
  },
  {
    label: "Exclusive Design",
    href: "",
    dropdown: [
      { label: "Ready To Go Design", href: "/ready-togo-design/" },
      { label: "Wallpapers", href: "/wallpaper/" },
      { label: "Space-Saving Furniture", href: "/spacesaving-furniture/" },
      { label: "Sustainable Furniture", href: "/sustainable-furniture/" },
      { label: "Furniture", href: "/furniture/" },
    ],
  },
  {
    label: "Serving Areas",
    href: "",
    dropdown: [
      { label: "Interior Designers In Noida", href: "/interior-designers-in-noida" },
      { label: "Interior Designers in Ghaziabad", href: "/interior-designers-in-ghaziabad" },
      { label: "Interior Designers in Greater Noida", href: "/interior-designers-in-greater-noida" },
      { label: "Interior Designers in Delhi", href: "/interior-designers-in-delhi" },
      { label: "Interior Designers in Dwarka", href: "/interior-designers-in-dwarka" },
      { label: "Interior Designers in Faridabad", href: "/interior-designers-in-faridabad" },
      { label: "Interior Designers in Gurugram", href: "/interior-designers-in-gurgaon" },
      { label: "Interior Designers In Manesar", href: "/interior-designers-in-manesar" },
      { label: "Interior Designers in Sohna", href: "/interior-designer-in-sohna-gurgaon" },
      { label: "Interior Designer in Noida Extension", href: "/interior-designer-in-noida-extension" },
    ],
  },
  {
    label: "More",
    href: "",
    dropdown: [
      { label: "About Us", href: "/about-us/" },
      { label: "How It Works", href: "/how-its-works/" },
      { label: "Serving Areas", href: "/services/" },
      { label: "Team", href: "/team/" },
      { label: "Contact Us", href: "/contact/" },
      { label: "Blogs", href: "/blog/" },
      { label: "Awards Gallery", href: "/awards/" },
    ],
  },
];

const EMPTY_HEADING_FORM = {
  label: "",
  href: "",
  menu_index: null, // null => adding a new heading, otherwise editing existing at this index
};

const EMPTY_ITEM_FORM = {
  label: "",
  href: "",
  menu_index: null, // which heading this item belongs / will belong to
  item_index: null, // null => adding a new dropdown item, otherwise editing existing at this index
};

export default function ManageHeader() {
  const [contentId, setContentId] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const [savingIndex, setSavingIndex] = useState(null);

  const [headingForm, setHeadingForm] = useState(EMPTY_HEADING_FORM);
  const [itemForm, setItemForm] = useState(EMPTY_ITEM_FORM);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/cms-content/${CMS_KEY}`);
      const record = Array.isArray(res.data) ? res.data[0] : res.data;

      if (record) {
        setContentId(record.id);

        let menuData = record.json_content?.menu;
        if (typeof menuData === "string") {
          try {
            menuData = JSON.parse(menuData);
          } catch (e) {
            menuData = [];
          }
        }

        const hydrated = Array.isArray(menuData) && menuData.length
          ? menuData.map((m) => ({
              label: m.label || "",
              href: m.href || "",
              dropdown: Array.isArray(m.dropdown)
                ? m.dropdown.map((d) => ({ label: d.label || "", href: d.href || "" }))
                : [],
            }))
          : DEFAULT_MENU;

        setMenu(hydrated);
      } else {
        setContentId(null);
        setMenu(DEFAULT_MENU);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load header menu.");
      setMenu(DEFAULT_MENU);
    } finally {
      setLoading(false);
    }
  };

  const persistMenu = async (updatedMenu, menuIndexForUi = null, sectionLabel = "") => {
    setSavingIndex(menuIndexForUi);
    try {
      const payload = { json_content: { menu: updatedMenu } };

      let res;
      if (contentId) {
        res = await api.patch(`/cms-content/update-with-image/${contentId}`, payload);
      } else {
        res = await api.post(`/cms-content/${CMS_KEY}`, payload);
        const record = Array.isArray(res.data) ? res.data[0] : res.data;
        if (record?.id) setContentId(record.id);
      }

      toast.success(sectionLabel ? `"${sectionLabel}" saved.` : "Saved.");
      return true;
    } catch (err) {
      console.log(err);
      toast.error("Save failed. Please try again.");
      return false;
    } finally {
      setSavingIndex(null);
    }
  };

  // ---------------- Heading (top-level nav item) handlers ----------------
  const openAddHeadingModal = () => {
    setHeadingForm({ label: "", href: "", menu_index: null });
  };

  const openEditHeadingModal = (heading, index) => {
    setHeadingForm({ label: heading.label || "", href: heading.href || "", menu_index: index });
  };

  const handleHeadingFormChange = (e) => {
    const { name, value } = e.target;
    setHeadingForm((prev) => ({ ...prev, [name]: value }));
  };

const handleHeadingFormSubmit = async (e) => {
  e.preventDefault();

  if (!headingForm.label.trim()) {
    toast.error("Heading name is required.");
    return;
  }

  const updated = [...menu];
  const isNew = headingForm.menu_index === null;

  if (isNew) {
    updated.push({ label: headingForm.label.trim(), href: headingForm.href.trim(), dropdown: [] });
  } else {
    updated[headingForm.menu_index] = {
      ...updated[headingForm.menu_index],
      label: headingForm.label.trim(),
      href: headingForm.href.trim(),
    };
  }

  setMenu(updated);
  document.getElementById("headingModalClose")?.click();

  const targetIndex = isNew ? updated.length - 1 : headingForm.menu_index;
  await persistMenu(updated, targetIndex, headingForm.label.trim());
};

  // Delete = saved immediately, no separate Save click needed.
  const deleteHeading = async (index) => {
    if (!window.confirm("Delete this heading and its entire dropdown? This is saved immediately and cannot be undone.")) return;

    const label = menu[index]?.label;
    const updated = [...menu];
    updated.splice(index, 1);

    setMenu(updated);
    await persistMenu(updated, null, `${label} (deleted)`);
  };

  const moveHeading = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= menu.length) return;
    const updated = [...menu];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setMenu(updated);
  };

  // Per-heading Save button — persists the whole menu, but only this
  // heading's card shows the saving state.
  const saveSection = async (menuIndex) => {
    const label = menu[menuIndex]?.label || "Section";
    await persistMenu(menu, menuIndex, label);
  };

  // ---------------- Dropdown item handlers ----------------
  const openAddItemModal = (menuIndex) => {
    setItemForm({ label: "", href: "", menu_index: menuIndex, item_index: null });
  };

  const openEditItemModal = (menuIndex, item, itemIndex) => {
    setItemForm({
      label: item.label || "",
      href: item.href || "",
      menu_index: menuIndex,
      item_index: itemIndex,
    });
  };

  const handleItemFormChange = (e) => {
    const { name, value } = e.target;
    setItemForm((prev) => ({ ...prev, [name]: value }));
  };

const handleItemFormSubmit = async (e) => {
  e.preventDefault();

  if (!itemForm.label.trim() || !itemForm.href.trim()) {
    toast.error("Both name and link are required.");
    return;
  }

  const updated = [...menu];
  const heading = { ...updated[itemForm.menu_index] };
  const dropdown = [...(heading.dropdown || [])];

  const newItem = { label: itemForm.label.trim(), href: itemForm.href.trim() };

  if (itemForm.item_index === null) {
    dropdown.push(newItem);
  } else {
    dropdown[itemForm.item_index] = newItem;
  }

  heading.dropdown = dropdown;
  updated[itemForm.menu_index] = heading;

  setMenu(updated);
  document.getElementById("itemModalClose")?.click();

  await persistMenu(updated, itemForm.menu_index, `${newItem.label} in ${heading.label || "section"}`);
};
  // Delete = saved immediately, no separate Save click needed.
  const deleteItem = async (menuIndex, itemIndex) => {
    const heading = menu[menuIndex];
    const itemLabel = heading?.dropdown?.[itemIndex]?.label;

    const updated = [...menu];
    const updatedHeading = { ...updated[menuIndex] };
    const dropdown = [...(updatedHeading.dropdown || [])];
    dropdown.splice(itemIndex, 1);
    updatedHeading.dropdown = dropdown;
    updated[menuIndex] = updatedHeading;

    setMenu(updated);
    await persistMenu(updated, menuIndex, `${itemLabel || "Item"} removed from ${heading?.label || "section"}`);
  };

  const moveItem = (menuIndex, itemIndex, direction) => {
    const target = itemIndex + direction;
    const dropdown = menu[menuIndex]?.dropdown || [];
    if (target < 0 || target >= dropdown.length) return;

    const updated = [...menu];
    const heading = { ...updated[menuIndex] };
    const newDropdown = [...heading.dropdown];
    [newDropdown[itemIndex], newDropdown[target]] = [newDropdown[target], newDropdown[itemIndex]];
    heading.dropdown = newDropdown;
    updated[menuIndex] = heading;
    setMenu(updated);
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
          <h2 className="fw-bold">Manage Header</h2>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Menu Headings</h4>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#headingModal"
            onClick={openAddHeadingModal}
          >
            <FaPlus className="me-2" /> Add Heading
          </button>
        </div>

        {menu.length === 0 && (
          <div className="text-center text-muted py-5 border rounded mb-4">
            No menu headings yet. Click <strong>Add Heading</strong> to create the first one.
          </div>
        )}

        {menu.map((heading, menuIndex) => (
          <div className="card shadow-sm border-0 mb-4" key={menuIndex}>
            <div className="card-body">
              {/* Heading row */}
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                <div>
                  <h5 className="fw-bold mb-1">{heading.label}</h5>
                  {heading.href ? (
                    <div className="text-muted small">Direct link: {heading.href}</div>
                  ) : (
                    <div className="text-muted small">No direct link (dropdown only)</div>
                  )}
                </div>

                <div className="d-flex align-items-center gap-1">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    title="Move up"
                    onClick={() => moveHeading(menuIndex, -1)}
                    disabled={menuIndex === 0}
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    title="Move down"
                    onClick={() => moveHeading(menuIndex, 1)}
                    disabled={menuIndex === menu.length - 1}
                  >
                    <FaArrowDown />
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#headingModal"
                    onClick={() => openEditHeadingModal(heading, menuIndex)}
                  >
                    <FaEdit className="me-1" /> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteHeading(menuIndex)}
                    disabled={savingIndex === menuIndex}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Dropdown items table */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted small fw-bold text-uppercase">Dropdown Items</span>
                <button
                  className="btn btn-sm btn-outline-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#itemModal"
                  onClick={() => openAddItemModal(menuIndex)}
                >
                  <FaPlus className="me-1" /> Add Item
                </button>
              </div>

              {(heading.dropdown || []).length === 0 ? (
                <div className="text-muted small mb-3">No dropdown items under this heading.</div>
              ) : (
                <div className="table-responsive mb-3">
                  <table className="table table-sm table-striped table-bordered align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th width="60">Order</th>
                        <th>Name</th>
                        <th>Link</th>
                        <th width="220">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {heading.dropdown.map((item, itemIndex) => (
                        <tr key={itemIndex}>
                          <td>{itemIndex + 1}</td>
                          <td>{item.label}</td>
                          <td className="text-muted small">{item.href}</td>
                          <td>
                            <div className="d-flex align-items-center gap-1">
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                title="Move up"
                                onClick={() => moveItem(menuIndex, itemIndex, -1)}
                                disabled={itemIndex === 0}
                              >
                                <FaArrowUp />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                title="Move down"
                                onClick={() => moveItem(menuIndex, itemIndex, 1)}
                                disabled={itemIndex === heading.dropdown.length - 1}
                              >
                                <FaArrowDown />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#itemModal"
                                onClick={() => openEditItemModal(menuIndex, item, itemIndex)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteItem(menuIndex, itemIndex)}
                                disabled={savingIndex === menuIndex}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Per-section Save button */}
              <div className="d-flex justify-content-end border-top pt-3">
                <button
                  className="btn btn-success"
                  disabled={savingIndex === menuIndex}
                  onClick={() => saveSection(menuIndex)}
                >
                  <FaSave className="me-2" />
                  {savingIndex === menuIndex ? "Saving..." : `Save "${heading.label}" Section`}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Heading Add/Edit Modal */}
      <div className="modal fade" id="headingModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                {headingForm.menu_index === null ? "Add Heading" : "Edit Heading"}
              </h1>
              <button
                type="button"
                className="btn-close"
                id="headingModalClose"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleHeadingFormSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Heading Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="label"
                    placeholder="e.g. Design Ideas"
                    value={headingForm.label}
                    onChange={handleHeadingFormChange}
                    required
                  />
                </div>

                <div className="mb-1">
                  <label className="form-label">Direct Link (optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="href"
                    placeholder="e.g. /about-us/ — leave blank if this heading only opens a dropdown"
                    value={headingForm.href}
                    onChange={handleHeadingFormChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary px-4" type="submit">
                  {headingForm.menu_index === null ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Dropdown Item Add/Edit Modal */}
      <div className="modal fade" id="itemModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                {itemForm.item_index === null ? "Add Dropdown Item" : "Edit Dropdown Item"}
              </h1>
              <button
                type="button"
                className="btn-close"
                id="itemModalClose"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleItemFormSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Page Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="label"
                    placeholder="e.g. Design Gallery"
                    value={itemForm.label}
                    onChange={handleItemFormChange}
                    required
                  />
                </div>

                <div className="mb-1">
                  <label className="form-label">Link</label>
                  <input
                    type="text"
                    className="form-control"
                    name="href"
                    placeholder="e.g. /design-idea/"
                    value={itemForm.href}
                    onChange={handleItemFormChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary px-4" type="submit">
                  {itemForm.item_index === null ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthMainLayout>
  );
}
