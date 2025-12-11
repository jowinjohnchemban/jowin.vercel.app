/**
 * Blog Post Header Component
 * Displays post title and metadata
 * @module components/blog/BlogPostHeader
 */

"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Share2, Check } from "lucide-react";
import { useState } from "react";

interface BlogPostHeaderProps {
  title: string;
  publishedAt: string;
  readTimeInMinutes: number;
  authorName: string;
  slug: string;
}

export function BlogPostHeader({ 
  title, 
  publishedAt, 
  readTimeInMinutes,
  authorName,
  slug
}: BlogPostHeaderProps) {
  const [shared, setShared] = useState(false);
  
  const publishedDate = new Date(publishedAt);
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleShare = async () => {
    const url = `${window.location.origin}/blog/${slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (error) {
        // User cancelled share or error occurred
        if ((error as Error).name !== 'AbortError') {
          await copyToClipboard(url);
        }
      }
    } else {
      await copyToClipboard(url);
    }
  };

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold leading-tight tracking-tight">
        {title}
      </h1>
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={publishedAt}>{formattedDate}</time>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{readTimeInMinutes} min read</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <span>{authorName}</span>
          <Separator orientation="vertical" className="h-4" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-auto p-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
            title={shared ? "Link copied!" : "Share this post"}
          >
            {shared ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
