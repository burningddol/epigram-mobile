import { AlertTriangle } from "lucide-react-native";
import { type ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

interface SectionErrorFallbackProps {
  reset: () => void;
}

export function SectionErrorFallback({
  reset,
}: SectionErrorFallbackProps): ReactElement {
  return (
    <View className="items-center gap-3 rounded-2xl border border-red-100 bg-red-50 py-10">
      <AlertTriangle size={20} color="#f87171" strokeWidth={1.5} />
      <Text className="font-sans text-sm font-medium text-error">
        불러오지 못했습니다
      </Text>
      <Pressable
        onPress={reset}
        accessibilityRole="button"
        accessibilityLabel="다시 시도"
      >
        <Text className="font-sans text-xs text-black-400 underline">
          다시 시도
        </Text>
      </Pressable>
    </View>
  );
}
