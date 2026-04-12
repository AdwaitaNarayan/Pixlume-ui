import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "../../components/ClientLayout";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pixlume – High-Resolution Photography",
  description:
    "Discover, search, and download premium high-resolution photography. A Pinterest-style image discovery platform for creators.",
  openGraph: {
    title: "Pixlume – High-Resolution Photography",
    description: "Premium image discovery for creators.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClientLayout fontVariable={plusJakarta.variable}>
        {children}
      </ClientLayout>
    </html>
  );
}
