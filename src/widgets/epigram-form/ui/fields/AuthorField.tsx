import type { ReactElement } from "react";
import { Controller, type Control } from "react-hook-form";
import { Pressable, Text, View } from "react-native";

import {
  AUTHOR_TYPE,
  type AuthorType,
  type EpigramCreateFormValues,
} from "~/features/epigram-create";
import { Input } from "~/shared/ui/Input";

import { FieldLabel } from "./FieldLabel";

interface AuthorOption {
  value: AuthorType;
  label: string;
}

const AUTHOR_OPTIONS: AuthorOption[] = [
  { value: AUTHOR_TYPE.DIRECT, label: "직접 입력" },
  { value: AUTHOR_TYPE.UNKNOWN, label: "알 수 없음" },
  { value: AUTHOR_TYPE.SELF, label: "본인" },
];

interface AuthorFieldProps {
  control: Control<EpigramCreateFormValues>;
  authorType: AuthorType;
  authorErrorMessage?: string;
}

export function AuthorField({
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
