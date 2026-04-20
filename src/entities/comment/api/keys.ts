interface ListParams {
  limit: number;
}

export const commentKeys = {
  all: ["comments"] as const,
  recent: (params: ListParams) => ["comments", params] as const,
  byEpigram: (epigramId: number) =>
    ["epigrams", epigramId, "comments"] as const,
  byEpigramList: (epigramId: number, params: ListParams) =>
    ["epigrams", epigramId, "comments", params] as const,
  byUser: (userId: number) => ["users", userId, "comments"] as const,
  byUserList: (userId: number, params: ListParams) =>
    ["users", userId, "comments", params] as const,
};
