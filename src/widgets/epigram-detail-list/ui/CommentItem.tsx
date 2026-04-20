import { MoreVertical } from "lucide-react-native";
import { memo, useState, type ReactElement } from "react";
import { Alert, Pressable, Text, View } from "react-native";

import { WriterAvatar, type Comment } from "~/entities/comment";
import { useCommentDelete } from "~/features/comment-delete";
import { CommentEditForm } from "~/features/comment-edit";
import { formatRelativeTime } from "~/shared/lib/date";

interface CommentItemProps {
  comment: Comment;
  epigramId: number;
  currentUserId: number | undefined;
}

function CommentItemBase({
  comment,
  epigramId,
  currentUserId,
}: CommentItemProps): ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteComment } = useCommentDelete(
    comment.id,
    epigramId,
    currentUserId,
  );
  const isOwnComment =
    currentUserId !== undefined && comment.writer.id === currentUserId;

  function handleOpenMenu(): void {
    Alert.alert(
      "댓글",
      undefined,
      [
        { text: "수정", onPress: () => setIsEditing(true) },
        { text: "삭제", style: "destructive", onPress: deleteComment },
        { text: "취소", style: "cancel" },
      ],
      { cancelable: true },
    );
  }

  if (isEditing) {
    return (
      <CommentEditForm
        commentId={comment.id}
        epigramId={epigramId}
        initialContent={comment.content}
        initialIsPrivate={comment.isPrivate}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <View className="flex-row gap-3 rounded-xl bg-blue-100 px-4 py-4">
      <View className="shrink-0">
        <WriterAvatar writer={comment.writer} />
      </View>
      <View className="min-w-0 flex-1">
        <View className="flex-row items-start justify-between gap-2">
          <View className="min-w-0 flex-1 flex-row items-baseline gap-2">
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

          {isOwnComment && (
            <Pressable
              onPress={handleOpenMenu}
              accessibilityRole="button"
              accessibilityLabel="댓글 옵션"
              hitSlop={8}
              className="shrink-0 rounded-full p-1 active:bg-blue-200"
            >
              <MoreVertical size={16} color="#6a82a9" />
            </Pressable>
          )}
        </View>
        <Text className="mt-1 font-sans text-sm leading-5 text-black-500">
          {comment.content}
        </Text>
      </View>
    </View>
  );
}

export const CommentItem = memo(CommentItemBase);
