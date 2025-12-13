/**
 * SEO Configuration Module
 * @module config/seo
 * @description Centralized SEO management for static pages with metadata, Open Graph, Twitter Cards, and JSON-LD structured data
 */

import type { Metadata } from "next";
import { siteConfig, seoConfig, socialLinks } from "./site";

// ============================================================================
// TYPES
// ============================================================================

interface OpenGraphImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

interface PageSEOConfig {
  title: string;
  description: string;
  keywords: string[];
  openGraph: {
    title: string;
    description: string;
    images: OpenGraphImage[];
  };
}

type PageSEOMap = {
  [K: string]: PageSEOConfig;
};

// ============================================================================
// PAGE SEO CONFIGURATIONS
// ============================================================================

/**
 * Page-specific SEO configurations (OPTIONAL)
 * 
 * NOTE: It's recommended to define SEO metadata locally in each page component.
 * This config object is kept for reference and backward compatibility.
 * 
 * To add a new page, copy the template below and use it in your page component.
 */
export const pageSEO: PageSEOMap = {
  // Template example (copy this structure for new pages)
  example: {
    title: "Page Title",
    description: "Page description for search engines and social media (120-160 characters)",
    keywords: [
      "keyword1",
      "keyword2",
      "keyword3",
      siteConfig.author.name,
    ],
    openGraph: {
      title: "Page Title - Site Name",
      description: "Social media description",
      images: [
        {
          url: `${siteConfig.url}/og-page.png`,
          width: 1200,
          height: 630,
          alt: "Page Title",
        },
      ],
    },
  },
};

// ============================================================================
// METADATA GENERATORS
// ============================================================================

/**
 * Generate complete metadata for static pages
 * Priority: Local metadata > Page config > Defaults
 * 
 * @param page - Page key from pageSEO configuration (optional if using full local metadata)
 * @param localMetadata - Page-specific metadata defined locally (highest priority)
 * @returns Complete Next.js Metadata object
 * 
 * @example
 * ```ts
 * // Use centralized config only
 * export const metadata = generatePageSEO("home");
 * 
 * // Local metadata takes priority (recommended)
 * export const metadata = generatePageSEO("home", {
 *   title: "Custom Local Title",
 *   description: "This overrides config description",
 *   keywords: ["custom", "keywords"],
 * });
 * 
 * // Fully custom (no config needed)
 * export const metadata = generatePageSEO(undefined, {
 *   title: "Standalone Page",
 *   description: "Fully custom metadata",
 *   keywords: ["standalone"],
 *   openGraph: { title: "OG Title", description: "OG Desc", images: [...] },
 * });
 * ```
 */
export function generatePageSEO(
  page?: keyof typeof pageSEO,
  localMetadata?: Partial<Metadata> & {
    openGraph?: Partial<Metadata['openGraph']> & { images?: OpenGraphImage[] };
  }
): Metadata {
  // Use page config if available, otherwise create minimal config
  const pageConfig = page ? pageSEO[page] : null;
  const url = page 
    ? (page === "home" ? siteConfig.url : `${siteConfig.url}/${page}`)
    : siteConfig.url;
  const twitterCreator = seoConfig.twitterHandle || undefined;

  // Merge: local > config > defaults (local has highest priority)
  const title = localMetadata?.title ?? pageConfig?.title ?? siteConfig.name;
  const description = localMetadata?.description ?? pageConfig?.description ?? siteConfig.description;
  const keywords = localMetadata?.keywords ?? pageConfig?.keywords ?? [];
  
  // Open Graph merging
  const ogTitle = localMetadata?.openGraph?.title 
    ?? pageConfig?.openGraph.title 
    ?? `${title} - ${siteConfig.name}`;
  const ogDescription = localMetadata?.openGraph?.description 
    ?? pageConfig?.openGraph.description 
    ?? description;
  const ogImages = localMetadata?.openGraph?.images 
    ?? pageConfig?.openGraph.images 
    ?? [];

  return {
    title,
    description,
    keywords,
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: siteConfig.name,
      title: ogTitle,
      description: ogDescription,
      images: ogImages,
      ...localMetadata?.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      ...(twitterCreator && { creator: twitterCreator }),
      images: ogImages.map((img) => typeof img === 'string' ? img : img.url),
    },
    alternates: {
      canonical: url,
    },
    ...localMetadata,
  };
}

