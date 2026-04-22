import {
  useInfiniteListQuery,
  type UseInfiniteListQueryResult,
} from "~/shared/api/useInfiniteListQuery";

import { epigramListResponseSchema, type Epigram } from "../model/schema";
import { epigramKeys } from "./keys";

interface UseEpigramsParams {
  limit: number;
  keyword?: string;
  writerId?: number;
}

export function useEpigrams({
  limit,
  keyword,
  writerId,
}: UseEpigramsParams): UseInfiniteListQueryResult<Epigram> {
  const searchParams: Record<string, string | number> = {};
  if (keyword) searchParams.keyword = keyword;
  if (writerId !== undefined) searchParams.writerId = writerId;

  return useInfiniteListQuery({
    queryKey: epigramKeys.list({ limit, keyword, writerId }),
    endpoint: "/epigrams",
    limit,
    schema: epigramListResponseSchema,
    searchParams,
  });
}
