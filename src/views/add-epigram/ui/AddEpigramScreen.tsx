import { Redirect } from "expo-router";
import { type ReactElement } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMe } from "~/entities/user";
import {
  AUTHOR_TYPE,
  useEpigramCreate,
  type EpigramCreateFormValues,
} from "~/features/epigram-create";
import { EpigramForm } from "~/widgets/epigram-form";
import { HeaderBackButton } from "~/widgets/header";

const WRITING_TIPS = [
  "500자 이내의 짧고 인상적인 문장을 담아보세요.",
  "출처가 있다면 함께 기록해두면 좋습니다.",
  "태그를 활용하면 비슷한 글귀를 찾기 쉬워집니다.",
];

const DEFAULT_VALUES: EpigramCreateFormValues = {
  content: "",
  authorType: AUTHOR_TYPE.DIRECT,
  authorName: "",
  referenceTitle: "",
  referenceUrl: "",
  tags: [],
};

function WritingTips(): ReactElement {
  return (
    <View className="gap-2 rounded-2xl bg-blue-100 p-4">
      <Text className="font-sans text-sm font-semibold text-blue-800">
        작성 팁
      </Text>
      {WRITING_TIPS.map((tip) => (
        <Text key={tip} className="font-sans text-sm text-blue-700">
          • {tip}
        </Text>
      ))}
    </View>
  );
}

export function AddEpigramScreen(): ReactElement | null {
  const { user, isLoading: isMeLoading } = useMe();
  const {
    tagInput,
    isSubmitting,
    hasError,
    handleTagInputChange,
    handleAddTag,
    handleRemoveTag,
    submit,
  } = useEpigramCreate(user?.nickname);

  if (isMeLoading) return null;
  if (!user) return <Redirect href="/login" />;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center px-screen-x py-2">
        <HeaderBackButton />
      </View>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-screen-x pb-12 pt-2 gap-6"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="font-serif-bold text-2xl text-black-900">
            에피그램 작성
          </Text>
          <WritingTips />
          <EpigramForm
            defaultValues={DEFAULT_VALUES}
            onSubmit={submit}
            isSubmitting={isSubmitting}
            hasError={hasError}
            errorMessage="에피그램을 등록하지 못했습니다. 잠시 후 다시 시도해주세요."
            submitLabel="등록"
            tagInput={tagInput}
            onTagInputChange={handleTagInputChange}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
