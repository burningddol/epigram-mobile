import { Redirect, router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useMemo, type ReactElement } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useEpigramDetail, type EpigramDetail } from "~/entities/epigram";
import { useMe } from "~/entities/user";
import {
  AUTHOR_TYPE,
  type EpigramCreateFormValues,
} from "~/features/epigram-create";
import { useEpigramEdit } from "~/features/epigram-edit";
import { EpigramForm } from "~/widgets/epigram-form";

const UNKNOWN_AUTHOR = "알 수 없음";

interface EpigramEditScreenProps {
  epigramId: number;
}

function resolveDefaultValues(epigram: EpigramDetail): EpigramCreateFormValues {
  const isUnknown = epigram.author === UNKNOWN_AUTHOR;
  return {
    content: epigram.content,
    authorType: isUnknown ? AUTHOR_TYPE.UNKNOWN : AUTHOR_TYPE.DIRECT,
    authorName: isUnknown ? "" : epigram.author,
    referenceTitle: epigram.referenceTitle ?? "",
    referenceUrl: epigram.referenceUrl ?? "",
    tags: epigram.tags.map((tag) => tag.name),
  };
}

function HeaderBar(): ReactElement {
  function handleBack(): void {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/feeds");
  }

  return (
    <View className="flex-row items-center px-screen-x py-2">
      <Pressable
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel="뒤로 가기"
        className="h-10 w-10 items-center justify-center rounded-full active:bg-blue-200"
      >
        <ArrowLeft size={22} color="#454545" />
      </Pressable>
    </View>
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

export function EpigramEditScreen({
  epigramId,
}: EpigramEditScreenProps): ReactElement | null {
  const { user, isLoading: isMeLoading } = useMe();
  const {
    data: epigram,
    isLoading: isEpigramLoading,
    isError,
  } = useEpigramDetail(epigramId);
  const {
    tagInput,
    isSubmitting,
    hasError,
    handleTagInputChange,
    handleAddTag,
    handleRemoveTag,
    handleCancel,
    submit,
  } = useEpigramEdit(epigramId);

  const isUnauthorized =
    !isMeLoading &&
    user !== null &&
    epigram !== undefined &&
    epigram.writerId !== user.id;

  useEffect(() => {
    if (isUnauthorized) router.replace(`/epigrams/${epigramId}`);
  }, [isUnauthorized, epigramId]);

  const defaultValues = useMemo(
    () => (epigram ? resolveDefaultValues(epigram) : null),
    [epigram],
  );

  if (isMeLoading) return null;
  if (!user) return <Redirect href="/login" />;

  function renderBody(): ReactElement {
    if (isEpigramLoading) return <LoadingState />;
    if (isError || !epigram || !defaultValues) return <ErrorState />;
    if (isUnauthorized) return <LoadingState />;
    return (
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-screen-x pb-12 pt-2 gap-6"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="font-serif-bold text-2xl text-black-900">
          에피그램 수정
        </Text>
        <EpigramForm
          defaultValues={defaultValues}
          onSubmit={submit}
          isSubmitting={isSubmitting}
          hasError={hasError}
          errorMessage="에피그램을 수정하지 못했습니다. 잠시 후 다시 시도해주세요."
          submitLabel="수정 완료"
          tagInput={tagInput}
          onTagInputChange={handleTagInputChange}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onCancel={handleCancel}
        />
      </ScrollView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <HeaderBar />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {renderBody()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
