import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BlogPostNavigationProps {
  previousPost?: {
    slug: string;
    title: string;
  } | null;
  nextPost?: {
    slug: string;
    title: string;
  } | null;
}

export function BlogPostNavigation({
  previousPost,
  nextPost,
}: BlogPostNavigationProps) {
  return (
    <nav className="mt-12 space-y-6">
      <Separator />
      
      <div className="flex items-center justify-between gap-0">
        {/* Previous Post Button */}
        {previousPost ? (
          <Link href={`/blog/${previousPost.slug}`} className="flex-1">
            <Button
              variant="outline"
              className="group h-14 w-full rounded-r-none border-r-0 border-y-0 bg-linear-to-r from-muted to-background text-base font-semibold"
            >
              <ChevronLeft className="size-6 transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
          </Link>
        ) : (
          <Button variant="outline" className="h-14 flex-1 rounded-r-none border-r-0 border-y-0 bg-linear-to-r from-muted to-background text-base font-semibold" disabled>
            <ChevronLeft className="size-6" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
        )}

        {/* All Blogs Button */}
        <Link href="/blog">
          <Button variant="ghost" className="h-14 rounded-none border-x-0 border-y-0 text-base transition-all hover:bg-linear-to-r hover:from-transparent hover:via-white hover:to-transparent dark:hover:via-background">
            All Blogs
          </Button>
        </Link>

        {/* Next Post Button */}
        {nextPost ? (
          <Link href={`/blog/${nextPost.slug}`} className="flex-1">
            <Button
              variant="outline"
              className="group h-14 w-full rounded-l-none border-l-0 border-y-0 bg-linear-to-l from-muted to-background text-base font-semibold"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="size-6 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" className="h-14 flex-1 rounded-l-none border-l-0 border-y-0 bg-linear-to-l from-muted to-background text-base font-semibold" disabled>
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-6" />
          </Button>
        )}
      </div>
    </nav>
  );
}
