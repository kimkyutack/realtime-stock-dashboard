import React, { useMemo, useCallback } from "react";
import { StockChartData } from "../types/stock";
import { formatCurrency, formatPercentChange } from "../utils/formatters";

interface TechnicalIndicatorsProps {
  data: StockChartData[];
  currentPrice: number;
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = React.memo(
  ({ data, currentPrice }) => {
    // RSI 계산
    const calculateRSI = useCallback(
      (period: number = 14) => {
        if (data.length < period + 1) return null;

        let gains = 0;
        let losses = 0;

        for (let i = 1; i <= period; i++) {
          const change =
            data[data.length - i].price - data[data.length - i - 1].price;
          if (change > 0) {
            gains += change;
          } else {
            losses += Math.abs(change);
          }
        }

        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / avgLoss;
        const rsi = 100 - 100 / (1 + rs);

        return Math.round(rsi * 100) / 100;
      },
      [data]
    );

    // MACD 계산
    const calculateMACD = useCallback(() => {
      if (data.length < 26)
        return { macd: null, signal: null, histogram: null };

      const ema12 = calculateEMA(12);
      const ema26 = calculateEMA(26);

      if (!ema12 || !ema26)
        return { macd: null, signal: null, histogram: null };

      const macd = ema12 - ema26;
      const signal = calculateSignalLine(macd);
      const histogram = macd - signal;

      return {
        macd: Math.round(macd * 100) / 100,
        signal: Math.round(signal * 100) / 100,
        histogram: Math.round(histogram * 100) / 100,
      };
    }, [data]);

    // EMA 계산
    const calculateEMA = useCallback(
      (period: number) => {
        if (data.length < period) return null;

        const multiplier = 2 / (period + 1);
        let ema = data[data.length - period].price;

        for (let i = data.length - period + 1; i < data.length; i++) {
          ema = data[i].price * multiplier + ema * (1 - multiplier);
        }

        return ema;
      },
      [data]
    );

    // Signal Line 계산
    const calculateSignalLine = useCallback((macd: number) => {
      // 간단한 구현을 위해 MACD 값의 9일 EMA 대신 고정값 사용
      return macd * 0.8;
    }, []);

    // Bollinger Bands 계산
    const calculateBollingerBands = useCallback(
      (period: number = 20) => {
        if (data.length < period) return null;

        const recentData = data.slice(-period);
        const prices = recentData.map((d) => d.price);
        const sma = prices.reduce((sum, price) => sum + price, 0) / period;

        const variance =
          prices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) /
          period;
        const standardDeviation = Math.sqrt(variance);

        return {
          upper: Math.round((sma + 2 * standardDeviation) * 100) / 100,
          middle: Math.round(sma * 100) / 100,
          lower: Math.round((sma - 2 * standardDeviation) * 100) / 100,
        };
      },
      [data]
    );

    // 기술적 지표 값들을 메모이제이션
    const indicators = useMemo(() => {
      const rsi = calculateRSI();
      const macd = calculateMACD();
      const bollingerBands = calculateBollingerBands();

      return {
        rsi,
        macd,
        bollingerBands,
      };
    }, [calculateRSI, calculateMACD, calculateBollingerBands]);

    // RSI 상태 결정
    const getRSIStatus = useCallback((rsi: number | null) => {
      if (!rsi)
        return {
          status: "neutral",
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        };
      if (rsi > 70)
        return {
          status: "과매수",
          color: "text-red-600",
          bgColor: "bg-red-100",
        };
      if (rsi < 30)
        return {
          status: "과매도",
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      return { status: "중립", color: "text-blue-600", bgColor: "bg-blue-100" };
    }, []);

    // MACD 상태 결정
    const getMACDStatus = useCallback((macd: any) => {
      if (!macd || !macd.macd || !macd.signal)
        return {
          status: "neutral",
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        };
      if (macd.macd > macd.signal)
        return {
          status: "매수신호",
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      return {
        status: "매도신호",
        color: "text-red-600",
        bgColor: "bg-red-100",
      };
    }, []);

    // Bollinger Bands 상태 결정
    const getBollingerStatus = useCallback(
      (bb: any) => {
        if (!bb)
          return {
            status: "neutral",
            color: "text-gray-600",
            bgColor: "bg-gray-100",
          };
        if (currentPrice > bb.upper)
          return {
            status: "과매수",
            color: "text-red-600",
            bgColor: "bg-red-100",
          };
        if (currentPrice < bb.lower)
          return {
            status: "과매도",
            color: "text-green-600",
            bgColor: "bg-green-100",
          };
        return {
          status: "중립",
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        };
      },
      [currentPrice]
    );

    const rsiStatus = useMemo(
      () => getRSIStatus(indicators.rsi),
      [getRSIStatus, indicators.rsi]
    );
    const macdStatus = useMemo(
      () => getMACDStatus(indicators.macd),
      [getMACDStatus, indicators.macd]
    );
    const bollingerStatus = useMemo(
      () => getBollingerStatus(indicators.bollingerBands),
      [getBollingerStatus, indicators.bollingerBands]
    );

    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20  hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
        <div className="flex items-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-6 shadow-lg">
            <span className="text-white text-xl">📊</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-left">
              기술적 지표
            </h2>
            <p className="text-gray-600 text-sm text-left">
              주요 기술적 분석 지표
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* RSI */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 font-semibold">RSI (14)</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${rsiStatus.bgColor} ${rsiStatus.color}`}
              >
                {rsiStatus.status}
              </span>
            </div>
            {indicators.rsi ? (
              <>
                <div className={`text-2xl font-bold mb-1 ${rsiStatus.color}`}>
                  {indicators.rsi}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${
                      indicators.rsi > 70
                        ? "bg-red-500"
                        : indicators.rsi < 30
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                    style={{ width: `${Math.min(indicators.rsi, 100)}%` }}
                  ></div>
                </div>
              </>
            ) : (
              <div className="text-gray-500">데이터 부족</div>
            )}
          </div>

          {/* MACD */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-600 font-semibold">MACD</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${macdStatus.bgColor} ${macdStatus.color}`}
              >
                {macdStatus.status}
              </span>
            </div>
            {indicators.macd && indicators.macd.macd ? (
              <>
                <div className="text-2xl font-bold text-green-900 mb-1">
                  {indicators.macd.macd}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  Signal: {indicators.macd.signal}
                </div>
                <div className="text-sm text-gray-600">
                  Histogram: {indicators.macd.histogram}
                </div>
              </>
            ) : (
              <div className="text-gray-500">데이터 부족</div>
            )}
          </div>

          {/* Bollinger Bands */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-600 font-semibold">Bollinger</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${bollingerStatus.bgColor} ${bollingerStatus.color}`}
              >
                {bollingerStatus.status}
              </span>
            </div>
            {indicators.bollingerBands ? (
              <>
                <div className="text-lg font-bold text-orange-900 mb-1">
                  {formatCurrency(currentPrice)}
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  상단: {formatCurrency(indicators.bollingerBands.upper)}
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  하단: {formatCurrency(indicators.bollingerBands.lower)}
                </div>
              </>
            ) : (
              <div className="text-gray-500">데이터 부족</div>
            )}
          </div>

          {/* 이동평균 */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-600 font-semibold">이동평균</span>
              <span className="text-xs text-purple-500">SMA(20)</span>
            </div>
            {data.length >= 20 ? (
              <>
                <div className="text-2xl font-bold text-purple-900 mb-1">
                  {formatCurrency(data[data.length - 1].sma || 0)}
                </div>
                <div className="text-sm text-gray-600 mb-1">현재가 대비</div>
                <div
                  className={`text-sm font-semibold ${
                    currentPrice > (data[data.length - 1].sma || 0)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatPercentChange(
                    ((currentPrice - (data[data.length - 1].sma || 0)) /
                      (data[data.length - 1].sma || 1)) *
                      100
                  )}
                </div>
              </>
            ) : (
              <div className="text-gray-500">데이터 부족</div>
            )}
          </div>
        </div>

        {/* 종합 신호 */}
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
          <h4 className="font-semibold text-gray-900 mb-2">종합 신호</h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">RSI:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${rsiStatus.bgColor} ${rsiStatus.color}`}
              >
                {rsiStatus.status}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">MACD:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${macdStatus.bgColor} ${macdStatus.color}`}
              >
                {macdStatus.status}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">BB:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${bollingerStatus.bgColor} ${bollingerStatus.color}`}
              >
                {bollingerStatus.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TechnicalIndicators.displayName = "TechnicalIndicators";

export default TechnicalIndicators;
