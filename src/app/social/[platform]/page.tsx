import { redirect } from "next/navigation";

const socialMediaMap: Record<string, string | undefined> = {
  github: process.env.NEXT_PUBLIC_GITHUB_URL,
  twitter: process.env.NEXT_PUBLIC_TWITTER_URL,
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL,
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL,
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL,
};

export default async function SocialRedirectPage({
  params,
}: {
  params: Promise<{ platform: string }>;
}) {
  const { platform: platformParam } = await params;
  const platform = platformParam.toLowerCase();

  // Get the URL for the platform
  const socialUrl = socialMediaMap[platform];

  // If no URL configured or platform doesn't exist, redirect to connect page
  if (!socialUrl) {
    redirect("/connect");
  }

  // Redirect to the social media URL
  redirect(socialUrl);
}
