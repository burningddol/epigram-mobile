import { Lock, Unlock } from "lucide-react-native";
import type { ReactElement } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { Button } from "~/shared/ui/Button";

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
    setContent,
    handlePrivateToggle,
    handleSubmit,
    handleCancel,
  } = useCommentEdit({ commentId, epigramId, initialContent, initialIsPrivate, onCancel });

  return (
    <View className="gap-2 rounded-2xl border border-blue-400 bg-white p-3">
      <TextInput
        value={content}
        onChangeText={setContent}
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
        <Pressable
          onPress={handlePrivateToggle}
          accessibilityRole="button"
          accessibilityLabel={isPrivate ? "비공개 (공개로 전환)" : "공개 (비공개로 전환)"}
          className="flex-row items-center gap-1 px-1 py-1 active:opacity-60"
        >
          {isPrivate ? (
            <Lock size={12} color="#6a82a9" />
          ) : (
            <Unlock size={12} color="#6a82a9" />
          )}
          <Text className="font-sans text-xs text-blue-400">
            {isPrivate ? "비공개" : "공개"}
          </Text>
        </Pressable>

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
