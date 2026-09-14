"use client";

import { giftMessage } from "@/lib/wedding-content";

export function GiftCenter() {
  return (
    <section id="gifts" className="kp9-gifts" aria-labelledby="kp9-gifts-title">
      <div className="kp9-gifts-intro" data-kp9-reveal>
        <p className="kp9-kicker">With grateful hearts · Prayers &amp; gifts</p>
        <h2 id="kp9-gifts-title">
          Your prayers and presence is
          <br />
          <em>our greatest gift.</em>
        </h2>
        <p>{giftMessage}</p>
      </div>
    </section>
  );
}
