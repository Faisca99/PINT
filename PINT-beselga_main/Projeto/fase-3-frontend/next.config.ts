import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite aceder ao dev server pela rede local sem o aviso de cross-origin
  // (localhost, 127.0.0.1 e o IP da rede da máquina).
  allowedDevOrigins: ["127.0.0.1", "192.168.153.1"],
};

export default nextConfig;
