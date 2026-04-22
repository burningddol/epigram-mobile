import type { ReactElement } from "react";
import { ScrollView, Text } from "react-native";

import { type EpigramDetail } from "~/entities/epigram";
import { resolveDefaultValues, useEpigramEdit } from "~/features/epigram-edit";
import { EpigramForm } from "~/widgets/epigram-form";

interface EpigramEditBodyProps {
  epigram: EpigramDetail;
}

export function EpigramEditBody({ epigram }: EpigramEditBodyProps): ReactElement {
  const {
    tagInput,
    isSubmitting,
    hasError,
    handleTagInputChange,
    handleAddTag,
    handleRemoveTag,
    handleCancel,
    submit,
  } = useEpigramEdit(epigram.id);

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
