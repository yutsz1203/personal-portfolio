import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/books", label: "Books" },
] as const;

export function NavBar() {
  return (
    <header className="bg-background">
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6"
      >
        <Link
          href="/"
          className="text-xs font-bold tracking-[0.12em] uppercase no-underline"
        >
          Mervin Yu
        </Link>

        <ul className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="px-3 py-2 text-xs font-medium tracking-tight text-muted-foreground no-underline transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="ml-1">
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}
