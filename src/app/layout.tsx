import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { siteConfig, seoConfig } from "@/config/site";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { OfflineBanner } from "@/components/ui/OfflineBanner";

// Aggressive caching for instant loading
export const revalidate = 3600; // Revalidate every hour
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

// Preload critical fonts for instant text rendering
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Prevent invisible text during font load
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

// Static metadata for instant loading - no API calls during initial render
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Jowin John Chemban",
    "Full-stack Coder",
    "DevOps Engineer",
    "Cloud Architect",
    "Development",
    "IT Engineer",
    "Technical Blog",
  ],
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  alternates: {
    canonical: siteConfig.url,
  },
  verification: {
    google: seoConfig.googleSiteVerification,
  },
  other: {
    'dmca-site-verification': seoConfig.dmcaVerification,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = seoConfig.gtmId;
  const ahrefsKey = seoConfig.ahrefsKey;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Preconnect to critical domains for instant loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.hashnode.com" />
        <link rel="dns-prefetch" href="https://resend.com" />

        {/* Preload critical hero image for faster LCP */}
        <link
          rel="preload"
          href="/profile.jpg"
          as="image"
          type="image/jpeg"
          fetchPriority="high"
        />

        {/* Aggressive caching headers for static assets */}
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />

        {/* Critical CSS inlined for instant rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for instant loading */
            body { margin: 0; font-family: var(--font-geist-sans), sans-serif; }
            .antialiased { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
            /* Hide content until fonts load to prevent FOUC */
            .font-loading { visibility: hidden; }
          `
        }} />
      </head>
      <body className="antialiased">
        {/* Google Tag Manager - non-blocking */}
        {gtmId && (
          <>
            <Script
              id="gtm-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
              }}
            />
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
          </>
        )}

        {/* Ahrefs Analytics - non-blocking */}
        {ahrefsKey && (
          <Script
            id="ahrefs-analytics"
            src="https://analytics.ahrefs.com/analytics.js"
            data-key={ahrefsKey}
            strategy="afterInteractive"
          />
        )}

        {/* Service Worker registration for instant PWA */}
        <Script
          id="sw-registration"
          strategy="beforeInteractive"
        >
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                  console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                  console.log('SW registration failed: ', registrationError);
                });
            }
          `}
        </Script>

        {/* Preload critical routes for instant navigation */}
        <Script
          id="preload-routes"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Preload critical routes for instant navigation
              const routes = ['/blog', '/connect'];
              routes.forEach(route => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = route;
                document.head.appendChild(link);
              });
            `
          }}
        />

        <OfflineBanner />
        {children}

        {/* Analytics - non-blocking */}
        <SpeedInsights />
        <Analytics />

        {/* PWA Install Prompt - loads instantly */}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
