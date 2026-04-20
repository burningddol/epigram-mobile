function requireEnv(key: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`환경변수 ${key}가 설정되지 않았습니다. .env.local을 확인하세요.`);
  }
  return value;
}

export const env = {
  apiBase: requireEnv("EXPO_PUBLIC_API_BASE", process.env.EXPO_PUBLIC_API_BASE),
  teamId: requireEnv("EXPO_PUBLIC_TEAM_ID", process.env.EXPO_PUBLIC_TEAM_ID),
} as const;
