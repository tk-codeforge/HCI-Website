// "use client";
// import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { useSelector } from "react-redux";
// import { FaSearch, FaTimes } from "react-icons/fa";
// import api from "@/utils/api";
// import { ADMIN_MENU_ITEMS } from "../../utils/adminMenuItems";
// import { getCmsAccess } from "../../utils/cmsAccess";

// const normalize = (s = "") => String(s || "").toLowerCase().trim();
// const safeDecode = (v) => { try { return decodeURIComponent(v); } catch { return v; } };
// const isOn = (v) => v === true || v === 1 || v === "1";
// const asPath = (v) => {
//     const s = String(v || "").trim();
//     if (!s) return "";
//     return s.startsWith("/") || s.startsWith("http") ? s : `/${s}`;
// };
// // canonical_url may be a full <link rel="canonical" href="..."> tag -> pull out the href
// const hrefFrom = (v = "") => {
//     const decoded = safeDecode(String(v));
//     const m = decoded.match(/href=["']([^"']+)["']/i);
//     return m ? m[1] : decoded;
// };

// // ---- Dynamic URL cache -------------------------------------------------
// // The header is re-created on every admin page, so keep the fetched URLs at
// // module level: they are fetched once and reused when you move between pages.
// let dynamicCache = { items: null, fetchedAt: 0, isAdmin: null };
// let inflight = null;
// const CACHE_MS = 5 * 60 * 1000;

// const fetchDynamicItems = async (isAdmin) => {
//     const calls = [
//         api.get("/cms-pages/all"),                 // 0 custom pages
//         api.get("/redirects"),                     // 1 redirects + custom URL changes
//         isAdmin ? api.get("/seo-tag") : null,      // 2 global SEO (admin page)
//         isAdmin ? api.get("/slug-edit") : null,    // 3 slug settings (admin page)
//     ];
//     const res = await Promise.allSettled(calls.map((c) => c || Promise.resolve({ data: [] })));
//     const rows = (i) => (res[i].status === "fulfilled" && Array.isArray(res[i].value?.data) ? res[i].value.data : []);

//     const items = [];

//     // Custom pages  ->  /cms/pages
//     rows(0).forEach((p) => {
//         if (!p?.slug) return;
//         items.push({
//             key: `page-${p.id}`,
//             name: p.title || p.slug,
//             url: asPath(p.slug),
//             group: "Custom Page",
//             target: "/cms/pages",
//             highlight: p.title || p.slug,
//         });
//     });

//     // Redirects / custom URL changes
//     rows(1).forEach((r) => {
//         const rewrite = isOn(r.is_url_rewrite);
//         items.push({
//             key: `redirect-${r.id}`,
//             name: `${safeDecode(r.old_url)} → ${safeDecode(r.new_url)}`,
//             url: `${r.old_url} ${r.new_url} ${safeDecode(r.old_url)} ${safeDecode(r.new_url)}`,
//             highlight: r.old_url,
//             group: rewrite ? "Slug Settings" : "Redirect",
//             target: rewrite ? "/cms/slug-settings" : "/cms/redirects",
//             adminOnly: rewrite,
//         });
//     });

//     // Global SEO routes  ->  /cms/seo_tag
//     rows(2).forEach((s) => {
//         items.push({
//             key: `seo-${s.id}`,
//             name: safeDecode(s.page_name || "") || hrefFrom(s.canonical_url),
//             highlight: s.page_name,
//             url: `${s.page_name || ""} ${hrefFrom(s.canonical_url)}`,
//             extra: s.meta_title,
//             group: "Global SEO",
//             target: "/cms/seo_tag",
//             adminOnly: true,
//         });
//     });

