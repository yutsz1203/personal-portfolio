import { skillIconHoverColors, skillIcons } from "@/components/common/icons";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import type { SkillGroup } from "@/content/types";

export function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <StaggerList as="ul" className="divide-y divide-border">
      {groups.map((group) => (
        <StaggerItem
          as="li"
          key={group.label}
          className="flex flex-col gap-2 py-5 first:pt-0 last:pb-0 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-6"
        >
          <p className="text-caption tracking-caption text-muted-foreground uppercase sm:pt-0.5">
            {group.label}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {group.skills.map((skill) => {
              const Icon = skillIcons[skill.slug];

              return (
                <span
                  key={skill.slug}
                  className="group flex items-center gap-2 text-body-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon
                    aria-hidden
                    className={`size-4 shrink-0 transition-colors ${skillIconHoverColors[skill.slug]}`}
                  />
                  {skill.name}
                </span>
              );
            })}
          </div>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}