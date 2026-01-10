/**
 * Email Types
 * Shared type definitions for email functionality
 * @module lib/email/types
 */

import type { ISODateString, URLString } from '../api/hashnode/types';

/**
 * Contact form submission data
 */
export interface ContactFormData {
  readonly name: string;
  readonly email: string;
  readonly message: string;
  readonly ip: string;
  readonly userAgent: string;
  readonly referer: URLString;
  readonly rawMessage?: string; // optional, for original (escaped) message
}

/**
 * Contact form submission metadata
 */
export interface ContactFormMetadata {
  readonly ip: string;
  readonly location: string;
  readonly city: string;
  readonly region: string;
  readonly country: string;
  readonly postal: string;
  readonly timezone: string;
  readonly org: string;
  readonly loc?: string;
  readonly submittedAtIST: ISODateString;
  readonly submittedAtUTC: ISODateString;
  readonly userAgent: string;
  readonly referrer: URLString;
}

/**
 * Email template data for contact form
 */
export interface ContactFormEmailData {
  readonly senderName: string;
  readonly senderEmail: string;
  readonly message: string;
  readonly metadata: ContactFormMetadata;
  readonly rawMessage?: string; // original, unescaped user input
}

/**
 * Email sending result
 */
export interface EmailResult {
  readonly success: boolean;
  readonly emailId?: string;
  readonly error?: string;
}
