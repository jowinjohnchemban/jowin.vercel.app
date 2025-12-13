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
    <body style="margin: 0; padding: 0; background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      
      <!-- Container -->
      <div style="max-width: 680px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Main Card -->
        <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          
          <!-- Header -->
          <div style="background-color: #09090b; padding: 32px 40px; border-bottom: 1px solid #27272a;">
            <div style="text-align: center;">
              <div style="display: inline-block; padding: 12px 24px; background-color: #18181b; border-radius: 8px; border: 1px solid #27272a;">
                <h1 style="margin: 0; color: #fafafa; font-size: 20px; font-weight: 600; letter-spacing: -0.025em;">
                  New Message
                </h1>
              </div>
            </div>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px;">
            
            <!-- Sender Card -->
            <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <div style="width: 48px; height: 48px; border-radius: 9999px; background-color: #09090b; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
                  <span style="color: #fafafa; font-size: 20px; font-weight: 600;">${senderName.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h2 style="margin: 0 0 4px 0; color: #09090b; font-size: 18px; font-weight: 600;">${senderName}</h2>
                  <a href="mailto:${senderEmail}" style="color: #71717a; text-decoration: none; font-size: 14px;">${senderEmail}</a>
                </div>
              </div>
            </div>
            
            <!-- Message Section -->
            <div style="margin-bottom: 32px;">
              <div style="margin-bottom: 12px;">
                <span style="display: inline-block; padding: 6px 12px; background-color: #09090b; color: #fafafa; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 6px;">
                  Message
                </span>
              </div>
              <div style="background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; padding: 24px;">
                <p style="margin: 0; color: #18181b; line-height: 1.75; white-space: pre-wrap; word-wrap: break-word; font-size: 15px;">${message}</p>
              </div>
            </div>
            
            <!-- Metadata Section -->
            <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
              <div style="margin-bottom: 16px;">
                <span style="display: inline-block; padding: 6px 12px; background-color: #18181b; color: #fafafa; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 6px;">
                  Details
                </span>
              </div>
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #e4e4e7;">
                  <span style="flex: 0 0 120px; color: #71717a; font-size: 13px; font-weight: 500;">IP Address</span>
                  <span style="color: #18181b; font-size: 13px; font-family: monospace;">${metadata.ip}</span>
                </div>
                <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #e4e4e7;">
                  <span style="flex: 0 0 120px; color: #71717a; font-size: 13px; font-weight: 500;">Location</span>
                  <span style="color: #18181b; font-size: 13px;">${metadata.location}</span>
                </div>
                <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #e4e4e7;">
                  <span style="flex: 0 0 120px; color: #71717a; font-size: 13px; font-weight: 500;">Timezone</span>
                  <span style="color: #18181b; font-size: 13px;">${metadata.timezone}</span>
                </div>
                <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #e4e4e7;">
                  <span style="flex: 0 0 120px; color: #71717a; font-size: 13px; font-weight: 500;">ISP</span>
                  <span style="color: #18181b; font-size: 13px;">${metadata.org}</span>
                </div>
                <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #e4e4e7;">
                  <span style="flex: 0 0 120px; color: #71717a; font-size: 13px; font-weight: 500;">Submitted</span>
                  <div style="color: #18181b; font-size: 13px;">
                    ${metadata.submittedAtIST}<br/>
                    <span style="color: #71717a; font-size: 12px;">${metadata.submittedAtUTC}</span>
                  </div>
                </div>
                <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #e4e4e7;">
                  <span style="flex: 0 0 120px; color: #71717a; font-size: 13px; font-weight: 500;">User Agent</span>
                  <span style="color: #18181b; font-size: 12px; word-break: break-all;">${metadata.userAgent}</span>
                </div>
                <div style="display: flex; padding: 12px 0;">
                  <span style="flex: 0 0 120px; color: #71717a; font-size: 13px; font-weight: 500;">Referrer</span>
                  <span style="color: #18181b; font-size: 12px; word-break: break-all;">${metadata.referrer}</span>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <div style="text-align: center;">
              <a href="mailto:${senderEmail}?subject=Re: Message from ${senderName}" 
                 style="display: inline-block; padding: 16px 32px; background-color: #09090b; color: #fafafa; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; letter-spacing: -0.025em; transition: background-color 0.2s;">
                Reply to ${senderName}
              </a>
            </div>
            
          </div>
          
          <!-- Footer -->
          <div style="background-color: #fafafa; padding: 24px 40px; border-top: 1px solid #e4e4e7; text-align: center;">
            <p style="margin: 0; color: #71717a; font-size: 13px;">
              🔒 Verified via Cloudflare · <a href="https://jowinjc.in" style="color: #18181b; text-decoration: none; font-weight: 500;">jowinjc.in</a>
            </p>
          </div>
          
        </div>
        
        <!-- Bottom Spacer -->
        <div style="padding: 20px; text-align: center;">
          <p style="margin: 0; color: #71717a; font-size: 12px;">
            This email was sent from your contact form
          </p>
        </div>
        
      </div>
      
    </body>
    </html>
  `;
}
