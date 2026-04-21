import { useLocalSearchParams } from "expo-router";
import type { ReactElement } from "react";

import { EpigramEditScreen } from "~/views/epigram-edit";

export default function EpigramEditRoute(): ReactElement | null {
  const { id } = useLocalSearchParams<{ id: string }>();
  const epigramId = Number(id);

  if (!Number.isInteger(epigramId) || epigramId <= 0) return null;

  return <EpigramEditScreen epigramId={epigramId} />;
}
