import { router } from "expo-router";
import { useEffect } from "react";

import { setOnSessionExpired } from "~/shared/api/client";

import { useAuthStore } from "./authStore";

export function useSessionExpiryRedirect(): void {
  useEffect(() => {
    setOnSessionExpired(() => {
      void useAuthStore.getState().setUnauthenticated();
      router.replace("/login");
    });
    return () => {
      setOnSessionExpired(null);
    };
  }, []);
}
