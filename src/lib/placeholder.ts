import sharp from "sharp";

/**
 * Generate a base64-encoded blur placeholder for an image buffer or file path.
 * Returns a string suitable for Next.js blurDataURL (data:image/jpeg;base64,...)
 *
 * @param input - Buffer or file path to the image
 * @param width - Target width for the placeholder (default: 16)
 * @param quality - JPEG quality (default: 40)
 * @returns base64 blurDataURL string
 */
export async function getBlurDataURL(
  input: Buffer | string,
  width = 16,
  quality = 40
): Promise<string> {
  const buffer = await sharp(input)
    .resize(width)
    .jpeg({ quality })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}
