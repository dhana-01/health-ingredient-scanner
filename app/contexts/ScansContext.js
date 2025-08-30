import React, { createContext, useContext, useState, useMemo } from 'react';

const ScansContext = createContext();

export function ScansProvider({ children }) {
  const [scans, setScans] = useState([]);

  const addScan = (scan) => {
    setScans((prev) => [scan, ...prev]);
  };

  const value = useMemo(() => ({ scans, addScan }), [scans]);
  return <ScansContext.Provider value={value}>{children}</ScansContext.Provider>;
}

export function useScans() {
  const ctx = useContext(ScansContext);
  if (!ctx) {
    return { scans: [], addScan: () => {} };
  }
  return ctx;
}


