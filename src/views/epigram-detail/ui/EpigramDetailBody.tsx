import type { ReactElement } from "react";

import { useEpigramDetail } from "~/entities/epigram";
import { ErrorState, LoadingState } from "~/shared/ui";
import { EpigramDetailCard } from "~/widgets/epigram-detail-card";
import { EpigramDetailList } from "~/widgets/epigram-detail-list";

interface EpigramDetailBodyProps {
  epigramId: number;
}

export function EpigramDetailBody({
  epigramId,
}: EpigramDetailBodyProps): ReactElement {
  const { data: epigram, isLoading, isError } = useEpigramDetail(epigramId);

  if (isLoading) return <LoadingState />;
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
