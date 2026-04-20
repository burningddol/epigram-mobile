import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

import { apiClient } from "~/shared/api/client";

interface UseCommentDeleteReturn {
  deleteComment: () => void;
  isDeleting: boolean;
}

export function useCommentDelete(
  commentId: number,
  epigramId: number,
  userId?: number,
): UseCommentDeleteReturn {
  const queryClient = useQueryClient();

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: () =>
      apiClient.delete(`/comments/${commentId}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["epigrams", epigramId, "comments"],
      });
      if (userId === undefined) return;
      queryClient.invalidateQueries({
        queryKey: ["users", userId, "comments"],
      });
    },
    onError: () => {
      Alert.alert(
        "삭제 실패",
        "댓글을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
    },
  });

  function deleteComment(): void {
    mutate();
  }

  return { deleteComment, isDeleting };
}
