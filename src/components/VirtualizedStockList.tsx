import React, { useCallback, useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import { StockData } from "../types/stock";
import StockCard from "./StockCard";

interface VirtualizedStockListProps {
  stocks: StockData[];
  onSelect?: (symbol: string) => void;
  height?: number;
  itemHeight?: number;
  width?: number;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    stocks: StockData[];
    onSelect?: (symbol: string) => void;
  };
}

const VirtualizedStockList: React.FC<VirtualizedStockListProps> = React.memo(
  ({ stocks, onSelect, height = 600, itemHeight = 300, width = 800 }) => {
    const itemData = useMemo(
      () => ({
        stocks,
        onSelect,
      }),
      [stocks, onSelect]
    );

    const Row = useCallback(({ index, style, data }: RowProps) => {
      const stock = data.stocks[index];

      if (!stock) return null;

      return (
        <div style={style} className="px-2">
          <StockCard stock={stock} onSelect={data.onSelect} />
        </div>
      );
    }, []);

    const itemCount = stocks.length;

    if (itemCount === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">📊</span>
            </div>
            <p className="text-gray-500">표시할 주식이 없습니다</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
            <span className="text-white text-xl">📈</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              주식 목록
            </h3>
            <p className="text-gray-600 text-sm">
              {itemCount}개 종목 (가상화된 렌더링)
            </p>
          </div>
        </div>

        <List
          height={height}
          width={width}
          itemCount={itemCount}
          itemSize={itemHeight}
          itemData={itemData}
          className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db #f3f4f6",
          }}
        >
          {Row}
        </List>
      </div>
    );
  }
);

VirtualizedStockList.displayName = "VirtualizedStockList";

export default VirtualizedStockList;
