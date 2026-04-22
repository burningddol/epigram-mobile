import { Redirect } from "expo-router";
import { type ReactElement } from "react";

import { useEpigramDetail } from "~/entities/epigram";
import { useMe } from "~/entities/user";
import { ErrorState, LoadingState, ScreenLayout } from "~/shared/ui";

import { EpigramEditBody } from "./EpigramEditBody";

interface EpigramEditScreenProps {
  epigramId: number;
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

  if (isMeLoading || !user) return <LoadingState />;
  if (isEpigramLoading) {
    return (
      <ScreenLayout>
        <LoadingState />
      </ScreenLayout>
    );
  }
  if (isError || !epigram) {
    return (
      <ScreenLayout>
        <ErrorState message="에피그램을 불러오지 못했습니다" />
      </ScreenLayout>
    );
  }
  if (epigram.writerId !== user.id) {
    return <Redirect href={`/epigrams/${epigramId}`} />;
  }

  return (
    <ScreenLayout>
      <EpigramEditBody epigram={epigram} />
    </ScreenLayout>
  );
}
