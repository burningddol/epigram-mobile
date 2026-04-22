import { X } from "lucide-react-native";
import type { ReactElement } from "react";
import { Controller, type Control } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";

import { type EpigramCreateFormValues } from "~/features/epigram-create";

import { FieldError } from "./FieldError";
import { FieldLabel } from "./FieldLabel";

const MAX_TAG_COUNT = 3;

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

export function TagsField({
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
