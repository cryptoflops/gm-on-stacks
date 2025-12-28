import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pino-pretty": false,
      "fsevents": false,
      "net": false,
      "tls": false,
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // CSP intentionally permissive for images/connect due to Web3 requirements, 
          // but restricts scripts to self and trusted domains.
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.vercel.app https://*.walletconnect.org https://*.reown.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://*.reown.com data:; img-src 'self' data: blob: https://*.walletconnect.org https://*.reown.com https://cryptologos.cc https://explorer.hiro.so https://assets.unicorn.studio; connect-src 'self' https://*.hiro.so https://*.walletconnect.org https://*.reown.com https://api.web3modal.org wss://*.walletconnect.org https://cdn.jsdelivr.net https://storage.googleapis.com;"
          }
        ]
      }
    ]
  }
};

export default nextConfig;
