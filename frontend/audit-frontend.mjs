// Run from the frontend folder:  node audit-frontend.mjs
// Read-only. Prints where to look for CSS / font / third-party / image problems.
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SKIP = new Set(["node_modules", ".next", ".git"]);
const TEXT = /\.(jsx?|tsx?|css|scss|mjs|cjs)$/i;

const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
};
const rel = (p) => path.relative(ROOT, p).replaceAll("\\", "/");
const files = [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, "public"))];
const textFiles = files.filter((f) => TEXT.test(f));
const read = (f) => fs.readFileSync(f, "utf8");
const cache = new Map(textFiles.map((f) => [f, read(f)]));

const section = (title) => console.log(`\n=== ${title} ===`);
const grep = (re, { only } = {}) => {
  const hits = [];
  for (const [f, src] of cache) {
    if (only && !only.test(f)) continue;
    src.split(/\r?\n/).forEach((line, i) => {
      if (re.test(line) && !/^\s*(\/\/|\/\*|\*)/.test(line)) hits.push(`${rel(f)}:${i + 1}  ${line.trim().slice(0, 140)}`);
    });
  }
  return hits;
};
const show = (hits, empty = "(none)") => console.log(hits.length ? hits.join("\n") : empty);

section("1. CSS imported by JS/JSX (every one can be render-blocking)");
show(grep(/import\s+["'][^"']+\.(css|scss)["']/));

section("2. Remote fonts / @import in CSS (render-blocking chains)");
show(grep(/fonts\.googleapis|@import\s+url\(\s*["']?https?:/));

section("3. blur / backdrop-filter (expensive repaint on mobile; INP)");
show(grep(/blur-bg|backdrop-?filter|filter:\s*blur/i));

section("4. next/font families + weights");
show(grep(/\b(Poppins|Outfit|Great_Vibes|Roboto|Inter|Montserrat)\(\{/));
console.log("\nUsage count of font CSS variables (0 = loaded but never used):");
for (const v of ["--font-poppins", "--font-outfit", "--font-great-vibes"]) {
  let n = 0;
  for (const [f, src] of cache) if (!/layout\.(js|jsx)$/.test(f)) n += (src.match(new RegExp(`var\\(${v}`, "g")) || []).length;
  console.log(`${v.padEnd(22)} ${n}`);
}

section("5. Literal font-family names that do NOT use next/font (fall back to system fonts)");
show(grep(/font-family:\s*['"]?(poppins|poppins-bold|roboto|sans|sss|futura_font)['"]?\s*[;!]/i, { only: /\.css$/ }).slice(0, 40));

section("6. @font-face / TTF / OTF (unoptimised custom fonts)");
show(grep(/@font-face|\.(ttf|otf)\b/i, { only: /\.css$/ }));
show(files.filter((f) => /\.(ttf|otf)$/i.test(f)).map((f) => `${rel(f)}  ${(fs.statSync(f).size / 1024).toFixed(0)} KiB`));

section("7. Google / Meta tracking code outside layout (dataLayer, gtag, sendGTMEvent...)");
show(grep(/sendGTMEvent|sendGAEvent|@next\/third-parties|window\.gtag|\bgtag\(|dataLayer|\bfbq\(/));

section("8. ClientLayout / react-toastify usage");
show(grep(/ClientLayout|ReactToastify|ToastContainer/));

section("9. Hard-coded dev API / localhost URLs (production depends on them)");
show(grep(/apidev\.hcinterior\.in|localhost:\d+/));

section("10. Bootstrap JS loading");
show(grep(/bootstrap(\.bundle)?(\.min)?\.js|from\s+["']bootstrap["']|require\(["']bootstrap/));

section("11. Heavy files in public/ (> 120 KiB images, any video)");
const heavy = files
  .filter((f) => /\.(png|jpe?g|webp|gif|svg|mp4|webm)$/i.test(f))
  .map((f) => [f, fs.statSync(f).size])
  .filter(([f, s]) => s > 120 * 1024 || /\.(mp4|webm)$/i.test(f))
  .sort((a, b) => b[1] - a[1]);
show(heavy.slice(0, 40).map(([f, s]) => `${(s / 1024).toFixed(0).padStart(6)} KiB  ${rel(f)}`));

section("12. Bootstrap component groups actually referenced in src (candidates to drop from a custom build)");
const bsCss = path.join(ROOT, "node_modules/bootstrap/dist/css/bootstrap.css");
if (!fs.existsSync(bsCss)) {
  console.log("node_modules/bootstrap/dist/css/bootstrap.css not found - run npm install first.");
} else {
  const srcAll = [...cache].filter(([f]) => rel(f).startsWith("src/")).map(([, s]) => s).join("\n");
  const css = read(bsCss);
  const classes = new Set([...css.matchAll(/\.([a-z][a-z0-9-]*)/gi)].map((m) => m[1]));
  const groups = ["btn", "navbar", "nav", "card", "modal", "dropdown", "carousel", "accordion", "offcanvas",
    "tooltip", "popover", "toast", "alert", "badge", "list-group", "pagination", "breadcrumb", "progress",
    "spinner", "table", "form", "input-group", "collapse", "placeholder", "ratio", "carousel", "btn-close"];
  for (const g of [...new Set(groups)]) {
    const cls = [...classes].filter((c) => c === g || c.startsWith(g + "-"));
    const used = cls.filter((c) => new RegExp(`(?<![\\w-])${c}(?![\\w-])`).test(srcAll));
    console.log(`${g.padEnd(12)} ${String(used.length).padStart(3)} / ${String(cls.length).padEnd(3)} used${used.length ? "   e.g. " + used.slice(0, 4).join(", ") : "   <- not referenced in src"}`);
  }
  console.log("\nNOTE: classes that only appear inside CMS/DB HTML (CKEditor content) are not visible here.");
}
console.log("\nDone.");
