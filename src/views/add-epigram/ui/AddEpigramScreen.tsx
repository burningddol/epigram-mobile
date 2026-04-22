import { type ReactElement } from "react";
import { ScrollView, Text } from "react-native";

import { useMe } from "~/entities/user";
import {
  EPIGRAM_CREATE_DEFAULT_VALUES,
  useEpigramCreate,
} from "~/features/epigram-create";
import { LoadingState, ScreenLayout } from "~/shared/ui";
import { EpigramForm } from "~/widgets/epigram-form";

import { WritingTips } from "./WritingTips";

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

  if (isMeLoading || !user) return <LoadingState />;

  return (
    <ScreenLayout>
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
          defaultValues={EPIGRAM_CREATE_DEFAULT_VALUES}
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
    </ScreenLayout>
  );
}
