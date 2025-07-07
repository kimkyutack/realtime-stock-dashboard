import React from "react";
import { StockData } from "../types/stock";
import {
  formatCurrency,
  formatPercentChange,
  formatVolume,
  getPriceChangeColor,
  getPriceChangeBgColor,
} from "../utils/formatters";
import { useStockStore } from "../store/stockStore";

interface StockCardProps {
  stock: StockData;
  onSelect?: (symbol: string) => void;
  showAddButton?: boolean;
}

const StockCard: React.FC<StockCardProps> = ({
  stock,
  onSelect,
  showAddButton = true,
}) => {
  const { addToWatchlist, removeFromWatchlist, watchlist, settings } =
    useStockStore();

  const isInWatchlist = watchlist.some((item) => item.symbol === stock.symbol);

  const handleAddToWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToWatchlist(stock);
  };

  const handleRemoveFromWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWatchlist(stock.symbol);
  };

  const handleCardClick = () => {
    onSelect?.(stock.symbol);
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all duration-200
        hover:shadow-lg hover:scale-105 border border-gray-200
        ${getPriceChangeBgColor(stock.change)}
      `}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{stock.symbol}</h3>
          <p className="text-sm text-gray-600 truncate">{stock.name}</p>
        </div>

        {showAddButton && (
          <button
            onClick={
              isInWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist
            }
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-colors
              ${
                isInWatchlist
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }
            `}
          >
            {isInWatchlist ? "제거" : "추가"}
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(stock.price, settings.currency)}
          </span>
          <span
            className={`text-lg font-semibold ${getPriceChangeColor(
              stock.change
            )}`}
          >
            {formatPercentChange(stock.changePercent)}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>변화: {formatCurrency(stock.change, settings.currency)}</span>
          <span>거래량: {formatVolume(stock.volume)}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div>
            <span className="block">
              고가: {formatCurrency(stock.high, settings.currency)}
            </span>
            <span className="block">
              저가: {formatCurrency(stock.low, settings.currency)}
            </span>
          </div>
          <div>
            <span className="block">
              시가: {formatCurrency(stock.open, settings.currency)}
            </span>
            <span className="block">
              전일: {formatCurrency(stock.previousClose, settings.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
