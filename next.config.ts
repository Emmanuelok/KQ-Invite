import type { NextConfig } from "next";

// Next's development runtime uses eval and a WebSocket for hot reloading.
// Keep those capabilities out of the production policy.
const isDevelopment = process.env.NODE_ENV === "development";
const scriptSources = isDevelopment ? "'self' 'unsafe-inline' 'unsafe-eval'" : "'self' 'unsafe-inline'";
const connectSources = isDevelopment ? "'self' ws: wss:" : "'self'";

const securityHeaders = [
  { key: "Content-Security-Policy", value: `default-src 'self'; base-uri 'self'; connect-src ${connectSources}; font-src 'self' data:; form-action 'self'; frame-ancestors 'none'; img-src 'self' data: blob:; media-src 'self' blob:; object-src 'none'; script-src ${scriptSources}; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests` },
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(), payment=(), usb=()" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { unoptimized: true },
  async headers() { return [
    { source: "/(.*)", headers: securityHeaders },
    { source: "/sw.js", headers: [
      { key: "Content-Type", value: "application/javascript; charset=utf-8" },
      { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
      { key: "Service-Worker-Allowed", value: "/" },
    ] },
  ]; },
};

export default nextConfig;
