import { NextRequest, NextResponse } from "next/server";
import { socialLinks } from "@/config/site";
import type { Metadata } from "next";

// Prevent indexing of redirect routes
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const socialMediaMap: Record<string, string> = {
  github: socialLinks.github,
  twitter: socialLinks.twitter,
  linkedin: socialLinks.linkedin,
  youtube: socialLinks.youtube,
  instagram: socialLinks.instagram,
  facebook: socialLinks.facebook,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  const { platform: platformParam } = await params;
  const platform = platformParam.toLowerCase();

  // Get the URL for the platform
  const socialUrl = socialMediaMap[platform];

  // If no URL configured or platform doesn't exist, redirect to connect page
  if (!socialUrl) {
    return NextResponse.redirect(new URL("/connect", _request.url));
  }

  // Redirect to the social media URL (external)
  return NextResponse.redirect(socialUrl);
}
