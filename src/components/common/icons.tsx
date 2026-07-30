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