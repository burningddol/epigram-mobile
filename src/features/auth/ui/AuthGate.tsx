import { useIsFocused } from "@react-navigation/native";
import { Redirect, usePathname } from "expo-router";
import { useRef, type ReactElement, type ReactNode } from "react";

import { useMe } from "~/entities/user";
import { LoadingState } from "~/shared/ui";

type AuthGateMode = "protected" | "auth-only";

interface AuthGateProps {
  mode: AuthGateMode;
  children: ReactNode;
}

// auth-only 화면이 살아있는 동안 user가 falsy → truthy로 바뀌어도
// (= 이 화면에서 로그인하는 흐름) /feeds로 자동 리다이렉트하지 않는다.
// 명시적 router.replace(target)와 race를 일으켜 사용자가 의도한 redirect 대신
// /feeds로 튕기는 문제를 막기 위함. mount 시점에 이미 로그인 상태였던 경우만
// /feeds로 보낸다.
export function AuthGate({ mode, children }: AuthGateProps): ReactElement | null {
  const { user, isLoading } = useMe();
  const pathname = usePathname();
  const isFocused = useIsFocused();
  const wasLoggedInOnMount = useRef<boolean | null>(null);

  if (!isLoading && wasLoggedInOnMount.current === null) {
    wasLoggedInOnMount.current = user !== null;
  }

  if (isLoading) return <LoadingState />;

  if (mode === "protected" && !user) {
    if (!isFocused) return null;
    const redirectParam = encodeURIComponent(pathname);
    return <Redirect href={`/login?redirect=${redirectParam}`} />;
  }

  if (mode === "auth-only" && user && wasLoggedInOnMount.current === true) {
    if (!isFocused) return null;
    return <Redirect href="/feeds" />;
  }

  return <>{children}</>;
}
