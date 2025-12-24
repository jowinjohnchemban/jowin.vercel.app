"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function OfflineActions() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleRefresh} className="w-full">
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
      <Link href="/">
        <Button variant="outline" className="w-full">
          <Home className="h-4 w-4 mr-2" />
          Go Home
        </Button>
      </Link>
    </div>
  );
}
