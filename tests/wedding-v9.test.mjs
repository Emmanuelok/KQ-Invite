import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("wedding-v9", `${process.pid}-${Date.now()}-${Math.random()}`);
  return (await import(workerUrl.href)).default;
}

const environment = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const context = { waitUntil() {}, passThroughOnException() {} };

test("renders the confirmed wedding day and production security headers", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    environment,
    context,
  );
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /19 September 2026/);
  assert.match(html, /Ramada by Wyndham St\. John/);
  assert.match(html, /No reception/);
  assert.doesNotMatch(html, /The feast/);
  assert.match(html, /href="\/gallery"/);
  assert.match(html, /Gift centre/);
  assert.match(response.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});

test("renders every uploaded image in the dedicated gallery", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/gallery", { headers: { accept: "text/html" } }),
    environment,
    context,
  );
  const html = await response.text();
  assert.equal(response.status, 200);
  for (const asset of [
    "engagement-perla.webp",
    "engagement-candid.webp",
    "engagement-laughter.webp",
    "engagement-quiet-moment.webp",
    "engagement-joy.webp",
    "engagement-together.webp",
    "engagement-radiance.webp",
    "engagement-couple.webp",
    "engagement-celebration.webp",
  ]) {
    assert.match(html, new RegExp(asset.replace(".", "\\.")));
  }
  assert.match(html, /The Promise/);
  assert.match(html, /Her Radiance/);
  assert.match(html, /Joy in Motion/);
  assert.match(html, /Film strip/);
});

test("art-directs the landing hero for narrow phone screens", async () => {
  const [experience, styles] = await Promise.all([
    readFile(new URL("../components/wedding-experience-v9.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/kp9.css", import.meta.url), "utf8"),
  ]);

  assert.match(experience, /<source media="\(max-width: 780px\)" srcSet="\/engagement-couple\.webp"/);
  assert.match(styles, /\.kp9-hero-picture > img \{ object-position: 50% 26% !important; \}/);
  assert.match(styles, /\.kp9-hero-split \{ display: none; \}/);
});

test("pairs the ceremony venue with verified Ramada imagery", async () => {
  const [experience, content] = await Promise.all([
    readFile(new URL("../components/wedding-experience-v9.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/wedding-content.ts", import.meta.url), "utf8"),
  ]);

  const venueCard = experience.match(/<div className="kp9-venue-card"[\s\S]*?<div className="kp9-venue-copy">/)?.[0] ?? "";
  assert.match(venueCard, /weddingContent\.event\.venueImageUrl/);
  assert.match(venueCard, /Exterior entrance of Ramada by Wyndham St\. John/);
  assert.doesNotMatch(venueCard, /engagement-[^"']+\.webp/);
  assert.match(content, /venueImageUrl: "\/ramada-st-johns-exterior\.jpg"/);
  assert.match(content, /venueImageCredit: "Wyndham Hotels"/);
  assert.match(venueCard, /Photo: \{weddingContent\.event\.venueImageCredit\}/);
});

test("ships a native Git-connected Vercel build path", async () => {
  const [manifest, vercel] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8").then(JSON.parse),
    readFile(new URL("../vercel.json", import.meta.url), "utf8").then(JSON.parse),
  ]);

  assert.equal(manifest.scripts["build:vercel"], "next build --webpack");
  assert.equal(vercel.framework, "nextjs");
  assert.equal(vercel.buildCommand, "npm run build:vercel");
});

test("ships durable RSVP, gift and rate-limit migrations", async () => {
  const migration = await readFile(
    new URL("../drizzle/0001_thick_slipstream.sql", import.meta.url),
    "utf8",
  );
  const reservationIndex = await readFile(
    new URL("../drizzle/0002_romantic_sunfire.sql", import.meta.url),
    "utf8",
  );
  assert.match(migration, /CREATE TABLE `gift_reservations`/);
  assert.match(migration, /CREATE TABLE `submission_rate_limits`/);
  assert.match(migration, /ADD `submission_id`/);
  assert.match(reservationIndex, /gift_reservations_active_keepsake_unique/);
});
