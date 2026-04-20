import { Lock, Unlock } from "lucide-react-native";
import type { ReactElement } from "react";
import { Pressable, Text } from "react-native";

interface PrivacyToggleProps {
  isPrivate: boolean;
  onToggle: () => void;
}

export function PrivacyToggle({
  isPrivate,
  onToggle,
}: PrivacyToggleProps): ReactElement {
  const Icon = isPrivate ? Lock : Unlock;
  const label = isPrivate ? "비공개" : "공개";
  const accessibilityLabel = isPrivate
    ? "비공개 (공개로 전환)"
    : "공개 (비공개로 전환)";

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="flex-row items-center gap-1 px-1 py-1 active:opacity-60"
    >
      <Icon size={12} color="#6a82a9" />
      <Text className="font-sans text-xs text-blue-400">{label}</Text>
    </Pressable>
  );
}
