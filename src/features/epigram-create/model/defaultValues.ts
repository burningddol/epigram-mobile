import { AUTHOR_TYPE, type EpigramCreateFormValues } from "./schema";

export const EPIGRAM_CREATE_DEFAULT_VALUES: EpigramCreateFormValues = {
  content: "",
  authorType: AUTHOR_TYPE.DIRECT,
  authorName: "",
  referenceTitle: "",
  referenceUrl: "",
  tags: [],
};
