import type { SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    skills: [
      { name: "Python", slug: "python" },
      { name: "TypeScript", slug: "typescript" },
      { name: "R", slug: "r" },
      { name: "SQL" },
    ],
  },
  {
    label: "Data & ML",
    skills: [
      { name: "pandas", slug: "pandas" },
      { name: "scikit-learn", slug: "scikitlearn" },
      { name: "PyTorch", slug: "pytorch" },
    ],
  },
  {
    label: "Tools",
    skills: [
      { name: "Git", slug: "git" },
      { name: "Docker", slug: "docker" },
      { name: "Next.js", slug: "nextdotjs" },
    ],
  },
];