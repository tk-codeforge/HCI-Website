// import { NextResponse } from "next/server";

// export function middleware(request) {
//   const url = request.nextUrl;
//   const { pathname, searchParams } = url;

//   // --- 1. SPECIAL CASE: Redirect "trk=public_post-text" to Homepage ---
//   if (pathname === "/" && searchParams.has("trk")) {
//     return NextResponse.redirect(new URL("/", request.url), 301);
//   }

//   // --- 2. SPECIAL CASE: Blog ID Redirects (From your Excel Sheet) ---
//   // Mapping of ID to new Slug
//   const blogIdRedirects = {
//     "36": "/modern-backlight-pvc-ceiling-design-for-small-rooms",
//     "33": "/top-notch-office-interior-designer-in-noida-2024",
//     "27": "/elevating-home-aesthatics-with-interior-designers-in-noida",
//     "17": "/difference-between-luxury-interior-designers-normal-interior-designers",
//     "42": "/types-of-sofa-design",
//     "23": "/top-10-interior-design-companies-in-noida",
//     "31": "/10-best-stunning-bathroom-cabinet-designs-for-small-space-elevate-your-bathroom-aesthetics",
//     "26": "/home-interior-design-company-in-delhi-ncr",
//     "18": "/how-to-arrange-plants-in-living-room",
//     "9": "/top-10-interior-designers-in-delhi"
//   };

//   if (pathname === "/blog-detail" && searchParams.has("id")) {
//     const id = searchParams.get("id");
//     if (blogIdRedirects[id]) {
//       return NextResponse.redirect(new URL(blogIdRedirects[id], request.url), 301);
//     }
//   }

//   // --- 3. FIX: "services-detail?city=..." -> "/services-detail/..." ---
//   // This helps enforce the clean structure internally if accessed via params
//   if (pathname === "/services-detail" && searchParams.has("city")) {
//     const city = searchParams.get("city");
    
//     // If city is invalid, go to main services
//     if (!city || city === "undefined" || city === "null") {
//       return NextResponse.redirect(new URL("/services", request.url), 301);
//     }

//     // Redirect to the clean URL structure
//     return NextResponse.redirect(new URL(`/services-detail/${city}`, request.url), 301);
//   }

//   // --- 4. REDIRECT MAP (Path based) ---
//   const redirectMap = {
//     // Basic Page Cleanup
//     "/home": "/",
//     "/reallife-portfolio": "/residential-projects",
//     "/design-excellence-awards": "/awards",
//     "/design-excellence-awards/": "/awards",

//     // Old Blog Paths (From Excel)
//     "/blog/two-colour-combination-for-kitchen-laminates": "/two-colour-combination-for-kitchen-laminates",
//     "/blog/pooja-room-designs": "/pooja-room-designs",
    
//     // Old Location/Service Paths (From Excel)
//     "/top-10-interior-designers-and-decorators-trends-in-delhi": "/top-10-interior-designers-in-delhi",
//     "/best-interior-designers-in-delhi": "/best-interior-designers-in-delhi-ncr",

//     // Old WordPress Categories/Tags
//     "/category/blogs": "/blog",
//     "/category/blogs/": "/blog",
//     "/category/news": "/blog",
//     "/author/lalit": "/blog",
//     "/comments/feed": "/blog",
    
//     // Tag Cleanups
//     "/tag/interior-design-company-in-noida": "/services-detail/noida",
//     "/tag/interior-designers-in-noida-extension": "/services-detail/noida",
//     "/tag/interior-designer-in-noida-sector-63": "/services-detail/noida",
//     "/greater-noida": "/services-detail/greater_noida",
//     "/best-interior-designers-in-west-delhi": "/services-detail/delhi",
//   };

//   // Remove trailing slashes for matching
//   const normalizedPath = pathname.length > 1 && pathname.endsWith("/") 
//     ? pathname.slice(0, -1) 
//     : pathname;

//   if (redirectMap[normalizedPath]) {
//     return NextResponse.redirect(new URL(redirectMap[normalizedPath], request.url), 301);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   // Apply to all routes except api, static files, images, etc.
//   matcher: [
//     "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };




// import { NextResponse } from "next/server";

// const SLUG_FOLDER = /^\/([a-z0-9-]+)\/((?:project-)?gallery)(?:\/([^/]+))?\/?$/;
// const SLUG_SKIP = ["cms", "api", "dashboard", "blog"];
// const redirectNoCache = (dest, status) => {
//   const res = NextResponse.redirect(dest, status);
//   res.headers.set("Cache-Control", "no-store, max-age=0"); // editable URLs: browsers must not cache these
//   return res;
// };

// const slugApiGet = async (path) => {
//   try {
//     const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999";
//     const res = await fetch(`${base}${path}`, { cache: "no-store" });
//     return res.ok ? await res.json() : null;
//   } catch {
//     return null;
//   }
// };

// export async function middleware(request) {
//   const url = request.nextUrl;
//   const { pathname, searchParams } = url;

//   // Combine path and query string (e.g., "/ready-togo-design/gallery?id=114")
//   const fullPathWithQuery = url.search ? `${pathname}${url.search}` : pathname;

//   // --- 1. SPECIAL CASE: Redirect "trk=public_post-text" to Homepage ---
//   if (pathname === "/" && searchParams.has("trk")) {
//     return NextResponse.redirect(new URL("/", request.url), 301);
//   }

//   // --- 2. SPECIAL CASE: Blog ID Redirects (From your Excel Sheet) ---
//   // const blogIdRedirects = {
//   //   "36": "/modern-backlight-pvc-ceiling-design-for-small-rooms",
//   //   "33": "/top-notch-office-interior-designer-in-noida-2024",
//   //   "27": "/elevating-home-aesthatics-with-interior-designers-in-noida",
//   //   "17": "/difference-between-luxury-interior-designers-normal-interior-designers",
//   //   "42": "/types-of-sofa-design",
//   //   "23": "/top-10-interior-design-companies-in-noida",
//   //   "31": "/10-best-stunning-bathroom-cabinet-designs-for-small-space-elevate-your-bathroom-aesthetics",
//   //   "26": "/home-interior-design-company-in-delhi-ncr",
//   //   "18": "/how-to-arrange-plants-in-living-room",
//   //   "9": "/top-10-interior-designers-in-delhi"
//   // };

//   const blogIdRedirects = {
//   "36": "/blog/modern-backlight-pvc-ceiling-design-for-small-rooms",
//   "33": "/blog/top-notch-office-interior-designer-in-noida-2024",
//   "27": "/blog/elevating-home-aesthatics-with-interior-designers-in-noida",
//   "17": "/blog/difference-between-luxury-interior-designers-normal-interior-designers",
//   "42": "/blog/types-of-sofa-design",
//   "23": "/blog/top-10-interior-design-companies-in-noida",
//   "31": "/blog/10-best-stunning-bathroom-cabinet-designs-for-small-space-elevate-your-bathroom-aesthetics",
//   "26": "/blog/home-interior-design-company-in-delhi-ncr",
//   "18": "/blog/how-to-arrange-plants-in-living-room",
//   "9": "/blog/top-10-interior-designers-in-delhi"
// };

//   if (pathname === "/blog-detail" && searchParams.has("id")) {
//     const id = searchParams.get("id");
//     if (blogIdRedirects[id]) {
//       return NextResponse.redirect(new URL(blogIdRedirects[id], request.url), 301);
//     }
//   }

