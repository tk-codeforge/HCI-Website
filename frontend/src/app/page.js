// import MainLayout from "./layouts/MainLayout";
// import Home from "./home/page";
// // import BootstrapClient from/ "./common/BootstrapClient";

// export const metadata = {
//   title: "Top Interior Designers In Delhi NCR For Home",
//   description: "Home interior designers in Delhi NCR - Elevate your living space with best interior design company in Noida & Delhi NCR.",
//   alternates: { canonical: "https://hcinterior.in" },
//   openGraph: {
//     title: "Top Interior Designers In Delhi NCR For Home",
//     description: "Home interior designers in Delhi NCR - Elevate your living space with best interior design company in Noida & Delhi NCR.",
//     url: "https://hcinterior.in",
//     siteName: "High Creation Interior",
//     images: [
//       {
//         url: "https://hcinterior.in/images/new_hc_logo.png",
//         width: 1200,
//         height: 630,
//         alt: "High Creation Interior Design",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
// };

// export default function App() {
//   return (
//     <>
//      <MainLayout>
//       <Home />
//      </MainLayout>
//     </>
//   );
// }
import MainLayout from "./layouts/MainLayout";
import Home from "./home/page";
import { getPageSEO } from "@/utils/getSEO";

// 🌟 1. Replace static metadata with dynamic generation
export async function generateMetadata() {
  const seoData = await getPageSEO("/"); // Fetch SEO for the home route

  // If no SEO data is found in CMS, return empty object to trigger layout.js fallbacks
  if (!seoData) return {};

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: seoData.alternates,
    robots: seoData.robots,
    openGraph: seoData.openGraph,
  };
}

export default async function App() {
  // 🌟 2. Fetch SEO again to get the customSchema (Next.js deduplicates this fetch automatically)
  const seoData = await getPageSEO("/");

  return (
    <>
     {/* 🌟 3. Inject Custom Schema if the CMS user provided it */}
     {seoData?.customSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.customSchema) }}
        />
     )}

     <MainLayout>
      <Home />
     </MainLayout>
    </>
  );
}