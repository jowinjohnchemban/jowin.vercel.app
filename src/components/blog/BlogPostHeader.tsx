/**
 * Blog Post Header Component
 * Displays post title and metadata
 * @module components/blog/BlogPostHeader
 */

import { Separator } from "@/components/ui/separator";
import { Calendar, Clock } from "lucide-react";

interface BlogPostHeaderProps {
  title: string;
  publishedAt: string;
  readTimeInMinutes: number;
}

export function BlogPostHeader({ 
  title, 
  publishedAt, 
  readTimeInMinutes 
}: BlogPostHeaderProps) {
  const publishedDate = new Date(publishedAt);
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold leading-tight tracking-tight">
        {title}
      </h1>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <time dateTime={publishedAt}>{formattedDate}</time>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{readTimeInMinutes} min read</span>
        </div>
      </div>
    </div>
  );
}
