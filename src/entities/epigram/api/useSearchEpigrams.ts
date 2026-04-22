import {
  useInfiniteListQuery,
  type UseInfiniteListQueryResult,
} from "~/shared/api/useInfiniteListQuery";

import { epigramListResponseSchema, type Epigram } from "../model/schema";
import { epigramKeys } from "./keys";

interface UseSearchEpigramsParams {
  keyword: string;
  limit: number;
}

export function useSearchEpigrams({
  keyword,
  limit,
}: UseSearchEpigramsParams): UseInfiniteListQueryResult<Epigram> {
  return useInfiniteListQuery({
    queryKey: epigramKeys.search(keyword),
    endpoint: "/epigrams",
    limit,
    schema: epigramListResponseSchema,
    searchParams: { keyword },
    enabled: keyword.trim().length > 0,
  });
}
