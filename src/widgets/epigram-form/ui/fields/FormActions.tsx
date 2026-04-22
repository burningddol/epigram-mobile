import type { ReactElement } from "react";
import { View } from "react-native";

import { Button } from "~/shared/ui/Button";

interface FormActionsProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
  submitLabel: string;
  onCancel?: () => void;
  cancelLabel?: string;
}

export function FormActions({
  onSubmit,
  isSubmitting,
  canSubmit,
  submitLabel,
  onCancel,
  cancelLabel = "취소",
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
