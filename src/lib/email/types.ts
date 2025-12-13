/**
 * Email Types
 * Shared type definitions for email functionality
 * @module lib/email/types
 */

/**
 * Contact form submission data
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  ip: string;
  userAgent: string;
  referer: string;
}

/**
 * Contact form submission metadata
 */
export interface ContactFormMetadata {
  ip: string;
  location: string;
  timezone: string;
  org: string;
  submittedAtIST: string;
  submittedAtUTC: string;
  userAgent: string;
  referrer: string;
}

/**
 * Email template data for contact form
 */
export interface ContactFormEmailData {
  senderName: string;
  senderEmail: string;
  message: string;
  metadata: ContactFormMetadata;
}

/**
 * Email sending result
 */
export interface EmailResult {
  success: boolean;
  emailId?: string;
  error?: string;
}
