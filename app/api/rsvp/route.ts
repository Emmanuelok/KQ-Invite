import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "../../../db";
import { rsvps } from "../../../db/schema";
import {
  checkRateLimit,
  createPrivateReference,
  jsonResponse,
  secretsMatch,
  validateJsonRequest,
} from "../../../lib/api-security";
import { proxyWeddingBackend } from "../../../lib/backend-proxy";
import { getRuntimeEnv } from "../../../lib/runtime-env";

const rsvpSchema = z.object({
  referenceCode: z.string().trim().max(24).optional().default(""),
  submissionId: z.string().trim().min(12).max(80),
  fullName: z.string().trim().min(2, "Please enter your household name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: z.string().trim().max(40).optional().default(""),
  attendance: z.enum(["joyfully-attending", "regretfully-declining"]),
  householdSize: z.coerce.number().int().min(1).max(8).default(1),
  guestNames: z.string().trim().max(500).optional().default(""),
  accessibilityNeeds: z.string().trim().max(500).optional().default(""),
  note: z.string().trim().max(1200).optional().default(""),
  consentAccepted: z.literal(true),
});

function cleanRow(row: typeof rsvps.$inferSelect) {
  const attending = row.attendance === "joyfully-attending";
  return {
    ...row,
    selectedEvents: attending ? ["Wedding ceremony"] : [],
    mealPreference: "",
    allergies: "",
    songRequest: "",
  };
}

export async function GET(request: Request) {
  const proxied = await proxyWeddingBackend(request, "/api/rsvp");
  if (proxied) return proxied;

  const runtime = await getRuntimeEnv();
  if (!runtime.DB) return jsonResponse({ error: "Guest responses are temporarily unavailable." }, { status: 503 });
  const db = getDb(runtime.DB);

  try {
    if (await secretsMatch(request.headers.get("x-admin-key"), runtime.WEDDING_ADMIN_KEY)) {
      const rows = await db.select().from(rsvps).orderBy(desc(rsvps.updatedAt), desc(rsvps.id));
      return jsonResponse({ rsvps: rows.map(cleanRow) });
    }

    if (!(await checkRateLimit(runtime.DB, request, "rsvp-lookup", 20, 600))) {
      return jsonResponse({ error: "Please wait before trying another lookup." }, { status: 429 });
    }

    const requestUrl = new URL(request.url);
    const email = requestUrl.searchParams.get("email")?.trim().toLowerCase();
    const reference = requestUrl.searchParams.get("reference")?.trim().toUpperCase();
    if (!email || !reference || !/^(?:[A-F0-9]{10}|[A-F0-9]{24})$/.test(reference)) {
      return jsonResponse({ error: "Email and a valid confirmation reference are required." }, { status: 400 });
    }

    const [row] = await db
      .select()
      .from(rsvps)
      .where(and(eq(rsvps.email, email), eq(rsvps.referenceCode, reference)))
      .limit(1);
    if (!row) {
      return jsonResponse(
        { error: "We could not find that response. Check the email and reference." },
        { status: 404 },
      );
    }
    return jsonResponse({ rsvp: cleanRow(row) });
  } catch {
    return jsonResponse({ error: "Guest responses are temporarily unavailable." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const proxied = await proxyWeddingBackend(request, "/api/rsvp");
  if (proxied) return proxied;

  const validationError = validateJsonRequest(request);
  if (validationError) return jsonResponse({ error: validationError }, { status: 400 });

  const runtime = await getRuntimeEnv();
  if (!runtime.DB) return jsonResponse({ error: "RSVP is temporarily unavailable." }, { status: 503 });

  try {
    if (!(await checkRateLimit(runtime.DB, request, "rsvp-submit", 8, 600))) {
      return jsonResponse({ error: "Please wait a few minutes before trying again." }, { status: 429 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "We could not read that response." }, { status: 400 });
    }
    const parsed = rsvpSchema.safeParse(body);
    if (!parsed.success) {
      return jsonResponse(
        { error: parsed.error.issues[0]?.message ?? "Please check your response." },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const email = payload.email.toLowerCase();
    const db = getDb(runtime.DB);
    const now = new Date().toISOString();
    const values = {
      submissionId: payload.submissionId,
      fullName: payload.fullName,
      email,
      phone: payload.phone,
      attendance: payload.attendance,
      householdSize: payload.attendance === "joyfully-attending" ? payload.householdSize : 1,
      guestNames: payload.attendance === "joyfully-attending" ? payload.guestNames : "",
      selectedEvents: payload.attendance === "joyfully-attending" ? JSON.stringify(["Wedding ceremony"]) : "[]",
      mealPreference: "",
      allergies: "",
      accessibilityNeeds: payload.accessibilityNeeds,
      songRequest: "",
      note: payload.note,
      consentVersion: "wedding-privacy-v1",
      consentedAt: now,
      updatedAt: now,
    };

    if (payload.referenceCode) {
      const reference = payload.referenceCode.toUpperCase();
      if (!/^(?:[A-F0-9]{10}|[A-F0-9]{24})$/.test(reference)) {
        return jsonResponse({ error: "That confirmation reference is not valid." }, { status: 400 });
      }
      const [existing] = await db
        .select()
        .from(rsvps)
        .where(and(eq(rsvps.referenceCode, reference), eq(rsvps.email, email)))
        .limit(1);
      if (!existing) {
        return jsonResponse({ error: "We could not verify that response for updating." }, { status: 404 });
      }
      await db.update(rsvps).set(values).where(eq(rsvps.id, existing.id));
      return jsonResponse({ referenceCode: existing.referenceCode, updated: true });
    }

    const [duplicateSubmission] = await db
      .select({ referenceCode: rsvps.referenceCode })
      .from(rsvps)
      .where(eq(rsvps.submissionId, payload.submissionId))
      .limit(1);
    if (duplicateSubmission) {
      return jsonResponse({ referenceCode: duplicateSubmission.referenceCode, updated: false });
    }

    const [existingEmail] = await db
      .select({ id: rsvps.id })
      .from(rsvps)
      .where(eq(rsvps.email, email))
      .limit(1);
    if (existingEmail) {
      return jsonResponse(
        { error: "A response already exists for this email. Use your private reference to update it." },
        { status: 409 },
      );
    }

    const referenceCode = createPrivateReference();
    try {
      await db.insert(rsvps).values({ referenceCode, ...values });
    } catch (insertError) {
      const [duplicate] = await db
        .select({ referenceCode: rsvps.referenceCode })
        .from(rsvps)
        .where(eq(rsvps.submissionId, payload.submissionId))
        .limit(1);
      if (duplicate) return jsonResponse({ referenceCode: duplicate.referenceCode, updated: false });
      const [emailConflict] = await db
        .select({ id: rsvps.id })
        .from(rsvps)
        .where(eq(rsvps.email, email))
        .limit(1);
      if (emailConflict) {
        return jsonResponse(
          { error: "A response already exists for this email. Use your private reference to update it." },
          { status: 409 },
        );
      }
      throw insertError;
    }
    return jsonResponse({ referenceCode, updated: false }, { status: 201 });
  } catch {
    return jsonResponse({ error: "We could not save your RSVP right now. Please try again." }, { status: 500 });
  }
}
