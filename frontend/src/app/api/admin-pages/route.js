// Lists the admin pages that really exist in src/app/cms (every folder that has a page.jsx / page.js / page.tsx).
// The admin search bar uses it, so a page you add later (e.g. cms/global-sitemap/page.jsx) is searchable
// without editing any list. Put at: src/app/api/admin-pages/route.js  ->  GET /api/admin-pages
//
// - Only answers when the admin auth cookie is present (the same "authToken" cookie your api.js already uses).
// - Needs the project source on the server (normal `next start` / `next dev`). On a build without the src
//   folder it simply returns an empty list and the search keeps working with the fixed list.
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PAGE_FILES = ["page.jsx", "page.js", "page.tsx", "page.ts"];
const MAX_DEPTH = 4;
const TTL_MS = 30 * 1000;

let cache = { at: 0, pages: [] };

const findAppDir = () => {
    const root = process.cwd();
    return [path.join(root, "src", "app"), path.join(root, "app")].find((dir) => {
        try { return fs.statSync(path.join(dir, "cms")).isDirectory(); } catch { return false; }
    });
};

const titleCase = (segment) =>
    segment
        .replace(/[-_]+/g, " ")
        .trim()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

const walk = (dir, segments, out) => {
    if (segments.length > MAX_DEPTH) return;
    let entries = [];
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }

    if (segments.length > 0 && entries.some((entry) => entry.isFile() && PAGE_FILES.includes(entry.name))) {
        out.push({
            url: "/" + segments.join("/"),
            name: segments.slice(1).map(titleCase).join(" › "),
        });
    }

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const name = entry.name;
        // dynamic routes ([type]), private folders (_x) and hidden folders are not searchable pages
        if (name.startsWith("[") || name.startsWith("_") || name.startsWith(".")) continue;
        // route groups "(group)" are not part of the URL
        const isGroup = name.startsWith("(") && name.endsWith(")");
        walk(path.join(dir, name), isGroup ? segments : [...segments, name], out);
    }
};

export async function GET(request) {
    if (!request.cookies.get("authToken")?.value) {
        return NextResponse.json({ pages: [] }, { status: 401 });
    }
    if (Date.now() - cache.at < TTL_MS) {
        return NextResponse.json({ pages: cache.pages });
    }
    const appDir = findAppDir();
    const pages = [];
    if (appDir) walk(path.join(appDir, "cms"), ["cms"], pages);
    pages.sort((a, b) => a.url.localeCompare(b.url));
    cache = { at: Date.now(), pages };
    return NextResponse.json({ pages });
}