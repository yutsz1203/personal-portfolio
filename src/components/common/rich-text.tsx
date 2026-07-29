import { Fragment } from "react";

import type { RichText as RichTextValue } from "@/content/types";

export function toPlainText(value: RichTextValue): string {
  return value.map((segment) => segment.text).join("");
}

export function RichText({ value }: { value: RichTextValue }) {
  return (
    <>
      {value.map((segment, index) => {
        const text = segment.bold ? (
          <strong className="font-semibold text-foreground">
            {segment.text}
          </strong>
        ) : (
          segment.text
        );

        if (segment.href) {
          return (
            <a
              key={index}
              href={segment.href}
              target="_blank"
              rel="noreferrer"
              className="underline transition-colors hover:text-accent-clay"
            >
              {text}
            </a>
          );
        }

        return <Fragment key={index}>{text}</Fragment>;
      })}
    </>
  );
}
