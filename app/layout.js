import { Lexend } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import ThemeProvider from "@/components/ThemeProvider";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "NoteCart",
  description: "Gerencie suas listas de compras de forma simples e prática",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${lexend.variable} antialiased font-sans`}
      >
        <ThemeProvider>
          <AuthProvider>
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
