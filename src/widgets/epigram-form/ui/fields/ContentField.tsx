import type { ReactElement } from "react";
import { Controller, type Control } from "react-hook-form";
import { Text, TextInput, View } from "react-native";

import { type EpigramCreateFormValues } from "~/features/epigram-create";

import { FieldError } from "./FieldError";
import { FieldLabel } from "./FieldLabel";

const MAX_CONTENT_LENGTH = 500;
const NEAR_LIMIT_RATIO = 0.9;

interface ContentFieldProps {
  control: Control<EpigramCreateFormValues>;
  contentLength: number;
  errorMessage?: string;
}

function getCounterClassName(contentLength: number): string {
  if (contentLength > MAX_CONTENT_LENGTH) return "font-semibold text-error";
  if (contentLength >= MAX_CONTENT_LENGTH * NEAR_LIMIT_RATIO)
    return "text-black-300";
  return "text-blue-400";
}

export function ContentField({
  control,
  contentLength,
  errorMessage,
}: ContentFieldProps): ReactElement {
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
      <Text
        className={`text-right font-sans text-xs ${getCounterClassName(contentLength)}`}
      >
        {contentLength} / {MAX_CONTENT_LENGTH}
      </Text>
      {errorMessage ? <FieldError message={errorMessage} /> : null}
    </View>
  );
}

export { MAX_CONTENT_LENGTH };
