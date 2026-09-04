"use client";

import { useState } from "react";
import { Check, Copy, Send } from "lucide-react";

const INTERAC_EMAIL = "perlaazametim@gmail.com";

export function GiftCenter() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(INTERAC_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="gifts" className="kp9-gifts" aria-labelledby="kp9-gifts-title">
      <div className="kp9-gifts-intro" data-kp9-reveal>
        <p className="kp9-kicker">With grateful hearts · Gifts</p>
        <h2 id="kp9-gifts-title">
          Your presence is
          <br />
          <em>our greatest gift.</em>
        </h2>
        <p>
          If you would like to bless us with a gift, you may send it by Interac
          e-Transfer using the email below.
        </p>
      </div>

      <div className="kp9-interac-card" data-kp9-reveal>
        <div className="kp9-interac-icon" aria-hidden="true">
          <Send />
        </div>
        <div className="kp9-interac-details">
          <span>Interac e-Transfer</span>
          <strong>{INTERAC_EMAIL}</strong>
          <p>Open your banking app and use this email as the recipient.</p>
        </div>
        <button type="button" onClick={copyEmail} aria-live="polite">
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? "Email copied" : "Copy email"}
        </button>
      </div>
    </section>
  );
}
