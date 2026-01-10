import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";
import { Sanitizer } from "@/lib/security";
import { createContactEmailService } from "@/lib/email";
import { isInputSafe } from '@/lib/security/detector';
import { EmailProviderFactory } from '@/lib/email/providers';
import { generateSecurityAlertHTML } from '@/lib/email/templates/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Get client IP address
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Run threat detection on raw input (detect XSS, SQLi, etc.)
    const { safe, threats } = isInputSafe(String(message ?? ''));

    if (!safe) {
      console.error('[API] Threat detected in contact form submission:', threats);

      // Attempt to send a security alert email to the configured contact email
      try {
        const recipientEmail = process.env.CONTACT_EMAIL;
        const fromEmail = process.env.RESEND_FROM_EMAIL;
        if (recipientEmail && fromEmail) {
          const providerType = (process.env.EMAIL_PROVIDER as 'resend' | 'nodemailer') || 'resend';
          const provider = EmailProviderFactory.create(providerType);

          const html = generateSecurityAlertHTML({
            threats,
            warnings: [],
            timestamp: new Date().toISOString(),
            summary: {
              totalThreats: threats.length,
              criticalCount: threats.filter(t => t.severity === 'critical').length,
              highCount: threats.filter(t => t.severity === 'high').length,
            },
          });

          await provider.send({
            from: fromEmail,
            to: recipientEmail,
            subject: `🚨 Security Alert: Threat detected in contact form submission`,
            html,
          });
        }
      } catch (err) {
        console.error('[API] Failed to send security alert email:', err);
      }

      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: Sanitizer.sanitizePlainText(name),
      email: Sanitizer.sanitizePlainText(email),
      message: Sanitizer.sanitizePlainText(message),
    };

    // Validate with Zod schema
    const validationResult = contactFormSchema.safeParse(sanitizedData);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0].message;
      console.error('[API] Validation failed:', errorMessage);
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    const { name: sanitizedName, email: sanitizedEmail, message: sanitizedMessage } = validationResult.data;

    // Get user information
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const referer = request.headers.get("referer") || "Direct";

    // Send contact email using service
      const emailService = createContactEmailService();
      // Always escape the original message before passing to the email template
      function escapeHTML(str: string): string {
        return String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\"/g, "&quot;")
          .replace(/'/g, "&#39;");
      }
      const emailResult = await emailService.sendEmail({
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage,
        ip,
        userAgent,
        referer,
        rawMessage: escapeHTML(message),
      });

    if (!emailResult.success) {
      console.error("[API] Email sending failed:", emailResult.error);
      return NextResponse.json(
        { error: emailResult.error || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully", id: emailResult.emailId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
