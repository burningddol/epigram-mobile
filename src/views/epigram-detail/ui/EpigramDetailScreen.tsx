import { Redirect, router } from "expo-router";
import { ArrowLeft, ExternalLink } from "lucide-react-native";
import { type ReactElement } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useEpigramDetail, type EpigramDetail } from "~/entities/epigram";
import { useMe } from "~/entities/user";
import { LikeButton } from "~/features/epigram-like";
import { CommentSection } from "~/widgets/comment-section";

interface EpigramDetailScreenProps {
  epigramId: number;
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

function BackButton(): ReactElement {
  function handleBack(): void {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/feeds");
  }

  return (
    <Pressable
      onPress={handleBack}
      accessibilityRole="button"
      accessibilityLabel="뒤로 가기"
      className="h-10 w-10 items-center justify-center rounded-full active:bg-blue-200"
    >
      <ArrowLeft size={22} color="#454545" />
    </Pressable>
  );
}

function LoadingState(): ReactElement {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator color="#6a82a9" />
    </View>
  );
}

function ErrorState(): ReactElement {
  return (
    <View className="flex-1 items-center justify-center px-screen-x">
      <Text className="font-sans text-base text-error">
        에피그램을 불러오지 못했습니다
      </Text>
    </View>
  );
}

function Reference({ epigram }: { epigram: EpigramDetail }): ReactElement | null {
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

function EpigramCard({ epigram }: { epigram: EpigramDetail }): ReactElement {
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

export function EpigramDetailScreen({
  epigramId,
}: EpigramDetailScreenProps): ReactElement | null {
  const { user, isLoading: isMeLoading } = useMe();
  const {
    data: epigram,
    isLoading: isEpigramLoading,
    isError,
  } = useEpigramDetail(epigramId);

  if (isMeLoading) return null;
  if (!user) return <Redirect href="/login" />;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center px-screen-x py-2">
        <BackButton />
      </View>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ShowContent
          epigramId={epigramId}
          epigram={epigram}
          isLoading={isEpigramLoading}
          isError={isError}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface ShowContentProps {
  epigramId: number;
  epigram: EpigramDetail | undefined;
  isLoading: boolean;
  isError: boolean;
}

function ShowContent({
  epigramId,
  epigram,
  isLoading,
  isError,
}: ShowContentProps): ReactElement {
  if (isLoading) return <LoadingState />;
  if (isError || !epigram) return <ErrorState />;

  return (
    <CommentSection
      epigramId={epigramId}
      listHeader={<EpigramCard epigram={epigram} />}
    />
  );
}
