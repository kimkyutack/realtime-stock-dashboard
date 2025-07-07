import React, { useState, useRef, useEffect, useCallback } from "react";
import { useIntersectionObserver } from "../hooks/usePerformance";

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = React.memo(
  ({
    src,
    alt,
    placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYWEzZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+",
    className = "",
    width,
    height,
    onLoad,
    onError,
  }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleIntersection = useCallback(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      []
    );

    const observe = useIntersectionObserver(handleIntersection, {
      rootMargin: "50px",
      threshold: 0.1,
    });

    useEffect(() => {
      if (imgRef.current) {
        observe(imgRef.current);
      }
    }, [observe]);

    const handleLoad = useCallback(() => {
      setIsLoaded(true);
      setHasError(false);
      onLoad?.();
    }, [onLoad]);

    const handleError = useCallback(() => {
      setHasError(true);
      onError?.();
    }, [onError]);

    const imageSrc = isInView ? src : placeholder;
    const showPlaceholder = !isLoaded || hasError;

    return (
      <div
        ref={imgRef}
        className={`relative overflow-hidden ${className}`}
        style={{ width, height }}
      >
        {/* 플레이스홀더 */}
        {showPlaceholder && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
              <span className="text-xs text-gray-500">로딩 중...</span>
            </div>
          </div>
        )}

        {/* 실제 이미지 */}
        <img
          src={imageSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded && !hasError ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleLoad}
          onError={handleError}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* 에러 상태 */}
        {hasError && (
          <div className="absolute inset-0 bg-red-50 flex items-center justify-center">
            <div className="text-center">
              <span className="text-red-500 text-2xl mb-2 block">⚠️</span>
              <span className="text-xs text-red-600">이미지 로드 실패</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

LazyImage.displayName = "LazyImage";

export default LazyImage;
