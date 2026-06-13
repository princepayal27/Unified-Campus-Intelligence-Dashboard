// app/layout.tsx
import type { Metadata } from "next";
import { Khula } from "next/font/google";
import "./globals.css";

const khula = Khula({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-khula",
});

export const metadata: Metadata = {
  title: "Unified Campus Intelligence Dashboard",
  description: "AI-powered campus dashboard for students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={khula.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}