import { useLocalSearchParams } from "expo-router";
import type { ReactElement } from "react";

import { AuthGate } from "~/features/auth";
import { EpigramDetailScreen } from "~/views/epigram-detail";

export default function EpigramDetailRoute(): ReactElement | null {
  const { id } = useLocalSearchParams<{ id: string }>();
  const epigramId = Number(id);

  if (!Number.isInteger(epigramId) || epigramId <= 0) return null;

  return (
    <AuthGate mode="protected">
      <EpigramDetailScreen epigramId={epigramId} />
    </AuthGate>
  );
}
