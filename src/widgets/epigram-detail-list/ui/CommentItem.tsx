import { MoreVertical } from "lucide-react-native";
import { memo, type ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import { type Comment } from "~/entities/comment";
import { useCommentDelete } from "~/features/comment-delete";
import { CommentEditForm } from "~/features/comment-edit";
import { formatRelativeTime } from "~/shared/lib/date";
import { showActionAlert } from "~/shared/lib/showActionAlert";
import { UserAvatar } from "~/shared/ui";

interface CommentItemProps {
  comment: Comment;
  epigramId: number;
  currentUserId: number | undefined;
  isEditing: boolean;
  onStartEdit: (commentId: number) => void;
  onEndEdit: () => void;
}

function CommentItemBase({
  comment,
  epigramId,
  currentUserId,
  isEditing,
  onStartEdit,
  onEndEdit,
}: CommentItemProps): ReactElement {
  const { deleteComment } = useCommentDelete({
    commentId: comment.id,
    epigramId,
    userId: currentUserId,
  });
  const isOwnComment =
    currentUserId !== undefined && comment.writer.id === currentUserId;

  function handleOpenMenu(): void {
    showActionAlert("댓글", [
      { label: "수정", onPress: () => onStartEdit(comment.id) },
      { label: "삭제", destructive: true, onPress: deleteComment },
    ]);
  }

  if (isEditing) {
    return (
      <CommentEditForm
        commentId={comment.id}
        epigramId={epigramId}
        initialContent={comment.content}
        initialIsPrivate={comment.isPrivate}
        onCancel={onEndEdit}
      />
    );
  }

  return (
    <View className="flex-row gap-3 rounded-xl bg-blue-100 px-4 py-4">
      <View className="shrink-0">
        <UserAvatar
          image={comment.writer.image}
          nickname={comment.writer.nickname}
        />
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
