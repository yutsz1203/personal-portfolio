"use client";

import { Menu } from "lucide-react";
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
  "w-full text-xs font-medium tracking-tight text-muted-foreground no-underline";

export function MobileNav({ links, className }: MobileNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Menu aria-hidden />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-52">
        {links.map(({ href, label }) => (
          <DropdownMenuItem key={href} asChild>
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