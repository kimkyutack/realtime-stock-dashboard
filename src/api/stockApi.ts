import axios from "axios";
import { StockData, StockChartData, StockSearchResult } from "../types/stock";

const API_KEY = "demo"; // 실제 사용시 유효한 API 키로 교체
const BASE_URL = "https://www.alphavantage.co/query";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const getStockQuote = async (symbol: string): Promise<StockData> => {
  try {
    const response = await api.get("", {
      params: {
        function: "GLOBAL_QUOTE",
        symbol: symbol.toUpperCase(),
        apikey: API_KEY,
      },
    });

    const data = response.data["Global Quote"];

    if (!data || Object.keys(data).length === 0) {
      throw new Error("주식 데이터를 찾을 수 없습니다.");
    }

    return {
      symbol: data["01. symbol"],
      name: data["01. symbol"],
      price: parseFloat(data["05. price"]),
      change: parseFloat(data["09. change"]),
      changePercent: parseFloat(data["10. change percent"].replace("%", "")),
      volume: parseInt(data["06. volume"]),
      marketCap: 0,
      high: parseFloat(data["03. high"]),
      low: parseFloat(data["04. low"]),
      open: parseFloat(data["02. open"]),
      previousClose: parseFloat(data["08. previous close"]),
    };
  } catch (error) {
    console.error("주식 데이터 가져오기 실패:", error);
    throw error;
  }
};

// 데모 차트 데이터 생성 함수
const generateDemoChartData = (
  symbol: string,
  basePrice: number
): StockChartData[] => {
  const data: StockChartData[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // 랜덤한 가격 변동 생성
    const volatility = 0.02;
    const randomChange = (Math.random() - 0.5) * volatility;
    const price = basePrice * (1 + randomChange);

    // 랜덤한 거래량 생성
    const baseVolume = 1000000 + Math.random() * 5000000;
    const volume = Math.floor(baseVolume);

    data.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
      volume: volume,
      sma: Math.round(basePrice * (1 + randomChange * 0.5) * 100) / 100,
    });
  }

  return data;
};

export const getStockChartData = async (
  symbol: string
): Promise<StockChartData[]> => {
  try {
    if (API_KEY === "demo") {
      // 심볼에 따른 기본 가격 설정
      const basePrices: { [key: string]: number } = {
        AAPL: 150,
        GOOGLE: 2750,
        MSFT: 320,
        TSLA: 850,
        AMZN: 185,
        NVDA: 450,
        META: 300,
        NFLX: 500,
        GOOGL: 2750,
        BRK: 350000,
      };

      const basePrice = basePrices[symbol.toUpperCase()] || 100;
      return generateDemoChartData(symbol, basePrice);
    }

    // 실제 API 호출
    const response = await api.get("", {
      params: {
        function: "TIME_SERIES_DAILY",
        symbol: symbol.toUpperCase(),
        apikey: API_KEY,
      },
    });

    const timeSeriesData = response.data["Time Series (Daily)"];

    if (!timeSeriesData) {
      throw new Error("차트 데이터를 찾을 수 없습니다.");
    }

    const chartData: StockChartData[] = Object.entries(timeSeriesData)
      .slice(0, 30)
      .map(([date, data]: [string, any]) => ({
        date,
        price: parseFloat(data["4. close"]),
        volume: parseInt(data["5. volume"]),
        sma: parseFloat(data["4. close"]), // 실제 데이터에서는 별도 계산 필요
      }))
      .reverse();

    return chartData;
  } catch (error) {
    console.error("차트 데이터 가져오기 실패:", error);
    const basePrices: { [key: string]: number } = {
      AAPL: 150,
      GOOGLE: 2750,
      MSFT: 320,
      TSLA: 850,
      AMZN: 185,
      NVDA: 450,
      META: 300,
      NFLX: 500,
      GOOGL: 2750,
      BRK: 350000,
    };

    const basePrice = basePrices[symbol.toUpperCase()] || 100;
    return generateDemoChartData(symbol, basePrice);
  }
};

export const searchStocks = async (
  query: string
): Promise<StockSearchResult[]> => {
  try {
    const response = await api.get("", {
      params: {
        function: "SYMBOL_SEARCH",
        keywords: query,
        apikey: API_KEY,
      },
    });

    const matches = response.data.bestMatches || [];

    return matches.map((match: any) => ({
      symbol: match["1. symbol"],
      name: match["2. name"],
      exchange: match["4. region"],
      type: match["3. type"],
    }));
  } catch (error) {
    console.error("검색 실패:", error);
    throw error;
  }
};

export const getMultipleStockQuotes = async (
  symbols: string[]
): Promise<StockData[]> => {
  const promises = symbols.map((symbol) => getStockQuote(symbol));
  return Promise.all(promises);
};

export const getDemoStockData = (): StockData[] => [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 150.25,
    change: 2.15,
    changePercent: 1.45,
    volume: 45678900,
    marketCap: 2500000000000,
    high: 152.0,
    low: 148.5,
    open: 149.75,
    previousClose: 148.1,
  },
  {
    symbol: "GOOGLE",
    name: "Alphabet Inc.",
    price: 2750.8,
    change: -15.2,
    changePercent: -0.55,
    volume: 23456700,
    marketCap: 1800000000000,
    high: 2770.0,
    low: 2740.5,
    open: 2755.25,
    previousClose: 2766.0,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 320.45,
    change: 5.3,
    changePercent: 1.68,
    volume: 34567800,
    marketCap: 2400000000000,
    high: 322.0,
    low: 318.5,
    open: 319.75,
    previousClose: 315.15,
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 850.75,
    change: 25.5,
    changePercent: 3.09,
    volume: 56789000,
    marketCap: 850000000000,
    high: 855.0,
    low: 840.25,
    open: 845.5,
    previousClose: 825.25,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 185.3,
    change: -2.7,
    changePercent: -1.44,
    volume: 67890100,
    marketCap: 1900000000000,
    high: 188.0,
    low: 184.5,
    open: 186.75,
    previousClose: 188.0,
  },
];
