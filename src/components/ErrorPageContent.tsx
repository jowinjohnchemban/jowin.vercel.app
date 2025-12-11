"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Home, 
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
import type { LucideIcon } from "lucide-react";

interface ErrorInfo {
  title: string;
  description: string;
  icon: LucideIcon;
  color: "primary" | "destructive" | "warning" | "muted";
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
    description: "Invalid request. Please check and try again.",
    icon: XCircle,
    color: "destructive",
  },
  401: {
    title: "Unauthorized",
    description: "Authentication required to access this page.",
    icon: Lock,
    color: "warning",
  },
  403: {
    title: "Forbidden",
    description: "You don't have permission to access this resource.",
    icon: ShieldAlert,
    color: "destructive",
  },
  404: {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist.",
    icon: FileQuestion,
    color: "primary",
  },
  408: {
    title: "Request Timeout",
    description: "Request took too long. Please try again.",
    icon: Clock,
    color: "warning",
  },
  429: {
    title: "Too Many Requests",
    description: "Please wait a moment and try again.",
    icon: Ban,
    color: "warning",
  },
  
  // 5xx Server Errors
  500: {
    title: "Server Error",
    description: "Something went wrong. We're working on it.",
    icon: AlertTriangle,
    color: "destructive",
  },
  502: {
    title: "Bad Gateway",
    description: "Server issue. Usually temporary.",
    icon: ServerCrash,
    color: "destructive",
  },
  503: {
    title: "Service Unavailable",
    description: "Service temporarily down. Please try later.",
    icon: ServerCrash,
    color: "destructive",
  },
  504: {
    title: "Gateway Timeout",
    description: "Server didn't respond in time.",
    icon: Clock,
    color: "destructive",
  },
};

const DEFAULT_ERROR: ErrorInfo = {
  title: "Error",
  description: "An unexpected error occurred.",
  icon: AlertTriangle,
  color: "destructive",
};

export function ErrorPageContent({ statusCode, error, reset }: ErrorPageContentProps) {
  const config = ERROR_CONFIGS[statusCode] || DEFAULT_ERROR;
  const Icon = config.icon;
  
  const isServerError = statusCode >= 500;

  const getColorClasses = () => {
    switch (config.color) {
      case "primary":
        return {
          bg: "bg-primary/10",
          text: "text-primary",
        };
      case "destructive":
        return {
          bg: "bg-destructive/10",
          text: "text-destructive",
        };
      case "warning":
        return {
          bg: "bg-yellow-500/10",
          text: "text-yellow-600 dark:text-yellow-500",
        };
      default:
        return {
          bg: "bg-muted",
          text: "text-muted-foreground",
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`rounded-full ${colors.bg} p-6`}>
              <Icon className={`h-16 w-16 sm:h-20 sm:w-20 ${colors.text}`} />
            </div>
          </div>

          {/* Error Code & Title */}
          <div className="space-y-2">
            <h1 className={`text-6xl sm:text-7xl font-bold ${colors.text}`}>
              {statusCode}
            </h1>
            <h2 className="text-xl sm:text-2xl font-semibold">{config.title}</h2>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-muted-foreground">
            {config.description}
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
            {reset && isServerError && (
              <Button onClick={reset} className="w-full sm:w-auto">
                <RefreshCcw className="h-4 w-4" />
                Try Again
              </Button>
            )}

            <Button variant={reset ? "outline" : "default"} asChild className="w-full sm:w-auto">
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-4">
            <div className="flex flex-wrap justify-center gap-2 text-xs sm:text-sm">
              <Link href="/connect" className="text-primary hover:underline">
                Let&apos;s Connect
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
