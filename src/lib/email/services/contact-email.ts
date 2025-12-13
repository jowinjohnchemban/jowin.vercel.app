/**
 * Contact Email Service
 * Orchestrates contact form email sending with IP geolocation
 * @module lib/email/services/contact-email
 */

import { EmailProvider, EmailProviderFactory } from "../providers";
import { IPGeolocationService, IPInfoProvider } from "@/lib/services/ip-geolocation";
import { generateContactFormEmail } from "../templates/contact-form";
import type { ContactFormData, ContactFormMetadata, EmailResult } from "../types";

/**
 * Contact Email Service Class
 * Handles the complete flow of sending contact form emails
 */
export class ContactEmailService {
  private emailProvider: EmailProvider;
  private ipGeolocationService: IPGeolocationService;
  private recipientEmail: string;
  private fromEmail: string;

  constructor(
    emailProvider: EmailProvider,
    ipGeolocationService: IPGeolocationService,
    recipientEmail: string,
    fromEmail: string
  ) {
    this.emailProvider = emailProvider;
    this.ipGeolocationService = ipGeolocationService;
    this.recipientEmail = recipientEmail;
    this.fromEmail = fromEmail;
  }

  /**
   * Format submission times in IST and UTC
   */
  private formatSubmissionTimes(date: Date): { ist: string; utc: string } {
    const ist = date.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'long'
    });
    
    const utc = date.toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'full',
      timeStyle: 'long'
    });

    return { ist, utc };
  }

  /**
   * Build metadata from contact form data
   */
  private async buildMetadata(data: ContactFormData): Promise<ContactFormMetadata> {
    const submittedAt = new Date();
    const times = this.formatSubmissionTimes(submittedAt);
    
    // Fetch IP information
    const ipInfo = await this.ipGeolocationService.getIPInfo(data.ip);
    const location = this.ipGeolocationService.formatLocation(ipInfo);

    return {
      ip: data.ip,
      location,
      timezone: ipInfo.timezone,
      org: ipInfo.org,
      submittedAtIST: times.ist,
      submittedAtUTC: times.utc,
      userAgent: data.userAgent,
      referrer: data.referer,
    };
  }

  /**
   * Send contact form email
   */
  async sendEmail(data: ContactFormData): Promise<EmailResult> {
    try {
      // Build metadata with IP geolocation
      const metadata = await this.buildMetadata(data);

      // Generate email HTML
      const html = generateContactFormEmail({
        senderName: data.name,
        senderEmail: data.email,
        message: data.message,
        metadata,
      });

      // Send email via provider
      const result = await this.emailProvider.send({
        from: this.fromEmail,
        to: this.recipientEmail,
        replyTo: data.email,
        subject: `New message from ${data.name}`,
        html,
      });

      if (!result.success) {
        console.error("[ContactEmailService] Email send failed:", result.error);
        return {
          success: false,
          error: result.error || "Failed to send email",
        };
      }

      return {
        success: true,
        emailId: result.messageId,
      };
    } catch (error) {
      console.error("[ContactEmailService] Unexpected error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

/**
 * Factory function to create ContactEmailService with default configuration
 */
export function createContactEmailService(): ContactEmailService {
  const recipientEmail = process.env.CONTACT_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!recipientEmail || !fromEmail) {
    throw new Error("Missing required environment variables: CONTACT_EMAIL or RESEND_FROM_EMAIL");
  }

  // Get email provider type from environment variable, default to 'resend'
  const providerType = (process.env.EMAIL_PROVIDER as 'resend' | 'nodemailer' | 'sendgrid' | 'ses') || 'resend';
  const emailProvider = EmailProviderFactory.create(providerType);
  
  const ipProvider = new IPInfoProvider(process.env.IPINFO_TOKEN);
  const ipGeolocationService = new IPGeolocationService(ipProvider);

  return new ContactEmailService(
    emailProvider,
    ipGeolocationService,
    recipientEmail,
    fromEmail
  );
}
