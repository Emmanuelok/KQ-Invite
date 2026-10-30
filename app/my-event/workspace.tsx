"use client";

import { useEffect, useState, type FormEvent } from "react";
import SiteHeader from "../site-header";
import { venueProfiles, money } from "../platform-data";
import { DRAFT_KEY, CHECKLIST_KEY, parsePlanningDraft, planningCalendar, resumeProjectPath, type PlanningDraft } from "../../lib/planning-draft";

const steps = ["Choose a date or shortlist", "Confirm the guest count", "Shortlist a venue", "Collect your favourite looks", "Review your budget", "Request a consultation"];

export default function EventWorkspace() {
  const [draft, setDraft] = useState<PlanningDraft | null>(null);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [confirmRemoval, setConfirmRemoval] = useState(false);
  const [removedDraft, setRemovedDraft] = useState<PlanningDraft | null>(null);
  useEffect(() => {
    try {
      setDraft(parsePlanningDraft(JSON.parse(localStorage.getItem(DRAFT_KEY) ?? "null")));
      const list = JSON.parse(localStorage.getItem(CHECKLIST_KEY) ?? "[]");
      if (Array.isArray(list)) setDone(list.filter((item: unknown): item is string => typeof item === "string" && steps.includes(item)));
    } catch { /* A new or storage-restricted browser begins with an empty workspace. */ }
    setReady(true);
  }, []);
  function toggle(item: string) {
    const next = done.includes(item) ? done.filter((value) => value !== item) : [...done, item];
    setDone(next);
    try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next)); } catch { setMessage("This browser cannot save the checklist. Your changes remain available in this session."); }
  }
  function resume(event: FormEvent) {
    event.preventDefault();
    const path = resumeProjectPath(link);
    if (!path) { setMessage("Paste the complete private Kingsperl project link copied from your saved event, including the part after #."); return; }
    setLink("");
    window.location.assign(path);
  }
  function calendar() {
    const content = draft ? planningCalendar(draft.brief) : null;
    if (!content) { setMessage("Add a valid event date in the design studio before downloading a reminder."); return; }
    const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "kingsperl-planning-reminder.ics"; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Your calendar file is ready. This is a personal planning reminder, not a confirmed booking.");
  }
  function removeDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setRemovedDraft(draft); setDraft(null); setConfirmRemoval(false);
      setMessage("The draft was removed from this device. Submitted projects and their private links are unchanged.");
    } catch { setMessage("This browser could not remove the local draft. Please try again."); }
  }
  function undoRemoval() {
    if (!removedDraft) return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(removedDraft)); setDraft(removedDraft); setRemovedDraft(null); setMessage("Your local draft has been restored."); }
    catch { setMessage("This browser could not restore the draft. Please try again."); }
  }
  const venue = draft ? venueProfiles.find((v) => v.id === draft.brief.venueId) : null;
  return <main className="event-workspace-page">
    <SiteHeader />
    <section className="workspace-intro section-shell" id="main-content" tabIndex={-1}><div><p className="eyebrow">THE BEGINNING OF SOMETHING LOVELY</p><h1>Your event.<br /><em>Coming together.</em></h1><p>A little inspiration, a clear plan and everything you need for the next step.</p></div><a className="modern-button" href={draft ? "/studio?resume=draft" : "/studio"}>{draft ? "Continue my plan" : "Start an event plan"}<span aria-hidden="true">↗</span></a></section>
    <div className="workspace-grid section-shell">
      <section className="workspace-plan-panel"><div className="panel-topline"><span className="status-badge">{draft ? "DRAFT ON THIS DEVICE" : "YOUR NEXT OCCASION"}</span><span aria-hidden="true">✦</span></div>
        {!ready ? <p role="status">Opening your planning space…</p> : draft ? <><h2>{draft.brief.eventType}</h2><p className="workspace-saved-time">Saved {draft.updatedAt ? new Date(draft.updatedAt).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short" }) : "on this device"}</p><dl className="workspace-plan-facts"><div><dt>Event date</dt><dd>{draft.brief.date || "Still deciding"}</dd></div><div><dt>Guest count</dt><dd>{draft.brief.guests} people</dd></div><div><dt>Working budget</dt><dd>{money(draft.brief.budget)}</dd></div><div><dt>Design direction</dt><dd>{draft.tierId}</dd></div><div className="fact-wide"><dt>Venue reference</dt><dd>{venue?.name || "To be confirmed"}</dd></div></dl><div className="workspace-plan-actions"><a className="modern-button" href="/studio?resume=draft">Continue in the studio ↗</a><button className="modern-button secondary" onClick={calendar}>Download calendar reminder</button></div>{draft.savedReference && <p className="workspace-note">Saved project reference: <strong>{draft.savedReference}</strong>. Use your private link below to open its latest server record.</p>}</> : <><h2>A blank page.<br />A beautiful possibility.</h2><p>Start with your occasion, guest count and a comfortable budget. Your essential planning details will be saved on this device as you go.</p><a href="/studio" className="modern-button">Create my first plan ↗</a><div className="workspace-empty-art" aria-hidden="true"><span>your<br /><em>next chapter</em></span><i>✦</i></div></>}
        <p className="workspace-note">Local drafts contain essential event details only. Contact information, private notes and access keys are not saved here. A draft does not reserve a date.</p>
        {draft && <div className="local-draft-controls">{confirmRemoval ? <><p>Remove this device’s working draft? Submitted projects remain available through their private links.</p><button className="modern-button secondary" onClick={removeDraft}>Remove local draft</button><button className="modern-text-link" onClick={() => setConfirmRemoval(false)}>Keep my draft</button></> : <button className="modern-text-link" onClick={() => setConfirmRemoval(true)}>Remove this device’s draft</button>}</div>}
      </section>
      <section className="workspace-checklist"><div className="panel-topline"><p className="eyebrow">ONE STEP AT A TIME</p><span>{done.length}/{steps.length}</span></div><h2>Your planning checklist.</h2><p>Keep track of your own preparation. Your event team confirms bookings and production details separately.</p><progress max={steps.length} value={done.length} aria-label={`${done.length} of ${steps.length} personal planning tasks complete`} />{steps.map((item) => <label className="planning-check" key={item}><input type="checkbox" checked={done.includes(item)} onChange={() => toggle(item)} /><span>{item}</span></label>)}<a className="modern-text-link" href="/?inquiry=1">Let’s talk through the details ↗</a></section>
      <section className="resume-project-panel"><div><p className="eyebrow">ALREADY SAVED WITH US?</p><h2>Pick up where you left off.</h2><p>Paste your private project link to open the saved plan and its change requests. Keep that link private: it is your access key.</p></div><form onSubmit={resume}><label htmlFor="private-link">Your private Kingsperl project link</label><input id="private-link" type="password" value={link} onChange={(event) => setLink(event.target.value)} autoComplete="off" placeholder="Paste the complete private link" required /><button className="modern-button" type="submit">Open saved project ↗</button></form></section>
      <section className="workspace-inspiration"><div><p className="eyebrow">A LITTLE SPARK</p><h2>Still finding the feeling?</h2><p>Explore six collections and save the ideas that speak to you.</p><a className="modern-button secondary" href="/events">Explore the collections ↗</a></div><img src="/event-world/09-moonlit-indigo-feast.webp" alt="Indigo and golden light event design concept" width="650" height="430" loading="lazy" /></section>
      {message && <div className="workspace-feedback" role="status">{message}{removedDraft && <button className="modern-text-link" onClick={undoRemoval}>Undo removal</button>}</div>}
    </div>
    <footer className="workspace-footer section-shell"><a href="/">Kingsperl Events</a><p>Where atmosphere takes form.</p><div><a href="/privacy">Privacy</a><a href="/install">Get the app</a></div></footer>
  </main>;
}
