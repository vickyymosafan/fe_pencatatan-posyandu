import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ToastProvider } from "@/lib/context/ToastContext";
import { ToastRenderer } from "@/components/providers/ToastRenderer";
import { ErrorHandlerProvider } from "@/components/providers/ErrorHandlerProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              <ErrorHandlerProvider>
                {children}
                <ToastRenderer />
              </ErrorHandlerProvider>
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
