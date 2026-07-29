import type { DateRange } from "@/content/types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  const index = Number(month) - 1;

  if (!year || !MONTHS[index]) {
    return value;
  }

  return `${MONTHS[index]} ${year}`;
}

export function formatDateRange(range: DateRange): string {
  const end = range.end === null ? "Present" : formatMonth(range.end);

  return `${formatMonth(range.start)} – ${end}`;
}