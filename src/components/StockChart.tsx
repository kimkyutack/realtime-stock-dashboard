import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { StockChartData } from "../types/stock";
import { formatCurrency, formatDate } from "../utils/formatters";
import { useStockStore } from "../store/stockStore";

interface StockChartProps {
  data: StockChartData[];
  symbol: string;
  isLoading?: boolean;
}

const StockChart: React.FC<StockChartProps> = ({
  data,
  symbol,
  isLoading = false,
}) => {
  const { settings } = useStockStore();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-96 flex items-center justify-center">
        <div className="text-gray-500">차트 로딩 중...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-96 flex items-center justify-center">
        <div className="text-gray-500">차트 데이터가 없습니다.</div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{formatDate(label)}</p>
          <p className="text-blue-600">
            가격: {formatCurrency(payload[0].value, settings.currency)}
          </p>
          {payload[1] && (
            <p className="text-green-600">
              거래량: {payload[1].value.toLocaleString()}
            </p>
          )}
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{symbol} 차트</h3>
        <p className="text-sm text-gray-600">최근 30일 가격 변동</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              stroke="#6B7280"
              fontSize={12}
            />

            <YAxis tickFormatter={formatYAxis} stroke="#6B7280" fontSize={12} />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="price"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-600">시작가</p>
          <p className="font-semibold text-gray-900">
            {formatCurrency(data[0]?.price || 0, settings.currency)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">현재가</p>
          <p className="font-semibold text-gray-900">
            {formatCurrency(
              data[data.length - 1]?.price || 0,
              settings.currency
            )}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">변화율</p>
          <p
            className={`font-semibold ${
              data[0] && data[data.length - 1]
                ? (data[data.length - 1].price - data[0].price) /
                    data[0].price >
                  0
                  ? "text-green-600"
                  : "text-red-600"
                : "text-gray-900"
            }`}
          >
            {data[0] && data[data.length - 1]
              ? `${(
                  ((data[data.length - 1].price - data[0].price) /
                    data[0].price) *
                  100
                ).toFixed(2)}%`
              : "0.00%"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
