import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useStockSearch } from "../hooks/useStockQueries";
import { useStockStore } from "../store/stockStore";
import { StockSearchResult } from "../types/stock";
import { useDebounce } from "../hooks/usePerformance";

interface StockSearchProps {
  onSelect?: (symbol: string) => void;
}

const StockSearch: React.FC<StockSearchProps> = React.memo(({ onSelect }) => {
  const { searchQuery, setSearchQuery } = useStockStore();
  const [isOpen, setIsOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // 디바운스된 검색 쿼리
  const debouncedQuery = useDebounce(localQuery, 300);

  const {
    data: searchResults,
    isLoading,
    error,
  } = useStockSearch(debouncedQuery);

  useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery, setSearchQuery]);

  const handleSelect = useCallback(
    (result: StockSearchResult) => {
      setLocalQuery("");
      setSearchQuery("");
      setIsOpen(false);
      onSelect?.(result.symbol);
    },
    [setSearchQuery, onSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalQuery(value);
      setIsOpen(value.length >= 2);
    },
    []
  );

  const handleInputFocus = useCallback(() => {
    if (localQuery.length >= 2) {
      setIsOpen(true);
    }
  }, [localQuery.length]);

  const handleInputBlur = useCallback(() => {
    setTimeout(() => setIsOpen(false), 200);
  }, []);

  // 검색 결과 렌더링 메모이제이션
  const searchResultsContent = useMemo(() => {
    if (error) {
      return (
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <div className="text-red-600 font-medium mb-2">
            검색 중 오류가 발생했습니다
          </div>
          <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
            다시 시도
          </button>
        </div>
      );
    }

    if (searchResults && searchResults.length > 0) {
      return (
        <div className="p-2">
          {searchResults.map((result, index) => (
            <div
              key={`${result.symbol}-${index}`}
              onClick={() => handleSelect(result)}
              className="flex items-center p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 
                       cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg
                       border border-transparent hover:border-blue-200"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-white font-bold text-lg">
                  {result.symbol.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-lg">
                  {result.symbol}
                </div>
                <div className="text-gray-600 text-sm truncate">
                  {result.name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {result.exchange}
                </div>
                <div className="text-xs text-gray-400 mt-1">{result.type}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (localQuery.length >= 2) {
      return (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">🔍</span>
          </div>
          <div className="text-gray-500 font-medium mb-2">
            검색 결과가 없습니다
          </div>
          <p className="text-gray-400 text-sm">다른 키워드로 검색해보세요</p>
        </div>
      );
    }

    return null;
  }, [error, searchResults, localQuery.length, handleSelect]);

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="주식 심볼 또는 회사명 검색..."
          value={localQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="w-full pl-12 pr-12 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl 
                   focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none
                   text-lg placeholder-gray-500 transition-all duration-300
                   hover:bg-white/90 hover:shadow-lg"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-3 bg-white/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
          {searchResultsContent}
        </div>
      )}
    </div>
  );
});

StockSearch.displayName = "StockSearch";

export default StockSearch;
