import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { getPublication } from "@/lib/api/hashnode";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Jowin John Chemban";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jowinjc.in";
const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "";

export async function generateMetadata(): Promise<Metadata> {
  // Fetch publication details from Hashnode for dynamic SEO
  const publication = await getPublication();
  
  const description = publication?.descriptionSEO || 
    publication?.about?.text || 
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 
    " ";
  
  const ogImage = publication?.ogMetaData?.image;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: [
      "Jowin John Chemban",
      "Full-stack Developer",
      "DevOps Engineer",
      "Cloud Infrastructure",
      "Web Development",
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "Software Architecture",
      "Technical Blog",
    ],
    authors: [{ name: publication?.author?.name || siteName }],
    creator: siteName,
    publisher: siteName,
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
      url: siteUrl,
      title: siteName,
      description,
      siteName,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      creator: twitterHandle,
      images: ogImage ? [ogImage] : undefined,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    },
    alternates: {
      canonical: siteUrl,
    },
    other: {
      'dmca-site-verification': process.env.NEXT_PUBLIC_DMCA_VERIFICATION || '',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || '';
  const ahrefsKey = process.env.NEXT_PUBLIC_AHREFS_KEY || '';

  return (
    <html lang="en">
      <head />
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
