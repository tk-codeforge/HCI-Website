// // Shared (admin + public) model for the editable city-page sections.
// // Plain module: no "use client", no JSX, so server components can import it.
// // Put at: src/utils/cityContent.js   (import as "@/utils/cityContent")
// //
// // Everything is stored inside the existing city_settings JSON (key: "content"),
// // so no backend / database change is needed.

// export const HEADING_TAG_OPTIONS = ["h1", "h2", "h3", "h4", "h5", "h6"];

// // Font Awesome (react-icons/fa) icons the CMS lets editors pick from.
// export const ICON_OPTIONS = [
//     "FaUser", "FaUsers", "FaHome", "FaBuilding", "FaDraftingCompass", "FaRulerCombined",
//     "FaPaintRoller", "FaCouch", "FaBed", "FaHardHat", "FaTools", "FaShieldAlt",
//     "FaGem", "FaClock", "FaCalendarAlt", "FaWallet", "FaRupeeSign", "FaSmile",
//     "FaHeart", "FaThumbsUp", "FaHandshake", "FaStar", "FaMedal", "FaAward",
//     "FaTrophy", "FaCheck", "FaCheckCircle", "FaLightbulb", "FaLeaf", "FaBolt",
//     "FaPhoneAlt", "FaMapMarkerAlt",
// ];

// export const DEFAULT_CITY_CONTENT = {
//     process: {
//         title: "Our Proven Design Process",
//         titleTag: "h2",
//         items: [
//             { iconName: "FaUser", title: "Consultation & Ideation", titleTag: "h4", description: "We meet at your {city} property to understand your vision." },
//             { iconName: "FaDraftingCompass", title: "3D Concept & Planning", titleTag: "h4", description: "Walking through your home with detailed 3D renders before we build." },
//             { iconName: "FaHardHat", title: "Precision Execution", titleTag: "h4", description: "Expert execution with 150+ quality checks and zero compromises." },
//             { iconName: "FaHome", title: "The Grand Handover", titleTag: "h4", description: "A flawless move-in within 45 Days Delivery*. Welcome home." },
//         ],
//     },
//     projects: { title: "Interior Projects in {city}", titleTag: "h2", gallery: [] }, // gallery: unlimited extra photos / testimonial videos
//     blogs: { title: "Design Inspiration", titleTag: "h2" },
//     stats: {
//         // false = keep using the global "Excellence Stats" from CMS Content (current behaviour)
//         useCustom: false,
//         items: [
//             { iconName: "FaHome", value: "2680+", valueTag: "h3", label: "HOME RENOVATIONS" },
//             { iconName: "FaSmile", value: "2660+", valueTag: "h3", label: "HAPPY CUSTOMERS" },
//             { iconName: "FaStar", value: "4.8/5", valueTag: "h3", label: "CLIENT RATINGS" },
//         ],
//     },
//     whyChoose: {
//         title: "What makes us the best choice for your project.",
//         titleTag: "h2",
//         items: [
//             { iconName: "FaShieldAlt", title: "10-Year Warranty*", titleTag: "h4", description: "India’s only full-home coverage guarantee." },
//             { iconName: "FaGem", title: "Elite Finishes", titleTag: "h4", description: "Sourcing luxury materials that stand the test of time." },
//             { iconName: "FaClock", title: "45-Day Delivery*", titleTag: "h4", description: "Swift, on-time installation of storage & kitchens." },
//             { iconName: "FaTools", title: "Expert Team", titleTag: "h4", description: "Highly skilled professionals handling your project end-to-end." },
//         ],
//     },
//     faqs: {
//         title: "Insights for {city}",
//         titleTag: "h2",
//         eyebrow: "Good to know",
//         intro: "",
//         items: [], // [{ question, answer }] - when empty the legacy pageData.faqs (if any) is used
//     },
// };

