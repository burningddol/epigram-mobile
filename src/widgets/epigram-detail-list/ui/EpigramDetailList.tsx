import { MessageCircle } from "lucide-react-native";
import { useCallback, useMemo, useRef, useState, type ReactElement } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { useEpigramComments, type Comment } from "~/entities/comment";
import { useMe } from "~/entities/user";
import { CommentForm } from "~/features/comment-create";
import { useScrollToFocusedInput } from "~/shared/hooks/useScrollToFocusedInput";

import { CommentItem } from "./CommentItem";

const COMMENTS_PAGE_SIZE = 5;
const SKELETON_COUNT = 3;
const END_REACHED_THRESHOLD = 0.4;
const KEYBOARD_BREATHING_ROOM = 70;
const SCROLL_EVENT_THROTTLE = 64;

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

function ItemSeparator(): ReactElement {
  return <View className="h-3" />;
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
  const listRef = useRef<FlatList<Comment>>(null);
  const {
    comments,
    totalCount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useEpigramComments({ epigramId, limit: COMMENTS_PAGE_SIZE });

  const currentUserId = me?.id;
  const author = useMemo(
    () => (me ? { nickname: me.nickname, image: me.image } : null),
    [me],
  );

  const { onScroll } = useScrollToFocusedInput(listRef, KEYBOARD_BREATHING_ROOM);

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  const handleStartEdit = useCallback((commentId: number): void => {
    setEditingCommentId(commentId);
  }, []);

  const handleEndEdit = useCallback((): void => {
    setEditingCommentId(null);
  }, []);

  const handleEndReached = useCallback((): void => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: Comment }) => (
      <CommentItem
        comment={item}
        epigramId={epigramId}
        currentUserId={currentUserId}
        isEditing={editingCommentId === item.id}
        onStartEdit={handleStartEdit}
        onEndEdit={handleEndEdit}
      />
    ),
    [epigramId, currentUserId, editingCommentId, handleStartEdit, handleEndEdit],
  );

  const headerElement = useMemo(
    () => (
      <View className="gap-6">
        {listHeader}
        <SectionHeader
          totalCount={totalCount}
          epigramId={epigramId}
          author={author}
          userId={currentUserId}
        />
      </View>
    ),
    [listHeader, totalCount, epigramId, author, currentUserId],
  );

  const renderEmpty = useCallback((): ReactElement => {
    if (isLoading) {
      return (
        <View className="gap-3 pt-4">
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <CommentSkeleton key={index} />
          ))}
        </View>
      );
    }
    return (
      <View className="pt-4">
        <EmptyState />
      </View>
    );
  }, [isLoading]);

  const footerElement = useMemo(
    () =>
      isFetchingNextPage ? (
        <View className="py-4">
          <ActivityIndicator color="#6a82a9" />
        </View>
      ) : null,
    [isFetchingNextPage],
  );

  return (
    <FlatList
      ref={listRef}
      data={comments}
      keyExtractor={(comment) => String(comment.id)}
      renderItem={renderItem}
      ListHeaderComponent={headerElement}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={footerElement}
      onEndReached={handleEndReached}
      onEndReachedThreshold={END_REACHED_THRESHOLD}
      contentContainerClassName="px-screen-x pb-10"
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponentStyle={{ marginBottom: 12 }}
      keyboardShouldPersistTaps="handled"
      onScroll={onScroll}
      scrollEventThrottle={SCROLL_EVENT_THROTTLE}
    />
  );
}
