import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStockQuote,
  getStockChartData,
  searchStocks,
  getMultipleStockQuotes,
  getDemoStockData,
} from "../api/stockApi";

export const useStockQuote = (symbol: string) => {
  return useQuery({
    queryKey: ["stock", "quote", symbol],
    queryFn: () => getStockQuote(symbol),
    enabled: !!symbol,
    refetchInterval: 30000,
    staleTime: 10000,
    retry: 3,
    retryDelay: 1000,
  });
};

export const useStockChartData = (symbol: string) => {
  return useQuery({
    queryKey: ["stock", "chart", symbol],
    queryFn: () => getStockChartData(symbol),
    enabled: !!symbol,
    staleTime: 300000,
    retry: 2,
  });
};

export const useStockSearch = (query: string) => {
  return useQuery({
    queryKey: ["stock", "search", query],
    queryFn: () => searchStocks(query),
    enabled: query.length >= 2,
    staleTime: 600000,
    retry: 1,
  });
};

export const useMultipleStockQuotes = (symbols: string[]) => {
  return useQuery({
    queryKey: ["stocks", "quotes", symbols],
    queryFn: () => getMultipleStockQuotes(symbols),
    enabled: symbols.length > 0,
    refetchInterval: 30000,
    staleTime: 10000,
    retry: 2,
  });
};

export const useDemoStockData = () => {
  return useQuery({
    queryKey: ["stocks", "demo"],
    queryFn: getDemoStockData,
    staleTime: Infinity,
  });
};

export const useWatchlistData = (symbols: string[]) => {
  return useQuery({
    queryKey: ["stocks", "watchlist", symbols],
    queryFn: () => getMultipleStockQuotes(symbols),
    enabled: symbols.length > 0,
    refetchInterval: 30000,
    staleTime: 10000,
    retry: 2,
  });
};

export const usePrefetchStockData = () => {
  const queryClient = useQueryClient();

  return (symbol: string) => {
    queryClient.prefetchQuery({
      queryKey: ["stock", "quote", symbol],
      queryFn: () => getStockQuote(symbol),
      staleTime: 10000,
    });
  };
};

export const useInvalidateStockCache = () => {
  const queryClient = useQueryClient();

  return (symbol?: string) => {
    if (symbol) {
      queryClient.invalidateQueries({ queryKey: ["stock", symbol] });
    } else {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    }
  };
};
