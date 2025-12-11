import Image from "next/image";

interface BlogPostCoverProps {
  url: string;
  alt: string;
}

export function BlogPostCover({ url, alt }: BlogPostCoverProps) {
  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-muted">
      <Image
        src={url}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
