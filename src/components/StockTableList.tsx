import React from "react";
import { StockData } from "../types/stock";

interface StockTableListProps {
  stocks: StockData[];
  onSelect?: (symbol: string) => void;
  selectedSymbol?: string;
}

const StockTableList: React.FC<StockTableListProps> = React.memo(
  ({ stocks, onSelect, selectedSymbol }) => {
    return (
      <div className="overflow-visible rounded-2xl shadow-xl bg-white/90">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
            <tr>
              <th className="px-4 py-3 text-left font-bold">종목</th>
              <th className="px-4 py-3 text-right font-bold">현재가</th>
              <th className="px-4 py-3 text-right font-bold">전일비</th>
              <th className="px-4 py-3 text-right font-bold">등락률</th>
              <th className="px-4 py-3 text-right font-bold">거래량</th>
              <th className="px-4 py-3 text-right font-bold">시가</th>
              <th className="px-4 py-3 text-right font-bold">고가</th>
              <th className="px-4 py-3 text-right font-bold">저가</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const isSelected = selectedSymbol === stock.symbol;
              return (
                <tr
                  key={stock.symbol}
                  className={`transition hover:bg-blue-50 cursor-pointer ${
                    isSelected ? "bg-blue-100 font-bold" : ""
                  }`}
                  onClick={() => onSelect?.(stock.symbol)}
                >
                  <td className="px-4 py-2 whitespace-nowrap font-semibold">
                    {stock.symbol}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {stock.price.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-2 text-right ${
                      stock.change > 0
                        ? "text-red-600"
                        : stock.change < 0
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {stock.change > 0 ? "+" : ""}
                    {stock.change.toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-2 text-right ${
                      stock.changePercent > 0
                        ? "text-red-600"
                        : stock.changePercent < 0
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {stock.changePercent > 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%
                  </td>
                  <td className="px-4 py-2 text-right">
                    {stock.volume.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {stock.open.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {stock.high.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {stock.low.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {stocks.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            표시할 주식이 없습니다
          </div>
        )}
      </div>
    );
  }
);

StockTableList.displayName = "StockTableList";

export default StockTableList;
