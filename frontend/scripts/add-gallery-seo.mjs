// scripts/add-gallery-seo.mjs
// client gallery pages -> server page.jsx (with SEO metadata) + GalleryClient.jsx
import fs from "fs";
import path from "path";

const DRY = process.argv.includes("--dry"); // --dry = show what would change, write nothing
const APP = path.join(process.cwd(), "src", "app");
const FOLDERS = ["gallery", "project-gallery"];
const API = /api\.get\(\s*`([^`$]*)\$\{\w+\}`/;

const done = [];
const skipped = [];

for (const dir of fs.readdirSync(APP, { withFileTypes: true })) {
  if (!dir.isDirectory() || !/^[a-z0-9-]+$/.test(dir.name)) continue;

  for (const folder of FOLDERS) {
    const dirPath = path.join(APP, dir.name, folder);
    const file = path.join(dirPath, "page.jsx");
    if (!fs.existsSync(file)) continue;

    const label = `${dir.name}/${folder}`;
    const src = fs.readFileSync(file, "utf8");

    if (!/^\s*["']use client["']/.test(src)) { skipped.push(`${label} (server page, edit generateMetadata by hand)`); continue; }
    if (fs.existsSync(path.join(dirPath, "GalleryClient.jsx"))) { skipped.push(`${label} (GalleryClient.jsx already exists)`); continue; }

    const m = src.match(API);
    if (!m) { skipped.push(`${label} (could not find the by-id api call, do it by hand)`); continue; }

    const page = `import GalleryClient from "./GalleryClient";
import { buildGalleryMetadata } from "@/utils/gallerySeo";

export async function generateMetadata({ searchParams }) {
  const id = searchParams?.id;
  return buildGalleryMetadata({
    basePath: "/${dir.name}/${folder}",
    id,
    itemApi: \`${m[1]}\${id}\`,
  });
}

export default function GalleryPage() {
  return <GalleryClient />;
}
`;
    if (!DRY) {
      fs.renameSync(file, path.join(dirPath, "GalleryClient.jsx"));
      fs.writeFileSync(file, page);
    }
    done.push(label);
  }
}

console.log(DRY ? "DRY RUN (no files changed)" : "Done");
console.log("Converted:", done.join(", ") || "none");
console.log("Skipped:\n  " + (skipped.join("\n  ") || "none"));