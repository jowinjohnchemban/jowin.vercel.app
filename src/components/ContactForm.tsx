"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { z } from "zod";
import { contactFormSchema } from "@/lib/validation";
import { Sanitizer } from "@/lib/security";

// TypeScript declarations for Cloudflare Turnstile
declare global {
  interface Window {
    turnstile?: {
      reset: (widgetId?: string) => void;
      render: (element: HTMLElement, options: {
        sitekey: string;
        callback?: string | ((token: string) => void);
        'error-callback'?: string | (() => void);
        'expired-callback'?: string | (() => void);
        theme?: string;
        size?: string;
        appearance?: string;
      }) => string;
      remove: (widgetId: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
      isExpired: (widgetId?: string) => boolean;
    };
    onTurnstileLoad?: () => void;
  }
}

interface ContactFormProps {
  title?: string;
  description?: string;
  showCard?: boolean;
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
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [captchaError, setCaptchaError] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Load Cloudflare Turnstile script and render widget
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    
    if (!siteKey) {
      console.error('[ContactForm] NEXT_PUBLIC_TURNSTILE_SITE_KEY is not configured');
      setCaptchaError(true);
      return;
    }

    console.log('[ContactForm] Initializing Turnstile', {
      siteKey: siteKey.substring(0, 10) + '...',
      isDevelopment,
      host: typeof window !== 'undefined' ? window.location.hostname : 'unknown'
    });

    // Define global callback for explicit rendering
    window.onTurnstileLoad = () => {
      console.log('[ContactForm] Turnstile API loaded successfully');
      
      if (turnstileRef.current && window.turnstile && !turnstileWidgetId.current) {
        console.log('[ContactForm] Attempting to render Turnstile widget...');
        try {
          turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
            sitekey: siteKey,
            theme: 'dark',
            size: 'normal',
            callback: (token: string) => {
              console.log('[ContactForm] ✓ Turnstile success - token received');
              setCaptchaToken(token);
              setCaptchaError(false);
            },
            'error-callback': (errorCode?: string) => {
              console.error('[ContactForm] ✗ Turnstile error:', errorCode || 'unknown');
              setCaptchaToken("");
              setCaptchaError(true);
              
              if (isDevelopment) {
                console.warn('[ContactForm] Development mode: Captcha errors will be logged but may be bypassed');
              }
            },
            'expired-callback': () => {
              console.warn('[ContactForm] ⚠ Turnstile token expired - user needs to solve again');
              setCaptchaToken("");
            },
          });
          console.log('[ContactForm] ✓ Widget rendered successfully with ID:', turnstileWidgetId.current);
        } catch (error) {
          console.error('[ContactForm] ✗ Failed to render Turnstile widget:', error);
          setCaptchaError(true);
        }
      } else {
        console.warn('[ContactForm] Cannot render widget:', {
          hasContainer: !!turnstileRef.current,
          hasTurnstileAPI: !!window.turnstile,
          alreadyRendered: !!turnstileWidgetId.current
        });
      }
    };

    // Add script with explicit rendering and onload callback
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad";
    script.async = true;
    script.defer = true;
    
    script.onerror = (error) => {
      console.error('[ContactForm] ✗ Failed to load Turnstile script:', error);
      setCaptchaError(true);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      delete window.onTurnstileLoad;
    };
  }, [isDevelopment]);

  const sanitizeInput = (input: string): string => {
    // Use the Sanitizer class for consistency
    return Sanitizer.sanitizeHTML(input);
  };

  const validateForm = (): string | null => {
    try {
      // Sanitize inputs first
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        message: sanitizeInput(formData.message),
        captchaToken,
      };

      console.log('[ContactForm] Validating data:', { 
        ...sanitizedData, 
        captchaToken: captchaToken ? 'present' : 'missing',
        captchaError,
        isDevelopment
      });

      // Validate with Zod schema
      contactFormSchema.parse(sanitizedData);
      console.log('[ContactForm] Validation passed');
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues[0].message;
        console.error('[ContactForm] Validation error:', errorMessage);
        
        // Show helpful message if captcha failed
        if (errorMessage.includes('captcha') && captchaError) {
          if (isDevelopment) {
            return 'Captcha failed to load. For local development, add "localhost" to your Cloudflare Turnstile domain whitelist, or use a test sitekey: 1x00000000000000000000AA';
          }
          return 'Captcha verification failed. Please refresh the page and try again.';
        }
        
        return errorMessage;
      }
      console.error('[ContactForm] Unknown validation error:', error);
      return "Validation failed";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    console.log('[ContactForm] Submit started');

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      console.error('[ContactForm] Validation failed, not sending to API');
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
        captchaToken,
      };

      console.log('[ContactForm] Sending to API:', { 
        ...sanitizedData, 
        captchaToken: captchaToken ? 'present' : 'missing' 
      });

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
      setCaptchaToken("");
      
      // Reset Turnstile widget
      if (window.turnstile && turnstileWidgetId.current) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
      
      // Reset captcha on error
      if (window.turnstile && turnstileWidgetId.current) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
      setCaptchaToken("");
      
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
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              disabled={status === "loading"}
            />
          </div>

          {/* Cloudflare Turnstile */}
          <div>
            <div ref={turnstileRef} />
            {captchaError && isDevelopment && (
              <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2">
                ⚠️ Captcha error in development. Add <code className="px-1 py-0.5 bg-muted rounded">localhost</code> to Cloudflare dashboard or use test key: <code className="px-1 py-0.5 bg-muted rounded">1x00000000000000000000AA</code>
              </p>
            )}
            {captchaError && !isDevelopment && (
              <p className="text-xs text-destructive mt-2">
                ⚠️ Captcha failed to load. Please refresh the page.
              </p>
            )}
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
