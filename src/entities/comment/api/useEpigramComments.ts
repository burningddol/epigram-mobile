import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { apiClient } from "~/shared/api/client";

import { commentListResponseSchema, type Comment } from "../model/schema";
import { commentKeys } from "./keys";

interface UseEpigramCommentsParams {
  epigramId: number;
  limit: number;
}

interface UseEpigramCommentsResult {
  comments: Comment[];
  totalCount: number | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export function useEpigramComments({
  epigramId,
  limit,
}: UseEpigramCommentsParams): UseEpigramCommentsResult {
  const query = useInfiniteQuery({
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

  const comments = useMemo(
    () => query.data?.pages.flatMap((page) => page.list) ?? [],
    [query.data?.pages],
  );

  return {
    comments,
    totalCount: query.data?.pages[0]?.totalCount,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
