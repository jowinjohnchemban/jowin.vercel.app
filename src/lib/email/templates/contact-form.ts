/**
 * Contact Form Email Template
 * Plain text-based email template for contact form submissions
 * @module lib/email/templates/contact-form
 */

import type { ContactFormEmailData } from "../types";

export function generateContactFormEmail(data: ContactFormEmailData): string {
  const { senderName, senderEmail, message, metadata } = data;
  
  // Generate Google Maps link if coordinates are available
  const mapsLink = metadata.loc 
    ? `https://www.google.com/maps?q=${metadata.loc}`
    : null;

  return `
<html>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 30px 30px 20px 30px; background-color: #000000; color: #ffffff;">
              <strong style="font-size: 18px; display: block; margin-bottom: 8px;">Message from ${senderName}</strong>
              <span style="font-size: 13px; color: #999999;">${metadata.submittedAtIST}</span>
            </td>
          </tr>
          
          <!-- Sender Info -->
          <tr>
            <td style="padding: 25px 30px; border-bottom: 1px solid #e5e7eb;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding: 6px 0;">
                    <span style="color: #6b7280; font-size: 13px;">From:</span>
                    <strong style="color: #111827; margin-left: 8px;">${senderName}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0;">
                    <span style="color: #6b7280; font-size: 13px;">Email:</span>
                    <a href="mailto:${senderEmail}" style="color: #2563eb; text-decoration: none; margin-left: 8px;">${senderEmail}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Message -->
          <tr>
            <td style="padding: 25px 30px; background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;">
              <div style="white-space: pre-wrap; color: #111827; line-height: 1.6;">${message}</div>
            </td>
          </tr>
          
          <!-- Tracking Details Section -->
          <tr>
            <td style="padding: 25px 30px;">
              <div style="margin-bottom: 18px;">
                <strong style="font-size: 13px; color: #111827; text-transform: uppercase; letter-spacing: 0.5px;">Tracking Details</strong>
              </div>
              
              <table cellpadding="6" cellspacing="0" border="0" style="font-size: 13px; width: 100%;">
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; width: 140px; vertical-align: top;" valign="top">IP Address</td>
                  <td style="padding: 10px 0; color: #111827; vertical-align: top;">
                    <a href="https://ipinfo.io/${metadata.ip}" style="color: #2563eb; text-decoration: none;" target="_blank">${metadata.ip}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; vertical-align: top;" valign="top">Location</td>
                  <td style="padding: 10px 0; color: #111827; vertical-align: top;">
                    ${mapsLink ? `<a href="${mapsLink}" style="color: #2563eb; text-decoration: none;" target="_blank">${metadata.location}</a>` : metadata.location}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; vertical-align: top;" valign="top">Timezone</td>
                  <td style="padding: 10px 0; color: #111827; vertical-align: top;">${metadata.timezone}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; vertical-align: top;" valign="top">ISP/Org</td>
                  <td style="padding: 10px 0; color: #111827; vertical-align: top;">${metadata.org}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; vertical-align: top;" valign="top">Submitted</td>
                  <td style="padding: 10px 0; color: #111827; vertical-align: top;">
                    ${metadata.submittedAtIST}<br>
                    <span style="color: #9ca3af; font-size: 12px;">(${metadata.submittedAtUTC})</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; vertical-align: top;" valign="top">User Agent</td>
                  <td style="padding: 10px 0; color: #6b7280; font-size: 12px; vertical-align: top; word-break: break-word;">${metadata.userAgent}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; vertical-align: top;" valign="top">Referrer</td>
                  <td style="padding: 10px 0; vertical-align: top;">
                    <a href="${metadata.referrer}" style="color: #2563eb; text-decoration: none; font-size: 12px; word-break: break-word;" target="_blank">${metadata.referrer}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
