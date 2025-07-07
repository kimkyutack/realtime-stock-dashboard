import { useCallback, useRef, useEffect, useState } from "react";

interface WorkerMessage {
  type: string;
  data?: any;
  error?: string;
}

export const useWorker = () => {
  const workerRef = useRef<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 워커 생성
    if (typeof Window !== "undefined" && "Worker" in window) {
      try {
        workerRef.current = new Worker("/workers/calculationWorker.js");
        setIsReady(true);
      } catch (error) {
        console.error("Worker 생성 실패:", error);
        setIsReady(false);
      }
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const sendMessage = useCallback(
    (message: any): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current || !isReady) {
          reject(new Error("Worker is not ready"));
          return;
        }

        setIsLoading(true);

        const handleMessage = (event: MessageEvent<WorkerMessage>) => {
          const { type, data, error } = event.data;

          if (type === "success") {
            setIsLoading(false);
            resolve(data);
          } else if (type === "error") {
            setIsLoading(false);
            reject(new Error(error));
          }

          workerRef.current?.removeEventListener("message", handleMessage);
        };

        workerRef.current.addEventListener("message", handleMessage);
        workerRef.current.postMessage(message);
      });
    },
    [isReady]
  );

  const calculateRSI = useCallback(
    async (prices: number[], period: number = 14) => {
      return sendMessage({
        type: "calculateRSI",
        data: { prices, period },
      });
    },
    [sendMessage]
  );

  const calculateMACD = useCallback(
    async (prices: number[]) => {
      return sendMessage({
        type: "calculateMACD",
        data: { prices },
      });
    },
    [sendMessage]
  );

  const calculateBollingerBands = useCallback(
    async (prices: number[], period: number = 20) => {
      return sendMessage({
        type: "calculateBollingerBands",
        data: { prices, period },
      });
    },
    [sendMessage]
  );

  const calculateSMA = useCallback(
    async (prices: number[], period: number) => {
      return sendMessage({
        type: "calculateSMA",
        data: { prices, period },
      });
    },
    [sendMessage]
  );

  const calculateAll = useCallback(
    async (prices: number[]) => {
      return sendMessage({
        type: "calculateAll",
        data: { prices },
      });
    },
    [sendMessage]
  );

  return {
    isReady,
    isLoading,
    calculateRSI,
    calculateMACD,
    calculateBollingerBands,
    calculateSMA,
    calculateAll,
  };
};
