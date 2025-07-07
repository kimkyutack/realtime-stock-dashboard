import React from "react";
import { useStockStore } from "../store/stockStore";

const Settings: React.FC = () => {
  const { settings, updateSettings } = useStockStore();

  const handleThemeChange = (theme: "light" | "dark") => {
    updateSettings({ theme });
  };

  const handleCurrencyChange = (currency: "USD" | "KRW") => {
    updateSettings({ currency });
  };

  const handleRefreshIntervalChange = (interval: number) => {
    updateSettings({ refreshInterval: interval });
  };

  const handleToggleVolume = () => {
    updateSettings({ showVolume: !settings.showVolume });
  };

  const handleToggleMarketCap = () => {
    updateSettings({ showMarketCap: !settings.showMarketCap });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">설정</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">테마</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => handleThemeChange("light")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                settings.theme === "light"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              라이트 모드
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                settings.theme === "dark"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              다크 모드
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">통화</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => handleCurrencyChange("USD")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                settings.currency === "USD"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => handleCurrencyChange("KRW")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                settings.currency === "KRW"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              KRW (₩)
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            데이터 새로고침 간격
          </h3>
          <div className="flex space-x-4">
            {[15, 30, 60, 120].map((interval) => (
              <button
                key={interval}
                onClick={() => handleRefreshIntervalChange(interval * 1000)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  settings.refreshInterval === interval * 1000
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {interval}초
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            표시 옵션
          </h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showVolume}
                onChange={handleToggleVolume}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">거래량 표시</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showMarketCap}
                onChange={handleToggleMarketCap}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">시가총액 표시</span>
            </label>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">정보</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• 데이터는 Alpha Vantage API를 통해 제공됩니다</p>
            <p>• 무료 API는 분당 5회 요청으로 제한됩니다</p>
            <p>• 설정은 브라우저에 자동 저장됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
