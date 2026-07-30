import { StaggerList } from "@/components/motion/stagger-list";
import {
  ProjectRow,
  type ProjectRowEntry,
} from "@/components/sections/project-row";

export function Projects({ entries }: { entries: ProjectRowEntry[] }) {
  return (
    <>
      <StaggerList stagger={0.2} delay={0.15} as="ul" className="flex flex-col gap-2">
        {entries.map((entry) => (
          <ProjectRow key={entry.slug} entry={entry} />
        ))}
      </StaggerList>
    </>
  );
}