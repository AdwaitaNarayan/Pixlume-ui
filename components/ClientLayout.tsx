"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar/Navbar";
import { ThemeProvider } from "./ThemeProvider";

export default function ClientLayout({
  children,
  fontVariable,
}: {
  children: React.ReactNode;
  fontVariable: string;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <body
      className={`${fontVariable} antialiased bg-[#fafafa] dark:bg-[#0f0f0f] transition-colors duration-300`}
    >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {!isAdminPage && <Navbar />}
        <main className={isAdminPage ? "" : "pt-16"}>
          {children}
        </main>
      </ThemeProvider>
    </body>
  );
}
