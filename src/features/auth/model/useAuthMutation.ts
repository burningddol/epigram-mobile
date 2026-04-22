import { useQueryClient } from "@tanstack/react-query";
import { router, type Href } from "expo-router";
import { useCallback } from "react";

import { userKeys, type User } from "~/entities/user";

interface AuthResult {
  user: User;
}

interface UseAuthMutationResult {
  handleAuthSuccess: (result: AuthResult, redirectTo?: Href) => void;
}

const DEFAULT_REDIRECT: Href = "/feeds";

export function useAuthMutation(): UseAuthMutationResult {
  const queryClient = useQueryClient();

  const handleAuthSuccess = useCallback(
    ({ user }: AuthResult, redirectTo?: Href): void => {
      queryClient.setQueryData(userKeys.me(), user);
      router.replace(redirectTo ?? DEFAULT_REDIRECT);
    },
    [queryClient],
  );

  return { handleAuthSuccess };
}
