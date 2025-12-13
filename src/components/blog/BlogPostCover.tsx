"use client";
import Image from "next/image";
import { useState } from "react";
import { getImageQuality } from "@/lib/imageQuality";

interface BlogPostCoverProps {
  url: string;
  alt: string;
  blurDataURL?: string; // Optional: low-quality placeholder
}

export function BlogPostCover({ url, alt, blurDataURL }: BlogPostCoverProps) {
  const [quality] = useState(getImageQuality());
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
        quality={quality}
      />
    </div>
  );
}
