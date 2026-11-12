import {
  SITE_URL,
  getCanonicalUrl,
  getSitemapChangeFrequency,
  getSitemapPriority,
  normalizeBoolean,
  shouldIncludeInSitemap,
} from "@/utils/seoHelpers";

const CITY_ROUTE_FALLBACKS = {
  noida: "/services-detail/noida",
  greater_noida: "/services-detail/greater_noida",
  delhi: "/services-detail/delhi",
  gurugram: "/services-detail/gurugram",
  faridabad: "/services-detail/faridabad",
  ghaziabad: "/services-detail/ghaziabad",
  manesar: "/services-detail/manesar",
  dwarka: "/services-detail/dwarka",
};

// /services-detail/<city> is only a redirect source (see next.config); the real page is the slug URL
const CITY_SLUG_PATHS = {
  faridabad: "/best-interior-designers-in-faridabad",
  gurugram: "/interior-designers-in-gurgaon",
  greater_noida: "/interior-designers-in-greater-noida",
};

const toCitySlugPath = (pathname) => {
  const m = pathname.match(/^\/services-detail\/([^/]+)\/?$/);
  if (!m) return pathname;
  return CITY_SLUG_PATHS[m[1]] || `/interior-designers-in-${m[1]}`;
};

const rewriteCityUrl = (value) => {
  try {
    const u = new URL(value);
    const next = toCitySlugPath(u.pathname);
    return next === u.pathname ? value : `${u.origin}${next}${u.search}`;
  } catch {
    return value;
  }
};

function buildSitemapEntry({
  seoData = {},
  fallbackPath = "",
  lastModified,
  defaultChangeFrequency = "monthly",
  defaultPriority = 0.8,
}) {
  // const url = getCanonicalUrl({
  //   canonicalUrl: seoData?.canonical_url,
  //   metaCanonicalTag: seoData?.meta_can_tag,
  //   fallbackPath,
  //   siteUrl: SITE_URL,
  // });

  const url = rewriteCityUrl(
  getCanonicalUrl({
    canonicalUrl: seoData?.canonical_url,
    metaCanonicalTag: seoData?.meta_can_tag,
    fallbackPath,
    siteUrl: SITE_URL,
  })
);

  if (!url) {
    return null;
  }

  return {
    url,
    lastModified: lastModified ? new Date(lastModified) : new Date(),
    changeFrequency: getSitemapChangeFrequency(
      seoData?.sitemap_change_frequency,
      defaultChangeFrequency
    ),
    priority: getSitemapPriority(seoData?.sitemap_priority, defaultPriority),
  };
}

