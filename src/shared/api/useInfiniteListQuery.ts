import { useInfiniteQuery, type QueryKey } from "@tanstack/react-query";
import { useMemo } from "react";
import type { z, ZodTypeAny } from "zod";

import type { PaginatedSchemaOf } from "~/shared/types/pagination";

import { apiClient } from "./client";

interface UseInfiniteListQueryParams<TItem extends ZodTypeAny> {
  queryKey: QueryKey;
  endpoint: string;
  limit: number;
  schema: PaginatedSchemaOf<TItem>;
  searchParams?: Record<string, string | number>;
  enabled?: boolean;
}

export interface UseInfiniteListQueryResult<TItem> {
  items: TItem[];
  totalCount: number | undefined;
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export function useInfiniteListQuery<TItem extends ZodTypeAny>({
  queryKey,
  endpoint,
  limit,
  schema,
  searchParams,
  enabled = true,
}: UseInfiniteListQueryParams<TItem>): UseInfiniteListQueryResult<
  z.infer<TItem>
> {
  const query = useInfiniteQuery({
    queryKey,
    enabled,
    queryFn: async ({ pageParam }) => {
      const sp = new URLSearchParams({ limit: String(limit) });
      if (pageParam !== undefined) sp.set("cursor", String(pageParam));
      if (searchParams) {
        for (const [key, value] of Object.entries(searchParams)) {
          sp.set(key, String(value));
        }
      }
      const response = await apiClient.get<unknown>(`${endpoint}?${sp}`);
      return schema.parse(response.data);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.list) ?? [],
    [query.data?.pages],
  );

  return {
    items,
    totalCount: query.data?.pages[0]?.totalCount,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
