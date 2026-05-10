import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import "./canopy-landing.css";

const landingSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-landing-serif",
});

const landingSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-landing-sans",
});

export const metadata: Metadata = {
  title: "Canopy — Detecta. Entiende. Retiene.",
  description:
    "Agente de retención inteligente. Lee señales de uso, tickets y silencio antes de que sea tarde.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${landingSerif.variable} ${landingSans.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
