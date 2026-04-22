import { ExternalLink } from "lucide-react-native";
import { type ReactElement } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import type { EpigramDetail } from "~/entities/epigram";
import { LikeButton } from "~/features/epigram-like";

interface EpigramDetailCardProps {
  epigram: EpigramDetail;
}

interface ReferenceProps {
  title: string;
  url: string | null;
}

const RULE_LINE_SPACING = 28;
const RULE_LINE_COUNT = 24;
const RULE_LINE_COLOR = "#f2f2f2";
const ALLOWED_URL_SCHEMES = ["http:", "https:"] as const;

function isOpenableUrl(raw: string): boolean {
  try {
    const parsed = new URL(raw);
    return ALLOWED_URL_SCHEMES.includes(
      parsed.protocol as (typeof ALLOWED_URL_SCHEMES)[number],
    );
  } catch {
    return false;
  }
}

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

function Reference({ title, url }: ReferenceProps): ReactElement {
  const canOpen = url !== null && isOpenableUrl(url);

  async function handleOpenReference(): Promise<void> {
    if (!canOpen || url === null) return;
    await Linking.openURL(url);
  }

  if (!canOpen) {
    return (
      <Text className="text-right font-sans text-xs text-black-300">
        {title}
      </Text>
    );
  }

  return (
    <Pressable
      onPress={handleOpenReference}
      accessibilityRole="link"
      accessibilityLabel={`출처 ${title} 열기`}
      className="flex-row items-center justify-end gap-1 self-end"
    >
      <Text className="font-sans text-xs text-blue-500 underline">{title}</Text>
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
        {epigram.referenceTitle && (
          <Reference
            title={epigram.referenceTitle}
            url={epigram.referenceUrl}
          />
        )}
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
