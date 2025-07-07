// 기술적 지표 계산을 위한 웹 워커

// RSI 계산
function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return null;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const change = prices[prices.length - i] - prices[prices.length - i - 1];
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
}

// EMA 계산
function calculateEMA(prices, period) {
  if (prices.length < period) return null;

  const multiplier = 2 / (period + 1);
  let ema = prices[prices.length - period];

  for (let i = prices.length - period + 1; i < prices.length; i++) {
    ema = prices[i] * multiplier + ema * (1 - multiplier);
  }

  return ema;
}

// MACD 계산
function calculateMACD(prices) {
  if (prices.length < 26) return { macd: null, signal: null, histogram: null };

  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);

  if (!ema12 || !ema26) return { macd: null, signal: null, histogram: null };

  const macd = ema12 - ema26;
  const signal = macd * 0.8; // 간단한 구현
  const histogram = macd - signal;

  return {
    macd: Math.round(macd * 100) / 100,
    signal: Math.round(signal * 100) / 100,
    histogram: Math.round(histogram * 100) / 100,
  };
}

// Bollinger Bands 계산
function calculateBollingerBands(prices, period = 20) {
  if (prices.length < period) return null;

  const recentPrices = prices.slice(-period);
  const sma = recentPrices.reduce((sum, price) => sum + price, 0) / period;

  const variance =
    recentPrices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) /
    period;
  const standardDeviation = Math.sqrt(variance);

  return {
    upper: Math.round((sma + 2 * standardDeviation) * 100) / 100,
    middle: Math.round(sma * 100) / 100,
    lower: Math.round((sma - 2 * standardDeviation) * 100) / 100,
  };
}

// 이동평균 계산
function calculateSMA(prices, period) {
  if (prices.length < period) return null;

  const recentPrices = prices.slice(-period);
  return recentPrices.reduce((sum, price) => sum + price, 0) / period;
}

// 워커 메시지 처리
self.onmessage = function (e) {
  const { type, data } = e.data;

  try {
    let result;

    switch (type) {
      case "calculateRSI":
        result = calculateRSI(data.prices, data.period);
        break;

      case "calculateMACD":
        result = calculateMACD(data.prices);
        break;

      case "calculateBollingerBands":
        result = calculateBollingerBands(data.prices, data.period);
        break;

      case "calculateSMA":
        result = calculateSMA(data.prices, data.period);
        break;

      case "calculateAll":
        result = {
          rsi: calculateRSI(data.prices),
          macd: calculateMACD(data.prices),
          bollingerBands: calculateBollingerBands(data.prices),
          sma: calculateSMA(data.prices, 20),
        };
        break;

      default:
        throw new Error(`Unknown calculation type: ${type}`);
    }

    self.postMessage({
      type: "success",
      data: result,
    });
  } catch (error) {
    self.postMessage({
      type: "error",
      error: error.message,
    });
  }
};
