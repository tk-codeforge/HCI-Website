// // // Layout settings for custom CMS pages (the [blog]/page.jsx "cms-page" branch).
// // // Plain module: usable from the server-rendered page AND from the admin editor.
// // // Put at: src/utils/cmsPageSettings.js   (import as "@/utils/cmsPageSettings")
// // //
// // // Where the settings are stored: no backend change is needed. They travel inside the page's existing
// // // `content_blocks` JSON as ONE reserved block   { type: "page_settings", data: { ... } }.
// // // splitPageSettings() takes that block out (so the Content Blocks list never shows it) and
// // // joinPageSettings() puts it back when saving.
// // import { createSectionTools } from "@/utils/citySections";
// // import { getCityContent, prepareContentForSave } from "@/utils/cityContent";

// // export const PAGE_SETTINGS_BLOCK_TYPE = "page_settings";

// // // Default text differences between a city page and a custom page
// // export const PAGE_CONTENT_DEFAULTS = { faqs: { title: "FAQ's" } };

// // export const PAGE_SECTIONS = [
// //     { key: "main", label: "Main Content (rich text)", column: "main" },
// //     { key: "process", label: "Our Proven Design Process", column: "main" },
// //     { key: "projects", label: "Project Photos & Videos", column: "main" },
// //     { key: "blogs", label: "Design Inspiration (blogs)", column: "main" },
// //     { key: "stats", label: "Excellence Stats", column: "main" },
// //     { key: "whyChoose", label: "What Makes Us the Best Choice", column: "main" },
// //     { key: "contentBlocks", label: "Content Blocks (testimonial / service / counter)", column: "main" },
// //     { key: "accordions", label: "Additional Information (accordions)", column: "main" },
// //     { key: "faqs", label: "FAQs", column: "main" },
// //     { key: "siteVisit", label: "Book a Site Visit", column: "sidebar" },
// //     { key: "sidebarForm", label: "Enquiry Form", column: "sidebar" },
// //     { key: "promise", label: "The Promise", column: "sidebar" },
// //     { key: "serviceAreas", label: "Service Areas", column: "sidebar" },
// //     { key: "nearbyCities", label: "Nearby Cities", column: "bottom" },
// // ];

// // const pageTools = createSectionTools(PAGE_SECTIONS);
// // export const DEFAULT_PAGE_ORDER_STATE = pageTools.DEFAULT_ORDER_STATE;
// // export const normalizePageOrder = pageTools.normalizeOrder;
// // export const getPageSectionOrder = pageTools.getSectionOrder;

// // const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

// // const parseArray = (value) => {
// //     if (Array.isArray(value)) return value;
// //     if (typeof value === "string" && value.trim()) {
// //         try {
// //             const parsed = JSON.parse(value);
// //             return Array.isArray(parsed) ? parsed : [];
// //         } catch {
// //             return [];
// //         }
// //     }
// //     return [];
// // };

// // /** content_blocks (array or JSON string) -> { blocks: real content blocks, settings: stored page settings } */
// // export const splitPageSettings = (rawBlocks) => {
// //     const all = parseArray(rawBlocks);
// //     let settings = {};
// //     let found = false;
// //     const blocks = [];
// //     for (const block of all) {
// //         if (block && block.type === PAGE_SETTINGS_BLOCK_TYPE) {
// //             if (!found && isObject(block.data)) settings = block.data;
// //             found = true;
// //         } else {
// //             blocks.push(block);
// //         }
// //     }
// //     return { blocks, settings };
// // };

// // /** real content blocks + settings -> the array to save in content_blocks */
// // export const joinPageSettings = (blocks, settings) => [
// //     ...parseArray(blocks).filter((block) => !(block && block.type === PAGE_SETTINGS_BLOCK_TYPE)),
// //     { type: PAGE_SETTINGS_BLOCK_TYPE, data: settings },
// // ];

// // /* ---------- editor state <-> stored settings ---------- */

// // export const DEFAULT_PROMISE_ITEMS = [
// //     { iconName: "FaCheckCircle", title: "Transparent Pricing", description: "No hidden costs, ever." },
// //     { iconName: "FaTools", title: "In-House Execution", description: "No third-party contractors involved." },
// // ];

// // const isInternalPath = (value) => {
// //     const path = String(value || "").trim();
// //     return path.startsWith("/") && !path.startsWith("//");
// // };
// // const cleanRows = (rows) => (Array.isArray(rows) ? rows : []).map((row) => ({
// //     name: String(row?.name || "").trim(),
// //     url: String(row?.url || "").trim(),
// //     image: String(row?.image || "").trim(),
// // }));
// // export const rowsToEntries = (rows, includeImage = false) => cleanRows(rows)
// //     .filter((row) => row.name && isInternalPath(row.url))
// //     .map((row) => (includeImage ? row : { name: row.name, url: row.url }));
// // export const countFilledRows = (rows) => cleanRows(rows).filter((row) => row.name || row.url || row.image).length;

