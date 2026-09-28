import "./globals.css";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export const metadata: Metadata = {
  title: "COMEÇA. — Estás à espera de quê?",
  description: "Talvez o problema não seja falta de tempo. Talvez seja o primeiro passo.",
};
export const viewport: Viewport = { themeColor: "#0a0a0a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-AO" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-ink font-sans text-bone antialiased">{children}</body>
    </html>
  );
}
