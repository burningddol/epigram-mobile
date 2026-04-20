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

interface UseRecentCommentsParams {
  limit: number;
}

export function useRecentComments({
  limit,
}: UseRecentCommentsParams): UseInfiniteQueryResult<
  InfiniteData<CommentListResponse, number | undefined>,
  Error
> {
  return useInfiniteQuery({
    queryKey: commentKeys.recent({ limit }),
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ limit: String(limit) });
      if (pageParam !== undefined) params.set("cursor", String(pageParam));

      const response = await apiClient.get<unknown>(`/comments?${params}`);
      return commentListResponseSchema.parse(response.data);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
