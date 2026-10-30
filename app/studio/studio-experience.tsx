"use client";

import { UIIcon } from "../ui-icon";


import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { BrandLockup } from "../brand";
import {
  buildLines,
  defaultBrief,
  designTiers,
  money,
  quoteFor,
  readinessFor,
  venueProfiles,
  type BuildLine,
  type DesignTierId,
  type QuoteSummary,
  type ReadinessTask,
  type StudioBrief,
} from "../platform-data";
import styles from "./studio.module.css";
import { DRAFT_KEY, makePlanningDraft, parsePlanningDraft } from "../../lib/planning-draft";

type SectionId = "brief" | "concepts" | "venue" | "build" | "proposal" | "readiness" | "portal";
type SaveState = "idle" | "saving" | "saved" | "error";
type ResumeProject = {
  publicId: string;
  status: string;
  version: number;
  contactName: string;
  contactEmail: string;
  brief: StudioBrief;
  tierId: DesignTierId;
  clientAcknowledgement: { name?: string } | null;
  selectedFilenamesNotUploaded: string[];
  buildLines: BuildLine[];
  quote: QuoteSummary;
  readiness: ReadinessTask[];
  changes: Array<{ publicId: string; zone: string; request: string; status: string }>;
};

type SavedPlanSnapshot = Pick<ResumeProject, "buildLines" | "quote" | "readiness">;

const sections: Array<{ id: SectionId; label: string; number: string }> = [
  { id: "brief", label: "Event brief", number: "01" },
  { id: "concepts", label: "Design directions", number: "02" },
  { id: "venue", label: "Venue & layout", number: "03" },
  { id: "build", label: "Itemized plan", number: "04" },
  { id: "proposal", label: "Budget & proposal", number: "05" },
  { id: "readiness", label: "Readiness", number: "06" },
  { id: "portal", label: "Saved project", number: "07" },
];

const eventOptions = [
  "Wedding reception",
  "Engagement celebration",
  "Milestone birthday",
  "Baby shower",
  "Gala or awards dinner",
  "Conference or convention",
  "Corporate reception",
  "Graduation celebration",
  "Ghanaian or West African diaspora celebration",
  "Faith or community gathering",
  "Holiday social",
  "Private dinner",
];

const paletteOptions = [
  "Atlantic ink · shell · brass",
  "Clay rose · linen · sage",
  "Emerald · oxblood · warm brass",
  "Winter white · chrome · ice blue",
  "Cobalt · citrus · soft ivory",
  "Host-led cultural palette",
];

export type StudioPrefill = {
  event?: string;
  style?: string;
  looks?: string[];
  venue?: string;
  guests?: number;
  budget?: number;
};

const initialBriefFrom = (prefill?: StudioPrefill): StudioBrief => {
  if (!prefill) return defaultBrief;
  const venueSignal = prefill.venue?.trim();
  const customVenue = venueProfiles.find((candidate) => candidate.id === "custom")!;
  const looks = (prefill.looks ?? []).map((item) => item.trim()).filter(Boolean).slice(0, 12);
  return {
    ...defaultBrief,
    eventType: prefill.event?.trim() || defaultBrief.eventType,
    guests: Math.min(800, Math.max(2, Math.round(prefill.guests || defaultBrief.guests))),
    budget: Math.min(30_000, Math.max(1_500, Math.round(prefill.budget || defaultBrief.budget))),
    venueId: venueSignal ? "custom" : defaultBrief.venueId,
    widthFt: venueSignal ? customVenue.widthFt : defaultBrief.widthFt,
    lengthFt: venueSignal ? customVenue.lengthFt : defaultBrief.lengthFt,
    ceilingFt: venueSignal ? customVenue.ceilingFt : defaultBrief.ceilingFt,
    atmosphere: [
      prefill.style?.trim() ? `Adapt the ${prefill.style.trim()} visual direction` : "",
      looks.length ? `reconcile saved signals: ${looks.join(", ")}` : "",
      venueSignal ? `for the venue context: ${venueSignal}` : "",
    ].filter(Boolean).join("; ") || defaultBrief.atmosphere,
  };
};

const statusClass = (status: string) => {
  if (status === "Available" || status === "Ready") return styles.good;
  if (status === "Limited" || status === "Review") return styles.warn;
  return styles.risk;
};

