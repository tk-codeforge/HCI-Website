// // scripts/patch-gallery-pages.mjs
// import fs from "fs";
// import path from "path";

// const DRY = process.argv.includes("--dry"); // --dry = show what would change, write nothing
// const APP = path.join(process.cwd(), "src", "app");
// const FOLDERS = ["gallery", "project-gallery"];
// const OLD = /const galleryId = new URLSearchParams\(window\.location\.search\)\.get\("id"\) \?\? null;/;
// const NEW = "const galleryId = await getGalleryId();";
// const IMPORT = 'import { getGalleryId } from "@/utils/getGalleryId";';

// const patched = [];
// const skipped = [];
// const basePaths = [];

// for (const dir of fs.readdirSync(APP, { withFileTypes: true })) {
//   if (!dir.isDirectory() || !/^[a-z0-9-]+$/.test(dir.name)) continue;

//   for (const folder of FOLDERS) {
//     const file = path.join(APP, dir.name, folder, "page.jsx");
//     if (!fs.existsSync(file)) continue;

//     const label = `${dir.name}/${folder}`;
//     basePaths.push(`  '/${label}',`);

//     let src = fs.readFileSync(file, "utf8");
//     if (src.includes("getGalleryId")) { skipped.push(`${label} (already patched)`); continue; }
//     if (!OLD.test(src)) { skipped.push(`${label} (different code, patch by hand)`); continue; }

//     src = src.replace(OLD, NEW);
//     src = /^\s*["']use client["'];?/.test(src)
//       ? src.replace(/^(\s*["']use client["'];?\r?\n)/, `$1${IMPORT}\n`)
//       : `${IMPORT}\n${src}`;
//     if (!DRY) fs.writeFileSync(file, src);
//     patched.push(label);
//   }
// }

// console.log(DRY ? "DRY RUN (no files changed)" : "Done");
// console.log("Patched:", patched.join(", ") || "none");
// console.log("Skipped:\n  " + (skipped.join("\n  ") || "none"));
// console.log("\nPaste into SLUG_BASE_PATHS (backend/src/slug-edit/slug-edit.constants.ts):");
// console.log(basePaths.join("\n"));

// scripts/patch-gallery-pages.mjs
import fs from "fs";
import path from "path";

const DRY = process.argv.includes("--dry"); // --dry = show what would change, write nothing
const APP = path.join(process.cwd(), "src", "app");
const FOLDERS = ["gallery", "project-gallery"];
const OLD =
  /(?:const|let)\s+(\w+)\s*=\s*new URLSearchParams\(\s*window\.location\.search\s*\)\s*\.get\(\s*["']id["']\s*\)(?:\s*(?:\?\?|\|\|)\s*null)?\s*;/;
const NEW = "const $1 = await getGalleryId();";
const IMPORT = 'import { getGalleryId } from "@/utils/getGalleryId";';

const patched = [];
const skipped = [];
const basePaths = [];

for (const dir of fs.readdirSync(APP, { withFileTypes: true })) {
  if (!dir.isDirectory() || !/^[a-z0-9-]+$/.test(dir.name)) continue;

  for (const folder of FOLDERS) {
    const file = path.join(APP, dir.name, folder, "page.jsx");
    if (!fs.existsSync(file)) continue;

    const label = `${dir.name}/${folder}`;
    basePaths.push(`  '/${label}',`);

    let src = fs.readFileSync(file, "utf8");
    if (src.includes("getGalleryId")) { skipped.push(`${label} (already patched)`); continue; }

    const m = src.match(OLD);
    if (!m) { skipped.push(`${label} (different code, patch by hand)`); continue; }

    const before = src.slice(Math.max(0, m.index - 400), m.index);
    if (!/async/.test(before)) {
      skipped.push(`${label} (id line is not inside an async function, patch by hand)`);
      continue;
    }

    src = src.replace(OLD, NEW);
    src = /^\s*["']use client["'];?/.test(src)
      ? src.replace(/^(\s*["']use client["'];?\r?\n)/, `$1${IMPORT}\n`)
      : `${IMPORT}\n${src}`;
    if (!DRY) fs.writeFileSync(file, src);
    patched.push(label);
  }
}

console.log(DRY ? "DRY RUN (no files changed)" : "Done");
console.log("Patched:", patched.join(", ") || "none");
console.log("Skipped:\n  " + (skipped.join("\n  ") || "none"));
console.log("\nAll gallery base paths found:");
console.log(basePaths.join("\n"));