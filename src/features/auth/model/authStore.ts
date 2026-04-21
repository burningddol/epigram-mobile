import { create } from "zustand";

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
} from "~/shared/api/tokenStorage";

type AuthStatus = "unknown" | "authenticated" | "unauthenticated";

interface AuthStore {
  status: AuthStatus;
  initialize: () => Promise<void>;
  setAuthenticated: () => void;
  setUnauthenticated: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  status: "unknown",
  initialize: async () => {
    const [access, refresh] = await Promise.all([
      getAccessToken(),
      getRefreshToken(),
    ]);
    const hasToken = Boolean(access) || Boolean(refresh);
    set({ status: hasToken ? "authenticated" : "unauthenticated" });
  },
  setAuthenticated: () => set({ status: "authenticated" }),
  setUnauthenticated: async () => {
    await clearTokens();
    set({ status: "unauthenticated" });
  },
}));
