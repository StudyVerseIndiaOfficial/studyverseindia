import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Study Verse India",
  description: "Students friendly learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body className="bg-gray-100">
        <Header />

        <main className="min-h-screen">
          {children}
        </main>

        <Footer />

        <BottomNav />
      </body>
    </html>
  );
}