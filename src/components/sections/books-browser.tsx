"use client";

// Client component: the genre filter holds selection state. Kept in its own
// file so `Books` (the home-page rows) stays a server component.

import { useMemo, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { BooksGrid, type BookEntry } from "@/components/sections/books";
import { cn } from "@/lib/utils";

const ALL = "All";

const PILL_CLASS =
  // Type matches the nav links (text-nav) so the two sets of controls read alike.
  "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-nav leading-nav tracking-nav transition-colors";

export function BooksBrowser({ entries }: { entries: BookEntry[] }) {
  const [selected, setSelected] = useState<string>(ALL);

  const genres = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      for (const genre of entry.genres) {
        counts.set(genre, (counts.get(genre) ?? 0) + 1);
      }
    }
    return [
      { label: ALL, count: entries.length },
      ...[...counts.entries()]
        .map(([label, count]) => ({ label, count }))
        // Biggest first, alphabetical within a tie, so the order is stable.
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
    ];
  }, [entries]);

  const filtered = useMemo(
    () =>
      selected === ALL
        ? entries
        : entries.filter((entry) => entry.genres.includes(selected)),
    [entries, selected],
  );

  return (
    <>
      <Reveal trigger="mount" className="mb-8">
        <ul className="flex flex-wrap gap-2">
          {genres.map(({ label, count }) => {
            const isActive = label === selected;
            return (
              <li key={label}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelected(label)}
                  className={cn(
                    PILL_CLASS,
                    isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      "text-caption tracking-caption",
                      isActive ? "text-background/70" : "text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Reveal>

      {/* Remounting on `selected` replays the stagger for the new set. */}
      <BooksGrid key={selected} entries={filtered} trigger="mount" />
    </>
  );
}
