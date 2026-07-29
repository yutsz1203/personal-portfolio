import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { HERO_ENTRANCE_END } from "@/components/motion/timing";
import { Hero } from "@/components/sections/hero";
import { Timeline, type TimelineEntry } from "@/components/sections/timeline";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { formatDateRange } from "@/lib/format-date";

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

export default function Home() {
  return (
    <main className="px-6">
      <div className="mx-auto max-w-4xl">
        <Hero />
      </div>

      <section className="mx-auto max-w-3xl pb-16">
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
            Education
          </h2>
        </Reveal>
        <Timeline entries={educationEntries} />
      </section>

      <Reveal className="mx-auto flex max-w-3xl gap-6 pb-16 text-body-sm">
        <Link href="/projects">Projects</Link>
        <Link href="/books">Books</Link>
      </Reveal>
    </main>
  );
}