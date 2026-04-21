import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

import { useAuthStore } from "./authStore";

interface UseLogoutReturn {
  handleLogout: () => void;
}

export function useLogout(): UseLogoutReturn {
  const queryClient = useQueryClient();

  async function performLogout(): Promise<void> {
    await useAuthStore.getState().setUnauthenticated();
    queryClient.clear();
    router.replace("/login");
  }

  function handleLogout(): void {
    Alert.alert(
      "로그아웃할까요?",
      undefined,
      [
        { text: "취소", style: "cancel" },
        {
          text: "로그아웃",
          style: "destructive",
          onPress: () => performLogout(),
        },
      ],
      { cancelable: true },
    );
  }

  return { handleLogout };
}
