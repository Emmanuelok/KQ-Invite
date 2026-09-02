// Native Next.js builds do not expose Cloudflare's virtual workers module.
// Vercel requests are handled by the backend proxy before this fallback is read.
export const env = {};
