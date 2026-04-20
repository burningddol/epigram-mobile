import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

import { createEpigram, epigramKeys } from "~/entities/epigram";
import { useTagInput } from "~/shared/hooks/useTagInput";

import { AUTHOR_TYPE, type EpigramCreateFormValues } from "./schema";

interface UseEpigramCreateReturn {
  tagInput: string;
  isSubmitting: boolean;
  hasError: boolean;
  handleTagInputChange: (value: string) => void;
  handleAddTag: (
    currentTags: string[],
    onChange: (tags: string[]) => void,
  ) => void;
  handleRemoveTag: (
    tag: string,
    currentTags: string[],
    onChange: (tags: string[]) => void,
  ) => void;
  submit: (values: EpigramCreateFormValues) => void;
}

function resolveAuthor(
  values: EpigramCreateFormValues,
  userNickname: string | undefined,
): string {
  if (values.authorType === AUTHOR_TYPE.UNKNOWN) return "알 수 없음";
  if (values.authorType === AUTHOR_TYPE.SELF) return userNickname ?? "본인";
  return values.authorName ?? "";
}

export function useEpigramCreate(
  userNickname?: string,
): UseEpigramCreateReturn {
  const queryClient = useQueryClient();
  const { tagInput, handleTagInputChange, handleAddTag, handleRemoveTag } =
    useTagInput();

  const {
    mutate,
    isPending: isSubmitting,
    isError: hasError,
  } = useMutation({
    mutationFn: (values: EpigramCreateFormValues) =>
      createEpigram({
        content: values.content,
        author: resolveAuthor(values, userNickname),
        referenceTitle: values.referenceTitle?.trim() || undefined,
        referenceUrl: values.referenceUrl?.trim() || undefined,
        tags: values.tags,
      }),
    onSuccess: (epigram) => {
      queryClient.invalidateQueries({ queryKey: epigramKeys.all });
      router.replace(`/epigrams/${epigram.id}`);
    },
  });

  function submit(values: EpigramCreateFormValues): void {
    mutate(values);
  }

  return {
    tagInput,
    isSubmitting,
    hasError,
    handleTagInputChange,
    handleAddTag,
    handleRemoveTag,
    submit,
  };
}