// export const MAX_ITEMS = { process: 6, stats: 4, whyChoose: 4, faqs: 40, gallery: 60, promise: 8, serviceAreas: 60, nearbyCities: 12 };

// const text = (value, fallback) => (typeof value === "string" && value.trim() ? value : fallback);
// const tag = (value, fallback) => (HEADING_TAG_OPTIONS.includes(value) ? value : fallback);
// // For list items an empty string is a deliberate choice, so only fall back when the key is missing.
// const keep = (value, fallback = "") => (typeof value === "string" ? value : fallback);
// const icon = (value, fallback) => (typeof value === "string" && /^Fa[A-Za-z0-9]+$/.test(value) ? value : fallback);

// const mergeList = (saved, defaults, max, mapItem) => {
//     if (Array.isArray(saved) && saved.length) {
//         return saved.slice(0, max).map((item, index) => mapItem(item && typeof item === "object" ? item : {}, defaults[index] || {}));
//     }
//     return defaults.map((item) => ({ ...item }));
// };

// const parseObject = (value) => {
//     if (!value) return {};
//     if (typeof value === "object" && !Array.isArray(value)) return value;
//     try {
//         const parsed = JSON.parse(value);
//         return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
//     } catch {
//         return {};
//     }
// };

// // Returns a complete, safe content object; anything missing falls back to the current hard-coded text.
// export const getCityContent = (raw) => {
//     const saved = parseObject(raw);
//     const d = DEFAULT_CITY_CONTENT;
//     const process = parseObject(saved.process);
//     const projects = parseObject(saved.projects);
//     const blogs = parseObject(saved.blogs);
//     const stats = parseObject(saved.stats);
//     const why = parseObject(saved.whyChoose);
//     const faqs = parseObject(saved.faqs);

//     return {
//         process: {
//             title: text(process.title, d.process.title),
//             titleTag: tag(process.titleTag, d.process.titleTag),
//             items: mergeList(process.items, d.process.items, MAX_ITEMS.process, (item, base) => ({
//                 iconName: icon(item.iconName, base.iconName || "FaCheckCircle"),
//                 title: keep(item.title, base.title || ""),
//                 titleTag: tag(item.titleTag, "h4"),
//                 description: keep(item.description, base.description || ""),
//             })),
//         },
//         projects: {
//             title: text(projects.title, d.projects.title),
//             titleTag: tag(projects.titleTag, d.projects.titleTag),
//             gallery: Array.isArray(projects.gallery)
//                 ? projects.gallery.slice(0, MAX_ITEMS.gallery).map((item) => ({
//                     type: item?.type === "video" ? "video" : "image",
//                     src: keep(item?.src),
//                     alt: keep(item?.alt),
//                     title: keep(item?.title),
//                     videoUrl: keep(item?.videoUrl),
//                     poster: keep(item?.poster),
//                 }))
//                 : [],
//         },
//         blogs: {
//             title: text(blogs.title, d.blogs.title),
//             titleTag: tag(blogs.titleTag, d.blogs.titleTag),
//         },
//         stats: {
//             useCustom: stats.useCustom === true,
//             items: mergeList(stats.items, d.stats.items, MAX_ITEMS.stats, (item, base) => ({
//                 iconName: icon(item.iconName, base.iconName || "FaStar"),
//                 value: keep(item.value, base.value || ""),
//                 valueTag: tag(item.valueTag, "h3"),
//                 label: keep(item.label, base.label || ""),
//             })),
//         },
//         whyChoose: {
//             title: text(why.title, d.whyChoose.title),
//             titleTag: tag(why.titleTag, d.whyChoose.titleTag),
//             items: mergeList(why.items, d.whyChoose.items, MAX_ITEMS.whyChoose, (item, base) => ({
//                 iconName: icon(item.iconName, base.iconName || "FaCheckCircle"),
//                 title: keep(item.title, base.title || ""),
//                 titleTag: tag(item.titleTag, "h4"),
//                 description: keep(item.description, base.description || ""),
//             })),
//         },
//         faqs: {
//             title: text(faqs.title, d.faqs.title),
//             titleTag: tag(faqs.titleTag, d.faqs.titleTag),
//             eyebrow: typeof faqs.eyebrow === "string" ? faqs.eyebrow : d.faqs.eyebrow,
//             intro: keep(faqs.intro, ""),
//             items: Array.isArray(faqs.items)
//                 ? faqs.items.slice(0, MAX_ITEMS.faqs).map((item) => ({ question: keep(item?.question), answer: keep(item?.answer) }))
//                 : [],
//         },
//     };
// };

