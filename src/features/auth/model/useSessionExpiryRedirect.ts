import { router } from "expo-router";
import { useEffect } from "react";

import { setOnSessionExpired } from "~/shared/api/client";

export function useSessionExpiryRedirect(): void {
  useEffect(() => {
    setOnSessionExpired(() => {
      router.replace("/login");
    });
    return () => {
      setOnSessionExpired(null);
    };
  }, []);
}
