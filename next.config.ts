import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*** whitelisting the host ***/
  
  images: {                        
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  }
};

export default nextConfig;
