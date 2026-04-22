import { SearchX } from "lucide-react-native";
import { useCallback, useMemo, type ReactElement } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  type ListRenderItem,
} from "react-native";

import { useSearchEpigrams, type Epigram } from "~/entities/epigram";

import { buildHighlightRegex } from "../lib/highlight";

import { SearchResultItem } from "./SearchResultItem";

const SEARCH_LIMIT = 10;

interface SearchResultsProps {
  keyword: string;
}

function SearchResultSkeletonItem(): ReactElement {
  return (
    <View className="border-b border-line-100 py-5">
      <View className="gap-2.5">
        <View className="h-3.5 w-4/5 rounded-md bg-blue-200" />
        <View className="h-3.5 w-1/2 rounded-md bg-blue-200" />
        <View className="flex-row gap-2 pt-1">
          <View className="h-5 w-14 rounded-full bg-blue-200" />
          <View className="h-5 w-20 rounded-full bg-blue-200" />
        </View>
      </View>
    </View>
  );
}

function SearchResultSkeleton(): ReactElement {
  return (
    <View>
      {Array.from({ length: 4 }).map((_, i) => (
        <SearchResultSkeletonItem key={i} />
      ))}
    </View>
  );
}

interface SearchNoResultsProps {
  keyword: string;
}

function SearchNoResults({ keyword }: SearchNoResultsProps): ReactElement {
  return (
    <View className="items-center gap-5 py-24">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-200">
        <SearchX size={28} color="#52698e" strokeWidth={1.5} />
      </View>
      <View className="items-center gap-1.5 px-screen-x">
        <Text className="text-center font-sans text-sm text-black-600">
          <Text className="font-semibold text-blue-700">
            &ldquo;{keyword}&rdquo;
          </Text>
          에 대한 결과가 없어요
        </Text>
        <Text className="text-center font-sans text-xs text-black-300">
          철자를 확인하거나 다른 검색어를 입력해 보세요
        </Text>
      </View>
    </View>
  );
}

export function SearchResults({ keyword }: SearchResultsProps): ReactElement {
  const {
    items: epigrams,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSearchEpigrams({ keyword, limit: SEARCH_LIMIT });

  const highlightRegex = useMemo(() => buildHighlightRegex(keyword), [keyword]);

  const handleEndReached = useCallback((): void => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem: ListRenderItem<Epigram> = useCallback(
    ({ item }) => (
      <SearchResultItem epigram={item} highlightRegex={highlightRegex} />
    ),
    [highlightRegex],
  );

  if (isLoading) return <SearchResultSkeleton />;
  if (epigrams.length === 0) return <SearchNoResults keyword={keyword} />;

  return (
    <FlatList
      data={epigrams}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        <Text className="mb-4 font-sans text-xs text-black-300">
          검색 결과{" "}
          <Text className="font-semibold text-blue-700">
            {epigrams.length}
            {hasNextPage ? "+" : ""}
          </Text>
        </Text>
      }
      ListFooterComponent={
        <SearchResultsFooter
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          loadedCount={epigrams.length}
        />
      }
      keyboardShouldPersistTaps="handled"
    />
  );
}

interface SearchResultsFooterProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  loadedCount: number;
}

function SearchResultsFooter({
  isFetchingNextPage,
  hasNextPage,
  loadedCount,
}: SearchResultsFooterProps): ReactElement | null {
  if (isFetchingNextPage) {
    return (
      <View className="items-center py-8">
        <ActivityIndicator color="#abb8ce" />
      </View>
    );
  }
  if (!hasNextPage && loadedCount > 0) {
    return (
      <View className="items-center py-8">
        <Text className="font-sans text-xs text-black-300">
          모든 결과를 불러왔습니다
        </Text>
      </View>
    );
  }
  return null;
}
