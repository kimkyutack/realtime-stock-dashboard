import React, { useState, useEffect } from "react";
import { useStockSearch } from "../hooks/useStockQueries";
import { useStockStore } from "../store/stockStore";
import { StockSearchResult } from "../types/stock";

interface StockSearchProps {
  onSelect?: (symbol: string) => void;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSelect }) => {
  const { searchQuery, setSearchQuery } = useStockStore();
  const [isOpen, setIsOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const { data: searchResults, isLoading, error } = useStockSearch(localQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  const handleSelect = (result: StockSearchResult) => {
    setLocalQuery("");
    setSearchQuery("");
    setIsOpen(false);
    onSelect?.(result.symbol);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    setIsOpen(value.length >= 2);
  };

  const handleInputFocus = () => {
    if (localQuery.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="주식 심볼 또는 회사명 검색..."
          value={localQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {error ? (
            <div className="p-4 text-red-600 text-sm">
              검색 중 오류가 발생했습니다.
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div>
              {searchResults.map((result, index) => (
                <div
                  key={`${result.symbol}-${index}`}
                  onClick={() => handleSelect(result)}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {result.symbol}
                      </div>
                      <div className="text-sm text-gray-600">{result.name}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.exchange} • {result.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : localQuery.length >= 2 ? (
            <div className="p-4 text-gray-500 text-sm">
              검색 결과가 없습니다.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
