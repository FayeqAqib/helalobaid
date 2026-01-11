"use client";
import { createContext, useContext, useEffect, useState } from "react";

const BuyContext = createContext();

export function BuyContextProvider({ children, initialData }) {
  const [data, setData] = useState({});
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return <BuyContext.Provider value={data}>{children}</BuyContext.Provider>;
}

export function useBuy() {
  return useContext(BuyContext);
}
