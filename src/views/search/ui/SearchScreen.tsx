import { useCallback, type ReactElement } from "react";
import { Keyboard, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  RecentSearchList,
  SearchBar,
  SearchResults,
  useSearch,
} from "~/features/epigram-search";

function InitialState(): ReactElement {
  return (
    <View className="items-center gap-4 py-24">
      <Text
        className="select-none font-serif text-7xl text-blue-300"
        accessibilityElementsHidden
      >
        {"\u201C"}
      </Text>
      <View className="items-center gap-1.5 px-screen-x">
        <Text className="text-center font-serif text-base text-black-500">
          검색어를 입력해 에피그램을 찾아보세요
        </Text>
        <Text className="text-center font-sans text-xs text-black-300">
          작가 이름, 글귀, 태그 모두 검색 가능합니다
        </Text>
      </View>
    </View>
  );
}

export function SearchScreen(): ReactElement {
  const {
    inputValue,
    activeKeyword,
    recentSearches,
    handleInputChange,
    handleSearch,
    clearAllRecentSearches,
  } = useSearch();

  const handleSearchAndDismiss = useCallback(
    (keyword: string): void => {
      Keyboard.dismiss();
      handleSearch(keyword);
    },
    [handleSearch],
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="gap-6 px-screen-x pt-6">
        <SearchBar
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onSearch={handleSearchAndDismiss}
        />
        <RecentSearchList
          recentSearches={recentSearches}
          onSelect={handleSearchAndDismiss}
          onClearAll={clearAllRecentSearches}
        />
      </View>
      <View className="mt-8 flex-1 px-screen-x">
        {activeKeyword ? (
          <SearchResults keyword={activeKeyword} />
        ) : (
          <InitialState />
        )}
      </View>
    </SafeAreaView>
  );
}
