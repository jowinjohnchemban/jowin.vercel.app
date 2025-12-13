/**
 * Nodemailer Email Provider
 * Implementation of email provider using Nodemailer
 * @module lib/email/providers/nodemailer
 */

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { EmailProvider, EmailMessage, EmailResponse } from "./base";

export interface NodemailerConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class NodemailerProvider implements EmailProvider {
  private transporter: Transporter;

  constructor(config: NodemailerConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  async send(message: EmailMessage): Promise<EmailResponse> {
    try {
      const info = await this.transporter.sendMail({
        from: message.from,
        to: message.to,
        replyTo: message.replyTo,
        subject: message.subject,
        html: message.html,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("[NodemailerProvider] Send error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      };
    }
  }

  /**
   * Verify connection configuration
   */
  async verify(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("[NodemailerProvider] Verification failed:", error);
      return false;
    }
  }
}
