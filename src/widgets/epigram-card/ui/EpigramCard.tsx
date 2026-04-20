import { memo, type ReactElement } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Epigram } from "~/entities/epigram";

interface EpigramCardProps {
  epigram: Epigram;
  onPress?: (epigramId: number) => void;
}

const RULE_LINE_SPACING = 24;
const RULE_LINE_COUNT = 20;
const RULE_LINE_COLOR = "#f2f2f2";

function RuledLines(): ReactElement {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: RULE_LINE_COUNT }).map((_, index) => (
        <View
          key={index}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: (index + 1) * RULE_LINE_SPACING,
            height: 1,
            backgroundColor: RULE_LINE_COLOR,
          }}
        />
      ))}
    </View>
  );
}

function EpigramCardBase({ epigram, onPress }: EpigramCardProps): ReactElement {
  function handlePress(): void {
    onPress?.(epigram.id);
  }

  return (
    <View className="w-full gap-2">
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`에피그램: ${epigram.content}`}
        className="w-full overflow-hidden rounded-2xl border border-line-100 bg-surface p-6 shadow-card active:bg-blue-200"
      >
        <RuledLines />
        <View className="gap-5">
          <Text className="font-serif text-base leading-relaxed text-black-600">
            {epigram.content}
          </Text>
          <Text className="text-right font-serif text-base text-blue-400">
            - {epigram.author} -
          </Text>
        </View>
      </Pressable>

      {epigram.tags.length > 0 && (
        <View className="flex-row flex-wrap justify-end gap-3">
          {epigram.tags.map((tag) => (
            <Text key={tag.id} className="font-serif text-sm text-blue-400">
              #{tag.name}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

export const EpigramCard = memo(EpigramCardBase);