// // "{city}" placeholder -> real city name
// export const fillCity = (value, city) => String(value || "").replace(/\{city\}/gi, city);

// // Trims text and drops empty rows before saving (so blank "draft" FAQ rows are never stored).
// export const prepareContentForSave = (content) => {
//     const c = getCityContent(content);
//     const clean = (value) => String(value || "").trim();
//     return {
//         ...c,
//         projects: {
//             ...c.projects,
//             gallery: c.projects.gallery
//                 .map((i) => ({ ...i, src: clean(i.src), alt: clean(i.alt), title: clean(i.title), videoUrl: clean(i.videoUrl), poster: clean(i.poster) }))
//                 .filter((i) => (i.type === "video" ? i.videoUrl : i.src))
//                 .map((i) => (i.type === "video"
//                     ? { type: "video", videoUrl: i.videoUrl, poster: i.poster, alt: i.alt, title: i.title }
//                     : { type: "image", src: i.src, alt: i.alt, title: i.title })),
//         },
//         process: { ...c.process, items: c.process.items.filter((i) => clean(i.title) || clean(i.description)).map((i) => ({ ...i, title: clean(i.title), description: clean(i.description) })) },
//         stats: { ...c.stats, items: c.stats.items.filter((i) => clean(i.value) || clean(i.label)).map((i) => ({ ...i, value: clean(i.value), label: clean(i.label) })) },
//         whyChoose: { ...c.whyChoose, items: c.whyChoose.items.filter((i) => clean(i.title) || clean(i.description)).map((i) => ({ ...i, title: clean(i.title), description: clean(i.description) })) },
//         faqs: {
//             ...c.faqs,
//             eyebrow: clean(c.faqs.eyebrow),
//             intro: clean(c.faqs.intro),
//             items: c.faqs.items.filter((i) => clean(i.question) && clean(i.answer)).map((i) => ({ question: clean(i.question), answer: clean(i.answer) })),
//         },
//     };
// };

// // Understands the video links editors paste into the CMS.
// // Returns { kind: "youtube" | "vimeo" | "file", embedUrl, poster } or null when the link is not supported.
// export const parseVideoUrl = (raw) => {
//     let url;
//     try {
//         url = new URL(String(raw || "").trim());
//     } catch {
//         return null;
//     }
//     if (url.protocol !== "https:" && url.protocol !== "http:") return null;
//     const host = url.hostname.replace(/^(www|m)\./, "");

//     let youtubeId = "";
//     if (host === "youtu.be") {
//         youtubeId = url.pathname.slice(1).split("/")[0];
//     } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
//         if (url.pathname === "/watch") youtubeId = url.searchParams.get("v") || "";
//         else {
//             const match = url.pathname.match(/^\/(embed|shorts|live|v)\/([^/?]+)/);
//             if (match) youtubeId = match[2];
//         }
//     }
//     if (youtubeId && /^[\w-]{6,20}$/.test(youtubeId)) {
//         return {
//             kind: "youtube",
//             embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`,
//             poster: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
//         };
//     }

//     if (host === "vimeo.com" || host === "player.vimeo.com") {
//         const match = url.pathname.match(/(\d{6,12})/);
//         if (match) return { kind: "vimeo", embedUrl: `https://player.vimeo.com/video/${match[1]}?autoplay=1`, poster: "" };
//     }

