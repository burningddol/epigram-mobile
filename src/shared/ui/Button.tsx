import type { ReactElement, ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, type PressableProps } from "react-native";

import { cn } from "~/shared/lib/cn";

export interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  textClassName?: string;
}

export function Button({
  children,
  isLoading = false,
  disabled,
  className,
  textClassName,
  ...rest
}: ButtonProps): ReactElement {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      disabled={isDisabled}
      className={cn(
        "h-touch-lg items-center justify-center rounded-xl bg-blue-500 active:bg-blue-600",
        isDisabled && "bg-blue-400",
        className
      )}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text className={cn("font-sans text-base font-semibold text-blue-100", textClassName)}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}