// // /** stored settings (or nothing) -> flat state object used by the admin editors */
// // export const pageSettingsToState = (stored) => {
// //     const settings = isObject(stored) ? stored : {};
// //     const visit = isObject(settings.siteVisit) ? settings.siteVisit : {};
// //     const promises = Array.isArray(settings.promiseItems) && settings.promiseItems.length ? settings.promiseItems : DEFAULT_PROMISE_ITEMS;
// //     return {
// //         content: getCityContent(settings.content, PAGE_CONTENT_DEFAULTS),
// //         siteVisitTitle: visit.title || "Book a Site Visit",
// //         siteVisitTitleTag: visit.titleTag || "h4",
// //         siteVisitDescription: visit.description || "Expert designers will visit your {city} property.",
// //         siteVisitButtonText: visit.buttonText || "Schedule Now",
// //         siteVisitButtonUrl: visit.buttonUrl || "/contact",
// //         promiseTitle: settings.promiseTitle || "The Promise",
// //         promiseTitleTag: settings.promiseTitleTag || "h4",
// //         promiseItems: promises.slice(0, 8).map((item, index) => ({
// //             iconName: item?.iconName || DEFAULT_PROMISE_ITEMS[index]?.iconName || (index === 0 ? "FaCheckCircle" : "FaTools"),
// //             title: item?.title || "",
// //             description: item?.description || "",
// //         })),
// //         serviceAreasTitle: settings.serviceAreasTitle || "Service Areas",
// //         serviceAreasTitleTag: settings.serviceAreasTitleTag || "h4",
// //         // empty list = the page shows its built-in list of cities
// //         serviceAreasList: (Array.isArray(settings.serviceAreas) ? settings.serviceAreas : []).map((a) => ({ name: a?.name || "", url: a?.url || "" })),
// //         nearbyCitiesTitle: settings.nearbyCitiesTitle || "Nearby Cities",
// //         nearbyCitiesTitleTag: settings.nearbyCitiesTitleTag || "h2",
// //         // empty list = the Nearby Cities strip is not shown
// //         nearbyCitiesList: (Array.isArray(settings.nearbyCities) ? settings.nearbyCities : []).map((c) => ({ name: c?.name || "", url: c?.url || "", image: c?.image || "" })),
// //         sectionOrder: getPageSectionOrder(settings.sectionOrder),
// //     };
// // };

// // export const DEFAULT_PAGE_STATE = pageSettingsToState({});

// // /** flat editor state -> the object that is stored in the reserved content block */
// // export const stateToPageSettings = (state) => {
// //     const s = state || DEFAULT_PAGE_STATE;
// //     return {
// //         content: prepareContentForSave(s.content),
// //         siteVisit: {
// //             title: s.siteVisitTitle,
// //             titleTag: s.siteVisitTitleTag,
// //             description: s.siteVisitDescription,
// //             buttonText: s.siteVisitButtonText,
// //             buttonUrl: s.siteVisitButtonUrl,
// //         },
// //         promiseTitle: s.promiseTitle,
// //         promiseTitleTag: s.promiseTitleTag,
// //         promiseItems: (s.promiseItems || [])
// //             .filter((item) => (item.title || "").trim() || (item.description || "").trim())
// //             .map((item) => ({ iconName: item.iconName, title: (item.title || "").trim(), description: (item.description || "").trim() })),
// //         serviceAreasTitle: s.serviceAreasTitle,
// //         serviceAreasTitleTag: s.serviceAreasTitleTag,
// //         serviceAreas: rowsToEntries(s.serviceAreasList, false),
// //         nearbyCitiesTitle: s.nearbyCitiesTitle,
// //         nearbyCitiesTitleTag: s.nearbyCitiesTitleTag,
// //         nearbyCities: rowsToEntries(s.nearbyCitiesList, true),
// //         sectionOrder: {
// //             desktop: pageTools.normalizeOrder(s.sectionOrder?.desktop),
// //             mobile: pageTools.normalizeOrder(s.sectionOrder?.mobile),
// //         },
// //     };
// // };

// // /**
// //  * What to save in content_blocks: the page's real blocks, plus the layout settings block ONLY when the
// //  * layout differs from the defaults (an untouched layout stores nothing, and resetting it removes the block).
// //  */
// // export const buildContentBlocks = (blocks, state) => {
// //     const real = parseArray(blocks).filter((block) => !(block && block.type === PAGE_SETTINGS_BLOCK_TYPE));
// //     const settings = stateToPageSettings(state);
// //     const isDefault = JSON.stringify(settings) === JSON.stringify(stateToPageSettings(DEFAULT_PAGE_STATE));
// //     return isDefault ? real : [...real, { type: PAGE_SETTINGS_BLOCK_TYPE, data: settings }];
// // };



