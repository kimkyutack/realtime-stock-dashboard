import { useCallback, useRef, useEffect, useMemo, useState } from "react";
import { debounce, throttle, shallowEqual } from "../utils/performance";

// 디바운스 훅
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 디바운스 콜백 훅
export const useDebounceCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useMemo(
    () =>
      debounce((...args: Parameters<T>) => callbackRef.current(...args), delay),
    [delay]
  ) as T;
};

// 쓰로틀 훅
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useMemo(
    () =>
      throttle((...args: Parameters<T>) => callbackRef.current(...args), delay),
    [delay]
  ) as T;
};

// 이전 값과 비교하는 훅
export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

// 깊은 비교를 위한 훅
export const useDeepCompare = <T>(
  value: T,
  compareFn: (prev: T, next: T) => boolean = shallowEqual
): T => {
  const ref = useRef<T>(value);

  if (!compareFn(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
};

// 메모이제이션된 콜백 훅
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

// 인터섹션 옵저버 훅
export const useIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback(
    (element: Element | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (element) {
        observerRef.current = new IntersectionObserver(callback, options);
        observerRef.current.observe(element);
      }
    },
    [callback, options]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return observe;
};

// 성능 측정 훅
export const usePerformanceMeasure = (name: string) => {
  const startTime = useRef<number | undefined>(0);

  const startMeasure = useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const endMeasure = useCallback(() => {
    if (startTime.current) {
      const duration = performance.now() - startTime.current;
      console.log(`${name} 실행 시간: ${duration.toFixed(2)}ms`);
      startTime.current = undefined;
    }
  }, [name]);

  return { startMeasure, endMeasure };
};

// 메모리 사용량 모니터링 훅
export const useMemoryMonitor = (enabled: boolean = false) => {
  const [memoryInfo, setMemoryInfo] = useState<{
    used: number;
    total: number;
    limit: number;
  } | null>(null);

  useEffect(() => {
    if (!enabled || !("memory" in performance)) return;

    const updateMemoryInfo = () => {
      const memory = (performance as any).memory;
      setMemoryInfo({
        used: Math.round(memory.usedJSHeapSize / 1048576),
        total: Math.round(memory.totalJSHeapSize / 1048576),
        limit: Math.round(memory.jsHeapSizeLimit / 1048576),
      });
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // 5초마다 업데이트

    return () => clearInterval(interval);
  }, [enabled]);

  return memoryInfo;
};

// 지연 로딩 훅
export const useLazyLoad = <T>(data: T[], pageSize: number = 10) => {
  const [displayedItems, setDisplayedItems] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const endIndex = currentPage * pageSize;
    const newItems = data.slice(0, endIndex);
    setDisplayedItems(newItems);
    setHasMore(endIndex < data.length);
  }, [data, currentPage, pageSize]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasMore]);

  return {
    displayedItems,
    hasMore,
    loadMore,
    reset: () => setCurrentPage(1),
  };
};
