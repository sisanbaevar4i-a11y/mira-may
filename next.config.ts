import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Отключаем проверку линтера при сборке
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Отключаем строгую проверку типов при сборке
    ignoreBuildErrors: true,
  },
};

export default nextConfig;