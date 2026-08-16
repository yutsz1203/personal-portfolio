import { Reveal } from "@/components/motion/reveal";
import { type BookEntry } from "@/components/sections/books";
import { BooksBrowser } from "@/components/sections/books-browser";
import { books } from "@/content/books";

const allBooks: BookEntry[] = books.map(
  ({ title, author, cover, readYear, genres }) => ({
    title,
    author,
    cover,
    readYear,
    genres,
  }),
);

export default function BooksPage() {
  return (
    <div className="px-6">
      <section className="mx-auto max-w-3xl pb-16">
        <Reveal trigger="mount">
          <h2 className="mb-8 border-b border-border pb-3 font-heading text-subheading leading-subheading">
            Books
          </h2>
        </Reveal>
        <BooksBrowser entries={allBooks} />
      </section>
    </div>
  );
}
