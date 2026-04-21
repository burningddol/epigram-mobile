import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  emotionLogKeys,
  postTodayEmotion,
  useTodayEmotion,
  type Emotion,
  type EmotionLog,
} from "~/entities/emotion-log";
import { useMe } from "~/entities/user";

interface UseEmotionSelectReturn {
  todayEmotion: Emotion | null;
  isSubmitting: boolean;
  selectEmotion: (emotion: Emotion) => void;
}

export function useEmotionSelect(): UseEmotionSelectReturn {
  const { user } = useMe();
  const queryClient = useQueryClient();
  const userId = user?.id ?? 0;
  const todayKey = emotionLogKeys.today(userId);

  const { data: todayLog } = useTodayEmotion(userId);

  const { mutate, isPending } = useMutation({
    mutationFn: postTodayEmotion,
    onMutate: async (emotion) => {
      await queryClient.cancelQueries({ queryKey: todayKey });
      const previous = queryClient.getQueryData<EmotionLog | null>(todayKey);
      queryClient.setQueryData<EmotionLog | null>(todayKey, (old) =>
        old != null ? { ...old, emotion } : old,
      );
      return { previous };
    },
    onError: (_err, _emotion, context) => {
      queryClient.setQueryData(todayKey, context?.previous);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: emotionLogKeys.all });
    },
  });

  return {
    todayEmotion: todayLog?.emotion ?? null,
    isSubmitting: isPending,
    selectEmotion: mutate,
  };
}
