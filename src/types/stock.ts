export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface StockChartData {
  date: string;
  price: number;
  volume: number;
  sma?: number; // Simple Moving Average
}

export interface WatchlistItem {
  symbol: string;
  name: string;
  addedAt: Date;
}

export interface UserSettings {
  theme: "light" | "dark";
  currency: "USD" | "KRW";
  refreshInterval: number;
  showVolume: boolean;
  showMarketCap: boolean;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}
