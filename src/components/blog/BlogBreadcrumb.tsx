"use client";

import Link from "next/link";
import { ChevronRight, Copy, Check } from "lucide-react";
import { useState } from "react";

interface BlogBreadcrumbProps {
  currentTitle: string;
  currentSlug: string;
}

export function BlogBreadcrumb({ currentTitle, currentSlug }: BlogBreadcrumbProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/blog/${currentSlug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
      <Link 
        href="/blog" 
        className="transition-colors hover:text-foreground"
      >
        Blogs
      </Link>
      <ChevronRight className="size-4" />
      <button
        onClick={handleCopyLink}
        className="group flex items-center gap-1.5 line-clamp-1 transition-colors hover:text-foreground"
        title="Click to copy link"
      >
        <span className="line-clamp-1">{currentTitle}</span>
        {copied ? (
          <Check className="size-3.5 text-green-500" />
        ) : (
          <Copy className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </button>
    </nav>
  );
}
