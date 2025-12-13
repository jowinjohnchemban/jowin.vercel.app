import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import Link from "next/link";
import { Github, Linkedin, Twitter, Youtube, Instagram, Facebook } from "lucide-react";
import { socialLinks, features } from "@/config/site";
import { generatePageSEO } from "@/config/seo";

export const metadata: Metadata = generatePageSEO("connect");

export default function ConnectPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-b from-background to-muted/20">
        {/* Header Section */}
        <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Let&apos;s <span className="text-primary">Connect</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Got ideas or just wanna connect? Drop a message! 💬
            </p>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto mb-12 sm:mb-16">
            <ContactForm 
              title="Slide into my inbox 📬"
              description=""
              showCard={true}
            />
          </div>

          {/* Social Media Links */}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Catch me on socials 👇</h2>
            <p className="text-sm text-muted-foreground mb-6">Follow for the latest vibes, thoughts & more ✨</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                {
                  name: "GitHub",
                  icon: Github,
                  url: socialLinks.github,
                  enabled: features.social.github,
                },
                {
                  name: "Twitter",
                  icon: Twitter,
                  url: socialLinks.twitter,
                  enabled: features.social.twitter,
                },
                {
                  name: "LinkedIn",
                  icon: Linkedin,
                  url: socialLinks.linkedin,
                  enabled: features.social.linkedin,
                },
                {
                  name: "YouTube",
                  icon: Youtube,
                  url: socialLinks.youtube,
                  enabled: features.social.youtube,
                },
                {
                  name: "Instagram",
                  icon: Instagram,
                  url: socialLinks.instagram,
                  enabled: features.social.instagram,
                },
                {
                  name: "Facebook",
                  icon: Facebook,
                  url: socialLinks.facebook,
                  enabled: features.social.facebook,
                },
              ]
                .filter((link) => link.enabled)
                .map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-card border border-border rounded-lg hover:bg-accent hover:border-primary transition-all group"
                    >
                      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium md:block hidden">{link.name}</span>
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
