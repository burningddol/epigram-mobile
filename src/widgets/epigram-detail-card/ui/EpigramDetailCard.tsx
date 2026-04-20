import { ExternalLink } from "lucide-react-native";
import type { ReactElement } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import type { EpigramDetail } from "~/entities/epigram";
import { LikeButton } from "~/features/epigram-like";

interface EpigramDetailCardProps {
  epigram: EpigramDetail;
}

const RULE_LINE_SPACING = 28;
const RULE_LINE_COUNT = 24;
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

function Reference({
  epigram,
}: {
  epigram: EpigramDetail;
}): ReactElement | null {
  if (!epigram.referenceTitle) return null;

  async function handleOpenReference(): Promise<void> {
    if (!epigram.referenceUrl) return;
    await Linking.openURL(epigram.referenceUrl);
  }

  if (!epigram.referenceUrl) {
    return (
      <Text className="text-right font-sans text-xs text-black-300">
        {epigram.referenceTitle}
      </Text>
    );
  }

  return (
    <Pressable
      onPress={handleOpenReference}
      accessibilityRole="link"
      accessibilityLabel={`출처 ${epigram.referenceTitle} 열기`}
      className="flex-row items-center justify-end gap-1 self-end"
    >
      <Text className="font-sans text-xs text-blue-500 underline">
        {epigram.referenceTitle}
      </Text>
      <ExternalLink size={12} color="#3b82f6" />
    </Pressable>
  );
}

export function EpigramDetailCard({
  epigram,
}: EpigramDetailCardProps): ReactElement {
  return (
    <View className="w-full overflow-hidden rounded-2xl border border-line-100 bg-surface p-6 shadow-card">
      <RuledLines />
      <View className="gap-6">
        <Text className="font-serif text-lg leading-relaxed text-black-700">
          {epigram.content}
        </Text>
        <Text className="text-right font-serif text-base text-blue-400">
          - {epigram.author} -
        </Text>
        <Reference epigram={epigram} />
        {epigram.tags.length > 0 && (
          <View className="flex-row flex-wrap justify-end gap-2">
            {epigram.tags.map((tag) => (
              <Text key={tag.id} className="font-serif text-sm text-blue-400">
                #{tag.name}
              </Text>
            ))}
          </View>
        )}
        <View className="items-center pt-2">
          <LikeButton
            epigramId={epigram.id}
            likeCount={epigram.likeCount}
            isLiked={epigram.isLiked}
          />
        </View>
      </View>
    </View>
  );
}
