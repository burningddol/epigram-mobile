import { router } from "expo-router";

export function navigateToEpigram(epigramId: number): void {
  router.push({
    pathname: "/epigrams/[id]",
    params: { id: String(epigramId) },
  });
}