// ============================================================================
// DEFAULT SEO & SITE-WIDE METADATA
// ============================================================================

/**
 * Default SEO metadata applied site-wide
 * Used in root layout.tsx
 */
export const defaultSEO: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Full Stack",
    "Developer",
    "Software",
    "Engineer",
    "Cloud",
    "Portfolio",
    siteConfig.author.name,
  ],
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
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
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    ...(seoConfig.twitterHandle && { creator: seoConfig.twitterHandle }),
  },
  alternates: {
    canonical: siteConfig.url,
  },
  ...(seoConfig.googleSiteVerification && {
    verification: {
      google: seoConfig.googleSiteVerification,
    },
  }),
};

// ============================================================================
// JSON-LD STRUCTURED DATA
// ============================================================================

/**
 * Website structured data (JSON-LD)
 * Helps search engines understand your site structure
 */
export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  author: {
    "@type": "Person",
    name: siteConfig.author.name,
  },
  inLanguage: "en-US",
} as const;

/**
 * Person structured data (JSON-LD)
 * Represents the site author/owner
 */
export const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.author.name,
  url: siteConfig.url,
  sameAs: [
    socialLinks.github,
    socialLinks.twitter,
    socialLinks.linkedin,
    socialLinks.instagram,
    socialLinks.youtube,
    socialLinks.facebook,
  ].filter(Boolean),
} as const;

/**
 * Generate breadcrumb structured data (JSON-LD)
 * @param items - Array of breadcrumb items with name and url
 * @returns Breadcrumb JSON-LD object
 * 
 * @example
 * ```ts
 * const breadcrumbs = generateBreadcrumbStructuredData([
 *   { name: "Home", url: "/" },
 *   { name: "Blog", url: "/blog" },
 *   { name: "Article Title", url: "/blog/article-slug" }
 * ]);
 * ```
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

// ============================================================================
// DOCUMENTATION & USAGE GUIDE
// ============================================================================

/**
 * SEO PRIORITY SYSTEM
 * 
 * Metadata is merged with the following priority (highest to lowest):
 * 1. LOCAL metadata (defined in page component) - HIGHEST PRIORITY
 * 2. PAGE CONFIG (defined in pageSEO object below)
 * 3. SITE DEFAULTS (from siteConfig)
 * 
 * This allows maximum flexibility while maintaining consistency.
 */