// // Layout settings for custom CMS pages (the [blog]/page.jsx "cms-page" branch).
// // Plain module: usable from the server-rendered page AND from the admin editor.
// // Put at: src/utils/cmsPageSettings.js   (import as "@/utils/cmsPageSettings")
// //
// // Where the settings are stored: no backend change is needed. They travel inside the page's existing
// // `content_blocks` JSON as ONE reserved block   { type: "page_settings", data: { ... } }.
// // splitPageSettings() takes that block out (so the Content Blocks list never shows it) and
// // joinPageSettings() puts it back when saving.
// import { createSectionTools } from "@/utils/citySections";
// import { getCityContent, prepareContentForSave } from "@/utils/cityContent";

// export const PAGE_SETTINGS_BLOCK_TYPE = "page_settings";

// // Default text differences between a city page and a custom page
// export const PAGE_CONTENT_DEFAULTS = { faqs: { title: "FAQ's" } };

// export const PAGE_SECTIONS = [
//     { key: "main", label: "Main Content (rich text)", column: "main" },
//     { key: "process", label: "Our Proven Design Process", column: "main" },
//     { key: "projects", label: "Project Photos & Videos", column: "main" },
//     { key: "blogs", label: "Design Inspiration (blogs)", column: "main" },
//     { key: "stats", label: "Excellence Stats", column: "main" },
//     { key: "whyChoose", label: "What Makes Us the Best Choice", column: "main" },
//     { key: "contentBlocks", label: "Content Blocks (testimonial / service / counter)", column: "main" },
//     { key: "accordions", label: "Additional Information (accordions)", column: "main" },
//     { key: "faqs", label: "FAQs", column: "main" },
//     { key: "siteVisit", label: "Book a Site Visit", column: "sidebar" },
//     { key: "sidebarForm", label: "Enquiry Form", column: "sidebar" },
//     { key: "promise", label: "The Promise", column: "sidebar" },
//     { key: "serviceAreas", label: "Service Areas", column: "sidebar" },
//     { key: "nearbyCities", label: "Nearby Cities", column: "bottom" },
// ];

// const pageTools = createSectionTools(PAGE_SECTIONS);
// export const DEFAULT_PAGE_ORDER_STATE = pageTools.DEFAULT_ORDER_STATE;
// export const normalizePageOrder = pageTools.normalizeOrder;
// export const getPageSectionOrder = pageTools.getSectionOrder;

// const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

// const parseArray = (value) => {
//     if (Array.isArray(value)) return value;
//     if (typeof value === "string" && value.trim()) {
//         try {
//             const parsed = JSON.parse(value);
//             return Array.isArray(parsed) ? parsed : [];
//         } catch {
//             return [];
//         }
//     }
//     return [];
// };

// /** content_blocks (array or JSON string) -> { blocks: real content blocks, settings: stored page settings } */
// export const splitPageSettings = (rawBlocks) => {
//     const all = parseArray(rawBlocks);
//     let settings = {};
//     let found = false;
//     const blocks = [];
//     for (const block of all) {
//         if (block && block.type === PAGE_SETTINGS_BLOCK_TYPE) {
//             if (!found && isObject(block.data)) settings = block.data;
//             found = true;
//         } else {
//             blocks.push(block);
//         }
//     }
//     return { blocks, settings };
// };

// /** real content blocks + settings -> the array to save in content_blocks */
// export const joinPageSettings = (blocks, settings) => [
//     ...parseArray(blocks).filter((block) => !(block && block.type === PAGE_SETTINGS_BLOCK_TYPE)),
//     { type: PAGE_SETTINGS_BLOCK_TYPE, data: settings },
// ];

// /* ---------- editor state <-> stored settings ---------- */

// export const DEFAULT_PROMISE_ITEMS = [
//     { iconName: "FaCheckCircle", title: "Transparent Pricing", description: "No hidden costs, ever." },
//     { iconName: "FaTools", title: "In-House Execution", description: "No third-party contractors involved." },
// ];

// const isInternalPath = (value) => {
//     const path = String(value || "").trim();
//     return path.startsWith("/") && !path.startsWith("//");
// };
// const cleanRows = (rows) => (Array.isArray(rows) ? rows : []).map((row) => ({
//     name: String(row?.name || "").trim(),
//     url: String(row?.url || "").trim(),
//     image: String(row?.image || "").trim(),
// }));
// export const rowsToEntries = (rows, includeImage = false) => cleanRows(rows)
//     .filter((row) => row.name && isInternalPath(row.url))
//     .map((row) => (includeImage ? row : { name: row.name, url: row.url }));
// export const countFilledRows = (rows) => cleanRows(rows).filter((row) => row.name || row.url || row.image).length;

