// src/config/index.ts
/**
 * Central export for all configuration modules
 * @module config
 */

// Site configuration
export {
  siteConfig,
  socialLinks,
  seoConfig,
  emailConfig,
  features,
  navConfig,
  getFullUrl,
  type SocialPlatform,
  type NavItem,
} from './site';

// SEO configuration
export {
  defaultSEO,
  pageSEO,
  generatePageSEO,
  websiteStructuredData,
  personStructuredData,
  generateBreadcrumbStructuredData,
} from './seo';