//     if (/\.(mp4|webm|ogg|mov)$/i.test(url.pathname)) return { kind: "file", embedUrl: url.href, poster: "" };
//     return null;
// };


// Shared (admin + public) model for the editable city-page sections.
// Plain module: no "use client", no JSX, so server components can import it.
// Put at: src/utils/cityContent.js   (import as "@/utils/cityContent")
//
// Everything is stored inside the existing city_settings JSON (key: "content"),
// so no backend / database change is needed.

export const HEADING_TAG_OPTIONS = ["h1", "h2", "h3", "h4", "h5", "h6"];

// Font Awesome (react-icons/fa) icons the CMS lets editors pick from.
export const ICON_OPTIONS = [
    "FaUser", "FaUsers", "FaHome", "FaBuilding", "FaDraftingCompass", "FaRulerCombined",
    "FaPaintRoller", "FaCouch", "FaBed", "FaHardHat", "FaTools", "FaShieldAlt",
    "FaGem", "FaClock", "FaCalendarAlt", "FaWallet", "FaRupeeSign", "FaSmile",
    "FaHeart", "FaThumbsUp", "FaHandshake", "FaStar", "FaMedal", "FaAward",
    "FaTrophy", "FaCheck", "FaCheckCircle", "FaLightbulb", "FaLeaf", "FaBolt",
    "FaPhoneAlt", "FaMapMarkerAlt",
];

export const DEFAULT_CITY_CONTENT = {
    process: {
        title: "Our Proven Design Process",
        titleTag: "h2",
        items: [
            { iconName: "FaUser", title: "Consultation & Ideation", titleTag: "h4", description: "We meet at your {city} property to understand your vision." },
            { iconName: "FaDraftingCompass", title: "3D Concept & Planning", titleTag: "h4", description: "Walking through your home with detailed 3D renders before we build." },
            { iconName: "FaHardHat", title: "Precision Execution", titleTag: "h4", description: "Expert execution with 150+ quality checks and zero compromises." },
            { iconName: "FaHome", title: "The Grand Handover", titleTag: "h4", description: "A flawless move-in within 45 Days Delivery*. Welcome home." },
        ],
    },
    projects: { title: "Interior Projects in {city}", titleTag: "h2", gallery: [] }, // gallery: unlimited photos / videos
    blogs: { title: "Design Inspiration", titleTag: "h2" },
    stats: {
        // false = keep using the global "Excellence Stats" from CMS Content (current behaviour)
        useCustom: false,
        items: [
            { iconName: "FaHome", value: "2680+", valueTag: "h3", label: "HOME RENOVATIONS" },
            { iconName: "FaSmile", value: "2660+", valueTag: "h3", label: "HAPPY CUSTOMERS" },
            { iconName: "FaStar", value: "4.8/5", valueTag: "h3", label: "CLIENT RATINGS" },
        ],
    },
    whyChoose: {
        title: "What makes us the best choice for your project.",
        titleTag: "h2",
        items: [
            { iconName: "FaShieldAlt", title: "10-Year Warranty*", titleTag: "h4", description: "India’s only full-home coverage guarantee." },
            { iconName: "FaGem", title: "Elite Finishes", titleTag: "h4", description: "Sourcing luxury materials that stand the test of time." },
            { iconName: "FaClock", title: "45-Day Delivery*", titleTag: "h4", description: "Swift, on-time installation of storage & kitchens." },
            { iconName: "FaTools", title: "Expert Team", titleTag: "h4", description: "Highly skilled professionals handling your project end-to-end." },
        ],
    },
    faqs: {
        title: "Insights for {city}",
        titleTag: "h2",
        headingAlign: "left", // "left" (default) | "center" - desktop only
        eyebrow: "Good to know",
        intro: "",
        items: [], // [{ question, answer }] - when empty the legacy pageData.faqs (if any) is used
    },
};

