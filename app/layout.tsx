import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from '@/components/ui/sonner';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Barstool Sports",
  description: "Barstool Sports is a sports & pop culture blog covering the latest news and viral highlights of each and everyday with blogs, videos and podcasts.  By the common man, for the common man.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col items-center`}
      >
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
