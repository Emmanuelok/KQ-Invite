const DEFAULT_BACKEND_ORIGIN = "https://kingsford-perla-wedding.elkings.chatgpt.site";
const FORWARDED_REQUEST_HEADERS = ["accept", "content-type"] as const;
const FORWARDED_RESPONSE_HEADERS = ["content-type", "retry-after"] as const;

export function getWeddingBackendOrigin(): string | null {
  const configured = process.env.WEDDING_BACKEND_ORIGIN?.trim();
  const candidate = configured || (process.env.VERCEL ? DEFAULT_BACKEND_ORIGIN : "");
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export async function proxyWeddingBackend(
  request: Request,
  pathname: "/api/rsvp" | "/api/gifts",
): Promise<Response | null> {
  const backendOrigin = getWeddingBackendOrigin();
  if (!backendOrigin) return null;

  const incomingUrl = new URL(request.url);
  const targetUrl = new URL(pathname, backendOrigin);
  targetUrl.search = incomingUrl.search;

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const sitesBypassToken = process.env.OAI_SITES_BYPASS_TOKEN?.trim();
  if (sitesBypassToken) {
    headers.set("OAI-Sites-Authorization", `Bearer ${sitesBypassToken}`);
  }
  headers.set("origin", backendOrigin);
  headers.set("referer", `${backendOrigin}/`);
  headers.set("user-agent", "Kingsford-Perla-Wedding-Vercel/1.0");

  let body: ArrayBuffer | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.arrayBuffer();
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    });
    const responseHeaders = new Headers({
      "cache-control": "no-store, max-age=0",
      pragma: "no-cache",
      "x-content-type-options": "nosniff",
    });
    for (const name of FORWARDED_RESPONSE_HEADERS) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { error: "The wedding service is temporarily unavailable. Please try again." },
      {
        status: 502,
        headers: {
          "cache-control": "no-store, max-age=0",
          "x-content-type-options": "nosniff",
        },
      },
    );
  }
}
