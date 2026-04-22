import type { ReactElement } from "react";
import { Text } from "react-native";

interface FieldLabelProps {
  label: string;
  required?: boolean;
}

export function FieldLabel({
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
