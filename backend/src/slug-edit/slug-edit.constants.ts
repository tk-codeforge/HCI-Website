const RAW_BASE_PATHS = [
  '/design-idea/gallery',
  '/designer-choice/gallery',
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

// always exactly one leading slash, no trailing slash
export const SLUG_BASE_PATHS = RAW_BASE_PATHS.map((p) => '/' + p.replace(/^\/+|\/+$/g, ''));

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

// generated centers: 'experience-center-ghaziabad-gallery' -> '/experience-center-ghaziabad/gallery'
export const baseFor = (entityType: string): string | null => {
  if (SLUG_ROUTES[entityType]) return SLUG_ROUTES[entityType];
  const m = /^(experience-center-[a-z0-9-]+)-gallery$/.exec(entityType || '');
  return m ? `/${m[1]}/gallery` : null;
};

export const matchSlugPath = (clean: string) => {
  for (const [entityType, base] of Object.entries(SLUG_ROUTES)) {
    if (clean.startsWith(base + '/')) return { entityType, base, slug: clean.slice(base.length + 1) };
  }
  const m = /^\/(experience-center-[a-z0-9-]+)\/gallery\/([^/]+)$/.exec(clean);
  return m ? { entityType: `${m[1]}-gallery`, base: `/${m[1]}/gallery`, slug: m[2] } : null;
};