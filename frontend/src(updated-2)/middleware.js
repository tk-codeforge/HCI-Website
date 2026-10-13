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

const SLUG_FOLDER = /^\/([a-z0-9-]+)\/((?:project-)?gallery)(?:\/([^/]+))?\/?$/;
const SLUG_SKIP = ["cms", "api", "dashboard"]; // admin/internal routes, never touched
const redirectNoCache = (dest, status) => {
  const res = NextResponse.redirect(dest, status);
  res.headers.set("Cache-Control", "no-store, max-age=0"); // editable URLs: browsers must not cache these
  return res;
};

const slugApiGet = async (path) => {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999";
    const res = await fetch(`${base}${path}`, { cache: "no-store" });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

export async function middleware(request) {
  const url = request.nextUrl;
  const { pathname, searchParams } = url;

  // Combine path and query string (e.g., "/ready-togo-design/gallery?id=114")
  const fullPathWithQuery = url.search ? `${pathname}${url.search}` : pathname;

  // --- 1. SPECIAL CASE: Redirect "trk=public_post-text" to Homepage ---
  if (pathname === "/" && searchParams.has("trk")) {
    return NextResponse.redirect(new URL("/", request.url), 301);
  }

  // --- 2. SPECIAL CASE: Blog ID Redirects (From your Excel Sheet) ---
  const blogIdRedirects = {
    "36": "/modern-backlight-pvc-ceiling-design-for-small-rooms",
    "33": "/top-notch-office-interior-designer-in-noida-2024",
    "27": "/elevating-home-aesthatics-with-interior-designers-in-noida",
    "17": "/difference-between-luxury-interior-designers-normal-interior-designers",
    "42": "/types-of-sofa-design",
    "23": "/top-10-interior-design-companies-in-noida",
    "31": "/10-best-stunning-bathroom-cabinet-designs-for-small-space-elevate-your-bathroom-aesthetics",
    "26": "/home-interior-design-company-in-delhi-ncr",
    "18": "/how-to-arrange-plants-in-living-room",
    "9": "/top-10-interior-designers-in-delhi"
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
    "/blog/two-colour-combination-for-kitchen-laminates": "/two-colour-combination-for-kitchen-laminates",
    "/blog/pooja-room-designs": "/pooja-room-designs",
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

  // --- 5. DYNAMIC REDIRECTS (Fetched from CMS via NestJS API) ---
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9999"; 
    
    const res = await fetch(`${apiUrl}/redirects/active`, {
      next: { revalidate: 60 }
    });

    if (res.ok) {
      const activeRedirects = await res.json(); 
      
      // FIX: Check against the full path with query, the normalized path, AND the regular path
      const match = activeRedirects.find(r => 
        r.old_url === fullPathWithQuery || 
        r.old_url === normalizedPath || 
        r.old_url === pathname
      );
      
      if (match) {
        const destination = match.new_url === '/' ? new URL("/", request.url) : new URL(match.new_url, request.url);
        return NextResponse.redirect(destination, match.status_code || 301);
      }
    }
  } catch (error) {
    console.error("Middleware fetch dynamic redirects failed:", error);
  }
  // const gm = normalizedPath.match(SLUG_FOLDER);
  // if (gm && !SLUG_SKIP.includes(gm[1])) {
  //   const [, page, folder, slug] = gm;
  //   const type = `${page}-${folder}`; // e.g. product-gallery, kitchen-project-gallery

  //   if (!slug) {
  //     const id = searchParams.get("id");
  //     if (id && /^\d+$/.test(id)) {
  //       const data = await slugApiGet(`/slug-edit/by-entity?entityType=${type}&entityId=${id}`);
  //       if (data?.slug) {
  //         const dest = request.nextUrl.clone();
  //         dest.pathname = data.canonical;
  //         dest.searchParams.delete("id");
  //         return NextResponse.redirect(dest, 301);
  //       }
  //     }
  //   } else {
  //     const data = await slugApiGet(`/slug-edit/resolve?path=${encodeURIComponent(normalizedPath)}`);
  //     if (data) {
  //       const dest = request.nextUrl.clone();
  //       if (data.redirect) {                       // old slug -> current slug
  //         dest.pathname = data.canonical;
  //         return NextResponse.redirect(dest, 301);
  //       }
  //       dest.pathname = `/${page}/${folder}`;
  //       dest.searchParams.set("id", String(data.entityId));
  //       return NextResponse.rewrite(dest);
  //     }
  //   }
  // }

  // const gm = normalizedPath.match(SLUG_FOLDER);
  // if (gm && !SLUG_SKIP.includes(gm[1])) {
  //   const [, page, folder, slug] = gm;
  //   const type = `${page}-${folder}`;

  //   if (!slug) {
  //     // /<page>/gallery?id=103 -> slug URL (only if an active slug exists)
  //     const id = searchParams.get("id");
  //     if (id && /^\d+$/.test(id)) {
  //       const data = await slugApiGet(`/slug-edit/by-entity?entityType=${type}&entityId=${id}`);
  //       if (data?.slug && data.canonical?.startsWith("/")) {
  //         const dest = request.nextUrl.clone();
  //         dest.pathname = data.canonical;
  //         dest.searchParams.delete("id");
  //         return redirectNoCache(dest, 301);
  //       }
  //     }
  //   } else {
  //     const data = await slugApiGet(`/slug-edit/resolve?path=${encodeURIComponent(normalizedPath)}`);
  //     if (data) {
  //       const dest = request.nextUrl.clone();
  //       if (data.redirect) {
  //         if (!data.canonical?.startsWith("/")) return NextResponse.next(); // never redirect to "undefined/..."
  //         const [p, q] = data.canonical.split("?");
  //         dest.pathname = p;
  //         dest.search = q ? `?${q}` : "";
  //         // renamed slug: permanent; deleted/disabled slug -> original ?id= URL: temporary
  //         return redirectNoCache(dest, q ? 302 : 301);
  //       }
  //       dest.pathname = `/${page}/${folder}`;
  //       dest.searchParams.set("id", String(data.entityId));
  //       return NextResponse.rewrite(dest);
  //     }
  //   }
  // }

    // --- 6. EDITABLE SLUG URLS (CMS > Slug Setting) ---
  // let target = null;
  // const cm = normalizedPath.match(CENTER_GALLERY);
  // if (cm && cm[1] !== "gallery") {
  //   // generated experience centers: /experience-center/<center>/gallery[/<slug>]
  //   target = { type: `center~${cm[1]}`, base: `/experience-center/${cm[1]}/gallery`, slug: cm[2] };
  // } else {
  //   const gm = normalizedPath.match(SLUG_FOLDER);
  //   if (gm && !SLUG_SKIP.includes(gm[1])) {
  //     target = { type: `${gm[1]}-${gm[2]}`, base: `/${gm[1]}/${gm[2]}`, slug: gm[3] };
  //   }
  // }
  let target = null;
  const gm = normalizedPath.match(SLUG_FOLDER);
  if (gm && !SLUG_SKIP.includes(gm[1])) {
    target = { type: `${gm[1]}-${gm[2]}`, base: `/${gm[1]}/${gm[2]}`, slug: gm[3] };
  }

  if (target) {
    const { type, base, slug } = target;

    if (!slug) {
      const id = searchParams.get("id");
      if (id && /^\d+$/.test(id)) {
        const data = await slugApiGet(`/slug-edit/by-entity?entityType=${encodeURIComponent(type)}&entityId=${id}`);
        if (data?.slug && data.canonical?.startsWith("/")) {
          const dest = request.nextUrl.clone();
          dest.pathname = data.canonical;
          dest.searchParams.delete("id");
          return redirectNoCache(dest, 301);
        }
      }
    } else {
      const data = await slugApiGet(`/slug-edit/resolve?path=${encodeURIComponent(normalizedPath)}`);
      if (data) {
        const dest = request.nextUrl.clone();
        if (data.redirect) {
          if (!data.canonical?.startsWith("/")) return NextResponse.next();
          const [p, q] = data.canonical.split("?");
          dest.pathname = p;
          dest.search = q ? `?${q}` : "";
          return redirectNoCache(dest, q ? 302 : 301);
        }
        dest.pathname = base;
        dest.searchParams.set("id", String(data.entityId));
        return NextResponse.rewrite(dest);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};