//   // --- 3. FIX: "services-detail?city=..." -> "/services-detail/..." ---
//   if (pathname === "/services-detail" && searchParams.has("city")) {
//     const city = searchParams.get("city");
//     if (!city || city === "undefined" || city === "null") {
//       return NextResponse.redirect(new URL("/services", request.url), 301);
//     }
//     return NextResponse.redirect(new URL(`/services-detail/${city}`, request.url), 301);
//   }

//   // --- 4. REDIRECT MAP (Legacy Hardcoded Paths) ---
//   const redirectMap = {
//     "/home": "/",
//     "/reallife-portfolio": "/residential-projects",
//     "/design-excellence-awards": "/awards",
//     "/design-excellence-awards/": "/awards",
//     // "/blog/two-colour-combination-for-kitchen-laminates": "/two-colour-combination-for-kitchen-laminates",
//     // "/blog/pooja-room-designs": "/pooja-room-designs",
//     "/top-10-interior-designers-and-decorators-trends-in-delhi": "/top-10-interior-designers-in-delhi",
//     "/best-interior-designers-in-delhi": "/best-interior-designers-in-delhi-ncr",
//     "/category/blogs": "/blog",
//     "/category/blogs/": "/blog",
//     "/category/news": "/blog",
//     "/author/lalit": "/blog",
//     "/comments/feed": "/blog",
//     "/tag/interior-design-company-in-noida": "/services-detail/noida",
//     "/tag/interior-designers-in-noida-extension": "/services-detail/noida",
//     "/tag/interior-designer-in-noida-sector-63": "/services-detail/noida",
//     "/greater-noida": "/services-detail/greater_noida",
//     "/best-interior-designers-in-west-delhi": "/services-detail/delhi",
//   };

//   const normalizedPath = pathname.length > 1 && pathname.endsWith("/") 
//     ? pathname.slice(0, -1) 
//     : pathname;

//   if (redirectMap[normalizedPath]) {
//     const destination = redirectMap[normalizedPath] === '/' ? new URL("/", request.url) : new URL(redirectMap[normalizedPath], request.url);
//     return NextResponse.redirect(destination, 301);
//   }

//   // --- 5. DYNAMIC REDIRECTS (Fetched from CMS via NestJS API) ---
//   try {
//     const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999"; 
    
//     const res = await fetch(`${apiUrl}/redirects/active`, {
//       next: { revalidate: 60 }
//     });

//     if (res.ok) {
//       const activeRedirects = await res.json(); 
      
//       // FIX: Check against the full path with query, the normalized path, AND the regular path
//       const match = activeRedirects.find(r => 
//         r.old_url === fullPathWithQuery || 
//         r.old_url === normalizedPath || 
//         r.old_url === pathname
//       );
      
//       if (match) {
//         const destination = match.new_url === '/' ? new URL("/", request.url) : new URL(match.new_url, request.url);
//         return NextResponse.redirect(destination, match.status_code || 301);
//       }
//     }
//   } catch (error) {
//     console.error("Middleware fetch dynamic redirects failed:", error);
//   }
//   // const gm = normalizedPath.match(SLUG_FOLDER);
//   // if (gm && !SLUG_SKIP.includes(gm[1])) {
//   //   const [, page, folder, slug] = gm;
//   //   const type = `${page}-${folder}`; // e.g. product-gallery, kitchen-project-gallery

//   //   if (!slug) {
//   //     const id = searchParams.get("id");
//   //     if (id && /^\d+$/.test(id)) {
//   //       const data = await slugApiGet(`/slug-edit/by-entity?entityType=${type}&entityId=${id}`);
//   //       if (data?.slug) {
//   //         const dest = request.nextUrl.clone();
//   //         dest.pathname = data.canonical;
//   //         dest.searchParams.delete("id");
//   //         return NextResponse.redirect(dest, 301);
//   //       }
//   //     }
//   //   } else {
//   //     const data = await slugApiGet(`/slug-edit/resolve?path=${encodeURIComponent(normalizedPath)}`);
//   //     if (data) {
//   //       const dest = request.nextUrl.clone();
//   //       if (data.redirect) {                       // old slug -> current slug
//   //         dest.pathname = data.canonical;
//   //         return NextResponse.redirect(dest, 301);
//   //       }
//   //       dest.pathname = `/${page}/${folder}`;
//   //       dest.searchParams.set("id", String(data.entityId));
//   //       return NextResponse.rewrite(dest);
//   //     }
//   //   }
//   // }

//   // const gm = normalizedPath.match(SLUG_FOLDER);
//   // if (gm && !SLUG_SKIP.includes(gm[1])) {
//   //   const [, page, folder, slug] = gm;
//   //   const type = `${page}-${folder}`;

//   //   if (!slug) {
//   //     // /<page>/gallery?id=103 -> slug URL (only if an active slug exists)
//   //     const id = searchParams.get("id");
//   //     if (id && /^\d+$/.test(id)) {
//   //       const data = await slugApiGet(`/slug-edit/by-entity?entityType=${type}&entityId=${id}`);
//   //       if (data?.slug && data.canonical?.startsWith("/")) {
//   //         const dest = request.nextUrl.clone();
//   //         dest.pathname = data.canonical;
//   //         dest.searchParams.delete("id");
//   //         return redirectNoCache(dest, 301);
//   //       }
//   //     }
//   //   } else {
//   //     const data = await slugApiGet(`/slug-edit/resolve?path=${encodeURIComponent(normalizedPath)}`);
//   //     if (data) {
//   //       const dest = request.nextUrl.clone();
//   //       if (data.redirect) {
//   //         if (!data.canonical?.startsWith("/")) return NextResponse.next(); // never redirect to "undefined/..."
//   //         const [p, q] = data.canonical.split("?");
//   //         dest.pathname = p;
//   //         dest.search = q ? `?${q}` : "";
//   //         // renamed slug: permanent; deleted/disabled slug -> original ?id= URL: temporary
//   //         return redirectNoCache(dest, q ? 302 : 301);
//   //       }
//   //       dest.pathname = `/${page}/${folder}`;
//   //       dest.searchParams.set("id", String(data.entityId));
//   //       return NextResponse.rewrite(dest);
//   //     }
//   //   }
//   // }

//     // --- 6. EDITABLE SLUG URLS (CMS > Slug Setting) ---
//   // let target = null;
//   // const cm = normalizedPath.match(CENTER_GALLERY);
//   // if (cm && cm[1] !== "gallery") {
//   //   // generated experience centers: /experience-center/<center>/gallery[/<slug>]
//   //   target = { type: `center~${cm[1]}`, base: `/experience-center/${cm[1]}/gallery`, slug: cm[2] };
//   // } else {
//   //   const gm = normalizedPath.match(SLUG_FOLDER);
//   //   if (gm && !SLUG_SKIP.includes(gm[1])) {
//   //     target = { type: `${gm[1]}-${gm[2]}`, base: `/${gm[1]}/${gm[2]}`, slug: gm[3] };
//   //   }
//   // }
//   let target = null;
//   const gm = normalizedPath.match(SLUG_FOLDER);
//   if (gm && !SLUG_SKIP.includes(gm[1])) {
//     target = { type: `${gm[1]}-${gm[2]}`, base: `/${gm[1]}/${gm[2]}`, slug: gm[3] };
//   }

//   if (target) {
//     const { type, base, slug } = target;

