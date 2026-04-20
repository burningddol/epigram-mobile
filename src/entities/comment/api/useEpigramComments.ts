import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";

import { apiClient } from "~/shared/api/client";

import {
  commentListResponseSchema,
  type CommentListResponse,
} from "../model/schema";
import { commentKeys } from "./keys";

interface UseEpigramCommentsParams {
  epigramId: number;
  limit: number;
}

export function useEpigramComments({
  epigramId,
  limit,
}: UseEpigramCommentsParams): UseInfiniteQueryResult<
  InfiniteData<CommentListResponse, number | undefined>,
  Error
> {
  return useInfiniteQuery({
    queryKey: commentKeys.byEpigramList(epigramId, { limit }),
    enabled: epigramId > 0,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ limit: String(limit) });
      if (pageParam !== undefined) params.set("cursor", String(pageParam));

      const response = await apiClient.get<unknown>(
        `/epigrams/${epigramId}/comments?${params}`,
      );
      return commentListResponseSchema.parse(response.data);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
