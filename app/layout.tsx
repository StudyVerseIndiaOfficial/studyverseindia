import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Study Verse India",
  description:
    "Study Verse India is a student friendly learning platform for All Govt Exam, BPSC, Bihar SI, BSSC, Railway, Banking, SSC and Defence Exam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}