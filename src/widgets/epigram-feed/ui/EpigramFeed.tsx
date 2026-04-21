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
  useTodayEpigram,
  type Epigram,
} from "~/entities/epigram";
import { useMe } from "~/entities/user";
import { EmotionSelector } from "~/features/emotion-select";
import { ErrorBoundary, SectionErrorFallback } from "~/shared/ui";

const FEED_PAGE_SIZE = 10;

function ItemSeparator(): ReactElement {
  return <View className="h-6" />;
}

function SectionHeading({ label }: { label: string }): ReactElement {
  return (
    <Text className="mb-4 font-serif text-xl font-bold text-black-700">
      {label}
    </Text>
  );
}

function TodayEpigramLoading(): ReactElement {
  return <View className="h-32 rounded-2xl bg-blue-200" />;
}

function TodayEpigramEmpty(): ReactElement {
  return (
    <View className="items-center gap-2 rounded-2xl border border-line-200 bg-surface px-6 py-8">
      <Text className="font-serif text-base text-black-400">
        오늘의 에피그램이 아직 작성되지 않았습니다
      </Text>
      <Text className="font-serif text-xs text-blue-400">
        — 좋은 글귀가 곧 채워질 거예요
      </Text>
    </View>
  );
}

function TodayEpigramBody(): ReactElement {
  const { data: todayEpigram, isLoading } = useTodayEpigram();

  if (isLoading) return <TodayEpigramLoading />;
  if (!todayEpigram) return <TodayEpigramEmpty />;
  return <EpigramCard epigram={todayEpigram} onPress={navigateToEpigram} />;
}

function TodayEpigramSection(): ReactElement {
  return (
    <View>
      <SectionHeading label="오늘의 에피그램" />
      <TodayEpigramBody />
    </View>
  );
}

function ListHeader({
  showEmotionSelector,
}: {
  showEmotionSelector: boolean;
}): ReactElement {
  return (
    <View className="mb-6 gap-10">
      {showEmotionSelector && <EmotionSelector />}
      <ErrorBoundary
        fallback={(_, reset) => <SectionErrorFallback reset={reset} />}
      >
        <TodayEpigramSection />
      </ErrorBoundary>
      <SectionHeading label="최신 에피그램" />
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
  return (
    <ErrorBoundary
      fallback={(_, reset) => <SectionErrorFallback reset={reset} />}
    >
      <EpigramFeedInner />
    </ErrorBoundary>
  );
}

function EpigramFeedInner(): ReactElement {
  const { user } = useMe();
  const isAuthenticated = !!user;
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
      ListHeaderComponent={<ListHeader showEmotionSelector={isAuthenticated} />}
      ListEmptyComponent={EmptyState}
      ListFooterComponent={<FooterLoader visible={isFetchingNextPage} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.3}
      contentContainerClassName="px-screen-x py-6"
    />
  );
}
