import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";

import {
  epigramCreateFormSchema,
  type EpigramCreateFormValues,
} from "~/features/epigram-create";

import { AuthorField } from "./fields/AuthorField";
import { ContentField, MAX_CONTENT_LENGTH } from "./fields/ContentField";
import { FormActions } from "./fields/FormActions";
import { ReferenceFields } from "./fields/ReferenceFields";
import { TagsField } from "./fields/TagsField";

interface EpigramFormProps {
  defaultValues: EpigramCreateFormValues;
  onSubmit: (values: EpigramCreateFormValues) => void;
  isSubmitting: boolean;
  hasError: boolean;
  errorMessage: string;
  submitLabel: string;
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: (currentTags: string[], onChange: (tags: string[]) => void) => void;
  onRemoveTag: (
    tag: string,
    currentTags: string[],
    onChange: (tags: string[]) => void,
  ) => void;
  onCancel?: () => void;
  cancelLabel?: string;
}

export function EpigramForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  hasError,
  errorMessage,
  submitLabel,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onCancel,
  cancelLabel,
}: EpigramFormProps): ReactElement {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EpigramCreateFormValues>({
    resolver: zodResolver(epigramCreateFormSchema),
    defaultValues,
  });

  const contentValue = watch("content") ?? "";
  const authorType = watch("authorType");
  const isContentOverLimit = contentValue.length > MAX_CONTENT_LENGTH;

  return (
    <View className="gap-8">
      <ContentField
        control={control}
        contentLength={contentValue.length}
        errorMessage={errors.content?.message}
      />

      <AuthorField
        control={control}
        authorType={authorType}
        authorErrorMessage={errors.authorName?.message}
      />

      <ReferenceFields
        control={control}
        referenceTitleError={errors.referenceTitle?.message}
        referenceUrlError={errors.referenceUrl?.message}
      />

      <TagsField
        control={control}
        tagInput={tagInput}
        onTagInputChange={onTagInputChange}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        errorMessage={errors.tags?.message}
      />

      {hasError ? (
        <View className="rounded-xl bg-error/10 px-4 py-3">
          <Text className="font-sans text-sm text-error">{errorMessage}</Text>
        </View>
      ) : null}

      <FormActions
        onSubmit={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        canSubmit={!isContentOverLimit}
        submitLabel={submitLabel}
        onCancel={onCancel}
        cancelLabel={cancelLabel}
      />
    </View>
  );
}