export default async function sitemap() {
  try {
    const apiBase =
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_API_DEV_URL
        : process.env.NEXT_PUBLIC_API_BASE_URL;

    const [seoRes, blogRes, cmsPagesRes, cmsCityRes] = await Promise.all([
      fetch(`${apiBase}/seo-tag?status=active`, { next: { revalidate: 60 } }),
      fetch(`${apiBase}/cms-blog`, { next: { revalidate: 60 } }),
      fetch(`${apiBase}/cms-pages`, { next: { revalidate: 60 } }),
      fetch(`${apiBase}/cms-city`, { next: { revalidate: 60 } }),
    ]);

    const allSeoTags = seoRes.ok ? await seoRes.json() : [];
    const allBlogs = blogRes.ok ? await blogRes.json() : [];
    const allCmsPages = cmsPagesRes.ok ? await cmsPagesRes.json() : [];
    const allCmsCities = cmsCityRes.ok ? await cmsCityRes.json() : [];

    const blogSlugPaths = new Set(
  allBlogs.filter((b) => b?.seo_content?.slug).map((b) => `/${b.seo_content.slug}`)
);

// const toBlogSeo = (seo = {}) => {
//   const slug = seo?.slug;
//   const c = seo?.canonical_url;
//   if (!slug || !c) return seo;
//   try {
//     const u = new URL(c, SITE_URL);
//     if (u.pathname.replace(/\/+$/, "") === `/${slug}`) {
//       return { ...seo, canonical_url: `${SITE_URL}/blog/${slug}` };
//     }
//   } catch {}
//   return seo;
// };

const withBlogCanonical = (seo = {}) =>
  seo?.slug ? { ...seo, canonical_url: "", meta_can_tag: "" } : seo;

    const pageRoutes = allSeoTags
      .filter(
        (tag) => tag?.status === "active" && shouldIncludeInSitemap(tag)
      )

      // .filter((r) => r && !blogSlugPaths.has(new URL(r.url).pathname))
      .map((tag) =>
        buildSitemapEntry({
          seoData: tag,
          fallbackPath: tag.page_name || "/",
          lastModified: tag.updated_at,
          defaultChangeFrequency:
            tag.page_name === "/" || tag.page_name === SITE_URL
              ? "weekly"
              : "monthly",
          defaultPriority:
            tag.page_name === "/" || tag.page_name === SITE_URL ? 1 : 0.8,
        })
      )      .filter((r) => {
        if (!r) return false;
        try {
          // drop SEO-tag rows that still point at an old root-level blog URL
          return !blogSlugPaths.has(new URL(r.url).pathname.replace(/\/+$/, ""));
        } catch {
          return true;
        }
      });

    const blogRoutes = allBlogs
      .filter(
        (blog) =>
          blog?.status === "Published" &&
          shouldIncludeInSitemap(blog?.seo_content) &&
          (blog?.seo_content?.canonical_url || blog?.seo_content?.slug)
      )
      // .map((blog) =>
      //   buildSitemapEntry({
      //     seoData: blog?.seo_content || {},
      //     fallbackPath: `/${blog?.seo_content?.slug || `blog-detail?id=${blog.id}`}`,
      //     lastModified: blog.updated_at,
      //     defaultChangeFrequency: "weekly",
      //     defaultPriority: 0.64,
      //   })
      // );

      .map((blog) =>
  buildSitemapEntry({
    // seoData: toBlogSeo(blog?.seo_content || {}),
    seoData: withBlogCanonical(blog?.seo_content || {}),
    fallbackPath: blog?.seo_content?.slug
      ? `/blog/${blog.seo_content.slug}`
      : `/blog-detail?id=${blog.id}`,
    lastModified: blog.updated_at,
    defaultChangeFrequency: "weekly",
    defaultPriority: 0.64,
  })
);

    const cmsPageRoutes = allCmsPages
      .filter(
        (page) =>
          page?.status === "Published" &&
          shouldIncludeInSitemap(page?.seo_content) &&
          (page?.seo_content?.canonical_url || page?.seo_content?.slug)
      )
      .map((page) =>
        buildSitemapEntry({
          seoData: page?.seo_content || {},
          fallbackPath: `/${page?.seo_content?.slug || ""}`,
          lastModified: page.updated_at,
          defaultChangeFrequency: "monthly",
          defaultPriority: 0.8,
        })
      );

    const cmsCityRoutes = allCmsCities
      .filter(
        (city) =>
          shouldIncludeInSitemap(city?.seo_content) &&
          (city?.seo_content?.canonical_url || city?.city_type)
      )
      .map((city) =>
        buildSitemapEntry({
          seoData: city?.seo_content || {},
          fallbackPath:
            CITY_ROUTE_FALLBACKS[city?.city_type] ||
            `/services-detail/${city?.city_type || ""}`,
          lastModified: city.updated_at,
          defaultChangeFrequency: "monthly",
          defaultPriority: 0.7,
        })
      );

    // const allRoutes = [
    //   ...pageRoutes,
    //   ...blogRoutes,
    //   ...cmsPageRoutes,
    //   ...cmsCityRoutes,
    // ].filter(Boolean);

    // return Array.from(new Map(allRoutes.map((item) => [item.url, item])).values());

    // URLs removed in CMS > Global Sitemap (active SEO record with "Include in sitemap" off)
// const pathOf = (value) => {
//   try {
//     return new URL(value, SITE_URL).pathname.replace(/\/+$/, "") || "/";
//   } catch {
//     return "";
//   }
// };
// const excludedPaths = new Set();
// allSeoTags
//   .filter((tag) => tag?.status === "active" && !normalizeBoolean(tag.include_in_sitemap, true))
//   .forEach((tag) => {
//     const p = toCitySlugPath(pathOf(tag.page_name));
//     if (!p) return;
//     excludedPaths.add(p);
//     if (p.startsWith("/blog/")) excludedPaths.add(p.slice(5)); // /blog/x <-> /x
//     else if (/^\/[^/]+$/.test(p)) excludedPaths.add(`/blog${p}`);
//   });

// // const allRoutes = [
// //   ...pageRoutes,
// //   ...blogRoutes,
// //   ...cmsPageRoutes,
// //   ...cmsCityRoutes,
// // ]
// //   .filter(Boolean)
// //   .filter((item) => !excludedPaths.has(pathOf(item.url)));

// // return Array.from(new Map(allRoutes.map((item) => [item.url, item])).values());

// // frequency / priority saved in CMS > Global Sitemap win over the blog / page / city defaults
// const sitemapOverrides = new Map();
// allSeoTags
//   .filter((tag) => tag?.status === "active")
//   .sort((a, b) => (Date.parse(b.updated_at) || 0) - (Date.parse(a.updated_at) || 0))
//   .forEach((tag) => {
//     const p = toCitySlugPath(pathOf(tag.page_name));
//     if (!p) return;
//     const keys = [p];
//     if (p.startsWith("/blog/")) keys.push(p.slice(5));
//     else if (/^\/[^/]+$/.test(p)) keys.push(`/blog${p}`);
//     keys.forEach((k) => {
//       if (!sitemapOverrides.has(k)) sitemapOverrides.set(k, tag);
//     });
//   });

// const allRoutes = [
//   ...pageRoutes,
//   ...blogRoutes,
//   ...cmsPageRoutes,
//   ...cmsCityRoutes,
// ]
//   .filter(Boolean)
//   .filter((item) => !excludedPaths.has(pathOf(item.url)))
//   .map((item) => {
//     const tag = sitemapOverrides.get(pathOf(item.url));
//     if (!tag) return item;
//     return {
//       ...item,
//       changeFrequency: getSitemapChangeFrequency(tag.sitemap_change_frequency, item.changeFrequency),
//       priority: getSitemapPriority(tag.sitemap_priority, item.priority),
//     };
//   });

    // ---- CMS > Global Sitemap ---------------------------------------------
    const pathOf = (value) => {
      try {
        return new URL(value, SITE_URL).pathname.replace(/\/+$/, "") || "/";
      } catch {
        return "";
      }
    };

    // 1) settings saved on the Global Sitemap page (one hidden record, independent of SEO data)
    let sitemapConfig = {};
    try {
      const cfgRow = allSeoTags.find(
        (t) => t?.status === "active" && t?.page_name === "__sitemap_manager__"
      );
      const raw = typeof cfgRow?.custom_schema === "string" ? JSON.parse(cfgRow.custom_schema) : cfgRow?.custom_schema;
      sitemapConfig = raw?.urls && typeof raw.urls === "object" ? raw.urls : {};
    } catch {
      sitemapConfig = {};
    }
    const activeConfig = Object.entries(sitemapConfig).filter(
      ([, v]) => v && v.status !== "inactive"
    );

    // 2) URLs switched off via "Include in sitemap" of a Global SEO record
    const excludedPaths = new Set();
    allSeoTags
      .filter((tag) => tag?.status === "active" && !normalizeBoolean(tag.include_in_sitemap, true))
      .forEach((tag) => {
        const p = toCitySlugPath(pathOf(tag.page_name));
        if (!p) return;
        excludedPaths.add(p);
        if (p.startsWith("/blog/")) excludedPaths.add(p.slice(5)); // /blog/x <-> /x
        else if (/^\/[^/]+$/.test(p)) excludedPaths.add(`/blog${p}`);
      });

    // 3) the Global Sitemap page wins over the SEO records
    activeConfig.forEach(([path, v]) => {
      const p = pathOf(path);
      if (!p) return;
      if (v.include === false) excludedPaths.add(p);
      else excludedPaths.delete(p);
    });

    // custom URLs added on the Global Sitemap page
    const customRoutes = activeConfig
      .filter(([, v]) => v.custom && v.include !== false)
      .map(([path, v]) =>
        buildSitemapEntry({
          seoData: { sitemap_change_frequency: v.frequency, sitemap_priority: v.priority },
          fallbackPath: path,
          lastModified: v.updated_at,
          defaultChangeFrequency: "monthly",
          defaultPriority: 0.8,
        })
      );

    // frequency / priority saved on a Global SEO record win over the blog / page / city defaults
    const sitemapOverrides = new Map();
    allSeoTags
      .filter((tag) => tag?.status === "active")
      .sort((a, b) => (Date.parse(b.updated_at) || 0) - (Date.parse(a.updated_at) || 0))
      .forEach((tag) => {
        const p = toCitySlugPath(pathOf(tag.page_name));
        if (!p) return;
        const keys = [p];
        if (p.startsWith("/blog/")) keys.push(p.slice(5));
        else if (/^\/[^/]+$/.test(p)) keys.push(`/blog${p}`);
        keys.forEach((k) => {
          if (!sitemapOverrides.has(k)) sitemapOverrides.set(k, tag);
        });
      });

    const allRoutes = [
      ...pageRoutes,
      ...blogRoutes,
      ...cmsPageRoutes,
      ...cmsCityRoutes,
      ...customRoutes,
    ]
      .filter(Boolean)
      .filter((item) => !excludedPaths.has(pathOf(item.url)))
      .map((item) => {
        const p = pathOf(item.url);
        let next = item;
        const tag = sitemapOverrides.get(p);
        if (tag) {
          next = {
            ...next,
            changeFrequency: getSitemapChangeFrequency(tag.sitemap_change_frequency, next.changeFrequency),
            priority: getSitemapPriority(tag.sitemap_priority, next.priority),
          };
        }
        const v = sitemapConfig[p];
        if (v && v.status !== "inactive" && v.include !== false) {
          next = {
            ...next,
            changeFrequency: getSitemapChangeFrequency(v.frequency, next.changeFrequency),
            priority: getSitemapPriority(v.priority, next.priority),
          };
        }
        return next;
      });

    return Array.from(new Map(allRoutes.map((item) => [item.url, item])).values());
  } catch (error) {
    console.error("Dynamic Sitemap Generation Error:", error);

    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1,
      },
    ];
  }
}
