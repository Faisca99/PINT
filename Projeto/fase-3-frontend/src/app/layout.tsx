import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pathway Quest Pro",
  description: "Frontend Next.js integrado com Design Original",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" className="h-full">
      <body className="min-h-full h-full antialiased font-sans">
        {/* We let individual pages use AppLayout or we could put SidebarProvider here */}
        {children}
      </body>
    </html>
  );
}
