"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NavLink } from "@/components/nav-bar";

type MobileNavProps = {
  links: readonly NavLink[];
  className?: string;
};

const MOBILE_LINK_CLASS =
  "w-full text-nav leading-nav tracking-nav text-muted-foreground no-underline";

export function MobileNav({ links, className }: MobileNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <span className="relative size-4">
              <Menu
                className="absolute inset-0 size-4 transition-all duration-200 ease-out
                          rotate-0 scale-100 opacity-100
                          group-data-[state=open]/button:-rotate-90
                          group-data-[state=open]/button:scale-0
                          group-data-[state=open]/button:opacity-0"
              />
              <X
                className="absolute inset-0 size-4 transition-all duration-200 ease-out
                          rotate-90 scale-0 opacity-0
                          group-data-[state=open]/button:rotate-0
                          group-data-[state=open]/button:scale-100
                          group-data-[state=open]/button:opacity-100"
              />
            </span>
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        {links.map(({ href, label }) => (
          <DropdownMenuItem key={href} asChild className="py-3 px-4">
            {href.startsWith("/#") ? (
              <a href={href} className={MOBILE_LINK_CLASS}>
                {label}
              </a>
            ) : (
              <Link href={href} className={MOBILE_LINK_CLASS}>
                {label}
              </Link>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}