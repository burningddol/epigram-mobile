import { Heart } from "lucide-react-native";
import type { ReactElement } from "react";
import { Pressable, Text } from "react-native";

import { cn } from "~/shared/lib/cn";

import { useEpigramLike } from "../model/useEpigramLike";

interface LikeButtonProps {
  epigramId: number;
  likeCount: number;
  isLiked: boolean;
}

export function LikeButton({
  epigramId,
  likeCount,
  isLiked,
}: LikeButtonProps): ReactElement {
  const { toggle, isPending } = useEpigramLike(epigramId);

  return (
    <Pressable
      onPress={toggle}
      disabled={isPending}
      accessibilityRole="button"
      accessibilityLabel={isLiked ? "좋아요 취소" : "좋아요"}
      accessibilityState={{ disabled: isPending, selected: isLiked }}
      className={cn(
        "flex-row items-center gap-1.5 self-center rounded-full px-4 py-2",
        isLiked ? "bg-black-500" : "border border-blue-300 bg-surface",
        isPending && "opacity-60",
      )}
    >
      <Heart
        size={16}
        strokeWidth={2}
        color={isLiked ? "#ffffff" : "#6a82a9"}
        fill={isLiked ? "#ffffff" : "transparent"}
      />
      <Text
        className={cn(
          "font-sans text-sm font-semibold",
          isLiked ? "text-white" : "text-blue-600",
        )}
      >
        {likeCount}
      </Text>
    </Pressable>
  );
}
