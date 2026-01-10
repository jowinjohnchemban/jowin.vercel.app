/**
 * Environment Variables Validation
 * 
 * Type-safe environment variable schema using Zod.
 * Validates all required and optional environment variables at build/start time.
 * 
 * @module env
 * 
 * @usage
 * ```typescript
 * import { env } from '@/env';
 * 
 * // Type-safe access
 * const siteName = env.NEXT_PUBLIC_SITE_NAME; // string
 * const contactEmail = env.CONTACT_EMAIL; // string | undefined
 * ```
 */

import { z } from 'zod';

/**
 * Define environment variable schema
 * Validates at build time to catch configuration errors early
 * Empty strings are treated as undefined for all optional fields
 */
const envSchema = z.object({
  // Site Configuration
  NEXT_PUBLIC_SITE_NAME: z.string().describe('Site name/title'),
  NEXT_PUBLIC_SITE_URL: z.string().url().describe('Site base URL'),
  NEXT_PUBLIC_SITE_DESCRIPTION: z.string().transform(val => val === '' ? undefined : val).optional().describe('Site description'),

  // Hashnode Configuration
  NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: z.string().transform(val => val === '' ? undefined : val).optional(),
  HASHNODE_API_KEY: z.string().transform(val => val === '' ? undefined : val).optional().describe('Hashnode API key for blog data'),

  // Email Configuration
  EMAIL_PROVIDER: z
    .enum(['resend', 'nodemailer', 'sendgrid', 'ses'])
    .default('resend')
    .describe('Email service provider'),
  CONTACT_EMAIL: z.string().email().or(z.literal('')).transform(val => val === '' ? undefined : val).optional().describe('Destination for contact form'),
  RESEND_FROM_EMAIL: z.string().email().or(z.literal('')).transform(val => val === '' ? undefined : val).optional().describe('From email for Resend'),
  RESEND_API_KEY: z.string().transform(val => val === '' ? undefined : val).optional().describe('Resend API key'),

  // SMTP Configuration (Nodemailer fallback)
  SMTP_HOST: z.string().transform(val => val === '' ? undefined : val).optional().default('localhost'),
  SMTP_PORT: z.string().transform(val => val === '' ? undefined : val).optional().default('465'),
  SMTP_SECURE: z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true')
    .default('true'),
  SMTP_USER: z.string().transform(val => val === '' ? undefined : val).optional(),
  SMTP_PASS: z.string().transform(val => val === '' ? undefined : val).optional(),

  // Analytics
  NEXT_PUBLIC_GTM_ID: z.string().transform(val => val === '' ? undefined : val).optional().describe('Google Tag Manager ID'),
  NEXT_PUBLIC_AHREFS_KEY: z.string().transform(val => val === '' ? undefined : val).optional().describe('Ahrefs verification key'),
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().transform(val => val === '' ? undefined : val).optional(),
  NEXT_PUBLIC_DMCA_VERIFICATION: z.string().transform(val => val === '' ? undefined : val).optional(),

  // Social Links (empty strings are treated as undefined)
  NEXT_PUBLIC_GITHUB_URL: z.string().url().or(z.literal('')).transform(val => val === '' ? undefined : val).optional(),
  NEXT_PUBLIC_TWITTER_URL: z.string().url().or(z.literal('')).transform(val => val === '' ? undefined : val).optional(),
  NEXT_PUBLIC_LINKEDIN_URL: z.string().url().or(z.literal('')).transform(val => val === '' ? undefined : val).optional(),
  NEXT_PUBLIC_YOUTUBE_URL: z.string().url().or(z.literal('')).transform(val => val === '' ? undefined : val).optional(),
  NEXT_PUBLIC_INSTAGRAM_URL: z.string().url().or(z.literal('')).transform(val => val === '' ? undefined : val).optional(),
  NEXT_PUBLIC_FACEBOOK_URL: z.string().url().or(z.literal('')).transform(val => val === '' ? undefined : val).optional(),
  NEXT_PUBLIC_TWITTER_HANDLE: z.string().transform(val => val === '' ? undefined : val).optional(),

  // API Security
  HASHNODE_REVALIDATE_WEBHOOK_SECRET: z.string().transform(val => val === '' ? undefined : val).optional().describe('Secret for Hashnode webhook revalidation'),

  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
});

/**
 * Parse and validate environment variables
 * Throws error if validation fails
 */
let parsedEnv: z.infer<typeof envSchema> | null = null;

function getParsedEnv(): z.infer<typeof envSchema> {
  if (parsedEnv) return parsedEnv;

  try {
    parsedEnv = envSchema.parse(process.env);
    return parsedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .filter((issue) => issue.code === 'invalid_type')
        .map((issue) => issue.path.join('.'));

      console.error('❌ Environment Validation Failed');
      console.error('Missing or invalid variables:', missingVars);
      console.error('\nAdd these to your .env.local file:');
      missingVars.forEach((varName) => {
        console.error(`  ${varName}=`);
      });
      console.error('\nFull error details:', JSON.stringify(error.issues, null, 2));

      // In production, throw error to prevent deployment only if there are missing variables
      if (process.env.NODE_ENV === 'production' && missingVars.length > 0) {
        throw new Error('Environment validation failed. Check logs above.');
      }
    }
    throw error;
  }
}

// Parse and validate at module load time
export const env = getParsedEnv();

/**
 * Helper function to check if a feature is enabled
 * @param feature - Feature flag name
 * @returns boolean indicating if feature is enabled
 */
export function isFeatureEnabled(
  feature: 'analytics' | 'social' | 'blog' | 'contact'
): boolean {
  switch (feature) {
    case 'analytics':
      return !!env.NEXT_PUBLIC_GTM_ID || !!env.NEXT_PUBLIC_AHREFS_KEY;
    case 'social':
      return !!(
        env.NEXT_PUBLIC_GITHUB_URL ||
        env.NEXT_PUBLIC_TWITTER_URL ||
        env.NEXT_PUBLIC_LINKEDIN_URL
      );
    case 'blog':
      return !!env.NEXT_PUBLIC_HASHNODE_PUBLICATION_ID && !!env.HASHNODE_API_KEY;
    case 'contact':
      return !!env.CONTACT_EMAIL && !!env.RESEND_API_KEY;
    default:
      return false;
  }
}

/**
 * Get safe environment config for client-side use
 * Only includes NEXT_PUBLIC_* variables
 */
export const publicEnv = {
  NEXT_PUBLIC_SITE_NAME: env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_SITE_URL: env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_DESCRIPTION: env.NEXT_PUBLIC_SITE_DESCRIPTION,
  NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: env.NEXT_PUBLIC_HASHNODE_PUBLICATION_ID,
  NEXT_PUBLIC_GTM_ID: env.NEXT_PUBLIC_GTM_ID,
  NEXT_PUBLIC_AHREFS_KEY: env.NEXT_PUBLIC_AHREFS_KEY,
  NEXT_PUBLIC_GITHUB_URL: env.NEXT_PUBLIC_GITHUB_URL,
  NEXT_PUBLIC_TWITTER_URL: env.NEXT_PUBLIC_TWITTER_URL,
  NEXT_PUBLIC_LINKEDIN_URL: env.NEXT_PUBLIC_LINKEDIN_URL,
  NEXT_PUBLIC_YOUTUBE_URL: env.NEXT_PUBLIC_YOUTUBE_URL,
  NEXT_PUBLIC_INSTAGRAM_URL: env.NEXT_PUBLIC_INSTAGRAM_URL,
  NEXT_PUBLIC_FACEBOOK_URL: env.NEXT_PUBLIC_FACEBOOK_URL,
} as const;
