import { useQuery } from "@tanstack/react-query";

import { type User } from "../model/schema";
import { userKeys } from "./keys";
import { getMe } from "./user";

export function useMe(): { user: User | null; isLoading: boolean } {
  const { data, isLoading } = useQuery<User | null, Error>({
    queryKey: userKeys.me(),
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
  });

  return { user: data ?? null, isLoading };
}
