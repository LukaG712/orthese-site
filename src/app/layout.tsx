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
  title: "Orthese — The modular AI workstation for builders and agents",
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
      <body className="min-h-screen bg-[#08090a] text-[#f7f8f8] antialiased selection:bg-[#f7f8f8] selection:text-[#08090a]">
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
                background: "#111215",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.12), 0 24px 48px -12px rgba(0,0,0,0.85)",
                color: "#f7f8f8",
              },
            }}
          />
        </StorefrontProvider>
      </body>
    </html>
  );
}
