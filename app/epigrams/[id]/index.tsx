import { useLocalSearchParams } from "expo-router";
import type { ReactElement } from "react";

import { EpigramDetailScreen } from "~/views/epigram-detail";

export default function EpigramDetailRoute(): ReactElement | null {
  const { id } = useLocalSearchParams<{ id: string }>();
  const epigramId = Number(id);

  if (!Number.isInteger(epigramId) || epigramId <= 0) return null;

  return <EpigramDetailScreen epigramId={epigramId} />;
}
