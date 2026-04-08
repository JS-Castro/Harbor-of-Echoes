import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harbor of Echoes",
  description:
    "A narrative investigation webapp built around evidence, timelines, and a visual case board.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
