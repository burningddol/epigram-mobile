interface EpigramListParams {
  limit: number;
  keyword?: string;
  writerId?: number;
}

export const epigramKeys = {
  all: ["epigrams"] as const,
  detail: (id: number) => ["epigrams", id] as const,
  today: () => ["epigrams", "today"] as const,
  list: (params: EpigramListParams) => ["epigrams", params] as const,
  search: (keyword: string) => ["search", "epigrams", keyword] as const,
};
