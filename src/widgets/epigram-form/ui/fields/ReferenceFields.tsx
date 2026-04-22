import type { ReactElement } from "react";
import { Controller, type Control } from "react-hook-form";
import { View } from "react-native";

import { type EpigramCreateFormValues } from "~/features/epigram-create";
import { Input } from "~/shared/ui/Input";

import { FieldLabel } from "./FieldLabel";

interface ReferenceFieldsProps {
  control: Control<EpigramCreateFormValues>;
  referenceTitleError?: string;
  referenceUrlError?: string;
}

export function ReferenceFields({
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