export default function StudioExperience({ prefill }: { prefill?: StudioPrefill }) {
  const [section, setSection] = useState<SectionId>("brief");
  const [draftReady, setDraftReady] = useState(false);
  const [localSaveStatus, setLocalSaveStatus] = useState("");
  const [brief, setBrief] = useState<StudioBrief>(() => initialBriefFrom(prefill));
  const [tierId, setTierId] = useState<DesignTierId>("signature");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [projectReference, setProjectReference] = useState("");
  const [projectEditToken, setProjectEditToken] = useState("");
  const [approved, setApproved] = useState(false);
  const [approvalName, setApprovalName] = useState("");
  const [approvalChecked, setApprovalChecked] = useState(false);
  const [changes, setChanges] = useState<Array<{ id: string; zone: string; request: string; status: string }>>([]);
  const [changeZone, setChangeZone] = useState("Dining");
  const [changeRequest, setChangeRequest] = useState("");
  const [changeSubmitting, setChangeSubmitting] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");
  const [savedPlanSnapshot, setSavedPlanSnapshot] = useState<SavedPlanSnapshot | null>(null);

  const tier = designTiers.find((candidate) => candidate.id === tierId) ?? designTiers[1];
  const visibleEventOptions = eventOptions.includes(brief.eventType) ? eventOptions : [brief.eventType, ...eventOptions];
  const venue = venueProfiles.find((candidate) => candidate.id === brief.venueId) ?? venueProfiles[0];
  const calculatedBuildLines = useMemo(() => buildLines(tier, brief.guests), [tier, brief.guests]);
  const calculatedQuote = useMemo(() => quoteFor(tier, calculatedBuildLines, brief), [tier, calculatedBuildLines, brief]);
  const calculatedReadiness = useMemo(() => readinessFor(brief, venue, calculatedBuildLines), [brief, venue, calculatedBuildLines]);
  const buildLinesForTier = savedPlanSnapshot?.buildLines ?? calculatedBuildLines;
  const quote = savedPlanSnapshot?.quote ?? calculatedQuote;
  const readiness = savedPlanSnapshot?.readiness ?? calculatedReadiness;
  const readinessComplete = readiness.filter((task) => task.status === "Ready").length;
  const roomArea = Math.max(1, brief.widthFt * brief.lengthFt);
  const areaPerGuest = roomArea / Math.max(1, brief.guests);
  const roomFit = areaPerGuest >= 14 ? "Comfortable" : areaPerGuest >= 10 ? "Tight but workable" : "Designer review required";

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const publicId = hashParams.get("project")?.trim();
    const editToken = hashParams.get("token")?.trim();
    if (!publicId && !editToken) return;
    if (!publicId || !editToken) {
      const incompleteFrame = window.requestAnimationFrame(() => {
        setSaveState("error");
        setSaveMessage("This resume link is incomplete. Use the full private link created by Kingsperl Events or start a new project.");
      });
      return () => window.cancelAnimationFrame(incompleteFrame);
    }

    const restoreProject = async () => {
      setResumeMessage("Restoring your secure project…");
      setSaveMessage("Restoring your secure saved snapshot…");
      try {
        const response = await fetch(`/api/projects/${encodeURIComponent(publicId)}`, {
          headers: { "x-kingsperl-project-token": editToken },
          cache: "no-store",
        });
        const payload = await response.json() as { data?: ResumeProject; error?: { message?: string } };
        if (!response.ok || !payload.data) throw new Error(payload.error?.message || "This project could not be restored.");
        const restored = payload.data;
        setProjectReference(restored.publicId);
        setProjectEditToken(editToken);
        setContactName(restored.contactName);
        setContactEmail(restored.contactEmail);
        setBrief(restored.brief);
        setTierId(designTiers.some((candidate) => candidate.id === restored.tierId) ? restored.tierId : "signature");
        setAttachments(restored.selectedFilenamesNotUploaded ?? []);
        setApprovalName(restored.clientAcknowledgement?.name ?? "");
        setApprovalChecked(Boolean(restored.clientAcknowledgement));
        setApproved(Boolean(restored.clientAcknowledgement));
        setSavedPlanSnapshot({ buildLines: restored.buildLines, quote: restored.quote, readiness: restored.readiness });
        setChanges((restored.changes ?? []).map((change) => ({
          id: change.publicId,
          zone: change.zone,
          request: change.request,
          status: change.status === "requested" ? "Requested" : change.status,
        })));
        setSaveState("saved");
        setSection("portal");
        setResumeMessage(`Secure project restored · version ${restored.version}`);
        setSaveMessage(`Secure project restored · version ${restored.version} · saved quantities, estimate and readiness preserved`);
      } catch (error) {
        setSaveState("error");
        const message = error instanceof Error ? error.message : "This project could not be restored.";
        setResumeMessage(message);
        setSaveMessage(message);
      }
    };

    const frame = window.requestAnimationFrame(() => void restoreProject());
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const hasPrefill = Boolean(prefill?.event || prefill?.style || prefill?.looks?.length || prefill?.venue || prefill?.guests || prefill?.budget);
      if (!window.location.hash.includes("project=") && !hasPrefill && new URLSearchParams(window.location.search).get("new") !== "1") {
        try {
          const saved = parsePlanningDraft(JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null"));
          if (saved) {
            setBrief({ ...saved.brief, atmosphere: defaultBrief.atmosphere, accessibility: defaultBrief.accessibility });
            setTierId(saved.tierId);
            setSection(saved.section as SectionId);
          }
        } catch { /* A restricted browser can still use the studio. */ }
      }
      setDraftReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [prefill]);

  useEffect(() => {
    if (!draftReady || (window.location.hash.includes("project=") && !projectReference)) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(makePlanningDraft(brief, tierId, section, projectReference)));
      setLocalSaveStatus("Essential details saved on this device");
    } catch { setLocalSaveStatus("Local saving unavailable in this browser"); }
  }, [brief, tierId, section, projectReference, draftReady]);

  const invalidateAcknowledgement = () => {
    setApproved(false);
    setApprovalChecked(false);
  };

  const markWorkingCopyChanged = () => {
    if (saveState === "saved") {
      setSaveState("idle");
      setSaveMessage("Working changes are not saved. Review and acknowledge this exact version again before requesting a contract.");
    }
  };

  const updateBrief = <K extends keyof StudioBrief>(key: K, value: StudioBrief[K]) => {
    setBrief((current) => ({ ...current, [key]: value }));
    setSavedPlanSnapshot(null);
    invalidateAcknowledgement();
    markWorkingCopyChanged();
  };

  const chooseVenue = (id: string) => {
    const next = venueProfiles.find((candidate) => candidate.id === id);
    if (!next) return;
    setSavedPlanSnapshot(null);
    invalidateAcknowledgement();
    markWorkingCopyChanged();
    setBrief((current) => ({
      ...current,
      venueId: next.id,
      widthFt: next.widthFt,
      lengthFt: next.lengthFt,
      ceilingFt: next.ceilingFt,
      outdoor: next.weatherExposure === "Outdoor",
    }));
  };

  const chooseTier = (id: DesignTierId) => {
    if (id !== tierId) {
      setTierId(id);
      setSavedPlanSnapshot(null);
      invalidateAcknowledgement();
      markWorkingCopyChanged();
    }
    setSection("build");
  };

  const updateContactName = (value: string) => {
    setContactName(value);
    invalidateAcknowledgement();
    markWorkingCopyChanged();
  };

  const updateContactEmail = (value: string) => {
    setContactEmail(value);
    invalidateAcknowledgement();
    markWorkingCopyChanged();
  };

  const selectAttachments = (filenames: string[]) => {
    setAttachments(filenames);
    invalidateAcknowledgement();
    markWorkingCopyChanged();
  };

  const saveProject = async (status = "draft") => {
    if (!contactName.trim() || !/^\S+@\S+\.\S+$/.test(contactEmail.trim())) {
      setSaveState("error");
      setSaveMessage("Add your name and a valid email in the Event brief before saving.");
      setSection("brief");
      return null;
    }
    setSaveState("saving");
    setSaveMessage("");
    const displayedTotal = quote.total;
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contactName,
          contactEmail,
          status,
          brief,
          tierId,
          venue: { id: venue.id, name: venue.name, room: venue.room, status: venue.status },
          buildLines: buildLinesForTier,
          quote,
          readiness,
          attachments,
          approval: status === "design_approved" ? { name: approvalName, recordedAt: new Date().toISOString() } : null,
        }),
      });
      const payload = await response.json() as { data?: { publicId: string; editToken: string; snapshot: SavedPlanSnapshot }; error?: { message?: string } };
      if (!response.ok || !payload.data?.publicId) throw new Error(payload.error?.message || "The project could not be saved.");
      setProjectReference(payload.data.publicId);
      setProjectEditToken(payload.data.editToken);
      const secureFragment = new URLSearchParams({ project: payload.data.publicId, token: payload.data.editToken });
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${secureFragment.toString()}`);
      setSavedPlanSnapshot(payload.data.snapshot);
      if (status !== "design_approved") invalidateAcknowledgement();
      setSaveState("saved");
      const catalogueChanged = Math.round(displayedTotal * 100) !== Math.round(payload.data.snapshot.quote.total * 100);
      setSaveMessage(status === "design_approved"
        ? "Direction acknowledgement recorded for designer feasibility review."
        : catalogueChanged
          ? "Fresh snapshot saved with the current catalogue and pricing. Review the updated build before acknowledging it."
          : "Project snapshot saved securely.");
      return payload.data.publicId;
    } catch (error) {
      setSaveState("error");
      setSaveMessage(error instanceof Error ? error.message : "The project could not be saved.");
      return null;
    }
  };

  const copyResumeLink = async () => {
    if (!projectReference || !projectEditToken) return;
    const secureFragment = new URLSearchParams({ project: projectReference, token: projectEditToken });
    const secureUrl = `${window.location.origin}${window.location.pathname}${window.location.search}#${secureFragment.toString()}`;
    try {
      await navigator.clipboard.writeText(secureUrl);
      setResumeMessage("Secure resume link copied. Store it privately—anyone with this link can view or request changes to this project.");
    } catch {
      setResumeMessage("Copy the current browser address to keep your secure resume link. Store it privately.");
    }
  };

  const approveProposal = async () => {
    if (!approvalName.trim() || !approvalChecked) {
      setSaveState("error");
      setSaveMessage("Enter the approver name and confirm the design acknowledgement.");
      return;
    }
    const reference = await saveProject("design_approved");
    if (reference) {
      setApproved(true);
      setSection("portal");
    }
  };

  const submitChange = async (event: FormEvent) => {
    event.preventDefault();
    if (!changeRequest.trim()) return;
    if (!projectReference || !projectEditToken) {
      setSaveState("error");
      setSaveMessage("Save the project before submitting a formal change request.");
      return;
    }
    const temporaryId = `pending-${Date.now()}`;
    const requestedChange = changeRequest.trim();
    setChangeSubmitting(true);
    setChanges((current) => [
      ...current,
      { id: temporaryId, zone: changeZone, request: requestedChange, status: "Saving…" },
    ]);
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(projectReference)}/change-orders`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-kingsperl-project-token": projectEditToken },
        body: JSON.stringify({ zone: changeZone, request: requestedChange, requestedByName: approvalName || contactName }),
      });
      const payload = await response.json() as { data?: { publicId: string; status: string }; error?: { message?: string } };
      if (!response.ok || !payload.data) throw new Error(payload.error?.message || "The change request could not be saved.");
      setChanges((current) => current.map((change) => change.id === temporaryId ? { ...change, id: payload.data!.publicId, status: "Requested" } : change));
      setChangeRequest("");
      setSaveState("saved");
      setSaveMessage("Change request recorded. Scope and price remain unchanged until review and explicit approval.");
    } catch (error) {
      setChanges((current) => current.map((change) => change.id === temporaryId ? { ...change, status: "Not saved" } : change));
      setSaveState("error");
      setSaveMessage(error instanceof Error ? error.message : "The change request could not be saved.");
    } finally {
      setChangeSubmitting(false);
    }
  };

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <Link className={`brand ${styles.brand}`} href="/" aria-label="Kingsperl Events home"><BrandLockup /></Link>
        <nav aria-label="Studio navigation">
          <Link href="/events">Event World</Link>
          <Link href="/my-event">My event</Link>
          <Link href="/">Home</Link>
        </nav>
        <div className={styles.headerActions}>
          <button type="button" className={styles.printButton} onClick={() => window.print()}>Print plan</button>
          {projectReference && <span className={styles.reference}>{projectReference}</span>}
          <button className={styles.saveButton} type="button" onClick={() => void saveProject("draft")} disabled={saveState === "saving"}>
            {saveState === "saving" ? "Saving…" : projectReference ? "Save updated plan" : "Save project"}
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarIntro}>
            <span>Design-to-delivery</span>
            <strong>{brief.eventType}</strong>
            <small>{brief.date || "Date undecided"} · {brief.guests} guests</small>
          </div>
          <nav aria-label="Project sections">
            {sections.map((item) => (
              <button key={item.id} type="button" aria-current={section === item.id ? "step" : undefined} className={section === item.id ? styles.activeNav : ""} onClick={() => setSection(item.id)}>
                <span>{item.number}</span>{item.label}
                {item.id === "build" && <i>{buildLinesForTier.length}</i>}
                {item.id === "readiness" && <i>{readiness.length - readinessComplete}</i>}
              </button>
            ))}
          </nav>
          <div className={styles.sidebarProof}>
            <span className={styles.liveDot} />
            <div><strong>Catalogue planning</strong><small>Availability confirmed by the team</small></div>
          </div>
        </aside>

        <section className={styles.content} id="main-content" tabIndex={-1}>
          <p className={styles.srOnly} aria-live="polite">{sections.find((item) => item.id === section)?.label} section selected.</p>
          <div className={styles.contentHeader}>
            <div>
              <p>KINGSPERL DESIGN STUDIO</p>
              <h1>{sections.find((item) => item.id === section)?.label}</h1>
            </div>
            <div className={styles.projectHealth}>
              <span><i className={statusClass(roomFit === "Designer review required" ? "Review" : "Ready")} />Room fit<strong>{roomFit}</strong></span>
              <span><i className={statusClass(readinessComplete >= 4 ? "Ready" : "Review")} />Readiness<strong>{readinessComplete}/{readiness.length} ready</strong></span>
            </div>
          </div>

          <div className={styles.draftStatus} role="status"><span aria-hidden="true">✓</span>{localSaveStatus || "Preparing your planning space"}<a href="/my-event">My event workspace <UIIcon name="arrow-right" /></a></div>

          {saveMessage && <div className={`${styles.notice} ${saveState === "error" ? styles.noticeError : ""}`} role="status">{saveMessage}</div>}

          {section === "brief" && (
            <div className={styles.sectionStack}>
              <div className={styles.sectionLead}>
                <p>01 · The gathering</p>
                <h2>A few details. A world of possibilities.</h2>
                <span>Tell us about your occasion. We’ll use these details to shape the scope, quantities and planning estimate.</span>
              </div>
              <div className={styles.formGrid}>
                <label>Occasion<select value={brief.eventType} onChange={(event) => updateBrief("eventType", event.target.value)}>{visibleEventOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label>Event date<input type="date" value={brief.date} onChange={(event) => updateBrief("date", event.target.value)} /></label>
                <label>Guest count<input type="number" min="2" max="800" step="1" value={brief.guests} onChange={(event) => updateBrief("guests", Math.min(800, Math.max(2, Math.round(Number(event.target.value) || 2))))} /></label>
                <label>Working budget<span className={styles.rangeValue}>{money(brief.budget)}</span><input className={styles.range} type="range" min="1500" max="30000" step="250" value={brief.budget} onChange={(event) => updateBrief("budget", Number(event.target.value))} /></label>
                <label>Palette<select value={brief.palette} onChange={(event) => updateBrief("palette", event.target.value)}>{paletteOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label>Atmosphere<input value={brief.atmosphere} onChange={(event) => updateBrief("atmosphere", event.target.value)} /></label>
                <label className={styles.wideField}>Cultural, faith or family context<textarea rows={3} value={brief.culturalContext} onChange={(event) => updateBrief("culturalContext", event.target.value)} placeholder="Country, region, protocol, host-approved symbols, language or ceremonial timing. We never infer identity from the occasion." /></label>
                <label className={styles.wideField}>Accessibility and guest-comfort priorities<textarea rows={3} value={brief.accessibility} onChange={(event) => updateBrief("accessibility", event.target.value)} placeholder="Step-free arrival, companion seating, quiet area, viewing heights, stage access…" /></label>
                <label>Your name<input value={contactName} onChange={(event) => updateContactName(event.target.value)} autoComplete="name" placeholder="Name for the project record" /></label>
                <label>Email<input type="email" value={contactEmail} onChange={(event) => updateContactEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" /></label>
              </div>
              <label className={styles.checkLine}><input type="checkbox" checked={brief.outdoor} onChange={(event) => updateBrief("outdoor", event.target.checked)} /><span><strong>Outdoor or materially weather-exposed installation</strong><small>Activates wind, rain, ballast, power and fallback controls.</small></span></label>
              <div className={styles.actionRow}><button type="button" className={styles.primaryAction} onClick={() => setSection("concepts")}>Explore three design scopes <span>→</span></button></div>
            </div>
          )}

          {section === "concepts" && (
            <div className={styles.sectionStack}>
              <div className={styles.sectionLead}>
                <p>02 · Find your direction</p>
                <h2>Choose the feeling. Understand the scope.</h2>
                <span>These are planning concepts—not photographs of completed Kingsperl Events client work.</span>
              </div>
              <div className={styles.tierGrid}>
                {designTiers.map((candidate) => {
                  const candidateLines = buildLines(candidate, brief.guests);
                  const candidateQuote = quoteFor(candidate, candidateLines, brief);
                  return (
                    <article key={candidate.id} className={`${styles.tierCard} ${tierId === candidate.id ? styles.selectedTier : ""}`}>
                      <div className={styles.tierImage}>
                        <Image unoptimized src={candidate.image} alt={candidate.imageAlt} width={1536} height={1024} sizes="(max-width: 760px) 100vw, 31vw" />
                        <span>Concept render · {candidate.name}</span>
                      </div>
                      <div className={styles.tierBody}>
                        <p>{candidate.promise}</p>
                        <h3>{candidate.name}</h3>
                        <div className={styles.tierPrice}><strong>{money(candidateQuote.total)}</strong><span>estimated with HST</span></div>
                        <p className={styles.tierCopy}>{candidate.scope}</p>
                        <ul>{candidate.zones.map((zone) => <li key={zone}>{zone}</li>)}</ul>
                        <div className={styles.tierMeta}><span>{candidateLines.length} lines</span><span>Availability review</span><span>{candidate.installHours}h install</span></div>
                        <button type="button" onClick={() => chooseTier(candidate.id)}>{tierId === candidate.id ? "Selected · inspect build" : `Choose ${candidate.name}`}</button>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div className={styles.budgetSignal}>
                <div><span>Current working budget</span><strong>{money(brief.budget)}</strong></div>
                <div><span>{tier.name} estimate</span><strong>{money(quote.total)}</strong></div>
                <p className={quote.total <= brief.budget ? styles.onBudget : styles.overBudget}>{quote.total <= brief.budget ? `${money(brief.budget - quote.total)} remains for optional refinements.` : `${money(quote.total - brief.budget)} above brief—open the build to protect the highest-impact zones.`}</p>
              </div>
            </div>
          )}

          {section === "venue" && (
            <div className={styles.sectionStack}>
              <div className={styles.sectionLead}>
                <p>03 · Venue intelligence</p>
                <h2>Plan against the room—not an imaginary canvas.</h2>
                <span>Planning references remain visibly unverified until a measured survey is approved.</span>
              </div>
              <div className={styles.venueGrid}>
                <div className={styles.venueControls}>
                  <label>Venue profile<select value={brief.venueId} onChange={(event) => chooseVenue(event.target.value)}>{venueProfiles.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.room}</option>)}</select></label>
                  <div className={styles.dimensionGrid}>
                    <label>Width<input type="number" min="10" max="300" value={brief.widthFt} onChange={(event) => updateBrief("widthFt", Math.max(10, Number(event.target.value) || 10))} /><span>ft</span></label>
                    <label>Length<input type="number" min="10" max="500" value={brief.lengthFt} onChange={(event) => updateBrief("lengthFt", Math.max(10, Number(event.target.value) || 10))} /><span>ft</span></label>
                    <label>Ceiling<input type="number" min="7" max="80" value={brief.ceilingFt} onChange={(event) => updateBrief("ceilingFt", Math.max(7, Number(event.target.value) || 7))} /><span>ft</span></label>
                  </div>
                  <div className={styles.venueFacts}>
                    <span><small>Record status</small><strong>{venue.status}</strong></span>
                    <span><small>Reference capacity</small><strong>{venue.capacity} · confirm</strong></span>
                    <span><small>Area per guest</small><strong>{areaPerGuest.toFixed(1)} sq ft</strong></span>
                    <span><small>Exposure</small><strong>{venue.weatherExposure}</strong></span>
                  </div>
                <label className={styles.uploadField}>Floor plan or venue photographs<input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" multiple onChange={(event) => selectAttachments(Array.from(event.target.files ?? []).map((file) => file.name))} /><span>{attachments.length ? `${attachments.length} filename${attachments.length === 1 ? "" : "s"} selected in this working session—not uploaded` : "Choose PDF, JPG, PNG or WebP references"}</span><small>Only selected filenames enter the snapshot. No file content is uploaded until secure storage is connected.</small></label>
                </div>
                <div className={styles.floorPlanPanel}>
                  <div className={styles.planHeading}><span>Live planning diagram</span><strong>{brief.widthFt} × {brief.lengthFt} ft</strong></div>
                  <div className={styles.floorPlan} style={{ aspectRatio: `${Math.max(1, brief.lengthFt)} / ${Math.max(1, brief.widthFt)}` }}>
                    <div className={styles.planStage}>FOCAL ZONE</div>
                    <div className={styles.planTables}>{Array.from({ length: Math.min(16, Math.ceil(brief.guests / 8)) }, (_, index) => <i key={index} aria-hidden="true" />)}</div>
                    <div className={styles.planRoute}>STEP-FREE ROUTE</div>
                    <div className={styles.planDoor}>LOAD-IN</div>
                  </div>
                  <p>Conceptual circulation study only. Final egress, occupancy, stage, service and accessible-route dimensions require venue approval.</p>
                </div>
              </div>
              <div className={styles.constraintGrid}>
                <article><span>Access + load-in</span><p>{venue.access}</p><small>{venue.loadIn}</small></article>
                <article><span>Power</span><p>{venue.power}</p><small>Temporary-power inspection readiness is tracked separately.</small></article>
                <article><span>Restrictions</span><ul>{venue.restrictions.map((item) => <li key={item}>{item}</li>)}</ul></article>
                <article><span>Accessible journey</span><ul>{venue.accessibility.map((item) => <li key={item}>{item}</li>)}</ul></article>
              </div>
            </div>
          )}

          {section === "build" && (
            <div className={styles.sectionStack}>
              <div className={styles.sectionLead}>
                <p>04 · Photo-specific build sheet</p>
                <h2>{tier.name} scope for {brief.guests} guests.</h2>
                <span>Stable SKUs, exact quantities, measurements, zones and substitutions—never a generic schedule copied across photographs. Availability is provisional until a date-window hold is confirmed.</span>
              </div>
              <div className={styles.buildSummary}>
                <div><span>Specified lines</span><strong>{buildLinesForTier.length}</strong></div>
                <div><span>Availability</span><strong>By review</strong></div>
                <div><span>Install crew</span><strong>{tier.crewSize} people</strong></div>
                <div><span>Estimated install</span><strong>{tier.installHours} hours</strong></div>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.buildTable}>
                  <thead><tr><th>Item / SKU</th><th>Zone</th><th>Measurement</th><th>Qty</th><th>Availability</th><th>Extended</th></tr></thead>
                  <tbody>{buildLinesForTier.map((line) => (
                    <tr key={`${line.sku}-${line.zone}`}>
                      <td data-label="Item"><strong>{line.name}</strong><small>{line.sku} · {line.category}</small><em>{line.note}</em></td>
                      <td data-label="Zone">{line.zone}</td>
                      <td data-label="Measurement">{line.dimensions}</td>
                      <td data-label="Quantity"><strong>{line.quantity}</strong> {line.unit}{line.quantity === 1 ? "" : "s"}</td>
                      <td data-label="Availability"><span className={`${styles.statusPill} ${statusClass(line.availability)}`}>{line.availability}</span><small>Team confirmation required{line.substitute ? ` · Alternative: ${line.substitute}` : ""}</small></td>
                      <td data-label="Extended"><strong>{money(line.total)}</strong><small>{money(line.rate)} / {line.unit}</small></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <div className={styles.actionRow}><button type="button" className={styles.secondaryAction} onClick={() => setSection("concepts")}>Compare scopes</button><button type="button" className={styles.primaryAction} onClick={() => setSection("proposal")}>Build proposal <span>→</span></button></div>
            </div>
          )}

          {section === "proposal" && (
            <div className={styles.sectionStack}>
              <div className={styles.sectionLead}>
                <p>05 · Transparent proposal</p>
                <h2>One scope, one price story, no hidden arithmetic.</h2>
                <span>This planning proposal requires designer feasibility review before a formal contract or payment link is issued.</span>
              </div>
              <div className={styles.proposalGrid}>
                <article className={styles.proposalDocument}>
                  <div className={styles.proposalTop}><div><span>Planning proposal · v1</span><h3>{brief.eventType}</h3><p>{venue.name} · {brief.date} · {brief.guests} guests</p></div><strong>{tier.name}</strong></div>
                  <div className={styles.proposalScope}><span>Design promise</span><h4>{tier.promise}</h4><p>{tier.scope}</p><ul>{tier.zones.map((zone) => <li key={zone}>{zone}</li>)}</ul></div>
                  <div className={styles.quoteLines}>
                    <span><i>Catalogue rentals</i><strong>{money(quote.rentals)}</strong></span>
                    <span><i>Design development</i><strong>{money(quote.design)}</strong></span>
                    <span><i>Production labour</i><strong>{money(quote.labour)}</strong></span>
                    <span><i>Local logistics</i><strong>{money(quote.logistics)}</strong></span>
                    {quote.culturalReview > 0 && <span><i>Host-led cultural review</i><strong>{money(quote.culturalReview)}</strong></span>}
                    <span className={styles.quoteSubtotal}><i>Subtotal</i><strong>{money(quote.subtotal)}</strong></span>
                    <span><i>HST · 15%</i><strong>{money(quote.hst)}</strong></span>
                    <span className={styles.quoteTotal}><i>Estimated total</i><strong>{money(quote.total)}</strong></span>
                  </div>
                  <div className={styles.assumptions}><span>Current assumptions</span><p>Guest count and room measurements are planning inputs. Floral varieties remain seasonal. Inventory is not held until feasibility review, agreement and required deposit.</p></div>
                </article>
                <aside className={styles.approvalPanel}>
                  <p>Direction acknowledgement</p>
                  <h3>Request the formal agreement.</h3>
                  <div className={styles.paymentCards}>
                    <span><small>Deposit after contract</small><strong>{money(quote.deposit)}</strong><i>30%</i></span>
                    <span><small>Remaining milestones</small><strong>{money(quote.balance)}</strong><i>70%</i></span>
                  </div>
                  <label>Approver name<input value={approvalName} onChange={(event) => { setApprovalName(event.target.value); invalidateAcknowledgement(); markWorkingCopyChanged(); }} placeholder="Full name" /></label>
                  <label className={styles.checkLine}><input type="checkbox" checked={approvalChecked} onChange={(event) => { setApprovalChecked(event.target.checked); if (!event.target.checked) setApproved(false); }} /><span><strong>I acknowledge this exact design direction for feasibility review.</strong><small>Any change to the brief, venue, files or scope requires a new acknowledgement. This is not yet a service contract and does not reserve inventory or the date.</small></span></label>
                  <button type="button" className={styles.primaryAction} onClick={() => void approveProposal()} disabled={saveState === "saving"}>{saveState === "saving" ? "Recording…" : "Acknowledge direction & request contract"}<span>→</span></button>
                  <small>Secure payment activates only after Kingsperl Events verifies the venue, availability, schedule and final agreement.</small>
                </aside>
              </div>
            </div>
          )}

          {section === "readiness" && (
            <div className={styles.sectionStack}>
              <div className={styles.sectionLead}>
                <p>06 · Ready for the real world</p>
                <h2>Make every spectacular decision executable.</h2>
                <span>Each risk has a status, owner, due point and evidence requirement.</span>
              </div>
              <div className={styles.readinessOverview}>
                <div><strong>{readinessComplete}/{readiness.length}</strong><span>checks clear</span></div>
                <progress className={styles.readinessBar} max={readiness.length} value={readinessComplete} aria-label={`${readinessComplete} of ${readiness.length} readiness checks clear`}>{readinessComplete} of {readiness.length}</progress>
                <p>{readiness.some((task) => task.status === "Action needed") ? "The concept remains conditional until blocking venue, weather or inventory actions are resolved." : "No current blocking signals; final professional review still applies."}</p>
              </div>
              <div className={styles.readinessList}>{readiness.map((task) => (
                <article key={task.id}>
                  <div><span>{task.category}</span><h3>{task.label}</h3><p>{task.detail}</p></div>
                  <div className={styles.taskMeta}><span className={`${styles.statusPill} ${statusClass(task.status)}`}>{task.status}</span><small>Owner<strong>{task.owner}</strong></small><small>Due<strong>{task.due}</strong></small></div>
                </article>
              ))}</div>
              <div className={styles.localRules}>
                <article><span>Municipal screening</span><p>Outdoor City-property events may require a special-event application, multi-agency review and supporting plans.</p><a href="https://www.stjohns.ca/recreation-culture/events/host-an-event/" target="_blank" rel="noreferrer">Open City guidance <UIIcon name="arrow-right" /></a></article>
                <article><span>Temporary power</span><p>Power distribution, GFCI protection, cord ratings and final inspection requirements are tracked before production release.</p><a href="https://www.stjohns.ca/media/engixn3q/pr_2026-temporary-power-for-events-guide.pdf" target="_blank" rel="noreferrer">Open power guide <UIIcon name="arrow-right" /></a></article>
                <article><span>Accessibility</span><p>Arrival, circulation, seating, stage access and information barriers are reviewed as design constraints—not late add-ons.</p><a href="https://www.gov.nl.ca/sswb/accessibility-act/" target="_blank" rel="noreferrer">Open provincial framework <UIIcon name="arrow-right" /></a></article>
                <article><span>Insurance + event procedures</span><p>Liability coverage, additional-insured wording, supporting plans, vendor evidence and deadlines are tracked as dated evidence.</p><a href="https://www.stjohns.ca/media/k0zphtru/special-events-procedures.pdf" target="_blank" rel="noreferrer">Open City procedures <UIIcon name="arrow-right" /></a></article>
                <article><span>Food vendors</span><p>Temporary food operations need provincial review; the project register separates vendor claims from verified permit evidence.</p><a href="https://www.gov.nl.ca/gs/licences/env-health/food/temp/" target="_blank" rel="noreferrer">Open provincial guidance <UIIcon name="arrow-right" /></a></article>
                <article><span>Weather + fire</span><p>Weather calls, closures, parking restrictions, fire conditions and venue rules can block an otherwise beautiful outdoor plan.</p><a href="https://www.stjohns.ca/resident-services/weather-hub/" target="_blank" rel="noreferrer">Open City Weather Hub <UIIcon name="arrow-right" /></a></article>
              </div>
            </div>
          )}

          {section === "portal" && (
            <div className={styles.sectionStack}>
              <div className={styles.portalHero}>
                <div><p>My event · {projectReference || "Unsaved working project"}</p><h2>{brief.eventType}</h2><span>{venue.name} · {brief.date} · {brief.guests} guests</span></div>
                <span className={`${styles.portalStatus} ${approved ? styles.good : styles.warn}`}>{approved ? "Direction acknowledged · review pending" : "Direction awaiting acknowledgement"}</span>
              </div>
              {resumeMessage && <div className={styles.resumeNotice} role="status">{resumeMessage}</div>}
              {projectReference && projectEditToken && (
                <div className={styles.resumePanel}>
                  <div><strong>Return to this event from any device</strong><span>The private link restores this saved snapshot and its change requests. It is an access key—share it only with trusted collaborators.</span></div>
                  <button type="button" onClick={() => void copyResumeLink()}>Copy secure resume link</button>
                </div>
              )}
              <div className={styles.portalMetrics}>
                <article><span>Acknowledged direction</span><strong>{approved ? tier.name : "Not acknowledged"}</strong><small>{tier.promise}</small></article>
                <article><span>Estimated total</span><strong>{money(quote.total)}</strong><small>HST included · contract pending</small></article>
                <article><span>Readiness</span><strong>{readinessComplete}/{readiness.length} clear</strong><small>{readiness.length - readinessComplete} actions remain</small></article>
                <article><span>Next milestone</span><strong>Designer feasibility review</strong><small>Venue · inventory · schedule</small></article>
              </div>
              <div className={styles.portalColumns}>
                <article className={styles.timelinePanel}><p>Project timeline</p>{[
                  ["Event brief", projectReference ? "Saved" : "Draft", projectReference ? "Your essential brief has been saved for review." : "Your working plan has not yet been submitted to the team."],
                  ["Direction acknowledgement", approved ? "Complete" : "Waiting", approved ? `${approvalName || contactName} acknowledged the ${tier.name} direction for feasibility review.` : "Review the proposal and acknowledge the preferred direction."],
                  ["Feasibility review", "Next", "Kingsperl Events verifies venue, catalogue, crew and readiness assumptions."],
                  ["Agreement + deposit", "Locked", "Activates after review; no payment is collected from an unverified concept."],
                  ["Production release", "Locked", "BOM, pick list, crew plan and venue pack become operational."],
                ].map(([label, state, detail]) => <div key={label}><i className={state === "Complete" ? styles.good : state === "Next" ? styles.warn : ""} /><span><strong>{label}</strong><small>{detail}</small></span><em>{state}</em></div>)}</article>
                <article className={styles.changePanel}>
                  <p>Formal change requests</p>
                  <form onSubmit={submitChange}>
                    <label>Zone<select value={changeZone} onChange={(event) => setChangeZone(event.target.value)}>{tier.zones.map((zone) => <option key={zone}>{zone}</option>)}</select></label>
                    <label>Requested change<textarea rows={4} value={changeRequest} onChange={(event) => setChangeRequest(event.target.value)} placeholder="Describe what should change and what must remain protected." /></label>
                    <button type="submit" disabled={changeSubmitting}>{changeSubmitting ? "Recording request…" : "Submit for cost and availability review"}</button>
                  </form>
                  {changes.map((change) => <div className={styles.changeItem} key={change.id}><span>{change.zone}<i>{change.status}</i></span><p>{change.request}</p><small>Cost, tax, schedule and availability delta pending.</small></div>)}
                  {!changes.length && <div className={styles.emptyState}>No change orders. Messages can discuss ideas; only an approved change order changes scope.</div>}
                </article>
              </div>
            </div>
          )}
        </section>
      </div>


      <section className={styles.printSummary}>
        <p>KINGSPERL EVENTS · PLANNING SUMMARY</p><h1>{brief.eventType}</h1>
        <p>{brief.date || "Date to be confirmed"} · {brief.guests} guests · {venue.name}</p>
        <p>Design scope: {tier.name}. {projectReference ? `Saved reference: ${projectReference}` : "Working draft — not submitted."}</p>
        <table><thead><tr><th>Item</th><th>Quantity</th><th>Dimensions</th><th>Estimate</th></tr></thead><tbody>{buildLinesForTier.map(line => <tr key={line.sku}><td>{line.name}</td><td>{line.quantity} {line.unit}</td><td>{line.dimensions}</td><td>{money(line.total)}</td></tr>)}</tbody></table>
        <h2>Planning total: {money(quote.total)}</h2><p>Includes estimated HST. Final scope, availability and agreement require team confirmation.</p>
        <h2>Readiness review</h2><ul>{readiness.map(task => <li key={task.id}>{task.label}: {task.status}. {task.detail}</li>)}</ul>
        <p>kingsperl.com · This planning summary is not a reservation, contract or payment request.</p>
      </section>

      <nav className={styles.mobileNav} aria-label="Mobile studio navigation">
        {sections.map((item) => (
          <button type="button" key={item.id} aria-current={section === item.id ? "step" : undefined} className={section === item.id ? styles.activeMobile : ""} onClick={() => setSection(item.id)}><span>{item.number}</span>{item.label.replace("Event ", "")}</button>
        ))}
      </nav>
    </main>
  );
}
