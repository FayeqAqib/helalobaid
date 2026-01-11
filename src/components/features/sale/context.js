"use client";
import { createContext, useContext, useEffect, useState } from "react";

const SaleContext = createContext();

export function SaleContextProvider({ children, initialData }) {
  const [data, setData] = useState({});
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return <SaleContext.Provider value={data}>{children}</SaleContext.Provider>;
}

export function useSale() {
  return useContext(SaleContext);
}
