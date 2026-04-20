import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import type { ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { signIn } from "~/entities/user";
import { Button, Input } from "~/shared/ui";

import { loginSchema, type LoginFormValues } from "../model/loginSchema";

const DEFAULT_VALUES: LoginFormValues = { email: "", password: "" };

export function LoginForm(): ReactElement {
  const queryClient = useQueryClient();
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
      queryClient.setQueryData(["me"], user);
      router.replace("/(tabs)");
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
