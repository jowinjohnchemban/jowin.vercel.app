/**
 * Email Provider Interface
 * Abstract interface for email sending providers
 * @module lib/email/providers/base
 */

export interface EmailMessage {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<EmailResponse>;
}
