import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // genera archivos estáticos
  images: {
    unoptimized: true, // Necesario cuando usas output: "export"
  },
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.50.220:3000"
  ]
};

export default nextConfig;