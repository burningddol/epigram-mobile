import { router } from "expo-router";
import { memo, type ReactElement, useMemo } from "react";
import { Pressable, Text, View } from "react-native";

import type { Epigram } from "~/entities/epigram";

interface SearchResultItemProps {
  epigram: Epigram;
  keyword: string;
}

interface HighlightedSegment {
  text: string;
  isMatch: boolean;
}

function buildSegments(text: string, regex: RegExp): HighlightedSegment[] {
  // split alternates: even indices are plain, odd indices are matched groups
  return text.split(regex).map((part, index) => ({
    text: part,
    isMatch: index % 2 === 1,
  }));
}

interface HighlightedTextProps {
  text: string;
  keyword: string;
  className: string;
  highlightClassName: string;
}

function HighlightedText({
  text,
  keyword,
  className,
  highlightClassName,
}: HighlightedTextProps): ReactElement {
  const regex = useMemo(() => {
    if (!keyword.trim()) return null;
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(${escaped})`, "i");
  }, [keyword]);

  if (!regex) return <Text className={className}>{text}</Text>;

  return (
    <Text className={className}>
      {buildSegments(text, regex).map((segment, index) =>
        segment.isMatch ? (
          <Text key={index} className={highlightClassName}>
            {segment.text}
          </Text>
        ) : (
          segment.text
        ),
      )}
    </Text>
  );
}

interface TagListProps {
  tags: Epigram["tags"];
  keyword: string;
}

function TagList({ tags, keyword }: TagListProps): ReactElement | null {
  if (tags.length === 0) return null;

  return (
    <View
      className="flex-row flex-wrap gap-x-3 gap-y-1"
      accessibilityLabel="태그 목록"
    >
      {tags.map((tag) => (
        <Text key={tag.id} className="font-sans text-sm text-blue-500">
          #
          <HighlightedText
            text={tag.name}
            keyword={keyword}
            className="font-sans text-sm text-blue-500"
            highlightClassName="font-semibold text-illust-blue"
          />
        </Text>
      ))}
    </View>
  );
}

function SearchResultItemBase({
  epigram,
  keyword,
}: SearchResultItemProps): ReactElement {
  const authorLabel = epigram.referenceTitle
    ? `${epigram.author} 《${epigram.referenceTitle}》`
    : epigram.author;

  function handlePress(): void {
    router.push(`/epigrams/${epigram.id}`);
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      className="border-b border-line-100 py-5 active:bg-blue-200/40"
    >
      <View className="gap-4">
        <View className="gap-3">
          <HighlightedText
            text={epigram.content}
            keyword={keyword}
            className="font-serif text-base text-black-700"
            highlightClassName="font-semibold text-illust-blue"
          />
          <Text className="font-serif text-sm text-blue-500">
            - {authorLabel} -
          </Text>
        </View>

        <TagList tags={epigram.tags} keyword={keyword} />
      </View>
    </Pressable>
  );
}

export const SearchResultItem = memo(SearchResultItemBase);
