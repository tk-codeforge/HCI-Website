// Optional extra things the admin search bar (cms + dashboard) should index, WITHOUT touching AdminSearch.jsx.
// Put at: src/utils/adminSearchSources.js
//
// Already automatic (nothing to add here):
//   - every admin page you create under src/app/cms (found by /api/admin-pages)
//   - custom pages, redirects, slug settings, global SEO rows
//   - every URL of /sitemap.xml  (new pages, blogs, cities... appear as soon as they are in the sitemap)
//
// Add an entry only for a NEW admin page that keeps its own list of records you want to search by name/URL.
// Example (remove the // to use it):
//
// export const ADMIN_SEARCH_SOURCES = [
//     {
//         endpoint: "/cms-landing-page",            // GET endpoint that returns an array of rows
//         group: "Landing Page",                    // small label shown in the result
//         target: "/cms/landing-pages",             // admin page that opens when the result is picked
//         adminOnly: false,                         // true = only admins see these results
//         map: (row) => ({ id: row.id, name: row.title, url: row.slug, highlight: row.title }),
//     },
// ];
export const ADMIN_SEARCH_SOURCES = [];