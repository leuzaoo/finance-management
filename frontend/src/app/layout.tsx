import { Archivo, Inter } from "next/font/google";
import type { Metadata } from "next";
import localFont from "next/font/local";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const zonaProBold = localFont({
  src: "../fonts/ZonaPro-Bold.otf",
  variable: "--font-zona-pro",
});

const zonaProLight = localFont({
  src: "../fonts/ZonaPro-ExtraLight.otf",
  variable: "--font-zona-pro-light",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "900"],
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
      <body
        className={`${archivo.className} ${zonaProBold.variable} ${zonaProLight.variable} ${inter.variable} antialiased`}
      >
        <h1 className="sr-only">Gerenciador de Finanças</h1>
        {children}
      </body>
    </html>
  );
}
