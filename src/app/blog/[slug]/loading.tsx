import { Separator } from "@/components/ui/separator";

/**
 * Loading skeleton for blog post page
 */
export default function Loading() {
  return (
    <article className="container mx-auto px-4 py-8 animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="aspect-video w-full bg-muted rounded-lg mb-8" />

      {/* Header Skeleton */}
      <header className="mb-8">
        <div className="h-10 bg-muted rounded mb-4 w-3/4" />
        <div className="h-6 bg-muted rounded mb-6 w-1/2" />
        
        {/* Tags Skeleton */}
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-6 w-20 bg-muted rounded-full" />
          ))}
        </div>

        {/* Meta Skeleton */}
        <div className="flex items-center gap-4 text-sm">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
      </header>

      <Separator className="mb-8" />

      {/* Content Skeleton */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-11/12" />
              <div className="h-4 bg-muted rounded w-10/12" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
