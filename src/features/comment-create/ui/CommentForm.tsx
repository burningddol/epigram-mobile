import type { ReactElement } from "react";
import { Text, TextInput, View } from "react-native";

import { Button, PrivacyToggle, UserAvatar } from "~/shared/ui";

import { useCommentCreate } from "../model/useCommentCreate";

interface CommentAuthor {
  nickname: string;
  image: string | null;
}

interface CommentFormProps {
  epigramId: number;
  author: CommentAuthor | null;
  userId?: number;
}

const MAX_LENGTH = 100;
const PLACEHOLDER_AUTHOR: CommentAuthor = {
  nickname: "내 프로필",
  image: null,
};

export function CommentForm({
  epigramId,
  author,
  userId,
}: CommentFormProps): ReactElement {
  const {
    content,
    isPrivate,
    isSubmitting,
    hasError,
    canSubmit,
    handleContentChange,
    handlePrivateToggle,
    handleSubmit,
  } = useCommentCreate({ epigramId, userId });

  return (
    <View className="flex-row gap-3">
      <UserAvatar
        image={(author ?? PLACEHOLDER_AUTHOR).image}
        nickname={(author ?? PLACEHOLDER_AUTHOR).nickname}
      />

      <View className="flex-1 gap-2 rounded-2xl border border-blue-200 bg-white p-3">
        <TextInput
          value={content}
          onChangeText={handleContentChange}
          placeholder="100자 이내로 입력해주세요."
          placeholderTextColor="#abb8ce"
          maxLength={MAX_LENGTH}
          multiline
          numberOfLines={2}
          className="min-h-12 font-sans text-sm text-black-700"
          textAlignVertical="top"
        />

        {hasError && (
          <Text className="font-sans text-xs text-error">
            댓글 저장에 실패했습니다. 다시 시도해주세요.
          </Text>
        )}

        <View className="flex-row items-center justify-between">
          <PrivacyToggle isPrivate={isPrivate} onToggle={handlePrivateToggle} />

          <Button
            onPress={handleSubmit}
            isLoading={isSubmitting}
            disabled={!canSubmit}
            className="h-9 px-4"
            textClassName="text-xs"
          >
            저장
          </Button>
        </View>
      </View>
    </View>
  );
}
