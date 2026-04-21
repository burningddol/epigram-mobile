import { type ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import {
  EMOTION_META,
  EMOTION_ORDER,
  type Emotion,
} from "~/entities/emotion-log";

import { useEmotionSelect } from "../model/useEmotionSelect";

interface EmotionButtonProps {
  emotion: Emotion;
  isSelected: boolean;
  disabled: boolean;
  onPress: () => void;
}

function EmotionButton({
  emotion,
  isSelected,
  disabled,
  onPress,
}: EmotionButtonProps): ReactElement {
  const { emoji, label } = EMOTION_META[emotion];
  const containerClass = isSelected
    ? "bg-blue-100 border-blue-300"
    : "bg-background border-line-200";
  const labelClass = isSelected
    ? "font-semibold text-black-700"
    : "font-medium text-black-300";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`${label} 감정 선택`}
      accessibilityState={{ selected: isSelected, disabled }}
      className="items-center gap-2"
    >
      <View
        className={`h-16 w-16 items-center justify-center rounded-2xl border ${containerClass}`}
      >
        <Text style={{ fontSize: 32 }}>{emoji}</Text>
      </View>
      <Text className={`font-sans text-xs ${labelClass}`}>{label}</Text>
    </Pressable>
  );
}

export function EmotionSelector(): ReactElement {
  const { todayEmotion, isSubmitting, selectEmotion } = useEmotionSelect();

  function handlePress(emotion: Emotion): void {
    if (isSubmitting || todayEmotion === emotion) return;
    selectEmotion(emotion);
  }

  return (
    <View className="gap-4 rounded-2xl bg-white px-4 py-5">
      <Text className="font-sans text-base font-semibold text-black-600">
        오늘의 감정은 어떤가요?
      </Text>
      <View className="flex-row items-start justify-between">
        {EMOTION_ORDER.map((emotion) => (
          <EmotionButton
            key={emotion}
            emotion={emotion}
            isSelected={todayEmotion === emotion}
            disabled={isSubmitting}
            onPress={() => handlePress(emotion)}
          />
        ))}
      </View>
    </View>
  );
}
