import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  commentKeys,
  updateComment,
  type UpdateCommentBody,
} from "~/entities/comment";

interface UseCommentEditParams {
  commentId: number;
  epigramId: number;
  initialContent: string;
  initialIsPrivate: boolean;
  onCancel: () => void;
}

interface UseCommentEditReturn {
  content: string;
  isPrivate: boolean;
  isSubmitting: boolean;
  hasError: boolean;
  canSubmit: boolean;
  setContent: (value: string) => void;
  handlePrivateToggle: () => void;
  handleSubmit: () => void;
  handleCancel: () => void;
}

export function useCommentEdit({
  commentId,
  epigramId,
  initialContent,
  initialIsPrivate,
  onCancel,
}: UseCommentEditParams): UseCommentEditReturn {
  const queryClient = useQueryClient();
  const [content, setContent] = useState(initialContent);
  const [isPrivate, setIsPrivate] = useState(initialIsPrivate);

  const {
    mutate,
    isPending: isSubmitting,
    isError: hasError,
  } = useMutation({
    mutationFn: (body: UpdateCommentBody) => updateComment(commentId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.byEpigram(epigramId),
      });
      onCancel();
    },
  });

  const canSubmit = content.trim().length > 0;

  function handlePrivateToggle(): void {
    setIsPrivate((prev) => !prev);
  }

  function handleSubmit(): void {
    const trimmed = content.trim();
    if (!trimmed) return;
    mutate({ content: trimmed, isPrivate });
  }

  function handleCancel(): void {
    setContent(initialContent);
    setIsPrivate(initialIsPrivate);
    onCancel();
  }

  return {
    content,
    isPrivate,
    isSubmitting,
    hasError,
    canSubmit,
    setContent,
    handlePrivateToggle,
    handleSubmit,
    handleCancel,
  };
}
