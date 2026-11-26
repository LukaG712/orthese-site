"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface CheckoutTarget {
  id: string;
  title: string;
  subtitle: string;
  priceEur: number;
  credits?: number;
  polarUrl?: string;
}

interface StorefrontContextValue {
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  checkoutTarget: CheckoutTarget | null;
  openCheckout: (target: CheckoutTarget) => void;
  closeCheckout: () => void;
}

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function StorefrontProvider({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState<CheckoutTarget | null>(null);

  const openCheckout = useCallback((target: CheckoutTarget) => {
    setCheckoutTarget(target);
  }, []);

  const closeCheckout = useCallback(() => {
    setCheckoutTarget(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <StorefrontContext.Provider
      value={{
        commandOpen,
        setCommandOpen,
        checkoutTarget,
        openCheckout,
        closeCheckout,
      }}
    >
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const ctx = useContext(StorefrontContext);
  if (!ctx) {
    throw new Error("useStorefront must be used inside StorefrontProvider");
  }
  return ctx;
}