//     // Slug settings rows  ->  /cms/slug-settings
//     rows(3).forEach((s) => {
//         if (!s?.slug && !s?.entityId) return;
//         items.push({
//             key: `slug-${s.id ?? `${s.entityType}-${s.entityId}`}`,
//             name: `${s.entityType} · ${s.slug || `ID ${s.entityId}`}`,
//             url: s.slug ? asPath(s.slug) : "",
//             group: "Slug Settings",
//             target: "/cms/slug-settings",
//             highlight: s.slug || String(s.entityId),
//             adminOnly: true,
//         });
//     });

//     return items;
// };

// const loadDynamicItems = (isAdmin, force = false) => {
//     const fresh =
//         dynamicCache.items &&
//         dynamicCache.isAdmin === isAdmin &&
//         Date.now() - dynamicCache.fetchedAt < CACHE_MS;
//     if (fresh && !force) return Promise.resolve(dynamicCache.items);
//     if (inflight) return inflight;
//     inflight = fetchDynamicItems(isAdmin)
//         .then((items) => {
//             dynamicCache = { items, fetchedAt: Date.now(), isAdmin };
//             return items;
//         })
//         .catch(() => dynamicCache.items || [])
//         .finally(() => { inflight = null; });
//     return inflight;
// };

// const AdminSearch = () => {
//     const router = useRouter();
//     const pathname = usePathname();
//     const { user } = useSelector((state) => state.auth);
//     const { isAdmin } = getCmsAccess(user);

//     const [query, setQuery] = useState("");
//     const [editing, setEditing] = useState(false); // true only while the user is typing
//     const [open, setOpen] = useState(false);
//     const [activeIndex, setActiveIndex] = useState(0);
//     const [dynamicItems, setDynamicItems] = useState(dynamicCache.items || []);
//     const [loadingDynamic, setLoadingDynamic] = useState(false);
//     const wrapRef = useRef(null);
//     const inputRef = useRef(null);

//     const staticItems = useMemo(
//         () =>
//             ADMIN_MENU_ITEMS.filter((i) => !i.adminOnly || isAdmin).map((i) => ({
//                 ...i,
//                 key: `menu-${i.url}`,
//                 target: i.url,
//             })),
//         [isAdmin]
//     );

//     const allItems = useMemo(
//         () => [...staticItems, ...dynamicItems.filter((i) => !i.adminOnly || isAdmin)],
//         [staticItems, dynamicItems, isAdmin]
//     );

//     // Load custom-page / redirect / SEO / slug URLs (once, then cached)
//     const ensureDynamic = useCallback(async () => {
//         if (dynamicCache.items && dynamicCache.isAdmin === isAdmin && Date.now() - dynamicCache.fetchedAt < CACHE_MS) {
//             setDynamicItems(dynamicCache.items);
//             return;
//         }
//         setLoadingDynamic(true);
//         const items = await loadDynamicItems(isAdmin);
//         setDynamicItems(items);
//         setLoadingDynamic(false);
//     }, [isAdmin]);

//     // What the box shows when the user is NOT typing = the page they are on now
//     const currentLabel = useMemo(() => {
//         const exact = staticItems.find((i) => i.url === pathname);
//         if (exact) return exact.name;
//         return pathname || "";
//     }, [staticItems, pathname]);

//     const results = useMemo(() => {
//         const q = normalize(query);
//         if (!q) return [];
//         return allItems
//             .filter(
//                 (i) =>
//                     normalize(i.name).includes(q) ||
//                     normalize(i.url).includes(q) ||
//                     normalize(i.group).includes(q) ||
//                     normalize(i.extra).includes(q)
//             )
//             .sort((a, b) => {
//                 const aS = normalize(a.name).startsWith(q) ? 0 : 1;
//                 const bS = normalize(b.name).startsWith(q) ? 0 : 1;
//                 if (aS !== bS) return aS - bS;
//                 return (a.key.startsWith("menu-") ? 0 : 1) - (b.key.startsWith("menu-") ? 0 : 1);
//             })
//             .slice(0, 10);
//     }, [query, allItems]);

