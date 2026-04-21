import { apiClient } from "~/shared/api/client";

export async function deleteEpigram(epigramId: number): Promise<void> {
  await apiClient.delete(`/epigrams/${epigramId}`);
}
