import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { StaggerList, StaggerItem } from "./motion/stagger-list"

const NAV_LINKS = [
  { href: "/#experience", label: "Experience"},
  { href: "/projects", label: "Projects" },
  { href: "/#skills", label: "Skills & Technologies" },
  { href: "/#education", label: "Education" },
  { href: "/books", label: "Books" },
] as const;


const NAV_LINK_CLASS =
  "px-3 py-2 text-xs font-medium tracking-tight text-muted-foreground no-underline transition-colors hover:text-foreground";

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
              {href.startsWith("/#") ? (
                <a href={href} className={NAV_LINK_CLASS}>
                  {label}
                </a>
              ) : (
                <Link href={href} className={NAV_LINK_CLASS}>
                  {label}
                </Link>
              )}
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
