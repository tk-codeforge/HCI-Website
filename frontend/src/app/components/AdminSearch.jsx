"use client";
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { FaSearch, FaTimes } from "react-icons/fa";
import api from "@/utils/api";
import { ADMIN_MENU_ITEMS } from "../../utils/adminMenuItems";
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
const CACHE_MS = 5 * 60 * 1000;

const fetchDynamicItems = async (isAdmin) => {
    const calls = [
        api.get("/cms-pages/all"),                 // 0 custom pages
        api.get("/redirects"),                     // 1 redirects + custom URL changes
        isAdmin ? api.get("/seo-tag") : null,      // 2 global SEO (admin page)
        isAdmin ? api.get("/slug-edit") : null,    // 3 slug settings (admin page)
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

    // What the box shows when the user is NOT typing = the page they are on now
    const currentLabel = useMemo(() => {
        const exact = staticItems.find((i) => i.url === pathname);
        if (exact) return exact.name;
        return pathname || "";
    }, [staticItems, pathname]);

    const results = useMemo(() => {
        const q = normalize(query);
        if (!q) return [];
        return allItems
            .filter(
                (i) =>
                    normalize(i.name).includes(q) ||
                    normalize(i.url).includes(q) ||
                    normalize(i.group).includes(q) ||
                    normalize(i.extra).includes(q)
            )
            .sort((a, b) => {
                const aS = normalize(a.name).startsWith(q) ? 0 : 1;
                const bS = normalize(b.name).startsWith(q) ? 0 : 1;
                if (aS !== bS) return aS - bS;
                return (a.key.startsWith("menu-") ? 0 : 1) - (b.key.startsWith("menu-") ? 0 : 1);
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
                                        {item.key.startsWith("menu-") ? item.url : `${item.url.trim()}  ·  opens ${item.target}`}
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
