import type { IconType } from "react-icons";
import {
  SiClaudecode,
  SiDocker,
  SiGit,
  SiGithub,
  SiLeetcode,
  SiLinux,
  SiMysql,
  SiNextdotjs,
  SiNumpy,
  SiPandas,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiR,
  SiReact,
  SiScikitlearn,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { LuArrowUpRight, LuMail } from "react-icons/lu";

import type { SkillSlug } from "@/content/types";

export const Icons = {
    github: SiGithub,
    leetcode: SiLeetcode,
    linkedin: FaLinkedin,
    mail: LuMail,
    arrowUpRight: LuArrowUpRight
}

export const skillIcons: Record<SkillSlug, IconType> = {
  python: SiPython,
  typescript: SiTypescript,
  r: SiR,
  pandas: SiPandas,
  numpy: SiNumpy,
  scikitlearn: SiScikitlearn,
  react: SiReact,
  tailwindcss: SiTailwindcss,
  nextdotjs: SiNextdotjs,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  git: SiGit,
  github: SiGithub,
  claudecode: SiClaudecode,
  linux: SiLinux,
  vercel: SiVercel,
  docker: SiDocker,
  postman: SiPostman,
};

export const skillIconHoverColors: Record<SkillSlug, string> = {
  python: "group-hover:text-(color:--brand-python)",
  typescript: "group-hover:text-(color:--brand-typescript)",
  r: "group-hover:text-(color:--brand-r)",
  pandas: "group-hover:text-(color:--brand-pandas)",
  numpy: "group-hover:text-(color:--brand-numpy)",
  scikitlearn: "group-hover:text-(color:--brand-scikitlearn)",
  react: "group-hover:text-(color:--brand-react)",
  tailwindcss: "group-hover:text-(color:--brand-tailwindcss)",
  nextdotjs: "group-hover:text-(color:--brand-nextdotjs)",
  postgresql: "group-hover:text-(color:--brand-postgresql)",
  mysql: "group-hover:text-(color:--brand-mysql)",
  git: "group-hover:text-(color:--brand-git)",
  github: "group-hover:text-(color:--brand-github)",
  claudecode: "group-hover:text-(color:--brand-claudecode)",
  linux: "group-hover:text-(color:--brand-linux)",
  vercel: "group-hover:text-(color:--brand-vercel)",
  docker: "group-hover:text-(color:--brand-docker)",
  postman: "group-hover:text-(color:--brand-postman)",
};