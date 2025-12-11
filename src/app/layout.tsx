import type { Metadata } from "next";
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
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jowin.vercel.app";
const twitterHandle = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@jowinjc";

export async function generateMetadata(): Promise<Metadata> {
  // Fetch publication details from Hashnode for dynamic SEO
  const publication = await getPublication();
  
  const description = publication?.descriptionSEO || 
    publication?.about?.text || 
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 
    "Full-stack developer and DevOps engineer specializing in cloud infrastructure, web development, and modern software architecture. Explore technical articles, projects, and insights.";
  
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
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
