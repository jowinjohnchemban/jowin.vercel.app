// src/config/seo.ts
/**
 * SEO Configuration
 * Centralized SEO settings including metadata, Open Graph, Twitter Cards, and structured data
 */

import { Metadata } from "next";
import { siteConfig } from "./site";

/**
 * Page-specific SEO configuration
 * Customize SEO for each route in your application
 * 
 * HOW TO USE:
 * 1. Add your page configuration below in the pageSEO object
 * 2. Use generatePageSEO('yourPageKey') in your page's metadata export
 * 
 * EXAMPLE - Adding a new page:
 * ```typescript
 * // In src/config/seo.ts
 * export const pageSEO = {
 *   // ... existing pages
 *   about: {
 *     title: "About",
 *     description: "Learn more about...",
 *     keywords: ["about", "bio", "profile"],
 *     openGraph: {
 *       title: "About - Your Name",
 *       description: "Learn more about...",
 *       images: [{ url: "/og-about.png", width: 1200, height: 630, alt: "About" }],
 *     },
 *   },
 * }
 * 
 * // In src/app/about/page.tsx
 * import { generatePageSEO } from "@/config/seo";
 * export const metadata = generatePageSEO("about");
 * ```
 * 
 * CUSTOMIZATION:
 * - Override specific fields using the second parameter:
 *   generatePageSEO("blog", { title: "Custom Title" })
 * - OG images should be placed in /public folder
 * - Recommended OG image size: 1200x630px
 */
export const pageSEO = {
  home: {
    title: siteConfig.name,
    description: siteConfig.description,
    keywords: [
      "Full Stack Developer",
      "DevOps Engineer",
      "Cloud Infrastructure",
      "Software Engineer",
      "Web Development",
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Portfolio",
      siteConfig.author.name,
    ],
    openGraph: {
      title: `${siteConfig.name} - Full Stack Developer & DevOps Engineer`,
      description: siteConfig.description,
      images: [
        {
          url: `${siteConfig.url}/og-image.png`,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
  },
  blog: {
    title: "Blog",
    description: `Read the latest articles and insights from ${siteConfig.author.name} on web development, DevOps, cloud infrastructure, and software engineering.`,
    keywords: [
      "Blog",
      "Articles",
      "Web Development",
      "DevOps",
      "Cloud",
      "Software Engineering",
      "Technical Writing",
      siteConfig.author.name,
    ],
    openGraph: {
      title: `Blog - ${siteConfig.name}`,
      description: `Read the latest articles and insights from ${siteConfig.author.name}`,
      images: [
        {
          url: `${siteConfig.url}/og-blog.png`,
          width: 1200,
          height: 630,
          alt: "Blog",
        },
      ],
    },
  },
  connect: {
    title: "Let's Connect",
    description: `Get in touch with ${siteConfig.author.name}. Let's work together on your next project or just say hello!`,
    keywords: [
      "Connect",
      "Contact",
      "Get in touch",
      "Collaboration",
      "Inquiry",
      "Hire",
      siteConfig.author.name,
    ],
    openGraph: {
      title: `Let's Connect - ${siteConfig.name}`,
      description: `Get in touch with ${siteConfig.author.name}. Let's work together!`,
      images: [
        {
          url: `${siteConfig.url}/og-connect.png`,
          width: 1200,
          height: 630,
          alt: "Let's Connect",
        },
      ],
    },
  },
} as const;

/**
 * Helper to generate metadata for static pages
 */
export function generatePageSEO(
  page: keyof typeof pageSEO,
  overrides?: Partial<Metadata>
): Metadata {
  const pageConfig = pageSEO[page];
  const url = page === "home" ? siteConfig.url : `${siteConfig.url}/${page}`;

  return {
    title: pageConfig.title,
    description: pageConfig.description,
    keywords: [...pageConfig.keywords],
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: siteConfig.name,
      ...pageConfig.openGraph,
      images: [...pageConfig.openGraph.images],
    },
    twitter: {
      card: "summary_large_image",
      title: pageConfig.openGraph.title,
      description: pageConfig.openGraph.description,
      creator: "@jowinchemban",
      images: pageConfig.openGraph.images.map((img) => img.url),
    },
    alternates: {
      canonical: url,
    },
    ...overrides,
  };
}

/**
 * Default SEO metadata for the site
 */
export const defaultSEO: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Full Stack Developer",
    "Software Engineer",
    "Web Development",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
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
    creator: "@jowinchemban",
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

/**
 * JSON-LD structured data for the site
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
};

/**
 * JSON-LD structured data for Person (author)
 */
export const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.author.name,
  url: siteConfig.url,
  sameAs: [
    process.env.NEXT_PUBLIC_GITHUB_URL,
    process.env.NEXT_PUBLIC_TWITTER_URL,
    process.env.NEXT_PUBLIC_LINKEDIN_URL,
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  ].filter(Boolean),
};

/**
 * Generate JSON-LD breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

/* ============================================================================
 * TEMPLATE FOR ADDING NEW PAGES
 * ============================================================================
 * 
 * To add SEO configuration for a new page:
 * 
 * 1. Add to pageSEO object (line ~48):
 * 
 *    yourpage: {
 *      title: "Your Page Title",
 *      description: "Detailed description for search engines and social media",
 *      keywords: ["keyword1", "keyword2", "keyword3", siteConfig.author.name],
 *      openGraph: {
 *        title: "Your Page Title - Site Name",
 *        description: "Social media specific description",
 *        images: [{
 *          url: `${siteConfig.url}/og-yourpage.png`,
 *          width: 1200,
 *          height: 630,
 *          alt: "Your Page",
 *        }],
 *      },
 *    },
 * 
 * 2. Create your page file (src/app/yourpage/page.tsx):
 * 
 *    import { generatePageSEO } from "@/config/seo";
 *    import type { Metadata } from "next";
 *    
 *    export const metadata: Metadata = generatePageSEO("yourpage");
 *    
 *    export default function YourPage() {
 *      return <div>Your content</div>;
 *    }
 * 
 * 3. (Optional) Create OG image:
 *    - Place in /public/og-yourpage.png
 *    - Recommended size: 1200x630px
 *    - Use tools like https://www.canva.com or Figma
 * 
 * 4. (Optional) Override specific fields:
 * 
 *    export const metadata = generatePageSEO("yourpage", {
 *      title: "Custom Override Title",
 *      description: "Custom description that overrides config",
 *    });
 * 
 * ============================================================================
 * NOTE: Blog posts SEO is NOT centralized here!
 * Blog post metadata is generated directly in src/app/blog/[slug]/page.tsx
 * using data fetched from Hashnode. This keeps blog SEO dynamic and
 * automatically synced with your Hashnode content.
 * ============================================================================
 */
