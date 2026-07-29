import type { Experience } from "./types";

export const experience: Experience[] = [
  {
    company: "Rivermap",
    companyUrl: "https://www.rivermap.com.hk/",
    role: "Data Science Research Intern",
    dates: { start: "2026-01", end: "2026-05" },
    highlights: [
      "Built a Thematic Portfolio Engine."
    ],
    tech: ["Python", "sentence-transformer", "DeepSeek API", "PostgreSQL"],
  },
  {
    company: "Optix Solutions",
    companyUrl: "https://www.optixsolutions.com.hk/",
    role: "Software Engineer Intern",
    dates: { start: "2024-06", end: "2024-08" },
    highlights: [
      "Shipped two web applications."
    ],
    tech: ["React", "Python", "Flask", "PostgreSQL"],
  },
  {
    company: "Securities and Futures Commission of Hong Kong",
    companyUrl: "https://www.sfc.hk/en/",
    role: "Winter Intern",
    dates: { start: "2023-12", end: "2024-01" },
    highlights: ["Drafted cost containment plans and conducted basic economic research."],
    tech: ["Excel", "Canva"],
  },
];