"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Download,
  Gift,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

type Rsvp = {
  id: number;
  referenceCode: string;
  fullName: string;
  email: string;
  phone: string;
  attendance: "joyfully-attending" | "regretfully-declining";
  householdSize: number;
  guestNames: string;
  accessibilityNeeds: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

type GiftRequest = {
  id: number;
  privateReference: string;
  guestName: string;
  contactDetail: string;
  preferredReplyMethod: "email" | "phone";
  requestType: "reserve-gift" | "contribution-details" | "other";
  giftKey: string;
  giftLabel: string;
  status: string;
  note: string;
  createdAt: string;
  updatedAt: string;
};

function safeCsvCell(value: unknown) {
  let text = String(Array.isArray(value) ? value.join(" | ") : value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv(filename: string, fields: string[], rows: Record<string, unknown>[]) {
  const csv = [
    fields.join(","),
    ...rows.map((row) => fields.map((field) => safeCsvCell(row[field])).join(",")),
  ].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function RsvpManager({ organiserName }: { organiserName?: string }) {
  const [key, setKey] = useState("");
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [gifts, setGifts] = useState<GiftRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const stats = useMemo(() => {
    const attending = rsvps.filter((item) => item.attendance === "joyfully-attending");
    return {
      responses: rsvps.length,
      attendingHouseholds: attending.length,
      guests: attending.reduce((sum, item) => sum + item.householdSize, 0),
      giftRequests: gifts.length,
    };
  }, [rsvps, gifts]);

  const loadDashboard = async (event?: FormEvent) => {
    event?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const headers = { "x-admin-key": key };
      const [rsvpResponse, giftResponse] = await Promise.all([
        fetch("/api/rsvp", { headers, cache: "no-store" }),
        fetch("/api/gifts", { headers, cache: "no-store" }),
      ]);
      const [rsvpResult, giftResult] = await Promise.all([
        rsvpResponse.json() as Promise<{ rsvps?: Rsvp[]; error?: string }>,
        giftResponse.json() as Promise<{ gifts?: GiftRequest[]; error?: string }>,
      ]);
      if (!rsvpResponse.ok || !rsvpResult.rsvps || !giftResponse.ok || !giftResult.gifts) {
        throw new Error("That organiser passcode was not accepted.");
      }
      setRsvps(rsvpResult.rsvps);
      setGifts(giftResult.gifts);
      setUnlocked(true);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "The dashboard could not be loaded.");
      setUnlocked(false);
    } finally {
      setLoading(false);
    }
  };

  const exportRsvps = () => {
    const fields: (keyof Rsvp)[] = [
      "fullName", "email", "attendance", "householdSize", "accessibilityNeeds",
      "referenceCode", "createdAt", "updatedAt",
    ];
    downloadCsv(
      `kingsford-perla-attendance-${new Date().toISOString().slice(0, 10)}.csv`,
      fields,
      rsvps as unknown as Record<string, unknown>[],
    );
  };

  const exportGifts = () => {
    const fields: (keyof GiftRequest)[] = [
      "guestName", "contactDetail", "preferredReplyMethod", "requestType", "giftLabel",
      "status", "note", "privateReference", "createdAt", "updatedAt",
    ];
    downloadCsv(
      `kingsford-perla-gifts-${new Date().toISOString().slice(0, 10)}.csv`,
      fields,
      gifts as unknown as Record<string, unknown>[],
    );
  };

  return (
    <main className="manage-shell manage-shell-v9">
      <header className="manage-header">
        <Link href="/"><ArrowLeft aria-hidden="true" /> Back to the wedding website</Link>
        <span>K · P / PROTECTED ORGANISER</span>
      </header>

      {!unlocked ? (
        <section className="manage-lock" aria-labelledby="manage-title">
          <div className="lock-mark"><LockKeyhole aria-hidden="true" /></div>
          <p className="eyebrow">Private organiser access</p>
          <h1 id="manage-title">The ceremony,<br />kept close.</h1>
          <p>
            {organiserName ? `${organiserName}, your ChatGPT identity is verified. ` : ""}
            Enter the separate organiser passcode to open private attendance and gift details.
          </p>
          <form onSubmit={loadDashboard}>
            <label htmlFor="organiser-key">Organiser passcode</label>
            <input id="organiser-key" type="password" value={key} onChange={(event) => setKey(event.target.value)} autoComplete="current-password" required />
            {error && <p role="alert">{error}</p>}
            <button type="submit" disabled={loading}>{loading ? "Checking…" : "Open protected dashboard"}</button>
          </form>
          <span className="manage-double-lock"><ShieldCheck aria-hidden="true" /> Protected by owner identity and organiser passcode</span>
        </section>
      ) : (
        <section className="manage-dashboard manage-dashboard-v9" aria-labelledby="dashboard-title">
          <div className="manage-title-row">
            <div><p className="eyebrow">Live wedding operations</p><h1 id="dashboard-title">Guest care,<br />in one place.</h1></div>
            <div className="manage-actions"><button type="button" onClick={() => loadDashboard()} disabled={loading}><RefreshCw aria-hidden="true" /> Refresh</button></div>
          </div>

          <div className="stat-grid" aria-label="Wedding response summary">
            <article><span>Attendance notices</span><strong>{stats.responses}</strong></article>
            <article><span>Households joining</span><strong>{stats.attendingHouseholds}</strong></article>
            <article><span>Expected attendees</span><strong>{stats.guests}</strong></article>
            <article><span>Gift requests</span><strong>{stats.giftRequests}</strong></article>
          </div>
          {error && <p className="manage-error" role="alert">{error}</p>}

          <section className="manage-data-section" aria-labelledby="rsvp-table-title">
            <div className="manage-section-heading"><div><Users aria-hidden="true" /><span><small>Optional household notices</small><h2 id="rsvp-table-title">Attendance list</h2></span></div><button type="button" onClick={exportRsvps} disabled={!rsvps.length}><Download aria-hidden="true" /> Export attendance CSV</button></div>
            {rsvps.length ? (
              <div className="response-table-wrap">
                <table className="response-table">
                  <caption>Submitted household attendance notices</caption>
                  <thead><tr><th>Household</th><th>Status</th><th>Attending</th><th>Accessibility</th><th>Updated</th></tr></thead>
                  <tbody>{rsvps.map((rsvp) => (
                    <tr key={rsvp.id}>
                      <td><strong>{rsvp.fullName}</strong>{rsvp.email && <a href={`mailto:${rsvp.email}`}>{rsvp.email}</a>}<small>Ref. {rsvp.referenceCode}</small></td>
                      <td><span className={`status-pill ${rsvp.attendance}`}>{rsvp.attendance === "joyfully-attending" ? "Planning to attend" : "Previous decline"}</span></td>
                      <td><strong>{rsvp.householdSize} {rsvp.householdSize === 1 ? "person" : "people"}</strong></td>
                      <td><span>{rsvp.accessibilityNeeds || "—"}</span></td>
                      <td><time>{new Date(rsvp.updatedAt).toLocaleString()}</time></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ) : <div className="empty-responses"><Users aria-hidden="true" /><h2>No attendance notices yet.</h2><p>Optional household notices will appear here automatically.</p></div>}
          </section>

          <section className="manage-data-section" aria-labelledby="gift-table-title">
            <div className="manage-section-heading"><div><Gift aria-hidden="true" /><span><small>Private giving requests</small><h2 id="gift-table-title">Gift centre</h2></span></div><button type="button" onClick={exportGifts} disabled={!gifts.length}><Download aria-hidden="true" /> Export gift CSV</button></div>
            {gifts.length ? (
              <div className="response-table-wrap">
                <table className="response-table gift-response-table">
                  <caption>Private gift reservations and instruction requests</caption>
                  <thead><tr><th>Guest</th><th>Request</th><th>Gift</th><th>Private note</th><th>Updated</th></tr></thead>
                  <tbody>{gifts.map((gift) => (
                    <tr key={gift.id}>
                      <td><strong>{gift.guestName}</strong><span>{gift.preferredReplyMethod}: {gift.contactDetail}</span><small>Ref. {gift.privateReference}</small></td>
                      <td><span className="status-pill joyfully-attending">{gift.status}</span><small>{gift.requestType.replaceAll("-", " ")}</small></td>
                      <td><strong>{gift.giftLabel}</strong><span>{gift.giftKey}</span></td>
                      <td><span>{gift.note || "—"}</span></td>
                      <td><time>{new Date(gift.updatedAt).toLocaleString()}</time></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ) : <div className="empty-responses"><Gift aria-hidden="true" /><h2>No gift requests yet.</h2><p>Reservations and private instruction requests will appear here.</p></div>}
          </section>
        </section>
      )}
    </main>
  );
}
