import type { DesignTierId, StudioBrief } from "../app/platform-data";

export const DRAFT_KEY = "kingsperl-planning-draft-v1";
export const CHECKLIST_KEY = "kingsperl-planning-checklist-v1";
export type PlanningDraft = { version: 1; brief: StudioBrief; tierId: DesignTierId; section: string; updatedAt: string; savedReference: string };

const text = (value: unknown, max = 240) => typeof value === "string" ? value.slice(0, max) : "";
const number = (value: unknown, min: number, max: number, fallback: number) => typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

/** Local drafts never contain contacts, personal notes, attachments or access tokens. */
export function parsePlanningDraft(value: unknown): PlanningDraft | null {
  if (!value || typeof value !== "object") return null;
  const draft = value as Record<string, unknown>;
  if (draft.version !== 1 || !draft.brief || typeof draft.brief !== "object") return null;
  const brief = draft.brief as Record<string, unknown>;
  if (typeof brief.eventType !== "string" || !brief.eventType.trim()) return null;
  return {
    version: 1,
    brief: {
      eventType: text(brief.eventType), date: /^\d{4}-\d{2}-\d{2}$/.test(text(brief.date)) ? text(brief.date) : "",
      guests: Math.round(number(brief.guests, 2, 800, 120)), budget: number(brief.budget, 1500, 30000, 10000),
      venueId: text(brief.venueId), widthFt: number(brief.widthFt, 1, 1000, 50), lengthFt: number(brief.lengthFt, 1, 1000, 80), ceilingFt: number(brief.ceilingFt, 1, 200, 15),
      palette: text(brief.palette), atmosphere: "", culturalContext: "", accessibility: "", outdoor: brief.outdoor === true,
    },
    tierId: draft.tierId === "essential" || draft.tierId === "statement" ? draft.tierId : "signature",
    section: ["brief", "concepts", "venue", "build", "proposal", "readiness", "portal"].includes(String(draft.section)) ? String(draft.section) : "brief",
    updatedAt: Number.isFinite(Date.parse(text(draft.updatedAt))) ? text(draft.updatedAt) : "",
    savedReference: /^TGP-[a-f0-9-]+$/i.test(text(draft.savedReference)) ? text(draft.savedReference) : "",
  };
}

export function makePlanningDraft(brief: StudioBrief, tierId: DesignTierId, section: string, savedReference = ""): PlanningDraft {
  return parsePlanningDraft({ version: 1, brief, tierId, section, savedReference, updatedAt: new Date().toISOString() })!;
}

/** Accept only our project-link format; never navigate to a pasted external URL. */
export function resumeProjectPath(input: string): string | null {
  try {
    const url = new URL(input.trim());
    if (!["https://www.kingsperl.com", "https://kingsperl.com"].includes(url.origin) || url.pathname !== "/studio") return null;
    const hash = new URLSearchParams(url.hash.slice(1));
    const project = hash.get("project") ?? "";
    const token = hash.get("token") ?? "";
    if (!/^TGP-[a-f0-9-]+$/i.test(project) || !/^[a-f0-9]{64}$/i.test(token)) return null;
    return `/studio#${new URLSearchParams({ project, token }).toString()}`;
  } catch { return null; }
}

export function planningCalendar(brief: Pick<StudioBrief, "date" | "eventType">): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(brief.date)) return null;
  const date = new Date(`${brief.date}T00:00:00Z`);
  if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== brief.date) return null;
  const start = brief.date.replaceAll("-", "");
  date.setUTCDate(date.getUTCDate() + 1);
  const end = date.toISOString().slice(0, 10).replaceAll("-", "");
  const safe = brief.eventType.replace(/[\r\n]/g, " ").replace(/([\\;,])/g, "\\$1");
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Kingsperl Events//Planning//EN", "BEGIN:VEVENT", `UID:planning-${start}@kingsperl.com`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`, `DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`, `SUMMARY:Planning reminder - ${safe}`, "DESCRIPTION:Personal planning reminder only. Kingsperl Events has not reserved this date. Availability and scope require confirmation.", "STATUS:TENTATIVE", "TRANSP:TRANSPARENT", "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
}
