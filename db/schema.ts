import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const rsvps = sqliteTable(
  "rsvps",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    referenceCode: text("reference_code").notNull(),
    submissionId: text("submission_id"),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull().default(""),
    attendance: text("attendance").notNull(),
    householdSize: integer("household_size").notNull().default(1),
    guestNames: text("guest_names").notNull().default(""),
    selectedEvents: text("selected_events").notNull().default("[]"),
    mealPreference: text("meal_preference").notNull().default(""),
    allergies: text("allergies").notNull().default(""),
    accessibilityNeeds: text("accessibility_needs").notNull().default(""),
    songRequest: text("song_request").notNull().default(""),
    note: text("note").notNull().default(""),
    consentVersion: text("consent_version").notNull().default("wedding-privacy-v1"),
    consentedAt: text("consented_at").notNull().default(""),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("rsvps_email_unique")
      .on(table.email)
      .where(sql`${table.email} <> ''`),
    uniqueIndex("rsvps_reference_code_unique").on(table.referenceCode),
    uniqueIndex("rsvps_submission_id_unique").on(table.submissionId),
  ],
);

export const giftReservations = sqliteTable(
  "gift_reservations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    privateReference: text("private_reference").notNull(),
    guestName: text("guest_name").notNull(),
    contactDetail: text("contact_detail").notNull(),
    preferredReplyMethod: text("preferred_reply_method").notNull(),
    requestType: text("request_type").notNull(),
    giftKey: text("gift_key").notNull(),
    giftLabel: text("gift_label").notNull(),
    status: text("status").notNull().default("requested"),
    note: text("note").notNull().default(""),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("gift_reservations_private_reference_unique").on(
      table.privateReference,
    ),
    uniqueIndex("gift_reservations_active_keepsake_unique")
      .on(table.giftKey)
      .where(
        sql`${table.requestType} = 'reserve-gift' AND ${table.status} <> 'released'`,
      ),
  ],
);

export const submissionRateLimits = sqliteTable("submission_rate_limits", {
  key: text("key").primaryKey(),
  attempts: integer("attempts").notNull().default(1),
  windowStartedAt: text("window_started_at").notNull(),
});
