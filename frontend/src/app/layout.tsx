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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Aplica o tema antes da hidratação (evita FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    var storage = typeof localStorage !== 'undefined' ? localStorage : null;
    var stored =
      storage && typeof storage.getItem === 'function'
        ? storage.getItem('theme') // "dark" | "light" | null
        : null;
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    var root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    root.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`,
          }}
        />
      </head>
      <body
        className={`${archivo.className} ${dm_sans.variable} ${inter.variable} antialiased`}
      >
        <h1 className="sr-only">Gerenciador de Finanças</h1>
        {children}
      </body>
    </html>
  );
}
