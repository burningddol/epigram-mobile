import {
  useInfiniteListQuery,
  type UseInfiniteListQueryResult,
} from "~/shared/api/useInfiniteListQuery";

import { commentListResponseSchema, type Comment } from "../model/schema";
import { commentKeys } from "./keys";

interface UseRecentCommentsParams {
  limit: number;
}

export function useRecentComments({
  limit,
}: UseRecentCommentsParams): UseInfiniteListQueryResult<Comment> {
  return useInfiniteListQuery({
    queryKey: commentKeys.recent({ limit }),
    endpoint: "/comments",
    limit,
    schema: commentListResponseSchema,
  });
}
