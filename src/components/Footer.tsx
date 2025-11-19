// src/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="py-10 text-center text-sm text-muted-foreground border-t mt-10">
      © {new Date().getFullYear()} · Jowin John Chemban
    </footer>
  );
}