//     if (!slug) {
//       const id = searchParams.get("id");
//       if (id && /^\d+$/.test(id)) {
//         const data = await slugApiGet(`/slug-edit/by-entity?entityType=${encodeURIComponent(type)}&entityId=${id}`);
//         if (data?.slug && data.canonical?.startsWith("/")) {
//           const dest = request.nextUrl.clone();
//           dest.pathname = data.canonical;
//           dest.searchParams.delete("id");
//           return redirectNoCache(dest, 301);
//         }
//       }
//     } else {
//       const data = await slugApiGet(`/slug-edit/resolve?path=${encodeURIComponent(normalizedPath)}`);
//       if (data) {
//         const dest = request.nextUrl.clone();
//         if (data.redirect) {
//           if (!data.canonical?.startsWith("/")) return NextResponse.next();
//           const [p, q] = data.canonical.split("?");
//           dest.pathname = p;
//           dest.search = q ? `?${q}` : "";
//           return redirectNoCache(dest, q ? 302 : 301);
//         }
//         dest.pathname = base;
//         dest.searchParams.set("id", String(data.entityId));
//         return NextResponse.rewrite(dest);
//       }
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };



// import { NextResponse } from "next/server";

// export function middleware(request) {
//   const url = request.nextUrl;
//   const { pathname, searchParams } = url;

//   // --- 1. SPECIAL CASE: Redirect "trk=public_post-text" to Homepage ---
//   if (pathname === "/" && searchParams.has("trk")) {
//     return NextResponse.redirect(new URL("/", request.url), 301);
//   }

//   // --- 2. SPECIAL CASE: Blog ID Redirects (From your Excel Sheet) ---
//   // Mapping of ID to new Slug
//   const blogIdRedirects = {
//     "36": "/modern-backlight-pvc-ceiling-design-for-small-rooms",
//     "33": "/top-notch-office-interior-designer-in-noida-2024",
//     "27": "/elevating-home-aesthatics-with-interior-designers-in-noida",
//     "17": "/difference-between-luxury-interior-designers-normal-interior-designers",
//     "42": "/types-of-sofa-design",
//     "23": "/top-10-interior-design-companies-in-noida",
//     "31": "/10-best-stunning-bathroom-cabinet-designs-for-small-space-elevate-your-bathroom-aesthetics",
//     "26": "/home-interior-design-company-in-delhi-ncr",
//     "18": "/how-to-arrange-plants-in-living-room",
//     "9": "/top-10-interior-designers-in-delhi"
//   };

//   if (pathname === "/blog-detail" && searchParams.has("id")) {
//     const id = searchParams.get("id");
//     if (blogIdRedirects[id]) {
//       return NextResponse.redirect(new URL(blogIdRedirects[id], request.url), 301);
//     }
//   }

//   // --- 3. FIX: "services-detail?city=..." -> "/services-detail/..." ---
//   // This helps enforce the clean structure internally if accessed via params
//   if (pathname === "/services-detail" && searchParams.has("city")) {
//     const city = searchParams.get("city");
    
//     // If city is invalid, go to main services
//     if (!city || city === "undefined" || city === "null") {
//       return NextResponse.redirect(new URL("/services", request.url), 301);
//     }

//     // Redirect to the clean URL structure
//     return NextResponse.redirect(new URL(`/services-detail/${city}`, request.url), 301);
//   }

//   // --- 4. REDIRECT MAP (Path based) ---
//   const redirectMap = {
//     // Basic Page Cleanup
//     "/home": "/",
//     "/reallife-portfolio": "/residential-projects",
//     "/design-excellence-awards": "/awards",
//     "/design-excellence-awards/": "/awards",

//     // Old Blog Paths (From Excel)
//     "/blog/two-colour-combination-for-kitchen-laminates": "/two-colour-combination-for-kitchen-laminates",
//     "/blog/pooja-room-designs": "/pooja-room-designs",
    
//     // Old Location/Service Paths (From Excel)
//     "/top-10-interior-designers-and-decorators-trends-in-delhi": "/top-10-interior-designers-in-delhi",
//     "/best-interior-designers-in-delhi": "/best-interior-designers-in-delhi-ncr",

//     // Old WordPress Categories/Tags
//     "/category/blogs": "/blog",
//     "/category/blogs/": "/blog",
//     "/category/news": "/blog",
//     "/author/lalit": "/blog",
//     "/comments/feed": "/blog",
    
//     // Tag Cleanups
//     "/tag/interior-design-company-in-noida": "/services-detail/noida",
//     "/tag/interior-designers-in-noida-extension": "/services-detail/noida",
//     "/tag/interior-designer-in-noida-sector-63": "/services-detail/noida",
//     "/greater-noida": "/services-detail/greater_noida",
//     "/best-interior-designers-in-west-delhi": "/services-detail/delhi",
//   };

//   // Remove trailing slashes for matching
//   const normalizedPath = pathname.length > 1 && pathname.endsWith("/") 
//     ? pathname.slice(0, -1) 
//     : pathname;

//   if (redirectMap[normalizedPath]) {
//     return NextResponse.redirect(new URL(redirectMap[normalizedPath], request.url), 301);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   // Apply to all routes except api, static files, images, etc.
//   matcher: [
//     "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };

// import { NextResponse } from "next/server";

// const GALLERY_BASES = [
//   "/design-idea/gallery",
//   "/designer-choice/gallery",
//   "/award-gallery/gallery",
//   "/experience-center-noida/gallery",
//   "/experience-center-faridabad/gallery",
//   "/experience-center-gurugram/gallery",
//   "/experience-center-new-delhi/gallery",
//   "/experience-center-noida-extension/gallery",
//   "/furniture/gallery",
//   "/luxury-projects/project-gallery",
//   "/product/gallery",
//   "/ready-togo-design/gallery",
//   "/residential-projects/project-gallery",
//   "/rattan/gallery",
//   "/reclaimed-wood/gallery",
//   "/spacesaving-furniture/gallery",
//   "/wallpaper/gallery",
// ];

// const normalizePath = (value) => {
//   const path = value || "/";
//   const collapsed = path.replace(/\/{2,}/g, "/");
//   return collapsed.length > 1 ? collapsed.replace(/\/$/, "") : "/";
// };

// const parseInternalPath = (value, baseUrl) => {
//   try {
//     const parsed = new URL(value, baseUrl || "https://hcinterior.in");
//     return { pathname: normalizePath(parsed.pathname), searchParams: parsed.searchParams, search: parsed.search };
//   } catch {
//     return null;
//   }
// };

// // A query-bearing source (for example /gallery?id=83) is an exact item mapping.
// // A path-only source (for example /product) also maps its child routes.
// const matchUrlRule = (currentUrl, ruleUrl, allowDescendants = true) => {
//   const current = parseInternalPath(currentUrl.toString(), currentUrl.origin);
//   const rule = parseInternalPath(ruleUrl, currentUrl.origin);
//   if (!current || !rule) return null;
//   if (current.pathname !== rule.pathname) {
//     if (!allowDescendants || rule.searchParams.size > 0 || !current.pathname.startsWith(`${rule.pathname}/`)) return null;
//     return { suffix: current.pathname.slice(rule.pathname.length), hasRuleQuery: false };
//   }
//   for (const [key, expected] of rule.searchParams.entries()) {
//     if (current.searchParams.get(key) !== expected) return null;
//   }
//   return { suffix: "", hasRuleQuery: rule.searchParams.size > 0 };
// };

