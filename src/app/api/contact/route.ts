import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";
import { escapeEmail, escapeHtml } from "@/lib/escape";
import { createContactEmailService } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Get client IP address
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const sanitizedData = {
      name: escapeHtml(name),
      email: escapeEmail(email),
      message: escapeHtml(message),
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
