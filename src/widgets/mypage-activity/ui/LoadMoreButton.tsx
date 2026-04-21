import { Plus } from "lucide-react-native";
import { type ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

interface LoadMoreButtonProps {
  label: string;
  isFetchingNextPage: boolean;
  onPress: () => void;
}

export function LoadMoreButton({
  label,
  isFetchingNextPage,
  onPress,
}: LoadMoreButtonProps): ReactElement {
  return (
    <View className="items-center">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={isFetchingNextPage}
        onPress={onPress}
        className="flex-row items-center gap-2 rounded-full border border-line-200 bg-background px-6 py-3 active:bg-blue-100 disabled:opacity-60"
      >
        <Plus size={16} color="#5195ee" />
        <Text className="font-sans text-sm font-medium text-blue-500">
          {isFetchingNextPage ? "불러오는 중..." : label}
        </Text>
      </Pressable>
    </View>
  );
}
