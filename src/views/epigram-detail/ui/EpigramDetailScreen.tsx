import { type ReactElement } from "react";

import { useEpigramDetail } from "~/entities/epigram";
import { useMe } from "~/entities/user";
import { useEpigramDelete } from "~/features/epigram-delete";
import { LoadingState, ScreenLayout } from "~/shared/ui";

import { EpigramDetailActionMenu } from "./EpigramDetailActionMenu";
import { EpigramDetailBody } from "./EpigramDetailBody";

interface EpigramDetailScreenProps {
  epigramId: number;
}

export function EpigramDetailScreen({
  epigramId,
}: EpigramDetailScreenProps): ReactElement | null {
  const { user, isLoading: isMeLoading } = useMe();
  const { data: epigram } = useEpigramDetail(epigramId);
  const { handleDelete, isDeleting } = useEpigramDelete(epigramId);

  if (isMeLoading || !user) return <LoadingState />;

  const isOwner = epigram !== undefined && epigram.writerId === user.id;

  return (
    <ScreenLayout
      headerRight={
        isOwner ? (
          <EpigramDetailActionMenu
            epigramId={epigramId}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        ) : undefined
      }
    >
      <EpigramDetailBody epigramId={epigramId} />
    </ScreenLayout>
  );
}
