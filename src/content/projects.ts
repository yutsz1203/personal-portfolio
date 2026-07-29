import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "placeholder-one",
    name: "Placeholder Project One",
    blurb: "One or two sentences on what it does and why it exists.",
    liveUrl: "https://example.com",
    repoUrl: "https://github.com/yutsz1203",
    image: {
      src: "/projects/placeholder-one.webp",
      alt: "Placeholder Project One screenshot",
      width: 1200,
      height: 750,
    },
    tech: ["Next.js", "TypeScript"],
    featured: true,
  },
  {
    slug: "placeholder-two",
    name: "Placeholder Project Two",
    blurb: "One or two sentences on what it does and why it exists.",
    repoUrl: "https://github.com/yutsz1203",
    image: {
      src: "/projects/placeholder-two.webp",
      alt: "Placeholder Project Two screenshot",
      width: 1200,
      height: 750,
    },
    tech: ["Python", "scikit-learn"],
    featured: true,
  },
  {
    slug: "placeholder-three",
    name: "Placeholder Project Three",
    blurb: "One or two sentences on what it does and why it exists.",
    repoUrl: "https://github.com/yutsz1203",
    tech: ["R"],
    featured: true,
  },
  {
    slug: "placeholder-four",
    name: "Placeholder Project Four",
    blurb: "Not featured, so this one only appears on /projects.",
    repoUrl: "https://github.com/yutsz1203",
    tech: ["Python"],
    featured: false,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);