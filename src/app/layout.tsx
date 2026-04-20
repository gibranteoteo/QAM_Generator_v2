import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "QAM Generator v2",
  description: "Formulir Input Cuaca (Metar QAM)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
