import { useLocalSearchParams } from "expo-router";
import { useState, type ReactElement } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { signIn } from "~/entities/user";
import { cn } from "~/shared/lib/cn";

import { resolveRedirectTarget } from "../lib/resolveRedirectTarget";
import { useAuthMutation } from "../model/useAuthMutation";

const GUEST_CREDENTIALS = {
  email: "guest13325@naver.com",
  password: "@qwer1234",
} as const;

export function GuestLoginButton(): ReactElement {
  const { handleAuthSuccess } = useAuthMutation();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGuestLogin(): Promise<void> {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn(GUEST_CREDENTIALS);
      handleAuthSuccess(result, resolveRedirectTarget(redirect));
    } catch {
      setError("게스트 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="gap-1">
      <Pressable
        onPress={handleGuestLogin}
        disabled={isLoading}
        accessibilityRole="button"
        accessibilityLabel="게스트로 둘러보기"
        accessibilityState={{ busy: isLoading, disabled: isLoading }}
        className={cn(
          "h-touch-lg items-center justify-center rounded-xl border border-blue-400 bg-surface active:bg-blue-200",
          isLoading && "opacity-60",
        )}
      >
        {isLoading ? (
          <ActivityIndicator color="#6a82a9" />
        ) : (
          <Text className="font-sans text-base font-semibold text-blue-600">
            게스트로 둘러보기
          </Text>
        )}
      </Pressable>
      {error !== null && (
        <Text className="font-sans text-xs text-error">{error}</Text>
      )}
    </View>
  );
}
