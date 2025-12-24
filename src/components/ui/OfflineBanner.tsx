"use client";
import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 w-full z-50 flex items-center justify-center gap-2 bg-destructive text-destructive-foreground text-sm py-1 shadow-md animate-in fade-in slide-in-from-top duration-300"
      )}
      role="status"
      aria-live="polite"
    >
      <WifiOff className="w-4 h-4 mr-1" />
      You are offline. Showing cached content.
    </div>
  );
}