// const buildRuleDestination = (ruleUrl, suffix, currentUrl, preserveIncomingQuery) => {
//   const destination = new URL(ruleUrl, currentUrl.origin);
//   destination.pathname = normalizePath(`${destination.pathname}${suffix || ""}`);
//   if (preserveIncomingQuery) {
//     for (const [key, value] of currentUrl.searchParams.entries()) {
//       if (!destination.searchParams.has(key)) destination.searchParams.append(key, value);
//     }
//   }
//   return destination;
// };

// const redirectNoCache = (dest, status) => {
//   const res = NextResponse.redirect(dest, status);
//   res.headers.set("Cache-Control", "no-store, max-age=0");
//   return res;
// };

// const getApiBaseUrl = () =>
//   process.env.NODE_ENV === "development"
//     ? process.env.NEXT_PUBLIC_API_DEV_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999"
//     : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999";

// const getGalleryTarget = (pathname) => {
//   const clean = normalizePath(pathname);

//   // Legacy URL: /parent/gallery/slug
//   for (const base of GALLERY_BASES) {
//     const entityType = base.slice(1).replace(/\//g, "-");
//     if (clean === base) return { type: entityType, base, slug: null };
//     if (clean.startsWith(`${base}/`)) {
//       const slug = clean.slice(base.length + 1);
//       if (slug && !slug.includes("/")) return { type: entityType, base, slug };
//     }
//   }

//   // New canonical URL: /parent/slug
//   const parents = GALLERY_BASES
//     .map((base) => ({ base, parent: base.replace(/\/(?:project-)?gallery$/, "") }))
//     .sort((a, b) => b.parent.length - a.parent.length);
//   for (const { base, parent } of parents) {
//     if (clean.startsWith(`${parent}/`)) {
//       const slug = clean.slice(parent.length + 1);
//       if (slug && !slug.includes("/") && slug !== "gallery" && slug !== "project-gallery") {
//         return { type: base.slice(1).replace(/\//g, "-"), base, slug };
//       }
//     }
//   }

//   // Dynamic experience-center gallery: /experience-center/<center>/gallery[/slug]
//   const dynamicLegacy = clean.match(/^\/experience-center\/(experience-center-[a-z0-9-]+)\/gallery(?:\/([^/]+))?$/);
//   if (dynamicLegacy) {
//     return {
//       type: `center~${dynamicLegacy[1]}`,
//       base: `/experience-center/${dynamicLegacy[1]}/gallery`,
//       slug: dynamicLegacy[2] || null,
//     };
//   }

//   // Dynamic experience-center canonical URL: /experience-center/<center>/<slug>
//   const dynamicCanonical = clean.match(/^\/experience-center\/(experience-center-[a-z0-9-]+)\/([^/]+)$/);
//   if (dynamicCanonical && dynamicCanonical[2] !== "gallery") {
//     return {
//       type: `center~${dynamicCanonical[1]}`,
//       base: `/experience-center/${dynamicCanonical[1]}/gallery`,
//       slug: dynamicCanonical[2],
//     };
//   }

//   return null;
// };

// const slugApiGet = async (path) => {
//   try {
//     const base = getApiBaseUrl();
//     const res = await fetch(`${base}${path}`, { cache: "no-store" });
//     return res.ok ? await res.json() : null;
//   } catch {
//     return null;
//   }
// };

// export async function middleware(request) {
//   const url = request.nextUrl;
//   const { pathname, searchParams } = url;

//   // --- 1. SPECIAL CASE: Redirect "trk=public_post-text" to Homepage ---
//   if (pathname === "/" && searchParams.has("trk")) {
//     return NextResponse.redirect(new URL("/", request.url), 301);
//   }

//   // --- 2. SPECIAL CASE: Blog ID Redirects (From your Excel Sheet) ---
//   // const blogIdRedirects = {
//   //   "36": "/modern-backlight-pvc-ceiling-design-for-small-rooms",
//   //   "33": "/top-notch-office-interior-designer-in-noida-2024",
//   //   "27": "/elevating-home-aesthatics-with-interior-designers-in-noida",
//   //   "17": "/difference-between-luxury-interior-designers-normal-interior-designers",
//   //   "42": "/types-of-sofa-design",
//   //   "23": "/top-10-interior-design-companies-in-noida",
//   //   "31": "/10-best-stunning-bathroom-cabinet-designs-for-small-space-elevate-your-bathroom-aesthetics",
//   //   "26": "/home-interior-design-company-in-delhi-ncr",
//   //   "18": "/how-to-arrange-plants-in-living-room",
//   //   "9": "/top-10-interior-designers-in-delhi"
//   // };

//   const blogIdRedirects = {
//   "36": "/blog/modern-backlight-pvc-ceiling-design-for-small-rooms",
//   "33": "/blog/top-notch-office-interior-designer-in-noida-2024",
//   "27": "/blog/elevating-home-aesthatics-with-interior-designers-in-noida",
//   "17": "/blog/difference-between-luxury-interior-designers-normal-interior-designers",
//   "42": "/blog/types-of-sofa-design",
//   "23": "/blog/top-10-interior-design-companies-in-noida",
//   "31": "/blog/10-best-stunning-bathroom-cabinet-designs-for-small-space-elevate-your-bathroom-aesthetics",
//   "26": "/blog/home-interior-design-company-in-delhi-ncr",
//   "18": "/blog/how-to-arrange-plants-in-living-room",
//   "9": "/blog/top-10-interior-designers-in-delhi"
// };

//   if (pathname === "/blog-detail" && searchParams.has("id")) {
//     const id = searchParams.get("id");
//     if (blogIdRedirects[id]) {
//       return NextResponse.redirect(new URL(blogIdRedirects[id], request.url), 301);
//     }
//   }

//   // --- 3. FIX: "services-detail?city=..." -> "/services-detail/..." ---
//   if (pathname === "/services-detail" && searchParams.has("city")) {
//     const city = searchParams.get("city");
//     if (!city || city === "undefined" || city === "null") {
//       return NextResponse.redirect(new URL("/services", request.url), 301);
//     }
//     return NextResponse.redirect(new URL(`/services-detail/${city}`, request.url), 301);
//   }

//   // --- 4. REDIRECT MAP (Legacy Hardcoded Paths) ---
//   const redirectMap = {
//     "/home": "/",
//     "/reallife-portfolio": "/residential-projects",
//     "/design-excellence-awards": "/awards",
//     "/design-excellence-awards/": "/awards",
//     // "/blog/two-colour-combination-for-kitchen-laminates": "/two-colour-combination-for-kitchen-laminates",
//     // "/blog/pooja-room-designs": "/pooja-room-designs",
//     "/top-10-interior-designers-and-decorators-trends-in-delhi": "/top-10-interior-designers-in-delhi",
//     "/best-interior-designers-in-delhi": "/best-interior-designers-in-delhi-ncr",
//     "/category/blogs": "/blog",
//     "/category/blogs/": "/blog",
//     "/category/news": "/blog",
//     "/author/lalit": "/blog",
//     "/comments/feed": "/blog",
//     "/tag/interior-design-company-in-noida": "/services-detail/noida",
//     "/tag/interior-designers-in-noida-extension": "/services-detail/noida",
//     "/tag/interior-designer-in-noida-sector-63": "/services-detail/noida",
//     "/greater-noida": "/services-detail/greater_noida",
//     "/best-interior-designers-in-west-delhi": "/services-detail/delhi",
//   };

