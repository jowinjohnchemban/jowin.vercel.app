"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

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
          </div>
        </div>
      </body>
    </html>
  );
}
