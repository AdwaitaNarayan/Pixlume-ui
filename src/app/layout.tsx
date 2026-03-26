import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "../../components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pixlume – High-Resolution Photography Studio",
  description: "Discover, search, and download premium image variants from breathtaking 4K resolutions to thumbnails.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClientLayout 
        geistSansVariable={geistSans.variable} 
        geistMonoVariable={geistMono.variable}
      >
        {children}
      </ClientLayout>
    </html>
  );
}
