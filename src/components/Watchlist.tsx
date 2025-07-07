import React, { useState, useCallback, useEffect } from "react";
import { useWatchlistData } from "../hooks/useStockQueries";
import { useStockStore } from "../store/stockStore";
import StockCard from "./StockCard";
import VirtualizedStockList from "./VirtualizedStockList";

const Watchlist: React.FC = React.memo(() => {
  const { watchlist, removeFromWatchlist } = useStockStore();
  const [useVirtualizedList, setUseVirtualizedList] = useState(false);
  const symbols = watchlist.map((item) => item.symbol);

  const { data: stocks, isLoading, error } = useWatchlistData(symbols);

  // 주식 데이터가 많을 때 가상화된 리스트 사용
  useEffect(() => {
    if (stocks && stocks.length > 10) {
      setUseVirtualizedList(true);
    }
  }, [stocks]);

  const handleRemoveFromWatchlist = useCallback(
    (symbol: string) => {
      removeFromWatchlist(symbol);
    },
    [removeFromWatchlist]
  );

  if (watchlist.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
            <span className="text-white text-2xl">⭐</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent text-left">
              관심 종목
            </h2>
            <p className="text-gray-600 mt-1 text-left">관심 종목이 없습니다</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📊</span>
          </div>
          <p className="text-gray-500 mb-4 text-lg">
            주식을 검색하여 관심 종목에 추가해보세요
          </p>
          <p className="text-sm text-gray-400">
            관심 종목에 추가하면 여기서 한눈에 확인할 수 있습니다
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
            <span className="text-white text-2xl">⭐</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent text-left">
              관심 종목
            </h2>
            <p className="text-gray-600 mt-1 text-left">
              데이터를 불러오는 중...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((item) => (
            <div key={item.symbol} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-48"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent text-left">
              오류 발생
            </h2>
            <p className="text-gray-600 mt-1 text-left">
              데이터를 불러오는 중 오류가 발생했습니다
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 mb-4 text-lg">
            데이터를 불러오는 중 오류가 발생했습니다
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
            <span className="text-white text-2xl">⭐</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent text-left">
              관심 종목
            </h2>
            <p className="text-gray-600 mt-1 text-left">
              {watchlist.length}개 종목
            </p>
          </div>
        </div>
        {stocks && stocks.length > 10 && (
          <button
            onClick={() => setUseVirtualizedList(!useVirtualizedList)}
            className="text-sm bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            {useVirtualizedList ? "그리드 보기" : "가상화 보기"}
          </button>
        )}
      </div>

      {stocks && stocks.length > 0 ? (
        useVirtualizedList ? (
          <VirtualizedStockList
            stocks={stocks}
            onSelect={() => {}}
            height={600}
            itemHeight={320}
            width={800}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((stock) => (
              <div key={stock.symbol} className="relative group">
                <StockCard stock={stock} showAddButton={false} />
                <button
                  onClick={() => handleRemoveFromWatchlist(stock.symbol)}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 flex items-center justify-center"
                  title="관심 종목에서 제거"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-2xl">📊</span>
          </div>
          <p className="text-gray-500 mb-4 text-lg">
            관심 종목 데이터를 불러올 수 없습니다
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            다시 시도
          </button>
        </div>
      )}
    </div>
  );
});

Watchlist.displayName = "Watchlist";

export default Watchlist;
