import { Redirect } from "expo-router";
import type { ReactElement } from "react";
import { ActivityIndicator, View } from "react-native";

import { useMe } from "~/entities/user";

export default function IndexScreen(): ReactElement {
  const { user, isLoading } = useMe();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#6a82a9" />
      </View>
    );
  }

  if (user) return <Redirect href="/feeds" />;
  return <Redirect href="/login" />;
}
