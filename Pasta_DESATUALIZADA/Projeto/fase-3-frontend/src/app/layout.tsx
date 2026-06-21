import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/lib/user-context";

export const metadata: Metadata = {
  title: "Softinsa Badge Platform",
  description: "Plataforma de Badges Digitais da Softinsa — PINT 2025",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className="h-full">
      <body className="min-h-full h-full antialiased font-sans">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
