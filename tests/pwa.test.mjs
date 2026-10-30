import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";

const source = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");

function worker() {
  const handlers = {};
  const writes = [];
  const offline = new Response("Offline page");
  const cache = { put: async (...args) => writes.push(args), keys: async () => [], delete: async () => true };
  vm.runInNewContext(source, {
    self: { location: { origin: "https://www.kingsperl.com" }, addEventListener: (type, callback) => { handlers[type] = callback; } },
    caches: { open: async () => cache, match: async (key) => key === "/offline" ? offline.clone() : undefined },
    fetch: async () => { throw Error("Offline"); }, URL, Response, Set,
  });
  return { handlers, writes };
}

test("offline worker never intercepts submissions, APIs or authenticated project requests", () => {
  const { handlers } = worker();
  const inputs = [
    new Request("https://www.kingsperl.com/api/projects"),
    new Request("https://www.kingsperl.com/operations"),
    new Request("https://www.kingsperl.com/", { method: "POST", body: "private" }),
    new Request("https://www.kingsperl.com/studio", { headers: { "x-kingsperl-project-token": "private" } }),
    new Request("https://another.example/image.png"),
  ];
  for (const request of inputs) {
    let intercepted = false;
    handlers.fetch({ request, respondWith: () => { intercepted = true; }, waitUntil: () => {} });
    assert.equal(intercepted, false, request.url);
  }
});

test("private studio navigations get a generic offline page without storing project responses", async () => {
  const { handlers, writes } = worker();
  let response;
  handlers.fetch({ request: { method: "GET", url: "https://www.kingsperl.com/studio?project=private", mode: "navigate", headers: new Headers() }, respondWith: (value) => { response = value; }, waitUntil: () => {} });
  assert.equal(await (await response).text(), "Offline page");
  assert.equal(writes.length, 0);
});

test("unknown private file paths are never cached as public images", () => {
  const { handlers } = worker();
  let intercepted = false;
  handlers.fetch({ request: new Request("https://www.kingsperl.com/private/client-floorplan.png"), respondWith: () => { intercepted = true; }, waitUntil: () => {} });
  assert.equal(intercepted, false);
});
