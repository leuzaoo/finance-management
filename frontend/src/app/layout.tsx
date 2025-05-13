import { Archivo } from "next/font/google";
import type { Metadata } from "next";

import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["200", "400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Gerenciador de Finanças",
  description:
    "Administre suas finanças de forma fácil e simples. O resto deixe conosco.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} antialiased`}>{children}</body>
    </html>
  );
}
