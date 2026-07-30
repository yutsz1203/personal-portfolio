import { projects } from "@/content/projects";
import type { ProjectRowEntry } from "@/components/sections/project-row";
import { Projects } from "@/components/sections/projects";
import { Reveal } from "@/components/motion/reveal";

const allProjectRows: ProjectRowEntry[] = projects
  .map(({ slug, name, blurb, image, tech, liveUrl, repoUrl }) => ({
    slug,
    name,
    blurb,
    image,
    tech,
    liveUrl,
    repoUrl,
  }));


export default function ProjectsPage() {
  return (
    <main>
      <section className="mx-auto max-w-3xl pb-16">
          <Reveal>
            <h2 className="mb-8 border-b border-border pb-3 font-heading text-subheading leading-subheading">
              Projects
            </h2>
          </Reveal>
          <Projects entries={allProjectRows} />
        </section>
    </main>
  );
}