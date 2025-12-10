import { getBlogPostBySlug, getBlogPosts } from "@/lib/hashnode";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }
  return {
    title: `${post.title} - Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage?.url ? [post.coverImage.url] : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts(20);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = new Date(post.publishedAt);
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-b from-background via-background to-muted/10">
        {/* Back Button */}
        <div className="sticky top-0 z-10 backdrop-blur-md bg-background/75 border-b border-border/40">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/blog">
              <Button variant="ghost" className="gap-2 pl-0 h-8 hover:bg-transparent hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Blog</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Section with Cover Image */}
        {post.coverImage?.url && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden bg-muted">
            <Image
              src={post.coverImage.url}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background/80" />
          </div>
        )}

        {/* Article Content */}
        <article className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          {/* Title and Meta */}
          <div className="space-y-6 sm:space-y-8 mb-12 pb-8 sm:pb-10 border-b border-border/40">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight\">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed\">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Author and Meta Info */}
            <div className="flex flex-col gap-4 sm:gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-4 sm:gap-6">
                {post.author?.photo?.url ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                    <Image src={post.author.photo.url} alt={post.author.name} width={40} height={40} className="object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground">{post.author.name?.charAt(0)}</div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{post.author.name}</div>
                  <div className="text-xs text-border">{formattedDate} • {post.readTimeInMinutes} min read</div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 6).map((t) => (
                      <span key={t.name} className="text-xs px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">#{t.name}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Article Body */}
          {post.content?.html && post.content.html.trim().length > 0 ? (
            <div
              className="prose prose-sm sm:prose-base lg:prose-lg max-w-none
              dark:prose-invert prose-base
              prose-headings:font-bold prose-headings:mt-8 sm:prose-headings:mt-10 prose-headings:mb-4 sm:prose-headings:mb-6 prose-headings:tracking-tight
              prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6
              prose-h2:text-xl sm:prose-h2:text-2xl
              prose-h3:text-lg sm:prose-h3:text-xl
              prose-h4:text-base sm:prose-h4:text-lg
              prose-p:mb-6 sm:prose-p:mb-8 prose-p:leading-7 sm:prose-p:leading-8 prose-p:text-foreground
              prose-strong:font-bold prose-strong:text-foreground
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:transition-colors
              prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-muted prose-pre:border prose-pre:border-border/50 prose-pre:p-4 sm:prose-pre:p-6 prose-pre:rounded prose-pre:overflow-x-auto prose-pre:text-sm
              prose-img:rounded-lg prose-img:my-8 prose-img:border prose-img:border-border/20
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 sm:prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:my-6
              prose-ul:my-6 prose-ul:ml-4 sm:prose-ul:ml-6
              prose-ol:my-6 prose-ol:ml-4 sm:prose-ol:ml-6
              prose-li:mb-2 sm:prose-li:mb-3 prose-li:text-foreground
              prose-table:my-8 prose-table:border-collapse prose-table:w-full prose-table:overflow-x-auto
              prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:border prose-th:border-border/20
              prose-td:border prose-td:border-border/20 prose-td:p-3
              prose-hr:my-8 prose-hr:border-border/30
              "
              dangerouslySetInnerHTML={{ __html: post.content.html }}
            />
          ) : (
            <div className="text-center py-16 sm:py-20">
              <p className="text-muted-foreground mb-4 sm:mb-6">
                Content not available. View the full article on Hashnode.
              </p>
              <a
                href={`https://hashnode.jowinjc.in/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                Read on Hashnode →
              </a>
            </div>
          )}

          {/* Footer Section */}
          <div className="mt-16 sm:mt-20 border-t border-border/40 pt-8 sm:pt-12 space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm text-muted-foreground">
                Published on <span className="font-medium text-foreground">{formattedDate}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                By <span className="font-medium text-foreground">{post.author.name}</span>
              </p>
            </div>

            {/* Back to Blog Button */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/blog">
                <Button variant="outline" className="w-full sm:w-auto">
                  ← Back to All Articles
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
