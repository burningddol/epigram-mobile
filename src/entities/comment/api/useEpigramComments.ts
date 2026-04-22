import {
  useInfiniteListQuery,
  type UseInfiniteListQueryResult,
} from "~/shared/api/useInfiniteListQuery";

import { commentListResponseSchema, type Comment } from "../model/schema";
import { commentKeys } from "./keys";

interface UseEpigramCommentsParams {
  epigramId: number;
  limit: number;
}

export interface UseEpigramCommentsResult
  extends Omit<UseInfiniteListQueryResult<Comment>, "items"> {
  comments: Comment[];
}

export function useEpigramComments({
  epigramId,
  limit,
}: UseEpigramCommentsParams): UseEpigramCommentsResult {
  const { items, ...rest } = useInfiniteListQuery({
    queryKey: commentKeys.byEpigramList(epigramId, { limit }),
    endpoint: `/epigrams/${epigramId}/comments`,
    limit,
    schema: commentListResponseSchema,
    enabled: epigramId > 0,
  });

  return { ...rest, comments: items };
}