//   const normalizedPath = pathname.length > 1 && pathname.endsWith("/") 
//     ? pathname.slice(0, -1) 
//     : pathname;

//   if (redirectMap[normalizedPath]) {
//     const destination = redirectMap[normalizedPath] === '/' ? new URL("/", request.url) : new URL(redirectMap[normalizedPath], request.url);
//     return NextResponse.redirect(destination, 301);
//   }

//   // CMS and dashboard routes are deliberately excluded from all configurable URL rules.
//   if (pathname === "/cms" || pathname.startsWith("/cms/") || pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
//     return NextResponse.next();
//   }

//   // --- 5. DYNAMIC REDIRECTS + URL ALIASES (CMS > Slug Settings) ---
//   let activeRedirects = [];
//   try {
//     const apiUrl = getApiBaseUrl();
//     const res = await fetch(`${apiUrl}/redirects/active`, {
//       next: { revalidate: 30 },
//     });
//     if (res.ok) activeRedirects = await res.json();
//   } catch (error) {
//     console.error("Middleware fetch dynamic redirects failed:", error);
//   }

//   const aliasRules = activeRedirects
//     .filter((item) => item?.is_url_rewrite === true)
//     .sort((a, b) => Math.max(String(b.old_url || "").length, String(b.new_url || "").length) - Math.max(String(a.old_url || "").length, String(a.new_url || "").length));

//   // 5a. Existing redirect records remain ordinary redirects (no reverse rewrite).
//   const normalRedirects = activeRedirects.filter((item) => item?.is_url_rewrite !== true);
//   const normalMatch = normalRedirects.find((item) => {
//     const oldRule = parseInternalPath(item.old_url, request.url);
//     if (!oldRule) return false;
//     if (oldRule.searchParams.size > 0) {
//       return !!matchUrlRule(url, item.old_url, false);
//     }
//     return normalizePath(pathname) === oldRule.pathname;
//   });
//   if (normalMatch) {
//     const oldRule = parseInternalPath(normalMatch.old_url, request.url);
//     const preserve = !oldRule?.searchParams?.size;
//     const destination = buildRuleDestination(normalMatch.new_url, "", url, preserve);
//     return redirectNoCache(destination, normalMatch.status_code || 301);
//   }

//   // 5b. An old URL is permanently/temporarily redirected to its new public URL.
//   // For path-only mappings, child URLs are moved as well: /product/x -> /designer-product/x.
//   const oldAliasMatch = aliasRules
//     .map((item) => ({ item, match: matchUrlRule(url, item.old_url, true) }))
//     .find((entry) => entry.match);
//   if (oldAliasMatch) {
//     const destination = buildRuleDestination(
//       oldAliasMatch.item.new_url,
//       oldAliasMatch.match.suffix,
//       url,
//       !oldAliasMatch.match.hasRuleQuery,
//     );
//     return redirectNoCache(destination, oldAliasMatch.item.status_code || 301);
//   }

//   // 5c. The new public URL is an alias for the original Next.js route. Keep the
//   // browser URL unchanged and continue resolving gallery IDs against the old route.
//   let internalUrl = url.clone();
//   const reverseAliasMatch = aliasRules
//     .map((item) => ({ item, match: matchUrlRule(url, item.new_url, !parseInternalPath(item.old_url, request.url)?.searchParams?.size) }))
//     .find((entry) => entry.match);
//   if (reverseAliasMatch) {
//     internalUrl = buildRuleDestination(
//       reverseAliasMatch.item.old_url,
//       reverseAliasMatch.match.suffix,
//       url,
//       true,
//     );

//     // An item-level mapping with an old ?id= query is already a complete
//     // resolution. Do not replace its chosen public slug with the slug table's
//     // automatically generated slug.
//     const originalAliasSource = parseInternalPath(reverseAliasMatch.item.old_url, request.url);
//     if (originalAliasSource?.searchParams?.size > 0) {
//       return NextResponse.rewrite(internalUrl);
//     }
//   }

//   // --- 6. Editable gallery slugs ---
//   // Old: /design-idea/gallery?id=83 or /design-idea/gallery/my-slug
//   // New: /design-idea/my-slug (internally rewritten to the existing gallery page).
//   const galleryTarget = getGalleryTarget(internalUrl.pathname);
//   if (galleryTarget) {
//     const { type, base, slug } = galleryTarget;

//     if (!slug) {
//       const id = internalUrl.searchParams.get("id");
//       if (id && /^\d+$/.test(id)) {
//         const data = await slugApiGet(`/slug-edit/by-entity?entityType=${encodeURIComponent(type)}&entityId=${id}`);
//         if (data?.slug && data.canonical?.startsWith("/")) {
//           let canonicalDestination = new URL(data.canonical, request.url);

//           // When the gallery parent was renamed (e.g. /product -> /designer-product),
//           // apply that parent alias to the generated slug path in the same hop.
//           const parentAlias = aliasRules
//             .map((item) => ({ item, match: matchUrlRule(new URL(data.canonical, request.url), item.old_url, true) }))
//             .find((entry) => entry.match);
//           if (parentAlias) {
//             canonicalDestination = buildRuleDestination(
//               parentAlias.item.new_url,
//               parentAlias.match.suffix,
//               new URL(data.canonical, request.url),
//               false,
//             );
//           }

//           canonicalDestination.searchParams.delete("id");
//           return redirectNoCache(canonicalDestination, data.redirectStatus || 301);
//         }
//       }
//     } else {
//       const data = await slugApiGet(`/slug-edit/resolve?path=${encodeURIComponent(internalUrl.pathname)}`);
//       if (data) {
//         if (data.redirect) {
//           if (!data.canonical?.startsWith("/")) return NextResponse.next();
//           const [, canonicalQuery] = data.canonical.split("?");
//           let destination = new URL(data.canonical, request.url);

//           const parentAlias = aliasRules
//             .map((item) => ({ item, match: matchUrlRule(new URL(data.canonical, request.url), item.old_url, true) }))
//             .find((entry) => entry.match);
//           if (parentAlias) {
//             destination = buildRuleDestination(
//               parentAlias.item.new_url,
//               parentAlias.match.suffix,
//               new URL(data.canonical, request.url),
//               false,
//             );
//           }

//           // Inactive/deleted slugs return to ?id= (temporary); renamed/legacy slugs
//           // go to the current canonical URL (permanent).
//           return redirectNoCache(destination, data.redirectStatus || (canonicalQuery ? 302 : 301));
//         }

//         const rewritten = new URL(internalUrl.toString());
//         rewritten.pathname = base;
//         rewritten.searchParams.set("id", String(data.entityId));
//         return NextResponse.rewrite(rewritten);
//       }
//     }
//   }

//   // If this request is a new alias for a regular page (not a gallery slug),
//   // rewrite internally to the original route.
//   if (reverseAliasMatch) {
//     return NextResponse.rewrite(internalUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };


// import { NextResponse } from "next/server";

// export function middleware(request) {
//   const url = request.nextUrl;
//   const { pathname, searchParams } = url;

//   // --- 1. SPECIAL CASE: Redirect "trk=public_post-text" to Homepage ---
//   if (pathname === "/" && searchParams.has("trk")) {
//     return NextResponse.redirect(new URL("/", request.url), 301);
//   }

