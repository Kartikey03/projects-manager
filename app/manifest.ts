import type { MetadataRoute } from "next";

// "Add to Home Screen" installs the dashboard as a standalone app with the brand icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ordo",
    short_name: "Ordo",
    description: "Track freelance projects, referral sources and irregular payments.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
