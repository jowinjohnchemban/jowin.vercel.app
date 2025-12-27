"use client";
import { WifiOff, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [show, setShow] = useState(false);

  // Robust connectivity check: ping a local resource
  useEffect(() => {
    let isUnmounted = false;

    const checkOnline = async () => {
      if (!navigator.onLine) {
        if (!isUnmounted) {
          setOffline(true);
          setShow(true);
        }
        return;
      }
      try {
        const res = await fetch("/favicon.ico", { method: "HEAD", cache: "no-store" });
        if (res.ok) {
          if (!isUnmounted) setOffline(false);
        } else {
          if (!isUnmounted) {
            setOffline(true);
            setShow(true);
          }
        }
      } catch {
        if (!isUnmounted) {
          setOffline(true);
          setShow(true);
        }
      }
    };

    const handleOnline = () => checkOnline();
    const handleOffline = () => {
      setOffline(true);
      setShow(true);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    checkOnline();
    const interval = setInterval(checkOnline, 10000);

    return () => {
      isUnmounted = true;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!offline && show) {
      // Hide toast after 2s online
      const timer = setTimeout(() => setShow(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [offline, show]);



  if (!show) return null;

  const banner = (
    <div
      className={cn(
        "mx-auto mt-0 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-2xl bg-white/10 dark:bg-black/10 shadow-2xl text-foreground text-sm font-medium w-fit animate-in fade-in slide-in-from-top duration-300",
        offline ? "text-gray-400" : "text-green-400"
      )}
      role="status"
      aria-live="polite"
    >
      {offline ? <WifiOff className="w-4 h-4 mr-1" /> : <Wifi className="w-4 h-4 mr-1" />}
      {offline ? "You are offline. Showing cached content." : "You are back online."}
    </div>
  );

  // Render below navbar using portal
  const portalTarget = typeof window !== "undefined" ? document.getElementById("banner-portal") : null;
  return portalTarget ? createPortal(banner, portalTarget) : null;
}
