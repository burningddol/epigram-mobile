import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect } from "react";

import { userKeys } from "~/entities/user";
import { setOnSessionExpired } from "~/shared/api/client";

export function useSessionExpiryRedirect(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    setOnSessionExpired(() => {
      queryClient.removeQueries({ queryKey: userKeys.me() });
      router.replace("/login");
    });
    return () => {
      setOnSessionExpired(null);
    };
  }, [queryClient]);
}
