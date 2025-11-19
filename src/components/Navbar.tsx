// src/components/Navbar.tsx

import Link from "next/link";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || " ";

// Mobile Menu Component
function MobileMenu() {
  return (
    <div className="md:hidden">
      <details className="relative">
        <summary className="cursor-pointer list-none text-xl">☰</summary>
        <div className="absolute right-0 mt-2 w-40 bg-background border rounded shadow-md py-2 px-3 flex flex-col gap-2">
          <Link href="/projects" className="text-sm hover:text-primary">Projects</Link>
          <Link href="/blog" className="text-sm hover:text-primary">Blog</Link>
          <Link href="#contact" className="text-sm hover:text-primary">Contact</Link>
        </div>
      </details>
    </div>
  );
}

function DesktopMenu() {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link href="/projects" className="text-sm hover:text-primary">Projects</Link>
      <Link href="/blog" className="text-sm hover:text-primary">Blog</Link>
      <Link href="#contact" className="text-sm hover:text-primary">Contact</Link>
    </div>
  );
}

export default function Navbar() {

  return (
    <header className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8 h-16">
        <Link href="/" className="font-bold text-xl">
          {SITE_NAME}
        </Link>

        {/* Desktop Navigation */}
        <DesktopMenu />

        {/* Mobile Menu */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
