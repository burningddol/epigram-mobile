import { type ReactElement } from "react";
import { Text, View } from "react-native";

import { useMyComments } from "~/entities/comment";

import { LoadMoreButton } from "./LoadMoreButton";
import { MyCommentItem } from "./MyCommentItem";
import { MYPAGE_LIST_PAGE_SIZE } from "./constants";

interface MyCommentListProps {
  userId: number;
}

export function MyCommentList({ userId }: MyCommentListProps): ReactElement {
  const {
    items: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyComments({
    userId,
    limit: MYPAGE_LIST_PAGE_SIZE,
  });

  if (comments.length === 0) {
    return (
      <Text className="py-10 text-center font-sans text-sm text-gray-300">
        작성한 댓글이 없어요.
      </Text>
    );
  }

  return (
    <View className="gap-0 overflow-hidden rounded-2xl bg-background">
      {comments.map((comment) => (
        <MyCommentItem key={comment.id} comment={comment} userId={userId} />
      ))}
      {hasNextPage && (
        <View className="py-4">
          <LoadMoreButton
            label="댓글 더보기"
            isFetchingNextPage={isFetchingNextPage}
            onPress={() => void fetchNextPage()}
          />
        </View>
      )}
    </View>
  );
}
