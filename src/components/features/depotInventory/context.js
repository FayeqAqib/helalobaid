"use client";
import { createContext, useContext, useEffect, useState } from "react";

const InventoryContext = createContext();

export function InventoryContextProvider({ children, initialData }) {
  const [data, setData] = useState({});
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return (
    <InventoryContext.Provider value={data}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
