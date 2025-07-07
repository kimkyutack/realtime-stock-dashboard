import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StockData, WatchlistItem, UserSettings } from "../types/stock";

interface StockState {
  watchlist: WatchlistItem[];
  addToWatchlist: (stock: StockData) => void;
  removeFromWatchlist: (symbol: string) => void;

  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;

  selectedStock: string | null;
  setSelectedStock: (symbol: string | null) => void;

  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStockStore = create<StockState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      settings: {
        theme: "light",
        currency: "USD",
        refreshInterval: 30000,
        showVolume: true,
        showMarketCap: true,
      },
      selectedStock: null,
      isLoading: false,
      searchQuery: "",

      addToWatchlist: (stock: StockData) => {
        const { watchlist } = get();
        const exists = watchlist.find((item) => item.symbol === stock.symbol);

        if (!exists) {
          set({
            watchlist: [
              ...watchlist,
              {
                symbol: stock.symbol,
                name: stock.name,
                addedAt: new Date(),
              },
            ],
          });
        }
      },

      removeFromWatchlist: (symbol: string) => {
        const { watchlist } = get();
        set({
          watchlist: watchlist.filter((item) => item.symbol !== symbol),
        });
      },

      updateSettings: (newSettings: Partial<UserSettings>) => {
        const { settings } = get();
        set({
          settings: { ...settings, ...newSettings },
        });
      },

      setSelectedStock: (symbol: string | null) => {
        set({ selectedStock: symbol });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },
    }),
    {
      name: "stock-dashboard-storage",
      partialize: (state) => ({
        watchlist: state.watchlist,
        settings: state.settings,
      }),
    }
  )
);
