import { router } from "expo-router";
import { useCallback, useEffect, type ReactElement } from "react";
import { Text, View } from "react-native";

import { useEpigrams } from "~/entities/epigram";
import { EpigramCard } from "~/widgets/epigram-card";

import { LoadMoreButton } from "./LoadMoreButton";

const PAGE_SIZE = 3;

interface MyEpigramListProps {
  userId: number;
  onTotalCount: (count: number) => void;
}

export function MyEpigramList({
  userId,
  onTotalCount,
}: MyEpigramListProps): ReactElement {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useEpigrams({
    limit: PAGE_SIZE,
    writerId: userId,
  });

  const epigrams = data?.pages.flatMap((page) => page.list) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  useEffect(() => {
    onTotalCount(totalCount);
  }, [totalCount, onTotalCount]);

  const handleCardPress = useCallback((epigramId: number) => {
    router.push({
      pathname: "/epigrams/[id]",
      params: { id: String(epigramId) },
    });
  }, []);

  if (epigrams.length === 0) {
    return (
      <Text className="py-10 text-center font-sans text-sm text-gray-300">
        작성한 에피그램이 없어요.
      </Text>
    );
  }

  return (
    <View className="gap-4">
      {epigrams.map((epigram) => (
        <EpigramCard
          key={epigram.id}
          epigram={epigram}
          onPress={handleCardPress}
        />
      ))}
      {hasNextPage && (
        <LoadMoreButton
          label="에피그램 더보기"
          isFetchingNextPage={isFetchingNextPage}
          onPress={() => void fetchNextPage()}
        />
      )}
    </View>
  );
}
