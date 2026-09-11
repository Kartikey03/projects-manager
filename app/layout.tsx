import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Projects Manager",
  description: "Track freelance projects, clients and irregular payments in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
