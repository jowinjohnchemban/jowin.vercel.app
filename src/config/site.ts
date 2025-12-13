/**
 * Site Configuration
 * Central configuration file that acts as an adapter between environment variables and application defaults
 * @module config/site
 */

/**
 * Site Metadata Configuration
 */
export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "sitename",
  url: process.env.NEXT_PUBLIC_SITE_URL || "siteurl",
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "",
  
  author: {
    name: process.env.NEXT_PUBLIC_SITE_NAME || "",
  },
} as const;

/**
 * Social Media Links Configuration
 */
export const socialLinks = {
  github: process.env.NEXT_PUBLIC_GITHUB_URL || "",
  twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
} as const;

/**
 * SEO & Analytics Configuration
 */
export const seoConfig = {
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  dmcaVerification: process.env.NEXT_PUBLIC_DMCA_VERIFICATION || "",
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
  ahrefsKey: process.env.NEXT_PUBLIC_AHREFS_KEY || "",
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "",
} as const;

/**
 * Security Configuration
 */
export const securityConfig = {
  turnstile: {
    siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA", // Public test key
    secretKey: process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA", // Public test secret key
  },
} as const;

/**
 * Email Configuration
 */
export const emailConfig = {
  provider: (process.env.EMAIL_PROVIDER as 'resend' | 'nodemailer' | 'sendgrid' | 'ses') || 'resend',
  contactEmail: process.env.CONTACT_EMAIL || "",
  fromEmail: process.env.RESEND_FROM_EMAIL || "",
  
  // Resend
  resend: {
    apiKey: process.env.RESEND_API_KEY || "",
  },
  
  // SMTP (Nodemailer)
  smtp: {
    host: process.env.SMTP_HOST || "localhost",
    port: parseInt(process.env.SMTP_PORT || "465", 10),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "username",
    pass: process.env.SMTP_PASS || "password",
  },
} as const;

/**
 * Feature Flags
 */
export const features = {
  // Check if social links are enabled (not empty)
  social: {
    github: !!socialLinks.github,
    twitter: !!socialLinks.twitter,
    linkedin: !!socialLinks.linkedin,
    youtube: !!socialLinks.youtube,
    instagram: !!socialLinks.instagram,
    facebook: !!socialLinks.facebook,
  },
  
  // Check if analytics are enabled
  analytics: {
    gtm: !!seoConfig.gtmId,
    ahrefs: !!seoConfig.ahrefsKey,
  },
} as const;

/**
 * Navigation Configuration
 */
export const navConfig = {
  mainNav: [
    { href: "/blog", label: "Blog" },
    { href: "/connect", label: "Let's Connect" },
  ],
  
  mobileNav: [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/connect", label: "Let's Connect" },
  ],
} as const;

/**
 * Utility function to get full URL
 */
export function getFullUrl(path: string = ""): string {
  const baseUrl = siteConfig.url.endsWith("/") 
    ? siteConfig.url.slice(0, -1) 
    : siteConfig.url;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Type exports for better TypeScript support
 */
export type SocialPlatform = keyof typeof socialLinks;
export type NavItem = typeof navConfig.mainNav[number];
