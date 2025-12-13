/**
 * Email Provider Factory
 * Creates email provider instances based on configuration
 * @module lib/email/providers
 */

export type { EmailProvider, EmailMessage, EmailResponse } from './base';
export { ResendProvider } from './resend';
export { NodemailerProvider, type NodemailerConfig } from './nodemailer';

import { EmailProvider } from './base';
import { ResendProvider } from './resend';
import { NodemailerProvider } from './nodemailer';

export type EmailProviderType = 'resend' | 'nodemailer' | 'sendgrid' | 'ses';

export class EmailProviderFactory {
  static create(type: EmailProviderType = 'resend'): EmailProvider {
    switch (type) {
      case 'resend':
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
          throw new Error('RESEND_API_KEY environment variable not set');
        }
        return new ResendProvider(resendApiKey);
      
      case 'nodemailer':
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = process.env.SMTP_PORT;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        
        if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
          throw new Error('Missing Nodemailer environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS');
        }
        
        return new NodemailerProvider({
          host: smtpHost,
          port: parseInt(smtpPort, 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });
      
      // Add other providers here in the future
      // case 'sendgrid':
      //   return new SendGridProvider(process.env.SENDGRID_API_KEY!);
      // case 'ses':
      //   return new SESProvider(process.env.AWS_REGION!);
      
      default:
        throw new Error(`Unsupported email provider: ${type}`);
    }
  }
}
