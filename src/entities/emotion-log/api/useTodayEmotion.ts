import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { apiClient } from "~/shared/api/client";

import { emotionLogSchema, type EmotionLog } from "../model/schema";
import { emotionLogKeys } from "./keys";

export function useTodayEmotion(
  userId: number,
): UseQueryResult<EmotionLog | null, Error> {
  return useQuery({
    queryKey: emotionLogKeys.today(userId),
    enabled: userId > 0,
    queryFn: async () => {
      const response = await apiClient.get<unknown>("/emotionLogs/today", {
        params: { userId },
      });
      if (response.data == null || typeof response.data !== "object")
        return null;
      return emotionLogSchema.parse(response.data);
    },
  });
}
