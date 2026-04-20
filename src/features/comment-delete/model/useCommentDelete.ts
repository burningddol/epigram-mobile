import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

import { apiClient } from "~/shared/api/client";

interface UseCommentDeleteReturn {
  handleDeleteClick: () => void;
  isDeleting: boolean;
}

export function useCommentDelete(
  commentId: number,
  epigramId: number,
  userId?: number,
): UseCommentDeleteReturn {
  const queryClient = useQueryClient();

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: () => apiClient.delete(`/comments/${commentId}`).then((res) => res.data),
    onSuccess: async () => {
      const invalidations = [
        queryClient.invalidateQueries({ queryKey: ["epigrams", epigramId, "comments"] }),
      ];
      if (userId !== undefined) {
        invalidations.push(
          queryClient.invalidateQueries({ queryKey: ["users", userId, "comments"] }),
        );
      }
      await Promise.all(invalidations);
    },
    onError: () => {
      Alert.alert("삭제 실패", "댓글을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.");
    },
  });

  function handleDeleteClick(): void {
    Alert.alert(
      "댓글을 삭제할까요?",
      undefined,
      [
        { text: "취소", style: "cancel" },
        { text: "삭제", style: "destructive", onPress: () => mutate() },
      ],
      { cancelable: true },
    );
  }

  return { handleDeleteClick, isDeleting };
}
