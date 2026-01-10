/**
 * Contact Form Email Template
 * 
 * Plain text-based email template for contact form submissions
 * 
 * @module lib/email/templates/contact
 */

import type { ContactFormEmailData } from "../../types";
import { unescape } from "@/lib/escape";

export function generateContactFormEmail(data: ContactFormEmailData): string {
  const { senderName, senderEmail, message, metadata } = data;

  // Escape for safety, then decode for rendering (reverse transform)
  const safeSenderName = unescape(senderName);
  const safeSenderEmail = unescape(senderEmail);
  // For message body, only unescape (assume already escaped before storage)
  const safeMessage = unescape(message);

  // Generate Google Maps link if coordinates are available
  const mapsLink = metadata.loc 
    ? `https://www.google.com/maps?q=${metadata.loc}`
    : null;


  // Add a unique date-time string to the subline for threading, formatted as [MM/DD/YYYY hh:mmam/pm]
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  let hours = now.getHours();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const minutes = pad(now.getMinutes());
  const formattedDate = `[${pad(now.getMonth() + 1)}/${pad(now.getDate())}/${now.getFullYear()} ${pad(hours)}:${minutes}${ampm}]`;

  return `
<html lang="en">
<body style="margin: 0; padding: 0; background-color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; color: #333; max-width: 700px;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 30px 30px 20px 30px; background-color: #000000; color: #ffffff;">
              <strong style="font-size: 18px; display: block; margin-bottom: 8px;">Message from ${safeSenderName}</strong>
              <span style="font-size: 13px; color: #999999;">${metadata.submittedAtIST} | ${formattedDate}</span>
            </td>
          </tr>
          
          <!-- From, Email & Message Section -->
          <tr>
            <td style="padding: 30px; border-bottom: 2px solid #e5e7eb;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="color: #6b7280; font-size: 13px;">From:</span>
                    <strong style="color: #111827; margin-left: 8px; font-size: 15px;">${safeSenderName}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="color: #6b7280; font-size: 13px;">Email:</span>
                    <a href="mailto:${safeSenderEmail}" style="color: #2563eb; text-decoration: none; margin-left: 8px;">${safeSenderEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 5px;">
                    <span style="color: #6b7280; font-size: 13px;">Message</span>
                    <div style="margin-top: 15px; padding-left: 20px; white-space: pre-wrap; color: #111827; line-height: 1.6; font-size: 14px;">${safeMessage}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Details Section -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb;">
              <div style="margin-bottom: 18px;">
                <strong style="font-size: 13px; color: #111827; text-transform: letter-spacing: 0.5px;">More Details</strong>
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
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #000000; color: #ffffff; text-align: center;">
              <a href="https://jowinjc.in" style="color: #ffffff; text-decoration: none; font-size: 14px;" target="_blank">📬 jowinjc.in</a>
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
