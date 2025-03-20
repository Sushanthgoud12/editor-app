import { useState, useCallback, useEffect } from "react";

export const useResize = (isMobile) => {
  const [isResizing, setIsResizing] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    document.body.classList.add("resizing");
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.classList.remove("resizing");
  }, []);

  const handleResize = useCallback(
    (e, containerRef) => {
      if (!isResizing || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newPosition =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      if (newPosition >= 20 && newPosition <= 80) {
        requestAnimationFrame(() => {
          setSplitPosition(newPosition);
        });
      }
    },
    [isResizing]
  );

  const handleDoubleClick = useCallback(
    (e, containerRef) => {
      if (!isMobile) {
        const container = containerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const clickPosition =
          ((e.clientX - containerRect.left) / containerRect.width) * 100;

        if (Math.abs(splitPosition - 50) < 5) {
          if (clickPosition < 50) {
            setSplitPosition(30);
          } else {
            setSplitPosition(70);
          }
        } else {
          setSplitPosition(50);
        }
      }
    },
    [isMobile, splitPosition]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", stopResizing);
      window.addEventListener("mouseleave", stopResizing);
    }

    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", stopResizing);
      window.removeEventListener("mouseleave", stopResizing);
    };
  }, [isResizing, handleResize, stopResizing]);

  return {
    isResizing,
    splitPosition,
    startResizing,
    stopResizing,
    handleResize,
    handleDoubleClick,
  };
};