export const MAX_ITEMS = { process: 6, stats: 4, whyChoose: 4, faqs: 40, gallery: 60, promise: 8, serviceAreas: 60, nearbyCities: 12 };

const text = (value, fallback) => (typeof value === "string" && value.trim() ? value : fallback);
const tag = (value, fallback) => (HEADING_TAG_OPTIONS.includes(value) ? value : fallback);
// For list items an empty string is a deliberate choice, so only fall back when the key is missing.
const keep = (value, fallback = "") => (typeof value === "string" ? value : fallback);
const icon = (value, fallback) => (typeof value === "string" && /^Fa[A-Za-z0-9]+$/.test(value) ? value : fallback);

const mergeList = (saved, defaults, max, mapItem) => {
    if (Array.isArray(saved) && saved.length) {
        return saved.slice(0, max).map((item, index) => mapItem(item && typeof item === "object" ? item : {}, defaults[index] || {}));
    }
    return defaults.map((item) => ({ ...item }));
};

const parseObject = (value) => {
    if (!value) return {};
    if (typeof value === "object" && !Array.isArray(value)) return value;
    try {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
        return {};
    }
};

// Returns a complete, safe content object; anything missing falls back to the current hard-coded text.
export const getCityContent = (raw) => {
    const saved = parseObject(raw);
    const d = DEFAULT_CITY_CONTENT;
    const process = parseObject(saved.process);
    const projects = parseObject(saved.projects);
    const blogs = parseObject(saved.blogs);
    const stats = parseObject(saved.stats);
    const why = parseObject(saved.whyChoose);
    const faqs = parseObject(saved.faqs);

    return {
        process: {
            title: text(process.title, d.process.title),
            titleTag: tag(process.titleTag, d.process.titleTag),
            items: mergeList(process.items, d.process.items, MAX_ITEMS.process, (item, base) => ({
                iconName: icon(item.iconName, base.iconName || "FaCheckCircle"),
                title: keep(item.title, base.title || ""),
                titleTag: tag(item.titleTag, "h4"),
                description: keep(item.description, base.description || ""),
            })),
        },
        projects: {
            title: text(projects.title, d.projects.title),
            titleTag: tag(projects.titleTag, d.projects.titleTag),
            gallery: Array.isArray(projects.gallery)
                ? projects.gallery.slice(0, MAX_ITEMS.gallery).map((item) => ({
                    type: item?.type === "video" ? "video" : "image",
                    src: keep(item?.src),
                    alt: keep(item?.alt),
                    title: keep(item?.title),
                    videoUrl: keep(item?.videoUrl),
                    poster: keep(item?.poster),
                }))
                : [],
        },
        blogs: {
            title: text(blogs.title, d.blogs.title),
            titleTag: tag(blogs.titleTag, d.blogs.titleTag),
        },
        stats: {
            useCustom: stats.useCustom === true,
            items: mergeList(stats.items, d.stats.items, MAX_ITEMS.stats, (item, base) => ({
                iconName: icon(item.iconName, base.iconName || "FaStar"),
                value: keep(item.value, base.value || ""),
                valueTag: tag(item.valueTag, "h3"),
                label: keep(item.label, base.label || ""),
            })),
        },
        whyChoose: {
            title: text(why.title, d.whyChoose.title),
            titleTag: tag(why.titleTag, d.whyChoose.titleTag),
            items: mergeList(why.items, d.whyChoose.items, MAX_ITEMS.whyChoose, (item, base) => ({
                iconName: icon(item.iconName, base.iconName || "FaCheckCircle"),
                title: keep(item.title, base.title || ""),
                titleTag: tag(item.titleTag, "h4"),
                description: keep(item.description, base.description || ""),
            })),
        },
        faqs: {
            title: text(faqs.title, d.faqs.title),
            titleTag: tag(faqs.titleTag, d.faqs.titleTag),
            headingAlign: faqs.headingAlign === "center" ? "center" : "left",
            eyebrow: typeof faqs.eyebrow === "string" ? faqs.eyebrow : d.faqs.eyebrow,
            intro: keep(faqs.intro, ""),
            items: Array.isArray(faqs.items)
                ? faqs.items.slice(0, MAX_ITEMS.faqs).map((item) => ({ question: keep(item?.question), answer: keep(item?.answer) }))
                : [],
        },
    };
};