// /** stored settings (or nothing) -> flat state object used by the admin editors */
// export const pageSettingsToState = (stored) => {
//     const settings = isObject(stored) ? stored : {};
//     const visit = isObject(settings.siteVisit) ? settings.siteVisit : {};
//     const promises = Array.isArray(settings.promiseItems) && settings.promiseItems.length ? settings.promiseItems : DEFAULT_PROMISE_ITEMS;
//     return {
//         content: getCityContent(settings.content, PAGE_CONTENT_DEFAULTS),
//         // optional hero banner used on phones (below 768px); the alt text is the page's banner alt text
//         mobileBannerImage: typeof settings.mobileBannerImage === "string" ? settings.mobileBannerImage.trim() : "",
//         siteVisitTitle: visit.title || "Book a Site Visit",
//         siteVisitTitleTag: visit.titleTag || "h4",
//         siteVisitDescription: visit.description || "Expert designers will visit your {city} property.",
//         siteVisitButtonText: visit.buttonText || "Schedule Now",
//         siteVisitButtonUrl: visit.buttonUrl || "/contact",
//         promiseTitle: settings.promiseTitle || "The Promise",
//         promiseTitleTag: settings.promiseTitleTag || "h4",
//         promiseItems: promises.slice(0, 8).map((item, index) => ({
//             iconName: item?.iconName || DEFAULT_PROMISE_ITEMS[index]?.iconName || (index === 0 ? "FaCheckCircle" : "FaTools"),
//             title: item?.title || "",
//             description: item?.description || "",
//         })),
//         serviceAreasTitle: settings.serviceAreasTitle || "Service Areas",
//         serviceAreasTitleTag: settings.serviceAreasTitleTag || "h4",
//         // empty list = the page shows its built-in list of cities
//         serviceAreasList: (Array.isArray(settings.serviceAreas) ? settings.serviceAreas : []).map((a) => ({ name: a?.name || "", url: a?.url || "" })),
//         nearbyCitiesTitle: settings.nearbyCitiesTitle || "Nearby Cities",
//         nearbyCitiesTitleTag: settings.nearbyCitiesTitleTag || "h2",
//         // empty list = the Nearby Cities strip is not shown
//         nearbyCitiesList: (Array.isArray(settings.nearbyCities) ? settings.nearbyCities : []).map((c) => ({ name: c?.name || "", url: c?.url || "", image: c?.image || "" })),
//         sectionOrder: getPageSectionOrder(settings.sectionOrder),
//     };
// };

// export const DEFAULT_PAGE_STATE = pageSettingsToState({});

// /** flat editor state -> the object that is stored in the reserved content block */
// export const stateToPageSettings = (state) => {
//     const s = state || DEFAULT_PAGE_STATE;
//     const content = prepareContentForSave(s.content);
//     // custom pages always show the FAQ heading left-aligned (no alignment option)
//     content.faqs = { ...content.faqs, headingAlign: "left" };
//     return {
//         content,
//         mobileBannerImage: String(s.mobileBannerImage || "").trim(),
//         siteVisit: {
//             title: s.siteVisitTitle,
//             titleTag: s.siteVisitTitleTag,
//             description: s.siteVisitDescription,
//             buttonText: s.siteVisitButtonText,
//             buttonUrl: s.siteVisitButtonUrl,
//         },
//         promiseTitle: s.promiseTitle,
//         promiseTitleTag: s.promiseTitleTag,
//         promiseItems: (s.promiseItems || [])
//             .filter((item) => (item.title || "").trim() || (item.description || "").trim())
//             .map((item) => ({ iconName: item.iconName, title: (item.title || "").trim(), description: (item.description || "").trim() })),
//         serviceAreasTitle: s.serviceAreasTitle,
//         serviceAreasTitleTag: s.serviceAreasTitleTag,
//         serviceAreas: rowsToEntries(s.serviceAreasList, false),
//         nearbyCitiesTitle: s.nearbyCitiesTitle,
//         nearbyCitiesTitleTag: s.nearbyCitiesTitleTag,
//         nearbyCities: rowsToEntries(s.nearbyCitiesList, true),
//         sectionOrder: {
//             desktop: pageTools.normalizeOrder(s.sectionOrder?.desktop),
//             mobile: pageTools.normalizeOrder(s.sectionOrder?.mobile),
//         },
//     };
// };

// /**
//  * What to save in content_blocks: the page's real blocks, plus the layout settings block ONLY when the
//  * layout differs from the defaults (an untouched layout stores nothing, and resetting it removes the block).
//  */
// export const buildContentBlocks = (blocks, state) => {
//     const real = parseArray(blocks).filter((block) => !(block && block.type === PAGE_SETTINGS_BLOCK_TYPE));
//     const settings = stateToPageSettings(state);
//     const isDefault = JSON.stringify(settings) === JSON.stringify(stateToPageSettings(DEFAULT_PAGE_STATE));
//     return isDefault ? real : [...real, { type: PAGE_SETTINGS_BLOCK_TYPE, data: settings }];
// };



