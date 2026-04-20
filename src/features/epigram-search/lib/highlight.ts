const REGEX_ESCAPE_PATTERN = /[.*+?^${}()|[\]\\]/g;

export function buildHighlightRegex(keyword: string): RegExp | null {
  const trimmed = keyword.trim();
  if (!trimmed) return null;
  const escaped = trimmed.replace(REGEX_ESCAPE_PATTERN, "\\$&");
  return new RegExp(`(${escaped})`, "i");
}
