import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";
import { Sanitizer, TurnstileService } from "@/lib/security";
import { createContactEmailService } from "@/lib/email";

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

    // Get user information
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const referer = request.headers.get("referer") || "Direct";

    // Send contact email using service
    const emailService = createContactEmailService();
    const emailResult = await emailService.sendEmail({
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      ip,
      userAgent,
      referer,
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
