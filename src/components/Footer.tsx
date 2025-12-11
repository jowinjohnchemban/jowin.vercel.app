// src/components/Footer.tsx

export default function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Jowin John Chemban";

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
