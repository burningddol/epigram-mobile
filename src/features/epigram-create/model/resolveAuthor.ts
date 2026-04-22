import {
  AUTHOR_TYPE,
  UNKNOWN_AUTHOR,
  type EpigramCreateFormValues,
} from "./schema";

const SELF_FALLBACK = "본인";

export function resolveAuthor(
  values: EpigramCreateFormValues,
  userNickname?: string,
): string {
  if (values.authorType === AUTHOR_TYPE.UNKNOWN) return UNKNOWN_AUTHOR;
  if (values.authorType === AUTHOR_TYPE.SELF) {
    return userNickname ?? values.authorName ?? SELF_FALLBACK;
  }
  return values.authorName ?? "";
}
