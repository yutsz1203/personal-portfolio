import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { HERO_ENTRANCE_END } from "@/components/motion/timing";
import { Hero } from "@/components/sections/hero";
import type { ProjectRowEntry } from "@/components/sections/project-row";
import { Projects } from "@/components/sections/projects";
import { Books, type BookEntry } from "@/components/sections/books";
import { Skills } from "@/components/sections/skills";
import { Timeline, type TimelineEntry } from "@/components/sections/timeline";
import { featuredBooks } from "@/content/books";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { featuredProjects } from "@/content/projects";
import { skills } from "@/content/skills";
import type { Image, Project } from "@/content/types";
import { formatDateRange } from "@/lib/format-date";
import { Icons } from "@/components/common/icons"

const experienceEntries: TimelineEntry[] = experience.map((item) => ({
  date: formatDateRange(item.dates),
  title: item.company,
  titleUrl: item.companyUrl,
  subtitle: item.role,
  bullets: item.highlights,
  tags: item.tech,
}));

const educationEntries: TimelineEntry[] = education.map((item) => ({
  date: formatDateRange(item.dates),
  title: item.institution,
  titleUrl: item.institutionUrl,
  subtitle: item.classification
    ? `${item.degree}, ${item.classification}`
    : item.degree,
  bullets: item.highlights,
}));

const featuredProjectRows: ProjectRowEntry[] = featuredProjects
  .filter(
    (project): project is Project & { image: Image } => project.image !== undefined,
  )
  .map(({ slug, name, blurb, image, tech, liveUrl, repoUrl }) => ({
    slug,
    name,
    blurb,
    image,
    tech,
    liveUrl,
    repoUrl,
  }));

const featuredBookEntries: BookEntry[] = featuredBooks.map(
  ({ title, author, cover, readYear, genres }) => ({
    title,
    author,
    cover,
    readYear,
    genres,
  }),
);

export default function Home() {
  return (
    <main className="px-6">
      <div className="mx-auto max-w-4xl">
        <Hero />
      </div>
      <section id="experience"  aria-labelledby="experience-heading" className="mx-auto max-w-3xl pb-16">
        <Reveal trigger="mount" delay={HERO_ENTRANCE_END}>
          <h2 className="mb-8 border-b border-border pb-3 font-heading text-subheading leading-subheading">
            Experience
          </h2>
        </Reveal>
        <Timeline
          entries={experienceEntries}
          trigger="mount"
          delay={HERO_ENTRANCE_END + 0.15}
        />
      </section>

      <section className="mx-auto max-w-3xl pb-16">
        <Reveal>
          <h2 className="mb-8 border-b border-border pb-3 font-heading text-subheading leading-subheading">
            Projects
          </h2>
        </Reveal>
        <Projects entries={featuredProjectRows} />
        <Reveal className="mt-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-body-sm text-muted-foreground no-underline transition-colors hover:text-foreground hover:underline"
        >
          View all projects
          <Icons.arrowUpRight aria-hidden className="size-3.5" />
        </Link>
      </Reveal>
      </section>

      <section id="skills" className="mx-auto max-w-3xl pb-16">
        <Reveal>
          <h2 className="mb-8 border-b border-border pb-3 font-heading text-subheading leading-subheading">
            Skills & Technologies
          </h2>
        </Reveal>
        <Skills groups={skills} />
      </section>

      <section id="education" className="mx-auto max-w-3xl pb-16">
        <Reveal>
          <h2 className="mb-8 border-b border-border pb-3 font-heading text-subheading leading-subheading">
            Education
          </h2>
        </Reveal>
        <Timeline entries={educationEntries} />
      </section>

      <section className="mx-auto max-w-3xl pb-16">
        <Reveal>
          <h2 className="mb-8 border-b border-border pb-3 font-heading text-subheading leading-subheading">
            Books
          </h2>
        </Reveal>
        <Books entries={featuredBookEntries} />
        <Reveal className="mt-8">
          <Link
            href="/books"
            className="inline-flex items-center gap-1 text-body-sm text-muted-foreground no-underline transition-colors hover:text-foreground hover:underline"
          >
            View all books
            <Icons.arrowUpRight aria-hidden className="size-3.5" />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}