// // Layout settings for custom CMS pages (the [blog]/page.jsx "cms-page" branch).
// // Plain module: usable from the server-rendered page AND from the admin editor.
// // Put at: src/utils/cmsPageSettings.js   (import as "@/utils/cmsPageSettings")
// //
// // Where the settings are stored: no backend change is needed. They travel inside the page's existing
// // `content_blocks` JSON as ONE reserved block   { type: "page_settings", data: { ... } }.
// // splitPageSettings() takes that block out (so the Content Blocks list never shows it) and
// // joinPageSettings() puts it back when saving.
// import { createSectionTools } from "@/utils/citySections";
// import { getCityContent, prepareContentForSave } from "@/utils/cityContent";

// export const PAGE_SETTINGS_BLOCK_TYPE = "page_settings";

// // Default text differences between a city page and a custom page
// export const PAGE_CONTENT_DEFAULTS = { faqs: { title: "FAQ's" } };

// export const PAGE_SECTIONS = [
//     { key: "main", label: "Main Content (rich text)", column: "main" },
//     { key: "process", label: "Our Proven Design Process", column: "main" },
//     { key: "projects", label: "Project Photos & Videos", column: "main" },
//     { key: "blogs", label: "Design Inspiration (blogs)", column: "main" },
//     { key: "stats", label: "Excellence Stats", column: "main" },
//     { key: "whyChoose", label: "What Makes Us the Best Choice", column: "main" },
//     { key: "contentBlocks", label: "Content Blocks (testimonial / service / counter)", column: "main" },
//     { key: "accordions", label: "Additional Information (accordions)", column: "main" },
//     { key: "faqs", label: "FAQs", column: "main" },
//     { key: "siteVisit", label: "Book a Site Visit", column: "sidebar" },
//     { key: "sidebarForm", label: "Enquiry Form", column: "sidebar" },
//     { key: "promise", label: "The Promise", column: "sidebar" },
//     { key: "serviceAreas", label: "Service Areas", column: "sidebar" },
//     { key: "nearbyCities", label: "Nearby Cities", column: "bottom" },
// ];

// const pageTools = createSectionTools(PAGE_SECTIONS);
// export const DEFAULT_PAGE_ORDER_STATE = pageTools.DEFAULT_ORDER_STATE;
// export const normalizePageOrder = pageTools.normalizeOrder;
// export const getPageSectionOrder = pageTools.getSectionOrder;

// const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

// const parseArray = (value) => {
//     if (Array.isArray(value)) return value;
//     if (typeof value === "string" && value.trim()) {
//         try {
//             const parsed = JSON.parse(value);
//             return Array.isArray(parsed) ? parsed : [];
//         } catch {
//             return [];
//         }
//     }
//     return [];
// };

// /** content_blocks (array or JSON string) -> { blocks: real content blocks, settings: stored page settings } */
// export const splitPageSettings = (rawBlocks) => {
//     const all = parseArray(rawBlocks);
//     let settings = {};
//     let found = false;
//     const blocks = [];
//     for (const block of all) {
//         if (block && block.type === PAGE_SETTINGS_BLOCK_TYPE) {
//             if (!found && isObject(block.data)) settings = block.data;
//             found = true;
//         } else {
//             blocks.push(block);
//         }
//     }
//     return { blocks, settings };
// };

// /** real content blocks + settings -> the array to save in content_blocks */
// export const joinPageSettings = (blocks, settings) => [
//     ...parseArray(blocks).filter((block) => !(block && block.type === PAGE_SETTINGS_BLOCK_TYPE)),
//     { type: PAGE_SETTINGS_BLOCK_TYPE, data: settings },
// ];

// /* ---------- editor state <-> stored settings ---------- */

// export const DEFAULT_PROMISE_ITEMS = [
//     { iconName: "FaCheckCircle", title: "Transparent Pricing", description: "No hidden costs, ever." },
//     { iconName: "FaTools", title: "In-House Execution", description: "No third-party contractors involved." },
// ];

// const isInternalPath = (value) => {
//     const path = String(value || "").trim();
//     return path.startsWith("/") && !path.startsWith("//");
// };
// const cleanRows = (rows) => (Array.isArray(rows) ? rows : []).map((row) => ({
//     name: String(row?.name || "").trim(),
//     url: String(row?.url || "").trim(),
//     image: String(row?.image || "").trim(),
// }));
// export const rowsToEntries = (rows, includeImage = false) => cleanRows(rows)
//     .filter((row) => row.name && isInternalPath(row.url))
//     .map((row) => (includeImage ? row : { name: row.name, url: row.url }));
// export const countFilledRows = (rows) => cleanRows(rows).filter((row) => row.name || row.url || row.image).length;

