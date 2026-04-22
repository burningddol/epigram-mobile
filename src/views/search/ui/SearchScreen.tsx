import { useCallback, type ReactElement } from "react";
import { Keyboard, View } from "react-native";

import {
  RecentSearchList,
  SearchBar,
  SearchResults,
  useSearch,
} from "~/features/epigram-search";
import { ScreenLayout } from "~/shared/ui";

import { SearchInitialState } from "./SearchInitialState";

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
    <ScreenLayout showBackButton={false} withKeyboardAvoiding={false}>
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
          <SearchInitialState />
        )}
      </View>
    </ScreenLayout>
  );
}