//   // --- 2. SPECIAL CASE: Blog ID Redirects (From your Excel Sheet) ---
//   // Mapping of ID to new Slug
//   const blogIdRedirects = {
//     "36": "/modern-backlight-pvc-ceiling-design-for-small-rooms",
//     "33": "/top-notch-office-interior-designer-in-noida-2024",
//     "27": "/elevating-home-aesthatics-with-interior-designers-in-noida",
//     "17": "/difference-between-luxury-interior-designers-normal-interior-designers",
//     "42": "/types-of-sofa-design",
//     "23": "/top-10-interior-design-companies-in-noida",
//     "31": "/10-best-stunning-bathroom-cabinet-designs-for-small-space-elevate-your-bathroom-aesthetics",
//     "26": "/home-interior-design-company-in-delhi-ncr",
//     "18": "/how-to-arrange-plants-in-living-room",
//     "9": "/top-10-interior-designers-in-delhi"
//   };

//   if (pathname === "/blog-detail" && searchParams.has("id")) {
//     const id = searchParams.get("id");
//     if (blogIdRedirects[id]) {
//       return NextResponse.redirect(new URL(blogIdRedirects[id], request.url), 301);
//     }
//   }

//   // --- 3. FIX: "services-detail?city=..." -> "/services-detail/..." ---
//   // This helps enforce the clean structure internally if accessed via params
//   if (pathname === "/services-detail" && searchParams.has("city")) {
//     const city = searchParams.get("city");
    
//     // If city is invalid, go to main services
//     if (!city || city === "undefined" || city === "null") {
//       return NextResponse.redirect(new URL("/services", request.url), 301);
//     }

//     // Redirect to the clean URL structure
//     return NextResponse.redirect(new URL(`/services-detail/${city}`, request.url), 301);
//   }

//   // --- 4. REDIRECT MAP (Path based) ---
//   const redirectMap = {
//     // Basic Page Cleanup
//     "/home": "/",
//     "/reallife-portfolio": "/residential-projects",
//     "/design-excellence-awards": "/awards",
//     "/design-excellence-awards/": "/awards",

//     // Old Blog Paths (From Excel)
//     "/blog/two-colour-combination-for-kitchen-laminates": "/two-colour-combination-for-kitchen-laminates",
//     "/blog/pooja-room-designs": "/pooja-room-designs",
    
//     // Old Location/Service Paths (From Excel)
//     "/top-10-interior-designers-and-decorators-trends-in-delhi": "/top-10-interior-designers-in-delhi",
//     "/best-interior-designers-in-delhi": "/best-interior-designers-in-delhi-ncr",

//     // Old WordPress Categories/Tags
//     "/category/blogs": "/blog",
//     "/category/blogs/": "/blog",
//     "/category/news": "/blog",
//     "/author/lalit": "/blog",
//     "/comments/feed": "/blog",
    
//     // Tag Cleanups
//     "/tag/interior-design-company-in-noida": "/services-detail/noida",
//     "/tag/interior-designers-in-noida-extension": "/services-detail/noida",
//     "/tag/interior-designer-in-noida-sector-63": "/services-detail/noida",
//     "/greater-noida": "/services-detail/greater_noida",
//     "/best-interior-designers-in-west-delhi": "/services-detail/delhi",
//   };

//   // Remove trailing slashes for matching
//   const normalizedPath = pathname.length > 1 && pathname.endsWith("/") 
//     ? pathname.slice(0, -1) 
//     : pathname;

//   if (redirectMap[normalizedPath]) {
//     return NextResponse.redirect(new URL(redirectMap[normalizedPath], request.url), 301);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   // Apply to all routes except api, static files, images, etc.
//   matcher: [
//     "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };

import { NextResponse } from "next/server";

const GALLERY_BASES = [
  "/design-idea/gallery",
  "/designer-choice/gallery",
  "/award-gallery/gallery",
  "/experience-center-noida/gallery",
  "/experience-center-faridabad/gallery",
  "/experience-center-gurugram/gallery",
  "/experience-center-new-delhi/gallery",
  "/experience-center-noida-extension/gallery",
  "/furniture/gallery",
  "/luxury-projects/project-gallery",
  "/product/gallery",
  "/ready-togo-design/gallery",
  "/residential-projects/project-gallery",
  "/rattan/gallery",
  "/reclaimed-wood/gallery",
  "/spacesaving-furniture/gallery",
  "/wallpaper/gallery",
];

const normalizePath = (value) => {
  const path = value || "/";
  const collapsed = path.replace(/\/{2,}/g, "/");
  return collapsed.length > 1 ? collapsed.replace(/\/$/, "") : "/";
};

const parseInternalPath = (value, baseUrl) => {
  try {
    const parsed = new URL(value, baseUrl || "https://hcinterior.in");
    return { pathname: normalizePath(parsed.pathname), searchParams: parsed.searchParams, search: parsed.search };
  } catch {
    return null;
  }
};

// A query-bearing source (for example /gallery?id=83) is an exact item mapping.
// A path-only source (for example /product) also maps its child routes.
const matchUrlRule = (currentUrl, ruleUrl, allowDescendants = true) => {
  const current = parseInternalPath(currentUrl.toString(), currentUrl.origin);
  const rule = parseInternalPath(ruleUrl, currentUrl.origin);
  if (!current || !rule) return null;
  if (current.pathname !== rule.pathname) {
    if (!allowDescendants || rule.searchParams.size > 0 || !current.pathname.startsWith(`${rule.pathname}/`)) return null;
    return { suffix: current.pathname.slice(rule.pathname.length), hasRuleQuery: false };
  }
  for (const [key, expected] of rule.searchParams.entries()) {
    if (current.searchParams.get(key) !== expected) return null;
  }
  return { suffix: "", hasRuleQuery: rule.searchParams.size > 0 };
};

const buildRuleDestination = (ruleUrl, suffix, currentUrl, preserveIncomingQuery) => {
  const destination = new URL(ruleUrl, currentUrl.origin);
  destination.pathname = normalizePath(`${destination.pathname}${suffix || ""}`);
  if (preserveIncomingQuery) {
    for (const [key, value] of currentUrl.searchParams.entries()) {
      if (!destination.searchParams.has(key)) destination.searchParams.append(key, value);
    }
  }
  return destination;
};

const redirectNoCache = (dest, status) => {
  const res = NextResponse.redirect(dest, status);
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
};

const isEnabled = (value) => value === true || value === 1 || value === "1";

const getApiBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_DEV_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999"
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999";

