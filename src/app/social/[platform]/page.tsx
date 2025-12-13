import { redirect } from "next/navigation";
import { socialLinks } from "@/config/site";

const socialMediaMap: Record<string, string> = {
  github: socialLinks.github,
  twitter: socialLinks.twitter,
  linkedin: socialLinks.linkedin,
  youtube: socialLinks.youtube,
  instagram: socialLinks.instagram,
  facebook: socialLinks.facebook,
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