/**
 * OPTION 1: LOCAL METADATA (RECOMMENDED - HIGHEST PRIORITY)
 * 
 * Define metadata directly in your page component for maximum control:
 * 
 * ```ts
 * // src/app/about/page.tsx
 * import { generatePageSEO } from "@/config/seo";
 * import type { Metadata } from "next";
 * 
 * export const metadata: Metadata = generatePageSEO("about", {
 *   title: "About Me",
 *   description: "Custom description defined locally",
 *   keywords: ["custom", "keywords", "here"],
 *   openGraph: {
 *     title: "Custom OG Title",
 *     description: "Custom OG description",
 *     images: [{ url: "/custom-og.png", width: 1200, height: 630, alt: "About" }],
 *   },
 * });
 * 
 * export default function AboutPage() {
 *   return <div>Content</div>;
 * }
 * ```
 * 
 * OPTION 2: CENTRALIZED CONFIG (CONVENIENT)
 * 
 * 1. Add page configuration to pageSEO object below:
 * 
 * ```ts
 * export const pageSEO: PageSEOMap = {
 *   // ... existing pages
 *   about: {
 *     title: "About",
 *     description: "Learn more about...",
 *     keywords: ["about", "bio", siteConfig.author.name],
 *     openGraph: {
 *       title: "About - Site Name",
 *       description: "Learn more about...",
 *       images: [{
 *         url: `${siteConfig.url}/og-about.png`,
 *         width: 1200,
 *         height: 630,
 *         alt: "About",
 *       }],
 *     },
 *   },
 * };
 * ```
 * 
 * 2. Use in your page component:
 * 
 * ```ts
 * // src/app/about/page.tsx
 * import { generatePageSEO } from "@/config/seo";
 * 
 * export const metadata = generatePageSEO("about");
 * 
 * export default function AboutPage() {
 *   return <div>Content</div>;
 * }
 * ```
 * 
 * OPTION 3: HYBRID APPROACH (BEST OF BOTH)
 * 
 * Use centralized config as a base, override specific fields locally:
 * 
 * ```ts
 * export const metadata = generatePageSEO("about", {
 *   // Only override what you need
 *   title: "Custom Title",
 *   // Other fields come from pageSEO config
 * });
 * ```
 * 
 * OPTION 4: FULLY STANDALONE (NO CONFIG)
 * 
 * For one-off pages that don't need centralized config:
 * 
 * ```ts
 * export const metadata = generatePageSEO(undefined, {
 *   title: "Standalone Page",
 *   description: "Fully custom metadata",
 *   keywords: ["custom"],
 *   openGraph: {
 *     title: "OG Title",
 *     description: "OG Description",
 *     images: [{ url: "/og.png", width: 1200, height: 630, alt: "Image" }],
 *   },
 * });
 * ```
 * 
 * BEST PRACTICES:
 * - Use LOCAL metadata for dynamic or frequently changing content
 * - Use CENTRALIZED config for consistent site-wide pages
 * - Always provide meaningful descriptions (120-160 characters)
 * - Include relevant keywords without stuffing
 * - Create Open Graph images (1200x630px) for better social sharing
 * - Test with: Facebook Sharing Debugger, Twitter Card Validator
 * 
 * NOTES:
 * - Blog posts should use local metadata (fetched from Hashnode)
 * - Dynamic pages should use local metadata
 * - Static marketing pages work well with centralized config
 */

/**
 * LEGACY DOCUMENTATION (OPTION 2 DETAILS)
 * 
 * HOW TO ADD A NEW PAGE TO CENTRALIZED CONFIG:
 * 
 * ```ts
 * export const pageSEO: PageSEOMap = {
 *   // ... existing pages
 *   about: {
 *     title: "About",
 *     description: "Learn more about...",
 *     keywords: ["about", "bio", siteConfig.author.name],
 *     openGraph: {
 *       title: "About - Site Name",
 *       description: "Learn more about...",
 *       images: [{
 *         url: `${siteConfig.url}/og-about.png`,
 *         width: 1200,
 *         height: 630,
 *         alt: "About",
 *       }],
 *     },
 *   },
 * };
 * ```
 * 
 * 2. Use in your page component:
 * 
 * ```ts
 * // src/app/about/page.tsx
 * import { generatePageSEO } from "@/config/seo";
 * import type { Metadata } from "next";
 * 
 * export const metadata: Metadata = generatePageSEO("about");
 * 
 * export default function AboutPage() {
 *   return <div>Content</div>;
 * }
 * ```
 * 
 * 3. (Optional) Create Open Graph image:
 *    - Size: 1200x630px
 *    - Format: PNG or JPG
 *    - Location: /public/og-about.png
 * 
 * 4. (Optional) Override specific fields:
 * 
 * ```ts
 * export const metadata = generatePageSEO("about", {
 *   title: "Custom Title Override",
 * });
 * ```
 * 
 * NOTES:
 * - Blog post SEO is decentralized (managed in src/app/blog/[slug]/page.tsx)
 * - This keeps blog metadata synced with Hashnode content
 * - Use this config only for static pages (home, about, contact, etc.)
 */
