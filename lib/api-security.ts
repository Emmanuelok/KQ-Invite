import { eq } from "drizzle-orm";

import { getDb } from "../db";
import { submissionRateLimits } from "../db/schema";

const JSON_HEADERS = {
  "cache-control": "no-store, max-age=0",
  pragma: "no-cache",
  "x-content-type-options": "nosniff",
};

export function jsonResponse(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  for (const [key, value] of Object.entries(JSON_HEADERS)) headers.set(key, value);
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { ...init, headers });
}

export function validateJsonRequest(request: Request, maximumBytes = 24_000) {
  const type = request.headers.get("content-type")?.split(";", 1)[0]?.trim();
  if (type !== "application/json") return "Please submit the form as JSON.";
  const length = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > maximumBytes) return "That submission is too large.";
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) return "This request is not allowed.";
    } catch {
      return "This request is not allowed.";
    }
  }
  return null;
}

export async function secretsMatch(left: string | null, right?: string) {
  if (!left || !right) return false;
  const encoder = new TextEncoder();
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);
  const leftBytes = new Uint8Array(leftHash);
  const rightBytes = new Uint8Array(rightHash);
  let difference = leftBytes.length ^ rightBytes.length;
  const length = Math.max(leftBytes.length, rightBytes.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return difference === 0;
}

async function rateLimitKey(request: Request, bucket: string, discriminator = "") {
  const address =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim() ??
    "unknown";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${bucket}:${address}:${discriminator}`),
  );
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function checkRateLimit(
  database: D1Database,
  request: Request,
  bucket: string,
  limit = 8,
  windowSeconds = 600,
  discriminator = "",
) {
  const key = await rateLimitKey(request, bucket, discriminator);
  const db = getDb(database);
  const now = Date.now();
  const [record] = await db
    .select()
    .from(submissionRateLimits)
    .where(eq(submissionRateLimits.key, key))
    .limit(1);

  if (!record || now - Date.parse(record.windowStartedAt) >= windowSeconds * 1000) {
    await db
      .insert(submissionRateLimits)
      .values({ key, attempts: 1, windowStartedAt: new Date(now).toISOString() })
      .onConflictDoUpdate({
        target: submissionRateLimits.key,
        set: { attempts: 1, windowStartedAt: new Date(now).toISOString() },
      });
    return true;
  }

  if (record.attempts >= limit) return false;
  await db
    .update(submissionRateLimits)
    .set({ attempts: record.attempts + 1 })
    .where(eq(submissionRateLimits.key, key));
  return true;
}

export function createPrivateReference() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
}
