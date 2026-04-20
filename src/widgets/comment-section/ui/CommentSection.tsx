import { MessageCircle } from "lucide-react-native";
import { memo, type ReactElement } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { useEpigramComments, WriterAvatar, type Comment } from "~/entities/comment";
import { useMe } from "~/entities/user";
import { CommentForm } from "~/features/comment-create";
import { formatRelativeTime } from "~/shared/lib/date";

const COMMENTS_PAGE_SIZE = 5;
const SKELETON_COUNT = 3;
const END_REACHED_THRESHOLD = 0.4;

interface CommentSectionProps {
  epigramId: number;
  listHeader?: ReactElement;
}

function CommentItemBase({ comment }: { comment: Comment }): ReactElement {
  return (
    <View className="flex-row gap-3 rounded-xl bg-blue-100 px-4 py-4">
      <View className="shrink-0">
        <WriterAvatar writer={comment.writer} />
      </View>
      <View className="min-w-0 flex-1">
        <View className="flex-row items-baseline gap-2">
          <Text
            numberOfLines={1}
            className="font-sans text-sm font-semibold text-black-700"
          >
            {comment.writer.nickname}
          </Text>
          <Text className="font-sans text-xs text-black-300">
            {formatRelativeTime(comment.createdAt)}
          </Text>
        </View>
        <Text className="mt-1 font-sans text-sm leading-5 text-black-500">
          {comment.content}
        </Text>
      </View>
    </View>
  );
}

const CommentItem = memo(CommentItemBase);

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
  userImage,
}: {
  totalCount: number | undefined;
  epigramId: number;
  userImage: string | null;
}): ReactElement {
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
      <CommentForm epigramId={epigramId} userImage={userImage} />
    </View>
  );
}

export function CommentSection({
  epigramId,
  listHeader,
}: CommentSectionProps): ReactElement {
  const { user: me } = useMe();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useEpigramComments({ epigramId, limit: COMMENTS_PAGE_SIZE });

  const comments = data?.pages.flatMap((page) => page.list) ?? [];
  const totalCount = data?.pages[0]?.totalCount;

  function handleEndReached(): void {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }

  function renderListHeader(): ReactElement {
    return (
      <View className="gap-6">
        {listHeader}
        <SectionHeader
          totalCount={totalCount}
          epigramId={epigramId}
          userImage={me?.image ?? null}
        />
      </View>
    );
  }

  function renderEmptyComponent(): ReactElement {
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
  }

  function renderListFooter(): ReactElement | null {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4">
        <ActivityIndicator color="#6a82a9" />
      </View>
    );
  }

  return (
    <FlatList
      data={comments}
      keyExtractor={(comment) => String(comment.id)}
      renderItem={({ item }) => <CommentItem comment={item} />}
      ListHeaderComponent={renderListHeader}
      ListEmptyComponent={renderEmptyComponent}
      ListFooterComponent={renderListFooter}
      onEndReached={handleEndReached}
      onEndReachedThreshold={END_REACHED_THRESHOLD}
      contentContainerClassName="px-screen-x pb-10"
      ItemSeparatorComponent={() => <View className="h-3" />}
      ListHeaderComponentStyle={{ marginBottom: 12 }}
      keyboardShouldPersistTaps="handled"
    />
  );
}
