/**
 * Resend Email Provider
 * Implementation of email provider using Resend service
 * @module lib/email/providers/resend
 */

import { Resend } from "resend";
import { EmailProvider, EmailMessage, EmailResponse } from "./base";

export class ResendProvider implements EmailProvider {
  private client: Resend;

  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }

  async send(message: EmailMessage): Promise<EmailResponse> {
    try {
      const { data, error } = await this.client.emails.send({
        from: message.from,
        to: message.to,
        replyTo: message.replyTo,
        subject: message.subject,
        html: message.html,
      });

      if (error) {
        console.error("[ResendProvider] Send error:", error);
        return {
          success: false,
          error: error.message || "Failed to send email",
        };
      }

      return {
        success: true,
        messageId: data?.id,
      };
    } catch (error) {
      console.error("[ResendProvider] Unexpected error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
