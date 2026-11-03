// const RAW_BASE_PATHS = [
//   '/design-idea/gallery',
//   '/designer-choice/gallery',
//   '/experience-center-noida/gallery',
//   '/experience-center-faridabad/gallery',
//   '/experience-center-gurugram/gallery',
//   '/experience-center-new-delhi/gallery',
//   '/experience-center-noida-extension/gallery',
//   '/furniture/gallery',
//   '/luxury-projects/project-gallery',
//    '/product/gallery',
//   '/ready-togo-design/gallery',
//   '/residential-projects/project-gallery',
//   '/rattan/gallery',
//   '/reclaimed-wood/gallery',
//   '/spacesaving-furniture/gallery',
//   '/wallpaper/gallery',
// ];

// // always exactly one leading slash, no trailing slash
// export const SLUG_BASE_PATHS = RAW_BASE_PATHS.map((p) => '/' + p.replace(/^\/+|\/+$/g, ''));

// // '/product/gallery' -> 'product-gallery'
// export const SLUG_ROUTES: Record<string, string> = Object.fromEntries(
//   SLUG_BASE_PATHS.map((p) => [p.slice(1).replace(/\//g, '-'), p]),
// );

// export const slugify = (v: string): string =>
//   (v ?? '')
//     .toString()
//     .normalize('NFKD')
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, '')
//     .replace(/[\s_-]+/g, '-')
//     .replace(/^-+|-+$/g, '');

// // generated centers: 'experience-center-ghaziabad-gallery' -> '/experience-center-ghaziabad/gallery'
// export const baseFor = (entityType: string): string | null => {
//   if (SLUG_ROUTES[entityType]) return SLUG_ROUTES[entityType];
//   const m = /^(experience-center-[a-z0-9-]+)-gallery$/.exec(entityType || '');
//   return m ? `/${m[1]}/gallery` : null;
// };

// export const matchSlugPath = (clean: string) => {
//   for (const [entityType, base] of Object.entries(SLUG_ROUTES)) {
//     if (clean.startsWith(base + '/')) return { entityType, base, slug: clean.slice(base.length + 1) };
//   }
//   const m = /^\/(experience-center-[a-z0-9-]+)\/gallery\/([^/]+)$/.exec(clean);
//   return m ? { entityType: `${m[1]}-gallery`, base: `/${m[1]}/gallery`, slug: m[2] } : null;
// };


const RAW_BASE_PATHS = [
  '/design-idea/gallery',
  '/designer-choice/gallery',
  '/award-gallery/gallery',
  '/experience-center-noida/gallery',
  '/experience-center-faridabad/gallery',
  '/experience-center-gurugram/gallery',
  '/experience-center-new-delhi/gallery',
  '/experience-center-noida-extension/gallery',
  '/furniture/gallery',
  '/luxury-projects/project-gallery',
  '/product/gallery',
  '/ready-togo-design/gallery',
  '/residential-projects/project-gallery',
  '/rattan/gallery',
  '/reclaimed-wood/gallery',
  '/spacesaving-furniture/gallery',
  '/wallpaper/gallery',
];

// Always exactly one leading slash and no trailing slash.
export const SLUG_BASE_PATHS = RAW_BASE_PATHS.map(
  (p) => '/' + p.replace(/^\/+|\/+$/g, ''),
);

// '/product/gallery' -> 'product-gallery'
export const SLUG_ROUTES: Record<string, string> = Object.fromEntries(
  SLUG_BASE_PATHS.map((p) => [p.slice(1).replace(/\//g, '-'), p]),
);

export const slugify = (v: string): string =>
  (v ?? '')
    .toString()
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Returns the existing Next.js gallery page path used internally.
 * Generated centers use /experience-center/<center>/gallery.
 */
export const baseFor = (entityType: string): string | null => {
  if (SLUG_ROUTES[entityType]) return SLUG_ROUTES[entityType];

  // Dynamic CMS centers use a separate entity type to avoid collisions with
  // the statically routed /experience-center-noida pages.
  const dynamicCenter = /^center~(experience-center-[a-z0-9-]+)$/.exec(entityType || '');
  if (dynamicCenter) return `/experience-center/${dynamicCenter[1]}/gallery`;

  // Backward compatibility for dynamic-center records created before center~.
  const legacyCenter = /^(experience-center-[a-z0-9-]+)-gallery$/.exec(entityType || '');
  return legacyCenter ? `/experience-center/${legacyCenter[1]}/gallery` : null;
};

/** Public/canonical path omits the technical gallery folder. */
export const parentFor = (entityType: string): string | null => {
  const base = baseFor(entityType);
  return base ? base.replace(/\/(?:project-)?gallery$/, '') : null;
};

export const canonicalSlugPath = (entityType: string, slug: string): string | null => {
  const parent = parentFor(entityType);
  return parent ? `${parent}/${slug}` : null;
};

/**
 * Supports both the previous URL (/parent/gallery/slug) and the new
 * canonical URL (/parent/slug). Only configured gallery parents are matched;
 * arbitrary one-level routes are never treated as gallery slugs.
 */
export const matchSlugPath = (clean: string) => {
  const path = (clean || '').split('?')[0].replace(/\/+$/, '') || '/';

  // Generated experience-center pages use a dynamic route in Next.js.
  const generatedLegacy =
    /^\/experience-center\/(experience-center-[a-z0-9-]+)\/gallery\/([^/]+)$/.exec(
      path,
    );
  if (generatedLegacy) {
    return {
      entityType: `center~${generatedLegacy[1]}`,
      base: `/experience-center/${generatedLegacy[1]}/gallery`,
      slug: generatedLegacy[2],
      isLegacyPath: true,
    };
  }

  const generatedCanonical =
    /^\/experience-center\/(experience-center-[a-z0-9-]+)\/([^/]+)$/.exec(path);
  if (generatedCanonical && generatedCanonical[2] !== 'gallery') {
    return {
      entityType: `center~${generatedCanonical[1]}`,
      base: `/experience-center/${generatedCanonical[1]}/gallery`,
      slug: generatedCanonical[2],
      isLegacyPath: false,
    };
  }

  // The previous /parent/gallery/slug URL remains supported and is redirected.
  for (const [entityType, base] of Object.entries(SLUG_ROUTES).sort(
    (a, b) => b[1].length - a[1].length,
  )) {
    if (path.startsWith(`${base}/`)) {
      const slug = path.slice(base.length + 1);
      if (slug && !slug.includes('/')) {
        return { entityType, base, slug, isLegacyPath: true };
      }
    }
  }

  // New canonical /parent/slug URLs.
  const parents = Object.entries(SLUG_ROUTES)
    .map(([entityType, base]) => ({
      entityType,
      base,
      parent: base.replace(/\/(?:project-)?gallery$/, ''),
    }))
    .sort((a, b) => b.parent.length - a.parent.length);

  for (const item of parents) {
    if (path.startsWith(`${item.parent}/`)) {
      const slug = path.slice(item.parent.length + 1);
      if (slug && !slug.includes('/') && slug !== 'gallery' && slug !== 'project-gallery') {
        return {
          entityType: item.entityType,
          base: item.base,
          slug,
          isLegacyPath: false,
        };
      }
    }
  }

  return null;
};
