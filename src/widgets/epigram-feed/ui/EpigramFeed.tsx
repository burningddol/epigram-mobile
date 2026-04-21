import { useCallback, type ReactElement } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  type ListRenderItem,
} from "react-native";

import {
  EpigramCard,
  navigateToEpigram,
  useEpigrams,
  type Epigram,
} from "~/entities/epigram";
import { useAuthStore } from "~/features/auth";
import { EmotionSelector } from "~/features/emotion-select";

const FEED_PAGE_SIZE = 10;

function ItemSeparator(): ReactElement {
  return <View className="h-6" />;
}

function ListHeader(): ReactElement {
  return (
    <View className="mb-6">
      <EmotionSelector />
    </View>
  );
}

function LoadingState(): ReactElement {
  return (
    <View className="flex-1 items-center justify-center py-10">
      <ActivityIndicator color="#6a82a9" />
    </View>
  );
}

function EmptyState(): ReactElement {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="font-serif text-base text-black-300">
        등록된 에피그램이 없습니다
      </Text>
      <Text className="mt-2 font-sans text-sm text-blue-400">
        첫 번째 에피그램을 작성해 보세요
      </Text>
    </View>
  );
}

function ErrorState({ message }: { message: string }): ReactElement {
  return (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="font-sans text-base text-error">{message}</Text>
    </View>
  );
}

function FooterLoader({ visible }: { visible: boolean }): ReactElement | null {
  if (!visible) return null;
  return (
    <View className="items-center py-6">
      <ActivityIndicator color="#6a82a9" />
    </View>
  );
}

export function EpigramFeed(): ReactElement {
  const isAuthenticated = useAuthStore((s) => s.status === "authenticated");
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useEpigrams({
    limit: FEED_PAGE_SIZE,
  });

  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];

  const renderItem = useCallback<ListRenderItem<Epigram>>(
    ({ item }) => <EpigramCard epigram={item} onPress={navigateToEpigram} />,
    [],
  );

  function handleEndReached(): void {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="에피그램을 불러오지 못했습니다" />;

  return (
    <FlatList
      data={epigrams}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={isAuthenticated ? ListHeader : null}
      ListEmptyComponent={EmptyState}
      ListFooterComponent={<FooterLoader visible={isFetchingNextPage} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      contentContainerClassName="px-screen-x py-6"
    />
  );
}
