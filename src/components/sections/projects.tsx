import { StaggerList } from "@/components/motion/stagger-list";
import {
  ProjectRow,
  type ProjectRowEntry,
} from "@/components/sections/project-row";

export function Projects({
  entries,
  priorityCount = 2,
}: {
  entries: ProjectRowEntry[];
  priorityCount?: number;
}) {
  return (
    <>
      <StaggerList stagger={0.2} delay={0.15} as="ul" className="flex flex-col gap-2">
        {entries.map((entry, index) => (
          <ProjectRow
            key={entry.slug}
            entry={entry}
            priority={index < priorityCount}
          />
        ))}
      </StaggerList>
    </>
  );
}