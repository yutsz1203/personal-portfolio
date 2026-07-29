export type TimelineEntry = {
  date: string;
  title: string;
  titleUrl?: string;
  subtitle: string;
  bullets?: string[];
  tags?: string[];
};

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative ml-1 border-l border-border">
      {entries.map((entry) => (
        <li key={`${entry.title}-${entry.date}`} className="relative pb-10 pl-6 last:pb-0">
          <span
            aria-hidden
            className="absolute top-2 -left-[4.5px] size-2 rounded-full bg-muted-foreground"
          />

          <p className="text-caption tracking-caption text-muted-foreground uppercase">
            {entry.date}
          </p>

          <h3 className="mt-1.5 font-heading text-subheading leading-subheading">
            {entry.titleUrl ? (
              <a
                href={entry.titleUrl}
                target="_blank"
                rel="noreferrer"
                className="no-underline transition-colors hover:text-accent-clay hover:underline"
              >
                {entry.title}
              </a>
            ) : (
              entry.title
            )}
          </h3>

          <p className="text-body-sm text-muted-foreground">{entry.subtitle}</p>

          {entry.bullets ? (
            <ul className="mt-3 flex flex-col gap-1.5">
              {entry.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="relative pl-4 text-body-sm leading-relaxed before:absolute before:left-0 before:text-muted-foreground before:content-['—']"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}

          {entry.tags ? (
            <p className="mt-3 text-caption tracking-caption text-muted-foreground">
              {entry.tags.join(" · ")}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
