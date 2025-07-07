import React from "react";
import { useWatchlistData } from "../hooks/useStockQueries";
import { useStockStore } from "../store/stockStore";
import StockCard from "./StockCard";

const Watchlist: React.FC = () => {
  const { watchlist } = useStockStore();
  const symbols = watchlist.map((item) => item.symbol);

  const { data: stocks, isLoading, error } = useWatchlistData(symbols);

  if (watchlist.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">관심 종목</h2>
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">관심 종목이 없습니다</div>
          <p className="text-sm text-gray-400">
            주식을 검색하여 관심 종목에 추가해보세요
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">관심 종목</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map((item) => (
            <div key={item.symbol} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">관심 종목</h2>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            데이터를 불러오는 중 오류가 발생했습니다
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">관심 종목</h2>
        <span className="text-sm text-gray-500">{watchlist.length}개 종목</span>
      </div>

      {stocks && stocks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} showAddButton={false} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-500">
            관심 종목 데이터를 불러올 수 없습니다
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
