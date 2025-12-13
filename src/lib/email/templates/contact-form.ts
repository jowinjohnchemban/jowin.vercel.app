/**
 * Contact Form Email Template
 * Professional HTML email template for contact form submissions
 * @module lib/email/templates/contact-form
 */

export interface ContactFormEmailData {
  senderName: string;
  senderEmail: string;
  message: string;
  metadata: {
    ip: string;
    location: string;
    timezone: string;
    org: string;
    submittedAtIST: string;
    submittedAtUTC: string;
    userAgent: string;
    referrer: string;
  };
}

export function generateContactFormEmail(data: ContactFormEmailData): string {
  const { senderName, senderEmail, message, metadata } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
            📬 New Contact Form Submission
          </h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px;">
          
          <!-- Sender Information -->
          <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 25px; border-radius: 4px;">
            <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px; font-weight: 600;">Sender Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500; width: 100px;">Name:</td>
                <td style="padding: 8px 0; color: #333; font-weight: 600;">${senderName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: 500;">Email:</td>
                <td style="padding: 8px 0;">
                  <a href="mailto:${senderEmail}" style="color: #667eea; text-decoration: none; font-weight: 600;">${senderEmail}</a>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Message -->
          <div style="margin-bottom: 25px;">
            <h3 style="margin: 0 0 12px 0; color: #333; font-size: 16px; font-weight: 600;">Message:</h3>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; border: 1px solid #e9ecef;">
              <p style="margin: 0; color: #333; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word;">${message}</p>
            </div>
          </div>
          
          <!-- Metadata -->
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin-bottom: 25px; border-radius: 4px;">
            <h3 style="margin: 0 0 15px 0; color: #856404; font-size: 16px; font-weight: 600;">📊 Submission Information</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #856404; font-weight: 500;">IP Address:</td>
                <td style="padding: 6px 0; color: #856404; font-family: monospace;">${metadata.ip}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #856404; font-weight: 500;">Location:</td>
                <td style="padding: 6px 0; color: #856404;">${metadata.location}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #856404; font-weight: 500;">Timezone:</td>
                <td style="padding: 6px 0; color: #856404;">${metadata.timezone}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #856404; font-weight: 500;">ISP/Org:</td>
                <td style="padding: 6px 0; color: #856404; font-size: 12px;">${metadata.org}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #856404; font-weight: 500; vertical-align: top;">Submitted at:</td>
                <td style="padding: 6px 0; color: #856404;">
                  ${metadata.submittedAtIST}<br/>
                  <span style="font-size: 12px; color: #a58357;">(${metadata.submittedAtUTC})</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #856404; font-weight: 500;">User Agent:</td>
                <td style="padding: 6px 0; color: #856404; font-size: 12px; word-break: break-all;">${metadata.userAgent}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #856404; font-weight: 500;">Referrer:</td>
                <td style="padding: 6px 0; color: #856404; font-size: 12px; word-break: break-all;">${metadata.referrer}</td>
              </tr>
            </table>
          </div>

          <!-- Action Button -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${senderEmail}?subject=Re: Your message" 
               style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
              Reply to ${senderName}
            </a>
          </div>
          
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
          <p style="margin: 0; color: #6c757d; font-size: 13px;">
            🔒 Verified via Cloudflare Turnstile | Sent from <a href="https://jowinjc.in" style="color: #667eea; text-decoration: none;">jowinjc.in</a>
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;
}
