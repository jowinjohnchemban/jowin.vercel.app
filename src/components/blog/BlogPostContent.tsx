/**
 * Blog Post Content Component
 * Renders blog post content with markdown or HTML fallback
 * @module components/blog/BlogPostContent
 */

import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { PostContent } from "@/lib/api/hashnode";
import type { ComponentPropsWithoutRef } from "react";
import "highlight.js/styles/monokai.css";
import "@/styles/markdown.css";

interface BlogPostContentProps {
  /** Post content in various formats */
  content?: PostContent;
}

/**
 * Custom MDX components for enhanced rendering
 */
const mdxComponents = {
  // External links open in new tab
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a
      {...props}
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  // Responsive iframe wrapper
  iframe: ({ src, title, ...props }: ComponentPropsWithoutRef<"iframe">) => (
    <div className="embed-container">
      <iframe
        {...props}
        src={src}
        title={title || "Embedded content"}
        allowFullScreen
        loading="lazy"
      />
    </div>
  ),
};

/**
 * Content priority:
 * 1. Markdown (rendered with MDX)
 * 2. HTML (rendered as-is)
 * 3. Fallback message
 */
export async function BlogPostContent({ content }: BlogPostContentProps) {
  // Prefer markdown for better rendering
  if (content?.markdown?.trim()) {
    return (
      <div className="markdown-content">
        <MDXRemote
          source={content.markdown}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight],
            },
          }}
          components={mdxComponents}
        />
      </div>
    );
  }

  // Fallback to HTML if markdown not available
  if (content?.html?.trim()) {
    return (
      <div
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    );
  }

  // No content available
  return (
    <div className="text-center py-16">
      <p className="text-muted-foreground mb-4">
        Content not available at the moment.
      </p>
    </div>
  );
}
