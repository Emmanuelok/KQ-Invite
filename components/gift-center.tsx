"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  Gift,
  HeartHandshake,
  House,
  KeyRound,
  PlaneTakeoff,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { giftCatalog, type GiftCatalogItem } from "@/lib/gifts";

const giftIcons = {
  "first-home": House,
  "honeymoon-memory": PlaneTakeoff,
  "date-night": UtensilsCrossed,
  "wedding-album": Sparkles,
  "dinner-set": Gift,
  blessing: HeartHandshake,
} as const;

type GiftReceipt = {
  privateReference: string;
  giftLabel: string;
  message: string;
};

export function GiftCenter() {
  const [selected, setSelected] = useState<GiftCatalogItem | null>(null);
  const [reserved, setReserved] = useState<string[]>([]);
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<GiftReceipt | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/gifts", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return;
        const data = (await response.json()) as { reservedGiftKeys?: string[] };
        setReserved(data.reservedGiftKeys ?? []);
      })
      .catch(() => undefined);
  }, []);

  const requestType = useMemo(() => {
    if (!selected) return "other";
    return selected.kind === "keepsake" ? "reserve-gift" : "contribution-details";
  }, [selected]);

  const openGift = (gift: GiftCatalogItem) => {
    setSelected(gift);
    setMethod("email");
    setError("");
    setReceipt(null);
    setCopied(false);
  };

  const submitGiftRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/gifts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          guestName: form.get("guestName"),
          contactDetail: form.get("contactDetail"),
          preferredReplyMethod: method,
          requestType,
          giftKey: selected.key,
          note: form.get("note"),
          consentAccepted: form.get("consent") === "on",
        }),
      });
      const result = (await response.json()) as GiftReceipt & { error?: string };
      if (!response.ok || !result.privateReference) {
        throw new Error(result.error ?? "We could not save your request.");
      }
      setReceipt(result);
      if (requestType === "reserve-gift") {
        setReserved((current) => [...new Set([...current, selected.key])]);
      }
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We could not save your request.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyReference = async () => {
    if (!receipt) return;
    try {
      await navigator.clipboard.writeText(receipt.privateReference);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="gifts" className="kp9-gifts" aria-labelledby="kp9-gifts-title">
      <div className="kp9-gifts-intro" data-kp9-reveal>
        <p className="kp9-kicker">With grateful hearts · Gift centre</p>
        <h2 id="kp9-gifts-title">Presence first.<br /><em>Love, in every form.</em></h2>
        <div>
          <p>
            Celebrating with you is already a gift. For anyone who wishes to give,
            choose a keepsake to reserve or privately request verified contribution instructions.
          </p>
          <span><ShieldCheck aria-hidden="true" /> No payment details are published or changed by forwarded message.</span>
        </div>
      </div>

      <div className="kp9-gift-grid">
        {giftCatalog.map((gift, index) => {
          const Icon = giftIcons[gift.key as keyof typeof giftIcons] ?? Gift;
          const unavailable = gift.kind === "keepsake" && reserved.includes(gift.key);
          return (
            <article key={gift.key} className={`kp9-gift-card kp9-gift-card-${index + 1}`} data-kp9-reveal>
              <div className="kp9-gift-card-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden="true" />
              </div>
              <p>{gift.accent}</p>
              <h3>{gift.label}</h3>
              <span>{gift.description}</span>
              <button type="button" onClick={() => openGift(gift)} disabled={unavailable}>
                {unavailable ? "Lovingly reserved" : gift.kind === "keepsake" ? "Reserve this gift" : "Request private details"}
                {!unavailable && <ArrowRight aria-hidden="true" />}
              </button>
            </article>
          );
        })}
      </div>

      <div className="kp9-gift-assurance" data-kp9-reveal>
        <KeyRound aria-hidden="true" />
        <p><strong>Private by design.</strong> Your contact details and message stay in the protected organiser dashboard. You receive a private reference when the request is recorded.</p>
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="kp9-gift-dialog" showCloseButton={false}>
          {selected && (
            <>
              <button className="kp9-gift-close" type="button" onClick={() => setSelected(null)} aria-label="Close gift request">
                <X aria-hidden="true" />
              </button>
              {receipt ? (
                <div className="kp9-gift-success">
                  <span><Check aria-hidden="true" /></span>
                  <p className="kp9-kicker">Safely recorded</p>
                  <DialogTitle>Thank you for your kindness.</DialogTitle>
                  <DialogDescription>{receipt.message}</DialogDescription>
                  <div>
                    <small>Your private reference</small>
                    <strong>{receipt.privateReference}</strong>
                    <button type="button" onClick={copyReference}>
                      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
                      {copied ? "Copied" : "Copy reference"}
                    </button>
                  </div>
                  <button type="button" onClick={() => setSelected(null)}>Done</button>
                </div>
              ) : (
                <div className="kp9-gift-form-shell">
                  <p className="kp9-kicker">{selected.accent}</p>
                  <DialogTitle>{selected.label}</DialogTitle>
                  <DialogDescription>{selected.description}</DialogDescription>
                  <form onSubmit={submitGiftRequest}>
                    <label>
                      <span>Your name</span>
                      <input name="guestName" autoComplete="name" required maxLength={120} />
                    </label>
                    <fieldset>
                      <legend>How should we reply?</legend>
                      <div>
                        <label><input type="radio" name="method" checked={method === "email"} onChange={() => setMethod("email")} /> Email</label>
                        <label><input type="radio" name="method" checked={method === "phone"} onChange={() => setMethod("phone")} /> Phone</label>
                      </div>
                    </fieldset>
                    <label>
                      <span>{method === "email" ? "Email address" : "Phone number"}</span>
                      <input
                        name="contactDetail"
                        type={method === "email" ? "email" : "tel"}
                        autoComplete={method === "email" ? "email" : "tel"}
                        required
                        maxLength={200}
                      />
                    </label>
                    <label>
                      <span>A private note <small>Optional</small></span>
                      <textarea name="note" rows={3} maxLength={600} placeholder="Anything you would like us to know…" />
                    </label>
                    <label className="kp9-gift-consent">
                      <input name="consent" type="checkbox" required />
                      <span>Use these details only to respond to this wedding gift request.</span>
                    </label>
                    {error && <p className="kp9-gift-error" role="alert">{error}</p>}
                    <button type="submit" disabled={submitting}>
                      {submitting ? "Recording privately…" : requestType === "reserve-gift" ? "Reserve privately" : "Request verified instructions"}
                      {!submitting && <ArrowRight aria-hidden="true" />}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
