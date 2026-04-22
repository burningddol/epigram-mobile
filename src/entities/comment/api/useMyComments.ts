import {
  useInfiniteListQuery,
  type UseInfiniteListQueryResult,
} from "~/shared/api/useInfiniteListQuery";

import { commentListResponseSchema, type Comment } from "../model/schema";
import { commentKeys } from "./keys";

interface UseMyCommentsParams {
  userId: number;
  limit: number;
}

export function useMyComments({
  userId,
  limit,
}: UseMyCommentsParams): UseInfiniteListQueryResult<Comment> {
  return useInfiniteListQuery({
    queryKey: commentKeys.byUserList(userId, { limit }),
    endpoint: `/users/${userId}/comments`,
    limit,
    schema: commentListResponseSchema,
    enabled: userId > 0,
  });
}
