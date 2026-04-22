import type { ReactElement, ReactNode } from "react";
import { Text, View } from "react-native";

import { cn } from "~/shared/lib/cn";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  variant?: "boxed" | "plain";
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  variant = "plain",
  className,
}: EmptyStateProps): ReactElement {
  const containerClass =
    variant === "boxed"
      ? "items-center gap-2 rounded-2xl border border-dashed border-line-200 px-4 py-10"
      : "flex-1 items-center justify-center py-20";

  return (
    <View className={cn(containerClass, className)}>
      {icon}
      <Text
        className={cn(
          variant === "boxed"
            ? "font-sans text-sm font-semibold text-black-700"
            : "font-serif text-base text-black-300",
        )}
      >
        {title}
      </Text>
      {description !== undefined && (
        <Text
          className={cn(
            variant === "boxed"
              ? "font-sans text-xs text-black-300"
              : "mt-2 font-sans text-sm text-blue-400",
          )}
        >
          {description}
        </Text>
      )}
    </View>
  );
}
