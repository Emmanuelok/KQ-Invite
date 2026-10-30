import assert from "node:assert/strict";
import test from "node:test";
import { parsePlanningDraft, resumeProjectPath, planningCalendar } from "../lib/planning-draft.ts";

const brief = { eventType: "Birthday", date: "2028-02-29", guests: 70, budget: 9000, venueId: "custom", widthFt: 40, lengthFt: 60, ceilingFt: 12, palette: "Sage", atmosphere: "Private notes", culturalContext: "Private notes", accessibility: "Private notes", outdoor: false };
test("local planning drafts retain essential details without contacts, private notes or access keys", () => {
  const draft = parsePlanningDraft({ version: 1, brief: { ...brief, email: "private@example.com" }, tierId: "essential", section: "build", updatedAt: "2026-10-30T12:00:00Z", token: "sensitive-secret" });
  assert.equal(draft.brief.guests, 70);
  assert.equal(draft.tierId, "essential");
  assert.equal(draft.section, "build");
  assert.equal(draft.brief.culturalContext, "");
  assert.equal(draft.brief.accessibility, "");
  assert.equal(draft.brief.atmosphere, "");
  assert.ok(!JSON.stringify(draft).includes("private@example.com"));
  assert.ok(!JSON.stringify(draft).includes("sensitive-secret"));
});
test("invalid storage cannot create an unsafe or unbounded draft", () => {
  assert.equal(parsePlanningDraft({ version: 9, brief }), null);
  assert.equal(parsePlanningDraft(null), null);
  const draft = parsePlanningDraft({ version: 1, brief: { ...brief, guests: Infinity, budget: -100 }, tierId: "bad", section: "javascript:bad" });
  assert.equal(draft.brief.guests, 120);
  assert.equal(draft.brief.budget, 1500);
  assert.equal(draft.tierId, "signature");
  assert.equal(draft.section, "brief");
});
test("private project handoff accepts only a complete Kingsperl project URL", () => {
  const token = "a".repeat(64);
  const path = resumeProjectPath(`https://www.kingsperl.com/studio#project=TGP-ABC123&token=${token}`);
  assert.equal(path, `/studio#project=TGP-ABC123&token=${token}`);
  assert.equal(resumeProjectPath(`https://evil.example/studio#project=TGP-ABC123&token=${token}`), null);
  assert.equal(resumeProjectPath("https://www.kingsperl.com/studio#project=TGP-ABC123"), null);
  assert.equal(resumeProjectPath(`https://www.kingsperl.com@evil.example/studio#project=TGP-ABC123&token=${token}`), null);
});
test("calendar reminders validate dates, escape content and remain tentative", () => {
  const content = planningCalendar({ date: "2028-02-29", eventType: "Party\r\nSTATUS:CONFIRMED" });
  assert.ok(content.includes("DTSTART;VALUE=DATE:20280229"));
  assert.ok(content.includes("DTEND;VALUE=DATE:20280301"));
  assert.ok(content.includes("STATUS:TENTATIVE"));
  assert.ok(content.includes("TRANSP:TRANSPARENT"));
  assert.ok(!content.includes("\r\nSTATUS:CONFIRMED"));
  assert.equal(planningCalendar({ date: "2026-02-30", eventType: "Party" }), null);
});
