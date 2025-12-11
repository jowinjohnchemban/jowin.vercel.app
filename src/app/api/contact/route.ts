import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/lib/validation";
import { Sanitizer, TurnstileService } from "@/lib/security";

const resend = new Resend(process.env.RESEND_API_KEY);
const turnstile = new TurnstileService(process.env.TURNSTILE_SECRET_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, captchaToken } = body;

    // Verify captcha token
    if (!captchaToken) {
      return NextResponse.json(
        { error: "Captcha verification required" },
        { status: 400 }
      );
    }

    // Get client IP address
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    console.log("[API] Verifying captcha for IP:", ip);
    
    // Verify turnstile token
    if (!turnstile.isConfigured()) {
      console.error("[API] Turnstile not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const captchaResult = await turnstile.verify(captchaToken, ip);

    if (!captchaResult.success) {
      console.error("[API] Captcha verification failed:", captchaResult.errorCodes);
      return NextResponse.json(
        {
          error: "Captcha verification failed. Please try again.",
          details: captchaResult.errorCodes,
        },
        { status: 400 }
      );
    }

    console.log("[API] Captcha verification passed");

    // Sanitize inputs
    const sanitizedData = {
      name: Sanitizer.sanitizePlainText(name),
      email: Sanitizer.sanitizePlainText(email),
      message: Sanitizer.sanitizePlainText(message),
      captchaToken,
    };

    console.log('[API] Received data:', { 
      name: sanitizedData.name, 
      email: sanitizedData.email, 
      messageLength: sanitizedData.message.length,
      hasCaptcha: !!sanitizedData.captchaToken 
    });

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

    console.log('[API] Validation passed');
    const { name: sanitizedName, email: sanitizedEmail, message: sanitizedMessage } = validationResult.data;

    const recipientEmail = process.env.CONTACT_EMAIL;
    if (!recipientEmail) {
      console.error("CONTACT_EMAIL environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: recipientEmail,
      replyTo: sanitizedEmail,
      subject: `New Contact Form Submission from ${sanitizedName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${sanitizedName}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${sanitizedEmail}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555;">Message:</h3>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
              ${sanitizedMessage}
            </div>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
          
          <p style="color: #888; font-size: 12px;">
            This email was sent from your portfolio contact form at ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully", id: data?.id },
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
