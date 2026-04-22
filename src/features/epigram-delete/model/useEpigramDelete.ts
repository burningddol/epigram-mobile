import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

import { deleteEpigram, epigramKeys } from "~/entities/epigram";

interface UseEpigramDeleteOptions {
  onSuccess?: () => void;
}

interface UseEpigramDeleteReturn {
  handleDelete: () => void;
  isDeleting: boolean;
}

export function useEpigramDelete(
  epigramId: number,
  { onSuccess }: UseEpigramDeleteOptions = {},
): UseEpigramDeleteReturn {
  const queryClient = useQueryClient();

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteEpigram(epigramId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: epigramKeys.all });
      onSuccess?.();
    },
    onError: () => {
      Alert.alert(
        "삭제 실패",
        "에피그램을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
    },
  });

  function handleDelete(): void {
    Alert.alert(
      "에피그램을 삭제할까요?",
      "삭제 후에는 복구할 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        { text: "삭제", style: "destructive", onPress: () => mutate() },
      ],
      { cancelable: true },
    );
  }

  return { handleDelete, isDeleting };
}
