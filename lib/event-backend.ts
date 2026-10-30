export const EVENTS_BACKEND = "https://st-johns-event-decor.elkings.chatgpt.site";

const MAX_BODY_BYTES = 180_000;
const publicEndpoint = /^\/api\/(?:inquiries|projects(?:\/TGP-[A-Fa-f0-9-]+(?:\/change-orders)?)?)$/;

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
const privateFields = new Set(["available", "quantityOwned", "quantityReserved", "replacementCost", "storageZone", "turnaroundHours"]);

function publicSnapshot(value: Json): Json {
  if (Array.isArray(value)) return value.map(publicSnapshot);
  if (!value || typeof value !== "object") return value;
  const result: { [key: string]: Json } = {};
  for (const [key, item] of Object.entries(value)) {
    if (privateFields.has(key)) continue;
    result[key] = key === "availability" ? "Review required" : key === "message" && typeof item === "string" ? item.replaceAll("TIDEGLASS", "Kingsperl Events") : publicSnapshot(item);
  }
  if (result.id === "inventory") {
    result.status = "Review";
    result.detail = "The team must confirm date-specific availability, substitutes and any subrentals before reserving inventory.";
  }
  return result;
}

function apiError(path: string, status: number, code: string, message: string) {
  return Response.json(
    { error: path === "/api/inquiries" ? message : { code, message } },
    { status, headers: { "cache-control": "no-store" } },
  );
}

export function staffOnly() {
  return Response.json(
    { error: { code: "STAFF_ACCESS_REQUIRED", message: "Use the signed-in Kingsperl Events operations workspace for staff actions." } },
    { status: 403, headers: { "cache-control": "no-store" } },
  );
}

/** Only explicitly exposed customer endpoints may reach the private backend. */
export async function forwardToKingsperl(
  request: Request,
  path: string,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  const isCollection = path === "/api/projects";
  const isInquiry = path === "/api/inquiries";
  const isChange = path.endsWith("/change-orders");
  const allowedMethod = isCollection || isInquiry || isChange ? "POST" : "GET";
  if (!publicEndpoint.test(path) || request.method !== allowedMethod) {
    return apiError(path, 404, "NOT_FOUND", "This endpoint is not available.");
  }

  const token = process.env.KINGSPERL_BACKEND_TOKEN;
  if (!token) {
    return apiError(path, 503, "SERVICE_UNAVAILABLE", "The event service is temporarily unavailable. Please try again shortly.");
  }

  // Never forward cookies, visitor Authorization, or visitor-provided identity
  // headers. A service credential must not turn a public caller into staff.
  const headers = new Headers({
    accept: "application/json",
    "OAI-Sites-Authorization": token,
  });
  const projectToken = request.headers.get("x-kingsperl-project-token") ?? request.headers.get("x-tideglass-project-token");
  if (projectToken && /^[a-f0-9]{64}$/i.test(projectToken)) {
    headers.set("x-tideglass-project-token", projectToken);
  }

  let body: Uint8Array | undefined;
  if (request.method === "POST") {
    const origin = request.headers.get("origin");
    const fetchSite = request.headers.get("sec-fetch-site");
    if ((origin && origin !== new URL(request.url).origin)
      || (fetchSite && !["same-origin", "same-site", "none"].includes(fetchSite))) {
      return apiError(path, 403, "ORIGIN_NOT_ALLOWED", "Submit this request from the Kingsperl Events website.");
    }
    if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
      return apiError(path, 415, "JSON_REQUIRED", "Send this request as JSON.");
    }
    if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
      return apiError(path, 413, "PAYLOAD_TOO_LARGE", "This request is too large.");
    }
    const reader = request.body?.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BODY_BYTES) {
          await reader.cancel();
          return apiError(path, 413, "PAYLOAD_TOO_LARGE", "This request is too large.");
        }
        chunks.push(value);
      }
    }
    body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    try { JSON.parse(new TextDecoder().decode(body)); }
    catch { return apiError(path, 400, "INVALID_JSON", "This request contains invalid JSON."); }
    headers.set("content-type", "application/json");
  }

  try {
    const upstream = await fetcher(`${EVENTS_BACKEND}${path}`, {
      method: request.method,
      headers,
      body: body as BodyInit | undefined,
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(20_000),
    });
    if (!upstream.headers.get("content-type")?.includes("application/json")) {
      return apiError(path, 502, "SERVICE_UNAVAILABLE", "The event service could not be reached. Please try again shortly.");
    }
    const payload = publicSnapshot(await upstream.json() as Json);
    return Response.json(payload, {
      status: upstream.status,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
    });
  } catch {
    return apiError(path, 502, "SERVICE_UNAVAILABLE", "The event service could not be reached. Please try again shortly.");
  }
}
