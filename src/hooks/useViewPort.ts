import { useState, useEffect } from "react";

export const useViewPort = (): { width: number } => {

  const windowWidth = process.browser? window.innerWidth: 1352;

  const [width, setWidth] = useState(windowWidth);

  useEffect(() => {
    if (process.browser) {
      const handleWindowResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleWindowResize);
      return () => window.removeEventListener("resize", handleWindowResize);
    }
  },[])

  return { width };
}