// /** stored settings (or nothing) -> flat state object used by the admin editors */
// export const pageSettingsToState = (stored) => {
//     const settings = isObject(stored) ? stored : {};
//     const visit = isObject(settings.siteVisit) ? settings.siteVisit : {};
//     const promises = Array.isArray(settings.promiseItems) && settings.promiseItems.length ? settings.promiseItems : DEFAULT_PROMISE_ITEMS;
//     return {
//         content: getCityContent(settings.content, PAGE_CONTENT_DEFAULTS),
//         siteVisitTitle: visit.title || "Book a Site Visit",
//         siteVisitTitleTag: visit.titleTag || "h4",
//         siteVisitDescription: visit.description || "Expert designers will visit your {city} property.",
//         siteVisitButtonText: visit.buttonText || "Schedule Now",
//         siteVisitButtonUrl: visit.buttonUrl || "/contact",
//         promiseTitle: settings.promiseTitle || "The Promise",
//         promiseTitleTag: settings.promiseTitleTag || "h4",
//         promiseItems: promises.slice(0, 8).map((item, index) => ({
//             iconName: item?.iconName || DEFAULT_PROMISE_ITEMS[index]?.iconName || (index === 0 ? "FaCheckCircle" : "FaTools"),
//             title: item?.title || "",
//             description: item?.description || "",
//         })),
//         serviceAreasTitle: settings.serviceAreasTitle || "Service Areas",
//         serviceAreasTitleTag: settings.serviceAreasTitleTag || "h4",
//         // empty list = the page shows its built-in list of cities
//         serviceAreasList: (Array.isArray(settings.serviceAreas) ? settings.serviceAreas : []).map((a) => ({ name: a?.name || "", url: a?.url || "" })),
//         nearbyCitiesTitle: settings.nearbyCitiesTitle || "Nearby Cities",
//         nearbyCitiesTitleTag: settings.nearbyCitiesTitleTag || "h2",
//         // empty list = the Nearby Cities strip is not shown
//         nearbyCitiesList: (Array.isArray(settings.nearbyCities) ? settings.nearbyCities : []).map((c) => ({ name: c?.name || "", url: c?.url || "", image: c?.image || "" })),
//         sectionOrder: getPageSectionOrder(settings.sectionOrder),
//     };
// };

// export const DEFAULT_PAGE_STATE = pageSettingsToState({});

// /** flat editor state -> the object that is stored in the reserved content block */
// export const stateToPageSettings = (state) => {
//     const s = state || DEFAULT_PAGE_STATE;
//     return {
//         content: prepareContentForSave(s.content),
//         siteVisit: {
//             title: s.siteVisitTitle,
//             titleTag: s.siteVisitTitleTag,
//             description: s.siteVisitDescription,
//             buttonText: s.siteVisitButtonText,
//             buttonUrl: s.siteVisitButtonUrl,
//         },
//         promiseTitle: s.promiseTitle,
//         promiseTitleTag: s.promiseTitleTag,
//         promiseItems: (s.promiseItems || [])
//             .filter((item) => (item.title || "").trim() || (item.description || "").trim())
//             .map((item) => ({ iconName: item.iconName, title: (item.title || "").trim(), description: (item.description || "").trim() })),
//         serviceAreasTitle: s.serviceAreasTitle,
//         serviceAreasTitleTag: s.serviceAreasTitleTag,
//         serviceAreas: rowsToEntries(s.serviceAreasList, false),
//         nearbyCitiesTitle: s.nearbyCitiesTitle,
//         nearbyCitiesTitleTag: s.nearbyCitiesTitleTag,
//         nearbyCities: rowsToEntries(s.nearbyCitiesList, true),
//         sectionOrder: {
//             desktop: pageTools.normalizeOrder(s.sectionOrder?.desktop),
//             mobile: pageTools.normalizeOrder(s.sectionOrder?.mobile),
//         },
//     };
// };

// /**
//  * What to save in content_blocks: the page's real blocks, plus the layout settings block ONLY when the
//  * layout differs from the defaults (an untouched layout stores nothing, and resetting it removes the block).
//  */
// export const buildContentBlocks = (blocks, state) => {
//     const real = parseArray(blocks).filter((block) => !(block && block.type === PAGE_SETTINGS_BLOCK_TYPE));
//     const settings = stateToPageSettings(state);
//     const isDefault = JSON.stringify(settings) === JSON.stringify(stateToPageSettings(DEFAULT_PAGE_STATE));
//     return isDefault ? real : [...real, { type: PAGE_SETTINGS_BLOCK_TYPE, data: settings }];
// };



