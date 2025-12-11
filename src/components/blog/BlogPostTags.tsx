/**
 * Blog Post Tags Component
 * Displays post tags as clickable badges
 * @module components/blog/BlogPostTags
 */

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Tag {
  name: string;
  slug?: string;
}

interface BlogPostTagsProps {
  tags?: Tag[];
}

export function BlogPostTags({ tags }: BlogPostTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.name}
          href={`/blog/tag/${tag.slug || tag.name.toLowerCase()}`}
        >
          <Badge variant="secondary" className="hover:bg-secondary/80">
            #{tag.name}
          </Badge>
        </Link>
      ))}
    </div>
  );
}
