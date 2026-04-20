import { forwardRef, useState, type ReactElement } from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

import { cn } from "~/shared/lib/cn";

export interface InputProps extends Omit<TextInputProps, "style"> {
  error?: string;
  containerClassName?: string;
  inputClassName?: string;
}

function InputImpl(
  { error, containerClassName, inputClassName, onFocus, onBlur, ...rest }: InputProps,
  ref: React.ForwardedRef<TextInput>
): ReactElement {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(error);

  return (
    <View className={cn("w-full", containerClassName)}>
      <TextInput
        ref={ref}
        placeholderTextColor="#abb8ce"
        className={cn(
          "w-full rounded border bg-blue-200 px-4 py-3 font-sans text-base text-black-900",
          "border-blue-300",
          isFocused && "border-blue-500",
          hasError && "border-error",
          inputClassName
        )}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        {...rest}
      />
      {hasError && (
        <Text className="mt-1 font-sans text-xs text-error" accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
}

export const Input = forwardRef<TextInput, InputProps>(InputImpl);
