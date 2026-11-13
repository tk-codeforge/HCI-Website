// Layout settings for blog posts: FAQ accordion, sidebar (Related Articles + Service Areas with heading tags) and drag-and-drop order.
// Plain module: usable from the server-rendered page ([blog]/page.jsx) AND from the admin editor (cms/blog).
// Put at: src/utils/blogSettings.js   (import as "@/utils/blogSettings")
//
// Where the settings are stored: no backend change is needed. They travel inside the blog's existing
// `description` as ONE hidden HTML comment at the very end:   <!--hc-blog-settings:{...json...}-->
// The admin splits it off before the text editor sees the description (splitBlogSettings) and adds it back
// when saving (joinBlogSettings). The public page strips it before showing the article. A blog without
// saved settings has no comment at all and looks exactly like before.
import { createSectionTools } from "@/utils/citySections";
import { getCityContent, prepareContentForSave } from "@/utils/cityContent";
import { rowsToEntries } from "@/utils/cmsPageSettings";

export const BLOG_SETTINGS_MARKER = "hc-blog-settings";

// Default text of the FAQ block on a blog post
export const BLOG_CONTENT_DEFAULTS = { faqs: { title: "FAQ's" } };

// Only the sections the blog page really has. The array order is the DEFAULT order and matches the
// current live page: article, FAQs, then the sidebar with Enquiry Form, Related Articles, Service Areas.
export const BLOG_SECTIONS = [
    { key: "main", label: "Article (title, image & text)", column: "main" },
    { key: "faqs", label: "FAQs (accordion)", column: "main" },
    { key: "sidebarForm", label: "Enquiry Form", column: "sidebar" },
    { key: "related", label: "Related Articles", column: "sidebar" },
    { key: "serviceAreas", label: "Service Areas", column: "sidebar" },
];

const blogTools = createSectionTools(BLOG_SECTIONS);
export const DEFAULT_BLOG_ORDER_STATE = blogTools.DEFAULT_ORDER_STATE;
export const normalizeBlogOrder = blogTools.normalizeOrder;
export const getBlogSectionOrder = blogTools.getSectionOrder;

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);
const MARKER_RE = new RegExp(`\\s*<!--${BLOG_SETTINGS_MARKER}:([\\s\\S]*?)-->`, "g");

// JSON that can never contain "<", ">" or "--" (so it cannot end the comment or look like a tag)
const escapeForComment = (json) => json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/-/g, "\\u002d");

/** description (html + optional hidden settings comment) -> { html, settings } */
export const splitBlogSettings = (raw) => {
    if (typeof raw !== "string") return { html: raw ?? "", settings: {} };
    let settings = {};
    const html = raw.replace(MARKER_RE, (_, json) => {
        try {
            const parsed = JSON.parse(json);
            if (isObject(parsed)) settings = parsed;
        } catch { /* a damaged comment is simply ignored */ }
        return "";
    });
    return { html, settings };
};

/* ---------- editor state <-> stored settings ---------- */

export const MAX_RELATED_BLOGS = 6;

/** stored settings (or nothing) -> flat state object used by the admin editors */
export const blogSettingsToState = (stored) => {
    const settings = isObject(stored) ? stored : {};
    return {
        // only content.faqs is used on blogs
        content: getCityContent({ faqs: settings.faqs }, BLOG_CONTENT_DEFAULTS),
        relatedTitle: settings.relatedTitle || "Related Articles",
        relatedTitleTag: settings.relatedTitleTag || "h4",
        // blogs ticked for the sidebar (empty = the latest four blogs, as before)
        relatedBlogIds: (Array.isArray(settings.relatedBlogIds) ? settings.relatedBlogIds : []).map((id) => String(id)).slice(0, MAX_RELATED_BLOGS),
        serviceAreasTitle: settings.serviceAreasTitle || "Service Areas",
        serviceAreasTitleTag: settings.serviceAreasTitleTag || "h4",
        // empty list = the page shows its built-in list of cities
        serviceAreasList: (Array.isArray(settings.serviceAreas) ? settings.serviceAreas : []).map((a) => ({ name: a?.name || "", url: a?.url || "" })),
        sectionOrder: getBlogSectionOrder(settings.sectionOrder),
    };
};

export const DEFAULT_BLOG_STATE = blogSettingsToState({});

/** flat editor state -> the object that is stored in the hidden comment */
export const stateToBlogSettings = (state) => {
    const s = state || DEFAULT_BLOG_STATE;
    const faqs = { ...prepareContentForSave(s.content).faqs, headingAlign: "left" };
    return {
        faqs,
        relatedTitle: s.relatedTitle,
        relatedTitleTag: s.relatedTitleTag,
        relatedBlogIds: (Array.isArray(s.relatedBlogIds) ? s.relatedBlogIds : []).map((id) => String(id)).slice(0, MAX_RELATED_BLOGS),
        serviceAreasTitle: s.serviceAreasTitle,
        serviceAreasTitleTag: s.serviceAreasTitleTag,
        serviceAreas: rowsToEntries(s.serviceAreasList, false),
        sectionOrder: {
            desktop: blogTools.normalizeOrder(s.sectionOrder?.desktop),
            mobile: blogTools.normalizeOrder(s.sectionOrder?.mobile),
        },
    };
};

/**
 * What to save in `description`: the article html, plus the settings comment ONLY when the settings differ
 * from the defaults (an untouched blog stores nothing extra, and resetting everything removes the comment).
 */
export const joinBlogSettings = (html, state) => {
    const base = String(html ?? "");
    const settings = stateToBlogSettings(state);
    const isDefault = JSON.stringify(settings) === JSON.stringify(stateToBlogSettings(DEFAULT_BLOG_STATE));
    if (isDefault) return base;
    return `${base}\n<!--${BLOG_SETTINGS_MARKER}:${escapeForComment(JSON.stringify(settings))}-->`;
};