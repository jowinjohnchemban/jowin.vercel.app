"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { z } from "zod";
import { contactFormSchema } from "@/lib/validation";
import { Sanitizer } from "@/lib/security";

interface ContactFormProps {
  readonly title?: string;
  readonly description?: string;
  readonly showCard?: boolean;
}

type FormStatus = "idle" | "loading" | "success" | "error";

export function ContactForm({ 
  title = "Let's Connect",
  description = "Have a question or want to discuss something? Send me a message!",
  showCard = true 
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const sanitizeInput = (input: string): string => {
    // Use the Sanitizer class for consistency
    return Sanitizer.sanitizeHTML(input);
  };

  const validateForm = (): string | null => {
    try {
      // Validate with Zod schema, but count all characters (including HTML tags)
      contactFormSchema.parse({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues[0].message;
        return errorMessage;
      }
      return "Validation failed";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error messages when user starts typing
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setStatus("error");
      setErrorMessage(validationError);
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 5000);
      return;
    }

    try {
      // Sanitize all inputs before sending
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        message: sanitizeInput(formData.message),
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage("");
      }, 5000);
    }
  };

  const formContent = (
    <>
      {title && (
        <CardHeader className={showCard ? "pb-4" : "px-0 pt-0 pb-4"}>
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-sm sm:text-base">{description}</CardDescription>
          )}
        </CardHeader>
      )}

      <CardContent className={showCard ? "pt-0" : "px-0 pb-0"}>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Name <span className="text-destructive">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              disabled={status === "loading"}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              disabled={status === "loading"}
            />
          </div>

          {/* Message Field */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="text-sm font-medium text-foreground">
              Message <span className="text-destructive">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Message me your thoughts..."
              rows={5}
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-y"
              disabled={status === "loading"}
            />
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="flex items-start gap-2 p-3 sm:p-4 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium">
                Message sent successfully! I&apos;ll get back to you soon.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-start gap-2 p-3 sm:p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-medium">
                {errorMessage || "Failed to send message. Please try again."}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full text-sm sm:text-base"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </>
  );

  if (!showCard) {
    return formContent;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      {formContent}
    </Card>
  );
}
