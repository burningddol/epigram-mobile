import { type ReactElement } from "react";
import { Alert, Pressable, Text, View } from "react-native";

import { type Comment } from "~/entities/comment";
import { navigateToEpigram } from "~/entities/epigram";
import { useCommentDelete } from "~/features/comment-delete";
import { formatRelativeTime } from "~/shared/lib/date";
import { UserAvatar } from "~/shared/ui";

interface MyCommentItemProps {
  comment: Comment;
  userId: number;
}

export function MyCommentItem({
  comment,
  userId,
}: MyCommentItemProps): ReactElement {
  const epigramId = comment.epigramId;
  const { deleteComment, isDeleting } = useCommentDelete({
    commentId: comment.id,
    epigramId,
    userId,
  });

  function handleDeletePress(): void {
    Alert.alert("댓글 삭제", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => deleteComment(),
      },
    ]);
  }

  function handleCardPress(): void {
    navigateToEpigram(epigramId);
  }

  return (
    <View className="gap-3 border-t border-line-200 bg-background px-4 py-5 first:border-t-0">
      <View className="flex-row items-start gap-3">
        <UserAvatar
          image={comment.writer.image}
          nickname={comment.writer.nickname}
          size={40}
        />

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text className="font-sans text-xs text-black-300">
                {comment.writer.nickname}
              </Text>
              <Text className="font-sans text-xs text-black-300">
                {formatRelativeTime(comment.createdAt)}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="댓글 삭제"
              disabled={isDeleting}
              onPress={handleDeletePress}
            >
              <Text className="font-sans text-xs text-error">삭제</Text>
            </Pressable>
          </View>

          <Pressable onPress={handleCardPress} className="mt-2">
            <Text className="font-sans text-sm leading-relaxed text-black-700">
              {comment.content}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
