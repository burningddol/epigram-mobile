import { LogOut } from "lucide-react-native";
import type { ReactElement } from "react";
import { Pressable, Text } from "react-native";

import { useLogout } from "../model/useLogout";

export function LogoutButton(): ReactElement {
  const { handleLogout } = useLogout();

  return (
    <Pressable
      onPress={handleLogout}
      accessibilityRole="button"
      accessibilityLabel="로그아웃"
      className="flex-row items-center gap-1.5 rounded-full border border-line-200 px-4 py-1.5 active:bg-blue-100"
    >
      <LogOut size={14} color="#7b8caf" />
      <Text className="font-sans text-xs text-black-400">로그아웃</Text>
    </Pressable>
  );
}
