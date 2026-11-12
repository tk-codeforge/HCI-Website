// // Plain module (no "use client") so BOTH the admin page and the public
// // server-rendered city page can import it.
// // Put at: src/utils/citySections.js  (imported as "@/utils/citySections")

// // column: "main" = left 8-col stack, "sidebar" = right sticky stack, "bottom" = full-width strip.
// // The array order below is the DEFAULT order and matches the current live layout.
// export const CITY_SECTIONS = [
//     { key: "main", label: "Main Content (rich text)", column: "main" },
//     { key: "process", label: "Our Proven Design Process", column: "main" },
//     { key: "projects", label: "Interior Project Photos", column: "main" },
//     { key: "blogs", label: "Design Inspiration (blogs)", column: "main" },
//     { key: "stats", label: "Excellence Stats", column: "main" },
//     { key: "whyChoose", label: "What Makes Us the Best Choice", column: "main" },
//     { key: "side", label: "More Content (side description)", column: "main" },
//     { key: "faqs", label: "FAQs / Insights", column: "main" },
//     { key: "siteVisit", label: "Book a Site Visit", column: "sidebar" },
//     { key: "sidebarForm", label: "Enquiry Form", column: "sidebar" },
//     { key: "promise", label: "The Promise", column: "sidebar" },
//     { key: "serviceAreas", label: "Service Areas", column: "sidebar" },
//     { key: "nearbyCities", label: "Nearby Cities", column: "bottom" },
// ];

// export const DEFAULT_SECTION_ORDER = CITY_SECTIONS.map((section) => section.key);

// export const DEFAULT_SECTION_ORDER_STATE = {
//     desktop: DEFAULT_SECTION_ORDER,
//     mobile: DEFAULT_SECTION_ORDER,
// };

// // Drops unknown/duplicate keys and appends any missing ones, so records saved
// // before this feature (or before a new section was added) still work.
// export const normalizeOrder = (order) => {
//     const valid = new Set(DEFAULT_SECTION_ORDER);
//     const seen = new Set();
//     const cleaned = (Array.isArray(order) ? order : []).filter((key) => {
//         if (!valid.has(key) || seen.has(key)) return false;
//         seen.add(key);
//         return true;
//     });
//     return [...cleaned, ...DEFAULT_SECTION_ORDER.filter((key) => !seen.has(key))];
// };

// // Accepts city_settings.sectionOrder (object, JSON string, or undefined).
// export const getSectionOrder = (saved) => {
//     let value = saved;
//     if (typeof value === "string") {
//         try { value = JSON.parse(value); } catch { value = null; }
//     }
//     const safe = value && typeof value === "object" ? value : {};
//     return { desktop: normalizeOrder(safe.desktop), mobile: normalizeOrder(safe.mobile) };
// };




// Plain module (no "use client") so BOTH the admin page and the public server-rendered pages can import it.
// Put at: src/utils/citySections.js  (imported as "@/utils/citySections")

// column: "main" = left 8-col stack, "sidebar" = right sticky stack, "bottom" = full-width strip.
// The array order below is the DEFAULT order and matches the current live layout.
export const CITY_SECTIONS = [
    { key: "main", label: "Main Content (rich text)", column: "main" },
    { key: "process", label: "Our Proven Design Process", column: "main" },
    { key: "projects", label: "Project Photos & Videos", column: "main" },
    { key: "blogs", label: "Design Inspiration (blogs)", column: "main" },
    { key: "stats", label: "Excellence Stats", column: "main" },
    { key: "whyChoose", label: "What Makes Us the Best Choice", column: "main" },
    { key: "side", label: "More Content (side description)", column: "main" },
    { key: "faqs", label: "FAQs / Insights", column: "main" },
    { key: "siteVisit", label: "Book a Site Visit", column: "sidebar" },
    { key: "sidebarForm", label: "Enquiry Form", column: "sidebar" },
    { key: "promise", label: "The Promise", column: "sidebar" },
    { key: "serviceAreas", label: "Service Areas", column: "sidebar" },
    { key: "nearbyCities", label: "Nearby Cities", column: "bottom" },
];

// Builds the order helpers for any list of sections (city pages and CMS pages use different lists).
export const createSectionTools = (sections) => {
    const keys = sections.map((section) => section.key);

    // Drops unknown/duplicate keys and appends any missing ones, so records saved
    // before a section existed (or before this feature) still produce a complete list.
    const normalizeOrder = (order) => {
        const valid = new Set(keys);
        const seen = new Set();
        const cleaned = (Array.isArray(order) ? order : []).filter((key) => {
            if (!valid.has(key) || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
        return [...cleaned, ...keys.filter((key) => !seen.has(key))];
    };

    // Accepts a saved sectionOrder (object, JSON string, or undefined).
    const getSectionOrder = (saved) => {
        let value = saved;
        if (typeof value === "string") {
            try { value = JSON.parse(value); } catch { value = null; }
        }
        const safe = value && typeof value === "object" ? value : {};
        return { desktop: normalizeOrder(safe.desktop), mobile: normalizeOrder(safe.mobile) };
    };

    return {
        sections,
        DEFAULT_ORDER: keys,
        DEFAULT_ORDER_STATE: { desktop: keys, mobile: keys },
        normalizeOrder,
        getSectionOrder,
    };
};

const cityTools = createSectionTools(CITY_SECTIONS);

export const DEFAULT_SECTION_ORDER = cityTools.DEFAULT_ORDER;
export const DEFAULT_SECTION_ORDER_STATE = cityTools.DEFAULT_ORDER_STATE;
export const normalizeOrder = cityTools.normalizeOrder;
export const getSectionOrder = cityTools.getSectionOrder;