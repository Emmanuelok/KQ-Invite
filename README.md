# Kingsperl Events

The event-company website at https://www.kingsperl.com, migrated from the Kingsperl Events Site. It replaces the former wedding website in this repository.

## Development

Requires Node.js 24. Run `npm ci`, `npm run dev`, `npm test`, and `npm run build`.

## Production

Vercel project: `kq-invite` in `emmanueloks-projects`. The production branch is `main`. Vercel uses `npm ci` and `npm run build:vercel`. Both `kingsperl.com` and `www.kingsperl.com` remain attached to that project.

The complete event website includes the home experience, Event World catalogue, Design Studio, secure project resume links, change requests, consultation inquiries, privacy, terms, social images, and search metadata.

## Existing event records

The existing event Site at https://st-johns-event-decor.elkings.chatgpt.site retains its Cloudflare D1 database and private staff operations workspace. Public customer APIs pass through narrowly scoped server routes in this app. Set `KINGSPERL_BACKEND_TOKEN` as a server-only production environment variable in Vercel. The credential is never forwarded to the browser. Visitor cookies and identity headers are not trusted or forwarded.

`/operations` opens the original workspace, which retains ChatGPT sign-in and the Kingsperl Events staff allowlist. Staff listing, inventory availability, and inventory holds cannot be called through the public gateway. This migration does not move or erase stored event records.

Old wedding pages and assets are absent from the current source tree. Prior versions remain available in Git history.

## Brand and app

Kingsperl Events uses an outlined vector wordmark, an architectural K and pearl monogram, and a cinematic Open Graph card. Logos are in `public/brand/`; the social image is `public/og/kingsperl-events.jpg`. The PWA provides home-screen icons, `/install`, app shortcuts, and a public-content offline fallback. The service worker never caches APIs, staff operations, project tokens, or private studio pages.
