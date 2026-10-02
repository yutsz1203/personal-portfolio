import type { SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    skills: [
      { name: "Python", slug: "python" },
      { name: "TypeScript", slug: "typescript" },
      { name: "R", slug: "r" },
    ],
  },
  {
    label: "Data & ML",
    skills: [
      { name: "pandas", slug: "pandas" },
      { name: "NumPy", slug: "numpy" },
      { name: "scikit-learn", slug: "scikitlearn" },
      { name: "Apache Airflow", slug: "apacheairflow" },
      { name: "dbt", slug: "dbt" },
      { name: "Metabase", slug: "metabase" },
    ],
  },
  {
    label: "Web Development",
    skills: [
      { name: "React", slug: "react" },
      { name: "Tailwind CSS", slug: "tailwindcss" },
      { name: "Next.js", slug: "nextdotjs" },
    ],
  },
  {
    label: "Databases",
    skills: [
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "MySQL", slug: "mysql" },
      { name: "Redis", slug: "redis" },
    ],
  },
  {
    label: "Tools & Infrastructure",
    skills: [
      { name: "Git", slug: "git" },
      { name: "GitHub", slug: "github" },
      { name: "Claude Code", slug: "claudecode" },
      { name: "Linux", slug: "linux" },
      { name: "Vercel", slug: "vercel" },
      { name: "Docker", slug: "docker" },
      { name: "Postman", slug: "postman" },
    ],
  },
];