const getGalleryTarget = (pathname) => {
  const clean = normalizePath(pathname);

  // Legacy URL: /parent/gallery/slug
  for (const base of GALLERY_BASES) {
    const entityType = base.slice(1).replace(/\//g, "-");
    if (clean === base) return { type: entityType, base, slug: null };
    if (clean.startsWith(`${base}/`)) {
      const slug = clean.slice(base.length + 1);
      if (slug && !slug.includes("/")) return { type: entityType, base, slug };
    }
  }

  // New canonical URL: /parent/slug
  const parents = GALLERY_BASES
    .map((base) => ({ base, parent: base.replace(/\/(?:project-)?gallery$/, "") }))
    .sort((a, b) => b.parent.length - a.parent.length);
  for (const { base, parent } of parents) {
    if (clean.startsWith(`${parent}/`)) {
      const slug = clean.slice(parent.length + 1);
      if (slug && !slug.includes("/") && slug !== "gallery" && slug !== "project-gallery") {
        return { type: base.slice(1).replace(/\//g, "-"), base, slug };
      }
    }
  }

  // Dynamic experience-center gallery: /experience-center/<center>/gallery[/slug]
  const dynamicLegacy = clean.match(/^\/experience-center\/(experience-center-[a-z0-9-]+)\/gallery(?:\/([^/]+))?$/);
  if (dynamicLegacy) {
    return {
      type: `center~${dynamicLegacy[1]}`,
      base: `/experience-center/${dynamicLegacy[1]}/gallery`,
      slug: dynamicLegacy[2] || null,
    };
  }

  // Dynamic experience-center canonical URL: /experience-center/<center>/<slug>
  const dynamicCanonical = clean.match(/^\/experience-center\/(experience-center-[a-z0-9-]+)\/([^/]+)$/);
  if (dynamicCanonical && dynamicCanonical[2] !== "gallery") {
    return {
      type: `center~${dynamicCanonical[1]}`,
      base: `/experience-center/${dynamicCanonical[1]}/gallery`,
      slug: dynamicCanonical[2],
    };
  }

  return null;
};

const slugApiGet = async (path) => {
  try {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}${path}`, { cache: "no-store" });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

export async function middleware(request) {
  const url = request.nextUrl;
  const { pathname, searchParams } = url;

  // --- 1. SPECIAL CASE: Redirect "trk=public_post-text" to Homepage ---
  if (pathname === "/" && searchParams.has("trk")) {
    return NextResponse.redirect(new URL("/", request.url), 301);
  }

  // --- 2. SPECIAL CASE: Blog ID Redirects (From your Excel Sheet) ---
  // const blogIdRedirects = {
  //   "36": "/modern-backlight-pvc-ceiling-design-for-small-rooms",
  //   "33": "/top-notch-office-interior-designer-in-noida-2024",
  //   "27": "/elevating-home-aesthatics-with-interior-designers-in-noida",
  //   "17": "/difference-between-luxury-interior-designers-normal-interior-designers",
  //   "42": "/types-of-sofa-design",
  //   "23": "/top-10-interior-design-companies-in-noida",
  //   "31": "/10-best-stunning-bathroom-cabinet-designs-for-small-space-elevate-your-bathroom-aesthetics",
  //   "26": "/home-interior-design-company-in-delhi-ncr",
  //   "18": "/how-to-arrange-plants-in-living-room",
  //   "9": "/top-10-interior-designers-in-delhi"
  // };

  const blogIdRedirects = {
  "36": "/blog/modern-backlight-pvc-ceiling-design-for-small-rooms",
  "33": "/blog/top-notch-office-interior-designer-in-noida-2024",
  "27": "/blog/elevating-home-aesthatics-with-interior-designers-in-noida",
  "17": "/blog/difference-between-luxury-interior-designers-normal-interior-designers",
  "42": "/blog/types-of-sofa-design",
  "23": "/blog/top-10-interior-design-companies-in-noida",
  "31": "/blog/10-best-stunning-bathroom-cabinet-designs-for-small-space-elevate-your-bathroom-aesthetics",
  "26": "/blog/home-interior-design-company-in-delhi-ncr",
  "18": "/blog/how-to-arrange-plants-in-living-room",
  "9": "/blog/top-10-interior-designers-in-delhi"
};

  if (pathname === "/blog-detail" && searchParams.has("id")) {
    const id = searchParams.get("id");
    if (blogIdRedirects[id]) {
      return NextResponse.redirect(new URL(blogIdRedirects[id], request.url), 301);
    }
  }

  // --- 3. FIX: "services-detail?city=..." -> "/services-detail/..." ---
  if (pathname === "/services-detail" && searchParams.has("city")) {
    const city = searchParams.get("city");
    if (!city || city === "undefined" || city === "null") {
      return NextResponse.redirect(new URL("/services", request.url), 301);
    }
    return NextResponse.redirect(new URL(`/services-detail/${city}`, request.url), 301);
  }

  // --- 4. REDIRECT MAP (Legacy Hardcoded Paths) ---
  const redirectMap = {
    "/home": "/",
    "/reallife-portfolio": "/residential-projects",
    "/design-excellence-awards": "/awards",
    "/design-excellence-awards/": "/awards",
    // "/blog/two-colour-combination-for-kitchen-laminates": "/two-colour-combination-for-kitchen-laminates",
    // "/blog/pooja-room-designs": "/pooja-room-designs",
    "/top-10-interior-designers-and-decorators-trends-in-delhi": "/top-10-interior-designers-in-delhi",
    "/best-interior-designers-in-delhi": "/best-interior-designers-in-delhi-ncr",
    "/category/blogs": "/blog",
    "/category/blogs/": "/blog",
    "/category/news": "/blog",
    "/author/lalit": "/blog",
    "/comments/feed": "/blog",
    "/tag/interior-design-company-in-noida": "/services-detail/noida",
    "/tag/interior-designers-in-noida-extension": "/services-detail/noida",
    "/tag/interior-designer-in-noida-sector-63": "/services-detail/noida",
    "/greater-noida": "/services-detail/greater_noida",
    "/best-interior-designers-in-west-delhi": "/services-detail/delhi",
  };

  const normalizedPath = pathname.length > 1 && pathname.endsWith("/") 
    ? pathname.slice(0, -1) 
    : pathname;

  if (redirectMap[normalizedPath]) {
    const destination = redirectMap[normalizedPath] === '/' ? new URL("/", request.url) : new URL(redirectMap[normalizedPath], request.url);
    return NextResponse.redirect(destination, 301);
  }

  // CMS and dashboard routes are deliberately excluded from all configurable URL rules.
  if (pathname === "/cms" || pathname.startsWith("/cms/") || pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return NextResponse.next();
  }

  // --- 5. DYNAMIC REDIRECTS + URL ALIASES (CMS > Slug Settings) ---
  let activeRedirects = [];
  try {
    const apiUrl = getApiBaseUrl();
    const res = await fetch(`${apiUrl}/redirects/active`, {
      cache: "no-store",
    });
    if (res.ok) activeRedirects = await res.json();
  } catch (error) {
    console.error("Middleware fetch dynamic redirects failed:", error);
  }

  const aliasRules = activeRedirects
    .filter((item) => isEnabled(item?.is_url_rewrite) && isEnabled(item?.is_active))
    .sort((a, b) => Math.max(String(b.old_url || "").length, String(b.new_url || "").length) - Math.max(String(a.old_url || "").length, String(a.new_url || "").length));

  // 5a. Existing redirect records remain ordinary redirects (no reverse rewrite).
  const normalRedirects = activeRedirects.filter((item) => !isEnabled(item?.is_url_rewrite) && isEnabled(item?.is_active));
  const normalMatch = normalRedirects.find((item) => {
    const oldRule = parseInternalPath(item.old_url, request.url);
    if (!oldRule) return false;
    if (oldRule.searchParams.size > 0) {
      return !!matchUrlRule(url, item.old_url, false);
    }
    return normalizePath(pathname) === oldRule.pathname;
  });
  if (normalMatch) {
    const oldRule = parseInternalPath(normalMatch.old_url, request.url);
    const preserve = !oldRule?.searchParams?.size;
    const destination = buildRuleDestination(normalMatch.new_url, "", url, preserve);
    return redirectNoCache(destination, normalMatch.status_code || 301);
  }

  // 5b. An old URL is permanently/temporarily redirected to its new public URL.
  // For path-only mappings, child URLs are moved as well: /product/x -> /designer-product/x.
  const oldAliasMatch = aliasRules
    .map((item) => ({ item, match: matchUrlRule(url, item.old_url, true) }))
    .find((entry) => entry.match);
  if (oldAliasMatch) {
    const destination = buildRuleDestination(
      oldAliasMatch.item.new_url,
      oldAliasMatch.match.suffix,
      url,
      !oldAliasMatch.match.hasRuleQuery,
    );
    return redirectNoCache(destination, oldAliasMatch.item.status_code || 301);
  }

  // 5c. Resolve a public alias back to the real Next.js route.
  // For an item URL below a renamed parent, reverse the item-specific rule
  // first, then reverse the parent path. Example:
  //   /design-gallery/gallery/balcony
  //     -> /design-gallery/gallery?id=83
  //     -> /design-idea/gallery?id=83 (the physical Next.js route).
  // This also supports older parent records that were created as ordinary
  // active redirects before is_url_rewrite was introduced.
  const reversePathAliases = (startUrl, rules) => {
    // buildRuleDestination returns a standard URL, not NextURL; construct a
    // fresh URL rather than calling NextURL.clone().
    let current = new URL(startUrl.toString());
    const visited = new Set([`${current.pathname}${current.search}`]);

    for (let hop = 0; hop < 10; hop += 1) {
      const parentMatches = rules
        .map((item) => ({
          item,
          source: parseInternalPath(item.old_url, request.url),
          destination: parseInternalPath(item.new_url, request.url),
        }))
        .filter(({ source, destination }) =>
          source && destination &&
          source.searchParams.size === 0 &&
          destination.searchParams.size === 0
        )
        .map((entry) => {
          const sourcePath = entry.source.pathname;
          const destinationPath = entry.destination.pathname;
          const matches = current.pathname === destinationPath ||
            (destinationPath !== "/" && current.pathname.startsWith(`${destinationPath}/`));
          if (!matches) return null;
          const suffix = current.pathname === destinationPath
            ? ""
            : current.pathname.slice(destinationPath.length);
          return { ...entry, suffix, destinationLength: destinationPath.length };
        })
        .filter(Boolean)
        .sort((a, b) => b.destinationLength - a.destinationLength);

      const match = parentMatches[0];
      if (!match) break;

      const next = buildRuleDestination(
        match.item.old_url,
        match.suffix,
        current,
        true,
      );
      const nextKey = `${next.pathname}${next.search}`;
      if (visited.has(nextKey)) break;
      visited.add(nextKey);
      current = next;
    }

    return current;
  };

  let internalUrl = url.clone();
  let reverseAliasMatch = null;
  let hasItemSpecificSource = false;

  // Exact item-specific destination aliases have priority over parent aliases.
  // Their old_url may contain ?id=83, while their new_url is a clean path.
  for (const item of aliasRules) {
    const source = parseInternalPath(item.old_url, request.url);
    if (!source || source.searchParams.size === 0) continue;

    const match = matchUrlRule(internalUrl, item.new_url, false);
    if (!match) continue;

    const itemSourceUrl = buildRuleDestination(
      item.old_url,
      "",
      internalUrl,
      true,
    );

    // Reverse the renamed parent after restoring the gallery item's ID route.
    // Include active ordinary path redirects only in this reverse-resolution
    // step; their normal forward redirect behaviour above remains unchanged.
    const parentRules = [...aliasRules, ...normalRedirects];
    internalUrl = reversePathAliases(itemSourceUrl, parentRules);
    reverseAliasMatch = { item, match };
    hasItemSpecificSource = true;
    break;
  }

  // If this is not an item-specific mapping, reverse path-only aliases as a
  // normal internal rewrite (without changing the browser address bar).
  if (!hasItemSpecificSource) {
    const pathAliasRules = aliasRules.filter((item) => {
      const source = parseInternalPath(item.old_url, request.url);
      const destination = parseInternalPath(item.new_url, request.url);
      return source && destination &&
        source.searchParams.size === 0 &&
        destination.searchParams.size === 0;
    });

    const before = `${internalUrl.pathname}${internalUrl.search}`;
    internalUrl = reversePathAliases(internalUrl, pathAliasRules);
    if (`${internalUrl.pathname}${internalUrl.search}` !== before) {
      reverseAliasMatch = { item: null, match: true };
    }
  }

  // An item-specific alias is a complete resolution. Rewrite directly to the
  // original physical gallery route; do not run the slug resolver on the
  // public alias path (which may not exist as a real Next.js folder).
  if (hasItemSpecificSource) {
    return NextResponse.rewrite(internalUrl);
  }

  // --- 6. Editable gallery slugs ---
  // Old: /design-idea/gallery?id=83 or /design-idea/gallery/my-slug
  // New: /design-idea/my-slug (internally rewritten to the existing gallery page).
  const galleryTarget = getGalleryTarget(internalUrl.pathname);
  if (galleryTarget) {
    const { type, base, slug } = galleryTarget;

    if (!slug) {
      const id = internalUrl.searchParams.get("id");
      if (id && /^\d+$/.test(id)) {
        const data = await slugApiGet(`/slug-edit/by-entity?entityType=${encodeURIComponent(type)}&entityId=${id}`);
        if (data?.slug && data.canonical?.startsWith("/")) {
          let canonicalDestination = new URL(data.canonical, request.url);

          // When the gallery parent was renamed (e.g. /product -> /designer-product),
          // apply that parent alias to the generated slug path in the same hop.
          const parentAlias = aliasRules
            .map((item) => ({ item, match: matchUrlRule(new URL(data.canonical, request.url), item.old_url, true) }))
            .find((entry) => entry.match);
          if (parentAlias) {
            canonicalDestination = buildRuleDestination(
              parentAlias.item.new_url,
              parentAlias.match.suffix,
              new URL(data.canonical, request.url),
              false,
            );
          }

          canonicalDestination.searchParams.delete("id");
          return redirectNoCache(canonicalDestination, data.redirectStatus || 301);
        }
      }
    } else {
      const data = await slugApiGet(`/slug-edit/resolve?path=${encodeURIComponent(internalUrl.pathname)}`);
      if (data) {
        if (data.redirect) {
          if (!data.canonical?.startsWith("/")) return NextResponse.next();
          const [, canonicalQuery] = data.canonical.split("?");
          let destination = new URL(data.canonical, request.url);

          const parentAlias = aliasRules
            .map((item) => ({ item, match: matchUrlRule(new URL(data.canonical, request.url), item.old_url, true) }))
            .find((entry) => entry.match);
          if (parentAlias) {
            destination = buildRuleDestination(
              parentAlias.item.new_url,
              parentAlias.match.suffix,
              new URL(data.canonical, request.url),
              false,
            );
          }

          // Inactive/deleted slugs return to ?id= (temporary); renamed/legacy slugs
          // go to the current canonical URL (permanent).
          return redirectNoCache(destination, data.redirectStatus || (canonicalQuery ? 302 : 301));
        }

        const rewritten = new URL(internalUrl.toString());
        rewritten.pathname = base;
        rewritten.searchParams.set("id", String(data.entityId));
        return NextResponse.rewrite(rewritten);
      }
    }
  }

  // If this request is a new alias for a regular page (not a gallery slug),
  // rewrite internally to the original route.
  if (reverseAliasMatch) {
    return NextResponse.rewrite(internalUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};