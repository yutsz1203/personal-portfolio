import Image from "next/image";

import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import {
  HERO_ENTRANCE_DELAY,
  HERO_ENTRANCE_STAGGER,
} from "@/components/motion/timing";
import { Icons } from "@/components/common/icons";
import { RichText } from "@/components/common/rich-text";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";

const HERO_LINKS = [
  { href: profile.githubUrl, label: "GitHub", icon: Icons.github },
  { href: profile.linkedinUrl, label: "LinkedIn", icon: Icons.linkedin },
  { href: `mailto:${profile.email}`, label: "Email", icon: Icons.mail },
] as const;

export function Hero() {
  return (
    <StaggerList
      as="section"
      trigger="mount"
      stagger={HERO_ENTRANCE_STAGGER}
      delay={HERO_ENTRANCE_DELAY}
      className="flex flex-col items-center gap-5 pt-12 pb-16 text-center sm:pt-16"
    >
      <StaggerItem>
        <Image
          src={profile.photo.src}
          alt={profile.photo.alt}
          width={profile.photo.width}
          height={profile.photo.height}
          priority
          sizes="(min-width: 640px) 1000px, 1000px"
          className="size-64 rounded-full border border-border object-cover sm:size-60"
        />
      </StaggerItem>

      <StaggerItem className="flex flex-col items-center gap-2">
        <h1 className="font-heading text-4xl leading-[1.1] tracking-heading sm:text-heading">
          {profile.name}
        </h1>
        <p className="text-body font-semibold sm:text-subheading text-muted-foreground">
          {profile.title}
        </p>
      </StaggerItem>

      <StaggerItem>
        <p className="text-body-sm leading-relaxed">
          <RichText value={profile.summary} />
        </p>
      </StaggerItem>

      <StaggerItem>
        <ul className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {HERO_LINKS.map(({ href, label, icon: Icon }) => {
            const isMail = href.startsWith("mailto:");

            return (
              <li key={label}>
                <Button variant="outline" asChild className="h-10 px-4">
                  <a
                    href={href}
                    target={isMail ? undefined : "_blank"}
                    rel={isMail ? undefined : "noreferrer"}
                  >
                    <Icon />
                    {label}
                  </a>
                </Button>
              </li>
            );
          })}
        </ul>
      </StaggerItem>
    </StaggerList>
  );
}