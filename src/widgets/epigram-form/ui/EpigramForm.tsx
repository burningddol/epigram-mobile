import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react-native";
import { type ReactElement } from "react";
import { Controller, useForm, type Control } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";

import {
  AUTHOR_TYPE,
  epigramCreateFormSchema,
  type AuthorType,
  type EpigramCreateFormValues,
} from "~/features/epigram-create";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";

const MAX_CONTENT_LENGTH = 500;
const MAX_TAG_COUNT = 3;

interface AuthorOption {
  value: AuthorType;
  label: string;
}

const AUTHOR_OPTIONS: AuthorOption[] = [
  { value: AUTHOR_TYPE.DIRECT, label: "직접 입력" },
  { value: AUTHOR_TYPE.UNKNOWN, label: "알 수 없음" },
  { value: AUTHOR_TYPE.SELF, label: "본인" },
];

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
  cancelLabel = "취소",
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

interface ContentFieldProps {
  control: Control<EpigramCreateFormValues>;
  contentLength: number;
  errorMessage?: string;
}

function ContentField({
  control,
  contentLength,
  errorMessage,
}: ContentFieldProps): ReactElement {
  const isOverLimit = contentLength > MAX_CONTENT_LENGTH;
  const isNearLimit = contentLength >= MAX_CONTENT_LENGTH * 0.9;

  function getCounterClassName(): string {
    if (isOverLimit) return "font-semibold text-error";
    if (isNearLimit) return "text-black-300";
    return "text-blue-400";
  }

  return (
    <View className="gap-2">
      <FieldLabel label="내용" required />
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            placeholder="500자 이내로 입력해주세요."
            placeholderTextColor="#abb8ce"
            multiline
            textAlignVertical="top"
            className="min-h-[140px] rounded-xl border border-blue-300 bg-blue-200 px-4 pb-8 pt-3 font-sans text-sm text-black-950 focus:border-blue-500"
          />
        )}
      />
      <Text className={`text-right font-sans text-xs ${getCounterClassName()}`}>
        {contentLength} / {MAX_CONTENT_LENGTH}
      </Text>
      {errorMessage ? <FieldError message={errorMessage} /> : null}
    </View>
  );
}

interface AuthorFieldProps {
  control: Control<EpigramCreateFormValues>;
  authorType: AuthorType;
  authorErrorMessage?: string;
}

function AuthorField({
  control,
  authorType,
  authorErrorMessage,
}: AuthorFieldProps): ReactElement {
  return (
    <View className="gap-3">
      <FieldLabel label="저자" required />
      <Controller
        name="authorType"
        control={control}
        render={({ field }) => (
          <View className="flex-row flex-wrap gap-x-6 gap-y-3">
            {AUTHOR_OPTIONS.map((option) => (
              <AuthorRadioOption
                key={option.value}
                option={option}
                isSelected={field.value === option.value}
                onSelect={() => field.onChange(option.value)}
              />
            ))}
          </View>
        )}
      />
      {authorType === AUTHOR_TYPE.DIRECT ? (
        <Controller
          name="authorName"
          control={control}
          render={({ field }) => (
            <Input
              value={field.value ?? ""}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="저자 이름 입력"
              error={authorErrorMessage}
            />
          )}
        />
      ) : null}
    </View>
  );
}

interface AuthorRadioOptionProps {
  option: AuthorOption;
  isSelected: boolean;
  onSelect: () => void;
}

