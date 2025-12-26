export default function Footer() {
  return (
    <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border bg-background">
      &copy; 2025-{new Date().getFullYear()} A2A. All rights reserved. MIT
      Licensed.
    </footer>
  );
}
