"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { SkeletonAuthCard } from "@/components/primitives/Skeleton";
import { SocialButton } from "@/components/primitives/SocialButton";
import { OrbitGradientText } from "@/components/ui/OrbitGradientText";
import {
  useStorefront,
  type AuthProviderKind,
} from "@/components/shell/StorefrontContext";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const { user, signIn, signInWithSocial } = useStorefront();

  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<AuthProviderKind | null>(
    null
  );

  // Sync ?mode=signup on mount (static-export safe)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "signup") {
      setMode("signup");
    }
  }, []);

  // Redirect home if already authenticated and not mid-transition
  useEffect(() => {
    if (user && !loadingProvider) {
      router.replace("/");
    }
  }, [user, loadingProvider, router]);

  function handleSocial(provider: Exclude<AuthProviderKind, "email">) {
    if (loadingProvider) return;
    setLoadingProvider(provider);
    window.setTimeout(() => {
      const account = signInWithSocial(provider);
      const label =
        provider === "github"
          ? "GitHub"
          : provider.charAt(0).toUpperCase() + provider.slice(1);
      toast.success(
        mode === "signup"
          ? `Welcome to Orthese, ${account.name}`
          : `Signed in as ${account.name}`,
        {
          description: `Authenticated with ${label} · ${account.credits.toLocaleString()} cr ready`,
        }
      );
      router.push("/");
    }, 480);
  }

  function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    if (loadingProvider) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password.length < 4) {
      toast.error("Please enter a password (at least 4 characters).");
      return;
    }

    const derivedName =
      name.trim() ||
      trimmedEmail
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    setLoadingProvider("email");
    window.setTimeout(() => {
      signIn({
        id: `usr_email_${Date.now().toString(36)}`,
        name: derivedName,
        email: trimmedEmail,
        provider: "email",
        credits: mode === "signup" ? 200 : 2410,
        plan: mode === "signup" ? "Starter · €2 free" : "Builder · Credits",
      });
      toast.success(
        mode === "signup"
          ? `Account created for ${derivedName}`
          : `Welcome back, ${derivedName}`,
        {
          description:
            mode === "signup"
              ? "€2 starter credits added to your workspace."
              : "Workspace session restored.",
        }
      );
      router.push("/");
    }, 480);
  }

  const isSignup = mode === "signup";
  const socialVerb = isSignup ? "Sign up with" : "Continue with";

  return (
    <section className="relative flex min-h-[calc(100svh-52px)] items-center justify-center overflow-x-clip px-4 py-12 sm:px-6">
      {/* Subtle architectural atmosphere matching Hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
        style={{
          background:
            "radial-gradient(ellipse 62% 52% at 50% 0%, rgba(255,255,255,0.065), rgba(129,140,248,0.045) 44%, transparent 78%)",
        }}
      />
      <div
        aria-hidden="true"
        className="hero-grid-veil pointer-events-none absolute inset-0"
      />

      <div className="relative w-full max-w-[410px]">
        {/* Soft ambient aura behind card */}
        <div
          aria-hidden="true"
          className="hero-composer-aura pointer-events-none absolute -inset-8 rounded-[36px] opacity-80"
        />

        <AnimatePresence mode="wait">
          {loadingProvider ? (
            <motion.div
              key="auth-skeleton"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.16 }}
            >
              <SkeletonAuthCard />
            </motion.div>
          ) : (
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              data-testid="auth-card"
              className="relative rounded-2xl border border-white/[0.12] bg-[#111217]/95 p-6 sm:p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_32px_90px_-20px_rgba(0,0,0,0.95)] backdrop-blur-xl"
            >
              {/* Brand header */}
              <div className="text-center">
                <Link
                  href="/"
                  className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.04]"
                  aria-label="Back to Orthese"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" fill="#F7F8F8" />
                    <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="#F7F8F8" strokeWidth="1.35" />
                    <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" stroke="#F7F8F8" strokeWidth="1.35" />
                    <rect x="9" y="9" width="5.5" height="5.5" rx="1.2" fill="#F7F8F8" fillOpacity="0.38" />
                  </svg>
                </Link>

                <h1 className="mt-4 text-[22px] font-medium tracking-[-0.03em] text-[#f7f8f8]">
                  {isSignup ? (
                    <>
                      Create your <OrbitGradientText>Orthese</OrbitGradientText> account
                    </>
                  ) : (
                    <>
                      Log in to <OrbitGradientText>Orthese</OrbitGradientText>
                    </>
                  )}
                </h1>
                <p className="mt-1.5 text-[13px] text-[#8a8f98]">
                  {isSignup
                    ? "Start building across WASM and Desktop with €2 starter credits."
                    : "Pick up your Pieces, shared context bus, and credit balance."}
                </p>
              </div>

              {/* Social Sign-In / Sign-Up Buttons */}
              <div className="mt-6 space-y-2.5">
                <SocialButton
                  brand="google"
                  appearance="surface"
                  fullWidth
                  testId="social-btn-google"
                  onClick={() => handleSocial("google")}
                >
                  {socialVerb} Google
                </SocialButton>

                <SocialButton
                  brand="github"
                  appearance="surface"
                  fullWidth
                  testId="social-btn-github"
                  onClick={() => handleSocial("github")}
                >
                  {socialVerb} GitHub
                </SocialButton>

                <div className="grid grid-cols-2 gap-2.5">
                  <SocialButton
                    brand="apple"
                    appearance="surface"
                    fullWidth
                    testId="social-btn-apple"
                    onClick={() => handleSocial("apple")}
                  >
                    Apple
                  </SocialButton>
                  <SocialButton
                    brand="discord"
                    appearance="surface"
                    fullWidth
                    testId="social-btn-discord"
                    onClick={() => handleSocial("discord")}
                  >
                    Discord
                  </SocialButton>
                </div>
              </div>

              {/* Hairline divider */}
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/[0.08]" />
                <span className="text-[11.5px] text-[#5e626a]">
                  or continue with email
                </span>
                <span className="h-px flex-1 bg-white/[0.08]" />
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {isSignup && (
                  <div>
                    <label
                      htmlFor="auth-name"
                      className="mb-1.5 block text-[12px] font-medium text-[#c4c8d0]"
                    >
                      Name
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5e626a]" />
                      <input
                        id="auth-name"
                        type="text"
                        data-testid="auth-name-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Luka G."
                        autoComplete="name"
                        className="h-9 w-full rounded-lg border border-white/[0.11] bg-[#0b0c10] pl-9 pr-3 text-[13px] text-[#f7f8f8] placeholder:text-[#5e626a] focus:border-white/[0.26] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="auth-email"
                    className="mb-1.5 block text-[12px] font-medium text-[#c4c8d0]"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5e626a]" />
                    <input
                      id="auth-email"
                      type="email"
                      required
                      data-testid="auth-email-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      autoComplete="email"
                      className="h-9 w-full rounded-lg border border-white/[0.11] bg-[#0b0c10] pl-9 pr-3 text-[13px] text-[#f7f8f8] placeholder:text-[#5e626a] focus:border-white/[0.26] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="auth-password"
                    className="mb-1.5 block text-[12px] font-medium text-[#c4c8d0]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5e626a]" />
                    <input
                      id="auth-password"
                      type="password"
                      required
                      data-testid="auth-password-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isSignup ? "Create a password" : "Enter your password"}
                      autoComplete={isSignup ? "new-password" : "current-password"}
                      className="h-9 w-full rounded-lg border border-white/[0.11] bg-[#0b0c10] pl-9 pr-3 text-[13px] text-[#f7f8f8] placeholder:text-[#5e626a] focus:border-white/[0.26] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  data-testid="auth-submit-btn"
                  className="btn-pill-white mt-1 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg px-4 text-[13px] font-medium cursor-pointer"
                >
                  <span>{isSignup ? "Create account" : "Log in"}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* Shared Login <-> Signup Toggle Line */}
              <div className="mt-5 border-t border-white/[0.07] pt-4 text-center text-[12.5px] text-[#8a8f98]">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      data-testid="auth-toggle-mode"
                      onClick={() => setMode("login")}
                      className="font-medium text-[#f7f8f8] underline decoration-white/30 underline-offset-4 hover:decoration-white transition-colors cursor-pointer"
                    >
                      Log in
                    </button>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      data-testid="auth-toggle-mode"
                      onClick={() => setMode("signup")}
                      className="font-medium text-[#f7f8f8] underline decoration-white/30 underline-offset-4 hover:decoration-white transition-colors cursor-pointer"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
