import type { MotionTrigger } from "@/components/motion/reveal";
import { StaggerItem, StaggerList } from "@/components/motion/stagger-list";
import {
  BookCover,
  formatByline,
  formatGenres,
  formatReadYearLong,
} from "@/components/sections/book-cover";
import type { Book } from "@/content/types";

export type BookEntry = Pick<
  Book,
  "title" | "author" | "cover" | "readYear" | "genres"
>;

/** Home-page teaser: one row per book, metadata left, cover right. */
export function Books({
  entries,
  trigger = "view",
}: {
  entries: BookEntry[];
  trigger?: MotionTrigger;
}) {
  return (
    <StaggerList
      stagger={0.2}
      delay={0.15}
      trigger={trigger}
      as="ul"
      className="flex flex-col gap-2"
    >
      {entries.map((entry) => (
        <StaggerItem
          as="li"
          key={entry.title}
          className="-mx-4 flex flex-row items-center gap-5 rounded-xl p-4 transition-colors hover:bg-card sm:gap-8"
        >
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-subheading leading-subheading">
              {entry.title}
            </h3>
            <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">
              {entry.author}
            </p>
            <p className="mt-3 text-caption leading-caption tracking-caption text-muted-foreground">
              {formatReadYearLong(entry.readYear)} · {formatGenres(entry)}
            </p>
          </div>
          <BookCover
            entry={entry}
            sizes="(min-width: 640px) 10rem, 8rem"
            className="w-32 shrink-0 sm:w-40"
          />
        </StaggerItem>
      ))}
    </StaggerList>
  );
}

export function BooksGrid({
  entries,
  trigger = "view",
}: {
  entries: BookEntry[];
  trigger?: MotionTrigger;
}) {
  return (
    <StaggerList
      stagger={0.08}
      delay={0.15}
      trigger={trigger}
      as="ul"
      className="grid grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:gap-x-8"
    >
      {entries.map((entry) => (
        <StaggerItem
          as="li"
          key={entry.title}
          className="flex flex-col gap-3 sm:gap-4"
        >
          <BookCover entry={entry} />
          <div className="text-center">
            <h3 className="font-heading text-caption leading-snug text-foreground sm:text-body-sm">
              {entry.title}
            </h3>
            <p className="mt-1 text-caption leading-caption tracking-caption text-muted-foreground">
              {formatByline(entry)}
            </p>
            <p className="mt-0.5 text-caption leading-caption tracking-caption text-muted-foreground">
              {formatGenres(entry)}
            </p>
          </div>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}
