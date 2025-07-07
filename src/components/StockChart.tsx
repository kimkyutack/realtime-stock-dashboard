import React, { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Bar,
  BarChart,
  ComposedChart,
  Line,
  LineChart,
} from "recharts";
import { StockChartData } from "../types/stock";
import { formatCurrency, formatDate, formatVolume } from "../utils/formatters";
import { useStockStore } from "../store/stockStore";

interface StockChartProps {
  data: StockChartData[];
  symbol: string;
  isLoading?: boolean;
}

type ChartType = "area" | "line" | "candlestick" | "volume";

const StockChart: React.FC<StockChartProps> = ({
  data,
  symbol,
  isLoading = false,
}) => {
  const { settings } = useStockStore();
  const [chartType, setChartType] = useState<ChartType>("area");
  const [showVolume, setShowVolume] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
            <span className="text-white text-2xl">📈</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent text-left">
              차트 로딩 중
            </h2>
            <p className="text-gray-600 mt-1">데이터를 불러오는 중입니다...</p>
          </div>
        </div>
        <div className="h-80 bg-gray-100 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex items-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
            <span className="text-white text-2xl">📊</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent text-left">
              차트 데이터 없음
            </h2>
            <p className="text-gray-600 mt-1">
              차트 데이터를 불러올 수 없습니다
            </p>
          </div>
        </div>
        <div className="h-80 bg-gray-50 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">📈</span>
            </div>
            <p className="text-gray-500">차트 데이터가 없습니다</p>
          </div>
        </div>
      </div>
    );
  }

  // 시간 범위에 따른 데이터 필터링
  const getFilteredData = () => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    return data.slice(-days);
  };

  const filteredData = getFilteredData();

  // 기술적 지표 계산
  const calculateSMA = (period: number) => {
    const smaData = [...filteredData];
    for (let i = period - 1; i < smaData.length; i++) {
      const sum = smaData
        .slice(i - period + 1, i + 1)
        .reduce((acc, item) => acc + item.price, 0);
      smaData[i] = { ...smaData[i], sma: sum / period };
    }
    return smaData;
  };

  const dataWithSMA = calculateSMA(20);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl p-4 border border-white/30 rounded-2xl shadow-2xl">
          <p className="font-semibold text-gray-900 mb-2">
            {formatDate(label)}
          </p>
          <div className="space-y-2">
            <p className="text-blue-600 font-medium">
              가격: {formatCurrency(payload[0].value, settings.currency)}
            </p>
            {payload[1] && (
              <p className="text-green-600 font-medium">
                거래량: {formatVolume(payload[1].value)}
              </p>
            )}
            {payload[2] && (
              <p className="text-purple-600 font-medium">
                SMA(20): {formatCurrency(payload[2].value, settings.currency)}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const formatXAxis = (tickItem: string) => {
    return formatDate(tickItem);
  };

  const formatYAxis = (tickItem: number) => {
    return formatCurrency(tickItem, settings.currency);
  };

  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={dataWithSMA}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                stroke="#6B7280"
                fontSize={12}
              />

              <YAxis
                tickFormatter={formatYAxis}
                stroke="#6B7280"
                fontSize={12}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />

              {showVolume && (
                <Bar
                  dataKey="volume"
                  fill="url(#colorVolume)"
                  opacity={0.3}
                  radius={[2, 2, 0, 0]}
                />
              )}

              <Line
                type="monotone"
                dataKey="sma"
                stroke="#8B5CF6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dataWithSMA}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                stroke="#6B7280"
                fontSize={12}
              />

              <YAxis
                tickFormatter={formatYAxis}
                stroke="#6B7280"
                fontSize={12}
              />

              <Tooltip content={<CustomTooltip />} />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
              />

              <Line
                type="monotone"
                dataKey="sma"
                stroke="#8B5CF6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "volume":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                stroke="#6B7280"
                fontSize={12}
              />

              <YAxis stroke="#6B7280" fontSize={12} />

              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="volume"
                fill="url(#colorVolume)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getPriceChange = () => {
    if (filteredData.length < 2) return { change: 0, percent: 0 };
    const first = filteredData[0].price;
    const last = filteredData[filteredData.length - 1].price;
    const change = last - first;
    const percent = (change / first) * 100;
    return { change, percent };
  };

  const { change, percent } = getPriceChange();

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
            <span className="text-white text-2xl">📈</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              {symbol} 차트
            </h2>
            <p className="text-gray-600 mt-1">최근 {timeRange} 가격 변동</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* 차트 타입 선택 */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            {[
              { type: "area", label: "영역", icon: "📊" },
              { type: "line", label: "선", icon: "📈" },
              { type: "volume", label: "거래량", icon: "📊" },
            ].map(({ type, label, icon }) => (
              <button
                key={type}
                onClick={() => setChartType(type as ChartType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  chartType === type
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <span className="mr-1">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* 거래량 토글 */}
          {chartType === "area" && (
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                showVolume
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              📊 거래량
            </button>
          )}
        </div>
      </div>

      {/* 시간 범위 선택 */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[
            { value: "7d", label: "7일" },
            { value: "30d", label: "30일" },
            { value: "90d", label: "90일" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTimeRange(value as "7d" | "30d" | "90d")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                timeRange === value
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 mb-6">{renderChart()}</div>

      {/* 통계 정보 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
          <p className="text-blue-600 text-sm font-medium mb-1">시작가</p>
          <p className="text-blue-900 font-bold text-lg">
            {formatCurrency(filteredData[0]?.price || 0, settings.currency)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center">
          <p className="text-green-600 text-sm font-medium mb-1">현재가</p>
          <p className="text-green-900 font-bold text-lg">
            {formatCurrency(
              filteredData[filteredData.length - 1]?.price || 0,
              settings.currency
            )}
          </p>
        </div>
        <div
          className={`rounded-2xl p-4 text-center ${
            change > 0
              ? "bg-gradient-to-br from-green-50 to-green-100"
              : "bg-gradient-to-br from-red-50 to-red-100"
          }`}
        >
          <p
            className={`text-sm font-medium mb-1 ${
              change > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            변화율
          </p>
          <p
            className={`font-bold text-lg ${
              change > 0 ? "text-green-900" : "text-red-900"
            }`}
          >
            {change > 0 ? "+" : ""}
            {percent.toFixed(2)}%
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center">
          <p className="text-purple-600 text-sm font-medium mb-1">
            평균 거래량
          </p>
          <p className="text-purple-900 font-bold text-lg">
            {formatVolume(
              Math.round(
                filteredData.reduce((acc, item) => acc + item.volume, 0) /
                  filteredData.length
              )
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
