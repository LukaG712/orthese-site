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
      <body className="min-h-screen bg-[#050505] text-[#fafafa] antialiased selection:bg-white selection:text-black">
        <StorefrontProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CommandPalette />
          <CheckoutModal />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.16), 0 18px 48px -12px rgba(0,0,0,0.9)",
                color: "#fafafa",
              },
            }}
          />
        </StorefrontProvider>
      </body>
    </html>
  );
}
