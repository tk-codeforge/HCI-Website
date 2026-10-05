// scripts/find-id-lines.mjs: shows how each unpatched gallery page reads its id
import fs from "fs";
import path from "path";

const APP = path.join(process.cwd(), "src", "app");
const FOLDERS = ["gallery", "project-gallery"];
const PATTERN =
  /searchParams|useSearchParams|useParams|window\.location|location\.(search|href|pathname)|get\(\s*["']id["']\s*\)|["']use client["']|async function|async \(|by-id|api\.get\(|fetch\(/;

for (const dir of fs.readdirSync(APP, { withFileTypes: true })) {
  if (!dir.isDirectory() || !/^[a-z0-9-]+$/.test(dir.name)) continue;
  for (const folder of FOLDERS) {
    const file = path.join(APP, dir.name, folder, "page.jsx");
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, "utf8");
    if (src.includes("getGalleryId")) continue; // already patched
    console.log(`\n=== ${dir.name}/${folder} ===`);
    src.split(/\r?\n/).forEach((line, i) => {
      if (PATTERN.test(line)) console.log(`${i + 1}: ${line.trim()}`);
    });
  }
}