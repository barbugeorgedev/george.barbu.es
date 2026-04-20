/** Human-readable duration after a date range, e.g. " (3 years)" or " (8 months)" */
export function formatDurationLabel(
  startDate?: string,
  endDate?: string,
  presentDate?: boolean
): string {
  if (!startDate) return "";
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return "";
  const end = presentDate ? new Date() : endDate ? new Date(endDate) : null;
  if (!end || isNaN(end.getTime())) return "";
  const diffMs = end.getTime() - start.getTime();
  if (diffMs < 0) return "";
  const yearsFloat = diffMs / (365.25 * 24 * 60 * 60 * 1000);
  if (yearsFloat < 1) {
    const months = Math.max(1, Math.round(diffMs / (30.4375 * 24 * 60 * 60 * 1000)));
    if (months >= 12) return " (1 year)";
    if (months === 1) return " (1 month)";
    return ` (${months} months)`;
  }
  const rounded = Math.round(yearsFloat * 10) / 10;
  if (rounded === Math.floor(rounded)) {
    const y = Math.round(rounded);
    return y === 1 ? " (1 year)" : ` (${y} years)`;
  }
  return ` (${rounded.toFixed(1).replace(".", ",")} years)`;
}
