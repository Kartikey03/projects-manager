import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Reuse already-loaded dashboard pages for 2 minutes when switching tabs.
    // Saves call revalidatePath, which clears this cache, so edits always show.
    staleTimes: {
      dynamic: 120,
    },
  },
};

export default nextConfig;
