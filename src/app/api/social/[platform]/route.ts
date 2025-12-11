import { NextRequest, NextResponse } from "next/server";

const socialMediaMap: Record<string, () => string | null> = {
  github: () => process.env.NEXT_PUBLIC_GITHUB_URL || null,
  twitter: () => process.env.NEXT_PUBLIC_TWITTER_URL || null,
  linkedin: () => process.env.NEXT_PUBLIC_LINKEDIN_URL || null,
  youtube: () => process.env.NEXT_PUBLIC_YOUTUBE_URL || null,
  instagram: () => process.env.NEXT_PUBLIC_INSTAGRAM_URL || null,
  facebook: () => process.env.NEXT_PUBLIC_FACEBOOK_URL || null,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform: platformParam } = await params;
  const platform = platformParam.toLowerCase();
  const fallbackUrl = new URL("/contact", request.nextUrl.origin);

  // Check if platform exists in our map
  if (!socialMediaMap[platform]) {
    return NextResponse.redirect(fallbackUrl);
  }

  // Get the URL for the platform
  const socialUrl = socialMediaMap[platform]();

  // If no URL configured, redirect to contact page
  if (!socialUrl) {
    return NextResponse.redirect(fallbackUrl);
  }

  return NextResponse.redirect(socialUrl);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ platform: string }> }
) {
  // Handle POST the same way as GET for now
  return GET(request, context);
}
