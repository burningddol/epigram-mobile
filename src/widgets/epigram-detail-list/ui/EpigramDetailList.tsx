import { MessageCircle } from "lucide-react-native";
import { useCallback, useMemo, type ReactElement } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { useEpigramComments } from "~/entities/comment";
import { useMe } from "~/entities/user";
import { CommentForm } from "~/features/comment-create";

import { CommentItem } from "./CommentItem";

const COMMENTS_PAGE_SIZE = 5;
const SKELETON_COUNT = 3;

interface EpigramDetailListProps {
  epigramId: number;
  listHeader?: ReactElement;
}

interface SectionHeaderProps {
  totalCount: number | undefined;
  epigramId: number;
  author: { nickname: string; image: string | null } | null;
  userId: number | undefined;
}

function CommentSkeleton(): ReactElement {
  return (
    <View className="flex-row gap-3 rounded-xl bg-blue-100 px-4 py-4">
      <View className="h-9 w-9 rounded-full bg-blue-200" />
      <View className="flex-1 gap-2">
        <View className="h-3 w-24 rounded bg-blue-200" />
        <View className="h-3 w-full rounded bg-blue-200" />
      </View>
    </View>
  );
}

function EmptyState(): ReactElement {
  return (
    <View className="items-center gap-2 rounded-2xl border border-dashed border-line-200 px-4 py-10">
      <MessageCircle size={28} color="#6a82a9" strokeWidth={1.5} />
      <Text className="font-sans text-sm font-semibold text-black-700">
        아직 댓글이 없어요
      </Text>
      <Text className="font-sans text-xs text-black-300">
        첫 번째 댓글을 남겨보세요.
      </Text>
    </View>
  );
}

function SectionHeader({
  totalCount,
  epigramId,
  author,
  userId,
}: SectionHeaderProps): ReactElement {
  return (
    <View className="gap-4 pt-2">
      <View className="flex-row items-baseline gap-1">
        <Text className="font-sans text-lg font-bold text-black-900">댓글</Text>
        {totalCount !== undefined && (
          <Text className="font-sans text-lg font-bold text-blue-400">
            {totalCount}
          </Text>
        )}
      </View>
      <CommentForm epigramId={epigramId} author={author} userId={userId} />
    </View>
  );
}

export function EpigramDetailList({
  epigramId,
  listHeader,
}: EpigramDetailListProps): ReactElement {
  const { user: me } = useMe();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useEpigramComments({ epigramId, limit: COMMENTS_PAGE_SIZE });

  const comments = useMemo(
    () => data?.pages.flatMap((page) => page.list) ?? [],
    [data?.pages],
  );
  const totalCount = data?.pages[0]?.totalCount;
  const currentUserId = me?.id;
  const author = useMemo(
    () => (me ? { nickname: me.nickname, image: me.image } : null),
    [me],
  );

  const handleScroll = useCallback(
    (event: {
      nativeEvent: {
        contentOffset: { y: number };
        contentSize: { height: number };
        layoutMeasurement: { height: number };
      };
    }): void => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const distanceFromBottom =
        contentSize.height - contentOffset.y - layoutMeasurement.height;
      if (distanceFromBottom < 200 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const hasComments = comments.length > 0;

  return (
    <ScrollView
      contentContainerClassName="px-screen-x pb-10"
      keyboardShouldPersistTaps="handled"
      onScroll={handleScroll}
      scrollEventThrottle={32}
    >
      <View className="gap-6" style={{ marginBottom: 12 }}>
        {listHeader}
        <SectionHeader
          totalCount={totalCount}
          epigramId={epigramId}
          author={author}
          userId={currentUserId}
        />
      </View>

      {!hasComments && isLoading && (
        <View className="gap-3 pt-4">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <CommentSkeleton key={index} />
          ))}
        </View>
      )}

      {!hasComments && !isLoading && (
        <View className="pt-4">
          <EmptyState />
        </View>
      )}

      {hasComments && (
        <View className="gap-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              epigramId={epigramId}
              currentUserId={currentUserId}
            />
          ))}
        </View>
      )}

      {isFetchingNextPage && (
        <View className="py-4">
          <ActivityIndicator color="#6a82a9" />
        </View>
      )}
    </ScrollView>
  );
}
