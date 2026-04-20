import { Search } from "lucide-react-native";
import { type ReactElement } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface SearchBarProps {
  inputValue: string;
  recentSearches: string[];
  onInputChange: (value: string) => void;
  onSearch: (keyword: string) => void;
  onClearAllRecent: () => void;
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

export function SearchBar({
  inputValue,
  recentSearches,
  onInputChange,
  onSearch,
  onClearAllRecent,
}: SearchBarProps): ReactElement {
  function handleSubmit(): void {
    onSearch(inputValue);
  }

  return (
    <View className="w-full gap-6">
      <View className="flex-row items-center border-b-2 border-blue-300 pb-2">
        <TextInput
          value={inputValue}
          onChangeText={onInputChange}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          placeholder="검색어를 입력하세요"
          placeholderTextColor="#abb8ce"
          autoCorrect={false}
          autoCapitalize="none"
          className="h-10 flex-1 font-sans text-base text-black-900"
        />
        <Pressable
          onPress={handleSubmit}
          accessibilityRole="button"
          accessibilityLabel="검색"
          className="ml-2 h-10 w-10 items-center justify-center active:opacity-70"
        >
          <Search size={20} color="#abb8ce" />
        </Pressable>
      </View>

      {recentSearches.length > 0 && (
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans text-sm font-semibold text-black-600">
              최근 검색어
            </Text>
            <Pressable
              onPress={onClearAllRecent}
              accessibilityRole="button"
              className="active:opacity-70"
            >
              <Text className="font-sans text-xs text-blue-400">
                모두 지우기
              </Text>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {recentSearches.map((keyword) => (
              <RecentSearchChip
                key={keyword}
                keyword={keyword}
                onSelect={onSearch}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
