import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProviderWrapper } from "@/components/PostHogProvider";

export const dynamic = 'force-dynamic'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConciliAI - Conciliación Bancaria con Inteligencia Artificial",
  description: "Automatiza tu auditoría financiera. ConciliAI cruza extractos bancarios y auxiliares contables en segundos con precisión del 99.9%. Diseñado por y para contadores.",
  keywords: ["conciliación bancaria", "IA contable", "auditoria financiera", "automatización contable colombia", "software para contadores", "conciliacion bancaria automatica"],
  authors: [{ name: "ConciliAI Team" }],
  openGraph: {
    title: "ConciliAI | Auditoría Bancaria con IA",
    description: "Deja de pelear con Excel. La IA que hace tus conciliaciones en segundos.",
    url: "https://concilia.ai",
    siteName: "ConciliAI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ConciliAI Dashboard Demo",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConciliAI | Concilia tus bancos como un rayo",
    description: "IA especializada en extraer y cruzar datos financieros con precisión quirúrgica.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://concilia.ai",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  }
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
        <PostHogProviderWrapper>
          {children}
        </PostHogProviderWrapper>
      </body>
    </html>
  );
}
