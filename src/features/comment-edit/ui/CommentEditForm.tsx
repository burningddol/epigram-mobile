import type { ReactElement } from "react";
import { Text, TextInput, View } from "react-native";

import { Button, PrivacyToggle } from "~/shared/ui";

import { useCommentEdit } from "../model/useCommentEdit";

interface CommentEditFormProps {
  commentId: number;
  epigramId: number;
  initialContent: string;
  initialIsPrivate: boolean;
  onCancel: () => void;
}

const MAX_LENGTH = 100;

export function CommentEditForm({
  commentId,
  epigramId,
  initialContent,
  initialIsPrivate,
  onCancel,
}: CommentEditFormProps): ReactElement {
  const {
    content,
    isPrivate,
    isSubmitting,
    hasError,
    canSubmit,
    handleContentChange,
    handlePrivateToggle,
    handleSubmit,
    handleCancel,
  } = useCommentEdit({
    commentId,
    epigramId,
    initialContent,
    initialIsPrivate,
    onCancel,
  });

  return (
    <View className="gap-2 rounded-2xl border border-blue-400 bg-white p-3">
      <TextInput
        value={content}
        onChangeText={handleContentChange}
        maxLength={MAX_LENGTH}
        multiline
        numberOfLines={2}
        autoFocus
        placeholderTextColor="#abb8ce"
        className="min-h-12 font-sans text-sm text-black-700"
        textAlignVertical="top"
      />

      {hasError && (
        <Text className="font-sans text-xs text-error">
          수정에 실패했습니다. 다시 시도해주세요.
        </Text>
      )}

      <View className="flex-row items-center justify-between">
        <PrivacyToggle isPrivate={isPrivate} onToggle={handlePrivateToggle} />

        <View className="flex-row gap-2">
          <Button
            onPress={handleCancel}
            className="h-9 border border-blue-400 bg-white px-4 active:bg-blue-100"
            textClassName="text-xs text-blue-600"
          >
            취소
          </Button>
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
