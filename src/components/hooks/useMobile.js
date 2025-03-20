import { useState, useEffect } from "react";

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 796);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 796);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};
