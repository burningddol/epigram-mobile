import { Redirect, usePathname } from "expo-router";
import type { ReactElement, ReactNode } from "react";

import { useMe } from "~/entities/user";
import { LoadingState } from "~/shared/ui";

type AuthGateMode = "protected" | "auth-only";

interface AuthGateProps {
  mode: AuthGateMode;
  children: ReactNode;
}

export function AuthGate({ mode, children }: AuthGateProps): ReactElement {
  const { user, isLoading } = useMe();
  const pathname = usePathname();

  if (isLoading) return <LoadingState />;

  if (mode === "protected" && !user) {
    const redirectParam = encodeURIComponent(pathname);
    return <Redirect href={`/login?redirect=${redirectParam}`} />;
  }

  if (mode === "auth-only" && user) {
    return <Redirect href="/feeds" />;
  }

  return <>{children}</>;
}
