import { type ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

interface RecentSearchListProps {
  recentSearches: string[];
  onSelect: (keyword: string) => void;
  onClearAll: () => void;
}

interface RecentSearchChipProps {
  keyword: string;
  onSelect: (keyword: string) => void;
}

function RecentSearchChip({
  keyword,
  onSelect,
}: RecentSearchChipProps): ReactElement {
  function handlePress(): void {
    onSelect(keyword);
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`최근 검색어 ${keyword}로 검색`}
      className="rounded-full bg-blue-200 px-3 py-1.5 active:bg-blue-300"
    >
      <Text className="font-sans text-sm text-black-600">{keyword}</Text>
    </Pressable>
  );
}

export function RecentSearchList({
  recentSearches,
  onSelect,
  onClearAll,
}: RecentSearchListProps): ReactElement | null {
  if (recentSearches.length === 0) return null;

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="font-sans text-sm font-semibold text-black-600">
          최근 검색어
        </Text>
        <Pressable
          onPress={onClearAll}
          accessibilityRole="button"
          className="active:opacity-70"
        >
          <Text className="font-sans text-xs text-blue-400">모두 지우기</Text>
        </Pressable>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {recentSearches.map((keyword) => (
          <RecentSearchChip
            key={keyword}
            keyword={keyword}
            onSelect={onSelect}
          />
        ))}
      </View>
    </View>
  );
}
