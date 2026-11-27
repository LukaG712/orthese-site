"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type AuthProviderKind = "email" | "google" | "github" | "apple" | "discord";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  provider: AuthProviderKind;
  avatarUrl?: string;
  credits: number;
  plan: string;
}

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
  user: UserAccount | null;
  authReady: boolean;
  signIn: (account: UserAccount) => void;
  signInWithSocial: (provider: Exclude<AuthProviderKind, "email">) => UserAccount;
  signOut: () => void;
}

const AUTH_STORAGE_KEY = "orthese.auth.user.v1";

const SOCIAL_DEMO_PROFILES: Record<
  Exclude<AuthProviderKind, "email">,
  Omit<UserAccount, "id" | "provider">
> = {
  google: {
    name: "Luka G.",
    email: "luka@orthese.dev",
    credits: 2410,
    plan: "Builder · Credits",
  },
  github: {
    name: "LukaG712",
    email: "lukag712@users.noreply.github.com",
    credits: 2410,
    plan: "Builder · Credits",
  },
  apple: {
    name: "Luka G.",
    email: "luka@icloud.com",
    credits: 2410,
    plan: "Builder · Credits",
  },
  discord: {
    name: "luka.dev",
    email: "luka@orthese.dev",
    credits: 2410,
    plan: "Builder · Credits",
  },
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function StorefrontProvider({ children }: { children: React.ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState<CheckoutTarget | null>(null);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserAccount;
        if (parsed && typeof parsed.email === "string" && typeof parsed.name === "string") {
          setUser(parsed);
        }
      }
    } catch {
      // Ignore storage errors in restricted browsing contexts
    } finally {
      setAuthReady(true);
    }
  }, []);

  const signIn = useCallback((account: UserAccount) => {
    setUser(account);
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(account));
    } catch {
      // Ignore storage quota errors
    }
  }, []);

  const signInWithSocial = useCallback(
    (provider: Exclude<AuthProviderKind, "email">) => {
      const profile = SOCIAL_DEMO_PROFILES[provider];
      const account: UserAccount = {
        id: `usr_${provider}_${Date.now().toString(36)}`,
        provider,
        ...profile,
      };
      signIn(account);
      return account;
    },
    [signIn]
  );

  const signOut = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

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
        user,
        authReady,
        signIn,
        signInWithSocial,
        signOut,
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
