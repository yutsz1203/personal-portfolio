import NextImage from "next/image";

import { Icons } from "@/components/common/icons";
import { StaggerItem } from "@/components/motion/stagger-list";
import type { Image } from "@/content/types";

export type ProjectRowEntry = {
  slug: string;
  name: string;
  blurb: string;
  image?: Image;
  tech: string[];
  liveUrl?: string;
  repoUrl?: string;
};

const LINK_CLASS =
  "inline-flex items-center gap-1 text-body-sm text-muted-foreground no-underline transition-colors hover:text-accent-clay hover:underline";

export function ProjectRow({
  entry,
  priority = false,
}: {
  entry: ProjectRowEntry;
  priority?: boolean;
}) {
  const links = [
    entry.liveUrl ? { href: entry.liveUrl, label: "Live" } : null,
    entry.repoUrl ? { href: entry.repoUrl, label: "Source" } : null,
  ].filter((link) => link !== null);

  return (
    <StaggerItem
      as="li"
      className="-mx-4 flex flex-col gap-5 rounded-xl p-4 transition-colors hover:bg-card sm:grid sm:grid-cols-[1fr_1.1fr] sm:items-center sm:gap-8"
    >
      <div>
        <h3 className="font-heading text-subheading leading-subheading">
          {entry.name}
        </h3>

        <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
          {entry.blurb}
        </p>

        <p className="mt-3 text-caption tracking-caption text-muted-foreground">
          {entry.tech.join(" · ")}
        </p>

        {links.length > 0 ? (
          <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            {links.map(({ href, label }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={LINK_CLASS}
                >
                  {label}
                  <Icons.arrowUpRight aria-hidden className="size-3.5" />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {entry.image ? 
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border">
        <NextImage
          src={entry.image.src}
          alt={entry.image.alt}
          width={entry.image.width}
          height={entry.image.height}
          sizes="(min-width: 640px) 24rem, 100vw"
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div> 
      : null}

    </StaggerItem>
  );
}