//     useEffect(() => {
//         const onClickOutside = (e) => {
//             if (wrapRef.current && !wrapRef.current.contains(e.target)) {
//                 setOpen(false);
//                 setEditing(false);
//                 setQuery("");
//             }
//         };
//         document.addEventListener("mousedown", onClickOutside);
//         return () => document.removeEventListener("mousedown", onClickOutside);
//     }, []);

//     useEffect(() => {
//         const onKey = (e) => {
//             if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
//                 e.preventDefault();
//                 inputRef.current?.focus();
//             }
//         };
//         window.addEventListener("keydown", onKey);
//         return () => window.removeEventListener("keydown", onKey);
//     }, []);

//     const goTo = (item) => {
//         // Close + stop editing; the new page's header will show that page's name
//         setEditing(false);
//         setQuery("");
//         setOpen(false);
//         inputRef.current?.blur();
//         const qs = item.highlight ? `?highlight=${encodeURIComponent(item.highlight)}` : "";
//         if (item.target === pathname) {
//             // Already on this page: it won't remount, so tell the highlighter directly
//             if (item.highlight) {
//                 window.history.replaceState(null, "", `${item.target}${qs}`);
//                 window.dispatchEvent(new CustomEvent("hc:highlight", { detail: item.highlight }));
//             }
//             return;
//         }
//         router.push(`${item.target}${qs}`);
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === "ArrowDown") {
//             e.preventDefault();
//             setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
//         } else if (e.key === "ArrowUp") {
//             e.preventDefault();
//             setActiveIndex((i) => Math.max(i - 1, 0));
//         } else if (e.key === "Enter") {
//             e.preventDefault();
//             if (results[activeIndex]) goTo(results[activeIndex]);
//         } else if (e.key === "Escape") {
//             setOpen(false);
//             setEditing(false);
//             setQuery("");
//             inputRef.current?.blur();
//         }
//     };

//     return (
//         <div className="admin-search" ref={wrapRef}>
//             <div className="admin-search-box">
//                 <FaSearch size={14} color="#94a3b8" />
//                 <input
//                     ref={inputRef}
//                     type="text"
//                     value={editing ? query : currentLabel}
//                     placeholder="Search page by name or URL…  (Ctrl+K)"
//                     onChange={(e) => {
//                         setEditing(true);
//                         setQuery(e.target.value);
//                         setActiveIndex(0);
//                         setOpen(true);
//                     }}
//                     onFocus={(e) => {
//                         e.target.select();   // typing replaces the current page name
//                         setOpen(true);
//                         ensureDynamic();
//                     }}
//                     onKeyDown={handleKeyDown}
//                     aria-label="Search admin pages"
//                 />
//                 {editing && query && (
//                     <button
//                         type="button"
//                         className="admin-search-clear"
//                         onMouseDown={(e) => e.preventDefault()}
//                         onClick={() => { setQuery(""); inputRef.current?.focus(); }}
//                         aria-label="Clear search"
//                     >
//                         <FaTimes size={12} />
//                     </button>
//                 )}
//             </div>

//             {open && editing && query.trim() && (
//                 <ul className="admin-search-results">
//                     {results.length === 0 ? (
//                         <li className="admin-search-empty">
//                             {loadingDynamic ? "Loading URLs…" : `No pages found for “${query}”`}
//                         </li>
//                     ) : (
//                         results.map((item, i) => (
//                             <li
//                                 key={item.key}
//                                 className={`admin-search-item ${i === activeIndex ? "active" : ""}`}
//                                 onMouseEnter={() => setActiveIndex(i)}
//                                 onMouseDown={(e) => { e.preventDefault(); goTo(item); }}
//                             >
//                                 <div style={{ minWidth: 0 }}>
//                                     <div className="admin-search-name">{item.name}</div>
//                                     <div className="admin-search-url">
//                                         {item.key.startsWith("menu-") ? item.url : `${item.url.trim()}  ·  opens ${item.target}`}
//                                     </div>
//                                 </div>
//                                 <span className="admin-search-group">{item.group}</span>
//                             </li>
//                         ))
//                     )}
//                     {loadingDynamic && results.length > 0 && (
//                         <li className="admin-search-empty">Loading more URLs…</li>
//                     )}
//                 </ul>
//             )}

//             <style jsx>{`
//                 .admin-search { position: relative; width: 100%; max-width: 460px; }
//                 .admin-search-box {
//                     display: flex; align-items: center; gap: 8px;
//                     background: #f8fafc; border: 1px solid #e2e8f0;
//                     border-radius: 8px; padding: 8px 12px;
//                     transition: border-color .2s, box-shadow .2s;
//                 }
//                 .admin-search-box:focus-within {
//                     border-color: #ff914d;
//                     box-shadow: 0 0 0 3px rgba(255, 145, 77, 0.15);
//                     background: #fff;
//                 }
//                 .admin-search-box input {
//                     flex: 1; border: none; outline: none; background: transparent;
//                     font-size: 14px; color: #334155; min-width: 0;
//                     text-overflow: ellipsis;
//                 }
//                 .admin-search-clear {
//                     border: none; background: transparent; color: #94a3b8;
//                     cursor: pointer; padding: 0; display: flex;
//                 }
//                 .admin-search-results {
//                     position: absolute; top: calc(100% + 6px); left: 0; right: 0;
//                     background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
//                     box-shadow: 0 10px 25px rgba(0,0,0,.1);
//                     list-style: none; margin: 0; padding: 6px;
//                     max-height: 400px; overflow-y: auto; z-index: 2000;
//                 }
//                 .admin-search-item {
//                     display: flex; justify-content: space-between; align-items: center;
//                     gap: 12px; padding: 8px 10px; border-radius: 6px; cursor: pointer;
//                 }
//                 .admin-search-item.active { background: #fff4ed; }
//                 .admin-search-name {
//                     font-size: 14px; font-weight: 600; color: #334155;
//                     white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
//                 }
//                 .admin-search-url {
//                     font-size: 12px; color: #94a3b8;
//                     white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
//                 }
//                 .admin-search-group {
//                     font-size: 11px; color: #ff914d; background: #fff4ed;
//                     padding: 2px 8px; border-radius: 10px; white-space: nowrap; flex-shrink: 0;
//                 }
//                 .admin-search-empty { padding: 12px; font-size: 13px; color: #64748b; }
//             `}</style>
//         </div>
//     );
// };

// export default AdminSearch;




"use client";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { FaSearch, FaTimes } from "react-icons/fa";
import api from "@/utils/api";
import { ADMIN_MENU_ITEMS } from "../../utils/adminMenuItems";
import { ADMIN_SEARCH_SOURCES } from "../../utils/adminSearchSources";
import { getCmsAccess } from "../../utils/cmsAccess";

const normalize = (s = "") => String(s || "").toLowerCase().trim();
const safeDecode = (v) => { try { return decodeURIComponent(v); } catch { return v; } };
const isOn = (v) => v === true || v === 1 || v === "1";
const asPath = (v) => {
    const s = String(v || "").trim();
    if (!s) return "";
    return s.startsWith("/") || s.startsWith("http") ? s : `/${s}`;
};
// canonical_url may be a full <link rel="canonical" href="..."> tag -> pull out the href
const hrefFrom = (v = "") => {
    const decoded = safeDecode(String(v));
    const m = decoded.match(/href=["']([^"']+)["']/i);
    return m ? m[1] : decoded;
};

// ---- Dynamic URL cache -------------------------------------------------
// The header is re-created on every admin page, so keep the fetched URLs at
// module level: they are fetched once and reused when you move between pages.
let dynamicCache = { items: null, fetchedAt: 0, isAdmin: null };
let inflight = null;
const CACHE_MS = 30 * 1000;

// When something is added / edited / deleted on these endpoints, mark the cache stale so the next time the
// search box is used it fetches the new URLs (before: a page you had just added stayed missing for 5 minutes).
// Any change made through a CMS endpoint (cms-pages, cms-blog, cms-city, ...) also refreshes the sitemap URLs.
let sitemapCache = { items: null, fetchedAt: 0 };
const SITEMAP_CACHE_MS = 2 * 60 * 1000;
let refreshHookAttached = false;
if (typeof window !== "undefined" && !refreshHookAttached && api?.interceptors?.response) {
    refreshHookAttached = true;
    api.interceptors.response.use((response) => {
        const method = String(response?.config?.method || "get").toLowerCase();
        if (method !== "get" && /cms-|redirects|seo-tag|slug-edit|sitemap/.test(String(response?.config?.url || ""))) {
            dynamicCache.fetchedAt = 0;
            sitemapCache.fetchedAt = 0;
        }
        return response;
    });
}

// Every URL of the website's sitemap.xml (the same list the Global Sitemap page shows). New pages, blogs and
// cities appear here automatically as soon as the sitemap contains them, so nothing has to be added by hand.
const loadSitemapItems = async () => {
    if (sitemapCache.items && Date.now() - sitemapCache.fetchedAt < SITEMAP_CACHE_MS) return sitemapCache.items;
    try {
        const res = await fetch("/sitemap.xml", { cache: "no-store" });
        if (!res.ok) return sitemapCache.items || [];
        const xml = new DOMParser().parseFromString(await res.text(), "application/xml");
        const seen = new Set();
        const items = [];
        Array.from(xml.getElementsByTagName("loc")).forEach((node) => {
            const loc = node.textContent?.trim();
            if (!loc) return;
            let path = "";
            try { path = new URL(loc).pathname.replace(/\/+$/, "") || "/"; } catch { return; }
            if (seen.has(path)) return;
            seen.add(path);
            items.push({
                key: `sitemap-${path}`,
                name: safeDecode(path),
                url: loc,
                group: "Sitemap URL",
                groupNotSearchable: true, // typing "sitemap" must find the Global Sitemap page, not every URL
                target: "/cms/global-sitemap",
                highlight: path,
                adminOnly: true,
            });
        });
        sitemapCache = { items, fetchedAt: Date.now() };
        return items;
    } catch {
        return sitemapCache.items || [];
    }
};

const fetchDynamicItems = async (isAdmin) => {
    const calls = [
        api.get("/cms-pages/all"),                 // 0 custom pages
        api.get("/redirects"),                     // 1 redirects + custom URL changes
        isAdmin ? api.get("/seo-tag") : null,      // 2 global SEO (admin page)
        isAdmin ? api.get("/slug-edit") : null,    // 3 slug settings (admin page)
        // 4 every admin page that exists in src/app/cms (so new pages need no manual list entry)
        isAdmin
            ? fetch("/api/admin-pages", { credentials: "same-origin" })
                .then((r) => (r.ok ? r.json() : { pages: [] }))
                .then((j) => ({ data: Array.isArray(j?.pages) ? j.pages : [] }))
            : null,
        // 5 every URL of sitemap.xml
        isAdmin ? loadSitemapItems().then((data) => ({ data })) : null,
    ];
    const res = await Promise.allSettled(calls.map((c) => c || Promise.resolve({ data: [] })));
    const rows = (i) => (res[i].status === "fulfilled" && Array.isArray(res[i].value?.data) ? res[i].value.data : []);

    const items = [];

    // Custom pages  ->  /cms/pages
    rows(0).forEach((p) => {
        if (!p?.slug) return;
        items.push({
            key: `page-${p.id}`,
            name: p.title || p.slug,
            url: asPath(p.slug),
            group: "Custom Page",
            target: "/cms/pages",
            highlight: p.title || p.slug,
        });
    });

    // Redirects / custom URL changes
    rows(1).forEach((r) => {
        const rewrite = isOn(r.is_url_rewrite);
        items.push({
            key: `redirect-${r.id}`,
            name: `${safeDecode(r.old_url)} → ${safeDecode(r.new_url)}`,
            url: `${r.old_url} ${r.new_url} ${safeDecode(r.old_url)} ${safeDecode(r.new_url)}`,
            highlight: r.old_url,
            group: rewrite ? "Slug Settings" : "Redirect",
            target: rewrite ? "/cms/slug-settings" : "/cms/redirects",
            adminOnly: rewrite,
        });
    });

    // Global SEO routes  ->  /cms/seo_tag
    rows(2).forEach((s) => {
        if (s?.page_name === "__sitemap_manager__") return; // hidden settings record of the Global Sitemap page
        items.push({
            key: `seo-${s.id}`,
            name: safeDecode(s.page_name || "") || hrefFrom(s.canonical_url),
            highlight: s.page_name,
            url: `${s.page_name || ""} ${hrefFrom(s.canonical_url)}`,
            extra: s.meta_title,
            group: "Global SEO",
            target: "/cms/seo_tag",
            adminOnly: true,
        });
    });

    // Slug settings rows  ->  /cms/slug-settings
    rows(3).forEach((s) => {
        if (!s?.slug && !s?.entityId) return;
        items.push({
            key: `slug-${s.id ?? `${s.entityType}-${s.entityId}`}`,
            name: `${s.entityType} · ${s.slug || `ID ${s.entityId}`}`,
            url: s.slug ? asPath(s.slug) : "",
            group: "Slug Settings",
            target: "/cms/slug-settings",
            highlight: s.slug || String(s.entityId),
            adminOnly: true,
        });
    });

    // Admin pages found in the project that are not in the fixed list (ADMIN_MENU_ITEMS)
    const known = new Set(ADMIN_MENU_ITEMS.map((i) => i.url.replace(/\/+$/, "")));
    rows(4).forEach((page) => {
        if (!page?.url || known.has(page.url)) return;
        items.push({
            key: `auto-${page.url}`,
            name: page.name || page.url,
            url: page.url,
            group: "CMS Page",
            target: page.url,
        });
    });

    // Website URLs from sitemap.xml  ->  /cms/global-sitemap
    rows(5).forEach((entry) => items.push(entry));

    // Extra sources registered in utils/adminSearchSources.js (for new admin pages with their own records)
    const sources = ADMIN_SEARCH_SOURCES.filter((s) => s?.endpoint && typeof s.map === "function" && (!s.adminOnly || isAdmin));
    const extraRes = await Promise.allSettled(sources.map((s) => api.get(s.endpoint)));
    extraRes.forEach((result, index) => {
        if (result.status !== "fulfilled") return;
        const source = sources[index];
        const body = result.value?.data;
        const list = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : Array.isArray(body?.items) ? body.items : [];
        list.forEach((row, rowIndex) => {
            let mapped = null;
            try { mapped = source.map(row); } catch { mapped = null; }
            if (!mapped || (!mapped.name && !mapped.url)) return;
            items.push({
                key: `extra-${index}-${mapped.id ?? rowIndex}`,
                name: mapped.name || mapped.url,
                url: mapped.url || "",
                group: source.group || "Other",
                target: source.target,
                highlight: mapped.highlight,
                adminOnly: !!source.adminOnly,
            });
        });
    });

    return items;
};

const loadDynamicItems = (isAdmin, force = false) => {
    const fresh =
        dynamicCache.items &&
        dynamicCache.isAdmin === isAdmin &&
        Date.now() - dynamicCache.fetchedAt < CACHE_MS;
    if (fresh && !force) return Promise.resolve(dynamicCache.items);
    if (inflight) return inflight;
    inflight = fetchDynamicItems(isAdmin)
        .then((items) => {
            dynamicCache = { items, fetchedAt: Date.now(), isAdmin };
            return items;
        })
        .catch(() => dynamicCache.items || [])
        .finally(() => { inflight = null; });
    return inflight;
};

const AdminSearch = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useSelector((state) => state.auth);
    const { isAdmin } = getCmsAccess(user);

    const [query, setQuery] = useState("");
    const [editing, setEditing] = useState(false); // true only while the user is typing
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [dynamicItems, setDynamicItems] = useState(dynamicCache.items || []);
    const [loadingDynamic, setLoadingDynamic] = useState(false);
    const wrapRef = useRef(null);
    const inputRef = useRef(null);

    const staticItems = useMemo(
        () =>
            ADMIN_MENU_ITEMS.filter((i) => !i.adminOnly || isAdmin).map((i) => ({
                ...i,
                key: `menu-${i.url}`,
                target: i.url,
            })),
        [isAdmin]
    );

    const allItems = useMemo(
        () => [...staticItems, ...dynamicItems.filter((i) => !i.adminOnly || isAdmin)],
        [staticItems, dynamicItems, isAdmin]
    );

    // Load custom-page / redirect / SEO / slug URLs (once, then cached)
    const ensureDynamic = useCallback(async () => {
        if (dynamicCache.items && dynamicCache.isAdmin === isAdmin && Date.now() - dynamicCache.fetchedAt < CACHE_MS) {
            setDynamicItems(dynamicCache.items);
            return;
        }
        setLoadingDynamic(true);
        const items = await loadDynamicItems(isAdmin);
        setDynamicItems(items);
        setLoadingDynamic(false);
    }, [isAdmin]);

    useEffect(() => {
        if (!dynamicCache.items) ensureDynamic();
    }, [ensureDynamic]);

    // What the box shows when the user is NOT typing = the page they are on now
    const currentLabel = useMemo(() => {
        const exact = allItems.find((i) => (i.key.startsWith("menu-") || i.key.startsWith("auto-")) && i.url === pathname);
        if (exact) return exact.name;
        return pathname || "";
    }, [allItems, pathname]);

    const results = useMemo(() => {
        const q = normalize(query);
        if (!q) return [];
        return allItems
            .filter(
                (i) =>
                    normalize(i.name).includes(q) ||
                    normalize(i.url).includes(q) ||
                    (!i.groupNotSearchable && normalize(i.group).includes(q)) ||
                    normalize(i.extra).includes(q)
            )
            .sort((a, b) => {
                const aS = normalize(a.name).startsWith(q) ? 0 : 1;
                const bS = normalize(b.name).startsWith(q) ? 0 : 1;
                if (aS !== bS) return aS - bS;
                // fixed menu first, then auto-found admin pages, then records, website (sitemap) URLs last
                const rank = (i) => (i.key.startsWith("menu-") ? 0 : i.key.startsWith("auto-") ? 1 : i.key.startsWith("sitemap-") ? 3 : 2);
                return rank(a) - rank(b);
            })
            .slice(0, 10);
    }, [query, allItems]);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
                setEditing(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const goTo = (item) => {
        // Close + stop editing; the new page's header will show that page's name
        setEditing(false);
        setQuery("");
        setOpen(false);
        inputRef.current?.blur();
        const qs = item.highlight ? `?highlight=${encodeURIComponent(item.highlight)}` : "";
        if (item.target === pathname) {
            // Already on this page: it won't remount, so tell the highlighter directly
            if (item.highlight) {
                window.history.replaceState(null, "", `${item.target}${qs}`);
                window.dispatchEvent(new CustomEvent("hc:highlight", { detail: item.highlight }));
            }
            return;
        }
        router.push(`${item.target}${qs}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (results[activeIndex]) goTo(results[activeIndex]);
        } else if (e.key === "Escape") {
            setOpen(false);
            setEditing(false);
            setQuery("");
            inputRef.current?.blur();
        }
    };

    return (
        <div className="admin-search" ref={wrapRef}>
            <div className="admin-search-box">
                <FaSearch size={14} color="#94a3b8" />
                <input
                    ref={inputRef}
                    type="text"
                    value={editing ? query : currentLabel}
                    placeholder="Search page by name or URL…  (Ctrl+K)"
                    onChange={(e) => {
                        setEditing(true);
                        setQuery(e.target.value);
                        setActiveIndex(0);
                        setOpen(true);
                    }}
                    onFocus={(e) => {
                        e.target.select();   // typing replaces the current page name
                        setOpen(true);
                        ensureDynamic();
                    }}
                    onKeyDown={handleKeyDown}
                    aria-label="Search admin pages"
                />
                {editing && query && (
                    <button
                        type="button"
                        className="admin-search-clear"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                        aria-label="Clear search"
                    >
                        <FaTimes size={12} />
                    </button>
                )}
            </div>

            {open && editing && query.trim() && (
                <ul className="admin-search-results">
                    {results.length === 0 ? (
                        <li className="admin-search-empty">
                            {loadingDynamic ? "Loading URLs…" : `No pages found for “${query}”`}
                        </li>
                    ) : (
                        results.map((item, i) => (
                            <li
                                key={item.key}
                                className={`admin-search-item ${i === activeIndex ? "active" : ""}`}
                                onMouseEnter={() => setActiveIndex(i)}
                                onMouseDown={(e) => { e.preventDefault(); goTo(item); }}
                            >
                                <div style={{ minWidth: 0 }}>
                                    <div className="admin-search-name">{item.name}</div>
                                    <div className="admin-search-url">
                                        {item.key.startsWith("menu-") || item.target === item.url ? item.url : `${item.url.trim()}  ·  opens ${item.target}`}
                                    </div>
                                </div>
                                <span className="admin-search-group">{item.group}</span>
                            </li>
                        ))
                    )}
                    {loadingDynamic && results.length > 0 && (
                        <li className="admin-search-empty">Loading more URLs…</li>
                    )}
                </ul>
            )}

            <style jsx>{`
                .admin-search { position: relative; width: 100%; max-width: 460px; }
                .admin-search-box {
                    display: flex; align-items: center; gap: 8px;
                    background: #f8fafc; border: 1px solid #e2e8f0;
                    border-radius: 8px; padding: 8px 12px;
                    transition: border-color .2s, box-shadow .2s;
                }
                .admin-search-box:focus-within {
                    border-color: #ff914d;
                    box-shadow: 0 0 0 3px rgba(255, 145, 77, 0.15);
                    background: #fff;
                }
                .admin-search-box input {
                    flex: 1; border: none; outline: none; background: transparent;
                    font-size: 14px; color: #334155; min-width: 0;
                    text-overflow: ellipsis;
                }
                .admin-search-clear {
                    border: none; background: transparent; color: #94a3b8;
                    cursor: pointer; padding: 0; display: flex;
                }
                .admin-search-results {
                    position: absolute; top: calc(100% + 6px); left: 0; right: 0;
                    background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,.1);
                    list-style: none; margin: 0; padding: 6px;
                    max-height: 400px; overflow-y: auto; z-index: 2000;
                }
                .admin-search-item {
                    display: flex; justify-content: space-between; align-items: center;
                    gap: 12px; padding: 8px 10px; border-radius: 6px; cursor: pointer;
                }
                .admin-search-item.active { background: #fff4ed; }
                .admin-search-name {
                    font-size: 14px; font-weight: 600; color: #334155;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .admin-search-url {
                    font-size: 12px; color: #94a3b8;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .admin-search-group {
                    font-size: 11px; color: #ff914d; background: #fff4ed;
                    padding: 2px 8px; border-radius: 10px; white-space: nowrap; flex-shrink: 0;
                }
                .admin-search-empty { padding: 12px; font-size: 13px; color: #64748b; }
            `}</style>
        </div>
    );
};

export default AdminSearch;
