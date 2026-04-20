import { Redirect } from "expo-router";
import type { ReactElement } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMe } from "~/entities/user";

export default function AddEpigramScreen(): ReactElement | null {
  const { user, isLoading } = useMe();

  if (isLoading) return null;
  if (!user) return <Redirect href="/login" />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-screen-x">
        <Text className="font-sans text-2xl font-bold text-black-900">
          에피그램 작성
        </Text>
        <Text className="mt-2 font-sans text-sm text-blue-400">
          폼은 추후 구현 예정
        </Text>
      </View>
    </SafeAreaView>
  );
}
