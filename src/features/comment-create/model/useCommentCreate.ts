import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { commentKeys, createComment } from "~/entities/comment";

interface UseCommentCreateParams {
  epigramId: number;
  userId?: number;
}

interface UseCommentCreateReturn {
  content: string;
  isPrivate: boolean;
  isSubmitting: boolean;
  hasError: boolean;
  canSubmit: boolean;
  handleContentChange: (value: string) => void;
  handlePrivateToggle: () => void;
  handleSubmit: () => void;
}

export function useCommentCreate({
  epigramId,
  userId,
}: UseCommentCreateParams): UseCommentCreateReturn {
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const {
    mutate,
    isPending: isSubmitting,
    isError: hasError,
    reset,
  } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.byEpigram(epigramId),
      });
      if (userId !== undefined) {
        queryClient.invalidateQueries({
          queryKey: commentKeys.byUser(userId),
        });
      }
      setContent("");
      setIsPrivate(false);
    },
  });

  const canSubmit = content.trim().length > 0;

  function handleContentChange(value: string): void {
    setContent(value);
    if (hasError) reset();
  }

  function handlePrivateToggle(): void {
    setIsPrivate((prev) => !prev);
  }

  function handleSubmit(): void {
    const trimmed = content.trim();
    if (!trimmed) return;
    mutate({ epigramId, isPrivate, content: trimmed });
  }

  return {
    content,
    isPrivate,
    isSubmitting,
    hasError,
    canSubmit,
    handleContentChange,
    handlePrivateToggle,
    handleSubmit,
  };
}
