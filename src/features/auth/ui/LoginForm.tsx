import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams, type Href } from "expo-router";
import type { ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { signIn, userKeys } from "~/entities/user";
import { Button, Input } from "~/shared/ui";

import { useAuthStore } from "../model/authStore";
import { loginSchema, type LoginFormValues } from "../model/loginSchema";

const DEFAULT_VALUES: LoginFormValues = { email: "", password: "" };
const DEFAULT_REDIRECT: Href = "/feeds";

function resolveRedirectTarget(redirect: string | undefined): Href {
  if (!redirect) return DEFAULT_REDIRECT;
  try {
    const decoded = decodeURIComponent(redirect);
    if (decoded.startsWith("/")) return decoded as Href;
    return DEFAULT_REDIRECT;
  } catch {
    return DEFAULT_REDIRECT;
  }
}

export function LoginForm(): ReactElement {
  const queryClient = useQueryClient();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: DEFAULT_VALUES,
  });

  async function onSubmit(data: LoginFormValues): Promise<void> {
    try {
      const { user } = await signIn(data);
      queryClient.setQueryData(userKeys.me(), user);
      useAuthStore.getState().setAuthenticated();
      router.replace(resolveRedirectTarget(redirect));
    } catch {
      const message = "이메일 혹은 비밀번호를 확인해주세요.";
      setError("email", { message });
      setError("password", { message });
    }
  }

  return (
    <View className="w-full gap-5">
      <View className="gap-[10px]">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="이메일"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              accessibilityLabel="이메일"
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="비밀번호"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
              accessibilityLabel="비밀번호"
              error={errors.password?.message}
            />
          )}
        />
      </View>
      <Button onPress={handleSubmit(onSubmit)} isLoading={isSubmitting}>
        로그인
      </Button>
    </View>
  );
}
