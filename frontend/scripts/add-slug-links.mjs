// scripts/add-slug-links.mjs (v2)
// list pages (<page>/page.jsx): link to slug URLs instead of ?id=
import fs from "fs";
import path from "path";

const DRY = process.argv.includes("--dry"); // --dry = show what would change, write nothing
const APP = path.join(process.cwd(), "src", "app");
const IMPORT = 'import { getGallerySlugMap, pageGalleryHref } from "@/utils/slugEdit";';
const COMPONENT = /export default async function\s+\w*\s*\([^)]*\)\s*\{/;
const LINK = /`\/?([a-z0-9-]+)\/(gallery|project-gallery)\?id=\$\{([^}]+)\}`/g;

const isCommented = (text, index) => {
  const lineStart = text.lastIndexOf("\n", index) + 1;
  return text.slice(lineStart, index).trimStart().startsWith("//");
};

const done = [];
const skipped = [];

for (const dir of fs.readdirSync(APP, { withFileTypes: true })) {
  if (!dir.isDirectory() || !/^[a-z0-9-]+$/.test(dir.name)) continue;
  const file = path.join(APP, dir.name, "page.jsx");
  if (!fs.existsSync(file)) continue;

  let src = fs.readFileSync(file, "utf8");
  if (src.includes("getGallerySlugMap")) continue; // already patched

  // active (not commented-out) ?id= links that point at a real gallery folder
  const links = [...src.matchAll(LINK)].filter(
    (m) => !isCommented(src, m.index) && fs.existsSync(path.join(APP, m[1], m[2]))
  );
  if (links.length === 0) continue;

  const label = dir.name;
  if (/^\s*["']use client["']/.test(src)) { skipped.push(`${label} (client component, edit by hand)`); continue; }

  const comp = src.match(COMPONENT);
  if (!comp) { skipped.push(`${label} (no 'export default async function', edit by hand)`); continue; }
  const start = comp.index + comp[0].length;
  if (links.some((m) => m.index < start)) { skipped.push(`${label} (active links built outside the component, edit by hand)`); continue; }

  const targets = new Set(links.map((m) => `${m[1]}|${m[2]}`));
  if (targets.size !== 1) { skipped.push(`${label} (links to several galleries: ${[...targets].join(", ")}, edit by hand)`); continue; }

  const [page, folder] = [...targets][0].split("|");
  const folderArg = folder === "gallery" ? "" : `, "${folder}"`;

  let count = 0;
  const head = src.slice(0, start);
  const tail = src.slice(start).replace(LINK, (full, p, f, expr, offset, whole) => {
    if (p !== page || f !== folder || isCommented(whole, offset)) return full;
    count++;
    return `pageGalleryHref("${page}", slugMap, ${expr}${folderArg})`;
  });

  src = `${IMPORT}\n${head}\n  const slugMap = await getGallerySlugMap("${page}"${folderArg});${tail}`;
  if (!DRY) fs.writeFileSync(file, src);
  done.push(`${label} -> ${page}/${folder}: ${count} link(s)`);
}

console.log(DRY ? "DRY RUN (no files changed)" : "Done");
console.log("Patched:\n  " + (done.join("\n  ") || "none"));
console.log("Skipped:\n  " + (skipped.join("\n  ") || "none"));