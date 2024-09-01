import type { Metadata } from "next";

import { Inter as FontSans } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/lib/providers";
import { Navbar } from "@/components/navbar";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          " bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          <div className="flex w-full flex-col gap-10">
            <Navbar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
