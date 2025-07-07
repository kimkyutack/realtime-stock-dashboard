import React, { useCallback, useMemo } from "react";
import { StockData } from "../types/stock";
import {
  formatCurrency,
  formatPercentChange,
  formatVolume,
} from "../utils/formatters";
import { useStockStore } from "../store/stockStore";

interface StockCardProps {
  stock: StockData;
  onSelect?: (symbol: string) => void;
  showAddButton?: boolean;
}

const StockCard: React.FC<StockCardProps> = React.memo(
  ({ stock, onSelect, showAddButton = true }) => {
    const { addToWatchlist, removeFromWatchlist, watchlist, settings } =
      useStockStore();

    const isInWatchlist = useMemo(
      () => watchlist.some((item) => item.symbol === stock.symbol),
      [watchlist, stock.symbol]
    );

    const handleAddToWatchlist = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        addToWatchlist(stock);
      },
      [addToWatchlist, stock]
    );

    const handleRemoveFromWatchlist = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        removeFromWatchlist(stock.symbol);
      },
      [removeFromWatchlist, stock.symbol]
    );

    const handleCardClick = useCallback(() => {
      onSelect?.(stock.symbol);
    }, [onSelect, stock.symbol]);

    const getGradientClass = useCallback((change: number) => {
      if (change > 0) return "from-green-500 to-emerald-500";
      if (change < 0) return "from-red-500 to-pink-500";
      return "from-gray-500 to-slate-500";
    }, []);

    // 포맷된 값들을 메모이제이션
    const formattedPrice = useMemo(
      () => formatCurrency(stock.price, settings.currency),
      [stock.price, settings.currency]
    );

    const formattedChange = useMemo(
      () => formatCurrency(stock.change, settings.currency),
      [stock.change, settings.currency]
    );

    const formattedPercentChange = useMemo(
      () => formatPercentChange(stock.changePercent),
      [stock.changePercent]
    );

    const formattedVolume = useMemo(
      () => formatVolume(stock.volume),
      [stock.volume]
    );

    const formattedHigh = useMemo(
      () => formatCurrency(stock.high, settings.currency),
      [stock.high, settings.currency]
    );

    const formattedLow = useMemo(
      () => formatCurrency(stock.low, settings.currency),
      [stock.low, settings.currency]
    );

    const formattedOpen = useMemo(
      () => formatCurrency(stock.open, settings.currency),
      [stock.open, settings.currency]
    );

    const formattedPreviousClose = useMemo(
      () => formatCurrency(stock.previousClose, settings.currency),
      [stock.previousClose, settings.currency]
    );

    const gradientClass = useMemo(
      () => getGradientClass(stock.change),
      [getGradientClass, stock.change]
    );

    const hoverShadowClass = useMemo(
      () =>
        stock.change > 0
          ? "hover:shadow-green-200/50"
          : "hover:shadow-red-200/50",
      [stock.change]
    );

    return (
      <div
        className={`
        bg-white/90 backdrop-blur-xl rounded-3xl p-6 cursor-pointer 
        transition-all duration-500 hover:scale-105 hover:shadow-2xl
        border border-white/20 shadow-xl hover:shadow-3xl
        transform hover:-translate-y-2
        ${hoverShadowClass}
      `}
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div
                className={`w-10 h-10 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center mr-3 shadow-lg`}
              >
                <span className="text-white font-bold text-lg">
                  {stock.symbol.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 text-left">
                  {stock.symbol}
                </h3>
                <p className="text-sm text-gray-600 truncate max-w-32">
                  {stock.name}
                </p>
              </div>
            </div>
          </div>

          {showAddButton && (
            <button
              onClick={
                isInWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist
              }
              className={`
              px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
              ${
                isInWatchlist
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg hover:scale-105"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105"
              }
            `}
            >
              {isInWatchlist ? "제거" : "추가"}
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-3xl font-bold text-gray-900">
              {formattedPrice}
            </span>
            <span
              className={`text-xl font-bold px-3 py-1 rounded-full ${
                stock.change > 0
                  ? "bg-green-100 text-green-700"
                  : stock.change < 0
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {formattedPercentChange}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-gray-600 block mb-1">변화</span>
              <span
                className={`font-semibold ${
                  stock.change > 0
                    ? "text-green-600"
                    : stock.change < 0
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {formattedChange}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <span className="text-gray-600 block mb-1">거래량</span>
              <span className="font-semibold text-gray-900">
                {formattedVolume}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-blue-50 rounded-lg p-2">
              <span className="text-blue-600 block font-medium">고가</span>
              <span className="text-blue-900 font-semibold">
                {formattedHigh}
              </span>
            </div>
            <div className="bg-red-50 rounded-lg p-2">
              <span className="text-red-600 block font-medium">저가</span>
              <span className="text-red-900 font-semibold">{formattedLow}</span>
            </div>
            <div className="bg-green-50 rounded-lg p-2">
              <span className="text-green-600 block font-medium">시가</span>
              <span className="text-green-900 font-semibold">
                {formattedOpen}
              </span>
            </div>
            <div className="bg-purple-50 rounded-lg p-2">
              <span className="text-purple-600 block font-medium">전일</span>
              <span className="text-purple-900 font-semibold">
                {formattedPreviousClose}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

StockCard.displayName = "StockCard";

export default StockCard;
