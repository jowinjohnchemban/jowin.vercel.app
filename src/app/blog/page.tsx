import { getBlogPosts } from "@/lib/hashnode";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, Clock } from "lucide-react";

export const metadata = {
  title: "Blog - Jowin John Chemban",
  description: "Technical articles on DevOps, cloud infrastructure, and web development",
};

export default async function BlogPage() {
  const posts = await getBlogPosts(20);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-b from-background to-muted/20">
        {/* Header Section */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-28">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Blog</h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">
              Technical articles on DevOps, cloud infrastructure, web development, and engineering insights.
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts found. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:gap-6 md:gap-7 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group h-full">
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer border-border/50">
                    {/* Cover Image Container */}
                    {post.coverImage?.url && (
                      <div className="relative w-full h-44 sm:h-48 md:h-52 overflow-hidden bg-muted">
                        <Image
                          src={post.coverImage.url}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}

                    <CardHeader className="pb-2 sm:pb-3 pt-4 sm:pt-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {post.author?.photo?.url ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0">
                              <Image
                                src={post.author.photo.url}
                                alt={post.author.name}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                              {post.author.name?.charAt(0) ?? "?"}
                            </div>
                          )}
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            <div className="font-medium text-foreground">{post.author.name}</div>
                            <div className="text-[11px] text-border">{new Date(post.publishedAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground hidden sm:block">
                          <div>{post.readTimeInMinutes} min read</div>
                        </div>
                      </div>

                      <CardTitle className="line-clamp-2 text-lg sm:text-xl md:text-lg lg:text-xl leading-tight group-hover:text-primary transition-colors mt-3">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-2 text-xs sm:text-sm text-muted-foreground">
                        {post.excerpt}
                      </CardDescription>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {post.tags.slice(0, 5).map((tag) => (
                            <span key={tag.name} className="text-[11px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col justify-between px-4 sm:px-6 pb-4 sm:pb-5 space-y-4">
                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <time dateTime={post.publishedAt}>
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                        </div>
                        <span className="text-border">•</span>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>{post.readTimeInMinutes} min</span>
                        </div>
                      </div>

                      {/* Author */}
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        by <span className="font-medium text-foreground">{post.author.name}</span>
                      </div>

                      {/* Read More Button */}
                      <Button variant="outline" className="w-full mt-1 sm:mt-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300" asChild>
                        <span className="flex items-center justify-between">
                          Read Article
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
