"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar/Navbar";
import { ThemeProvider } from "./ThemeProvider";

export default function ClientLayout({
  children,
  geistSansVariable,
  geistMonoVariable,
}: {
  children: React.ReactNode;
  geistSansVariable: string;
  geistMonoVariable: string;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <body
      className={`${geistSansVariable} ${geistMonoVariable} antialiased bg-white dark:bg-zinc-950 transition-colors duration-300`}
    >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {!isAdminPage && <Navbar />}
        <main className={isAdminPage ? "" : "pt-20"}>
          {children}
        </main>
      </ThemeProvider>
    </body>
  );
}
