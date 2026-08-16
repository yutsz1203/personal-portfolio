import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.151"],
  images: {
    // Next 16 defaults this to [75] and coerces any other `quality` prop to the
    // nearest allowed value, so 90 has to be listed to be usable. Book covers
    // are dense small type and visibly soften at 75.
    qualities: [75, 90],
  },
};

export default nextConfig;
