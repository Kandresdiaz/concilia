import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConciliAI - Conciliación Bancaria Inteligente con IA",
  description: "Auditoría financiera y conciliación bancaria automática con el poder de la Inteligencia Artificial. Precisión del 99.9% para contadores y despachos.",
  keywords: ["conciliación bancaria", "IA contable", "auditoria financiera", "contabilidad colombia", "automatización contable"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
