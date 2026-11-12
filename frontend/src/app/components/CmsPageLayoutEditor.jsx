"use client";
// One panel that edits all the extra layout sections of a custom CMS page
// (same sections and options as the city pages; the gallery is URL-only here).
// Put at: src/app/components/CmsPageLayoutEditor.jsx
//
// value / onChange work with the state object from  pageSettingsToState()  (see "@/utils/cmsPageSettings").
import React, { useState } from "react";
import SectionOrderManager from "@/app/components/SectionOrderManager";
import {
    ProcessEditor,
    ProjectsHeadingEditor,
    ProjectGalleryEditor,
    BlogsHeadingEditor,
    StatsEditor,
    WhyChooseEditor,
    FaqsEditor,
    SiteVisitEditor,
    PromiseEditor,
    LinkRowsEditor,
} from "@/app/components/CityContentEditor";
import { PAGE_SECTIONS } from "@/utils/cmsPageSettings";

const TABS = [
    { id: "sections", label: "Page Sections" },
    { id: "sidebar", label: "Sidebar & Cities" },
    { id: "order", label: "Section Order" },
];

/**
 * Heading / label / intro of the FAQ accordion. Meant for the top of the page's own "FAQs" tab
 * (the questions and answers are edited there). The heading is always left-aligned.
 */
export function CmsFaqHeadingEditor({ value, onChange }) {
    const updateFaqs = (section, patch) =>
        onChange({ ...value, content: { ...value.content, [section]: { ...value.content[section], ...patch } } });
    return (
        <FaqsEditor
            value={value.content.faqs}
            onChange={updateFaqs}
            showItems={false}
            showAlign={false}
            showNote={false}
            subtitle="Heading shown above the FAQ accordion on the page. Use {city} to insert the page name."
        />
    );
}

export default function CmsPageLayoutEditor({ value, onChange }) {
    const [tab, setTab] = useState("sections");
    const set = (name, next) => onChange({ ...value, [name]: next });
    const updateContent = (section, patch) =>
        onChange({ ...value, content: { ...value.content, [section]: { ...value.content[section], ...patch } } });
    const pane = (id) => (tab === id ? "" : "d-none");

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

            <div className={pane("sections")}>
                <div className="row">
                    <ProcessEditor value={value.content.process} onChange={updateContent} />
                    <ProjectsHeadingEditor value={value.content.projects} onChange={updateContent} />
                    {/* no onUpload => URL-only gallery */}
                    <ProjectGalleryEditor
                        items={value.content.projects.gallery}
                        onChange={(gallery) => updateContent("projects", { gallery })}
                    />
                    <BlogsHeadingEditor value={value.content.blogs} onChange={updateContent} subtitle="Heading above the blog cards (the page shows the latest blog posts)." />
                    <StatsEditor value={value.content.stats} onChange={updateContent} />
                    <WhyChooseEditor value={value.content.whyChoose} onChange={updateContent} />
                </div>
            </div>

            <div className={pane("sidebar")}>
                <div className="row">
                    <SiteVisitEditor settings={value} onChange={set} />
                    <PromiseEditor settings={value} onChange={set} />
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
                        emptyHint="No rows: the page shows its built-in list of cities."
                    />
                    <LinkRowsEditor
                        title="Nearby Cities"
                        subtitle="Image cards at the bottom of the page."
                        sectionTitle={value.nearbyCitiesTitle}
                        onSectionTitle={(next) => set("nearbyCitiesTitle", next)}
                        sectionTag={value.nearbyCitiesTitleTag}
                        onSectionTag={(next) => set("nearbyCitiesTitleTag", next)}
                        rows={value.nearbyCitiesList}
                        onChange={(rows) => set("nearbyCitiesList", rows)}
                        columns={[
                            { key: "name", label: "City name", placeholder: "City name", flex: 1, maxLength: 80 },
                            { key: "url", label: "URL", placeholder: "/interior-designers-in-delhi", flex: 1.2, kind: "path", maxLength: 200 },
                            { key: "image", label: "Image URL", placeholder: "Image URL (optional)", flex: 1.6, kind: "image", maxLength: 500 },
                        ]}
                        newRow={{ name: "", url: "", image: "" }}
                        addLabel="Add City"
                        max={12}
                        hint="Leave the image URL empty to use a default image."
                        emptyHint="No rows: the Nearby Cities strip is not shown on this page."
                    />
                </div>
            </div>

            <div className={pane("order")}>
                <SectionOrderManager value={value.sectionOrder} onChange={(next) => set("sectionOrder", next)} sections={PAGE_SECTIONS} />
            </div>
        </div>
    );
}
