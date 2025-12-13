import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { getPublication } from "@/lib/api/hashnode";
import { siteConfig, seoConfig } from "@/config/site";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  // Fetch publication details from Hashnode for dynamic SEO
  const publication = await getPublication();
  
  const description = publication?.descriptionSEO || 
    publication?.about?.text || 
    siteConfig.description;
  
  const ogImage = publication?.ogMetaData?.image;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: [
      "Jowin John Chemban",
      "Full-stack Coder",
      "DevOps Engineer",
      "Cloud Architect",
      "Development",
      "IT Engineer",
      "Technical Blog",
    ],
    authors: [{ name: publication?.author?.name || siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
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
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: siteConfig.name,
      description,
      siteName: siteConfig.name,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description,
      creator: seoConfig.twitterHandle,
      images: ogImage ? [ogImage] : undefined,
    },
    verification: {
      google: seoConfig.googleSiteVerification,
    },
    alternates: {
      canonical: siteConfig.url,
    },
    other: {
      'dmca-site-verification': seoConfig.dmcaVerification,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = seoConfig.gtmId;
  const ahrefsKey = seoConfig.ahrefsKey;

  return (
    <html lang="en">
      <head>
        {/* Preload critical hero image for faster LCP */}
        <link
          rel="preload"
          href="/profile.jpg"
          as="image"
          type="image/jpeg"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager */}
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

        {/* Ahrefs Analytics */}
        {ahrefsKey && (
          <Script
            id="ahrefs-analytics"
            src="https://analytics.ahrefs.com/analytics.js"
            data-key={ahrefsKey}
            strategy="afterInteractive"
          />
        )}

        {children}
        
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