// Layout settings for custom CMS pages (the [blog]/page.jsx "cms-page" branch).
// Plain module: usable from the server-rendered page AND from the admin editor.
// Put at: src/utils/cmsPageSettings.js   (import as "@/utils/cmsPageSettings")
//
// Where the settings are stored: no backend change is needed. They travel inside the page's existing
// `content_blocks` JSON as ONE reserved block   { type: "page_settings", data: { ... } }.
// splitPageSettings() takes that block out (so the Content Blocks list never shows it) and
// joinPageSettings() puts it back when saving.
import { createSectionTools } from "@/utils/citySections";
import { getCityContent, prepareContentForSave } from "@/utils/cityContent";

export const PAGE_SETTINGS_BLOCK_TYPE = "page_settings";

// Default text differences between a city page and a custom page
export const PAGE_CONTENT_DEFAULTS = { faqs: { title: "FAQ's" } };

export const PAGE_SECTIONS = [
    { key: "main", label: "Main Content (rich text)", column: "main" },
    { key: "process", label: "Our Proven Design Process", column: "main" },
    { key: "projects", label: "Project Photos & Videos", column: "main" },
    { key: "blogs", label: "Design Inspiration (blogs)", column: "main" },
    { key: "stats", label: "Excellence Stats", column: "main" },
    { key: "whyChoose", label: "What Makes Us the Best Choice", column: "main" },
    { key: "contentBlocks", label: "Content Blocks (testimonial / service / counter)", column: "main" },
    { key: "accordions", label: "Additional Information (accordions)", column: "main" },
    { key: "faqs", label: "FAQs", column: "main" },
    { key: "siteVisit", label: "Book a Site Visit", column: "sidebar" },
    { key: "sidebarForm", label: "Enquiry Form", column: "sidebar" },
    { key: "promise", label: "The Promise", column: "sidebar" },
    { key: "serviceAreas", label: "Service Areas", column: "sidebar" },
    { key: "nearbyCities", label: "Nearby Cities", column: "bottom" },
];

const pageTools = createSectionTools(PAGE_SECTIONS);
export const DEFAULT_PAGE_ORDER_STATE = pageTools.DEFAULT_ORDER_STATE;
export const normalizePageOrder = pageTools.normalizeOrder;
export const getPageSectionOrder = pageTools.getSectionOrder;

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

const parseArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string" && value.trim()) {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    return [];
};

/** content_blocks (array or JSON string) -> { blocks: real content blocks, settings: stored page settings } */
export const splitPageSettings = (rawBlocks) => {
    const all = parseArray(rawBlocks);
    let settings = {};
    let found = false;
    const blocks = [];
    for (const block of all) {
        if (block && block.type === PAGE_SETTINGS_BLOCK_TYPE) {
            if (!found && isObject(block.data)) settings = block.data;
            found = true;
        } else {
            blocks.push(block);
        }
    }
    return { blocks, settings };
};

/** real content blocks + settings -> the array to save in content_blocks */
export const joinPageSettings = (blocks, settings) => [
    ...parseArray(blocks).filter((block) => !(block && block.type === PAGE_SETTINGS_BLOCK_TYPE)),
    { type: PAGE_SETTINGS_BLOCK_TYPE, data: settings },
];

/* ---------- editor state <-> stored settings ---------- */

export const DEFAULT_PROMISE_ITEMS = [
    { iconName: "FaCheckCircle", title: "Transparent Pricing", description: "No hidden costs, ever." },
    { iconName: "FaTools", title: "In-House Execution", description: "No third-party contractors involved." },
];

const isInternalPath = (value) => {
    const path = String(value || "").trim();
    return path.startsWith("/") && !path.startsWith("//");
};
const cleanRows = (rows) => (Array.isArray(rows) ? rows : []).map((row) => ({
    name: String(row?.name || "").trim(),
    url: String(row?.url || "").trim(),
    image: String(row?.image || "").trim(),
}));
export const rowsToEntries = (rows, includeImage = false) => cleanRows(rows)
    .filter((row) => row.name && isInternalPath(row.url))
    .map((row) => (includeImage ? row : { name: row.name, url: row.url }));
export const countFilledRows = (rows) => cleanRows(rows).filter((row) => row.name || row.url || row.image).length;

