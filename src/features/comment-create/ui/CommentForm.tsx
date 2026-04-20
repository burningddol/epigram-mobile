import { Lock, Unlock, User } from "lucide-react-native";
import type { ReactElement } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

import { Button } from "~/shared/ui/Button";

import { useCommentCreate } from "../model/useCommentCreate";

interface CommentFormProps {
  epigramId: number;
  userImage?: string | null;
}

const MAX_LENGTH = 100;

export function CommentForm({ epigramId, userImage }: CommentFormProps): ReactElement {
  const {
    content,
    isPrivate,
    isSubmitting,
    hasError,
    canSubmit,
    handleContentChange,
    handlePrivateToggle,
    handleSubmit,
  } = useCommentCreate(epigramId);

  return (
    <View className="flex-row gap-3">
      <View
        className="h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-200"
        accessibilityLabel="내 프로필"
      >
        {userImage ? (
          <Image source={{ uri: userImage }} className="h-full w-full" />
        ) : (
          <User size={16} color="#2b6cb0" />
        )}
      </View>

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
