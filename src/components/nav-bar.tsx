import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { StaggerList, StaggerItem } from "./motion/stagger-list"

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

        <StaggerList as="ul" trigger="mount" stagger={0.2} delay={0.15} className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <StaggerItem as="li" key={href}>
              <Link
                href={href}
                className="px-3 py-2 text-xs font-medium tracking-tight text-muted-foreground no-underline transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            </StaggerItem>
          ))}
          <StaggerItem as="li" className="ml-1">
            <ThemeToggle />
          </StaggerItem>
        </StaggerList>
      </nav>
    </header>
  );
}
