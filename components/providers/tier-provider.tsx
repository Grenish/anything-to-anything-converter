"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Tier = "Free" | "Pro" | "Max";

interface TierContextType {
  tier: Tier;
  setTier: (tier: Tier) => void;
}

const TierContext = createContext<TierContextType | undefined>(undefined);

export function TierProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTierState] = useState<Tier>("Free");

  // Persist tier in session storage just for fun
  useEffect(() => {
    const saved = sessionStorage.getItem("userTier");
    if (saved) {
      setTierState(saved as Tier);
    }
  }, []);

  const setTier = (t: Tier) => {
    setTierState(t);
    sessionStorage.setItem("userTier", t);
  };

  return (
    <TierContext.Provider value={{ tier, setTier }}>
      {children}
    </TierContext.Provider>
  );
}

export function useTier() {
  const context = useContext(TierContext);
  if (context === undefined) {
    throw new Error("useTier must be used within a TierProvider");
  }
  return context;
}
