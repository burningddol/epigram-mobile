import { apiClient } from "~/shared/api/client";

import { epigramSchema, type Epigram } from "../model/schema";

export interface UpdateEpigramRequest {
  content?: string;
  author?: string;
  referenceTitle?: string;
  referenceUrl?: string;
  tags?: string[];
}

export async function updateEpigram(
  epigramId: number,
  data: UpdateEpigramRequest,
): Promise<Epigram> {
  const response = await apiClient.patch<unknown>(
    `/epigrams/${epigramId}`,
    data,
  );
  return epigramSchema.parse(response.data);
}
