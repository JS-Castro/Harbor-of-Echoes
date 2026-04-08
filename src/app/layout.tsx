import type { Metadata } from "next";
import { getCurrentLocale } from "@/lib/i18n-server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harbor of Echoes",
  description:
    "A narrative investigation webapp built around evidence, timelines, and a visual case board.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getCurrentLocale();

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
