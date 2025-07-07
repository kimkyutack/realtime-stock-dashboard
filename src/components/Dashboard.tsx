import React, { useState } from "react";
import { useDemoStockData, useStockChartData } from "../hooks/useStockQueries";
import { useStockStore } from "../store/stockStore";
import StockSearch from "./StockSearch";
import StockCard from "./StockCard";
import StockChart from "./StockChart";
import Watchlist from "./Watchlist";
import Settings from "./Settings";

type TabType = "market" | "watchlist" | "settings";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("market");
  const { selectedStock, setSelectedStock } = useStockStore();

  const { data: demoStocks, isLoading: isLoadingStocks } = useDemoStockData();
  const { data: chartData, isLoading: isLoadingChart } = useStockChartData(
    selectedStock || ""
  );

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "market":
        return (
          <div className="space-y-6">
            {/* 검색 섹션 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                주식 검색
              </h2>
              <StockSearch onSelect={handleStockSelect} />
            </div>

            {/* 선택된 주식 차트 */}
            {selectedStock && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  선택된 주식
                </h2>
                <StockChart
                  symbol={selectedStock}
                  data={chartData || []}
                  isLoading={isLoadingChart}
                />
              </div>
            )}

            {/* 인기 주식 목록 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                인기 주식
              </h2>
              {isLoadingStocks ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg h-32"></div>
                    </div>
                  ))}
                </div>
              ) : demoStocks ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {demoStocks.map((stock) => (
                    <StockCard
                      key={stock.symbol}
                      stock={stock}
                      onSelect={handleStockSelect}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">
                    주식 데이터를 불러올 수 없습니다
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "watchlist":
        return <Watchlist />;

      case "settings":
        return <Settings />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                📈 주식 대시보드
              </h1>
            </div>
            <div className="text-sm text-gray-500">실시간 주식 데이터</div>
          </div>
        </div>
      </header>

      {/* 네비게이션 탭 */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "market", label: "시장", icon: "📊" },
              { id: "watchlist", label: "관심종목", icon: "⭐" },
              { id: "settings", label: "설정", icon: "⚙️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>React Query + Zustand로 만든 실시간 주식 대시보드</p>
            <p className="mt-1">
              Alpha Vantage API를 사용하여 데이터를 제공합니다
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
