"use client";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

interface ErrorPageContentProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
}

export default function ErrorPageContent({
  title = "Page Not Found",
  message = "The page you're looking for doesn't exist or has been moved.",
  showHomeButton = true
}: ErrorPageContentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="mb-6 p-4 bg-muted rounded-full">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        {message}
      </p>
      {showHomeButton && (
        <div className="flex gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}
