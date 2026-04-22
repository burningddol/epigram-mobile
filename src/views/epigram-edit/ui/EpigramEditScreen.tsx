import { Redirect } from "expo-router";
import { type ReactElement } from "react";
import { ScrollView, Text } from "react-native";

import { useEpigramDetail } from "~/entities/epigram";
import { useMe } from "~/entities/user";
import { resolveDefaultValues, useEpigramEdit } from "~/features/epigram-edit";
import { ErrorState, LoadingState, ScreenLayout } from "~/shared/ui";
import { EpigramForm } from "~/widgets/epigram-form";

interface EpigramEditScreenProps {
  epigramId: number;
}

export function EpigramEditScreen({
  epigramId,
}: EpigramEditScreenProps): ReactElement | null {
  const { user, isLoading: isMeLoading } = useMe();
  const {
    data: epigram,
    isLoading: isEpigramLoading,
    isError,
  } = useEpigramDetail(epigramId);
  const {
    tagInput,
    isSubmitting,
    hasError,
    handleTagInputChange,
    handleAddTag,
    handleRemoveTag,
    handleCancel,
    submit,
  } = useEpigramEdit(epigramId);

  if (isMeLoading || !user) return <LoadingState />;
  if (epigram && epigram.writerId !== user.id) {
    return <Redirect href={`/epigrams/${epigramId}`} />;
  }

  function renderBody(): ReactElement {
    if (isEpigramLoading) return <LoadingState />;
    if (isError || !epigram) {
      return <ErrorState message="에피그램을 불러오지 못했습니다" />;
    }
    return (
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-screen-x pb-12 pt-2 gap-6"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="font-serif-bold text-2xl text-black-900">
          에피그램 수정
        </Text>
        <EpigramForm
          defaultValues={resolveDefaultValues(epigram)}
          onSubmit={submit}
          isSubmitting={isSubmitting}
          hasError={hasError}
          errorMessage="에피그램을 수정하지 못했습니다. 잠시 후 다시 시도해주세요."
          submitLabel="수정 완료"
          tagInput={tagInput}
          onTagInputChange={handleTagInputChange}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onCancel={handleCancel}
        />
      </ScrollView>
    );
  }

  return <ScreenLayout>{renderBody()}</ScreenLayout>;
}
