"use client";

import { useEffect } from "react";
import ErrorPageContent from "./error/ErrorPageContent";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <ErrorPageContent 
      statusCode={500} 
      error={error}
      reset={reset}
    />
  );
}
