import type { Metadata, Viewport } from "next";
import "./globals.css";

const description = "Track freelance projects, referral sources and irregular payments in one place.";

export const metadata: Metadata = {
  // absolute base so the social preview image resolves when the link is shared
  metadataBase: new URL("https://theog-projects-manager.vercel.app"),
  title: { default: "Ordo", template: "%s · Ordo" },
  description,
  applicationName: "Ordo",
  appleWebApp: { capable: true, title: "Ordo", statusBarStyle: "black" },
  openGraph: { type: "website", siteName: "Ordo", title: "Ordo", description },
  twitter: { card: "summary_large_image", title: "Ordo", description },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  // lets env(safe-area-inset-*) report real values so the tab bar clears the iPhone home indicator
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
