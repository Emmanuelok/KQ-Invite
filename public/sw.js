/* Kingsperl Events: public assets only. Customer data never enters this cache. */
const CACHE = "kingsperl-public-v4";
const PRECACHE = ["/offline", "/icon-192.png", "/icon-512.png", "/brand/kingsperl-logo-dark.svg"];
const PUBLIC_PAGES = new Set(["/", "/events", "/privacy", "/terms", "/install"]);

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("kingsperl-public-") && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/") || url.pathname.startsWith("/operations") || request.headers.has("x-kingsperl-project-token") || request.headers.has("x-tideglass-project-token")) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok && PUBLIC_PAGES.has(url.pathname) && !url.search) {
        const snapshot = response.clone();
        event.waitUntil(caches.open(CACHE).then((cache) => cache.put(url.pathname, snapshot)));
      }
      return response;
    }).catch(async () => {
      if (PUBLIC_PAGES.has(url.pathname) && !url.search) {
        const saved = await caches.match(url.pathname);
        if (saved) return saved;
      }
      return (await caches.match("/offline")) || new Response("You are offline. Reconnect to use Kingsperl Events.", { status: 503, headers: { "content-type": "text/plain" } });
    }));
    return;
  }

  const isPublicAsset = url.pathname.startsWith("/_next/static/") || /^\/(?:decor|decor-v2|event-world|brand|og|fonts|editorial)\//.test(url.pathname) || /^\/(?:icon-[\w-]+\.png|favicon\.(?:svg|ico)|favicon-\d+\.png|apple-touch-icon\.png)$/.test(url.pathname);
  if (isPublicAsset && !url.search) {
    event.respondWith(caches.match(request).then((saved) => saved || fetch(request).then((response) => {
      const snapshot = response.ok ? response.clone() : null;
      if (snapshot) event.waitUntil(caches.open(CACHE).then(async (cache) => {
        await cache.put(request, snapshot);
        const keys = await cache.keys();
        const expendable = keys.filter((key) => !PRECACHE.includes(new URL(key.url).pathname));
        if (expendable.length > 90) await cache.delete(expendable[0]);
      }));
      return response;
    })));
  }
});
