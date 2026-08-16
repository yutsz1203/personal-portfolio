import NextImage from "next/image";

import type { Book, Image } from "@/content/types";
import { cn } from "@/lib/utils";

export type BookCoverEntry = {
  title: string;
  author: string;
  cover?: Image;
};

/** "Rishi K. Narang · Reading now" — genres are rendered on their own line. */
export function formatByline(book: Pick<Book, "author" | "readYear">) {
  return `${book.author} · ${formatReadYear(book.readYear)}`;
}

/** "Memoir · Sport" */
export function formatGenres(book: Pick<Book, "genres">) {
  return book.genres.join(" · ");
}

export function formatReadYear(readYear: Book["readYear"]) {
  return readYear === "reading" ? "Reading now" : String(readYear);
}

/** "Read in 2025" — the labelled form, for layouts with room for it. */
export function formatReadYearLong(readYear: Book["readYear"]) {
  return readYear === "reading" ? "Reading now" : `Read in ${readYear}`;
}

/**
 * A book rendered as a physical object: a page block sitting behind a cover that
 * is hinged on its left edge. On hover the cover swings toward the viewer, which
 * narrows its projection and exposes the pages — the book opening.
 *
 * The rotation is plain CSS so this stays a server component. `perspective` only
 * applies to *direct* children, so the cover face must stay a direct child of the
 * aspect-ratio box, and nothing above it may set `overflow-hidden` (that would
 * flatten the 3D context).
 */
export function BookCover({
  entry,
  className,
  sizes = "(min-width: 768px) 15rem, 30vw",
}: {
  entry: BookCoverEntry;
  /** Match to the rendered column width; the default describes the /books grid. */
  sizes?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group/book transition-transform duration-500 ease-out motion-safe:hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative aspect-[2/3] w-full [perspective:1200px]">
        {/* Page block — two leaves peeking out past the fore-edge. */}
        <div
          aria-hidden
          className="absolute inset-y-1.5 left-4 right-0 translate-x-[5px] rounded-r-sm bg-muted ring-1 ring-border"
        />
        <div
          aria-hidden
          className="absolute inset-y-1 left-4 right-0 translate-x-[2px] rounded-r-sm bg-card ring-1 ring-border"
        />

        {/* Cover face — the only transformed layer. */}
        <div className="relative h-full w-full origin-left overflow-hidden rounded-l-sm rounded-r-lg shadow-md ring-1 ring-border transition-[transform,box-shadow] duration-500 ease-out group-hover/book:shadow-2xl motion-safe:group-hover/book:[transform:rotateY(-20deg)]">
          {entry.cover ? (
            <NextImage
              src={entry.cover.src}
              alt={entry.cover.alt}
              width={entry.cover.width}
              height={entry.cover.height}
              sizes={sizes}
              quality={90}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col justify-between bg-muted p-2 sm:p-4">
              <p className="font-heading text-caption leading-snug text-foreground sm:text-body-sm">
                {entry.title}
              </p>
              <p className="text-caption tracking-caption text-muted-foreground">
                {entry.author}
              </p>
            </div>
          )}

          {/* Spine shading along the hinge. */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-foreground/25 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
