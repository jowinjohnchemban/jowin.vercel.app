"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

interface BlogPostCoverProps {
  url: string;
  alt: string;
  blurDataURL?: string; // Optional: low-quality placeholder
}

export function BlogPostCover({ url, alt, blurDataURL }: BlogPostCoverProps) {
  // Start with SSR-safe quality, then update on client
  const [quality, setQuality] = useState(75);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Dynamic import to avoid SSR issues
    import("@/lib/imageQuality").then(({ getImageQuality }) => {
      setQuality(getImageQuality());
    });
  }, []);

  // Only use dynamic quality after client-side hydration
  const imageQuality = isClient ? quality : 75;

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-muted">
      <Image
        src={url}
        alt={alt}
        fill
        className="object-cover"
        priority
        fetchPriority="high"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 900px"
        placeholder={blurDataURL ? "blur" : undefined}
        blurDataURL={blurDataURL}
        quality={imageQuality}
      />
    </div>
  );
}
