import { router } from "expo-router";
import { MoreVertical } from "lucide-react-native";
import { type ReactElement } from "react";
import { Alert, Pressable } from "react-native";

import { useEpigramDetail } from "~/entities/epigram";
import { useMe } from "~/entities/user";
import { useEpigramDelete } from "~/features/epigram-delete";
import { ErrorState, LoadingState, ScreenLayout } from "~/shared/ui";
import { EpigramDetailCard } from "~/widgets/epigram-detail-card";
import { EpigramDetailList } from "~/widgets/epigram-detail-list";

interface EpigramDetailScreenProps {
  epigramId: number;
}

interface ActionMenuProps {
  epigramId: number;
}

function ActionMenu({ epigramId }: ActionMenuProps): ReactElement {
  const { handleDelete, isDeleting } = useEpigramDelete(epigramId);

  function handleOpenMenu(): void {
    Alert.alert(
      "에피그램",
      undefined,
      [
        {
          text: "수정",
          onPress: () => router.push(`/epigrams/${epigramId}/edit`),
        },
        { text: "삭제", style: "destructive", onPress: handleDelete },
        { text: "취소", style: "cancel" },
      ],
      { cancelable: true },
    );
  }

  return (
    <Pressable
      onPress={handleOpenMenu}
      disabled={isDeleting}
      accessibilityRole="button"
      accessibilityLabel="에피그램 메뉴 열기"
      className="h-10 w-10 items-center justify-center rounded-full active:bg-blue-200"
    >
      <MoreVertical size={22} color="#454545" />
    </Pressable>
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

  if (isMeLoading || !user) return <LoadingState />;

  const isOwner = epigram !== undefined && epigram.writerId === user.id;

  function renderBody(): ReactElement {
    if (isEpigramLoading) return <LoadingState />;
    if (isError || !epigram) {
      return <ErrorState message="에피그램을 불러오지 못했습니다" />;
    }
    return (
      <EpigramDetailList
        epigramId={epigramId}
        listHeader={<EpigramDetailCard epigram={epigram} />}
      />
    );
  }

  return (
    <ScreenLayout
      headerRight={isOwner ? <ActionMenu epigramId={epigramId} /> : undefined}
    >
      {renderBody()}
    </ScreenLayout>
  );
}
