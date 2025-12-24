"use client";
import { AlertTriangle } from "lucide-react";

export default function ErrorPageContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="mb-6 p-4 bg-muted rounded-full">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-4">
        An unexpected error occurred. Please try again later or contact support if the issue persists.
      </p>
    </div>
  );
}
