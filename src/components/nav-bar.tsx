import Link from "next/link";

import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Wordmark } from "@/components/wordmark";
import { StaggerList, StaggerItem } from "./motion/stagger-list"

const NAV_LINKS = [
  { href: "/#experience", label: "Experience"},
  { href: "/projects", label: "Projects" },
  { href: "/#skills", label: "Skills & Technologies" },
  { href: "/#education", label: "Education" },
  { href: "/books", label: "Books" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];


const NAV_LINK_CLASS =
  "px-3 py-2 text-nav leading-nav tracking-nav text-muted-foreground no-underline transition-colors hover:text-foreground";

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 bg-background">
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6"
      >
        <Wordmark className="text-body-sm leading-nav font-bold tracking-[0.12em] uppercase no-underline" />

        <div className="flex items-center gap-1">
          <StaggerList as="ul" trigger="mount" stagger={0.2} delay={0.15} className="hidden items-center gap-1 md:flex">
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
          </StaggerList>

          <ThemeToggle />
          <MobileNav links={NAV_LINKS} className="md:hidden" />
        </div>
      </nav>
    </header>
  );
}
