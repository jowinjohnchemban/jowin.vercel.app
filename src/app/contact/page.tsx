import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import Link from "next/link";
import { Github, Linkedin, Twitter, Youtube, Instagram, Facebook } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Me",
  description: "Get in touch with Jowin John Chemban for collaborations, projects, or inquiries about DevOps, cloud infrastructure, and web development.",
  keywords: [
    "Contact",
    "Get in touch",
    "Collaboration",
    "Project inquiry",
    "DevOps consultant",
    "Web developer contact",
  ],
  openGraph: {
    title: "Contact - Jowin John Chemban",
    description: "Let's work together! Reach out for projects, collaborations, or just to say hello.",
    type: "website",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header Section */}
        <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Let&apos;s <span className="text-primary">Connect</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a project in mind or want to collaborate? Fill out the form below and I&apos;ll get back to you soon.
            </p>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto mb-12 sm:mb-16">
            <ContactForm 
              title="Send a Message"
              description=""
              showCard={true}
            />
          </div>

          {/* Social Media Links */}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Connect on Social Media</h2>
            <p className="text-sm text-muted-foreground mb-6">Follow me for updates and insights</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                {
                  name: "GitHub",
                  icon: Github,
                  platform: "github",
                  enabled: !!process.env.NEXT_PUBLIC_GITHUB_URL,
                },
                {
                  name: "Twitter",
                  icon: Twitter,
                  platform: "twitter",
                  enabled: !!process.env.NEXT_PUBLIC_TWITTER_URL,
                },
                {
                  name: "LinkedIn",
                  icon: Linkedin,
                  platform: "linkedin",
                  enabled: !!process.env.NEXT_PUBLIC_LINKEDIN_URL,
                },
                {
                  name: "YouTube",
                  icon: Youtube,
                  platform: "youtube",
                  enabled: !!process.env.NEXT_PUBLIC_YOUTUBE_URL,
                },
                {
                  name: "Instagram",
                  icon: Instagram,
                  platform: "instagram",
                  enabled: !!process.env.NEXT_PUBLIC_INSTAGRAM_URL,
                },
                {
                  name: "Facebook",
                  icon: Facebook,
                  platform: "facebook",
                  enabled: !!process.env.NEXT_PUBLIC_FACEBOOK_URL,
                },
              ]
                .filter((link) => link.enabled)
                .map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={`/api/social/${link.platform}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-card border border-border rounded-lg hover:bg-accent hover:border-primary transition-all group"
                    >
                      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium">{link.name}</span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
