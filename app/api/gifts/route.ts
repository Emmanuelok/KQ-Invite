import { and, desc, eq, ne } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "../../../db";
import { giftReservations } from "../../../db/schema";
import {
  checkRateLimit,
  createPrivateReference,
  jsonResponse,
  secretsMatch,
  validateJsonRequest,
} from "../../../lib/api-security";
import { proxyWeddingBackend } from "../../../lib/backend-proxy";
import { isOrganiserRequest } from "../../../lib/access";
import { giftMap } from "../../../lib/gifts";
import { getRuntimeEnv } from "../../../lib/runtime-env";

const giftRequestSchema = z.object({
  guestName: z.string().trim().min(2, "Please enter your name.").max(120),
  contactDetail: z.string().trim().min(5, "Please add the best way to reach you.").max(200),
  preferredReplyMethod: z.enum(["email", "phone"]),
  requestType: z.enum(["reserve-gift", "contribution-details", "other"]),
  giftKey: z.string().trim().min(2).max(80),
  note: z.string().trim().max(600).optional().default(""),
  consentAccepted: z.literal(true),
});

export async function GET(request: Request) {
  const proxied = await proxyWeddingBackend(request, "/api/gifts");
  if (proxied) return proxied;

  const runtime = await getRuntimeEnv();
  if (!runtime.DB) return jsonResponse({ error: "Gift details are temporarily unavailable." }, { status: 503 });
  const db = getDb(runtime.DB);

  try {
    if (
      isOrganiserRequest(request) &&
      await secretsMatch(request.headers.get("x-admin-key"), runtime.WEDDING_ADMIN_KEY)
    ) {
      const rows = await db
        .select()
        .from(giftReservations)
        .orderBy(desc(giftReservations.updatedAt), desc(giftReservations.id));
      return jsonResponse({ gifts: rows });
    }

    const rows = await db
      .select({ giftKey: giftReservations.giftKey })
      .from(giftReservations)
      .where(
        and(
          eq(giftReservations.requestType, "reserve-gift"),
          ne(giftReservations.status, "released"),
        ),
      );
    return jsonResponse({ reservedGiftKeys: [...new Set(rows.map((row) => row.giftKey))] });
  } catch {
    return jsonResponse({ error: "Gift details are temporarily unavailable." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const proxied = await proxyWeddingBackend(request, "/api/gifts");
  if (proxied) return proxied;

  const validationError = validateJsonRequest(request, 12_000);
  if (validationError) return jsonResponse({ error: validationError }, { status: 400 });

  const runtime = await getRuntimeEnv();
  if (!runtime.DB) return jsonResponse({ error: "The gift centre is temporarily unavailable." }, { status: 503 });

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "We could not read that request." }, { status: 400 });
    }
    const parsed = giftRequestSchema.safeParse(body);
    if (!parsed.success) {
      return jsonResponse(
        { error: parsed.error.issues[0]?.message ?? "Please check the gift request." },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    if (
      !(await checkRateLimit(
        runtime.DB,
        request,
        "gift-submit",
        6,
        600,
        `${payload.contactDetail.toLowerCase()}:${payload.giftKey}`,
      ))
    ) {
      return jsonResponse({ error: "Please wait a few minutes before trying again." }, { status: 429 });
    }
    const gift = giftMap.get(payload.giftKey);
    if (!gift) return jsonResponse({ error: "That gift option is not available." }, { status: 400 });
    if (payload.requestType === "contribution-details" && gift.kind === "keepsake") {
      return jsonResponse({ error: "Please reserve this keepsake instead." }, { status: 400 });
    }

    const db = getDb(runtime.DB);
    if (payload.requestType === "reserve-gift" && gift.kind === "keepsake") {
      const [existing] = await db
        .select({ id: giftReservations.id })
        .from(giftReservations)
        .where(and(eq(giftReservations.giftKey, gift.key), ne(giftReservations.status, "released")))
        .limit(1);
      if (existing) {
        return jsonResponse({ error: "Someone has already reserved that keepsake. Please choose another." }, { status: 409 });
      }
    }

    const now = new Date().toISOString();
    const privateReference = createPrivateReference();
    try {
      await db.insert(giftReservations).values({
        privateReference,
        guestName: payload.guestName,
        contactDetail: payload.contactDetail,
        preferredReplyMethod: payload.preferredReplyMethod,
        requestType: payload.requestType,
        giftKey: gift.key,
        giftLabel: gift.label,
        status: "requested",
        note: payload.note,
        updatedAt: now,
      });
    } catch (insertError) {
      if (payload.requestType === "reserve-gift" && gift.kind === "keepsake") {
        return jsonResponse({ error: "Someone has already reserved that keepsake. Please choose another." }, { status: 409 });
      }
      throw insertError;
    }
    return jsonResponse(
      {
        privateReference,
        status: "requested",
        giftLabel: gift.label,
        message: "Your private gift request is safely recorded. We will reply using your preferred method.",
      },
      { status: 201 },
    );
  } catch {
    return jsonResponse({ error: "We could not save that gift request right now." }, { status: 500 });
  }
}
