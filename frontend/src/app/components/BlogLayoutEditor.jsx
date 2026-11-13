"use client";
// Admin panel for the extra sections of a blog post: FAQ accordion, sidebar blocks (with heading tags)
// and the drag-and-drop section order (desktop and mobile saved separately).
// Same editors as the city / custom pages. Put at: src/app/components/BlogLayoutEditor.jsx
//
// value / onChange work with the state object from  blogSettingsToState()  (see "@/utils/blogSettings").
import React, { useState } from "react";
import SectionOrderManager from "@/app/components/SectionOrderManager";
import { FaqsEditor, LinkRowsEditor } from "@/app/components/CityContentEditor";
import { BLOG_SECTIONS, MAX_RELATED_BLOGS } from "@/utils/blogSettings";
import { HEADING_TAG_OPTIONS } from "@/utils/cityContent";

const TABS = [
    { id: "faqs", label: "FAQs" },
    { id: "sidebar", label: "Sidebar" },
    { id: "order", label: "Section Order" },
];

// blogsList: the published blogs that can be ticked for the sidebar "Related Articles"
export default function BlogLayoutEditor({ value, onChange, blogsList = [] }) {
    const [tab, setTab] = useState("faqs");
    const set = (name, next) => onChange({ ...value, [name]: next });
    const updateContent = (section, patch) =>
        onChange({ ...value, content: { ...value.content, [section]: { ...value.content[section], ...patch } } });
    const pane = (id) => (tab === id ? "" : "d-none");
    const selectedBlogIds = Array.isArray(value.relatedBlogIds) ? value.relatedBlogIds.map(String) : [];
    const toggleBlog = (blogId) => {
        const id = String(blogId);
        set(
            "relatedBlogIds",
            selectedBlogIds.includes(id)
                ? selectedBlogIds.filter((selected) => selected !== id)
                : (selectedBlogIds.length >= MAX_RELATED_BLOGS ? selectedBlogIds : [...selectedBlogIds, id])
        );
    };

    return (
        <div>
            <ul className="nav nav-pills gap-2 mb-4 flex-wrap" role="tablist">
                {TABS.map((item) => (
                    <li className="nav-item" key={item.id}>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={tab === item.id}
                            className={`nav-link border ${tab === item.id ? "active fw-bold" : "bg-white text-dark"}`}
                            onClick={() => setTab(item.id)}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>

            <div className={pane("faqs")}>
                <FaqsEditor
                    value={value.content.faqs}
                    onChange={updateContent}
                    showAlign={false}
                    subtitle="Shown as an accordion under the article. If you add no questions, nothing is shown."
                />
            </div>

            <div className={pane("sidebar")}>
                <div className="row">
                    <div className="col-12">
                        <div className="card mb-3">
                            <div className="card-header bg-light">
                                <strong>Sidebar: Related Articles</strong>
                                <div className="small text-muted">Blogs listed in the sidebar. Tick up to {MAX_RELATED_BLOGS}; if none are ticked, the latest four blogs are shown.</div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="mb-0 col-md-9">
                                        <label className="form-label">Section Heading</label>
                                        <input className="form-control" maxLength={80} value={value.relatedTitle} onChange={(event) => set("relatedTitle", event.target.value)} />
                                    </div>
                                    <div className="mb-0 col-md-3">
                                        <label className="form-label">Heading Tag</label>
                                        <select className="form-select" value={value.relatedTitleTag} onChange={(event) => set("relatedTitleTag", event.target.value)}>
                                            {HEADING_TAG_OPTIONS.map((tag) => (
                                                <option key={tag} value={tag}>{tag.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <label className="form-label">Blogs to show ({selectedBlogIds.length}/{MAX_RELATED_BLOGS})</label>
                                        {blogsList.length ? (
                                            <div className="row border rounded p-3 mx-0" style={{ maxHeight: "260px", overflowY: "auto" }}>
                                                {blogsList.map((blog) => {
                                                    const checked = selectedBlogIds.includes(String(blog.id));
                                                    return (
                                                        <div className="col-md-6 form-check mb-2" key={blog.id}>
                                                            <input
                                                                className="form-check-input"
                                                                id={`related-blog-${blog.id}`}
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => toggleBlog(blog.id)}
                                                                disabled={!checked && selectedBlogIds.length >= MAX_RELATED_BLOGS}
                                                            />
                                                            <label className="form-check-label" htmlFor={`related-blog-${blog.id}`}>{blog.title || `Blog #${blog.id}`}</label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : <div className="alert alert-light border small mb-0">No published blogs found. The latest four blogs stay in the sidebar.</div>}
                                        <small className="text-muted">Only published blogs are listed.</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <LinkRowsEditor
                        title="Sidebar: Service Areas"
                        subtitle="Links listed in the sidebar. Only internal paths that start with / are used."
                        sectionTitle={value.serviceAreasTitle}
                        onSectionTitle={(next) => set("serviceAreasTitle", next)}
                        sectionTag={value.serviceAreasTitleTag}
                        onSectionTag={(next) => set("serviceAreasTitleTag", next)}
                        rows={value.serviceAreasList}
                        onChange={(rows) => set("serviceAreasList", rows)}
                        columns={[
                            { key: "name", label: "City name", placeholder: "City name", flex: 1, maxLength: 80 },
                            { key: "url", label: "URL", placeholder: "/interior-designers-in-noida", flex: 1.2, kind: "path", maxLength: 200 },
                        ]}
                        newRow={{ name: "", url: "" }}
                        addLabel="Add Area"
                        max={60}
                        twoUp
                        emptyHint="No rows: the blog shows its built-in list of cities."
                    />
                </div>
            </div>

            <div className={pane("order")}>
                <SectionOrderManager value={value.sectionOrder} onChange={(next) => set("sectionOrder", next)} sections={BLOG_SECTIONS} />
            </div>
        </div>
    );
}
