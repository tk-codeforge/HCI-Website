import "../../public/style/style.css";
import "./globals.css";
import ClientProvider from "../store/ClientProvider";
import Script from "next/script";
import { Great_Vibes, Poppins, Outfit } from "next/font/google";
import dynamic from "next/dynamic";
import AddBootstrap from "./common/AdBoostrap";
import DynamicTypography from "./common/DynamicTypography"; // Imported correctly!
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';

const LazyToast = dynamic(() => import("./common/LazyToast"), { ssr: false });

const greatVibes = Great_Vibes({ subsets: ['latin'], display: 'swap', weight: ['400'], variable: '--font-great-vibes' });
const poppins = Poppins({ subsets: ['latin'], display: 'swap', weight: ['400', '500','600', '700', '800'], variable: '--font-poppins' });
const outfit = Outfit({ subsets: ['latin'], display: 'swap', weight: ['400', '600'], variable: '--font-outfit' });

export const metadata = {
  metadataBase: new URL('https://hcinterior.in'),
  title: "High Creation Interior | Best Interior Designers in Delhi NCR",
  description: "High Creation Interior offers the best interior design services in Delhi NCR. Transform your space with our expert designers.",
  keywords: "interior designers, interior decorators, best interior designers in Delhi, home interior, office interior",
  openGraph: {
    title: "High Creation Interior | Best Interior Designers in Delhi NCR",
    description: "High Creation Interior offers the best interior design services in Delhi NCR.",
    url: "https://hcinterior.in",
    siteName: "High Creation Interior",
    images: [{ url: "/images/new_hc_logo.png", width: 800, height: 600, alt: "High Creation Interior Logo" }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "High Creation Interior",
    description: "Best Interior Designers in Delhi NCR",
    images: ["/images/new_hc_logo.png"],
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  verification: { google: 'k0iGFVO_noqQ7H1uUsJXGeReQ5YhgKjfOOgoKkSsrAw' },
};

export const viewport = { width: 'device-width', initialScale: 1, maximumScale: 5, userScalable: true, themeColor: '#ffffff' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />

        {/* Meta Pixel Code - Pushed further back in the load cycle */}
        <Script id="fb-pixel" strategy="lazyOnload">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          
          fbq('init', '768898314129368');
          fbq('track', 'PageView', { value: 1.00, currency: 'INR' });`}
        </Script>
        <noscript>
          <img height="1" width="1" style={{ display: "none" }} alt="Facebook" src="https://www.facebook.com/tr?id=768898314129368&ev=PageView&cd[value]=1.00&cd[currency]=INR&noscript=1" decoding="async" loading="lazy" />
        </noscript>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "High Creation Interior",
            "url": "https://hcinterior.in",
            "logo": "https://hcinterior.in/images/new_hc_logo.png",
            "sameAs": [
              "https://www.instagram.com/highcreationinterior/",
              "https://www.linkedin.com/company/high-creation-interior-projects-private-limited/",
              "https://www.facebook.com/HighCreationInteriorProjectsPvtLtd/",
              "https://www.youtube.com/@HIGHCREATIONINTERIOR/",
              "https://in.pinterest.com/highcreation41/"
            ],
            "contactPoint": [{ "@type": "ContactPoint", "telephone": "1800-1200-532", "contactType": "customer service", "email": "info@hcinterior.in", "contactOption": "TollFree", "areaServed": "IN", "availableLanguage": "en" }]
            })
          }}
        />
      </head>
      <body suppressHydrationWarning={false} className={`${greatVibes.variable} ${poppins.variable} ${outfit.variable}`}>
        <AddBootstrap />
        
        {/* 🌟 FIX: Added the component here so it actually renders! */}
        <DynamicTypography /> 

        <ClientProvider>{children}</ClientProvider>
        <LazyToast />
      </body>
      
      <GoogleTagManager gtmId="GTM-PRVJK9N" />
      <GoogleAnalytics gaId="G-MJZK1MXG9E" />
      <GoogleAnalytics gaId="AW-11474758205" />
    </html>
  );
}