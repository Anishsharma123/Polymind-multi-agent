import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Polymind - AI Agents Dashboard",
  description: "A powerful dashboard for interacting with various AI agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-black text-gray-200 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
