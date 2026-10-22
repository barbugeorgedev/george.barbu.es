const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Sanity date "2025-07-01" → "Jul 2025". Parsed from the string, so the time zone never shifts the month. */
export function formatMonthYear(dateString?: string): string {
  const match = /^(\d{4})-(\d{2})/.exec(dateString?.trim() ?? "");
  if (!match) return "";
  const month = MONTHS[Number(match[2]) - 1];
  return month ? `${month} ${match[1]}` : match[1]!;
}

/** Sanity date "2024-01-01" → "2024", for entries where the month is not meaningful. */
export function formatYear(dateString?: string): string {
  return /^(\d{4})/.exec(dateString?.trim() ?? "")?.[1] ?? "";
}

/**
 * "Jul 2025 – Present" (ATS parsers read month/year ranges more reliably than years alone).
 * An entry without a start date (freelance alongside employment, ventures) gets no range at all.
 */
export function formatDateRange(
  startDate?: string,
  endDate?: string,
  presentDate?: boolean,
  format: (date?: string) => string = formatMonthYear,
): string {
  const start = format(startDate);
  if (!start) return "";
  const end = presentDate ? "Present" : format(endDate);
  return end ? `${start} – ${end}` : start;
}
