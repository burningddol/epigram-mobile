export const emotionLogKeys = {
  all: ["emotionLogs"] as const,
  today: (userId: number) => ["emotionLogs", "today", userId] as const,
  monthly: (userId: number, year: number, month: number) =>
    ["emotionLogs", "monthly", userId, year, month] as const,
};
