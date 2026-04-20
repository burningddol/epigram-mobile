import { Redirect, router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { type ReactElement } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useEpigramDetail } from "~/entities/epigram";
import { useMe } from "~/entities/user";
import { EpigramDetailCard } from "~/widgets/epigram-detail-card";
import { EpigramDetailList } from "~/widgets/epigram-detail-list";

interface EpigramDetailScreenProps {
  epigramId: number;
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

  function renderBody(): ReactElement {
    if (isEpigramLoading) return <LoadingState />;
    if (isError || !epigram) return <ErrorState />;
    return (
      <EpigramDetailList
        epigramId={epigramId}
        listHeader={<EpigramDetailCard epigram={epigram} />}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center px-screen-x py-2">
        <BackButton />
      </View>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {renderBody()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
