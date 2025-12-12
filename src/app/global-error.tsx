"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          fontFamily: "system-ui, sans-serif",
        }}>
          <div style={{
            maxWidth: "600px",
            textAlign: "center",
          }}>
            <h1 style={{
              fontSize: "6rem",
              fontWeight: 700,
              color: "#ef4444",
              margin: 0,
            }}>
              Error
            </h1>
            <h2 style={{
              fontSize: "2rem",
              fontWeight: 600,
              marginTop: "1rem",
            }}>
              Application Error
            </h2>
            <p style={{
              fontSize: "1.125rem",
              color: "#6b7280",
              marginTop: "1rem",
            }}>
              A critical error occurred. Please refresh the page or try again later.
            </p>
            <div style={{
              marginTop: "2rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}>
              <button
                onClick={reset}
                style={{
                  padding: "0.75rem 2rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
              <Link
                href="/"
                style={{
                  padding: "0.75rem 2rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Go Home
              </Link>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <Link
                href="/connect"
                style={{
                  padding: "0.75rem 2rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Let&apos;s Connect
              </Link>
            </div>
            <p style={{
              fontSize: "0.875rem",
              color: "#9ca3af",
              marginTop: "1.5rem",
            }}>
              Redirecting to home in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