function AuthorRadioOption({
  option,
  isSelected,
  onSelect,
}: AuthorRadioOptionProps): ReactElement {
  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={option.label}
      className="flex-row items-center gap-2 active:opacity-70"
    >
      <View
        className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
          isSelected ? "border-blue-900" : "border-blue-400"
        }`}
      >
        {isSelected ? (
          <View className="h-2.5 w-2.5 rounded-full bg-blue-900" />
        ) : null}
      </View>
      <Text className="font-sans text-sm text-black-500">{option.label}</Text>
    </Pressable>
  );
}

interface ReferenceFieldsProps {
  control: Control<EpigramCreateFormValues>;
  referenceTitleError?: string;
  referenceUrlError?: string;
}

function ReferenceFields({
  control,
  referenceTitleError,
  referenceUrlError,
}: ReferenceFieldsProps): ReactElement {
  return (
    <View className="gap-2">
      <FieldLabel label="출처" />
      <Controller
        name="referenceTitle"
        control={control}
        render={({ field }) => (
          <Input
            value={field.value ?? ""}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            placeholder="출처 제목 입력"
            error={referenceTitleError}
          />
        )}
      />
      <Controller
        name="referenceUrl"
        control={control}
        render={({ field }) => (
          <Input
            value={field.value ?? ""}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            placeholder="URL (ex. https://www.website.com)"
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            error={referenceUrlError}
          />
        )}
      />
    </View>
  );
}

interface TagsFieldProps {
  control: Control<EpigramCreateFormValues>;
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onAddTag: (currentTags: string[], onChange: (tags: string[]) => void) => void;
  onRemoveTag: (
    tag: string,
    currentTags: string[],
    onChange: (tags: string[]) => void,
  ) => void;
  errorMessage?: string;
}

function TagsField({
  control,
  tagInput,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  errorMessage,
}: TagsFieldProps): ReactElement {
  return (
    <Controller
      name="tags"
      control={control}
      render={({ field }) => {
        const isAtLimit = field.value.length >= MAX_TAG_COUNT;
        const canAdd = !isAtLimit && tagInput.trim().length > 0;

        function handleAdd(): void {
          onAddTag(field.value, field.onChange);
        }

        return (
          <View className="gap-2">
            <FieldLabel label="태그" />
            <View className="flex-row items-center gap-2">
              <TextInput
                value={tagInput}
                onChangeText={onTagInputChange}
                onSubmitEditing={handleAdd}
                editable={!isAtLimit}
                placeholder="입력하여 태그 작성 (최대 10자)"
                placeholderTextColor="#abb8ce"
                returnKeyType="done"
                blurOnSubmit={false}
                className="h-11 flex-1 rounded-xl border border-blue-300 bg-blue-200 px-4 font-sans text-sm text-black-950 focus:border-blue-500"
              />
              <Pressable
                onPress={handleAdd}
                disabled={!canAdd}
                accessibilityRole="button"
                accessibilityLabel="태그 추가"
                className={`h-11 items-center justify-center rounded-xl px-4 active:opacity-70 ${
                  canAdd ? "bg-blue-900" : "bg-blue-300"
                }`}
              >
                <Text className="font-sans text-xs font-semibold text-blue-100">
                  추가
                </Text>
              </Pressable>
            </View>

            {field.value.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {field.value.map((tag) => (
                  <TagChip
                    key={tag}
                    tag={tag}
                    onRemove={() =>
                      onRemoveTag(tag, field.value, field.onChange)
                    }
                  />
                ))}
              </View>
            ) : null}

            <Text className="font-sans text-xs text-blue-400">
              {isAtLimit
                ? "태그는 최대 3개까지 추가할 수 있습니다."
                : `${field.value.length}/3개 추가됨`}
            </Text>

            {errorMessage ? <FieldError message={errorMessage} /> : null}
          </View>
        );
      }}
    />
  );
}

interface TagChipProps {
  tag: string;
  onRemove: () => void;
}

function TagChip({ tag, onRemove }: TagChipProps): ReactElement {
  return (
    <View className="flex-row items-center gap-1 rounded-full bg-blue-200 py-1 pl-3 pr-2">
      <Text className="font-sans text-sm font-medium text-blue-700">
        #{tag}
      </Text>
      <Pressable
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel={`태그 ${tag} 삭제`}
        className="h-5 w-5 items-center justify-center rounded-full active:bg-blue-400"
      >
        <X size={12} color="#abb8ce" strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

interface FormActionsProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  submitLabel: string;
  onCancel?: () => void;
  cancelLabel: string;
}

function FormActions({
  onSubmit,
  isSubmitting,
  canSubmit,
  submitLabel,
  onCancel,
  cancelLabel,
}: FormActionsProps): ReactElement {
  if (!onCancel) {
    return (
      <Button onPress={onSubmit} isLoading={isSubmitting} disabled={!canSubmit}>
        {submitLabel}
      </Button>
    );
  }

  return (
    <View className="flex-row gap-3">
      <Button
        onPress={onCancel}
        className="flex-1 bg-blue-300 active:bg-blue-400"
        textClassName="text-blue-900"
      >
        {cancelLabel}
      </Button>
      <Button
        onPress={onSubmit}
        isLoading={isSubmitting}
        disabled={!canSubmit}
        className="flex-1"
      >
        {submitLabel}
      </Button>
    </View>
  );
}

interface FieldLabelProps {
  label: string;
  required?: boolean;
}

function FieldLabel({
  label,
  required = false,
}: FieldLabelProps): ReactElement {
  return (
    <Text className="font-sans text-sm font-semibold text-blue-900">
      {label}
      {required ? <Text className="text-error"> *</Text> : null}
    </Text>
  );
}

interface FieldErrorProps {
  message: string;
}

function FieldError({ message }: FieldErrorProps): ReactElement {
  return (
    <Text className="font-sans text-xs text-error" accessibilityRole="alert">
      {message}
    </Text>
  );
}
