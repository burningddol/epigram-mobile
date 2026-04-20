import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

import { epigramKeys, updateEpigram } from "~/entities/epigram";
import {
  AUTHOR_TYPE,
  type EpigramCreateFormValues,
} from "~/features/epigram-create";
import { useTagInput } from "~/shared/hooks/useTagInput";

interface UseEpigramEditReturn {
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
  handleCancel: () => void;
  submit: (values: EpigramCreateFormValues) => void;
}

function resolveAuthor(values: EpigramCreateFormValues): string {
  if (values.authorType === AUTHOR_TYPE.UNKNOWN) return "알 수 없음";
  if (values.authorType === AUTHOR_TYPE.SELF)
    return values.authorName ?? "본인";
  return values.authorName ?? "";
}

export function useEpigramEdit(epigramId: number): UseEpigramEditReturn {
  const queryClient = useQueryClient();
  const { tagInput, handleTagInputChange, handleAddTag, handleRemoveTag } =
    useTagInput();

  const {
    mutate,
    isPending: isSubmitting,
    isError: hasError,
  } = useMutation({
    mutationFn: (values: EpigramCreateFormValues) =>
      updateEpigram(epigramId, {
        content: values.content,
        author: resolveAuthor(values),
        referenceTitle: values.referenceTitle?.trim() || undefined,
        referenceUrl: values.referenceUrl?.trim() || undefined,
        tags: values.tags,
      }),
    onSuccess: (epigram) => {
      queryClient.invalidateQueries({ queryKey: epigramKeys.all });
      queryClient.invalidateQueries({
        queryKey: epigramKeys.detail(epigramId),
      });
      router.replace(`/epigrams/${epigram.id}`);
    },
  });

  function handleCancel(): void {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(`/epigrams/${epigramId}`);
  }

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
    handleCancel,
    submit,
  };
}
