/**
 * Contact Form Email Template
 * Minimal plaintext-style email template for contact form submissions
 * @module lib/email/templates/contact-form
 */

import type { ContactFormEmailData } from "../types";

export function generateContactFormEmail(data: ContactFormEmailData): string {
  const { senderName, senderEmail, message, metadata } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
      
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 4px;">
        
        <!-- Header -->
        <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">
          New Contact Message
        </h2>
        
        <!-- From -->
        <p style="margin: 0 0 5px 0;">
          <strong>From:</strong> ${senderName}
        </p>
        <p style="margin: 0 0 20px 0;">
          <strong>Email:</strong> <a href="mailto:${senderEmail}" style="color: #0066cc; text-decoration: none;">${senderEmail}</a>
        </p>
        
        <!-- Message -->
        <p style="margin: 0 0 5px 0;">
          <strong>Message:</strong>
        </p>
        <div style="margin: 0 0 25px 0; padding: 15px; background: #f9f9f9; border-left: 3px solid #333; white-space: pre-wrap;">
${message}
        </div>
        
        <!-- Details -->
        <p style="margin: 0 0 10px 0; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 15px;">
          <strong>SUBMISSION DETAILS</strong>
        </p>
        
        <table style="width: 100%; font-size: 12px; color: #666; margin-bottom: 20px;" cellpadding="4" cellspacing="0">
          <tr>
            <td style="padding: 4px 0; width: 120px;">IP Address:</td>
            <td style="padding: 4px 0; font-family: monospace;">${metadata.ip}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Location:</td>
            <td style="padding: 4px 0;">${metadata.location}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Timezone:</td>
            <td style="padding: 4px 0;">${metadata.timezone}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">ISP:</td>
            <td style="padding: 4px 0;">${metadata.org}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Submitted:</td>
            <td style="padding: 4px 0;">${metadata.submittedAtIST} (${metadata.submittedAtUTC})</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; vertical-align: top;">User Agent:</td>
            <td style="padding: 4px 0; word-break: break-word;">${metadata.userAgent}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; vertical-align: top;">Referrer:</td>
            <td style="padding: 4px 0; word-break: break-word;">${metadata.referrer}</td>
          </tr>
        </table>
        
        <!-- Reply Button -->
        <p style="margin: 20px 0 0 0;">
          <a href="mailto:${senderEmail}?subject=Re: Message from ${senderName}" 
             style="display: inline-block; padding: 10px 20px; background: #000; color: #fff; text-decoration: none; border-radius: 3px; font-size: 13px;">
            Reply to ${senderName}
          </a>
        </p>
        
        <!-- Footer -->
        <p style="margin: 25px 0 0 0; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 11px; color: #999; text-align: center;">
          Sent from jowinjc.in contact form
        </p>
        
      </div>
      
    </body>
    </html>
  `;
}
