import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Navbar } from "@/components/shell/Navbar";
import { Footer } from "@/components/shell/Footer";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { CheckoutModal } from "@/components/shell/CheckoutModal";
import { StorefrontProvider } from "@/components/shell/StorefrontContext";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Orthese — Modular AI Workstation & Piece Marketplace",
  description:
    "Assemble your custom AI workspace out of interchangeable Pieces. Free Rust + GPUI desktop & zero-install WebAssembly dashboard with transparent non-expiring credits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen bg-[#060607] text-[#fafafa] antialiased selection:bg-white selection:text-black">
        <StorefrontProvider>
          <div className="relative flex min-h-screen flex-col">
            {/* Continuous 1200px vertical architectural blueprint rails */}
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-y-0 left-1/2 z-30 w-full max-w-[1200px] -translate-x-1/2 border-x border-white/[0.06]"
            />

            <Navbar />
            <main className="relative z-10 flex-1">{children}</main>
            <Footer />
          </div>
          <CommandPalette />
          <CheckoutModal />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0e0e11",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.14), 0 24px 48px -12px rgba(0,0,0,0.85)",
                color: "#fafafa",
              },
            }}
          />
        </StorefrontProvider>
      </body>
    </html>
  );
}
