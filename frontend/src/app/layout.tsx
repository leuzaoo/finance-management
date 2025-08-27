import { Archivo, Inter, DM_Sans } from "next/font/google";
import type { Metadata } from "next";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

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

const dm_sans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "FinSafe | Gerenciador de Finanças",
  description:
    "Administre suas finanças de forma fácil e simples. O resto deixe conosco.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${archivo.className} ${dm_sans.variable} ${inter.variable} antialiased`}
      >
        <h1 className="sr-only">Gerenciador de Finanças</h1>
        {children}
      </body>
    </html>
  );
}
