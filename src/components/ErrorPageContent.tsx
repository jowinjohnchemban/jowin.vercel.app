"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  ArrowLeft, 
  FileQuestion, 
  AlertTriangle, 
  RefreshCcw,
  ShieldAlert,
  Lock,
  Ban,
  ServerCrash,
  Clock,
  XCircle
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { LucideIcon } from "lucide-react";

interface ErrorInfo {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "primary" | "destructive" | "warning" | "muted";
  suggestions: string[];
}

interface ErrorPageContentProps {
  statusCode: number;
  error?: Error & { digest?: string };
  reset?: () => void;
}

const ERROR_CONFIGS: Record<number, ErrorInfo> = {
  // 4xx Client Errors
  400: {
    title: "Bad Request",
    description: "The request could not be understood by the server. Please check your input and try again.",
    icon: XCircle,
    color: "destructive",
    suggestions: ["Check the URL", "Verify your input", "Try refreshing the page"],
  },
  401: {
    title: "Unauthorized",
    description: "You need to be authenticated to access this resource. Please sign in and try again.",
    icon: Lock,
    color: "warning",
    suggestions: ["Sign in to your account", "Check your credentials", "Request access"],
  },
  403: {
    title: "Forbidden",
    description: "You don't have permission to access this resource. Contact support if you believe this is an error.",
    icon: ShieldAlert,
    color: "destructive",
    suggestions: ["Check your permissions", "Contact support", "Go to homepage"],
  },
  404: {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been moved. Let's get you back on track.",
    icon: FileQuestion,
    color: "primary",
    suggestions: ["Check the URL for typos", "Go to homepage", "Browse the blog"],
  },
  408: {
    title: "Request Timeout",
    description: "The request took too long to process. Please try again.",
    icon: Clock,
    color: "warning",
    suggestions: ["Try again", "Check your connection", "Refresh the page"],
  },
  429: {
    title: "Too Many Requests",
    description: "You've made too many requests in a short time. Please wait a moment and try again.",
    icon: Ban,
    color: "warning",
    suggestions: ["Wait a few moments", "Reduce request frequency", "Try again later"],
  },
  
  // 5xx Server Errors
  500: {
    title: "Internal Server Error",
    description: "We encountered an unexpected error. This has been logged and we'll look into it.",
    icon: AlertTriangle,
    color: "destructive",
    suggestions: ["Try again", "Go to homepage", "Contact support if issue persists"],
  },
  502: {
    title: "Bad Gateway",
    description: "The server received an invalid response. This is usually temporary.",
    icon: ServerCrash,
    color: "destructive",
    suggestions: ["Refresh the page", "Try again in a moment", "Contact support"],
  },
  503: {
    title: "Service Unavailable",
    description: "The service is temporarily unavailable. We're working to restore it.",
    icon: ServerCrash,
    color: "destructive",
    suggestions: ["Try again later", "Check our status page", "Contact support"],
  },
  504: {
    title: "Gateway Timeout",
    description: "The server didn't respond in time. Please try again.",
    icon: Clock,
    color: "destructive",
    suggestions: ["Refresh the page", "Try again", "Check back later"],
  },
};

const DEFAULT_ERROR: ErrorInfo = {
  title: "Something Went Wrong",
  description: "An unexpected error occurred. Please try again or contact support if the issue persists.",
  icon: AlertTriangle,
  color: "destructive",
  suggestions: ["Try again", "Go to homepage", "Contact support"],
};

export function ErrorPageContent({ statusCode, error, reset }: ErrorPageContentProps) {
  const config = ERROR_CONFIGS[statusCode] || DEFAULT_ERROR;
  const Icon = config.icon;
  
  const isServerError = statusCode >= 500;
  const isClientError = statusCode >= 400 && statusCode < 500;

  const getColorClasses = () => {
    switch (config.color) {
      case "primary":
        return {
          bg: "bg-primary/10",
          text: "text-primary",
          code: "text-primary",
        };
      case "destructive":
        return {
          bg: "bg-destructive/10",
          text: "text-destructive",
          code: "text-destructive",
        };
      case "warning":
        return {
          bg: "bg-yellow-500/10",
          text: "text-yellow-600 dark:text-yellow-500",
          code: "text-yellow-600 dark:text-yellow-500",
        };
      default:
        return {
          bg: "bg-muted",
          text: "text-muted-foreground",
          code: "text-foreground",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`rounded-full ${colors.bg} p-8`}>
              <Icon className={`h-24 w-24 ${colors.text}`} />
            </div>
          </div>

          {/* Error Code */}
          <div className="space-y-2">
            <h1 className={`text-8xl font-bold ${colors.code}`}>
              {statusCode}
            </h1>
            <h2 className="text-3xl font-semibold">{config.title}</h2>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {config.description}
            </p>

            {/* Development Error Details */}
            {process.env.NODE_ENV === "development" && error?.message && (
              <details className="text-left bg-muted p-4 rounded-lg max-w-lg mx-auto">
                <summary className="cursor-pointer font-semibold text-sm mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs overflow-auto text-destructive whitespace-pre-wrap">
                  {error.message}
                </pre>
                {error.stack && (
                  <pre className="text-xs overflow-auto text-muted-foreground mt-2 whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                )}
                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Digest: {error.digest}
                  </p>
                )}
              </details>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {reset && isServerError && (
              <Button size="lg" onClick={reset}>
                <RefreshCcw className="h-5 w-5" />
                Try Again
              </Button>
            )}

            <Button size="lg" variant={reset ? "outline" : "default"} asChild>
              <Link href="/">
                <Home className="h-5 w-5" />
                Go Home
              </Link>
            </Button>

            {isClientError && (
              <Button size="lg" variant="outline" asChild>
                <Link href="/blog">
                  <ArrowLeft className="h-5 w-5" />
                  View Blog
                </Link>
              </Button>
            )}
          </div>

          {/* Suggestions */}
          {config.suggestions.length > 0 && (
            <div className="pt-8 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                What you can try:
              </p>
              <ul className="text-sm space-y-2 max-w-md mx-auto">
                {config.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-muted-foreground">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Helpful Links */}
          <div className="pt-4">
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="text-sm text-primary hover:underline"
              >
                Home
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/blog"
                className="text-sm text-primary hover:underline"
              >
                Blog
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/contact"
                className="text-sm text-primary hover:underline"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
