// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { usePathname } from "next/navigation";
import { Menu, X, Home } from "lucide-react";

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/connect", label: "Let's Connect" },
];

const mobileNavLinks = [
  { href: "/", label: "Home" },
  ...navLinks,
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-white/70 dark:bg-background/70 backdrop-blur-xl border-b border-border/40 shadow-sm supports-backdrop-filter:bg-white/60 supports-backdrop-filter:dark:bg-background/60">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-bold text-lg sm:text-xl hover:text-primary transition-colors"
            onClick={closeMenu}
          >
            {siteConfig.name}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm text-foreground transition-transform relative group ${
                    isActive ? "font-bold" : "font-medium"
                  }`}
                >
                  {link.label}
                  <span className="absolute bottom-1 left-4 right-4 h-px bg-gray-300 dark:bg-gray-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

      </header>
      {/* Portal target for toast banners below navbar */}
      <div id="banner-portal" />

      {/* Mobile Menu Overlay - Outside header */}
      {isOpen && (
        <div className="fixed inset-0 bg-white/90 dark:bg-background/90 backdrop-blur-sm md:hidden z-60 animate-in fade-in slide-in-from-right duration-300">
          {/* Close Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={closeMenu}
              className="p-3 text-foreground hover:text-primary transition-colors"
              aria-label="Close menu"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          {/* Centered Navigation */}
          <nav className="flex flex-col items-center justify-center h-full space-y-6 px-8">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="flex items-center gap-3 text-2xl font-semibold text-foreground hover:text-primary transition-colors"
              >
                {link.href === "/" ? (
                  <Home className="h-8 w-8" />
                ) : (
                  link.label
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
