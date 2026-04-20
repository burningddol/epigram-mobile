import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import type { ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { signUp } from "~/entities/user";
import { Button, Input } from "~/shared/ui";

import { signUpSchema, type SignUpFormValues } from "../model/signUpSchema";

const DEFAULT_VALUES: SignUpFormValues = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirmation: "",
};

export function SignUpForm(): ReactElement {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: DEFAULT_VALUES,
  });

  async function onSubmit(data: SignUpFormValues): Promise<void> {
    try {
      const { user } = await signUp(data);
      queryClient.setQueryData(["me"], user);
      router.replace("/(tabs)");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 500) {
        setError("nickname", { message: "이미 사용 중인 닉네임입니다." });
        return;
      }
      setError("email", { message: "회원가입에 실패했습니다. 다시 시도해주세요." });
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
          name="nickname"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="닉네임"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
              returnKeyType="next"
              accessibilityLabel="닉네임"
              error={errors.nickname?.message}
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
              placeholder="비밀번호 (최소 8자)"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="next"
              accessibilityLabel="비밀번호"
              error={errors.password?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="passwordConfirmation"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="비밀번호 확인"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
              accessibilityLabel="비밀번호 확인"
              error={errors.passwordConfirmation?.message}
            />
          )}
        />
      </View>
      <Button onPress={handleSubmit(onSubmit)} isLoading={isSubmitting}>
        가입하기
      </Button>
    </View>
  );
}
