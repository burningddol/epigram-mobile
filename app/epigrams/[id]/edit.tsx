import { useLocalSearchParams } from "expo-router";
import type { ReactElement } from "react";

import { AuthGate } from "~/features/auth";
import { EpigramEditScreen } from "~/views/epigram-edit";

export default function EpigramEditRoute(): ReactElement | null {
  const { id } = useLocalSearchParams<{ id: string }>();
  const epigramId = Number(id);

  if (!Number.isInteger(epigramId) || epigramId <= 0) return null;

  return (
    <AuthGate mode="protected">
      <EpigramEditScreen epigramId={epigramId} />
    </AuthGate>
  );
}
