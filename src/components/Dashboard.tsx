import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useDemoStockData, useStockChartData } from "../hooks/useStockQueries";
import { useStockStore } from "../store/stockStore";
import StockSearch from "./StockSearch";
import StockCard from "./StockCard";
import StockChart from "./StockChart";
import TechnicalIndicators from "./TechnicalIndicators";
import Watchlist from "./Watchlist";
import Settings from "./Settings";
import VirtualizedStockList from "./VirtualizedStockList";
import StockTableList from "./StockTableList";

type TabType = "market" | "watchlist" | "settings";
type ViewMode = "table" | "card" | "virtual";

const Dashboard: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState<TabType>("market");
  const { selectedStock, setSelectedStock, settings } = useStockStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const { data: demoStocks, isLoading: isLoadingStocks } = useDemoStockData();
  const { data: chartData, isLoading: isLoadingChart } = useStockChartData(
    selectedStock || ""
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  const handleStockSelect = useCallback(
    (symbol: string) => {
      setSelectedStock(symbol);
    },
    [setSelectedStock]
  );

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  // 탭 데이터 메모이제이션
  const tabs = useMemo(
    () => [
      {
        id: "market",
        label: "시장",
        icon: "📊",
        gradient: "from-blue-500 to-purple-600",
      },
      {
        id: "watchlist",
        label: "관심종목",
        icon: "⭐",
        gradient: "from-yellow-500 to-orange-500",
      },
      {
        id: "settings",
        label: "설정",
        icon: "⚙️",
        gradient: "from-pink-500 to-red-500",
      },
    ],
    []
  );

  // 현재 날짜 메모이제이션
  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case "market":
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                  <span className="text-white text-2xl">🔍</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-left">
                    주식 검색
                  </h2>
                  <p className="text-gray-600 mt-1">
                    심볼이나 회사명으로 주식을 찾아보세요
                  </p>
                </div>
              </div>
              <StockSearch onSelect={handleStockSelect} />
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                    <span className="text-white text-2xl">🔥</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent text-left">
                      인기 주식
                    </h2>
                    <p className="text-gray-600 mt-1 text-left">
                      실시간 인기 종목을 확인하세요
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 border ${
                      viewMode === "table"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 border-blue-200"
                    } hover:bg-blue-500 hover:text-white`}
                  >
                    📋 리스트형
                  </button>
                  <button
                    onClick={() => setViewMode("card")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 border ${
                      viewMode === "card"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-purple-600 border-purple-200"
                    } hover:bg-purple-500 hover:text-white`}
                  >
                    🗂️ 카드형
                  </button>
                  <button
                    onClick={() => setViewMode("virtual")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 border ${
                      viewMode === "virtual"
                        ? "bg-green-600 text-white"
                        : "bg-white text-green-600 border-green-200"
                    } hover:bg-green-500 hover:text-white`}
                  >
                    ⚡ 가상화
                  </button>
                </div>
              </div>

              {isLoadingStocks ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-2xl h-48"></div>
                    </div>
                  ))}
                </div>
              ) : demoStocks ? (
                viewMode === "table" ? (
                  <StockTableList
                    stocks={demoStocks}
                    onSelect={handleStockSelect}
                    selectedSymbol={selectedStock || undefined}
                  />
                ) : viewMode === "card" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {demoStocks.map((stock, index) => (
                      <div
                        key={stock.symbol}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <StockCard stock={stock} onSelect={handleStockSelect} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <VirtualizedStockList
                    stocks={demoStocks}
                    onSelect={handleStockSelect}
                    height={600}
                    itemHeight={320}
                    width={800}
                  />
                )
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4 text-lg">
                    주식 데이터를 불러올 수 없습니다
                  </div>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                    다시 시도
                  </button>
                </div>
              )}
            </div>

            {selectedStock && (
              <>
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                      <span className="text-white text-2xl">📈</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent text-left">
                        선택된 주식
                      </h2>
                      <p className="text-gray-600 mt-1 text-left">
                        {selectedStock} 상세 분석
                      </p>
                    </div>
                  </div>
                  <StockChart
                    symbol={selectedStock}
                    data={chartData || []}
                    isLoading={isLoadingChart}
                  />
                </div>

                {/* 기술적 지표 */}
                {chartData && chartData.length > 0 && (
                  <TechnicalIndicators
                    data={chartData}
                    currentPrice={chartData[chartData.length - 1].price}
                  />
                )}
              </>
            )}
          </div>
        );

      case "watchlist":
        return <Watchlist />;

      case "settings":
        return <Settings />;

      default:
        return null;
    }
  }, [
    activeTab,
    selectedStock,
    chartData,
    isLoadingChart,
    demoStocks,
    isLoadingStocks,
    handleStockSelect,
    viewMode,
  ]);

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 배경 그라데이션 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                <span className="text-white text-3xl">📈</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  StockVision
                </h1>
                <p className="text-gray-600 text-lg text-left">
                  실시간 주식 대시보드
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
                {currentDate}
              </div>
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* 네비게이션 탭 */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-2 pt-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as TabType)}
                className={`
                  relative px-8 py-5 rounded-t-2xl font-semibold text-lg transition-all duration-300
                  ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }
                `}
              >
                {activeTab === tab.id && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-t-2xl shadow-lg`}
                  ></div>
                )}
                <span className="relative z-10 flex items-center">
                  <span className="mr-3 text-xl">{tab.icon}</span>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-6 py-10">{renderTabContent()}</main>

      {/* 푸터 */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-white text-lg">⚡</span>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                실시간 주식 대시보드
              </h3>
            </div>
            <p className="text-gray-500 text-sm">
              Alpha Vantage API를 사용하여 데이터를 제공합니다
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;
