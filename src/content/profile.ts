import type { Profile } from "./types";

export const profile: Profile = {
  name: "Mervin Yu",
  title: "Data Science Graduate",
  summary: [
    { text: "Data Science graduate " },
    { text: "(First Class Honours", bold: true },
    { text: ", minor in " },
    { text: "Risk Management Science)", bold: true },
    { text: " from "},
    {text: "CUHK",
      href: "https://www.cdas.cuhk.edu.hk/",
    },
    {
      text: ". I enjoy applying statistics and code to discover quantifiable patterns and edges ",
    },
    { text: "in markets, in football, in anything else interesting", bold: true },
    { text: "." },
  ],
  photo: {
    src: "/mervin.webp",
    alt: "Mervin Yu",
    width: 1400,
    height: 1400,
  },
  email: "mervinyu@link.cuhk.edu.hk",
  linkedinUrl: "https://www.linkedin.com/in/mervin-yu",
  githubUrl: "https://github.com/yutsz1203",
  leetcodeUrl: "https://leetcode.com/u/yutsz",
};