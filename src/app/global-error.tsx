"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home, MessageCircle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [countdown, setCountdown] = useState(10);
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  // Auto-redirect after 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-6">
                <AlertTriangle className="h-16 w-16 sm:h-20 sm:w-20 text-destructive" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-6xl sm:text-7xl font-bold text-destructive">
                Error
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold">
                Application Error
              </h2>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground">
              A critical error occurred. Please refresh the page or try again later.
            </p>

            {/* Development Error Details */}
            {process.env.NODE_ENV === "development" && error?.message && (
              <details className="text-left bg-muted p-3 rounded-lg text-xs">
                <summary className="cursor-pointer font-semibold mb-2">
                  Error Details
                </summary>
                <pre className="overflow-auto text-destructive whitespace-pre-wrap">
                  {error.message}
                </pre>
                {error.digest && (
                  <p className="text-muted-foreground mt-2">
                    Digest: {error.digest}
                  </p>
                )}
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button onClick={reset} className="w-full sm:w-auto">
                <RefreshCcw className="h-4 w-4" />
                Try Again
              </Button>

              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>

            {/* Connect Button */}
            <div className="pt-2">
              <Button variant="secondary" asChild className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 group relative">
                <Link href="/connect">
                  <MessageCircle className="h-4 w-4" />
                  Let&apos;s Connect
                  <span className="absolute bottom-2 left-4 right-4 h-px bg-border scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              </Button>
            </div>

            {/* Auto-redirect countdown */}
            <p className="text-xs text-muted-foreground pt-2">
              Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
