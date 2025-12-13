/**
 * Contact Form Email Template
 * Plain text-based email template for contact form submissions
 * @module lib/email/templates/contact-form
 */

import type { ContactFormEmailData } from "../types";

export function generateContactFormEmail(data: ContactFormEmailData): string {
  const { senderName, senderEmail, message, metadata } = data;

  return `
<html>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="left">
        <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; color: #000;">
          
          <tr>
            <td style="padding: 0 0 20px 0;">
              <strong style="font-size: 16px;">Message from ${senderName} - ${metadata.submittedAtIST}</strong>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 5px 0;">
              <strong>From:</strong> ${senderName}
            </td>
          </tr>
          <tr>
            <td style="padding: 5px 0;">
              <strong>Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 5px 0;">
              <strong>IP:</strong> ${metadata.ip}
            </td>
          </tr>
          <tr>
            <td style="padding: 5px 0 20px 0;">
              <strong>Location:</strong> ${metadata.location}
            </td>
          </tr>
          
          <tr>
            <td style="padding: 20px 0; border-top: 1px solid #ccc;">
              <div style="white-space: pre-wrap;">${message}</div>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 20px 0 10px 0; border-top: 1px solid #ccc;">
              <strong>DETAILS</strong>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0;">
              <table cellpadding="4" cellspacing="0" border="0" style="font-size: 13px;">
                <tr>
                  <td style="padding: 4px 15px 4px 0;" valign="top">
                    <strong>Timezone:</strong>
                  </td>
                  <td style="padding: 4px 0;">
                    ${metadata.timezone}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 15px 4px 0;" valign="top">
                    <strong>ISP:</strong>
                  </td>
                  <td style="padding: 4px 0;">
                    ${metadata.org}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 15px 4px 0;" valign="top">
                    <strong>Submitted:</strong>
                  </td>
                  <td style="padding: 4px 0;">
                    ${metadata.submittedAtIST} (${metadata.submittedAtUTC})
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 15px 4px 0;" valign="top">
                    <strong>User Agent:</strong>
                  </td>
                  <td style="padding: 4px 0; font-size: 12px;">
                    ${metadata.userAgent}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 15px 4px 0;" valign="top">
                    <strong>Referrer:</strong>
                  </td>
                  <td style="padding: 4px 0; font-size: 12px;">
                    ${metadata.referrer}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 20px 0 0 0; border-top: 1px solid #ccc;">
              Reply to: <a href="mailto:${senderEmail}">${senderEmail}</a>
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
