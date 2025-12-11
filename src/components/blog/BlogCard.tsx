import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: {
    url?: string;
  };
  publishedAt: string;
  readTimeInMinutes: number;
  author: {
    name: string;
    profilePicture?: string;
  };
  forceHorizontal?: boolean;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  coverImage,
  publishedAt,
  readTimeInMinutes,
  author,
  forceHorizontal = false,
}: BlogCardProps) {
  const publishedDate = new Date(publishedAt);
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${slug}`} className="group h-full">
      <Card className="h-full overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer border-border/50 p-0">
        {/* Mobile: Horizontal Layout */}
        <div className={forceHorizontal ? "flex h-full" : "flex md:hidden h-full"}>
          {/* Thumbnail - Full Height */}
          {coverImage?.url ? (
            <div className="relative w-28 shrink-0 overflow-hidden bg-muted">
              <Image
                src={coverImage.url}
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="112px"
              />
            </div>
          ) : (
            <div className="w-28 shrink-0 bg-muted flex items-center justify-center">
              <span className="text-4xl text-muted-foreground">📝</span>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 flex flex-col p-4 min-w-0">
            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-base font-bold leading-tight mb-2">
              {title}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm leading-relaxed mb-3 flex-1">
              {excerpt}
            </CardDescription>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{readTimeInMinutes} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: Vertical Layout */}
        <div className={forceHorizontal ? "hidden" : "hidden md:flex md:flex-col"}>
          {/* Cover Image */}
          {coverImage?.url && (
            <div className="relative w-full h-48 md:h-52 overflow-hidden bg-muted rounded-t-xl">
              <Image
                src={coverImage.url}
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
            </div>
          )}

          <CardHeader className="grow pb-3 pt-6">
            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-lg sm:text-xl font-bold leading-tight">
              {title}
            </CardTitle>
            <CardDescription className="line-clamp-3 mt-2 text-sm sm:text-base leading-relaxed">
              {excerpt}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0 pb-5">
            <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground border-t border-border/40 pt-4">
              <div className="flex items-center gap-2">
                {author.profilePicture ? (
                  <Image
                    src={author.profilePicture}
                    alt={author.name}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                    {author.name.charAt(0)}
                  </div>
                )}
                <span className="font-medium truncate max-w-[120px]">{author.name}</span>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{readTimeInMinutes} min</span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
