import { Redirect, usePathname } from "expo-router";
import type { ReactElement, ReactNode } from "react";

import { LoadingState } from "~/shared/ui";

import { useAuthStore } from "../model/authStore";

type AuthGateMode = "protected" | "auth-only";

interface AuthGateProps {
  mode: AuthGateMode;
  children: ReactNode;
}

export function AuthGate({ mode, children }: AuthGateProps): ReactElement {
  const status = useAuthStore((s) => s.status);
  const pathname = usePathname();

  if (status === "unknown") return <LoadingState />;

  if (mode === "protected" && status !== "authenticated") {
    const redirectParam = encodeURIComponent(pathname);
    return <Redirect href={`/login?redirect=${redirectParam}`} />;
  }

  if (mode === "auth-only" && status === "authenticated") {
    return <Redirect href="/feeds" />;
  }

  return <>{children}</>;
}
