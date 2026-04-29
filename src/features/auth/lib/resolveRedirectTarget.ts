import type { Href } from "expo-router";

const DEFAULT_REDIRECT: Href = "/feeds";

// open redirect 방지: 디코딩 후 절대 경로(`/`로 시작)만 허용한다.
export function resolveRedirectTarget(redirect: string | undefined): Href {
  if (!redirect) return DEFAULT_REDIRECT;
  try {
    const decoded = decodeURIComponent(redirect);
    if (decoded.startsWith("/")) return decoded as Href;
    return DEFAULT_REDIRECT;
  } catch {
    return DEFAULT_REDIRECT;
  }
}
