import { router } from "expo-router";
import { MoreVertical } from "lucide-react-native";
import type { ReactElement } from "react";
import { Alert, Pressable } from "react-native";

interface EpigramDetailActionMenuProps {
  epigramId: number;
  onDelete: () => void;
  isDeleting: boolean;
}

export function EpigramDetailActionMenu({
  epigramId,
  onDelete,
  isDeleting,
}: EpigramDetailActionMenuProps): ReactElement {
  function handleOpenMenu(): void {
    Alert.alert(
      "에피그램",
      undefined,
      [
        {
          text: "수정",
          onPress: () => router.push(`/epigrams/${epigramId}/edit`),
        },
        { text: "삭제", style: "destructive", onPress: onDelete },
        { text: "취소", style: "cancel" },
      ],
      { cancelable: true },
    );
  }

  return (
    <Pressable
      onPress={handleOpenMenu}
      disabled={isDeleting}
      accessibilityRole="button"
      accessibilityLabel="에피그램 메뉴 열기"
      className="h-10 w-10 items-center justify-center rounded-full active:bg-blue-200"
    >
      <MoreVertical size={22} color="#454545" />
    </Pressable>
  );
}
