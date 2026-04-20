import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "epigram_recent_searches";
const MAX_RECENT_SEARCHES = 10;

interface UseRecentSearchesResult {
  recentSearches: string[];
  addRecentSearch: (keyword: string) => void;
  clearAllRecentSearches: () => void;
}

function parseStored(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    if (!parsed.every((item) => typeof item === "string")) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function useRecentSearches(): UseRecentSearchesResult {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        const parsed = parseStored(raw);
        if (parsed) setRecentSearches(parsed);
      })
      .catch(() => {
        // 읽기 실패는 빈 배열로 폴백
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: string[]): void => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {
      // 저장 실패는 다음 기회로 미룸
    });
  }, []);

  const addRecentSearch = useCallback(
    (keyword: string): void => {
      const trimmed = keyword.trim();
      if (!trimmed) return;
      setRecentSearches((prev) => {
        const next = [trimmed, ...prev.filter((k) => k !== trimmed)].slice(
          0,
          MAX_RECENT_SEARCHES,
        );
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const clearAllRecentSearches = useCallback((): void => {
    setRecentSearches([]);
    persist([]);
  }, [persist]);

  return { recentSearches, addRecentSearch, clearAllRecentSearches };
}
