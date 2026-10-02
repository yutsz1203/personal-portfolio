export type DateRange = {
  /** ISO-ish year-month, e.g. "2023-06". */
  start: string;
  /** ISO-ish year-month, or null while ongoing. */
  end: string | null;
};

export type TextSegment = {
  text: string;
  bold?: boolean;
  href?: string;
};

export type RichText = TextSegment[];

export type Image = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Education = {
  institution: string;
  institutionUrl?: string;
  degree: string;
  classification?: string;
  dates: DateRange;
  highlights?: string[];
};

export type Experience = {
  company: string;
  companyUrl?: string;
  role: string;
  dates: DateRange;
  highlights: string[];
  tech: string[];
};

export type Project = {
  slug: string;
  name: string;
  blurb: string;
  liveUrl?: string;
  repoUrl?: string;
  image?: Image;
  tech: string[];
  featured: boolean;
};

export type Book = {
  title: string;
  author: string;
  cover?: Image;
  readYear: number | "reading";
  genres: string[];
  note?: string;
  featured: boolean;
};

export type SkillSlug =
  | "python"
  | "typescript"
  | "r"
  | "pandas"
  | "numpy"
  | "scikitlearn"
  | "apacheairflow"
  | "dbt"
  | "metabase"
  | "react"
  | "tailwindcss"
  | "nextdotjs"
  | "postgresql"
  | "mysql"
  | "redis"
  | "git"
  | "github"
  | "claudecode"
  | "linux"
  | "vercel"
  | "docker"
  | "postman";

export type Skill = {
  name: string;
  slug: SkillSlug;
};

export type SkillGroup = {
  label: string;
  skills: Skill[];
};

export type Profile = {
  name: string;
  title: string;
  summary: RichText;
  photo: Image;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  leetcodeUrl: string;
};