import path from "node:path";

import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self' data:; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: blob:; media-src 'self' blob:; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests",
  },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(), payment=(), usb=()" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    // Sites does not provision a Cloudflare Images binding for this project.
    // Serve the already-optimised local WebP files directly instead of routing
    // them through Vinext's runtime image endpoint.
    unoptimized: true,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  webpack(config) {
    // Resolve the project alias explicitly during hosted builds. Vercel can
    // inject a build root before Next reads tsconfig paths, so relying only on
    // the TypeScript `@/*` mapping can make valid source files look missing.
    config.resolve.alias["@"] = process.cwd();

    config.resolve.alias["wedding-runtime-env"] = path.resolve(
      process.cwd(),
      "lib/vercel-runtime-env.ts",
    );
    return config;
  },
};

export default nextConfig;