// "{city}" placeholder -> real city name
export const fillCity = (value, city) => String(value || "").replace(/\{city\}/gi, city);

// Trims text and drops empty rows before saving (so blank "draft" FAQ rows are never stored).
export const prepareContentForSave = (content) => {
    const c = getCityContent(content);
    const clean = (value) => String(value || "").trim();
    return {
        ...c,
        projects: {
            ...c.projects,
            gallery: c.projects.gallery
                .map((i) => ({ ...i, src: clean(i.src), alt: clean(i.alt), title: clean(i.title), videoUrl: clean(i.videoUrl), poster: clean(i.poster) }))
                .filter((i) => (i.type === "video" ? i.videoUrl : i.src))
                .map((i) => (i.type === "video"
                    ? { type: "video", videoUrl: i.videoUrl, poster: i.poster, alt: i.alt, title: i.title }
                    : { type: "image", src: i.src, alt: i.alt, title: i.title })),
        },
        process: { ...c.process, items: c.process.items.filter((i) => clean(i.title) || clean(i.description)).map((i) => ({ ...i, title: clean(i.title), description: clean(i.description) })) },
        stats: { ...c.stats, items: c.stats.items.filter((i) => clean(i.value) || clean(i.label)).map((i) => ({ ...i, value: clean(i.value), label: clean(i.label) })) },
        whyChoose: { ...c.whyChoose, items: c.whyChoose.items.filter((i) => clean(i.title) || clean(i.description)).map((i) => ({ ...i, title: clean(i.title), description: clean(i.description) })) },
        faqs: {
            ...c.faqs,
            eyebrow: clean(c.faqs.eyebrow),
            intro: clean(c.faqs.intro),
            items: c.faqs.items.filter((i) => clean(i.question) && clean(i.answer)).map((i) => ({ question: clean(i.question), answer: clean(i.answer) })),
        },
    };
};

// Understands the video links editors paste into the CMS.
// Returns { kind: "youtube" | "vimeo" | "file", embedUrl, poster } or null when the link is not supported.
export const parseVideoUrl = (raw) => {
    const text = String(raw || "").trim();
    // uploaded through the CMS: a site-relative path to a video file
    if (text.startsWith("/") && !text.startsWith("//") && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(text)) {
        return { kind: "file", embedUrl: text, poster: "" };
    }
    let url;
    try {
        url = new URL(text);
    } catch {
        return null;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const host = url.hostname.replace(/^(www|m)\./, "");

    let youtubeId = "";
    if (host === "youtu.be") {
        youtubeId = url.pathname.slice(1).split("/")[0];
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
        if (url.pathname === "/watch") youtubeId = url.searchParams.get("v") || "";
        else {
            const match = url.pathname.match(/^\/(embed|shorts|live|v)\/([^/?]+)/);
            if (match) youtubeId = match[2];
        }
    }
    if (youtubeId && /^[\w-]{6,20}$/.test(youtubeId)) {
        return {
            kind: "youtube",
            embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`,
            poster: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
        };
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
        const match = url.pathname.match(/(\d{6,12})/);
        if (match) return { kind: "vimeo", embedUrl: `https://player.vimeo.com/video/${match[1]}?autoplay=1`, poster: "" };
    }

    if (/\.(mp4|webm|ogg|mov)$/i.test(url.pathname)) return { kind: "file", embedUrl: url.href, poster: "" };
    return null;
};
