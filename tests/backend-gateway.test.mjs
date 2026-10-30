import assert from "node:assert/strict";
import test from "node:test";
import { forwardToKingsperl, staffOnly, EVENTS_BACKEND } from "../lib/event-backend.ts";

process.env.KINGSPERL_BACKEND_TOKEN = "test-only-service-credential";

const post = (body, extra = {}) => new Request("https://www.kingsperl.com/api/projects", {
  method: "POST",
  headers: { "content-type": "application/json", origin: "https://www.kingsperl.com", ...extra },
  body: JSON.stringify(body),
});

test("customer submissions preserve upstream validation and never forward visitor identity", async () => {
  let forwarded;
  const response = await forwardToKingsperl(post({ contactName: "Example" }, {
    cookie: "session=untrusted",
    authorization: "Bearer visitor",
    "oai-authenticated-user-email": "owner@example.com",
    "oai-authenticated-user-full-name": "Forged Owner",
  }), "/api/projects", async (url, options) => {
    forwarded = { url, options };
    return Response.json({ error: { code: "INVALID_PROJECT", message: "Missing fields" } }, { status: 400 });
  });
  assert.equal(forwarded.url, `${EVENTS_BACKEND}/api/projects`);
  assert.equal(forwarded.options.headers.get("OAI-Sites-Authorization"), "Bearer test-only-service-credential");
  for (const key of ["cookie", "authorization", "oai-authenticated-user-email", "oai-authenticated-user-full-name"]) {
    assert.equal(forwarded.options.headers.get(key), null);
  }
  assert.equal(response.status, 400);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal((await response.json()).error.code, "INVALID_PROJECT");
});

test("private resume access forwards only the customer's project token", async () => {
  const projectToken = "a".repeat(64);
  const request = new Request("https://www.kingsperl.com/api/projects/TGP-ABC", {
    headers: { "x-kingsperl-project-token": projectToken },
  });
  const response = await forwardToKingsperl(request, "/api/projects/TGP-ABC", async (_, options) => {
    assert.equal(options.headers.get("x-tideglass-project-token"), projectToken);
    return Response.json({ data: { publicId: "TGP-ABC" } });
  });
  assert.deepEqual(await response.json(), { data: { publicId: "TGP-ABC" } });
});

test("cross-site submissions fail before reaching the database", async () => {
  const response = await forwardToKingsperl(post({}, { origin: "https://unrelated.example" }), "/api/projects", () => { throw Error("must not forward"); });
  assert.equal(response.status, 403);
});

test("staff endpoints and arbitrary upstream paths are never exposed", async () => {
  for (const path of ["/api/projects/TGP-ABC/reservation-holds", "/api/inventory/availability", "/operations", "/api/projects/../operations"]) {
    const response = await forwardToKingsperl(post({}), path, () => { throw Error("must not forward"); });
    assert.equal(response.status, 404);
  }
  assert.equal(staffOnly().status, 403);
});

test("oversized and malformed submissions fail locally", async () => {
  const oversized = await forwardToKingsperl(post({ text: "x".repeat(180_001) }), "/api/projects", () => { throw Error("must not forward"); });
  assert.equal(oversized.status, 413);
  const malformed = await forwardToKingsperl(new Request("https://www.kingsperl.com/api/inquiries", {
    method: "POST", headers: { "content-type": "application/json" }, body: "{broken",
  }), "/api/inquiries", () => { throw Error("must not forward"); });
  assert.equal(malformed.status, 400);
});

test("upstream redirects, sign-in pages, and failures never report a successful submission", async () => {
  for (const mock of [
    () => Promise.resolve(new Response("Sign in", { status: 200, headers: { "content-type": "text/html" } })),
    () => Promise.resolve(new Response(null, { status: 302, headers: { location: "/signin" } })),
    () => Promise.reject(new Error("Offline")),
  ]) {
    const response = await forwardToKingsperl(post({}), "/api/inquiries", mock);
    assert.equal(response.status, 502);
    assert.equal(typeof (await response.json()).error, "string");
  }
});

test("successful inquiry responses retain the saved reference and never expose cookies", async () => {
  const response = await forwardToKingsperl(post({ fullName: "Test" }), "/api/inquiries", async () => Response.json(
    { publicId: "TGL-EXAMPLE" },
    { status: 201, headers: { "set-cookie": "private=value", "OAI-Sites-Authorization": "never-return" } },
  ));
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { publicId: "TGL-EXAMPLE" });
  assert.equal(response.headers.get("set-cookie"), null);
  assert.equal(response.headers.get("OAI-Sites-Authorization"), null);
});

test("public saved snapshots retain quotes while excluding private inventory details", async () => {
  const response = await forwardToKingsperl(post({}), "/api/projects", async () => Response.json({
    data: { snapshot: { quote: { total: 1500 }, buildLines: [{
      sku: "TG-EXAMPLE", quantity: 12, rate: 10, total: 120,
      available: 78, quantityOwned: 120, quantityReserved: 42,
      storageZone: "private", replacementCost: 300, availability: "Available",
    }], readiness: [{ id: "inventory", status: "Ready", detail: "Private stock" }] } },
  }));
  const { data } = await response.json();
  assert.equal(data.snapshot.quote.total, 1500);
  assert.deepEqual(data.snapshot.buildLines, [{ sku: "TG-EXAMPLE", quantity: 12, rate: 10, total: 120, availability: "Review required" }]);
  assert.equal(data.snapshot.readiness[0].status, "Review");
});
