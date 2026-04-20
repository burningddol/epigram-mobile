import { useCallback, useState } from "react";

import { useRecentSearches } from "./useRecentSearches";

interface UseSearchResult {
  inputValue: string;
  activeKeyword: string;
  recentSearches: string[];
  handleInputChange: (value: string) => void;
  handleSearch: (keyword: string) => void;
  clearAllRecentSearches: () => void;
}

export function useSearch(): UseSearchResult {
  const [inputValue, setInputValue] = useState("");
  const [activeKeyword, setActiveKeyword] = useState("");
  const { recentSearches, addRecentSearch, clearAllRecentSearches } =
    useRecentSearches();

  const handleInputChange = useCallback((value: string): void => {
    setInputValue(value);
  }, []);

  const handleSearch = useCallback(
    (keyword: string): void => {
      const trimmed = keyword.trim();
      if (!trimmed) return;
      setInputValue(trimmed);
      setActiveKeyword(trimmed);
      addRecentSearch(trimmed);
    },
    [addRecentSearch],
  );

  return {
    inputValue,
    activeKeyword,
    recentSearches,
    handleInputChange,
    handleSearch,
    clearAllRecentSearches,
  };
}
