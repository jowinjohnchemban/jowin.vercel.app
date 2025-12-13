/**
 * Contact Form Email Template
 * Professional HTML email template for contact form submissions
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
    <body style="margin: 0; padding: 20px; background-color: #e5e5e5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #2c3e50; padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
            📬 Message from ${senderName}
          </h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px; background-color: #ffffff;">
          
          <!-- Sender Information -->
          <div style="background-color: #f5f5f5; border-left: 4px solid #2c3e50; padding: 20px; margin-bottom: 25px; border-radius: 4px;">
            <h2 style="margin: 0 0 15px 0; color: #2c3e50; font-size: 18px; font-weight: 600;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: 500; width: 80px;">Name:</td>
                <td style="padding: 8px 0; color: #2c3e50; font-weight: 600;">${senderName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555; font-weight: 500;">Email:</td>
                <td style="padding: 8px 0;">
                  <a href="mailto:${senderEmail}" style="color: #2c3e50; text-decoration: none; font-weight: 600;">${senderEmail}</a>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Message -->
          <div style="margin-bottom: 25px;">
            <h3 style="margin: 0 0 12px 0; color: #2c3e50; font-size: 16px; font-weight: 600;">Message:</h3>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #ddd;">
              <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word;">${message}</p>
            </div>
          </div>
          
          <!-- Metadata -->
          <div style="background-color: #f5f5f5; border-left: 4px solid #95a5a6; padding: 20px; margin-bottom: 25px; border-radius: 4px;">
            <h3 style="margin: 0 0 15px 0; color: #555; font-size: 16px; font-weight: 600;">📊 Submission Details</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #666; font-weight: 500;">IP Address:</td>
                <td style="padding: 6px 0; color: #333; font-family: monospace;">${metadata.ip}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; font-weight: 500;">Location:</td>
                <td style="padding: 6px 0; color: #333;">${metadata.location}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; font-weight: 500;">Timezone:</td>
                <td style="padding: 6px 0; color: #333;">${metadata.timezone}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; font-weight: 500;">ISP/Org:</td>
                <td style="padding: 6px 0; color: #333; font-size: 12px;">${metadata.org}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; font-weight: 500; vertical-align: top;">Submitted:</td>
                <td style="padding: 6px 0; color: #333;">
                  ${metadata.submittedAtIST}<br/>
                  <span style="font-size: 12px; color: #888;">(${metadata.submittedAtUTC})</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; font-weight: 500;">User Agent:</td>
                <td style="padding: 6px 0; color: #333; font-size: 12px; word-break: break-all;">${metadata.userAgent}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666; font-weight: 500;">Referrer:</td>
                <td style="padding: 6px 0; color: #333; font-size: 12px; word-break: break-all;">${metadata.referrer}</td>
              </tr>
            </table>
          </div>

          <!-- Action Button -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${senderEmail}?subject=Re: Your message to Jowin" 
               style="display: inline-block; padding: 14px 32px; background-color: #2c3e50; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
              Reply to ${senderName}
            </a>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
          <p style="margin: 0; color: #666; font-size: 13px;">
            🔒 Verified via Cloudflare Turnstile | Sent from <a href="https://jowinjc.in" style="color: #2c3e50; text-decoration: none;">jowinjc.in</a>
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;
}
