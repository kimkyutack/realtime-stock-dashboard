// 숫자를 통화 형식으로 포맷팅
export const formatCurrency = (
  value: number,
  currency: "USD" | "KRW" = "USD"
): string => {
  const formatter = new Intl.NumberFormat(
    currency === "USD" ? "en-US" : "ko-KR",
    {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );

  return formatter.format(value);
};

// 큰 숫자를 축약형으로 포맷팅 (예: 1.2B, 3.4M)
export const formatLargeNumber = (value: number): string => {
  if (value >= 1e12) {
    return (value / 1e12).toFixed(1) + "T";
  } else if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + "B";
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + "M";
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + "K";
  }
  return value.toString();
};

// 퍼센트 변화를 포맷팅
export const formatPercentChange = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

// 날짜를 포맷팅
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// 시간을 포맷팅
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 거래량을 포맷팅
export const formatVolume = (volume: number): string => {
  return formatLargeNumber(volume);
};

// 시가총액을 포맷팅
export const formatMarketCap = (marketCap: number): string => {
  return formatCurrency(marketCap);
};

// 가격 변화에 따른 색상 클래스 반환
export const getPriceChangeColor = (change: number): string => {
  if (change > 0) return "text-green-600";
  if (change < 0) return "text-red-600";
  return "text-gray-600";
};

// 가격 변화에 따른 배경 색상 클래스 반환
export const getPriceChangeBgColor = (change: number): string => {
  if (change > 0) return "bg-green-100";
  if (change < 0) return "bg-red-100";
  return "bg-gray-100";
};
