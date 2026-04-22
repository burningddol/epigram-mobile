import type { ReactElement } from "react";
import { Text } from "react-native";

interface FieldErrorProps {
  message: string;
}

export function FieldError({ message }: FieldErrorProps): ReactElement {
  return (
    <Text className="font-sans text-xs text-error" accessibilityRole="alert">
      {message}
    </Text>
  );
}
