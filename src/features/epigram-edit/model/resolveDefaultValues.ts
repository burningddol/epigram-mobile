import { type EpigramDetail } from "~/entities/epigram";
import {
  AUTHOR_TYPE,
  UNKNOWN_AUTHOR,
  type EpigramCreateFormValues,
} from "~/features/epigram-create";

export function resolveDefaultValues(
  epigram: EpigramDetail,
): EpigramCreateFormValues {
  const isUnknown = epigram.author === UNKNOWN_AUTHOR;
  return {
    content: epigram.content,
    authorType: isUnknown ? AUTHOR_TYPE.UNKNOWN : AUTHOR_TYPE.DIRECT,
    authorName: isUnknown ? "" : epigram.author,
    referenceTitle: epigram.referenceTitle ?? "",
    referenceUrl: epigram.referenceUrl ?? "",
    tags: epigram.tags.map((tag) => tag.name),
  };
}
