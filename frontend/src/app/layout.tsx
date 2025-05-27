import { Raleway, Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <body className={`${raleway.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
