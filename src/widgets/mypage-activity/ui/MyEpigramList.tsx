import { type ReactElement } from "react";
import { Text, View } from "react-native";

import {
  EpigramCard,
  navigateToEpigram,
  useEpigrams,
} from "~/entities/epigram";

import { LoadMoreButton } from "./LoadMoreButton";
import { MYPAGE_LIST_PAGE_SIZE } from "./constants";

interface MyEpigramListProps {
  userId: number;
}

export function MyEpigramList({ userId }: MyEpigramListProps): ReactElement {
  const {
    items: epigrams,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEpigrams({
    limit: MYPAGE_LIST_PAGE_SIZE,
    writerId: userId,
  });

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
          onPress={navigateToEpigram}
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
