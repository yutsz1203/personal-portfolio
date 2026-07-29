import type { Book } from "./types";

export const books: Book[] = [
  {
    title: "Placeholder Title One",
    author: "Placeholder Author",
    cover: {
      src: "/books/placeholder-one.webp",
      alt: "Placeholder Title One cover",
      width: 400,
      height: 600,
    },
    note: "One line on why it stuck.",
  },
  {
    title: "Placeholder Title Two",
    author: "Placeholder Author",
    cover: {
      src: "/books/placeholder-two.webp",
      alt: "Placeholder Title Two cover",
      width: 400,
      height: 600,
    },
  },
];