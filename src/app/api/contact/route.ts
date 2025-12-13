import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/lib/validation";
import { Sanitizer, TurnstileService } from "@/lib/security";
import { generateContactFormEmail } from "@/lib/email";

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

    // Get user information
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const referer = request.headers.get("referer") || "Direct";
    const submittedAt = new Date();

    // Fetch IP information (optional - won't block if fails)
    let ipInfo = {
      country: "Unknown",
      region: "Unknown", 
      city: "Unknown",
      timezone: "Unknown",
      org: "Unknown",
      postal: "Unknown",
    };

    try {
      // Use ipinfo.io for IP geolocation (free tier: 50k requests/month)
      const token = process.env.IPINFO_TOKEN || ''; // Optional: add token for higher limits
      const ipResponse = await fetch(
        `https://ipinfo.io/${ip}/json${token ? `?token=${token}` : ''}`,
        {
          headers: { 'Accept': 'application/json' },
        }
      );
      if (ipResponse.ok) {
        const data = await ipResponse.json();
        ipInfo = {
          country: data.country || "Unknown",
          region: data.region || "Unknown",
          city: data.city || "Unknown",
          timezone: data.timezone || "Unknown",
          org: data.org || "Unknown",
          postal: data.postal || "Unknown",
        };
      }
    } catch (error) {
      console.log("[API] IP lookup failed (non-critical):", error);
    }

    // Format submission time in IST with UTC reference
    const submittedAtIST = submittedAt.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'long'
    });
    const submittedAtUTC = submittedAt.toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'full',
      timeStyle: 'long'
    });

    // Format location string
    const location = `${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}${ipInfo.postal !== 'Unknown' ? ` (${ipInfo.postal})` : ''}`;

    // Generate email HTML
    const emailHtml = generateContactFormEmail({
      senderName: sanitizedName,
      senderEmail: sanitizedEmail,
      message: sanitizedMessage,
      metadata: {
        ip,
        location,
        timezone: ipInfo.timezone,
        org: ipInfo.org,
        submittedAtIST,
        submittedAtUTC,
        userAgent,
        referrer: referer,
      },
    });

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "",
      to: recipientEmail,
      replyTo: sanitizedEmail,
      subject: `New Contact Form Submission from ${sanitizedName}`,
      html: emailHtml,
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