/** stored settings (or nothing) -> flat state object used by the admin editors */
export const pageSettingsToState = (stored) => {
    const settings = isObject(stored) ? stored : {};
    const visit = isObject(settings.siteVisit) ? settings.siteVisit : {};
    const promises = Array.isArray(settings.promiseItems) && settings.promiseItems.length ? settings.promiseItems : DEFAULT_PROMISE_ITEMS;
    return {
        content: getCityContent(settings.content, PAGE_CONTENT_DEFAULTS),
        // optional hero banner used on phones (below 768px); the alt text is the page's banner alt text
        mobileBannerImage: typeof settings.mobileBannerImage === "string" ? settings.mobileBannerImage.trim() : "",
        siteVisitTitle: visit.title || "Book a Site Visit",
        siteVisitTitleTag: visit.titleTag || "h4",
        siteVisitDescription: visit.description || "Expert designers will visit your {city} property.",
        siteVisitButtonText: visit.buttonText || "Schedule Now",
        siteVisitButtonUrl: visit.buttonUrl || "/contact",
        promiseTitle: settings.promiseTitle || "The Promise",
        promiseTitleTag: settings.promiseTitleTag || "h4",
        promiseItems: promises.slice(0, 8).map((item, index) => ({
            iconName: item?.iconName || DEFAULT_PROMISE_ITEMS[index]?.iconName || (index === 0 ? "FaCheckCircle" : "FaTools"),
            title: item?.title || "",
            description: item?.description || "",
        })),
        serviceAreasTitle: settings.serviceAreasTitle || "Service Areas",
        serviceAreasTitleTag: settings.serviceAreasTitleTag || "h4",
        // empty list = the page shows its built-in list of cities
        serviceAreasList: (Array.isArray(settings.serviceAreas) ? settings.serviceAreas : []).map((a) => ({ name: a?.name || "", url: a?.url || "" })),
        nearbyCitiesTitle: settings.nearbyCitiesTitle || "Nearby Cities",
        nearbyCitiesTitleTag: settings.nearbyCitiesTitleTag || "h2",
        // empty list = the Nearby Cities strip is not shown
        nearbyCitiesList: (Array.isArray(settings.nearbyCities) ? settings.nearbyCities : []).map((c) => ({ name: c?.name || "", url: c?.url || "", image: c?.image || "" })),
        sectionOrder: getPageSectionOrder(settings.sectionOrder),
        // blogs ticked for the Design Inspiration block (empty = the page shows the latest four blogs)
        designInspirationBlogIds: (Array.isArray(settings.designInspirationBlogIds) ? settings.designInspirationBlogIds : [])
            .map((id) => String(id))
            .slice(0, 6),
    };
};

export const DEFAULT_PAGE_STATE = pageSettingsToState({});

/** flat editor state -> the object that is stored in the reserved content block */
export const stateToPageSettings = (state) => {
    const s = state || DEFAULT_PAGE_STATE;
    const content = prepareContentForSave(s.content);
    // custom pages always show the FAQ heading left-aligned (no alignment option)
    content.faqs = { ...content.faqs, headingAlign: "left" };
    return {
        content,
        mobileBannerImage: String(s.mobileBannerImage || "").trim(),
        siteVisit: {
            title: s.siteVisitTitle,
            titleTag: s.siteVisitTitleTag,
            description: s.siteVisitDescription,
            buttonText: s.siteVisitButtonText,
            buttonUrl: s.siteVisitButtonUrl,
        },
        promiseTitle: s.promiseTitle,
        promiseTitleTag: s.promiseTitleTag,
        promiseItems: (s.promiseItems || [])
            .filter((item) => (item.title || "").trim() || (item.description || "").trim())
            .map((item) => ({ iconName: item.iconName, title: (item.title || "").trim(), description: (item.description || "").trim() })),
        serviceAreasTitle: s.serviceAreasTitle,
        serviceAreasTitleTag: s.serviceAreasTitleTag,
        serviceAreas: rowsToEntries(s.serviceAreasList, false),
        nearbyCitiesTitle: s.nearbyCitiesTitle,
        nearbyCitiesTitleTag: s.nearbyCitiesTitleTag,
        nearbyCities: rowsToEntries(s.nearbyCitiesList, true),
        sectionOrder: {
            desktop: pageTools.normalizeOrder(s.sectionOrder?.desktop),
            mobile: pageTools.normalizeOrder(s.sectionOrder?.mobile),
        },
        designInspirationBlogIds: (Array.isArray(s.designInspirationBlogIds) ? s.designInspirationBlogIds : [])
            .map((id) => String(id))
            .slice(0, 6),
    };
};

/**
 * What to save in content_blocks: the page's real blocks, plus the layout settings block ONLY when the
 * layout differs from the defaults (an untouched layout stores nothing, and resetting it removes the block).
 */
export const buildContentBlocks = (blocks, state) => {
    const real = parseArray(blocks).filter((block) => !(block && block.type === PAGE_SETTINGS_BLOCK_TYPE));
    const settings = stateToPageSettings(state);
    const isDefault = JSON.stringify(settings) === JSON.stringify(stateToPageSettings(DEFAULT_PAGE_STATE));
    return isDefault ? real : [...real, { type: PAGE_SETTINGS_BLOCK_TYPE, data: settings }];
};