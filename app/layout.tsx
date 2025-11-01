import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ToastProvider } from "@/lib/context/ToastContext";
import { ToastRenderer } from "@/components/providers/ToastRenderer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sistem Rekam Medis Digital Posyandu Lansia",
  description: "Aplikasi manajemen rekam medis digital untuk Posyandu Lansia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${montserrat.variable} antialiased`}>
        <AuthProvider>
          <ToastProvider>
            {children}
            <ToastRenderer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
